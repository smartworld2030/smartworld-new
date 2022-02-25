import { GroupProps, ThreeEvent } from '@react-three/fiber'
import { CSSProperties, ReactText } from 'react'
import { Color, ColorRepresentation, Mesh } from 'three'

export interface FrameChildProps {
  onClick: (arg: any) => void
}

export interface FrameChildStyles extends CSSProperties {
  width: ReactText
  height: ReactText
}

export interface FiberProps {
  width?: ReactText
  height?: ReactText
  elements: Elements[] | []
  fallback?: JSX.Element
  backgroundColor?: ColorRepresentation
}

export interface Elements extends GroupProps {
  name: string
  element: (props: FrameChildProps, styles: FrameChildStyles) => JSX.Element
  elementStyle?: CSSProperties
}

export interface FramesProps {
  setEnabled: (arg: boolean) => void
  elements: Elements[]
  enabled: boolean
  rotate: boolean
}

export interface FrameProps extends Elements {
  clicked: boolean
  clickHandler?: (e: Mesh) => void
  rotate: boolean
  c?: Color
}
