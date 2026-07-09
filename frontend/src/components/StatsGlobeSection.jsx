import React, { useState, useEffect, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import createGlobe from 'cobe';
import './StatsGlobeSection.css';

const LightGlobe = () => {
  const canvasRef = useRef();
  const pointerInteracting = useRef(null);
  const pointerInteractionMovement = useRef(0);
  
  const r = useMotionValue(0);
  const spring = useSpring(r, {
    stiffness: 280,
    damping: 40,
    mass: 1
  });

  useEffect(() => {
    let phi = 0;
    
    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 1,
      width: 600,
      height: 600,
      phi: 0,
      theta: 0.3,
      dark: 0, // Light theme globe
      diffuse: 1.2,
      mapSamples: 8000,
      mapBrightness: 6,
      baseColor: [0.85, 0.9, 0.85], // light greenish/grey base
      markerColor: [0.2, 0.5, 0.2], // dark green markers
      glowColor: [0.96, 0.98, 0.96], // matches background
      markers: [
        { location: [20.5937, 78.9629], size: 0.1 } // India
      ],
      onRender: (state) => {
        state.phi = phi + spring.get();
        phi += 0.003;
      }
    });

    return () => globe.destroy();
  }, [spring]);

  return (
    <div className="stats-globe-wrapper">
      <canvas
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
          canvasRef.current.style.cursor = 'grabbing';
        }}
        onPointerUp={() => {
          pointerInteracting.current = null;
          canvasRef.current.style.cursor = 'grab';
        }}
        onPointerOut={() => {
          pointerInteracting.current = null;
          canvasRef.current.style.cursor = 'grab';
        }}
        onMouseMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta;
            r.set(delta / 200);
          }
        }}
        onTouchMove={(e) => {
          if (pointerInteracting.current !== null && e.touches[0]) {
            const delta = e.touches[0].clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta;
            r.set(delta / 100);
          }
        }}
        style={{ width: 500, height: 500, maxWidth: '100%', opacity: 0.6, cursor: 'grab' }}
      />
    </div>
  );
};

const statData = [
  { value: "140M+", label: "SMALLHOLDER FARMERS" },
  { value: "₹4.8L Cr", label: "AGRITECH MARKET BY 2030" },
  { value: "600M", label: "AGRICULTURAL WORKFORCE" },
  { value: "₹92K Cr", label: "ANNUAL POST-HARVEST LOSS" }
];

export default function StatsGlobeSection() {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <section className="stats-section">
      <LightGlobe />
      
      <div className="stats-header">
        <h4 className="stats-subtitle">MARKET POTENTIAL</h4>
        <h2 className="stats-title">The Indian Agricultural Landscape</h2>
      </div>

      <div className="stats-container">
        {/* Top Line */}
        <div className="stats-line top-line"></div>

        <div className="stats-grid">
          {statData.map((stat, idx) => (
            <div 
              key={idx} 
              className={`stat-item ${activeIndex === idx ? 'active' : ''}`}
              onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
              onMouseEnter={() => setActiveIndex(idx)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <h3 className="stat-val">{stat.value}</h3>
              <p className="stat-label">{stat.label}</p>
              
              {/* Highlight lines underneath and above each stat */}
              <div className="stat-topline"></div>
              <div className="stat-underline"></div>
            </div>
          ))}
        </div>

        {/* Bottom Line */}
        <div className="stats-line bottom-line"></div>
      </div>
    </section>
  );
}
