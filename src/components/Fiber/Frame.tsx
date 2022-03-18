import { useEffect, useMemo, useRef, useState } from 'react'
import { useCursor, Html } from '@react-three/drei'
import { Mesh } from 'three'
import { useThree } from '@react-three/fiber'
import { FrameProps } from './types'

export const Frame: React.FC<FrameProps> = ({ element, clickHandler, elementStyle, rotate, clicked, ...props }) => {
  const [hovered, hover] = useState(false)

  const group = useRef<Mesh>()

  const { width: w, height: h } = useThree((state) => state.viewport)
  const { width: wi, height: he } = useThree((state) => state.size)

  const { width, height, scaleWidth, scaleHeight } = useMemo(() => {
    const scaleWidth = Math.round(w < 18 ? w * 100 : 2000) / 1000
    const scaleHeight = Math.round(h * 100) / 1000
    const isMobile = wi < 350
    const isTablet = wi > 640
    const isDesktop = wi > 1000
    const width = isDesktop ? 450 : isTablet ? wi * 0.4 : isMobile ? wi : wi * 0.5
    const height = isDesktop ? 200 : isTablet ? he * 0.4 : isMobile ? he : he * 0.5
    const textPos = isDesktop ? 0.1 : isTablet ? height * 0.0027 : isMobile ? height * 0.0027 : height * 0.002
    return { width, height, textPos, scaleWidth, scaleHeight }
  }, [w, h, wi, he])

  useEffect(() => {
    group.current?.rotateY(Math.PI)
  }, [rotate])

  useCursor(hovered)
  // useFrame((state) => {
  //   if (image.current) {
  //     ;(image.current.material as any).zoom = 2 + Math.sin(rnd * 10000 + state.clock.elapsedTime / 3) / 2
  //     image.current.scale.x = MathUtils.lerp(image.current.scale.x, 0.85 * (hovered ? 0.85 : 1), 0.1)
  //     image.current.scale.y = MathUtils.lerp(image.current.scale.y, 0.9 * (hovered ? 0.905 : 1), 0.1)
  //   }
  //   if (frame.current) {
  //     ;(frame.current.material as any).color.lerp(c.set(hovered ? 0xffa500 : 0xffffff), 0.1)
  //   }
  // })
  return (
    <group ref={group} onClick={() => clickHandler(group.current)} {...props}>
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation()
          hover(true)
        }}
        onPointerOut={() => hover(false)}
        scale={[scaleWidth, scaleHeight, 1]}
        position={[0, scaleHeight / 2, 0]}
        raycast={() => null}
      >
        <Html
          scale={[scaleHeight / 10, scaleWidth / 10, 1]}
          style={{
            userSelect: clicked ? 'initial' : 'none',
            overflow: clicked ? 'scroll' : 'hidden',
            cursor: clicked ? 'initial' : 'pointer',
            ...elementStyle,
          }}
          transform
          occlude
        >
          {element({ onClick: () => (clicked ? undefined : clickHandler(group.current)) }, { width, height })}
        </Html>
      </mesh>
    </group>
  )
}

export default Frame
