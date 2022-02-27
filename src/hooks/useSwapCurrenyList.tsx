import { MutableRefObject, useCallback, useMemo } from 'react'
import { Currency, CurrencyAmount, currencyEquals, ETHER, Token } from '@pancakeswap/sdk'
import { SelectableTokenProps } from '@smartworld-libs/uikit'
import { FixedSizeList } from 'react-window'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCombinedActiveList } from '../state/lists/hooks'
import { useCurrencyBalance } from '../state/wallet/hooks'
import { useIsUserAddedToken } from './Tokens'
import { isTokenOnList } from '../utils'
import { wrappedCurrency } from 'utils/wrappedCurrency'
import { useCurrencyLogoSource } from 'components/Logo'

function currencyKey(currency: Currency): string {
  return currency instanceof Token ? currency.address : currency === ETHER ? 'ETHER' : ''
}

function Balance({ balance }: { balance: CurrencyAmount }) {
  return balance?.toSignificant(4)
}

function CurrencyRow(currency: Currency): SelectableTokenProps {
  const { account, chainId } = useActiveWeb3React()

  const selectedTokenList = useCombinedActiveList()
  const isOnSelectedList = isTokenOnList(selectedTokenList, currency)
  const customAdded = useIsUserAddedToken(currency)
  const balance = useCurrencyBalance(account ?? undefined, currency)
  const logoURI = useCurrencyLogoSource({ currency })

  const token = wrappedCurrency(currency, chainId)
  // only show add or remove buttons if not on selected list
  return useMemo(
    () => ({ loading: !balance ? (account ? true : false) : false, balance: Balance({ balance }), logoURI, token }),
    [account, balance, logoURI, token],
  )
}

export default function useSwapCurrencyList(currencies, showETH = true, breakIndex = undefined) {
  const itemData: (Currency | undefined)[] = useMemo(() => {
    let formatted: (Currency | undefined)[] = showETH ? [Currency.ETHER, ...currencies] : currencies
    if (breakIndex !== undefined) {
      formatted = [...formatted.slice(0, breakIndex), undefined, ...formatted.slice(breakIndex, formatted.length)]
    }
    return formatted
  }, [breakIndex, currencies, showETH])

  return itemData.map((token) => CurrencyRow(token))
}
