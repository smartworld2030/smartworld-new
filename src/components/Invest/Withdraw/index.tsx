import { useUserInvestDetails } from 'state/invest/hooks'
import {
  WithdrawCircle,
  Flex,
  Text,
  TooltipText,
  MainFlex,
  Skeleton,
  MainComp,
  useWindowSize,
} from '@smartworld-libs/uikit'
import { useBankDollars } from 'state/bank/hooks'

const MainWithdrawSection = () => {
  const { flexSize, isMobile, isTablet } = useWindowSize()
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
    <MainFlex {...{ flex: 3, md: 6, sm: 6, xs: 6 }}>
      <MainComp
        tip="Withdraw Circle"
        flex={12}
        justifyContent="space-around"
        alignItems="center"
        tipSize={3}
        demo={<Skeleton size={isMobile ? flexSize * 3.5 : isTablet ? flexSize * 2.5 : flexSize * 2} />}
      >
        <WithdrawCircle
          progressSize={5}
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
          size={isMobile ? flexSize * 4 : isTablet ? flexSize * 3 : flexSize * 2}
          onClick={+referral + +hourly > 0 ? () => console.log('withdraw') : undefined}
        />
      </MainComp>
    </MainFlex>
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
