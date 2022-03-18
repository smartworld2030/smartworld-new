import { Currency, ETHER } from '@pancakeswap/sdk'
import { BinanceIcon } from '@smartworld-libs/uikit'

import styled from 'styled-components'
import { useCurrencyLogoSource } from '.'
import Logo from './Logo'

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`

export default function CurrencyLogo({
  currency,
  size = '24px',
  style,
}: {
  currency?: Currency
  size?: string
  style?: React.CSSProperties
}) {
  const internalSrcs = useCurrencyLogoSource({ currency })

  if (currency === ETHER) {
    return <BinanceIcon width={size} style={style} />
  }

  return <StyledLogo size={size} srcs={internalSrcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
}
