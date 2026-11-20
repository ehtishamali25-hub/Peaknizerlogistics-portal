import { Link } from 'react-router-dom';

const Footer = () => {
  const socialLinks = [
    { href: 'https://www.facebook.com/profile.php?id=61594559992552', icon: 'M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z', label: 'Peaknizer Logistics on Facebook' },
    { href: 'https://www.linkedin.com/company/peaknizerlogistics/', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z', label: 'Peaknizer Logistics on LinkedIn' },
    { href: 'https://www.instagram.com/peaknizerlogistics_us/', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z', label: 'Peaknizer Logistics on Instagram' },
  ];

  // Each link goes to a real page (the address is written out, not built from the label)
  const companyLinks = [
    { to: '/about', label: 'About Us' },
    { to: '/contact', label: 'Contact' },
    { to: '/careers', label: 'Careers' },
    { to: '/blog', label: 'Blog' },
  ];

  const legalLinks = [
    { to: '/privacy', label: 'Privacy' },
    { to: '/terms', label: 'Terms' },
    { to: '/faq', label: 'FAQ' },
  ];

  // The same contact details are used everywhere on the site
  const contactItems = [
    { icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', text: 'info@peaknizerlogistics.com', href: 'mailto:info@peaknizerlogistics.com' },
    { icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', text: '+1 (571) 307-4461', href: 'tel:+15713074461' },
    { icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z', text: 'Arlington, VA · Houston, TX · New Jersey' },
  ];

  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-8 sm:gap-10 mb-10 sm:mb-12">
          <div className="space-y-4 sm:space-y-6 text-center sm:text-left">
            <div>
              <h3 className="text-2xl md:text-3xl lg:text-2xl xl:text-3xl font-bold text-brand-navy whitespace-nowrap">
                PEAKNIZER<span className="text-emerald-700">LOGISTICS</span>
              </h3>
              <div className="h-1 w-20 bg-brand-emerald mt-2 rounded-full mx-auto sm:mx-0" />
            </div>
            <p className="text-slate-600 leading-relaxed text-sm max-w-md mx-auto sm:mx-0">
              Third-party fulfillment for e-commerce brands. Same-day processing, real-time tracking, and a portal built for full visibility.
            </p>
            <div className="flex justify-center sm:justify-start space-x-4">
              {socialLinks.map(({ href, icon, label }, i) => (
                <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="group w-10 h-10 sm:w-12 sm:h-12 bg-slate-100 rounded-xl border border-slate-200 hover:border-brand-emerald hover:bg-emerald-50 transition-all duration-300 flex items-center justify-center" aria-label={label}>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 group-hover:text-brand-emerald transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d={icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div className="text-center sm:text-left">
            <h4 className="text-brand-navy font-bold mb-4 sm:mb-6 flex items-center justify-center sm:justify-start">
              <span className="w-2 h-2 bg-brand-emerald rounded-full mr-2 sm:mr-3" /> Company
            </h4>
            {companyLinks.map(({ to, label }) => (
              <Link key={to} to={to} className="block py-2 text-slate-600 hover:text-brand-navy hover:translate-x-1 transition-all duration-300 font-medium">
                {label}
              </Link>
            ))}
          </div>

          <div className="text-center sm:text-left">
            <h4 className="text-brand-navy font-bold mb-4 sm:mb-6 flex items-center justify-center sm:justify-start">
              <span className="w-2 h-2 bg-brand-emerald rounded-full mr-2 sm:mr-3" /> Services
            </h4>
            {['Order Fulfillment', 'Warehousing', 'FBA Prep', 'Returns', 'Kitting'].map((item, i) => (
              <Link key={i} to="/services" className="block py-2 text-slate-600 hover:text-brand-navy hover:translate-x-1 transition-all duration-300">
                {item}
              </Link>
            ))}
          </div>

          <div className="text-center sm:text-left">
            <h4 className="text-brand-navy font-bold mb-4 sm:mb-6 flex items-center justify-center sm:justify-start">
              <span className="w-2 h-2 bg-brand-emerald rounded-full mr-2 sm:mr-3" /> Portal
            </h4>
            <div className="space-y-3">
              <Link to="/login" className="block p-3 bg-brand-navy/5 rounded-xl border border-brand-navy/15 hover:border-brand-navy/30 hover:bg-brand-navy/10 transition-all duration-300">
                <span className="font-semibold text-brand-navy">Client portal</span>
              </Link>
              <div className="text-xs text-slate-500 space-y-1">
                <div>Real-time dashboard</div>
                <div>Inventory tracking</div>
                <div>Order monitoring</div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
            {contactItems.map((item, i) => (
              <div key={i} className="flex items-center justify-center sm:justify-start space-x-3 text-slate-600 hover:text-brand-navy transition-colors">
                <div className="p-2 bg-brand-navy/5 rounded-xl">
                  <svg className="w-5 h-5 text-brand-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                </div>
                {item.href ? (
                  <a href={item.href} className="font-medium text-sm sm:text-base break-all hover:underline">{item.text}</a>
                ) : (
                  <span className="font-medium text-sm sm:text-base">{item.text}</span>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center text-slate-500 text-xs sm:text-sm pt-6 border-t border-slate-200 gap-3">
            <p>© {new Date().getFullYear()} Peaknizer Logistics. All rights reserved.</p>
            <div className="flex gap-6">
              {legalLinks.map(({ to, label }) => (
                <Link key={to} to={to} className="hover:text-brand-navy transition-colors font-medium">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;