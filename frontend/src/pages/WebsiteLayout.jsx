// WebsiteLayout.jsx - WITH SCROLL TO TOP ON ROUTE CHANGE
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const WebsiteLayout = ({ children }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900/50 to-black overflow-x-hidden">
      <Header />
      <main className="pt-20 pb-24">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default WebsiteLayout;