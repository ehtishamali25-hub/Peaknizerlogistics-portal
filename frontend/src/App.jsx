import UploadBatch from './pages/UploadBatch';
import MyBatches from './pages/MyBatches';
import CustomersList from './pages/CustomersList';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import OwnerDashboard from './pages/OwnerDashboard';
import OwnerBatches from './pages/OwnerBatches';
import OwnerInvoices from './pages/OwnerInvoices';
import OwnerBatchDetail from './pages/OwnerBatchDetail';
import AddEmployee from './pages/AddEmployee';
import WarehouseManagement from './pages/WarehouseManagement';
import ProductManagement from './pages/ProductManagement';
import InventoryCustomerList from './pages/InventoryCustomerList';
import CustomerInventoryDetail from './pages/CustomerInventoryDetail';
import CustomerDashboard from './pages/CustomerDashboard';
import CustomerInventory from './pages/CustomerInventory';
import CustomerShippingInvoices from './pages/CustomerShippingInvoices';
import OwnerShippingDetails from './pages/OwnerShippingDetails';
import CustomerPrepInvoices from './pages/CustomerPrepInvoices';
import CustomerProofs from './pages/CustomerProofs';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import AboutPage from './pages/AboutPage';
import PricingPage from './pages/PricingPage';
import ContactPage from './pages/ContactPage';
import OwnerRegistrations from './pages/OwnerRegistrations';
import VerifyEmail from './pages/VerifyEmail';
import PolicyPage from './pages/PolicyPage';
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* Public Website Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PolicyPage />} />
          <Route path="/login" element={<Login />} />
          
          {/* Owner Routes */}
          <Route
            path="/owner/dashboard"
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <MainLayout>
                  <OwnerDashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/owner/registrations"
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <MainLayout>
                  <OwnerRegistrations />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          


          <Route
            path="/owner/customers"
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <MainLayout>
                  <CustomersList />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/owner/batches"
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <MainLayout>
                  <OwnerBatches />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/owner/invoices"
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <MainLayout>
                  <OwnerInvoices />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/owner/batches/:id"
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <MainLayout>
                  <OwnerBatchDetail />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/owner/employees"
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <MainLayout>
                  <AddEmployee />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/owner/warehouses"
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <MainLayout>
                  <WarehouseManagement />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/owner/products"
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <MainLayout>
                  <ProductManagement />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/owner/shipping-details"
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <MainLayout>
                  <OwnerShippingDetails />
                </MainLayout>
              </ProtectedRoute>
            }
          />


          {/* Inventory Routes - Accessible by both owner and employee */}
          <Route
            path="/inventory"
            element={
              <ProtectedRoute allowedRoles={['owner', 'employee']}>
                <MainLayout>
                  <InventoryCustomerList />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/inventory/customer/:customerId"
            element={
              <ProtectedRoute allowedRoles={['owner', 'employee']}>
                <MainLayout>
                  <CustomerInventoryDetail />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/customer/inventory"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <MainLayout>
                  <CustomerInventory />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/customer/invoices/shipping"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <MainLayout>
                  <CustomerShippingInvoices />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/customer/invoices/prep"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <MainLayout>
                  <CustomerPrepInvoices />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/customer/proofs"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <MainLayout>
                  <CustomerProofs />
                </MainLayout>
              </ProtectedRoute>
            }
          />



          
          {/* Employee Routes */}
          <Route
            path="/employee/dashboard"
            element={
              <ProtectedRoute allowedRoles={['employee']}>
                <MainLayout>
                  <div className="p-8">
                    <h1 className="text-3xl font-bold">Employee Dashboard</h1>
                    <p className="mt-4">Welcome Employee!</p>
                  </div>
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/employee/upload"
            element={
              <ProtectedRoute allowedRoles={['employee']}>
                <MainLayout>
                  <UploadBatch />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/employee/batches"
            element={
              <ProtectedRoute allowedRoles={['employee']}>
                <MainLayout>
                  <MyBatches />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          
          {/* Customer Routes */}
          <Route
            path="/customer/dashboard"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <MainLayout>
                  <CustomerDashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          

            
          <Route path="/verify-email" element={<VerifyEmail />} />
          
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;