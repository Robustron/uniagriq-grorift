"use client"

import Link from "next/link"
import { ArrowLeft, Handshake } from "lucide-react"
import { useTranslations } from "@/lib/use-translations"

export function B2BHeader() {
  const t = useTranslations("b2b")

  return (
    <header className="sticky top-0 z-50 bg-black/25 backdrop-blur-md border-b border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors min-h-[44px]"
          aria-label={t("headerBack")}
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">{t("headerBack")}</span>
        </Link>

        <div className="flex items-center gap-2">
          <Handshake className="w-6 h-6 text-[#569578]" />
          <span className="text-xl font-bold text-white">{t("headerTitle")}</span>
        </div>

        <div className="w-[120px]" />
      </div>
    </header>
  )
}
