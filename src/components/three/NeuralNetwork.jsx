import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Float, Line } from '@react-three/drei'
import * as THREE from 'three'

const CYAN = new THREE.Color('#22d3ee')
const VIOLET = new THREE.Color('#a78bfa')
const MAGENTA = new THREE.Color('#f472b6')

const NODE_COUNT = 140
const CURSOR_PLANE = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)

// Repulsion field tuning: how far the cursor's influence reaches, how hard
// it pushes at point-blank range, and the spring/damping that pulls each
// node back to its resting position once the cursor moves on.
const REPEL_RADIUS = 1.7
const REPEL_STRENGTH = 14
const SPRING_K = 16
const DAMPING = 5.5

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
  const positionAttrRef = useRef()
  const { restPositions, colorArray, links } = useNetwork(NODE_COUNT, 6.2, 1.7)
  const { camera, viewport } = useThree()

  const livePositions = useMemo(() => restPositions.slice(), [restPositions])
  const displacement = useMemo(() => new Float32Array(NODE_COUNT * 3), [])
  const velocity = useMemo(() => new Float32Array(NODE_COUNT * 3), [])

  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const cursorWorld = useMemo(() => new THREE.Vector3(), [])
  const cursorLocal = useMemo(() => new THREE.Vector3(), [])
  const ndc = useMemo(() => new THREE.Vector2(), [])
  const toNode = useMemo(() => new THREE.Vector3(), [])

  useFrame((_, rawDelta) => {
    const group = groupRef.current
    if (!group) return
    const delta = Math.min(rawDelta, 1 / 30)

    group.rotation.y += delta * 0.028
    group.rotation.x += delta * 0.006

    const p = pointerRef?.current ?? { x: 0, y: 0 }
    ndc.set(p.x, p.y)
    raycaster.setFromCamera(ndc, camera)
    const hit = raycaster.ray.intersectPlane(CURSOR_PLANE, cursorWorld)
    cursorLocal.copy(hit ?? cursorWorld)
    group.worldToLocal(cursorLocal)

    for (let i = 0; i < NODE_COUNT; i++) {
      const o = i * 3
      const rx = restPositions[o]
      const ry = restPositions[o + 1]
      const rz = restPositions[o + 2]

      toNode.set(rx - cursorLocal.x, ry - cursorLocal.y, rz - cursorLocal.z)
      const dist = toNode.length()

      let fx = 0
      let fy = 0
      let fz = 0
      if (dist < REPEL_RADIUS && dist > 0.0001) {
        const falloff = 1 - dist / REPEL_RADIUS
        const push = (falloff * falloff * REPEL_STRENGTH) / dist
        fx = toNode.x * push
        fy = toNode.y * push
        fz = toNode.z * push
      }

      // Spring pulls the displacement back toward zero; damping settles it.
      fx += -displacement[o] * SPRING_K - velocity[o] * DAMPING
      fy += -displacement[o + 1] * SPRING_K - velocity[o + 1] * DAMPING
      fz += -displacement[o + 2] * SPRING_K - velocity[o + 2] * DAMPING

      velocity[o] += fx * delta
      velocity[o + 1] += fy * delta
      velocity[o + 2] += fz * delta

      displacement[o] += velocity[o] * delta
      displacement[o + 1] += velocity[o + 1] * delta
      displacement[o + 2] += velocity[o + 2] * delta

      livePositions[o] = rx + displacement[o]
      livePositions[o + 1] = ry + displacement[o + 1]
      livePositions[o + 2] = rz + displacement[o + 2]
    }
    if (positionAttrRef.current) positionAttrRef.current.needsUpdate = true
  })

  const halfW = viewport.width / 2
  const halfH = viewport.height / 2

  return (
    <>
      <CameraRig pointerRef={pointerRef} />

      <group ref={groupRef}>
        <points>
          <bufferGeometry>
            <bufferAttribute ref={positionAttrRef} attach="attributes-position" args={[livePositions, 3]} />
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
