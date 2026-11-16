// src/pages/NotFound.jsx
// Shown for any address that is not a real page (instead of showing the homepage).
// In App.jsx it must be the LAST route:  <Route path="*" element={<NotFound />} />
// RouteSeo marks these addresses "noindex", so Google drops them.

import { Link } from 'react-router-dom';
import WebsiteLayout from './WebsiteLayout';

const suggestions = [
  { to: '/services', title: 'Our services', desc: 'Prep, storage and order fulfillment.' },
  { to: '/pricing', title: 'Pricing', desc: 'Rates and how quotes work.' },
  { to: '/contact', title: 'Contact us', desc: 'Ask a question or request a quote.' },
];

const NotFound = () => {
  return (
    <WebsiteLayout>
      <section className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
          <p className="text-sm font-semibold text-emerald-700 uppercase tracking-wide">Error 404</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#0E2A47] mt-3 mb-4">Page not found</h1>
          <p className="text-slate-600 text-base sm:text-lg max-w-md mx-auto mb-8">
            The page you are looking for does not exist or has moved.
          </p>
          <Link
            to="/"
            className="inline-block bg-[#0E2A47] hover:bg-[#123457] text-white font-semibold px-6 py-3 rounded-md transition-colors"
          >
            Go to the homepage
          </Link>

          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto mt-12 text-left">
            {suggestions.map(({ to, title, desc }) => (
              <Link
                key={to}
                to={to}
                className="block bg-[#0E2A47]/[0.03] border border-slate-200 hover:border-[#0E2A47]/40 rounded-xl p-5 transition-colors"
              >
                <span className="block text-lg font-bold text-[#0E2A47] mb-1">{title}</span>
                <span className="block text-slate-600 text-sm leading-relaxed">{desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </WebsiteLayout>
  );
};

export default NotFound;