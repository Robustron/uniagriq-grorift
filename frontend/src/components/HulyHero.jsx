import React from "react";
import { motion } from "framer-motion";
import "./HulyHero.css";

function Navbar() {
  return (
    <nav className="huly-navbar">
      <div className="navbar-left">
        <div className="navbar-logo">
          <div className="logo-icon-agri"></div>
          <span className="logo-text">UniAgriQ</span>
        </div>
        <div className="navbar-links">
          <a href="#b2b">B2B</a>
          <a href="#csr">CSR</a>
          <a href="#marketplace">Marketplace</a>
        </div>
      </div>
      <div className="navbar-actions">
        <a href="#login" className="nav-login">Log In</a>
        <button className="nav-lang-btn">
          <svg className="globe-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
          <span className="lang-text">EN</span>
          <svg className="arrow-down" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      </div>
    </nav>
  );
}

export default function HulyHero({ onExplore }) {
  const projectWords = [
    "Available Funding",
    "Soil Moisture: 72%",
    "Drone Fleet Analytics",
    "AI Soil Diagnostics",
    "Smart Weather Radar",
    "Mandi Price Intelligence",
    "Satellite Crop Monitoring",
    "B2B Commodity Sourcing"
  ];

  return (
    <div className="hero-container">
      <Navbar />

      {/* Main Content Layout (Left Aligned) */}
      <div className="hero-content">
        <div className="hero-inner">
          
          {/* Main Title */}
          <div className="title-container">
            <motion.h1 
              className="title-text"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              Empowering Those<br/>
              Who Grow and<br/>
              <span style={{ whiteSpace: 'nowrap' }}>Those Who Believe.</span>
            </motion.h1>
          </div>

          {/* Subtitle */}
          <motion.p
            className="slogan"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            We connect the precision of modern data with the soul of farming operations. Total transparency. Zero intermediaries.
          </motion.p>

          {/* White Button with Fire Orange Hover Tracking */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="btn-wrapper"
          >
            <button 
              onClick={onExplore} 
              className="explore-btn-ember"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty('--x', `${e.clientX - rect.left}px`);
                e.currentTarget.style.setProperty('--y', `${e.clientY - rect.top}px`);
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.removeProperty('--x');
                e.currentTarget.style.removeProperty('--y');
              }}
            >
              <div className="btn-ember-glow"></div>
              <span className="btn-text">EXPLORE OPPORTUNITIES →</span>
            </button>
          </motion.div>

        </div>
      </div>

      {/* Sliding Marquee / Ticker */}
      <motion.div 
        className="marquee-container"
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.8, duration: 1 }}
      >
        <div className="marquee-gradient-left" />
        <div className="marquee-gradient-right" />
        
        <div className="marquee-flex">
          <div className="marquee-scroll">
            {/* Duplicate array for seamless infinite looping */}
            {[...projectWords, ...projectWords, ...projectWords].map((word, i) => (
              <span key={i} className="marquee-item">
                {word}
                <span className="marquee-item-dot" />
              </span>
            ))}
          </div>
        </div>
      </motion.div>

    </div>
  );
}
