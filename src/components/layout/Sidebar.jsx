import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAdmin } from '../../context/AdminContext'
import toast from 'react-hot-toast'

const NAV = [
  { section: 'Overview' },
  { to: '/',             icon: '⊞',  label: 'Dashboard' },
  { section: 'Management' },
  { to: '/users',        icon: '👥', label: 'Users' },
  { to: '/verify',       icon: '🪪', label: 'Seller Verification', badge: 'verifications' },
  { to: '/products',     icon: '📦', label: 'Products' },
  { section: 'Trust & Safety' },
  { to: '/fraud',        icon: '⚠️', label: 'Fraud Reports',  badge: 'reports' },
  { to: '/transactions', icon: '💳', label: 'Transactions' },
  { to: '/disputes',     icon: '⚖️', label: 'Disputes',       badge: 'disputes' },
]

export default function Sidebar() {
  const { admin, pendingCount, logout } = useAdmin()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast('Logged out successfully')
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="brand-logo">🛒</div>
        <div>
          <div className="brand-text">Malonda</div>
          <div className="brand-sub">Admin Panel</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {NAV.map((item, i) => {
          if (item.section) {
            return <div key={i} className="nav-section">{item.section}</div>
          }
          const count = item.badge ? pendingCount[item.badge] : 0
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {count > 0 && <span className="nav-badge">{count}</span>}
            </NavLink>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="admin-info">
          <div className="admin-avatar">{admin?.initials || 'MA'}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {admin?.name}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text3)' }}>{admin?.role}</div>
          </div>
          <button
            onClick={handleLogout}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', fontSize: 16, padding: 4 }}
            title="Log out"
          >
            ↩
          </button>
        </div>
      </div>
    </aside>
  )
}
