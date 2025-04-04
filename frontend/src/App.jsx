import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DataInput from './pages/DataInput';
import SiteMap from './pages/SiteMap';
import ClientDetails from './pages/ClientDetails';
import QRTest from './pages/QRTest';
import SiteMapEditor from './pages/SiteMapEditor';

// Protected route component
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { currentUser, isAdmin, isOperator } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole === 'admin' && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  
  if (requiredRole === 'operator' && !(isOperator || isAdmin)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

function App() {
  // Add debugging log to see if component loads
  useEffect(() => {
    console.log('App component loaded');
  }, []);

  return (
    <AuthProvider>
      <div className="min-h-screen">
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="data-input" element={
              <ProtectedRoute requiredRole="operator">
                <DataInput />
              </ProtectedRoute>
            } />
            <Route path="site-map" element={<SiteMap />} />
            <Route path="site-map/editor" element={<SiteMapEditor />} />
            <Route path="clients/:id" element={<ClientDetails />} />
            <Route path="qr-test" element={<QRTest />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;