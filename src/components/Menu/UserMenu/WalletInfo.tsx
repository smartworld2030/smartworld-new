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
import useTokenBalance, { useGetBnbBalance } from 'hooks/useTokenBalance'
import { getSttAddress, getSttsAddress } from 'utils/addressHelpers'
import useAuth from 'hooks/useAuth'
import { useTranslation } from 'contexts/Localization'
import { getBscScanLink } from 'utils'
import { getFullDisplayBalance } from 'utils/formatBalance'
import CopyAddress from './CopyAddress'

interface WalletInfoProps {
  hasLowBnbBalance: boolean
  onDismiss: InjectedModalProps['onDismiss']
}

const WalletInfo: React.FC<WalletInfoProps> = ({ hasLowBnbBalance, onDismiss }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { balance } = useGetBnbBalance()
  const { balance: sttBalance } = useTokenBalance(getSttAddress())
  const { balance: sttsBalance } = useTokenBalance(getSttsAddress())
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    window.localStorage.removeItem(connectorLocalStorageKey)
    onDismiss()
  }

  return (
    <>
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
        <Text>{getFullDisplayBalance(balance, 18, 6)}</Text>
      </Flex>
      <Flex alignItems="center" justifyContent="space-between">
        <Text color="textSubtle">{t('STT Balance')}</Text>
        <Text>{getFullDisplayBalance(sttBalance, 8, 2)}</Text>
      </Flex>
      <Flex alignItems="center" justifyContent="space-between" mb="24px">
        <Text color="textSubtle">{t('STTS Balance')}</Text>
        <Text>{getFullDisplayBalance(sttsBalance, 8, 2)}</Text>
      </Flex>
      <Flex alignItems="center" justifyContent="end" mb="24px">
        <LinkExternal href={getBscScanLink(account, 'address')}>{t('View on BscScan')}</LinkExternal>
      </Flex>
      <Button variant="secondary" width="100%" onClick={handleLogout}>
        {t('Disconnect Wallet')}
      </Button>
    </>
  )
}

export default WalletInfo
