import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import './OnGroundResearchGallery.css';

export default function OnGroundResearchGallery() {
  const [researchIdx, setResearchIdx] = useState(0);

  const researchStories = [
    {
      title: "Soil NPK Telemetry Deployment",
      shortTitle: "Telemetry",
      description: "Testing IoT telemetry sensor nodes in Maharashtra. Verifying real-time nitrogen, phosphorus, and potassium soil data streams.",
      image: "/telemetry.png", 
      linkText: "Read case study",
    },
    {
      title: "Regenerative Carbon Validation",
      shortTitle: "Carbon",
      description: "On-ground validation of soil carbon organic matter levels. Partnering with localized farmers to verify green manure nitrogen retention.",
      image: "/carbon.png", 
      linkText: "Read report",
    },
    {
      title: "AI Yield Drone Mapping",
      shortTitle: "Drone",
      description: "Running localized drone crop scanning to train our multispectral Genesis crop health algorithm. Mapping over 5,000 hectares.",
      image: "/drone.png", 
      linkText: "Review imagery",
    },
    {
      title: "Direct Sourcing Disintermediation",
      shortTitle: "Sourcing",
      description: "Connecting rural cooperative farmers directly with wholesale food sourcing enterprises in Mumbai, boosting regional farming profits by 38%.",
      image: "/sourcing.png", 
      linkText: "Watch video",
    },
  ];

  return (
    <section className="ogr-section" aria-label="On Ground Research">
      {/* Header and Controls */}
      <div className="ogr-header-container">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="ogr-header-text"
        >
          <span className="ogr-tag">
            FIELD OPERATIONS & REAL IMPACT
          </span>
          <h2 className="ogr-title">
            On-Ground Research
          </h2>
        </motion.div>
        
        <div className="ogr-controls">
          <button
            onClick={() => setResearchIdx(idx => Math.max(0, idx - 1))}
            disabled={researchIdx === 0}
            className="ogr-btn"
            aria-label="Previous story"
          >
            <ArrowLeft size={20} />
          </button>
          <button
            onClick={() => setResearchIdx(idx => Math.min(3, idx + 1))}
            disabled={researchIdx === 3}
            className="ogr-btn"
            aria-label="Next story"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>

      {/* Expandable Image Gallery */}
      <div className="ogr-gallery-container">
        {researchStories.map((story, idx) => (
          <motion.div
            key={story.shortTitle}
            layout
            animate={{
              width: researchIdx === idx ? "100%" : "25%",
              opacity: researchIdx === idx ? 1 : 0.65
            }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={() => setResearchIdx(idx)}
            onClick={() => setResearchIdx(idx)}
            className={`ogr-gallery-item ${researchIdx === idx ? 'active' : ''}`}
          >
            <img src={story.image} alt={story.title} className="ogr-image" />
            <div className="ogr-gradient-overlay" />
            
            <div className="ogr-item-content">
              {researchIdx === idx ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <span className="ogr-active-tag">
                    Active Case
                  </span>
                  <h4 className="ogr-item-title">
                    {story.title}
                  </h4>
                </motion.div>
              ) : (
                <div className="ogr-inactive-wrapper">
                  <span className="ogr-inactive-title">
                    {story.shortTitle}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Description Footer */}
      <div className="ogr-footer-container">
        <div className="ogr-desc-wrapper">
          <AnimatePresence mode="wait">
            <motion.p
              key={researchIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="ogr-desc-text"
            >
              {researchStories[researchIdx].description}
            </motion.p>
          </AnimatePresence>
        </div>
        <div className="ogr-link-wrapper">
          <a
            href="#"
            className="ogr-link-btn"
          >
            {researchStories[researchIdx].linkText}
            <ArrowRight size={16} className="ogr-link-icon" />
          </a>
        </div>
      </div>
    </section>
  );
}
