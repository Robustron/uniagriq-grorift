import React from 'react'
import HeroSection from './components/hero/HeroSection'
import StatsGlobeSection from './components/StatsGlobeSection'
import EcosystemSection from './components/EcosystemSection'
import MobileAppsSection from './components/MobileAppsSection'
import CaseStudiesSection from './components/CaseStudiesSection'
import ProblemStatementsSection from './components/ProblemStatementsSection'
import FeatureBentoSection from './components/FeatureBentoSection'
import MarketNetworkSection from './components/MarketNetworkSection'
import OnGroundResearchGallery from './components/OnGroundResearchGallery'
import NeuralIntelligenceCore from './components/NeuralIntelligenceCore'
import SystemArchitectureSection from './components/SystemArchitectureSection'
import JoinCommunity from './components/JoinCommunity'
import Footer from './components/Footer'

function App() {
  const handleExplore = () => {
    console.log("Exploring Platform...")
  }

  return (
    <div className="app-container" style={{ backgroundColor: '#fafdf7' }}>
      <HeroSection onExplore={handleExplore} />
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
  )
}



export default App
