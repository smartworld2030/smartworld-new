import useAuth from 'hooks/useAuth'
import { useTranslation } from 'contexts/Localization'
import { Button, useWalletModal } from '@smartworld-libs/uikit'

const ConnectWalletButton = (props) => {
  const { t } = useTranslation()
  const { login, logout } = useAuth()
  const { onPresentConnectModal } = useWalletModal(login, logout)

  return (
    <Button onClick={onPresentConnectModal} variant="tertiary" scale="xl" {...props}>
      {t('Connect')}
    </Button>
  )
}

export default ConnectWalletButton
