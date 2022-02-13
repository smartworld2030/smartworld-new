import { ButtonWithSlider, IconButton } from '@smartworld-libs/uikit'
import useTheme from 'hooks/useTheme'
import { SVGProps } from 'react'
import styled, { keyframes } from 'styled-components'

export const RefIcon = (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => {
  const {
    theme: { colors },
  } = useTheme()
  return (
    <svg viewBox="0 0 80 80" focusable="false" data-icon="check" opacity="0.6" fill={colors.primary} {...props}>
      <path d="M 40 10 L 60 40 L 20 40 L 40 10" />
      <path d="M 20 45 L 10 60 L 30 60 L 20 45" />
      <path d="M 60 45 L 70 60 L 50 60 L 60 45" />
    </svg>
  )
}

const scaling1 = keyframes`
  0% {
    transform: scale(0.5);
  }

  100% {
    transform: scale(1);
  }
`

const scaling2 = keyframes`
  0% {
    transform: scale(0);
  }
  33% {
    transform: scale(0);
  }
  80% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1.1);
  }
`

const scaling3 = keyframes`
  0% {
    transform: scale(0);
  }
  33% {
    transform: scale(0);
  }
  80% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1.1);
  }
`

const AnimatedRefIcon = styled(RefIcon)`
  > * {
    &:nth-child(1) {
      transform-box: fill-box;
      transform-origin: center;
      animation: ${scaling1} 2s alternate infinite ease;
    }

    &:nth-child(2) {
      transform-box: fill-box;
      transform-origin: center;
      animation: ${scaling2} 2s alternate infinite ease;
      animation-delay: 0.75s;
    }

    &:nth-child(3) {
      transform-box: fill-box;
      transform-origin: center;
      animation: ${scaling3} 2s alternate infinite ease;
      animation-delay: 1.35s;
    }
  }
`

interface ReferralButtonProps {
  width: number
  disable?: boolean
  slider?: boolean
  setPercent?: (e: any) => void
  onClick: () => void
}

const ReferralButton: React.FC<ReferralButtonProps> = ({ disable, slider, setPercent, onClick }) => {
  return slider ? (
    <ButtonWithSlider
      scale="xl"
      fontSize={15}
      icon={(w) => <AnimatedRefIcon width={w} fontSize={8} />}
      onClick={onClick}
      onInput={setPercent}
      disabled={disable}
    />
  ) : (
    <IconButton
      scale="xl"
      blur={disable}
      fontSize={15}
      icon={(w) => <AnimatedRefIcon width={w} fontSize={8} />}
      onClick={onClick}
      disabled={disable}
    />
  )
}

export default ReferralButton
