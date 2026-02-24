import { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import MainLayout from '../layouts/MainLayout';

const OwnerRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [selectedReg, setSelectedReg] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [approveData, setApproveData] = useState({
    customer_code: '',
    prep_rate: 5.5,
    warehouse_ids: []
  });
  const [declineReason, setDeclineReason] = useState('');

  useEffect(() => {
    fetchRegistrations();
    fetchWarehouses();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await axiosInstance.get('/registrations/');
      setRegistrations(response.data);
    } catch (error) {
      console.error('Failed to fetch registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const response = await axiosInstance.get('/warehouses/');
      setWarehouses(response.data);
    } catch (error) {
      console.error('Failed to fetch warehouses:', error);
    }
  };

  const handleApproveClick = (registration) => {
    setSelectedReg(registration);
    setApproveData({
      customer_code: '',
      prep_rate: 5.5,
      warehouse_ids: []
    });
    setShowApproveModal(true);
  };

  const handleDeclineClick = (registration) => {
    setSelectedReg(registration);
    setDeclineReason('');
    setShowDeclineModal(true);
  };

  const handleApprove = async () => {
    if (!approveData.customer_code) {
      alert('Please enter a customer code');
      return;
    }

    try {
      await axiosInstance.post(`/registrations/${selectedReg.id}/approve`, approveData);
      setShowApproveModal(false);
      fetchRegistrations();
    } catch (error) {
      console.error('Approval failed:', error);
      alert(error.response?.data?.detail || 'Failed to approve registration');
    }
  };

  const handleDecline = async () => {
    if (!declineReason) {
      alert('Please provide a reason');
      return;
    }

    try {
      await axiosInstance.post(`/registrations/${selectedReg.id}/decline`, {
        reason: declineReason
      });
      setShowDeclineModal(false);
      fetchRegistrations();
    } catch (error) {
      console.error('Decline failed:', error);
      alert('Failed to decline registration');
    }
  };

  const handleWarehouseToggle = (warehouseId) => {
    setApproveData(prev => ({
      ...prev,
      warehouse_ids: prev.warehouse_ids.includes(warehouseId)
        ? prev.warehouse_ids.filter(id => id !== warehouseId)
        : [...prev.warehouse_ids, warehouseId]
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRegistrations = registrations.filter(reg => 
    filter === 'all' ? true : reg.status === filter
  );

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Registration Requests</h1>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800">
            <strong>Note:</strong> When approving a request, the customer will be created with their 
            chosen password. You only need to provide Customer Code, Prep Rate, and Warehouse assignments.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="mb-6 flex space-x-2">
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded ${
              filter === 'pending' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded ${
              filter === 'approved' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilter('declined')}
            className={`px-4 py-2 rounded ${
              filter === 'declined' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Declined
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${
              filter === 'all' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            All
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : filteredRegistrations.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No registration requests found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRegistrations.map((reg) => (
              <div key={reg.id} className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-semibold">{reg.customer_name}</h2>
                      <p className="text-sm text-gray-600">{reg.email}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(reg.status)}`}>
                        {reg.status}
                      </span>
                      
                      {reg.status === 'pending' && (
                        <div className="space-x-2">
                          <button
                            onClick={() => handleApproveClick(reg)}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleDeclineClick(reg)}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                          >
                            Decline
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{reg.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Company</p>
                      <p className="font-medium">{reg.company_name || '-'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">Company Address</p>
                      <p className="font-medium">{reg.company_address || '-'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">Notes</p>
                      <p className="font-medium">{reg.notes || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Requested On</p>
                      <p className="font-medium">{formatDate(reg.created_at)}</p>
                    </div>
                    {reg.status === 'declined' && reg.rejection_reason && (
                      <div className="col-span-2">
                        <p className="text-sm text-gray-500">Rejection Reason</p>
                        <p className="font-medium text-red-600">{reg.rejection_reason}</p>
                      </div>
                    )}
                    {reg.status === 'approved' && reg.reviewed_at && (
                      <div className="col-span-2">
                        <p className="text-sm text-gray-500">Approved On</p>
                        <p className="font-medium text-green-600">{formatDate(reg.reviewed_at)}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Approve Modal */}
        {showApproveModal && selectedReg && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <h3 className="text-lg font-bold mb-4">Approve Registration</h3>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600">Customer: {selectedReg.customer_name}</p>
                <p className="text-sm text-gray-600">Email: {selectedReg.email}</p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Code *
                </label>
                <input
                  type="text"
                  value={approveData.customer_code}
                  onChange={(e) => setApproveData({...approveData, customer_code: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g., CUST001"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prep Rate ($) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={approveData.prep_rate}
                  onChange={(e) => setApproveData({...approveData, prep_rate: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign Warehouses
                </label>
                <div className="border border-gray-300 rounded-md p-3 max-h-40 overflow-y-auto">
                  {warehouses.map(warehouse => (
                    <label key={warehouse.id} className="flex items-center space-x-2 mb-2">
                      <input
                        type="checkbox"
                        checked={approveData.warehouse_ids.includes(warehouse.id)}
                        onChange={() => handleWarehouseToggle(warehouse.id)}
                        className="rounded"
                      />
                      <span>{warehouse.name} - {warehouse.location}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
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

        {/* Decline Modal */}
        {showDeclineModal && selectedReg && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <h3 className="text-lg font-bold mb-4">Decline Registration</h3>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600">Customer: {selectedReg.customer_name}</p>
                <p className="text-sm text-gray-600">Email: {selectedReg.email}</p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Declining *
                </label>
                <textarea
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows="3"
                  placeholder="Please provide a reason..."
                  required
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowDeclineModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDecline}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default OwnerRegistrations;