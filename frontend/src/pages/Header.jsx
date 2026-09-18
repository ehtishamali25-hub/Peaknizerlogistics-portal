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

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const navLinks = ['Home', 'Services', 'About', 'Pricing', 'Contact', 'Privacy'];

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 shadow-md backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm border-b border-slate-200'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="group relative">
            <div className="text-xl md:text-3xl font-bold text-brand-navy">
              PEAKNIZER<span className="text-brand-emerald">LOGISTICS</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((item) => (
              <Link key={item} to={`/${item.toLowerCase()}`} className="group relative px-4 py-2 text-slate-700 font-medium hover:text-brand-navy transition-all duration-300">
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-emerald group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          <a href="https://peaknizerlogistics-portal-frontend.onrender.com/login" target="_blank" rel="noopener noreferrer" className="hidden lg:block bg-brand-navy hover:bg-brand-navy-light text-white px-6 py-2.5 rounded-md font-semibold shadow-md hover:shadow-lg transition-all duration-300">
            Client portal
          </a>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-slate-700 hover:text-brand-navy transition-colors focus:outline-none" aria-label="Toggle menu">
            <svg className={`w-6 h-6 transition-transform ${mobileOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="bg-white border-t border-slate-200 py-4 space-y-2 px-4 shadow-lg">
            {navLinks.map((item) => (
              <Link key={item} to={`/${item.toLowerCase()}`} className="block px-4 py-3 text-slate-700 hover:text-brand-navy hover:bg-slate-50 rounded-lg transition-all duration-300 font-medium" onClick={() => setMobileOpen(false)}>
                {item}
              </Link>
            ))}
            <a href="https://peaknizerlogistics-portal-frontend.onrender.com/login" target="_blank" rel="noopener noreferrer" className="block text-center bg-brand-navy hover:bg-brand-navy-light text-white font-semibold px-4 py-3 rounded-md mt-4 transition-all shadow-sm hover:shadow-md" onClick={() => setMobileOpen(false)}>
              Client portal
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;