import { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { updatePoolStates } from './actions'
import { usePoolContract } from 'hooks/useContract'
import {
  MultiCallMultipleData,
  singleContractMultiCallRequest,
  multiCallMultipleData,
  resConverter,
} from 'state/multicall/hooks'
import useDebounce from 'hooks/useDebounce'
import { getMulticallContract } from 'utils/contractHelpers'
import useBlockNumber from 'state/application/hooks'
import useIsWindowVisible from 'hooks/useIsWindowVisible'

let cancelation = false

export default function Updater(): null {
  const dispatch = useDispatch()
  const [data, setData] = useState({})
  const { chainId, account } = useActiveWeb3React()
  const poolContract = usePoolContract()
  const multiContract = getMulticallContract()
  const latestBlockNumber = useBlockNumber()
  const windowVisible = useIsWindowVisible()

  const calls = useMemo(async () => {
    const userDepositNumber = account ? Number(await poolContract.userDepositNumber(account)) : 0
    return userDepositNumber
      ? [
          {
            ifs: poolContract.interface,
            address: poolContract.address,
            methods: [
              'users',
              'userDepositNumber',
              'calculateLiquidityValue',
              'calculateInterest',
              'userDepositDetails',
            ],
            args: [[account], [account], [(10 ** 18).toString()], [account], [account, 0]],
          },
        ]
      : [
          {
            ifs: poolContract.interface,
            address: poolContract.address,
            methods: ['calculateLiquidityValue'],
            args: [[(10 ** 18).toString()]],
          },
        ]
  }, [poolContract, account])

  useEffect(() => {
    if (!latestBlockNumber || !windowVisible) return
    cancelation = false
    async function multiCallRequest() {
      const results = await calls.then(async (multicalls) => await multiCallMultipleData(multiContract, multicalls))
      const length = Number(results?.userDepositNumber)
      if (length > 0) {
        const multicalls: MultiCallMultipleData = {
          ifs: poolContract.interface,
          address: poolContract.address,
          methods: ['userDepositDetails'],
          args: [[account, 0]],
        }
        for (let i = 1; i < length; i++) {
          multicalls.args.push([account, i])
          multicalls.methods.push('userDepositDetails')
        }
        singleContractMultiCallRequest(multiContract, multicalls, false)
          .then((res) => {
            if (!cancelation) setData({ ...results, userDepositDetails: res })
          })
          .catch()
      } else {
        if (!cancelation) setData(results)
      }
    }
    if (calls) {
      multiCallRequest()
    }
    return () => {
      cancelation = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calls, windowVisible, latestBlockNumber])

  const compiledStates = useMemo(() => {
    if (!Object.keys(data).length) return undefined
    return Object.keys(data).reduce(
      (items, method) =>
        data[method] && {
          ...items,
          [method]:
            method === 'userDepositDetails'
              ? data[method].map((d: { [key: string]: string }) => resConverter(d))
              : resConverter(data[method]),
        },
      {},
    )
  }, [data])

  const states = useDebounce(compiledStates, 500)

  useEffect(() => {
    if (!chainId && cancelation) return
    dispatch(
      updatePoolStates({
        chainId,
        states,
      }),
    )
  }, [states, chainId, dispatch])

  return null
}
