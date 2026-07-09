import React, { lazy, Suspense, useState, useEffect } from 'react'
import PageLoader from './components/PageLoader'

// Hero loads eagerly — it's above the fold and must be instant
import HeroSection from './components/hero/HeroSection'

// ALL other heavy sections are lazy-loaded — they only download when needed
const EcosystemSection       = lazy(() => import('./components/EcosystemSection'))
const MobileAppsSection      = lazy(() => import('./components/MobileAppsSection'))
const SystemArchitectureSection = lazy(() => import('./components/SystemArchitectureSection'))
const CaseStudiesSection     = lazy(() => import('./components/CaseStudiesSection'))
const ProblemStatementsSection = lazy(() => import('./components/ProblemStatementsSection'))
const FeatureBentoSection    = lazy(() => import('./components/FeatureBentoSection'))
const MarketNetworkSection   = lazy(() => import('./components/MarketNetworkSection'))
const OnGroundResearchGallery = lazy(() => import('./components/OnGroundResearchGallery'))
const NeuralIntelligenceCore = lazy(() => import('./components/NeuralIntelligenceCore'))
const JoinCommunity          = lazy(() => import('./components/JoinCommunity'))
const Footer                 = lazy(() => import('./components/Footer'))

// Lightweight section-level fallback — invisible, no layout shift
const SectionFallback = () => <div style={{ minHeight: '100vh' }} aria-hidden="true" />

function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Show loader briefly, then fade out once document is interactive
    const onReady = () => {
      // Add a small buffer so the hero canvas can initialize
      setTimeout(() => setIsLoading(false), 800)
    }

    if (document.readyState === 'complete') {
      onReady()
    } else {
      window.addEventListener('load', onReady)
      return () => window.removeEventListener('load', onReady)
    }
  }, [])

  return (
    <>
      {isLoading && <PageLoader />}
      <div className="app-container" style={{ backgroundColor: '#fafdf7' }}>
        {/* Hero section — eager loaded, always instant */}
        <HeroSection />

        {/* All remaining sections — lazy loaded as user scrolls */}
        <Suspense fallback={<SectionFallback />}>
          <EcosystemSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <MobileAppsSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <SystemArchitectureSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <CaseStudiesSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <ProblemStatementsSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <FeatureBentoSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <MarketNetworkSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <OnGroundResearchGallery />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <NeuralIntelligenceCore />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <JoinCommunity />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Footer />
        </Suspense>
      </div>
    </>
  )
}

export default App
