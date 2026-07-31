"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, ShoppingCart, Star, ShieldCheck, RefreshCw, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { type MarketplaceProduct } from "@/lib/marketplace-data"

type ProductGridProps = {
  products: MarketplaceProduct[]
  cartQuantities: Record<number, number>
  onAddToCart: (productId: number) => void
  onResetFilters: () => void
}

const priceFormatter = new Intl.NumberFormat("en-IN")

// Premium Botanical Card Category Badges
const categoryChipClass: Record<string, string> = {
  "Grains, Rice & Pulses": "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
  Fruits: "border-yellow-500/20 bg-yellow-500/10 text-yellow-300",
  Vegetables: "border-teal-500/20 bg-teal-500/10 text-teal-300",
  "Nuts & Seeds": "border-amber-500/20 bg-amber-500/10 text-amber-300",
  "Value-Added Products": "border-purple-500/20 bg-purple-500/10 text-purple-300",
}

// Single Product Card with 3D Flip (Compact & Squarish)
function ProductCard({
  product,
  cartQty,
  onAddToCart,
}: {
  product: MarketplaceProduct
  cartQty: number
  onAddToCart: (productId: number) => void
}) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isWished, setIsWished] = useState(false)
  const [backTab, setBackTab] = useState<"nutrition" | "sourcing">("nutrition")

  // Simulated unique trace data based on ID
  const traceId = `UNI-TRACE-${102384 + product.id}`

  const howBuilt = {
    "Grains, Rice & Pulses": "Sun-dried natural grains, organically fertilized, stoneground trace logged for transparency.",
    Fruits: "Direct orchard harvest, pesticide-free, cold-chain routed with immediate temperature tracing.",
    Vegetables: "Hydroponically grown with nutrient-dense solution, solar power harvested, 100% soil-free.",
    "Nuts & Seeds": "Rich soil cultivation, handpicked pods, traditional solar dehydration, natural grade sorting.",
    "Value-Added Products": "Hand-made in micro-batches, zero chemical preservatives, naturally fermented & aged.",
  }[product.category] || "Pure organic cultivation, no synthetic additives, fully traceably logged."

  return (
    <div className="perspective-1000 w-full h-[420px]">
      <div
        className={cn(
          "relative w-full h-full duration-700 preserve-3d transition-transform",
          isFlipped ? "rotate-y-180" : ""
        )}
      >
        {/* ================= FRONT SIDE ================= */}
        <article className="absolute inset-0 backface-hidden overflow-hidden rounded-2xl border border-white/5 bg-[#0f2d1c]/45 p-4 shadow-xl backdrop-blur-md flex flex-col justify-between text-white hover:border-emerald-500/20 transition-all duration-300">
          
          {/* Card Image Area (Squarish & Centered) */}
          <div className="relative aspect-square h-[200px] w-full shrink-0 overflow-hidden rounded-xl bg-black/30">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(min-width: 1536px) 20vw, (min-width: 768px) 30vw, 100vw"
              className={cn(
                "object-cover transition-transform duration-500 hover:scale-105",
                !product.inStock && "opacity-60"
              )}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#040e09]/80 via-transparent to-transparent" />

            {/* Badges Overlay */}
            <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1 max-w-[85%]">
              <span className={cn("rounded-md border px-2 py-0.5 text-[9px] font-bold shadow-md uppercase tracking-wider", categoryChipClass[product.category])}>
                {product.category}
              </span>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setIsWished(!isWished)
              }}
              className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-black/40 text-white/70 shadow-lg backdrop-blur-md transition-all hover:scale-110 hover:text-red-400"
            >
              <Heart className={cn("h-3.5 w-3.5", isWished && "fill-red-500 text-red-500")} />
            </button>

            {!product.inStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[1px]">
                <span className="rounded-lg bg-[#071a0f] border border-red-500/20 px-3 py-1 text-[10px] font-bold text-red-400 shadow-xl uppercase tracking-widest">
                  Out of stock
                </span>
              </div>
            )}
          </div>

          {/* Details Area */}
          <div className="flex-1 mt-3 flex flex-col justify-between min-h-0">
            <div className="cursor-pointer min-w-0" onClick={() => setIsFlipped(true)}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-450/80 mb-0.5 truncate">
                    {product.farm}
                  </p>
                  <h3 className="text-sm font-bold leading-tight tracking-tight text-white hover:text-emerald-300 transition-colors truncate">
                    {product.name}
                  </h3>
                </div>
                {cartQty > 0 && (
                  <span className="rounded-full bg-emerald-500 text-white text-[8px] font-black px-1.5 py-0.5 shrink-0">
                    +{cartQty}
                  </span>
                )}
              </div>

              <div className="mt-1.5 flex items-center gap-1.5 text-[10px]">
                <div className="flex items-center gap-0.5 text-yellow-400">
                  <Star className="h-3 w-3 fill-current" />
                  <span className="font-bold text-white ml-0.5">{product.rating.toFixed(1)}</span>
                </div>
                <span className="text-white/20">|</span>
                <span className="text-white/40 truncate">({product.reviews} audits)</span>
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="mt-2.5 pt-2.5 border-t border-white/5 flex items-center justify-between gap-2">
              <div>
                <p className="text-base font-black text-[#fef3c7] leading-none">
                  ₹{priceFormatter.format(product.price)}
                </p>
                <p className="text-[8px] text-white/40 font-bold uppercase tracking-wider mt-0.5">per {product.unit}</p>
              </div>

              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  onClick={() => setIsFlipped(true)}
                  className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-emerald-400 flex items-center justify-center p-0"
                  title="View Nutritional Profile & Origin"
                >
                  <ShieldCheck className="h-4.5 w-4.5" />
                </Button>

                <Button
                  type="button"
                  onClick={() => onAddToCart(product.id)}
                  disabled={!product.inStock}
                  className={cn(
                    "h-8 rounded-lg px-3 text-[10px] font-extrabold shadow-md transition-all uppercase tracking-wider",
                    product.inStock
                      ? "bg-[#569578] text-white hover:bg-[#569578]/80 active:scale-95"
                      : "bg-white/5 text-white/30 border border-white/5"
                  )}
                >
                  {cartQty > 0 ? `In Cart` : "Add"}
                </Button>
              </div>
            </div>
          </div>
        </article>

        {/* ================= BACK SIDE (NUTRITIONAL PROFILE & ORIGIN) ================= */}
        <article className="absolute inset-0 backface-hidden rotate-y-180 overflow-hidden rounded-2xl border border-emerald-500/20 bg-[#071a0f] p-4 text-white flex flex-col justify-between shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="min-h-0 overflow-y-auto pr-1 scrollbar-thin flex-1">
            {/* Header Identity Row */}
            <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-450 animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-wider text-emerald-450">Crop Intelligence</span>
              </div>
              <span className="text-[8px] font-mono text-white/40">{traceId}</span>
            </div>

            {/* Crop name & Farm */}
            <div className="mt-2.5">
              <p className="text-[8px] font-bold uppercase tracking-widest text-emerald-450/80 mb-0.5">{product.farm}</p>
              <h4 className="text-sm font-extrabold text-white leading-tight mb-1 truncate">{product.name}</h4>
              
              {/* Dynamic Badges Row */}
              <div className="flex flex-wrap gap-1 mt-1.5">
                <span className={cn(
                  "rounded px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wide border",
                  product.organic 
                    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300" 
                    : "border-white/10 bg-white/5 text-white/40"
                )}>
                  {product.organic ? "100% Organic" : "Natural Cultivation"}
                </span>
                {product.seasonal && (
                  <span className="rounded border border-amber-500/20 bg-amber-500/10 text-amber-300 px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wide">
                    Seasonal Pick
                  </span>
                )}
                {product.badge && (
                  <span className="rounded border border-purple-500/20 bg-purple-500/10 text-purple-300 px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wide">
                    {product.badge}
                  </span>
                )}
              </div>
            </div>

            {/* Back Tabs Selector */}
            <div className="flex border-b border-white/10 my-3 text-[9px] shrink-0">
              <button
                type="button"
                onClick={() => setBackTab("nutrition")}
                className={cn(
                  "flex-1 pb-1.5 font-bold uppercase tracking-wider border-b-2 transition-all",
                  backTab === "nutrition" 
                    ? "border-emerald-400 text-emerald-350" 
                    : "border-transparent text-white/40 hover:text-white/70"
                )}
              >
                Nutrition
              </button>
              <button
                type="button"
                onClick={() => setBackTab("sourcing")}
                className={cn(
                  "flex-1 pb-1.5 font-bold uppercase tracking-wider border-b-2 transition-all",
                  backTab === "sourcing" 
                    ? "border-emerald-400 text-emerald-350" 
                    : "border-transparent text-white/40 hover:text-white/70"
                )}
              >
                Trace Info
              </button>
            </div>

            {/* Content Area */}
            {backTab === "nutrition" ? (
              <div className="space-y-3.5 mt-2.5">
                {/* Stats Grid - Per 100g */}
                <div>
                  <span className="text-[8px] uppercase tracking-widest text-[#569578] font-black block mb-1">Nutritional Value (Per 100g)</span>
                  <div className="grid grid-cols-3 gap-1.5 bg-emerald-950/20 border border-emerald-500/5 p-2 rounded-xl">
                    {product.nutrientsPer100g && Object.entries(product.nutrientsPer100g).map(([name, val]) => (
                      <div key={name} className="flex flex-col items-center text-center p-1 rounded bg-black/25">
                        <span className="text-[7.5px] uppercase tracking-wider text-emerald-450/75 font-semibold truncate w-full">{name}</span>
                        <span className="text-[10px] font-black text-amber-100 mt-0.5">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Vitamins and Minerals */}
                {product.vitaminsMinerals && product.vitaminsMinerals.length > 0 && (
                  <div>
                    <span className="text-[8px] uppercase tracking-widest text-[#569578] font-black block mb-1">Vitamins & Minerals</span>
                    <div className="flex flex-wrap gap-1">
                      {product.vitaminsMinerals.map((item) => (
                        <span key={item} className="px-1.5 py-0.5 text-[8px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-md">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Benefits */}
                <div>
                  <span className="text-[8px] uppercase tracking-widest text-[#569578] font-black block mb-1">Benefits of Consumption</span>
                  <ul className="space-y-1.5 text-[9.5px] text-white/80">
                    {product.benefits && product.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="text-emerald-400 shrink-0 font-extrabold text-[10px] leading-tight">✓</span>
                        <span className="leading-tight">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Disadvantages */}
                <div>
                  <span className="text-[8px] uppercase tracking-widest text-amber-500/80 font-black block mb-1">Disadvantages / Warnings</span>
                  <ul className="space-y-1.5 text-[9.5px] text-white/80">
                    {product.disadvantages && product.disadvantages.map((disadvantage, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="text-amber-500 shrink-0 font-extrabold text-[10px] leading-tight">⚠</span>
                        <span className="leading-tight text-white/70">{disadvantage}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-3.5 mt-2.5">
                {/* Cultivation */}
                <div>
                  <p className="text-[8px] font-black uppercase tracking-widest text-[#569578]">Cultivation Protocol</p>
                  <p className="mt-0.5 text-[10px] text-white/80 leading-relaxed font-medium">
                    {howBuilt}
                  </p>
                </div>

                {/* Dynamic Quality Tags */}
                {product.tags && product.tags.length > 0 && (
                  <div>
                    <p className="text-[8px] font-black uppercase tracking-widest text-[#569578] mb-1">Trace Audit Marks</p>
                    <div className="flex flex-wrap gap-1">
                      {product.tags.map((tag) => (
                        <span key={tag} className="rounded border border-[#569578]/25 bg-[#569578]/5 px-1.5 py-0.5 text-[8px] font-semibold text-emerald-300 tracking-wide lowercase">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Escrow Sourcing Accent Box */}
                <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/10 p-2">
                  <p className="text-[8px] font-extrabold uppercase tracking-wider text-emerald-450 leading-none">Safe Sourcing Protocol</p>
                  <p className="mt-1 text-[8.5px] text-white/45 leading-relaxed font-medium">
                    Assured direct-from-farm escrow dispatch, verified moisture index logs, and broker-free quality auditing.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Flip Return Button */}
          <Button
            type="button"
            onClick={() => setIsFlipped(false)}
            className="w-full h-8 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white text-[10px] font-bold flex items-center justify-center gap-1.5 mt-2.5 shrink-0"
          >
            <RefreshCw className="h-3 w-3" />
            Return to Crop Info
          </Button>
        </article>
      </div>
    </div>
  )
}

export function ProductGrid({
  products,
  cartQuantities,
  onAddToCart,
  onResetFilters,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-[#569578]/35 bg-[#071a0f]/40 px-6 py-16 text-center shadow-lg backdrop-blur-md text-white">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-450">
          No matching products
        </p>
        <h2 className="mt-3 text-xl font-bold text-white font-serif">
          Try adjusting query or resetting active filters.
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-xs leading-relaxed text-white/50 font-medium">
          Global secure search indexes crop names, categories, origin farms, and verified tracking badges.
        </p>
        <Button
          type="button"
          onClick={onResetFilters}
          className="mt-5 h-10 rounded-xl bg-[#569578] hover:bg-[#569578]/80 text-white font-bold px-6 shadow-md text-xs"
        >
          Reset filters
        </Button>
      </section>
    )
  }

  return (
    <section aria-labelledby="marketplace-products-heading" className="w-full text-white">
      <div className="mb-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-450/80">
          Verified Sourcing Grid
        </p>
        <h2
          id="marketplace-products-heading"
          className="mt-0.5 text-xl font-bold font-serif tracking-tight text-white"
        >
          Direct Verified Crop Selection
        </h2>
      </div>

      {/* Clean 4-Column Grid layout without sidebars */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => {
          const qty = cartQuantities[product.id] ?? 0
          return (
            <ProductCard
              key={product.id}
              product={product}
              cartQty={qty}
              onAddToCart={onAddToCart}
            />
          )
        })}
      </div>
    </section>
  )
}
