import React, { useState } from 'react'
import { Text, Toggle, Flex, InjectedModalProps } from '@smartworld-libs/uikit'
import { useExpertModeManager, useUserSingleHopOnly } from 'state/user/hooks'
import { useTranslation } from 'contexts/Localization'
import { useSwapActionHandlers } from 'state/swap/hooks'
import usePersistState from 'hooks/usePersistState'
import QuestionHelper from '../../QuestionHelper'
import TransactionSettings from './TransactionSettings'
import ExpertModal from './ExpertModal'

const SettingsModal: React.FC<InjectedModalProps> = ({ onDismiss }) => {
  const [showConfirmExpertModal, setShowConfirmExpertModal] = useState(false)
  const [rememberExpertModeAcknowledgement, setRememberExpertModeAcknowledgement] = usePersistState(false, {
    localStorageKey: 'pancake_expert_mode_remember_acknowledgement',
  })
  const [expertMode, toggleExpertMode] = useExpertModeManager()
  const [singleHopOnly, setSingleHopOnly] = useUserSingleHopOnly()
  const { onChangeRecipient } = useSwapActionHandlers()

  const { t } = useTranslation()

  if (showConfirmExpertModal) {
    return (
      <ExpertModal
        setShowConfirmExpertModal={setShowConfirmExpertModal}
        onDismiss={onDismiss}
        setRememberExpertModeAcknowledgement={setRememberExpertModeAcknowledgement}
      />
    )
  }

  const handleExpertModeToggle = () => {
    if (expertMode) {
      onChangeRecipient(null)
      toggleExpertMode()
    } else if (rememberExpertModeAcknowledgement) {
      onChangeRecipient(null)
      toggleExpertMode()
    } else {
      setShowConfirmExpertModal(true)
    }
  }

  return (
    <Flex flexDirection="column" width="300px">
      <TransactionSettings />
      <Flex justifyContent="space-between" alignItems="center" mb="24px">
        <Flex alignItems="center">
          <Text>{t('Expert Mode')}</Text>
          <QuestionHelper
            text={t('Bypasses confirmation modals and allows high slippage trades. Use at your own risk.')}
            ml="4px"
          />
        </Flex>
        <Toggle id="toggle-expert-mode-button" scale="md" checked={expertMode} onChange={handleExpertModeToggle} />
      </Flex>
      <Flex justifyContent="space-between" alignItems="center" mb="24px">
        <Flex alignItems="center">
          <Text>{t('Disable Multihops')}</Text>
          <QuestionHelper text={t('Restricts swaps to direct pairs only.')} ml="4px" />
        </Flex>
        <Toggle
          id="toggle-disable-multihop-button"
          checked={singleHopOnly}
          scale="md"
          onChange={() => {
            setSingleHopOnly(!singleHopOnly)
          }}
        />
      </Flex>
    </Flex>
  )
}

export default SettingsModal
