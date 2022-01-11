import { CurrencyAmount, Token } from '@pancakeswap/sdk'
import { useUserInvestInfo } from 'state/invest/hooks'
import { InvestCallbackState, useInvestCallback } from './useInvestCallback'
import useQuery from './useQuery'

interface DepositDetails {
  token: Token
  value: CurrencyAmount
}

// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function useInvestDepositCallback({
  token,
  value,
}: DepositDetails): { state: InvestCallbackState; callback: null | (() => Promise<string>); error: string | null } {
  const ref = useQuery().get('ref')
  const user = useUserInvestInfo()
  const decimalValue = value?.numerator.toString()

  const investToken =
    token.symbol.charAt(0) + token.symbol.substring(1).toLowerCase() + (token.symbol === 'BTC' ? 'b' : '')
  const newUser = user.referrer === '0'

  const methodName = newUser ? 'invest' + investToken : 'update' + investToken

  const parameters = newUser ? [ref] : []

  if (token.symbol !== 'BNB') parameters.push(decimalValue)

  return useInvestCallback(methodName, parameters, token.symbol === 'BNB' ? decimalValue : undefined)
}
