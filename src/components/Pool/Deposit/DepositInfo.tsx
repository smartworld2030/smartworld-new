import { Token, TokenAmount } from '@pancakeswap/sdk'
import DepositButton from 'components/Layout/DepositButton'
import { useApproveCallback } from 'hooks/useApproveCallback'
import { usePoolAddress } from 'hooks/useContract'
import { usePoolDepositCallback } from 'hooks/usePoolDepositCallback'
import { useCallback } from 'react'
import { ValueType } from '.'

interface DepositInfoProps {
  token: Token
  price: string
  values: ValueType
}

const DepositInfo: React.FC<DepositInfoProps> = ({ price, token, values }) => {
  // const { callback } = usePoolDepositCallback({ token: token.symbol, values })
  const callback = {}
  const spender = usePoolAddress()

  const currencyAmount = values?.[token.symbol]

  const [allowance, approveCallback] = useApproveCallback(currencyAmount, spender)

  const handleDeposit = useCallback(() => {
    if (!callback) {
      return
    }
    if (allowance !== 3) {
      return approveCallback()
    }
    // callback()
    //   .then((hash) => {
    //     console.log(hash)
    //     // setSwapState({
    //     //   attemptingTxn: false,
    //     //   tradeToConfirm,
    //     //   swapErrorMessage: undefined,
    //     //   txHash: hash,
    //     // })
    //   })
    //   .catch((error) => {
    //     console.log(error)

    //     // setSwapState({
    //     //   attemptingTxn: false,
    //     //   tradeToConfirm,
    //     //   swapErrorMessage: error.message,
    //     //   txHash: undefined,
    //     // })
    //   })
  }, [allowance, approveCallback, callback])

  return (
    <DepositButton
      onClick={handleDeposit}
      disable={Number(price) < 10}
      allowance={allowance === 3}
      done={false}
      loading={false}
    />
  )
}

export default DepositInfo
