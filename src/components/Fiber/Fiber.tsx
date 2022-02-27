import React, { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { FiberProps } from './types'
import Frames from './Frames'

const Fiber: React.FC<FiberProps> = ({
  backgroundColor = 0x000000,
  fallback = <>Loading...</>,
  elements = [],
  width,
  height = 800,
}) => {
  const [enabled, setEnabled] = useState(false)
  const [rotate, setRotate] = useState(false)

  return (
    <Suspense fallback={fallback}>
      <Canvas
        style={{ width, height: Number(height) - 180 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.5]}
        camera={{ fov: 70, position: [0, 0, 10] }}
      >
        <OrbitControls
          onChange={(e) => (e?.target.getDistance() < 5 ? setRotate(true) : setRotate(false))}
          enabled={enabled}
          autoRotate
          enableDamping
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          maxDistance={10}
          minDistance={1}
        />
        <color attach="background" args={[backgroundColor]} />
        <group position={[0, -0.5, 0]}>
          <Frames elements={elements} rotate={rotate} enabled={enabled} setEnabled={setEnabled} />
        </group>
      </Canvas>
    </Suspense>
  )
}

export default Fiber
