import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ═══════════════════════════════════════════════════════════════
   CropField — Renders thousands of stylized crops efficiently
   ═══════════════════════════════════════════════════════════════ */
function CropField({ 
  count = 1000, 
  color = '#86efac', 
  bounds = [10, 10], 
  position = [0, 0, 0], 
  cropHeight = 0.4,
  swaySpeed = 1.0,
  swayAmount = 0.05
}) {
  const meshRef = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])

  // Generate deterministic grid with slight organic noise
  const cropData = useMemo(() => {
    const data = []
    const cols = Math.floor(Math.sqrt(count * (bounds[0] / bounds[1])))
    const rows = Math.floor(count / cols)
    
    const spacingX = bounds[0] / cols
    const spacingZ = bounds[1] / rows

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        // Base grid position
        let x = (i - cols / 2) * spacingX + spacingX / 2
        let z = (j - rows / 2) * spacingZ + spacingZ / 2
        
        // Add organic noise so it doesn't look perfectly robotic
        x += (Math.random() - 0.5) * spacingX * 0.4
        z += (Math.random() - 0.5) * spacingZ * 0.4

        const heightScale = 0.8 + Math.random() * 0.4
        const phase = Math.random() * Math.PI * 2

        data.push({ x, z, heightScale, phase })
      }
    }
    return data
  }, [count, bounds])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime

    cropData.forEach((crop, i) => {
      // Very subtle, premium wind swaying
      const swayX = Math.sin(t * swaySpeed + crop.phase) * swayAmount
      const swayZ = Math.cos(t * swaySpeed * 0.8 + crop.phase) * swayAmount

      dummy.position.set(crop.x + swayX, cropHeight * crop.heightScale / 2, crop.z + swayZ)
      dummy.rotation.set(
        Math.sin(t * swaySpeed + crop.phase) * 0.1, 
        0, 
        Math.cos(t * swaySpeed + crop.phase) * 0.1
      )
      dummy.scale.set(1, crop.heightScale, 1)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    })

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  // A sleek, minimal geometric stalk for the crop
  const geometry = useMemo(() => new THREE.CylinderGeometry(0.04, 0.04, cropHeight, 6), [cropHeight])

  return (
    <group position={position}>
      {/* Soil Bed under this specific field */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[bounds[0] * 0.95, 0.1, bounds[1] * 0.95]} />
        <meshStandardMaterial color="#1f2937" roughness={0.9} />
      </mesh>
      
      <instancedMesh ref={meshRef} args={[geometry, null, cropData.length]} castShadow receiveShadow>
        <meshStandardMaterial 
          color={color} 
          roughness={0.6} 
          metalness={0.1}
        />
      </instancedMesh>
    </group>
  )
}

/* ═══════════════════════════════════════════════════════════════
   Greenhouse — Minimalist glass structure
   ═══════════════════════════════════════════════════════════════ */
function Greenhouse({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      {/* Base floor */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[4, 0.1, 6]} />
        <meshStandardMaterial color="#e5e7eb" roughness={0.3} />
      </mesh>
      
      {/* Glass enclosure */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[3.8, 1.8, 5.8]} />
        <meshPhysicalMaterial 
          color="#ffffff"
          transparent
          opacity={0.3}
          roughness={0.1}
          transmission={0.9} // Glass effect
          thickness={0.5}
        />
      </mesh>

      {/* Internal crops (simplified) */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[3.2, 0.4, 5.2]} />
        <meshStandardMaterial color="#34d399" roughness={0.8} />
      </mesh>
    </group>
  )
}

/* ═══════════════════════════════════════════════════════════════
   WaterReservoir — Clean, stylized pool
   ═══════════════════════════════════════════════════════════════ */
function WaterReservoir({ position = [0, 0, 0] }) {
  const waterRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (waterRef.current) {
      // Tiny imperceptible wave animation
      waterRef.current.position.y = 0.45 + Math.sin(t * 0.5) * 0.02
    }
  })

  return (
    <group position={position}>
      {/* Concrete basin */}
      <mesh position={[0, 0.25, 0]} receiveShadow castShadow>
        <boxGeometry args={[5, 0.5, 5]} />
        <meshStandardMaterial color="#d1d5db" roughness={0.7} />
      </mesh>
      
      {/* Water surface */}
      <mesh ref={waterRef} position={[0, 0.45, 0]} receiveShadow>
        <boxGeometry args={[4.6, 0.1, 4.6]} />
        <meshPhysicalMaterial 
          color="#38bdf8"
          roughness={0.1}
          metalness={0.1}
          transmission={0.8}
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  )
}

/* ═══════════════════════════════════════════════════════════════
   FarmTerrain — The Base Platform & Layout
   ═══════════════════════════════════════════════════════════════ */
export default function FarmTerrain() {
  return (
    <group>
      {/* Main Ground Platform (Sleek, rounded edge base) */}
      <mesh position={[0, -0.5, 0]} receiveShadow>
        <boxGeometry args={[32, 1, 24]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.4} metalness={0.05} />
      </mesh>

      {/* Farm Roads (Subtle grid paths) */}
      <mesh position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[32, 2]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
        <group rotation={[-Math.PI / 2, 0, 0]} />
      </mesh>
      <mesh position={[2, 0.01, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[24, 2]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
        <group rotation={[-Math.PI / 2, 0, 0]} />
      </mesh>

      {/* Crop Sections */}
      {/* Wheat - Golden */}
      <CropField count={600} color="#fbbf24" bounds={[8, 8]} position={[-8, 0, -6]} cropHeight={0.6} swaySpeed={0.8} swayAmount={0.08} />
      
      {/* Vegetables - Deep Green */}
      <CropField count={400} color="#059669" bounds={[6, 6]} position={[-8, 0, 6]} cropHeight={0.3} swaySpeed={1.2} swayAmount={0.03} />
      
      {/* Paddy - Vibrant Green */}
      <CropField count={800} color="#4ade80" bounds={[10, 8]} position={[8, 0, -6]} cropHeight={0.5} swaySpeed={1.5} swayAmount={0.06} />

      {/* Structures */}
      <Greenhouse position={[8, 0, 6]} />
      <WaterReservoir position={[-1, 0, 8]} />
    </group>
  )
}
