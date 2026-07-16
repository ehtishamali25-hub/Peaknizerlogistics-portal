// Header.jsx – Light Theme (Blue Accent)
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const navLinks = ['Home', 'Services', 'About', 'Pricing', 'Contact', 'Privacy'];

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/95 shadow-md backdrop-blur-sm'
        : 'bg-white/80 backdrop-blur-sm border-b border-gray-200'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="group relative">
            <div className="text-xl md:text-3xl font-bold text-gray-900 drop-shadow-sm">
              PEAKNIZER<span className="text-blue-600">LOGISTICS</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className="group relative px-4 py-2 text-gray-700 font-medium hover:text-blue-600 transition-all duration-300"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Client Portal - Desktop */}
          <a
            href="https://peaknizerlogistics-portal-frontend.onrender.com/login"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300"
          >
            CLIENT PORTAL
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg className={`w-6 h-6 transition-transform ${mobileOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-white border-t border-gray-200 py-4 space-y-2 px-4 shadow-lg">
            {navLinks.map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 font-medium"
                onClick={() => setMobileOpen(false)}
              >
                {item}
              </Link>
            ))}
            {/* Mobile Client Portal Button */}
            <a
              href="https://peaknizerlogistics-portal-frontend.onrender.com/login"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-3 rounded-lg mt-4 transition-all shadow-sm hover:shadow-md"
              onClick={() => setMobileOpen(false)}
            >
              CLIENT PORTAL
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;