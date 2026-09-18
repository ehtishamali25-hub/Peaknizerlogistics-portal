import WebsiteLayout from './WebsiteLayout';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

const PricingPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessType: 'Amazon Seller',
    message: ''
  });
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(heroRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    );
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
      <div className="bg-white text-slate-700">

        {/* Hero */}
        <section className="bg-brand-navy">
          <div ref={heroRef} className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
            <span className="text-sm font-semibold text-emerald-300">Transparent pricing</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white mt-3 mb-4">
              Fulfillment pricing, laid out plainly
            </h1>
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-6">
              Peaknizer Logistics runs FBA and FBM prep centers in Arlington, VA and Houston, TX. Rates below cover our core services — no hidden fees, no surprises after the invoice lands.
            </p>
            <div className="inline-block bg-white/10 border border-white/20 rounded-xl px-6 py-4">
              <p className="text-white font-semibold">Arlington, VA & Houston, TX</p>
              <p className="text-slate-300 text-sm">Equipped for everything from Amazon FBA prep to Shopify fulfillment</p>
            </div>
          </div>
        </section>

        {/* Photo strip */}
        <section className="grid grid-cols-2 sm:grid-cols-4">
          <img src="/images/pricing/warehouse-1.jpg" alt="Warehouse shelving" className="w-full h-32 sm:h-44 object-cover" />
          <img src="/images/pricing/warehouse-2.jpg" alt="Prep station" className="w-full h-32 sm:h-44 object-cover" />
          <img src="/images/pricing/warehouse-3.jpg" alt="Packing supplies" className="w-full h-32 sm:h-44 object-cover" />
          <img src="/images/pricing/warehouse-4.jpg" alt="Packed orders staged for shipping" className="w-full h-32 sm:h-44 object-cover" />
        </section>

        {/* FBM Fulfillment */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mb-10">
              <span className="text-sm font-semibold text-emerald-600">FBM fulfillment</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-brand-navy mt-2 mb-3">
                From $3 per order
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Ideal for Shopify, Etsy, and WooCommerce sellers running their own order flow outside Amazon.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mb-10">
              {['Same-day fulfillment', 'No storage fees', 'No return processing charges'].map((f) => (
                <div key={f} className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 text-center">
                  <h3 className="text-base font-bold text-brand-navy">{f}</h3>
                </div>
              ))}
            </div>

            <div className="max-w-4xl bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-brand-navy/[0.04] px-6 py-4 border-b border-slate-200">
                <h3 className="text-lg font-bold text-brand-navy text-center">Monthly volume pricing</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="px-6 py-3 text-left text-slate-500 font-semibold text-sm">Monthly volume</th>
                      <th className="px-6 py-3 text-right text-slate-500 font-semibold text-sm">Price per order</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { vol: '100–999 orders', price: '$3.00' },
                      { vol: '1,000+ orders', price: '$2.50' },
                      { vol: '10,000+ orders', price: '$2.00' }
                    ].map((row) => (
                      <tr key={row.vol}>
                        <td className="px-6 py-4 text-slate-700 font-medium">{row.vol}</td>
                        <td className="px-6 py-4 text-right text-2xl font-bold text-brand-navy">{row.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* FBA prep banner */}
        <section className="relative">
          <img
            src="/images/pricing/fba-prep.jpg"
            alt="Staff prepping units for FBA"
            className="w-full h-64 sm:h-80 object-cover"
          />
          <div className="absolute inset-0 bg-brand-navy/60 flex items-center">
            <div className="container mx-auto px-4 sm:px-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-white max-w-md">
                FBA prep starting at $0.60 per unit
              </h2>
            </div>
          </div>
        </section>

        {/* FBA Prep Services */}
        <section className="bg-brand-navy/[0.03] py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mb-10">
              <span className="text-sm font-semibold text-emerald-600">FBA prep services</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-brand-navy mt-2">
                Amazon-compliant prep, priced by volume
              </h2>
              <p className="text-slate-600 leading-relaxed mt-3">
                Inspection, labeling, poly-bagging, and bundling completed to current Amazon requirements.
              </p>
            </div>

            <div className="max-w-4xl bg-white border border-slate-200 rounded-xl overflow-hidden mb-8">
              <div className="bg-brand-navy/[0.04] px-6 py-4 border-b border-slate-200">
                <h3 className="text-lg font-bold text-brand-navy text-center">Prep service rates</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="px-6 py-3 text-left text-slate-500 font-semibold text-sm">Volume</th>
                      <th className="px-6 py-3 text-center text-slate-500 font-semibold text-sm">Without polybag</th>
                      <th className="px-6 py-3 text-right text-slate-500 font-semibold text-sm">With box change</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="px-6 py-4 text-slate-700 font-medium">100 units</td>
                      <td className="px-6 py-4 text-center text-2xl font-bold text-brand-navy">$0.60/unit</td>
                      <td className="px-6 py-4 text-right text-2xl font-bold text-brand-navy">$2.00/unit</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-slate-700 font-medium">100–500 units</td>
                      <td className="px-6 py-4 text-center text-2xl font-bold text-brand-navy">$0.55/unit</td>
                      <td className="px-6 py-4 text-right text-slate-500 italic">Upon request</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="bg-white border border-slate-200 rounded-xl px-6 py-4">
                <p className="text-brand-navy font-semibold text-sm">No storage fees for the first 30 days</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl px-6 py-4">
                <p className="text-brand-navy font-semibold text-sm">No hidden charges</p>
              </div>
            </div>
          </div>
        </section>

        {/* Bundling */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mb-10">
              <span className="text-sm font-semibold text-emerald-600">Bundling services</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-brand-navy mt-2">
                From multi-packs to variety packs
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="border-l-4 border-emerald-500 pl-4 mb-4">
                  <h3 className="text-xl font-bold text-brand-navy">Standard bundling</h3>
                  <p className="text-slate-500 text-sm">Under 11 lbs</p>
                </div>
                <ul className="space-y-3">
                  <li className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-600">Pack of 2 (same SKU)</span>
                    <span className="font-bold text-brand-navy text-lg">$1.00</span>
                  </li>
                  <li className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-600">Additional (same SKU)</span>
                    <span className="font-bold text-brand-navy text-lg">$0.30</span>
                  </li>
                  <li className="flex justify-between items-center py-2">
                    <span className="text-slate-600">Different SKU</span>
                    <span className="font-bold text-brand-navy text-lg">From $1.50</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="border-l-4 border-emerald-500 pl-4 mb-4">
                  <h3 className="text-xl font-bold text-brand-navy">Oversized bundling</h3>
                  <p className="text-slate-500 text-sm">11+ lbs</p>
                </div>
                <ul className="space-y-3">
                  <li className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-600">Under 20 lbs</span>
                    <span className="font-bold text-brand-navy text-lg">$2.50</span>
                  </li>
                  <li className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-600">20–30 lbs</span>
                    <span className="font-bold text-brand-navy text-lg">$3.50</span>
                  </li>
                  <li className="flex justify-between items-center py-2">
                    <span className="text-slate-600">30+ lbs</span>
                    <span className="font-bold text-brand-navy text-lg">$4.50</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Add-ons */}
        <section className="bg-brand-navy/[0.03] py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mb-10">
              <span className="text-sm font-semibold text-emerald-600">Add-on services</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-brand-navy mt-2">
                Customize your prep
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { service: 'Sticker/tag removal', price: '$0.30/unit' },
                { service: 'Expiry date label', price: '$0.20/unit' },
                { service: 'Promo inserts', price: '$0.10/unit' },
                { service: 'Liquid induction seal', price: '$0.50/unit' },
                { service: 'Product photos', price: '$35 (5 photos)' }
              ].map((item) => (
                <div key={item.service} className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <span className="text-slate-700 font-medium">{item.service}</span>
                  <span className="text-brand-navy font-bold bg-emerald-50 px-4 py-1 rounded-full border border-emerald-100 whitespace-nowrap text-sm">{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Packaging + storage */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-10 max-w-6xl">
              <div>
                <h2 className="text-2xl font-bold text-brand-navy mb-5">Packaging materials</h2>
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[380px]">
                      <thead className="bg-brand-navy/[0.04] border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-slate-500 font-semibold text-sm">Type</th>
                          <th className="px-4 py-3 text-left text-slate-500 font-semibold text-sm">Size</th>
                          <th className="px-4 py-3 text-right text-slate-500 font-semibold text-sm">Price</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {[
                          { type: 'Poly bags', size: 'Small to XL', price: '$0.40 – $0.70' },
                          { type: 'Shrink wrap', size: 'Small to standard', price: '$0.30 – $0.40' },
                          { type: 'Bubble wrap', size: 'Small to large', price: '$0.40 – $0.70' },
                          { type: 'Fragile wrap', size: '—', price: '$1.50' },
                          { type: 'Shipping boxes', size: 'Small to custom', price: '$2.00 – $4.50' }
                        ].map((item) => (
                          <tr key={item.type}>
                            <td className="px-4 py-3 text-slate-700 font-medium">{item.type}</td>
                            <td className="px-4 py-3 text-slate-500">{item.size}</td>
                            <td className="px-4 py-3 text-right font-bold text-brand-navy">{item.price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-brand-navy mb-5">Storage & handling</h2>
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[300px]">
                      <thead className="bg-brand-navy/[0.04] border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-slate-500 font-semibold text-sm">Type</th>
                          <th className="px-4 py-3 text-right text-slate-500 font-semibold text-sm">Price</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {[
                          { type: 'Standard pallet (monthly)', price: '$30/pallet' },
                          { type: 'Small box storage', price: '$2.00/box' },
                          { type: 'Carton handling (<30 lbs)', price: '$2.95 – $4.95' },
                          { type: 'Pallet shrink wrap', price: '$25/pallet' }
                        ].map((item) => (
                          <tr key={item.type}>
                            <td className="px-4 py-3 text-slate-700 font-medium">{item.type}</td>
                            <td className="px-4 py-3 text-right font-bold text-brand-navy">{item.price}</td>
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

        {/* Why choose us */}
        <section className="bg-brand-navy/[0.03] py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mb-10">
              <span className="text-sm font-semibold text-emerald-600">Why sellers choose us</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-brand-navy mt-2">
                Pricing that scales with you
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
              {[
                'Same-day shipping',
                'Transparent, startup-friendly pricing',
                'No long-term contracts',
                'Warehouses in prime U.S. locations',
                'Amazon-compliant prep processes'
              ].map((item) => (
                <div key={item} className="bg-white border border-slate-200 rounded-xl p-5 flex items-start gap-3">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                  <p className="text-slate-700 font-medium">{item}</p>
                </div>
              ))}
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
              <p className="text-lg font-bold text-brand-navy mb-4">A good fit for</p>
              <div className="flex flex-wrap justify-center gap-3">
                {['Amazon FBA sellers', 'Shopify & Etsy store owners', 'DTC brands scaling up', 'Retailers outsourcing logistics'].map((item) => (
                  <span key={item} className="bg-emerald-50 text-brand-navy px-4 py-2 rounded-full text-sm font-medium border border-emerald-100">{item}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-brand-navy py-16 sm:py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Let's get you started</h2>
            <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">Whether it's 100 units or 10,000, we scale with you.</p>
            <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8 text-left">
              <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                <p className="text-emerald-300 text-xs uppercase tracking-wide font-bold">Location</p>
                <p className="text-white font-semibold text-sm">Arlington, VA & Houston, TX</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                <p className="text-emerald-300 text-xs uppercase tracking-wide font-bold">Email</p>
                <p className="text-white font-semibold text-sm break-all">info@peaknizerlogistics.com</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                <p className="text-emerald-300 text-xs uppercase tracking-wide font-bold">Call</p>
                <p className="text-white font-semibold text-lg">+1 571-518-2791</p>
              </div>
            </div>
            <button
              onClick={() => setShowQuoteModal(true)}
              className="bg-brand-emerald hover:bg-emerald-400 text-brand-navy px-8 py-3 rounded-md font-semibold text-lg transition-colors"
            >
              Get a free quote
            </button>
          </div>
        </section>

        {/* Quote modal */}
        {showQuoteModal && (
          <div className="fixed inset-0 bg-black/60 flex items-start sm:items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 md:p-8 my-8 sm:my-0">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-brand-navy">Get your free quote</h3>
                  <p className="text-slate-500 text-sm">We'll respond within 24 hours</p>
                </div>
                <button
                  onClick={() => setShowQuoteModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-2xl leading-none"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-slate-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none transition"
                      placeholder="Full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-slate-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none transition"
                      placeholder="Phone number"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-slate-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none transition"
                    placeholder="Business email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Business type</label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none transition"
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
                  <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full border border-slate-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none transition resize-none"
                    placeholder="Monthly volume and any special requirements"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-brand-navy hover:bg-brand-navy-light text-white font-semibold py-3 rounded-md transition-colors"
                >
                  Submit quote request
                </button>
                <p className="text-xs text-slate-400 text-center">No commitment. No spam.</p>
              </form>
            </div>
          </div>
        )}
      </div>
    </WebsiteLayout>
  );
};

export default PricingPage;