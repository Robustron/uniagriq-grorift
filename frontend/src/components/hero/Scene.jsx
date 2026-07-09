import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'

/* ═══════════════════════════════════════════════════════════════
   Abstract Sun & Square Background Shapes
   ═══════════════════════════════════════════════════════════════ */
function AbstractShapes() {
  const groupRef = useRef()
  
  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.2
      groupRef.current.rotation.z = Math.sin(t * 0.2) * 0.05
    }
  })

  return (
    <group ref={groupRef} position={[4, 2, -6]}>
      {/* Cream rotated square */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 8]}>
        <planeGeometry args={[8, 8]} />
        <meshBasicMaterial color="#fcd34d" transparent opacity={0.3} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      
      {/* Yellow sun circle */}
      <mesh position={[1, 1, 0.1]}>
        <circleGeometry args={[2, 64]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.3} depthWrite={false} />
      </mesh>
    </group>
  )
}

/* ═══════════════════════════════════════════════════════════════
   Thick Energy Beam (Multi-layered for intense glowing look)
   ═══════════════════════════════════════════════════════════════ */
function Beam() {
  const beamRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (beamRef.current) {
      beamRef.current.material.opacity = 0.5 + Math.sin(t * 3) * 0.15
    }
  })

  return (
    <group position={[5, 0, -2]}>
      {/* Core solid bright beam */}
      <mesh ref={beamRef}>
        <cylinderGeometry args={[0.8, 0.8, 25, 32, 1, true]} />
        <meshBasicMaterial 
          color="#16a34a" 
          transparent 
          opacity={0.6}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      
      {/* Outer softer glow beam */}
      <mesh>
        <cylinderGeometry args={[1.5, 1.5, 25, 32, 1, true]} />
        <meshBasicMaterial 
          color="#22c55e" 
          transparent 
          opacity={0.15}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

/* ═══════════════════════════════════════════════════════════════
   Amber & Green Particles flowing up the beam
   ═══════════════════════════════════════════════════════════════ */
function Particles({ count = 300 }) {
  const pointsRef = useRef()

  const { positions, speeds, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    const colors = new Float32Array(count * 3)
    
    const colorAmber = new THREE.Color('#d97706')
    const colorGreen = new THREE.Color('#15803d')

    for (let i = 0; i < count; i++) {
      positions[i * 3] = 5 + (Math.random() - 0.5) * 4
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20 
      positions[i * 3 + 2] = -2 + (Math.random() - 0.5) * 4

      speeds[i] = 0.02 + Math.random() * 0.06
      
      const col = Math.random() > 0.5 ? colorAmber : colorGreen
      colors[i * 3] = col.r
      colors[i * 3 + 1] = col.g
      colors[i * 3 + 2] = col.b
    }
    return { positions, speeds, colors }
  }, [count])

  useFrame((state) => {
    if (!pointsRef.current) return
    const pos = pointsRef.current.geometry.attributes.position.array

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      pos[i3 + 1] += speeds[i]
      if (pos[i3 + 1] > 10) {
        pos[i3 + 1] = -10
        pos[i3] = 5 + (Math.random() - 0.5) * 4
        pos[i3 + 2] = -2 + (Math.random() - 0.5) * 4
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial vertexColors size={0.12} transparent opacity={0.9} depthWrite={false} />
    </points>
  )
}

/* ═══════════════════════════════════════════════════════════════
   Stylized Floating Leaves
   ═══════════════════════════════════════════════════════════════ */
function Leaves({ count = 120 }) {
  const { positions, rotations, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const rotations = new Float32Array(count * 3)
    const speeds = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20 
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10

      rotations[i * 3] = Math.random() * Math.PI
      rotations[i * 3 + 1] = Math.random() * Math.PI
      rotations[i * 3 + 2] = Math.random() * Math.PI

      speeds[i * 3] = (Math.random() - 0.5) * 0.02
      speeds[i * 3 + 1] = (Math.random() - 0.5) * 0.02
      speeds[i * 3 + 2] = (Math.random() - 0.5) * 0.02
    }
    return { positions, rotations, speeds }
  }, [count])

  const meshRef = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      
      positions[i3] += speeds[i3] + Math.sin(t + i) * 0.005
      positions[i3 + 1] += speeds[i3 + 1] + Math.cos(t + i) * 0.005
      positions[i3 + 2] += speeds[i3 + 2]

      if (positions[i3 + 1] > 8) positions[i3 + 1] = -8
      if (positions[i3 + 1] < -8) positions[i3 + 1] = 8
      if (positions[i3] > 10) positions[i3] = -10
      if (positions[i3] < -10) positions[i3] = 10

      rotations[i3] += 0.01
      rotations[i3 + 1] += 0.01

      dummy.position.set(positions[i3], positions[i3 + 1], positions[i3 + 2])
      dummy.rotation.set(rotations[i3], rotations[i3 + 1], rotations[i3 + 2])
      
      // Some leaves are larger than others
      const scaleBase = 0.5 + (i % 3) * 0.3
      dummy.scale.setScalar(scaleBase + Math.sin(t * 2 + i) * 0.1)
      dummy.updateMatrix()

      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  // Stylized curved leaf geometry (looks like bent ellipses)
  const leafGeometry = useMemo(() => {
    const geo = new THREE.CircleGeometry(0.3, 32)
    // Stretch to ellipse
    geo.scale(0.5, 1, 1)
    return geo
  }, [])

  return (
    <instancedMesh ref={meshRef} args={[leafGeometry, null, count]}>
      {/* Dark stylized green matching the screenshot */}
      <meshBasicMaterial color="#4d7c50" transparent opacity={0.8} side={THREE.DoubleSide} depthWrite={false} />
    </instancedMesh>
  )
}

