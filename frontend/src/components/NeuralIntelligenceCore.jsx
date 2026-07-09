import React from 'react';
import { motion } from 'framer-motion';
import HeroOrb from './HeroOrb';
import './NeuralIntelligenceCore.css';

export default function NeuralIntelligenceCore() {
  // Data for the scrolling ticker at the bottom
  const keywords = [
    "Government Scheme Bot", "Carbon Credits", "Investor Yield Pools", 
    "Farmer Digital Twin", "Satellite NDVI", "IoT Soil Mesh", 
    "Marketplace Auctions", "Soil NPK Telemetry", 
    "Regenerative Agriculture", "QR Traceability"
  ];
  
  // Tripling the array so the continuous CSS scroll animation never leaves a blank gap
  const tickerItems = [...keywords, ...keywords, ...keywords];

  return (
    <section className="nic-section">
      
      {/* Subtle Background Glow Effect */}
      <div className="nic-bg-glow-container">
        <div className="nic-bg-glow" />
      </div>
      
      {/* Heading Group */}
      <div className="nic-header-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="nic-header-content"
        >
          <span className="nic-tag">
            Evolving Agriculture
          </span>
          <h2 className="nic-title">
            Neural Intelligence Core
          </h2>
          <p className="nic-subtitle">
            Where Capital Nurtures the Soil
          </p>
        </motion.div>
      </div>

      {/* The Central CSS Gradient Orb / Radar Component */}
      <div className="nic-orb-container">
        <HeroOrb />
      </div>

      {/* Keywords Continuous Scrolling Ticker */}
      <div className="nic-ticker-wrapper">
        <div className="nic-ticker-track">
          {tickerItems.map((keyword, idx) => (
            <div key={idx} className="nic-ticker-item">
              <span className="nic-ticker-dot" />
              <span>{keyword}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
