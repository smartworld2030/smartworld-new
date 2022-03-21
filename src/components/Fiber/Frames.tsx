import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MathUtils, Mesh, Object3D, Quaternion, Vector3 } from 'three'
import { useLocation, useRoute } from 'wouter'
import { GOLDENRATIO } from './Constant'
import { FramesProps } from './types'
import Frame from './Frame'

export const Frames: React.FC<FramesProps> = ({ elements, rotate, enabled, setEnabled }) => {
  const timer = useRef<any>()
  const q = useRef(new Quaternion())
  const p = useRef(new Vector3())
  const ref = useRef<Mesh>()
  const clicked = useRef<Object3D>()
  const [, params] = useRoute<{ id?: string }>('/home/:id')
  const [, setLocation] = useLocation()

  useEffect(() => {
    clicked.current = undefined
    if (typeof params?.id === 'string') clicked.current = ref.current?.getObjectByName(params?.id)
    if (typeof clicked.current === 'object') {
      clicked.current?.updateWorldMatrix(true, true)
      clicked.current?.localToWorld(p.current.set(0, GOLDENRATIO / 2, 1.25))
      clicked.current?.getWorldQuaternion(q.current)
    } else {
      if (rotate) {
        p.current.set(0, 0, 0)
      } else {
        p.current.set(0, 0, 10)
        q.current.identity()
      }
    }
    setEnabled(false)
    timer.current = setTimeout(() => {
      if (typeof clicked.current === 'undefined') setEnabled(true)
    }, 2000)
    return () => {
      clearTimeout(timer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, setEnabled])

  const clickHandler = (e: Mesh) => {
    setLocation(clicked.current === e ? '/home' : `/home/${e.name}`)
  }

  useFrame((state, dt) => {
    if (!enabled) {
      state.camera.position.lerp(p.current, MathUtils.damp(0, 1, 3, dt))
      state.camera.quaternion.slerp(q.current, MathUtils.damp(0, 1, 3, dt))
    }
  })

  return (
    <group ref={ref} onPointerMissed={() => setLocation('/home')}>
      {elements?.map(({ element, ...rest }, i) => (
        <Frame
          element={element}
          clickHandler={clickHandler}
          key={i}
          rotate={rotate}
          clicked={params?.id === rest.name}
          {...rest}
        />
      ))}
    </group>
  )
}

export default Frames
