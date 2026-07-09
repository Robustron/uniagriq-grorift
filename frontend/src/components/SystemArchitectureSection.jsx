import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './SystemArchitectureSection.css';

const textToReveal = "Connect to the ag-ecosystem. Orchestrate data across multiple sensors, build custom crop workflows, and connect to third parties using APIs, partner apps or pre-built integrations.";

const Word = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0, 1]);
  return (
    <span style={{ position: 'relative', display: 'inline-block', marginRight: '0.25em' }}>
      <span className="text-green-muted">{children}</span>
      <motion.span style={{ opacity: opacity, position: 'absolute', left: 0, top: 0 }} className="text-white">
        {children}
      </motion.span>
    </span>
  );
};

export default function SystemArchitectureSection() {
  const textRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: textRef,
    offset: ["start 80%", "end 40%"]
  });

  const words = textToReveal.split(" ");

  return (
    <section className="sys-arch-section" style={{ background: 'radial-gradient(circle at center top, #022c22 0%, #064e3b 40%, #050505 100%)' }}>
      {/* Background Porous Grid */}
      <div className="sys-arch-bg-grid"></div>
      
      {/* Header */}
      <div className="sys-arch-header" ref={textRef}>
        <h2 className="sys-arch-title" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {words.map((word, i) => {
            const start = i / words.length;
            const end = start + (1 / words.length);
            return (
              <Word key={i} progress={scrollYProgress} range={[start, end]}>
                {word}
              </Word>
            );
          })}
        </h2>
      </div>

      {/* Diagram Container */}
      <div className="sys-arch-diagram">
        
        {/* --- CONNECTING LINES --- */}
        {/* Center to Top */}
        <div className="arch-line arch-line-v center-to-top"></div>
        <div className="arch-line arch-line-h top-branch"></div>
        <div className="arch-line arch-line-v top-branch-left"></div>
        <div className="arch-line arch-line-v top-branch-right"></div>
        
        {/* Center to Left */}
        <div className="arch-line arch-line-h center-to-left"></div>
        <div className="arch-line arch-line-h left-to-icons"></div>

        {/* Center to Right */}
        <div className="arch-line arch-line-h center-to-right-bottom"></div>
        <div className="arch-line arch-line-v right-up-branch"></div>
        <div className="arch-line arch-line-h right-up-to-node"></div>
        <div className="arch-line arch-line-h right-extend"></div>

        {/* Center to Bottom */}
        <div className="arch-line arch-line-v center-to-bottom"></div>
        <div className="arch-line arch-line-v bottom-to-psp"></div>
        <div className="arch-line arch-line-h bottom-branch"></div>
        <div className="arch-line arch-line-v bottom-branch-left"></div>
        <div className="arch-line arch-line-v bottom-branch-right"></div>


        {/* --- NODES --- */}
        
        {/* Center Node */}
        <div className="arch-node center-node">
          UniAgriQ
        </div>

        {/* Top Nodes */}
        <div className="arch-node top-node top-left">Farmer App</div>
        <div className="arch-node top-node top-center">API Gateway</div>
        <div className="arch-node top-node top-right">Genesis App</div>
        
        {/* Top Dashed empty boxes */}
        <div className="arch-node-dashed top-dashed-left"></div>
        <div className="arch-node-dashed top-dashed-right"></div>

        {/* Left Nodes */}
        <div className="arch-node left-node">Data Ingestion ↗</div>
        <div className="arch-icons-box">
          <div className="arch-icon-slot dashed"></div>
          <div className="arch-icon-slot filled blue-icon">IoT</div>
          <div className="arch-icon-slot filled white-icon">API</div>
          <div className="arch-icon-slot dashed"></div>
          <div className="arch-icon-slot filled white-icon">Gov</div>
          <div className="arch-icon-slot filled red-icon">Sat</div>
        </div>

        {/* Right Nodes */}
        <div className="arch-node right-node right-top">Intelligence Layer</div>
        <div className="arch-node right-node right-bottom">Risk Engine</div>
        <div className="arch-icon-single"></div>

        {/* Bottom Nodes */}
        <div className="arch-node bottom-node">AI / ML Pipeline</div>
        <div className="arch-node bottom-sub-node">Portfolio</div>
        
        {/* Bottom Dashed empty boxes */}
        <div className="arch-node-dashed bottom-dashed-left"></div>
        <div className="arch-node-dashed bottom-dashed-right"></div>
        
      </div>
    </section>
  );
}
