import { useEffect, useMemo, useState, useRef } from 'react'
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

export default function Updater(): null {
  const cancelation = useRef(false)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  const blockNumber = useDebounce(latestBlockNumber, 1000)
  const visible = useDebounce(windowVisible, 1000)

  useEffect(
    () => {
      if (!blockNumber || !visible) return
      cancelation.current = false
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
              if (!cancelation.current) setData({ ...results, userDepositDetails: res })
            })
            .catch()
        } else {
          if (!cancelation.current) setData(results)
        }
      }
      if (calls) {
        multiCallRequest()
      }
      return () => {
        cancelation.current = true
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [visible, blockNumber, account, calls],
  )
  const states = useMemo(() => {
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
      { loading: false },
    )
  }, [data])

  useEffect(() => {
    if (!chainId && cancelation.current) return
    dispatch(
      updatePoolStates({
        chainId,
        states,
      }),
    )
  }, [states, chainId, dispatch])

  return null
}
