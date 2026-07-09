import React from 'react';
import './HeroOrb.css';

export default function HeroOrb() {
  return (
    <div className="hero-orb-container">
      {/* Outer rings (Orbits) */}
      <div className="orb-orbit orbit-1">
        <div className="orbit-dot dot-1"><div className="orbit-label label-left">Soil AI</div></div>
        <div className="orbit-dot dot-2"><div className="orbit-label label-right">IoT Sensors</div></div>
      </div>
      
      <div className="orb-orbit orbit-2">
        <div className="orbit-dot dot-3"><div className="orbit-label label-right">Satellite</div></div>
        <div className="orbit-dot dot-4"><div className="orbit-label label-left">Yield Predictor</div></div>
      </div>
      
      <div className="orb-orbit orbit-3">
        <div className="orbit-dot dot-5"><div className="orbit-label label-right label-bottom">Crop Twin</div></div>
        <div className="orbit-dot dot-6"><div className="orbit-label label-left">Carbon Credits</div></div>
        <div className="orbit-dot dot-7"><div className="orbit-label label-bottom">Weather API</div></div>
      </div>
      
      {/* The central vibrant gradient globe */}
      <div className="orb-globe"></div>
    </div>
  );
}
