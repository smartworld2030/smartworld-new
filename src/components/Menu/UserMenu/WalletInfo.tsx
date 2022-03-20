import {
  Box,
  Button,
  connectorLocalStorageKey,
  Flex,
  InjectedModalProps,
  LinkExternal,
  Message,
  Text,
} from '@smartworld-libs/uikit'
import { useWeb3React } from '@web3-react/core'
import useAuth from 'hooks/useAuth'
import { useTranslation } from 'contexts/Localization'
import { getBscScanLink } from 'utils'
import CopyAddress from './CopyAddress'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useUserSmartTokenBalances } from 'state/wallet/hooks'

interface WalletInfoProps {
  hasLowBnbBalance: boolean
  onDismiss: InjectedModalProps['onDismiss']
}

const WalletInfo: React.FC<WalletInfoProps> = ({ hasLowBnbBalance, onDismiss }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const {
    balances: { STTS, BNB },
    loading,
  } = useUserSmartTokenBalances()

  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    window.localStorage.removeItem(connectorLocalStorageKey)
    onDismiss()
  }

  return !account ? (
    <ConnectWalletButton />
  ) : (
    <Flex flexDirection="column" pt="10px" height="100%" justifyContent="space-between">
      <Text color="secondary" fontSize="12px" textTransform="uppercase" fontWeight="bold" mb="8px">
        {t('Your Address')}
      </Text>
      <CopyAddress account={account} mb="24px" />
      {hasLowBnbBalance && (
        <Message variant="warning" mb="24px">
          <Box>
            <Text fontWeight="bold">{t('BNB Balance Low')}</Text>
            <Text as="p">{t('You need BNB for transaction fees.')}</Text>
          </Box>
        </Message>
      )}
      <Flex alignItems="center" justifyContent="space-between">
        <Text color="textSubtle">{t('BNB Balance')}</Text>
        {loading ? 'Loading...' : <Text>{BNB.toSignificant(6)}</Text>}
      </Flex>
      <Flex alignItems="center" justifyContent="space-between" mb="24px">
        <Text color="textSubtle">{t('STTS Balance')}</Text>
        {loading ? 'Loading...' : <Text>{STTS.toSignificant(2)}</Text>}
      </Flex>
      <Flex alignItems="center" justifyContent="end" mb="24px">
        <LinkExternal href={getBscScanLink(account, 'address')}>{t('View on BscScan')}</LinkExternal>
      </Flex>
      <Button variant="secondary" width="100%" onClick={handleLogout}>
        {t('Disconnect Wallet')}
      </Button>
    </Flex>
  )
}

export default WalletInfo
