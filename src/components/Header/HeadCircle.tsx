import { PolygonButton } from '@smartworld-libs/uikit'
import { Scale } from '@smartworld-libs/uikit/dist/components/Button/types'
import { Link } from 'react-router-dom'

interface HeadCircleProps {
  positionX: number
  positionY: number
  textPos: number
  size: Scale
  number: number
  text: string
  link: string
  onClick: () => void
  active: boolean
  icon: (arg: number) => JSX.Element
}

export const HeadCircle: React.FC<HeadCircleProps> = ({
  positionX,
  positionY,
  size,
  onClick,
  active,
  text,
  link,
  icon,
}) => {
  return (
    <foreignObject x={positionX} y={positionY} width="1" height="1" overflow="visible">
      <PolygonButton
        color={active ? undefined : 'white'}
        scale={size}
        onClick={onClick}
        // @ts-ignore
        to={link}
        icon={(w) => (text ? <p style={{ fontSize: 8, textDecoration: 'none' }}>{text}</p> : icon(w / 3))}
      ></PolygonButton>
    </foreignObject>
  )
}
