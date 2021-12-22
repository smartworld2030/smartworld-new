import { Currency, ETHER, Token } from '@pancakeswap/sdk'
import { useMemo } from 'react'
import useHttpLocations from '../../hooks/useHttpLocations'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import getTokenLogoURL from '../../utils/getTokenLogoURL'

export default function useCurrencyLogoSource({ currency }: { currency?: Currency }) {
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)

  const srcs: string[] = useMemo(() => {
    if (currency === ETHER) return []

    if (currency instanceof Token) {
      if (currency instanceof WrappedTokenInfo) {
        return [`./assets/images/tokens/${currency.address}.png`, ...uriLocations, getTokenLogoURL(currency.address)]
      }
      return [getTokenLogoURL(currency.address)]
    }
    return []
  }, [currency, uriLocations])

  if (currency === ETHER) {
    return ['./assets/images/tokens/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c.png']
  }

  return srcs
}
