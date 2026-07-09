import React, { useState, useRef } from "react";
import { 
  motion, 
  AnimatePresence, 
  useMotionValue, 
  useTransform, 
  useSpring, 
  useMotionTemplate,
  useScroll,
  useMotionValueEvent
} from "framer-motion";
import { 
  Sprout, 
  LineChart, 
  Handshake, 
  Cpu, 
  Leaf, 
  Globe, 
  Database, 
  ArrowRight,
  ExternalLink
} from "lucide-react";

import "./EcosystemSection.css";

function TiltCard({ children, className = "", onClick, onMouseEnter, ...props }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-10, 10]);
  
  const springRotateX = useSpring(rotateX, { stiffness: 80, damping: 18 });
  const springRotateY = useSpring(rotateY, { stiffness: 80, damping: 18 });
  
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

  const background = useMotionTemplate`radial-gradient(circle 140px at ${mouseX}px ${mouseY}px, rgba(255, 255, 255, 0.2), transparent)`;

  return (
    <motion.div
      style={{ rotateX: springRotateX, rotateY: springRotateY, transformStyle: "preserve-3d", perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className={`eco-tilt-card ${className}`}
      {...props}
    >
      <motion.div
        style={{ background, opacity, pointerEvents: "none" }}
        className="eco-tilt-glow"
      />
      <div style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }} className="eco-tilt-content">
        {children}
      </div>
    </motion.div>
  );
}

