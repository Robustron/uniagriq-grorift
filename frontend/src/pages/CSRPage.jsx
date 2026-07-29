import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import { Heart, Users, Leaf, IndianRupee, Tractor, GraduationCap, Clock, CreditCard, Building2, Smartphone, CheckCircle } from 'lucide-react';
import './CSRPage.css';

const campaigns = [
  { id: 1, title: 'Drought Relief Fund', description: 'Providing emergency support to farmers affected by drought conditions in Maharashtra.', raised: 850000, goal: 1000000, daysLeft: 15, category: 'Emergency' },
  { id: 2, title: 'Modern Equipment Drive', description: 'Supplying tractors and farming tools to small-scale farmers in rural Karnataka.', raised: 1200000, goal: 2000000, daysLeft: 30, category: 'Equipment' },
  { id: 3, title: 'Organic Farming Training', description: 'Training 500 farmers in sustainable organic farming practices across Punjab.', raised: 300000, goal: 500000, daysLeft: 45, category: 'Education' },
  { id: 4, title: 'Women Farmer Empowerment', description: 'Supporting women-led farming initiatives with microloans and skill development.', raised: 600000, goal: 800000, daysLeft: 20, category: 'Empowerment' },
  { id: 5, title: 'Clean Water for Farms', description: 'Installing irrigation systems and water harvesting in water-scarce regions.', raised: 450000, goal: 750000, daysLeft: 25, category: 'Infrastructure' },
  { id: 6, title: 'Farmer Children Education', description: 'Scholarships and school supplies for children of marginal farmers.', raised: 200000, goal: 400000, daysLeft: 60, category: 'Education' },
];

const campaignsList = [
  { id: 'drought', name: 'Drought Relief Fund' },
  { id: 'equipment', name: 'Modern Equipment Drive' },
  { id: 'training', name: 'Organic Farming Training' },
  { id: 'women', name: 'Women Farmer Empowerment' },
  { id: 'water', name: 'Clean Water for Farms' },
  { id: 'education', name: 'Farmer Children Education' },
  { id: 'general', name: 'General Welfare Fund' },
];

const presetAmounts = [500, 1000, 2500, 5000, 10000, 25000];
const categories = ['All', 'Emergency', 'Equipment', 'Education', 'Empowerment', 'Infrastructure'];

const stats = [
  { icon: IndianRupee, value: '2.5 Cr+', label: 'Total Contributions' },
  { icon: Users, value: '10,000+', label: 'Farmers Supported' },
  { icon: Tractor, value: '500+', label: 'Equipment Provided' },
  { icon: GraduationCap, value: '1,200+', label: 'Training Programs' },
];

function formatCurrency(amount) {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  return `₹${amount.toLocaleString('en-IN')}`;
}

