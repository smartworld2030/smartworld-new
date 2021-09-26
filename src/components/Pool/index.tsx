// @ts-nocheck
import Updater from 'state/pool/updater'
import MainWithdrawSection from './Withdraw'
import MainDepositSection from './Deposit'
import MainDetailSection from './Details'
import { MainRoute, useWindowSize } from '@smartworld-libs/uikit'

const MainPool: React.FC<RouteProps> = (props) => {
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

export default MainPool
