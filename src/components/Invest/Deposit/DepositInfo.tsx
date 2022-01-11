import { CurrencyAmount, Token } from '@pancakeswap/sdk'
import { useInvestDepositCallback } from 'hooks/useInvestDepositCallback'
import { useCallback } from 'react'
import DepositButton from '../../Layout/DepositButton'

interface DepositInfoProps {
  token: Token
  value: CurrencyAmount
  price: string
}

const DepositInfo: React.FC<DepositInfoProps> = ({ price, ...rest }) => {
  const { callback: swapCallback } = useInvestDepositCallback(rest)

  const handleInvest = useCallback(() => {
    if (!swapCallback) {
      return
    }
    swapCallback()
      .then((hash) => {
        console.log(hash)
        // setSwapState({
        //   attemptingTxn: false,
        //   tradeToConfirm,
        //   swapErrorMessage: undefined,
        //   txHash: hash,
        // })
      })
      .catch((error) => {
        console.log(error)

        // setSwapState({
        //   attemptingTxn: false,
        //   tradeToConfirm,
        //   swapErrorMessage: error.message,
        //   txHash: undefined,
        // })
      })
  }, [swapCallback])

  return <DepositButton onClick={handleInvest} disable={Number(price) < 100} done={false} loading={false} />
}

export default DepositInfo
