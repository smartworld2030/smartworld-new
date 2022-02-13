import { CurrencyAmount, Token } from '@pancakeswap/sdk'
import { Deposit } from 'components/Swap/components/ConfirmDepositModal'
import { ADMIN_ADDRESS } from 'config/constants'
import { useUserInvestInfo } from 'state/invest/hooks'
import { isAddress } from 'utils'
import { hourlyReward, rewardPeriod } from 'utils/DepositDetails'
import { InvestCallbackState, useInvestCallback } from './useInvestCallback'
import useQuery from './useQuery'

interface DepositDetails {
  token: Token
  value: CurrencyAmount
  price: string
}

// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function useInvestDepositCallback({
  token,
  value,
  price,
}: DepositDetails): [
  Deposit,
  { state: InvestCallbackState; callback: null | (() => Promise<string>); error: string | null },
] {
  const referrer = useQuery().get('ref')
  const user = useUserInvestInfo()
  const decimalValue = value?.numerator.toString()

  const reward = {
    total: (+price * 2).toFixed(2),
    value: hourlyReward(+price).toFixed(4),
    period: 'Hourly',
    symbol: '$',
    end: rewardPeriod(+price).toFixed(2),
  }

  const ref = isAddress(referrer) || ADMIN_ADDRESS

  const investToken =
    token.symbol.charAt(0) + token.symbol.substring(1).toLowerCase() + (token.symbol === 'BTC' ? 'b' : '')
  const newUser = user.referrer === '0'

  const method = newUser ? 'invest' + investToken : 'update' + investToken

  const parameters = newUser ? [ref] : []

  if (token.symbol !== 'BNB') parameters.push(decimalValue)

  const deposit: Deposit = {
    user,
    newUser,
    referrer,
    method,
    price,
    tokenA: value,
    reward,
  }

  return [deposit, useInvestCallback(method, parameters, token.symbol === 'BNB' ? decimalValue : undefined)]
}
