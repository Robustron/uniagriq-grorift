import React from 'react';

// INVESTOR ICONS (BLUE)

export const LayeredPlanesIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="blueGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="#60A5FA" />
        <stop offset="1" stopColor="#2563EB" />
      </linearGradient>
    </defs>
    {/* Bottom plane */}
    <path d="M10 28L24 21L38 28L24 35L10 28Z" fill="url(#blueGrad)" fillOpacity="0.3" />
    {/* Middle plane */}
    <path d="M10 22L24 15L38 22L24 29L10 22Z" fill="url(#blueGrad)" fillOpacity="0.6" />
    {/* Top plane */}
    <path d="M10 16L24 9L38 16L24 23L10 16Z" fill="url(#blueGrad)" />
  </svg>
);

export const GlowingGridIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="blueGradGrid" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="#93C5FD" />
        <stop offset="1" stopColor="#3B82F6" />
      </linearGradient>
    </defs>
    <rect x="8" y="8" width="8" height="8" rx="2" fill="url(#blueGradGrid)" />
    <rect x="20" y="8" width="8" height="8" rx="2" fill="url(#blueGradGrid)" fillOpacity="0.7" />
    <rect x="32" y="8" width="8" height="8" rx="2" fill="url(#blueGradGrid)" fillOpacity="0.3" />
    
    <rect x="8" y="20" width="8" height="8" rx="2" fill="url(#blueGradGrid)" fillOpacity="0.8" />
    <rect x="20" y="20" width="8" height="8" rx="2" fill="url(#blueGradGrid)" />
    <rect x="32" y="20" width="8" height="8" rx="2" fill="url(#blueGradGrid)" fillOpacity="0.5" />
    
    <rect x="8" y="32" width="8" height="8" rx="2" fill="url(#blueGradGrid)" fillOpacity="0.4" />
    <rect x="20" y="32" width="8" height="8" rx="2" fill="url(#blueGradGrid)" fillOpacity="0.6" />
    <rect x="32" y="32" width="8" height="8" rx="2" fill="url(#blueGradGrid)" />
  </svg>
);

export const NestedRingsIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="blueGradRings" x1="0" y1="0" x2="48" y2="48">
        <stop stopColor="#BFDBFE" />
        <stop offset="1" stopColor="#1D4ED8" />
      </linearGradient>
    </defs>
    <circle cx="24" cy="24" r="16" stroke="url(#blueGradRings)" strokeWidth="4" strokeOpacity="0.3" />
    <circle cx="24" cy="24" r="10" stroke="url(#blueGradRings)" strokeWidth="4" strokeOpacity="0.6" />
    <circle cx="24" cy="24" r="4" fill="url(#blueGradRings)" />
  </svg>
);

export const FloatingHexagonsIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="blueGradHex" x1="0" y1="0" x2="48" y2="48">
        <stop stopColor="#60A5FA" />
        <stop offset="1" stopColor="#2563EB" />
      </linearGradient>
    </defs>
    <path d="M24 6L36 13V27L24 34L12 27V13L24 6Z" fill="url(#blueGradHex)" fillOpacity="0.2" />
    <path d="M24 12L32 17V26L24 31L16 26V17L24 12Z" fill="url(#blueGradHex)" fillOpacity="0.5" />
    <path d="M24 18L28 20.5V25.5L24 28L20 25.5V20.5L24 18Z" fill="url(#blueGradHex)" />
  </svg>
);

// FARMER ICONS (GREEN)

export const GlowingLeafIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="greenGrad" x1="0" y1="0" x2="48" y2="48">
        <stop stopColor="#4ADE80" />
        <stop offset="1" stopColor="#16A34A" />
      </linearGradient>
    </defs>
    <path d="M24 8C34 8 40 14 40 24C40 34 34 40 24 40C14 40 8 34 8 24C8 14 14 8 24 8Z" fill="url(#greenGrad)" fillOpacity="0.2" />
    <path d="M24 14C30 14 34 18 34 24C34 30 30 34 24 34C18 34 14 30 14 24C14 18 18 14 24 14Z" fill="url(#greenGrad)" fillOpacity="0.5" />
    <path d="M24 20C26 20 28 22 28 24C28 26 26 28 24 28C22 28 20 26 20 24C20 22 22 20 24 20Z" fill="url(#greenGrad)" />
  </svg>
);

export const NeuralNodesIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="greenGradNodes" x1="0" y1="0" x2="48" y2="48">
        <stop stopColor="#86EFAC" />
        <stop offset="1" stopColor="#15803D" />
      </linearGradient>
    </defs>
    <line x1="24" y1="14" x2="14" y2="28" stroke="url(#greenGradNodes)" strokeWidth="2" strokeOpacity="0.5"/>
    <line x1="24" y1="14" x2="34" y2="28" stroke="url(#greenGradNodes)" strokeWidth="2" strokeOpacity="0.5"/>
    <line x1="14" y1="28" x2="34" y2="28" stroke="url(#greenGradNodes)" strokeWidth="2" strokeOpacity="0.5"/>
    <line x1="24" y1="38" x2="14" y2="28" stroke="url(#greenGradNodes)" strokeWidth="2" strokeOpacity="0.5"/>
    <line x1="24" y1="38" x2="34" y2="28" stroke="url(#greenGradNodes)" strokeWidth="2" strokeOpacity="0.5"/>
    
    <circle cx="24" cy="14" r="5" fill="url(#greenGradNodes)" />
    <circle cx="14" cy="28" r="4" fill="url(#greenGradNodes)" fillOpacity="0.7"/>
    <circle cx="34" cy="28" r="4" fill="url(#greenGradNodes)" fillOpacity="0.7"/>
    <circle cx="24" cy="38" r="3" fill="url(#greenGradNodes)" fillOpacity="0.5"/>
  </svg>
);

export const IntersectingCirclesIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="greenGradCirc" x1="0" y1="0" x2="48" y2="48">
        <stop stopColor="#4ADE80" />
        <stop offset="1" stopColor="#16A34A" />
      </linearGradient>
    </defs>
    <circle cx="20" cy="24" r="12" stroke="url(#greenGradCirc)" strokeWidth="4" strokeOpacity="0.8" />
    <circle cx="28" cy="24" r="12" stroke="url(#greenGradCirc)" strokeWidth="4" strokeOpacity="0.4" />
    <circle cx="24" cy="24" r="4" fill="url(#greenGradCirc)" />
  </svg>
);

export const IsometricBarsIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="greenGradBars" x1="0" y1="0" x2="48" y2="48">
        <stop stopColor="#4ADE80" />
        <stop offset="1" stopColor="#16A34A" />
      </linearGradient>
    </defs>
    {/* Bar 1 (Left, shortest) */}
    <path d="M10 32L16 28V36L10 40V32Z" fill="url(#greenGradBars)" fillOpacity="0.4" />
    <path d="M10 32L13 30L19 34L16 36L10 32Z" fill="url(#greenGradBars)" fillOpacity="0.6" />
    
    {/* Bar 2 (Middle) */}
    <path d="M21 24L27 20V36L21 40V24Z" fill="url(#greenGradBars)" fillOpacity="0.6" />
    <path d="M21 24L24 22L30 26L27 28L21 24Z" fill="url(#greenGradBars)" fillOpacity="0.8" />

    {/* Bar 3 (Right, tallest) */}
    <path d="M32 16L38 12V36L32 40V16Z" fill="url(#greenGradBars)" fillOpacity="0.8" />
    <path d="M32 16L35 14L41 18L38 20L32 16Z" fill="url(#greenGradBars)" />
  </svg>
);
