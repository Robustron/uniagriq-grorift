import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import HeroSection from './components/hero/HeroSection';
import EcosystemSection from './components/EcosystemSection';
import MobileAppsSection from './components/MobileAppsSection';
import SystemArchitectureSection from './components/SystemArchitectureSection';
import CaseStudiesSection from './components/CaseStudiesSection';
import ProblemStatementsSection from './components/ProblemStatementsSection';
import FeatureBentoSection from './components/FeatureBentoSection';
import MarketNetworkSection from './components/MarketNetworkSection';
import OnGroundResearchGallery from './components/OnGroundResearchGallery';
import NeuralIntelligenceCore from './components/NeuralIntelligenceCore';
import JoinCommunity from './components/JoinCommunity';
import Footer from './components/Footer';
import PageLoader from './components/PageLoader';
import ContactWidget from './components/ContactWidget';
import B2BPage from './pages/B2BPage';
import CSRPage from './pages/CSRPage';
import MarketplacePage from './pages/MarketplacePage';

function HomePage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const minDisplay = new Promise(r => setTimeout(r, 1200));
    const windowLoad = new Promise(r => {
      if (document.readyState === 'complete') return r();
      window.addEventListener('load', r, { once: true });
    });
    Promise.all([minDisplay, windowLoad]).then(() => setIsLoading(false));
  }, []);

  return (
    <>
      {isLoading && <PageLoader />}
      <div
        className="app-container"
        style={{
          backgroundColor: '#fafdf7',
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
  );
}

function App() {
  return (
    <BrowserRouter>
      <ContactWidget />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/b2b" element={<B2BPage />} />
        <Route path="/csr" element={<CSRPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
