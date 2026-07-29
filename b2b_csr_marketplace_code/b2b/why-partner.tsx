import { Shield, Leaf, Clock, BarChart3 } from "lucide-react"

const benefits = [
  {
    icon: Shield,
    title: "Verified Quality",
    description: "All products undergo rigorous quality checks and certifications ensuring premium grade produce.",
  },
  {
    icon: Leaf,
    title: "Sustainable Sourcing",
    description: "Direct farm-to-business model reduces carbon footprint and supports eco-friendly practices.",
  },
  {
    icon: Clock,
    title: "Reliable Supply",
    description: "Our network of 10,000+ farmers ensures consistent supply throughout the year.",
  },
  {
    icon: BarChart3,
    title: "Competitive Pricing",
    description: "Eliminate middlemen and get the best prices directly from farmers.",
  },
]

export function WhyPartner() {
  return (
    <section className="py-16 md:py-20" style={{ backgroundColor: '#1d1d1f' }}>
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-4">Why Partner With Us?</h2>
        <p className="text-white/60 text-center max-w-2xl mx-auto mb-12">
          UniAgriQ offers a unique opportunity to connect directly with farmers while ensuring quality and
          sustainability.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="bg-[#275d46]/20 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:border-[#569578]/40 hover:shadow-2xl hover:shadow-[#1d1d1f]/50 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-full bg-[#569578]/20 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                <benefit.icon className="w-6 h-6 text-[#569578]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
