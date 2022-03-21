import { RefObject, useCallback, useMemo, useRef, useState } from 'react'
import { Currency, CurrencyAmount, Pair, Token } from '@pancakeswap/sdk'
import { Input, SwapUnitList } from '@smartworld-libs/uikit'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import { useCurrencyLogoSource } from '../Logo'
import useBUSDPrice from 'hooks/useBUSDPrice'
import useDebounce from 'hooks/useDebounce'
import useSwapCurrencyList from 'hooks/useSwapCurrenyList'
import { isAddress } from 'utils'

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
  hideInput = false,
  otherCurrency,
  id,
  size,
  label,
  maxTokenCanBuy,
}: CurrencyInputPanelProps) {
  const { t } = useTranslation()
  const [showList, setShowList] = useState(false)

  const srcs = useCurrencyLogoSource({ currency })
  const { account } = useActiveWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)

  const [searchQuery, setSearchQuery] = useState<string>('')
  const debouncedQuery = useDebounce(searchQuery, 200)

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      onCurrencySelect(currency)
    },
    [onCurrencySelect],
  )

  const tokenList = useSwapCurrencyList(debouncedQuery, otherCurrency)

  const tokenPrice = useBUSDPrice(currency)?.toSignificant(3)

  const balanceValues = useCallback(
    (val: string) => {
      const inputAsFloat = parseFloat(val)
      return Number.isNaN(inputAsFloat) ? 0 : inputAsFloat * +tokenPrice
    },
    [tokenPrice],
  )

  const currencyValues = useMemo(
    () =>
      +value && !Number.isNaN(value)
        ? '~' +
          balanceValues(value).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        : '0.00',
    [balanceValues, value],
  )
  // manage focus on modal show
  const inputRef = useRef<HTMLInputElement>()

  const handleInput = useCallback((event) => {
    const input = event.target.value
    const checksummedInput = isAddress(input)
    setSearchQuery(checksummedInput || input)
  }, [])

  const balance = useMemo(
    () =>
      showMaxButton && label === 'OUTPUT'
        ? maxTokenCanBuy?.toSignificant(6)
        : selectedCurrencyBalance?.toSignificant(6),
    [label, maxTokenCanBuy, selectedCurrencyBalance, showMaxButton],
  )
  const listHandler = (open: boolean | ((prevState: boolean) => boolean)) => {
    if (open)
      setTimeout(() => {
        inputRef.current.focus()
      }, 100)
    setShowList(open)
  }

  return (
    <SwapUnitList
      id={id}
      showList={showList}
      image={srcs}
      token={currency}
      loading={label === 'INPUT' && !selectedCurrencyBalance ? (account ? true : false) : false}
      value={value}
      currencyValue={currencyValues}
      currencyUnit="USD"
      balance={balance}
      margin="auto"
      onUserInput={onUserInput}
      size={size > 160 ? (size > 240 ? 240 : size) : 160}
      disabled={disableCurrencySelect || hideInput}
      placeholder={selectedCurrencyBalance?.toSignificant(6)}
      onUnitSelect={(unit) => console.log(unit)}
      onTokenSelect={({ token }) => handleCurrencySelect(token as Token)}
      tokenList={tokenList}
      setShowList={listHandler}
      topElement={
        <Input
          style={{ width: '95%', margin: 'auto', marginTop: '10px' }}
          id="token-search-input"
          placeholder={t('Search name or paste address')}
          scale="md"
          autoComplete="off"
          value={searchQuery}
          ref={inputRef as RefObject<HTMLInputElement>}
          onChange={handleInput}
        />
      }
    />
  )
}
