import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import MainLayout from '../layouts/MainLayout';

const CustomerInventoryDetail = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  
  const [customer, setCustomer] = useState(null);
  const [products, setProducts] = useState([]);
  const [warehouseNames, setWarehouseNames] = useState([]);
  const [assignedWarehouses, setAssignedWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [editValues, setEditValues] = useState({});
  const [batchNumbers, setBatchNumbers] = useState({});
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    product_name: '',
    sku: '',
    batch_number: ''
  });

  useEffect(() => {
    fetchInventory();
    fetchCustomerWarehouses();
  }, [customerId]);

  // This fetches the customer's assigned warehouses
  const fetchCustomerWarehouses = async () => {
    try {
      // Get customer details which include warehouse_ids
      const customerRes = await axiosInstance.get(`/customers/${customerId}`);
      const warehouseIds = customerRes.data.warehouse_ids || [];
      
      // Get all warehouses and filter to only assigned ones
      const warehousesRes = await axiosInstance.get('/warehouses/');
      const allWarehouses = warehousesRes.data;
      const filtered = allWarehouses.filter(w => warehouseIds.includes(w.id));
      
      setAssignedWarehouses(filtered);
      setWarehouseNames(filtered.map(w => w.name));
      
    } catch (error) {
      console.error('Failed to fetch customer warehouses:', error);
    }
  };

  const fetchInventory = async () => {
    try {
      const response = await axiosInstance.get(`/inventory/customer/${customerId}`);
      setCustomer({
        name: response.data.customer_name,
        code: response.data.customer_code,
        id: response.data.customer_id
      });
      
      const productsData = response.data.products;
      setProducts(productsData);
      
      // Initialize edit values for both received and shipped
      const initialEditValues = {};
      const initialBatchNumbers = {};
      
      productsData.forEach(product => {
        initialBatchNumbers[product.product_id] = product.batch_number || '';
        
        Object.entries(product.warehouses).forEach(([warehouse, unitsData]) => {
          const receivedKey = `${product.product_id}-${warehouse}-received`;
          const shippedKey = `${product.product_id}-${warehouse}-shipped`;
          initialEditValues[receivedKey] = unitsData.received || 0;
          initialEditValues[shippedKey] = unitsData.shipped || 0;
        });
      });
      
      setEditValues(initialEditValues);
      setBatchNumbers(initialBatchNumbers);
      
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
      setMessage({ type: 'error', text: 'Failed to load inventory' });
    } finally {
      setLoading(false);
    }
  };

  const handleReceivedChange = (productId, warehouseName, value) => {
    const key = `${productId}-${warehouseName}-received`;
    setEditValues(prev => ({
      ...prev,
      [key]: parseInt(value) || 0
    }));
  };

  const handleShippedChange = (productId, warehouseName, value) => {
    const key = `${productId}-${warehouseName}-shipped`;
    setEditValues(prev => ({
      ...prev,
      [key]: parseInt(value) || 0
    }));
  };

  const handleBatchChange = (productId, value) => {
    setBatchNumbers(prev => ({
      ...prev,
      [productId]: value
    }));
  };

 const handleSaveAll = async (productId) => {
    console.log('Saving all for product:', productId);
    console.log('Current editValues:', editValues);
    console.log('Assigned warehouses:', assignedWarehouses);
    setSaving(true);
    
    try {
      // Save batch number
      const batchNumber = batchNumbers[productId];
      if (batchNumber !== undefined) {
        await axiosInstance.put(`/products/${productId}`, {
          batch_number: batchNumber
        });
      }
      
      // Save each warehouse one by one with both received and shipped values
      for (const warehouse of assignedWarehouses) {
        const receivedKey = `${productId}-${warehouse.name}-received`;
        const shippedKey = `${productId}-${warehouse.name}-shipped`;
        
        const receivedUnits = editValues[receivedKey] || 0;
        const shippedUnits = editValues[shippedKey] || 0;
        
        await axiosInstance.put(`/inventory/product/${productId}/warehouse/${warehouse.id}`, {
          units_received: receivedUnits,
          units_shipped: shippedUnits
        });
      }
      
      setMessage({ type: 'success', text: 'All warehouses updated successfully' });
      
      // Refresh data from server
      await fetchInventory();
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      
    } catch (error) {
      console.error('Failed to update all warehouses:', error);
      setMessage({ type: 'error', text: error.response?.data?.detail || 'Failed to update inventory' });
    } finally {
      setSaving(false);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.product_name || !newProduct.sku) {
      setMessage({ type: 'error', text: 'Product name and SKU are required' });
      return;
    }

    setSaving(true);
    try {
      // First create the product with batch number
      const productRes = await axiosInstance.post('/products/', {
        product_name: newProduct.product_name,
        sku: newProduct.sku,
        batch_number: newProduct.batch_number || null,
        customer_id: customerId,
        is_active: true
      });
      
      const productId = productRes.data.id;
      
      // Then create inventory records for each assigned warehouse with initial units
      for (const warehouse of assignedWarehouses) {
        await axiosInstance.put(`/inventory/product/${productId}/warehouse/${warehouse.id}`, {
          units_received: 0,
          units_shipped: 0
        });
      }
      
      setMessage({ type: 'success', text: 'Product added successfully' });
      setShowAddProductModal(false);
      setNewProduct({ product_name: '', sku: '', batch_number: '' });
      
      // Refresh inventory
      await fetchInventory();
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      
    } catch (error) {
      console.error('Failed to add product:', error);
      setMessage({ type: 'error', text: error.response?.data?.detail || 'Failed to add product' });
    } finally {
      setSaving(false);
    }
  };

  const calculateLeft = (received, shipped) => {
    return (received || 0) - (shipped || 0);
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
        <div className="mb-6">
          <button
            onClick={() => navigate('/inventory')}
            className="text-green-600 hover:text-green-800 mb-4 inline-block"
          >
            ← Back to Customers
          </button>
          
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">
              Inventory for {customer?.name} ({customer?.code})
            </h1>
            <button
              onClick={() => setShowAddProductModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              + Add Product
            </button>
          </div>
          
          {/* Show assigned warehouses */}
          <div className="mt-2 text-sm text-gray-600">
            <span className="font-medium">Assigned Warehouses:</span>{' '}
            {assignedWarehouses.map(w => w.name).join(', ')}
          </div>
        </div>

        {message.text && (
          <div className={`mb-4 p-4 rounded ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Batch</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                {warehouseNames.map(warehouse => (
                  <th key={warehouse} colSpan="3" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase border-l border-r">
                    {warehouse}
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
              <tr className="bg-gray-100">
                <th colSpan="3"></th>
                {warehouseNames.map(warehouse => (
                  <>
                    <th key={`${warehouse}-received`} className="px-2 py-2 text-center text-xs font-medium text-gray-600">Received</th>
                    <th key={`${warehouse}-shipped`} className="px-2 py-2 text-center text-xs font-medium text-gray-600">Shipped</th>
                    <th key={`${warehouse}-left`} className="px-2 py-2 text-center text-xs font-medium text-gray-600 border-r">Left</th>
                  </>
                ))}
                <th></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.product_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{product.product_name}</td>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      value={batchNumbers[product.product_id] || ''}
                      onChange={(e) => handleBatchChange(product.product_id, e.target.value)}
                      className="w-24 px-2 py-1 border border-gray-300 rounded-md"
                      placeholder="Batch"
                      disabled={saving}
                    />
                  </td>
                  <td className="px-6 py-4">{product.sku}</td>
                  
                  {warehouseNames.map(warehouse => {
                    const receivedKey = `${product.product_id}-${warehouse}-received`;
                    const shippedKey = `${product.product_id}-${warehouse}-shipped`;
                    const received = editValues[receivedKey] || 0;
                    const shipped = editValues[shippedKey] || 0;
                    const left = calculateLeft(received, shipped);
                    
                    return (
                      <>
                        <td key={receivedKey} className="px-2 py-4">
                          <input
                            type="number"
                            min="0"
                            value={received}
                            onChange={(e) => handleReceivedChange(product.product_id, warehouse, e.target.value)}
                            className="w-20 px-2 py-1 border border-gray-300 rounded-md text-center"
                            disabled={saving}
                          />
                        </td>
                        <td key={shippedKey} className="px-2 py-4">
                          <input
                            type="number"
                            min="0"
                            value={shipped}
                            onChange={(e) => handleShippedChange(product.product_id, warehouse, e.target.value)}
                            className="w-20 px-2 py-1 border border-gray-300 rounded-md text-center"
                            disabled={saving}
                          />
                        </td>
                        <td key={`${product.product_id}-${warehouse}-left`} className="px-2 py-4 text-center font-medium border-r">
                          {left}
                        </td>
                      </>
                    );
                  })}
                  
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleSaveAll(product.product_id)}
                      disabled={saving}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:bg-gray-400"
                    >
                      {saving ? 'Saving...' : 'Save All'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {products.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center mt-4">
            <p className="text-gray-500">No products found for this customer.</p>
            <button
              onClick={() => setShowAddProductModal(true)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Your First Product
            </button>
          </div>
        )}

        {/* Add Product Modal */}
        {showAddProductModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <h3 className="text-lg font-bold mb-4">Add New Product</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={newProduct.product_name}
                  onChange={(e) => setNewProduct({...newProduct, product_name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g., iPhone Case"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU *
                </label>
                <input
                  type="text"
                  value={newProduct.sku}
                  onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g., IP-CASE-001"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Initial Batch Number
                </label>
                <input
                  type="text"
                  value={newProduct.batch_number}
                  onChange={(e) => setNewProduct({...newProduct, batch_number: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g., BATCH001"
                />
              </div>

              <div className="mb-4 p-3 bg-blue-50 rounded">
                <p className="text-sm text-blue-700">
                  <span className="font-medium">Assigned Warehouses:</span><br />
                  {assignedWarehouses.map(w => w.name).join(', ')}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Initial units will be set to 0 for all warehouses.
                </p>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddProduct}
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {saving ? 'Adding...' : 'Add Product'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    
  );
};

export default CustomerInventoryDetail;