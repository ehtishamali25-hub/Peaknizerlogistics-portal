import { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import MainLayout from '../layouts/MainLayout';
import BackButton from '../components/BackButton';

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    password: 'password123',
    role: 'employee',
    customer_ids: [],
    warehouse_ids: []
  });
  
  const [customers, setCustomers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [employeeAssignments, setEmployeeAssignments] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    customer_ids: [],
    warehouse_ids: []
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [customersRes, warehousesRes, employeesRes] = await Promise.all([
        axiosInstance.get('/customers/'),
        axiosInstance.get('/warehouses/'),
        axiosInstance.get('/users/')
      ]);
      
      setCustomers(customersRes.data);
      setWarehouses(warehousesRes.data);
      
      // Filter only employees from users list
      const employeeList = employeesRes.data.filter(user => user.role === 'employee');
      setEmployees(employeeList);
      
      // Fetch assignments for each employee
      const assignments = {};
      await Promise.all(
        employeeList.map(async (emp) => {
          try {
            const res = await axiosInstance.get(`/users/${emp.id}/assignments`);
            assignments[emp.id] = res.data;
          } catch (error) {
            console.error(`Failed to fetch assignments for ${emp.id}:`, error);
          }
        })
      );
      setEmployeeAssignments(assignments);
      
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axiosInstance.post('/auth/register', {
        ...formData,
        company_id: JSON.parse(localStorage.getItem('user')).company_id
      });
      
      setMessage({ type: 'success', text: 'Employee added successfully!' });
      
      // Reset form
      setFormData({
        email: '',
        full_name: '',
        password: 'password123',
        role: 'employee',
        customer_ids: [],
        warehouse_ids: []
      });
      
      // Refresh employee list
      fetchData();
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.detail || 'Failed to add employee' 
      });
    }
  };

  const handleCustomerToggle = (customerId) => {
    setFormData(prev => ({
      ...prev,
      customer_ids: prev.customer_ids.includes(customerId)
        ? prev.customer_ids.filter(id => id !== customerId)
        : [...prev.customer_ids, customerId]
    }));
  };

  const handleWarehouseToggle = (warehouseId) => {
    setFormData(prev => ({
      ...prev,
      warehouse_ids: prev.warehouse_ids.includes(warehouseId)
        ? prev.warehouse_ids.filter(id => id !== warehouseId)
        : [...prev.warehouse_ids, warehouseId]
    }));
  };

  const handleEditClick = async (employee) => {
    setEditingEmployee(employee);
    
    // Fetch current assignments
    try {
      const res = await axiosInstance.get(`/users/${employee.id}/assignments`);
      setEditFormData({
        customer_ids: res.data.customer_ids || [],
        warehouse_ids: res.data.warehouse_ids || []
      });
      setShowEditModal(true);
    } catch (error) {
      console.error('Failed to fetch assignments:', error);
      alert('Failed to load employee assignments');
    }
  };

  const handleEditCustomerToggle = (customerId) => {
    setEditFormData(prev => ({
      ...prev,
      customer_ids: prev.customer_ids.includes(customerId)
        ? prev.customer_ids.filter(id => id !== customerId)
        : [...prev.customer_ids, customerId]
    }));
  };

  const handleEditWarehouseToggle = (warehouseId) => {
    setEditFormData(prev => ({
      ...prev,
      warehouse_ids: prev.warehouse_ids.includes(warehouseId)
        ? prev.warehouse_ids.filter(id => id !== warehouseId)
        : [...prev.warehouse_ids, warehouseId]
    }));
  };

  const handleSaveEdit = async () => {
    try {
      await axiosInstance.put(`/users/${editingEmployee.id}/assignments`, {
        customer_ids: editFormData.customer_ids,
        warehouse_ids: editFormData.warehouse_ids
      });
      
      setShowEditModal(false);
      setMessage({ type: 'success', text: 'Employee assignments updated successfully!' });
      
      // Refresh data
      fetchData();
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update employee assignments' });
      console.error('Update error:', error);
    }
  };

  const handleToggleStatus = async (employeeId, currentStatus) => {
    try {
      await axiosInstance.put(`/users/${employeeId}/toggle-status`);
      
      setMessage({ 
        type: 'success', 
        text: `Employee ${currentStatus ? 'deactivated' : 'activated'} successfully!` 
      });
      
      // Refresh data
      fetchData();
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update employee status' });
      console.error('Status update error:', error);
    }
  };

  const handleResetPassword = async (employeeId) => {
    if (!confirm('Reset password to default (password123)?')) return;
    
    try {
      await axiosInstance.put(`/users/${employeeId}/reset-password`);
      
      setMessage({ type: 'success', text: 'Password reset to default (password123)' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to reset password' });
      console.error('Password reset error:', error);
    }
  };

  const getCustomerNames = (customerIds) => {
    if (!customerIds || customerIds.length === 0) return 'None';
    return customers
      .filter(c => customerIds.includes(c.id))
      .map(c => `${c.customer_name} (${c.customer_code})`)
      .join(', ');
  };

  const getWarehouseNames = (warehouseIds) => {
    if (!warehouseIds || warehouseIds.length === 0) return 'None';
    return warehouses
      .filter(w => warehouseIds.includes(w.id))
      .map(w => w.name)
      .join(', ');
  };

  return (
    
      <div className="max-w-7xl mx-auto">
        <BackButton />
        <h1 className="text-3xl font-bold mb-8">Employee Management</h1>

        {message.text && (
          <div className={`mb-4 p-4 rounded ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Employee Form */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Add New Employee</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
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

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password (default: password123)
                </label>
                <input
                  type="text"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* Assign Customers */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign Customers
                </label>
                <div className="border border-gray-300 rounded-md p-3 max-h-40 overflow-y-auto">
                  {customers.length === 0 ? (
                    <p className="text-gray-500">No customers available</p>
                  ) : (
                    customers.map(customer => (
                      <label key={customer.id} className="flex items-center space-x-2 mb-2">
                        <input
                          type="checkbox"
                          checked={formData.customer_ids.includes(customer.id)}
                          onChange={() => handleCustomerToggle(customer.id)}
                          className="rounded"
                        />
                        <span>{customer.customer_name} ({customer.customer_code})</span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              {/* Assign Warehouses */}
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

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
              >
                Add Employee
              </button>
            </form>
          </div>

          {/* Employee List */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Current Employees ({employees.length})</h2>
            
            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : employees.length === 0 ? (
              <p className="text-gray-500">No employees added yet.</p>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {employees.map(emp => {
                  const assignments = employeeAssignments[emp.id] || { customer_ids: [], warehouse_ids: [] };
                  
                  return (
                    <div key={emp.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-lg">{emp.full_name}</h3>
                          <p className="text-sm text-gray-600">{emp.email}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          emp.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {emp.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      {/* Assigned Customers */}
                      <div className="mt-3 text-sm">
                        <p className="text-gray-500 font-medium">Assigned Customers:</p>
                        <p className="text-gray-700">{getCustomerNames(assignments.customer_ids)}</p>
                      </div>
                      
                      {/* Assigned Warehouses */}
                      <div className="mt-2 text-sm">
                        <p className="text-gray-500 font-medium">Assigned Warehouses:</p>
                        <p className="text-gray-700">{getWarehouseNames(assignments.warehouse_ids)}</p>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="mt-3 flex space-x-2 pt-2 border-t">
                        <button
                          onClick={() => handleEditClick(emp)}
                          className="text-sm text-blue-600 hover:text-blue-900"
                        >
                          Edit Assignments
                        </button>
                        <button
                          onClick={() => handleToggleStatus(emp.id, emp.is_active)}
                          className={`text-sm ${
                            emp.is_active ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'
                          }`}
                        >
                          {emp.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleResetPassword(emp.id)}
                          className="text-sm text-purple-600 hover:text-purple-900"
                        >
                          Reset Password
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Edit Modal */}
        {showEditModal && editingEmployee && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <h3 className="text-lg font-bold mb-4">
                Edit Assignments for {editingEmployee.full_name}
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assigned Customers
                </label>
                <div className="border border-gray-300 rounded-md p-3 max-h-40 overflow-y-auto">
                  {customers.map(customer => (
                    <label key={customer.id} className="flex items-center space-x-2 mb-2">
                      <input
                        type="checkbox"
                        checked={editFormData.customer_ids.includes(customer.id)}
                        onChange={() => handleEditCustomerToggle(customer.id)}
                        className="rounded"
                      />
                      <span>{customer.customer_name} ({customer.customer_code})</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assigned Warehouses
                </label>
                <div className="border border-gray-300 rounded-md p-3 max-h-40 overflow-y-auto">
                  {warehouses.map(warehouse => (
                    <label key={warehouse.id} className="flex items-center space-x-2 mb-2">
                      <input
                        type="checkbox"
                        checked={editFormData.warehouse_ids.includes(warehouse.id)}
                        onChange={() => handleEditWarehouseToggle(warehouse.id)}
                        className="rounded"
                      />
                      <span>{warehouse.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    
  );
};

export default AddEmployee;