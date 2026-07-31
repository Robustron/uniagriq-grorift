"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Heart, CreditCard, Building2, Smartphone, CheckCircle } from "lucide-react"

const presetAmounts = [500, 1000, 2500, 5000, 10000, 25000]

const campaigns = [
  { id: "drought", name: "Drought Relief Fund" },
  { id: "equipment", name: "Modern Equipment Drive" },
  { id: "training", name: "Organic Farming Training" },
  { id: "women", name: "Women Farmer Empowerment" },
  { id: "water", name: "Clean Water for Farms" },
  { id: "education", name: "Farmer Children Education" },
  { id: "general", name: "General Welfare Fund" },
]

export function ContributionForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    amount: "",
    campaign: "",
    paymentMethod: "upi",
    message: "",
    anonymous: false,
    recurring: false,
  })
  const [submitted, setSubmitted] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const query = new URLSearchParams(window.location.search)
    if (query.get("success")) {
      setSubmitted(true)
    }
  }, [])

  const handleAmountSelect = (amount: number) => {
    setFormData({ ...formData, amount: amount.toString() })
  }

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = () => {
        resolve(true)
      }
      script.onerror = () => {
        resolve(false)
      }
      document.body.appendChild(script)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    
    try {
      const resData = await loadRazorpayScript()

      if (!resData) {
        alert("Razorpay SDK failed to load. Are you online?")
        setIsProcessing(false)
        return
      }

      const campaignName = campaigns.find((c) => c.id === formData.campaign)?.name || "CSR"

      const res = await fetch("/api/razorpay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: formData.amount,
          campaignName,
        }),
      })

      const order = await res.json()

      if (!order.id) {
        console.error("Razorpay Error:", order.error)
        alert("Payment gateway error. Check console.")
        setIsProcessing(false)
        return
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
        amount: order.amount,
        currency: order.currency,
        name: "UniAgriq CSR Foundation",
        description: `Contribution for ${campaignName}`,
        order_id: order.id,
        handler: async function (response: any) {
          setSubmitted(true)
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#569578",
        },
      }

      const paymentObject = new (window as any).Razorpay(options)
      paymentObject.open()
      setIsProcessing(false)
      
      paymentObject.on("payment.failed", function (response: any) {
        alert("Payment Failed - " + response.error.description)
      })

    } catch (error) {
      console.error(error)
      setIsProcessing(false)
    }
  }

  if (submitted) {
    return (
      <section id="contribution-form" className="py-12 md:py-16 px-4" style={{ backgroundColor: '#1d1d1f' }}>
        <div className="max-w-xl mx-auto text-center">
          <div className="w-20 h-20 bg-green-950/40 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#569578]/30 shadow-lg">
            <CheckCircle className="w-10 h-10 text-[#569578] animate-bounce" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white font-sans mb-4">
            Thank You for Your Contribution!
          </h2>
          <p className="text-white/60 font-sans mb-6">
            Your generous donation of ₹{Number(formData.amount).toLocaleString("en-IN")} will help transform farmers'
            lives. A confirmation email has been sent to {formData.email}.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="px-6 py-3 bg-[#569578] text-white font-semibold rounded-full hover:bg-[#569578]/80 transition-colors min-h-[44px]"
          >
            Make Another Contribution
          </button>
        </div>
      </section>
    )
  }

  return (
    <section id="contribution-form" className="py-12 md:py-16 px-4" style={{ backgroundColor: '#1d1d1f' }}>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white font-sans mb-3">Make a Contribution</h2>
          <p className="text-white/60 font-sans">Every contribution counts towards building a better future</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-white">
          {/* Personal Details */}
          <div className="bg-[#275d46]/20 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-2xl">
            <h3 className="font-semibold text-[#569578] font-sans mb-4 text-lg">Your Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-xl focus:ring-1 focus:ring-[#569578] focus:border-[#569578] text-base"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-xl focus:ring-1 focus:ring-[#569578] focus:border-[#569578] text-base"
                  placeholder="your@email.com"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="phone" className="block text-sm font-medium text-white/80 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-xl focus:ring-1 focus:ring-[#569578] focus:border-[#569578] text-base"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
            </div>
          </div>

          {/* Amount Selection */}
          <div className="bg-[#275d46]/20 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-2xl">
            <h3 className="font-semibold text-[#569578] font-sans mb-4 text-lg">Select Amount</h3>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {presetAmounts.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => handleAmountSelect(amount)}
                  className={`py-3 rounded-xl font-semibold transition-all min-h-[44px] ${
                    formData.amount === amount.toString()
                      ? "bg-[#569578] text-white shadow-lg"
                      : "bg-[#275d46]/10 text-white/70 border border-white/10 hover:border-[#569578]/50 hover:bg-[#275d46]/20"
                  }`}
                >
                  ₹{amount.toLocaleString("en-IN")}
                </button>
              ))}
            </div>
            <div>
              <label htmlFor="customAmount" className="block text-sm font-medium text-white/80 mb-1">
                Or enter custom amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">₹</span>
                <input
                  type="number"
                  id="customAmount"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-xl focus:ring-1 focus:ring-[#569578] focus:border-[#569578] text-base"
                  placeholder="Enter amount"
                  min="100"
                />
              </div>
            </div>
          </div>

          {/* Campaign Selection */}
          <div className="bg-[#275d46]/20 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-2xl">
            <h3 className="font-semibold text-[#569578] font-sans mb-4 text-lg">Choose Campaign</h3>
            <select
              value={formData.campaign}
              onChange={(e) => setFormData({ ...formData, campaign: e.target.value })}
              className="w-full px-4 py-3 bg-[#3B5236]/90 border border-white/10 text-white rounded-xl focus:outline-none focus:border-[#569578] focus:ring-1 focus:ring-[#569578] text-base"
              required
            >
              <option value="" className="bg-[#3B5236]">Select a campaign</option>
              {campaigns.map((campaign) => (
                <option key={campaign.id} value={campaign.id} className="bg-[#3B5236]">
                  {campaign.name}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Method */}
          <div className="bg-[#275d46]/20 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-2xl">
            <h3 className="font-semibold text-[#569578] font-sans mb-4 text-lg">Payment Method</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { id: "upi", icon: Smartphone, label: "UPI" },
                { id: "card", icon: CreditCard, label: "Card" },
                { id: "netbanking", icon: Building2, label: "Net Banking" },
              ].map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all min-h-[44px] ${
                    formData.paymentMethod === method.id
                      ? "bg-[#569578] text-white shadow-lg"
                      : "bg-[#275d46]/10 text-white/70 border border-white/10 hover:border-[#569578]/50 hover:bg-[#275d46]/20"
                  }`}
                >
                  <method.icon className="w-5 h-5 text-[#569578]" />
                  {method.label}
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-white/80 mb-1">
              Leave a message (optional)
            </label>
            <textarea
              id="message"
              rows={3}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-xl focus:ring-1 focus:ring-[#569578] focus:border-[#569578] text-base resize-none"
              placeholder="Share why you're contributing..."
            />
          </div>

          {/* Options */}
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.anonymous}
                onChange={(e) => setFormData({ ...formData, anonymous: e.target.checked })}
                className="w-5 h-5 rounded border-white/10 text-[#569578] bg-white/5 focus:ring-[#569578] cursor-pointer"
              />
              <span className="text-white/80 font-sans">Make this donation anonymous</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.recurring}
                onChange={(e) => setFormData({ ...formData, recurring: e.target.checked })}
                className="w-5 h-5 rounded border-white/10 text-[#569578] bg-white/5 focus:ring-[#569578] cursor-pointer"
              />
              <span className="text-white/80 font-sans">Make this a monthly recurring donation</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing || !formData.amount}
            className="w-full flex items-center justify-center gap-2 py-4 bg-[#569578] hover:bg-[#569578]/90 text-white font-bold rounded-full transition-all min-h-[56px] text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Redirecting to Secure Gateway...
              </span>
            ) : (
              <>
                <Heart className="w-5 h-5 fill-white" />
                Donate {formData.amount ? `₹${Number(formData.amount).toLocaleString("en-IN")}` : "Now"}
              </>
            )}
          </button>

          <p className="text-center text-sm text-white/40 font-sans">
            All donations are eligible for 80G tax benefits. You will receive a receipt via email.
          </p>
        </form>
      </div>
    </section>
  )
}
