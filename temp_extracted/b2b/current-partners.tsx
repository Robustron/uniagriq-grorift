import Image from "next/image"

const partners = [
  { name: "FreshMart", logo: "/freshmart-supermarket-logo.jpg" },
  { name: "AgriProcess Foods", logo: "/agriprocess-food-company-logo.jpg" },
  { name: "Green Hotels", logo: "/green-hotels-hospitality-logo.jpg" },
  { name: "Organic Exports", logo: "/organic-exports-trade-logo.jpg" },
  { name: "Metro Foods", logo: "/metro-foods-retail-logo.jpg" },
  { name: "Farm Fresh Co", logo: "/farm-fresh-company-logo.jpg" },
]

export function CurrentPartners() {
  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-[#3B5236] mb-4">Our Trusted Partners</h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
          Join these leading businesses who have transformed their supply chain with UniAgric.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="bg-card rounded-xl border border-border p-6 flex items-center justify-center hover:shadow-lg transition-shadow duration-300"
            >
              <Image
                src={partner.logo || "/placeholder.svg"}
                alt={`${partner.name} logo`}
                width={120}
                height={60}
                className="opacity-70 hover:opacity-100 transition-opacity"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
