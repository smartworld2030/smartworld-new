import styled from 'styled-components'
import React, { useState } from 'react'
import { sizeCalculator } from './Links'
import { HeadCircle } from './HeadCircle'
import { useLocation, useHistory } from 'react-router-dom'
import ChainPriceFeed from './ChainPriceFeed'

const StyledSvg = styled.svg`
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 2;
  overflow: visible;
`

interface HeaderProps {
  width: number
}

export const Header: React.FC<HeaderProps> = ({ width }) => {
  const { half, height, linkArray } = sizeCalculator(width)
  const [, setActive] = useState('/invest')
  const {
    push,
    location: { pathname },
  } = useHistory()

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
    </StyledSvg>
  )
}
