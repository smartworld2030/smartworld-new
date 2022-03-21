// @ts-nocheck
import Updater from 'state/invest/updater'
import WithdrawSection from './Withdraw'
import DepositSection from './Deposit'
import DetailSection from './Details'
import { RouteProps } from 'react-router'
import { MainSectionContext } from '@smartworld-libs/uikit'
import { useContext } from 'react'

const MainInvestment: React.FC<RouteProps> = () => {
  var showTip = useContext(MainSectionContext).toggle.showTip

  return (
    <>
      <Updater />
      <DepositSection toggle={showTip} />
      <WithdrawSection toggle={showTip} />
      <DetailSection toggle={showTip} />
    </>
  )
}

export default MainInvestment
