import React, { Children, lazy, ReactElement, useMemo } from 'react'
import { usePollBlockNumber } from 'state/block/hooks'
import useEagerConnect from 'hooks/useEagerConnect'
import { Switch } from 'react-router-dom'
import { Redirect, Route, useLocation } from 'react-router'
import GlobalStyle from 'style/Global'
import PoolUpdater from 'state/pool/updater'
import InvestUpdater from 'state/invest/updater'
// import {
//   RedirectDuplicateTokenIds,
//   RedirectOldAddLiquidityPathStructure,
//   RedirectToAddLiquidity,
// } from "components/Swap/AddLiquidity/redirects";
import {
  BoxProps,
  Language,
  Modal,
  CogIcon,
  IconButton,
  ThemeSwitcher,
  Toggle,
  NoProfileAvatarIcon,
  Flex,
} from '@smartworld-libs/uikit'
import SuspenseWithChunkError from 'components/SuspenseWithChunkError'
import PageLoader from 'components/Loader/PageLoader'
// import RedirectOldRemoveLiquidityPathStructure from "components/Swap/RemoveLiquidity/redirects";
import { RedirectPathToSwapOnly, RedirectToSwap } from 'components/Swap/redirects'
import { AnimatedTipFlex, MainSection, LogoIcon, SwapIcon, Spinner } from '@smartworld-libs/uikit'

import { InjectedProps } from '@smartworld-libs/uikit/dist/widgets/Modal/types'
import useTheme from 'hooks/useTheme'
import MainInvestment from 'components/Invest'
import MainPool from 'components/Pool'
import WalletModal, { WalletView } from 'components/Menu/UserMenu/WalletModal'

// const AddLiquidity = lazy(() => import("components/Swap/AddLiquidity"));
// const Liquidity = lazy(() => import("components/Swap/Pool"));
// const PoolFinder = lazy(() => import("components/Swap/PoolFinder"));
// const RemoveLiquidity = lazy(() => import("components/Swap/RemoveLiquidity"));
// const MainInvestment = lazy(() => import('components/Invest'))
// const Swap = lazy(() => import('components/Swap'))
// const Info = lazy(() => import('components/Info'))
// const MainPool = lazy(() => import('components/Pool'))
// const STB = lazy(() => import('components/STB'))

const langs: Language[] = [...Array(20)].map((_, i) => ({
  code: `en${i}`,
  language: `English${i}`,
  locale: `Locale${i}`,
}))

interface IProps {
  isMobile: boolean
  height: number
  width: number
}

type AppRouterProps = IProps

export const AppRouter: React.FC<AppRouterProps> = ({ height, width }) => {
  usePollBlockNumber()
  useEagerConnect()

  const Titles = useMemo(
    () => [
      {
        label: 'INVESTMENT',
        href: '/invest',
        icon: <LogoIcon />,
      },
      { label: 'INFORMATION', href: '/info', icon: <LogoIcon /> },
      {
        label: 'POOL',
        href: '/pool',
        icon: <LogoIcon />,
      },
      { label: 'SWAP', href: '/swap', icon: <LogoIcon /> },
      { label: 'STB', href: '/stb', icon: <LogoIcon /> },
    ],
    [],
  )
  return (
    <Flex width={width} height={height}>
      <GlobalStyle />
      <SuspenseWithChunkError fallback={<PageLoader />}>
        <Switch>
          <MainSection
            initialValue={{ height: 300, flexSize: 10, screen: 'xl', width: 1200 }}
            links={Titles}
            leftIcon={({ checked, onChange }) =>
              checked ? <NoProfileAvatarIcon onClick={onChange} /> : <NoProfileAvatarIcon onClick={onChange} />
            }
            rightIcon={({ checked, onChange }) =>
              checked ? <CogIcon onClick={onChange} /> : <CogIcon onClick={onChange} />
            }
            right={({ isMobile, toggle: { showRight }, responsiveSize }) => (
              <AnimatedTipFlex
                {...responsiveSize(isMobile ? 5.5 : 6, showRight)}
                flexDirection="column"
                justifyContent="space-around"
              >
                <WalletModal initialView={WalletView.WALLET_INFO} />
              </AnimatedTipFlex>
            )}
            left={({ isMobile, toggle: { showLeft }, responsiveSize, tipChanger }) => (
              <AnimatedTipFlex
                {...responsiveSize(3, showLeft)}
                flexDirection={isMobile ? 'row' : 'column'}
                justifyContent="space-around"
              >
                <GlobalMenuModal title="Setting" toggleHandler={tipChanger} />
              </AnimatedTipFlex>
            )}
          >
            <MainInvestment exact strict path={['/investment', '/invest']} />
            <MainPool exact strict path="/pool" />
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
        {/* <Route path="/">
                <Redirect to="/invest" />
              </Route> */}
        {/* </Switch> */}
      </SuspenseWithChunkError>
    </Flex>
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
    <Modal title={title} onDismiss={onDismiss} {...props}>
      <ThemeSwitcher isDark={isDark} toggleTheme={toggleTheme} />
      <Toggle onChange={() => toggleHandler('showTip')} />
    </Modal>
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
