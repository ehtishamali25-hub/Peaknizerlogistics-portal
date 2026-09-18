import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import WebsiteLayout from './WebsiteLayout';
import { gsap } from 'gsap';

const coreServices = [
  {
    title: 'Warehousing & storage',
    desc: 'Climate-appropriate storage across our warehouse network, with every unit scanned on receipt and reconciled against your records.',
    points: ['Real-time stock levels by warehouse', 'Low-stock alerts before you run out', 'Multi-location coverage'],
    featured: true
  },
  {
    title: 'Order fulfillment',
    desc: 'Same-day pick, pack, and ship on every order that comes in before cutoff.',
    points: ['99.9% pick accuracy', 'Multi-channel order routing', 'Custom packaging on request']
  },
  {
    title: 'Shipping & carriers',
    desc: 'We select the fastest, most cost-effective carrier for every order and hand you tracking automatically.',
    points: ['Rate optimization on every shipment', 'Domestic and international', 'Delivery exception alerts']
  }
];

const prepStats = [
  { num: '24–48h', label: 'Prep turnaround' },
  { num: '100%', label: 'Compliance rate' },
  { num: '$0.60', label: 'Starting price per unit' }
];

const portalFeatures = [
  { title: 'Live inventory', desc: 'Multi-warehouse visibility, updated as units move.' },
  { title: 'Order pipeline', desc: 'Real-time fulfillment status from receiving to dispatch.' },
  { title: 'Automated invoicing', desc: 'Prep and shipping invoices generated and downloadable as PDFs.' },
  { title: 'Payment proof uploads', desc: 'Attach a receipt directly to any invoice.' }
];

const workflow = [
  { num: '01', title: 'Receiving', desc: 'Inventory is checked in, counted, and inspected against your packing list.' },
  { num: '02', title: 'Storage', desc: 'Stock is slotted by order velocity so fast movers ship faster.' },
  { num: '03', title: 'Fulfillment', desc: 'Orders are picked, packed, and quality-checked before dispatch.' },
  { num: '04', title: 'Shipping', desc: 'The best available carrier is selected for cost and speed.' }
];

const industries = [
  'E-commerce', 'Amazon FBA', 'Shopify', 'DTC brands', 'Health & beauty',
  'Electronics', 'Apparel', 'Food', 'Pet supplies', 'Home goods', 'Subscription boxes', 'B2B'
];

