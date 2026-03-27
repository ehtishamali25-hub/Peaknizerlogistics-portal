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
    // Here you would typically send the data to your backend
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
      <section className="bg-gradient-to-b from-black to-gray-900 py-16 text-center">
        <div className="container mx-auto px-4">
          <div className="inline-block bg-orange-500/10 px-4 py-2 rounded-full mb-4">
            <span className="text-orange-400 font-semibold">💰 TRANSPARENT PRICING</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            PeaknizerLogistics Fulfillment Pricing –{' '}
            <span className="text-orange-500">Transparent. Affordable. Scalable.</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            🚀 Welcome to Peaknizer Logistics, Arlington's premier FBA & FBM prep center—designed to power your e-commerce growth without breaking the bank.
          </p>
          <div className="mt-6 text-gray-300">
            <p>📍 Located in the heart of Arlington, VA – 2503D N Harrison St, Arlington, VA, 22207</p>
            <p className="text-sm text-gray-400 mt-2">Fully equipped to handle everything from Amazon FBA prep to Shopify order fulfillment.</p>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-12 bg-black border-t border-b border-orange-500/20">
        <div className="container mx-auto px-4">
          <div className="bg-gray-900 p-8 rounded-lg border-2 border-orange-500 max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              ⚙️ Simple, Straightforward Pricing
            </h2>
            <p className="text-xl text-orange-400 font-semibold mb-2">Most Cheapest, But Provides Premium Quality</p>
            <p className="text-gray-400">No Surprises, Just Solutions – Transparent rates from day one</p>
          </div>
        </div>
      </section>

      {/* FBM Fulfillment */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-4">
              <span className="text-orange-500">🔹 FBM Fulfillment</span> – From Just $3 per Order
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Ideal for Shopify, Etsy, and WooCommerce Sellers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Feature Cards */}
            <div className="bg-gray-900 p-6 rounded-lg border border-orange-500/30 text-center">
              <div className="text-3xl text-orange-500 mb-3">✅</div>
              <h3 className="text-white font-semibold">Same-Day Fulfillment</h3>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg border border-orange-500/30 text-center">
              <div className="text-3xl text-orange-500 mb-3">📦</div>
              <h3 className="text-white font-semibold">No Storage Fees</h3>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg border border-orange-500/30 text-center">
              <div className="text-3xl text-orange-500 mb-3">🔄</div>
              <h3 className="text-white font-semibold">No Return Processing Charges</h3>
            </div>
          </div>

          {/* Pricing Table */}
          <div className="mt-10 max-w-3xl mx-auto bg-gray-900 rounded-lg overflow-hidden border border-orange-500/30">
            <div className="bg-orange-500 p-4">
              <h3 className="text-black font-bold text-center text-xl">Monthly Volume Pricing</h3>
            </div>
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-white">Monthly Volume</th>
                  <th className="px-6 py-4 text-left text-white">Price per Order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                <tr className="hover:bg-gray-800/50">
                  <td className="px-6 py-4 text-gray-300">100–999 Orders</td>
                  <td className="px-6 py-4 text-orange-400 font-bold">$3.00</td>
                </tr>
                <tr className="hover:bg-gray-800/50">
                  <td className="px-6 py-4 text-gray-300">1,000+ Orders</td>
                  <td className="px-6 py-4 text-orange-400 font-bold">$2.50</td>
                </tr>
                <tr className="hover:bg-gray-800/50">
                  <td className="px-6 py-4 text-gray-300">10,000+ Orders</td>
                  <td className="px-6 py-4 text-orange-400 font-bold">$2.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FBA Prep Services */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-4">
            <span className="text-orange-500">🔹 FBA Prep Services</span> – Amazon-Ready, Done Right
          </h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-10">
            Our Amazon-compliant services include inspection, labeling, polybagging, bundling, and more—starting at just $0.60/unit!
          </p>

          <div className="max-w-3xl mx-auto bg-gray-900 rounded-lg overflow-hidden border border-orange-500/30">
            <div className="bg-orange-500 p-4">
              <h3 className="text-black font-bold text-center text-xl">Prep Service Rates</h3>
            </div>
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-white">Volume</th>
                  <th className="px-6 py-4 text-left text-white">Without Polybag</th>
                  <th className="px-6 py-4 text-left text-white">With Box Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                <tr className="hover:bg-gray-800/50">
                  <td className="px-6 py-4 text-gray-300">100 Units</td>
                  <td className="px-6 py-4 text-orange-400 font-bold">$0.60/unit</td>
                  <td className="px-6 py-4 text-orange-400 font-bold">$2.00/unit</td>
                </tr>
                <tr className="hover:bg-gray-800/50">
                  <td className="px-6 py-4 text-gray-300">100–500 Units</td>
                  <td className="px-6 py-4 text-orange-400 font-bold">$0.55/unit</td>
                  <td className="px-6 py-4 text-gray-400">Upon Request</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 text-center text-gray-400">
            <p className="text-orange-400 font-semibold">🛑 No storage fees for first 30 days • 🛑 No hidden charges</p>
          </div>
        </div>
      </section>

      {/* Bundling Services */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-4">
            <span className="text-orange-500">🔹 Bundling Services</span>
          </h2>
          <p className="text-gray-400 text-center mb-10">From multi-packs to variety packs, we handle it all!</p>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Standard Bundling */}
            <div className="bg-gray-900 p-6 rounded-lg border border-orange-500/30">
              <h3 className="text-xl font-bold text-white mb-4">Standard Bundling (Under 11 lbs)</h3>
              <ul className="space-y-3">
                <li className="flex justify-between text-gray-300">
                  <span>Pack of 2 (Same SKU):</span>
                  <span className="text-orange-400 font-bold">$1.00</span>
                </li>
                <li className="flex justify-between text-gray-300">
                  <span>Additional (Same SKU):</span>
                  <span className="text-orange-400 font-bold">$0.30</span>
                </li>
                <li className="flex justify-between text-gray-300">
                  <span>Different SKU:</span>
                  <span className="text-orange-400 font-bold">Starting at $1.50</span>
                </li>
              </ul>
            </div>

            {/* Oversized Bundling */}
            <div className="bg-gray-900 p-6 rounded-lg border border-orange-500/30">
              <h3 className="text-xl font-bold text-white mb-4">Oversized Bundling (11+ lbs)</h3>
              <ul className="space-y-3">
                <li className="flex justify-between text-gray-300">
                  <span>Under 20 lbs:</span>
                  <span className="text-orange-400 font-bold">$2.50</span>
                </li>
                <li className="flex justify-between text-gray-300">
                  <span>20–30 lbs:</span>
                  <span className="text-orange-400 font-bold">$3.50</span>
                </li>
                <li className="flex justify-between text-gray-300">
                  <span>30+ lbs:</span>
                  <span className="text-orange-400 font-bold">$4.50</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Add-On Services */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-4">
            <span className="text-orange-500">🔹 Add-On Services</span> – Customize Your Prep!
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { service: "Sticker/Tag Removal", price: "$0.30/unit" },
              { service: "Expiry Date Label", price: "$0.20/unit" },
              { service: "Promo Inserts", price: "$0.10/unit" },
              { service: "Liquid Induction Seal", price: "$0.50/unit" },
              { service: "Pro Product Photos", price: "$35 (5 photos)" },
            ].map((item, index) => (
              <div key={index} className="bg-gray-900 p-4 rounded-lg border border-orange-500/20 flex justify-between items-center">
                <span className="text-gray-300">{item.service}</span>
                <span className="text-orange-400 font-bold">{item.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packaging Materials */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-4">
            <span className="text-orange-500">📦 Packaging Materials</span>
          </h2>

          <div className="max-w-3xl mx-auto bg-gray-900 rounded-lg overflow-hidden border border-orange-500/30">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-white">Packaging Type</th>
                  <th className="px-6 py-4 text-left text-white">Size</th>
                  <th className="px-6 py-4 text-left text-white">Price</th>
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
                  <tr key={index} className="hover:bg-gray-800/50">
                    <td className="px-6 py-4 text-gray-300">{item.type}</td>
                    <td className="px-6 py-4 text-gray-300">{item.size}</td>
                    <td className="px-6 py-4 text-orange-400 font-bold">{item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Storage & Handling */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-4">
            <span className="text-orange-500">🏷️ Storage & Handling</span>
          </h2>

          <div className="max-w-3xl mx-auto bg-gray-900 rounded-lg overflow-hidden border border-orange-500/30">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-white">Type</th>
                  <th className="px-6 py-4 text-left text-white">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {[
                  { type: "Standard Pallet (Monthly)", price: "$30/pallet" },
                  { type: "Small Box Storage", price: "$2.00/box" },
                  { type: "Carton Handling (<30 lbs)", price: "$2.95 – $4.95" },
                  { type: "Pallet Shrink Wrap", price: "$25/pallet" },
                ].map((item, index) => (
                  <tr key={index} className="hover:bg-gray-800/50">
                    <td className="px-6 py-4 text-gray-300">{item.type}</td>
                    <td className="px-6 py-4 text-orange-400 font-bold">{item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-8">
            🌟 Why E-Commerce Sellers Choose <span className="text-orange-500">PeaknizerLogistics Fulfillment</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              "✅ Same-Day Shipping",
              "✅ Transparent, Startup-Friendly Pricing",
              "✅ No Long-Term Contracts",
              "✅ Houston-Based, Prime U.S. Location",
              "✅ 100% Amazon-Compliant Processes",
            ].map((item, index) => (
              <div key={index} className="bg-gray-900 p-4 rounded-lg border border-orange-500/20">
                <p className="text-white">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-gray-300 text-lg mb-2">🎯 Perfect for:</p>
            <div className="flex flex-wrap gap-3 justify-center">
              {["Amazon FBA Sellers", "Shopify & Etsy Store Owners", "DTC Brands Scaling Up", "Retailers Outsourcing Logistics"].map((item, index) => (
                <span key={index} className="bg-orange-500/10 text-orange-400 px-4 py-2 rounded-full text-sm border border-orange-500/30">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact & CTA */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            📞 Let's Get You Started Today!
          </h2>
          <p className="text-gray-400 text-lg mb-6">
            Got 100 units or 10,000? We scale with you.
          </p>
          
          <div className="bg-gray-900 p-6 rounded-lg max-w-2xl mx-auto border border-orange-500/30">
            <p className="text-white mb-2">📍 <span className="text-orange-400">2503D N Harrison St, Arlington, VA 22207</span></p>
            <p className="text-white mb-2">📧 <span className="text-orange-400">info@peaknizerlogistics.com</span></p>
            <p className="text-white mb-4">📞 <span className="text-orange-400">+1 571-307-4461</span></p>
            
            <button
              onClick={() => setShowQuoteModal(true)}
              className="bg-orange-500 text-black px-8 py-3 rounded-lg font-bold text-lg hover:bg-orange-400 transition inline-flex items-center gap-2"
            >
              💰 GET FREE PRICE QUOTE INSTANTLY
            </button>
          </div>
        </div>
      </section>

      {/* Quote Modal */}
      {showQuoteModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg max-w-md w-full border-2 border-orange-500">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-white">📬 Get Your Free Quote</h3>
                <button
                  onClick={() => setShowQuoteModal(false)}
                  className="text-gray-400 hover:text-white text-xl"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-1">Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-1">Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-1">Phone:</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-1">Business Type:</label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
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
                  <label className="block text-gray-300 mb-1">Message:</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    placeholder="Tell us about your needs..."
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-orange-500 text-black py-3 rounded-lg font-bold hover:bg-orange-400 transition"
                >
                  Submit Quote Request
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </WebsiteLayout>
  );
};

export default PricingPage;