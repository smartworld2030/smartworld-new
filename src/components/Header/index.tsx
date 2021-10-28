import styled from 'styled-components'
import React, { useState } from 'react'
import { sizeCalculator } from './Links'
import { HeadCircle } from './HeadCircle'
import { useLocation } from 'react-router-dom'
import ChainPriceFeed from './ChainPriceFeed'

const StyledSvg = styled.svg`
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 2;
`

interface HeaderProps {
  width: number
}

export const Header: React.FC<HeaderProps> = ({ width }) => {
  const { half, quarter, height, linkArray } = sizeCalculator(width)
  const [, setActive] = useState('/invest')
  const { pathname } = useLocation()

  return (
    <StyledSvg height={height + 10} width={width}>
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
      <path
        stroke="rgb(150, 150, 150)"
        strokeDasharray="1 6"
        fill="rgb(0, 0, 0,0.0)"
        d={`M0,${height} C${half - quarter},0 ${half + quarter},0 ${width},${height}`}
      />
      {linkArray.map((item, index) => (
        <HeadCircle {...item} key={index} active={item.link === pathname} onClick={() => setActive(item.link)} />
      ))}
      <foreignObject width="100%" height="10%" y={height - 10}>
        <ChainPriceFeed />
      </foreignObject>
    </StyledSvg>
  )
}
