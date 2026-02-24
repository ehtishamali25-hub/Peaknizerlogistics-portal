import { useEffect, useState } from "react";
import WebsiteLayout from "./WebsiteLayout";
import { Link } from "react-router-dom";

/**
 * Notes:
 * - Add hero background image at: /public/assets/warehouse-hero.jpg
 * - Add trust/logo images at: /public/assets/logos/<name>.png
 * - Optional: install react-icons for more polished icons (not required)
 */

const Counter = ({ end, label }) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 1200; // ms
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
    <div className="bg-gray-900 p-6 rounded-lg border border-orange-500/20 text-center">
      <div className="text-4xl font-extrabold text-orange-500 mb-1">{value.toLocaleString()}</div>
      <div className="text-gray-300 text-sm">{label}</div>
    </div>
  );
};

const HomePage = () => {
  const [lead, setLead] = useState({ name: "", email: "", phone: "", note: "" });
  const [submitting, setSubmitting] = useState(false);
  const handleChange = (e) => setLead({ ...lead, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    // replace with real submit (API call)
    setTimeout(() => {
      setSubmitting(false);
      alert("Thanks — we received your request. We'll contact you shortly!");
      setLead({ name: "", email: "", phone: "", note: "" });
    }, 900);
  };

  return (
    <WebsiteLayout>
      {/* HERO */}
      <header
        className="relative bg-cover bg-center"
        style={{
          backgroundImage: "url('/assets/warehouse-hero.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/65 to-black/70" />
        <div className="container mx-auto px-4 relative z-10 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left: copy */}
            <div className="text-white max-w-2xl">
              <p className="text-sm uppercase text-orange-400 font-semibold mb-3">3PL Fulfillment</p>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
                Streamline Your <span className="text-orange-400">3PL Warehouse</span> Operations
              </h1>
              <p className="text-gray-300 mb-6">
                Fast, compliant, and cost-effective fulfillment for e-commerce brands. Same-day processing,
                real-time tracking, and integrations with major marketplaces & storefronts.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/login"
                  className="bg-orange-500 text-black px-6 py-3 rounded-md font-semibold shadow hover:bg-orange-600 transition"
                >
                  Get Started
                </Link>
                <Link
                  to="/pricing"
                  className="border border-orange-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-white/5 transition"
                >
                  Pricing
                </Link>
              </div>

              {/* trust badges row */}
              <div className="flex items-center gap-6 mt-6 text-sm text-gray-300">
                <div>✅ 2,500+ Happy Clients</div>
                <div>✅ 60,000+ Orders / mo</div>
                <div>✅ 99.8% Accuracy</div>
              </div>
            </div>

            {/* Right: lead form */}
            <aside className="bg-gradient-to-b from-gray-900/80 to-black/70 p-6 rounded-lg border border-orange-500/20 shadow-lg">
              <h3 className="text-xl font-bold text-white mb-1">Get a Free Quote</h3>
              <p className="text-gray-400 text-sm mb-4">Tell us about your business — we'll get back within 24 hours.</p>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  name="name"
                  value={lead.name}
                  onChange={handleChange}
                  required
                  placeholder="Full name"
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded-md outline-none focus:ring-2 focus:ring-orange-400"
                />
                <input
                  name="email"
                  value={lead.email}
                  onChange={handleChange}
                  type="email"
                  required
                  placeholder="Email address"
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded-md outline-none focus:ring-2 focus:ring-orange-400"
                />
                <input
                  name="phone"
                  value={lead.phone}
                  onChange={handleChange}
                  placeholder="Phone (optional)"
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded-md outline-none focus:ring-2 focus:ring-orange-400"
                />
                <textarea
                  name="note"
                  value={lead.note}
                  onChange={handleChange}
                  placeholder="Brief about your volumes or needs (optional)"
                  rows={3}
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded-md outline-none focus:ring-2 focus:ring-orange-400"
                />

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-orange-500 text-black px-4 py-2 rounded-md font-semibold hover:bg-orange-600 transition disabled:opacity-60"
                >
                  {submitting ? "Sending..." : "Request Quote"}
                </button>

                <p className="text-xs text-gray-500 mt-1">
                  We respect your privacy — your information will never be shared.
                </p>
              </form>
            </aside>
          </div>
        </div>
      </header>

      {/* STATS */}
      <section className="py-12 bg-black">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Counter end={2593} label="Happy Clients" />
            <Counter end={100020} label="Customers Delivered" />
            <Counter end={60000} label="Monthly Orders Fulfilled" />
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-8">Why Choose Our 3PL Fulfillment</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-900 p-6 rounded-lg border border-orange-500/20">
              <div className="text-3xl text-orange-400 mb-3">💰</div>
              <h3 className="text-lg font-semibold text-white">Affordable Pricing</h3>
              <p className="text-gray-400 text-sm mt-2">From $1.90/order with transparent rates and 7 days free storage.</p>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg border border-orange-500/20">
              <div className="text-3xl text-orange-400 mb-3">⚡</div>
              <h3 className="text-lg font-semibold text-white">Fast Turnaround</h3>
              <p className="text-gray-400 text-sm mt-2">Same-day processing & nationwide shipping options.</p>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg border border-orange-500/20">
              <div className="text-3xl text-orange-400 mb-3">🔒</div>
              <h3 className="text-lg font-semibold text-white">Compliant & Secure</h3>
              <p className="text-gray-400 text-sm mt-2">Amazon FBA ready — secure warehouses and strict QA procedures.</p>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg border border-orange-500/20">
              <div className="text-3xl text-orange-400 mb-3">👥</div>
              <h3 className="text-lg font-semibold text-white">Dedicated Support</h3>
              <p className="text-gray-400 text-sm mt-2">Account managers and 24/7 tracking support.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-6">How 3PL Fulfillment Works</h2>
          <p className="text-center max-w-3xl mx-auto text-gray-400 mb-8">
            Send inventory → We store → We pick & pack → We ship → We handle returns.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[ "Inventory Storage", "Order Processing", "Shipping & Delivery", "Returns Management" ].map((t, i) => (
              <div key={t} className="text-center">
                <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                  {i+1}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{t}</h3>
                <p className="text-gray-400 text-sm">Short explanatory sentence describing this step.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits (two-column) */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-8">Why Your Business Needs a 3PL Partner</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="text-orange-400 text-2xl">✓</div>
                <div>
                  <h4 className="text-white font-semibold">Real-Time Tracking</h4>
                  <p className="text-gray-400 text-sm">Monitor inventory, orders, and shipments through our dashboard.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="text-orange-400 text-2xl">✓</div>
                <div>
                  <h4 className="text-white font-semibold">Flexible Storage</h4>
                  <p className="text-gray-400 text-sm">Scale warehousing based on demand.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="text-orange-400 text-2xl">✓</div>
                <div>
                  <h4 className="text-white font-semibold">Quality Assurance</h4>
                  <p className="text-gray-400 text-sm">Strict inspection and pack standards to reduce returns.</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="text-orange-400 text-2xl">✓</div>
                <div>
                  <h4 className="text-white font-semibold">Scalable Services</h4>
                  <p className="text-gray-400 text-sm">Add more SKUs, storage, or fulfillment speed as you grow.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="text-orange-400 text-2xl">✓</div>
                <div>
                  <h4 className="text-white font-semibold">Cost Efficiency</h4>
                  <p className="text-gray-400 text-sm">Reduce overhead on warehousing, staff, and shipping.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="text-orange-400 text-2xl">✓</div>
                <div>
                  <h4 className="text-white font-semibold">Fast Delivery</h4>
                  <p className="text-gray-400 text-sm">Multiple carrier options to optimize cost & speed.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Brands */}
      <section className="py-12 bg-black">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl text-white font-bold text-center mb-6">Top Brands & Retailers That Trust Us</h3>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 items-center justify-items-center">
            {/* replace these placeholders with actual logo images */}
            <div className="bg-gray-800 p-3 rounded-lg w-full text-center text-orange-400 font-bold">Flipkart</div>
            <div className="bg-gray-800 p-3 rounded-lg w-full text-center text-orange-400 font-bold">Amazon</div>
            <div className="bg-gray-800 p-3 rounded-lg w-full text-center text-orange-400 font-bold">Etsy</div>
            <div className="bg-gray-800 p-3 rounded-lg w-full text-center text-orange-400 font-bold">Walmart</div>
            <div className="bg-gray-800 p-3 rounded-lg w-full text-center text-orange-400 font-bold">eBay</div>
            <div className="bg-gray-800 p-3 rounded-lg w-full text-center text-orange-400 font-bold">Shopify</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-orange-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Scale Your Business?</h2>
          <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto">Get your free quote and discover how our 3PL solutions can transform your logistics.</p>
          <Link to="/login" className="bg-black text-white px-8 py-3 rounded-md font-semibold hover:bg-gray-900 transition">
            Get Free Quote
          </Link>
        </div>
      </section>

      
    </WebsiteLayout>
  );
};

export default HomePage;