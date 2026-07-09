import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ═══════════════════════════════════════════════════════════════
   ParticleField — Ambient pollen, fog particles, and gold dust
   spread across the entire scene volume. Creates atmosphere.
   Uses NormalBlending for visibility on bright white background.
   ═══════════════════════════════════════════════════════════════ */
export default function ParticleField({ count = 600 }) {
  const ref = useRef()

  const { positions, colors, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const speeds = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // Spread across scene volume
      positions[i * 3] = (Math.random() - 0.5) * 24
      positions[i * 3 + 1] = Math.random() * 14 - 3
      positions[i * 3 + 2] = (Math.random() - 0.5) * 18

      // Color palette: rich greens and golds visible on white
      const palette = Math.random()
      if (palette < 0.35) {
        // Rich green pollen
        colors[i * 3] = 0.15 + Math.random() * 0.15
        colors[i * 3 + 1] = 0.55 + Math.random() * 0.25
        colors[i * 3 + 2] = 0.1 + Math.random() * 0.1
      } else if (palette < 0.6) {
        // Gold dust
        colors[i * 3] = 0.7 + Math.random() * 0.15
        colors[i * 3 + 1] = 0.55 + Math.random() * 0.15
        colors[i * 3 + 2] = 0.1 + Math.random() * 0.1
      } else if (palette < 0.8) {
        // Forest emerald
        colors[i * 3] = 0.05 + Math.random() * 0.1
        colors[i * 3 + 1] = 0.35 + Math.random() * 0.25
        colors[i * 3 + 2] = 0.05 + Math.random() * 0.1
      } else {
        // Soft sage / muted green-grey
        colors[i * 3] = 0.45 + Math.random() * 0.1
        colors[i * 3 + 1] = 0.55 + Math.random() * 0.1
        colors[i * 3 + 2] = 0.4 + Math.random() * 0.1
      }

      speeds[i] = 0.002 + Math.random() * 0.006
    }

    return { positions, colors, speeds }
  }, [count])

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    const pos = ref.current.geometry.attributes.position.array

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      // Gentle upward drift
      pos[i3 + 1] += speeds[i]
      // Reset
      if (pos[i3 + 1] > 11) pos[i3 + 1] = -3

      // Lateral floating
      pos[i3] += Math.sin(t * 0.3 + i * 0.1) * 0.0008
      pos[i3 + 2] += Math.cos(t * 0.25 + i * 0.08) * 0.0006
    }

    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        vertexColors
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  )
}
