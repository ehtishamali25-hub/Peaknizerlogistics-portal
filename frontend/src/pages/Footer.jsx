// Footer.jsx
import { Link } from 'react-router-dom';

const Footer = () => {
  const socialLinks = [
    { href: 'https://facebook.com/peaknizerlogistics', icon: 'M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z', label: 'Facebook' },
    // Add other social icons...
  ];

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-black via-gray-900 to-black border-t border-orange-500/20">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-orange-500/5 via-transparent to-orange-500/5 animate-pulse" />
        <div className="absolute inset-0 bg-grid-white/5" />
      </div>

      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="space-y-6">
            <div className="group">
              <h3 className="text-3xl font-black bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400 bg-clip-text text-transparent drop-shadow-2xl">
                PEAKNIZERLOGISTICS
              </h3>
              <div className="h-1 w-20 bg-gradient-to-r from-orange-500 to-orange-400 mt-2 rounded-full animate-pulse" />
            </div>
            <p className="text-gray-400 leading-relaxed text-sm max-w-md">
              🚚 Premium 3PL fulfillment for e-commerce. Same-day processing, real-time tracking, and seamless integrations.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map(({ href, icon, label }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-12 h-12 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-orange-500/30 hover:bg-orange-500/20 hover:border-orange-500/50 transition-all duration-300 hover:scale-110 hover:rotate-3"
                  aria-label={label}
                >
                  <svg className="w-5 h-5 mx-auto text-gray-400 group-hover:text-orange-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d={icon} />
                  </svg>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-300" />
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-bold mb-6 flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-3 animate-ping" /> Company
            </h4>
            {['About Us', 'Contact', 'Careers', 'Blog'].map((item, i) => (
              <Link
                key={i}
                to={`/${item.toLowerCase().replace(' ', '-')}`}
                className="block py-2 text-gray-400 hover:text-orange-400 hover:translate-x-2 transition-all duration-300 font-medium"
              >
                {item}
              </Link>
            ))}
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-bold mb-6 flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-3 animate-ping" /> Services
            </h4>
            {['Order Fulfillment', 'Warehousing', 'FBA Prep', 'Returns', 'Kitting'].map((item, i) => (
              <div key={i} className="py-2 text-gray-400 hover:text-orange-400 hover:translate-x-2 transition-all duration-300 cursor-pointer">
                {item}
              </div>
            ))}
          </div>

          {/* Portal */}
          <div>
            <h4 className="text-white font-bold mb-6 flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-3 animate-ping" /> Portal
            </h4>
            <div className="space-y-3">
              <Link to="/login" className="block p-3 bg-gradient-to-r from-orange-500/10 to-orange-400/10 rounded-xl border border-orange-500/30 hover:border-orange-500/50 hover:bg-orange-500/20 transition-all duration-300">
                <span className="font-semibold text-orange-400">CLIENT PORTAL</span>
              </Link>
              <div className="text-xs text-gray-500 space-y-1">
                <div>📱 Real-time dashboard</div>
                <div>📦 Inventory tracking</div>
                <div>🚚 Order monitoring</div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[
              { icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', text: 'info@peaknizerlogistics.com' },
              { icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', text: '+1 (571) 307-4461' },
              { icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z', text: '5801 KINGSTOWNE CENTER DRIVE, ALEXANDRIA, VA 22315' }
            ].map((item, i) => (
              <div key={i} className="flex items-center space-x-3 text-gray-400 group hover:text-orange-400 transition-colors">
                <div className="p-2 bg-orange-500/10 rounded-xl group-hover:bg-orange-500/20 transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                </div>
                <span className="font-medium">{item.text}</span>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm pt-6 border-t border-gray-800">
            <p>© {new Date().getFullYear()} Peaknizer Logistics. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              {['Privacy', 'Terms', 'FAQ'].map((item, i) => (
                <Link key={i} to={`/${item.toLowerCase()}`} className="hover:text-orange-400 transition-colors font-medium">
                  {item}
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