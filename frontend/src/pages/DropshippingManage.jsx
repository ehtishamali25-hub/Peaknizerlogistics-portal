import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { useAuth } from '../context/AuthContext';

const SHIPPING_OPTIONS = [
  { value: 'unshipped', label: 'Unshipped' },
  { value: 'partially_shipped', label: 'Partially Shipped' },
  { value: 'shipped', label: 'Shipped' },
];

const ARRIVAL_OPTIONS = [
  { value: 'not_received', label: 'Not Received' },
  { value: 'partially_received', label: 'Partially Received' },
  { value: 'fully_received', label: 'Fully Received' },
];

// "2026-10-10" -> local date, without the timezone shift new Date("2026-10-10") causes
const formatEntryDate = (value) => {
  if (!value) return '-';
  const [y, m, d] = String(value).split('-').map(Number);
  if (!y || !m || !d) return value;
  return new Date(y, m - 1, d).toLocaleDateString();
};

// "2026-11-02T12:00:00+00:00" -> "2026-11-02" (the same day the server uses for the invoice dates)
const uploadDay = (createdAt) => (createdAt ? String(createdAt).slice(0, 10) : '');

const MAX_QUANTITY = 1000000;

// Whole number from 1 to 1,000,000, otherwise null
const parseQuantity = (raw) => {
  const text = String(raw ?? '').trim();
  if (!/^\d+$/.test(text)) return null;
  const n = Number(text);
  return n >= 1 && n <= MAX_QUANTITY ? n : null;
};

// null when the rate is unknown (the server then works it out)
const toRateCents = (rate) => {
  if (rate === null || rate === undefined || rate === '') return null;
  const n = Number(rate);
  return Number.isFinite(n) ? Math.round(n * 100) : null;
};

