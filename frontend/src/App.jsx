import { Component, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';

// Public website pages: part of the main file, so they open instantly and can be pre-rendered
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import AboutPage from './pages/AboutPage';
import PricingPage from './pages/PricingPage';
import ContactPage from './pages/ContactPage';
import PolicyPage from './pages/PolicyPage';
import { PRIVACY_SECTIONS, PRIVACY_LAST_UPDATED } from './data/privacyContent';
import FaqPage from './pages/FaqPage';
import NotFound from './pages/NotFound';
import RouteSeo from './seo/RouteSeo';

// Portal pages: each one is downloaded only when someone opens it,
// so website visitors do not download the whole portal (report finding M5).
const RELOAD_KEY = 'peaknizer-page-reload';

function lazyPage(load) {
  return lazy(() =>
    load()
      .then((module) => {
        try { sessionStorage.removeItem(RELOAD_KEY); } catch { /* storage not available */ }
        return module;
      })
      .catch((error) => {
        // After a new deploy, a tab that was already open can ask for a page file
        // that no longer exists. Reload once to get the new version of the site.
        let alreadyReloaded = true;
        try {
          alreadyReloaded = sessionStorage.getItem(RELOAD_KEY) === '1';
          if (!alreadyReloaded) sessionStorage.setItem(RELOAD_KEY, '1');
        } catch { /* storage not available: do not reload */ }
        if (!alreadyReloaded) {
          window.location.reload();
          return new Promise(() => {}); // the page is reloading
        }
        throw error;
      })
  );
}

const Login = lazyPage(() => import('./pages/Login'));
const VerifyEmail = lazyPage(() => import('./pages/VerifyEmail'));
const UploadBatch = lazyPage(() => import('./pages/UploadBatch'));
const MyBatches = lazyPage(() => import('./pages/MyBatches'));
const CustomersList = lazyPage(() => import('./pages/CustomersList'));
const OwnerDashboard = lazyPage(() => import('./pages/OwnerDashboard'));
const OwnerBatches = lazyPage(() => import('./pages/OwnerBatches'));
const OwnerInvoices = lazyPage(() => import('./pages/OwnerInvoices'));
const OwnerBatchDetail = lazyPage(() => import('./pages/OwnerBatchDetail'));
const AddEmployee = lazyPage(() => import('./pages/AddEmployee'));
const WarehouseManagement = lazyPage(() => import('./pages/WarehouseManagement'));
const ProductManagement = lazyPage(() => import('./pages/ProductManagement'));
const InventoryCustomerList = lazyPage(() => import('./pages/InventoryCustomerList'));
const CustomerInventoryDetail = lazyPage(() => import('./pages/CustomerInventoryDetail'));
const DropshippingManage = lazyPage(() => import('./pages/DropshippingManage'));
const CustomerDashboard = lazyPage(() => import('./pages/CustomerDashboard'));
const CustomerInventory = lazyPage(() => import('./pages/CustomerInventory'));
const CustomerDropshipping = lazyPage(() => import('./pages/CustomerDropshipping'));
const CustomerShippingInvoices = lazyPage(() => import('./pages/CustomerShippingInvoices'));
const OwnerShippingDetails = lazyPage(() => import('./pages/OwnerShippingDetails'));
const CustomerPrepInvoices = lazyPage(() => import('./pages/CustomerPrepInvoices'));
const CustomerProofs = lazyPage(() => import('./pages/CustomerProofs'));
const OwnerRegistrations = lazyPage(() => import('./pages/OwnerRegistrations'));

// Shown while a portal page is being downloaded (usually a fraction of a second)
const PageLoading = () => (
  <div className="min-h-screen flex items-center justify-center text-slate-500" role="status">
    Loading...
  </div>
);

// If a page cannot be loaded (for example, no internet connection),
// show a message instead of a blank screen. It clears when the address changes.
class PageErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidUpdate(prevProps) {
    if (this.state.failed && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ failed: false });
    }
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center" role="alert">
          <p className="text-slate-700">This page could not be loaded. Please check your internet connection.</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="bg-[#0E2A47] hover:bg-[#123457] text-white font-semibold px-5 py-2.5 rounded-md transition-colors"
          >
            Reload the page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function PageBoundary({ children }) {
  const { pathname } = useLocation();
  return (
    <PageErrorBoundary resetKey={pathname}>
      <Suspense fallback={<PageLoading />}>{children}</Suspense>
    </PageErrorBoundary>
  );
}

function App() {
  return (
    <BrowserRouter>
      {/* Sets the title, description and other SEO tags for every page */}
      <RouteSeo />
      <AuthProvider>
        <PageBoundary>
        <Routes>

          {/* Public Website Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route
            path="/privacy"
            element={<PolicyPage title="Privacy Policy" sections={PRIVACY_SECTIONS} lastUpdated={PRIVACY_LAST_UPDATED} />}
          />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/terms" element={<PolicyPage />} />
          <Route path="/login" element={<Login />} />

          {/* Old addresses that now go to the real page */}
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/about-us" element={<Navigate to="/about" replace />} />
          <Route path="/index.html" element={<Navigate to="/" replace />} />

          {/* TEMPORARY: these two pages are not built yet, so their links still open
              the homepage. Remove each line when its real page is added. */}
          <Route path="/blog" element={<Navigate to="/" replace />} />
          <Route path="/careers" element={<Navigate to="/" replace />} />
          
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
            path="/inventory/customer/:customerId/dropshipping"
            element={
              <ProtectedRoute allowedRoles={['owner', 'employee']}>
                <MainLayout>
                  <DropshippingManage />
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
            path="/customer/dropshipping"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <MainLayout>
                  <CustomerDropshipping />
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
          
          <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />

          {/* Any other address: "Page not found". This must stay the LAST route. */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </PageBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;