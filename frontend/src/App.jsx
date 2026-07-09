import React, { useState, useEffect } from 'react'
import HeroSection from './components/hero/HeroSection'
import EcosystemSection from './components/EcosystemSection'
import MobileAppsSection from './components/MobileAppsSection'
import SystemArchitectureSection from './components/SystemArchitectureSection'
import CaseStudiesSection from './components/CaseStudiesSection'
import ProblemStatementsSection from './components/ProblemStatementsSection'
import FeatureBentoSection from './components/FeatureBentoSection'
import MarketNetworkSection from './components/MarketNetworkSection'
import OnGroundResearchGallery from './components/OnGroundResearchGallery'
import NeuralIntelligenceCore from './components/NeuralIntelligenceCore'
import JoinCommunity from './components/JoinCommunity'
import Footer from './components/Footer'
import PageLoader from './components/PageLoader'

function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Preload everything during the loading screen.
    // Wait for:
    // 1. window.onload — all images, fonts, scripts are fully downloaded
    // 2. A minimum 1.2s display time so the loader doesn't flash
    const minDisplay = new Promise(r => setTimeout(r, 1200))
    const windowLoad = new Promise(r => {
      if (document.readyState === 'complete') return r()
      window.addEventListener('load', r, { once: true })
    })

    Promise.all([minDisplay, windowLoad]).then(() => setIsLoading(false))
  }, [])

  return (
    <>
      {isLoading && <PageLoader />}
      <div
        className="app-container"
        style={{
          backgroundColor: '#fafdf7',
          // Hide everything while loading so no half-rendered content flickers
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.4s ease'
        }}
      >
        <HeroSection />
        <EcosystemSection />
        <MobileAppsSection />
        <SystemArchitectureSection />
        <CaseStudiesSection />
        <ProblemStatementsSection />
        <FeatureBentoSection />
        <MarketNetworkSection />
        <OnGroundResearchGallery />
        <NeuralIntelligenceCore />
        <JoinCommunity />
        <Footer />
      </div>
    </>
  )
}

export default App
