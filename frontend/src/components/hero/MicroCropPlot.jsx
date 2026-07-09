import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

/* ═══════════════════════════════════════════════════════════════
   Soil Cross-Section with visible roots and nutrients
   ═══════════════════════════════════════════════════════════════ */
function SoilLayer() {
  const nutrientRef = useRef()
  const waterRef = useRef()
  
  // 50 tiny nutrient particles
  const { nPos, wPos } = useMemo(() => {
    const nPos = new Float32Array(50 * 3)
    const wPos = new Float32Array(30 * 3)
    
    // Nutrients (Amber/Gold)
    for (let i = 0; i < 50; i++) {
      nPos[i*3] = (Math.random() - 0.5) * 1.8
      nPos[i*3+1] = -Math.random() * 1.5 // Below surface
      nPos[i*3+2] = (Math.random() - 0.5) * 1.8
    }

    // Water (Blue)
    for (let i = 0; i < 30; i++) {
      wPos[i*3] = (Math.random() - 0.5) * 1.8
      wPos[i*3+1] = -Math.random() * 1.5
      wPos[i*3+2] = (Math.random() - 0.5) * 1.8
    }
    
    return { nPos, wPos }
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (nutrientRef.current) {
      const positions = nutrientRef.current.geometry.attributes.position.array
      for (let i = 0; i < 50; i++) {
        // Slowly float upwards towards the roots
        positions[i*3+1] += 0.001 + Math.sin(t + i)*0.001
        if (positions[i*3+1] > 0) positions[i*3+1] = -1.5
      }
      nutrientRef.current.geometry.attributes.position.needsUpdate = true
    }
    
    if (waterRef.current) {
      const positions = waterRef.current.geometry.attributes.position.array
      for (let i = 0; i < 30; i++) {
        // Slowly sink downwards
        positions[i*3+1] -= 0.002
        if (positions[i*3+1] < -1.5) positions[i*3+1] = 0
      }
      waterRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <group position={[0, -0.75, 0]}>
      {/* The main block of earth - transparent gelatinous look */}
      <RoundedBox args={[2, 1.5, 2]} radius={0.1} smoothness={4} castShadow receiveShadow>
        <meshPhysicalMaterial 
          color="#3f2e1f" 
          transmission={0.8} // Glass-like transparency
          transparent
          opacity={0.9}
          roughness={0.2}
          thickness={1.5}
          ior={1.2} // Slight refraction
        />
      </RoundedBox>

      {/* Top crust (opaque soil) */}
      <mesh position={[0, 0.76, 0]} receiveShadow>
        <boxGeometry args={[1.95, 0.02, 1.95]} />
        <meshStandardMaterial color="#291e12" roughness={0.9} />
      </mesh>

      {/* Stylized Root System (Abstract branching cylinders inside the transparent box) */}
      <group position={[0, 0.75, 0]}>
        {/* Main taproot */}
        <mesh position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.04, 0.01, 0.8, 8]} />
          <meshStandardMaterial color="#d4c3b3" />
        </mesh>
        {/* Branch 1 */}
        <mesh position={[0.2, -0.3, 0.1]} rotation={[0, 0, -0.5]}>
          <cylinderGeometry args={[0.015, 0.005, 0.5, 8]} />
          <meshStandardMaterial color="#d4c3b3" />
        </mesh>
        {/* Branch 2 */}
        <mesh position={[-0.15, -0.5, -0.15]} rotation={[0.4, 0, 0.4]}>
          <cylinderGeometry args={[0.015, 0.005, 0.6, 8]} />
          <meshStandardMaterial color="#d4c3b3" />
        </mesh>
      </group>

      {/* Flowing Nutrients */}
      <points ref={nutrientRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={50} array={nPos} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial color="#fbbf24" size={0.04} transparent opacity={0.6} depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>

      {/* Flowing Water */}
      <points ref={waterRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={30} array={wPos} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial color="#38bdf8" size={0.05} transparent opacity={0.5} depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>

    </group>
  )
}

/* ═══════════════════════════════════════════════════════════════
   The Premium Crop (Stylized, elegant)
   ═══════════════════════════════════════════════════════════════ */
function PremiumCrop() {
  const cropRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (cropRef.current) {
      // Very slow organic sway
      cropRef.current.rotation.z = Math.sin(t * 0.5) * 0.05
      cropRef.current.rotation.x = Math.cos(t * 0.4) * 0.05
    }
  })

  return (
    <group ref={cropRef} position={[0, 0, 0]}>
      {/* Main stem */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.04, 1.2, 8]} />
        <meshStandardMaterial color="#22c55e" roughness={0.4} />
      </mesh>
      
      {/* Elegant minimalist leaves */}
      {/* Leaf 1 - Lower Right */}
      <mesh position={[0.3, 0.4, 0]} rotation={[0, 0, -1.0]} castShadow>
        <sphereGeometry args={[0.4, 16, 8]} scale={[1, 0.1, 0.4]} />
        <meshStandardMaterial color="#4ade80" roughness={0.2} metalness={0.1} />
      </mesh>
      {/* Leaf 2 - Mid Left */}
      <mesh position={[-0.25, 0.7, 0.1]} rotation={[0, 2, 0.8]} castShadow>
        <sphereGeometry args={[0.35, 16, 8]} scale={[1, 0.1, 0.4]} />
        <meshStandardMaterial color="#4ade80" roughness={0.2} metalness={0.1} />
      </mesh>
      {/* Leaf 3 - Upper Right */}
      <mesh position={[0.2, 1.0, -0.1]} rotation={[-0.5, 0, -0.6]} castShadow>
        <sphereGeometry args={[0.25, 16, 8]} scale={[1, 0.1, 0.4]} />
        <meshStandardMaterial color="#86efac" roughness={0.2} metalness={0.1} />
      </mesh>
    </group>
  )
}

/* ═══════════════════════════════════════════════════════════════
   MicroCropPlot — The hero of the scene
   ═══════════════════════════════════════════════════════════════ */
export default function MicroCropPlot() {
  return (
    <group position={[0, 0, 0]}>
      <SoilLayer />
      <PremiumCrop />
      
      {/* Optional: A very soft glowing ring around the base on the ground */}
      <mesh position={[0, -1.49, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <ringGeometry args={[1.5, 2.5, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.03} depthWrite={false} />
      </mesh>
    </group>
  )
}
