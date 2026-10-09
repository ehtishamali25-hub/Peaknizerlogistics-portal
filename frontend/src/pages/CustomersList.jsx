import { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import MainLayout from '../layouts/MainLayout';
import { downloadFile } from '../utils/download';

const formatFileSize = (bytes) => {
  if (bytes === null || bytes === undefined) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const EMPTY_FORM = {
  customer_name: '',
  customer_code: '',
  email: '',
  prep_rate: 5.5,
  business_model: 'wholesale',
  warehouse_ids: [],
  password: '',
  confirm_password: ''
};

const ModelBadge = ({ model }) => {
  const isDrop = model === 'dropshipping';
  return (
    <span
      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
        isDrop ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
      }`}
    >
      {isDrop ? 'Dropshipping' : 'Wholesale'}
    </span>
  );
};

const CustomersList = () => {
  const [customers, setCustomers] = useState([]);
  const [customerDocs, setCustomerDocs] = useState({});
  const [docsCustomer, setDocsCustomer] = useState(null);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState(EMPTY_FORM);

  useEffect(() => {
    fetchCustomers();
    fetchWarehouses();
  }, []);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const fetchCustomers = async () => {
    try {
      const response = await axiosInstance.get('/customers/');
      setCustomers(response.data);
      // Not awaited: the table shows immediately, documents fill in after
      fetchDocuments(response.data);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      showMessage('error', 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  // One request for every customer's registration documents
  const fetchDocuments = async (customerList) => {
    if (customerList.length === 0) {
      setCustomerDocs({});
      return;
    }
    try {
      const response = await axiosInstance.post(
        '/registration-documents/by-customers',
        customerList.map((c) => c.id)
      );
      setCustomerDocs(response.data);
    } catch (error) {
      console.error('Failed to fetch customer documents:', error);
      setCustomerDocs({});
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

  const downloadDocument = async (doc) => {
    await downloadFile(
      `/registration-documents/${doc.id}/download`,
      doc.original_filename
    );
  };

  // PDFs and images open in a new tab; other file types are downloaded
  const viewDocument = async (doc) => {
    const viewable = /\.(pdf|jpe?g|png|gif)$/i.test(doc.original_filename);
    if (!viewable) {
      await downloadDocument(doc);
      return;
    }

    // Open the tab immediately (inside the click) so popup blockers allow it
    const newTab = window.open('', '_blank');
    if (!newTab) {
      await downloadDocument(doc);
      return;
    }

    try {
      const response = await axiosInstance.get(
        `/registration-documents/${doc.id}/download`,
        { responseType: 'blob' }
      );
      const blobUrl = window.URL.createObjectURL(response.data);
      newTab.location.href = blobUrl;
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 60000);
    } catch (error) {
      console.error('Failed to open document:', error);
      newTab.close();
      alert('Could not open this document. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!editingCustomer && formData.password !== formData.confirm_password) {
      showMessage('error', 'Passwords do not match');
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      
      const { confirm_password, ...dataToSend } = formData;
      const customerData = {
        ...dataToSend,
        company_id: user.company_id
      };
      
      if (editingCustomer) {
        await axiosInstance.put(`/customers/${editingCustomer.id}`, customerData);
        showMessage('success', 'Customer updated successfully');
      } else {
        await axiosInstance.post('/customers/', customerData);
        showMessage('success', 'Customer added successfully');
      }
      
      setShowModal(false);
      setEditingCustomer(null);
      setFormData(EMPTY_FORM);
      fetchCustomers();
    } catch (error) {
      console.error('Failed to save customer:', error.response?.data || error);
      showMessage('error', error.response?.data?.detail || 'Failed to save customer');
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      customer_name: customer.customer_name,
      customer_code: customer.customer_code,
      email: customer.email,
      prep_rate: customer.prep_rate,
      business_model: customer.business_model || 'wholesale',
      warehouse_ids: customer.warehouse_ids || [],
      password: '',
      confirm_password: ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await axiosInstance.delete(`/customers/${id}`);
        showMessage('success', 'Customer deleted successfully');
        fetchCustomers();
      } catch (error) {
        console.error('Failed to delete customer:', error);
        showMessage('error', error.response?.data?.detail || 'Failed to delete customer');
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

  const renderDocsButton = (customer) => {
    const docs = customerDocs[customer.id] || [];
    if (docs.length === 0) {
      return <span className="text-gray-400">None</span>;
    }
    return (
      <button
        onClick={() => setDocsCustomer(customer)}
        className="text-blue-600 hover:text-blue-900 font-medium"
      >
        {docs.length} file{docs.length !== 1 ? 's' : ''}
      </button>
    );
  };

  const modalDocs = docsCustomer ? (customerDocs[docsCustomer.id] || []) : [];

  return (
    <MainLayout>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Customers</h1>
        <button
          onClick={() => {
            setEditingCustomer(null);
            setFormData(EMPTY_FORM);
            setShowModal(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full sm:w-auto"
        >
          + Add Customer
        </button>
      </div>

      {message.text && (
        <div className={`mb-4 p-4 rounded ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <>
          {/* Mobile: stacked cards */}
          <div className="md:hidden space-y-3">
            {customers.map((customer) => (
              <div key={customer.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{customer.customer_name}</p>
                    <p className="text-xs text-gray-500">{customer.customer_code}</p>
                  </div>
                  <span className="text-green-600 text-sm">✓ Login</span>
                </div>
                <div className="text-sm space-y-1 mb-3">
                  <p className="text-gray-600 break-words">{customer.email}</p>
                  <p className="text-gray-600">Model: <ModelBadge model={customer.business_model} /></p>
                  <p className="text-gray-600">Prep Rate: <span className="font-medium">${customer.prep_rate}</span></p>
                  <p className="text-gray-600">Warehouses: <span className="font-medium">{getWarehouseNames(customer.warehouse_ids)}</span></p>
                  <p className="text-gray-600">Documents: {renderDocsButton(customer)}</p>
                </div>
                <div className="flex gap-4 pt-2 border-t">
                  <button
                    onClick={() => handleEdit(customer)}
                    className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(customer.id)}
                    className="text-red-600 hover:text-red-900 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: table */}
          <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Model</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prep Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned Warehouses</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Documents</th>
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
                      <td className="px-6 py-4"><ModelBadge model={customer.business_model} /></td>
                      <td className="px-6 py-4">${customer.prep_rate}</td>
                      <td className="px-6 py-4">{getWarehouseNames(customer.warehouse_ids)}</td>
                      <td className="px-6 py-4">{renderDocsButton(customer)}</td>
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
          </div>
        </>
      )}

      {/* Documents Modal */}
      {docsCustomer && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-start sm:items-center justify-center p-4 z-50">
          <div className="w-full max-w-sm sm:max-w-lg p-5 border shadow-lg rounded-md bg-white my-8 sm:my-0 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold pr-4 break-words">
                Documents - {docsCustomer.customer_name}
              </h3>
              <button
                onClick={() => setDocsCustomer(null)}
                className="text-gray-600 hover:text-gray-900 shrink-0"
              >
                ✕
              </button>
            </div>

            {modalDocs.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No documents uploaded.</p>
            ) : (
              <ul className="space-y-2">
                {modalDocs.map((doc) => (
                  <li
                    key={doc.id}
                    className="flex flex-wrap items-center justify-between gap-2 border border-gray-200 rounded-md px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium break-all">{doc.original_filename}</p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(doc.file_size)} · Uploaded {new Date(doc.uploaded_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-4 shrink-0">
                      <button
                        onClick={() => viewDocument(doc)}
                        className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                      >
                        View
                      </button>
                      <button
                        onClick={() => downloadDocument(doc)}
                        className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                      >
                        Download
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-start sm:items-center justify-center p-4 z-50">
          <div className="w-full max-w-sm sm:max-w-md p-5 border shadow-lg rounded-md bg-white my-8 sm:my-0 max-h-[90vh] overflow-y-auto">
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

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Model
                </label>
                <select
                  value={formData.business_model}
                  onChange={(e) => setFormData({...formData, business_model: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                >
                  <option value="wholesale">Wholesale</option>
                  <option value="dropshipping">Dropshipping</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Dropshipping customers get all Wholesale features plus the Dropshipping Inventory section.
                </p>
                {editingCustomer?.business_model === 'dropshipping' && formData.business_model === 'wholesale' && (
                  <p className="text-xs text-amber-700 mt-1">
                    Switching to Wholesale hides this customer's dropshipping inventory. Nothing is deleted, and it reappears if you switch back.
                  </p>
                )}
              </div>

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
                        <span className="text-sm">{warehouse.name} - {warehouse.location}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2">
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