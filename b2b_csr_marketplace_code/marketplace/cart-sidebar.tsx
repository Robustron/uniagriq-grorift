"use client"

import { useState } from "react"
import Image from "next/image"
import { Minus, Plus, ShoppingCart, Trash2, ShieldAlert, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { type MarketplaceProduct } from "@/lib/marketplace-data"
import { cn } from "@/lib/utils"

type CartItem = {
  product: MarketplaceProduct
  quantity: number
}

type CartSidebarProps = {
  items: CartItem[]
  onIncrease: (productId: number) => void
  onDecrease: (productId: number) => void
  onRemove: (productId: number) => void
  onCheckout?: () => void
}

const priceFormatter = new Intl.NumberFormat("en-IN")

export function CartSidebar({
  items,
  onIncrease,
  onDecrease,
  onRemove,
  onCheckout,
}: CartSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  )
  const serviceFee = items.length === 0 ? 0 : subtotal >= 900 ? 0 : 80
  const total = subtotal + serviceFee
  const totalUnits = items.reduce((count, item) => count + item.quantity, 0)

  if (items.length === 0) return null

  return (
    <aside className="rounded-2xl border border-white/5 bg-[#0a2315]/50 p-4 shadow-[0_16px_52px_rgba(0,0,0,0.3)] backdrop-blur-md text-white transition-all duration-300 w-full">
      {/* Condensed Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-400/20 text-emerald-300">
            <ShoppingCart className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold font-serif text-white tracking-tight flex items-center gap-2">
              Procurement Basket
              <span className="rounded-full bg-[#569578] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-md">
                {totalUnits} Units Selected
              </span>
            </h2>
            <p className="text-[11px] text-white/50 font-medium">
              Buyer protection and trace logging active on selected farm lots
            </p>
          </div>
        </div>

        {/* Total Summary and expand button */}
        <div className="flex items-center justify-between sm:justify-end gap-4 border-t border-white/5 sm:border-0 pt-3 sm:pt-0">
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-emerald-300/80">Total Valuation</p>
            <p className="text-lg font-black text-emerald-300">₹{priceFormatter.format(total)}</p>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="h-10 rounded-xl px-3 border border-white/10 bg-white/5 hover:bg-white/10 text-white flex items-center gap-1.5 text-xs font-semibold"
            >
              {isOpen ? (
                <>
                  Collapse Basket <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  Review Items ({items.length}) <ChevronDown className="h-4 w-4" />
                </>
              )}
            </Button>

            <Button
              type="button"
              onClick={onCheckout}
              className="h-10 rounded-xl px-5 bg-[#569578] text-white hover:bg-[#569578]/80 font-extrabold text-xs shadow-lg transition-all active:scale-95"
            >
              Checkout & Procure
            </Button>
          </div>
        </div>
      </div>

      {/* Collapsible list details */}
      {isOpen && (
        <div className="mt-4 border-t border-white/5 pt-4 space-y-4 animate-fade-in">
          {/* Horizontal scroll grid of selected crops */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center gap-3 shrink-0 w-80 rounded-xl border border-white/10 bg-[#071a0f]/40 p-3 shadow-md hover:shadow-lg transition-shadow text-white relative group"
              >
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-black/20">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-white leading-tight">
                        {item.product.name}
                      </p>
                      <p className="mt-0.5 text-[9px] text-white/50 font-bold uppercase tracking-wider">
                        {item.product.farm}
                      </p>
                    </div>
                  </div>

                  <div className="mt-1.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1 rounded-full border border-white/5 bg-white/5 p-0.5">
                      <button
                        type="button"
                        onClick={() => onDecrease(item.product.id)}
                        className="flex h-5 w-5 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                        aria-label={`Decrease ${item.product.name}`}
                      >
                        <Minus className="h-2.5 w-2.5" />
                      </button>
                      <span className="min-w-4 text-center text-[10px] font-bold text-white">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onIncrease(item.product.id)}
                        className="flex h-5 w-5 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                        aria-label={`Increase ${item.product.name}`}
                      >
                        <Plus className="h-2.5 w-2.5" />
                      </button>
                    </div>

                    <p className="text-xs font-bold text-white">
                      ₹{priceFormatter.format(item.product.price * item.quantity)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onRemove(item.product.id)}
                  className="absolute top-2 right-2 text-white/20 transition-colors hover:text-red-400 p-1 rounded-md bg-[#3B5236]/40"
                  aria-label={`Remove ${item.product.name}`}
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Pricing detail breakdown */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-white/5 rounded-xl text-xs font-semibold text-white/50 border border-white/5">
            <div className="flex items-center gap-4">
              <span>Subtotal: <strong className="text-white">₹{priceFormatter.format(subtotal)}</strong></span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
              <span>Service Fee: <strong className="text-white">{serviceFee === 0 ? "Free" : `₹${priceFormatter.format(serviceFee)}`}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-white/50 font-bold uppercase tracking-wider">
              <ShieldAlert className="h-3.5 w-3.5 text-emerald-400" />
              Buyer guarantee contract active
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
