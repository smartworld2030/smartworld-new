import { CurrencyAmount, Token } from '@pancakeswap/sdk'
import { useModal } from '@smartworld-libs/uikit'
import ConfirmDepositModal from 'components/Swap/components/ConfirmDepositModal'
import { useApproveCallback } from 'hooks/useApproveCallback'
import { useInvestAddress } from 'hooks/useContract'
import { useInvestDepositCallback } from 'hooks/useInvestDepositCallback'
import DepositButton from '../../Layout/DepositButton'

interface DepositInfoProps {
  token: Token
  value: CurrencyAmount
  price: string
}

const DepositInfo: React.FC<DepositInfoProps> = ({ price, token, value }) => {
  const [deposit, { callback }] = useInvestDepositCallback({ token, value, price })

  const spender = useInvestAddress()

  const [approval, approveCallback] = useApproveCallback(value, spender)

  const [onPresentConfirmModal] = useModal(
    <ConfirmDepositModal deposit={deposit} onConfirm={callback} />,
    true,
    true,
    'confirmDepositModal',
  )

  return (
    <DepositButton
      onClick={onPresentConfirmModal}
      error={deposit.error}
      approveCallback={approveCallback}
      approval={approval}
      done={false}
      loading={false}
      disable={isNaN(Number(price)) || Number(price) < 100}
      token={token.symbol}
      amount={value}
    />
  )
}

export default DepositInfo
