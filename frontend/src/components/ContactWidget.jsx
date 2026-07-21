import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import './ContactWidget.css';

export default function ContactWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    purpose: '',
    email: ''
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', contact: '', purpose: '', email: '' });
        setTimeout(() => {
          setIsOpen(false);
          setStatus('idle');
        }, 3000);
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Failed to send message.');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('A network error occurred. Please try again later.');
    }
  };

  return (
    <>
      {/* Sticky Button */}
      <motion.button
        className="contact-sticky-btn"
        onClick={() => setIsOpen(true)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircle size={24} className="contact-icon" />
        <span className="contact-tooltip">Contact Us</span>
      </motion.button>

      {/* Modal Popup */}
      <AnimatePresence>
        {isOpen && (
          <div className="contact-modal-overlay">
            <motion.div
              className="contact-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              className="contact-modal-content"
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {/* Glow effects */}
              <div className="contact-glow contact-glow-blue" />
              <div className="contact-glow contact-glow-green" />

              <button className="contact-close-btn" onClick={() => setIsOpen(false)}>
                <X size={20} />
              </button>

              <h2 className="contact-title">Let's Connect</h2>
              <p className="contact-desc">Drop us a line and our team will get back to you shortly.</p>

              {status === 'success' ? (
                <motion.div 
                  className="contact-success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="success-icon-wrap">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3>Message Sent!</h3>
                  <p>Thank you for reaching out.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="contact-input-group">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="contact-input-group">
                    <label htmlFor="email">Email ID</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder="jane@example.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="contact-input-group">
                    <label htmlFor="contact">Contact Number</label>
                    <input
                      type="tel"
                      id="contact"
                      name="contact"
                      placeholder="+91 99999 99999"
                      value={formData.contact}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="contact-input-group">
                    <label htmlFor="purpose">Purpose of Inquiry</label>
                    <textarea
                      id="purpose"
                      name="purpose"
                      required
                      placeholder="How can we help you?"
                      rows="4"
                      value={formData.purpose}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  {status === 'error' && (
                    <div className="contact-error">{errorMessage}</div>
                  )}

                  <button 
                    type="submit" 
                    className="contact-submit-btn"
                    disabled={status === 'loading'}
                  >
                    {status === 'loading' ? (
                      <Loader2 className="spinner" size={20} />
                    ) : (
                      <>
                        Send Message
                        <Send size={18} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
