import { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../context/AuthContext';
import BackButton from '../components/BackButton';

const UploadBatch = () => {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [customerId, setCustomerId] = useState('');
  const [notes, setNotes] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoadingCustomers(true);
    try {
      console.log('Fetching customers...');
      const response = await axiosInstance.get('/customers/');
      console.log('Customers response:', response.data);
      setCustomers(response.data);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      setMessage({ 
        type: 'error', 
        text: 'Failed to load customers. Please refresh the page.' 
      });
    } finally {
      setLoadingCustomers(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validTypes = ['.xlsx', '.xls', '.csv'];
      const fileExt = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();
      
      if (!validTypes.includes(fileExt)) {
        setMessage({ 
          type: 'error', 
          text: 'Please select an Excel file (.xlsx or .xls)' 
        });
        setFile(null);
        e.target.value = '';
        return;
      }
      setFile(selectedFile);
      setMessage({ type: '', text: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a file' });
      return;
    }
    
    if (!customerId) {
      setMessage({ type: 'error', text: 'Please select a customer' });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('customer_id', customerId);
    formData.append('notes', notes);

    setUploading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axiosInstance.post('/batches/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setMessage({ 
        type: 'success', 
        text: `Batch uploaded successfully! ID: ${response.data.id}` 
      });
      
      setFile(null);
      setCustomerId('');
      setNotes('');
      document.getElementById('file-input').value = '';
      
    } catch (error) {
      console.error('Upload error:', error);
      console.error('Error response:', error.response?.data);
      
      // Show detailed error message
      const errorDetail = error.response?.data?.detail;
      if (Array.isArray(errorDetail)) {
        // If it's an array of validation errors
        const errorMessages = errorDetail.map(e => e.msg || e.message).join(', ');
        setMessage({ type: 'error', text: `Validation failed: ${errorMessages}` });
      } else {
        setMessage({ 
          type: 'error', 
          text: errorDetail || 'Upload failed' 
        });
      }
    } finally {
      setUploading(false);
    }
};

  return (
    
      <div className="max-w-2xl mx-auto">
        <BackButton />
        <h1 className="text-3xl font-bold mb-8">Upload Shipping Batch</h1>
        
        {message.text && (
          <div className={`mb-4 p-4 rounded ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          {/* Customer Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Customer *
            </label>
            {loadingCustomers ? (
              <div className="text-gray-500">Loading customers...</div>
            ) : customers.length === 0 ? (
              <div className="text-red-500">
                No customers found. Please add a customer first.
              </div>
            ) : (
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Choose a customer...</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.customer_name} ({customer.customer_code})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* File Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Excel File *
            </label>
            <input
              id="file-input"
              type="file"
              onChange={handleFileChange}
              accept=".xlsx,.xls,.csv"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Accepted formats: .xlsx, .xls, .csv
            </p>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Add any notes about this batch..."
            />
          </div>

          {/* Debug info - remove after fixing */}
          {customers.length > 0 && (
            <div className="mb-4 p-2 bg-blue-50 text-blue-700 text-sm rounded">
              Found {customers.length} customer(s). First customer: {customers[0].customer_name}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={uploading || customers.length === 0}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              uploading || customers.length === 0
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {uploading ? 'Uploading...' : 'Upload Batch'}
          </button>
        </form>
      </div>
    
  );
};

export default UploadBatch;