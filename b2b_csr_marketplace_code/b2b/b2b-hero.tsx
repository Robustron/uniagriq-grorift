"use client"

import { Building2, Users, TrendingUp } from "lucide-react"
import { useTranslations } from "@/lib/use-translations"

export function B2BHero() {
  const t = useTranslations("b2b")

  return (
    <section className="relative text-white py-16 md:py-24" style={{
      background: 'linear-gradient(135deg, #1d1d1f 0%, #275d46 100%)',
    }}>
      <div className="absolute inset-0 bg-[url('/abstract-network-connections-green.jpg')] opacity-10 bg-cover bg-center mix-blend-overlay" />

      <div className="relative max-w-7xl mx-auto px-4 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-6 text-balance text-white">{t("heroTitle")}</h1>
        <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto mb-10 text-pretty leading-relaxed">
          {t("heroBody")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-[#3B5236]/80 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-xl">
            <Building2 className="w-10 h-10 mx-auto mb-3 text-[#569578]" />
            <p className="text-2xl font-bold text-white">150+</p>
            <p className="text-white/60 text-sm">{t("partnersTitle")}</p>
          </div>
          <div className="bg-[#3B5236]/80 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-xl">
            <Users className="w-10 h-10 mx-auto mb-3 text-[#569578]" />
            <p className="text-2xl font-bold text-white">50,000+</p>
            <p className="text-white/60 text-sm">{t("farmersTitle")}</p>
          </div>
          <div className="bg-[#3B5236]/80 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-xl">
            <TrendingUp className="w-10 h-10 mx-auto mb-3 text-[#569578]" />
            <p className="text-2xl font-bold text-white">30%</p>
            <p className="text-white/60 text-sm">{t("savingsTitle")}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
