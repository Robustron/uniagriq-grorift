import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ═══════════════════════════════════════════════════════════════
   Atmosphere — Drifting pollen, dust, and data particles
   ═══════════════════════════════════════════════════════════════ */
export default function Atmosphere({ count = 200 }) {
  const pointsRef = useRef()

  const { positions, velocities, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    const colorPalette = [
      new THREE.Color('#fcd34d'), // Yellow (Pollen)
      new THREE.Color('#e2e8f0'), // White (Dust)
      new THREE.Color('#4ade80'), // Green (Data fireflies)
      new THREE.Color('#38bdf8')  // Blue (Water/Data)
    ]

    for (let i = 0; i < count; i++) {
      // Spread organically around the micro plot
      positions[i * 3] = (Math.random() - 0.5) * 8
      positions[i * 3 + 1] = Math.random() * 6 - 1 // Between -1 and 5
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8

      // Slow, random drift vectors
      velocities[i * 3] = (Math.random() - 0.5) * 0.01
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01

      // Random color from palette
      const c = colorPalette[Math.floor(Math.random() * colorPalette.length)]
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }

    return { positions, velocities, colors }
  }, [count])

  useFrame(() => {
    if (!pointsRef.current) return
    const pos = pointsRef.current.geometry.attributes.position.array

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      
      // Add a tiny bit of brownian motion / turbulence
      const noiseX = (Math.random() - 0.5) * 0.005
      const noiseY = (Math.random() - 0.5) * 0.005
      const noiseZ = (Math.random() - 0.5) * 0.005

      pos[i3] += velocities[i3] + noiseX
      pos[i3 + 1] += velocities[i3 + 1] + noiseY
      pos[i3 + 2] += velocities[i3 + 2] + noiseZ

      // Wrap around bounds softly
      if (Math.abs(pos[i3]) > 5) pos[i3] *= -0.9
      if (pos[i3 + 1] > 6) pos[i3 + 1] = -1
      if (pos[i3 + 1] < -2) pos[i3 + 1] = 5
      if (Math.abs(pos[i3 + 2]) > 5) pos[i3 + 2] *= -0.9
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.8}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
