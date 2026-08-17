import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Float, Line } from '@react-three/drei'
import * as THREE from 'three'

const CYAN = new THREE.Color('#22d3ee')
const VIOLET = new THREE.Color('#a78bfa')
const MAGENTA = new THREE.Color('#f472b6')
const WHITE = new THREE.Color('#ffffff')

const NODE_COUNT = 140
const NEAR_COUNT = 6
const CURSOR_PLANE = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)

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

    const pointsArray = new Float32Array(count * 3)
    const baseColorArray = new Float32Array(count * 3)
    positions.forEach((v, i) => {
      pointsArray[i * 3] = v.x
      pointsArray[i * 3 + 1] = v.y
      pointsArray[i * 3 + 2] = v.z
      baseColorArray[i * 3] = colors[i].r
      baseColorArray[i * 3 + 1] = colors[i].g
      baseColorArray[i * 3 + 2] = colors[i].b
    })

    return { pointsArray, baseColorArray, links }
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

function DriftingShape({ position, geometry, color, scale = 1, speed = 1 }) {
  return (
    <Float speed={speed} rotationIntensity={0.7} floatIntensity={0.8}>
      <mesh position={position} scale={scale}>
        {geometry}
        <meshBasicMaterial color={color} wireframe transparent opacity={0.16} />
      </mesh>
    </Float>
  )
}

// Shifts the camera opposite the cursor (no lookAt re-aim) so the whole
// scene pans like a window being peered through — a much more convincing
// "responds to the cursor" read than rotating the network itself.
function CameraRig({ pointerRef }) {
  const { camera } = useThree()
  const target = useMemo(() => new THREE.Vector2(), [])

  useFrame(() => {
    const p = pointerRef?.current ?? { x: 0, y: 0 }
    target.set(p.x * 1.1, p.y * 0.7)
    camera.position.x += (target.x - camera.position.x) * 0.045
    camera.position.y += (target.y - camera.position.y) * 0.045
  })

  return null
}

export default function NeuralNetwork({ pointerRef }) {
  const groupRef = useRef()
  const colorAttrRef = useRef()
  const cursorLineAttrRef = useRef()
  const { pointsArray, baseColorArray, links } = useNetwork(NODE_COUNT, 6.2, 1.7)
  const { camera, viewport } = useThree()

  const liveColorArray = useMemo(() => baseColorArray.slice(), [baseColorArray])
  const highlights = useMemo(() => new Float32Array(NODE_COUNT), [])
  const cursorLinePositions = useMemo(() => new Float32Array(NEAR_COUNT * 2 * 3), [])
  const nearestIdx = useMemo(() => new Array(NODE_COUNT).fill(0).map((_, i) => i), [])
  const distSq = useMemo(() => new Float32Array(NODE_COUNT), [])

  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const cursorWorld = useMemo(() => new THREE.Vector3(), [])
  const cursorLocal = useMemo(() => new THREE.Vector3(), [])
  const ndc = useMemo(() => new THREE.Vector2(), [])

  useFrame((_, delta) => {
    const group = groupRef.current
    if (!group) return

    group.rotation.y += delta * 0.028
    group.rotation.x += delta * 0.006

    const p = pointerRef?.current ?? { x: 0, y: 0 }
    ndc.set(p.x, p.y)
    raycaster.setFromCamera(ndc, camera)
    const hit = raycaster.ray.intersectPlane(CURSOR_PLANE, cursorWorld)
    cursorLocal.copy(hit ?? cursorWorld)
    group.worldToLocal(cursorLocal)

    // Find the nodes nearest the cursor this frame.
    for (let i = 0; i < NODE_COUNT; i++) {
      const dx = pointsArray[i * 3] - cursorLocal.x
      const dy = pointsArray[i * 3 + 1] - cursorLocal.y
      const dz = pointsArray[i * 3 + 2] - cursorLocal.z
      distSq[i] = dx * dx + dy * dy + dz * dz
    }
    nearestIdx.sort((a, b) => distSq[a] - distSq[b])

    // Decay all highlights, then reignite the current nearest set.
    for (let i = 0; i < NODE_COUNT; i++) highlights[i] *= 0.9
    for (let k = 0; k < NEAR_COUNT; k++) highlights[nearestIdx[k]] = 1

    for (let i = 0; i < NODE_COUNT; i++) {
      const h = highlights[i] * 0.6
      liveColorArray[i * 3] = baseColorArray[i * 3] + (WHITE.r - baseColorArray[i * 3]) * h
      liveColorArray[i * 3 + 1] = baseColorArray[i * 3 + 1] + (WHITE.g - baseColorArray[i * 3 + 1]) * h
      liveColorArray[i * 3 + 2] = baseColorArray[i * 3 + 2] + (WHITE.b - baseColorArray[i * 3 + 2]) * h
    }
    if (colorAttrRef.current) colorAttrRef.current.needsUpdate = true

    for (let k = 0; k < NEAR_COUNT; k++) {
      const idx = nearestIdx[k]
      const o = k * 6
      cursorLinePositions[o] = cursorLocal.x
      cursorLinePositions[o + 1] = cursorLocal.y
      cursorLinePositions[o + 2] = cursorLocal.z
      cursorLinePositions[o + 3] = pointsArray[idx * 3]
      cursorLinePositions[o + 4] = pointsArray[idx * 3 + 1]
      cursorLinePositions[o + 5] = pointsArray[idx * 3 + 2]
    }
    if (cursorLineAttrRef.current) cursorLineAttrRef.current.needsUpdate = true
  })

  const halfW = viewport.width / 2
  const halfH = viewport.height / 2

  return (
    <>
      <CameraRig pointerRef={pointerRef} />

      <group ref={groupRef}>
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[pointsArray, 3]} />
            <bufferAttribute ref={colorAttrRef} attach="attributes-color" args={[liveColorArray, 3]} />
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

        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              ref={cursorLineAttrRef}
              attach="attributes-position"
              args={[cursorLinePositions, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color="#8be9fd"
            transparent
            opacity={0.55}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </lineSegments>
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
