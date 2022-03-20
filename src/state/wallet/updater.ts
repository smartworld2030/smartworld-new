import { useEffect, useMemo, useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { updateWalletStates } from './actions'
import { MultiCallSingleData, multiCallRequest } from 'state/multicall/hooks'
import useDebounce from 'hooks/useDebounce'
import { getMulticallContract } from 'utils/contractHelpers'
import useBlockNumber from 'state/application/hooks'
import useIsWindowVisible from 'hooks/useIsWindowVisible'
import { TokenAmount } from '@pancakeswap/sdk'
import { useWeb3React } from '@web3-react/core'
import ERC20_INTERFACE from 'config/abi/erc20'
import { useProjectTokensList } from 'hooks/Tokens'

export default function Updater(): null {
  const cancelation = useRef(false)
  const { account, chainId } = useWeb3React()
  const dispatch = useDispatch()
  const [data, setData] = useState({})
  const latestBlockNumber = useBlockNumber()
  const multiContract = getMulticallContract()
  const windowVisible = useIsWindowVisible()
  const tokens = useProjectTokensList()

  const multicall: MultiCallSingleData[] = useMemo(
    () =>
      tokens.reduce(
        (items, { address, symbol, decimals }) => [
          ...items,
          symbol === 'BNB'
            ? {
                ifs: multiContract.interface,
                symbol: 'BNB',
                address: multiContract.address,
                methods: ['getEthBalance'],
                args: [[account]],
                decimals: 18,
              }
            : {
                ifs: ERC20_INTERFACE,
                methods: ['balanceOf'],
                args: [[account]],
                symbol,
                address,
                decimals,
              },
        ],
        [],
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tokens, account],
  )

  const blockNumber = useDebounce(latestBlockNumber, 1000)
  const visible = useDebounce(windowVisible, 1000)

  useEffect(() => {
    cancelation.current = false
    if (account)
      multiCallRequest(multiContract, multicall, false)
        .then((result) => {
          if (!cancelation.current) setData(result)
        })
        .catch((e) => {
          console.log(e)
          if (!cancelation.current) setData({})
        })
    return () => {
      cancelation.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, blockNumber, account, multicall])

  const compiledStates = useMemo(
    () =>
      multicall.reduce(
        (memo, { symbol }) => {
          if (!Object.keys(data).length) return undefined
          const token = tokens.find((t) => t.symbol === symbol)
          const amount = data?.[symbol]?.[0]
          if (token && amount) {
            const value = new TokenAmount(token, amount)
            if (value) memo[symbol] = value
          }
          return memo
        },
        { STTS: undefined, BNB: undefined, BTC: undefined, LPTOKEN: undefined },
      ),
    [multicall, data, tokens],
  )

  const balances = useDebounce(compiledStates, 500)
  useEffect(() => {
    if (!chainId || !balances || cancelation.current) return
    dispatch(
      updateWalletStates({
        chainId,
        states: { loading: false, balances: balances },
      }),
    )
  }, [balances, chainId, dispatch])

  return null
}
