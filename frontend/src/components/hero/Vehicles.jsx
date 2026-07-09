import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ═══════════════════════════════════════════════════════════════
   Drone — Premium hovering autonomous agent
   ═══════════════════════════════════════════════════════════════ */
function Drone({ 
  startPos = [0, 5, 0], 
  orbitRadius = 6, 
  speed = 0.5, 
  offsetPhase = 0,
  color = "#ffffff"
}) {
  const groupRef = useRef()
  const propRefs = useRef([])
  const scannerRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime

    if (groupRef.current) {
      // Smooth hovering and patrolling
      const x = startPos[0] + Math.sin(t * speed + offsetPhase) * orbitRadius
      const z = startPos[2] + Math.cos(t * speed * 0.8 + offsetPhase) * orbitRadius
      const y = startPos[1] + Math.sin(t * 1.5 + offsetPhase) * 0.2 // bobbing
      
      // Calculate velocity for tilting
      const nextX = startPos[0] + Math.sin((t + 0.1) * speed + offsetPhase) * orbitRadius
      const nextZ = startPos[2] + Math.cos((t + 0.1) * speed * 0.8 + offsetPhase) * orbitRadius
      
      const dx = nextX - x
      const dz = nextZ - z
      
      groupRef.current.position.set(x, y, z)
      
      // Look in direction of travel and tilt slightly
      const target = new THREE.Vector3(x + dx, y, z + dz)
      groupRef.current.lookAt(target)
      groupRef.current.rotateX(0.1) // slight forward tilt
    }

    // Spin propellers extremely fast
    propRefs.current.forEach((prop) => {
      if (prop) prop.rotation.y += 0.5
    })

    // Occasionally scan crops (holographic grid simulation)
    if (scannerRef.current) {
      // Pulse scanning beam on and off periodically
      const isScanning = Math.sin(t * 0.5 + offsetPhase) > 0.5
      scannerRef.current.material.opacity = isScanning ? (0.15 + Math.sin(t * 5) * 0.05) : 0
      
      if (isScanning) {
        scannerRef.current.scale.set(
          1 + Math.sin(t * 10) * 0.1,
          1,
          1 + Math.cos(t * 10) * 0.1
        )
      }
    }
  })

  // Pre-calculate rotor positions relative to drone center
  const rotorPositions = [
    [0.3, 0.1, 0.3], [0.3, 0.1, -0.3],
    [-0.3, 0.1, 0.3], [-0.3, 0.1, -0.3]
  ]

  return (
    <group ref={groupRef} position={startPos}>
      {/* Sleek minimalist body */}
      <mesh castShadow>
        <cylinderGeometry args={[0.25, 0.2, 0.15, 16]} />
        <meshStandardMaterial color={color} roughness={0.1} metalness={0.8} />
      </mesh>
      
      {/* Central Camera/Sensor Eye */}
      <mesh position={[0, -0.05, 0.1]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.9} />
      </mesh>
      {/* Tiny red LED on camera */}
      <mesh position={[0, -0.05, 0.18]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>

      {/* Arms and Rotors */}
      {rotorPositions.map((pos, i) => (
        <group key={i} position={pos}>
          {/* Connecting arm */}
          <mesh position={[-pos[0]/2, -0.05, -pos[2]/2]}>
            <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
            <meshStandardMaterial color="#64748b" />
          </mesh>
          {/* Rotor Motor */}
          <mesh>
            <cylinderGeometry args={[0.06, 0.06, 0.08, 12]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
          {/* Spinning Propeller blades */}
          <mesh ref={(el) => (propRefs.current[i] = el)} position={[0, 0.05, 0]}>
            <boxGeometry args={[0.4, 0.01, 0.04]} />
            <meshStandardMaterial color="#000000" transparent opacity={0.6} />
          </mesh>
        </group>
      ))}

      {/* Holographic Scanning Cone */}
      <mesh ref={scannerRef} position={[0, -2, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[1.5, 0.05, 4, 16, 1, true]} />
        <meshBasicMaterial 
          color="#38bdf8" 
          transparent 
          opacity={0} 
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
          wireframe // Gives it that holographic grid look
        />
      </mesh>
    </group>
  )
}

/* ═══════════════════════════════════════════════════════════════
   Tractor — Autonomous minimal rover moving through fields
   ═══════════════════════════════════════════════════════════════ */
function Tractor() {
  const groupRef = useRef()
  const dustRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (groupRef.current) {
      // Moves very slowly back and forth along a path (e.g., adjacent to crops)
      // Path: Z from -4 to 4, at X = -3
      const z = Math.sin(t * 0.15) * 4
      groupRef.current.position.set(-3, 0.25, z)
      
      // Face direction of travel
      const dir = Math.cos(t * 0.15) > 0 ? 1 : -1
      // Smoothly rotate 180 degrees at the ends
      const targetRotationY = dir === 1 ? 0 : Math.PI
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY, 0.05)
    }

    if (dustRef.current) {
      // Pulsing dust effect behind tractor
      dustRef.current.scale.setScalar(1 + Math.sin(t * 5) * 0.2)
      dustRef.current.material.opacity = 0.1 + Math.sin(t * 10) * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      {/* Tractor Body (Sleek minimalist box) */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[0.8, 0.6, 1.2]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.1} />
      </mesh>
      {/* Dark glass cabin */}
      <mesh position={[0, 0.7, -0.1]} castShadow>
        <boxGeometry args={[0.6, 0.4, 0.6]} />
        <meshPhysicalMaterial color="#0f172a" roughness={0.1} metalness={0.8} clearcoat={1.0} />
      </mesh>
      
      {/* Wheels */}
      {/* Front Left */}
      <mesh position={[0.45, 0.2, 0.4]} rotation={[0, 0, Math.PI/2]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.15, 16]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} />
      </mesh>
      {/* Front Right */}
      <mesh position={[-0.45, 0.2, 0.4]} rotation={[0, 0, Math.PI/2]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.15, 16]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} />
      </mesh>
      {/* Back Left (Larger) */}
      <mesh position={[0.45, 0.3, -0.4]} rotation={[0, 0, Math.PI/2]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} />
      </mesh>
      {/* Back Right */}
      <mesh position={[-0.45, 0.3, -0.4]} rotation={[0, 0, Math.PI/2]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} />
      </mesh>

      {/* Trailing dust particles (simplified as a glowing soft sphere) */}
      <mesh ref={dustRef} position={[0, -0.1, -0.8]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshBasicMaterial color="#d1d5db" transparent opacity={0.1} depthWrite={false} />
      </mesh>
    </group>
  )
}

/* ═══════════════════════════════════════════════════════════════
   Vehicles Collection
   ═══════════════════════════════════════════════════════════════ */
export default function Vehicles() {
  return (
    <group>
      <Tractor />
      {/* Drone 1: Scans over Paddy */}
      <Drone startPos={[6, 4, -4]} orbitRadius={4} speed={0.4} offsetPhase={0} color="#ffffff" />
      {/* Drone 2: Scans over Vegetables, different phase */}
      <Drone startPos={[-6, 3.5, 4]} orbitRadius={3} speed={0.6} offsetPhase={Math.PI} color="#e2e8f0" />
    </group>
  )
}
