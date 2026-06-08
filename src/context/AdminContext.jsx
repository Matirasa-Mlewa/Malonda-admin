import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const AdminContext = createContext(null);

// ─── API helper ───────────────────────────────────────────────────────────────
async function apiCall(method, path, body, token) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Request failed: ${res.status}`);
  return data;
}

const initialState = {
  isAuthenticated: false,
  admin: null,
  token: null,
  users: [],
  verifications: [],
  products: [],
  reports: [],
  transactions: [],
  disputes: [],
  stats: null,
  loading: false,
  dataLoading: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, isAuthenticated: true, admin: action.user, token: action.token };
    case 'LOGOUT':
      return { ...initialState };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_DATA_LOADING':
      return { ...state, dataLoading: action.payload };
    case 'SET_STATS':
      return { ...state, stats: action.payload };
    case 'SET_USERS':
      return { ...state, users: action.payload };
    case 'SET_VERIFICATIONS':
      return { ...state, verifications: action.payload };
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'SET_REPORTS':
      return { ...state, reports: action.payload };
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    case 'SET_DISPUTES':
      return { ...state, disputes: action.payload };
    case 'UPDATE_USER':
      return { ...state, users: state.users.map(u => u.id === action.id ? { ...u, ...action.updates } : u) };
    case 'REMOVE_VERIFICATION':
      return { ...state, verifications: state.verifications.filter(v => v.id !== action.id) };
    case 'REMOVE_PRODUCT':
      return { ...state, products: state.products.filter(p => p.id !== action.id) };
    case 'UPDATE_REPORT':
      return { ...state, reports: state.reports.map(r => r.id === action.id ? { ...r, ...action.updates } : r) };
    case 'UPDATE_DISPUTE':
      return { ...state, disputes: state.disputes.map(d => d.id === action.id ? { ...d, ...action.updates } : d) };
    default:
      return state;
  }
}

export function AdminProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    token: localStorage.getItem('malonda_admin_token'),
    isAuthenticated: !!localStorage.getItem('malonda_admin_token'),
    admin: JSON.parse(localStorage.getItem('malonda_admin_user') || 'null'),
  });

  // ─── Login ──────────────────────────────────────────────────────────────────
  const login = useCallback(async (phone, password) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await apiCall('POST', '/auth/login', { phone, password });
      if (res.user?.role !== 'ADMIN') {
        throw new Error('Access denied. Admin accounts only.');
      }
      localStorage.setItem('malonda_admin_token', res.token);
      localStorage.setItem('malonda_admin_user', JSON.stringify(res.user));
      dispatch({ type: 'LOGIN', user: res.user, token: res.token });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // ─── Logout ─────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem('malonda_admin_token');
    localStorage.removeItem('malonda_admin_user');
    dispatch({ type: 'LOGOUT' });
  }, []);

  // ─── Fetch dashboard stats ──────────────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    if (!state.token) return;
    try {
      const res = await apiCall('GET', '/admin/stats', null, state.token);
      dispatch({ type: 'SET_STATS', payload: res.stats });
    } catch (err) {
      console.error('Stats fetch failed:', err.message);
    }
  }, [state.token]);

  // ─── Fetch users ────────────────────────────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    if (!state.token) return;
    dispatch({ type: 'SET_DATA_LOADING', payload: true });
    try {
      const res = await apiCall('GET', '/admin/users', null, state.token);
      dispatch({ type: 'SET_USERS', payload: res.users || [] });
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      dispatch({ type: 'SET_DATA_LOADING', payload: false });
    }
  }, [state.token]);

  // ─── Fetch verifications ────────────────────────────────────────────────────
  const fetchVerifications = useCallback(async () => {
    if (!state.token) return;
    dispatch({ type: 'SET_DATA_LOADING', payload: true });
    try {
      const res = await apiCall('GET', '/admin/verifications/pending', null, state.token);
      dispatch({ type: 'SET_VERIFICATIONS', payload: res.verifications || [] });
    } catch (err) {
      toast.error('Failed to load verifications');
    } finally {
      dispatch({ type: 'SET_DATA_LOADING', payload: false });
    }
  }, [state.token]);

  // ─── Fetch products ─────────────────────────────────────────────────────────
  const fetchProducts = useCallback(async () => {
    if (!state.token) return;
    dispatch({ type: 'SET_DATA_LOADING', payload: true });
    try {
      const res = await apiCall('GET', '/products?limit=50', null, state.token);
      dispatch({ type: 'SET_PRODUCTS', payload: res.products || [] });
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      dispatch({ type: 'SET_DATA_LOADING', payload: false });
    }
  }, [state.token]);

  // ─── Fetch reports ──────────────────────────────────────────────────────────
  const fetchReports = useCallback(async () => {
    if (!state.token) return;
    dispatch({ type: 'SET_DATA_LOADING', payload: true });
    try {
      const res = await apiCall('GET', '/admin/reports', null, state.token);
      dispatch({ type: 'SET_REPORTS', payload: res.reports || [] });
    } catch (err) {
      toast.error('Failed to load reports');
    } finally {
      dispatch({ type: 'SET_DATA_LOADING', payload: false });
    }
  }, [state.token]);

  // ─── Fetch transactions ─────────────────────────────────────────────────────
  const fetchTransactions = useCallback(async () => {
    if (!state.token) return;
    dispatch({ type: 'SET_DATA_LOADING', payload: true });
    try {
      const res = await apiCall('GET', '/admin/transactions', null, state.token);
      dispatch({ type: 'SET_TRANSACTIONS', payload: res.payments || [] });
    } catch (err) {
      toast.error('Failed to load transactions');
    } finally {
      dispatch({ type: 'SET_DATA_LOADING', payload: false });
    }
  }, [state.token]);

  // ─── Fetch disputes ─────────────────────────────────────────────────────────
  const fetchDisputes = useCallback(async () => {
    if (!state.token) return;
    dispatch({ type: 'SET_DATA_LOADING', payload: true });
    try {
      const res = await apiCall('GET', '/admin/disputes', null, state.token);
      dispatch({ type: 'SET_DISPUTES', payload: res.disputes || [] });
    } catch (err) {
      toast.error('Failed to load disputes');
    } finally {
      dispatch({ type: 'SET_DATA_LOADING', payload: false });
    }
  }, [state.token]);

  // ─── User actions ───────────────────────────────────────────────────────────
  const suspendUser = useCallback(async (id) => {
    try {
      await apiCall('POST', `/admin/users/${id}/suspend`, { reason: 'Suspended by admin' }, state.token);
      dispatch({ type: 'UPDATE_USER', id, updates: { isSuspended: true } });
      toast.error('User suspended');
    } catch (err) { toast.error(err.message); }
  }, [state.token]);

  const activateUser = useCallback(async (id) => {
    try {
      await apiCall('POST', `/admin/users/${id}/unsuspend`, {}, state.token);
      dispatch({ type: 'UPDATE_USER', id, updates: { isSuspended: false } });
      toast.success('User activated');
    } catch (err) { toast.error(err.message); }
  }, [state.token]);

  // ─── Verification actions ───────────────────────────────────────────────────
  const approveVerify = useCallback(async (userId) => {
    try {
      await apiCall('POST', `/admin/verifications/${userId}/approve`, {}, state.token);
      dispatch({ type: 'REMOVE_VERIFICATION', id: userId });
      toast.success('Verification approved ✓');
    } catch (err) { toast.error(err.message); }
  }, [state.token]);

  const rejectVerify = useCallback(async (userId, reason) => {
    try {
      await apiCall('POST', `/admin/verifications/${userId}/reject`, { reason: reason || 'Documents unclear' }, state.token);
      dispatch({ type: 'REMOVE_VERIFICATION', id: userId });
      toast('Verification rejected');
    } catch (err) { toast.error(err.message); }
  }, [state.token]);

  // ─── Product actions ────────────────────────────────────────────────────────
  const removeProduct = useCallback(async (id) => {
    try {
      await apiCall('DELETE', `/products/${id}`, null, state.token);
      dispatch({ type: 'REMOVE_PRODUCT', id });
      toast.success('Product removed');
    } catch (err) { toast.error(err.message); }
  }, [state.token]);

  // ─── Report actions ─────────────────────────────────────────────────────────
  const resolveReport = useCallback(async (id) => {
    try {
      await apiCall('POST', `/admin/reports/${id}/resolve`, { action: 'dismiss', note: 'Resolved by admin' }, state.token);
      dispatch({ type: 'UPDATE_REPORT', id, updates: { status: 'RESOLVED' } });
      toast.success('Report resolved');
    } catch (err) { toast.error(err.message); }
  }, [state.token]);

  // ─── Dispute actions ────────────────────────────────────────────────────────
  const closeDispute = useCallback(async (id, decision) => {
    try {
      await apiCall('POST', `/admin/disputes/${id}/resolve`, { decision, note: 'Resolved by admin' }, state.token);
      dispatch({ type: 'UPDATE_DISPUTE', id, updates: { status: 'CLOSED' } });
      toast.success(decision === 'release' ? 'Payment released to seller' : 'Refund issued to buyer');
    } catch (err) { toast.error(err.message); }
  }, [state.token]);

  const pendingCount = {
    verifications: state.verifications.length,
    reports: state.reports.filter(r => r.status !== 'RESOLVED').length,
    disputes: state.disputes.filter(d => d.status !== 'CLOSED').length,
  };

  return (
    <AdminContext.Provider value={{
      ...state, pendingCount,
      login, logout,
      fetchStats, fetchUsers, fetchVerifications, fetchProducts,
      fetchReports, fetchTransactions, fetchDisputes,
      suspendUser, activateUser,
      approveVerify, rejectVerify,
      removeProduct, resolveReport, closeDispute,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
};
