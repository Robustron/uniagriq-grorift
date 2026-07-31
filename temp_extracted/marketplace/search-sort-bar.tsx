"use client"

import { Search, X, Layers, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  marketplaceSortOptions,
  marketplaceCategories,
  type MarketplaceSortOption,
} from "@/lib/marketplace-data"
import { cn } from "@/lib/utils"

type SearchSortBarProps = {
  searchQuery: string
  onSearchChange: (value: string) => void
  sortBy: MarketplaceSortOption
  onSortChange: (value: MarketplaceSortOption) => void
  selectedCategories: string[]
  onCategoryToggle: (categoryName: string) => void
  inStockOnly: boolean
  onInStockChange: (value: boolean) => void
  organicOnly: boolean
  onOrganicChange: (value: boolean) => void
  filteredCount: number
  totalCount: number
  activeFilterCount: number
  onResetFilters: () => void
}

export function SearchSortBar({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  selectedCategories,
  onCategoryToggle,
  inStockOnly,
  onInStockChange,
  organicOnly,
  onOrganicChange,
  filteredCount,
  totalCount,
  activeFilterCount,
  onResetFilters,
}: SearchSortBarProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#0a2315]/40 shadow-[0_16px_52px_rgba(0,0,0,0.35)] backdrop-blur-md p-4 md:p-5 flex flex-col gap-4">
      {/* Search and Sort Row */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-350/60" />
            <Input
              type="search"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search by product name, category, farm origin, or active tags..."
              className="h-12 rounded-xl border-white/10 bg-[#071a0f]/40 pl-11 pr-12 text-sm text-white placeholder-white/30 focus-visible:ring-[#569578]/20"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        </div>

        <Select
          value={sortBy}
          onValueChange={(value) => onSortChange(value as MarketplaceSortOption)}
        >
          <SelectTrigger className="h-12 w-full rounded-xl border-white/10 bg-[#071a0f]/40 px-4 text-left text-sm font-semibold text-white shadow-none lg:w-[220px] focus:ring-[#569578]">
            <SelectValue placeholder="Sort products" />
          </SelectTrigger>
          <SelectContent className="border-white/10 bg-[#0a2315] text-white">
            {marketplaceSortOptions.map((option) => (
              <SelectItem key={option} value={option} className="hover:bg-white/10 cursor-pointer text-white">
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Categories Horizontal Selector Row */}
      <div className="py-1 flex flex-col gap-2 border-t border-white/5 pt-3">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-350 uppercase tracking-widest mb-1">
          <Layers className="h-3.5 w-3.5" />
          Category Filter
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onResetFilters()}
            className={cn(
              "px-4 py-1.5 rounded-xl border text-xs font-semibold tracking-wide transition-all",
              selectedCategories.length === 0
                ? "border-emerald-500 bg-emerald-500/20 text-white shadow-sm"
                : "border-white/5 bg-[#071a0f]/30 text-white/70 hover:bg-white/5 hover:text-white"
            )}
          >
            All Crops
          </button>
          {marketplaceCategories.map((category) => {
            const isSelected = selectedCategories.includes(category.name)
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => onCategoryToggle(category.name)}
                className={cn(
                  "px-4 py-1.5 rounded-xl border text-xs font-semibold tracking-wide transition-all",
                  isSelected
                    ? "border-emerald-500 bg-emerald-500/20 text-white shadow-sm"
                    : "border-white/5 bg-[#071a0f]/30 text-white/70 hover:bg-white/5 hover:text-white"
                )}
              >
                {category.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Constraints and Toggles Row */}
      <div className="mt-1 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5 text-xs md:text-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-white/5 border border-white/5 px-3.5 py-1.5 font-bold text-emerald-300">
            {filteredCount} of {totalCount} crops listed
          </span>
          <span className="rounded-full bg-white/5 border border-white/5 px-3.5 py-1.5 text-white/50 font-medium">
            Global index cross-matching enabled
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onInStockChange(!inStockOnly)}
            className={cn(
              "rounded-xl border px-3.5 py-1.5 font-bold transition-all text-xs",
              inStockOnly
                ? "border-emerald-500 bg-emerald-500/25 text-emerald-300"
                : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
            )}
          >
            In Stock Only
          </button>
          <button
            type="button"
            onClick={() => onOrganicChange(!organicOnly)}
            className={cn(
              "rounded-xl border px-3.5 py-1.5 font-bold transition-all text-xs",
              organicOnly
                ? "border-emerald-500 bg-emerald-500/25 text-emerald-300"
                : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
            )}
          >
            Organic Only
          </button>
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={onResetFilters}
              className="rounded-xl border border-red-500/20 bg-red-500/10 px-3.5 py-1.5 font-bold text-red-400 text-xs hover:bg-red-500/20 transition-all"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
