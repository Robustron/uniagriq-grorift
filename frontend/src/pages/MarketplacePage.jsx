import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import { Package, Shapes, Tags, ShieldCheck, Search, Filter, ShoppingCart, Plus, Minus, X, ArrowRight, TrendingDown } from 'lucide-react';
import './MarketplacePage.css';

const products = [
  { id: 1, name: 'Premium Sona Masoori Rice', category: 'Grains', price: 1200, unit: 'per 25kg bag', origin: 'Karnataka', verified: true, image: 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?w=400&q=80', description: 'Export quality, aged for 12 months.' },
  { id: 2, name: 'Organic Turmeric Finger', category: 'Spices', price: 250, unit: 'per kg', origin: 'Tamil Nadu', verified: true, image: 'https://images.unsplash.com/photo-1615486171448-4fdcf55cbdbb?w=400&q=80', description: 'High curcumin content (>5%), sun-dried.' },
  { id: 3, name: 'Fresh Alphonso Mangoes', category: 'Fruits', price: 800, unit: 'per dozen', origin: 'Maharashtra', verified: true, image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&q=80', description: 'GI Tagged, naturally ripened.' },
  { id: 4, name: 'Cold Pressed Mustard Oil', category: 'Value-Added', price: 450, unit: 'per 2L', origin: 'Punjab', verified: true, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80', description: '100% pure Kacchi Ghani.' },
  { id: 5, name: 'Export Grade Onion', category: 'Vegetables', price: 1800, unit: 'per 50kg bag', origin: 'Nashik, MH', verified: true, image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&q=80', description: 'Long shelf life, low moisture content.' },
  { id: 6, name: 'Robusta Coffee Beans', category: 'Plantation', price: 320, unit: 'per kg', origin: 'Coorg, KA', verified: true, image: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=400&q=80', description: 'Shade-grown, hand-picked.' }
];

const categories = ['All', 'Grains', 'Spices', 'Fruits', 'Vegetables', 'Value-Added', 'Plantation'];

export default function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);

  const filtered = products.filter(p => {
    const matchCat = selectedCat === 'All' || p.category === selectedCat;
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const updateCart = (id, delta) => {
    setCart(prev => {
      const next = { ...prev };
      const current = next[id] || 0;
      const val = current + delta;
      if (val <= 0) delete next[id];
      else next[id] = val;
      return next;
    });
  };

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = Object.entries(cart).reduce((total, [id, qty]) => {
    const p = products.find(prod => prod.id === parseInt(id));
    return total + (p ? p.price * qty : 0);
  }, 0);

  return (
    <main className="marketplace-page">
      <PageHeader title="Universal Agriculture Market" icon={Package} iconColor="#10b981" />

      <div className="marketplace-layout">
        <div className="marketplace-content">
          
          {/* Header Banner */}
          <section className="mp-header-banner">
            <div className="mp-header-bg-glow" />
            <div className="mp-header-inner">
              <div className="mp-badge"><ShieldCheck size={14} /> Verified Direct Sourcing</div>
              <h1 className="mp-title">The Universal Agriculture Market</h1>
              <p className="mp-desc">Source transparently from verified farms. Direct supply chains with premium-grade quality standards.</p>
              
              <div className="mp-stats-row">
                <div className="mp-stat"><div className="mp-stat-icon"><Package size={18} /></div><div><p className="mp-stat-val">100+</p><p className="mp-stat-label">Total Crops</p></div></div>
                <div className="mp-stat"><div className="mp-stat-icon"><Shapes size={18} /></div><div><p className="mp-stat-val">6</p><p className="mp-stat-label">Categories</p></div></div>
                <div className="mp-stat"><div className="mp-stat-icon"><Tags size={18} /></div><div><p className="mp-stat-val">15+</p><p className="mp-stat-label">Value-Added</p></div></div>
              </div>
            </div>
          </section>

          {/* Search & Filter */}
          <section className="mp-toolbar">
            <div className="mp-search-box">
              <Search size={18} />
              <input type="text" placeholder="Search products..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <div className="mp-categories">
              {categories.map(c => (
                <button key={c} onClick={() => setSelectedCat(c)} className={`mp-cat-btn ${selectedCat === c ? 'active' : ''}`}>{c}</button>
              ))}
            </div>
            <button className="mp-cart-toggle" onClick={() => setCartOpen(true)}>
              <ShoppingCart size={18} />
              {totalItems > 0 && <span className="mp-cart-badge">{totalItems}</span>}
            </button>
          </section>

          {/* Product Grid */}
          <section className="mp-grid">
            {filtered.length === 0 ? (
              <div className="mp-empty">No products found.</div>
            ) : (
              filtered.map(p => (
                <div key={p.id} className="mp-product-card">
                  <div className="mp-product-img" style={{ backgroundImage: `url(${p.image})` }}>
                    <div className="mp-product-tag">{p.category}</div>
                  </div>
                  <div className="mp-product-body">
                    <div className="mp-product-verified"><ShieldCheck size={14} color="#10b981" /> Verified Origin: {p.origin}</div>
                    <h3 className="mp-product-name">{p.name}</h3>
                    <p className="mp-product-desc">{p.description}</p>
                    <div className="mp-product-footer">
                      <div className="mp-product-price">₹{p.price} <span className="mp-unit">{p.unit}</span></div>
                      
                      {cart[p.id] ? (
                        <div className="mp-qty-control">
                          <button onClick={() => updateCart(p.id, -1)}><Minus size={14} /></button>
                          <span>{cart[p.id]}</span>
                          <button onClick={() => updateCart(p.id, 1)}><Plus size={14} /></button>
                        </div>
                      ) : (
                        <button className="mp-add-btn" onClick={() => updateCart(p.id, 1)}>Add to Cart</button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </section>

        </div>
      </div>

      {/* Cart Sidebar */}
      <div className={`mp-cart-sidebar ${cartOpen ? 'open' : ''}`}>
        <div className="mp-cart-header">
          <h3>Your Procurement</h3>
          <button onClick={() => setCartOpen(false)}><X size={20} /></button>
        </div>
        
        <div className="mp-cart-items">
          {Object.entries(cart).length === 0 ? (
            <div className="mp-cart-empty">Your procurement list is empty.</div>
          ) : (
            Object.entries(cart).map(([id, qty]) => {
              const p = products.find(prod => prod.id === parseInt(id));
              if (!p) return null;
              return (
                <div key={id} className="mp-cart-item">
                  <div className="mp-cart-item-img" style={{ backgroundImage: `url(${p.image})` }} />
                  <div className="mp-cart-item-info">
                    <h4>{p.name}</h4>
                    <p className="mp-cart-item-price">₹{p.price} x {qty}</p>
                  </div>
                  <div className="mp-qty-control sm">
                    <button onClick={() => updateCart(p.id, -1)}><Minus size={12} /></button>
                    <span>{qty}</span>
                    <button onClick={() => updateCart(p.id, 1)}><Plus size={12} /></button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {Object.entries(cart).length > 0 && (
          <div className="mp-cart-footer">
            <div className="mp-cart-total">
              <span>Total Estimated</span>
              <span>₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
            <button className="mp-checkout-btn">
              Proceed to RFQ <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
      
      {cartOpen && <div className="mp-cart-overlay" onClick={() => setCartOpen(false)} />}
    </main>
  );
}
