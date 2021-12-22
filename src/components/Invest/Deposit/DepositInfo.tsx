import { DepositButton } from '../../Layout/DepositButton'
import { Flex } from '@smartworld-libs/uikit'

interface DepositInfoProps {
  token: string
  value: number
  prices: { [key: string]: string }
}

const DepositInfo: React.FC<DepositInfoProps> = ({ token, prices, value }) => {
  const depositHandler = () => {
    // if (!loading && !confirmed) {
    console.log(token, value)
    // dispatch(investmentDeposit(token, value))
    // }
  }

  return <DepositButton onClick={depositHandler} done={false} loading={false} />
}

export default DepositInfo