const formatMoney = (cents) =>
  `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatCell = (value) => {
  if (value === true) return 'TRUE';
  if (value === false) return 'FALSE';
  if (value === null || value === undefined) return '';
  return String(value);
};

const DropshippingManage = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isOwner = user?.role === 'owner';

  const [customer, setCustomer] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notDropshipping, setNotDropshipping] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '', linkTo: '' });
  const [savingKey, setSavingKey] = useState(null);
  const [busyFile, setBusyFile] = useState(null);
  const [preview, setPreview] = useState(null); // { entry, loading, error, data }
  const [approving, setApproving] = useState(null); // { entry, quantity, error, submitting }
  const submittingRef = useRef(false);
  const messageTimer = useRef(null);

  useEffect(() => {
    loadPage();
  }, [customerId]);

  useEffect(() => () => clearTimeout(messageTimer.current), []);

  // Close the open popup with the Escape key (the approve dialog stays open while it is saving)
  useEffect(() => {
    if (!preview && !approving) return undefined;
    const onKeyDown = (e) => {
      if (e.key !== 'Escape') return;
      if (approving) {
        if (!submittingRef.current) setApproving(null);
      } else {
        setPreview(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [preview, approving]);

  // A new message replaces the old one, and the old one's timer must not clear the new one
  const showMessage = (type, text, clearAfterMs, linkTo) => {
    clearTimeout(messageTimer.current);
    setMessage({ type, text, linkTo });
    if (clearAfterMs) {
      messageTimer.current = setTimeout(() => setMessage({ type: '', text: '' }), clearAfterMs);
    }
  };

  const loadPage = async () => {
    setLoading(true);
    try {
      const customerRes = await axiosInstance.get(`/customers/${customerId}`);
      setCustomer({
        name: customerRes.data.customer_name,
        code: customerRes.data.customer_code,
        prepRateCents: toRateCents(customerRes.data.prep_rate),
      });

      if (customerRes.data.business_model !== 'dropshipping') {
        setNotDropshipping(true);
        return;
      }

      const entriesRes = await axiosInstance.get(`/dropshipping-manage/customers/${customerId}/entries`);
      setEntries(entriesRes.data);
      setNotDropshipping(false);
    } catch (error) {
      if (error.response?.status === 400) {
        setNotDropshipping(true);
      } else if (error.response?.status === 404) {
        showMessage('error', 'Customer not found, or not assigned to you.');
      } else {
        console.error('Failed to load dropshipping entries:', error);
        showMessage('error', 'Failed to load Dropshipping entries. Please refresh the page.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Saves one field at a time so two people editing different fields never overwrite each other
  const updateStatus = async (entry, field, value) => {
    if (entry[field] === value) return;

    const previous = entry[field];
    const key = `${entry.id}-${field}`;
    setSavingKey(key);
    setEntries((list) => list.map((e) => (e.id === entry.id ? { ...e, [field]: value } : e)));

    try {
      const response = await axiosInstance.patch(
        `/dropshipping-manage/entries/${entry.id}/status`,
        { [field]: value }
      );
      setEntries((list) => list.map((e) => (e.id === entry.id ? response.data : e)));
      showMessage('success', `${entry.entry_code} updated`, 2000);
    } catch (error) {
      setEntries((list) => list.map((e) => (e.id === entry.id ? { ...e, [field]: previous } : e)));
      const detail = error.response?.data?.detail;
      showMessage('error', typeof detail === 'string' ? detail : 'Failed to update. Please try again.', 4000);
    } finally {
      setSavingKey(null);
    }
  };

  const saveBlob = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const downloadEntryFile = async (entry, kind) => {
    const key = `${entry.id}-${kind}-download`;
    setBusyFile(key);
    try {
      const response = await axiosInstance.get(
        `/dropshipping-manage/entries/${entry.id}/${kind}`,
        { responseType: 'blob' }
      );
      const filename = kind === 'excel' ? entry.excel_original_name : entry.labels_original_name;
      saveBlob(response.data, filename);
    } catch (error) {
      console.error('Download error:', error);
      showMessage('error', 'Failed to download file. Please try again.', 4000);
    } finally {
      setBusyFile(null);
    }
  };

  // The new tab is opened straight away (while the click is still "fresh") so pop-up blockers allow it
  const openLabels = async (entry) => {
    const tab = window.open('', '_blank');
    if (!tab) {
      showMessage('error', 'Your browser blocked the new tab. Please allow pop-ups for this site and try again.', 5000);
      return;
    }

    const key = `${entry.id}-labels-view`;
    setBusyFile(key);
    try {
      tab.document.write('<p style="font-family:sans-serif;padding:16px">Loading labels...</p>');
      const response = await axiosInstance.get(
        `/dropshipping-manage/entries/${entry.id}/labels`,
        { responseType: 'blob' }
      );
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      tab.location.href = url;
      setTimeout(() => window.URL.revokeObjectURL(url), 5 * 60 * 1000);
    } catch (error) {
      console.error('Open labels error:', error);
      tab.close();
      showMessage('error', 'Failed to open the labels file. Please try again.', 4000);
    } finally {
      setBusyFile(null);
    }
  };

  const openExcelPreview = async (entry) => {
    setPreview({ entry, loading: true, error: '', data: null });
    try {
      const response = await axiosInstance.get(`/dropshipping-manage/entries/${entry.id}/excel-preview`);
      setPreview((p) => (p && p.entry.id === entry.id ? { ...p, loading: false, data: response.data } : p));
    } catch (error) {
      const detail = error.response?.data?.detail;
      setPreview((p) => (
        p && p.entry.id === entry.id
          ? {
              ...p,
              loading: false,
              error: typeof detail === 'string' ? detail : 'Could not open this Excel file. Please download it instead.',
            }
          : p
      ));
    }
  };

  const openApprove = (entry) => {
    setApproving({ entry, quantity: '', error: '', submitting: false });
  };

  const closeApprove = () => {
    if (!submittingRef.current) setApproving(null);
  };

  const refreshEntries = async () => {
    try {
      const res = await axiosInstance.get(`/dropshipping-manage/customers/${customerId}/entries`);
      setEntries(res.data);
    } catch (error) {
      console.error('Failed to refresh entries:', error);
    }
  };

  const submitApprove = async (event) => {
    event.preventDefault();
    if (!approving || submittingRef.current) return;

    const { entry } = approving;
    const quantity = parseQuantity(approving.quantity);
    if (quantity === null) {
      setApproving((a) => (a ? { ...a, error: `Enter a whole number from 1 to ${MAX_QUANTITY.toLocaleString('en-US')}.` } : a));
      return;
    }

    submittingRef.current = true;
    setApproving((a) => (a ? { ...a, submitting: true, error: '' } : a));

    try {
      const response = await axiosInstance.post(
        `/dropshipping-manage/entries/${entry.id}/approve`,
        { quantity }
      );
      setEntries((list) => list.map((e) => (e.id === entry.id ? response.data : e)));
      submittingRef.current = false;
      setApproving(null);
      const invoiceNumber = response.data.prep_invoice_number;
      showMessage(
        'success',
        `${entry.entry_code} approved.${invoiceNumber ? ` Prep invoice ${invoiceNumber} was created.` : ''} It stays hidden from the customer until you make it visible on the Invoices page.`,
        15000,
        '/owner/invoices'
      );
    } catch (error) {
      submittingRef.current = false;
      const status = error.response?.status;
      const detail = error.response?.data?.detail;

      if (status === 409) {
        // Already approved (for example from another window): show the real state
        setApproving(null);
        await refreshEntries();
        showMessage('error', `${entry.entry_code} was already approved.`, 6000);
        return;
      }

      let text;
      if (!error.response) {
        text = 'Could not reach the server. Please try again.';
      } else if (typeof detail === 'string') {
        text = detail;
      } else if (status === 422) {
        text = `Enter a whole number from 1 to ${MAX_QUANTITY.toLocaleString('en-US')}.`;
      } else {
        text = 'Failed to approve. Please try again.';
      }
      setApproving((a) => (a ? { ...a, submitting: false, error: text } : a));
    }
  };

  const renderSelect = (entry, field, options) => {
    const saving = savingKey === `${entry.id}-${field}`;
    return (
      <select
        value={entry[field]}
        onChange={(e) => updateStatus(entry, field, e.target.value)}
        disabled={saving}
        className="border border-gray-300 rounded px-2 py-1 text-sm bg-white disabled:opacity-50"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    );
  };

  const renderApproval = (entry) => (
    <div>
      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
        entry.approval_status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
      }`}>
        {entry.approval_status === 'approved' ? 'Approved' : 'Pending'}
      </span>
      {isOwner && entry.prep_invoice_number && (
        <p className="text-xs text-gray-500 mt-1">{entry.prep_invoice_number}</p>
      )}
      {isOwner && entry.approval_status !== 'approved' && (
        <button
          onClick={() => openApprove(entry)}
          className="mt-2 block px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 whitespace-nowrap"
        >
          Approve Inventory
        </button>
      )}
    </div>
  );

  const renderExcelCell = (entry) => (
    <div className="min-w-0">
      <p className="text-sm text-gray-700 break-all">{entry.excel_original_name}</p>
      <div className="flex gap-3 mt-1">
        <button
          onClick={() => openExcelPreview(entry)}
          className="text-blue-600 hover:text-blue-900 text-sm font-medium"
        >
          View
        </button>
        <button
          onClick={() => downloadEntryFile(entry, 'excel')}
          disabled={busyFile === `${entry.id}-excel-download`}
          className="text-blue-600 hover:text-blue-900 text-sm font-medium disabled:opacity-50"
        >
          {busyFile === `${entry.id}-excel-download` ? 'Downloading...' : 'Download'}
        </button>
      </div>
    </div>
  );

  const renderLabelsCell = (entry) => (
    <div className="min-w-0">
      <p className="text-sm text-gray-700 break-all">{entry.labels_original_name}</p>
      <div className="flex gap-3 mt-1">
        <button
          onClick={() => openLabels(entry)}
          disabled={busyFile === `${entry.id}-labels-view`}
          className="text-blue-600 hover:text-blue-900 text-sm font-medium disabled:opacity-50"
        >
          {busyFile === `${entry.id}-labels-view` ? 'Opening...' : 'View'}
        </button>
        <button
          onClick={() => downloadEntryFile(entry, 'labels')}
          disabled={busyFile === `${entry.id}-labels-download`}
          className="text-blue-600 hover:text-blue-900 text-sm font-medium disabled:opacity-50"
        >
          {busyFile === `${entry.id}-labels-download` ? 'Downloading...' : 'Download'}
        </button>
      </div>
    </div>
  );

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  const previewData = preview?.data;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate(`/inventory/customer/${customerId}`)}
          className="text-green-600 hover:text-green-800 mb-4 inline-block"
        >
          ← Back to Customer Inventory
        </button>

        <h1 className="text-2xl sm:text-3xl font-bold">
          Dropshipping Inventory{customer ? ` for ${customer.name} (${customer.code})` : ''}
        </h1>
      </div>

      {message.text && (
        <div className={`mb-4 p-4 rounded ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
          {message.linkTo && (
            <button
              onClick={() => navigate(message.linkTo)}
              className="ml-2 underline font-medium"
            >
              Open Invoices
            </button>
          )}
        </div>
      )}

      {notDropshipping ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">This customer is not on the Dropshipping model.</p>
        </div>
      ) : entries.length === 0 ? (
        !message.text && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No Dropshipping inventory entries yet.</p>
          </div>
        )
      ) : (
        <>
          {/* Mobile cards */}
          <div className="md:hidden space-y-4">
            {entries.map((entry) => (
              <div key={entry.id} className="bg-white rounded-lg shadow p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold">{entry.entry_code}</span>
                  <span className="text-sm text-gray-500">{formatEntryDate(entry.entry_date)}</span>
                </div>

                <div>
                  <p className="text-xs uppercase text-gray-500 mb-1">Inventory Details</p>
                  {renderExcelCell(entry)}
                </div>

                <div>
                  <p className="text-xs uppercase text-gray-500 mb-1">Labels</p>
                  {renderLabelsCell(entry)}
                </div>

                <div>
                  <p className="text-xs uppercase text-gray-500 mb-1">Status</p>
                  {renderSelect(entry, 'shipping_status', SHIPPING_OPTIONS)}
                </div>

                <div>
                  <p className="text-xs uppercase text-gray-500 mb-1">Inventory Arrival at Warehouse</p>
                  {renderSelect(entry, 'arrival_status', ARRIVAL_OPTIONS)}
                </div>

                <div>
                  <p className="text-xs uppercase text-gray-500 mb-1">Approval</p>
                  {renderApproval(entry)}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No.</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Inventory Details</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Labels</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Inventory Arrival at Warehouse</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approval</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {entries.map((entry) => (
                  <tr key={entry.id} className="align-top">
                    <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">{entry.entry_code}</td>
                    <td className="px-4 py-4 text-sm whitespace-nowrap">{formatEntryDate(entry.entry_date)}</td>
                    <td className="px-4 py-4 max-w-xs">{renderExcelCell(entry)}</td>
                    <td className="px-4 py-4 max-w-xs">{renderLabelsCell(entry)}</td>
                    <td className="px-4 py-4">{renderSelect(entry, 'shipping_status', SHIPPING_OPTIONS)}</td>
                    <td className="px-4 py-4">{renderSelect(entry, 'arrival_status', ARRIVAL_OPTIONS)}</td>
                    <td className="px-4 py-4">{renderApproval(entry)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Approve dialog */}
      {approving && (() => {
        const { entry, quantity: rawQuantity, error: approveError, submitting } = approving;
        const quantity = parseQuantity(rawQuantity);
        const rateCents = customer?.prepRateCents ?? null;
        const rateIsZero = rateCents !== null && rateCents <= 0;
        const invoiceDay = uploadDay(entry.created_at);
        const typedButInvalid = String(rawQuantity).trim() !== '' && quantity === null;

        return (
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-start justify-center p-3 sm:p-4 overflow-y-auto"
            onClick={closeApprove}
          >
            <form
              role="dialog"
              aria-modal="true"
              aria-labelledby="approve-title"
              onSubmit={submitApprove}
              className="bg-white rounded-lg shadow-xl w-full max-w-md mt-8 sm:mt-16 p-5"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 id="approve-title" className="text-lg font-bold">Approve Inventory</h3>
              <p className="text-sm text-gray-600 mb-4">
                {entry.entry_code}{customer ? ` · ${customer.name} (${customer.code})` : ''}
              </p>

              <dl className="text-sm text-gray-700 mb-4 space-y-1">
                <div className="flex justify-between gap-3">
                  <dt className="text-gray-500">Entry date</dt>
                  <dd>{formatEntryDate(entry.entry_date)}</dd>
                </div>
                {invoiceDay && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-gray-500">Uploaded on</dt>
                    <dd>{formatEntryDate(invoiceDay)}</dd>
                  </div>
                )}
              </dl>

              <label htmlFor="approve-quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Quantity (units to prep)
              </label>
              <input
                id="approve-quantity"
                type="number"
                min="1"
                max={MAX_QUANTITY}
                step="1"
                inputMode="numeric"
                autoFocus
                value={rawQuantity}
                onChange={(e) => {
                  const value = e.target.value;
                  setApproving((a) => (a ? { ...a, quantity: value, error: '' } : a));
                }}
                disabled={submitting}
                placeholder="e.g. 100"
                className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100"
              />
              {typedButInvalid && (
                <p className="text-xs text-red-600 mt-1">
                  Enter a whole number from 1 to {MAX_QUANTITY.toLocaleString('en-US')}.
                </p>
              )}

              <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                {rateIsZero ? (
                  <p className="text-red-600">
                    This customer's prep rate is $0.00. Set a prep rate for the customer first.
                  </p>
                ) : quantity !== null && rateCents !== null ? (
                  <p>
                    Prep invoice: {quantity.toLocaleString('en-US')} × {formatMoney(rateCents)} ={' '}
                    <span className="font-semibold">{formatMoney(quantity * rateCents)}</span>
                  </p>
                ) : quantity !== null ? (
                  <p className="text-gray-500">
                    The invoice amount will be calculated from the customer's prep rate.
                  </p>
                ) : (
                  <p className="text-gray-500">
                    Enter the quantity to see the Prep invoice amount (quantity × the customer's prep rate).
                  </p>
                )}
              </div>

              <ul className="mt-3 text-xs text-gray-600 list-disc pl-4 space-y-1">
                {invoiceDay && (
                  <li>
                    The invoice date and due date are both {formatEntryDate(invoiceDay)}, the day the customer uploaded this entry.
                  </li>
                )}
                <li>The invoice stays hidden from the customer until you make it visible.</li>
              </ul>

              <p className="mt-3 text-sm font-medium text-amber-700">
                An entry can be approved only once. This cannot be undone.
              </p>

              {approveError && (
                <p className="mt-3 p-2 rounded bg-red-100 text-red-700 text-sm">{approveError}</p>
              )}

              <div className="flex justify-end gap-2 mt-5">
                <button
                  type="button"
                  onClick={closeApprove}
                  disabled={submitting}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || quantity === null || rateIsZero}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
                >
                  {submitting ? 'Approving...' : 'Approve & Create Invoice'}
                </button>
              </div>
            </form>
          </div>
        );
      })()}

      {/* Excel popup */}
      {preview && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-start justify-center p-2 sm:p-4 overflow-y-auto"
          onClick={() => setPreview(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-6xl mt-4 sm:mt-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 p-4 border-b">
              <div className="min-w-0">
                <h3 className="text-lg font-bold break-all">
                  {preview.entry.entry_code} — {preview.entry.excel_original_name}
                </h3>
                {previewData?.sheet_name && (
                  <p className="text-sm text-gray-500">Sheet: {previewData.sheet_name}</p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => downloadEntryFile(preview.entry, 'excel')}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                >
                  Download
                </button>
                <button
                  onClick={() => setPreview(null)}
                  className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                  aria-label="Close"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="p-4">
              {preview.loading && <p className="text-center text-gray-500 py-8">Loading...</p>}

              {!preview.loading && preview.error && (
                <p className="text-center text-red-600 py-8">{preview.error}</p>
              )}

              {!preview.loading && previewData && (
                previewData.columns.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">This Excel file is empty.</p>
                ) : (
                  <>
                    <div className="overflow-auto max-h-[65vh] border rounded">
                      <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50 sticky top-0">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-400">#</th>
                            {previewData.columns.map((col, i) => (
                              <th key={i} className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase whitespace-nowrap">
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {previewData.rows.map((row, r) => (
                            <tr key={r} className="hover:bg-gray-50">
                              <td className="px-3 py-2 text-xs text-gray-400">{r + 1}</td>
                              {row.map((cell, c) => (
                                <td key={c} className="px-3 py-2 whitespace-nowrap">{formatCell(cell)}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {previewData.truncated
                        ? `Showing the first ${previewData.rows.length} of ${previewData.total_rows}${previewData.total_rows >= 50000 ? '+' : ''} rows. Download the file to see everything.`
                        : `${previewData.total_rows} ${previewData.total_rows === 1 ? 'row' : 'rows'}`}
                    </p>
                  </>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropshippingManage;