const ServicesPage = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(heroRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    );
  }, []);

  return (
    <WebsiteLayout>
      <div className="bg-white text-slate-700">

        {/* Hero */}
        <section className="bg-brand-navy">
          <div ref={heroRef} className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
            <span className="text-sm font-semibold text-emerald-300">Complete fulfillment services</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white mt-3 mb-5">
              Everything your inventory needs, in one place
            </h1>
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
              Receiving, storage, prep, fulfillment, and shipping — run under one roof, with one team accountable for every step.
            </p>
            <Link
              to="/login"
              className="inline-block bg-brand-emerald hover:bg-emerald-400 text-brand-navy font-semibold px-6 py-3 rounded-md transition-colors"
            >
              Log in to the client portal
            </Link>
          </div>
        </section>

        {/* Core services */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mb-10 sm:mb-12">
              <span className="text-sm font-semibold text-emerald-600">Core services</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-brand-navy mt-2">
                Built to run your fulfillment end to end
              </h2>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col lg:flex-row">
                <img
                  src="/images/services/warehousing.jpg"
                  alt="Warehouse storage racking"
                  className="w-full lg:w-2/5 h-56 lg:h-auto object-cover"
                />
                <div className="p-6 sm:p-8 flex flex-col justify-center">
                  <h3 className="text-xl font-bold text-brand-navy mb-3">{coreServices[0].title}</h3>
                  <p className="text-slate-600 leading-relaxed mb-4">{coreServices[0].desc}</p>
                  <ul className="space-y-2">
                    {coreServices[0].points.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {coreServices.slice(1).map((s) => (
                <div key={s.title} className="bg-white border border-slate-200 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-brand-navy mb-2">{s.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">{s.desc}</p>
                  <ul className="space-y-2">
                    {s.points.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FBA prep banner + stats */}
        <section className="relative">
          <img
            src="/images/services/fba-prep.jpg"
            alt="Staff prepping products for FBA"
            className="w-full h-64 sm:h-96 object-cover"
          />
          <div className="absolute inset-0 bg-brand-navy/60 flex items-center">
            <div className="container mx-auto px-4 sm:px-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-white max-w-md">
                Amazon FBA prep, done to current marketplace standards
              </h2>
            </div>
          </div>
        </section>

        <section className="bg-brand-navy/[0.03] py-14 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-wrap justify-center gap-10 sm:gap-16 max-w-3xl mx-auto">
              {prepStats.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-brand-navy">{s.num}</div>
                  <div className="text-slate-500 text-sm mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Portal */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-12">
              <div>
                <span className="text-sm font-semibold text-emerald-600">Your fulfillment, visible</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-brand-navy mt-2 mb-5">
                  Track every order from your own portal
                </h2>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Every customer gets a login — not a shared spreadsheet. Check inventory, download invoices, and follow shipments without waiting on a reply.
                </p>
                <Link
                  to="/login"
                  className="inline-block bg-brand-navy hover:bg-brand-navy-light text-white font-semibold px-6 py-3 rounded-md transition-colors"
                >
                  Log in to your portal
                </Link>
              </div>
              <div className="rounded-xl overflow-hidden">
                <img
                  src="/images/services/portal-dashboard.png"
                  alt="Staff reviewing the fulfillment portal on a laptop"
                  className="w-full h-72 sm:h-96 object-cover"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {portalFeatures.map((f) => (
                <div key={f.title} className="bg-brand-navy/[0.03] border border-slate-200 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-brand-navy mb-2">{f.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Workflow */}
        <section className="bg-brand-navy/[0.03] py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mb-10 sm:mb-12">
              <span className="text-sm font-semibold text-emerald-600">How it works</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-brand-navy mt-2">
                A workflow built to remove guesswork
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {workflow.map((step) => (
                <div key={step.num} className="bg-white border border-slate-200 rounded-xl p-6">
                  <div className="text-sm font-bold text-emerald-600 mb-2">{step.num}</div>
                  <h3 className="text-lg font-bold text-brand-navy mb-2">{step.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Fulfillment floor banner */}
        <section className="relative">
          <img
            src="/images/services/pick-pack.jpg"
            alt="Staff picking and packing orders"
            className="w-full h-64 sm:h-96 object-cover"
          />
          <div className="absolute inset-0 bg-brand-navy/40"></div>
          <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 bg-white rounded-xl shadow-xl px-6 py-5 max-w-xs">
            <div className="text-3xl font-bold text-brand-navy">Same-day</div>
            <div className="text-slate-500 text-sm mt-1">Orders placed before cutoff ship the same day</div>
          </div>
        </section>

        {/* Industries */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mb-10 sm:mb-12">
              <span className="text-sm font-semibold text-emerald-600">Who we work with</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-brand-navy mt-2">
                Specialized workflows for every vertical
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {industries.map((industry) => (
                <span
                  key={industry}
                  className="bg-emerald-50 border border-emerald-100 rounded-full px-5 py-2 text-sm font-medium text-brand-navy"
                >
                  {industry}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="bg-brand-navy py-16 sm:py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to put your fulfillment on autopilot?
            </h2>
            <p className="text-slate-300 max-w-xl mx-auto mb-8">
              Tell us your volume and requirements, and we'll put together a plan and pricing within one business day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-brand-emerald hover:bg-emerald-400 text-brand-navy font-semibold px-6 py-3 rounded-md transition-colors"
              >
                Get a free quote
              </Link>
              <Link
                to="/login"
                className="border border-white/25 hover:border-white/50 text-white font-semibold px-6 py-3 rounded-md transition-colors"
              >
                Client portal
              </Link>
            </div>
          </div>
        </section>

      </div>
    </WebsiteLayout>
  );
};

export default ServicesPage;