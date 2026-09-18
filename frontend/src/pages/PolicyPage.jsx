import WebsiteLayout from './WebsiteLayout';
import { Link } from 'react-router-dom';

const sections = [
  {
    num: 1,
    title: 'Introduction',
    body: "These Terms of Service govern the use of Peaknizer Logistics' warehousing, inventory management, and order fulfillment services. By using our services, you agree to comply with all terms outlined below."
  },
  {
    num: 2,
    title: 'Services Overview',
    body: 'We provide third-party logistics (3PL) services including storage, order fulfillment, shipping, and returns handling for e-commerce businesses operating on platforms such as Amazon, Walmart, and Shopify.'
  },
  {
    num: 3,
    title: 'Client Responsibilities',
    list: [
      'Provide accurate product, SKU, and shipping information',
      'Ensure all products comply with U.S. laws and marketplace regulations',
      'Maintain valid business and contact information',
      'Ensure all inventory sent is properly labeled and documented'
    ]
  },
  {
    num: 4,
    title: 'Inventory Receiving',
    body: 'All inbound shipments must include proper labeling, packing lists, and prior notification. We are not responsible for supplier errors, including incorrect or missing items.'
  },
  {
    num: 5,
    title: 'Order Fulfillment',
    body: 'Orders are processed based on our daily cutoff times. Once processed, orders cannot be modified or canceled.'
  },
  {
    num: 6,
    title: 'Storage & Fees',
    body: 'Storage, fulfillment, and additional services are billed according to our pricing structure. Late payments may result in service suspension or account termination.'
  },
  {
    num: 7,
    title: 'Returns Handling',
    body: 'Returned items may be inspected, restocked, or disposed of based on their condition. Additional fees may apply for return processing.'
  },
  {
    num: 8,
    title: 'Shipping & Carriers',
    body: 'Once shipments are handed over to carriers, we are not responsible for delays, damages, or lost packages.'
  },
  {
    num: 9,
    title: 'Liability Limitation',
    body: 'Our liability is limited to the declared value of goods or a predefined cap per incident. We are not liable for indirect losses such as lost sales, account suspensions, or marketplace penalties.'
  },
  {
    num: 10,
    title: 'Distributor Shipments',
    body: 'Clients sourcing from distributors are responsible for ensuring shipment accuracy. We are not liable for supplier mistakes, shortages, or damages.'
  },
  {
    num: 11,
    title: 'Multi-Warehouse Operations',
    body: 'Inventory may be stored and fulfilled from any of our warehouse locations for operational efficiency. Transfers between warehouses may incur additional charges.'
  },
  {
    num: 13,
    title: 'Prohibited Products',
    body: 'Clients are strictly prohibited from storing or shipping illegal, hazardous, or restricted items, including counterfeit goods or products that violate marketplace policies.'
  },
  {
    num: 14,
    title: 'Account Suspension & Termination',
    body: 'We reserve the right to suspend or terminate accounts due to non-payment, policy violations, or suspicious activity. Clients must arrange inventory removal upon termination.'
  },
  {
    num: 15,
    title: 'Policy Updates',
    body: 'We may update these Terms at any time. Continued use of our services constitutes acceptance of the updated terms.'
  }
];

const PolicyPage = () => {
  return (
    <WebsiteLayout>
      <main className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-brand-navy/[0.03]">
        <div className="max-w-4xl mx-auto">

          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-navy mb-4">
              Terms of service & 3PL policies
            </h1>
            <div className="w-20 sm:w-24 h-1 bg-brand-emerald mx-auto rounded-full" />
            <p className="text-slate-500 mt-4 text-sm sm:text-base">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 sm:p-6 md:p-8 space-y-6 sm:space-y-8">

              {sections.slice(0, 11).map((s) => (
                <section key={s.num}>
                  <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                      <span className="text-brand-navy font-bold text-sm sm:text-base">{s.num}</span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-semibold text-brand-navy">{s.title}</h2>
                  </div>
                  {s.body && (
                    <p className="text-slate-700 leading-relaxed ml-10 sm:ml-11 text-sm sm:text-base">{s.body}</p>
                  )}
                  {s.list && (
                    <ul className="list-disc list-inside text-slate-700 space-y-1.5 sm:space-y-2 ml-10 sm:ml-11 text-sm sm:text-base">
                      {s.list.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  )}
                </section>
              ))}

              {/* Section 12 - kept red for emphasis, structure and content unchanged */}
              <section className="border border-red-300/70 rounded-xl p-4 sm:p-6 bg-red-50">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <span className="text-red-600 font-bold text-sm sm:text-base">12</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-semibold text-red-700">Strict Compliance & Illegal Activities</h2>
                </div>
                <div className="ml-10 sm:ml-11 space-y-3 text-sm sm:text-base">
                  <p className="text-slate-700">
                    Peaknizer Logistics maintains a zero-tolerance policy for illegal or fraudulent activities.
                  </p>
                  <ul className="list-disc list-inside text-slate-700 space-y-2">
                    <li>If any client uses our warehouse address for illegal activities, we reserve the full right to immediately hold all associated inventory and report the matter to relevant law enforcement authorities.</li>
                    <li>If a client provides fake, misleading, or unauthorized shipping labels, we reserve the right to hold all inventory and suspend services without notice.</li>
                    <li>If counterfeit products are identified, or if a client fails to provide valid invoices or proof of product authenticity, we reserve the right to hold inventory and initiate legal action.</li>
                    <li>Any violation of these terms may result in immediate account termination and legal reporting.</li>
                  </ul>
                </div>
              </section>

              {sections.slice(11).map((s) => (
                <section key={s.num}>
                  <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                      <span className="text-brand-navy font-bold text-sm sm:text-base">{s.num}</span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-semibold text-brand-navy">{s.title}</h2>
                  </div>
                  <p className="text-slate-700 leading-relaxed ml-10 sm:ml-11 text-sm sm:text-base">{s.body}</p>
                </section>
              ))}

              {/* Section 16 - Contact Information */}
              <section>
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                    <span className="text-brand-navy font-bold text-sm sm:text-base">16</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-semibold text-brand-navy">Contact Information</h2>
                </div>
                <div className="ml-10 sm:ml-11 space-y-2 text-sm sm:text-base">
                  <p className="text-slate-700">For any questions regarding these Terms, please contact us:</p>
                  <div className="flex flex-col space-y-2 text-slate-700">
                    <div className="flex items-center gap-2 flex-wrap">
                      <svg className="w-5 h-5 text-brand-navy flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="break-all">contact@peaknizerlogistics.com</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <svg className="w-5 h-5 text-brand-navy flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>+1 (571) 518-2791</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-brand-navy flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="break-words">Arlington, VA & Houston, TX</span>
                    </div>
                  </div>
                </div>
              </section>

              <div className="pt-4 text-center text-xs sm:text-sm text-slate-500 border-t border-slate-200">
                <p>© {new Date().getFullYear()} Peaknizer Logistics. All rights reserved.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2 text-brand-navy hover:text-brand-navy-light transition text-sm sm:text-base font-medium">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    </WebsiteLayout>
  );
};

export default PolicyPage;