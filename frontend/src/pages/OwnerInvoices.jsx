import { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import MainLayout from '../layouts/MainLayout';
import BackButton from '../components/BackButton';
import { downloadFile } from '../utils/download';

const PAGE_SIZE = 25;

const OwnerInvoices = () => {
  const [view, setView] = useState('customers'); // 'customers' | 'invoices'

  const [customerSummaries, setCustomerSummaries] = useState([]);
  const [summaryLoading, setSummaryLoading] = useState(true);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [typeFilter, setTypeFilter] = useState('all');   // all | shipping | prep
  const [paidFilter, setPaidFilter] = useState('all');   // all | paid | unpaid
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [invoices, setInvoices] = useState([]);
  const [proofs, setProofs] = useState({});
  const [invoicesLoading, setInvoicesLoading] = useState(false);

  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showProofsModal, setShowProofsModal] = useState(false);
  const [invoiceProofs, setInvoiceProofs] = useState([]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  useEffect(() => {
    fetchCustomerSummaries();
  }, []);

  useEffect(() => {
    if (view === 'invoices' && selectedCustomer) {
      fetchInvoicesForCustomer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, selectedCustomer, typeFilter, paidFilter, page]);

  const fetchCustomerSummaries = async () => {
    setSummaryLoading(true);
    try {
      const res = await axiosInstance.get('/invoices/customer-summary');
      setCustomerSummaries(res.data);
    } catch (error) {
      console.error('Failed to fetch customer summary:', error);
    } finally {
      setSummaryLoading(false);
    }
  };

  const fetchInvoicesForCustomer = async () => {
    setInvoicesLoading(true);
    try {
      const params = {
        customer_id: selectedCustomer.customer_id,
        skip: (page - 1) * PAGE_SIZE,
        limit: PAGE_SIZE
      };
      if (typeFilter !== 'all') params.invoice_type = typeFilter;
      if (paidFilter === 'paid') params.paid = true;
      if (paidFilter === 'unpaid') params.paid = false;

      const res = await axiosInstance.get('/invoices/', { params });
      setInvoices(res.data);
      const total = res.headers['x-total-count'];
      setTotalCount(total ? parseInt(total, 10) : res.data.length);

      await fetchProofsForInvoices(res.data);
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
    } finally {
      setInvoicesLoading(false);
    }
  };

  const fetchProofsForInvoices = async (invoicesList) => {
    if (invoicesList.length === 0) {
      setProofs({});
      return;
    }
    try {
      const invoiceIds = invoicesList.map(inv => inv.id);
      const response = await axiosInstance.post('/payment-proofs/batch', invoiceIds);
      const proofsMap = {};
      invoicesList.forEach(inv => {
        proofsMap[inv.id] = response.data[inv.id] || [];
      });
      setProofs(proofsMap);
    } catch (error) {
      console.error('Failed to fetch proofs batch:', error);
      setProofs({});
    }
  };

  const openCustomer = (customer, type = 'all', paid = 'all') => {
    setSelectedCustomer(customer);
    setTypeFilter(type);
    setPaidFilter(paid);
    setPage(1);
    setView('invoices');
  };

  const backToCustomers = () => {
    setView('customers');
    setSelectedCustomer(null);
    setInvoices([]);
    setProofs({});
  };

  const changeTypeFilter = (type) => {
    setTypeFilter(type);
    setPage(1);
  };

  const changePaidFilter = (paid) => {
    setPaidFilter(paid);
    setPage(1);
  };

  const toggleVisibility = async (invoiceId, currentStatus) => {
    try {
      await axiosInstance.put(`/invoices/${invoiceId}/visibility?visible=${!currentStatus}`);
      setInvoices(invoices.map(inv =>
        inv.id === invoiceId ? { ...inv, is_visible_to_customer: !currentStatus } : inv
      ));
    } catch (error) {
      console.error('Failed to toggle visibility:', error);
    }
  };

  const updateInvoiceStatus = async (invoiceId, newStatus) => {
    try {
      await axiosInstance.put(`/invoices/${invoiceId}/status?status=${newStatus}`);
      setInvoices(invoices.map(inv =>
        inv.id === invoiceId ? { ...inv, status: newStatus } : inv
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
      const response = await axiosInstance.get(`/payment-proofs/invoice/${selectedInvoice.id}`);
      setInvoiceProofs(response.data);
      setProofs({ ...proofs, [selectedInvoice.id]: response.data });
    } catch (error) {
      console.error('Failed to verify proof:', error);
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();
  const formatDateTime = (dateString) => new Date(dateString).toLocaleString();
  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(amount) || 0);

  // ===================== CUSTOMER SUMMARY VIEW =====================
  if (view === 'customers') {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto">
          <BackButton />
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Invoices by Customer</h1>

          {summaryLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : customerSummaries.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">No customers found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {customerSummaries.map((c) => (
                <div key={c.customer_id} className="bg-white rounded-lg shadow p-4 sm:p-6">
                  <button
                    onClick={() => openCustomer(c, 'all', 'all')}
                    className="text-left mb-4 hover:underline"
                  >
                    <p className="text-lg font-bold text-gray-900">{c.customer_name}</p>
                    <p className="text-sm text-gray-500">{c.customer_code}</p>
                  </button>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
                    <button
                      onClick={() => openCustomer(c, 'all', 'all')}
                      className="bg-gray-50 hover:bg-gray-100 rounded-lg p-3 text-center transition-colors"
                    >
                      <p className="text-2xl font-bold text-gray-900">{c.total_count}</p>
                      <p className="text-xs text-gray-500">All Invoices</p>
                    </button>
                    <button
                      onClick={() => openCustomer(c, 'shipping', 'all')}
                      className="bg-blue-50 hover:bg-blue-100 rounded-lg p-3 text-center transition-colors"
                    >
                      <p className="text-2xl font-bold text-blue-700">{c.shipping_count}</p>
                      <p className="text-xs text-blue-600">Shipping</p>
                    </button>
                    <button
                      onClick={() => openCustomer(c, 'prep', 'all')}
                      className="bg-purple-50 hover:bg-purple-100 rounded-lg p-3 text-center transition-colors"
                    >
                      <p className="text-2xl font-bold text-purple-700">{c.prep_count}</p>
                      <p className="text-xs text-purple-600">Prep</p>
                    </button>
                    <button
                      onClick={() => openCustomer(c, 'all', 'paid')}
                      className="bg-green-50 hover:bg-green-100 rounded-lg p-3 text-center transition-colors"
                    >
                      <p className="text-2xl font-bold text-green-700">{c.paid_count}</p>
                      <p className="text-xs text-green-600">Paid</p>
                    </button>
                    <button
                      onClick={() => openCustomer(c, 'all', 'unpaid')}
                      className="bg-red-50 hover:bg-red-100 rounded-lg p-3 text-center transition-colors"
                    >
                      <p className="text-2xl font-bold text-red-700">{c.unpaid_count}</p>
                      <p className="text-xs text-red-600">Unpaid</p>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-3 border-t text-sm">
                    <div>
                      <span className="text-gray-500">Shipping balance: </span>
                      <span className="font-semibold text-red-700">{formatCurrency(c.shipping_unpaid_balance)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Prep balance: </span>
                      <span className="font-semibold text-red-700">{formatCurrency(c.prep_unpaid_balance)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </MainLayout>
    );
  }

  // ===================== DRILLED-DOWN INVOICE LIST VIEW =====================
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-4">
          <button
            onClick={backToCustomers}
            className="text-green-600 hover:text-green-800 text-sm font-medium"
          >
            ← Back to Customers
          </button>
        </div>

        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">{selectedCustomer.customer_name}</h1>
          <p className="text-gray-500 text-sm">{selectedCustomer.customer_code}</p>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {['all', 'shipping', 'prep'].map((t) => (
              <button
                key={t}
                onClick={() => changeTypeFilter(t)}
                className={`px-4 py-2 rounded whitespace-nowrap text-sm ${
                  typeFilter === t ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                {t === 'all' ? 'All Types' : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {['all', 'paid', 'unpaid'].map((p) => (
              <button
                key={p}
                onClick={() => changePaidFilter(p)}
                className={`px-4 py-2 rounded whitespace-nowrap text-sm ${
                  paidFilter === p ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                {p === 'all' ? 'All Payments' : p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {invoicesLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : invoices.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No invoices found for this filter.</p>
          </div>
        ) : (
          <>
            {/* Mobile: stacked cards */}
            <div className="lg:hidden space-y-3">
              {invoices.map((invoice) => {
                const invoiceProofs = proofs[invoice.id] || [];
                return (
                  <div key={invoice.id} className="bg-white rounded-lg shadow p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-mono text-sm font-medium">{invoice.invoice_number}</p>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          invoice.invoice_type === 'shipping'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {invoice.invoice_type}
                        </span>
                      </div>
                      <p className="font-bold text-lg">{formatCurrency(invoice.total_amount)}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                      <div>
                        <p className="text-xs text-gray-500">Issue Date</p>
                        <p>{formatDate(invoice.issue_date)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Due Date</p>
                        <p>{formatDate(invoice.due_date)}</p>
                      </div>
                      {invoice.batch_id && (
                        <div className="col-span-2">
                          <p className="text-xs text-gray-500">Batch</p>
                          <p>{invoice.batch_id.substring(0, 8)}... <span className="text-gray-500 text-xs">({formatDateTime(invoice.batch_upload_date)})</span></p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 items-center pt-2 border-t">
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

                      <button
                        onClick={() => toggleVisibility(invoice.id, invoice.is_visible_to_customer)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          invoice.is_visible_to_customer ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {invoice.is_visible_to_customer ? 'Visible' : 'Hidden'}
                      </button>

                      <button
                        onClick={() => viewProofs(invoice)}
                        className="text-purple-600 text-xs font-medium px-2 py-1"
                      >
                        {invoiceProofs.length} Proof{invoiceProofs.length !== 1 ? 's' : ''}
                      </button>

                      <button
                        onClick={() => downloadFile(`/downloads/invoice/${invoice.id}`, `invoice_${invoice.invoice_number}.pdf`)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium ml-auto"
                      >
                        PDF
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop: table */}
            <div className="hidden lg:block bg-white rounded-lg shadow overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice #</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
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
                  {invoices.map((invoice) => {
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
                        <td className="px-4 py-3">
                          {invoice.batch_id ? (
                            <div className="text-sm">
                              <div>{invoice.batch_id.substring(0, 8)}...</div>
                              <div className="text-gray-500 text-xs">{formatDateTime(invoice.batch_upload_date)}</div>
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
                            onClick={() => downloadFile(`/downloads/invoice/${invoice.id}`, `invoice_${invoice.invoice_number}.pdf`)}
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

            <div className="flex items-center justify-between mt-4 bg-white rounded-lg shadow px-4 py-3">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded text-sm font-medium bg-gray-100 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages} · {totalCount} invoice{totalCount !== 1 ? 's' : ''}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1.5 rounded text-sm font-medium bg-gray-100 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* Proofs Modal */}
        {showProofsModal && selectedInvoice && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-start sm:items-center justify-center p-4 z-50">
            <div className="w-full max-w-sm sm:max-w-xl p-5 border shadow-lg rounded-md bg-white my-8 sm:my-0 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold pr-4">
                  Payment Proofs - {selectedInvoice.invoice_number}
                </h3>
                <button
                  onClick={() => setShowProofsModal(false)}
                  className="text-gray-600 hover:text-gray-900 shrink-0"
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
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                        <div>
                          <p className="text-sm text-gray-600">
                            Uploaded: {new Date(proof.uploaded_at).toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 break-all">
                            File: {proof.file_url.split('/').pop()}
                          </p>
                        </div>
                        <span className={`self-start px-2 py-1 rounded-full text-xs font-medium ${
                          proof.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {proof.verified ? 'Verified' : 'Pending'}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-3">
                        <button
                          onClick={() => downloadFile(
                            `/payment-proofs/${proof.id}/download`,
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
    </MainLayout>
  );
};

export default OwnerInvoices;