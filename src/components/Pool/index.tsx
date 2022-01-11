import Updater from 'state/pool/updater'
import WithdrawSection from './Withdraw'
import DepositSection from './Deposit'
import DetailSection from './Details'
import { RouteProps } from 'react-router'
import { MainContext } from '@smartworld-libs/uikit'
import { useContext } from 'react'

const MainPool: React.FC<RouteProps> = () => {
  var showTip = useContext(MainContext).showTip

  return (
    <>
      <Updater />
      <DepositSection toggle={showTip} />
      <WithdrawSection toggle={showTip} />
      <DetailSection toggle={showTip} />
    </>
  )
}

export default MainPool
