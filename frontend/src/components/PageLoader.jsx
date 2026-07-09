import React from 'react';
import './PageLoader.css';

export default function PageLoader() {
  return (
    <div className="page-loader">
      <div className="loader-content">
        <div className="loader-brand">UNIAGRIQ</div>
        <div className="loader-squares">
          <div className="loader-sq sq-1"></div>
          <div className="loader-sq sq-2"></div>
          <div className="loader-sq sq-3"></div>
          <div className="loader-sq sq-4"></div>
        </div>
        <div className="loader-label">Loading Platform...</div>
      </div>
    </div>
  );
}
