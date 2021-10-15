import { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { CurrencyAmount, JSBI, Token, Trade } from '@pancakeswap/sdk'
import {
  Button,
  Text,
  ArrowDownIcon,
  useModal,
  Flex,
  NotificationDot,
  ChildrenProps,
  useWindowSize,
  MainFlex,
  MainComp,
  Skeleton,
  MainRoute,
} from '@smartworld-libs/uikit'
import { useIsTransactionUnsupported } from 'hooks/Trades'
import UnsupportedCurrencyFooter from 'components/UnsupportedCurrencyFooter'
import { RouteComponentProps, RouteProps, useHistory } from 'react-router'
import { useTranslation } from 'contexts/Localization'
import SwapWarningTokens from 'config/constants/swapWarningTokens'
import { getAddress } from 'utils/addressHelpers'
import AddressInputPanel from './components/AddressInputPanel'
import { GreyCard } from 'components/Card'
import { AutoColumn } from 'components/Layout/Column'
import ConfirmSwapModal from './components/ConfirmSwapModal'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { AutoRow, RowBetween } from 'components/Layout/Row'
import AdvancedSwapDetailsDropdown, { AdvancedDetails } from './components/AdvancedSwapDetailsDropdown'
import confirmPriceImpactWithoutFee from './components/confirmPriceImpactWithoutFee'
import { ArrowWrapper, SwapCallbackError, Wrapper } from './components/styleds'
import TradePrice from './components/TradePrice'
import ImportTokenWarningModal from './components/ImportTokenWarningModal'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { INITIAL_ALLOWED_SLIPPAGE } from 'config/constants'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCurrency, useAllTokens } from 'hooks/Tokens'
import { ApprovalState, useApproveCallbackFromTrade } from 'hooks/useApproveCallback'
import { useSwapCallback } from 'hooks/useSwapCallback'
import useWrapCallback, { WrapType } from 'hooks/useWrapCallback'
import { Field } from 'state/swap/actions'
import { useDefaultsFromURLSearch, useDerivedSwapInfo, useSwapActionHandlers, useSwapState } from 'state/swap/hooks'
import { useExpertModeManager, useUserSlippageTolerance, useUserSingleHopOnly } from 'state/user/hooks'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import { computeTradePriceBreakdown, warningSeverity } from 'utils/prices'
import CircleLoader from 'components/Loader/CircleLoader'
import SwapWarningModal from './components/SwapWarningModal'
import { Row } from 'react-grid-system'
import GlobalSettings from 'components/Menu/GlobalSettings'
import Transactions from 'components/App/Transactions'

const Label = styled(Text)`
  font-size: 12px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.secondary};
`

