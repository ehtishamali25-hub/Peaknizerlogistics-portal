// HomePage.jsx - NO 3D, PURE CSS + GSAP, ATTRACTIVE UI/UX
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
      <div className="relative bg-gradient-to-br from-gray-900/90 to-black/70 backdrop-blur-xl p-6 sm:p-10 rounded-2xl sm:rounded-3xl border border-orange-500/40 shadow-2xl shadow-orange-500/20 hover:shadow-orange-500/40 hover:scale-[1.02] transition-all duration-700">
        <div className="text-4xl sm:text-5xl md:text-6xl font-black bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-500 bg-clip-text text-transparent mb-3 sm:mb-6 drop-shadow-2xl">
          {value.toLocaleString()}+
        </div>
        <div className="text-gray-300 font-bold uppercase tracking-widest text-sm sm:text-lg">{label}</div>
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/30 via-transparent to-orange-400/30 rounded-2xl sm:rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700 -z-10" />
      </div>
    </div>
  );
};

// Static Warehouse Illustration (CSS only, animated)
const WarehouseIllustration = () => {
  return (
    <div className="relative w-full h-64 sm:h-80 md:h-[450px] rounded-2xl overflow-hidden border-2 border-orange-500/30 shadow-xl bg-gradient-to-b from-gray-900 to-black">
      {/* Floor */}
      <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-gray-800/60 to-transparent" />
      
      {/* Shelves with boxes */}
      <div className="absolute inset-0 flex items-center justify-center space-x-8 md:space-x-12">
        {[1, 2, 3, 4].map((shelf) => (
          <div key={shelf} className="relative flex flex-col items-center space-y-2">
            <div className="w-16 md:w-24 h-24 md:h-32 bg-gray-700/50 rounded-lg shadow-lg border border-orange-500/20" />
            <div className="flex space-x-1">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-orange-500/70 rounded shadow" />
              <div className="w-6 h-6 md:w-8 md:h-8 bg-yellow-500/70 rounded shadow" />
              <div className="w-6 h-6 md:w-8 md:h-8 bg-orange-500/70 rounded shadow" />
            </div>
            <div className="flex space-x-1">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-500/70 rounded shadow" />
              <div className="w-6 h-6 md:w-8 md:h-8 bg-orange-500/70 rounded shadow" />
            </div>
          </div>
        ))}
      </div>

      {/* Animated Truck (CSS) */}
      <div className="absolute bottom-8 left-0 animate-[truckMove_10s_linear_infinite]">
        <div className="flex items-end">
          <div className="w-16 h-10 bg-orange-500 rounded-t-lg relative">
            <div className="absolute -top-6 left-2 w-8 h-6 bg-gray-300 rounded-t-lg" />
            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gray-800 rounded-full" />
            <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-gray-800 rounded-full" />
          </div>
          <div className="w-24 h-14 bg-orange-600 rounded-lg ml-1 relative">
            <div className="absolute -bottom-2 left-2 w-5 h-5 bg-gray-800 rounded-full" />
            <div className="absolute -bottom-2 right-2 w-5 h-5 bg-gray-800 rounded-full" />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes truckMove {
          0% { transform: translateX(-20px); }
          50% { transform: translateX(calc(100vw - 150px)); }
          100% { transform: translateX(-20px); }
        }
        @media (max-width: 640px) {
          .animate-\\[truckMove_10s_linear_infinite\\] {
            animation-duration: 8s;
          }
        }
      `}</style>
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
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    );
    ScrollTrigger.create({
      trigger: statsRef.current,
      start: 'top 80%',
      onEnter: () => gsap.from('.counter-card', { scale: 0.9, opacity: 0, y: 30, stagger: 0.2, duration: 0.8 })
    });
    ScrollTrigger.create({
      trigger: whyRef.current,
      start: 'top 85%',
      onEnter: () => gsap.from('.why-card', { rotationX: 30, opacity: 0, stagger: 0.15, duration: 0.8 })
    });
  }, []);

  return (
    <WebsiteLayout>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        {/* Hero Section */}
        <header ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden py-20">
          <div className="absolute inset-0 bg-grid-white/[0.03] pointer-events-none" />
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left content */}
              <div className="text-center lg:text-left space-y-6 sm:space-y-8">
                <div className="inline-block bg-orange-500/20 px-4 py-2 rounded-full border border-orange-500/40 backdrop-blur-sm">
                  <span className="text-orange-400 font-bold uppercase tracking-wider text-xs sm:text-sm">🚚 3PL Fulfillment Leader</span>
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                  Next-Gen <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">3PL</span>
                  <br />
                  <span className="text-3xl sm:text-4xl md:text-5xl">Warehouse Operations</span>
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-xl mx-auto lg:mx-0">
                  ⚡ Lightning-fast fulfillment • 📱 Real-time tracking • 🌍 Nationwide coverage
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                  <Link to="/login" className="bg-gradient-to-r from-orange-500 to-orange-600 text-black px-8 py-3 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all text-center">
                    🚀 Start Free Trial
                  </Link>
                  <Link to="/pricing" className="border-2 border-orange-500/50 text-white px-8 py-3 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all text-center">
                    💰 View Pricing
                  </Link>
                </div>
                <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-xs sm:text-sm text-gray-400">
                  <div className="flex items-center gap-2">✅ 2,500+ Brands</div>
                  <div className="flex items-center gap-2">✅ 60K Orders/Month</div>
                  <div className="flex items-center gap-2">✅ 99.9% On-Time</div>
                </div>
              </div>

              {/* Right form */}
              <div className="relative">
                <div className="bg-gradient-to-b from-gray-900/95 to-black/80 backdrop-blur-3xl p-6 sm:p-8 rounded-3xl border border-orange-500/40 shadow-2xl">
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">🚚 Get Instant Quote</h3>
                  <p className="text-gray-400 mb-6 text-sm">Free analysis in 24 hours • No commitment</p>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="name" value={lead.name} onChange={handleChange} required placeholder="Your Name" className="w-full bg-black/50 border border-orange-500/30 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-orange-500/40" />
                    <input name="email" value={lead.email} onChange={handleChange} type="email" required placeholder="Business Email" className="w-full bg-black/50 border border-orange-500/30 text-white px-4 py-3 rounded-xl" />
                    <div className="grid grid-cols-2 gap-3">
                      <input name="phone" value={lead.phone} onChange={handleChange} placeholder="Phone" className="bg-black/50 border border-orange-500/30 text-white px-4 py-3 rounded-xl" />
                      <select className="bg-black/50 border border-orange-500/30 text-white px-4 py-3 rounded-xl appearance-none">
                        <option>Amazon Seller</option>
                        <option>Shopify Store</option>
                        <option>Etsy/WooCommerce</option>
                      </select>
                    </div>
                    <textarea name="note" value={lead.note} onChange={handleChange} placeholder="Monthly volume? Special requirements?" rows={2} className="w-full bg-black/50 border border-orange-500/30 text-white px-4 py-3 rounded-xl resize-none" />
                    <button type="submit" disabled={submitting} className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-black font-bold py-3 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-60">
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
        <section ref={statsRef} className="py-16 md:py-24 bg-gradient-to-b from-black/50 to-gray-900/50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">Live Performance Metrics</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 max-w-5xl mx-auto">
              <div className="counter-card"><Counter end={2593} label="Active Brands" /></div>
              <div className="counter-card"><Counter end={100020} label="Deliveries This Month" /></div>
              <div className="counter-card"><Counter end={60000} label="Orders Processed" /></div>
            </div>
          </div>
        </section>

        {/* Warehouse Illustration */}
        <section className="py-16 md:py-24 bg-black/80">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">Our State-of-the-Art Facilities</h2>
            </div>
            <WarehouseIllustration />
          </div>
        </section>

        {/* Why Choose Us */}
        <section ref={whyRef} className="py-16 md:py-24 bg-gradient-to-b from-gray-900/50 to-black/70">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">Why 2,500+ Brands Choose Us</h2>
              <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">Enterprise-grade 3PL powered by cutting-edge automation</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {[
                { icon: '💰', title: 'Unbeatable Pricing', desc: 'From $2/order • 30-day free storage' },
                { icon: '⚡', title: 'Lightning Fulfillment', desc: 'Same-day processing • 99.9% accuracy' },
                { icon: '🔒', title: 'Amazon FBA Ready', desc: 'Certified prep services' },
                { icon: '👥', title: '24/7 Support', desc: 'Dedicated managers • Real-time chat' }
              ].map((feature, i) => (
                <div key={i} className="why-card bg-gradient-to-br from-gray-900/90 to-black/70 backdrop-blur-xl p-6 sm:p-8 rounded-2xl border border-orange-500/30 hover:border-orange-500/60 hover:scale-105 transition-all duration-500">
                  <div className="text-4xl sm:text-5xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 text-sm sm:text-base">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Steps */}
        <section className="py-16 md:py-24 bg-black/80">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">4-Step Fulfillment Process</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { num: '01', title: 'Inventory Receive', desc: 'AI-powered inspection', icon: '📦' },
                { num: '02', title: 'Smart Storage', desc: 'Optimized slotting', icon: '🏬' },
                { num: '03', title: 'Lightning Pick/Pack', desc: '99.9% accuracy', icon: '⚡' },
                { num: '04', title: 'Intelligent Shipping', desc: 'Carrier optimization', icon: '🚚' }
              ].map(step => (
                <div key={step.num} className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 backdrop-blur-xl p-6 rounded-2xl border border-orange-500/30 text-center hover:scale-105 transition">
                  <div className="text-4xl mb-4">{step.icon}</div>
                  <div className="w-12 h-12 bg-orange-500 text-black rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">{step.num}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-400 text-sm">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trusted Brands */}
        <section className="py-12 bg-gradient-to-b from-black/70 to-gray-900/50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl sm:text-3xl font-bold text-white">🏆 Trusted By Industry Leaders</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 items-center">
              {['Amazon', 'Shopify', 'Flipkart', 'Etsy', 'Walmart', 'eBay'].map(brand => (
                <div key={brand} className="p-4 bg-gray-900/50 rounded-xl text-center text-gray-300 font-semibold hover:text-orange-400 transition">{brand}</div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-gradient-to-r from-orange-600 to-orange-700 relative overflow-hidden">
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6">Ready to <span className="text-yellow-300">10x</span> Your Fulfillment?</h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">Join 2,500+ brands automating their logistics. Zero risk, massive upside.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login" className="bg-black text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition">🚀 Start Free Trial</Link>
              <Link to="/pricing" className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-bold text-lg border border-white/30 hover:bg-white/30 transition">💰 See Transparent Pricing</Link>
            </div>
          </div>
        </section>
      </div>
    </WebsiteLayout>
  );
};

export default HomePage;