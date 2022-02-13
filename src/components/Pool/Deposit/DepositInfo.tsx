import { Token } from '@pancakeswap/sdk'
import { useModal } from '@smartworld-libs/uikit'
import DepositButton from 'components/Layout/DepositButton'
import ConfirmDepositModal from 'components/Swap/components/ConfirmDepositModal'
import { useApproveCallback } from 'hooks/useApproveCallback'
import { usePoolAddress } from 'hooks/useContract'
import { usePoolDepositCallback } from 'hooks/usePoolDepositCallback'
import { ValueType } from '.'

interface DepositInfoProps {
  token: Token
  error: string
  price: string
  values: ValueType
}

const DepositInfo: React.FC<DepositInfoProps> = ({ error, price, token, values }) => {
  const [deposit, { callback }] = usePoolDepositCallback({ token: token.symbol, values, price })

  const spender = usePoolAddress()
  const currencyAmount = values?.[token.symbol]

  const [approval, approveCallback] = useApproveCallback(currencyAmount, spender)

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
      // @ts-ignore
      disable={isNaN(price) || Number(price) < 10}
      token={token.symbol}
      amount={values?.[token.symbol]}
    />
  )
}

export default DepositInfo
