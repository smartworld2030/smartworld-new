import styled from "styled-components";

interface AbsoluteDivProps {
  height?: number;
  width: number;
}

export const AbsoluteBody = styled(
  ({ height, width, ...props }: AbsoluteDivProps) => <div {...props} />
)`
  height: ${({ height }) => (height ? height + "px" : "")};
  text-align: center;
  position: absolute;
  width: ${({ width }) => width + "px"};
  z-index: 10;
  top: 0;
`;

export const FlexDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

interface DivHeightProps {
  height?: number;
}

export const RelativeBody = styled(({ height, ...props }: DivHeightProps) => (
  <div {...props} />
))`
  min-height: ${({ height }) => height + "px"};
  text-align: center;
  position: relative;
`;

export const SpacerDiv = styled(({ height, ...props }: DivHeightProps) => (
  <div {...props} />
))`
  height: ${({ height }) => height + "px"};
  z-index: 0;
`;
