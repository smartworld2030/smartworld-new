import { createGlobalStyle } from 'styled-components'
// eslint-disable-next-line import/no-unresolved
import { SmartWorldTheme } from '@smartworld-libs/uikit/dist/theme'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends SmartWorldTheme {}
}

const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'Rubik', sans-serif;
    box-sizing: border-box;
  }
  body {
    background-color: ${({ theme }) => theme.colors.background};
    overflow-x: hidden;
    margin: 0;
    
    img {
      height: auto;
      max-width: 100%;
    }
  }
`

export default GlobalStyle
