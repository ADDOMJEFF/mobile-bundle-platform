import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import LoginPage from './pages/LoginPage';
import BundlesPage from './pages/BundlesPage';
import CheckoutPage from './pages/CheckoutPage';
import HistoryPage from './pages/HistoryPage';
import RetailerRegisterPage from './pages/RetailerRegisterPage';
import RetailerDashboard from './pages/RetailerDashboard';
import SubPortalPage from './pages/SubPortalPage';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/bundles" element={<BundlesPage />} />
          <Route path="/checkout/:bundleId" element={<CheckoutPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/register-retailer" element={<RetailerRegisterPage />} />
          <Route path="/retailer-dashboard" element={<RetailerDashboard />} />
          <Route path="/shop/:shopSlug" element={<SubPortalPage />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;