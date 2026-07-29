"use client"

import { useState } from "react"
import { Store, Factory, Truck, Hotel, Building, Warehouse } from "lucide-react"
import { Button } from "@/components/ui/button"

const partnershipTypes = [
  {
    id: "retailer",
    icon: Store,
    title: "Retailers & Supermarkets",
    description: "Stock fresh, farm-direct produce for your customers with quality assurance and competitive pricing.",
    benefits: [
      "Weekly delivery schedules",
      "Custom packaging options",
      "Volume-based discounts",
      "Quality certifications",
    ],
  },
  {
    id: "processor",
    icon: Factory,
    title: "Food Processors",
    description: "Get bulk raw materials directly from farmers for your processing and manufacturing needs.",
    benefits: ["Bulk quantity supply", "Consistent quality grades", "Seasonal contracts", "Traceability reports"],
  },
  {
    id: "exporter",
    icon: Truck,
    title: "Exporters",
    description: "Access export-quality produce with all necessary documentation and certifications.",
    benefits: ["Export certifications", "Cold chain logistics", "Documentation support", "Global standards compliance"],
  },
  {
    id: "hospitality",
    icon: Hotel,
    title: "Hotels & Restaurants",
    description: "Fresh daily supplies for your kitchen with flexible ordering and delivery options.",
    benefits: ["Daily fresh deliveries", "Custom order sizes", "Seasonal menu planning", "Farm-to-table traceability"],
  },
  {
    id: "corporate",
    icon: Building,
    title: "Corporate Cafeterias",
    description: "Healthy, fresh produce for employee cafeterias with bulk ordering benefits.",
    benefits: ["Bulk discounts", "Nutritional information", "Sustainable sourcing", "Flexible schedules"],
  },
  {
    id: "distributor",
    icon: Warehouse,
    title: "Distributors",
    description: "Partner as a regional distributor and expand our reach to more businesses.",
    benefits: ["Exclusive territories", "Marketing support", "Competitive margins", "Training programs"],
  },
]

export function PartnershipTypes() {
  const [selectedType, setSelectedType] = useState("retailer")
  const selected = partnershipTypes.find((p) => p.id === selectedType)!

  return (
    <section className="py-16 md:py-20" style={{ backgroundColor: '#1d1d1f' }}>
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-4">Partnership Types</h2>
        <p className="text-white/60 text-center max-w-2xl mx-auto mb-12">
          We offer tailored partnership models to suit different business needs.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {partnershipTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`p-4 rounded-xl border-2 transition-all duration-300 min-h-[44px] ${
                selectedType === type.id
                  ? "border-[#569578] bg-[#275d46]"
                  : "border-white/10 bg-[#275d46]/10 hover:border-[#569578]/40"
              }`}
              aria-pressed={selectedType === type.id}
            >
              <type.icon
                className={`w-8 h-8 mx-auto mb-2 ${
                  selectedType === type.id ? "text-white" : "text-white/50"
                }`}
              />
              <p
                className={`text-xs font-semibold text-center ${
                  selectedType === type.id ? "text-white" : "text-white/45"
                }`}
              >
                {type.title.split(" ")[0]}
              </p>
            </button>
          ))}
        </div>

        <div className="bg-[#275d46]/20 backdrop-blur-md rounded-2xl border border-white/10 p-6 md:p-10 shadow-2xl">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-full bg-[#569578]/20 flex items-center justify-center border border-[#569578]/30">
                  <selected.icon className="w-7 h-7 text-[#569578]" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white leading-tight">{selected.title}</h3>
              </div>
              <p className="text-white/70 leading-relaxed mb-6">{selected.description}</p>
              <Button
                className="bg-[#569578] hover:bg-[#569578]/80 text-white min-h-[44px] px-6 rounded-full"
                onClick={() => {
                  if (typeof document !== "undefined") {
                    document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" })
                  }
                }}
              >
                Become a Partner
              </Button>
            </div>

            <div className="flex-1">
              <h4 className="font-semibold text-white mb-4 text-lg">Key Benefits</h4>
              <ul className="space-y-3">
                {selected.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#569578] shadow-[0_0_8px_#569578]" />
                    <span className="text-white/75">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
