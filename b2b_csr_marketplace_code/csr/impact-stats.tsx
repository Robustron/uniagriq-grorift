import { IndianRupee, Users, Tractor, GraduationCap } from "lucide-react"

const stats = [
  {
    icon: IndianRupee,
    value: "2.5 Cr+",
    label: "Total Contributions",
  },
  {
    icon: Users,
    value: "10,000+",
    label: "Farmers Supported",
  },
  {
    icon: Tractor,
    value: "500+",
    label: "Equipment Provided",
  },
  {
    icon: GraduationCap,
    value: "1,200+",
    label: "Training Programs",
  },
]

export function ImpactStats() {
  return (
    <section className="py-12 px-4" style={{ backgroundColor: '#1d1d1f' }}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-white font-sans text-center mb-10">Our Impact</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center p-6 rounded-2xl bg-[#275d46]/20 border border-white/10 backdrop-blur-sm shadow-xl">
              <div className="flex justify-center mb-3">
                <stat.icon className="w-8 h-8 text-[#569578]" />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-white font-sans">{stat.value}</p>
              <p className="text-sm text-white/50 font-sans mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
