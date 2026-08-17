import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Trail } from '@react-three/drei'
import * as THREE from 'three'

const CURSOR_PLANE = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)

export default function CursorComet({ pointerRef }) {
  const trackerRef = useRef()
  const lightRef = useRef()

  const { camera } = useThree()
  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const ndc = useMemo(() => new THREE.Vector2(), [])
  const hitPoint = useMemo(() => new THREE.Vector3(), [])

  useFrame(() => {
    const p = pointerRef?.current ?? { x: 0, y: 0 }
    ndc.set(p.x, p.y)
    raycaster.setFromCamera(ndc, camera)
    const hit = raycaster.ray.intersectPlane(CURSOR_PLANE, hitPoint)
    const target = hit ?? hitPoint

    if (trackerRef.current) {
      trackerRef.current.position.x += (target.x - trackerRef.current.position.x) * 0.16
      trackerRef.current.position.y += (target.y - trackerRef.current.position.y) * 0.16
      trackerRef.current.position.z += (target.z - trackerRef.current.position.z) * 0.16
    }
    if (lightRef.current && trackerRef.current) {
      lightRef.current.position.copy(trackerRef.current.position)
    }
  })

  return (
    <>
      <pointLight ref={lightRef} color="#8be9fd" intensity={3} distance={5.5} decay={2} />

      <Trail width={1.1} length={6} color="#a78bfa" attenuation={(t) => t * t} decay={1}>
        <mesh ref={trackerRef} visible={false}>
          <sphereGeometry args={[0.02, 8, 8]} />
        </mesh>
      </Trail>
    </>
  )
}
