import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAdmin } from '../../context/AdminContext'

const PAGE_TITLES = {
  '/':             'Dashboard Overview',
  '/users':        'User Management',
  '/verify':       'Seller Verification',
  '/products':     'Product Monitoring',
  '/fraud':        'Fraud & Reports',
  '/transactions': 'Transactions',
  '/disputes':     'Dispute Resolution',
}

export default function Topbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { pendingCount } = useAdmin()
  const [query, setQuery] = useState('')

  const title = PAGE_TITLES[location.pathname] || 'Admin'
  const totalAlerts = (pendingCount.reports || 0)

  return (
    <header className="topbar">
      <div className="topbar-title">{title}</div>

      <div className="search-wrap">
        <span style={{ fontSize: 13, color: 'var(--text3)' }}>🔍</span>
        <input
          type="text"
          placeholder="Search users, orders..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      {totalAlerts > 0 && (
        <button className="alert-pill" onClick={() => navigate('/fraud')}>
          <span>⚠️</span>
          {totalAlerts} fraud alert{totalAlerts !== 1 ? 's' : ''}
        </button>
      )}

      <button className="topbar-btn" title="Notifications">🔔</button>
      <button className="topbar-btn" title="Settings">⚙️</button>
    </header>
  )
}
