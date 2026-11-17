import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import WebsiteLayout from './WebsiteLayout';
import axiosInstance from '../api/axios';

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
      <div className="text-4xl sm:text-5xl font-bold text-[#0E2A47]">{value.toLocaleString()}+</div>
      <div className="text-slate-500 text-sm mt-1">{label}</div>
    </div>
  );
};

const services = [
  { title: 'Receiving & inspection', desc: 'Every inbound shipment is checked in, counted and inspected against your packing list on the day it arrives, so you always know exactly what you have in stock.' },
  { title: 'Amazon FBA & Walmart WFS prep', desc: 'FNSKU labeling, poly-bagging, bundling and carton labeling done to current marketplace requirements, so your shipments are accepted on the first attempt.' },
  { title: 'Warehousing & storage', desc: 'Climate-controlled storage in our warehouses in Virginia, Texas and New Jersey, with stock placed by how fast it sells so popular products ship faster.' },
  { title: 'Order fulfillment', desc: 'Same-day pick, pack and ship for orders from Shopify, eBay, TikTok Shop, Walmart and Amazon (FBM), all from one shared pool of stock.' },
  { title: 'Kitting & bundling', desc: 'We build multi-packs, sets and bundles for you, so you can sell new product combinations without packing them yourself.' },
  { title: 'Returns', desc: 'Returned items are received, inspected and restocked when they can be sold again, and you see every return in your portal.' }
];

const steps = [
  { num: '01', title: 'Get a quote', desc: 'Tell us what you sell, where you sell it and roughly how many orders you ship. We reply with pricing within one business day.' },
  { num: '02', title: 'Send your inventory', desc: 'Ship your stock to our warehouse. It is checked in, counted and inspected against your packing list the same day it arrives.' },
  { num: '03', title: 'We prep & store', desc: 'Units are labeled, bagged or bundled to marketplace rules and stored by order velocity, so fast-moving products ship faster.' },
  { num: '04', title: 'We pick, pack & ship', desc: 'Orders are picked, packed and quality-checked with a 99% accuracy rate, then sent with the most cost-effective carrier.' },
  { num: '05', title: 'Track it online', desc: 'Follow your inventory, shipments and invoices in your own customer portal, without waiting for an email reply.' }
];

const portalFeatures = [
  { title: 'Live inventory, every warehouse', desc: 'See received, shipped, and remaining units for every product across every warehouse, updated in real time.' },
  { title: 'Prep & shipping invoices', desc: 'Every invoice is generated automatically and available to download as a PDF, with clear paid/unpaid status.' },
  { title: 'Payment proof uploads', desc: 'Upload a payment receipt directly against any invoice — no emailing files back and forth.' },
  { title: 'Batch tracking', desc: 'Follow every inbound shipment from upload through approval, with full shipping details attached.' },
  { title: 'Shipping documentation', desc: 'Download shipping detail sheets and packing records for any batch, any time.' },
  { title: 'Role-based access', desc: 'Owners see the full operation; customers see exactly their own inventory, invoices, and shipments.' }
];

const whyUs = [
  { title: 'No long-term contracts', desc: 'Month-to-month service. We earn your business with performance, not a lock-in agreement.' },
  { title: 'Transparent, volume-based pricing', desc: 'Rates improve as your order volume grows — no hidden platform or onboarding fees.' },
  { title: 'A real account manager', desc: 'One point of contact who knows your account, not a rotating support queue.' }
];

// TikTok Shop: save its logo as public/images/logos/tiktok-shop.png
// (until then the name is shown as text)
const platforms = [
  { name: 'Amazon', logo: '/images/logos/amazon.png' },
  { name: 'Walmart', logo: '/images/logos/walmart.png' },
  { name: 'Shopify', logo: '/images/logos/shopify.png' },
  { name: 'eBay', logo: '/images/logos/ebay.png' },
  { name: 'TikTok Shop', logo: '/images/logos/tiktok-shop.png' },
  { name: 'Etsy', logo: '/images/logos/etsy.png' },
  { name: 'WooCommerce', logo: '/images/logos/woocommerce.png' }
];

const PlatformLogo = ({ name, logo }) => {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex items-center justify-center h-16 w-full bg-white rounded-lg">
        <span className="text-[#0E2A47] font-bold text-base">{name}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-16 w-full bg-white rounded-lg px-4">
      <img
        src={logo}
        alt={`${name} logo`}
        className="max-h-8 sm:max-h-10 max-w-full object-contain"
        onError={() => setFailed(true)}
      />
    </div>
  );
};

