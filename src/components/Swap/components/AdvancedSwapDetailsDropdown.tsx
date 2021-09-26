import styled from 'styled-components'
import useLastTruthy from 'hooks/useLast'
import { AdvancedSwapDetails, AdvancedSwapDetailsProps } from './AdvancedSwapDetails'

export const AdvancedDetails = styled.div`
  & > p {
    padding-top: 16px;
    padding-bottom: 8px;
  }
  width: 100%;
  height: 80%;
  max-width: 400px;
  border-radius: 2px;
  background-color: ${({ theme }) => theme.colors.tertiary};
`

export default function AdvancedSwapDetailsDropdown({ trade, ...rest }: AdvancedSwapDetailsProps) {
  const lastTrade = useLastTruthy(trade)

  return <AdvancedSwapDetails {...rest} trade={trade ?? lastTrade ?? undefined} />
}
