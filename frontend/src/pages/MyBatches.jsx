import { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import MainLayout from '../layouts/MainLayout';
import BackButton from '../components/BackButton';

const MyBatches = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedBatch, setExpandedBatch] = useState(null);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
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

  const toggleExpand = async (batchId) => {
    if (expandedBatch === batchId) {
      setExpandedBatch(null);
    } else {
      try {
        const response = await axiosInstance.get(`/batches/${batchId}`);
        setBatches(batches.map(b => 
          b.id === batchId ? response.data : b
        ));
        setExpandedBatch(batchId);
      } catch (error) {
        console.error('Failed to fetch batch details:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <MainLayout>
      <BackButton />
      <h1 className="text-3xl font-bold mb-8">My Batches</h1>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : batches.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">No batches uploaded yet.</p>
          <button 
            onClick={() => window.location.href = '/employee/upload'}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Upload Your First Batch
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {batches.map((batch) => (
            <div key={batch.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div 
                className="p-4 cursor-pointer hover:bg-gray-50 flex justify-between items-center"
                onClick={() => toggleExpand(batch.id)}
              >
                <div>
                  <div className="font-medium">Batch ID: {batch.id.substring(0,8)}...</div>
                  <div className="text-sm text-gray-500">
                    Uploaded: {formatDate(batch.upload_date)}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(batch.status)}`}>
                    {batch.status}
                  </span>
                  <span className="text-gray-500">
                    {expandedBatch === batch.id ? '▼' : '▶'}
                  </span>
                </div>
              </div>

              {expandedBatch === batch.id && batch.rows && (
                <div className="border-t border-gray-200 p-4">
                  <h3 className="font-medium mb-3">Batch Details</h3>
                  <div className="mb-4">
                    <p><span className="text-gray-600">Notes:</span> {batch.notes || 'No notes'}</p>
                    <p><span className="text-gray-600">Total Rows:</span> {batch.rows.length}</p>
                    <p><span className="text-gray-600">Total Label Cost:</span> $
                      {batch.rows.reduce((sum, row) => sum + parseFloat(row.label_cost), 0).toFixed(2)}
                    </p>
                  </div>

                  <h4 className="font-medium mb-2">Rows</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Tracking</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Cost</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Customer</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Order #</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {batch.rows.map((row) => (
                          <tr key={row.id}>
                            <td className="px-4 py-2">{row.tracking_number}</td>
                            <td className="px-4 py-2">${parseFloat(row.label_cost).toFixed(2)}</td>
                            <td className="px-4 py-2">{row.end_customer_name}</td>
                            <td className="px-4 py-2">{row.order_number}</td>
                            <td className="px-4 py-2">{formatDate(row.date)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </MainLayout>
  );
};

export default MyBatches;