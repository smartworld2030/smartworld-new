import { Currency, Token } from '@pancakeswap/sdk'
import { IconButton } from '@smartworld-libs/uikit'
import { CurrencyLogo } from 'components/Logo'
import { useSpring, animated as a } from 'react-spring'

interface CircleProps {
  width: number
  token: Token | Currency
  active: boolean
  info?: number | string
  onClick: (arg: string) => void
}

const TokenCircle: React.FC<CircleProps> = ({ width, active, token, info, onClick }) => {
  const { transform, opacity } = useSpring({
    opacity: active ? 1 : 0,
    transform: `perspective(600px) rotateY(${active ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 },
  })

  return (
    <div style={{ position: 'relative', width, height: width }} onClick={() => onClick(token?.symbol)}>
      <a.div style={{ position: 'absolute', top: 0, left: 0, opacity: opacity.to((o) => 1 - o), transform }}>
        <IconButton
          bottomIcon={() => (info && info !== 'Infinity' ? info : 0)}
          icon={(w) => <CurrencyLogo currency={token} size={w + 'px'} />}
          variant="secondary"
          scale="ml"
          shape="circle"
          shadow
        >
          {token?.symbol}
        </IconButton>
      </a.div>
      <a.div
        style={{
          opacity,
          transform,
          rotateY: '180deg',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        <IconButton
          icon={(w) => <CurrencyLogo currency={token} size={w + 'px'} />}
          bottomIcon={() => (info && info !== 'Infinity' ? info : 0)}
          scale="ml"
          shape="circle"
          shadow
        >
          {token?.symbol}
        </IconButton>
      </a.div>
    </div>
  )
}
export default TokenCircle
