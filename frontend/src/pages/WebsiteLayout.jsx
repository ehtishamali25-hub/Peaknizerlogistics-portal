// WebsiteLayout.jsx - RESPONSIVE VERSION
import Header from './Header';
import Footer from './Footer';

const WebsiteLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900/50 to-black overflow-x-hidden">
      {/* 1. Responsive Header */}
      <Header />
      
      {/* 2. Main Content (with spacing for fixed header) */}
      <main className="pt-20 pb-24">
        {children}
      </main>
      
      {/* 3. Responsive Footer */}
      <Footer />
    </div>
  );
};

export default WebsiteLayout;