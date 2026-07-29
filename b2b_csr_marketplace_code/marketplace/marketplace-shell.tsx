"use client"

import Link from "next/link"
import { useDeferredValue, useState, useEffect } from "react"
import { ArrowLeft, X, ShieldCheck, Loader2, Sparkles, Navigation, Printer } from "lucide-react"
import { MarketplaceHeader } from "@/components/marketplace/marketplace-header"
import { SearchSortBar } from "@/components/marketplace/search-sort-bar"
import { ProductGrid } from "@/components/marketplace/product-grid"
import { CartSidebar } from "@/components/marketplace/cart-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  marketplaceCategories,
  marketplaceProducts,
  type MarketplaceSortOption,
  type MarketplaceProduct,
} from "@/lib/marketplace-data"
import {
  CustomerDashboardModal,
  type CustomerUser,
  type CustomerOrder
} from "@/components/marketplace/customer-dashboard-modal"

const maxPriceStatic = Math.max(...marketplaceProducts.map((product) => product.price))

const priceFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
})

type CartEntry = {
  productId: number
  quantity: number
}

export function MarketplaceShell() {
  // Sync products list from localStorage to capture dynamic farmer additions
  const [productsList, setProductsList] = useState<MarketplaceProduct[]>(marketplaceProducts)
  
  const loadProducts = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("custom_marketplace_products")
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          const approvedProducts = parsed.filter((p: any) => p.status !== "pending" && p.status !== "rejected")
          setProductsList([...marketplaceProducts, ...approvedProducts])
        } catch (e) {
          console.error("Failed to parse custom products:", e)
        }
      } else {
        setProductsList(marketplaceProducts)
      }
    }
  }

  useEffect(() => {
    loadProducts()
    
    // Listen for storage changes (from other tabs/windows or farmer dashboard)
    const handleStorageChange = () => {
      loadProducts()
    }
    
    // Listen to custom event from farmer dashboard
    const handleProductAdded = () => {
      loadProducts()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("product_added_to_marketplace", handleProductAdded)
    
    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("product_added_to_marketplace", handleProductAdded)
    }
  }, [])

  const maxPrice = Math.max(...productsList.map((p) => p.price), maxPriceStatic)

  const [searchQuery, setSearchQuery] = useState("")
  const deferredSearchQuery = useDeferredValue(searchQuery)
  const [sortBy, setSortBy] = useState<MarketplaceSortOption>("Popular")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice])
  const [inStockOnly, setInStockOnly] = useState(false)
  const [organicOnly, setOrganicOnly] = useState(false)
  const [cart, setCart] = useState<CartEntry[]>([])

  // Customer state & persistent session hook
  const [currentCustomer, setCurrentCustomer] = useState<CustomerUser | null>(null)
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false)
  const [customerModalTab, setCustomerModalTab] = useState<"auth" | "profile" | "history" | "help">("auth")
  const [checkoutTriggered, setCheckoutTriggered] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCustomer = localStorage.getItem("uniagric_current_customer")
      if (savedCustomer) {
        try {
          setCurrentCustomer(JSON.parse(savedCustomer))
        } catch (e) {
          console.error("Failed to parse saved customer session:", e)
        }
      }
    }
  }, [])

  const handleLoginSuccess = (user: CustomerUser) => {
    setCurrentCustomer(user)
    if (typeof window !== "undefined") {
      localStorage.setItem("uniagric_current_customer", JSON.stringify(user))
    }
    // If login is triggered from checkout, proceed to checkout automatically
    if (checkoutTriggered) {
      setCheckoutTriggered(false)
      // Prefill checkout details
      setCheckoutData({
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        zipCode: user.zipCode,
        paymentMethod: "escrow",
      })
      setCheckoutStep(1)
      setIsCheckoutOpen(true)
    }
  }

  const handleLogout = () => {
    setCurrentCustomer(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("uniagric_current_customer")
    }
  }

  // Modal checkout state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState<1 | 2 | 3>(1)
  const [checkoutData, setCheckoutData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    zipCode: "",
    paymentMethod: "escrow",
  })
  const [simulationText, setSimulationText] = useState("")
  const [simProgress, setSimProgress] = useState(0)

  const normalizedSearch = deferredSearchQuery.trim().toLowerCase()

  const searchScopedProducts = productsList.filter((product) => {
    if (!normalizedSearch) {
      return true
    }

    const searchIndex = [
      product.name,
      product.category,
      product.subcategory,
      product.farm,
      product.badge,
      ...(product.tags ?? []),
    ]
      .join(" ")
      .toLowerCase()

    return searchIndex.includes(normalizedSearch)
  })

  const filterScopedProducts = searchScopedProducts.filter((product) => {
    const withinPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1]

    if (!withinPrice) {
      return false
    }

    if (inStockOnly && !product.inStock) {
      return false
    }

    if (organicOnly && !product.organic) {
      return false
    }

    return true
  })

  const filteredProducts = [...filterScopedProducts]
    .filter((product) => {
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(product.category)
      ) {
        return false
      }
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "Price Low to High":
          return a.price - b.price
        case "Price High to Low":
          return b.price - a.price
        case "Rating":
          return b.rating - a.rating
        case "New Arrivals":
          return new Date(b.listedAt).getTime() - new Date(a.listedAt).getTime()
        default:
          return 0
      }
    })

  const handleCategoryToggle = (categoryName: string) => {
    if (selectedCategories.includes(categoryName)) {
      setSelectedCategories((prev) => prev.filter((name) => name !== categoryName))
    } else {
      setSelectedCategories((prev) => [...prev, categoryName])
    }
  }

  const handleResetFilters = () => {
    setSelectedCategories([])
    setPriceRange([0, maxPrice])
    setInStockOnly(false)
    setOrganicOnly(false)
  }

  const activeFilterCount =
    selectedCategories.length +
    (priceRange[0] > 0 || priceRange[1] < maxPrice ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (organicOnly ? 1 : 0)

  // CART HANDLERS
  const handleAddToCart = (productId: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId)
      if (existing) {
        return prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      }
      return [...prev, { productId, quantity: 1 }]
    })
  }

  const handleIncrease = (productId: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    )
  }

  const handleDecrease = (productId: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId) {
            return { ...item, quantity: item.quantity - 1 }
          }
          return item
        })
        .filter((item) => item.quantity > 0),
    )
  }

  const handleRemove = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId))
  }

  const cartItems = cart
    .map((entry) => {
      const product = productsList.find((p) => p.id === entry.productId)
      return product ? { product, quantity: entry.quantity } : null
    })
    .filter(Boolean) as Array<{ product: MarketplaceProduct; quantity: number }>

  const cartQuantities = Object.fromEntries(
    cart.map((entry) => [entry.productId, entry.quantity]),
  )

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  )
  const serviceFee = cartItems.length === 0 ? 0 : subtotal >= 900 ? 0 : 80
  const totalValuation = subtotal + serviceFee

  // Enforce customer account login to perform checkout
  const handleCheckoutClick = () => {
    if (!currentCustomer) {
      setCheckoutTriggered(true)
      setCustomerModalTab("auth")
      setIsCustomerModalOpen(true)
    } else {
      setCheckoutTriggered(false)
      setCheckoutData({
        fullName: currentCustomer.fullName,
        email: currentCustomer.email,
        phone: currentCustomer.phone,
        address: currentCustomer.address,
        zipCode: currentCustomer.zipCode,
        paymentMethod: "escrow",
      })
      setCheckoutStep(1)
      setIsCheckoutOpen(true)
    }
  }

  // Appends confirmed orders into the user buying history
  const addOrderToHistory = () => {
    if (!currentCustomer) return

    const newOrder: CustomerOrder = {
      id: `UNI-ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString().split("T")[0],
      items: cartItems.map(item => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        unit: item.product.unit
      })),
      subtotal: subtotal,
      serviceFee: serviceFee,
      total: totalValuation,
      status: "Processing",
      transitStep: "Direct dispatch initialized. Sensory logging active.",
      temperature: "Sensor Temp: 4.8°C (Stable)"
    }

    const updatedHistory = [newOrder, ...currentCustomer.orderHistory]
    const updatedUser = {
      ...currentCustomer,
      orderHistory: updatedHistory
    }

    // Refresh active session state and localStorage
    setCurrentCustomer(updatedUser)
    if (typeof window !== "undefined") {
      localStorage.setItem("uniagric_current_customer", JSON.stringify(updatedUser))
    }

    // Update persistent customer collection DB
    const stored = localStorage.getItem("uniagric_customers_db")
    if (stored) {
      try {
        const parsed: CustomerUser[] = JSON.parse(stored)
        const updatedList = parsed.map(c => {
          if (c.email.toLowerCase() === currentCustomer.email.toLowerCase()) {
            return updatedUser
          }
          return c
        })
        localStorage.setItem("uniagric_customers_db", JSON.stringify(updatedList))
      } catch (e) {
        console.error("Failed to commit order history to DB:", e)
      }
    }
  }

  const startPurchaseSimulation = () => {
    setCheckoutStep(2)
    setSimProgress(0)
    setSimulationText("Verifying secure payment channels...")

    const steps = [
      { progress: 15, text: "Verifying secure payment channels..." },
      { progress: 35, text: "Holding funds in audited escrow account..." },
      { progress: 60, text: "Verifying farm coordinate sensor nodes..." },
      { progress: 85, text: "Locking premium supply chain contracts..." },
      { progress: 100, text: "Secured purchase authorized!" },
    ]

    steps.forEach((step, index) => {
      setTimeout(() => {
        setSimProgress(step.progress)
        setSimulationText(step.text)
        if (step.progress === 100) {
          // Write verified transaction directly to order history
          addOrderToHistory()
          setTimeout(() => {
            setCheckoutStep(3)
          }, 600)
        }
      }, (index + 1) * 850)
    })
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0b2416] via-[#071a10] to-[#040e09] text-white font-sans pb-16 relative overflow-x-hidden">
      {/* Immersive ambient botanical lighting */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-[1500px] px-4 py-6 md:px-6 md:py-8 relative z-10">
        
        {/* Navigation & Sourcing Customer Authentication Top Bar */}
        <div className="mb-6 flex justify-between items-center w-full">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-bold text-white shadow-lg backdrop-blur-md transition-all hover:bg-white/10 hover:scale-105"
          >
            <ArrowLeft className="h-4 w-4 text-emerald-400" />
            Back to Home
          </Link>

          {currentCustomer ? (
            <button
              onClick={() => {
                setCustomerModalTab("profile")
                setIsCustomerModalOpen(true)
              }}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-5 py-2 text-sm font-bold text-emerald-300 shadow-lg backdrop-blur-md transition-all hover:bg-emerald-500/20 hover:scale-105"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              👤 {currentCustomer.fullName} (Account)
            </button>
          ) : (
            <button
              onClick={() => {
                setCustomerModalTab("auth")
                setIsCustomerModalOpen(true)
              }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-bold text-white/90 shadow-lg backdrop-blur-md transition-all hover:bg-white/10 hover:scale-105"
            >
              👤 Customer Login
            </button>
          )}
        </div>

        <MarketplaceHeader products={productsList} />

        <div className="mt-6 flex flex-col gap-5">
          <SearchSortBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            selectedCategories={selectedCategories}
            onCategoryToggle={handleCategoryToggle}
            inStockOnly={inStockOnly}
            onInStockChange={setInStockOnly}
            organicOnly={organicOnly}
            onOrganicChange={setOrganicOnly}
            filteredCount={filteredProducts.length}
            totalCount={productsList.length}
            activeFilterCount={activeFilterCount}
            onResetFilters={handleResetFilters}
          />

          {/* Sticky upward-facing horizontal Cart Overview */}
          <CartSidebar
            items={cartItems}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
            onRemove={handleRemove}
            onCheckout={handleCheckoutClick}
          />

          {/* 100% Full Width Product Grid */}
          <div className="mt-2">
            <ProductGrid
              products={filteredProducts}
              cartQuantities={cartQuantities}
              onAddToCart={handleAddToCart}
              onResetFilters={handleResetFilters}
            />
          </div>
        </div>
      </div>

      {/* ================= CUSTOMER PORTAL MODAL ================= */}
      <CustomerDashboardModal
        isOpen={isCustomerModalOpen}
        onClose={() => {
          setIsCustomerModalOpen(false)
          setCheckoutTriggered(false)
        }}
        onLoginSuccess={handleLoginSuccess}
        initialTab={customerModalTab}
        currentCustomer={currentCustomer}
        onLogout={handleLogout}
        cartSubtotal={subtotal}
        checkoutTriggered={checkoutTriggered}
      />

      {/* ================= DIRECT ESCROW SOURCING MODAL ================= */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fade-in">
          <div className="relative w-full max-w-2xl bg-[#071a0f] border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden text-white">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-emerald-450" />
                <span className="font-bold font-serif text-lg">Direct Escrow Sourcing Wizard</span>
              </div>
              {checkoutStep !== 2 && (
                <button
                  onClick={() => {
                    setIsCheckoutOpen(false)
                    setCheckoutStep(1)
                  }}
                  className="p-1 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              )}
            </div>

            {/* Modal Body */}
            <div className="p-8">
              
              {/* STEP 1: Details and Verification */}
              {checkoutStep === 1 && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    startPurchaseSimulation()
                  }}
                  className="space-y-5"
                >
                  <h3 className="text-xl font-bold font-serif">Customer Sourcing Registration</h3>
                  <p className="text-xs text-white/60 font-medium">
                    Provide verified receiving details. Secure logistics agreements protect buyer payouts.
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="fullName" className="text-xs font-bold text-emerald-300/80 uppercase tracking-wider">Receiver Full Name *</Label>
                      <Input
                        id="fullName"
                        required
                        value={checkoutData.fullName}
                        onChange={(e) => setCheckoutData({ ...checkoutData, fullName: e.target.value })}
                        placeholder="John Doe"
                        className="rounded-xl border-white/15 bg-white/5 text-white placeholder-emerald-100/30 focus-visible:ring-[#569578]"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="email" className="text-xs font-bold text-emerald-300/80 uppercase tracking-wider">Verification Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={checkoutData.email}
                        onChange={(e) => setCheckoutData({ ...checkoutData, email: e.target.value })}
                        placeholder="john@company.com"
                        className="rounded-xl border-white/15 bg-white/5 text-white placeholder-emerald-100/30 focus-visible:ring-[#569578]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="phone" className="text-xs font-bold text-emerald-300/80 uppercase tracking-wider">Contact Number *</Label>
                      <Input
                        id="phone"
                        required
                        value={checkoutData.phone}
                        onChange={(e) => setCheckoutData({ ...checkoutData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="rounded-xl border-white/15 bg-white/5 text-white placeholder-emerald-100/30 focus-visible:ring-[#569578]"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="zipCode" className="text-xs font-bold text-emerald-300/80 uppercase tracking-wider">Postal / PIN Code *</Label>
                      <Input
                        id="zipCode"
                        required
                        value={checkoutData.zipCode}
                        onChange={(e) => setCheckoutData({ ...checkoutData, zipCode: e.target.value })}
                        placeholder="422001"
                        className="rounded-xl border-white/15 bg-white/5 text-white placeholder-emerald-100/30 focus-visible:ring-[#569578]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="address" className="text-xs font-bold text-emerald-300/80 uppercase tracking-wider">Shipping & Delivery Address *</Label>
                    <Input
                      id="address"
                      required
                      value={checkoutData.address}
                      onChange={(e) => setCheckoutData({ ...checkoutData, address: e.target.value })}
                      placeholder="Street, Business Park, Building, Suite number"
                      className="rounded-xl border-white/15 bg-white/5 text-white placeholder-emerald-100/30 focus-visible:ring-[#569578]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-emerald-300/80 uppercase tracking-wider">Secure Payment Protocol</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setCheckoutData({ ...checkoutData, paymentMethod: "escrow" })}
                        className={`flex items-center justify-center p-3 rounded-xl border text-xs font-bold transition-all ${
                          checkoutData.paymentMethod === "escrow"
                            ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                            : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                        }`}
                      >
                        Secure Escrow Holding
                      </button>
                      <button
                        type="button"
                        onClick={() => setCheckoutData({ ...checkoutData, paymentMethod: "direct" })}
                        className={`flex items-center justify-center p-3 rounded-xl border text-xs font-bold transition-all ${
                          checkoutData.paymentMethod === "direct"
                            ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                            : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                        }`}
                      >
                        Direct Secure Bank Transfer
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex justify-between items-center text-sm font-bold">
                    <span className="text-white/50">Total Escrow Amount:</span>
                    <span className="text-emerald-300 text-lg">₹{priceFormatter.format(totalValuation)}</span>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-[#569578] hover:bg-[#569578]/80 text-white rounded-xl font-extrabold text-sm shadow-md transition-all active:scale-95"
                  >
                    Simulate Secure Escrow Payment
                  </Button>
                </form>
              )}

              {/* STEP 2: Tracing & Payment Processing Loader */}
              {checkoutStep === 2 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="relative mb-6">
                    <Loader2 className="h-16 w-16 text-emerald-450 animate-spin" />
                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-emerald-300 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold font-serif">Secure Escrow Payment Verification</h3>
                  <div className="w-full max-w-sm bg-white/5 rounded-full h-2 mt-4 overflow-hidden">
                    <div
                      className="bg-[#569578] h-full transition-all duration-500"
                      style={{ width: `${simProgress}%` }}
                    />
                  </div>
                  <p className="mt-5 text-sm font-mono text-emerald-300/80 h-8">
                    {simulationText}
                  </p>
                </div>
              )}

              {/* STEP 3: Secured Sourcing Receipt */}
              {checkoutStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center py-3 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl">
                    <div className="w-12 h-12 rounded-full bg-[#569578] text-white flex items-center justify-center mx-auto mb-2 shadow-md">
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold font-serif text-emerald-300">Sourcing Purchase Fully Confirmed</h3>
                    <p className="text-xs text-emerald-450 font-bold uppercase tracking-wider mt-1">Secure origin trace index logged</p>
                  </div>

                  <div className="border border-white/10 rounded-2xl p-5 bg-white/5 space-y-4">
                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-emerald-300/80 pb-2.5 border-b border-white/10">
                      <span>Verification Audit Report</span>
                      <span className="font-mono text-white">TRACE BATCH INDEX: #17384</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs font-medium">
                      <div>
                        <p className="text-white/50 uppercase tracking-wider">Secure Transaction Reference</p>
                        <p className="mt-0.5 text-[11px] font-mono text-emerald-300 font-bold truncate">TXN-5839281-A2</p>
                      </div>
                      <div>
                        <p className="text-white/50 uppercase tracking-wider">Traceability Index ID</p>
                        <p className="mt-0.5 text-[11px] font-mono text-emerald-250 font-bold">TRACE-ID: 0x93FD (Active)</p>
                      </div>
                    </div>

                    <div className="text-xs font-medium border-t border-white/10 pt-3">
                      <p className="text-white/50 uppercase tracking-wider">Receiver Details</p>
                      <p className="mt-1 text-white font-bold">{checkoutData.fullName} ({checkoutData.phone})</p>
                      <p className="text-white/60 mt-0.5">{checkoutData.address}, PIN: {checkoutData.zipCode}</p>
                    </div>

                    <div className="border-t border-white/10 pt-3 space-y-2">
                      <p className="text-xs font-bold text-emerald-300/80 uppercase tracking-wider">Procured Crops Invoice</p>
                      {cartItems.map((item) => (
                        <div key={item.product.id} className="flex justify-between text-xs font-semibold">
                          <span className="text-white/80">{item.product.name} (x{item.quantity})</span>
                          <span>₹{priceFormatter.format(item.product.price * item.quantity)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between text-xs font-semibold text-white/50">
                        <span>Delivery Fee</span>
                        <span>{serviceFee === 0 ? "Free" : `₹${priceFormatter.format(serviceFee)}`}</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold text-emerald-300 pt-2 border-t border-dashed border-white/10">
                        <span>Escrow Settled Total</span>
                        <span>₹{priceFormatter.format(totalValuation)}</span>
                      </div>
                    </div>

                    <div className="rounded-xl bg-white/5 border border-white/5 p-3 text-[10px] text-white/60 leading-normal flex items-start gap-2">
                      <Navigation className="h-4 w-4 shrink-0 text-emerald-450 mt-0.5" />
                      <div>
                        <p className="font-bold text-white/80">Dispatch logistics initialized</p>
                        <p className="mt-0.5">Your crop batch origin is verified. Local logistics have confirmed cold-chain dispatch. Tracking index is live in the secure dispatch dashboard.</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      onClick={() => {
                        window.print()
                      }}
                      className="flex-1 h-11 bg-white/5 border border-white/10 hover:bg-white/10 text-white/80 rounded-xl font-bold text-xs flex items-center justify-center gap-2"
                    >
                      <Printer className="h-4 w-4 text-emerald-450" />
                      Print Secured Receipt
                    </Button>
                    <Button
                      onClick={() => {
                        setCart([])
                        setIsCheckoutOpen(false)
                        setCheckoutStep(1)
                      }}
                      className="flex-1 h-11 bg-[#569578] hover:bg-[#569578]/80 text-white rounded-xl font-extrabold text-xs shadow-md transition-all active:scale-95"
                    >
                      Return to Sourcing Catalog
                    </Button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </main>
  )
}
