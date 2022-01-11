import { IconButton } from '@smartworld-libs/uikit'
import { DoubleCurrencyLogo } from 'components/Logo'
import { useCurrency } from 'hooks/Tokens'
import useTokenAdress from 'hooks/useTokenAddress'
import { useSpring, animated as a } from 'react-spring'

interface CircleProps {
  width: number
  token: string
  active: boolean
  onClick: (arg: string) => void
}

const TokenCircle: React.FC<CircleProps> = ({ width, active, token, onClick }) => {
  const { transform, opacity } = useSpring({
    opacity: active ? 1 : 0,
    transform: `perspective(600px) rotateY(${active ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 },
  })
  const address1 = useTokenAdress('STTS')
  const address2 = useTokenAdress('BNB')
  const currency1 = useCurrency(address1)
  const currency2 = useCurrency(address2)

  return (
    <div style={{ position: 'relative', width, height: width }} onClick={() => onClick(token)}>
      <a.div style={{ position: 'absolute', top: 0, left: 0, opacity: opacity.to((o) => 1 - o), transform }}>
        <IconButton
          icon={(w) => <DoubleCurrencyLogo currency1={currency1} currency0={currency2} size={w - 8} />}
          variant="secondary"
          scale="lg"
          shape="circle"
          fontSize={10}
          iconProps={{ top: 0, left: 0 }}
          shadow
        >
          {token}
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
          icon={(w) => <DoubleCurrencyLogo currency1={currency1} currency0={currency2} size={w - 8} />}
          scale="lg"
          shape="circle"
          fontSize={10}
          iconProps={{ top: 0, left: 0 }}
          shadow
        >
          {token}
        </IconButton>
      </a.div>
    </div>
  )
}
export default TokenCircle
