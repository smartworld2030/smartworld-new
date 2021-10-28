import { BrowserRouter as Router } from 'react-router-dom'
import Globe from 'components/Globe/Globe'
import AppRouter from 'router'
import { useWindowSize } from 'hooks/useWindowsSize'
import { RelativeFlex } from '@smartworld-libs/uikit'
import { useState } from 'react'

const App = () => {
  const [globeHeight, setGlobeHeight] = useState(0)
  const { width } = useWindowSize()

  return (
    <Router>
      <RelativeFlex justifyContent="center" alignContent="center" flexDirection="column">
        <AppRouter globeHeight={setGlobeHeight} />
        {globeHeight && <Globe height={globeHeight} width={width} />}
      </RelativeFlex>
    </Router>
  )
}

export default App
