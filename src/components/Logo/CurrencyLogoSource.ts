import { useMemo } from 'react'
import { Currency, ETHER, Token } from '@pancakeswap/sdk'
import getTokenLogoURL from '../../utils/getTokenLogoURL'

export default function useCurrencyLogoSource({ currency }: { currency?: Currency }) {
  const srcs: string[] = useMemo(() => {
    if (currency === ETHER) return []

    if (currency instanceof Token) {
      return [`./assets/images/tokens/${currency.address}.png`, getTokenLogoURL(currency.address)]
    }
    return []
  }, [currency])

  if (currency === ETHER) {
    return ['./assets/images/tokens/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c.png']
  }

  return srcs
}
