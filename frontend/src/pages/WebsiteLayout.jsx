import { Link } from 'react-router-dom';

const WebsiteLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-black border-b border-orange-600 fixed w-full top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold text-orange-500 hover:text-orange-400 transition">
              PEAKNIZERLOGISTICS
            </Link>

            {/* Center Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-300 hover:text-orange-500 transition">Home</Link>
              <Link to="/services" className="text-gray-300 hover:text-orange-500 transition">Services</Link>
              <Link to="/about" className="text-gray-300 hover:text-orange-500 transition">About Us</Link>
              <Link to="/pricing" className="text-gray-300 hover:text-orange-500 transition">Pricing</Link>
              <Link to="/contact" className="text-gray-300 hover:text-orange-500 transition">Contact</Link>
            </nav>

            {/* Client Portal Button */}
            <a
              href="https://peaknizerlogistics-portal-frontend.onrender.com/login"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition font-medium"
            >
              CLIENT PORTAL
            </a>
          </div>
        </div>
      </header>

      {/* Page Content (with padding for fixed header) */}
      <main className="pt-20">
        {children}
      </main>

      {/* PREMIUM FOOTER */}
      <footer className="bg-black border-t border-orange-500/20">
        <div className="container mx-auto px-6 py-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

            {/* Brand Info */}
            <div>
              <h3 className="text-2xl font-bold text-orange-500">Peaknizer Logistics</h3>
              <p className="text-gray-400 mt-3 text-sm leading-relaxed">
                Warehouse & Fulfillment Solutions built for modern e-commerce brands.
                Fast, scalable and fully compliant 3PL services with real-time visibility.
              </p>

              {/* Social Media Links */}
              <div className="flex space-x-4 mt-5">
                <a 
                  href="https://facebook.com/peaknizerlogistics" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-900 w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-orange-500 hover:text-white transition-all hover:scale-110"
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                  </svg>
                </a>
                <a 
                  href="https://instagram.com/peaknizerlogistics" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-900 w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-orange-500 hover:text-white transition-all hover:scale-110"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                  </svg>
                </a>
                <a 
                  href="https://linkedin.com/company/peaknizerlogistics" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-900 w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-orange-500 hover:text-white transition-all hover:scale-110"
                  aria-label="LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a 
                  href="https://twitter.com/peaknizerlogistics" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-900 w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-orange-500 hover:text-white transition-all hover:scale-110"
                  aria-label="Twitter/X"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a 
                  href="https://youtube.com/@peaknizerlogistics" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-900 w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-orange-500 hover:text-white transition-all hover:scale-110"
                  aria-label="YouTube"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><Link to="/about" className="hover:text-orange-500 transition">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-orange-500 transition">Contact</Link></li>
                <li><Link to="/careers" className="hover:text-orange-500 transition">Careers</Link></li>
                <li><Link to="/blog" className="hover:text-orange-500 transition">Blog</Link></li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-white font-semibold mb-4">Services</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li>Order Fulfillment</li>
                <li>Warehousing & Storage</li>
                <li>Amazon FBA Prep</li>
                <li>Returns Management</li>
                <li>Kitting & Assembly</li>
                <li>International Shipping</li>
              </ul>
            </div>

            {/* Client Portal Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Client Portal</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><Link to="/login" className="hover:text-orange-500 transition">Login to Portal</Link></li>
                <li><Link to="/login" className="hover:text-orange-500 transition">Create Account</Link></li>
                <li><Link to="/faq" className="hover:text-orange-500 transition">Portal FAQ</Link></li>
                <li><Link to="/support" className="hover:text-orange-500 transition">Portal Support</Link></li>
                <li><Link to="/demo" className="hover:text-orange-500 transition">Request Demo</Link></li>
              </ul>
              <div className="mt-4 p-3 bg-gray-900 rounded-lg border border-orange-500/30">
                <p className="text-orange-400 text-xs font-semibold">📱 PORTAL ACCESS</p>
                <p className="text-gray-400 text-xs mt-1">24/7 access to your logistics dashboard from any device</p>
              </div>
            </div>
          </div>

          {/* Bottom Bar with Contact Info */}
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="flex items-center space-x-3 text-gray-400">
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>info@peaknizerlogistics.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+1 (571) 307-4461</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>2503D N Harrison St, Arlington, VA</span>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
              <p>© {new Date().getFullYear()} Peaknizer Logistics. All rights reserved.</p>
              <div className="flex gap-6 mt-3 md:mt-0">
                <Link to="/privacy" className="hover:text-orange-500">Privacy</Link>
                <Link to="/terms" className="hover:text-orange-500">Terms</Link>
                <Link to="/faq" className="hover:text-orange-500">FAQ</Link>
                <Link to="/sitemap" className="hover:text-orange-500">Sitemap</Link>
                <Link to="/login" className="text-orange-500 hover:text-orange-400">Client Portal</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WebsiteLayout;