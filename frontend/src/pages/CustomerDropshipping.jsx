import { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import BackButton from '../components/BackButton';

const MAX_EXCEL_MB = 10;
const MAX_LABELS_MB = 25;

const SHIPPING_STATUS = {
  unshipped: { label: 'Unshipped', color: 'bg-gray-100 text-gray-800' },
  partially_shipped: { label: 'Partially Shipped', color: 'bg-yellow-100 text-yellow-800' },
  shipped: { label: 'Shipped', color: 'bg-green-100 text-green-800' },
};

const ARRIVAL_STATUS = {
  not_received: { label: 'Not Received', color: 'bg-gray-100 text-gray-800' },
  partially_received: { label: 'Partially Received', color: 'bg-yellow-100 text-yellow-800' },
  fully_received: { label: 'Fully Received', color: 'bg-green-100 text-green-800' },
};

const todayInputValue = () => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
};

// "2026-10-10" -> local date, without the timezone shift new Date("2026-10-10") causes
const formatEntryDate = (value) => {
  if (!value) return '-';
  const [y, m, d] = String(value).split('-').map(Number);
  if (!y || !m || !d) return value;
  return new Date(y, m - 1, d).toLocaleDateString();
};

const StatusBadge = ({ map, value }) => {
  const item = map[value] || { label: value || '-', color: 'bg-gray-100 text-gray-800' };
  return (
    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${item.color}`}>
      {item.label}
    </span>
  );
};

const CustomerDropshipping = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notEnabled, setNotEnabled] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [showForm, setShowForm] = useState(false);
  const [entryDate, setEntryDate] = useState(todayInputValue());
  const [excelFile, setExcelFile] = useState(null);
  const [labelsFile, setLabelsFile] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    fetchEntries();
  }, []);

  const showMessage = (type, text, clearAfterMs) => {
    setMessage({ type, text });
    if (clearAfterMs) {
      setTimeout(() => setMessage({ type: '', text: '' }), clearAfterMs);
    }
  };

  const fetchEntries = async () => {
    try {
      const response = await axiosInstance.get('/dropshipping/my-entries');
      setEntries(response.data);
      setNotEnabled(false);
    } catch (error) {
      if (error.response?.status === 403) {
        setNotEnabled(true);
      } else {
        console.error('Failed to fetch dropshipping entries:', error);
        showMessage('error', 'Failed to load your entries. Please refresh the page.');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEntryDate(todayInputValue());
    setExcelFile(null);
    setLabelsFile(null);
    setFileInputKey((k) => k + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!entryDate) {
      showMessage('error', 'Please choose a date');
      return;
    }
    if (!excelFile) {
      showMessage('error', 'Please select the inventory details Excel file');
      return;
    }
    const excelName = excelFile.name.toLowerCase();
    if (!excelName.endsWith('.xlsx') && !excelName.endsWith('.xls')) {
      showMessage('error', 'Inventory details must be an Excel file (.xlsx or .xls)');
      return;
    }
    if (excelFile.size > MAX_EXCEL_MB * 1024 * 1024) {
      showMessage('error', `Excel file is too large (maximum ${MAX_EXCEL_MB} MB)`);
      return;
    }
    if (!labelsFile) {
      showMessage('error', 'Please select the labels PDF file');
      return;
    }
    if (!labelsFile.name.toLowerCase().endsWith('.pdf')) {
      showMessage('error', 'Labels must be a PDF file');
      return;
    }
    if (labelsFile.size > MAX_LABELS_MB * 1024 * 1024) {
      showMessage('error', `Labels file is too large (maximum ${MAX_LABELS_MB} MB)`);
      return;
    }

    const formData = new FormData();
    formData.append('entry_date', entryDate);
    formData.append('excel_file', excelFile);
    formData.append('labels_file', labelsFile);

    setSubmitting(true);
    try {
      await axiosInstance.post('/dropshipping/entries', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      showMessage('success', 'Inventory entry added successfully', 4000);
      resetForm();
      setShowForm(false);
      await fetchEntries();
    } catch (error) {
      const detail = error.response?.data?.detail;
      showMessage(
        'error',
        typeof detail === 'string' ? detail : 'Upload failed. Please check the date and files and try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const downloadEntryFile = async (entry, kind) => {
    const key = `${entry.id}-${kind}`;
    setDownloading(key);
    try {
      const response = await axiosInstance.get(
        `/dropshipping/my-entries/${entry.id}/${kind}`,
        { responseType: 'blob' }
      );
      const filename = kind === 'excel' ? entry.excel_original_name : entry.labels_original_name;
      const downloadUrl = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download error:', error);
      showMessage('error', 'Failed to download file. Please try again.', 4000);
    } finally {
      setDownloading(null);
    }
  };

  const renderFileLink = (entry, kind) => {
    const name = kind === 'excel' ? entry.excel_original_name : entry.labels_original_name;
    const busy = downloading === `${entry.id}-${kind}`;
    return (
      <div className="min-w-0">
        <p className="text-sm text-gray-700 break-all">{name}</p>
        <button
          onClick={() => downloadEntryFile(entry, kind)}
          disabled={busy}
          className="text-blue-600 hover:text-blue-900 text-sm font-medium disabled:opacity-50"
        >
          {busy ? 'Downloading...' : 'Download'}
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-8">Loading...</div>
    );
  }

  if (notEnabled) {
    return (
      <div className="max-w-7xl mx-auto">
        <BackButton />
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h1 className="text-2xl font-bold mb-2">Dropshipping Inventory</h1>
          <p className="text-gray-500">
            Dropshipping is not enabled for your account. Please contact us if you would like to use it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <BackButton />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Dropshipping Inventory</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto"
          >
            + Add Entry
          </button>
        )}
      </div>

      {message.text && (
        <div className={`mb-4 p-4 rounded ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-lg font-semibold mb-4">New Inventory Entry</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Inventory Details (Excel)
              </label>
              <input
                key={`excel-${fileInputKey}`}
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => setExcelFile(e.target.files[0] || null)}
                required
                className="w-full text-sm border border-gray-300 rounded px-3 py-2 bg-white"
              />
              <p className="text-xs text-gray-500 mt-1">.xlsx or .xls, up to {MAX_EXCEL_MB} MB</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Labels (PDF)</label>
              <input
                key={`labels-${fileInputKey}`}
                type="file"
                accept=".pdf,application/pdf"
                onChange={(e) => setLabelsFile(e.target.files[0] || null)}
                required
                className="w-full text-sm border border-gray-300 rounded px-3 py-2 bg-white"
              />
              <p className="text-xs text-gray-500 mt-1">PDF, up to {MAX_LABELS_MB} MB</p>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => {
                resetForm();
                setShowForm(false);
                setMessage({ type: '', text: '' });
              }}
              disabled={submitting}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Uploading...' : 'Submit Entry'}
            </button>
          </div>
        </form>
      )}

      {entries.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">No inventory entries yet.</p>
          <p className="text-sm text-gray-400 mt-2">
            Click "+ Add Entry" to upload your inventory details and labels.
          </p>
        </div>
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
                  {renderFileLink(entry, 'excel')}
                </div>

                <div>
                  <p className="text-xs uppercase text-gray-500 mb-1">Labels</p>
                  {renderFileLink(entry, 'labels')}
                </div>

                <div className="flex flex-wrap gap-4">
                  <div>
                    <p className="text-xs uppercase text-gray-500 mb-1">Status</p>
                    <StatusBadge map={SHIPPING_STATUS} value={entry.shipping_status} />
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-500 mb-1">Arrival at Warehouse</p>
                    <StatusBadge map={ARRIVAL_STATUS} value={entry.arrival_status} />
                  </div>
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {entries.map((entry) => (
                  <tr key={entry.id} className="align-top">
                    <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">{entry.entry_code}</td>
                    <td className="px-4 py-4 text-sm whitespace-nowrap">{formatEntryDate(entry.entry_date)}</td>
                    <td className="px-4 py-4 max-w-xs">{renderFileLink(entry, 'excel')}</td>
                    <td className="px-4 py-4 max-w-xs">{renderFileLink(entry, 'labels')}</td>
                    <td className="px-4 py-4"><StatusBadge map={SHIPPING_STATUS} value={entry.shipping_status} /></td>
                    <td className="px-4 py-4"><StatusBadge map={ARRIVAL_STATUS} value={entry.arrival_status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default CustomerDropshipping;