const HomePage = () => {
  // "fax" is a hidden trap field: real visitors never see or fill it, spam robots do
  const emptyLead = { name: '', email: '', phone: '', channel: 'Amazon seller', note: '', fax: '' };
  const [lead, setLead] = useState(emptyLead);
  const [submitting, setSubmitting] = useState(false);
  const [quoteStatus, setQuoteStatus] = useState({ type: '', message: '' });
  const heroRef = useRef(null);

  const handleChange = (e) => setLead({ ...lead, [e.target.name]: e.target.value });

  // Sends the quote request to the backend, which emails it to info@peaknizerlogistics.com
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setQuoteStatus({ type: '', message: '' });

    const note = lead.note.trim();

    try {
      await axiosInstance.post('/contact/send', {
        name: lead.name.trim(),
        email: lead.email.trim(),
        phone: lead.phone.trim(),
        company: '',
        service: 'Quote Request',
        message: `Quote request from the homepage form.\nSales channel: ${lead.channel}\n\n${note || 'No extra details were added.'}`,
        fax: lead.fax,
      });

      setQuoteStatus({ type: 'success', message: 'Thanks — we received your request and will follow up within one business day.' });
      setLead(emptyLead);
    } catch (error) {
      const status = error.response?.status;
      let message;
      if (!error.response) {
        message = 'We could not reach our server. Please check your connection and try again.';
      } else if (status === 422) {
        message = 'Please check the form. Make sure your name and email address are filled in correctly.';
      } else if (status === 429) {
        message = 'Too many requests were sent in a short time. Please try again in a few minutes.';
      } else {
        message = 'We could not send your request. Please email us at info@peaknizerlogistics.com.';
      }
      setQuoteStatus({ type: 'error', message });
    } finally {
      setSubmitting(false);
    }
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
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Third-party logistics & fulfillment
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white mb-5">
                  3PL Warehouse &amp; Prep Services Across the USA
                </h1>
                <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-lg mb-8">
                  Peaknizer Logistics is a third-party logistics (3PL) company based in Arlington, Virginia, with warehouses in Houston, Texas and New Jersey. We receive, prep, store and ship inventory for new, small and medium brands selling on Amazon, Walmart, Shopify, eBay and TikTok Shop.
                </p>
                <div className="flex flex-wrap gap-4 mb-10">
                  <Link
                    to="/login"
                    className="bg-emerald-500 hover:bg-emerald-400 text-[#0E2A47] font-semibold px-6 py-3 rounded-md transition-colors"
                  >
                    Get started
                  </Link>
                  <Link
                    to="/pricing"
                    className="border border-white/25 hover:border-white/50 text-white font-semibold px-6 py-3 rounded-md transition-colors"
                  >
                    View pricing
                  </Link>
                </div>
                <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-slate-300">
                  <span>1,000+ brands fulfilled</span>
                  <span>20,000+ orders shipped monthly</span>
                  <span>99% on-time rate</span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8">
                <h2 className="text-xl font-bold text-[#0E2A47] mb-1">Request a fulfillment quote</h2>
                <p className="text-slate-500 text-sm mb-6">We'll reply with pricing within one business day.</p>
                {quoteStatus.message && (
                  <div
                    role={quoteStatus.type === 'success' ? 'status' : 'alert'}
                    className={`mb-4 p-3 rounded-md text-sm ${quoteStatus.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-red-50 border border-red-200 text-red-700'}`}
                  >
                    {quoteStatus.message}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Each field has an aria-label for screen readers; visitors see the placeholders */}
                  <input
                    aria-label="Full name"
                    name="name"
                    value={lead.name}
                    onChange={handleChange}
                    required
                    placeholder="Full name"
                    className="w-full border border-slate-300 text-slate-900 px-4 py-3 rounded-md focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none transition"
                  />
                  <input
                    aria-label="Business email"
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
                      aria-label="Phone number"
                      name="phone"
                      type="tel"
                      value={lead.phone}
                      onChange={handleChange}
                      placeholder="Phone number"
                      className="border border-slate-300 text-slate-900 px-4 py-3 rounded-md focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none transition"
                    />
                    <select
                      aria-label="Where you sell"
                      name="channel"
                      value={lead.channel}
                      onChange={handleChange}
                      className="border border-slate-300 text-slate-900 px-4 py-3 rounded-md focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none transition"
                    >
                      <option>Amazon seller</option>
                      <option>Walmart seller</option>
                      <option>Shopify store</option>
                      <option>eBay seller</option>
                      <option>TikTok Shop seller</option>
                      <option>Etsy or WooCommerce</option>
                      <option>Several channels</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <textarea
                    aria-label="Monthly order volume and any special requirements"
                    name="note"
                    value={lead.note}
                    onChange={handleChange}
                    placeholder="Monthly order volume and any special requirements"
                    rows={3}
                    className="w-full border border-slate-300 text-slate-900 px-4 py-3 rounded-md focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none transition resize-none"
                  />
                  {/* Trap for spam robots: hidden from people, must stay empty */}
                  <div className="hidden" aria-hidden="true">
                    <input aria-label="Fax" name="fax" type="text" value={lead.fax} onChange={handleChange} tabIndex={-1} autoComplete="off" />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#0E2A47] hover:bg-[#123457] text-white font-semibold py-3 rounded-md transition-colors disabled:opacity-60"
                  >
                    {submitting ? 'Sending...' : 'Request quote'}
                  </button>
                  <p className="text-xs text-slate-500 text-center">No commitment. We respond within one business day.</p>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-white border-b border-slate-200 py-10 sm:py-14">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-slate-200 max-w-3xl mx-auto">
              <Counter end={1000} label="Brands fulfilled" />
              <Counter end={20000} label="Orders shipped monthly" />
              <Counter end={100000} label="Orders fulfilled to date" />
            </div>
          </div>
        </section>

        {/* Overview: text + image side by side */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div>
                <span className="text-sm font-semibold text-emerald-700">Our 3PL services</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#0E2A47] mt-2 mb-5">
                  One warehouse partner, from receiving to returns
                </h2>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Most sellers piece together receiving, storage, prep, and shipping across separate vendors. We run all of it under one roof, with one team accountable for every step — so nothing falls through the cracks between handoffs.
                </p>
                <Link to="/services" className="inline-block font-semibold text-emerald-700 hover:underline">
                  See all our 3PL services and what's included
                </Link>
              </div>
              <div className="rounded-xl overflow-hidden">
                <img
                  src="/images/warehouse-racking.jpg"
                  alt="Warehouse storage racking with inventory"
                  className="w-full h-72 sm:h-96 object-cover"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {services.map((service) => (
                <div key={service.title} className="bg-white border border-slate-200 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-[#0E2A47] mb-2">{service.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Built to scale: image + text reversed, tinted background */}
        <section className="bg-[#0E2A47]/[0.03] py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div className="rounded-xl overflow-hidden order-2 lg:order-1">
                <img
                  src="/images/warehouse-picking.jpg"
                  alt="Staff picking and packing orders in the warehouse"
                  className="w-full h-72 sm:h-96 object-cover"
                />
              </div>
              <div className="order-1 lg:order-2">
                <span className="text-sm font-semibold text-emerald-700">Who we work with</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#0E2A47] mt-2 mb-5">
                  Built for new, small and medium brands in the USA
                </h2>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Whether you're launching your first product or selling a full catalog across Amazon, Walmart, Shopify, eBay and TikTok Shop, we handle receiving, prep, storage and shipping — so you can spend your time growing the brand, and our operation absorbs volume spikes without missing a delivery window.
                </p>
                <ul className="space-y-3">
                  {[
                    'Amazon FBA and Walmart WFS prep for marketplace-managed inventory',
                    'Order fulfillment for Shopify, eBay and TikTok Shop stores',
                    'Multi-channel order routing from a single stock pool',
                    'Volume-based pricing that improves as you grow'
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                      <span className="text-slate-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Full-width warehouse banner with stat card */}
        <section className="relative">
          <img
            src="/images/warehouse-wide.jpg"
            alt="Wide view of warehouse floor with shelving and inventory"
            className="w-full h-72 sm:h-[28rem] object-cover"
          />
          <div className="absolute inset-0 bg-[#0E2A47]/50"></div>
          <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 bg-white rounded-xl shadow-xl px-6 py-5 max-w-xs">
            <div className="text-4xl font-bold text-[#0E2A47]">99%</div>
            <div className="text-slate-500 text-sm mt-1">Order accuracy across every warehouse in our network</div>
          </div>
        </section>

        {/* FBA prep detail: text + image */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div>
                <span className="text-sm font-semibold text-emerald-700">Amazon FBA prep</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#0E2A47] mt-2 mb-5">
                  Prep done right the first time
                </h2>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Rejected FBA shipments cost you time and money. Every unit that passes through our prep stations is labeled, poly-bagged, and boxed to current Amazon requirements before it's routed to a fulfillment center — so your inventory is accepted on the first attempt.
                </p>
                <ul className="space-y-3">
                  {[
                    'FNSKU labeling and barcode verification',
                    'Poly-bagging, bundling, and set creation',
                    'Carton content labeling and weight checks',
                    'Compliance checks against current Amazon policy'
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                      <span className="text-slate-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl overflow-hidden">
                <img
                  src="/images/warehouse-prep.jpg"
                  alt="Staff prepping and labeling products for FBA"
                  className="w-full h-72 sm:h-96 object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Why sellers choose us — tinted cards */}
        <section className="bg-emerald-50/60 py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mb-10 sm:mb-12">
              <span className="text-sm font-semibold text-emerald-700">Why sellers choose us</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#0E2A47] mt-2">
                A fulfillment partner, not just a warehouse
              </h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              {whyUs.map((item) => (
                <div key={item.title} className="bg-white border border-emerald-100 rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-[#0E2A47] mb-2">{item.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            <Link to="/pricing" className="inline-block mt-8 font-semibold text-emerald-700 hover:underline">
              See our 3PL pricing for prep, storage and shipping
            </Link>
          </div>
        </section>

        {/* Second warehouse banner */}
        <section className="relative">
          <img
            src="/images/warehouse-dispatch.jpg"
            alt="Packed orders staged for dispatch"
            className="w-full h-64 sm:h-96 object-cover"
          />
          <div className="absolute inset-0 bg-[#0E2A47]/40"></div>
          <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 bg-white rounded-xl shadow-xl px-6 py-5 max-w-xs">
            <div className="text-4xl font-bold text-[#0E2A47]">Same-day</div>
            <div className="text-slate-500 text-sm mt-1">Orders placed before cutoff ship the same day</div>
          </div>
        </section>

        {/* Process */}
        <section className="bg-[#0E2A47]/[0.03] py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mb-10 sm:mb-12">
              <span className="text-sm font-semibold text-emerald-700">How it works</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#0E2A47] mt-2">
                From your first quote to your customer's door
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {steps.map((step) => (
                <div key={step.num} className="bg-white border border-slate-200 rounded-xl p-6">
                  <div className="text-sm font-bold text-emerald-700 mb-2">{step.num}</div>
                  <h3 className="text-lg font-bold text-[#0E2A47] mb-2">{step.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Portal section */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-12">
              <div>
                <span className="text-sm font-semibold text-emerald-700">Your customer portal</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#0E2A47] mt-2 mb-5">
                  Track your inventory and invoices online
                </h2>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Every customer gets a login to our portal — not just a shared spreadsheet or a monthly email. You can check inventory, download invoices, upload payment proof, and follow every shipment without waiting on a reply from our team.
                </p>
                <Link
                  to="/login"
                  className="inline-block bg-[#0E2A47] hover:bg-[#123457] text-white font-semibold px-6 py-3 rounded-md transition-colors"
                >
                  Log in to your portal
                </Link>
              </div>
              <div className="rounded-xl overflow-hidden">
                <img
                  src="/images/warehouse-office.jpg"
                  alt="Staff reviewing shipments on a laptop in the warehouse"
                  className="w-full h-72 sm:h-96 object-cover"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {portalFeatures.map((f) => (
                <div key={f.title} className="bg-[#0E2A47]/[0.03] border border-slate-200 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-[#0E2A47] mb-2">{f.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Platforms — highlighted band with logos */}
        <section className="bg-[#0E2A47] py-14 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <p className="text-center text-sm font-semibold text-emerald-300 uppercase tracking-wide mb-8">
              Built to support sellers on
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 max-w-5xl mx-auto">
              {platforms.map((p) => (
                <div key={p.name} className="w-[calc(50%-0.5rem)] sm:w-40">
                  <PlatformLogo name={p.name} logo={p.logo} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="bg-[#0E2A47] py-16 sm:py-20 border-t border-white/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to move fulfillment off your plate?
            </h2>
            <p className="text-slate-300 max-w-xl mx-auto mb-8">
              Tell us about your business and we'll put together a fulfillment plan and pricing within one business day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="bg-emerald-500 hover:bg-emerald-400 text-[#0E2A47] font-semibold px-6 py-3 rounded-md transition-colors"
              >
                Get started
              </Link>
              <Link
                to="/pricing"
                className="border border-white/25 hover:border-white/50 text-white font-semibold px-6 py-3 rounded-md transition-colors"
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