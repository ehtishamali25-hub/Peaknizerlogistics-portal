import { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import MainLayout from '../layouts/MainLayout';

const OwnerDashboard = () => {
  const [stats, setStats] = useState({
    customers: 0,
    pendingBatches: 0,
    unpaidInvoices: 0,
    products: 0
  });
  
  const [customerSummary, setCustomerSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchCustomerSummary();
  }, []);

  const fetchStats = async () => {
    try {
      const [customers, batches, invoices, products] = await Promise.all([
        axiosInstance.get('/customers/'),
        axiosInstance.get('/batches/?status=pending'),
        axiosInstance.get('/invoices/?status=unpaid'),
        axiosInstance.get('/products/')
      ]);

      setStats({
        customers: customers.data.length,
        pendingBatches: batches.data.length,
        unpaidInvoices: invoices.data.length,
        products: products.data.length
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchCustomerSummary = async () => {
    try {
      const response = await axiosInstance.get('/owner/customer-summary');
      setCustomerSummary(response.data);
    } catch (error) {
      console.error('Failed to fetch customer summary:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-8">Owner Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm">Total Customers</h3>
          <p className="text-3xl font-bold">{stats.customers}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm">Pending Batches</h3>
          <p className="text-3xl font-bold text-yellow-600">{stats.pendingBatches}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm">Unpaid Invoices</h3>
          <p className="text-3xl font-bold text-red-600">{stats.unpaidInvoices}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm">Total Products</h3>
          <p className="text-3xl font-bold">{stats.products}</p>
        </div>
      </div>

      {/* Customer Summary Table */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Customer Summary</h2>
        
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : customerSummary.length === 0 ? (
          <p className="text-gray-500">No customers found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shipping Unpaid</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prep Unpaid</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Unpaid</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Inventory</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customerSummary.map((customer) => (
                  <tr key={customer.customer_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{customer.customer_name}</td>
                    <td className="px-6 py-4">{customer.customer_code}</td>
                    <td className="px-6 py-4 text-red-600 font-medium">{formatCurrency(customer.shipping_unpaid)}</td>
                    <td className="px-6 py-4 text-orange-600 font-medium">{formatCurrency(customer.prep_unpaid)}</td>
                    <td className="px-6 py-4 text-red-800 font-bold">{formatCurrency(customer.total_unpaid)}</td>
                    <td className="px-6 py-4 text-blue-600 font-medium">{customer.total_inventory} units</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <button className="w-full text-left px-4 py-2 bg-green-50 text-green-700 rounded hover:bg-green-100">
              Create New Customer
            </button>
            <button className="w-full text-left px-4 py-2 bg-green-50 text-green-700 rounded hover:bg-green-100">
              Upload Inventory
            </button>
            <button className="w-full text-left px-4 py-2 bg-green-50 text-green-700 rounded hover:bg-green-100">
              View Pending Batches
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <p className="text-gray-500">No recent activity</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default OwnerDashboard;