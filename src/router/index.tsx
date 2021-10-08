import React, { useMemo, useState } from 'react'
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
import MainSwap from 'components/Swap'
import WalletModal, { WalletView } from 'components/Menu/UserMenu/WalletModal'
import { useERC20 } from 'hooks/useContract'
import ConnectWalletButton from 'components/ConnectWalletButton'
import holders from '../holderaccounts'
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

export const AppRouter: React.FC<AppRouterProps> = ({ width }) => {
  usePollBlockNumber()
  useEagerConnect()

  const STTS = useERC20('0x88469567A9e6b2daE2d8ea7D8C77872d9A0d43EC')
  const [account, setAccount] = useState('')
  const [inputData, setInputData] = useState('')
  const [value, setValue] = useState(0)
  const [check, setCheck] = useState({})

  const sendStts = () => STTS.functions.transfer(account, value * 10 ** 8)

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
    <Flex width="100%" height="100%" flexDirection="column">
      <GlobalStyle />
      <Flex width="100%" height="25px">
        <input
          type="text"
          style={{ width: '70%' }}
          onInput={(d) => setInputData(d.currentTarget.value)}
          defaultValue={inputData}
        />
        <button onClick={() => setAccount(inputData)}>Search</button>
        <input
          type="number"
          style={{ width: '30%' }}
          onInput={(d) => setValue(d.currentTarget.valueAsNumber)}
          defaultValue={value.toString()}
        />
        <button onClick={sendStts}>Send</button>
      </Flex>
      <Flex>
        <Flex width="50%" height="93vh" overflowY="scroll" flexDirection="column">
          <MainInvestment exact strict path={['/investment', '/invest']} account={account} />
        </Flex>
        <Flex width="50%" height="93vh" overflowY="scroll" flexDirection="column" borderLeft="2px solid white">
          {holders.map((h, i) => (
            <Flex alignItems="baseline" key={i}>
              {i}-
              <input
                type="checkbox"
                value={check[i]}
                onClick={() => setCheck((prev) => ({ ...prev, [i]: !prev[i] }))}
              />{' '}
              <p
                onClick={() => {
                  setAccount(h)
                  setInputData(h)
                }}
                style={{ cursor: 'pointer' }}
              >
                {h}
              </p>
            </Flex>
          ))}
        </Flex>
      </Flex>
      <ConnectWalletButton />

      {/* <SuspenseWithChunkError fallback={<PageLoader />}>
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
            right={useMemo(
              () => ({ isMobile, isTablet, toggle: { showRight }, responsiveSize }) => (
                <AnimatedTipFlex
                  {...responsiveSize(isMobile ? 5.5 : isTablet ? 6 : 3, showRight)}
                  flexDirection="column"
                  justifyContent="space-around"
                >
                  <WalletModal initialView={WalletView.WALLET_INFO} />
                </AnimatedTipFlex>
              ),
              [],
            )}
            left={useMemo(
              () => ({ isMobile, isTablet, toggle: { showLeft }, responsiveSize, tipChanger }) => (
                <AnimatedTipFlex
                  {...responsiveSize(isMobile ? 5.5 : isTablet ? 6 : 3, showLeft)}
                  flexDirection={isMobile ? 'row' : 'column'}
                  justifyContent="space-around"
                >
                  <GlobalMenuModal title="Setting" toggleHandler={tipChanger} />
                </AnimatedTipFlex>
              ),
              [],
            )}
          >
            <MainPool exact strict path="/pool" />
            <MainSwap exact strict path="/swap" />
          </MainSection>
          <Route exact path={['/', '']}>
            <Redirect to="/invest" />
          </Route>
        </Switch> */}

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
      {/* </SuspenseWithChunkError> */}
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
    <>
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
