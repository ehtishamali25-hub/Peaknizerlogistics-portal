import { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import MainLayout from '../layouts/MainLayout';

const CustomersList = () => {
  const [customers, setCustomers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_code: '',
    email: '',
    prep_rate: 5.5,
    warehouse_ids: [],
    password: '', 
    confirm_password: '' 
  });

  useEffect(() => {
    fetchCustomers();
    fetchWarehouses();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axiosInstance.get('/customers/');
      console.log('Customers response:', response.data);
      setCustomers(response.data);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const response = await axiosInstance.get('/warehouses/');
      setWarehouses(response.data);
    } catch (error) {
      console.error('Failed to fetch warehouses:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords if creating new customer
    if (!editingCustomer && formData.password !== formData.confirm_password) {
      alert('Passwords do not match');
      return;
    }

    try {
      // Remove confirm_password before sending
      const { confirm_password, ...dataToSend } = formData;
      
      if (editingCustomer) {
        await axiosInstance.put(`/customers/${editingCustomer.id}`, dataToSend);
      } else {
        await axiosInstance.post('/customers/', dataToSend);
      }
      
      setShowModal(false);
      setEditingCustomer(null);
      setFormData({ 
        customer_name: '', 
        customer_code: '', 
        email: '', 
        prep_rate: 5.5,
        warehouse_ids: [],
        password: '',
        confirm_password: ''
      });
      fetchCustomers();
    } catch (error) {
      console.error('Failed to save customer:', error.response?.data || error);
      alert(error.response?.data?.detail || 'Failed to save customer');
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      customer_name: customer.customer_name,
      customer_code: customer.customer_code,
      email: customer.email,
      prep_rate: customer.prep_rate,
      warehouse_ids: customer.warehouse_ids || [],
      password: '', // Don't show existing password
      confirm_password: ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await axiosInstance.delete(`/customers/${id}`);
        fetchCustomers();
      } catch (error) {
        console.error('Failed to delete customer:', error);
      }
    }
  };

  const handleWarehouseToggle = (warehouseId) => {
    setFormData(prev => ({
      ...prev,
      warehouse_ids: prev.warehouse_ids.includes(warehouseId)
        ? prev.warehouse_ids.filter(id => id !== warehouseId)
        : [...prev.warehouse_ids, warehouseId]
    }));
  };

  const getWarehouseNames = (warehouseIds) => {
    if (!warehouseIds || warehouseIds.length === 0) return 'None';
    return warehouses
      .filter(w => warehouseIds.includes(w.id))
      .map(w => w.name)
      .join(', ');
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Customers</h1>
        <button
          onClick={() => {
            setEditingCustomer(null);
            setFormData({ 
              customer_name: '', 
              customer_code: '', 
              email: '', 
              prep_rate: 5.5,
              warehouse_ids: [],
              password: '',
              confirm_password: ''
            });
            setShowModal(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Add Customer
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prep Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned Warehouses</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Has Login</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{customer.customer_name}</td>
                  <td className="px-6 py-4">{customer.customer_code}</td>
                  <td className="px-6 py-4">{customer.email}</td>
                  <td className="px-6 py-4">${customer.prep_rate}</td>
                  <td className="px-6 py-4">{getWarehouseNames(customer.warehouse_ids)}</td>
                  <td className="px-6 py-4">
                    <span className="text-green-600">✓</span>
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() => handleEdit(customer)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(customer.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold mb-4">
              {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Code *
                </label>
                <input
                  type="text"
                  value={formData.customer_code}
                  onChange={(e) => setFormData({...formData, customer_code: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              {/* Password Fields - Only show for new customers */}
              {!editingCustomer && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password *
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      value={formData.confirm_password}
                      onChange={(e) => setFormData({...formData, confirm_password: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prep Rate ($)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.prep_rate}
                  onChange={(e) => setFormData({...formData, prep_rate: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              {/* Warehouse Assignment */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign Warehouses
                </label>
                <div className="border border-gray-300 rounded-md p-3 max-h-40 overflow-y-auto">
                  {warehouses.length === 0 ? (
                    <p className="text-gray-500">No warehouses available</p>
                  ) : (
                    warehouses.map(warehouse => (
                      <label key={warehouse.id} className="flex items-center space-x-2 mb-2">
                        <input
                          type="checkbox"
                          checked={formData.warehouse_ids.includes(warehouse.id)}
                          onChange={() => handleWarehouseToggle(warehouse.id)}
                          className="rounded"
                        />
                        <span>{warehouse.name} - {warehouse.location}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  {editingCustomer ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default CustomersList;