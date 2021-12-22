import React, { lazy, useMemo, useRef, useState } from 'react'
import { usePollBlockNumber } from 'state/block/hooks'
import useEagerConnect from 'hooks/useEagerConnect'
import { Switch } from 'react-router-dom'
import { Redirect, Route } from 'react-router'
import GlobalStyle from 'style/Global'
// import {
//   RedirectDuplicateTokenIds,
//   RedirectOldAddLiquidityPathStructure,
//   RedirectToAddLiquidity,
// } from "components/Swap/AddLiquidity/redirects";
import {
  BoxProps,
  Language,
  MainSection,
  CogIcon,
  IconButton,
  ThemeSwitcher,
  Toggle,
  NoProfileAvatarIcon,
} from '@smartworld-libs/uikit'
import SuspenseWithChunkError from 'components/SuspenseWithChunkError'
import PageLoader from 'components/Loader/PageLoader'
// import RedirectOldRemoveLiquidityPathStructure from "components/Swap/RemoveLiquidity/redirects";
import { RedirectPathToSwapOnly, RedirectToSwap } from 'components/Swap/redirects'
import { AnimatedTipFlex, LogoIcon, SwapIcon, Spinner } from '@smartworld-libs/uikit'
import { debounce } from 'lodash'
import { InjectedProps } from '@smartworld-libs/uikit/dist/widgets/Modal/types'
import useTheme from 'hooks/useTheme'
import MainPool from 'components/Pool'
import WalletModal, { WalletView } from 'components/Menu/UserMenu/WalletModal'
import { useERC20 } from 'hooks/useContract'
import ConnectWalletButton from 'components/ConnectWalletButton'
import SettingsModal from 'components/Menu/GlobalSettings/SettingsModal'
// const AddLiquidity = lazy(() => import("components/Swap/AddLiquidity"));
// const Liquidity = lazy(() => import("components/Swap/Pool"));
// const PoolFinder = lazy(() => import("components/Swap/PoolFinder"));
// const RemoveLiquidity = lazy(() => import("components/Swap/RemoveLiquidity"));
const Investment = lazy(() => import('components/Invest'))
const Swap = lazy(() => import('components/Swap'))
// const Info = lazy(() => import('components/Info'))
// const MainPool = lazy(() => import('components/Pool'))
// const STB = lazy(() => import('components/STB'))

const langs: Language[] = [...Array(20)].map((_, i) => ({
  code: `en${i}`,
  language: `English${i}`,
  locale: `Locale${i}`,
}))

interface IProps {
  globeHeight: (arg0: number) => void
}

type AppRouterProps = IProps

