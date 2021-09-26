import React, { useEffect, useRef } from 'react'
import Globe, { GlobeMethods } from 'react-globe.gl'
import earth from 'assets/earth.jpg'
import pinkEarth from 'assets/pinkEarth.jpg'
import background from 'assets/background.png'
import whiteBackground from 'assets/whiteBackground.png'
import pinkBackground from 'assets/pinkBackground.png'
import clouds from 'assets/clouds.png'
import useTheme from 'hooks/useTheme'

interface GlobeProps {
  height: number
  width: number
}

const ReactGlobe: React.FC<GlobeProps> = ({ height, width }) => {
  const globeEl = useRef<GlobeMethods>()
  const { isDark } = useTheme()

  useEffect(() => {
    // Auto-rotate
    if (globeEl?.current) {
      // @ts-ignore
      globeEl.current.controls().autoRotate = true
      // @ts-ignore
      globeEl.current.controls().autoRotateSpeed = 0.3
      globeEl.current.camera().setViewOffset(100, 100, 0, -18, 100, 100)
    }
  }, [])

  return (
    <Globe
      ref={globeEl}
      height={height}
      width={width}
      globeImageUrl={isDark ? earth : earth}
      bumpImageUrl={clouds}
      backgroundImageUrl={isDark ? background : pinkBackground}
      enablePointerInteraction={false}
    />
  )
}

export default ReactGlobe
