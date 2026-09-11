import { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import MainLayout from '../layouts/MainLayout';
import BackButton from '../components/BackButton';

const OwnerBatches = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [approveData, setApproveData] = useState({
    issue_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/batches/');
      setBatches(response.data);
    } catch (error) {
      console.error('Failed to fetch batches:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleApproveClick = (batch) => {
    setSelectedBatch(batch);
    setShowApproveModal(true);
  };

  const handleApprove = async () => {
    try {
      const response = await axiosInstance.post(`/batches/${selectedBatch.id}/approve`, approveData);
      setShowApproveModal(false);
      fetchBatches();
    } catch (error) {
      console.error('Approval failed:', error);
      alert('Approval failed: ' + (error.response?.data?.detail || error.message));
    }
  };

  const formatBatchId = (batch) => {
    const date = new Date(batch.upload_date);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const customerCode = batch.customer_code || batch.customer_id?.substring(0, 4) || 'XXXX';
    const shortId = batch.id.substring(0, 4);
    
    return `${day}-${month}-${customerCode}-${shortId}`;
  };

  return (
    <div className="max-w-7xl mx-auto">
      <BackButton />
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">All Batches</h1>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : batches.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">No batches uploaded yet.</p>
        </div>
      ) : (
        <>
          {/* Mobile: stacked cards */}
          <div className="md:hidden space-y-3">
            {batches.map((batch) => (
              <div key={batch.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-mono text-sm font-medium">{formatBatchId(batch)}</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(batch.status)}`}>
                    {batch.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Customer</p>
                    <p>{batch.customer_code || batch.customer_id?.substring(0, 8)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Date</p>
                    <p>{formatDate(batch.upload_date)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Employee</p>
                    <p>{batch.uploader_name || batch.uploaded_by?.substring(0, 8)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Rows</p>
                    <button
                      onClick={() => window.location.href = `/owner/batches/${batch.id}`}
                      className="text-blue-600 font-medium"
                    >
                      {batch.rows?.length || '0'} rows
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t">
                  {batch.status === 'pending' && (
                    <button
                      onClick={() => handleApproveClick(batch)}
                      className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700"
                    >
                      Approve
                    </button>
                  )}
                  <button
                    onClick={() => window.location.href = `/owner/batches/${batch.id}`}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
                  >
                    View
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Batch ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rows</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {batches.map((batch) => (
                    <tr key={batch.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-mono text-sm">
                        {formatBatchId(batch)}
                      </td>
                      <td className="px-6 py-4">
                        {batch.customer_code || batch.customer_id?.substring(0, 8)}
                      </td>
                      <td className="px-6 py-4">
                        {batch.uploader_name || batch.uploaded_by?.substring(0, 8)}
                      </td>
                      <td className="px-6 py-4">
                        {formatDate(batch.upload_date)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => window.location.href = `/owner/batches/${batch.id}`}
                          className="text-blue-600 hover:text-blue-900 font-medium"
                        >
                          {batch.rows?.length || '0'} rows
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(batch.status)}`}>
                          {batch.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 space-x-2">
                        {batch.status === 'pending' && (
                          <button
                            onClick={() => handleApproveClick(batch)}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                          >
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() => window.location.href = `/owner/batches/${batch.id}`}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                        >
                          View
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

      {/* Approve Modal */}
      {showApproveModal && selectedBatch && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-start sm:items-center justify-center p-4 z-50">
          <div className="w-full max-w-sm sm:max-w-md p-5 border shadow-lg rounded-md bg-white my-8 sm:my-0 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">Approve Batch</h3>
            <p className="mb-4 text-sm text-gray-600 break-words">
              Batch: {formatBatchId(selectedBatch)}
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issue Date
              </label>
              <input
                type="date"
                value={approveData.issue_date}
                onChange={(e) => setApproveData({...approveData, issue_date: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                value={approveData.due_date}
                onChange={(e) => setApproveData({...approveData, due_date: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowApproveModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerBatches;