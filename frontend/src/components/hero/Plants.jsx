import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Simple blade of grass geometry using bezier curves
function createGrassGeometry() {
  const shape = new THREE.Shape()
  shape.moveTo(-0.04, 0)
  shape.quadraticCurveTo(-0.02, 0.5, 0, 1.0) // Left edge curves to tip
  shape.quadraticCurveTo(0.02, 0.5, 0.04, 0)  // Right edge curves back
  shape.closePath()
  return new THREE.ShapeGeometry(shape, 8)
}

// Simple organic sprout/leaf shape
function createSproutGeometry() {
  const shape = new THREE.Shape()
  shape.moveTo(0, 0)
  shape.bezierCurveTo(0.1, 0.1, 0.15, 0.3, 0.05, 0.5)
  shape.bezierCurveTo(0.02, 0.55, -0.02, 0.55, -0.05, 0.5)
  shape.bezierCurveTo(-0.15, 0.3, -0.1, 0.1, 0, 0)
  return new THREE.ShapeGeometry(shape, 8)
}

/* ═══════════════════════════════════════════════════════════════
   Plants — Sprouting grass and leaves around the beam base (x=3.2)
   and scattering organically across the foreground soil.
   ═══════════════════════════════════════════════════════════════ */
export default function Plants({ count = 80 }) {
  const meshRef = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  
  const grassGeom = useMemo(() => createGrassGeometry(), [])
  
  // Define positions clustered around the beam (x=3.2, z=0) and scattered
  const plantData = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      // 60% of plants are tightly clustered around the energy beam base
      const isClustered = Math.random() < 0.6
      let x, z
      
      if (isClustered) {
        const angle = Math.random() * Math.PI * 2
        const radius = 0.4 + Math.pow(Math.random(), 1.5) * 1.8 // Concentrated near x=3.2, z=0
        x = 3.2 + Math.cos(angle) * radius
        z = Math.sin(angle) * radius
      } else {
        // Scattered across the foreground
        x = (Math.random() - 0.5) * 12
        z = (Math.random() - 0.5) * 6 - 1
      }

      const height = 0.25 + Math.random() * 0.45
      const width = 0.6 + Math.random() * 0.6
      
      return {
        position: [x, -1.0, z],
        rotation: [
          (Math.random() - 0.5) * 0.15, // slight tilt forward/back
          Math.random() * Math.PI * 2,  // random rotation around vertical axis
          (Math.random() - 0.5) * 0.25  // organic bending
        ],
        scale: [width, height, width],
        phase: Math.random() * Math.PI * 2,
        swaySpeed: 0.8 + Math.random() * 1.2
      }
    })
  }, [count])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime

    plantData.forEach((plant, i) => {
      // Wind sway animation
      const sway = Math.sin(t * plant.swaySpeed + plant.phase) * 0.08
      
      dummy.position.set(...plant.position)
      dummy.rotation.set(
        plant.rotation[0] + sway,
        plant.rotation[1],
        plant.rotation[2] + sway * 0.5
      )
      dummy.scale.set(...plant.scale)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    })

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[grassGeom, null, count]}>
      <meshStandardMaterial
        color="#1b5e20"
        emissive="#09300c"
        emissiveIntensity={0.4}
        side={THREE.DoubleSide}
        roughness={0.6}
        metalness={0.1}
      />
    </instancedMesh>
  )
}
