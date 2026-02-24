import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axios';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../context/AuthContext';
import BackButton from '../components/BackButton';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentInvoices, setRecentInvoices] = useState([]);

  useEffect(() => {
    fetchDashboard();
    fetchRecentInvoices();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await axiosInstance.get('/customer/dashboard');
      setDashboard(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentInvoices = async () => {
    try {
      const response = await axiosInstance.get('/customer/invoices?limit=5');
      setRecentInvoices(response.data);
    } catch (error) {
      console.error('Failed to fetch recent invoices:', error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'unpaid': return 'bg-red-100 text-red-800';
      case 'partially_paid': return 'bg-yellow-100 text-yellow-800';
      case 'fully_paid': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="text-center py-8">Loading...</div>
      </MainLayout>
    );
  }

  return (
    
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <BackButton />
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {dashboard?.customer_name}!
          </h1>
          <p className="text-gray-600 mt-1">Code: {dashboard?.customer_code}</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Total Inventory Card */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium uppercase tracking-wide">
                  Total Inventory
                </p>
                <p className="text-4xl font-bold mt-2">
                  {dashboard?.total_inventory.toLocaleString()}
                </p>
                <p className="text-blue-100 text-sm mt-1">units across all warehouses</p>
              </div>
              <div className="text-5xl opacity-50">📦</div>
            </div>
          </div>

          {/* Outstanding Balance Card */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium uppercase tracking-wide">
                  Outstanding Balance
                </p>
                <p className="text-4xl font-bold mt-2">
                  {formatCurrency(dashboard?.total_outstanding || 0)}
                </p>
                <p className="text-green-100 text-sm mt-1">
                  {dashboard?.visible_shipping_invoices + dashboard?.visible_prep_invoices} invoices
                </p>
              </div>
              <div className="text-5xl opacity-50">💰</div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link to="/customer/invoices/shipping" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900">Shipping Invoices</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{dashboard?.visible_shipping_invoices}</p>
            <p className="text-gray-500 text-sm mt-1">Click to view</p>
          </Link>

          <Link to="/customer/invoices/prep" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900">Prep Invoices</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">{dashboard?.visible_prep_invoices}</p>
            <p className="text-gray-500 text-sm mt-1">Click to view</p>
          </Link>

          <Link to="/customer/shipping" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900">Shipping Details</h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">{dashboard?.visible_shipping_details}</p>
            <p className="text-gray-500 text-sm mt-1">Click to view</p>
          </Link>
        </div>

        {/* Recent Invoices */}
        {recentInvoices.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Recent Invoices</h2>
              <Link to="/customer/invoices/shipping" className="text-blue-600 hover:text-blue-800 text-sm">
                View All →
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice #</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{invoice.invoice_number}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          invoice.invoice_type === 'shipping' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {invoice.invoice_type}
                        </span>
                      </td>
                      <td className="px-6 py-4">{formatDate(invoice.issue_date)}</td>
                      <td className="px-6 py-4 font-medium">{formatCurrency(invoice.total_amount)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => window.open(`http://localhost:8000/api/v1/downloads/invoice/${invoice.id}`, '_blank')}
                          className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                        >
                          PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Need to make a payment?</h3>
            <p className="text-gray-600 mb-4">
              Upload your payment proof for any unpaid invoice. Our team will verify and update your account.
            </p>
            <Link
              to="/customer/invoices/shipping"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              View Invoices
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Track your shipments</h3>
            <p className="text-gray-600 mb-4">
              View and download shipping details for all your orders.
            </p>
            <Link
              to="/customer/shipping"
              className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              View Shipping Details
            </Link>
          </div>
        </div>
      </div>
    
  );
};

export default CustomerDashboard;