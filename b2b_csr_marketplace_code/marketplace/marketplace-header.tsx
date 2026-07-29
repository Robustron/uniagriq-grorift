import { marketplaceCategories, type MarketplaceProduct } from "@/lib/marketplace-data"
import { Package, Shapes, Tags, ShieldCheck } from "lucide-react"

export function MarketplaceHeader({ products }: { products: MarketplaceProduct[] }) {
  const valueAddedCount = products.filter((product) => product.valueAdded).length

  return (
    <section className="mb-8 overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#1d1d1f] to-[#275d46] px-8 py-10 md:px-12 md:py-14 text-white relative flex flex-col md:flex-row items-center justify-between shadow-2xl border border-white/10">
      {/* Decorative radial glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10 max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
          <ShieldCheck className="w-3.5 h-3.5" />
          Verified Direct Sourcing & Traceability
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold font-serif mb-4 text-white tracking-tight leading-tight">
          The Universal Agriculture Market
        </h1>
        <p className="text-base md:text-lg text-white/70 mb-8 leading-relaxed">
          Source transparently from verified farms with high-fidelity coordinate tracking and sensor-monitored logs. Direct supply chains with premium-grade quality standards.
        </p>

        <div className="flex flex-wrap gap-4 md:gap-8">
          <div className="flex items-center gap-3">
            <div className="flex justify-center items-center w-12 h-12 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-md">
              <Package className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{products.length}</p>
              <p className="text-[10px] uppercase tracking-widest text-white/40">Total Crops</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex justify-center items-center w-12 h-12 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-md">
              <Shapes className="w-5 h-5 text-teal-450" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{marketplaceCategories.length}</p>
              <p className="text-[10px] uppercase tracking-widest text-white/40">Categories</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex justify-center items-center w-12 h-12 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-md">
              <Tags className="w-5 h-5 text-yellow-450" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{valueAddedCount}</p>
              <p className="text-[10px] uppercase tracking-widest text-white/40">Value-Added</p>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block relative z-10 w-72 h-72">
        {/* Floating botanical badge overlay */}
        <div className="absolute inset-0 bg-[#275d46]/20 border border-white/10 rounded-[2.5rem] backdrop-blur-xl shadow-2xl flex flex-col items-center justify-center p-6 text-center transform hover:rotate-2 transition-transform duration-500">
          <img src="/logo.png" alt="UniAgriQ Logo" className="h-16 w-auto object-contain rounded-xl mb-4 shadow-md" />
          <p className="text-lg font-bold text-white font-serif">UniAgriQ Secure Sourcing</p>
          <p className="text-xs text-white/50 mt-1 max-w-[200px]">Real-time temperature-monitored logistics & direct buyer protection</p>
          <div className="mt-4 flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            Sourcing Active
          </div>
        </div>
      </div>
    </section>
  )
}