export default function EcosystemSection() {
  const [activeRole, setActiveRole] = useState("farmer");
  const sectionRef = useRef(null);

  // Track scroll progress within the 300vh section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.33) {
      if (activeRole !== "farmer") setActiveRole("farmer");
    } else if (latest >= 0.33 && latest < 0.66) {
      if (activeRole !== "investor") setActiveRole("investor");
    } else {
      if (activeRole !== "b2b") setActiveRole("b2b");
    }
  });

  const semicircleRoles = [
    { id: "b2b", label: "Marketplaces", icon: Handshake, angle: 135 },
    { id: "investor", label: "Investors", icon: LineChart, angle: 180 },
    { id: "farmer", label: "Farmers", icon: Sprout, angle: 225 },
  ];

  // We will track scroll manually to ensure it works reliably across all browsers/wrappers
  React.useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const scrollDistance = -rect.top;
      const totalScrollable = rect.height - window.innerHeight;
      
      if (totalScrollable > 0) {
        const progress = Math.max(0, Math.min(1, scrollDistance / totalScrollable));
        
        if (progress < 0.33) {
          setActiveRole("farmer");
        } else if (progress >= 0.33 && progress < 0.66) {
          setActiveRole("investor");
        } else {
          setActiveRole("b2b");
        }
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(handleScroll);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={sectionRef} className="eco-scroll-track">
      <div className="eco-sticky-wrapper">
        <div className="eco-bg-container">
          <img 
            src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop" 
            alt="Agriculture field" 
            className="eco-bg-image" 
          />
          <div className="eco-bg-overlay"></div>
        </div>
        <div className="eco-section-container">
          {/* Background Borders to Match Hero */}
          <div className="eco-borders"></div>

      {/* ─── LEFT: Info Card (Glassmorphic Content) ─── */}
      <div className="eco-info-wrapper">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRole}
            initial={{ opacity: 0, y: 20, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(12px)" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="eco-glass-card"
          >
            {activeRole === "farmer" && (
              <>
                <span className="eco-pillar-tag">Pillar I: Rural Empowerment</span>
                <h2 className="eco-main-title">Farmer Ecosystem</h2>
                <p className="eco-description">
                  Access direct project funding, modern AI crop analytics, and guaranteed contracts with corporate buyers. Scale your farm sustainably without debt.
                </p>
                
                <div className="eco-card-grid">
                  <TiltCard className="eco-sub-card">
                    <Cpu className="eco-icon-sm" />
                    <h4 className="eco-sub-title">Gemini Soil Engine</h4>
                    <p className="eco-sub-desc">Smart Crop selection recommendations based on telemetry.</p>
                  </TiltCard>
                  
                  <TiltCard className="eco-sub-card">
                    <Leaf className="eco-icon-sm" />
                    <h4 className="eco-sub-title">Carbon Credits</h4>
                    <p className="eco-sub-desc">Monetize sustainable farming and regenerative practices.</p>
                  </TiltCard>
                </div>
              </>
            )}

            {activeRole === "investor" && (
              <>
                <span className="eco-pillar-tag">Pillar II: Transparent Finance</span>
                <h2 className="eco-main-title">Investor Ecosystem</h2>
                <p className="eco-description">
                  Diversify your portfolio with real-world agricultural projects. Access direct telemetry audits, verifiable yields, and automated returns.
                </p>

                <div className="eco-card-grid">
                  <TiltCard className="eco-sub-card">
                    <LineChart className="eco-icon-sm" />
                    <h4 className="eco-sub-title">Yield Pools</h4>
                    <p className="eco-sub-desc">Back fractional farms with fully managed contracts.</p>
                  </TiltCard>
                  
                  <TiltCard className="eco-sub-card">
                    <Globe className="eco-icon-sm" />
                    <h4 className="eco-sub-title">Satellite Audits</h4>
                    <p className="eco-sub-desc">Monitor project progress in real time using satellite data.</p>
                  </TiltCard>
                </div>
              </>
            )}

            {activeRole === "b2b" && (
              <>
                <span className="eco-pillar-tag">Pillar III: Fair Trade</span>
                <h2 className="eco-main-title">B2B Markets</h2>
                <p className="eco-description">
                  Source premium grade crops directly from verified farms. Eliminate middlemen commissions and ensure complete supply chain trace audits.
                </p>

                <div className="eco-card-grid">
                  <TiltCard className="eco-sub-card">
                    <Database className="eco-icon-sm" />
                    <h4 className="eco-sub-title">Commodity Sourcing</h4>
                    <p className="eco-sub-desc">Procure wholesale batch sizes with direct farmer trade.</p>
                  </TiltCard>
                  
                  <TiltCard className="eco-sub-card">
                    <ExternalLink className="eco-icon-sm" />
                    <h4 className="eco-sub-title">Contracts Registry</h4>
                    <p className="eco-sub-desc">Execute smart contracts backed by physical agricultural cargo.</p>
                  </TiltCard>
                </div>
              </>
            )}

            <div className="eco-button-wrapper">
              <button className="eco-enter-btn">
                <span>Enter Platform</span>
                <ArrowRight className="eco-arrow-icon" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ─── RIGHT: Apple-style Static Semicircle ─── */}
      <div className="eco-rotary-container">
        <div className="eco-rotary-dial">
          <div className="eco-dashed-ring" />

          {/* Active Highlight Orb that moves along the ring */}
          <div 
            className="eco-active-orb"
            style={{
              "--active-angle": `${semicircleRoles.find(r => r.id === activeRole)?.angle || 225}deg`
            }}
          />

          {semicircleRoles.map((role) => {
            const isActive = activeRole === role.id;
            const RoleIcon = role.icon;

            return (
              <div
                key={role.id}
                style={{
                  "--angle": `${role.angle}deg`,
                  "--global-rotation": `0deg` // Remove rotation of the entire dial
                }}
                className={`eco-dial-btn ${isActive ? "eco-dial-btn-active" : "eco-dial-btn-inactive"}`}
                onClick={() => {
                  // Allow clicking just in case, but scroll is primary
                  // To smoothly snap scroll, we'd need to manipulate window scroll, 
                  // but for now we just change state (though it'll be overwritten if they scroll immediately)
                  setActiveRole(role.id);
                }}
              >
                <RoleIcon className={`eco-dial-icon ${isActive ? "eco-dial-icon-active" : ""}`} />
                <span className="eco-dial-label">{role.label}</span>
              </div>
            );
          })}
        </div>
      </div>
        </div>
      </div>
    </div>
  );
}
