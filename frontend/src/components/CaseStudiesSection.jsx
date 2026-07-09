import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  LayeredPlanesIcon, 
  GlowingGridIcon, 
  NestedRingsIcon, 
  FloatingHexagonsIcon,
  GlowingLeafIcon,
  NeuralNodesIcon,
  IntersectingCirclesIcon,
  IsometricBarsIcon
} from './PremiumIcons';
import './CaseStudiesSection.css';

const CaseStudyHalf = ({ 
  title, 
  titleClass,
  fillClass, 
  points 
}) => {
  const [isFilled, setIsFilled] = useState(false);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const halfRef = useRef(null);

  const handleMouseEnter = (e) => {
    if (halfRef.current) {
      const rect = halfRef.current.getBoundingClientRect();
      setHoverPos({ 
        x: e.clientX - rect.left, 
        y: e.clientY - rect.top 
      });
    }
    setIsFilled(true);
  };

  const handleMouseLeave = () => {
    setIsFilled(false);
  };

  return (
    <div 
      ref={halfRef}
      className={`cs-half ${isFilled ? 'filled' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Bucket fill element */}
      <div 
        className={`cs-half-bucket-fill ${fillClass} ${isFilled ? 'active' : ''}`} 
        style={{ left: hoverPos.x, top: hoverPos.y }}
      ></div>

      <div className="cs-half-content">
        <motion.h2 
          className={`cs-half-title ${titleClass}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {title}
        </motion.h2>

        <div className="cs-half-points">
          {points.map((point, idx) => (
            <motion.div 
              key={idx} 
              className="cs-point-item"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <div className="cs-icon-wrapper">
                {point.icon}
              </div>
              <div className="cs-point-text">
                <h3>{point.headline}</h3>
                <p>{point.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function CaseStudiesSection() {
  const investorPoints = [
    {
      icon: <LayeredPlanesIcon />,
      headline: "Curated Assets",
      desc: "Funded a highly curated farm project."
    },
    {
      icon: <GlowingGridIcon />,
      headline: "Real-Time Audits",
      desc: "Detailed risk analysis & continuous monitoring."
    },
    {
      icon: <NestedRingsIcon />,
      headline: "Transparent Milestones",
      desc: "Full transparency into milestone-based utilization."
    },
    {
      icon: <FloatingHexagonsIcon />,
      headline: "Scalable Impact",
      desc: "Enabled informed decision making & reduced risk."
    }
  ];

  const farmerPoints = [
    {
      icon: <GlowingLeafIcon />,
      headline: "Data Onboarding",
      desc: "Uploaded soil and environmental data securely."
    },
    {
      icon: <NeuralNodesIcon />,
      headline: "AI Recommendations",
      desc: "Received AI-driven, tailored crop recommendations."
    },
    {
      icon: <IntersectingCirclesIcon />,
      headline: "Direct Support",
      desc: "Secured direct investment via the platform."
    },
    {
      icon: <IsometricBarsIcon />,
      headline: "Stable Yields",
      desc: "Achieved improved planning & higher net profitability."
    }
  ];

  return (
    <section className="cs-split-screen" aria-label="Case Studies">
      <CaseStudyHalf 
        title="Investor Case Study" 
        titleClass="title-blue"
        fillClass="fill-blue"
        points={investorPoints}
      />
      <CaseStudyHalf 
        title="Farmer Case Study" 
        titleClass="title-green"
        fillClass="fill-green"
        points={farmerPoints}
      />
    </section>
  );
}
