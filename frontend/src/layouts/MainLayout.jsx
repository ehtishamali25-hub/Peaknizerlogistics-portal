import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();
  
  console.log('MainLayout - START - user:', user);
  console.log('MainLayout - user role:', user?.role);
  
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    console.log('MainLayout - useEffect - user changed:', user);
  }, [user]);

  const getNavItems = () => {
    console.log('getNavItems called with role:', user?.role);
    
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
        console.log('Adding employee nav items');
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
          { name: 'Inventory', path: '/customer/inventory' },  // Add this line
          { name: 'Shipping Invoices', path: '/customer/invoices/shipping' },
          { name: 'Prep Invoices', path: '/customer/invoices/prep' },
          { name: 'Proofs', path: '/customer/proofs' },
        );
        break;
      default:
        console.log('No role matched:', user?.role);
    }
    
    console.log('Nav items generated:', items);
    return items;
  };

  const navItems = getNavItems();
  console.log('Rendering with navItems:', navItems);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <nav className="bg-green-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold">Peaknizer Logistics</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>User: {user?.full_name || 'No name'} | Role: {user?.role || 'No role'}</span>
              <button 
                onClick={logout} 
                className="bg-green-700 px-3 py-2 rounded hover:bg-green-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <div className={`bg-white shadow-lg min-h-screen transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'}`}>
          <div className="p-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="mb-4 text-gray-600 hover:text-gray-900"
            >
              {sidebarOpen ? '←' : '→'}
            </button>
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-md"
                >
                  {sidebarOpen ? item.name : item.name[0]}
                </Link>
              ))}
              {navItems.length === 0 && (
                <p className="text-gray-400 text-sm">No menu items (role: {user?.role || 'none'})</p>
              )}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;