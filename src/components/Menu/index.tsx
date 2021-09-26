import { Menu as UikitMenu } from '@smartworld-libs/uikit'
import { languageList } from 'config/localization/languages'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import UserMenu from './UserMenu'
import GlobalSettings from './GlobalSettings'

const Menu = (props) => {
  const { isDark, toggleTheme } = useTheme()
  const { currentLanguage, setLanguage } = useTranslation()

  return (
    <UikitMenu
      userMenu={<UserMenu />}
      globalMenu={<GlobalSettings setModal={<a />} />}
      isDark={isDark}
      toggleTheme={toggleTheme}
      currentLang={currentLanguage.code}
      langs={languageList}
      setLang={setLanguage}
      {...props}
    />
  )
}

export default Menu
