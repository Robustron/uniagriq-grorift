import React, { useRef, useEffect } from 'react';
import './Footer.css';

const FooterBurst = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    let width, height;
    let rays = [];
    
    const init = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      ctx.scale(dpr, dpr);
      
      width = rect.width;
      height = rect.height;
      
      rays = [];
      const numRays = 400; // Stripe-level density
      
      for (let i = 0; i < numRays; i++) {
        const spread = (Math.random() * 170 - 85) * (Math.PI / 180);
        const baseAngle = -Math.PI / 2;
        const finalAngle = baseAngle + spread;
        
        const maxLen = height * 0.95;
        const minLen = height * 0.15;
        const length = minLen + Math.pow(Math.random(), 1.5) * (maxLen - minLen);
        
        rays.push({
          baseAngle: finalAngle, // store base angle
          angle: finalAngle,
          baseLength: length, // store base length
          length: length,
          speed: (Math.random() * 0.003) + 0.001,
          offset: Math.random() * Math.PI * 2,
          dotSize: Math.random() * 1.5 + 0.5
        });
      }
    };
    
    // Initial delay to ensure CSS layout is complete before measuring height
    setTimeout(init, 100);
    window.addEventListener('resize', init);
    
    // Mouse tracking for hover interaction
    let mouse = { x: -1000, y: -1000, active: false };
    const handleMouseMove = (e) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      // Check if mouse is within the footer's bounding box
      if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.active = true;
      } else {
        mouse.active = false;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    
    let animationFrame;
    
    const render = () => {
      if (!width || !height) {
        animationFrame = requestAnimationFrame(render);
        return;
      }
      
      ctx.clearRect(0, 0, width, height);
      
      const startX = width / 2;
      const startY = height;
      
      // True radial gradient from the bottom center for flawless color distribution
      const gradient = ctx.createRadialGradient(startX, startY, 0, startX, startY, height * 0.9);
      gradient.addColorStop(0, "#ff6a00"); // Vibrant bright orange root
      gradient.addColorStop(0.4, "#ff1493"); // Intense hot pink mid
      gradient.addColorStop(1, "#00d2ff"); // Bright neon cyan/blue tips (not dark)
      
      const time = Date.now() * 0.001;
      
      rays.forEach(ray => {
        // Interactive physics
        let hoverForce = 0;
        let angleOffset = 0;
        let lenMultiplier = 1;
        
        if (mouse.active) {
          // Check distance from mouse to the end of the ray
          const expectedX = startX + Math.cos(ray.baseAngle) * ray.baseLength;
          const expectedY = startY + Math.sin(ray.baseAngle) * ray.baseLength;
          
          const dx = mouse.x - expectedX;
          const dy = mouse.y - expectedY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 150) {
            hoverForce = (150 - dist) / 150; // 0 to 1
            lenMultiplier = 1 + (hoverForce * 0.2); // Ray gets 20% longer
            
            // Push ray angle away from mouse slightly
            const pushDir = Math.sign(expectedX - mouse.x);
            angleOffset = pushDir * hoverForce * 0.05;
          }
        }
        
        // Smoothly transition angle and length to their targets
        const targetAngle = ray.baseAngle + angleOffset + Math.sin(time * ray.speed + ray.offset) * 0.01;
        const targetLength = (ray.baseLength * lenMultiplier) + Math.sin(time * ray.speed * 2 + ray.offset) * (ray.baseLength * 0.02);
        
        ray.angle += (targetAngle - ray.angle) * 0.1;
        ray.length += (targetLength - ray.length) * 0.1;
        
        const endX = startX + Math.cos(ray.angle) * ray.length;
        const endY = startY + Math.sin(ray.angle) * ray.length;
        
        // Ray Line
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = gradient;
        // Boost base opacity to 0.55 for stronger colors without making it dark
        ctx.globalAlpha = Math.min(1, 0.55 + Math.sin(time * ray.speed * 3 + ray.offset) * 0.2 + (hoverForce * 0.8));
        ctx.lineWidth = 1.3 + (hoverForce * 2);
        ctx.stroke();
        
        // Ray Tip Dot
        ctx.beginPath();
        ctx.arc(endX, endY, ray.dotSize + (hoverForce * 3), 0, Math.PI * 2);
        // If heavily hovered, make the dot bright white/yellow
        if (hoverForce > 0.3) {
          ctx.fillStyle = `rgba(255, 255, 255, ${hoverForce})`;
          ctx.shadowColor = "#ffffff";
          ctx.shadowBlur = hoverForce * 15;
        } else {
          ctx.fillStyle = gradient;
          ctx.shadowBlur = 0;
        }
        ctx.globalAlpha = Math.min(1, 0.9 + hoverForce);
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      
      animationFrame = requestAnimationFrame(render);
    };
    
    render();
    
    return () => {
      window.removeEventListener('resize', init);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrame);
    };
  }, []);
  
  return (
    <div className="footer-burst-container">
      <canvas ref={canvasRef} className="footer-burst-canvas" style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  );
};

