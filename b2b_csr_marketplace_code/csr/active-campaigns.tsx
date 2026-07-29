"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, Clock } from "lucide-react"

const campaigns = [
  {
    id: 1,
    title: "Drought Relief Fund",
    description: "Providing emergency support to farmers affected by drought conditions in Maharashtra.",
    image: "/drought-affected-farmland.jpg",
    raised: 850000,
    goal: 1000000,
    daysLeft: 15,
    category: "Emergency",
  },
  {
    id: 2,
    title: "Modern Equipment Drive",
    description: "Supplying tractors and farming tools to small-scale farmers in rural Karnataka.",
    image: "/farming-tractor-equipment.jpg",
    raised: 1200000,
    goal: 2000000,
    daysLeft: 30,
    category: "Equipment",
  },
  {
    id: 3,
    title: "Organic Farming Training",
    description: "Training 500 farmers in sustainable organic farming practices across Punjab.",
    image: "/organic-farming-training-workshop.jpg",
    raised: 300000,
    goal: 500000,
    daysLeft: 45,
    category: "Education",
  },
  {
    id: 4,
    title: "Women Farmer Empowerment",
    description: "Supporting women-led farming initiatives with microloans and skill development.",
    image: "/women-farmers-working-in-field.jpg",
    raised: 600000,
    goal: 800000,
    daysLeft: 20,
    category: "Empowerment",
  },
  {
    id: 5,
    title: "Clean Water for Farms",
    description: "Installing irrigation systems and water harvesting in water-scarce regions.",
    image: "/farm-irrigation-water-system.jpg",
    raised: 450000,
    goal: 750000,
    daysLeft: 25,
    category: "Infrastructure",
  },
  {
    id: 6,
    title: "Farmer Children Education",
    description: "Scholarships and school supplies for children of marginal farmers.",
    image: "/rural-school-children-studying.jpg",
    raised: 200000,
    goal: 400000,
    daysLeft: 60,
    category: "Education",
  },
]

const categories = ["All", "Emergency", "Equipment", "Education", "Empowerment", "Infrastructure"]

export function ActiveCampaigns() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedCampaign, setSelectedCampaign] = useState<number | null>(null)

  const filteredCampaigns =
    selectedCategory === "All" ? campaigns : campaigns.filter((c) => c.category === selectedCategory)

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`
    }
    return `₹${amount.toLocaleString("en-IN")}`
  }

  return (
    <section className="py-12 md:py-16 px-4" style={{ backgroundColor: '#1d1d1f' }}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-white font-sans text-center mb-4">
          Active Campaigns
        </h2>
        <p className="text-center text-white/60 font-sans mb-8 max-w-2xl mx-auto">
          Choose a cause close to your heart and make a difference in farmers' lives
        </p>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full font-semibold text-sm transition-all min-h-[44px] ${
                selectedCategory === category
                  ? "bg-[#569578] text-white shadow-lg"
                  : "bg-[#275d46]/10 text-white/70 border border-white/10 hover:border-[#569578]/50 hover:bg-[#275d46]/20"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Campaigns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign) => {
            const progress = (campaign.raised / campaign.goal) * 100

            return (
              <article
                key={campaign.id}
                className={`bg-[#275d46]/20 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer ${
                  selectedCampaign === campaign.id ? "ring-2 ring-[#569578]" : ""
                }`}
                onClick={() => setSelectedCampaign(selectedCampaign === campaign.id ? null : campaign.id)}
              >
                <div className="relative h-40">
                  <Image
                    src={campaign.image || "/placeholder.svg"}
                    alt={campaign.title}
                    fill
                    className="object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-[#569578] text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                    {campaign.category}
                  </span>
                </div>

                <div className="p-5 text-white">
                  <h3 className="text-lg font-bold font-sans mb-2">{campaign.title}</h3>
                  <p className="text-sm text-white/60 font-sans mb-4 line-clamp-2">{campaign.description}</p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-bold text-[#569578]">{formatCurrency(campaign.raised)}</span>
                      <span className="text-white/60">of {formatCurrency(campaign.goal)}</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#569578] rounded-full transition-all duration-500 shadow-[0_0_8px_#569578]"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-white/60">
                      <Clock className="w-4 h-4 text-[#569578]" />
                      <span>{campaign.daysLeft} days left</span>
                    </div>
                    <button
                      className="flex items-center gap-2 px-4 py-2 bg-[#569578] hover:bg-[#569578]/80 text-white font-semibold text-sm rounded-full transition-all min-h-[44px] shadow-lg"
                      onClick={(e) => {
                        e.stopPropagation()
                        document.getElementById("contribution-form")?.scrollIntoView({ behavior: "smooth" })
                      }}
                    >
                      <Heart className="w-4 h-4 fill-white" />
                      Donate
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
