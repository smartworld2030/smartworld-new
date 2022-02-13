import styled from 'styled-components'
import { Button, Text } from '@smartworld-libs/uikit'
import { AutoColumn } from 'components/Layout/Column'
import QuestionHelper from 'components/QuestionHelper'
import { AutoRow, RowBetween, RowFixed } from 'components/Layout/Row'
import { SwapCallbackError } from './styleds'
import { Deposit } from './ConfirmDepositModal'
import { useMemo } from 'react'
import { isAddress, shortenAddress } from 'utils'

const SwapModalFooterContainer = styled(AutoColumn)`
  margin-top: 4px;
  padding: 16px;
  border-radius: ${({ theme }) => theme.radii.default};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  background-color: ${({ theme }) => theme.colors.background};
`

export default function DepositModalFooter({
  deposit,
  onConfirm,
  swapErrorMessage,
  disabledConfirm,
}: {
  deposit: Deposit
  onConfirm: () => void
  swapErrorMessage: string | undefined
  disabledConfirm: boolean
}) {
  const { referrer, refPercent, newUser, reward } = deposit
  const shouldUseAdminAddress = useMemo(() => !isAddress(referrer), [referrer])

  return (
    <>
      <SwapModalFooterContainer>
        {newUser && (
          <RowBetween>
            <RowFixed>
              <Text fontSize="14px">Referrer</Text>
              <QuestionHelper text="Your referrer!" ml="4px" />
            </RowFixed>
            <RowFixed>
              <Text fontSize="14px" marginLeft="4px">
                {shouldUseAdminAddress ? 'No Referrer!' : shortenAddress(deposit.referrer)}
              </Text>
            </RowFixed>
          </RowBetween>
        )}
        {refPercent && (
          <RowBetween>
            <RowFixed>
              <Text fontSize="14px">Referrer Percent</Text>
              <QuestionHelper text="Referrer Percent!" ml="4px" />
            </RowFixed>
            <RowFixed>
              <Text fontSize="14px" marginLeft="4px">
                {refPercent}%
              </Text>
            </RowFixed>
          </RowBetween>
        )}
        {reward?.total && (
          <RowBetween>
            <RowFixed>
              <Text fontSize="14px">Total Reward</Text>
              <QuestionHelper text="Ending time!" ml="4px" />
            </RowFixed>
            <RowFixed>
              <Text fontSize="14px" marginLeft="4px">
                {reward?.total} $
              </Text>
            </RowFixed>
          </RowBetween>
        )}
        <RowBetween>
          <RowFixed>
            <Text fontSize="14px">{reward?.period} Reward</Text>
            <QuestionHelper
              text={
                <>
                  <Text mb="12px">For each deposit a 0.25% fee is paid</Text>
                  <Text>- 0.17% to LP token holders</Text>
                  <Text>- 0.03% to the Treasury</Text>
                  <Text>- 0.05% towards CAKE buyback and burn</Text>
                </>
              }
              ml="4px"
            />
          </RowFixed>
          <RowFixed>
            <Text fontSize="14px" marginLeft="4px">
              {reward?.value} {reward?.symbol}
            </Text>
          </RowFixed>
        </RowBetween>
        {reward?.end && (
          <RowBetween>
            <RowFixed>
              <Text fontSize="14px">Ends in</Text>
              <QuestionHelper text="Ending time!" ml="4px" />
            </RowFixed>
            <RowFixed>
              <Text fontSize="14px" marginLeft="4px">
                {reward?.end} Month
              </Text>
            </RowFixed>
          </RowBetween>
        )}
      </SwapModalFooterContainer>
      <AutoRow>
        <Button
          variant="primary"
          onClick={onConfirm}
          disabled={disabledConfirm}
          mt="12px"
          id="confirm-swap-or-send"
          width="100%"
        >
          Confirm Deposit
        </Button>
        {swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
      </AutoRow>
    </>
  )
}
