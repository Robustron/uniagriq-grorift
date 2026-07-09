import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ═══════════════════════════════════════════════════════════════
   IoTSensors — Dozens of tiny sensors in the fields blinking
   ═══════════════════════════════════════════════════════════════ */
function IoTSensors({ count = 50 }) {
  const meshRef = useRef()
  const ringRef = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])

  // Position sensors inside the crop areas
  const sensorData = useMemo(() => {
    return Array.from({ length: count }, () => {
      // Pick a random crop area (rough bounds based on FarmTerrain)
      const x = (Math.random() - 0.5) * 20
      const z = (Math.random() - 0.5) * 16
      
      return {
        position: [x, 0.2, z],
        blinkPhase: Math.random() * Math.PI * 2,
        blinkSpeed: 1 + Math.random() * 2
      }
    })
  }, [count])

  // Simple geometry for the sensor node
  const nodeGeom = useMemo(() => new THREE.BoxGeometry(0.1, 0.4, 0.1), [])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime

    sensorData.forEach((sensor, i) => {
      dummy.position.set(...sensor.position)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true

    // Abstract expanding connection rings (pulse)
    if (ringRef.current) {
      const ringScale = (t % 2) * 2
      ringRef.current.scale.set(ringScale, ringScale, ringScale)
      ringRef.current.material.opacity = Math.max(0, 1 - (t % 2)) * 0.3
    }
  })

  return (
    <group>
      {/* Physical nodes */}
      <instancedMesh ref={meshRef} args={[nodeGeom, null, count]} castShadow>
        <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.2} />
      </instancedMesh>
      
      {/* Central expanding data ring (represents network heartbeat) */}
      <mesh ref={ringRef} position={[0, 0.1, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <ringGeometry args={[0.9, 1.0, 32]} />
        <meshBasicMaterial color="#38bdf8" transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  )
}

/* ═══════════════════════════════════════════════════════════════
   DataLines — Glowing lines representing capital & data flow
   ═══════════════════════════════════════════════════════════════ */
function DataLines() {
  const packetRef1 = useRef()
  const packetRef2 = useRef()
  const packetRef3 = useRef()

  // Define major connection points
  const points = {
    farmHub: new THREE.Vector3(0, 0.5, 0),
    satellite: new THREE.Vector3(0, 12, 0),
    warehouse: new THREE.Vector3(12, 0.5, -8),
    investor: new THREE.Vector3(-12, 0.5, 8),
  }

  // Create curves between them
  const curve1 = useMemo(() => new THREE.QuadraticBezierCurve3(points.farmHub, new THREE.Vector3(6, 6, -4), points.warehouse), [points])
  const curve2 = useMemo(() => new THREE.QuadraticBezierCurve3(points.investor, new THREE.Vector3(-6, 6, 4), points.farmHub), [points])
  const curve3 = useMemo(() => new THREE.LineCurve3(points.farmHub, points.satellite), [points])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    
    // Animate packets traveling along the curves
    if (packetRef1.current) {
      const pos = curve1.getPointAt((t * 0.2) % 1)
      packetRef1.current.position.copy(pos)
    }
    if (packetRef2.current) {
      const pos = curve2.getPointAt((t * 0.3) % 1)
      packetRef2.current.position.copy(pos)
    }
    if (packetRef3.current) {
      const pos = curve3.getPointAt((t * 0.1) % 1)
      packetRef3.current.position.copy(pos)
    }
  })

  // Line rendering component helper
  const FlowLine = ({ curve, color = "#38bdf8" }) => {
    const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(curve.getPoints(50)), [curve])
    return (
      <line geometry={geometry}>
        <lineBasicMaterial color={color} transparent opacity={0.15} blending={THREE.AdditiveBlending} />
      </line>
    )
  }

  return (
    <group>
      {/* Network Lines */}
      <FlowLine curve={curve1} />
      <FlowLine curve={curve2} color="#4ade80" /> {/* Investor to Farm = Green (Capital) */}
      <FlowLine curve={curve3} />

      {/* Traveling Data Packets (Lights) */}
      <mesh ref={packetRef1}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.8} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={packetRef2}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshBasicMaterial color="#4ade80" transparent opacity={0.8} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={packetRef3}>
        <cylinderGeometry args={[0.05, 0.05, 0.6, 8]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  )
}

/* ═══════════════════════════════════════════════════════════════
   DataNetwork — Orchestrates sensors, lines, and capital flows
   ═══════════════════════════════════════════════════════════════ */
export default function DataNetwork() {
  return (
    <group>
      <IoTSensors />
      <DataLines />
    </group>
  )
}
