import { Currency, CurrencyAmount, Pair, Token } from '@pancakeswap/sdk'
import { Text, useModal, Flex, SwapUnitList, SelectableToken } from '@smartworld-libs/uikit'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useAllTokenBalances, useCurrencyBalance, useTokenBalances } from '../../state/wallet/hooks'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import { CurrencyLogo, useCurrencyLogoSource, DoubleCurrencyLogo } from '../Logo'
import useBUSDPrice from 'hooks/useBUSDPrice'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useAllTokens, useIsUserAddedToken, useToken } from 'hooks/Tokens'
import useDebounce from 'hooks/useDebounce'
import useTokenComparator from 'components/SearchModal/sorting'
import { FixedSizeList } from 'react-window'
import { filterTokens, useSortedTokensByQuery } from 'components/SearchModal/filtering'
import { getTokenLogoPath } from 'utils/getTokenLogoURL'
import useSwapCurrencyList from 'hooks/useSwapCurrenyList'

interface CurrencyInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  onMax?: () => void
  showMaxButton?: boolean
  label?: string
  maxTokenCanBuy?: CurrencyAmount
  onCurrencySelect: (currency: Currency) => void
  currency?: Currency | null
  disableCurrencySelect?: boolean
  hideBalance?: boolean
  pair?: Pair | null
  hideInput?: boolean
  otherCurrency?: Currency | null
  id: string
  size: number
  showCommonBases?: boolean
}
export default function CurrencyInputPanel({
  value,
  onUserInput,
  showMaxButton = true,
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  pair = null, // used for double token logo
  hideInput = false,
  otherCurrency,
  id,
  size,
  label,
  maxTokenCanBuy,
  showCommonBases,
}: CurrencyInputPanelProps) {
  const srcs = useCurrencyLogoSource({ currency })
  const { account } = useActiveWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)

  const { t } = useTranslation()

  const { chainId } = useActiveWeb3React()

  // refs for fixed size lists
  const fixedList = useRef<FixedSizeList>()

  const [searchQuery, setSearchQuery] = useState<string>('')
  const debouncedQuery = useDebounce(searchQuery, 200)

  const [invertSearchOrder] = useState<boolean>(false)

  const allTokens = useAllTokens()

  // if they input an address, use it
  const searchToken = useToken(debouncedQuery)
  const searchTokenIsAdded = useIsUserAddedToken(searchToken)

  const showETH: boolean = useMemo(() => {
    const s = debouncedQuery.toLowerCase().trim()
    return s === '' || s === 'b' || s === 'bn' || s === 'bnb'
  }, [debouncedQuery])

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      onCurrencySelect(currency)
    },
    [onCurrencySelect],
  )

  const tokenComparator = useTokenComparator(invertSearchOrder)

  const filteredTokens: Token[] = useMemo(() => {
    return filterTokens(Object.values(allTokens), debouncedQuery)
  }, [allTokens, debouncedQuery])

  const sortedTokens: Token[] = useMemo(() => {
    return filteredTokens.sort(tokenComparator)
  }, [filteredTokens, tokenComparator])

  const filteredSortedTokens = useSortedTokensByQuery(sortedTokens, debouncedQuery)

  const tokenList = useSwapCurrencyList(filteredSortedTokens)
  // const balances = useTokenBalances(account ?? undefined, filteredSortedTokens ?? undefined)
  const tokenPrice = useBUSDPrice(currency)?.toSignificant(3)

  const balanceValues = (val: string) => {
    const inputAsFloat = parseFloat(val)
    return Number.isNaN(inputAsFloat) ? 0 : inputAsFloat * +tokenPrice
  }

  const currencyValues =
    +value && !Number.isNaN(value)
      ? '~' +
        balanceValues(value).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : '0.00'

  return (
    <SwapUnitList
      token={currency}
      loading={!selectedCurrencyBalance ? (account ? true : false) : false}
      value={value}
      currencyValue={currencyValues}
      currencyUnit="USD"
      balance={
        showMaxButton && label === 'OUTPUT'
          ? maxTokenCanBuy?.toSignificant(6)
          : selectedCurrencyBalance?.toSignificant(6)
      }
      onUserInput={onUserInput}
      size={size > 200 ? 200 : size}
      margin={'auto'}
      disabled={hideInput}
      image={srcs}
      placeholder={selectedCurrencyBalance?.toSignificant(6)}
      selectUnitHandler={(unit) => console.log(unit)}
      // @ts-ignore
      selectTokenHandler={({ token }) => onCurrencySelect(token)}
      tokenList={tokenList}
      // tokenList={filteredSortedTokens}
      // logo={currency ? <CurrencyLogo currency={currency} size="12px" /> : <CurrencyLogo size="12px" />}
      // onLogoClick={() => {
      //   if (!disableCurrencySelect) {
      //   }
      // }}
      // onUnitClick={() => {
      //   if (!disableCurrencySelect) {
      //   }
      // }}
    />
  )
}
