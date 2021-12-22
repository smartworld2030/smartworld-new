import { IconButton, LogoIcon } from '@smartworld-libs/uikit'
import { useSpring, animated as a } from 'react-spring'

interface CircleProps {
  width: number
  token: string
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
    <div style={{ position: 'relative', width, height: width }} onClick={() => onClick(token)}>
      <a.div style={{ position: 'absolute', top: 0, left: 0, opacity: opacity.to((o) => 1 - o), transform }}>
        <IconButton
          bottomIcon={() => (info && info !== 'Infinity' ? info : 0)}
          icon={(w) => <LogoIcon width={w} />}
          variant="secondary"
          scale="lg"
          shape="circle"
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
          icon={(w) => <LogoIcon width={w} />}
          bottomIcon={() => (info && info !== 'Infinity' ? info : 0)}
          scale="lg"
          shape="circle"
          shadow
        >
          {token}
        </IconButton>
      </a.div>
    </div>
  )
}
export default TokenCircle
