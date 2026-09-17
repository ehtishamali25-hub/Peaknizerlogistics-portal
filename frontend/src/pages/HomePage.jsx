import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import WebsiteLayout from './WebsiteLayout';

const Counter = ({ end, label }) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
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
    <div className="flex-1 text-center px-6 py-4 sm:py-0">
      <div className="text-3xl sm:text-4xl font-medium text-[#0E2A47]">{value.toLocaleString()}+</div>
      <div className="text-slate-500 text-sm mt-1">{label}</div>
    </div>
  );
};

const services = [
  {
    title: 'Warehousing & inventory management',
    desc: 'Store inventory across our warehouse network, track stock levels in real time, and get alerted before you run low. Every unit is scanned on receipt and reconciled against your records.',
    featured: true
  },
  {
    title: 'Amazon FBA prep',
    desc: 'Labeling, poly-bagging, and carton prep completed to current FBA requirements.'
  },
  {
    title: 'Pick, pack & ship',
    desc: 'Same-day order processing with carrier-rate optimization on every shipment.'
  },
  {
    title: 'Volume-based pricing',
    desc: 'Rates that scale down as your order volume grows — no flat platform fees.'
  },
  {
    title: 'Dedicated account support',
    desc: 'A real point of contact for every account, not a ticket queue.'
  }
];

const steps = [
  { num: '01', title: 'Receive', desc: 'Inventory is checked in, counted, and inspected against your packing list.' },
  { num: '02', title: 'Store', desc: 'Stock is slotted across our warehouse network based on order velocity.' },
  { num: '03', title: 'Pick & pack', desc: 'Orders are picked and packed with a 99.9% accuracy rate.' },
  { num: '04', title: 'Ship', desc: 'We select the fastest, most cost-effective carrier for every order.' }
];

const platforms = ['Amazon', 'Shopify', 'Etsy', 'WooCommerce', 'Walmart', 'eBay'];

