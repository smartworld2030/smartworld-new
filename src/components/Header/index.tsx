import styled from 'styled-components'
import React, { useEffect, useRef, useState } from 'react'
import { sizeCalculator } from './Links'
import { HeadCircle } from './HeadCircle'
import { useHistory } from 'react-router-dom'
import ChainPriceFeed from './ChainPriceFeed'
import Globe, { GlobeMethods } from 'react-globe.gl'
import earth from 'assets/earth.jpg'
import clouds from 'assets/clouds.png'

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
    push,
    location: { pathname },
  } = useHistory()

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
        <filter id="greyscale">
          <feColorMatrix
            type="matrix"
            values=".33 .33 .33 0 0
           .33 .33 .33 0 0
           .33 .33 .33 0 0
           0 0 0 1 0"
          ></feColorMatrix>
        </filter>
        <filter id="dropshadow" height="130%">
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="green" />
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
      <foreignObject height={150} width={150} y={height / 2 - 50} x={width / 2 - 75}>
        <Globe
          ref={globeEl}
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
