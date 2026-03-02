import { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import MainLayout from '../layouts/MainLayout';
import BackButton from '../components/BackButton';
import { downloadFile } from '../utils/download';


const CustomerPrepInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingFor, setUploadingFor] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await axiosInstance.get('/customer/invoices/prep');
      console.log('Prep invoices:', response.data);
      setInvoices(response.data);
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUploadProof = async (invoiceId) => {
    if (!selectedFile) {
      setMessage({ type: 'error', text: 'Please select a file' });
      return;
    }

    const formData = new FormData();
    formData.append('invoice_id', invoiceId);
    formData.append('file', selectedFile);

    try {
      await axiosInstance.post('/payment-proofs/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setMessage({ type: 'success', text: 'Payment proof uploaded successfully' });
      setUploadingFor(null);
      setSelectedFile(null);
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.detail || 'Upload failed' });
    }
  };

  const downloadFile = async (url, filename) => {
    console.log('downloadFile called with:', { url, filename });
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file. Please try again.');
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
        <BackButton />
        
        <h1 className="text-3xl font-bold mb-8">Preparation Invoices</h1>

        {message.text && (
          <div className={`mb-4 p-4 rounded ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        {invoices.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No preparation invoices available.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice #</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issue Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shipping Details</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice PDF</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Upload Proof</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{invoice.invoice_number}</td>
                    <td className="px-4 py-3">{formatDate(invoice.issue_date)}</td>
                    <td className="px-4 py-3">{formatDate(invoice.due_date)}</td>
                    <td className="px-4 py-3 text-center">{invoice.quantity}</td>
                    <td className="px-4 py-3">{formatCurrency(invoice.rate || 0)}</td>
                    <td className="px-4 py-3 font-medium">{formatCurrency(invoice.total_amount)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                        {invoice.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        {invoice.has_excel && (
                          <button
                            onClick={() => {

                            
                              console.log('Button clicked for invoice:', invoice.id);
                              console.log('Filename being passed:', `invoice_${invoice.invoice_number}.pdf`);
                              console.log('URL being passed:', `/downloads/invoice/${invoice.id}`);
                              downloadFile(
                              `/customer/downloads/shipping-details/${invoice.shipping_detail_id}/excel`,
                              `shipping_details_${invoice.invoice_number}.xlsx`
                            )}}
                            className="text-green-600 hover:text-green-900 text-sm font-medium px-2 py-1 border border-green-600 rounded"
                          >
                            Excel
                          </button>
                        )}
                        {invoice.has_pdf && (
                          <button
                            onClick={() => {
                               
                              console.log('Button clicked for invoice:', invoice.id);
                              console.log('Filename being passed:', `invoice_${invoice.invoice_number}.pdf`);
                              console.log('URL being passed:', `/downloads/invoice/${invoice.id}`);
                              downloadFile(
                              `/customer/downloads/shipping-details/${invoice.shipping_detail_id}/pdf`,
                              `shipping_details_${invoice.invoice_number}.pdf`
                            )}}
                            className="text-red-600 hover:text-red-900 text-sm font-medium px-2 py-1 border border-red-600 rounded"
                          >
                            PDF
                          </button>
                        )}
                        {!invoice.has_excel && !invoice.has_pdf && (
                          <span className="text-gray-400 text-sm">Not available</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          console.log('Button clicked for invoice:', invoice.id);
                          console.log('Filename being passed:', `invoice_${invoice.invoice_number}.pdf`);
                          console.log('URL being passed:', `/downloads/invoice/${invoice.id}`);
                          downloadFile(
                          `/customer/downloads/invoice/${invoice.id}`,
                          `invoice_${invoice.invoice_number}.pdf`
                        )}}
                        className="text-blue-600 hover:text-blue-900 text-sm font-medium px-3 py-1 border border-blue-600 rounded"
                      >
                        PDF
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      {uploadingFor === invoice.id ? (
                        <div className="flex flex-col space-y-2">
                          <input
                            type="file"
                            onChange={handleFileChange}
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="text-sm w-40"
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleUploadProof(invoice.id)}
                              className="text-green-600 hover:text-green-900 text-sm font-medium px-2 py-1 border border-green-600 rounded"
                            >
                              Upload
                            </button>
                            <button
                              onClick={() => setUploadingFor(null)}
                              className="text-gray-600 hover:text-gray-900 text-sm font-medium px-2 py-1 border border-gray-600 rounded"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setUploadingFor(invoice.id)}
                          className="text-purple-600 hover:text-purple-900 text-sm font-medium px-3 py-1 border border-purple-600 rounded"
                        >
                          Upload Proof
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    
  );
};

export default CustomerPrepInvoices;