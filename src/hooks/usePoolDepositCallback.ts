import { ValueType } from 'components/Pool/Deposit'
import { Deposit } from 'components/Swap/components/ConfirmDepositModal'
import { ADMIN_ADDRESS } from 'config/constants'
import { useUserPoolInfo } from 'state/pool/hooks'
import { useUserSlippageTolerance } from 'state/user/hooks'
import { calculateSlippageAmount, isAddress } from 'utils'
import { InvestCallbackState } from './useInvestCallback'
import { usePoolCallback } from './usePoolCallback'
import useQuery from './useQuery'
import useTransactionDeadline from './useTransactionDeadline'

interface DepositDetails {
  token: string
  price: string
  values: ValueType
}

// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function usePoolDepositCallback({
  token,
  values,
  price,
}: DepositDetails): [
  Deposit,
  { state: InvestCallbackState; callback: null | (() => Promise<string>); error: string | null },
] {
  const referrer = useQuery().get('ref')
  const refPercent = useQuery().get('percent')

  const [slippage] = useUserSlippageTolerance()
  const deadline = useTransactionDeadline()
  const user = useUserPoolInfo()
  const newUser = user.referrer === '0'

  const decimalValue = values[token]?.numerator.toString()
  const bnbValue = values.BNB?.numerator.toString()
  const reward = {
    value: values[token]?.multiply('5').divide('10000').toSignificant(2),
    period: 'Daily',
    symbol: 'STTS',
  }

  const investToken = token === 'LPTOKEN' ? 'LP' : ''

  const method = newUser ? 'freeze' + investToken : 'updateFreeze' + investToken

  const ref = isAddress(referrer) || ADMIN_ADDRESS
  const per = +refPercent * 100 || 10000
  const parameters: any[] = newUser ? [ref, per, decimalValue] : [decimalValue]

  if (token === 'STTS' && values.STTS && values.BNB) {
    price = (+price * 2).toFixed(2)
    const sttsWithSlippage = calculateSlippageAmount(values.STTS, slippage)[0].toString()
    const bnbWithSlippage = calculateSlippageAmount(values.BNB, slippage)[0].toString()
    parameters.push(sttsWithSlippage, bnbWithSlippage, deadline)
  }
  const details = { stts: decimalValue, lptoken: decimalValue, bnb: bnbValue, dollar: price }

  const deposit: Deposit = {
    referrer,
    refPercent,
    newUser,
    price,
    deadline,
    method,
    tokenA: values[token],
    tokenB: values.BNB,
    slippage,
    user,
    reward,
  }
  console.log(method, parameters, token === 'STTS' ? bnbValue : undefined, details)
  return [deposit, usePoolCallback(method, parameters, token === 'STTS' ? bnbValue : undefined, details)]
}
