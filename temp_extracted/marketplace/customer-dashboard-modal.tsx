"use client"

import React, { useState, useEffect } from "react"
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  HelpCircle,
  History,
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  Navigation,
  LogOut,
  ChevronDown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Types for Customer Sourcing Portal
export interface CustomerOrder {
  id: string
  date: string
  items: Array<{
    name: string
    quantity: number
    price: number
    unit: string
  }>
  subtotal: number
  serviceFee: number
  total: number
  status: "Delivered" | "In Transit" | "Processing"
  transitStep?: string
  temperature?: string
}

export interface CustomerUser {
  email: string
  fullName: string
  phone: string
  address: string
  zipCode: string
  password?: string
  orderHistory: CustomerOrder[]
}

const SEED_CUSTOMERS: CustomerUser[] = [
  {
    email: "customer@uniagric.com",
    fullName: "Pratik Customer",
    phone: "+91 98765 43210",
    address: "123 Greenfield Orchards, Nashik Road",
    zipCode: "422001",
    password: "password123",
    orderHistory: [
      {
        id: "UNI-ORD-92837",
        date: "2026-05-10",
        items: [
          { name: "Royal Basmati Reserve", quantity: 2, price: 185, unit: "5 kg" },
          { name: "Nagpur Sweet Oranges", quantity: 1, price: 165, unit: "2 kg" }
        ],
        subtotal: 535,
        serviceFee: 80,
        total: 615,
        status: "Delivered",
        transitStep: "Cold-chain delivered successfully at destination.",
        temperature: "Sensor Temp: 4.2°C (Stable)"
      },
      {
        id: "UNI-ORD-83940",
        date: "2026-05-15",
        items: [
          { name: "Alphonso Mango Crate", quantity: 1, price: 460, unit: "box" }
        ],
        subtotal: 460,
        serviceFee: 80,
        total: 540,
        status: "In Transit",
        transitStep: "Dispatched from Konkan Orchards. In transit near Mumbai Hub.",
        temperature: "Sensor Temp: 5.0°C (Stable)"
      }
    ]
  },
  {
    email: "buyer@agro.com",
    fullName: "Sourcing Director",
    phone: "+91 87654 32109",
    address: "Agro Sourcing Center, Block C, Bandra Kurla Complex, Mumbai",
    zipCode: "400051",
    password: "password123",
    orderHistory: [
      {
        id: "UNI-ORD-74920",
        date: "2026-05-08",
        items: [
          { name: "Stoneground Brown Rice", quantity: 5, price: 145, unit: "3 kg" },
          { name: "Desi Chickpeas", quantity: 3, price: 104, unit: "2 kg" }
        ],
        subtotal: 1037,
        serviceFee: 0, // subtotal >= 900
        total: 1037,
        status: "Delivered",
        transitStep: "Corporate bulk drop complete.",
        temperature: "Sensor Temp: Ambient (Perfect)"
      }
    ]
  }
]

interface CustomerDashboardModalProps {
  isOpen: boolean
  onClose: () => void
  onLoginSuccess: (user: CustomerUser) => void
  initialTab?: "auth" | "profile" | "history" | "help"
  currentCustomer: CustomerUser | null
  onLogout: () => void
  cartSubtotal?: number
  checkoutTriggered?: boolean
}

