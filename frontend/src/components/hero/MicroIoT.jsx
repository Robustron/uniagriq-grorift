import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ═══════════════════════════════════════════════════════════════
   Micro Geofence — A tight, elegant boundary around the plot
   ═══════════════════════════════════════════════════════════════ */
function MicroGeofence() {
  const glowRef = useRef()
  const packetRef = useRef()

  // 2x2 box, so corners are at ±1
  const points = useMemo(() => {
    return [
      new THREE.Vector3(-1.1, 0, -1.1),
      new THREE.Vector3(1.1, 0, -1.1),
      new THREE.Vector3(1.1, 0, 1.1),
      new THREE.Vector3(-1.1, 0, 1.1),
      new THREE.Vector3(-1.1, 0, -1.1)
    ]
  }, [])

  const lineGeom = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    
    // Slow breathing glow
    if (glowRef.current) {
      glowRef.current.material.opacity = 0.3 + Math.sin(t * 1.5) * 0.1
    }

    // Network packet traveling around the boundary
    if (packetRef.current) {
      // 1 loop every 4 seconds
      const progress = (t * 0.25) % 1
      const dist = progress * 8.8 // perimeter is 8.8 (4 * 2.2)
      
      let x, z
      if (dist <= 2.2) { x = -1.1 + dist; z = -1.1 }
      else if (dist <= 4.4) { x = 1.1; z = -1.1 + (dist - 2.2) }
      else if (dist <= 6.6) { x = 1.1 - (dist - 4.4); z = 1.1 }
      else { x = -1.1; z = 1.1 - (dist - 6.6) }
      
      packetRef.current.position.set(x, 0.05, z)
      // Pulse brightness
      packetRef.current.material.opacity = 0.5 + Math.sin(t * 10) * 0.5
    }
  })

  return (
    <group position={[0, 0.76, 0]}> {/* Sits right on top of the soil */}
      {/* Base thin line (White/Green) */}
      <line geometry={lineGeom}>
        <lineBasicMaterial color="#ffffff" transparent opacity={0.2} blending={THREE.AdditiveBlending} />
      </line>
      
      {/* Outer glowing line */}
      <line ref={glowRef} geometry={lineGeom} position={[0, -0.01, 0]}>
        <lineBasicMaterial color="#4ade80" transparent opacity={0.4} linewidth={3} blending={THREE.AdditiveBlending} />
      </line>

      {/* Verification Packet */}
      <mesh ref={packetRef}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color="#38bdf8" transparent blending={THREE.AdditiveBlending} />
        {/* Packet glow */}
        <mesh scale={2}>
           <sphereGeometry args={[0.04, 16, 16]} />
           <meshBasicMaterial color="#4ade80" transparent opacity={0.4} blending={THREE.AdditiveBlending} />
        </mesh>
      </mesh>

      {/* Corner Nodes */}
      {points.slice(0, 4).map((pos, i) => (
        <mesh key={i} position={pos}>
          <cylinderGeometry args={[0.04, 0.04, 0.02, 16]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  )
}

/* ═══════════════════════════════════════════════════════════════
   IoTPoles — 4 elegant sensors placed in the soil
   ═══════════════════════════════════════════════════════════════ */
function IoTPoles() {
  const poles = useMemo(() => [
    { pos: [0.6, 0.9, -0.6], phase: 0 },
    { pos: [-0.7, 0.9, -0.4], phase: Math.PI / 2 },
    { pos: [0.5, 0.9, 0.7], phase: Math.PI },
    { pos: [-0.5, 0.9, 0.5], phase: Math.PI * 1.5 }
  ], [])

  const ringsRef = useRef([])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    ringsRef.current.forEach((ring, i) => {
      if (!ring) return
      // Expanding circle animation
      const localTime = (t + poles[i].phase) % 2
      const scale = localTime * 1.5 // Expand up to 1.5x
      ring.scale.set(scale, scale, scale)
      ring.material.opacity = Math.max(0, 1 - localTime) * 0.4
    })
  })

  return (
    <group>
      {poles.map((pole, i) => (
        <group key={i} position={pole.pos}>
          {/* Main sleek pole */}
          <mesh castShadow>
            <cylinderGeometry args={[0.015, 0.015, 0.3, 8]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} />
          </mesh>
          {/* Sensor head */}
          <mesh position={[0, 0.15, 0]}>
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.9} />
          </mesh>
          {/* Tiny LED */}
          <mesh position={[0, 0.18, 0]}>
            <sphereGeometry args={[0.01, 8, 8]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
          
          {/* Expanding Data Circle */}
          <mesh ref={(el) => (ringsRef.current[i] = el)} rotation={[-Math.PI/2, 0, 0]} position={[0, -0.14, 0]}>
            <ringGeometry args={[0.05, 0.06, 32]} />
            <meshBasicMaterial color="#4ade80" transparent depthWrite={false} blending={THREE.AdditiveBlending} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/* ═══════════════════════════════════════════════════════════════
   MicroIoT — Combines the tiny poles and the geofence
   ═══════════════════════════════════════════════════════════════ */
export default function MicroIoT() {
  return (
    <group>
      <MicroGeofence />
      <IoTPoles />
    </group>
  )
}
