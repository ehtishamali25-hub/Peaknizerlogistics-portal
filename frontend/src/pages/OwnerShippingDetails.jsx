import { useState, useEffect, useMemo, useRef } from 'react';
import axiosInstance from '../api/axios';
import BackButton from '../components/BackButton';
import { downloadFile } from '../utils/download';

const PAGE_SIZE = 20;

// Loads every page of a list endpoint (invoices/batches cap their page size)
const fetchAll = async (path, params, pageSize = 200) => {
  const all = [];
  let skip = 0;
  while (true) {
    const res = await axiosInstance.get(path, { params: { ...params, skip, limit: pageSize } });
    all.push(...res.data);
    if (res.data.length < pageSize) break;
    skip += pageSize;
  }
  return all;
};

const invoiceStatusClass = (status) => {
  switch (status) {
    case 'fully_paid': return 'bg-green-100 text-green-800';
    case 'partially_paid': return 'bg-blue-100 text-blue-800';
    default: return 'bg-yellow-100 text-yellow-800';
  }
};

const invoiceStatusLabel = (status) => (status || '').replace(/_/g, ' ');

const OwnerShippingDetails = () => {
  // Customer overview
  const [summary, setSummary] = useState([]);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  // Selected customer's data
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [shippingDetails, setShippingDetails] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [invoices, setInvoices] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loadingCustomer, setLoadingCustomer] = useState(false);
  const requestId = useRef(0);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await axiosInstance.get('/shipping-details/customer-summary');
      setSummary(res.data);
    } catch (err) {
      console.error('Failed to fetch shipping summary:', err);
      setError('Failed to load shipping details. Please refresh.');
    } finally {
      setLoadingSummary(false);
    }
  };

  const fetchPage = async (customerId, pageIndex) => {
    const res = await axiosInstance.get('/shipping-details/', {
      params: { customer_id: customerId, skip: pageIndex * PAGE_SIZE, limit: PAGE_SIZE }
    });
    setShippingDetails(res.data);
    setTotalCount(parseInt(res.headers['x-total-count'] || res.data.length, 10));
  };

  const openCustomer = async (customer) => {
    const myRequest = ++requestId.current;
    setSelectedCustomer(customer);
    setShippingDetails([]);
    setInvoices([]);
    setBatches([]);
    setTotalCount(0);
    setPage(0);
    setError('');
    setLoadingCustomer(true);
    window.scrollTo({ top: 0 });

    try {
      const [, invoiceList, batchList] = await Promise.all([
        fetchPage(customer.customer_id, 0),
        fetchAll('/invoices/', { customer_id: customer.customer_id }),
        fetchAll('/batches/', { customer_id: customer.customer_id })
      ]);
      if (myRequest !== requestId.current) return; // user moved on
      setInvoices(invoiceList);
      setBatches(batchList);
    } catch (err) {
      console.error('Failed to load customer shipping details:', err);
      if (myRequest === requestId.current) {
        setError('Failed to load this customer\'s shipping details.');
      }
    } finally {
      if (myRequest === requestId.current) setLoadingCustomer(false);
    }
  };

  const goToPage = async (pageIndex) => {
    setLoadingCustomer(true);
    try {
      await fetchPage(selectedCustomer.customer_id, pageIndex);
      setPage(pageIndex);
      window.scrollTo({ top: 0 });
    } catch (err) {
      console.error('Failed to load page:', err);
      setError('Failed to load that page.');
    } finally {
      setLoadingCustomer(false);
    }
  };

  const backToCustomers = () => {
    requestId.current++;
    setSelectedCustomer(null);
    setError('');
  };

  const toggleVisibility = async (sd) => {
    const next = !sd.is_visible_to_customer;
    try {
      await axiosInstance.put(`/shipping-details/${sd.id}/visibility?visible=${next}`);

      setShippingDetails((prev) =>
        prev.map((item) => (item.id === sd.id ? { ...item, is_visible_to_customer: next } : item))
      );
      // keep the customer card's visible/hidden counts in sync
      setSummary((prev) =>
        prev.map((c) =>
          c.customer_id === sd.customer_id
            ? {
                ...c,
                visible_count: c.visible_count + (next ? 1 : -1),
                hidden_count: c.hidden_count + (next ? -1 : 1)
              }
            : c
        )
      );
    } catch (err) {
      console.error('Failed to toggle visibility:', err);
    }
  };

  const invoicesByShipping = useMemo(() => {
    const map = {};
    invoices.forEach((inv) => {
      if (!map[inv.shipping_details_id]) map[inv.shipping_details_id] = [];
      map[inv.shipping_details_id].push(inv);
    });
    return map;
  }, [invoices]);

  const batchById = useMemo(() => {
    const map = {};
    batches.forEach((b) => { map[b.id] = b; });
    return map;
  }, [batches]);

  const filteredSummary = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return summary;
    return summary.filter(
      (c) =>
        c.customer_name.toLowerCase().includes(q) ||
        c.customer_code.toLowerCase().includes(q)
    );
  }, [summary, search]);

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();
  const formatDateTime = (dateString) => new Date(dateString).toLocaleString();

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  if (loadingSummary) {
    return <div className="text-center py-8">Loading...</div>;
  }

  /* ---------------- Customer list view ---------------- */
  if (!selectedCustomer) {
    const totalShipping = summary.reduce((sum, c) => sum + c.total_count, 0);

    return (
      <div className="max-w-7xl mx-auto">
        <BackButton />
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Shipping Details Management</h1>
            <p className="text-sm text-gray-500 mt-1">
              {summary.length} customer{summary.length !== 1 ? 's' : ''} · {totalShipping} shipping detail{totalShipping !== 1 ? 's' : ''}
            </p>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer name or code..."
            className="w-full sm:w-72 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {error && (
          <div className="mb-4 p-4 rounded bg-red-100 text-red-700">{error}</div>
        )}

        {filteredSummary.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No customers found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSummary.map((c) => (
              <button
                key={c.customer_id}
                onClick={() => openCustomer(c)}
                className={`text-left bg-white rounded-lg shadow border border-gray-200 hover:border-green-500 hover:shadow-md transition p-5 ${
                  c.total_count === 0 ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="font-semibold text-lg break-words">{c.customer_name}</h2>
                    <p className="text-sm text-gray-500">{c.customer_code}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-2xl font-bold text-green-600">{c.total_count}</p>
                    <p className="text-xs text-gray-500">
                      shipping detail{c.total_count !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {c.visible_count} visible
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {c.hidden_count} hidden
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  /* ---------------- Selected customer view ---------------- */
  return (
    <div className="max-w-7xl mx-auto">
      <button
        onClick={backToCustomers}
        className="mb-4 text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        ← All customers
      </button>

      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold break-words">
          {selectedCustomer.customer_name}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {selectedCustomer.customer_code} · {totalCount} shipping detail{totalCount !== 1 ? 's' : ''}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 rounded bg-red-100 text-red-700">{error}</div>
      )}

      {loadingCustomer && shippingDetails.length === 0 ? (
        <div className="text-center py-8">Loading...</div>
      ) : shippingDetails.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">No shipping details for this customer.</p>
        </div>
      ) : (
        <div className={`space-y-6 ${loadingCustomer ? 'opacity-60 pointer-events-none' : ''}`}>
          {shippingDetails.map((sd) => {
            const relatedInvoices = invoicesByShipping[sd.id] || [];
            const batch = batchById[sd.batch_id];

            return (
              <div key={sd.id} className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
                {/* Header */}
                <div className="bg-gray-50 px-4 sm:px-6 py-4 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <div>
                      <h2 className="text-base sm:text-lg font-semibold break-all">
                        Shipping Details: {sd.id.substring(0, 8)}...
                      </h2>
                      {sd.created_at && (
                        <p className="text-sm text-gray-600">Created: {formatDateTime(sd.created_at)}</p>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        sd.is_visible_to_customer
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {sd.is_visible_to_customer ? 'Visible to Customer' : 'Hidden from Customer'}
                      </span>
                      <button
                        onClick={() => toggleVisibility(sd)}
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
                  <div className="px-4 sm:px-6 py-3 bg-blue-50 border-b border-blue-100">
                    <p className="text-sm text-blue-800 break-words">
                      <span className="font-semibold">Batch:</span> {batch.id.substring(0, 8)}...{' '}
                      <span className="font-semibold ml-2">Uploaded:</span> {formatDateTime(batch.upload_date)}{' '}
                      <span className="font-semibold ml-2">Status:</span> {batch.status}
                    </p>
                  </div>
                )}

                {/* Related Invoices */}
                <div className="px-4 sm:px-6 py-4">
                  <h3 className="text-md font-semibold mb-3">Related Invoices</h3>
                  {relatedInvoices.length === 0 ? (
                    <p className="text-sm text-gray-500">No invoices linked to this shipping detail</p>
                  ) : (
                    <>
                      {/* Mobile: stacked cards */}
                      <div className="sm:hidden space-y-3">
                        {relatedInvoices.map((inv) => (
                          <div key={inv.id} className="border rounded-lg p-3">
                            <div className="flex justify-between items-start mb-2">
                              <p className="font-mono text-sm">{inv.invoice_number}</p>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                inv.invoice_type === 'shipping'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-purple-100 text-purple-800'
                              }`}>
                                {inv.invoice_type}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <p className="text-xs text-gray-500">Issue Date</p>
                                <p>{formatDate(inv.issue_date)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Amount</p>
                                <p className="font-medium">${inv.total_amount}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Status</p>
                                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${invoiceStatusClass(inv.status)}`}>
                                  {invoiceStatusLabel(inv.status)}
                                </span>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Customer Visible</p>
                                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                                  inv.is_visible_to_customer
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {inv.is_visible_to_customer ? 'Yes' : 'No'}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Desktop: table */}
                      <div className="hidden sm:block overflow-x-auto">
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
                            {relatedInvoices.map((inv) => (
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
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${invoiceStatusClass(inv.status)}`}>
                                    {invoiceStatusLabel(inv.status)}
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
                      </div>
                    </>
                  )}
                </div>

                {/* Files */}
                <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    {sd.excel_file_url && (
                      <button
                        onClick={() => downloadFile(
                          `/downloads/shipping-details/${sd.id}/excel`,
                          `shipping_details_${sd.id.substring(0, 8)}.xlsx`
                        )}
                        className="text-green-600 hover:text-green-900 flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download Excel
                      </button>
                    )}
                    {sd.pdf_file_url && (
                      <button
                        onClick={() => downloadFile(
                          `/downloads/shipping-details/${sd.id}/pdf`,
                          `shipping_details_${sd.id.substring(0, 8)}.pdf`
                        )}
                        className="text-red-600 hover:text-red-900 flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white rounded-lg shadow px-4 py-3">
              <p className="text-sm text-gray-600">
                Page {page + 1} of {totalPages} · {totalCount} shipping details
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 0 || loadingCustomer}
                  className="px-4 py-2 rounded bg-gray-200 text-gray-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => goToPage(page + 1)}
                  disabled={page + 1 >= totalPages || loadingCustomer}
                  className="px-4 py-2 rounded bg-green-600 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OwnerShippingDetails;