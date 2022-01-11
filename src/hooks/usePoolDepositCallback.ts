import { ValueType } from 'components/Pool/Deposit'
import { useUserPoolInfo } from 'state/pool/hooks'
import { useUserSlippageTolerance } from 'state/user/hooks'
import { InvestCallbackState } from './useInvestCallback'
import { usePoolCallback } from './usePoolCallback'
import useQuery from './useQuery'
import useTransactionDeadline from './useTransactionDeadline'

interface DepositDetails {
  token: string
  values: ValueType
}

// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function usePoolDepositCallback({
  token,
  values,
}: DepositDetails): { state: InvestCallbackState; callback: null | (() => Promise<string>); error: string | null } {
  const ref = useQuery().get('ref')
  const refPercent = +useQuery().get('percent') * 100

  const [userSlippageTolerance] = useUserSlippageTolerance()
  const deadline = useTransactionDeadline()
  const user = useUserPoolInfo()

  const decimalValue = (+values[token] * 10 ** (token === 'STTS' ? 8 : 18)).toFixed().toString()
  const bnbValue = (+values.BNB * 10 ** 18).toFixed().toString()

  const investToken = token === 'LPTOKEN' ? 'LP' : ''
  const newUser = user.referrer === '0'

  const methodName = newUser ? 'freeze' + investToken : 'updateFreeze' + investToken

  const parameters: any[] = newUser ? [ref, refPercent, decimalValue] : [decimalValue]

  if (token === 'STTS') {
    const sttsWithSlippage = ((+decimalValue * userSlippageTolerance) / 1000).toFixed().toString()
    const bnbWithSlippage = ((+bnbValue * userSlippageTolerance) / 1000).toFixed().toString()
    parameters.push(sttsWithSlippage, bnbWithSlippage, deadline)
  }
  const details = { stts: decimalValue, lptoken: decimalValue, bnb: bnbValue, dollar: '10000' }

  return usePoolCallback(methodName, parameters, token === 'STTS' ? bnbValue : undefined, details)
}
