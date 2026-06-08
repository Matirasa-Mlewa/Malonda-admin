import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AdminProvider, useAdmin } from './context/AdminContext'
import AdminLayout from './components/layout/AdminLayout'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import SellerVerification from './pages/SellerVerification'
import Products from './pages/Products'
import FraudReports from './pages/FraudReports'
import Transactions from './pages/Transactions'
import Disputes from './pages/Disputes'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAdmin()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { isAuthenticated } = useAdmin()
  return isAuthenticated ? <Navigate to="/" replace /> : children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route path="/"             element={<Dashboard />} />
        <Route path="/users"        element={<Users />} />
        <Route path="/verify"       element={<SellerVerification />} />
        <Route path="/products"     element={<Products />} />
        <Route path="/fraud"        element={<FraudReports />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/disputes"     element={<Disputes />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AdminProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: { fontSize:13, borderRadius:8, padding:'10px 14px' },
            success: { style: { background:'#e1f5ee', color:'#0f6e56', border:'1px solid #a3d9c3' } },
            error:   { style: { background:'#fcebeb', color:'#a32d2d', border:'1px solid #e8b4b4' } },
          }}
        />
      </AdminProvider>
    </BrowserRouter>
  )
}
