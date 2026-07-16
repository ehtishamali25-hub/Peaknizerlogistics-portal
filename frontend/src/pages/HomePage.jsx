// HomePage.jsx - TOTALLY NEW DESIGN (Light theme, blue accent, fresh layout)
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import WebsiteLayout from './WebsiteLayout';

gsap.registerPlugin(ScrollTrigger);

// Counter component – simple, clean
const Counter = ({ end, label }) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2500;
    const stepTime = Math.max(10, Math.floor(duration / end));
    const timer = setInterval(() => {
      start += Math.ceil(end / (duration / stepTime));
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setValue(start);
    }, stepTime);
    return () => clearInterval(timer);
  }, [end]);

  return (
    <div className="text-center border-r border-gray-200 last:border-0 px-6 flex-1">
      <div className="text-4xl sm:text-5xl font-bold text-blue-600">{value.toLocaleString()}+</div>
      <div className="text-gray-500 text-sm uppercase tracking-wider">{label}</div>
    </div>
  );
};

const HomePage = () => {
  const [lead, setLead] = useState({ name: '', email: '', phone: '', note: '' });
  const [submitting, setSubmitting] = useState(false);
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const featuresRef = useRef(null);

  const handleChange = (e) => setLead({ ...lead, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSubmitting(false);
    alert('🎉 Thanks! We received your request. Expect a response within 24 hours!');
    setLead({ name: '', email: '', phone: '', note: '' });
  };

  useEffect(() => {
    gsap.fromTo(heroRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    );
    ScrollTrigger.create({
      trigger: statsRef.current,
      start: 'top 80%',
      onEnter: () => gsap.from('.stat-item', { opacity: 0, y: 15, stagger: 0.15, duration: 0.6 })
    });
    ScrollTrigger.create({
      trigger: featuresRef.current,
      start: 'top 85%',
      onEnter: () => gsap.from('.feature-card', { opacity: 0, y: 15, stagger: 0.1, duration: 0.6 })
    });
  }, []);

  return (
    <WebsiteLayout>
      <div className="bg-gray-50 min-h-screen text-gray-800">

        {/* Hero Section – light background */}
        <header ref={heroRef} className="py-20 md:py-28 bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left */}
              <div className="space-y-6">
                <div className="inline-block bg-blue-50 px-4 py-1.5 rounded-full border border-blue-200">
                  <span className="text-blue-600 text-sm font-medium">🚀 3PL Fulfillment</span>
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-gray-900">
                  Next-Gen <span className="text-blue-600">3PL</span>
                  <br />
                  <span className="text-2xl sm:text-3xl text-gray-600">Warehouse Operations</span>
                </h1>
                <p className="text-gray-600 text-lg max-w-md leading-relaxed">
                  Lightning‑fast fulfillment, real‑time tracking, and nationwide coverage – all in one platform.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all">
                    Start Free Trial →
                  </Link>
                  <Link to="/pricing" className="border border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-all">
                    View Pricing
                  </Link>
                </div>
                <div className="flex flex-wrap gap-6 text-sm text-gray-500">
                  <span>✅ 2,500+ Brands</span>
                  <span>✅ 60K Orders/Month</span>
                  <span>✅ 99.9% On‑Time</span>
                </div>
              </div>

              {/* Right – Form (white card, clean) */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">🚚 Get Instant Quote</h3>
                <p className="text-gray-500 text-sm mb-5">Free analysis in 24 hours • No commitment</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input name="name" value={lead.name} onChange={handleChange} required placeholder="Your Name" className="w-full border border-gray-300 text-gray-900 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 outline-none transition" />
                  <input name="email" value={lead.email} onChange={handleChange} type="email" required placeholder="Business Email" className="w-full border border-gray-300 text-gray-900 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 outline-none transition" />
                  <div className="grid grid-cols-2 gap-3">
                    <input name="phone" value={lead.phone} onChange={handleChange} placeholder="Phone" className="border border-gray-300 text-gray-900 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 outline-none transition" />
                    <select className="border border-gray-300 text-gray-900 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 outline-none transition appearance-none">
                      <option>Amazon Seller</option>
                      <option>Shopify Store</option>
                      <option>Etsy/WooCommerce</option>
                    </select>
                  </div>
                  <textarea name="note" value={lead.note} onChange={handleChange} placeholder="Monthly volume? Special requirements?" rows={2} className="w-full border border-gray-300 text-gray-900 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 outline-none transition resize-none" />
                  <button type="submit" disabled={submitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-60">
                    {submitting ? 'Processing...' : '🚀 Get My Free Quote'}
                  </button>
                  <p className="text-xs text-gray-400 text-center">🔒 Secure • No spam</p>
                </form>
              </div>
            </div>
          </div>
        </header>

        {/* Stats – separated by borders, no cards */}
        <section ref={statsRef} className="py-16 bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Performance at a Glance</h2>
            <div className="flex flex-wrap justify-center max-w-3xl mx-auto">
              <div className="stat-item"><Counter end={2593} label="Active Brands" /></div>
              <div className="stat-item"><Counter end={100020} label="Deliveries This Month" /></div>
              <div className="stat-item"><Counter end={60000} label="Orders Processed" /></div>
            </div>
          </div>
        </section>

        {/* Features – clean cards with borders */}
        <section ref={featuresRef} className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Why 2,500+ Brands Choose Us</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: '💰', title: 'Unbeatable Pricing', desc: 'From $2/order • 30‑day free storage' },
                { icon: '⚡', title: 'Lightning Fulfillment', desc: 'Same‑day processing • 99.9% accuracy' },
                { icon: '🔒', title: 'Amazon FBA Ready', desc: 'Certified prep services' },
                { icon: '👥', title: '24/7 Support', desc: 'Dedicated managers • Real‑time chat' }
              ].map((feature, i) => (
                <div key={i} className="feature-card bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-400 transition-colors duration-300 shadow-sm hover:shadow-md">
                  <div className="text-4xl mb-3">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process – vertical timeline (instead of cards) */}
        <section className="py-16 bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">4‑Step Fulfillment Process</h2>
            <div className="max-w-3xl mx-auto space-y-8">
              {[
                { num: '01', title: 'Inventory Receive', desc: 'AI‑powered inspection', icon: '📦' },
                { num: '02', title: 'Smart Storage', desc: 'Optimized slotting', icon: '🏬' },
                { num: '03', title: 'Lightning Pick/Pack', desc: '99.9% accuracy', icon: '⚡' },
                { num: '04', title: 'Intelligent Shipping', desc: 'Carrier optimization', icon: '🚚' }
              ].map((step, idx) => (
                <div key={step.num} className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                    {step.num}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{step.icon}</span>
                      <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                    </div>
                    <p className="text-gray-500 mt-1">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trusted Brands – pill style */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">🏆 Trusted By Industry Leaders</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {['Amazon', 'Shopify', 'Flipkart', 'Etsy', 'Walmart', 'eBay'].map(brand => (
                <span key={brand} className="bg-white border border-gray-200 rounded-full px-6 py-2 text-sm font-medium text-gray-700 hover:border-blue-400 hover:text-blue-600 transition-colors">
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* CTA – blue gradient */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to <span className="text-yellow-300">10x</span> Your Fulfillment?</h2>
            <p className="text-blue-50 text-lg mb-8 max-w-2xl mx-auto">Join 2,500+ brands automating their logistics. Zero risk, massive upside.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">🚀 Start Free Trial</Link>
              <Link to="/pricing" className="bg-white/20 backdrop-blur-sm text-white px-8 py-3 rounded-lg font-semibold text-lg border border-white/30 hover:bg-white/30 transition-all">💰 See Transparent Pricing</Link>
            </div>
          </div>
        </section>
      </div>
    </WebsiteLayout>
  );
};

export default HomePage;