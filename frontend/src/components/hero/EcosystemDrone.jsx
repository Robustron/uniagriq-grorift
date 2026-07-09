import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ═══════════════════════════════════════════════════════════════
   EcosystemDrone — A single high-fidelity drone scanning the crop
   ═══════════════════════════════════════════════════════════════ */
export default function EcosystemDrone({ startPos = [0, 2, 0] }) {
  const groupRef = useRef()
  const propRefs = useRef([])
  const scannerRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime

    if (groupRef.current) {
      // Very slow patrol left and right over the crop
      // Moves smoothly between x=-1.5 and x=1.5
      const patrolX = Math.sin(t * 0.4) * 1.5
      const patrolY = startPos[1] + Math.sin(t * 1.5) * 0.1 // Hover bobbing
      
      const nextX = Math.sin((t + 0.1) * 0.4) * 1.5
      const dx = nextX - patrolX
      
      groupRef.current.position.set(patrolX, patrolY, 0)
      
      // Look slightly forward and tilt based on movement direction
      const target = new THREE.Vector3(patrolX + dx, patrolY, 0.5)
      groupRef.current.lookAt(target)
      groupRef.current.rotateX(0.05) // Subtle forward tilt
    }

    // Spin propellers extremely fast (motion blur effect)
    propRefs.current.forEach((prop) => {
      if (prop) prop.rotation.y += 1.2
    })

    // Scanning spotlight
    if (scannerRef.current) {
      // The drone stops moving near the edges. We scan when it's relatively still.
      const speed = Math.abs(Math.cos(t * 0.4))
      const isScanning = speed < 0.2 // Scan when turning around (slowest point)
      
      const targetOpacity = isScanning ? 0.3 : 0.0
      scannerRef.current.material.opacity = THREE.MathUtils.lerp(
        scannerRef.current.material.opacity, 
        targetOpacity, 
        0.1
      )
      
      if (isScanning) {
        scannerRef.current.scale.set(
          1 + Math.sin(t * 15) * 0.05,
          1,
          1 + Math.cos(t * 15) * 0.05
        )
      }
    }
  })

  // Pre-calculate rotor positions relative to drone center
  const rotorPositions = [
    [0.25, 0.05, 0.25], [0.25, 0.05, -0.25],
    [-0.25, 0.05, 0.25], [-0.25, 0.05, -0.25]
  ]

  return (
    <group ref={groupRef} position={startPos}>
      {/* Sleek minimalist main body */}
      <mesh castShadow>
        <cylinderGeometry args={[0.15, 0.12, 0.1, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.8} />
      </mesh>
      
      {/* Central Camera / Lens */}
      <mesh position={[0, -0.04, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.9} />
      </mesh>
      {/* Lens reflection ring */}
      <mesh position={[0, -0.09, 0]} rotation={[Math.PI/2, 0, 0]}>
        <ringGeometry args={[0.02, 0.03, 16]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>

      {/* Arms and Rotors */}
      {rotorPositions.map((pos, i) => (
        <group key={i} position={pos}>
          {/* Connecting arm */}
          <mesh position={[-pos[0]/2, -0.02, -pos[2]/2]}>
            <cylinderGeometry args={[0.015, 0.015, 0.35, 8]} />
            <meshStandardMaterial color="#64748b" />
          </mesh>
          {/* Rotor Motor Housing */}
          <mesh>
            <cylinderGeometry args={[0.04, 0.04, 0.06, 12]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
          {/* Spinning Propeller blades (transparent to simulate motion blur) */}
          <mesh ref={(el) => (propRefs.current[i] = el)} position={[0, 0.04, 0]}>
            <boxGeometry args={[0.25, 0.005, 0.02]} />
            <meshStandardMaterial color="#000000" transparent opacity={0.3} />
          </mesh>
        </group>
      ))}

      {/* Scanning Cone (Spotlight visualization) */}
      <mesh ref={scannerRef} position={[0, -1.5, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.8, 0.02, 3, 16, 1, true]} />
        <meshBasicMaterial 
          color="#fef08a" 
          transparent 
          opacity={0} 
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}
