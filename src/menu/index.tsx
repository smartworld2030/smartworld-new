import { BoxProps, ThemeSwitcher, Toggle } from '@smartworld-libs/uikit'
import { InjectedProps } from '@smartworld-libs/uikit/dist/widgets/Modal/types'
import useTheme from 'hooks/useTheme'
import SettingsModal from 'components/Menu/GlobalSettings/SettingsModal'
import { useLocation } from 'react-router-dom'

export interface ModalProps extends InjectedProps, BoxProps {
  title: string
  hideCloseButton?: boolean
  onBack?: () => void
  bodyPadding?: string
  headerBackground?: string
  minWidth?: string
  toggleHandler: (item: string) => void
}

const GlobalMenuModal: React.FC<ModalProps> = ({ title, toggleHandler, onDismiss }) => {
  const { isDark, toggleTheme } = useTheme()
  const { pathname } = useLocation()
  return (
    <>
      {pathname === '/swap' && <SettingsModal />}
      <ThemeSwitcher isDark={isDark} toggleTheme={toggleTheme} />
      <Toggle onChange={() => toggleHandler('showTip')} />
    </>
  )
}

export default GlobalMenuModal
