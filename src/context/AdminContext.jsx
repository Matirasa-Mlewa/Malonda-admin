import React, { createContext, useContext, useReducer, useCallback } from 'react'
import { MOCK_USERS, MOCK_VERIFICATIONS, MOCK_PRODUCTS, MOCK_REPORTS, MOCK_TRANSACTIONS, MOCK_DISPUTES } from '../data/mockData'

const AdminContext = createContext(null)

const initialState = {
  isAuthenticated: false,
  admin: null,
  users:         [...MOCK_USERS],
  verifications: [...MOCK_VERIFICATIONS],
  products:      [...MOCK_PRODUCTS],
  reports:       [...MOCK_REPORTS],
  transactions:  [...MOCK_TRANSACTIONS],
  disputes:      [...MOCK_DISPUTES],
  loading: false,
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, isAuthenticated: true, admin: action.payload }
    case 'LOGOUT':
      return { ...initialState }
    case 'SUSPEND_USER':
      return { ...state, users: state.users.map(u => u.id === action.id ? { ...u, status: 'SUSPENDED' } : u) }
    case 'ACTIVATE_USER':
      return { ...state, users: state.users.map(u => u.id === action.id ? { ...u, status: 'ACTIVE' } : u) }
    case 'APPROVE_VERIFICATION':
      return { ...state, verifications: state.verifications.filter(v => v.id !== action.id) }
    case 'REJECT_VERIFICATION':
      return { ...state, verifications: state.verifications.filter(v => v.id !== action.id) }
    case 'REMOVE_PRODUCT':
      return { ...state, products: state.products.filter(p => p.id !== action.id) }
    case 'RESOLVE_REPORT':
      return { ...state, reports: state.reports.map(r => r.id === action.id ? { ...r, status: 'RESOLVED' } : r) }
    case 'CLOSE_DISPUTE':
      return { ...state, disputes: state.disputes.map(d => d.id === action.id ? { ...d, status: 'CLOSED' } : d) }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    default:
      return state
  }
}

export function AdminProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const login = useCallback(async (phone, password) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    await new Promise(r => setTimeout(r, 800))
    if (phone === '+265888000001' && password === 'Admin@Malonda2024') {
      dispatch({ type: 'LOGIN', payload: { name: 'Malonda Admin', phone, role: 'Super Admin', initials: 'MA' } })
      dispatch({ type: 'SET_LOADING', payload: false })
      return { success: true }
    }
    dispatch({ type: 'SET_LOADING', payload: false })
    return { success: false, error: 'Invalid credentials' }
  }, [])

  const logout = useCallback(() => dispatch({ type: 'LOGOUT' }), [])

  const suspendUser   = useCallback(id => dispatch({ type: 'SUSPEND_USER',           id }), [])
  const activateUser  = useCallback(id => dispatch({ type: 'ACTIVATE_USER',          id }), [])
  const approveVerify = useCallback(id => dispatch({ type: 'APPROVE_VERIFICATION',   id }), [])
  const rejectVerify  = useCallback(id => dispatch({ type: 'REJECT_VERIFICATION',    id }), [])
  const removeProduct = useCallback(id => dispatch({ type: 'REMOVE_PRODUCT',         id }), [])
  const resolveReport = useCallback(id => dispatch({ type: 'RESOLVE_REPORT',         id }), [])
  const closeDispute  = useCallback(id => dispatch({ type: 'CLOSE_DISPUTE',          id }), [])

  const pendingCount = {
    verifications: state.verifications.length,
    reports:       state.reports.filter(r => r.status !== 'RESOLVED').length,
    disputes:      state.disputes.filter(d => !['CLOSED'].includes(d.status)).length,
  }

  return (
    <AdminContext.Provider value={{
      ...state, pendingCount,
      login, logout,
      suspendUser, activateUser,
      approveVerify, rejectVerify,
      removeProduct, resolveReport, closeDispute,
    }}>
      {children}
    </AdminContext.Provider>
  )
}

export const useAdmin = () => {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider')
  return ctx
}
