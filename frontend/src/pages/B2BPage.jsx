import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import { Handshake, Building2, Users, TrendingUp, Shield, Leaf, Clock, BarChart3, Store, Factory, Truck, Hotel, Building, Warehouse, Send, CheckCircle2 } from 'lucide-react';
import './B2BPage.css';

const benefits = [
  { icon: Shield, title: 'Verified Quality', description: 'All products undergo rigorous quality checks and certifications ensuring premium grade produce.' },
  { icon: Leaf, title: 'Sustainable Sourcing', description: 'Direct farm-to-business model reduces carbon footprint and supports eco-friendly practices.' },
  { icon: Clock, title: 'Reliable Supply', description: 'Our network of 10,000+ farmers ensures consistent supply throughout the year.' },
  { icon: BarChart3, title: 'Competitive Pricing', description: 'Eliminate middlemen and get the best prices directly from farmers.' },
];

const partnershipTypes = [
  { id: 'retailer', icon: Store, title: 'Retailers & Supermarkets', description: 'Stock fresh, farm-direct produce for your customers with quality assurance and competitive pricing.', benefits: ['Weekly delivery schedules', 'Custom packaging options', 'Volume-based discounts', 'Quality certifications'] },
  { id: 'processor', icon: Factory, title: 'Food Processors', description: 'Get bulk raw materials directly from farmers for your processing and manufacturing needs.', benefits: ['Bulk quantity supply', 'Consistent quality grades', 'Seasonal contracts', 'Traceability reports'] },
  { id: 'exporter', icon: Truck, title: 'Exporters', description: 'Access export-quality produce with all necessary documentation and certifications.', benefits: ['Export certifications', 'Cold chain logistics', 'Documentation support', 'Global standards compliance'] },
  { id: 'hospitality', icon: Hotel, title: 'Hotels & Restaurants', description: 'Fresh daily supplies for your kitchen with flexible ordering and delivery options.', benefits: ['Daily fresh deliveries', 'Custom order sizes', 'Seasonal menu planning', 'Farm-to-table traceability'] },
  { id: 'corporate', icon: Building, title: 'Corporate Cafeterias', description: 'Healthy, fresh produce for employee cafeterias with bulk ordering benefits.', benefits: ['Bulk discounts', 'Nutritional information', 'Sustainable sourcing', 'Flexible schedules'] },
  { id: 'distributor', icon: Warehouse, title: 'Distributors', description: 'Partner as a regional distributor and expand our reach to more businesses.', benefits: ['Exclusive territories', 'Marketing support', 'Competitive margins', 'Training programs'] },
];

const businessTypes = ['Retailer / Supermarket', 'Food Processor', 'Exporter', 'Hotel / Restaurant', 'Corporate Cafeteria', 'Distributor', 'Other'];
const volumeRanges = ['Less than 1 ton/month', '1-5 tons/month', '5-20 tons/month', '20-50 tons/month', '50+ tons/month'];

