import React from 'react';
import './EnergyBeam.css';

export default function EnergyBeam() {
  return (
    <div className="energy-beam-container" aria-hidden="true">
      <div className="energy-beam-core" />
      <div className="energy-beam-glow-ambient" />
    </div>
  );
}
