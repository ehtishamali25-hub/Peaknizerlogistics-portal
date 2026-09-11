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
      setInventory(response.data);
      
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
      <div className="text-center py-8">Loading...</div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <BackButton />
      
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">My Inventory</h1>

      {inventory.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">No inventory items found.</p>
        </div>
      ) : (
        <>
          {/* Mobile: stacked cards */}
          <div className="md:hidden space-y-3">
            {inventory.map((item) => (
              <div key={item.product_id} className="bg-white rounded-lg shadow p-4">
                <p className="font-medium">{item.product_name}</p>
                <div className="flex gap-4 text-sm text-gray-600 mt-1 mb-3">
                  <span>SKU: {item.sku}</span>
                  <span>Batch: {item.batch_number || '-'}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm pt-2 border-t">
                  {warehouseNames.map(warehouse => (
                    <div key={warehouse}>
                      <p className="text-xs text-gray-500">{warehouse}</p>
                      <p className="font-medium">{item.warehouses[warehouse]}</p>
                    </div>
                  ))}
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
          </div>
        </>
      )}
    </div>
  );
};

export default CustomerInventory;