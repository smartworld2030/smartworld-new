// @ts-nocheck
import React, { useEffect, useRef, useState } from 'react'
import Globe, { GlobeMethods } from 'react-globe.gl'
import earth from 'assets/earth.jpg'
import background from 'assets/background.png'
import pinkBackground from 'assets/pinkBackground.png'
import clouds from 'assets/clouds.png'
import useTheme from 'hooks/useTheme'
import { RelativeFlex } from '@smartworld-libs/uikit'
import { Header } from 'components/Header'

interface GlobeProps {
  height: number
  width: number
}

const ReactGlobe: React.FC<GlobeProps> = ({ height, width }) => {
  const globeEl = useRef<GlobeMethods>()
  const [places, setPlaces] = useState([])
  const [selected, setSelected] = useState('')
  const { isDark } = useTheme()

  useEffect(() => {
    // load data
    fetch('https://vasturiano.github.io/react-globe.gl/example/datasets/ne_110m_populated_places_simple.geojson')
      .then((res) => res.json())
      .then(({ features }) => setPlaces(features))
    // Auto-rotate
    if (globeEl?.current) {
      globeEl.current.controls().autoRotate = true
      globeEl.current.controls().autoRotateSpeed = 0.3
      globeEl.current.pointOfView({ altitude: height / 60 })
      globeEl.current.camera().setViewOffset(100, 100, 0, -(height / 20), 100, 100)
    }
  }, [])

  return (
    <RelativeFlex>
      <Globe
        ref={globeEl}
        height={height}
        width={width}
        globeImageUrl={isDark ? earth : earth}
        bumpImageUrl={clouds}
        backgroundImageUrl={isDark ? background : pinkBackground}
        labelsData={places}
        labelLat={(d) => d.properties.latitude}
        labelLng={(d) => d.properties.longitude}
        labelText={(d) => d.properties.name}
        labelSize={(d) => Math.sqrt(d.properties.pop_max) * 4e-4}
        labelDotRadius={(d) => Math.sqrt(d.properties.pop_max) * 4e-4}
        labelIncludeDot
        labelColor={(d) => (d.properties.name === selected ? 'rgba(255, 0, 0, 1)' : 'rgba(255, 165, 0, 0.75)')}
        labelResolution={2}
        onLabelClick={(d) => {
          globeEl.current.pointOfView(
            {
              lat: d.properties.latitude,
              lng: d.properties.longitude,
              altitude: 3,
            },
            1000,
          )
          globeEl.current.controls().autoRotate = false
          setSelected(d.properties.name)
        }}
        onGlobeClick={() => {
          globeEl.current.controls().autoRotate = true
          globeEl.current.pointOfView({ altitude: 10 }, 1000)
        }}
      />
      <Header width={width} />
    </RelativeFlex>
  )
}

export default ReactGlobe
