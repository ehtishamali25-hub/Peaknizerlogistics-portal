import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import MainLayout from '../layouts/MainLayout';
import BackButton from '../components/BackButton';

const CustomerInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [warehouseNames, setWarehouseNames] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await axiosInstance.get('/customer/inventory');
      console.log('Inventory data:', response.data);
      setInventory(response.data);
      
      // Extract unique warehouse names from first product
      if (response.data.length > 0) {
        const warehouses = Object.keys(response.data[0].warehouses);
        setWarehouseNames(warehouses);
      }
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
    } finally {
      setLoading(false);
    }
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
        
        <h1 className="text-3xl font-bold mb-8">My Inventory</h1>

        {inventory.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No inventory items found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Batch</th>
                  {warehouseNames.map(warehouse => (
                    <th key={warehouse} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      {warehouse}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inventory.map((item) => (
                  <tr key={item.product_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{item.product_name}</td>
                    <td className="px-6 py-4">{item.sku}</td>
                    <td className="px-6 py-4">{item.batch_number || '-'}</td>
                    {warehouseNames.map(warehouse => (
                      <td key={warehouse} className="px-6 py-4">
                        {item.warehouses[warehouse]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    
  );
};

export default CustomerInventory;