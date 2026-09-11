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

  const [charitySummary, setCharitySummary] = useState({
    total_amount_for_charity: 0,
    amount_donated: 0,
    balance_remaining: 0
  });
  const [donations, setDonations] = useState([]);
  const [charityLoading, setCharityLoading] = useState(true);
  const [newRow, setNewRow] = useState({ donor_name: '', contact: '', purpose: '', amount: '' });

  useEffect(() => {
    fetchStats();
    fetchCustomerSummary();
    fetchCharitySummary();
    fetchDonations();
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

  const fetchCharitySummary = async () => {
    try {
      const response = await axiosInstance.get('/charity/summary');
      setCharitySummary(response.data);
    } catch (error) {
      console.error('Failed to fetch charity summary:', error);
    }
  };

  const fetchDonations = async () => {
    try {
      const response = await axiosInstance.get('/charity/donations');
      setDonations(response.data);
    } catch (error) {
      console.error('Failed to fetch donations:', error);
    } finally {
      setCharityLoading(false);
    }
  };

  const handleAddDonation = async () => {
    if (!newRow.donor_name || !newRow.amount) {
      alert('Name and amount are required');
      return;
    }
    try {
      await axiosInstance.post('/charity/donations', {
        donor_name: newRow.donor_name,
        contact: newRow.contact || null,
        purpose: newRow.purpose || null,
        amount: parseFloat(newRow.amount)
      });
      setNewRow({ donor_name: '', contact: '', purpose: '', amount: '' });
      fetchDonations();
      fetchCharitySummary();
    } catch (error) {
      console.error('Failed to add donation:', error);
    }
  };

  const handleUpdateDonation = async (id, field, value) => {
    try {
      await axiosInstance.put(`/charity/donations/${id}`, { [field]: value });
      fetchDonations();
      fetchCharitySummary();
    } catch (error) {
      console.error('Failed to update donation:', error);
    }
  };

  const handleDeleteDonation = async (id) => {
    if (!window.confirm('Delete this donation row?')) return;
    try {
      await axiosInstance.delete(`/charity/donations/${id}`);
      fetchDonations();
      fetchCharitySummary();
    } catch (error) {
      console.error('Failed to delete donation:', error);
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
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Owner Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-gray-500 text-xs sm:text-sm">Total Customers</h3>
          <p className="text-xl sm:text-3xl font-bold">{stats.customers}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-gray-500 text-xs sm:text-sm">Pending Batches</h3>
          <p className="text-xl sm:text-3xl font-bold text-yellow-600">{stats.pendingBatches}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-gray-500 text-xs sm:text-sm">Unpaid Invoices</h3>
          <p className="text-xl sm:text-3xl font-bold text-red-600">{stats.unpaidInvoices}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-gray-500 text-xs sm:text-sm">Total Products</h3>
          <p className="text-xl sm:text-3xl font-bold">{stats.products}</p>
        </div>
      </div>

      {/* Customer Summary */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-bold mb-4">Customer Summary</h2>
        
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : customerSummary.length === 0 ? (
          <p className="text-gray-500">No customers found.</p>
        ) : (
          <>
            {/* Mobile: stacked cards */}
            <div className="md:hidden space-y-3">
              {customerSummary.map((customer) => (
                <div key={customer.customer_id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">{customer.customer_name}</p>
                      <p className="text-xs text-gray-500">{customer.customer_code}</p>
                    </div>
                    <p className="text-blue-600 text-sm font-medium">{customer.total_inventory} units</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm pt-2 border-t">
                    <div>
                      <p className="text-xs text-gray-500">Shipping</p>
                      <p className="text-red-600 font-medium">{formatCurrency(customer.shipping_unpaid)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Prep</p>
                      <p className="text-orange-600 font-medium">{formatCurrency(customer.prep_unpaid)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Total</p>
                      <p className="text-red-800 font-bold">{formatCurrency(customer.total_unpaid)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: table */}
            <div className="hidden md:block overflow-x-auto">
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
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <button className="w-full text-left px-4 py-3 sm:py-2 bg-green-50 text-green-700 rounded hover:bg-green-100">
              Create New Customer
            </button>
            <button className="w-full text-left px-4 py-3 sm:py-2 bg-green-50 text-green-700 rounded hover:bg-green-100">
              Upload Inventory
            </button>
            <button className="w-full text-left px-4 py-3 sm:py-2 bg-green-50 text-green-700 rounded hover:bg-green-100">
              View Pending Batches
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold mb-4">Recent Activity</h2>
          <p className="text-gray-500">No recent activity</p>
        </div>
      </div>

      {/* Charity Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-gray-500 text-xs sm:text-sm">Total Amount For Charity</h3>
          <p className="text-xl sm:text-3xl font-bold">{formatCurrency(charitySummary.total_amount_for_charity)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-gray-500 text-xs sm:text-sm">Amount Donated</h3>
          <p className="text-xl sm:text-3xl font-bold text-green-600">{formatCurrency(charitySummary.amount_donated)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-gray-500 text-xs sm:text-sm">Balance Remaining</h3>
          <p className="text-xl sm:text-3xl font-bold text-orange-600">{formatCurrency(charitySummary.balance_remaining)}</p>
        </div>
      </div>

      {/* Charity Donation Log */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-bold mb-4">Charity Donation Log</h2>

        {charityLoading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <>
            {/* Mobile: stacked editable cards */}
            <div className="md:hidden space-y-3">
              {donations.map((d) => (
                <div key={d.id} className="border rounded-lg p-3 space-y-2">
                  <div>
                    <label className="text-xs text-gray-500">Name</label>
                    <input
                      defaultValue={d.donor_name}
                      onBlur={(e) => e.target.value !== d.donor_name && handleUpdateDonation(d.id, 'donor_name', e.target.value)}
                      className="w-full border rounded px-2 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Contact</label>
                    <input
                      defaultValue={d.contact || ''}
                      onBlur={(e) => e.target.value !== (d.contact || '') && handleUpdateDonation(d.id, 'contact', e.target.value)}
                      className="w-full border rounded px-2 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Purpose</label>
                    <input
                      defaultValue={d.purpose || ''}
                      onBlur={(e) => e.target.value !== (d.purpose || '') && handleUpdateDonation(d.id, 'purpose', e.target.value)}
                      className="w-full border rounded px-2 py-2 text-sm"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <label className="text-xs text-gray-500">Amount</label>
                      <input
                        type="number"
                        step="0.01"
                        defaultValue={d.amount}
                        onBlur={(e) => parseFloat(e.target.value) !== parseFloat(d.amount) && handleUpdateDonation(d.id, 'amount', parseFloat(e.target.value))}
                        className="w-full border rounded px-2 py-2 text-sm"
                      />
                    </div>
                    <button
                      onClick={() => handleDeleteDonation(d.id)}
                      className="text-red-600 hover:text-red-800 text-sm px-3 py-2 border rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}

              {/* Mobile: add new row */}
              <div className="border rounded-lg p-3 space-y-2 bg-gray-50">
                <p className="text-xs font-medium text-gray-600">Add donation</p>
                <input
                  placeholder="Name"
                  value={newRow.donor_name}
                  onChange={(e) => setNewRow({ ...newRow, donor_name: e.target.value })}
                  className="w-full border rounded px-2 py-2 text-sm"
                />
                <input
                  placeholder="Contact"
                  value={newRow.contact}
                  onChange={(e) => setNewRow({ ...newRow, contact: e.target.value })}
                  className="w-full border rounded px-2 py-2 text-sm"
                />
                <input
                  placeholder="Purpose"
                  value={newRow.purpose}
                  onChange={(e) => setNewRow({ ...newRow, purpose: e.target.value })}
                  className="w-full border rounded px-2 py-2 text-sm"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Amount"
                  value={newRow.amount}
                  onChange={(e) => setNewRow({ ...newRow, amount: e.target.value })}
                  className="w-full border rounded px-2 py-2 text-sm"
                />
                <button
                  onClick={handleAddDonation}
                  className="w-full text-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Desktop: table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Purpose</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {donations.map((d) => (
                    <tr key={d.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">
                        <input
                          defaultValue={d.donor_name}
                          onBlur={(e) => e.target.value !== d.donor_name && handleUpdateDonation(d.id, 'donor_name', e.target.value)}
                          className="w-full border rounded px-2 py-1 text-sm"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          defaultValue={d.contact || ''}
                          onBlur={(e) => e.target.value !== (d.contact || '') && handleUpdateDonation(d.id, 'contact', e.target.value)}
                          className="w-full border rounded px-2 py-1 text-sm"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          defaultValue={d.purpose || ''}
                          onBlur={(e) => e.target.value !== (d.purpose || '') && handleUpdateDonation(d.id, 'purpose', e.target.value)}
                          className="w-full border rounded px-2 py-1 text-sm"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          step="0.01"
                          defaultValue={d.amount}
                          onBlur={(e) => parseFloat(e.target.value) !== parseFloat(d.amount) && handleUpdateDonation(d.id, 'amount', parseFloat(e.target.value))}
                          className="w-full border rounded px-2 py-1 text-sm text-right"
                        />
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={() => handleDeleteDonation(d.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}

                  {/* Add new row */}
                  <tr className="bg-gray-50">
                    <td className="px-4 py-2">
                      <input
                        placeholder="Name"
                        value={newRow.donor_name}
                        onChange={(e) => setNewRow({ ...newRow, donor_name: e.target.value })}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        placeholder="Contact"
                        value={newRow.contact}
                        onChange={(e) => setNewRow({ ...newRow, contact: e.target.value })}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        placeholder="Purpose"
                        value={newRow.purpose}
                        onChange={(e) => setNewRow({ ...newRow, purpose: e.target.value })}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Amount"
                        value={newRow.amount}
                        onChange={(e) => setNewRow({ ...newRow, amount: e.target.value })}
                        className="w-full border rounded px-2 py-1 text-sm text-right"
                      />
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={handleAddDonation}
                        className="text-green-700 hover:text-green-900 text-sm font-medium"
                      >
                        Add
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default OwnerDashboard;