import { Currency, Pair } from '@pancakeswap/sdk'
import { ChevronDownIcon, Text, useModal, Flex, BalanceInput } from '@smartworld-libs/uikit'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import { CurrencyLogo, DoubleCurrencyLogo } from '../Logo'

interface CurrencyInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  onMax?: () => void
  showMaxButton?: boolean
  label?: string
  onCurrencySelect: (currency: Currency) => void
  currency?: Currency | null
  disableCurrencySelect?: boolean
  disabledKnob?: boolean
  hideBalance?: boolean
  pair?: Pair | null
  hideInput?: boolean
  otherCurrency?: Currency | null
  id: string
  showCommonBases?: boolean
}
export default function CurrencyInputPanel({
  value,
  onUserInput,
  showMaxButton = false,
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  disabledKnob = false,
  pair = null, // used for double token logo
  hideInput = false,
  otherCurrency,
  id,
  showCommonBases,
}: CurrencyInputPanelProps) {
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

  return (
    <BalanceInput
      id={id}
      maxValue={showMaxButton && selectedCurrencyBalance?.toSignificant(6)}
      value={value}
      onUserInput={(val) => {
        onUserInput(val)
      }}
      size={disabledKnob ? 120 : 130}
      margin={'auto'}
      disabledKnob={disabledKnob}
      disabled={hideInput}
      borderSize={3}
      progressSize={3}
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
            <Text id="pair">
              {(currency && currency.symbol && currency.symbol.length > 20
                ? `${currency.symbol.slice(0, 4)}...${currency.symbol.slice(
                    currency.symbol.length - 5,
                    currency.symbol.length,
                  )}`
                : currency?.symbol) || t('Select')}
            </Text>
          )}
          {!disableCurrencySelect && <ChevronDownIcon color="textSubtle" width="12px" />}
        </Flex>
      }
      placeholder={selectedCurrencyBalance?.toSignificant(6)}
    />
  )
}
