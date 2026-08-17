import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Trail } from '@react-three/drei'
import * as THREE from 'three'

const CURSOR_PLANE = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)

export default function CursorComet({ pointerRef }) {
  const headRef = useRef()
  const tailRef = useRef()
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

    if (headRef.current) {
      headRef.current.position.x += (target.x - headRef.current.position.x) * 0.22
      headRef.current.position.y += (target.y - headRef.current.position.y) * 0.22
      headRef.current.position.z += (target.z - headRef.current.position.z) * 0.22
    }
    if (tailRef.current && headRef.current) {
      tailRef.current.position.x += (headRef.current.position.x - tailRef.current.position.x) * 0.1
      tailRef.current.position.y += (headRef.current.position.y - tailRef.current.position.y) * 0.1
      tailRef.current.position.z += (headRef.current.position.z - tailRef.current.position.z) * 0.1
    }
    if (lightRef.current && headRef.current) {
      lightRef.current.position.copy(headRef.current.position)
    }
  })

  return (
    <>
      <pointLight ref={lightRef} color="#8be9fd" intensity={6} distance={8} decay={2} />

      <Trail width={4.2} length={8} color="#67e8f9" attenuation={(t) => Math.sqrt(t)} decay={1}>
        <mesh ref={headRef}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshBasicMaterial color="#e0fbff" toneMapped={false} transparent opacity={0.95} />
        </mesh>
      </Trail>

      <Trail width={2.8} length={11} color="#c084fc" attenuation={(t) => t} decay={1}>
        <mesh ref={tailRef}>
          <sphereGeometry args={[0.04, 10, 10]} />
          <meshBasicMaterial color="#e9d5ff" toneMapped={false} transparent opacity={0.75} />
        </mesh>
      </Trail>
    </>
  )
}
