import { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import MainLayout from '../layouts/MainLayout';
import BackButton from '../components/BackButton';
import { downloadFile } from '../utils/download';

const OwnerInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [batches, setBatches] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [shippingDetails, setShippingDetails] = useState([]);
  const [proofs, setProofs] = useState({}); // Store proofs by invoice ID
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showProofsModal, setShowProofsModal] = useState(false);
  const [invoiceProofs, setInvoiceProofs] = useState([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [invoicesRes, batchesRes, customersRes, shippingRes] = await Promise.all([
        axiosInstance.get('/invoices/'),
        axiosInstance.get('/batches/'),
        axiosInstance.get('/customers/'),
        axiosInstance.get('/shipping-details/')
      ]);
      
      setInvoices(invoicesRes.data);
      setBatches(batchesRes.data);
      
      // Create customer lookup map
      const custMap = {};
      customersRes.data.forEach(c => custMap[c.id] = c);
      setCustomers(custMap);
      
      // Create shipping details lookup map
      const shippingMap = {};
      shippingRes.data.forEach(s => shippingMap[s.id] = s);
      setShippingDetails(shippingMap);
      
      // Fetch proofs for all invoices
      await fetchProofsForInvoices(invoicesRes.data);
      
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProofsForInvoices = async (invoicesList) => {
    const proofsMap = {};
    
    await Promise.all(
      invoicesList.map(async (invoice) => {
        try {
          const response = await axiosInstance.get(`/payment-proofs/invoice/${invoice.id}`);
          proofsMap[invoice.id] = response.data;
        } catch (error) {
          console.error(`Failed to fetch proofs for invoice ${invoice.id}:`, error);
          proofsMap[invoice.id] = [];
        }
      })
    );
    
    setProofs(proofsMap);
  };

  const toggleVisibility = async (invoiceId, currentStatus) => {
    try {
      await axiosInstance.put(`/invoices/${invoiceId}/visibility?visible=${!currentStatus}`);
      
      setInvoices(invoices.map(inv => 
        inv.id === invoiceId 
          ? { ...inv, is_visible_to_customer: !currentStatus }
          : inv
      ));
      
    } catch (error) {
      console.error('Failed to toggle visibility:', error);
    }
  };

  const updateInvoiceStatus = async (invoiceId, newStatus) => {
    try {
      await axiosInstance.put(`/invoices/${invoiceId}/status?status=${newStatus}`);
      
      setInvoices(invoices.map(inv => 
        inv.id === invoiceId 
          ? { ...inv, status: newStatus }
          : inv
      ));
      
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const viewProofs = (invoice) => {
    setSelectedInvoice(invoice);
    setInvoiceProofs(proofs[invoice.id] || []);
    setShowProofsModal(true);
  };

  const verifyProof = async (proofId, verified) => {
    try {
      await axiosInstance.put(`/payment-proofs/${proofId}/verify`, { verified });
      
      // Refresh proofs
      const response = await axiosInstance.get(`/payment-proofs/invoice/${selectedInvoice.id}`);
      setInvoiceProofs(response.data);
      
      // Update proofs map
      setProofs({
        ...proofs,
        [selectedInvoice.id]: response.data
      });
      
    } catch (error) {
      console.error('Failed to verify proof:', error);
    }
  };

  const getBatchForInvoice = (invoice) => {
    const shippingDetail = shippingDetails[invoice.shipping_details_id];
    if (shippingDetail) {
      return batches.find(b => b.id === shippingDetail.batch_id);
    }
    return null;
  };

  const getCustomerName = (customerId) => {
    const customer = customers[customerId];
    return customer ? `${customer.customer_name} (${customer.customer_code})` : customerId.substring(0, 8);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'unpaid': return 'bg-red-100 text-red-800';
      case 'partially_paid': return 'bg-yellow-100 text-yellow-800';
      case 'fully_paid': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const filteredInvoices = invoices.filter(inv => 
    filter === 'all' ? true : inv.invoice_type === filter
  );

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
        <div className="flex justify-between items-center mb-8">
          
          <h1 className="text-3xl font-bold">All Invoices</h1>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded ${
                filter === 'all' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('shipping')}
              className={`px-4 py-2 rounded ${
                filter === 'shipping' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Shipping
            </button>
            <button
              onClick={() => setFilter('prep')}
              className={`px-4 py-2 rounded ${
                filter === 'prep' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Prep
            </button>
          </div>
        </div>

        {filteredInvoices.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No invoices found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice #</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Batch</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issue Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer Visible</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proofs</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvoices.map((invoice) => {
                  const batch = getBatchForInvoice(invoice);
                  const invoiceProofs = proofs[invoice.id] || [];
                  
                  return (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-sm">{invoice.invoice_number}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          invoice.invoice_type === 'shipping' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {invoice.invoice_type}
                        </span>
                      </td>
                      <td className="px-4 py-3">{getCustomerName(invoice.customer_id)}</td>
                      <td className="px-4 py-3">
                        {batch ? (
                          <div className="text-sm">
                            <div>{batch.id.substring(0, 8)}...</div>
                            <div className="text-gray-500 text-xs">{formatDateTime(batch.upload_date)}</div>
                          </div>
                        ) : 'N/A'}
                      </td>
                      <td className="px-4 py-3">{formatDate(invoice.issue_date)}</td>
                      <td className="px-4 py-3">{formatDate(invoice.due_date)}</td>
                      <td className="px-4 py-3 font-medium">{formatCurrency(invoice.total_amount)}</td>
                      <td className="px-4 py-3">
                        <select
                          value={invoice.status}
                          onChange={(e) => updateInvoiceStatus(invoice.id, e.target.value)}
                          className={`px-2 py-1 rounded text-xs font-medium border-0 ${
                            invoice.status === 'unpaid' ? 'bg-red-100 text-red-800' :
                            invoice.status === 'partially_paid' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}
                        >
                          <option value="unpaid">Unpaid</option>
                          <option value="partially_paid">Partially Paid</option>
                          <option value="fully_paid">Fully Paid</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleVisibility(invoice.id, invoice.is_visible_to_customer)}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            invoice.is_visible_to_customer 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {invoice.is_visible_to_customer ? 'Visible' : 'Hidden'}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => viewProofs(invoice)}
                          className="text-purple-600 hover:text-purple-900 text-sm font-medium"
                        >
                          {invoiceProofs.length} Proof{invoiceProofs.length !== 1 ? 's' : ''}
                        </button>
                      </td>
                      <td className="px-4 py-3 space-x-2">
                        <button
                          onClick={() => downloadFile(`downloads/invoice/${invoice.id}`, `invoice_${invoice.invoice_number}.pdf` )}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                        >
                          PDF
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Proofs Modal */}
        {showProofsModal && selectedInvoice && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="relative top-20 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">
                  Payment Proofs - Invoice {selectedInvoice.invoice_number}
                </h3>
                <button
                  onClick={() => setShowProofsModal(false)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  ✕
                </button>
              </div>

              {invoiceProofs.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No proofs uploaded for this invoice.</p>
              ) : (
                <div className="space-y-4">
                  {invoiceProofs.map((proof) => (
                    <div key={proof.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-gray-600">
                            Uploaded: {new Date(proof.uploaded_at).toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            File: {proof.file_url.split('/').pop()}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          proof.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {proof.verified ? 'Verified' : 'Pending'}
                        </span>
                      </div>
                      
                      <div className="mt-3 flex space-x-2">
                        
                        <button
                          onClick={() => downloadFile(
                            proof.file_url,
                            proof.file_url.split('/').pop()
                          )}
                          className="text-blue-600 hover:text-blue-900 text-sm"
                        >
                          View File
                        </button>
                        {!proof.verified && (
                          <button
                            onClick={() => verifyProof(proof.id, true)}
                            className="text-green-600 hover:text-green-900 text-sm"
                          >
                            Verify
                          </button>
                        )}
                        {proof.verified && (
                          <button
                            onClick={() => verifyProof(proof.id, false)}
                            className="text-orange-600 hover:text-orange-900 text-sm"
                          >
                            Unverify
                          </button>
                        )}
                      </div>
                      
                      {proof.verified_at && (
                        <p className="text-xs text-gray-500 mt-2">
                          Verified on: {new Date(proof.verified_at).toLocaleString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    
  );
};

export default OwnerInvoices;