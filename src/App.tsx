import { BrowserRouter as Router } from 'react-router-dom'
import AppRouter from 'router'
import { useWindowSize } from 'hooks/useWindowsSize'
import { Flex, Spinner } from '@smartworld-libs/uikit'

const App = () => {
  const { height, width } = useWindowSize()
  const isMobile = width > 768 ? false : true
  const globeHeight = height * 0.6
  return height && width ? (
    <Router>
      {/* <Header width={width} />
      <Globe height={globeHeight} width={width} /> */}
      <AppRouter isMobile={isMobile} width={width} height={height - globeHeight} />
    </Router>
  ) : (
    <Flex width="100vw" height="100vh" justifyContent="center" alignItems="center">
      <Spinner />
    </Flex>
  )
}

export default App