export function CustomerDashboardModal({
  isOpen,
  onClose,
  onLoginSuccess,
  initialTab = "auth",
  currentCustomer,
  onLogout,
  cartSubtotal = 0,
  checkoutTriggered = false
}: CustomerDashboardModalProps) {
  // Tabs: auth (login/signup), profile, history, help
  const [activeTab, setActiveTab] = useState<"auth" | "profile" | "history" | "help">("auth")
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")

  // Authentication Fields
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  
  // Sign Up Fields
  const [signUpEmail, setSignUpEmail] = useState("")
  const [signUpFullName, setSignUpFullName] = useState("")
  const [signUpPhone, setSignUpPhone] = useState("")
  const [signUpAddress, setSignUpAddress] = useState("")
  const [signUpZip, setSignUpZip] = useState("")
  const [signUpPassword, setSignUpPassword] = useState("")

  // Profile Fields
  const [profileName, setProfileName] = useState("")
  const [profilePhone, setProfilePhone] = useState("")
  const [profileAddress, setProfileAddress] = useState("")
  const [profileZip, setProfileZip] = useState("")

  // Help center states
  const [helpMessage, setHelpMessage] = useState("")
  const [chatLog, setChatLog] = useState<Array<{ sender: "user" | "support"; text: string }>>([
    {
      sender: "support",
      text: "Hello! Welcome to UniAgriQ Direct Sourcing Support. How can we assist you with crop logistics or verification today?"
    }
  ])
  const [isTyping, setIsTyping] = useState(false)
  const [activeFaq, setActiveFaq] = useState<number | null>(null)

  // Simulation / Success States
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [tempUser, setTempUser] = useState<CustomerUser | null>(null)

  // Sync state with customer details when modal opens or customer changes
  useEffect(() => {
    if (currentCustomer) {
      setActiveTab((initialTab === "auth" || !initialTab) ? "profile" : initialTab)
      setProfileName(currentCustomer.fullName)
      setProfilePhone(currentCustomer.phone)
      setProfileAddress(currentCustomer.address)
      setProfileZip(currentCustomer.zipCode)
    } else {
      setActiveTab("auth")
    }
    setErrorMsg("")
    setSuccessMsg("")
  }, [currentCustomer, isOpen, initialTab])

  if (!isOpen) return null

  // Ensure customer list initialized in localStorage
  const getCustomersList = (): CustomerUser[] => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("uniagric_customers_db")
      if (stored) {
        try {
          return JSON.parse(stored)
        } catch (e) {
          return SEED_CUSTOMERS
        }
      } else {
        localStorage.setItem("uniagric_customers_db", JSON.stringify(SEED_CUSTOMERS))
        return SEED_CUSTOMERS
      }
    }
    return SEED_CUSTOMERS
  }

  const saveCustomersList = (list: CustomerUser[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("uniagric_customers_db", JSON.stringify(list))
    }
  }

  // Handle customer login verification
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")
    setSuccessMsg("")
    setIsLoading(true)

    setTimeout(() => {
      const customers = getCustomersList()
      const found = customers.find(
        (c) => c.email.toLowerCase() === loginEmail.trim().toLowerCase()
      )

      if (!found) {
        setErrorMsg("Sourcing account not found. Please switch to Sign Up to register.")
        setIsLoading(false)
        return
      }

      if (found.password !== loginPassword) {
        setErrorMsg("Invalid account password. Please check your credentials.")
        setIsLoading(false)
        return
      }

      // Customer found and password correct -> Trigger verification check
      setTempUser(found)
      setIsVerifying(true)
      setIsLoading(false)
    }, 1200)
  }

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      if (verificationCode.trim() !== "1234") {
        setErrorMsg("Verification code invalid. For demo, please enter '1234'")
        setIsLoading(false)
        return
      }

      // Success login!
      if (tempUser) {
        onLoginSuccess(tempUser)
        setSuccessMsg("Sourcing session verified successfully! Redirecting...")
        setTimeout(() => {
          setIsLoading(false)
          setIsVerifying(false)
          setVerificationCode("")
          setTempUser(null)
          // If checkout was triggered, close immediately so checkout proceeds
          if (checkoutTriggered) onClose()
        }, 800)
      }
    }, 1000)
  }

  // Handle signup
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")
    setSuccessMsg("")
    setIsLoading(true)

    if (signUpPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters.")
      setIsLoading(false)
      return
    }

    setTimeout(() => {
      const customers = getCustomersList()
      const exists = customers.some(
        (c) => c.email.toLowerCase() === signUpEmail.trim().toLowerCase()
      )

      if (exists) {
        setErrorMsg("An account with this email already exists. Please log in.")
        setIsLoading(false)
        return
      }

      const newUser: CustomerUser = {
        email: signUpEmail.trim().toLowerCase(),
        fullName: signUpFullName,
        phone: signUpPhone,
        address: signUpAddress,
        zipCode: signUpZip,
        password: signUpPassword,
        orderHistory: []
      }

      // Save to local storage database
      const updated = [...customers, newUser]
      saveCustomersList(updated)

      setTempUser(newUser)
      setIsVerifying(true)
      setIsLoading(false)
    }, 1200)
  }

  // Handle Profile Update
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")
    setSuccessMsg("")
    setIsLoading(true)

    setTimeout(() => {
      if (!currentCustomer) return

      const customers = getCustomersList()
      const updatedList = customers.map((c) => {
        if (c.email.toLowerCase() === currentCustomer.email.toLowerCase()) {
          return {
            ...c,
            fullName: profileName,
            phone: profilePhone,
            address: profileAddress,
            zipCode: profileZip
          }
        }
        return c
      })

      saveCustomersList(updatedList)

      // Notify parent to refresh current customer session
      const updatedUser = updatedList.find(
        (c) => c.email.toLowerCase() === currentCustomer.email.toLowerCase()
      )
      if (updatedUser) {
        onLoginSuccess(updatedUser)
      }

      setSuccessMsg("Sourcing profile details updated successfully!")
      setIsLoading(false)
    }, 800)
  }

  // Handle interactive Support chatbot
  const handleSendHelpMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!helpMessage.trim()) return

    const userText = helpMessage
    setChatLog((prev) => [...prev, { sender: "user", text: userText }])
    setHelpMessage("")
    setIsTyping(true)

    // Analyze queries to give intelligent replies
    setTimeout(() => {
      let reply = ""
      const normalized = userText.toLowerCase()

      if (normalized.includes("ship") || normalized.includes("order") || normalized.includes("delivery")) {
        reply = "Our logistics are fully temperature-controlled and trace-logged. If you placed a recent order, you can check its status in the 'Buying History' tab above. Most shipments arrive within 2 to 3 business days."
      } else if (normalized.includes("basmati") || normalized.includes("rice")) {
        reply = "Our Royal Basmati Reserve is sun-dried, aged for 12 months, and sourced from verified direct growers in the Saffron Valley estates. Each batch includes detailed moisture and length specifications."
      } else if (normalized.includes("return") || normalized.includes("refund")) {
        reply = "UniAgriQ operates a Sourcing Escrow Protection system. If a shipment fails to meet certified food safety standard metrics or quality grades, your purchase is fully refundable prior to lot release."
      } else if (normalized.includes("temp") || normalized.includes("cold") || normalized.includes("cool")) {
        reply = "Yes! Every single fruit and vegetable batch is monitored via real-time sensory loggers. If temperatures exceed 6.5°C during dispatch transit, our logistics team is alerted instantly."
      } else {
        reply = `Thank you for your message regarding: "${userText}". Our dedicated agricultural logistics desk has received this ticket and will contact you via your registered email (${currentCustomer?.email || "customer account email"}) shortly.`
      }

      setChatLog((prev) => [...prev, { sender: "support", text: reply }])
      setIsTyping(false)
    }, 1200)
  }

  const faqs = [
    {
      q: "How does the escrow buyer protection work?",
      a: "When you purchase farm crops, funds are held securely in a protected Escrow account. Payments are only finalized and released to the farmer after cold-chain delivery is audited and you confirm crop specifications are met."
    },
    {
      q: "Are the crops certified organic?",
      a: "Crops marked with our organic badge have verified pesticide-free farming logs. We audit soil health indices, water quality, and direct coordinates of each farm location for absolute safety assurance."
    },
    {
      q: "What is cold-chain sensor tracking?",
      a: "Every delicate fruit and value-added shipment is equipped with secure sensory logs that upload core temperatures and real-time transit location directly to the UniAgriQ tracking board, ensuring premium quality."
    }
  ]

  const priceFormatter = new Intl.NumberFormat("en-IN")

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#071a0f] border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh]">
        
        {/* Header section */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-emerald-450" />
            <span className="font-bold font-serif text-lg">
              {currentCustomer ? "UniAgriQ Customer Sourcing Portal" : "Secure Customer Authentication"}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Global Alerts inside Modal */}
        {(errorMsg || successMsg) && (
          <div className="px-8 pt-4 shrink-0">
            {errorMsg && (
              <div className="p-3 bg-red-500/15 border border-red-400/20 rounded-xl flex items-center gap-2 text-red-300 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="p-3 bg-green-500/15 border border-green-400/20 rounded-xl flex items-center gap-2 text-green-300 text-xs font-semibold">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                {successMsg}
              </div>
            )}
          </div>
        )}

        {/* ================= TABS FOR LOGGED-IN USERS ================= */}
        {currentCustomer && (
          <div className="flex border-b border-white/10 px-8 py-1.5 bg-[#040e09]/40 gap-4 shrink-0 text-xs font-bold uppercase tracking-wider overflow-x-auto scrollbar-none">
            <button
              onClick={() => {
                setActiveTab("profile")
                setErrorMsg("")
                setSuccessMsg("")
              }}
              className={`py-3 border-b-2 transition-all ${
                activeTab === "profile" ? "border-emerald-400 text-emerald-300" : "border-transparent text-white/50 hover:text-white"
              }`}
            >
              My Profile
            </button>
            <button
              onClick={() => {
                setActiveTab("history")
                setErrorMsg("")
                setSuccessMsg("")
              }}
              className={`py-3 border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === "history" ? "border-emerald-400 text-emerald-300" : "border-transparent text-white/50 hover:text-white"
              }`}
            >
              <History className="w-3.5 h-3.5" />
              Buying History ({currentCustomer.orderHistory.length})
            </button>
            <button
              onClick={() => {
                setActiveTab("help")
                setErrorMsg("")
                setSuccessMsg("")
              }}
              className={`py-3 border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === "help" ? "border-emerald-400 text-emerald-300" : "border-transparent text-white/50 hover:text-white"
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Help & Support
            </button>
            <button
              onClick={() => {
                onLogout()
                onClose()
              }}
              className="py-3 text-red-400/70 hover:text-red-400 flex items-center gap-1 ml-auto"
            >
              <LogOut className="w-3.5 h-3.5" />
              Log Out
            </button>
          </div>
        )}

        {/* ================= MODAL BODY ================= */}
        <div className="flex-1 overflow-y-auto p-8">
          
          {/* A: VERIFICATION CODE STEP (Realism for Customer Security) */}
          {isVerifying && tempUser && (
            <form onSubmit={handleVerificationSubmit} className="space-y-6 max-w-sm mx-auto py-6 text-center">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-300 border border-emerald-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-serif">Enter Authorization Code</h3>
                <p className="text-xs text-white/60 mt-1.5 leading-relaxed">
                  To secure your procurement account, we sent a simulated 4-digit code to <strong className="text-white">{tempUser.email}</strong>.
                </p>
                <p className="text-[10px] text-emerald-450 font-bold uppercase tracking-widest mt-1">
                  (Demo bypass code: <strong className="text-white text-xs">1234</strong>)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="verificationCode" className="text-xs font-bold uppercase tracking-wider text-white/40">Secure Verification Code</Label>
                <Input
                  id="verificationCode"
                  required
                  maxLength={4}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter 1234"
                  className="text-center font-mono tracking-[0.5em] text-lg rounded-xl h-12 border-white/15 bg-white/5 text-white placeholder-emerald-100/20 focus-visible:ring-[#569578]"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={() => {
                    setIsVerifying(false)
                    setTempUser(null)
                  }}
                  className="flex-1 h-11 bg-white/5 border border-white/10 text-white font-bold rounded-xl text-xs hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 h-11 bg-[#569578] hover:bg-[#569578]/80 text-white rounded-xl font-bold text-xs flex justify-center items-center gap-1 shadow-md"
                >
                  {isLoading && <Loader2 className="w-3 h-3 animate-spin" />}
                  Verify Session
                </Button>
              </div>
            </form>
          )}

          {/* B: AUTHENTICATION FLOW (LOGIN & SIGN UP) */}
          {!currentCustomer && !isVerifying && (
            <div className="space-y-5">
              
              {checkoutTriggered && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-400/20 rounded-2xl flex items-start gap-3 text-emerald-300 text-xs">
                  <ShieldCheck className="w-5 h-5 flex-shrink-0 text-emerald-400 mt-0.5" />
                  <div>
                    <p className="font-extrabold uppercase tracking-wider">Authentication Required</p>
                    <p className="text-white/70 mt-0.5">You are checking out crop selections valued at <strong className="text-emerald-250 font-extrabold">₹{priceFormatter.format(cartSubtotal)}</strong>. Please log in or register a customer profile to proceed with direct secure payment.</p>
                  </div>
                </div>
              )}

              {/* Login/Signup Tabs Switch */}
              <div className="grid grid-cols-2 p-1.5 bg-white/5 rounded-xl border border-white/5">
                <button
                  onClick={() => {
                    setAuthMode("login")
                    setErrorMsg("")
                  }}
                  className={`py-2 text-xs font-bold rounded-lg uppercase tracking-wider transition-all ${
                    authMode === "login" ? "bg-[#569578] text-white shadow-md" : "text-white/50 hover:text-white"
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setAuthMode("signup")
                    setErrorMsg("")
                  }}
                  className={`py-2 text-xs font-bold rounded-lg uppercase tracking-wider transition-all ${
                    authMode === "signup" ? "bg-[#569578] text-white shadow-md" : "text-white/50 hover:text-white"
                  }`}
                >
                  Sign Up / Register
                </button>
              </div>

              {/* B1: LOGIN VIEW */}
              {authMode === "login" && (
                <form onSubmit={handleLoginSubmit} className="space-y-4 animate-fade-in">
                  <div className="space-y-1">
                    <Label htmlFor="loginEmail" className="text-xs font-bold text-emerald-300/80 uppercase tracking-wider">Sourcing Email Address *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <Input
                        id="loginEmail"
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="customer@uniagric.com"
                        className="pl-10 rounded-xl border-white/15 bg-white/5 text-white placeholder-emerald-100/30 focus-visible:ring-[#569578]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="loginPassword" className="text-xs font-bold text-emerald-300/80 uppercase tracking-wider">Account Password *</Label>
                    <Input
                      id="loginPassword"
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="rounded-xl border-white/15 bg-white/5 text-white placeholder-emerald-100/30 focus-visible:ring-[#569578]"
                    />
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 bg-[#569578] hover:bg-[#569578]/80 text-white rounded-xl font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-1.5"
                    >
                      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                      Log In & Verify Session
                    </Button>
                  </div>
                  <p className="text-[10px] text-center text-white/40">
                    Demo accounts: <strong className="text-emerald-300">customer@uniagric.com</strong> or <strong className="text-emerald-300">buyer@agro.com</strong> (Password: <strong className="text-emerald-300">password123</strong>)
                  </p>
                </form>
              )}

              {/* B2: SIGN UP VIEW */}
              {authMode === "signup" && (
                <form onSubmit={handleSignUpSubmit} className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="signUpFullName" className="text-xs font-bold text-emerald-300/80 uppercase tracking-wider">Full Name *</Label>
                      <Input
                        id="signUpFullName"
                        required
                        value={signUpFullName}
                        onChange={(e) => setSignUpFullName(e.target.value)}
                        placeholder="John Doe"
                        className="rounded-xl border-white/15 bg-white/5 text-white placeholder-emerald-100/30 focus-visible:ring-[#569578]"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="signUpEmail" className="text-xs font-bold text-emerald-300/80 uppercase tracking-wider">Email Address *</Label>
                      <Input
                        id="signUpEmail"
                        type="email"
                        required
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        placeholder="john@company.com"
                        className="rounded-xl border-white/15 bg-white/5 text-white placeholder-emerald-100/30 focus-visible:ring-[#569578]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="signUpPhone" className="text-xs font-bold text-emerald-300/80 uppercase tracking-wider">Contact Phone *</Label>
                      <Input
                        id="signUpPhone"
                        required
                        value={signUpPhone}
                        onChange={(e) => setSignUpPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="rounded-xl border-white/15 bg-white/5 text-white placeholder-emerald-100/30 focus-visible:ring-[#569578]"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="signUpZip" className="text-xs font-bold text-emerald-300/80 uppercase tracking-wider">ZIP / Postal PIN Code *</Label>
                      <Input
                        id="signUpZip"
                        required
                        value={signUpZip}
                        onChange={(e) => setSignUpZip(e.target.value)}
                        placeholder="422001"
                        className="rounded-xl border-white/15 bg-white/5 text-white placeholder-emerald-100/30 focus-visible:ring-[#569578]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="signUpAddress" className="text-xs font-bold text-emerald-300/80 uppercase tracking-wider">Default Shipping Address *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <Input
                        id="signUpAddress"
                        required
                        value={signUpAddress}
                        onChange={(e) => setSignUpAddress(e.target.value)}
                        placeholder="Street, Building, Flat number"
                        className="pl-10 rounded-xl border-white/15 bg-white/5 text-white placeholder-emerald-100/30 focus-visible:ring-[#569578]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="signUpPassword" className="text-xs font-bold text-emerald-300/80 uppercase tracking-wider">Create Account Password *</Label>
                    <Input
                      id="signUpPassword"
                      type="password"
                      required
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="rounded-xl border-white/15 bg-white/5 text-white placeholder-emerald-100/30 focus-visible:ring-[#569578]"
                    />
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 bg-[#569578] hover:bg-[#569578]/80 text-white rounded-xl font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-1.5"
                    >
                      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                      Register Sourcing Profile
                    </Button>
                  </div>
                </form>
              )}

            </div>
          )}

          {/* C: PROFILE TAB VIEW */}
          {currentCustomer && activeTab === "profile" && (
            <form onSubmit={handleProfileUpdate} className="space-y-5 animate-fade-in">
              <h3 className="text-lg font-bold font-serif flex items-center gap-1.5 pb-2 border-b border-white/5 text-emerald-300">
                <User className="w-5 h-5 text-emerald-450" />
                Customer Sourcing Details
              </h3>
              <p className="text-xs text-white/50">
                Update default buyer profiles. Pre-loaded fields instantly configure during shopping checkouts.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-emerald-300/80 uppercase tracking-wider">Registered Email</Label>
                  <Input
                    disabled
                    value={currentCustomer.email}
                    className="rounded-xl border-white/5 bg-white/5 text-white/40 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="profileName" className="text-xs font-bold text-emerald-300/80 uppercase tracking-wider">Full Name *</Label>
                  <Input
                    id="profileName"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="rounded-xl border-white/15 bg-white/5 text-white focus-visible:ring-[#569578]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="profilePhone" className="text-xs font-bold text-emerald-300/80 uppercase tracking-wider">Contact Phone *</Label>
                  <Input
                    id="profilePhone"
                    required
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="rounded-xl border-white/15 bg-white/5 text-white focus-visible:ring-[#569578]"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="profileZip" className="text-xs font-bold text-emerald-300/80 uppercase tracking-wider">PIN / Postal Code *</Label>
                  <Input
                    id="profileZip"
                    required
                    value={profileZip}
                    onChange={(e) => setProfileZip(e.target.value)}
                    className="rounded-xl border-white/15 bg-white/5 text-white focus-visible:ring-[#569578]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="profileAddress" className="text-xs font-bold text-emerald-300/80 uppercase tracking-wider">Delivery Shipping Address *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-450" />
                  <Input
                    id="profileAddress"
                    required
                    value={profileAddress}
                    onChange={(e) => setProfileAddress(e.target.value)}
                    className="pl-10 rounded-xl border-white/15 bg-white/5 text-white focus-visible:ring-[#569578]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-[#569578] hover:bg-[#569578]/80 text-white rounded-xl font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Update Sourcing Profile
                </Button>
              </div>
            </form>
          )}

          {/* D: BUYING HISTORY TAB VIEW */}
          {currentCustomer && activeTab === "history" && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-lg font-bold font-serif flex items-center gap-1.5 pb-2 border-b border-white/5 text-emerald-300">
                <History className="w-5 h-5 text-emerald-450" />
                Procurement History
              </h3>

              {currentCustomer.orderHistory.length === 0 ? (
                <div className="text-center py-10 bg-white/5 rounded-2xl border border-dashed border-white/10">
                  <p className="text-sm text-white/50">No crop sourcing transactions discovered.</p>
                  <p className="text-xs text-white/30 mt-1">Add items to your basket and complete checkout agreement above!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentCustomer.orderHistory.map((order) => (
                    <div key={order.id} className="border border-white/10 rounded-2xl p-4 bg-[#071d12]/50 hover:border-emerald-500/25 transition-all">
                      {/* Order Summary Header */}
                      <div className="flex justify-between items-center text-xs font-bold pb-2.5 border-b border-white/5">
                        <div>
                          <p className="font-mono text-white text-[13px]">{order.id}</p>
                          <p className="text-[10px] text-white/40 mt-0.5">Sourced on: {order.date}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-extrabold ${
                            order.status === "Delivered"
                              ? "bg-green-500/10 text-green-300 border border-green-500/20"
                              : order.status === "In Transit"
                              ? "bg-blue-500/10 text-blue-300 border border-blue-500/20"
                              : "bg-yellow-500/10 text-yellow-300 border border-yellow-500/20"
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>

                      {/* Items Sourced */}
                      <div className="py-3 space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs font-medium">
                            <span className="text-white/80">{item.name} <strong className="text-white">x{item.quantity}</strong> ({item.unit})</span>
                            <span className="font-semibold text-emerald-350">₹{priceFormatter.format(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Logistics Tracking Info Card */}
                      <div className="bg-black/35 rounded-xl p-3 border border-white/5 text-[10px] text-white/70 space-y-1.5">
                        <div className="flex justify-between font-bold text-white/50 uppercase tracking-widest text-[8px]">
                          <span className="flex items-center gap-1"><Navigation className="w-2.5 h-2.5 text-emerald-400" /> Active Dispatch Tracking</span>
                          <span className="text-emerald-400">{order.temperature || "Ambient Sourced"}</span>
                        </div>
                        <p className="font-semibold text-emerald-250 leading-relaxed">{order.transitStep || "Logistics initialization in process."}</p>
                      </div>

                      {/* Bottom Order Total */}
                      <div className="flex justify-between items-center text-xs font-bold pt-3 mt-1.5 border-t border-dashed border-white/5">
                        <span className="text-white/40 uppercase tracking-wider">Total Valuation</span>
                        <span className="text-emerald-300 text-sm">₹{priceFormatter.format(order.total)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* E: HELP & FAQs TAB VIEW */}
          {currentCustomer && activeTab === "help" && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-lg font-bold font-serif flex items-center gap-1.5 pb-2 border-b border-white/5 text-emerald-300">
                <HelpCircle className="w-5 h-5 text-emerald-450" />
                Sourcing Help & Chat Assistant
              </h3>

              {/* FAQs Accordion */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-white/40 uppercase tracking-wider">Frequently Asked Questions</p>
                {faqs.map((faq, idx) => (
                  <div key={idx} className="border border-white/5 rounded-xl bg-white/5 overflow-hidden">
                    <button
                      onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                      className="w-full px-4 py-3 flex justify-between items-center text-left text-xs font-bold hover:bg-white/5 transition-colors"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown className={`w-4 h-4 text-emerald-450 transition-transform ${activeFaq === idx ? "rotate-180" : ""}`} />
                    </button>
                    {activeFaq === idx && (
                      <div className="px-4 pb-3 pt-0.5 text-[11px] text-white/60 leading-relaxed border-t border-white/5">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Support Live Chat Interface */}
              <div className="space-y-2 border-t border-white/5 pt-4">
                <p className="text-xs font-bold text-white/40 uppercase tracking-wider">Live Sourcing Support Chat</p>
                
                {/* Chat window */}
                <div className="h-44 border border-white/10 rounded-2xl bg-black/40 p-4 overflow-y-auto space-y-3 scrollbar-thin text-xs">
                  {chatLog.map((chat, idx) => (
                    <div
                      key={idx}
                      className={`flex ${chat.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[80%] rounded-2xl px-3.5 py-2 leading-relaxed ${
                        chat.sender === "user"
                          ? "bg-[#569578] text-white rounded-tr-none"
                          : "bg-white/5 border border-white/15 text-white/90 rounded-tl-none"
                      }`}>
                        {chat.text}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none px-3.5 py-2 flex items-center gap-1.5 text-white/50 italic">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Support agent is analyzing...
                      </div>
                    </div>
                  )}
                </div>

                {/* Input form */}
                <form onSubmit={handleSendHelpMessage} className="flex gap-2">
                  <Input
                    required
                    value={helpMessage}
                    onChange={(e) => setHelpMessage(e.target.value)}
                    placeholder="Ask about basmati reserve temperature logs..."
                    className="rounded-xl border-white/15 bg-white/5 text-white placeholder-emerald-100/20 focus-visible:ring-[#569578]"
                  />
                  <Button
                    type="submit"
                    className="bg-[#569578] hover:bg-[#569578]/80 text-white rounded-xl w-11 h-10 flex items-center justify-center p-0"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  )
}
