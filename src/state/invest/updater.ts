import { useEffect, useMemo, useState, useRef } from 'react'
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

export default function Updater(): number {
  const cancelation = useRef(false)
  const dispatch = useDispatch()
  const [data, setData] = useState({})
  const { chainId, account } = useActiveWeb3React()
  const investContract = useInvestContract()
  const multiContract = getMulticallContract()
  const latestBlockNumber = useBlockNumber()
  const windowVisible = useIsWindowVisible()

  const calls = useMemo(async () => {
    const userDepositNumber = account ? Number(await investContract.userDepositNumber(account)) : 0
    return userDepositNumber
      ? [
          {
            ifs: investContract.interface,
            address: investContract.address,
            methods: ['maxPercent', 'users', 'calculateInterest', 'users', 'userDepositNumber', 'userDepositDetails'],
            args: [[], [account], [account], [account], [account], [account, 0]],
          },
        ]
      : [
          {
            ifs: investContract.interface,
            address: investContract.address,
            methods: ['maxPercent'],
            args: [[]],
          },
        ]
  }, [investContract, account])

  useEffect(() => {
    if (!latestBlockNumber || !windowVisible) return
    cancelation.current = false
    async function multiCallRequest() {
      const results = await calls.then(async (multicalls) => await multiCallMultipleData(multiContract, multicalls))
      const length = Number(results?.userDepositNumber)
      const interest =
        Number(results?.calculateInterest?.hourly?.toString()) +
        Number(results?.calculateInterest?.referral?.toString())
      if (length > 0) {
        const multicalls: MultiCallMultipleData = {
          ifs: investContract.interface,
          address: investContract.address,
          methods: ['USDToStts', 'userDepositDetails'],
          args: [[interest], [account, 0]],
        }
        for (let i = 1; i < length; i++) {
          multicalls.args.push([account, i])
          multicalls.methods.push('userDepositDetails')
        }
        singleContractMultiCallRequest(multiContract, multicalls, false).then((res) => {
          const [stts, ...rest] = res
          results.calculateInterest = { ...results.calculateInterest, ...{ stts } }
          if (!cancelation.current) setData({ ...results, userDepositDetails: rest })
        })
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
  }, [
    calls,
    windowVisible,
    latestBlockNumber,
    multiContract,
    investContract.interface,
    investContract.address,
    account,
  ])

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
    if (!chainId && cancelation.current) return
    dispatch(
      updateInvestStates({
        chainId,
        states,
      }),
    )
  }, [states, chainId, dispatch])

  return null
}
