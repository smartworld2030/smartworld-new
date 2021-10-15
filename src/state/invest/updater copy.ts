import { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { updateInvestStates } from './actions'
import { useInvestContract } from 'hooks/useContract'
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

export default function Updater() {
  const dispatch = useDispatch()
  const [data, setData] = useState({})
  const { chainId, account } = useActiveWeb3React()
  const investContract = useInvestContract()
  const multiContract = getMulticallContract()
  const latestBlockNumber = useBlockNumber()
  const windowVisible = useIsWindowVisible()

  const calls = useMemo(
    () => [
      account
        ? {
            ifs: investContract.interface,
            address: investContract.address,
            methods: [
              'maxPercent',
              'userBalances',
              'users',
              'calculateInterest',
              'userDepositNumber',
              'userDepositDetails',
            ],
            args: [[], [account], [account], [account], [account], [account, 0]],
          }
        : {
            ifs: investContract.interface,
            address: investContract.address,
            methods: ['maxPercent'],
            args: [[]],
          },
    ],
    [investContract, account],
  )

  useEffect(() => {
    if (!latestBlockNumber || !windowVisible) return
    cancelation = false
    async function multiCallRequest() {
      const results = await multiCallMultipleData(multiContract, calls, { requireSuccess: false })
      const length = Number(results?.userDepositNumber?.toString())
      if (length > 1) {
        const multicalls: MultiCallMultipleData = {
          ifs: investContract.interface,
          address: investContract.address,
          methods: ['userDepositDetails'],
          args: [[account, 0]],
        }
        for (let i = 1; i < length; i++) {
          multicalls.args.push([account, i])
          multicalls.methods.push('userDepositDetails')
        }
        singleContractMultiCallRequest(multiContract, multicalls, false).then((res) => {
          if (!cancelation) setData({ ...results, userDepositDetails: res })
        })
      } else {
        if (!cancelation) setData(results)
      }
    }
    if (calls && !cancelation) {
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
    if (!chainId) return
    dispatch(
      updateInvestStates({
        chainId,
        states,
      }),
    )
  }, [states, chainId, dispatch])

  return null
}
