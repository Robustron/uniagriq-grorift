import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ═══════════════════════════════════════════════════════════════
   Weather — A tiny premium cloud and sunlight over the plot
   ═══════════════════════════════════════════════════════════════ */
export default function Weather() {
  const cloudRef = useRef()
  const shadowRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    
    // Very slow drift left and right
    if (cloudRef.current) {
      const x = Math.sin(t * 0.1) * 2
      cloudRef.current.position.x = x
      // Gentle bobbing
      cloudRef.current.position.y = 3 + Math.sin(t * 0.5) * 0.1
      
      // Sync the faux shadow with the cloud position
      if (shadowRef.current) {
        shadowRef.current.position.x = x
        // Fade shadow out when cloud moves too far from center
        shadowRef.current.material.opacity = 0.4 * (1 - Math.abs(x) / 3)
      }
    }
  })

  return (
    <group>
      {/* Premium Minimalist Cloud (Made of intersecting spheres) */}
      <group ref={cloudRef} position={[0, 3, -1]}>
        {/* Main body */}
        <mesh position={[0, 0, 0]} castShadow>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial color="#ffffff" roughness={0.8} />
        </mesh>
        <mesh position={[0.3, -0.1, 0.1]} castShadow>
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshStandardMaterial color="#ffffff" roughness={0.8} />
        </mesh>
        <mesh position={[-0.35, -0.05, -0.1]} castShadow>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial color="#ffffff" roughness={0.8} />
        </mesh>
        <mesh position={[0.15, 0.2, -0.15]} castShadow>
          <sphereGeometry args={[0.28, 32, 32]} />
          <meshStandardMaterial color="#ffffff" roughness={0.8} />
        </mesh>

        {/* Tiny abstract "Rain/Data" drop occasionally falling */}
        <Drop />
      </group>

      {/* Drifting cloud shadow over the soil (Faux shadow for better control) */}
      <mesh ref={shadowRef} position={[0, 0.77, -1]} rotation={[-Math.PI/2, 0, 0]}>
        <planeGeometry args={[2.5, 2.5]} />
        <meshBasicMaterial 
          color="#000000" 
          transparent 
          opacity={0.4}
          depthWrite={false}
          // We can't easily do a soft edge without a texture, 
          // but a small shadow feels nice and grounded.
        />
      </mesh>
    </group>
  )
}

function Drop() {
  const dropRef = useRef()
  const delayOffset = useMemo(() => Math.random() * 5, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime + delayOffset
    if (dropRef.current) {
      // Drops every few seconds
      const cycle = t % 4
      if (cycle < 1) {
        dropRef.current.position.y = -cycle * 3 // fall down
        dropRef.current.material.opacity = 1 - cycle
      } else {
        dropRef.current.position.y = 0
        dropRef.current.material.opacity = 0
      }
    }
  })

  return (
    <mesh ref={dropRef} position={[0, -0.2, 0]}>
      <sphereGeometry args={[0.03, 8, 8]} />
      <meshBasicMaterial color="#38bdf8" transparent opacity={0} />
    </mesh>
  )
}
