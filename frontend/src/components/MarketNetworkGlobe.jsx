import React, { useState, useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';

export default function MarketNetworkGlobe() {
  const globeRef = useRef();
  const [countries, setCountries] = useState({ features: [] });
  const [arcs, setArcs] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  
  // Dimensions
  const [dimensions, setDimensions] = useState({ width: 800, height: 800 });
  const containerRef = useRef(null);

  // Pre-compute stable colors — NEVER call Math.random() in the render loop!
  const countryColors = React.useRef(new Map());
  const getCountryColor = (d) => {
    const id = d.properties?.ISO_A3 || d.id || Math.random();
    if (!countryColors.current.has(id)) {
      countryColors.current.set(id, Math.random() > 0.5
        ? 'rgba(16, 185, 129, 0.8)'
        : 'rgba(59, 130, 246, 0.8)');
    }
    return countryColors.current.get(id);
  };

  useEffect(() => {
    // Load from local public folder — no runtime network dependency!
    fetch('/countries.geojson')
      .then(res => res.json())
      .then(setCountries);

    // Mock Live Trade Arcs
    const mockArcs = [
      { startLat: -23.55, startLng: -46.63, endLat: 52.52, endLng: 13.40, name: "Brazil -> Europe" },
      { startLat: 39.9, startLng: 116.4, endLat: -33.86, endLng: 151.2, name: "China -> Australia" },
      { startLat: 40.71, startLng: -74.00, endLat: 35.68, endLng: 139.69, name: "US -> Japan" },
      { startLat: 28.61, startLng: 77.20, endLat: -1.29, endLng: 36.82, name: "India -> Kenya" },
      { startLat: 51.5, startLng: -0.12, endLat: 40.71, endLng: -74.00, name: "UK -> US" },
      { startLat: -34.6, startLng: -58.38, endLat: 31.23, endLng: 121.47, name: "Argentina -> China" },
      { startLat: 48.85, startLng: 2.35, endLat: 19.43, endLng: -99.13, name: "France -> Mexico" },
      { startLat: -26.2, startLng: 28.04, endLat: 55.75, endLng: 37.61, name: "South Africa -> Russia" }
    ];
    setArcs(mockArcs);

    // Resize handler
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetWidth // Keep it 1:1 aspect ratio
        });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div 
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        width: '100%', 
        maxWidth: '850px', 
        aspectRatio: '1/1', 
        margin: '0 auto', 
        position: 'relative',
        cursor: 'grab',
        transform: isHovered ? 'scale(1.15)' : 'scale(1)',
        filter: isHovered ? 'drop-shadow(0 0 80px rgba(16, 185, 129, 0.6))' : 'drop-shadow(0 0 0px rgba(0,0,0,0))',
        transition: 'transform 0.6s cubic-bezier(0.2, 0, 0.2, 1), filter 0.6s ease'
      }}
    >
      <Globe
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="rgba(0,0,0,0)" // Transparent background to blend with our page
        onGlobeReady={() => {
          if (globeRef.current) {
            const controls = globeRef.current.controls();
            if (controls) {
              controls.autoRotate = true;
              controls.autoRotateSpeed = 0.8;
              controls.enableZoom = false;
              controls.enableRotate = false; // Prevents manual drag-spinning, but auto-rotate continues
            }
          }
        }}
        
        // Earth Config
        showGlobe={false} // Hides the dark sphere base, leaving only a hollow shell of floating dots!
        showAtmosphere={true}
        atmosphereColor="#0ea5e9" // Sky Blue atmosphere
        atmosphereAltitude={0.2}
        
        // Continents (Hex Polygons)
        hexPolygonsData={countries.features}
        hexPolygonResolution={3}
        hexPolygonMargin={0.3}
        // Alternate continent colors between Emerald and Blue
        hexPolygonColor={getCountryColor}
        hexPolygonLabel={({ properties: d }) => `
          <div style="background: #0f172a; padding: 4px 8px; border-radius: 4px; color: #fff; font-family: Inter, sans-serif; font-size: 12px; border: 1px solid rgba(16, 185, 129, 0.5);">
            ${d.ADMIN}
          </div>
        `}

        // Live Trade Arcs
        arcsData={arcs}
        arcStartLat={d => d.startLat}
        arcStartLng={d => d.startLng}
        arcEndLat={d => d.endLat}
        arcEndLng={d => d.endLng}
        arcColor={() => ['rgba(59, 130, 246, 0.9)', 'rgba(16, 185, 129, 0.9)']} // Blue -> Green gradient
        arcDashLength={0.4}
        arcDashGap={0.2}
        arcDashAnimateTime={1500}
        arcsTransitionDuration={1000}
        arcStroke={1}
        arcLabel={d => `
          <div style="background: #1e40af; padding: 4px 8px; border-radius: 4px; color: #fff; font-family: Inter, sans-serif; font-size: 12px; border: 1px solid rgba(59, 130, 246, 0.5);">
            Live Trade: ${d.name}
          </div>
        `}
      />
    </div>
  );
}
