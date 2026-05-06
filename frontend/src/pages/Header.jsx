// Header.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 backdrop-blur-xl ${
      scrolled ? 'bg-black/95 shadow-2xl shadow-orange-500/10' : 'bg-gradient-to-r from-black/80 to-gray-900/80'
    } border-b border-orange-500/30`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20 relative">
          {/* 3D Logo with Glow */}
          <Link to="/" className="group relative">
            <div className="text-3xl font-black bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400 bg-clip-text text-transparent drop-shadow-2xl">
              PEAKNIZERLOGISTICS
            </div>
            <div className="absolute -inset-2 bg-gradient-to-r from-orange-500/30 to-orange-400/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 rounded-xl blur animate-ping" />
          </Link>

          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            {['Home', 'Services', 'About', 'Pricing', 'Contact', 'Privacy'].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className="group relative px-4 py-2 text-gray-300 font-medium hover:text-white transition-all duration-300"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-yellow-400 group-hover:w-full transition-all duration-300" />
                <span className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 rounded-lg -z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 blur-sm" />
              </Link>
            ))}
          </nav>

          {/* Client Portal - 3D Button */}
          <a
            href="https://peaknizerlogistics-portal-frontend.onrender.com/login"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative bg-gradient-to-r from-orange-500 to-orange-600 text-black px-8 py-3 rounded-2xl font-bold shadow-2xl shadow-orange-500/25 hover:shadow-orange-500/50 transform hover:-translate-y-1 transition-all duration-300 hover:from-orange-400 hover:to-orange-500"
          >
            <span className="relative z-10">CLIENT PORTAL</span>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-all duration-300" />
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent -skew-x-12 transform -rotate-2 group-hover:rotate-0 transition-all duration-500" />
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-orange-500 hover:text-orange-400 transition-colors"
          >
            <svg className={`w-6 h-6 transition-transform ${mobileOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-black/95 border-t border-orange-500/30 backdrop-blur-xl">
            <div className="py-4 space-y-4 px-4">
              {['Home', 'Services', 'About', 'Pricing', 'Contact'].map((item) => (
                <Link
                  key={item}
                  to={`/${item.toLowerCase()}`}
                  className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-orange-500/10 rounded-xl transition-all duration-300 font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;