export const AppRouter: React.FC<AppRouterProps> = ({ globeHeight }) => {
  usePollBlockNumber()
  useEagerConnect()
  const [height, setHeight] = useState(0)
  const timer = useRef<NodeJS.Timeout>(null)

  const getHeight = (ref: HTMLDivElement) => {
    if (ref) {
      const { height } = ref.getBoundingClientRect()
      clearTimeout(timer.current)
      timer.current = setTimeout(() => {
        console.log(height)
        setHeight(height)
        globeHeight(height + 500)
      }, 300)
    }
  }

  const Titles = useMemo(
    () => ({
      links: [
        {
          label: 'INVESTMENT',
          path: ['/invest'],
          icon: <LogoIcon />,
        },
        { label: 'INFORMATION', path: ['/info'], icon: <LogoIcon /> },
        {
          label: 'POOL',
          path: ['/pool'],
          icon: <LogoIcon />,
        },
        { label: 'SWAP', path: ['/swap'], icon: <LogoIcon /> },
        { label: 'STB', path: ['/stb'], icon: <LogoIcon /> },
      ],
      default: '/invest',
    }),
    [],
  )

  return (
    <div style={{ position: 'absolute', zIndex: 10, top: 0, width: '100vw', height }}>
      <GlobalStyle />
      <SuspenseWithChunkError fallback={<PageLoader />}>
        <Switch>
          <MainSection
            mainBackground="transparent"
            menuBackground="transparent"
            refFunc={getHeight}
            list={Titles}
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
                  <WalletModal initialView={WalletView.WALLET_INFO} />
                </AnimatedTipFlex>
              ),
              [],
            )}
            left={useMemo(
              () => ({ toggle: { showLeft }, responsiveSize, tipChanger }) => (
                <AnimatedTipFlex {...responsiveSize(15, showLeft)} flexDirection="column" justifyContent="space-around">
                  <GlobalMenuModal title="Setting" toggleHandler={tipChanger} />
                </AnimatedTipFlex>
              ),
              [],
            )}
          >
            <Route exact strict path={['/invest', '/investment']} component={Investment} />
            <MainPool exact strict path="/pool" />
            <Route exact strict path="/swap" component={Swap} />
          </MainSection>
          <Route exact path={['/', '']}>
            <Redirect to="/invest" />
          </Route>
        </Switch>
        {/* <Route exact strict path="/info">
                      <Info isMobile={isMobile} />
                    </Route>
                    <Route exact strict path={["/pool", "/freeze"]}>
                      <Pool isMobile={isMobile} />
                    </Route>
                    <Route exact strict path="/stb">
                      <STB isMobile={isMobile} />
                    </Route> */}
        {/* <Route exact strict path="/swap" render={(props) => <Swap {...props} isMobile={isMobile} />} />
              <Route exact strict path="/swap/:outputCurrency" component={RedirectToSwap} />
              <Route exact strict path="/send" component={RedirectPathToSwapOnly} /> */}
        {/* <Route exact strict path="/find" component={PoolFinder} />
                    <Route
                      exact
                      strict
                      path="/liquidity"
                      component={Liquidity}
                    />
                    <Route
                      exact
                      strict
                      path="/create"
                      component={RedirectToAddLiquidity}
                    />
                    <Route exact path="/add" component={AddLiquidity} />
                    <Route
                      exact
                      path="/add/:currencyIdA"
                      component={RedirectOldAddLiquidityPathStructure}
                    />
                    <Route
                      exact
                      path="/add/:currencyIdA/:currencyIdB"
                      component={RedirectDuplicateTokenIds}
                    />
                    <Route exact path="/create" component={AddLiquidity} />
                    <Route
                      exact
                      path="/create/:currencyIdA"
                      component={RedirectOldAddLiquidityPathStructure}
                    />
                    <Route
                      exact
                      path="/create/:currencyIdA/:currencyIdB"
                      component={RedirectDuplicateTokenIds}
                    />
                    <Route
                      exact
                      strict
                      path="/remove/:tokens"
                      component={RedirectOldRemoveLiquidityPathStructure}
                    />
                    <Route
                      exact
                      strict
                      path="/remove/:currencyIdA/:currencyIdB"
                      component={RemoveLiquidity}
                    /> */}
        <Route exact path="/">
          <Redirect to="/invest" />
        </Route>
        {/* </Switch> */}
      </SuspenseWithChunkError>
    </div>
  )
}

export default AppRouter

export interface ModalProps extends InjectedProps, BoxProps {
  title: string
  hideCloseButton?: boolean
  onBack?: () => void
  bodyPadding?: string
  headerBackground?: string
  minWidth?: string
  toggleHandler: (item: string) => void
}

export const GlobalMenuModal: React.FC<ModalProps> = ({ title, toggleHandler, onDismiss, ...props }) => {
  const { isDark, toggleTheme } = useTheme()
  return (
    <>
      <SettingsModal />
      <ThemeSwitcher isDark={isDark} toggleTheme={toggleTheme} />
      <Toggle onChange={() => toggleHandler('showTip')} />
    </>
  )
}
interface GlobalMenuProps {
  toggleHandler: (item: string) => void
}

const GlobalMenuComponent: React.FC<GlobalMenuProps> = ({ toggleHandler }) => {
  return (
    <IconButton onClick={() => toggleHandler('showSetting')} variant="tertiary" scale="sm">
      <CogIcon color="textSubtle" />
    </IconButton>
  )
}
