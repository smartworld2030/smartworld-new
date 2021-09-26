import { Button } from "@smartworld-libs/uikit";
import useTheme from "hooks/useTheme";
import styled, { keyframes } from "styled-components";

export const RefIcon = (props) => (
  <svg
    viewBox="0 0 100 100"
    focusable="false"
    data-icon="check"
    opacity="0.6"
    {...props}
  >
    <path d="M 50 20 L 70 50 L 30 50 L 50 20" />
    <path d="M 30 55 L 20 70 L 40 70 L 30 55" />
    <path d="M 70 55 L 80 70 L 60 70 L 70 55" />
  </svg>
);

const scaling1 = keyframes`
  0% {
    transform: scale(0.5);
  }

  100% {
    transform: scale(1);
  }
`;

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
`;

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
`;

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
`;

interface ReferralButtonProps {
  width: number;
  disable?: boolean;
  onClick: () => void;
}

const ReferralButton: React.FC<ReferralButtonProps> = ({
  disable,
  onClick,
}) => {
  const {
    theme: { colors },
  } = useTheme();
  return (
    <Button
      shape="circle"
      scale="ml"
      variant="secondary"
      onClick={disable ? undefined : onClick}
    >
      <AnimatedRefIcon fill={disable ? colors.textSubtle : colors.primary} />
    </Button>
  );
};

export default ReferralButton;
