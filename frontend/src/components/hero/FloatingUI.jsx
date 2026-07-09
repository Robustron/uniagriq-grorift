import React from 'react'
import { Html } from '@react-three/drei'
import { Droplet, Leaf, Wind } from 'lucide-react'

/* ═══════════════════════════════════════════════════════════════
   Floating Glassmorphism UI (Maximum 3 Cards)
   ═══════════════════════════════════════════════════════════════ */
export default function FloatingUI() {
  return (
    <group position={[0, 1.5, 0]}>
      {/* 1. Soil Moisture (Bottom Left of Plot) */}
      <Html position={[-1.6, -1.2, 0.5]} center zIndexRange={[100, 0]}>
        <div className="farm-ui-card" style={{ animationDelay: '0s' }}>
          <div className="card-header">
            <div className="icon-box blue"><Droplet size={14} /></div>
            <span className="card-title">Soil Moisture</span>
          </div>
          <div className="card-body">
            <span className="card-value">42%</span>
            <div className="progress-bar">
              <div className="progress-fill blue" style={{ width: '42%' }}></div>
            </div>
          </div>
        </div>
      </Html>

      {/* 2. Crop Health (Top Right of Plot) */}
      <Html position={[1.8, 1.0, 0]} center zIndexRange={[100, 0]}>
        <div className="farm-ui-card" style={{ animationDelay: '1s' }}>
          <div className="card-header">
            <div className="icon-box green"><Leaf size={14} className="leaf-spin" /></div>
            <span className="card-title">Crop Health</span>
          </div>
          <div className="card-body row-flex">
            <span className="health-status">Optimal</span>
            <svg className="circular-progress">
              <circle className="circle-bg" cx="16" cy="16" r="12" />
              <circle className="circle-fill green-stroke" cx="16" cy="16" r="12" strokeDasharray="65 100" />
            </svg>
          </div>
        </div>
      </Html>

      {/* 3. Micro Weather (Top Left of Plot) */}
      <Html position={[-1.2, 1.8, -0.5]} center zIndexRange={[100, 0]}>
        <div className="farm-ui-card" style={{ animationDelay: '2s' }}>
          <div className="card-header">
            <div className="icon-box orange"><Wind size={14} /></div>
            <span className="card-title">Micro-Climate</span>
          </div>
          <div className="card-body weather-grid">
            <div className="weather-item">
              <span className="w-label">Temp</span>
              <span className="w-val">24°C</span>
            </div>
            <div className="weather-item">
              <span className="w-label">Hum</span>
              <span className="w-val">65%</span>
            </div>
            <div className="weather-item">
              <span className="w-label">Wind</span>
              <span className="w-val">12km/h</span>
            </div>
          </div>
        </div>
      </Html>
    </group>
  )
}
