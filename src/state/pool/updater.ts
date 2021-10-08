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

export default function Updater() {
  const dispatch = useDispatch()
  const [data, setData] = useState({})
  const { chainId, account } = useActiveWeb3React()
  const poolContract = usePoolContract()
  const multiContract = getMulticallContract()
  const latestBlockNumber = useBlockNumber()
  const windowVisible = useIsWindowVisible()

  const calls = useMemo(
    () => [
      account
        ? {
            ifs: poolContract.interface,
            address: poolContract.address,
            methods: [
              'freezePrice',
              'userFreezeInfo',
              'users',
              'calculateInterest',
              'calculateDaily',
              'userDepositNumber',
            ],
            args: [
              [],
              [account, 0],
              [account],
              [account],
              [account, Math.floor(Date.now() / 1000)],
              [account],
              [account, 0],
            ],
          }
        : {
            ifs: poolContract.interface,
            address: poolContract.address,
            methods: ['freezePrice'],
            args: [[]],
          },
    ],
    [poolContract, account],
  )

  useEffect(() => {
    if (!latestBlockNumber || !windowVisible) return
    cancelation = false
    async function multiCallRequest() {
      multiCallMultipleData(multiContract, calls).then((res) => {
        if (!cancelation) setData(res)
      })
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
      updatePoolStates({
        chainId,
        states,
      }),
    )
  }, [states, chainId, dispatch])

  return null
}
