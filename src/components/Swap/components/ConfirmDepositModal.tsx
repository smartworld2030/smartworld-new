import React, { useCallback, useMemo } from 'react'
import { CurrencyAmount, currencyEquals } from '@pancakeswap/sdk'
import { InjectedModalProps } from '@smartworld-libs/uikit'
import { useTranslation } from 'contexts/Localization'
import TransactionConfirmationModal, {
  ConfirmationModalContent,
  TransactionErrorContent,
} from 'components/TransactionConfirmationModal'
import { BigNumber } from 'ethers'
import DepositModalHeader from './DepositModalHeader'
import DepositModalFooter from './DepositModalFooter'
import { PoolUser } from 'state/pool/reducer'
import { InvestUser } from 'state/invest/reducer'

export interface Deposit {
  user: PoolUser | InvestUser
  newUser: boolean
  price: string
  method: string
  tokenA: CurrencyAmount
  tokenB?: CurrencyAmount
  referrer?: string
  refPercent?: string | number
  dollar?: string
  slippage?: number
  deadline?: BigNumber
  reward?: {
    period: string
    symbol: string
    total?: string
    value: string
    end?: string
  }
  error?: string
}

/**
 * Returns true if the deposit requires a confirmation of details before we can submit it
 * @param tradeA deposit A
 * @param tradeB deposit B
 */
function tradeMeaningfullyDiffers(tradeA: Deposit, tradeB: Deposit): boolean {
  return (
    tradeA.method !== tradeB.method ||
    !currencyEquals(tradeA.tokenA.currency, tradeB.tokenA.currency) ||
    !tradeA.tokenA.equalTo(tradeB.tokenA) ||
    !currencyEquals(tradeA.tokenB.currency, tradeB.tokenB.currency) ||
    !tradeA.tokenB.equalTo(tradeB.tokenB)
  )
}
interface ConfirmDepositModalProps {
  deposit: Deposit
  originalDeposit?: Deposit
  attemptingTxn?: boolean
  txHash?: string
  recipient?: string | null
  allowedSlippage?: number
  onAcceptChanges?: () => void
  onConfirm?: () => void
  swapErrorMessage?: string
  customOnDismiss?: () => void
}

const ConfirmDepositModal: React.FC<InjectedModalProps & ConfirmDepositModalProps> = ({
  deposit,
  originalDeposit,
  onAcceptChanges,
  onConfirm,
  onDismiss,
  customOnDismiss,
  recipient,
  swapErrorMessage,
  attemptingTxn,
  txHash,
}) => {
  const showAcceptChanges = useMemo(
    () => Boolean(deposit && originalDeposit && tradeMeaningfullyDiffers(deposit, originalDeposit)),
    [originalDeposit, deposit],
  )

  const { t } = useTranslation()

  const modalHeader = useCallback(() => {
    return deposit ? (
      <DepositModalHeader
        deposit={deposit}
        recipient={recipient}
        showAcceptChanges={showAcceptChanges}
        onAcceptChanges={onAcceptChanges}
      />
    ) : null
  }, [onAcceptChanges, recipient, showAcceptChanges, deposit])

  const modalBottom = useCallback(() => {
    return deposit ? (
      <DepositModalFooter
        onConfirm={onConfirm}
        deposit={deposit}
        disabledConfirm={showAcceptChanges}
        swapErrorMessage={swapErrorMessage}
      />
    ) : null
  }, [onConfirm, showAcceptChanges, swapErrorMessage, deposit])

  // text to show while loading
  const pendingText = t('Deposit %amountA% %symbolA% and %amountB% %symbolB%', {
    amountA: deposit?.tokenA?.toSignificant(6) ?? '',
    symbolA: deposit?.tokenA?.currency?.symbol ?? '',
    amountB: deposit?.tokenB?.toSignificant(6) ?? '',
    symbolB: deposit?.tokenB?.currency?.symbol ?? '',
  })

  const confirmationContent = useCallback(
    () =>
      swapErrorMessage ? (
        <TransactionErrorContent onDismiss={onDismiss} message={swapErrorMessage} />
      ) : (
        <ConfirmationModalContent topContent={modalHeader} bottomContent={modalBottom} />
      ),
    [onDismiss, modalBottom, modalHeader, swapErrorMessage],
  )

  return (
    <TransactionConfirmationModal
      title={t('Confirm Deposit')}
      onDismiss={onDismiss}
      customOnDismiss={customOnDismiss}
      attemptingTxn={attemptingTxn}
      hash={txHash}
      content={confirmationContent}
      pendingText={pendingText}
      currencyToAdd={deposit?.tokenA.currency}
    />
  )
}

export default ConfirmDepositModal
