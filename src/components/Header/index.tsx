import styled from 'styled-components'
import React, { useEffect, useRef, useState } from 'react'
import { sizeCalculator } from './Links'
import { HeadCircle } from './HeadCircle'
import ChainPriceFeed from './ChainPriceFeed'
import Globe, { GlobeMethods } from 'react-globe.gl'
import earth from 'assets/earth.jpg'
import clouds from 'assets/clouds.png'
import useTheme from 'hooks/useTheme'
import { useLocation } from 'wouter'
import { useHistory } from 'react-router-dom'

const StyledSvg = styled.svg`
  position: relative;
  z-index: 2;
  overflow: visible;
`

type HeaderProps = {}

export const Header: React.FC<HeaderProps> = () => {
  const width = window.innerWidth
  const { half, height, linkArray } = sizeCalculator(width)
  const [, setActive] = useState('/invest')
  const {
    theme: {
      colors: { primary },
    },
  } = useTheme()

  const [pathname] = useLocation()
  const { push } = useHistory()

  const globeEl = useRef<GlobeMethods>()

  useEffect(() => {
    // Auto-rotate
    if (globeEl?.current) {
      // @ts-ignore
      globeEl.current.controls().autoRotate = true
      // @ts-ignore
      globeEl.current.controls().enableZoom = false
    }
  }, [])

  const clickHandler = (path) => {
    push(path)
    setActive(path)
  }

  return (
    <StyledSvg height={height} width={width}>
      <defs>
        <filter id="dropshadow" height="130%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" />
          <feOffset dx="0" dy="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.6" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <polygon
        stroke="rgb(150, 150, 150)"
        strokeDasharray="1 6"
        fill="none"
        points={`${half},0 ${width},${height} 0,${height}`}
      />
      {linkArray.map((item, index) => (
        // @ts-ignore
        <HeadCircle {...item} key={index} active={item.link === pathname} onClick={() => clickHandler(item.link)} />
      ))}
      <foreignObject width="100%" height="10%" y={height - 20}>
        <ChainPriceFeed />
      </foreignObject>
      {pathname.substring(0, 5) === '/home' && (
        <circle
          r={54}
          cy={height / 2 + 25}
          cx={width / 2}
          stroke={primary}
          strokeWidth="6"
          fill="none"
          filter="url(#dropshadow)"
        />
      )}
      <foreignObject height={150} width={150} y={height / 2 - 50} x={width / 2 - 75}>
        <Globe
          ref={globeEl}
          onGlobeClick={(e) => push('/home')}
          backgroundColor="rgba(0,0,0,0)"
          height={150}
          width={150}
          globeImageUrl={earth}
          bumpImageUrl={clouds}
        />
      </foreignObject>
    </StyledSvg>
  )
}
