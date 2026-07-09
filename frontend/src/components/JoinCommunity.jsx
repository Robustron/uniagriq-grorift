import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring, useMotionTemplate } from 'framer-motion';
import { Send } from 'lucide-react';
import './JoinCommunity.css';

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
      className={`join-tilt-card ${className}`}
      {...props}
    >
      <motion.div
        style={{ background, opacity, pointerEvents: "none" }}
        className="join-tilt-glow"
      />
      <div style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }} className="join-tilt-content">
        {children}
      </div>
    </motion.div>
  );
}

const GlowingDial = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`glowing-dial-container ${isHovered ? 'dial-hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Outer Glows */}
      <div className="dial-glow dial-glow-blue" />
      <div className="dial-glow dial-glow-green" />
      
      {/* Main Clock Face */}
      <div className="dial-face">
        {/* Dotted pattern overlay */}
        <div className="dial-dots"></div>

        {/* Inner Glowing Ring */}
        <div className={`dial-ring ${isHovered ? 'spinning' : ''}`}></div>
        
        {/* Center X Logo */}
        <div className="dial-center-x">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </div>
        
        {/* Clock Hands — pure CSS for buttery 60fps */}
        <div className={`dial-hand dial-hand-blue ${isHovered ? 'fast' : ''}`} />
        <div className={`dial-hand dial-hand-green ${isHovered ? 'fast' : ''}`} />
        
        {/* Ticks */}
        <div className="dial-ticks"></div>
      </div>
    </div>
  );
};

export default function JoinCommunity() {
  const [communityEmail, setCommunityEmail] = useState("");
  const [isCommunitySubscribed, setIsCommunitySubscribed] = useState(false);

  return (
    <section className="join-community-section">
      {/* Huly-style Diagonal Glowing Beams */}
      <div className="join-bg-beam join-bg-beam-blue"></div>
      <div className="join-bg-beam join-bg-beam-green"></div>

      <div className="join-layout-grid">
        {/* Left Side Graphic */}
        <div className="join-left-col">
          <GlowingDial />
        </div>
        
        {/* Right Side Card */}
        <div className="join-right-col">
          <TiltCard
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="join-card"
          >
        {/* Glow Effects */}
        <div className="join-glow join-glow-emerald" />
        <div className="join-glow join-glow-lime" />
        
        <span className="join-tag">
          JOIN THE MOVEMENT
        </span>
        <h2 className="join-title">
          Farmers, builders, investors – pull up a chair.
        </h2>
        <p className="join-desc">
          Get product updates, pilot invites and field stories from the UniAgriQ network.
        </p>
        
        {/* Subscription Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setIsCommunitySubscribed(true);
            setCommunityEmail("");
            setTimeout(() => setIsCommunitySubscribed(false), 3000);
          }}
          className="join-form"
        >
          {isCommunitySubscribed ? (
            <span className="join-success">
              ✓ Subscribed successfully!
            </span>
          ) : (
            <>
              <input
                type="email"
                required
                placeholder="you@farm.com"
                value={communityEmail}
                onChange={(e) => setCommunityEmail(e.target.value)}
                className="join-input"
              />
              <button
                type="submit"
                className="join-submit"
              >
                Subscribe
                <Send size={16} />
              </button>
            </>
          )}
        </form>
        
        {/* Social Buttons */}
        <div className="join-socials">
          <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" className="join-social-btn">
            <svg className="join-social-icon text-whatsapp" viewBox="0 0 24 24" fill="currentColor">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.503-5.724-1.46L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97C16.579 2.003 14.113 1 11.99 1 6.554 1 2.13 5.371 2.128 10.8c-.001 1.64.45 3.242 1.302 4.667l-.852 3.11 3.201-.837z" />
            </svg>
            WhatsApp
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="join-social-btn">
            <svg className="join-social-icon text-instagram" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
            Instagram
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="join-social-btn">
            <svg className="join-social-icon text-linkedin" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
            LinkedIn
          </a>
          <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="join-social-btn">
            <svg className="join-social-icon text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            X
          </a>
          </div>
        </TiltCard>
        </div>
      </div>
    </section>
  );
}
