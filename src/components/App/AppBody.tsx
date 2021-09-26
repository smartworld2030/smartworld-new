import styled from 'styled-components'

export const BodyWrapper = styled.div`
  max-width: 436px;
  width: 100%;
  height: 70%;
  z-index: 1;
  padding: 4px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  background-color: ${({ theme }) => theme.colors.tertiary};
  border-radius: 0 0 2px 2px;
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children }: { children: React.ReactNode }) {
  return <BodyWrapper>{children}</BodyWrapper>
}
