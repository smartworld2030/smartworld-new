import { Flex, IconButton, CogIcon } from '@smartworld-libs/uikit'
import SettingsModal from './SettingsModal'

const GlobalSettings = ({ setModal }) => {
  return (
    <Flex>
      <IconButton
        onClick={() => setModal((prev) => (prev === null ? <SettingsModal /> : null))}
        variant="text"
        scale="sm"
      >
        <CogIcon height={22} width={22} color="textSubtle" />
      </IconButton>
    </Flex>
  )
}

export default GlobalSettings
