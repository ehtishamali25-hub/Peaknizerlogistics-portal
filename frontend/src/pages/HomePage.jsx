// HomePage.jsx - PROFESSIONAL, SIMPLE, NO BOXES/3D
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import WebsiteLayout from './WebsiteLayout';

gsap.registerPlugin(ScrollTrigger);

// Counter component (unchanged)
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
    <div className="group relative text-center">
      <div className="relative bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 sm:p-8 hover:border-orange-500/50 transition-all duration-500">
        <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-orange-500 mb-2">
          {value.toLocaleString()}+
        </div>
        <div className="text-gray-400 font-medium uppercase tracking-wider text-sm sm:text-base">{label}</div>
      </div>
    </div>
  );
};

const HomePage = () => {
  const [lead, setLead] = useState({ name: '', email: '', phone: '', note: '' });
  const [submitting, setSubmitting] = useState(false);
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const whyRef = useRef(null);

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
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    );
    ScrollTrigger.create({
      trigger: statsRef.current,
      start: 'top 80%',
      onEnter: () => gsap.from('.counter-card', { scale: 0.95, opacity: 0, y: 20, stagger: 0.2, duration: 0.8 })
    });
    ScrollTrigger.create({
      trigger: whyRef.current,
      start: 'top 85%',
      onEnter: () => gsap.from('.why-card', { opacity: 0, y: 30, stagger: 0.15, duration: 0.8 })
    });
  }, []);

  return (
    <WebsiteLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950">
        {/* Hero Section */}
        <header ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden py-20">
          {/* Decorative background */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-orange-600/5" />
          <div className="absolute top-0 right-0 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left content */}
              <div className="text-center lg:text-left space-y-6">
                <div className="inline-block bg-orange-500/10 px-4 py-1.5 rounded-full border border-orange-500/30 backdrop-blur-sm">
                  <span className="text-orange-400 font-medium uppercase tracking-wider text-xs">🚀 3PL Fulfillment</span>
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white">
                  Next-Gen <span className="text-orange-500">3PL</span>
                  <br />
                  <span className="text-2xl sm:text-3xl md:text-4xl text-gray-300">Warehouse Operations</span>
                </h1>
                <p className="text-base sm:text-lg text-gray-400 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                  Lightning‑fast fulfillment, real‑time tracking, and nationwide coverage – all in one platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                  <Link to="/login" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold text-base shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5">
                    Start Free Trial →
                  </Link>
                  <Link to="/pricing" className="border border-gray-600 hover:border-orange-500 text-gray-300 hover:text-white px-8 py-3 rounded-lg font-semibold text-base transition-all">
                    View Pricing
                  </Link>
                </div>
                <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-gray-500">
                  <span>✅ 2,500+ Brands</span>
                  <span>✅ 60K Orders/Month</span>
                  <span>✅ 99.9% On‑Time</span>
                </div>
              </div>

              {/* Right form - clean card */}
              <div className="relative">
                <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 sm:p-8 shadow-2xl">
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">🚚 Get Instant Quote</h3>
                  <p className="text-gray-400 text-sm mb-6">Free analysis in 24 hours • No commitment</p>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="name" value={lead.name} onChange={handleChange} required placeholder="Your Name" className="w-full bg-gray-800/50 border border-gray-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 outline-none transition" />
                    <input name="email" value={lead.email} onChange={handleChange} type="email" required placeholder="Business Email" className="w-full bg-gray-800/50 border border-gray-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 outline-none transition" />
                    <div className="grid grid-cols-2 gap-3">
                      <input name="phone" value={lead.phone} onChange={handleChange} placeholder="Phone" className="bg-gray-800/50 border border-gray-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 outline-none transition" />
                      <select className="bg-gray-800/50 border border-gray-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 outline-none transition appearance-none">
                        <option>Amazon Seller</option>
                        <option>Shopify Store</option>
                        <option>Etsy/WooCommerce</option>
                      </select>
                    </div>
                    <textarea name="note" value={lead.note} onChange={handleChange} placeholder="Monthly volume? Special requirements?" rows={2} className="w-full bg-gray-800/50 border border-gray-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 outline-none transition resize-none" />
                    <button type="submit" disabled={submitting} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg text-base shadow-lg hover:shadow-xl transition-all disabled:opacity-60">
                      {submitting ? 'Processing...' : '🚀 Get My Free Quote'}
                    </button>
                    <p className="text-xs text-gray-500 text-center pt-2">🔒 Secure • No spam</p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Stats */}
        <section ref={statsRef} className="py-16 md:py-24 bg-black/40">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white">Performance at a Glance</h2>
              <p className="text-gray-400 mt-2">Real-time metrics from our network</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="counter-card"><Counter end={2593} label="Active Brands" /></div>
              <div className="counter-card"><Counter end={100020} label="Deliveries This Month" /></div>
              <div className="counter-card"><Counter end={60000} label="Orders Processed" /></div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section ref={whyRef} className="py-16 md:py-24 bg-gradient-to-b from-black/60 to-gray-900/30">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white">Why 2,500+ Brands Choose Us</h2>
              <p className="text-gray-400 mt-2">Enterprise-grade 3PL powered by cutting-edge automation</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: '💰', title: 'Unbeatable Pricing', desc: 'From $2/order • 30-day free storage' },
                { icon: '⚡', title: 'Lightning Fulfillment', desc: 'Same-day processing • 99.9% accuracy' },
                { icon: '🔒', title: 'Amazon FBA Ready', desc: 'Certified prep services' },
                { icon: '👥', title: '24/7 Support', desc: 'Dedicated managers • Real-time chat' }
              ].map((feature, i) => (
                <div key={i} className="why-card bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 sm:p-8 hover:border-orange-500/50 hover:shadow-lg transition-all duration-300">
                  <div className="text-4xl sm:text-5xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Steps - Clean Timeline */}
        <section className="py-16 md:py-24 bg-black/40">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white">4-Step Fulfillment Process</h2>
              <p className="text-gray-400 mt-2">From receiving to shipping – fully automated</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { num: '01', title: 'Inventory Receive', desc: 'AI-powered inspection', icon: '📦' },
                { num: '02', title: 'Smart Storage', desc: 'Optimized slotting', icon: '🏬' },
                { num: '03', title: 'Lightning Pick/Pack', desc: '99.9% accuracy', icon: '⚡' },
                { num: '04', title: 'Intelligent Shipping', desc: 'Carrier optimization', icon: '🚚' }
              ].map(step => (
                <div key={step.num} className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 text-center hover:border-orange-500/50 transition-all">
                  <div className="text-3xl mb-3">{step.icon}</div>
                  <div className="text-4xl font-bold text-orange-500 mb-2">{step.num}</div>
                  <h3 className="text-lg font-semibold text-white mb-1">{step.title}</h3>
                  <p className="text-gray-400 text-sm">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trusted Brands */}
        <section className="py-12 bg-black/30">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white">🏆 Trusted By Industry Leaders</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 items-center">
              {['Amazon', 'Shopify', 'Flipkart', 'Etsy', 'Walmart', 'eBay'].map(brand => (
                <div key={brand} className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/30 rounded-xl py-3 text-center text-gray-300 font-medium hover:text-orange-400 hover:border-orange-500/50 transition-all">
                  {brand}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-gradient-to-r from-orange-600 to-orange-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">Ready to <span className="text-yellow-300">10x</span> Your Fulfillment?</h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">Join 2,500+ brands automating their logistics. Zero risk, massive upside.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login" className="bg-black text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition">🚀 Start Free Trial</Link>
              <Link to="/pricing" className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold text-lg border border-white/30 hover:bg-white/30 transition">💰 See Transparent Pricing</Link>
            </div>
          </div>
        </section>
      </div>
    </WebsiteLayout>
  );
};

export default HomePage;