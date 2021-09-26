import { UserMenu } from '@smartworld-libs/uikit'
import { useWeb3React } from '@web3-react/core'
import ConnectWalletButton from 'components/ConnectWalletButton'

interface UserMenuProps {
  toggleHandler?: (item: string) => void
}

const UserMenuComponent: React.FC<UserMenuProps> = ({ toggleHandler }) => {
  const { account } = useWeb3React()

  if (!account) {
    return <ConnectWalletButton scale="sm" />
  }

  return <UserMenu variant="default" account={account} onClick={() => toggleHandler('showUser')} />
}

export default UserMenuComponent