/* ═══════════════════════════════════════════════════════════════
   Dark Ground Overlay 
   (A subtle dark curved plane at the bottom for the text contrast)
   ═══════════════════════════════════════════════════════════════ */
function DarkGroundFade() {
  return (
    <mesh position={[0, -5, 0]} rotation={[-Math.PI / 16, 0, 0]}>
      <planeGeometry args={[40, 10]} />
      <meshBasicMaterial color="#1a2e20" transparent opacity={0.8} depthWrite={false} />
    </mesh>
  )
}

/* ═══════════════════════════════════════════════════════════════
   CameraRig — Gentle ambient movement
   ═══════════════════════════════════════════════════════════════ */
function CameraRig({ mouseRef }) {
  useFrame((state) => {
    const t = state.clock.elapsedTime
    const mx = mouseRef?.current?.x || 0
    const my = mouseRef?.current?.y || 0

    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, mx * 1.5, 0.05)
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, -my * 1.5 + Math.sin(t * 0.5) * 0.2, 0.05)
    state.camera.lookAt(0, 0, 0)
  })
  return null
}

/* ═══════════════════════════════════════════════════════════════
   High-Tech Orbital Rings
   ═══════════════════════════════════════════════════════════════ */
function OrbitalRings() {
  const ringsRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (ringsRef.current) {
      ringsRef.current.rotation.x = Math.sin(t * 0.3) * 0.2 + 0.5
      ringsRef.current.rotation.y = t * 0.4
      ringsRef.current.position.y = Math.sin(t * 1.2) * 0.5
    }
  })

  return (
    <group ref={ringsRef} position={[5, 1, -2]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.5, 0.015, 16, 64]} />
        <meshBasicMaterial color="#16a34a" transparent opacity={0.8} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.2, 0]}>
        <torusGeometry args={[2.8, 0.008, 16, 64]} />
        <meshBasicMaterial color="#15803d" transparent opacity={0.6} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
        <torusGeometry args={[2.2, 0.02, 16, 32]} />
        <meshBasicMaterial color="#d97706" transparent opacity={0.7} />
      </mesh>
    </group>
  )
}

/* ═══════════════════════════════════════════════════════════════
   Floating Geometric Core
   ═══════════════════════════════════════════════════════════════ */
function CoreCrystal() {
  const crystalRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (crystalRef.current) {
      crystalRef.current.rotation.y = t * 0.8
      crystalRef.current.rotation.z = t * 0.3
      crystalRef.current.position.y = Math.sin(t * 2) * 0.3
    }
  })

  return (
    <mesh ref={crystalRef} position={[5, 1, -2]}>
      <octahedronGeometry args={[0.6, 0]} />
      <meshBasicMaterial color="#334155" wireframe />
      <mesh scale={0.9}>
        <octahedronGeometry args={[0.6, 0]} />
        <meshBasicMaterial color="#16a34a" transparent opacity={0.9} />
      </mesh>
    </mesh>
  )
}

/* ═══════════════════════════════════════════════════════════════
   Scene
   ═══════════════════════════════════════════════════════════════ */
export default function Scene({ mouseRef }) {
  const bgColor = '#f8fafc' 
  
  return (
    <Canvas
      camera={{ fov: 45, near: 0.1, far: 100, position: [0, 0, 10] }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
    >
      {/* Fog blends distant objects into the white theme */}
      <fog attach="fog" args={[bgColor, 5, 30]} />
      
      <CameraRig mouseRef={mouseRef} />
      
      {/* Visual Elements */}
      {/* Laser beam and geometric elements have been removed so the user's video takes center stage */}
      
      <Leaves count={80} />
    </Canvas>
  )
}
