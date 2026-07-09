import React from "react";
import { motion, useMotionValue, useTransform, useSpring, useMotionTemplate } from "framer-motion";
import EnergyWave from "./EnergyWave";
import "./MobileAppsSection.css";

function TiltCard({ children, className = "", onClick, ...props }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-8, 8]);
  
  const springRotateX = useSpring(rotateX, { stiffness: 85, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 85, damping: 20 });
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const opacity = useMotionValue(0);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    x.set(clientX / width - 0.5);
    y.set(clientY / height - 0.5);
    mouseX.set(clientX);
    mouseY.set(clientY);
    opacity.set(0.18);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    opacity.set(0);
  };

  const background = useMotionTemplate`radial-gradient(circle 160px at ${mouseX}px ${mouseY}px, rgba(255, 255, 255, 0.15), transparent)`;

  return (
    <motion.div
      style={{ rotateX: springRotateX, rotateY: springRotateY, transformStyle: "preserve-3d", perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className={`mobile-tilt-card ${className}`}
      {...props}
    >
      <motion.div
        style={{ background, opacity, pointerEvents: "none" }}
        className="mobile-tilt-glow"
      />
      <div style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }} className="mobile-tilt-content">
        {children}
      </div>
    </motion.div>
  );
}

export default function MobileAppsSection() {
  return (
    <div className="mobile-section-container">
      {/* Premium Aurora Background */}
      <div className="mobile-aurora-bg">
        <div className="aurora-blob aurora-1"></div>
        <div className="aurora-blob aurora-2"></div>
        <div className="aurora-blob aurora-3"></div>
      </div>

      {/* Background Borders to Match Hero and Ecosystem */}
      <div className="eco-borders"></div>

      {/* ─── LEFT: Information Card ─── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mobile-info-wrapper"
      >
        <TiltCard className="mobile-glass-card">
          <div className="mobile-card-header">
            <span className="mobile-pillar-tag">
              Native Telemetry & Sourcing
            </span>
            <h2 className="mobile-main-title">
              Our Mobile Apps
            </h2>
            <p className="mobile-description">
              Access direct field metrics and manage capital returns anywhere in the world. We offer specialized apps for crop growers and capital partners.
            </p>
          </div>

          <div className="mobile-apps-list">
            {/* App 1 Info */}
            <div className="mobile-app-info">
              <div className="mobile-app-icon">K</div>
              <div className="mobile-app-text">
                <h4 className="mobile-app-title">Krivya (Field Telemetry)</h4>
                <p className="mobile-app-desc">
                  Native utility for organic farmers. Connects soil NPK sensors, monitors irrigation valves, and syncs AI crop prescriptions.
                </p>
              </div>
            </div>

            {/* App 2 Info */}
            <div className="mobile-app-info">
              <div className="mobile-app-icon">G</div>
              <div className="mobile-app-text">
                <h4 className="mobile-app-title">Genesis (Capital Desk)</h4>
                <p className="mobile-app-desc">
                  Portfolio manager for agritech investors. Real-time satellite field scanning, contract trading desk, and auditable scope-3 metrics.
                </p>
              </div>
            </div>
          </div>
        </TiltCard>
      </motion.div>

      {/* ─── RIGHT: High-Fidelity Dual Phone Mockups ─── */}
      <div className="mobile-phones-container">
        
        {/* Phone 1: Krivya */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mobile-phone-frame"
        >
          <div className="mobile-phone-notch" />
          <div className="mobile-phone-screen">
            <img 
              src="/krivya-app.png" 
              alt="Krivya App Dashboard" 
              className="mobile-phone-img" 
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="mobile-phone-placeholder" style={{ display: 'none' }}>
              Upload krivya-app.png<br/>1170x2532px
            </div>
          </div>
        </motion.div>

        {/* Phone 2: Genesis */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mobile-phone-frame"
        >
          <div className="mobile-phone-notch" />
          <div className="mobile-phone-screen">
            <img 
              src="/genesis-app.png" 
              alt="Genesis App Dashboard" 
              className="mobile-phone-img"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="mobile-phone-placeholder" style={{ display: 'none' }}>
              Upload genesis-app.png<br/>1170x2532px
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
