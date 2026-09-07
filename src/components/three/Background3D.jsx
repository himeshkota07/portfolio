import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import NeuralNetwork from './NeuralNetwork'
import CursorComet from './CursorComet'
import usePointer from '../../hooks/usePointer'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion'

export default function Background3D() {
  const pointerRef = usePointer()
  const reducedMotion = usePrefersReducedMotion()

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#05060a']} />
        <fog attach="fog" args={['#05060a', 6, 13]} />
        <ambientLight intensity={0.3} />
        <Suspense fallback={null}>
          <NeuralNetwork pointerRef={pointerRef} reducedMotion={reducedMotion} />
          {!reducedMotion && <CursorComet pointerRef={pointerRef} />}
        </Suspense>
      </Canvas>
    </div>
  )
}
