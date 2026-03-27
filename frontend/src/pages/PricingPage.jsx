import WebsiteLayout from './WebsiteLayout';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const PricingPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessType: 'Amazon Seller',
    message: ''
  });

  const [showQuoteModal, setShowQuoteModal] = useState(false);

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
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-black via-gray-900 to-black py-20 text-center overflow-hidden">
        {/* Background glow for depth */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-600/10 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="inline-block bg-orange-500/10 border border-orange-500/30 px-6 py-2 rounded-full mb-6 transform transition hover:scale-105 cursor-default">
            <span className="text-orange-400 font-bold tracking-wider text-sm">💰 TRANSPARENT PRICING</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-lg">
            PeaknizerLogistics Fulfillment Pricing <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 mt-2 block">
              Transparent. Affordable. Scalable.
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
            🚀 Welcome to Peaknizer Logistics, Arlington's premier FBA & FBM prep center—designed to power your e-commerce growth without breaking the bank.
          </p>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-6 rounded-2xl inline-block shadow-2xl transition-transform duration-300 hover:-translate-y-1">
            <p className="text-white font-medium text-lg">📍 2503D N Harrison St, Arlington, VA, 22207</p>
            <p className="text-sm text-gray-400 mt-2">Fully equipped to handle everything from Amazon FBA prep to Shopify order fulfillment.</p>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-12 bg-black relative z-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-gray-900 to-black p-10 rounded-2xl border-2 border-orange-500/50 shadow-[0_10px_40px_-10px_rgba(249,115,22,0.4)] max-w-4xl mx-auto text-center transform transition-all duration-500 hover:scale-[1.02]">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-md">
              ⚙️ Simple, Straightforward Pricing
            </h2>
            <p className="text-2xl text-orange-400 font-bold mb-3 tracking-wide">Most Cheapest, But Provides Premium Quality</p>
            <p className="text-lg text-gray-400">No Surprises, Just Solutions – Transparent rates from day one</p>
          </div>
        </div>
      </section>

      {/* FBM Fulfillment */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              <span className="text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]">🔹 FBM Fulfillment</span> <br className="md:hidden"/> From Just $3 per Order
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Ideal for Shopify, Etsy, and WooCommerce Sellers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            {/* 3D Feature Cards */}
            {[
              { icon: "✅", title: "Same-Day Fulfillment" },
              { icon: "📦", title: "No Storage Fees" },
              { icon: "🔄", title: "No Return Processing Charges" }
            ].map((feature, idx) => (
              <div key={idx} className="bg-gray-800/80 backdrop-blur-md p-8 rounded-2xl border border-gray-700 shadow-xl transition-all duration-300 hover:-translate-y-3 hover:shadow-[0_15px_30px_-5px_rgba(249,115,22,0.4)] hover:border-orange-500/50 text-center group">
                <div className="text-5xl mb-4 transform transition-transform group-hover:scale-110">{feature.icon}</div>
                <h3 className="text-xl text-white font-bold">{feature.title}</h3>
              </div>
            ))}
          </div>

          {/* Pricing Table (3D Elevated) */}
          <div className="max-w-4xl mx-auto bg-gray-900/90 rounded-2xl overflow-hidden shadow-[0_20px_50px_-10px_rgba(0,0,0,0.7)] border border-gray-700 hover:border-orange-500/30 transition-colors duration-300">
            <div className="bg-gradient-to-r from-orange-600 to-orange-400 p-5">
              <h3 className="text-black font-black text-center text-2xl uppercase tracking-wider">Monthly Volume Pricing</h3>
            </div>
            <table className="w-full">
              <thead className="bg-black/50">
                <tr>
                  <th className="px-8 py-5 text-left text-gray-300 font-semibold text-lg uppercase">Monthly Volume</th>
                  <th className="px-8 py-5 text-right text-gray-300 font-semibold text-lg uppercase">Price per Order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {[
                  { vol: "100–999 Orders", price: "$3.00" },
                  { vol: "1,000+ Orders", price: "$2.50" },
                  { vol: "10,000+ Orders", price: "$2.00" }
                ].map((row, idx) => (
                  <tr key={idx} className="transition-colors hover:bg-gray-800/80 group">
                    <td className="px-8 py-6 text-white text-lg font-medium">{row.vol}</td>
                    <td className="px-8 py-6 text-right text-orange-400 font-black text-2xl group-hover:scale-110 transition-transform origin-right">{row.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FBA Prep Services */}
      <section className="py-20 bg-black border-t border-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-white mb-6">
            <span className="text-orange-500">🔹 FBA Prep Services</span> – Amazon-Ready, Done Right
          </h2>
          <p className="text-gray-400 text-lg text-center max-w-3xl mx-auto mb-12">
            Our Amazon-compliant services include inspection, labeling, polybagging, bundling, and more—starting at just <span className="text-orange-400 font-bold">$0.60/unit!</span>
          </p>

          <div className="max-w-4xl mx-auto bg-gray-900/90 rounded-2xl overflow-hidden shadow-[0_20px_50px_-10px_rgba(0,0,0,0.7)] border border-gray-700 hover:border-orange-500/30 transition-colors duration-300 mb-8">
            <div className="bg-gradient-to-r from-orange-600 to-orange-400 p-5">
              <h3 className="text-black font-black text-center text-2xl uppercase tracking-wider">Prep Service Rates</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead className="bg-black/50">
                  <tr>
                    <th className="px-8 py-5 text-left text-gray-300 font-semibold uppercase">Volume</th>
                    <th className="px-8 py-5 text-center text-gray-300 font-semibold uppercase">Without Polybag</th>
                    <th className="px-8 py-5 text-right text-gray-300 font-semibold uppercase">With Box Change</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  <tr className="transition-colors hover:bg-gray-800/80">
                    <td className="px-8 py-6 text-white font-medium">100 Units</td>
                    <td className="px-8 py-6 text-center text-orange-400 font-bold text-xl">$0.60/unit</td>
                    <td className="px-8 py-6 text-right text-orange-400 font-bold text-xl">$2.00/unit</td>
                  </tr>
                  <tr className="transition-colors hover:bg-gray-800/80">
                    <td className="px-8 py-6 text-white font-medium">100–500 Units</td>
                    <td className="px-8 py-6 text-center text-orange-400 font-bold text-xl">$0.55/unit</td>
                    <td className="px-8 py-6 text-right text-gray-500 font-medium italic">Upon Request</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="text-center space-y-2 bg-gray-900/50 py-4 rounded-xl max-w-2xl mx-auto border border-gray-800">
            <p className="text-orange-400 font-bold text-lg">🛑 No storage fees for first 30 days</p>
            <p className="text-orange-400 font-bold text-lg">🛑 No hidden charges</p>
          </div>
        </div>
      </section>

      {/* Bundling Services */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-white mb-4">
            <span className="text-orange-500 drop-shadow-md">🔹 Bundling Services</span>
          </h2>
          <p className="text-gray-400 text-lg text-center mb-12">From multi-packs to variety packs, we handle it all!</p>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Standard Bundling (3D Card) */}
            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_15px_30px_-5px_rgba(249,115,22,0.3)] hover:border-orange-500/50 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-orange-500"></div>
              <h3 className="text-2xl font-bold text-white mb-6">Standard Bundling <span className="text-sm font-normal text-gray-400 block mt-1">(Under 11 lbs)</span></h3>
              <ul className="space-y-4">
                <li className="flex justify-between items-center text-gray-300 border-b border-gray-700/50 pb-2">
                  <span>Pack of 2 (Same SKU):</span>
                  <span className="text-orange-400 font-black text-xl bg-gray-900 px-3 py-1 rounded-md">$1.00</span>
                </li>
                <li className="flex justify-between items-center text-gray-300 border-b border-gray-700/50 pb-2">
                  <span>Additional (Same SKU):</span>
                  <span className="text-orange-400 font-black text-xl bg-gray-900 px-3 py-1 rounded-md">$0.30</span>
                </li>
                <li className="flex justify-between items-center text-gray-300 pb-2">
                  <span>Different SKU:</span>
                  <span className="text-orange-400 font-black text-lg bg-gray-900 px-3 py-1 rounded-md">From $1.50</span>
                </li>
              </ul>
            </div>

            {/* Oversized Bundling (3D Card) */}
            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_15px_30px_-5px_rgba(249,115,22,0.3)] hover:border-orange-500/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-2 h-full bg-orange-600"></div>
              <h3 className="text-2xl font-bold text-white mb-6">Oversized Bundling <span className="text-sm font-normal text-gray-400 block mt-1">(11+ lbs)</span></h3>
              <ul className="space-y-4">
                <li className="flex justify-between items-center text-gray-300 border-b border-gray-700/50 pb-2">
                  <span>Under 20 lbs:</span>
                  <span className="text-orange-400 font-black text-xl bg-gray-900 px-3 py-1 rounded-md">$2.50</span>
                </li>
                <li className="flex justify-between items-center text-gray-300 border-b border-gray-700/50 pb-2">
                  <span>20–30 lbs:</span>
                  <span className="text-orange-400 font-black text-xl bg-gray-900 px-3 py-1 rounded-md">$3.50</span>
                </li>
                <li className="flex justify-between items-center text-gray-300 pb-2">
                  <span>30+ lbs:</span>
                  <span className="text-orange-400 font-black text-xl bg-gray-900 px-3 py-1 rounded-md">$4.50</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Add-On Services */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-white mb-12">
            <span className="text-orange-500">🔹 Add-On Services</span> – Customize Your Prep!
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { service: "Sticker/Tag Removal", price: "$0.30/unit" },
              { service: "Expiry Date Label", price: "$0.20/unit" },
              { service: "Promo Inserts", price: "$0.10/unit" },
              { service: "Liquid Induction Seal", price: "$0.50/unit" },
              { service: "Pro Product Photos", price: "$35 (5 photos)" },
            ].map((item, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 flex justify-between items-center shadow-lg transition-transform duration-300 hover:scale-105 hover:border-orange-500/40">
                <span className="text-gray-200 font-medium">{item.service}</span>
                <span className="text-orange-400 font-black text-lg bg-black/50 px-3 py-1 rounded-lg border border-orange-500/20">{item.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packaging & Storage Combined Section */}
      <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            
            {/* Packaging Materials */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <span className="text-4xl">📦</span> <span className="text-orange-500">Packaging Materials</span>
              </h2>
              <div className="bg-gray-900/80 rounded-2xl overflow-hidden border border-gray-700 shadow-2xl">
                <table className="w-full">
                  <thead className="bg-black/60">
                    <tr>
                      <th className="px-6 py-4 text-left text-white text-sm uppercase">Type</th>
                      <th className="px-6 py-4 text-left text-white text-sm uppercase">Size</th>
                      <th className="px-6 py-4 text-right text-white text-sm uppercase">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {[
                      { type: "Poly Bags", size: "Small to XL", price: "$0.40 – $0.70" },
                      { type: "Shrink Wrap", size: "Small to Standard", price: "$0.40 – $0.30" },
                      { type: "Bubble Wrap", size: "Small to Large", price: "$0.40 – $0.70" },
                      { type: "Fragile Wrap", size: "–", price: "$1.50" },
                      { type: "Shipping Boxes", size: "Small to Custom", price: "$2.00 – $4.50" },
                    ].map((item, index) => (
                      <tr key={index} className="hover:bg-gray-800 transition-colors">
                        <td className="px-6 py-4 text-gray-300 font-medium">{item.type}</td>
                        <td className="px-6 py-4 text-gray-400 text-sm">{item.size}</td>
                        <td className="px-6 py-4 text-right text-orange-400 font-bold">{item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Storage & Handling */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <span className="text-4xl">🏷️</span> <span className="text-orange-500">Storage & Handling</span>
              </h2>
              <div className="bg-gray-900/80 rounded-2xl overflow-hidden border border-gray-700 shadow-2xl">
                <table className="w-full">
                  <thead className="bg-black/60">
                    <tr>
                      <th className="px-6 py-4 text-left text-white text-sm uppercase">Type</th>
                      <th className="px-6 py-4 text-right text-white text-sm uppercase">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {[
                      { type: "Standard Pallet (Monthly)", price: "$30/pallet" },
                      { type: "Small Box Storage", price: "$2.00/box" },
                      { type: "Carton Handling (<30 lbs)", price: "$2.95 – $4.95" },
                      { type: "Pallet Shrink Wrap", price: "$25/pallet" },
                    ].map((item, index) => (
                      <tr key={index} className="hover:bg-gray-800 transition-colors">
                        <td className="px-6 py-5 text-gray-300 font-medium">{item.type}</td>
                        <td className="px-6 py-5 text-right text-orange-400 font-bold text-lg">{item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-black relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-600/10 rounded-full blur-[100px]"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-4xl font-bold text-center text-white mb-12">
            🌟 Why E-Commerce Sellers Choose <br className="md:hidden"/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">PeaknizerLogistics</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
            {[
              "Same-Day Shipping",
              "Transparent, Startup-Friendly Pricing",
              "No Long-Term Contracts",
              "Houston-Based, Prime U.S. Location",
              "100% Amazon-Compliant Processes",
            ].map((item, index) => (
              <div key={index} className="bg-gray-900/80 p-6 rounded-xl border border-gray-800 flex items-start gap-4 transition-transform duration-300 hover:-translate-y-2 hover:border-orange-500/50 hover:shadow-[0_10px_30px_-10px_rgba(249,115,22,0.3)]">
                <span className="bg-orange-500/20 p-2 rounded-lg text-orange-500">✅</span>
                <p className="text-white font-medium text-lg leading-snug pt-1">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center bg-gray-900/50 p-8 rounded-2xl max-w-4xl mx-auto border border-gray-800">
            <p className="text-white font-bold text-xl mb-6">🎯 Perfect Ecosystem For:</p>
            <div className="flex flex-wrap gap-4 justify-center">
              {["Amazon FBA Sellers", "Shopify & Etsy Store Owners", "DTC Brands Scaling Up", "Retailers Outsourcing Logistics"].map((item, index) => (
                <span key={index} className="bg-gradient-to-r from-gray-800 to-gray-900 text-orange-400 px-6 py-3 rounded-full text-sm font-semibold border border-orange-500/30 shadow-lg transform transition hover:scale-105 hover:border-orange-500">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact & CTA */}
      <section className="py-24 bg-gradient-to-t from-gray-900 to-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            📞 Let's Get You Started Today!
          </h2>
          <p className="text-gray-400 text-xl mb-10 max-w-2xl mx-auto">
            Got 100 units or 10,000? We scale with you seamlessly.
          </p>
          
          <div className="bg-gray-800/80 backdrop-blur-xl p-10 rounded-3xl max-w-3xl mx-auto border-2 border-orange-500/50 shadow-[0_0_50px_rgba(249,115,22,0.15)] relative overflow-hidden group">
            {/* Animated hover glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/0 via-orange-600/10 to-orange-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -translate-x-full group-hover:translate-x-full ease-in-out"></div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-10 text-left">
              <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700">
                <p className="text-gray-400 text-sm mb-1">📍 Location</p>
                <p className="text-white font-medium">2503D N Harrison St,<br/>Arlington, VA 22207</p>
              </div>
              <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700">
                <p className="text-gray-400 text-sm mb-1">📧 Email Us</p>
                <p className="text-white font-medium break-words">info@peaknizer<br/>logistics.com</p>
              </div>
              <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700">
                <p className="text-gray-400 text-sm mb-1">📞 Call Us</p>
                <p className="text-white font-medium text-lg">+1 571-307-4461</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowQuoteModal(true)}
              className="w-full md:w-auto bg-gradient-to-r from-orange-500 to-orange-600 text-black px-10 py-5 rounded-xl font-black text-xl hover:from-orange-400 hover:to-orange-500 transform transition duration-300 hover:scale-[1.03] hover:shadow-[0_15px_30px_-5px_rgba(249,115,22,0.5)] inline-flex items-center justify-center gap-3"
            >
              💰 GET FREE PRICE QUOTE INSTANTLY
            </button>
          </div>
        </div>
      </section>

      {/* Quote Modal (3D Pop-in Effect) */}
      {showQuoteModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300">
          {/* Added scale and animation classes for a 3D pop effect */}
          <div className="bg-gray-900 rounded-2xl max-w-lg w-full border border-orange-500/50 shadow-[0_20px_60px_-10px_rgba(249,115,22,0.4)] transform transition-all duration-300 scale-100 animate-[popIn_0.3s_ease-out]">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-white">📬 Get Your Free Quote</h3>
                <button
                  onClick={() => setShowQuoteModal(false)}
                  className="text-gray-400 hover:text-white hover:bg-gray-800 p-2 rounded-full transition-colors text-xl w-10 h-10 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-gray-400 text-sm font-semibold mb-2">Name:</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-shadow"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm font-semibold mb-2">Phone:</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-shadow"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm font-semibold mb-2">Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-shadow"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm font-semibold mb-2">Business Type:</label>
                  <div className="relative">
                    <select
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white appearance-none focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-shadow cursor-pointer"
                    >
                      <option>Amazon Seller</option>
                      <option>Shopify Store</option>
                      <option>Etsy Seller</option>
                      <option>WooCommerce</option>
                      <option>DTC Brand</option>
                      <option>Other</option>
                    </select>
                    {/* Custom dropdown arrow */}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-orange-500">
                      ▼
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm font-semibold mb-2">Message:</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-shadow resize-none"
                    placeholder="Tell us about your inventory needs, volumes, or special requests..."
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-black py-4 rounded-xl font-bold text-lg hover:from-orange-400 hover:to-orange-500 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-[0_10px_20px_-5px_rgba(249,115,22,0.4)] mt-4"
                >
                  Submit Quote Request
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Put this in your global CSS file for the modal animation (optional but recommended for the full 3D effect): 
          @keyframes popIn {
            0% { opacity: 0; transform: scale(0.95) translateY(10px); }
            100% { opacity: 1; transform: scale(1) translateY(0); }
          }
      */}
    </WebsiteLayout>
  );
};

export default PricingPage;