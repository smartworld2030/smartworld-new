import { lazy, useMemo } from 'react'
import { usePollBlockNumber } from 'state/block/hooks'
import useEagerConnect from 'hooks/useEagerConnect'
import { Switch } from 'react-router-dom'
import { Redirect, Route } from 'react-router'
import GlobalStyle from 'style/Global'
import { BrowserRouter as Router } from 'react-router-dom'
import { RelativeFlex } from '@smartworld-libs/uikit'
import { Header } from 'components/Header'
import MainPool from 'components/Pool'
import { AnimatedTipFlex } from '@smartworld-libs/uikit'
import SuspenseWithChunkError from 'components/SuspenseWithChunkError'
import PageLoader from 'components/Loader/PageLoader'
import WalletModal, { WalletView } from 'components/Menu/UserMenu/WalletModal'
import { MainSection, CogIcon, NoProfileAvatarIcon } from '@smartworld-libs/uikit'
import GlobalMenuModal from 'menu'

const Investment = lazy(() => import('components/Invest'))
const Swap = lazy(() => import('components/Swap'))

const App = () => {
  usePollBlockNumber()
  useEagerConnect()

  return (
    <Router>
      <RelativeFlex>
        <GlobalStyle />
        <SuspenseWithChunkError fallback={<PageLoader />}>
          <Switch>
            <MainSection
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '100vh',
              }}
              header={<Header />}
              mainBackground="transparent"
              menuBackground="transparent"
              rightIcon={({ checked, onChange }) =>
                checked ? <NoProfileAvatarIcon onClick={onChange} /> : <NoProfileAvatarIcon onClick={onChange} />
              }
              leftIcon={({ checked, onChange }) =>
                checked ? <CogIcon onClick={onChange} /> : <CogIcon onClick={onChange} />
              }
              right={useMemo(
                () => ({ toggle: { showRight }, responsiveSize }) => (
                  <AnimatedTipFlex
                    {...responsiveSize(12, showRight)}
                    flexDirection="column"
                    justifyContent="space-around"
                  >
                    <WalletModal initialView={WalletView.WALLET_INFO} onDismiss={() => console.log} />
                  </AnimatedTipFlex>
                ),
                [],
              )}
              left={useMemo(
                () => ({ toggle: { showLeft }, responsiveSize, tipChanger }) => (
                  <AnimatedTipFlex
                    {...responsiveSize(4, showLeft)}
                    flexDirection="column"
                    justifyContent="space-around"
                  >
                    <GlobalMenuModal title="Setting" toggleHandler={tipChanger} />
                  </AnimatedTipFlex>
                ),
                [],
              )}
            >
              <Route exact strict path={['/invest', '/investment']} component={Investment} />
              <Route exact strict path="/pool" component={MainPool} />
              <Route exact strict path="/swap" component={Swap} />
            </MainSection>
            <Route exact path={['/', '']}>
              <Redirect to="/invest" />
            </Route>
          </Switch>
          <Route exact path="/">
            <Redirect to="/invest" />
          </Route>
        </SuspenseWithChunkError>
      </RelativeFlex>
    </Router>
  )
}

export default App
