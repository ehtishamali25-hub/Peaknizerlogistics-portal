import { Link } from 'react-router-dom';

const PolicyPage = () => {
  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Terms of Service & 3PL Policies</h1>
        
        <div className="bg-white/10 rounded-lg p-6 text-gray-300 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Introduction</h2>
            <p>
              These Terms of Service govern the use of Peaknizer Logistics' warehousing, inventory management, 
              and order fulfillment services. By using our services, you agree to comply with all terms outlined below.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Services Overview</h2>
            <p>
              We provide third-party logistics (3PL) services including storage, order fulfillment, shipping, 
              and returns handling for eCommerce businesses operating on platforms such as Amazon, Walmart, and Shopify.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Client Responsibilities</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Provide accurate product, SKU, and shipping information</li>
              <li>Ensure all products comply with U.S. laws and marketplace regulations</li>
              <li>Maintain valid business and contact information</li>
              <li>Ensure all inventory sent is properly labeled and documented</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Inventory Receiving</h2>
            <p>
              All inbound shipments must include proper labeling, packing lists, and prior notification. 
              We are not responsible for supplier errors, including incorrect or missing items.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Order Fulfillment</h2>
            <p>
              Orders are processed based on our daily cutoff times. Once processed, orders cannot be modified or canceled.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Storage & Fees</h2>
            <p>
              Storage, fulfillment, and additional services are billed according to our pricing structure. 
              Late payments may result in service suspension or account termination.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Returns Handling</h2>
            <p>
              Returned items may be inspected, restocked, or disposed of based on their condition. 
              Additional fees may apply for return processing.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Shipping & Carriers</h2>
            <p>
              Once shipments are handed over to carriers, we are not responsible for delays, damages, or lost packages.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Liability Limitation</h2>
            <p>
              Our liability is limited to the declared value of goods or a predefined cap per incident. 
              We are not liable for indirect losses such as lost sales, account suspensions, or marketplace penalties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Distributor Shipments</h2>
            <p>
              Clients sourcing from distributors are responsible for ensuring shipment accuracy. 
              We are not liable for supplier mistakes, shortages, or damages.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">11. Multi-Warehouse Operations</h2>
            <p>
              Inventory may be stored and fulfilled from any of our warehouse locations for operational efficiency. 
              Transfers between warehouses may incur additional charges.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-red-400 mb-3">12. Strict Compliance & Illegal Activities</h2>
            <p>
              Peaknizer Logistics maintains a zero-tolerance policy for illegal or fraudulent activities.
            </p>
            <ul className="list-disc list-inside mt-2 space-y-2">
              <li>If any client uses our warehouse address for illegal activities, we reserve the full right to immediately hold all associated inventory and report the matter to relevant law enforcement authorities.</li>
              <li>If a client provides fake, misleading, or unauthorized shipping labels, we reserve the right to hold all inventory and suspend services without notice.</li>
              <li>If counterfeit products are identified, or if a client fails to provide valid invoices or proof of product authenticity, we reserve the right to hold inventory and initiate legal action.</li>
              <li>Any violation of these terms may result in immediate account termination and legal reporting.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">13. Prohibited Products</h2>
            <p>
              Clients are strictly prohibited from storing or shipping illegal, hazardous, or restricted items, 
              including counterfeit goods or products that violate marketplace policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">14. Account Suspension & Termination</h2>
            <p>
              We reserve the right to suspend or terminate accounts due to non-payment, policy violations, 
              or suspicious activity. Clients must arrange inventory removal upon termination.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">15. Policy Updates</h2>
            <p>
              We may update these Terms at any time. Continued use of our services constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">16. Contact Information</h2>
            <p>
              For any questions regarding these Terms, please contact us:
            </p>
            <p className="mt-2">
              Email: contact@peaknizerlogistics.com<br />
              Phone: +1 (571) 293-0721<br />
              Address: 2503D N Harrison St, Arlington, VA 22207
            </p>
          </section>

          <div className="pt-4 text-sm text-gray-400 border-t border-gray-700">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-orange-500 hover:text-orange-400 transition">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PolicyPage;