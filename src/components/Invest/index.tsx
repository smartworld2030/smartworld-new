// @ts-nocheck
import Updater from 'state/invest/updater'
import MainWithdrawSection from './Withdraw'
import MainDepositSection from './Deposit'
import MainDetailSection from './Details'
import { MainRoute, useWindowSize } from '@smartworld-libs/uikit'
import { RouteProps } from 'react-router'

const MainInvestment: React.FC<RouteProps> = (props) => {
  const rest = useWindowSize()
  return (
    <MainRoute {...props}>
      <Updater />
      <MainDepositSection {...rest} />
      <MainWithdrawSection {...rest} />
      <MainDetailSection {...rest} />
    </MainRoute>
  )
}

export default MainInvestment
