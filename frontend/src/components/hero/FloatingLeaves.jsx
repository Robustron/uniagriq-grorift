import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const LEAF_COUNT = 100

/* ═══════════════════════════════════════════════════════════════
   Creates a realistic leaf silhouette using Bezier curves.
   ═══════════════════════════════════════════════════════════════ */
function createLeafGeometry() {
  const shape = new THREE.Shape()
  shape.moveTo(0, -0.5)
  shape.bezierCurveTo(0.18, -0.3, 0.22, 0.1, 0.08, 0.4)
  shape.bezierCurveTo(0.03, 0.52, -0.03, 0.52, -0.08, 0.4)
  shape.bezierCurveTo(-0.22, 0.1, -0.18, -0.3, 0, -0.5)
  return new THREE.ShapeGeometry(shape, 12)
}

/* ═══════════════════════════════════════════════════════════════
   FloatingLeaves — Organic 3D leaves at varying depths.
   Wind-driven motion, flutter, rotation, and parallax depth.
   Rich green leaves visible on bright white background.
   ═══════════════════════════════════════════════════════════════ */
export default function FloatingLeaves() {
  const meshRef = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const leafData = useMemo(() => {
    return Array.from({ length: LEAF_COUNT }, (_, i) => {
      // Spread leaves across the scene volume
      const depth = Math.random()
      const scale = 0.15 + depth * 0.5 + Math.random() * 0.25

      return {
        position: [
          (Math.random() - 0.5) * 16,
          Math.random() * 12 - 3,
          (Math.random() - 0.5) * 10 - 2
        ],
        rotation: [
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2
        ],
        scale,
        // Wind simulation parameters
        windSpeed: 0.1 + Math.random() * 0.3,
        rotSpeed: [
          (0.15 + Math.random() * 0.65) * (Math.random() > 0.5 ? 1 : -1),
          (0.08 + Math.random() * 0.42) * (Math.random() > 0.5 ? 1 : -1),
          (0.2 + Math.random() * 0.5) * (Math.random() > 0.5 ? 1 : -1),
        ],
        phase: Math.random() * Math.PI * 2,
        driftX: (Math.random() - 0.5) * 0.5,
        driftZ: (Math.random() - 0.5) * 0.4,
        // Flutter amplitude
        flutter: 0.25 + Math.random() * 0.45,
      }
    })
  }, [])

  const geometry = useMemo(() => createLeafGeometry(), [])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime

    leafData.forEach((leaf, i) => {
      // Wind-driven position animation
      const windX = Math.sin(t * leaf.windSpeed + leaf.phase) * leaf.driftX * 2
      const windY = Math.sin(t * leaf.windSpeed * 0.7 + leaf.phase) * leaf.flutter
      const windZ = Math.cos(t * leaf.windSpeed * 0.5 + leaf.phase) * leaf.driftZ

      dummy.position.set(
        leaf.position[0] + windX,
        leaf.position[1] + windY,
        leaf.position[2] + windZ
      )

      // Organic rotation — flutter + tumble
      dummy.rotation.set(
        leaf.rotation[0] + t * leaf.rotSpeed[0] * 0.25,
        leaf.rotation[1] + t * leaf.rotSpeed[1] * 0.2,
        leaf.rotation[2] + Math.sin(t * 1.5 + leaf.phase) * 0.4
      )

      dummy.scale.setScalar(leaf.scale)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    })

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[geometry, null, LEAF_COUNT]}>
      <meshStandardMaterial
        color="#226b12"
        emissive="#0d3c05"
        emissiveIntensity={0.25}
        side={THREE.DoubleSide}
        transparent
        opacity={0.88}
        roughness={0.4}
        metalness={0.05}
      />
    </instancedMesh>
  )
}