export default function B2BPage() {
  const [selectedType, setSelectedType] = useState('retailer');
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ companyName: '', contactPerson: '', email: '', phone: '', businessType: '', volumeRange: '', products: '', message: '' });

  const selected = partnershipTypes.find(p => p.id === selectedType);

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = `B2B Partnership Inquiry from ${formData.companyName}`;
    const body = `Company: ${formData.companyName}\nContact: ${formData.contactPerson}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nType: ${formData.businessType}\nVolume: ${formData.volumeRange}\nProducts: ${formData.products}\n\n${formData.message}`;
    window.location.href = `mailto:posj2004@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  };

  return (
    <main className="b2b-page">
      <PageHeader title="B2B Partnerships" icon={Handshake} iconColor="#10b981" />

      {/* Hero */}
      <section className="b2b-hero">
        <div className="b2b-hero-glow" />
        <div className="b2b-hero-inner">
          <h1 className="b2b-hero-title">Partner With India's <span className="b2b-hero-accent">Largest Agri Network</span></h1>
          <p className="b2b-hero-desc">Connect directly with 10,000+ verified farmers. Eliminate middlemen, ensure quality, and build a sustainable supply chain.</p>
          <div className="b2b-hero-stats">
            <div className="b2b-stat-card">
              <Building2 size={28} color="#10b981" />
              <p className="b2b-stat-value">150+</p>
              <p className="b2b-stat-label">Active Partners</p>
            </div>
            <div className="b2b-stat-card">
              <Users size={28} color="#10b981" />
              <p className="b2b-stat-value">50,000+</p>
              <p className="b2b-stat-label">Farmers in Network</p>
            </div>
            <div className="b2b-stat-card">
              <TrendingUp size={28} color="#10b981" />
              <p className="b2b-stat-value">30%</p>
              <p className="b2b-stat-label">Average Savings</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Partner */}
      <section className="b2b-section">
        <div className="b2b-section-inner">
          <h2 className="b2b-section-title">Why Partner With Us?</h2>
          <p className="b2b-section-desc">UniAgriQ offers a unique opportunity to connect directly with farmers while ensuring quality and sustainability.</p>
          <div className="b2b-benefits-grid">
            {benefits.map(b => (
              <div key={b.title} className="b2b-benefit-card">
                <div className="b2b-benefit-icon"><b.icon size={24} color="#10b981" /></div>
                <h3 className="b2b-benefit-title">{b.title}</h3>
                <p className="b2b-benefit-desc">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Types */}
      <section className="b2b-section b2b-section-alt">
        <div className="b2b-section-inner">
          <h2 className="b2b-section-title">Partnership Types</h2>
          <p className="b2b-section-desc">Tailored partnership models to suit different business needs.</p>
          <div className="b2b-type-tabs">
            {partnershipTypes.map(type => (
              <button key={type.id} onClick={() => setSelectedType(type.id)} className={`b2b-type-tab ${selectedType === type.id ? 'active' : ''}`}>
                <type.icon size={22} />
                <span>{type.title.split(' ')[0]}</span>
              </button>
            ))}
          </div>
          {selected && (
            <div className="b2b-type-detail">
              <div className="b2b-type-detail-left">
                <div className="b2b-type-icon-wrap"><selected.icon size={28} color="#10b981" /></div>
                <h3 className="b2b-type-detail-title">{selected.title}</h3>
                <p className="b2b-type-detail-desc">{selected.description}</p>
                <button className="b2b-cta-btn" onClick={() => document.getElementById('b2b-contact-form')?.scrollIntoView({ behavior: 'smooth' })}>Become a Partner</button>
              </div>
              <div className="b2b-type-detail-right">
                <h4 className="b2b-type-benefits-title">Key Benefits</h4>
                <ul className="b2b-type-benefits-list">
                  {selected.benefits.map((ben, i) => (
                    <li key={i} className="b2b-type-benefit-item">
                      <span className="b2b-dot" />
                      <span>{ben}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Contact Form */}
      <section className="b2b-section" id="b2b-contact-form">
        <div className="b2b-section-inner b2b-form-wrap">
          <h2 className="b2b-section-title">Contact Our B2B Team</h2>
          <p className="b2b-section-desc">Fill out the form below and our partnership team will reach out within 24–48 hours.</p>
          {submitted ? (
            <div className="b2b-success-card">
              <CheckCircle2 size={48} color="#10b981" />
              <h3>Thank You for Your Interest!</h3>
              <p>Our B2B team will review your inquiry and get back to you within 24–48 business hours.</p>
              <button className="b2b-cta-btn" onClick={() => setSubmitted(false)}>Submit Another Inquiry</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="b2b-form">
              <div className="b2b-form-row">
                <div className="b2b-form-group">
                  <label>Company Name *</label>
                  <input required placeholder="Your company name" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} />
                </div>
                <div className="b2b-form-group">
                  <label>Contact Person *</label>
                  <input required placeholder="Full name" value={formData.contactPerson} onChange={e => setFormData({...formData, contactPerson: e.target.value})} />
                </div>
              </div>
              <div className="b2b-form-row">
                <div className="b2b-form-group">
                  <label>Business Email *</label>
                  <input type="email" required placeholder="email@company.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="b2b-form-group">
                  <label>Phone Number *</label>
                  <input type="tel" required placeholder="+91 98765 43210" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>
              <div className="b2b-form-row">
                <div className="b2b-form-group">
                  <label>Business Type *</label>
                  <select required value={formData.businessType} onChange={e => setFormData({...formData, businessType: e.target.value})}>
                    <option value="">Select business type</option>
                    {businessTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="b2b-form-group">
                  <label>Expected Monthly Volume *</label>
                  <select required value={formData.volumeRange} onChange={e => setFormData({...formData, volumeRange: e.target.value})}>
                    <option value="">Select volume range</option>
                    {volumeRanges.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              <div className="b2b-form-group">
                <label>Products of Interest</label>
                <input placeholder="e.g., Rice, Vegetables, Fruits, Spices" value={formData.products} onChange={e => setFormData({...formData, products: e.target.value})} />
              </div>
              <div className="b2b-form-group">
                <label>Additional Message</label>
                <textarea rows={4} placeholder="Tell us more about your requirements..." value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />
              </div>
              <button type="submit" className="b2b-submit-btn">
                <Send size={18} />
                Submit Partnership Inquiry
              </button>
              <p className="b2b-form-note">By submitting, you agree to our Terms of Service and Privacy Policy.</p>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
