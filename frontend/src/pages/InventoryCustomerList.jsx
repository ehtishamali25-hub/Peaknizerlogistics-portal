import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../context/AuthContext';
import BackButton from '../components/BackButton';

const InventoryCustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axiosInstance.get('/inventory/customers');
      setCustomers(response.data);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    
      <div className="max-w-7xl mx-auto">
        <BackButton />
        <h1 className="text-3xl font-bold mb-8">Inventory Management</h1>
        
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : customers.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No customers available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customers.map((customer) => (
              <div
                key={customer.id}
                onClick={() => navigate(`/inventory/customer/${customer.id}`)}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg cursor-pointer transition-shadow border-2 border-transparent hover:border-green-500"
              >
                <h2 className="text-xl font-bold mb-2">{customer.name}</h2>
                <p className="text-gray-600">Code: {customer.code}</p>
                <p className="text-sm text-gray-500 mt-2">Click to manage inventory</p>
              </div>
            ))}
          </div>
        )}
      </div>
    
  );
};

export default InventoryCustomerList;