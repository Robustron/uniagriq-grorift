import React from 'react';
import { motion } from 'framer-motion';
import './FeatureBentoSection.css';

const BentoCard = ({ title, description, children, className = "" }) => (
  <motion.div 
    className={`bento-card ${className}`}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6 }}
  >
    <div className="bento-card-bg-glow"></div>
    <div className="bento-card-content">
      <div className="bento-visual">
        {children}
      </div>
      <div className="bento-text">
        <h3 className="bento-title">{title}</h3>
        <p className="bento-desc">{description}</p>
      </div>
    </div>
  </motion.div>
);

// Custom UI Mockups for each card
const VedaAIMockup = () => (
  <div className="veda-mockup">
    <div className="veda-chat-bubble ai">
      <div className="veda-typing-dot"></div>
      <div className="veda-typing-dot"></div>
      <div className="veda-typing-dot"></div>
    </div>
    <div className="veda-chat-bubble user">
      <div className="veda-line user-line"></div>
    </div>
    <div className="veda-chat-bubble ai full">
      <div className="veda-line ai-line"></div>
      <div className="veda-line ai-line short"></div>
    </div>
    <div className="veda-glow-orb blue"></div>
  </div>
);

const DigitalTwinMockup = () => (
  <div className="twin-mockup">
    <div className="twin-ring outer"></div>
    <div className="twin-ring middle"></div>
    <div className="twin-ring inner">
      <div className="twin-core"></div>
    </div>
    <div className="twin-glow-orb green"></div>
  </div>
);

const InvestmentMockup = () => (
  <div className="invest-mockup">
    <div className="invest-bar bar-1"></div>
    <div className="invest-bar bar-2"></div>
    <div className="invest-bar bar-3"></div>
    <div className="invest-line-chart"></div>
    <div className="twin-glow-orb blue-green"></div>
  </div>
);

const SchemeMockup = () => (
  <div className="scheme-mockup">
    <div className="scheme-doc doc-1"></div>
    <div className="scheme-doc doc-2"></div>
    <div className="scheme-doc doc-3"></div>
    <div className="scheme-check">✓</div>
  </div>
);

const CalendarMockup = () => {
  // Deterministic "random" level generator for github style graph
  const getLevel = (i) => {
    if (i === 42 || i === 73) return 'blue-level'; // Special glowing blue items
    if (i === 15 || i === 88 || i === 54) return 'level-4'; // Max green
    if (i % 7 === 0 || i % 11 === 0) return 'level-3';
    if (i % 3 === 0 || i % 5 === 0) return 'level-2';
    if (i % 2 === 0) return 'level-1';
    return 'level-0'; // Empty
  };

  return (
    <div className="calendar-mockup">
      <div className="cal-grid">
        {[...Array(100)].map((_, i) => (
          <div key={i} className={`cal-cell ${getLevel(i)}`}></div>
        ))}
      </div>
    </div>
  );
};

export default function FeatureBentoSection() {
  return (
    <section className="bento-section" aria-label="Platform Features">
      <div className="bento-header">
        <motion.h2 
          className="bento-main-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Unmatched Agricultural Intelligence
        </motion.h2>
        <motion.p 
          className="bento-main-desc"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          UniAgriQ is an AI-driven farm advisory, fractional investment, and transparent supply chain platform providing unprecedented profitability for farmers and investors alike.
        </motion.p>
      </div>

      <div className="bento-grid">
        <BentoCard 
          className="col-span-3 row-span-1 veda-card"
          title="Veda AI"
          description="Expert-level crop intelligence and disease detection in your local vernacular."
        >
          <VedaAIMockup />
        </BentoCard>

        <BentoCard 
          className="col-span-2 row-span-1 twin-card"
          title="Farmer Digital Twin"
          description="A continuously updated virtual replica of your farm with live IoT & Satellite tracking."
        >
          <DigitalTwinMockup />
        </BentoCard>

        <BentoCard 
          className="col-span-2 row-span-1 invest-card"
          title="Fractional Agri-Investments"
          description="SEBI-compliant investor platform with transparent, milestone-based funding."
        >
          <InvestmentMockup />
        </BentoCard>

        <BentoCard 
          className="col-span-3 row-span-1 scheme-card"
          title="Scheme Navigator"
          description="AI-assisted identification to help you unlock unclaimed government subsidies and benefits."
        >
          <SchemeMockup />
        </BentoCard>

        <BentoCard 
          className="col-span-5 row-span-1 cal-card"
          title="Dynamic Crop Calendar"
          description="Weather-adjusted schedules providing real-time adaptations for sowing, irrigation, and harvest."
        >
          <CalendarMockup />
        </BentoCard>
      </div>
    </section>
  );
}
