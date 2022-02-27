import { Currency, CurrencyAmount, Pair } from '@pancakeswap/sdk'
import { Text, useModal, Flex, BalanceInput } from '@smartworld-libs/uikit'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import { CurrencyLogo, useCurrencyLogoSource, DoubleCurrencyLogo } from '../Logo'
import useBUSDPrice from 'hooks/useBUSDPrice'
import { useState } from 'react'

const BAD_SRCS: { [tokenAddress: string]: true } = {}

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
  const [onPresentCurrencyModal] = useModal(
    <CurrencySearchModal
      onCurrencySelect={onCurrencySelect}
      selectedCurrency={currency}
      otherSelectedCurrency={otherCurrency}
      showCommonBases={showCommonBases}
    />,
  )

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
    <BalanceInput
      value={value}
      currencyValue={currencyValues}
      currencyUnit="USD"
      id={id}
      maxValue={
        showMaxButton && label === 'OUTPUT'
          ? maxTokenCanBuy?.toSignificant(6)
          : selectedCurrencyBalance?.toSignificant(6)
      }
      onUserInput={onUserInput}
      size={size > 200 ? 200 : size}
      margin={'auto'}
      disabled={hideInput}
      image={srcs}
      logo={currency ? <CurrencyLogo currency={currency} size="12px" /> : <CurrencyLogo size="12px" />}
      onLogoClick={() => {
        if (!disableCurrencySelect) {
          onPresentCurrencyModal()
        }
      }}
      onUnitClick={() => {
        if (!disableCurrencySelect) {
          onPresentCurrencyModal()
        }
      }}
      unit={
        <Flex alignItems="center" justifyContent="space-between">
          {pair ? (
            <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={16} margin />
          ) : pair ? (
            <Text id="pair">
              {pair?.token0.symbol}:{pair?.token1.symbol}
            </Text>
          ) : (
            <Text id="pair" fontSize={size > 200 ? 15 : size / 12}>
              {(currency && currency.symbol && currency.symbol.length > 20
                ? `${currency.symbol.slice(0, 4)}...${currency.symbol.slice(
                    currency.symbol.length - 5,
                    currency.symbol.length,
                  )}`
                : currency?.symbol) || t('Select')}
            </Text>
          )}
          {!disableCurrencySelect && (
            <Text color="text" width="15px">
              ▾
            </Text>
          )}
        </Flex>
      }
      placeholder={selectedCurrencyBalance?.toSignificant(6)}
    />
  )
}
