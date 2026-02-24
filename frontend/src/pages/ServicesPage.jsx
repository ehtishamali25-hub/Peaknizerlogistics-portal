import WebsiteLayout from "./WebsiteLayout";
import { Link } from "react-router-dom";

const ServicesPage = () => {
  return (
    <WebsiteLayout>
      {/* HERO */}
      <section className="bg-gradient-to-b from-black to-gray-900 py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Our <span className="text-orange-500">3PL Services</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            End-to-end fulfillment solutions designed for fast-growing
            e-commerce brands. From warehousing to last-mile delivery —
            we handle everything.
          </p>
          
          {/* Client Portal CTA */}
          <div className="mt-8 inline-block bg-gray-900 p-4 rounded-lg border border-orange-500/30">
            <p className="text-white mb-2">📱 <span className="text-orange-500 font-semibold">Client Portal Access</span></p>
            <p className="text-gray-400 text-sm mb-3">Manage your inventory, track orders, and view invoices 24/7</p>
            <Link
              to="/login"
              className="bg-orange-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-orange-400 transition inline-block"
            >
              Login to Portal →
            </Link>
          </div>
        </div>
      </section>

      {/* CORE SERVICES */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            What We Offer
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Warehousing */}
            <div className="bg-gray-900 p-8 rounded-lg border border-orange-500/20 hover:-translate-y-2 transition">
              <div className="text-4xl text-orange-500 mb-4">🏬</div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Warehousing
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Secure, climate-controlled storage facilities with real-time inventory tracking and strict quality control systems. Our warehouses are strategically located near major shipping hubs to reduce transit times and costs. We offer flexible storage solutions for businesses of all sizes, from startups to enterprise-level operations. Each facility is equipped with 24/7 security monitoring, fire suppression systems, and temperature control for sensitive goods. Our inventory management system ensures accurate stock counts with regular cycle counts and full physical inventories.
              </p>
              <div className="mt-4 pt-4 border-t border-gray-800">
                <span className="text-orange-400 text-xs font-semibold">📱 PORTAL FEATURE</span>
                <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                  View real-time stock levels across all warehouses through your personalized dashboard. Set low-stock alerts, generate inventory reports, and track receiving history. Access detailed product locations, batch numbers, and expiration dates for complete visibility.
                </p>
              </div>
            </div>

            {/* Order Fulfillment */}
            <div className="bg-gray-900 p-8 rounded-lg border border-orange-500/20 hover:-translate-y-2 transition">
              <div className="text-4xl text-orange-500 mb-4">📦</div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Order Fulfillment
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Fast pick, pack, and ship operations with same-day processing to ensure customer satisfaction. Our trained fulfillment specialists use optimized picking routes and quality-checked packing materials to ensure every order arrives intact. We integrate with all major e-commerce platforms including Shopify, WooCommerce, Amazon, and eBay for seamless order import. Multi-item orders are carefully consolidated, and special packaging requests are handled with precision. Our system automatically selects the most cost-effective shipping carrier based on package dimensions, weight, and destination.
              </p>
              <div className="mt-4 pt-4 border-t border-gray-800">
                <span className="text-orange-400 text-xs font-semibold">📱 PORTAL FEATURE</span>
                <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                  Track order status in real-time from receipt to delivery. View picking progress, packing status, and shipping confirmations instantly. Access order history, generate packing slips, and receive automated customer notifications when orders ship.
                </p>
              </div>
            </div>

            {/* Shipping & Delivery */}
            <div className="bg-gray-900 p-8 rounded-lg border border-orange-500/20 hover:-translate-y-2 transition">
              <div className="text-4xl text-orange-500 mb-4">🚚</div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Shipping & Delivery
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Partnerships with leading carriers to optimize cost and speed while ensuring timely deliveries. We work with USPS, FedEx, UPS, DHL, and regional carriers to provide the best rates and delivery options. Our shipping algorithm automatically selects the optimal carrier based on delivery speed requirements, destination, and package characteristics. We offer both domestic and international shipping with full customs documentation support. Real-time tracking updates are provided at every stage, from pickup to final delivery, with delivery confirmation and signature options available.
              </p>
              <div className="mt-4 pt-4 border-t border-gray-800">
                <span className="text-orange-400 text-xs font-semibold">📱 PORTAL FEATURE</span>
                <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                  Get real-time tracking updates and delivery confirmations directly in your dashboard. Compare carrier rates, view shipping history, and access detailed delivery analytics. Receive instant notifications for delayed shipments and proactive customer updates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CLIENT PORTAL HIGHLIGHT */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-gray-900 p-8 rounded-lg border-2 border-orange-500">
              <h2 className="text-3xl font-bold text-white mb-6">
                <span className="text-orange-500">Client Portal</span> Dashboard
              </h2>
              <p className="text-gray-400 mb-6">
                Your all-in-one control center for logistics management. Access your portal 24/7 from any device.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="text-orange-500 text-xl">📊</div>
                  <div>
                    <h4 className="text-white font-semibold">Real-Time Inventory</h4>
                    <p className="text-gray-400 text-sm">Monitor stock levels across all warehouses instantly</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="text-orange-500 text-xl">💰</div>
                  <div>
                    <h4 className="text-white font-semibold">Invoice Management</h4>
                    <p className="text-gray-400 text-sm">View, download, and pay invoices with payment proof upload</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="text-orange-500 text-xl">📦</div>
                  <div>
                    <h4 className="text-white font-semibold">Order Tracking</h4>
                    <p className="text-gray-400 text-sm">Track your shipments from warehouse to customer</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="text-orange-500 text-xl">📄</div>
                  <div>
                    <h4 className="text-white font-semibold">Shipping Details</h4>
                    <p className="text-gray-400 text-sm">Download shipping manifests and Excel reports</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  to="/login"
                  className="bg-orange-500 text-black px-8 py-3 rounded-lg font-semibold hover:bg-orange-400 transition inline-flex items-center"
                >
                  Access Your Portal <span className="ml-2">→</span>
                </Link>
                <p className="text-gray-500 text-sm mt-3">
                  New customer? <Link to="/login" className="text-orange-500 hover:underline">Create account</Link> to get started
                </p>
              </div>
            </div>

            {/* Portal Features Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "👥", title: "Multi-User Access", desc: "Team accounts with role-based permissions for employees and managers" },
                { icon: "📱", title: "Mobile Friendly", desc: "Fully responsive design accessible from any device, anywhere" },
                { icon: "🔔", title: "Instant Alerts", desc: "Get notified of order updates, low stock, and delivery confirmations" },
                { icon: "📊", title: "Analytics", desc: "View fulfillment performance metrics and generate custom reports" },
                { icon: "📎", title: "Document Upload", desc: "Submit payment proofs, shipping documents, and customs forms" },
                { icon: "🔄", title: "Real-Time Sync", desc: "Always up-to-date information synchronized across all platforms" },
              ].map((feature, i) => (
                <div key={i} className="bg-gray-900 p-4 rounded-lg border border-orange-500/20">
                  <div className="text-2xl text-orange-500 mb-2">{feature.icon}</div>
                  <h4 className="text-white font-semibold text-sm">{feature.title}</h4>
                  <p className="text-gray-400 text-xs mt-1">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AMAZON FBA PREP */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">
              Amazon FBA Prep Services
            </h2>
            <ul className="space-y-4 text-gray-400">
              <li>✓ Product labeling & barcoding – FNSKU, UPC, and custom labels applied precisely</li>
              <li>✓ Poly bagging & bundling – suffocation warnings,窒息 warnings, and bundle preparation</li>
              <li>✓ Carton forwarding – direct-to-Amazon shipments with proper box labeling</li>
              <li>✓ Inspection & quality checks – 100% inspection for defects, damages, and compliance</li>
              <li>✓ Compliance with Amazon guidelines – strict adherence to FBA preparation requirements</li>
              <li>✓ Prep for hazardous materials – proper handling of lithium batteries, aerosols, etc.</li>
              <li>✓ Expiration date management – FEFO rotation and date labeling for perishables</li>
            </ul>
            <div className="mt-6 p-4 bg-gray-900 rounded-lg border border-orange-500/30">
              <p className="text-orange-400 text-sm font-semibold">📱 PORTAL INTEGRATION</p>
              <p className="text-gray-400 text-sm mt-1 leading-relaxed">
                Track FBA prep status and inventory through your dashboard. Monitor units prepped, shipped to Amazon, and received at fulfillment centers. Get alerts for compliance issues and deadline reminders.
              </p>
            </div>
          </div>

          <div className="bg-gray-900 p-8 rounded-lg border border-orange-500/20">
            <h3 className="text-xl font-semibold text-white mb-4">
              Why Choose Our FBA Prep?
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              We ensure full compliance with Amazon’s strict standards, reducing delays and preventing account issues. Our trained team handles every SKU with precision and care, following Amazon's ever-changing requirements.
            </p>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>✓ <span className="text-white">100% compliance guarantee</span> – we cover FBA penalties caused by our prep errors</li>
              <li>✓ <span className="text-white">Fast turnaround</span> – 24-48 hour prep time for most SKUs</li>
              <li>✓ <span className="text-white">Bulk discounts</span> – volume pricing for high-quantity shipments</li>
              <li>✓ <span className="text-white">FBA Prep Pro certified</span> – staff trained in Amazon's latest requirements</li>
            </ul>
          </div>
        </div>
      </section>

      {/* PROCESS SECTION */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-12">
            Our Fulfillment Process
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "Receive Inventory", desc: "We receive, inspect, and log your products into our WMS" },
              { step: "Store Securely", desc: "Climate-controlled storage with real-time inventory tracking" },
              { step: "Pick & Pack", desc: "Accurate picking and custom packing for each order" },
              { step: "Ship Orders", desc: "Carrier-optimized shipping with real-time tracking" }
            ].map((item, index) => (
              <div key={index}>
                <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                  {index + 1}
                </div>
                <h3 className="text-white font-semibold mb-2">{item.step}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-gray-400">
            <p>📱 <span className="text-orange-400">Track every step</span> through your Client Portal dashboard with real-time status updates and notifications</p>
          </div>
        </div>
      </section>

      {/* INDUSTRIES WE SERVE */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Industries We Serve
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              "E-commerce Brands",
              "Amazon Sellers",
              "Shopify Stores",
              "Retail Businesses",
              "D2C Brands",
              "Subscription Boxes",
              "Health & Beauty",
              "Electronics",
              "Apparel & Fashion",
              "Food & Beverage",
              "Pet Supplies",
              "Home & Garden",
            ].map((industry, index) => (
              <div
                key={index}
                className="bg-gray-900 p-6 rounded-lg border border-orange-500/20 text-gray-300 hover:bg-gray-800 transition"
              >
                {industry}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-orange-700 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Scale with Our 3PL Solutions?
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Get a free consultation and custom fulfillment plan for your business. Our experts will analyze your needs and provide a tailored solution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-900 transition"
            >
              Request Free Quote
            </Link>
            <Link
              to="/login"
              className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Access Client Portal →
            </Link>
          </div>
        </div>
      </section>

      
    </WebsiteLayout>
  );
};

export default ServicesPage;