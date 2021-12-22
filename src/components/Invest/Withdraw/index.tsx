import { useUserInvestDetails } from 'state/invest/hooks'
import { WithdrawCircle, Flex, Text, TooltipText, Skeleton, MainComp, ReverseFlex } from '@smartworld-libs/uikit'
import { useBankDollars } from 'state/bank/hooks'

const MainWithdrawSection = ({ toggle }) => {
  const {
    calculateInterest: { referral, hourly },
    users: { latestWithdraw },
  } = useUserInvestDetails()
  const { stt } = useBankDollars()

  const period = 3600
  const minPast = latestWithdraw !== '0' ? (Date.now() / 1000 - +latestWithdraw) % period : 0
  const percent = minPast / 100
  const value = (((+referral + +hourly) / 10 ** 8) * Number(stt)).toFixed()

  const currencyValues = !Number.isNaN(parseFloat(value))
    ? '~' +
      parseFloat(value).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : '0.00'

  return (
    <ReverseFlex>
      <MainComp
        tip="Withdraw Circle"
        flex={toggle ? 9 : 6}
        justifyContent="space-around"
        alignItems="center"
        tipSize={3}
        demo={<Skeleton size={200} />}
      >
        <WithdrawCircle
          borderColor="white"
          percent={percent}
          totalValue={currencyValues}
          totalValueUnit="$"
          topElement={
            <>
              <TooltipText fontSize="8px">HOURLY</TooltipText>
              <SttBalance balance={hourly} />
            </>
          }
          bottomElement={
            <>
              <SttBalance balance={referral} />
              <TooltipText fontSize="8px">REFERRAL</TooltipText>
            </>
          }
          size={200}
          onClick={+referral + +hourly > 0 ? () => console.log('withdraw') : undefined}
        />
      </MainComp>
    </ReverseFlex>
  )
}

const SttBalance: React.FC<{ balance: string }> = ({ balance }) => (
  <Flex justifyContent="center">
    <Text fontWeight="bold" fontSize="15px">
      {(+balance / 10 ** 8).toFixed()}
    </Text>
    <Text fontWeight="bold" color="secondary" ml="5px">
      STT
    </Text>
  </Flex>
)

export default MainWithdrawSection
