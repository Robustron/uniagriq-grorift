
import { ChevronDown, Filter, RotateCcw } from "lucide-react"
import { Checkbox } from "../../components/ui/checkbox"
import { Slider } from "../../components/ui/slider"
import { Button } from "../../components/ui/button"
import { cn } from "../../lib/utils"
import { type MarketplaceCategory } from "../../lib/marketplace-data"

type MarketplaceSidebarProps = {
  categories: MarketplaceCategory[]
  categoryCounts: Record<string, number>
  subcategoryCounts: Record<string, number>
  selectedCategories: string[]
  selectedSubcategories: string[]
  expandedCategories: string[]
  priceRange: [number, number]
  maxPrice: number
  inStockOnly: boolean
  organicOnly: boolean
  seasonalOnly: boolean
  valueAddedOnly: boolean
  activeFilterCount: number
  onCategoryChecked: (categoryName: string, checked: boolean) => void
  onSubcategoryChecked: (subcategory: string, checked: boolean) => void
  onExpandedToggle: (categoryId: string) => void
  onPriceRangeChange: (range: [number, number]) => void
  onInStockChange: (checked: boolean) => void
  onOrganicChange: (checked: boolean) => void
  onSeasonalChange: (checked: boolean) => void
  onValueAddedChange: (checked: boolean) => void
  onResetFilters: () => void
}

const currencyFormatter = new Intl.NumberFormat("en-IN")

