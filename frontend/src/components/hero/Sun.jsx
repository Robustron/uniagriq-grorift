import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ═══════════════════════════════════════════════════════════════
   Sun — A premium, stylized solar orb in the upper background.
   Pulses gently and radiates warmth, matching nature/hope vibes.
   ═══════════════════════════════════════════════════════════════ */
export default function Sun() {
  const sunRef = useRef()
  const glow1Ref = useRef()
  const glow2Ref = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    
    // Slow breathing pulse for the sun and its corona/glow rings
    if (sunRef.current) {
      const scale = 1.0 + Math.sin(t * 0.8) * 0.02
      sunRef.current.scale.set(scale, scale, scale)
    }
    
    if (glow1Ref.current) {
      glow1Ref.current.rotation.z = t * 0.05
      glow1Ref.current.scale.setScalar(1.4 + Math.sin(t * 0.6) * 0.05)
      glow1Ref.current.material.opacity = 0.25 + Math.sin(t * 0.8) * 0.05
    }
    
    if (glow2Ref.current) {
      glow2Ref.current.rotation.z = -t * 0.03
      glow2Ref.current.scale.setScalar(2.0 + Math.sin(t * 0.4 + 1) * 0.08)
      glow2Ref.current.material.opacity = 0.12 + Math.sin(t * 0.5) * 0.03
    }
  })

  return (
    // Positioned upward and slightly back-right in the sky
    <group position={[3.2, 5.5, -6]}>
      {/* Central bright solar core */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshBasicMaterial 
          color="#fff6d5" 
          toneMapped={false}
        />
      </mesh>

      {/* Inner corona glow plane */}
      <mesh ref={glow1Ref} position={[0, 0, -0.01]}>
        <planeGeometry args={[2.5, 2.5]} />
        <meshBasicMaterial
          color="#f59e0b"
          transparent
          opacity={0.25}
          blending={THREE.NormalBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Outer soft volumetric atmospheric glow ring */}
      <mesh ref={glow2Ref} position={[0, 0, -0.02]}>
        <planeGeometry args={[4.0, 4.0]} />
        <meshBasicMaterial
          color="#ea580c"
          transparent
          opacity={0.12}
          blending={THREE.NormalBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Soft warm sun ray helper (subtle downward cylinder gradient simulation) */}
      <mesh position={[0, -4, -0.03]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.6, 2.0, 8, 16, 1, true]} />
        <meshBasicMaterial
          color="#fbbf24"
          transparent
          opacity={0.03}
          blending={THREE.NormalBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
