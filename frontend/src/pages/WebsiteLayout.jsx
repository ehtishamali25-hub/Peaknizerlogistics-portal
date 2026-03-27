// WebsiteLayout.jsx - CLEAN VERSION
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const WebsiteLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900/50 to-black">
      {/* 1. Enhanced Header */}
      <Header />
      
      {/* 2. Main Content (with header spacing) */}
      <main className="pt-20 pb-24">
        {children}
      </main>
      
      {/* 3. Enhanced Footer */}
      <Footer />
    </div>
  );
};

export default WebsiteLayout;