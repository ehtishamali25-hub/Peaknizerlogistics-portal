import Header from './Header';
import Footer from './Footer';
import { Link } from 'react-router-dom';

const PolicyPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900/50 to-black flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Terms of Service & <span className="text-orange-500">3PL Policies</span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-orange-400 mx-auto rounded-full" />
            <p className="text-gray-400 mt-4">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          {/* Content Card */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-orange-500/20 overflow-hidden">
            <div className="p-6 md:p-8 space-y-8">
              
              {/* Section 1 */}
              <section className="group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center group-hover:bg-orange-500/30 transition">
                    <span className="text-orange-500 font-bold">1</span>
                  </div>
                  <h2 className="text-xl font-semibold text-white">Introduction</h2>
                </div>
                <p className="text-gray-300 leading-relaxed ml-11">
                  These Terms of Service govern the use of Peaknizer Logistics' warehousing, inventory management, 
                  and order fulfillment services. By using our services, you agree to comply with all terms outlined below.
                </p>
              </section>

              {/* Section 2 */}
              <section className="group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center group-hover:bg-orange-500/30 transition">
                    <span className="text-orange-500 font-bold">2</span>
                  </div>
                  <h2 className="text-xl font-semibold text-white">Services Overview</h2>
                </div>
                <p className="text-gray-300 leading-relaxed ml-11">
                  We provide third-party logistics (3PL) services including storage, order fulfillment, shipping, 
                  and returns handling for eCommerce businesses operating on platforms such as Amazon, Walmart, and Shopify.
                </p>
              </section>

              {/* Section 3 */}
              <section className="group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center group-hover:bg-orange-500/30 transition">
                    <span className="text-orange-500 font-bold">3</span>
                  </div>
                  <h2 className="text-xl font-semibold text-white">Client Responsibilities</h2>
                </div>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-11">
                  <li>Provide accurate product, SKU, and shipping information</li>
                  <li>Ensure all products comply with U.S. laws and marketplace regulations</li>
                  <li>Maintain valid business and contact information</li>
                  <li>Ensure all inventory sent is properly labeled and documented</li>
                </ul>
              </section>

              {/* Section 4 */}
              <section className="group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center group-hover:bg-orange-500/30 transition">
                    <span className="text-orange-500 font-bold">4</span>
                  </div>
                  <h2 className="text-xl font-semibold text-white">Inventory Receiving</h2>
                </div>
                <p className="text-gray-300 leading-relaxed ml-11">
                  All inbound shipments must include proper labeling, packing lists, and prior notification. 
                  We are not responsible for supplier errors, including incorrect or missing items.
                </p>
              </section>

              {/* Section 5 */}
              <section className="group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center group-hover:bg-orange-500/30 transition">
                    <span className="text-orange-500 font-bold">5</span>
                  </div>
                  <h2 className="text-xl font-semibold text-white">Order Fulfillment</h2>
                </div>
                <p className="text-gray-300 leading-relaxed ml-11">
                  Orders are processed based on our daily cutoff times. Once processed, orders cannot be modified or canceled.
                </p>
              </section>

              {/* Section 6 */}
              <section className="group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center group-hover:bg-orange-500/30 transition">
                    <span className="text-orange-500 font-bold">6</span>
                  </div>
                  <h2 className="text-xl font-semibold text-white">Storage & Fees</h2>
                </div>
                <p className="text-gray-300 leading-relaxed ml-11">
                  Storage, fulfillment, and additional services are billed according to our pricing structure. 
                  Late payments may result in service suspension or account termination.
                </p>
              </section>

              {/* Section 7 */}
              <section className="group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center group-hover:bg-orange-500/30 transition">
                    <span className="text-orange-500 font-bold">7</span>
                  </div>
                  <h2 className="text-xl font-semibold text-white">Returns Handling</h2>
                </div>
                <p className="text-gray-300 leading-relaxed ml-11">
                  Returned items may be inspected, restocked, or disposed of based on their condition. 
                  Additional fees may apply for return processing.
                </p>
              </section>

              {/* Section 8 */}
              <section className="group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center group-hover:bg-orange-500/30 transition">
                    <span className="text-orange-500 font-bold">8</span>
                  </div>
                  <h2 className="text-xl font-semibold text-white">Shipping & Carriers</h2>
                </div>
                <p className="text-gray-300 leading-relaxed ml-11">
                  Once shipments are handed over to carriers, we are not responsible for delays, damages, or lost packages.
                </p>
              </section>

              {/* Section 9 */}
              <section className="group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center group-hover:bg-orange-500/30 transition">
                    <span className="text-orange-500 font-bold">9</span>
                  </div>
                  <h2 className="text-xl font-semibold text-white">Liability Limitation</h2>
                </div>
                <p className="text-gray-300 leading-relaxed ml-11">
                  Our liability is limited to the declared value of goods or a predefined cap per incident. 
                  We are not liable for indirect losses such as lost sales, account suspensions, or marketplace penalties.
                </p>
              </section>

              {/* Section 10 */}
              <section className="group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center group-hover:bg-orange-500/30 transition">
                    <span className="text-orange-500 font-bold">10</span>
                  </div>
                  <h2 className="text-xl font-semibold text-white">Distributor Shipments</h2>
                </div>
                <p className="text-gray-300 leading-relaxed ml-11">
                  Clients sourcing from distributors are responsible for ensuring shipment accuracy. 
                  We are not liable for supplier mistakes, shortages, or damages.
                </p>
              </section>

              {/* Section 11 */}
              <section className="group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center group-hover:bg-orange-500/30 transition">
                    <span className="text-orange-500 font-bold">11</span>
                  </div>
                  <h2 className="text-xl font-semibold text-white">Multi-Warehouse Operations</h2>
                </div>
                <p className="text-gray-300 leading-relaxed ml-11">
                  Inventory may be stored and fulfilled from any of our warehouse locations for operational efficiency. 
                  Transfers between warehouses may incur additional charges.
                </p>
              </section>

              {/* Section 12 - Important Legal Clause */}
              <section className="border border-red-500/30 rounded-xl p-6 bg-red-500/5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-red-500/30 rounded-lg flex items-center justify-center">
                    <span className="text-red-400 font-bold">12</span>
                  </div>
                  <h2 className="text-xl font-semibold text-red-400">Strict Compliance & Illegal Activities</h2>
                </div>
                <div className="ml-11 space-y-3">
                  <p className="text-gray-300">
                    Peaknizer Logistics maintains a zero-tolerance policy for illegal or fraudulent activities.
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    <li>If any client uses our warehouse address for illegal activities, we reserve the full right to immediately hold all associated inventory and report the matter to relevant law enforcement authorities.</li>
                    <li>If a client provides fake, misleading, or unauthorized shipping labels, we reserve the right to hold all inventory and suspend services without notice.</li>
                    <li>If counterfeit products are identified, or if a client fails to provide valid invoices or proof of product authenticity, we reserve the right to hold inventory and initiate legal action.</li>
                    <li>Any violation of these terms may result in immediate account termination and legal reporting.</li>
                  </ul>
                </div>
              </section>

              {/* Section 13 */}
              <section className="group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center group-hover:bg-orange-500/30 transition">
                    <span className="text-orange-500 font-bold">13</span>
                  </div>
                  <h2 className="text-xl font-semibold text-white">Prohibited Products</h2>
                </div>
                <p className="text-gray-300 leading-relaxed ml-11">
                  Clients are strictly prohibited from storing or shipping illegal, hazardous, or restricted items, 
                  including counterfeit goods or products that violate marketplace policies.
                </p>
              </section>

              {/* Section 14 */}
              <section className="group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center group-hover:bg-orange-500/30 transition">
                    <span className="text-orange-500 font-bold">14</span>
                  </div>
                  <h2 className="text-xl font-semibold text-white">Account Suspension & Termination</h2>
                </div>
                <p className="text-gray-300 leading-relaxed ml-11">
                  We reserve the right to suspend or terminate accounts due to non-payment, policy violations, 
                  or suspicious activity. Clients must arrange inventory removal upon termination.
                </p>
              </section>

              {/* Section 15 */}
              <section className="group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center group-hover:bg-orange-500/30 transition">
                    <span className="text-orange-500 font-bold">15</span>
                  </div>
                  <h2 className="text-xl font-semibold text-white">Policy Updates</h2>
                </div>
                <p className="text-gray-300 leading-relaxed ml-11">
                  We may update these Terms at any time. Continued use of our services constitutes acceptance of the updated terms.
                </p>
              </section>

              {/* Section 16 */}
              <section className="group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center group-hover:bg-orange-500/30 transition">
                    <span className="text-orange-500 font-bold">16</span>
                  </div>
                  <h2 className="text-xl font-semibold text-white">Contact Information</h2>
                </div>
                <div className="ml-11 space-y-2">
                  <p className="text-gray-300">For any questions regarding these Terms, please contact us:</p>
                  <div className="flex flex-col space-y-1 text-gray-300">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>contact@peaknizerlogistics.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>+1 (571) 293-0721</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>2503D N Harrison St, Arlington, VA 22207</span>
                    </div>
                  </div>
                </div>
              </section>

              <div className="pt-4 text-center text-sm text-gray-500 border-t border-gray-800">
                <p>© {new Date().getFullYear()} Peaknizer Logistics. All rights reserved.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-400 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PolicyPage;