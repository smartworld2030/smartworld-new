import styled from 'styled-components'
import { Text, Flex, Heading, IconButton, ArrowBackIcon, NotificationDot } from '@smartworld-libs/uikit'
import { Link } from 'react-router-dom'
import QuestionHelper from '../QuestionHelper'

interface Props {
  title: string
  subtitle?: string
  helper?: string
  backTo?: string
  noConfig?: boolean
}

const AppHeaderContainer = styled(Flex)`
  justify-content: space-between;
  align-items: baseline;
  padding: 4px 16px;
  margin-top: 4px;
  width: 100%;
  max-width: 436px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.textSubtle};
  background-color: ${({ theme }) => theme.colors.tertiary};
  border-radius: 2px 2px 0 0;
`

const AppHeader: React.FC<Props> = ({ title, subtitle, helper, backTo, noConfig = false }) => {
  return (
    <AppHeaderContainer>
      <Flex alignItems="center" mr={noConfig ? 0 : '16px'}>
        {backTo && (
          <IconButton as={Link} to={backTo}>
            <ArrowBackIcon width="32px" />
          </IconButton>
        )}
        <Flex flexDirection="column">
          <Heading as="h2" mb="8px">
            {title}
          </Heading>
          <Flex alignItems="center">
            {helper && <QuestionHelper text={helper} mr="4px" />}
            <Text color="textSubtle" fontSize="14px">
              {subtitle}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </AppHeaderContainer>
  )
}

export default AppHeader
