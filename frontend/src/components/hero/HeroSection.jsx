import React, { useRef, useEffect, Suspense } from 'react'
import Scene from './Scene'
import HeroOverlay from './HeroOverlay'
import './HeroSection.css'

/* ═══════════════════════════════════════════════════════════════
   HeroSection — Main wrapper combining the 3D scene and UI.
   Tracks cursor position for parallax and passes to Scene.
   ═══════════════════════════════════════════════════════════════ */
export default function HeroSection({ onExplore }) {
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section className="hero-section" aria-label="UniAgriQ Hero">
      {/* Background Video (Right Side) */}
      <div className="hero-video-wrapper">
        <video 
          src="/hero-bg.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline
          className="hero-video" 
        />
      </div>

      {/* 3D Canvas — Living cinematic environment */}
      <div className="hero-canvas-container">
        <Suspense fallback={null}>
          <Scene mouseRef={mouseRef} />
        </Suspense>
      </div>

      {/* 2D UI Overlay — Navbar, Title, CTA */}
      <HeroOverlay onExplore={onExplore} />
    </section>
  )
}