export default function CSRPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [submitted, setSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', amount: '', campaign: '', paymentMethod: 'upi', message: '', anonymous: false, recurring: false });

  const filtered = selectedCategory === 'All' ? campaigns : campaigns.filter(c => c.category === selectedCategory);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount) return;
    setIsProcessing(true);

    const body = `Donor: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nAmount: ₹${formData.amount}\nCampaign: ${formData.campaign}\nPayment: ${formData.paymentMethod}\nMessage: ${formData.message}\nAnonymous: ${formData.anonymous}\nRecurring: ${formData.recurring}`;
    const subject = `CSR Contribution: ₹${formData.amount} — ${formData.campaign || 'General'}`;
    window.location.href = `mailto:posj2004@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setIsProcessing(false);
    setSubmitted(true);
  };

  return (
    <main className="csr-page">
      <PageHeader title="CSR Activities" icon={Heart} iconColor="#10b981" />

      {/* Hero */}
      <section className="csr-hero">
        <div className="csr-hero-glow" />
        <div className="csr-hero-inner">
          <div className="csr-hero-icon-wrap"><Heart size={32} color="#10b981" /></div>
          <h1 className="csr-hero-title">Empowering Farmers, <span className="csr-accent">Transforming Lives</span></h1>
          <p className="csr-hero-desc">Your contributions directly support farmer welfare programs, sustainable agriculture initiatives, and rural community development.</p>
          <div className="csr-hero-badges">
            <span className="csr-badge"><Users size={18} /><span>10,000+ Farmers Helped</span></span>
            <span className="csr-badge"><Leaf size={18} /><span>500+ Villages Reached</span></span>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="csr-section">
        <div className="csr-section-inner">
          <h2 className="csr-section-title">Our Impact</h2>
          <div className="csr-stats-grid">
            {stats.map(s => (
              <div key={s.label} className="csr-stat-card">
                <s.icon size={28} color="#10b981" />
                <p className="csr-stat-value">{s.value}</p>
                <p className="csr-stat-label">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Active Campaigns */}
      <section className="csr-section csr-section-alt">
        <div className="csr-section-inner">
          <h2 className="csr-section-title">Active Campaigns</h2>
          <p className="csr-section-desc">Choose a cause close to your heart and make a difference in farmers' lives.</p>
          <div className="csr-cat-filters">
            {categories.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)} className={`csr-cat-btn ${selectedCategory === cat ? 'active' : ''}`}>{cat}</button>
            ))}
          </div>
          <div className="csr-campaigns-grid">
            {filtered.map(campaign => {
              const pct = (campaign.raised / campaign.goal) * 100;
              return (
                <article key={campaign.id} className="csr-campaign-card">
                  <div className="csr-campaign-img">
                    <div className="csr-campaign-img-placeholder" />
                    <span className="csr-campaign-tag">{campaign.category}</span>
                  </div>
                  <div className="csr-campaign-body">
                    <h3 className="csr-campaign-title">{campaign.title}</h3>
                    <p className="csr-campaign-desc">{campaign.description}</p>
                    <div className="csr-progress-wrap">
                      <div className="csr-progress-row">
                        <span className="csr-raised">{formatCurrency(campaign.raised)}</span>
                        <span className="csr-goal">of {formatCurrency(campaign.goal)}</span>
                      </div>
                      <div className="csr-progress-bar"><div className="csr-progress-fill" style={{ width: `${Math.min(pct, 100)}%` }} /></div>
                    </div>
                    <div className="csr-campaign-footer">
                      <span className="csr-days-left"><Clock size={14} color="#10b981" /> {campaign.daysLeft} days left</span>
                      <button className="csr-donate-btn" onClick={() => document.getElementById('contribution-form')?.scrollIntoView({ behavior: 'smooth' })}>
                        <Heart size={14} /> Donate
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contribution Form */}
      <section className="csr-section" id="contribution-form">
        <div className="csr-section-inner csr-form-wrap">
          <h2 className="csr-section-title">Make a Contribution</h2>
          <p className="csr-section-desc">Every contribution counts towards building a better future for Indian farmers.</p>
          {submitted ? (
            <div className="csr-success-card">
              <CheckCircle size={56} color="#10b981" />
              <h3>Thank You for Your Contribution!</h3>
              <p>Your generous donation will help transform farmers' lives. We appreciate your support!</p>
              <button className="csr-submit-btn" style={{ maxWidth: 240 }} onClick={() => setSubmitted(false)}>Make Another Contribution</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="csr-form">
              {/* Personal Details */}
              <div className="csr-form-card">
                <h3 className="csr-form-card-title">Your Details</h3>
                <div className="csr-form-row">
                  <div className="csr-form-group"><label>Full Name *</label><input required placeholder="Enter your name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
                  <div className="csr-form-group"><label>Email *</label><input type="email" required placeholder="your@email.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
                </div>
                <div className="csr-form-group"><label>Phone Number</label><input type="tel" placeholder="+91 XXXXX XXXXX" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} /></div>
              </div>

              {/* Amount */}
              <div className="csr-form-card">
                <h3 className="csr-form-card-title">Select Amount</h3>
                <div className="csr-amount-grid">
                  {presetAmounts.map(amt => (
                    <button key={amt} type="button" onClick={() => setFormData({...formData, amount: amt.toString()})} className={`csr-amount-btn ${formData.amount === amt.toString() ? 'active' : ''}`}>₹{amt.toLocaleString('en-IN')}</button>
                  ))}
                </div>
                <div className="csr-form-group" style={{ marginTop: '0.75rem' }}>
                  <label>Or enter custom amount</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }}>₹</span>
                    <input type="number" placeholder="Enter amount" min="100" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} style={{ paddingLeft: '2rem' }} />
                  </div>
                </div>
              </div>

              {/* Campaign */}
              <div className="csr-form-card">
                <h3 className="csr-form-card-title">Choose Campaign</h3>
                <div className="csr-form-group">
                  <select required value={formData.campaign} onChange={e => setFormData({...formData, campaign: e.target.value})}>
                    <option value="">Select a campaign</option>
                    {campaignsList.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              {/* Payment Method */}
              <div className="csr-form-card">
                <h3 className="csr-form-card-title">Payment Method</h3>
                <div className="csr-payment-methods">
                  {[{id:'upi', icon: Smartphone, label:'UPI'}, {id:'card', icon: CreditCard, label:'Card'}, {id:'netbanking', icon: Building2, label:'Net Banking'}].map(m => (
                    <button key={m.id} type="button" onClick={() => setFormData({...formData, paymentMethod: m.id})} className={`csr-payment-btn ${formData.paymentMethod === m.id ? 'active' : ''}`}>
                      <m.icon size={20} /> {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message & Options */}
              <div className="csr-form-group"><label>Message (optional)</label><textarea rows={3} placeholder="Share why you're contributing..." value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} /></div>
              <label className="csr-checkbox-label"><input type="checkbox" checked={formData.anonymous} onChange={e => setFormData({...formData, anonymous: e.target.checked})} /><span>Make this donation anonymous</span></label>
              <label className="csr-checkbox-label"><input type="checkbox" checked={formData.recurring} onChange={e => setFormData({...formData, recurring: e.target.checked})} /><span>Make this a monthly recurring donation</span></label>

              <button type="submit" disabled={isProcessing || !formData.amount} className="csr-submit-btn">
                <Heart size={20} />
                {isProcessing ? 'Processing...' : `Donate ${formData.amount ? `₹${Number(formData.amount).toLocaleString('en-IN')}` : 'Now'}`}
              </button>
              <p className="csr-form-note">All donations are eligible for 80G tax benefits. You will receive a receipt via email.</p>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