export function MarketplaceSidebar({
  categories,
  categoryCounts,
  subcategoryCounts,
  selectedCategories,
  selectedSubcategories,
  expandedCategories,
  priceRange,
  maxPrice,
  inStockOnly,
  organicOnly,
  seasonalOnly,
  valueAddedOnly,
  activeFilterCount,
  onCategoryChecked,
  onSubcategoryChecked,
  onExpandedToggle,
  onPriceRangeChange,
  onInStockChange,
  onOrganicChange,
  onSeasonalChange,
  onValueAddedChange,
  onResetFilters,
}: MarketplaceSidebarProps) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-[#3B5236]/50 p-5 shadow-[0_16px_52px_rgba(0,0,0,0.3)] backdrop-blur-md lg:sticky lg:top-24 text-white">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300">
            <Filter className="h-3.5 w-3.5" />
            Filters
          </p>
          <h2 className="mt-3 text-xl font-bold font-serif text-white tracking-tight">
            Marketplace taxonomy
          </h2>
          <p className="mt-1 text-xs leading-5 text-white/60 font-medium">
            Filter by crop family, custom subcategories, or farm processing grade.
          </p>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onResetFilters}
          className="h-9 rounded-full px-3 text-emerald-400 hover:bg-white/10 font-bold"
        >
          <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
          Reset
        </Button>
      </div>

      <div className="mt-4 rounded-xl bg-white/5 px-4 py-2.5 text-xs font-bold text-emerald-300 flex items-center justify-between border border-white/5">
        <span>Active Constraints:</span>
        <span className="bg-[#569578] text-white px-2 py-0.5 rounded-full text-[10px]">{activeFilterCount}</span>
      </div>

      <div className="mt-5 space-y-3">
        {categories.map((category) => {
          const isExpanded = expandedCategories.includes(category.id)
          const isSelected = selectedCategories.includes(category.name)
          const totalForCategory = categoryCounts[category.name] ?? 0

          return (
            <div
              key={category.id}
              className={cn(
                "rounded-2xl border border-white/10 bg-[#3B5236]/30 p-4 transition-all duration-300 shadow-sm",
                isSelected && "border-[#569578] ring-1 ring-[#569578]/20 bg-[#3B5236]/50",
              )}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={(checked) =>
                    onCategoryChecked(category.name, checked === true)
                  }
                  className="mt-1 border-white/20 data-[state=checked]:border-[#569578] data-[state=checked]:bg-[#569578] text-white"
                  aria-label={`Filter ${category.name}`}
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-white">
                        {category.name}
                      </p>
                      <p className="mt-1 text-xs leading-4 text-white/50 font-medium">
                        {category.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                        {totalForCategory}
                      </span>
                      <button
                        type="button"
                        onClick={() => onExpandedToggle(category.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                        aria-label={
                          isExpanded
                            ? `Collapse ${category.name}`
                            : `Expand ${category.name}`
                        }
                      >
                        <ChevronDown
                          className={cn(
                            "h-3.5 w-3.5 transition-transform duration-300",
                            isExpanded && "rotate-180",
                          )}
                        />
                      </button>
                    </div>
                  </div>

                  {isExpanded ? (
                    <div className="mt-4 grid gap-2">
                      {category.subcategories.map((subcategory) => {
                        const count = subcategoryCounts[subcategory] ?? 0
                        const checked = selectedSubcategories.includes(subcategory)

                        return (
                          <label
                            key={subcategory}
                            className={cn(
                              "flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-xs transition-all hover:bg-white/10",
                              checked && "border-[#569578]/50 bg-[#569578]/10",
                              count === 0 && "opacity-60",
                            )}
                          >
                            <div className="flex min-w-0 items-center gap-2">
                              <Checkbox
                                checked={checked}
                                onCheckedChange={(value) =>
                                  onSubcategoryChecked(
                                    subcategory,
                                    value === true,
                                  )
                                }
                                className="border-white/20 data-[state=checked]:border-[#569578] data-[state=checked]:bg-[#569578] text-white"
                                aria-label={`Filter ${subcategory}`}
                              />
                              <span className="truncate font-semibold text-white/90">
                                {subcategory}
                              </span>
                            </div>
                            <span className="rounded-full bg-[#3B5236] border border-white/5 px-2 py-0.5 text-[9px] font-bold text-white/50">
                              {count}
                            </span>
                          </label>
                        )
                      })}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-[#3B5236]/30 p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-300/80">Price range</h3>
            <p className="mt-1 text-sm font-bold text-white">
              ₹{currencyFormatter.format(priceRange[0])} - ₹
              {currencyFormatter.format(priceRange[1])}
            </p>
          </div>
          <span className="rounded-full bg-white/5 border border-white/5 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
            Max ₹{currencyFormatter.format(maxPrice)}
          </span>
        </div>

        <Slider
          value={priceRange}
          min={0}
          max={maxPrice}
          step={5}
          onValueChange={(value) =>
            onPriceRangeChange([value[0] ?? 0, value[1] ?? maxPrice])
          }
          className="mt-5"
        />
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-[#3B5236]/30 p-4 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-300/80 mb-3">Refine results</h3>
        <div className="grid gap-2">
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-xs font-semibold text-white/90 hover:bg-white/10">
            <Checkbox
              checked={inStockOnly}
              onCheckedChange={(checked) => onInStockChange(checked === true)}
              className="border-white/20 data-[state=checked]:border-[#569578] data-[state=checked]:bg-[#569578]"
            />
            <span>In stock only</span>
          </label>
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-xs font-semibold text-white/90 hover:bg-white/10">
            <Checkbox
              checked={organicOnly}
              onCheckedChange={(checked) => onOrganicChange(checked === true)}
              className="border-white/20 data-[state=checked]:border-[#569578] data-[state=checked]:bg-[#569578]"
            />
            <span>Organic</span>
          </label>
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-xs font-semibold text-white/90 hover:bg-white/10">
            <Checkbox
              checked={seasonalOnly}
              onCheckedChange={(checked) => onSeasonalChange(checked === true)}
              className="border-white/20 data-[state=checked]:border-[#569578] data-[state=checked]:bg-[#569578]"
            />
            <span>Seasonal</span>
          </label>
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-xs font-semibold text-white/90 hover:bg-white/10">
            <Checkbox
              checked={valueAddedOnly}
              onCheckedChange={(checked) => onValueAddedChange(checked === true)}
              className="border-white/20 data-[state=checked]:border-[#569578] data-[state=checked]:bg-[#569578]"
            />
            <span>Value-added</span>
          </label>
        </div>
      </div>
    </div>
  )
}
