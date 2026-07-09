import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ═══════════════════════════════════════════════════════════════
   BeamParticles — Dense luminous points floating upward
   through the central column, creating the life-force effect.
   Much thicker and more concentrated than before.
   ═══════════════════════════════════════════════════════════════ */
function BeamParticles({ count = 4000 }) {
  const ref = useRef()

  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const speeds = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      // Wider spread with dense core — power distribution concentrates center
      const radius = Math.pow(Math.random(), 1.8) * 1.2
      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = Math.random() * 16 - 4
      positions[i * 3 + 2] = Math.sin(angle) * radius
      speeds[i] = 0.006 + Math.random() * 0.014
    }

    return { positions, speeds }
  }, [count])

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    const pos = ref.current.geometry.attributes.position.array

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      pos[i3 + 1] += speeds[i]
      if (pos[i3 + 1] > 12) pos[i3 + 1] = -4

      pos[i3] += Math.sin(t * 0.8 + i * 0.05) * 0.0005
      pos[i3 + 2] += Math.cos(t * 0.6 + i * 0.07) * 0.0005
    }

    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#92FF54"
        size={0.035}
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  )
}

/* ═══════════════════════════════════════════════════════════════
   AmberParticles — Warm amber/golden particles within the beam
   for a richer, more concentrated look.
   ═══════════════════════════════════════════════════════════════ */
function AmberParticles({ count = 1200 }) {
  const ref = useRef()

  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const speeds = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      // Tighter concentration toward center
      const radius = Math.pow(Math.random(), 2.2) * 0.9
      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = Math.random() * 16 - 4
      positions[i * 3 + 2] = Math.sin(angle) * radius
      speeds[i] = 0.005 + Math.random() * 0.01
    }

    return { positions, speeds }
  }, [count])

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    const pos = ref.current.geometry.attributes.position.array

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      pos[i3 + 1] += speeds[i]
      if (pos[i3 + 1] > 12) pos[i3 + 1] = -4

      pos[i3] += Math.sin(t * 0.9 + i * 0.04) * 0.0004
      pos[i3 + 2] += Math.cos(t * 0.7 + i * 0.06) * 0.0004
    }

    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#fbbf24"
        size={0.03}
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  )
}

/* ═══════════════════════════════════════════════════════════════
   GoldDust — Warm gold particles interleaved with the beam
   ═══════════════════════════════════════════════════════════════ */
function GoldDust({ count = 600 }) {
  const ref = useRef()

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = Math.pow(Math.random(), 1.8) * 1.4
      pos[i * 3] = Math.cos(angle) * radius
      pos[i * 3 + 1] = Math.random() * 14 - 3
      pos[i * 3 + 2] = Math.sin(angle) * radius
    }
    return pos
  }, [count])

  useFrame((state) => {
    if (!ref.current) return
    const pos = ref.current.geometry.attributes.position.array
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += 0.004 + Math.random() * 0.004
      if (pos[i * 3 + 1] > 11) pos[i * 3 + 1] = -3
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#f59e0b"
        size={0.028}
        transparent
        opacity={0.65}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  )
}

/* ═══════════════════════════════════════════════════════════════
   EnergyBeam — The central life-force column
   Composed of layered cylinders, particles, amber glow, and 
   ground impact. Much thicker and denser than before.
   ═══════════════════════════════════════════════════════════════ */
export default function EnergyBeam() {
  const coreRef = useRef()
  const core2Ref = useRef()
  const midRef = useRef()
  const outerRef = useRef()
  const hazeRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    // Gentle breathing pulse
    if (coreRef.current) {
      coreRef.current.material.opacity = 0.95 + Math.sin(t * 1.8) * 0.05
    }
    if (core2Ref.current) {
      core2Ref.current.material.opacity = 0.75 + Math.sin(t * 1.4 + 0.3) * 0.1
    }
    if (midRef.current) {
      midRef.current.material.opacity = 0.35 + Math.sin(t * 1.2 + 0.5) * 0.05
      midRef.current.scale.x = 1 + Math.sin(t * 0.8) * 0.06
      midRef.current.scale.z = 1 + Math.sin(t * 0.8) * 0.06
    }
    if (outerRef.current) {
      outerRef.current.material.opacity = 0.15 + Math.sin(t * 0.6 + 1) * 0.03
      outerRef.current.scale.x = 1 + Math.sin(t * 0.5) * 0.08
      outerRef.current.scale.z = 1 + Math.sin(t * 0.5) * 0.08
    }
    if (hazeRef.current) {
      hazeRef.current.material.opacity = 0.06 + Math.sin(t * 0.4 + 1.5) * 0.01
      hazeRef.current.scale.x = 1 + Math.sin(t * 0.35) * 0.05
      hazeRef.current.scale.z = 1 + Math.sin(t * 0.35) * 0.05
    }
  })

  return (
    <group position={[3.2, 3, 0]}>
      {/* Inner core — white-hot center */}
      <mesh ref={coreRef}>
        <cylinderGeometry args={[0.04, 0.04, 16, 8]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.98}
          blending={THREE.NormalBlending}
        />
      </mesh>

      {/* Secondary core — vibrant fresh green (#92FF54) */}
      <mesh ref={core2Ref}>
        <cylinderGeometry args={[0.1, 0.1, 16, 10]} />
        <meshBasicMaterial
          color="#92FF54"
          transparent
          opacity={0.8}
          blending={THREE.NormalBlending}
        />
      </mesh>

      {/* Mid glow layer — lush forest green */}
      <mesh ref={midRef}>
        <cylinderGeometry args={[0.3, 0.3, 16, 12]} />
        <meshBasicMaterial
          color="#22c55e"
          transparent
          opacity={0.4}
          blending={THREE.NormalBlending}
        />
      </mesh>

      {/* Outer atmospheric glow */}
      <mesh ref={outerRef}>
        <cylinderGeometry args={[0.7, 0.7, 16, 16]} />
        <meshBasicMaterial
          color="#16a34a"
          transparent
          opacity={0.16}
          blending={THREE.NormalBlending}
        />
      </mesh>

      {/* Wide volumetric haze */}
      <mesh ref={hazeRef}>
        <cylinderGeometry args={[1.3, 1.3, 14, 16]} />
        <meshBasicMaterial
          color="#86efac"
          transparent
          opacity={0.06}
          blending={THREE.NormalBlending}
        />
      </mesh>

      {/* Amber volumetric inner haze */}
      <mesh>
        <cylinderGeometry args={[0.18, 0.18, 16, 12]} />
        <meshBasicMaterial
          color="#f59e0b"
          transparent
          opacity={0.15}
          blending={THREE.NormalBlending}
        />
      </mesh>

      {/* Ground impact glow — where beam meets earth */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4.05, 0]}>
        <circleGeometry args={[3.8, 32]} />
        <meshBasicMaterial
          color="#92FF54"
          transparent
          opacity={0.15}
          blending={THREE.NormalBlending}
        />
      </mesh>

      {/* Secondary ground ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4.02, 0]}>
        <ringGeometry args={[0.5, 5.5, 32]} />
        <meshBasicMaterial
          color="#22c55e"
          transparent
          opacity={0.08}
          blending={THREE.NormalBlending}
        />
      </mesh>

      {/* Amber ground glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4.03, 0]}>
        <circleGeometry args={[2.2, 32]} />
        <meshBasicMaterial
          color="#f59e0b"
          transparent
          opacity={0.08}
          blending={THREE.NormalBlending}
        />
      </mesh>

      <BeamParticles />
      <AmberParticles />
      <GoldDust />
    </group>
  )
}
