import { ETHER, Token } from '@pancakeswap/sdk'
import { useMemo } from 'react'
import getTokenLogoURL from '../../utils/getTokenLogoURL'

export default function useCurrenciesLogoSources(Tokens: Token[], showETH: boolean) {
  return useMemo(
    () =>
      Tokens.reduce<{
        [tokenAddress: string]: string[]
      }>(
        (memo, token) => {
          if (token === ETHER)
            memo[token.address] = ['./assets/images/tokens/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c.png']
          else if (token instanceof Token)
            memo[token.address] = [`./assets/images/tokens/${token.address}.png`, getTokenLogoURL(token.address)]

          return memo
        },
        showETH ? { BNB: ['./assets/images/tokens/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c.png'] } : {},
      ),
    [Tokens, showETH],
  )
}
