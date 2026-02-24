import { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import MainLayout from '../layouts/MainLayout';
import BackButton from '../components/BackButton';
import { downloadFile } from '../utils/download';


const OwnerShippingDetails = () => {
  const [shippingDetails, setShippingDetails] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [batches, setBatches] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      // Fetch all necessary data
      const [shippingRes, invoicesRes, batchesRes, customersRes] = await Promise.all([
        axiosInstance.get('/shipping-details/'),
        axiosInstance.get('/invoices/'),
        axiosInstance.get('/batches/'),
        axiosInstance.get('/customers/')
      ]);
      
      setShippingDetails(shippingRes.data);
      setInvoices(invoicesRes.data);
      setBatches(batchesRes.data);
      
      // Create customer lookup map
      const custMap = {};
      customersRes.data.forEach(c => custMap[c.id] = c);
      setCustomers(custMap);
      
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async (id, currentStatus) => {
    try {
      await axiosInstance.put(`/shipping-details/${id}/visibility?visible=${!currentStatus}`);
      
      setShippingDetails(shippingDetails.map(sd => 
        sd.id === id 
          ? { ...sd, is_visible_to_customer: !currentStatus }
          : sd
      ));
      
    } catch (error) {
      console.error('Failed to toggle visibility:', error);
    }
  };

  const getInvoicesForShipping = (shippingId) => {
    return invoices.filter(inv => inv.shipping_details_id === shippingId);
  };

  const getBatchInfo = (batchId) => {
    return batches.find(b => b.id === batchId);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
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
        <h1 className="text-3xl font-bold mb-8">Shipping Details Management</h1>

        {shippingDetails.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No shipping details found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {shippingDetails.map((sd) => {
              const relatedInvoices = getInvoicesForShipping(sd.id);
              const batch = getBatchInfo(sd.batch_id);
              const customer = customers[sd.customer_id];
              
              return (
                <div key={sd.id} className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
                  {/* Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-lg font-semibold">
                          Shipping Details: {sd.id.substring(0, 8)}...
                        </h2>
                        <p className="text-sm text-gray-600">
                          Customer: {customer?.customer_name || sd.customer_id.substring(0, 8)} ({customer?.customer_code || 'N/A'})
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          sd.is_visible_to_customer 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {sd.is_visible_to_customer ? 'Visible to Customer' : 'Hidden from Customer'}
                        </span>
                        <button
                          onClick={() => toggleVisibility(sd.id, sd.is_visible_to_customer)}
                          className={`px-4 py-2 rounded text-sm font-medium ${
                            sd.is_visible_to_customer 
                              ? 'bg-gray-600 text-white hover:bg-gray-700' 
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          {sd.is_visible_to_customer ? 'Hide' : 'Show'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Batch Info */}
                  {batch && (
                    <div className="px-6 py-3 bg-blue-50 border-b border-blue-100">
                      <p className="text-sm text-blue-800">
                        <span className="font-semibold">Batch:</span> {batch.id.substring(0, 8)}... | 
                        <span className="font-semibold ml-2">Uploaded:</span> {formatDateTime(batch.upload_date)} |
                        <span className="font-semibold ml-2">Status:</span> {batch.status}
                      </p>
                    </div>
                  )}

                  {/* Related Invoices */}
                  <div className="px-6 py-4">
                    <h3 className="text-md font-semibold mb-3">Related Invoices</h3>
                    {relatedInvoices.length === 0 ? (
                      <p className="text-sm text-gray-500">No invoices linked to this shipping detail</p>
                    ) : (
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Invoice #</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Type</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Issue Date</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Amount</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Customer Visible</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {relatedInvoices.map(inv => (
                            <tr key={inv.id}>
                              <td className="px-4 py-2 font-mono text-sm">{inv.invoice_number}</td>
                              <td className="px-4 py-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  inv.invoice_type === 'shipping' 
                                    ? 'bg-blue-100 text-blue-800' 
                                    : 'bg-purple-100 text-purple-800'
                                }`}>
                                  {inv.invoice_type}
                                </span>
                              </td>
                              <td className="px-4 py-2">{formatDate(inv.issue_date)}</td>
                              <td className="px-4 py-2 font-medium">${inv.total_amount}</td>
                              <td className="px-4 py-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  inv.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {inv.status}
                                </span>
                              </td>
                              <td className="px-4 py-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  inv.is_visible_to_customer 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {inv.is_visible_to_customer ? 'Yes' : 'No'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>

                  {/* Files */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex space-x-4">
                      {sd.excel_file_url && (
                        <button
                          onClick={() => downloadFile(
                            `/api/v1/downloads/shipping-details/${sd.id}/excel`,
                            `shipping_details_${sd.id.substring(0, 8)}.xlsx`
                          )}
                          className="text-green-600 hover:text-green-900 flex items-center"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Download Excel
                        </button>
                      )}
                      {sd.pdf_file_url && (
                        <button
                          onClick={() => downloadFile(
                            `/api/v1/downloads/shipping-details/${sd.id}/pdf`,
                            `shipping_details_${sd.id.substring(0, 8)}.pdf`
                          )}
                          className="text-red-600 hover:text-red-900 flex items-center"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Download PDF
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    
  );
};

export default OwnerShippingDetails;