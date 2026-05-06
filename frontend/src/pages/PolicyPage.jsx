import { Link } from 'react-router-dom';

const PolicyPage = () => {
  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Terms of Service & 3PL Policies</h1>
        
        <div className="bg-white/10 rounded-lg p-6 text-gray-300 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Introduction</h2>
            <p>These Terms of Service govern the use of Peaknizer Logistics' warehousing, inventory management, and order fulfillment services.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Services Overview</h2>
            <p>We provide third-party logistics (3PL) services including storage, order fulfillment, shipping, and returns handling.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Contact Information</h2>
            <p>Email: contact@peaknizerlogistics.com<br />Phone: +1 (571) 293-0721<br />Address: 2503D N Harrison St, Arlington, VA 22207</p>
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