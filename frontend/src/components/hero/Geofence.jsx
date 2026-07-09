import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ═══════════════════════════════════════════════════════════════
   Geofence — Elegant glowing boundary wrapping the farm.
   ═══════════════════════════════════════════════════════════════ */
export default function Geofence({ width = 31, depth = 23 }) {
  const lineRef = useRef()
  const glowRef = useRef()
  const markersRef = useRef([])

  // Calculate boundary points
  const points = useMemo(() => {
    const hw = width / 2
    const hd = depth / 2
    // A rectangle slightly smaller than the terrain base
    return [
      new THREE.Vector3(-hw, 0, -hd),
      new THREE.Vector3(hw, 0, -hd),
      new THREE.Vector3(hw, 0, hd),
      new THREE.Vector3(-hw, 0, hd),
      new THREE.Vector3(-hw, 0, -hd) // Close loop
    ]
  }, [width, depth])

  const lineGeometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [points])

  // GPS Markers that travel along the boundary
  const markerCount = 4
  const markerData = useMemo(() => {
    return Array.from({ length: markerCount }, (_, i) => ({
      progress: (i / markerCount), // 0 to 1 along the perimeter
      speed: 0.05 + Math.random() * 0.02
    }))
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime

    // Gently pulse the main geofence line
    if (lineRef.current) {
      lineRef.current.material.opacity = 0.4 + Math.sin(t * 1.5) * 0.2
    }

    // Outer glow subtle expansion/contraction
    if (glowRef.current) {
      const scale = 1.0 + Math.sin(t * 0.8) * 0.01
      glowRef.current.scale.set(scale, 1, scale)
      glowRef.current.material.opacity = 0.1 + Math.sin(t * 1.2) * 0.05
    }

    // Animate GPS markers traveling around the perimeter
    const perimeter = (width * 2) + (depth * 2)
    markerData.forEach((marker, i) => {
      marker.progress += (marker.speed * 0.1 * state.clock.getDelta())
      if (marker.progress > 1) marker.progress -= 1

      // Map progress (0-1) to physical coordinates
      let x, z
      const dist = marker.progress * perimeter
      
      // Top edge (left to right)
      if (dist <= width) {
        x = -width/2 + dist
        z = -depth/2
      } 
      // Right edge (top to bottom)
      else if (dist <= width + depth) {
        x = width/2
        z = -depth/2 + (dist - width)
      }
      // Bottom edge (right to left)
      else if (dist <= width * 2 + depth) {
        x = width/2 - (dist - width - depth)
        z = depth/2
      }
      // Left edge (bottom to top)
      else {
        x = -width/2
        z = depth/2 - (dist - width * 2 - depth)
      }

      if (markersRef.current[i]) {
        markersRef.current[i].position.set(x, 0.1, z)
        // Make markers blink softly
        markersRef.current[i].material.opacity = 0.5 + Math.sin(t * 4 + i) * 0.5
      }
    })
  })

  return (
    <group position={[0, -0.4, 0]}>
      {/* Core laser line */}
      <line ref={lineRef} geometry={lineGeometry}>
        <lineBasicMaterial 
          color="#38bdf8" 
          linewidth={2} 
          transparent 
          opacity={0.6} 
          blending={THREE.AdditiveBlending}
        />
      </line>

      {/* Expanded ambient glow line */}
      <line ref={glowRef} geometry={lineGeometry} position={[0, -0.05, 0]}>
        <lineBasicMaterial 
          color="#0284c7" 
          linewidth={6} 
          transparent 
          opacity={0.15} 
          blending={THREE.AdditiveBlending}
        />
      </line>

      {/* Corner Nodes (static) */}
      {points.slice(0, 4).map((pos, i) => (
        <mesh key={`node-${i}`} position={pos}>
          <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.8} />
          {/* Inner pulse ring */}
          <mesh position={[0, 0.06, 0]} rotation={[-Math.PI/2, 0, 0]}>
            <ringGeometry args={[0.2, 0.25, 16]} />
            <meshBasicMaterial color="#7dd3fc" transparent opacity={0.4} />
          </mesh>
        </mesh>
      ))}

      {/* Traveling GPS Markers */}
      {markerData.map((_, i) => (
        <mesh 
          key={`marker-${i}`} 
          ref={el => markersRef.current[i] = el}
        >
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#ffffff" transparent blending={THREE.AdditiveBlending} />
          {/* Trail/glow */}
          <mesh scale={2.5}>
             <sphereGeometry args={[0.08, 16, 16]} />
             <meshBasicMaterial color="#38bdf8" transparent opacity={0.3} blending={THREE.AdditiveBlending} />
          </mesh>
        </mesh>
      ))}
    </group>
  )
}
