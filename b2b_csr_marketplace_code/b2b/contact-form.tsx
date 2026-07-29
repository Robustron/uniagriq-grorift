"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Send, CheckCircle2 } from "lucide-react"

const businessTypes = [
  "Retailer / Supermarket",
  "Food Processor",
  "Exporter",
  "Hotel / Restaurant",
  "Corporate Cafeteria",
  "Distributor",
  "Other",
]

const volumeRanges = [
  "Less than 1 ton/month",
  "1-5 tons/month",
  "5-20 tons/month",
  "20-50 tons/month",
  "50+ tons/month",
]

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    businessType: "",
    volumeRange: "",
    products: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const subject = `B2B Partnership Inquiry from ${formData.companyName}`
    const body = `Company Name: ${formData.companyName}
Contact Person: ${formData.contactPerson}
Email: ${formData.email}
Phone: ${formData.phone}
Business Type: ${formData.businessType}
Expected Monthly Volume: ${formData.volumeRange}
Products of Interest: ${formData.products}

Additional Message:
${formData.message}`

    window.location.href = `mailto:posj2004@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

    setSubmitted(true)
  }

  if (submitted) {
    return (
      <section id="contact-form" className="py-16 md:py-20" style={{ backgroundColor: '#1d1d1f' }}>
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-[#275d46]/20 backdrop-blur-md rounded-2xl border border-white/10 p-10 shadow-2xl">
            <CheckCircle2 className="w-16 h-16 text-[#569578] mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">Thank You for Your Interest!</h2>
            <p className="text-white/60 mb-6">
              Our B2B team will review your inquiry and get back to you within 24-48 business hours.
            </p>
            <Button
              onClick={() => setSubmitted(false)}
              className="min-h-[44px] bg-[#569578] text-white hover:bg-[#569578]/80 rounded-full px-6"
            >
              Submit Another Inquiry
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="contact-form" className="py-16 md:py-20 animate-fade-in" style={{ backgroundColor: '#1d1d1f' }}>
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-4">Contact Our B2B Team</h2>
        <p className="text-white/60 text-center max-w-2xl mx-auto mb-10">
          Fill out the form below and our partnership team will reach out to discuss how we can work together.
        </p>

        <form onSubmit={handleSubmit} className="bg-[#275d46]/20 backdrop-blur-md rounded-2xl border border-white/10 p-6 md:p-10 shadow-2xl text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-white/80">Company Name *</Label>
              <Input
                id="companyName"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="Your company name"
                className="min-h-[44px] bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus:border-[#569578]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPerson" className="text-white/80">Contact Person *</Label>
              <Input
                id="contactPerson"
                required
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                placeholder="Full name"
                className="min-h-[44px] bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus:border-[#569578]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/80">Business Email *</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@company.com"
                className="min-h-[44px] bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus:border-[#569578]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white/80">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="min-h-[44px] bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus:border-[#569578]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <Label htmlFor="businessType" className="text-white/80">Business Type *</Label>
              <select
                id="businessType"
                required
                value={formData.businessType}
                onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                className="w-full min-h-[44px] rounded-xl border border-white/10 bg-[#3B5236]/90 text-white px-3 py-2 text-sm focus:outline-none focus:border-[#569578] focus:ring-1 focus:ring-[#569578]"
              >
                <option value="" className="bg-[#3B5236]">Select business type</option>
                {businessTypes.map((type) => (
                  <option key={type} value={type} className="bg-[#3B5236]">
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="volumeRange" className="text-white/80">Expected Monthly Volume *</Label>
              <select
                id="volumeRange"
                required
                value={formData.volumeRange}
                onChange={(e) => setFormData({ ...formData, volumeRange: e.target.value })}
                className="w-full min-h-[44px] rounded-xl border border-white/10 bg-[#3B5236]/90 text-white px-3 py-2 text-sm focus:outline-none focus:border-[#569578] focus:ring-1 focus:ring-[#569578]"
              >
                <option value="" className="bg-[#3B5236]">Select volume range</option>
                {volumeRanges.map((range) => (
                  <option key={range} value={range} className="bg-[#3B5236]">
                    {range}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <Label htmlFor="products" className="text-white/80">Products of Interest</Label>
            <Input
              id="products"
              value={formData.products}
              onChange={(e) => setFormData({ ...formData, products: e.target.value })}
              placeholder="e.g., Rice, Vegetables, Fruits, Spices"
              className="min-h-[44px] bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus:border-[#569578]"
            />
          </div>

          <div className="space-y-2 mb-8">
            <Label htmlFor="message" className="text-white/80">Additional Message</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Tell us more about your requirements..."
              rows={4}
              className="resize-none bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus:border-[#569578]"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#569578] hover:bg-[#569578]/90 text-white min-h-[48px] text-base font-semibold rounded-full shadow-lg"
          >
            <Send className="w-5 h-5 mr-2 animate-pulse" />
            Submit Partnership Inquiry
          </Button>

          <p className="text-xs text-white/40 text-center mt-4">
            By submitting this form, you agree to our Terms of Service and Privacy Policy.
          </p>
        </form>
      </div>
    </section>
  )
}