export default function Footer() {
  return (
    <footer className="footer-section">
      
      {/* Stripe-style Burst Graphic */}
      <FooterBurst />

      <div className="footer-container">
        
        {/* Left Column (Brand & Socials) */}
        <div className="footer-left">
          <div className="footer-brand">
            <div className="footer-brand-header">
              <img src="/logo.png" alt="UniAgriQ Logo" className="footer-logo" />
              <h2 className="footer-title">
                UNIAGRIQ
              </h2>
            </div>
            <p className="footer-desc">
              An early-stage agri-tech platform building transparent connections between farmers, investors, and marketplaces.
            </p>
          </div>

          <div className="footer-disclaimer">
            <span className="footer-disclaimer-title">
              IMPORTANT DISCLAIMER
            </span>
            <p className="footer-disclaimer-text">
              Agricultural investments carry inherent risks including crop failure, weather events, market volatility, and other factors beyond our control. Returns are projected, not guaranteed. Past performance does not guarantee future results.
            </p>
          </div>

          {/* Social Icons Mini */}
          <div className="footer-socials">
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
              <svg className="footer-social-icon" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
              <svg className="footer-social-icon" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
            <a href="https://reddit.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
              <svg className="footer-social-icon" viewBox="0 0 24 24">
                <path d="M24 11.5c0-1.654-1.346-3-3-3-.964 0-1.817.462-2.36 1.171-1.708-1.15-3.996-1.85-6.51-1.921l1.378-4.329 3.82.815c.012.96.793 1.735 1.76 1.735 1.02 0 1.85-.83 1.85-1.85s-.83-1.85-1.85-1.85c-.886 0-1.614.629-1.796 1.459l-4.22-.9c-.198-.043-.396.069-.462.268l-1.68 5.276c-2.545.048-4.862.748-6.592 1.906-.54-.694-1.38-1.144-2.328-1.144-1.654 0-3 1.346-3 3 0 1.306.842 2.41 2.01 2.822-.064.224-.1.46-.1.703 0 3.584 4.486 6.5 10 6.5s10-2.916 10-6.5c0-.243-.036-.479-.1-.703 1.168-.412 2.01-1.516 2.01-2.822zm-16 1.85c-.746 0-1.35-.604-1.35-1.35s.604-1.35 1.35-1.35 1.35.604 1.35 1.35-.604 1.35-1.35 1.35zm9.238 3.829c-1.026 1.026-2.986 1.11-3.238 1.11-.252 0-2.212-.084-3.238-1.11-.137-.137-.137-.358 0-.495.137-.137.358-.137.495 0 .817.817 2.378.895 2.743.895.365 0 1.926-.078 2.743-.895.137-.137.358-.137.495 0 .137.137.137.358 0 .495zm-.238-2.479c-.746 0-1.35-.604-1.35-1.35s.604-1.35 1.35-1.35 1.35.604 1.35 1.35-.604 1.35-1.35 1.35z" />
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
              <svg className="footer-social-icon icon-stroke" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
          </div>
        </div>

        {/* Right Column (Navigation Grid) */}
        <div className="footer-nav">
          <div className="footer-nav-col">
            <h4 className="footer-nav-title">CSR</h4>
            <div className="footer-nav-links">
              <a href="/csr" className="footer-nav-link">Impact Stories</a>
              <a href="/csr" className="footer-nav-link">Community Programs</a>
              <a href="/csr" className="footer-nav-link">Sustainability</a>
            </div>
          </div>
          <div className="footer-nav-col">
            <h4 className="footer-nav-title">Marketplace</h4>
            <div className="footer-nav-links">
              <a href="/marketplace" className="footer-nav-link">Fresh Crops</a>
              <a href="/marketplace" className="footer-nav-link">Value-added Goods</a>
              <a href="/b2b" className="footer-nav-link">B2B Sourcing</a>
            </div>
          </div>
          <div className="footer-nav-col">
            <h4 className="footer-nav-title">About</h4>
            <div className="footer-nav-links">
              <a href="/news" className="footer-nav-link">Agriculture & Science News</a>
              <a href="/" className="footer-nav-link">Our Story</a>
              <a href="/" className="footer-nav-link">Team</a>
              <a href="/careers" className="footer-nav-link">Careers</a>
            </div>
          </div>
          <div className="footer-nav-col">
            <h4 className="footer-nav-title">Legal</h4>
            <div className="footer-nav-links">
              <a href="/" className="footer-nav-link">Terms of Service</a>
              <a href="/" className="footer-nav-link">Privacy Policy</a>
              <a href="/" className="footer-nav-link">Disclaimers</a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Line */}
      <div className="footer-copyright">
        <div>© 2026 UNIAGRIQ. All rights reserved. An early-stage startup building transparent agriculture technology.</div>
      </div>
    </footer>
  );
}