export default function Swap(props: RouteProps) {
  const history = useHistory()
  const { isMobile, isTablet, flexSize } = useWindowSize()
  const loadedUrlParams = useDefaultsFromURLSearch()
  const [setting, setSetting] = useState(null)

  const { t } = useTranslation()
  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId),
  ]
  const urlLoadedTokens: Token[] = useMemo(
    () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c instanceof Token) ?? [],
    [loadedInputCurrency, loadedOutputCurrency],
  )

  // dismiss warning if all imported tokens are in active lists
  const defaultTokens = useAllTokens()
  const importTokensNotInDefault =
    urlLoadedTokens &&
    urlLoadedTokens.filter((token: Token) => {
      return !(token.address in defaultTokens)
    })

  const { account } = useActiveWeb3React()

  // for expert mode
  const [isExpertMode] = useExpertModeManager()

  // get custom setting values for user
  const [allowedSlippage] = useUserSlippageTolerance()

  // swap state
  const { independentField, typedValue, recipient } = useSwapState()
  const { v2Trade, currencyBalances, parsedAmount, currencies, inputError: swapInputError } = useDerivedSwapInfo()

  const { wrapType, execute: onWrap, inputError: wrapInputError } = useWrapCallback(
    currencies[Field.INPUT],
    currencies[Field.OUTPUT],
    typedValue,
  )
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
  const trade = showWrap ? undefined : v2Trade

  const parsedAmounts = showWrap
    ? {
        [Field.INPUT]: parsedAmount,
        [Field.OUTPUT]: parsedAmount,
      }
    : {
        [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
        [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
      }

  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useSwapActionHandlers()
  const isValid = !swapInputError
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput],
  )
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value)
    },
    [onUserInput],
  )

  // modal and loading
  const [{ tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    tradeToConfirm: Trade | undefined
    attemptingTxn: boolean
    swapErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined,
  })

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  const route = trade?.route
  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0)),
  )
  const noRoute = !route

  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallbackFromTrade(trade, allowedSlippage)

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT])

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(trade, allowedSlippage, recipient)

  const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade)

  const [singleHopOnly] = useUserSingleHopOnly()

  const handleSwap = useCallback(() => {
    if (priceImpactWithoutFee && !confirmPriceImpactWithoutFee(priceImpactWithoutFee)) {
      return
    }
    if (!swapCallback) {
      return
    }
    setSwapState({
      attemptingTxn: true,
      tradeToConfirm,
      swapErrorMessage: undefined,
      txHash: undefined,
    })
    swapCallback()
      .then((hash) => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          swapErrorMessage: undefined,
          txHash: hash,
        })
      })
      .catch((error) => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          swapErrorMessage: error.message,
          txHash: undefined,
        })
      })
  }, [priceImpactWithoutFee, swapCallback, tradeToConfirm])

  // errors
  const [showInverted, setShowInverted] = useState<boolean>(false)

  // warnings on slippage
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED)) &&
    !(priceImpactSeverity > 3 && !isExpertMode)

  const handleConfirmDismiss = useCallback(() => {
    setSwapState({ tradeToConfirm, attemptingTxn, swapErrorMessage, txHash })
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '')
    }
  }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash])

  const handleAcceptChanges = useCallback(() => {
    setSwapState({
      tradeToConfirm: trade,
      swapErrorMessage,
      txHash,
      attemptingTxn,
    })
  }, [attemptingTxn, swapErrorMessage, trade, txHash])

  // swap warning state
  const [swapWarningCurrency, setSwapWarningCurrency] = useState(null)
  const [onPresentSwapWarningModal] = useModal(<SwapWarningModal swapCurrency={swapWarningCurrency} />)

  const shouldShowSwapWarning = (swapCurrency) => {
    const isWarningToken = Object.entries(SwapWarningTokens).find((warningTokenConfig) => {
      const warningTokenData = warningTokenConfig[1]
      const warningTokenAddress = getAddress(warningTokenData.address)
      return swapCurrency.address === warningTokenAddress
    })
    return Boolean(isWarningToken)
  }

  useEffect(() => {
    if (swapWarningCurrency) {
      onPresentSwapWarningModal()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [swapWarningCurrency])

  const handleInputSelect = useCallback(
    (inputCurrency) => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, inputCurrency)
      const showSwapWarning = shouldShowSwapWarning(inputCurrency)
      if (showSwapWarning) {
        setSwapWarningCurrency(inputCurrency)
      } else {
        setSwapWarningCurrency(null)
      }
    },
    [onCurrencySelection],
  )

  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      onUserInput(Field.INPUT, maxAmountInput.toExact())
    }
  }, [maxAmountInput, onUserInput])

  const handleOutputSelect = useCallback(
    (outputCurrency) => {
      onCurrencySelection(Field.OUTPUT, outputCurrency)
      const showSwapWarning = shouldShowSwapWarning(outputCurrency)
      if (showSwapWarning) {
        setSwapWarningCurrency(outputCurrency)
      } else {
        setSwapWarningCurrency(null)
      }
    },

    [onCurrencySelection],
  )

  const swapIsUnsupported = useIsTransactionUnsupported(currencies?.INPUT, currencies?.OUTPUT)

  const [onPresentImportTokenWarningModal] = useModal(
    <ImportTokenWarningModal tokens={importTokensNotInDefault} onCancel={() => history.push('/swap/')} />,
  )

  useEffect(() => {
    if (importTokensNotInDefault.length > 0) {
      onPresentImportTokenWarningModal()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importTokensNotInDefault.length])

  const [expertMode] = useExpertModeManager()

  const [onPresentConfirmModal] = useModal(
    <ConfirmSwapModal
      trade={trade}
      originalTrade={tradeToConfirm}
      onAcceptChanges={handleAcceptChanges}
      attemptingTxn={attemptingTxn}
      txHash={txHash}
      recipient={recipient}
      allowedSlippage={allowedSlippage}
      onConfirm={handleSwap}
      swapErrorMessage={swapErrorMessage}
      customOnDismiss={handleConfirmDismiss}
    />,
    true,
    true,
    'confirmSwapModal',
  )

  const Currency = () => (
    <Row style={{ width: isMobile ? '100%' : '80%' }} direction={isMobile ? 'row' : 'column'}>
      <CurrencyInputPanel
        label={independentField === Field.OUTPUT && !showWrap && trade ? t('From (estimated)') : t('From')}
        value={formattedAmounts[Field.INPUT]}
        showMaxButton
        currency={currencies[Field.INPUT]}
        onUserInput={handleTypeInput}
        onMax={handleMaxInput}
        onCurrencySelect={handleInputSelect}
        otherCurrency={currencies[Field.OUTPUT]}
        hideBalance
        id="swap-currency-input"
      />
      <AutoColumn justify="space-between">
        <Row justify="between" align="center" direction={isMobile ? 'column' : 'row'}>
          <NotificationDot show={expertMode}>
            <GlobalSettings setModal={setSetting} />
          </NotificationDot>
          <ArrowWrapper
            clickable
            rotate={isMobile ? '270deg' : undefined}
            onClick={() => {
              setApprovalSubmitted(false) // reset 2 step UI for approvals
              onSwitchTokens()
            }}
          >
            <ArrowDownIcon
              width="16px"
              color={currencies[Field.INPUT] && currencies[Field.OUTPUT] ? 'primary' : 'text'}
            />
          </ArrowWrapper>
          <Transactions />
        </Row>
      </AutoColumn>
      <CurrencyInputPanel
        value={formattedAmounts[Field.OUTPUT]}
        onUserInput={handleTypeOutput}
        label={independentField === Field.INPUT && !showWrap && trade ? t('To (estimated)') : t('To')}
        currency={currencies[Field.OUTPUT]}
        onCurrencySelect={handleOutputSelect}
        otherCurrency={currencies[Field.INPUT]}
        disabledKnob
        hideBalance
        id="swap-currency-output"
      />
    </Row>
  )

  const Prices = () => (
    <AutoColumn gap="8px" justify="center" style={{ padding: '16px' }}>
      {swapIsUnsupported && <UnsupportedCurrencyFooter currencies={[currencies.INPUT, currencies.OUTPUT]} />}
      {Boolean(trade) && (
        <TradePrice price={trade?.executionPrice} showInverted={showInverted} setShowInverted={setShowInverted} />
      )}
      {allowedSlippage !== INITIAL_ALLOWED_SLIPPAGE && (
        <RowBetween align="center">
          <Label>{t('Slippage Tolerance')}</Label>
          <Text bold color="primary">
            {allowedSlippage / 100}%
          </Text>
        </RowBetween>
      )}
    </AutoColumn>
  )

  const SwapButton = () => (
    <Button
      shape="circle"
      scale="lg"
      variant={isValid && priceImpactSeverity > 2 && !swapCallbackError ? 'danger' : 'primary'}
      onClick={() => {
        if (isExpertMode) {
          handleSwap()
        } else {
          setSwapState({
            tradeToConfirm: trade,
            attemptingTxn: false,
            swapErrorMessage: undefined,
            txHash: undefined,
          })
          onPresentConfirmModal()
        }
      }}
      disabled={!isValid || (priceImpactSeverity > 3 && !isExpertMode) || !!swapCallbackError}
    >
      {swapInputError ||
        (priceImpactSeverity > 3 && !isExpertMode
          ? `Price Impact Too High`
          : priceImpactSeverity > 2
          ? t('Swap Anyway')
          : t('Swap'))}
    </Button>
  )
  return (
    <MainRoute {...props}>
      <MainFlex {...{ flex: 6, md: 12, sm: 12, xs: 12 }}>
        <MainComp
          tip="Withdraw Circle"
          flex={2}
          justifyContent="space-around"
          alignItems="center"
          tipSize={3}
          demo={<Skeleton size={isMobile ? flexSize * 3.5 : isTablet ? flexSize * 2.5 : flexSize * 2} />}
        >
          <Currency />
        </MainComp>
      </MainFlex>
      <MainFlex {...{ flex: 6, md: 12, sm: 12, xs: 12 }}>
        <MainComp
          tip="Withdraw Circle"
          flex={2}
          justifyContent="space-around"
          alignItems="center"
          tipSize={3}
          demo={<Skeleton size={isMobile ? flexSize * 3.5 : isTablet ? flexSize * 2.5 : flexSize * 2} />}
        >
          <div>{!showWrap && <Prices />}</div>
          <div>{setting && setting}</div>
        </MainComp>
      </MainFlex>
      <MainFlex {...{ flex: 6, md: 12, sm: 12, xs: 12 }}>
        <MainComp
          tip="Withdraw Circle"
          flex={4}
          justifyContent="space-around"
          alignItems="center"
          tipSize={3}
          demo={<Skeleton size={isMobile ? flexSize * 3.5 : isTablet ? flexSize * 2.5 : flexSize * 2} />}
        >
          {' '}
          {swapIsUnsupported ? (
            <Button shape="circle" scale="lg" width="300px" disabled mb="4px">
              {t('Unsupported Asset')}
            </Button>
          ) : !account ? (
            <ConnectWalletButton shape="circle" />
          ) : showWrap ? (
            <Button shape="circle" scale="lg" width="300px" disabled={Boolean(wrapInputError)} onClick={onWrap}>
              {wrapInputError ?? (wrapType === WrapType.WRAP ? 'Wrap' : wrapType === WrapType.UNWRAP ? 'Unwrap' : null)}
            </Button>
          ) : noRoute && userHasSpecifiedInputOutput ? (
            <GreyCard style={{ textAlign: 'center' }}>
              <Text color="textSubtle" mb="4px">
                {t('Insufficient liquidity for this trade.')}
              </Text>
              {singleHopOnly && (
                <Text color="textSubtle" mb="4px">
                  {t('Try enabling multi-hop trades.')}
                </Text>
              )}
            </GreyCard>
          ) : showApproveFlow ? (
            <Flex width="60%" margin="auto" justifyContent="space-between">
              <Button
                shape="circle"
                scale="lg"
                width="300px"
                variant={approval === ApprovalState.APPROVED ? 'success' : 'primary'}
                onClick={approveCallback}
                disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
              >
                {approval === ApprovalState.PENDING ? (
                  <AutoRow gap="6px" justify="center">
                    {t('Enabling')} <CircleLoader stroke="white" />
                  </AutoRow>
                ) : approvalSubmitted && approval === ApprovalState.APPROVED ? (
                  t('Enabled')
                ) : (
                  t('Enable %asset%', {
                    asset: currencies[Field.INPUT]?.symbol ?? '',
                  })
                )}
              </Button>
              <Button
                shape="circle"
                scale="lg"
                width="300px"
                variant={isValid && priceImpactSeverity > 2 ? 'danger' : 'primary'}
                onClick={() => {
                  if (isExpertMode) {
                    handleSwap()
                  } else {
                    setSwapState({
                      tradeToConfirm: trade,
                      attemptingTxn: false,
                      swapErrorMessage: undefined,
                      txHash: undefined,
                    })
                    onPresentConfirmModal()
                  }
                }}
                id="swap-button"
                disabled={!isValid || approval !== ApprovalState.APPROVED || (priceImpactSeverity > 3 && !isExpertMode)}
              >
                {priceImpactSeverity > 3 && !isExpertMode
                  ? t('Price Impact High')
                  : priceImpactSeverity > 2
                  ? t('Swap Anyway')
                  : t('Swap')}
              </Button>
            </Flex>
          ) : (
            <SwapButton />
          )}
        </MainComp>
      </MainFlex>
    </MainRoute>
  )
}