const HomePage = () => {
  const [lead, setLead] = useState({ name: '', email: '', phone: '', channel: 'Amazon seller', note: '' });
  const [submitting, setSubmitting] = useState(false);
  const heroRef = useRef(null);

  const handleChange = (e) => setLead({ ...lead, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    setSubmitting(false);
    alert('Thanks — we received your request and will follow up within one business day.');
    setLead({ name: '', email: '', phone: '', channel: 'Amazon seller', note: '' });
  };

  useEffect(() => {
    gsap.fromTo(heroRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }
    );
  }, []);

  return (
    <WebsiteLayout>
      <div className="bg-white text-slate-700">

        {/* Hero */}
        <section className="bg-[#0E2A47]">
          <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 lg:py-28">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-16 items-center">
              <div ref={heroRef}>
                <span className="inline-flex items-center gap-2 text-sm font-medium text-emerald-300 mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Third-party logistics & fulfillment
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium leading-tight text-white mb-5">
                  Fulfillment infrastructure for growing e-commerce brands
                </h1>
                <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-lg mb-8">
                  We receive, store, pick, pack, and ship your inventory from our warehouse network — so orders move faster and your team can focus on growth.
                </p>
                <div className="flex flex-wrap gap-4 mb-10">
                  <Link
                    to="/login"
                    className="bg-emerald-500 hover:bg-emerald-400 text-[#0E2A47] font-medium px-6 py-3 rounded-md transition-colors"
                  >
                    Get started
                  </Link>
                  <Link
                    to="/pricing"
                    className="border border-white/25 hover:border-white/50 text-white font-medium px-6 py-3 rounded-md transition-colors"
                  >
                    View pricing
                  </Link>
                </div>
                <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-slate-300">
                  <span>2,500+ brands fulfilled</span>
                  <span>60,000+ orders shipped monthly</span>
                  <span>99.9% on-time rate</span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8">
                <h3 className="text-xl font-medium text-[#0E2A47] mb-1">Request a fulfillment quote</h3>
                <p className="text-slate-500 text-sm mb-6">We'll reply with pricing within one business day.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    name="name"
                    value={lead.name}
                    onChange={handleChange}
                    required
                    placeholder="Full name"
                    className="w-full border border-slate-300 text-slate-900 px-4 py-3 rounded-md focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none transition"
                  />
                  <input
                    name="email"
                    value={lead.email}
                    onChange={handleChange}
                    type="email"
                    required
                    placeholder="Business email"
                    className="w-full border border-slate-300 text-slate-900 px-4 py-3 rounded-md focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none transition"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      name="phone"
                      value={lead.phone}
                      onChange={handleChange}
                      placeholder="Phone number"
                      className="border border-slate-300 text-slate-900 px-4 py-3 rounded-md focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none transition"
                    />
                    <select
                      name="channel"
                      value={lead.channel}
                      onChange={handleChange}
                      className="border border-slate-300 text-slate-900 px-4 py-3 rounded-md focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none transition"
                    >
                      <option>Amazon seller</option>
                      <option>Shopify store</option>
                      <option>Etsy or WooCommerce</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <textarea
                    name="note"
                    value={lead.note}
                    onChange={handleChange}
                    placeholder="Monthly order volume and any special requirements"
                    rows={3}
                    className="w-full border border-slate-300 text-slate-900 px-4 py-3 rounded-md focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none transition resize-none"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#0E2A47] hover:bg-[#123457] text-white font-medium py-3 rounded-md transition-colors disabled:opacity-60"
                  >
                    {submitting ? 'Sending...' : 'Request quote'}
                  </button>
                  <p className="text-xs text-slate-400 text-center">No commitment. We respond within one business day.</p>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-white border-b border-slate-200 py-10 sm:py-14">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-slate-200 max-w-3xl mx-auto">
              <Counter end={2500} label="Brands fulfilled" />
              <Counter end={60000} label="Orders shipped monthly" />
              <Counter end={100000} label="Orders fulfilled to date" />
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="bg-slate-50 py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mb-10 sm:mb-12">
              <span className="text-sm font-medium text-emerald-600">What we do</span>
              <h2 className="text-2xl sm:text-3xl font-medium text-[#0E2A47] mt-2">
                Full-service fulfillment, built around your catalog
              </h2>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-medium text-[#0E2A47] mb-3">{services[0].title}</h3>
                  <p className="text-slate-600 leading-relaxed max-w-md">{services[0].desc}</p>
                </div>
                <Link to="/services" className="text-emerald-600 font-medium mt-6 inline-block">
                  Learn about storage
                </Link>
              </div>
              <div className="grid grid-rows-2 gap-6">
                {services.slice(1, 3).map((s) => (
                  <div key={s.title} className="bg-white border border-slate-200 rounded-xl p-6">
                    <h3 className="text-lg font-medium text-[#0E2A47] mb-2">{s.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 mt-6">
              {services.slice(3).map((s) => (
                <div key={s.title} className="bg-white border border-slate-200 rounded-xl p-6">
                  <h3 className="text-lg font-medium text-[#0E2A47] mb-2">{s.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="bg-white py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mb-10 sm:mb-12">
              <span className="text-sm font-medium text-emerald-600">How it works</span>
              <h2 className="text-2xl sm:text-3xl font-medium text-[#0E2A47] mt-2">
                From your warehouse to your customer's door
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
              {steps.map((step) => (
                <div key={step.num}>
                  <div className="text-sm font-medium text-emerald-600 mb-2">{step.num}</div>
                  <h3 className="text-lg font-medium text-[#0E2A47] mb-2">{step.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Platforms */}
        <section className="bg-slate-50 border-y border-slate-200 py-10 sm:py-12">
          <div className="container mx-auto px-4 sm:px-6">
            <p className="text-center text-sm text-slate-500 mb-6">Built to support sellers on</p>
            <div className="flex flex-wrap justify-center gap-x-10 gap-y-3">
              {platforms.map((p) => (
                <span key={p} className="text-slate-400 font-medium text-lg">{p}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="bg-[#0E2A47] py-16 sm:py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl font-medium text-white mb-4">
              Ready to move fulfillment off your plate?
            </h2>
            <p className="text-slate-300 max-w-xl mx-auto mb-8">
              Tell us about your business and we'll put together a fulfillment plan and pricing within one business day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="bg-emerald-500 hover:bg-emerald-400 text-[#0E2A47] font-medium px-6 py-3 rounded-md transition-colors"
              >
                Get started
              </Link>
              <Link
                to="/pricing"
                className="border border-white/25 hover:border-white/50 text-white font-medium px-6 py-3 rounded-md transition-colors"
              >
                View pricing
              </Link>
            </div>
          </div>
        </section>

      </div>
    </WebsiteLayout>
  );
};

export default HomePage;