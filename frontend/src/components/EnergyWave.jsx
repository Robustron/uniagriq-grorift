import React from 'react';
import './EnergyWave.css';

export default function EnergyWave() {
  return (
    <div className="energy-wave-container">
      <div className="wave-plane plane-1"></div>
      <div className="wave-plane plane-2"></div>
      <div className="wave-glow"></div>
    </div>
  );
}
