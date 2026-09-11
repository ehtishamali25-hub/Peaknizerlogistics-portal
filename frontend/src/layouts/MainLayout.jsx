import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [user]);

  const getNavItems = () => {
    const items = [];
    switch (user?.role) {
      case 'owner':
        items.push(
          { name: 'Dashboard', path: '/owner/dashboard' },
          { name: 'Registrations', path: '/owner/registrations' },
          { name: 'Customers', path: '/owner/customers' },
          { name: 'Employees', path: '/owner/employees' },
          { name: 'Warehouses', path: '/owner/warehouses' },
          { name: 'Inventory', path: '/inventory' },
          { name: 'Products', path: '/owner/products' },
          { name: 'Batches', path: '/owner/batches' },
          { name: 'Shipping Details', path: '/owner/shipping-details' },
          { name: 'Invoices', path: '/owner/invoices' }
        );
        break;
      case 'employee':
        items.push(
          { name: 'Dashboard', path: '/employee/dashboard' },
          { name: 'Upload Batch', path: '/employee/upload' },
          { name: 'Inventory', path: '/inventory' },
          { name: 'My Batches', path: '/employee/batches' }
        );
        break;
      case 'customer':
        items.push(
          { name: 'Dashboard', path: '/customer/dashboard' },
          { name: 'Inventory', path: '/customer/inventory' },
          { name: 'Shipping Invoices', path: '/customer/invoices/shipping' },
          { name: 'Prep Invoices', path: '/customer/invoices/prep' },
          { name: 'Proofs', path: '/customer/proofs' }
        );
        break;
      default:
        break;
    }
    return items;
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <nav className="bg-green-600 text-white shadow-lg sticky top-0 z-30">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-white p-2 -ml-2"
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
              <span className="text-lg sm:text-xl font-bold truncate">Peaknizer Logistics</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="hidden sm:inline text-sm">
                User: {user?.full_name || 'No name'} | Role: {user?.role || 'No role'}
              </span>
              <button
                onClick={logout}
                className="bg-green-700 px-3 py-2 rounded hover:bg-green-800 text-sm whitespace-nowrap"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex relative">
        {/* Mobile overlay backdrop */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-20 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`
            bg-white shadow-lg min-h-screen transition-all duration-300 z-20
            fixed md:static top-16 md:top-0 left-0
            ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
            ${sidebarOpen ? 'w-64' : 'md:w-16 w-64'}
          `}
        >
          <div className="p-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden md:block mb-4 text-gray-600 hover:text-gray-900"
            >
              {sidebarOpen ? '←' : '→'}
            </button>
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-md"
                >
                  <span className="md:hidden">{item.name}</span>
                  <span className="hidden md:inline">{sidebarOpen ? item.name : item.name[0]}</span>
                </Link>
              ))}
              {navItems.length === 0 && (
                <p className="text-gray-400 text-sm">No menu items (role: {user?.role || 'none'})</p>
              )}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 md:p-8 w-full min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;