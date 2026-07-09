import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ═══════════════════════════════════════════════════════════════
   DataParticles — Simulates data flowing from the single crop
   ═══════════════════════════════════════════════════════════════ */
function DataParticles({ count = 80 }) {
  const pointsRef = useRef()

  const { positions, speeds, phases } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    const phases = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // Start near the crop base
      positions[i * 3] = (Math.random() - 0.5) * 1.5
      positions[i * 3 + 1] = Math.random() * -6 // Relative drop
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1.5

      speeds[i] = 0.02 + Math.random() * 0.02
      phases[i] = Math.random() * Math.PI * 2
    }
    return { positions, speeds, phases }
  }, [count])

  useFrame((state) => {
    if (!pointsRef.current) return
    const t = state.clock.elapsedTime
    const pos = pointsRef.current.geometry.attributes.position.array

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      // Move upwards
      pos[i3 + 1] += speeds[i]

      // Gentle drift
      pos[i3] += Math.sin(t * 1.5 + phases[i]) * 0.005
      pos[i3 + 2] += Math.cos(t * 1.5 + phases[i]) * 0.005

      // Reset when reaching satellite body
      if (pos[i3 + 1] > 0) {
        pos[i3] = (Math.random() - 0.5) * 1.5
        pos[i3 + 1] = -6
        pos[i3 + 2] = (Math.random() - 0.5) * 1.5
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#22c55e"
        size={0.06}
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/* ═══════════════════════════════════════════════════════════════
   Satellite — Premium orbiting tech focused on the single crop
   ═══════════════════════════════════════════════════════════════ */
export default function Satellite() {
  const groupRef = useRef()
  const leftPanelRef = useRef()
  const rightPanelRef = useRef()
  const ledRef = useRef()
  const beamRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime

    // Orbit Path: tight, ultra-slow circle directly over the single crop
    if (groupRef.current) {
      groupRef.current.position.x = Math.sin(t * 0.1) * 3
      groupRef.current.position.z = Math.cos(t * 0.1) * 3
      // Always look precisely at the center of the crop
      groupRef.current.lookAt(0, 0, 0)
    }

    // Solar panels subtly track sunlight
    if (leftPanelRef.current && rightPanelRef.current) {
      const panelAngle = Math.sin(t * 0.3) * 0.1
      leftPanelRef.current.rotation.x = panelAngle
      rightPanelRef.current.rotation.x = panelAngle
    }

    // Blinking status LED (Premium, subtle)
    if (ledRef.current) {
      ledRef.current.material.opacity = (t % 3.0 < 0.1) ? 1.0 : 0.0
    }

    // Scanning beam pulse & sweet (Volumetric cone)
    if (beamRef.current) {
      beamRef.current.material.opacity = 0.03 + Math.sin(t * 2) * 0.02
      // Very slight sweep over the small plot
      beamRef.current.rotation.x = -Math.PI / 2 + Math.sin(t * 1.5) * 0.05
      beamRef.current.rotation.y = Math.cos(t * 1) * 0.05
    }
  })

  return (
    // Lower altitude compared to the macro farm
    <group ref={groupRef} position={[0, 6, 0]}>
      
      {/* Main Body */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.2, 0.2, 0.8, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.9} />
      </mesh>

      {/* Sensor Array Dome */}
      <mesh position={[0, 0, 0.25]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.9} />
      </mesh>

      {/* Tiny Status LED */}
      <mesh ref={ledRef} position={[0, 0, 0.38]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color="#ef4444" transparent opacity={1} />
      </mesh>

      {/* Left Solar Panel */}
      <group ref={leftPanelRef} position={[-0.9, 0, 0]}>
        <mesh position={[0.3, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.03, 0.03, 0.4, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} />
        </mesh>
        <mesh>
          <boxGeometry args={[0.8, 0.02, 1.2]} />
          <meshStandardMaterial color="#020617" roughness={0.2} metalness={0.6} />
        </mesh>
      </group>

      {/* Right Solar Panel */}
      <group ref={rightPanelRef} position={[0.9, 0, 0]}>
        <mesh position={[-0.3, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.03, 0.03, 0.4, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} />
        </mesh>
        <mesh>
          <boxGeometry args={[0.8, 0.02, 1.2]} />
          <meshStandardMaterial color="#020617" roughness={0.2} metalness={0.6} />
        </mesh>
      </group>

      {/* Scanning Beam (Volumetric Cone) */}
      <mesh ref={beamRef} position={[0, 0, 3]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[2.5, 0.05, 6, 32, 1, true]} />
        <meshBasicMaterial
          color="#4ade80"
          transparent
          opacity={0.04}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Data particle flow within the beam */}
      <DataParticles count={60} />

    </group>
  )
}
