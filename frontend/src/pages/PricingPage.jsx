// PricingPage.jsx – TOTALLY NEW DESIGN (light theme, blue accent, no 3D)
import WebsiteLayout from './WebsiteLayout';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const PricingPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessType: 'Amazon Seller',
    message: ''
  });
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  useEffect(() => {
    // Hero animations
    gsap.fromTo(
      '.hero-title',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    );

    // Feature cards
    gsap.fromTo(
      '.feature-card',
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.15,
        scrollTrigger: {
          trigger: '.features-grid',
          start: 'top 85%'
        }
      }
    );

    // Pricing tables
    gsap.fromTo(
      '.pricing-table',
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.pricing-tables',
          start: 'top 85%'
        }
      }
    );

    // Bundling cards
    gsap.fromTo(
      '.bundling-card',
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 0.6,
        scrollTrigger: {
          trigger: '.bundling-grid',
          start: 'top 85%'
        }
      }
    );

    // Add-ons
    gsap.fromTo(
      '.addon-item',
      { opacity: 0, y: 15 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.08,
        duration: 0.5,
        scrollTrigger: {
          trigger: '.addons-grid',
          start: 'top 85%'
        }
      }
    );

    // Why choose
    gsap.fromTo(
      '.why-item',
      { opacity: 0, x: -15 },
      {
        opacity: 1,
        x: 0,
        stagger: 0.1,
        duration: 0.6,
        scrollTrigger: {
          trigger: '.why-grid',
          start: 'top 85%'
        }
      }
    );

    // CTA
    gsap.fromTo(
      '.cta-section',
      { opacity: 0, scale: 0.98 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        scrollTrigger: {
          trigger: '.cta-section',
          start: 'top 85%'
        }
      }
    );
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Quote request:', formData);
    alert('Thank you! We will contact you shortly with your free quote.');
    setShowQuoteModal(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      businessType: 'Amazon Seller',
      message: ''
    });
  };

  return (
    <WebsiteLayout>
      <div className="bg-gray-50 min-h-screen text-gray-800">

        {/* ===== HERO ===== */}
        <section className="py-20 md:py-28 bg-white border-b border-gray-100 text-center">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="hero-title space-y-6">
              <div className="inline-block bg-blue-50 px-4 py-1.5 rounded-full border border-blue-200">
                <span className="text-blue-600 text-sm font-medium">💰 TRANSPARENT PRICING</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900">
                PeaknizerLogistics Fulfillment Pricing
                <span className="block text-blue-600 text-2xl sm:text-3xl md:text-4xl mt-2">Transparent. Affordable. Scalable.</span>
              </h1>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                🚀 Welcome to Peaknizer Logistics, Virginia's and Texas's premier FBA & FBM prep center—designed to power your e-commerce growth without breaking the bank.
              </p>
              <div className="inline-block bg-gray-50 border border-gray-200 rounded-xl px-6 py-4 shadow-sm">
                <p className="text-gray-900 font-semibold text-base sm:text-lg">📍 Arlington, VA & Houston, TX</p>
                <p className="text-gray-500 text-sm">Fully equipped for Amazon FBA prep to Shopify fulfillment.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== VALUE PROPOSITION ===== */}
        <section className="py-12 bg-gray-50 border-b border-gray-100">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto bg-white rounded-xl border border-gray-200 p-6 sm:p-8 text-center shadow-sm hover:border-blue-400 transition-colors">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">⚙️ Simple, Straightforward Pricing</h2>
              <p className="text-xl text-blue-600 font-semibold mb-2">Most Cheapest, But Provides Premium Quality</p>
              <p className="text-gray-600">No Surprises, Just Solutions – Transparent rates from day one</p>
            </div>
          </div>
        </section>

        {/* ===== FBM FULFILLMENT ===== */}
        <section className="py-16 bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900">🔹 FBM Fulfillment</h2>
              <p className="text-gray-600 text-lg">From Just $3 per Order – Ideal for Shopify, Etsy, and WooCommerce Sellers</p>
            </div>

            {/* Feature cards */}
            <div className="features-grid grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
              {[
                { icon: '✅', title: 'Same-Day Fulfillment' },
                { icon: '📦', title: 'No Storage Fees' },
                { icon: '🔄', title: 'No Return Processing Charges' }
              ].map((feature, idx) => (
                <div key={idx} className="feature-card bg-gray-50 rounded-xl border border-gray-200 p-6 text-center hover:border-blue-400 transition-colors shadow-sm hover:shadow-md">
                  <div className="text-4xl mb-2">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                </div>
              ))}
            </div>

            {/* Pricing Table */}
            <div className="pricing-table max-w-4xl mx-auto bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:border-blue-400 transition-colors">
              <div className="bg-blue-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 text-center">Monthly Volume Pricing</h3>
              </div>
              <div className="overflow-x-auto p-4">
                <table className="w-full min-w-[400px]">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-gray-600 font-semibold text-sm uppercase tracking-wider">Monthly Volume</th>
                      <th className="px-4 py-3 text-right text-gray-600 font-semibold text-sm uppercase tracking-wider">Price per Order</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      { vol: '100–999 Orders', price: '$3.00' },
                      { vol: '1,000+ Orders', price: '$2.50' },
                      { vol: '10,000+ Orders', price: '$2.00' }
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-blue-50/50 transition-colors">
                        <td className="px-4 py-4 text-gray-800 font-medium">{row.vol}</td>
                        <td className="px-4 py-4 text-right">
                          <span className="text-2xl font-bold text-blue-600">{row.price}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* ===== FBA PREP SERVICES ===== */}
        <section className="py-16 bg-gray-50 border-b border-gray-100">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900">🔹 FBA Prep Services</h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                Amazon‑compliant services include inspection, labeling, polybagging, bundling, and more—starting at just{' '}
                <span className="text-blue-600 font-bold text-2xl">$0.60/unit!</span>
              </p>
            </div>

            <div className="pricing-table max-w-4xl mx-auto bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:border-blue-400 transition-colors">
              <div className="bg-blue-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 text-center">Prep Service Rates</h3>
              </div>
              <div className="overflow-x-auto p-4">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-gray-600 font-semibold text-sm uppercase tracking-wider">Volume</th>
                      <th className="px-4 py-3 text-center text-gray-600 font-semibold text-sm uppercase tracking-wider">Without Polybag</th>
                      <th className="px-4 py-3 text-right text-gray-600 font-semibold text-sm uppercase tracking-wider">With Box Change</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-blue-50/50 transition-colors">
                      <td className="px-4 py-4 text-gray-800 font-medium">100 Units</td>
                      <td className="px-4 py-4 text-center">
                        <span className="text-2xl font-bold text-blue-600">$0.60/unit</span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="text-2xl font-bold text-blue-600">$2.00/unit</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-blue-50/50 transition-colors">
                      <td className="px-4 py-4 text-gray-800 font-medium">100–500 Units</td>
                      <td className="px-4 py-4 text-center">
                        <span className="text-2xl font-bold text-blue-600">$0.55/unit</span>
                      </td>
                      <td className="px-4 py-4 text-right text-gray-500 italic">Upon Request</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-6 text-center">
              <div className="bg-white rounded-xl border border-gray-200 px-6 py-4 shadow-sm">
                <p className="text-blue-600 font-semibold">🛑 No storage fees for first 30 days</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 px-6 py-4 shadow-sm">
                <p className="text-blue-600 font-semibold">🛑 No hidden charges</p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== BUNDLING SERVICES ===== */}
        <section className="py-16 bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900">🔹 Bundling Services</h2>
              <p className="text-gray-600">From multi-packs to variety packs, we handle it all!</p>
            </div>

            <div className="bundling-grid grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Standard Bundling */}
              <div className="bundling-card bg-gray-50 rounded-xl border border-gray-200 p-6 hover:border-blue-400 transition-colors shadow-sm hover:shadow-md">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="text-2xl font-bold text-gray-900">Standard Bundling</h3>
                  <p className="text-gray-500 text-sm">(Under 11 lbs)</p>
                </div>
                <ul className="mt-4 space-y-3">
                  <li className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700">Pack of 2 (Same SKU):</span>
                    <span className="font-bold text-blue-600 text-xl">$1.00</span>
                  </li>
                  <li className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700">Additional (Same SKU):</span>
                    <span className="font-bold text-blue-600 text-xl">$0.30</span>
                  </li>
                  <li className="flex justify-between items-center py-2">
                    <span className="text-gray-700">Different SKU:</span>
                    <span className="font-bold text-blue-600 text-xl">From $1.50</span>
                  </li>
                </ul>
              </div>

              {/* Oversized Bundling */}
              <div className="bundling-card bg-gray-50 rounded-xl border border-gray-200 p-6 hover:border-blue-400 transition-colors shadow-sm hover:shadow-md">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="text-2xl font-bold text-gray-900">Oversized Bundling</h3>
                  <p className="text-gray-500 text-sm">(11+ lbs)</p>
                </div>
                <ul className="mt-4 space-y-3">
                  <li className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700">Under 20 lbs:</span>
                    <span className="font-bold text-blue-600 text-xl">$2.50</span>
                  </li>
                  <li className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700">20–30 lbs:</span>
                    <span className="font-bold text-blue-600 text-xl">$3.50</span>
                  </li>
                  <li className="flex justify-between items-center py-2">
                    <span className="text-gray-700">30+ lbs:</span>
                    <span className="font-bold text-blue-600 text-xl">$4.50</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ===== ADD-ON SERVICES ===== */}
        <section className="py-16 bg-gray-50 border-b border-gray-100">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">🔹 Add-On Services – Customize Your Prep!</h2>
            <div className="addons-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                { service: 'Sticker/Tag Removal', price: '$0.30/unit' },
                { service: 'Expiry Date Label', price: '$0.20/unit' },
                { service: 'Promo Inserts', price: '$0.10/unit' },
                { service: 'Liquid Induction Seal', price: '$0.50/unit' },
                { service: 'Pro Product Photos', price: '$35 (5 photos)' }
              ].map((item, index) => (
                <div key={index} className="addon-item bg-white rounded-xl border border-gray-200 p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 hover:border-blue-400 transition-colors shadow-sm hover:shadow-md">
                  <span className="text-gray-800 font-medium">{item.service}</span>
                  <span className="text-blue-600 font-bold text-lg bg-blue-50 px-4 py-1 rounded-full border border-blue-200 whitespace-nowrap">{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== PACKAGING & STORAGE (two tables) ===== */}
        <section className="py-16 bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
              {/* Packaging Materials */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-4xl">📦</span> Packaging Materials
                </h2>
                <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:border-blue-400 transition-colors">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[400px]">
                      <thead className="bg-white border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-gray-600 font-semibold text-sm uppercase">Type</th>
                          <th className="px-4 py-3 text-left text-gray-600 font-semibold text-sm uppercase">Size</th>
                          <th className="px-4 py-3 text-right text-gray-600 font-semibold text-sm uppercase">Price</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {[
                          { type: 'Poly Bags', size: 'Small to XL', price: '$0.40 – $0.70' },
                          { type: 'Shrink Wrap', size: 'Small to Standard', price: '$0.40 – $0.30' },
                          { type: 'Bubble Wrap', size: 'Small to Large', price: '$0.40 – $0.70' },
                          { type: 'Fragile Wrap', size: '–', price: '$1.50' },
                          { type: 'Shipping Boxes', size: 'Small to Custom', price: '$2.00 – $4.50' }
                        ].map((item, idx) => (
                          <tr key={idx} className="hover:bg-blue-50/50 transition-colors">
                            <td className="px-4 py-3 text-gray-800 font-medium">{item.type}</td>
                            <td className="px-4 py-3 text-gray-500">{item.size}</td>
                            <td className="px-4 py-3 text-right font-bold text-blue-600">{item.price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Storage & Handling */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-4xl">🏷️</span> Storage & Handling
                </h2>
                <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:border-blue-400 transition-colors">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[300px]">
                      <thead className="bg-white border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-gray-600 font-semibold text-sm uppercase">Type</th>
                          <th className="px-4 py-3 text-right text-gray-600 font-semibold text-sm uppercase">Price</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {[
                          { type: 'Standard Pallet (Monthly)', price: '$30/pallet' },
                          { type: 'Small Box Storage', price: '$2.00/box' },
                          { type: 'Carton Handling (<30 lbs)', price: '$2.95 – $4.95' },
                          { type: 'Pallet Shrink Wrap', price: '$25/pallet' }
                        ].map((item, idx) => (
                          <tr key={idx} className="hover:bg-blue-50/50 transition-colors">
                            <td className="px-4 py-3 text-gray-800 font-medium">{item.type}</td>
                            <td className="px-4 py-3 text-right font-bold text-blue-600">{item.price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== WHY CHOOSE US ===== */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
              🌟 Why E-Commerce Sellers Choose <span className="text-blue-600">PeaknizerLogistics</span>
            </h2>
            <div className="why-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
              {[
                'Same-Day Shipping',
                'Transparent, Startup-Friendly Pricing',
                'No Long-Term Contracts',
                'Houston-Based, Prime U.S. Location',
                '100% Amazon-Compliant Processes'
              ].map((item, index) => (
                <div key={index} className="why-item bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-3 hover:border-blue-400 transition-colors shadow-sm hover:shadow-md">
                  <span className="text-blue-500 text-2xl">✅</span>
                  <p className="text-gray-800 font-medium">{item}</p>
                </div>
              ))}
            </div>

            <div className="max-w-4xl mx-auto bg-white rounded-xl border border-gray-200 p-6 text-center shadow-sm hover:border-blue-400 transition-colors">
              <p className="text-xl font-semibold text-gray-900 mb-4">🎯 Perfect Ecosystem For:</p>
              <div className="flex flex-wrap justify-center gap-3">
                {['Amazon FBA Sellers', 'Shopify & Etsy Store Owners', 'DTC Brands Scaling Up', 'Retailers Outsourcing Logistics'].map((item, idx) => (
                  <span key={idx} className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium border border-blue-200">{item}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="cta-section py-20 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">📞 Let's Get You Started Today!</h2>
            <p className="text-blue-50 text-lg mb-8 max-w-2xl mx-auto">Got 100 units or 10,000? We scale with you seamlessly.</p>
            <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8 text-left">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <p className="text-blue-200 text-xs uppercase tracking-wider font-bold">📍 Location</p>
                <p className="text-white font-semibold text-sm">Arlington, VA & Houston, TX</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <p className="text-blue-200 text-xs uppercase tracking-wider font-bold">📧 Email</p>
                <p className="text-white font-semibold text-sm break-all">info@peaknizerlogistics.com</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <p className="text-blue-200 text-xs uppercase tracking-wider font-bold">📞 Call</p>
                <p className="text-white font-semibold text-lg">+1 571-307-4461</p>
              </div>
            </div>
            <button
              onClick={() => setShowQuoteModal(true)}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              💰 GET FREE PRICE QUOTE INSTANTLY
            </button>
          </div>
        </section>

        {/* ===== QUOTE MODAL (Light version) ===== */}
        {showQuoteModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 md:p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">📊 Get Your Free Quote</h3>
                  <p className="text-gray-500 text-sm">We’ll respond within 24 hours</p>
                </div>
                <button
                  onClick={() => setShowQuoteModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 outline-none transition"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 outline-none transition"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 outline-none transition"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 outline-none transition"
                  >
                    <option>Amazon Seller</option>
                    <option>Shopify Store</option>
                    <option>Etsy Seller</option>
                    <option>WooCommerce</option>
                    <option>DTC Brand</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 outline-none transition resize-none"
                    placeholder="Tell us about your inventory needs, volume, or special requests..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  🚀 Submit Quote Request
                </button>
                <p className="text-xs text-gray-400 text-center">🔒 Secure • No spam</p>
              </form>
            </div>
          </div>
        )}
      </div>
    </WebsiteLayout>
  );
};

export default PricingPage;