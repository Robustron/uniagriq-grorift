import { Heart, Users, Leaf } from "lucide-react"

export function CsrHero() {
  return (
    <section className="relative text-white py-16 md:py-24 px-4" style={{
      background: 'linear-gradient(135deg, #1d1d1f 0%, #275d46 100%)',
    }}>
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#569578]/20 rounded-full flex items-center justify-center border border-[#569578]/30">
            <Heart className="w-8 h-8 text-[#569578]" />
          </div>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold text-white font-sans mb-4">
          Empowering Farmers, Transforming Lives
        </h1>

        <p className="text-lg md:text-xl text-white/70 font-sans mb-8 max-w-2xl mx-auto leading-relaxed">
          Your contributions directly support farmer welfare programs, sustainable agriculture initiatives, and rural
          community development.
        </p>

        <div className="flex flex-wrap justify-center gap-6 md:gap-12">
          <div className="flex items-center gap-3 text-[#569578]">
            <Users className="w-6 h-6" />
            <span className="font-medium text-white">10,000+ Farmers Helped</span>
          </div>
          <div className="flex items-center gap-3 text-[#569578]">
            <Leaf className="w-6 h-6" />
            <span className="font-medium text-white">500+ Villages Reached</span>
          </div>
        </div>
      </div>

      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />
    </section>
  )
}
