import { useMemo, useState } from 'react'
import { Currency, Token } from '@pancakeswap/sdk'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useBNBBalances, useTokenBalancesWithLoadingIndicator } from '../state/wallet/hooks'
import { useAllTokens, useFoundOnInactiveList, useIsUserAddedToken, useToken } from './Tokens'
import { wrappedCurrency } from 'utils/wrappedCurrency'
import { filterTokens, useSortedTokensByQuery } from 'components/SearchModal/filtering'
import useTokenComparator from 'components/SearchModal/sorting'
import useCurrenciesLogoSources from 'components/Logo/CurrenciesLogoSources'
import { useAddUserToken } from 'state/user/hooks'

export default function useSwapCurrencyList(debouncedQuery: string, otherCurrency: Currency): Token[] {
  const allTokens = useAllTokens()
  const { account, chainId } = useActiveWeb3React()

  // if they input an address, use it
  const searchToken = useToken(debouncedQuery)
  const searchTokenIsAdded = useIsUserAddedToken(searchToken)

  const showETH: boolean = useMemo(() => {
    const s = debouncedQuery.toLowerCase().trim()
    return otherCurrency?.symbol !== 'BNB' && (s === '' || s === 'b' || s === 'bn' || s === 'bnb')
  }, [debouncedQuery, otherCurrency])

  const [invertSearchOrder] = useState<boolean>(false)

  const tokenComparator = useTokenComparator(invertSearchOrder)

  const filteredTokens: Token[] = useMemo(() => {
    return filterTokens(Object.values(allTokens), debouncedQuery)
  }, [allTokens, debouncedQuery])

  const sortedTokens: Token[] = useMemo(() => {
    return filteredTokens.sort(tokenComparator)
  }, [filteredTokens, tokenComparator])

  const filteredSortedTokens = useSortedTokensByQuery(sortedTokens, debouncedQuery)

  // if no results on main list, show option to expand into inactive
  const inactiveTokens = useFoundOnInactiveList(debouncedQuery)
  // const filteredInactiveTokens: Token[] = useSortedTokensByQuery(inactiveTokens, debouncedQuery)

  const breakIndex = inactiveTokens && filteredSortedTokens ? filteredSortedTokens.length : undefined

  const [balances, loading] = useTokenBalancesWithLoadingIndicator(account, filteredSortedTokens)
  const bnbBalance = useBNBBalances()

  const logoSources = useCurrenciesLogoSources(filteredSortedTokens, showETH)

  const itemData: (Currency | undefined)[] = useMemo(() => {
    let formatted: (Currency | undefined)[] = showETH ? [Currency.ETHER, ...filteredSortedTokens] : filteredSortedTokens
    if (breakIndex !== undefined) {
      formatted = [...formatted.slice(0, breakIndex), undefined, ...formatted.slice(breakIndex, formatted.length)]
    }

    return formatted
  }, [breakIndex, filteredSortedTokens, showETH])

  const addToken = useAddUserToken()

  return useMemo(
    () =>
      searchToken && !searchTokenIsAdded
        ? [{ ...searchToken, text: 'Import', onTextClick: () => addToken(searchToken) }]
        : itemData.reduce((all, currency) => {
            if (currency) {
              if (currency.symbol === 'BNB') {
                return [
                  ...all,
                  {
                    loading,
                    balance: bnbBalance[account]?.toSignificant(4),
                    logoURI: logoSources.BNB,
                    token: currency,
                  },
                ]
              }
              const token = wrappedCurrency(currency, chainId)
              const balance = balances[token.address]?.toSignificant(4)
              const logoURI = logoSources[token.address]
              return [
                ...all,
                {
                  loading,
                  balance,
                  logoURI,
                  token,
                },
              ]
            }
            return all
          }, []),
    [searchToken, searchTokenIsAdded, itemData, addToken, chainId, balances, logoSources, loading, bnbBalance, account],
  )
}
