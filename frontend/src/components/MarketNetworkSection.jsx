import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MarketNetworkGlobe from './MarketNetworkGlobe';
import './MarketNetworkSection.css';

const statData = [
  { value: "140M+", label: "Smallholder Farmers" },
  { value: "₹4.8L Cr", label: "Agritech Market by 2030" },
  { value: "600M", label: "Agricultural Workforce" },
  { value: "₹92K Cr", label: "Annual Post-Harvest Loss" }
];

export default function MarketNetworkSection() {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <section className="mn-section" aria-label="Market Landscape">
      <div className="mn-container">
        
        {/* Heading & Tag */}
        <motion.div
          className="mn-header"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="mn-tag">MARKET POTENTIAL</span>
          <h2 className="mn-title">The Indian Agricultural Landscape</h2>
        </motion.div>
        
        {/* Numbers / Stats Grid */}
        <div className="mn-stats-grid">
          {statData.map((stat, idx) => (
            <div 
              key={idx} 
              className={`mn-stat-item ${activeIndex === idx ? 'active' : ''}`}
              onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
              onMouseEnter={() => setActiveIndex(idx)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <span className="mn-stat-number">{stat.value}</span>
              <span className="mn-stat-label">{stat.label}</span>
              <div className="stat-underline"></div>
            </div>
          ))}
        </div>
      </div>
      
      {/* The Sphere/Globe Container */}
      <div className="mn-globe-container">
        <MarketNetworkGlobe />
      </div>
    </section>
  );
}
