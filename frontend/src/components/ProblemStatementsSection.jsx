import React, { useEffect, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { Settings, ShieldAlert, LineChart, ThermometerSun, FileX, Sprout, Landmark } from 'lucide-react';
import createGlobe from 'cobe';
import './ProblemStatementsSection.css';

const DottedGlobe = () => {
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
      devicePixelRatio: 2,
      width: 800,
      height: 800,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.15, 0.15, 0.15],
      markerColor: [0.2, 0.6, 1],
      glowColor: [0.1, 0.3, 0.6], // Soft blue glow
      markers: [
        { location: [20.5937, 78.9629], size: 0.1 } // India
      ],
      onRender: (state) => {
        state.phi = phi + spring.get();
        phi += 0.005;
      }
    });

    return () => globe.destroy();
  }, [spring]);

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
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
        style={{ width: 400, height: 400, maxWidth: '100%', opacity: 0.8, cursor: 'grab' }}
      />
    </div>
  );
};

const PSCard = ({ title, description, icon, className = "" }) => (
  <motion.div 
    className={`ps-card ${className}`}
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5 }}
  >
    <div className="ps-card-bg-glow"></div>
    <div className="ps-card-content">
      {icon && (
        <div className="ps-card-icon">
          {icon}
        </div>
      )}
      <div className="ps-card-text">
        <h3 className="ps-card-title">{title}</h3>
        <p className="ps-card-desc">{description}</p>
      </div>
    </div>
  </motion.div>
);

export default function ProblemStatementsSection() {
  return (
    <section className="ps-section" aria-label="Problem Statements">
      {/* Background Master Glow */}
      <div className="ps-glow-master bg-master"></div>
      
      <div className="ps-header">
        <motion.h2 
          className="ps-main-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          The Agricultural Reinforcement Loop
        </motion.h2>
        <motion.p 
          className="ps-main-desc"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Poor information leads to poor decisions, degraded yields, and massive debt. UniAgriQ breaks this cycle simultaneously.
        </motion.p>
      </div>

      <div className="ps-grid">
        {/* The Empty Space with Grid Lines, Glow & GLOBE (Top Left) */}
        <div className="ps-empty-glow">
          <div className="ps-grid-lines"></div>
          <DottedGlobe />
          <div className="ps-flare"></div>
        </div>

        {/* Card 1: Top Middle (C1) */}
        <PSCard 
          className="ps-c1"
          title="Technology Exclusion"
          description="86% of smallholders are priced out of IoT hardware and alienated by complex, English-only app interfaces."
          icon={<Settings size={28} strokeWidth={1.5} color="#60a5fa" />}
        />

        {/* Card 2: Top Right (C2) */}
        <PSCard 
          className="ps-c2"
          title="Market Intel Absence"
          description="Farmers act as blind price-takers, often surrendering up to 80% of end-consumer value to middlemen."
          icon={<LineChart size={28} strokeWidth={1.5} color="#4ade80" />}
        />

        {/* Card 3: Middle Left (C3) - Staggered! */}
        <PSCard 
          className="ps-c3"
          title="Agri-Finance Gap"
          description="Locked out of formal credit, marginal farmers are trapped by informal moneylenders charging up to 36% interest."
          icon={<Landmark size={28} strokeWidth={1.5} color="#60a5fa" />}
        />

        {/* Card 4: Middle Right (C4) - Spans 2 cols */}
        <PSCard 
          className="ps-c4"
          title="Post-Harvest Loss"
          description="Rs. 92,000 crore worth of produce is lost annually due to absent cold chains and poor last-mile logistics."
          icon={<ShieldAlert size={28} strokeWidth={1.5} color="#4ade80" />}
        />

        {/* Card 5: Bottom Left (C5) - Circle! */}
        <motion.div 
          className="ps-card ps-c5"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, type: "spring" }}
        >
          <div className="ps-card-content center-content">
            <h2 className="ps-circle-number">250<span className="ps-circle-plus">+</span></h2>
            <p className="ps-card-desc text-center">Extreme weather events annually with zero financial resilience.</p>
            <div className="ps-circle-btn">
              <ThermometerSun size={20} color="#fff" />
            </div>
          </div>
        </motion.div>

        {/* Card 6: Bottom Middle (C6) */}
        <PSCard 
          className="ps-c6"
          title="Scheme Non-Penetration"
          description="Rs. 6.5 lakh crore in subsidies lost to complex bureaucratic paperwork."
          icon={<FileX size={28} strokeWidth={1.5} color="#60a5fa" />}
        />

        {/* Card 7: Bottom Right (C7) */}
        <PSCard 
          className="ps-c7"
          title="Soil Degradation"
          description="Inorganic overuse has pushed 60% of soils below 0.5% organic carbon."
          icon={<Sprout size={28} strokeWidth={1.5} color="#4ade80" />}
        />
      </div>
    </section>
  );
}
