import ReactDOM from 'react-dom'
import { ReactNode, StrictMode, useEffect, useMemo } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { elementScrollIntoViewPolyfill } from 'seamless-scroll-polyfill/lib/scrollIntoView.polyfill'
import { Provider } from 'react-redux'
import { store } from 'state'
import App from './App'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { BLOCKED_ADDRESSES } from 'config/constants'
import ApplicationUpdater from 'state/application/updater'
// import BankUpdater from 'state/bank/updater'
import WalletUpdater from 'state/wallet/updater'
import MulticallUpdater from 'state/multicall/updater'
import TransactionUpdater from 'state/transactions/updater'
import { getLibrary } from 'utils/web3React'
import { useThemeManager } from 'state/user/hooks'
import { Web3ReactProvider } from '@web3-react/core'
import { ModalProvider, light, dark } from '@smartworld-libs/uikit'
import { HelmetProvider } from 'react-helmet-async'
import { ThemeProvider } from 'styled-components'
import { LanguageProvider } from 'contexts/Localization'
import { RefreshContextProvider } from 'contexts/RefreshContext'
import { ToastsProvider } from 'contexts/ToastsContext'

function Updaters() {
  return (
    <>
      <ApplicationUpdater />
      <TransactionUpdater />
      <MulticallUpdater />
      <WalletUpdater />
    </>
  )
}

function Blocklist({ children }: { children: ReactNode }) {
  const { account } = useActiveWeb3React()
  const blocked: boolean = useMemo(() => Boolean(account && BLOCKED_ADDRESSES.indexOf(account) !== -1), [account])
  if (blocked) {
    return <div>Blocked address</div>
  }
  return <>{children}</>
}

const ThemeProviderWrapper = (props: any) => {
  const [isDark] = useThemeManager()
  return <ThemeProvider theme={isDark ? dark : light} {...props} />
}

const Providers: React.FC = ({ children }) => {
  useEffect(() => {
    elementScrollIntoViewPolyfill()
  }, [])

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Provider store={store}>
        <ToastsProvider>
          <HelmetProvider>
            <ThemeProviderWrapper>
              <LanguageProvider>
                <RefreshContextProvider>
                  <ModalProvider>{children}</ModalProvider>
                </RefreshContextProvider>
              </LanguageProvider>
            </ThemeProviderWrapper>
          </HelmetProvider>
        </ToastsProvider>
      </Provider>
    </Web3ReactProvider>
  )
}
ReactDOM.render(
  <StrictMode>
    <Providers>
      <Router>
        <Blocklist>
          <Updaters />
          <App />
        </Blocklist>
      </Router>
    </Providers>
  </StrictMode>,
  document.getElementById('root'),
)
