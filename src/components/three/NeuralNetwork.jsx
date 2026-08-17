import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

const CYAN = new THREE.Color('#22d3ee')
const VIOLET = new THREE.Color('#a78bfa')
const MAGENTA = new THREE.Color('#f472b6')
const WHITE = new THREE.Color('#ffffff')

const NODE_COUNT = 140
const CURSOR_PLANE = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)

// Idle "thinking" shimmer — always on, independent per node.
const IDLE_AMPLITUDE = 0.16

// Cursor-triggered ripple: a signal that hops outward along real edges.
const HOP_DELAY = 0.09 // seconds between hops
const HOP1_STRENGTH = 0.65
const HOP2_STRENGTH = 0.32
const NODE_DECAY_RATE = 3.2
const EDGE_DECAY_RATE = 3.8
const RETRIGGER_COOLDOWN = 0.15 // seconds

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

    // Edges as index pairs (not Vector3 refs) so we can walk the graph.
    const edges = []
    for (let i = 0; i < count; i++) {
      let linked = 0
      for (let j = i + 1; j < count && linked < 3; j++) {
        if (positions[i].distanceTo(positions[j]) < maxLinkDist) {
          edges.push([i, j])
          linked++
        }
      }
    }

    const adjacency = Array.from({ length: count }, () => [])
    edges.forEach(([i, j], edgeIdx) => {
      adjacency[i].push({ node: j, edge: edgeIdx })
      adjacency[j].push({ node: i, edge: edgeIdx })
    })

    const restPositions = new Float32Array(count * 3)
    const nodeColors = new Float32Array(count * 3)
    positions.forEach((v, i) => {
      restPositions[i * 3] = v.x
      restPositions[i * 3 + 1] = v.y
      restPositions[i * 3 + 2] = v.z
      nodeColors[i * 3] = colors[i].r
      nodeColors[i * 3 + 1] = colors[i].g
      nodeColors[i * 3 + 2] = colors[i].b
    })

    // Static edge geometry (positions never change) + a dim, neutral base
    // color — the same slate tone the static web always used. Colour only
    // shows up when a ripple activates a given edge.
    const EDGE_BASE = new THREE.Color('#5b6082').multiplyScalar(0.32)
    const edgePositions = new Float32Array(edges.length * 6)
    const edgeBaseColors = new Float32Array(edges.length * 6)
    edges.forEach(([i, j], e) => {
      const o = e * 6
      edgePositions[o] = restPositions[i * 3]
      edgePositions[o + 1] = restPositions[i * 3 + 1]
      edgePositions[o + 2] = restPositions[i * 3 + 2]
      edgePositions[o + 3] = restPositions[j * 3]
      edgePositions[o + 4] = restPositions[j * 3 + 1]
      edgePositions[o + 5] = restPositions[j * 3 + 2]

      edgeBaseColors[o] = EDGE_BASE.r
      edgeBaseColors[o + 1] = EDGE_BASE.g
      edgeBaseColors[o + 2] = EDGE_BASE.b
      edgeBaseColors[o + 3] = EDGE_BASE.r
      edgeBaseColors[o + 4] = EDGE_BASE.g
      edgeBaseColors[o + 5] = EDGE_BASE.b
    })

    return { restPositions, nodeColors, edges, adjacency, edgePositions, edgeBaseColors }
  }, [count, radius, maxLinkDist])
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
  const nodeColorAttrRef = useRef()
  const edgeColorAttrRef = useRef()
  const { restPositions, nodeColors, edges, adjacency, edgePositions, edgeBaseColors } = useNetwork(
    NODE_COUNT,
    6.2,
    1.7,
  )
  const { camera, viewport } = useThree()

  const nodeActivation = useMemo(() => new Float32Array(NODE_COUNT), [])
  const idlePhase = useMemo(() => Float32Array.from({ length: NODE_COUNT }, () => Math.random() * Math.PI * 2), [])
  const idleSpeed = useMemo(() => Float32Array.from({ length: NODE_COUNT }, () => 0.45 + Math.random() * 0.55), [])
  const liveNodeColors = useMemo(() => nodeColors.slice(), [nodeColors])

  const edgeActivation = useMemo(() => new Float32Array(edges.length), [edges])
  const liveEdgeColors = useMemo(() => edgeBaseColors.slice(), [edgeBaseColors])

  const pendingRef = useRef([])
  const lastNearestRef = useRef(-1)
  const cooldownRef = useRef(-Infinity)

  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const cursorWorld = useMemo(() => new THREE.Vector3(), [])
  const cursorLocal = useMemo(() => new THREE.Vector3(), [])
  const ndc = useMemo(() => new THREE.Vector2(), [])

  useFrame((state, rawDelta) => {
    const group = groupRef.current
    if (!group) return
    const delta = Math.min(rawDelta, 1 / 30)
    const now = state.clock.elapsedTime

    group.rotation.y += delta * 0.028
    group.rotation.x += delta * 0.006

    // Cursor -> the group's local space (same space the rest positions live in).
    const p = pointerRef?.current ?? { x: 0, y: 0 }
    ndc.set(p.x, p.y)
    raycaster.setFromCamera(ndc, camera)
    const hit = raycaster.ray.intersectPlane(CURSOR_PLANE, cursorWorld)
    cursorLocal.copy(hit ?? cursorWorld)
    group.worldToLocal(cursorLocal)

    // Nearest node to the cursor this frame.
    let nearest = -1
    let nearestDist = Infinity
    for (let i = 0; i < NODE_COUNT; i++) {
      const dx = restPositions[i * 3] - cursorLocal.x
      const dy = restPositions[i * 3 + 1] - cursorLocal.y
      const dz = restPositions[i * 3 + 2] - cursorLocal.z
      const d = dx * dx + dy * dy + dz * dz
      if (d < nearestDist) {
        nearestDist = d
        nearest = i
      }
    }

    // Cursor moved to a new "closest node" — fire a fresh ripple from it.
    if (nearest !== lastNearestRef.current && now - cooldownRef.current > RETRIGGER_COOLDOWN) {
      nodeActivation[nearest] = 1
      for (const hop1 of adjacency[nearest]) {
        pendingRef.current.push({ time: now + HOP_DELAY, node: hop1.node, strength: HOP1_STRENGTH, edge: hop1.edge })
        for (const hop2 of adjacency[hop1.node]) {
          if (hop2.node === nearest) continue
          pendingRef.current.push({
            time: now + HOP_DELAY * 2,
            node: hop2.node,
            strength: HOP2_STRENGTH,
            edge: hop2.edge,
          })
        }
      }
      lastNearestRef.current = nearest
      cooldownRef.current = now
    }

    // Apply any ripple hops whose delay has elapsed.
    if (pendingRef.current.length) {
      const remaining = []
      for (const ev of pendingRef.current) {
        if (ev.time <= now) {
          nodeActivation[ev.node] = Math.max(nodeActivation[ev.node], ev.strength)
          edgeActivation[ev.edge] = Math.max(edgeActivation[ev.edge], ev.strength)
        } else {
          remaining.push(ev)
        }
      }
      pendingRef.current = remaining
    }

    const nodeDecay = Math.exp(-NODE_DECAY_RATE * delta)
    const edgeDecay = Math.exp(-EDGE_DECAY_RATE * delta)

    for (let i = 0; i < NODE_COUNT; i++) {
      nodeActivation[i] *= nodeDecay
      const idle = 0.5 + 0.5 * Math.sin(now * idleSpeed[i] + idlePhase[i])
      const glow = Math.min(1, idle * IDLE_AMPLITUDE + nodeActivation[i])
      const o = i * 3
      liveNodeColors[o] = nodeColors[o] + (WHITE.r - nodeColors[o]) * glow
      liveNodeColors[o + 1] = nodeColors[o + 1] + (WHITE.g - nodeColors[o + 1]) * glow
      liveNodeColors[o + 2] = nodeColors[o + 2] + (WHITE.b - nodeColors[o + 2]) * glow
    }
    if (nodeColorAttrRef.current) nodeColorAttrRef.current.needsUpdate = true

    for (let e = 0; e < edges.length; e++) {
      edgeActivation[e] *= edgeDecay
      const glow = Math.min(1, edgeActivation[e])
      const o = e * 6
      for (let v = 0; v < 2; v++) {
        const vo = o + v * 3
        liveEdgeColors[vo] = edgeBaseColors[vo] + (WHITE.r - edgeBaseColors[vo]) * glow
        liveEdgeColors[vo + 1] = edgeBaseColors[vo + 1] + (WHITE.g - edgeBaseColors[vo + 1]) * glow
        liveEdgeColors[vo + 2] = edgeBaseColors[vo + 2] + (WHITE.b - edgeBaseColors[vo + 2]) * glow
      }
    }
    if (edgeColorAttrRef.current) edgeColorAttrRef.current.needsUpdate = true
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
            <bufferAttribute ref={nodeColorAttrRef} attach="attributes-color" args={[liveNodeColors, 3]} />
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

        <lineSegments>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[edgePositions, 3]} />
            <bufferAttribute ref={edgeColorAttrRef} attach="attributes-color" args={[liveEdgeColors, 3]} />
          </bufferGeometry>
          <lineBasicMaterial
            vertexColors
            transparent
            opacity={0.85}
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
