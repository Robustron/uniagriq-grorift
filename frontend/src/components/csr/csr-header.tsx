import { Link } from "react-router-dom"
import { ArrowLeft, Heart } from "lucide-react"

export function CsrHeader() {
  return (
    <header className="sticky top-0 z-50 bg-black/25 backdrop-blur-md border-b border-white/10 text-white">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors min-h-[44px]"
          aria-label="Back to home"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Home</span>
        </Link>

        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-[#569578]" />
          <span className="text-xl font-bold text-white font-sans">CSR Activities</span>
        </div>

        <div className="w-[120px]" aria-hidden="true" />
      </div>
    </header>
  )
}
