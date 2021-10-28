// @ts-nocheck
import Updater from 'state/invest/updater'
import WithdrawSection from './Withdraw'
import DepositSection from './Deposit'
import DetailSection from './Details'
import { RouteProps } from 'react-router'

const MainInvestment: React.FC<RouteProps> = (props) => {
  return (
    <>
      <Updater />
      <DepositSection />
      <WithdrawSection />
      <DetailSection />
    </>
  )
}

export default MainInvestment
