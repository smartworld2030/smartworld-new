import { useUserPoolDetails } from 'state/pool/hooks'
import { WithdrawCircle, Flex, Text, TooltipText, Skeleton, MainComp, ReverseFlex } from '@smartworld-libs/uikit'
import { useCallback } from 'react'
import { usePoolCallback } from 'hooks/usePoolCallback'
import { useBankDollars } from 'state/bank/hooks'

const MainWithdrawSection = ({ toggle }) => {
  const { STTS: sttsPrice } = useBankDollars()
  const {
    calculateInterest: { referral, daily, referrer },
    users: { latestWithdraw },
  } = useUserPoolDetails()

  const period = 3600
  const minPast = latestWithdraw !== '0' ? (Date.now() / 1000 - +latestWithdraw) % period : 0
  const percent = minPast / 100
  const STTS = +referral + +daily + +referrer
  const dollar = STTS * +sttsPrice
  const currencyValue = (dollar / 10 ** 8).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  const { callback: swapCallback } = usePoolCallback('withdrawInterest', [], undefined, { STTS, dollar })

  const handleInvest = useCallback(() => {
    if (!swapCallback) {
      return
    }
    swapCallback()
      .then((hash) => {
        console.log(hash)
        // setSwapState({
        //   attemptingTxn: false,
        //   tradeToConfirm,
        //   swapErrorMessage: undefined,
        //   txHash: hash,
        // })
      })
      .catch((error) => {
        console.log(error)

        // setSwapState({
        //   attemptingTxn: false,
        //   tradeToConfirm,
        //   swapErrorMessage: error.message,
        //   txHash: undefined,
        // })
      })
  }, [swapCallback])

  return (
    <ReverseFlex>
      <MainComp
        tip="Withdraw Circle"
        flex={toggle ? 9 : 8}
        justifyContent="space-around"
        alignItems="center"
        tipSize={3}
        demo={<Skeleton size={200} />}
      >
        <WithdrawCircle
          borderColor="white"
          percent={percent}
          totalValue={currencyValue}
          totalValueUnit="$"
          topElement={
            <>
              <TooltipText fontSize="8px">DAILY</TooltipText>
              <STTSBalance balance={daily} />
            </>
          }
          bottomElement={
            <>
              <STTSBalance balance={referral + referrer} />
              <TooltipText fontSize="8px">REFERRAL</TooltipText>
            </>
          }
          size={195}
          onClick={dollar > 0 ? () => handleInvest() : undefined}
        />
      </MainComp>
    </ReverseFlex>
  )
}

const STTSBalance: React.FC<{ balance: string }> = ({ balance }) => (
  <Flex justifyContent="center">
    <Text fontWeight="bold" fontSize="15px">
      {(+balance / 10 ** 8).toFixed(2)}
    </Text>
    <Text fontWeight="bold" color="secondary" ml="5px">
      STTS
    </Text>
  </Flex>
)

export default MainWithdrawSection
