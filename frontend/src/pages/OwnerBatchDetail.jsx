import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../api/axios';
import BackButton from '../components/BackButton';

// Inside the return, after MainLayout:
<MainLayout>
  <div className="max-w-7xl mx-auto">
    <BackButton />
    <h1 className="text-3xl font-bold mb-8">Owner Dashboard</h1>
    {/* rest of the content */}
  </div>
</MainLayout>
import MainLayout from '../layouts/MainLayout';

const OwnerBatchDetail = () => {
  const { id } = useParams();
  const [batch, setBatch] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [customers, setCustomers] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchBatchDetails();
    fetchCustomers();
    fetchUsers();
  }, [id]);

  const fetchBatchDetails = async () => {
    try {
      const response = await axiosInstance.get(`/batches/${id}`);
      console.log('Batch details:', response.data);
      setBatch(response.data);
      setRows(response.data.rows || []);
    } catch (error) {
      console.error('Failed to fetch batch:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await axiosInstance.get('/customers/');
      setCustomers(response.data);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/users/');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const getCustomerCode = (customerId) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.customer_code : customerId?.substring(0, 8);
  };

  const getUploaderName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.full_name : userId?.substring(0, 8);
  };

  const formatBatchId = (batch) => {
    if (!batch) return '';
    const date = new Date(batch.upload_date);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const customerCode = getCustomerCode(batch.customer_id);
    const shortId = batch.id.substring(0, 4);
    
    return `${day}-${month}-${customerCode}-${shortId}`;
  };

  const handleEdit = (row) => {
    setEditingRowId(row.id);
    setEditForm({
      tracking_number: row.tracking_number,
      label_cost: row.label_cost,
      end_customer_name: row.end_customer_name,
      order_number: row.order_number,
      date: row.date.split('T')[0] || row.date
    });
  };

  const handleSave = async (rowId) => {
    try {
      const updatedRows = rows.map(row => 
        row.id === rowId ? { ...row, ...editForm } : row
      );
      
      await axiosInstance.put(`/batches/${id}/rows`, updatedRows);
      setRows(updatedRows);
      setEditingRowId(null);
    } catch (error) {
      console.error('Failed to update row:', error);
      alert('Update failed: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleCancel = () => {
    setEditingRowId(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) return <MainLayout><div className="text-center py-8">Loading...</div></MainLayout>;

  return (
    
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <BackButton />
          <h1 className="text-3xl font-bold">Batch Details</h1>
          <div className="space-x-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              batch?.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              batch?.status === 'approved' ? 'bg-green-100 text-green-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {batch?.status}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Batch ID</p>
              <p className="font-mono text-lg">{formatBatchId(batch)}</p>
              <p className="text-xs text-gray-400 mt-1">{batch?.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Customer Code</p>
              <p className="text-lg">{getCustomerCode(batch?.customer_id)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Employee</p>
              <p className="text-lg">{getUploaderName(batch?.uploaded_by)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Upload Date</p>
              <p className="text-lg">{formatDate(batch?.upload_date)}</p>
            </div>
          </div>
          {batch?.notes && (
            <div className="mt-4">
              <p className="text-sm text-gray-500">Notes</p>
              <p className="mt-1">{batch.notes}</p>
            </div>
          )}
        </div>

        <h2 className="text-xl font-bold mb-4">Shipping Rows</h2>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Tracking Number</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Label Cost</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Customer Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Order Number</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rows.map((row) => (
                <tr key={row.id}>
                  {editingRowId === row.id ? (
                    // Edit mode
                    <>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={editForm.tracking_number}
                          onChange={(e) => setEditForm({...editForm, tracking_number: e.target.value})}
                          className="w-full px-2 py-1 border rounded text-sm"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          step="0.01"
                          value={editForm.label_cost}
                          onChange={(e) => setEditForm({...editForm, label_cost: e.target.value})}
                          className="w-full px-2 py-1 border rounded text-sm"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={editForm.end_customer_name}
                          onChange={(e) => setEditForm({...editForm, end_customer_name: e.target.value})}
                          className="w-full px-2 py-1 border rounded text-sm"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={editForm.order_number}
                          onChange={(e) => setEditForm({...editForm, order_number: e.target.value})}
                          className="w-full px-2 py-1 border rounded text-sm"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="date"
                          value={editForm.date}
                          onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                          className="w-full px-2 py-1 border rounded text-sm"
                        />
                      </td>
                      <td className="px-4 py-2 space-x-2">
                        <button
                          onClick={() => handleSave(row.id)}
                          className="text-green-600 hover:text-green-900 text-sm font-medium"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    // View mode
                    <>
                      <td className="px-4 py-2 text-sm">{row.tracking_number}</td>
                      <td className="px-4 py-2 text-center">{row.quantity || 1}</td>
                      <td className="px-4 py-2 text-sm">${parseFloat(row.label_cost).toFixed(2)}</td>
                      <td className="px-4 py-2 text-sm">{row.end_customer_name}</td>
                      <td className="px-4 py-2 text-sm">{row.order_number}</td>
                      <td className="px-4 py-2 text-sm">{formatDate(row.date)}</td>
                      <td className="px-4 py-2">
                        {batch?.status === 'pending' && (
                          <button
                            onClick={() => handleEdit(row)}
                            className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                          >
                            Edit
                          </button>
                        )}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    
  );
};

export default OwnerBatchDetail;