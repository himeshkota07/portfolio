import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Float, Line } from '@react-three/drei'
import * as THREE from 'three'

const CYAN = new THREE.Color('#22d3ee')
const VIOLET = new THREE.Color('#a78bfa')
const MAGENTA = new THREE.Color('#f472b6')

const NODE_COUNT = 140

function useNetwork(count, radius, maxLinkDist) {
  return useMemo(() => {
    const positions = []
    const colors = []
    for (let i = 0; i < count; i++) {
      const v = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
      )
        .normalize()
        .multiplyScalar(radius * (0.35 + Math.random() * 0.65))
      positions.push(v)
      const t = Math.random()
      const c = t < 0.5 ? CYAN.clone().lerp(VIOLET, t * 2) : VIOLET.clone().lerp(MAGENTA, (t - 0.5) * 2)
      colors.push(c)
    }

    const links = []
    for (let i = 0; i < count; i++) {
      let linked = 0
      for (let j = i + 1; j < count && linked < 3; j++) {
        if (positions[i].distanceTo(positions[j]) < maxLinkDist) {
          links.push([positions[i], positions[j]])
          linked++
        }
      }
    }

    const restPositions = new Float32Array(count * 3)
    const colorArray = new Float32Array(count * 3)
    positions.forEach((v, i) => {
      restPositions[i * 3] = v.x
      restPositions[i * 3 + 1] = v.y
      restPositions[i * 3 + 2] = v.z
      colorArray[i * 3] = colors[i].r
      colorArray[i * 3 + 1] = colors[i].g
      colorArray[i * 3 + 2] = colors[i].b
    })

    return { restPositions, colorArray, links }
  }, [count, radius, maxLinkDist])
}

function Links({ links }) {
  return (
    <group>
      {links.map(([a, b], i) => (
        <Line key={i} points={[a, b]} color="#5b6082" transparent opacity={0.22} lineWidth={1} />
      ))}
    </group>
  )
}

// Lit (not unlit) so the cursor comet's point light can catch these with a
// faint glint as it drifts past — otherwise they sit at a constant low
// opacity as ambient decor.
function DriftingShape({ position, geometry, color, scale = 1, speed = 1 }) {
  return (
    <Float speed={speed} rotationIntensity={0.7} floatIntensity={0.8}>
      <mesh position={position} scale={scale}>
        {geometry}
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.15}
          wireframe
          transparent
          opacity={0.22}
          roughness={0.35}
          metalness={0.2}
        />
      </mesh>
    </Float>
  )
}

// Shifts the camera opposite the cursor (no lookAt re-aim) so the whole
// scene pans like a window being peered through — a subtle depth cue.
function CameraRig({ pointerRef }) {
  const { camera } = useThree()
  const target = useMemo(() => new THREE.Vector2(), [])

  useFrame(() => {
    const p = pointerRef?.current ?? { x: 0, y: 0 }
    target.set(p.x * 0.9, p.y * 0.55)
    camera.position.x += (target.x - camera.position.x) * 0.045
    camera.position.y += (target.y - camera.position.y) * 0.045
  })

  return null
}

export default function NeuralNetwork({ pointerRef }) {
  const groupRef = useRef()
  const { restPositions, colorArray, links } = useNetwork(NODE_COUNT, 6.2, 1.7)
  const { viewport } = useThree()

  useFrame((_, rawDelta) => {
    const group = groupRef.current
    if (!group) return
    const delta = Math.min(rawDelta, 1 / 30)
    group.rotation.y += delta * 0.028
    group.rotation.x += delta * 0.006
  })

  const halfW = viewport.width / 2
  const halfH = viewport.height / 2

  return (
    <>
      <CameraRig pointerRef={pointerRef} />

      <group ref={groupRef}>
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[restPositions, 3]} />
            <bufferAttribute attach="attributes-color" args={[colorArray, 3]} />
          </bufferGeometry>
          <pointsMaterial
            size={0.06}
            vertexColors
            transparent
            opacity={0.9}
            sizeAttenuation
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>

        <Links links={links} />
      </group>

      <DriftingShape
        position={[halfW * 0.78, halfH * 0.62, -3]}
        geometry={<icosahedronGeometry args={[0.8, 0]} />}
        color="#22d3ee"
        speed={1.2}
      />
      <DriftingShape
        position={[-halfW * 0.8, -halfH * 0.6, -3.4]}
        geometry={<octahedronGeometry args={[0.65, 0]} />}
        color="#a78bfa"
        speed={0.9}
      />
      <DriftingShape
        position={[halfW * 0.72, -halfH * 0.68, -3.6]}
        geometry={<torusGeometry args={[0.45, 0.13, 8, 24]} />}
        color="#f472b6"
        scale={0.85}
        speed={1.4}
      />
    </>
  )
}
