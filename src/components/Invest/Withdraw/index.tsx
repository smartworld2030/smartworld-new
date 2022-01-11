import { useUserInvestDetails } from 'state/invest/hooks'
import { WithdrawCircle, Flex, Text, TooltipText, Skeleton, MainComp, ReverseFlex } from '@smartworld-libs/uikit'
import { useCallback } from 'react'
import { useInvestCallback } from 'hooks/useInvestCallback'

const MainWithdrawSection = ({ toggle }) => {
  const {
    calculateInterest: { referral, hourly, stts },
    users: { latestWithdraw },
  } = useUserInvestDetails()

  const period = 3600
  const minPast = latestWithdraw !== '0' ? (Date.now() / 1000 - +latestWithdraw) % period : 0
  const percent = minPast / 100
  const dollar = +referral + +hourly
  const currencyValue = (dollar / 10 ** 8).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  const { callback: swapCallback } = useInvestCallback('withdrawInterest', [], undefined, { stts, dollar })

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
        flex={toggle ? 12 : 9}
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
              <TooltipText fontSize="8px">HOURLY</TooltipText>
              <DollarBalance balance={hourly} />
            </>
          }
          bottomElement={
            <>
              <DollarBalance balance={referral} />
              <TooltipText fontSize="8px">REFERRAL</TooltipText>
            </>
          }
          size={250}
          onClick={dollar > 0 ? () => handleInvest() : undefined}
        />
      </MainComp>
    </ReverseFlex>
  )
}

const DollarBalance: React.FC<{ balance: string }> = ({ balance }) => (
  <Flex justifyContent="center">
    <Text fontWeight="bold" fontSize="15px">
      {(+balance / 10 ** 8).toFixed(2)}
    </Text>
    <Text fontWeight="bold" color="secondary" ml="5px">
      $
    </Text>
  </Flex>
)

export default MainWithdrawSection
