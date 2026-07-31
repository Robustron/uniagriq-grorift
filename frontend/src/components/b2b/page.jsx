import { B2BHeader } from "../../components/b2b/b2b-header"
import { B2BHero } from "../../components/b2b/b2b-hero"
import { PartnershipTypes } from "../../components/b2b/partnership-types"
import { WhyPartner } from "../../components/b2b/why-partner"
import { ContactForm } from "../../components/b2b/contact-form"

export const dynamic = "force-dynamic"

export default function B2BPage() {
  return (
    <main className="min-h-screen text-white bg-[#3B5236]">
      <B2BHeader />
      <B2BHero />
      <WhyPartner />
      <PartnershipTypes />
      <ContactForm />
    </main>
  )
}
