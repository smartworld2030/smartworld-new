import { Button, Text, ErrorIcon, EqualIcon, AddIcon } from '@smartworld-libs/uikit'
import { AutoColumn } from 'components/Layout/Column'
import { CurrencyLogo } from 'components/Logo'
import { RowBetween, RowFixed } from 'components/Layout/Row'
import { TruncatedText, SwapShowAcceptChanges } from './styleds'
import { Deposit } from './ConfirmDepositModal'

export default function DepositModalHeader({
  deposit,
  recipient,
  showAcceptChanges,
  onAcceptChanges,
}: {
  deposit: Deposit
  recipient: string | null
  showAcceptChanges: boolean
  onAcceptChanges: () => void
}) {
  // const slippageAdjustedAmounts = useMemo(() => computeSlippageAdjustedAmounts(deposit, allowedSlippage), [
  //   deposit,
  //   allowedSlippage,
  // ])
  // const { priceImpactWithoutFee } = useMemo(() => computeTradePriceBreakdown(deposit), [deposit])

  return (
    <AutoColumn gap="md">
      <RowBetween align="flex-end">
        <RowFixed gap="0px">
          <CurrencyLogo currency={deposit.tokenA.currency} size="24px" style={{ marginRight: '12px' }} />
          <TruncatedText
            fontSize="24px"
            color={showAcceptChanges && deposit.method === 'freezeLP' ? 'primary' : 'text'}
          >
            {deposit.tokenA.toSignificant(6)}
          </TruncatedText>
        </RowFixed>
        <RowFixed gap="0px">
          <Text fontSize="24px" ml="10px">
            {deposit.tokenA.currency.symbol}
          </Text>
        </RowFixed>
      </RowBetween>
      {deposit.tokenB && (
        <>
          <RowFixed>
            <AddIcon width="24px" ml="24px" mr="12px" />
          </RowFixed>
          <RowBetween align="flex-end">
            <RowFixed gap="0px">
              <CurrencyLogo currency={deposit.tokenB.currency} size="24px" style={{ marginRight: '12px' }} />
              <TruncatedText
                fontSize="24px"
                color={showAcceptChanges && deposit.method === 'freezeLP' ? 'primary' : 'text'}
              >
                {deposit.tokenB.toSignificant(6)}
              </TruncatedText>
            </RowFixed>
            <RowFixed gap="0px">
              <Text fontSize="24px" ml="10px">
                {deposit.tokenB.currency.symbol}
              </Text>
            </RowFixed>
          </RowBetween>
        </>
      )}
      <RowFixed>
        <EqualIcon width="24px" ml="24px" mr="12px" pt="4px" />
        <TruncatedText fontSize="24px">{Number(deposit.price).toFixed(2)} $</TruncatedText>
      </RowFixed>
      {showAcceptChanges ? (
        <SwapShowAcceptChanges justify="flex-start" gap="0px">
          <RowBetween>
            <RowFixed>
              <ErrorIcon mr="8px" />
              <Text bold> Price Updated</Text>
            </RowFixed>
            <Button onClick={onAcceptChanges}>Accept</Button>
          </RowBetween>
        </SwapShowAcceptChanges>
      ) : null}
      <AutoColumn justify="flex-start" gap="sm" style={{ padding: '24px 0 0 0px' }}>
        {deposit.method === 'freezeLP' ? (
          <Text small color="textSubtle" textAlign="left" style={{ width: '100%' }}>
            {`Output is estimated. You will receive at least `}
            <b>{/* {slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(6)} {deposit.tokenB?.currency.symbol} */}</b>
            {' or the transaction will revert.'}
          </Text>
        ) : (
          <Text small color="textSubtle" textAlign="left" style={{ width: '100%' }}>
            {`Input is estimated. You will sell at most `}
            <b>
              {/* {slippageAdjustedAmounts[Field.INPUT]?.toSignificant(6)} {deposit.inputAmount.currency.symbol} */}
            </b>
            {' or the transaction will revert.'}
          </Text>
        )}
      </AutoColumn>
      {recipient !== null ? (
        <AutoColumn justify="flex-start" gap="sm" style={{ padding: '12px 0 0 0px' }}>
          <Text color="textSubtle">Deposit Infromation: </Text>
        </AutoColumn>
      ) : null}
    </AutoColumn>
  )
}
