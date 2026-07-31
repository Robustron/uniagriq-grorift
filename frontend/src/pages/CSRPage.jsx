import { CsrHeader } from "../components/csr/csr-header"
import { CsrHero } from "../components/csr/csr-hero"
import { ActiveCampaigns } from "../components/csr/active-campaigns"
import { ContributionForm } from "../components/csr/contribution-form"
import { ImpactStats } from "../components/csr/impact-stats"

export default function CsrPage() {
  return (
    <main className="min-h-screen text-white bg-[#3B5236]">
      <CsrHeader />
      <CsrHero />
      <ImpactStats />
      <ActiveCampaigns />
      <ContributionForm />
    </main>
  )
}
