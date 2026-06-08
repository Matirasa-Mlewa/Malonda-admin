import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAdmin } from '../../context/AdminContext'

const NAV = [
  { section: 'Overview' },
  { to: '/',             icon: '⊞',  label: 'Dashboard',            exact: true },
  { section: 'Management' },
  { to: '/users',        icon: '👥', label: 'Users' },
  { to: '/verify',       icon: '🪪', label: 'Seller Verification',  badge: 'verifications' },
  { to: '/products',     icon: '📦', label: 'Products' },
  { section: 'Trust & Safety' },
  { to: '/fraud',        icon: '⚠️', label: 'Fraud Reports',        badge: 'reports' },
  { to: '/transactions', icon: '💳', label: 'Transactions' },
  { to: '/disputes',     icon: '⚖️', label: 'Disputes',             badge: 'disputes' },
]

export default function Sidebar() {
  const { admin, pendingCount, logout } = useAdmin()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = (name = '') => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <aside style={{ width:224, background:'white', borderRight:'1px solid #e3e1d9', display:'flex', flexDirection:'column', flexShrink:0 }}>
      {/* Brand */}
      <div style={{ padding:16, borderBottom:'1px solid #e3e1d9', display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ width:34, height:34, background:'#0f6e56', borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:18, flexShrink:0 }}>🛒</div>
        <div>
          <div style={{ fontSize:15, fontWeight:600, lineHeight:1 }}>Malonda App</div>
          <div style={{ fontSize:11, color:'#7a7874', marginTop:2 }}>Admin Panel</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:'10px 8px', overflowY:'auto' }}>
        {NAV.map((item, i) => {
          if (item.section) {
            return (
              <div key={i} style={{ fontSize:10, fontWeight:600, color:'#7a7874', textTransform:'uppercase', letterSpacing:'.8px', padding:'10px 8px 4px' }}>
                {item.section}
              </div>
            )
          }
          const count = item.badge ? pendingCount[item.badge] : 0
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              style={({ isActive }) => ({
                display:'flex', alignItems:'center', gap:9, padding:'8px 10px',
                borderRadius:8, cursor:'pointer', textDecoration:'none',
                marginBottom:1, fontSize:13, transition:'background .12s',
                background: isActive ? '#e1f5ee' : 'transparent',
                color: isActive ? '#0f6e56' : '#3d3b38',
                fontWeight: isActive ? 500 : 400,
              })}
            >
              <span style={{ fontSize:16, flexShrink:0 }}>{item.icon}</span>
              <span style={{ flex:1 }}>{item.label}</span>
              {count > 0 && (
                <span style={{ background:'#fcebeb', color:'#a32d2d', fontSize:10, fontWeight:600, padding:'1px 7px', borderRadius:10 }}>{count}</span>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding:12, borderTop:'1px solid #e3e1d9' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ width:32, height:32, borderRadius:'50%', background:'#e1f5ee', color:'#0f6e56', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:600, flexShrink:0 }}>
            {initials(admin?.name)}
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:12, fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{admin?.name || 'Admin'}</div>
            <div style={{ fontSize:11, color:'#7a7874' }}>{admin?.role || 'ADMIN'}</div>
          </div>
          <button onClick={handleLogout} title="Log out"
            style={{ background:'none', border:'none', cursor:'pointer', color:'#7a7874', fontSize:16, padding:4 }}>
            ↩
          </button>
        </div>
      </div>
    </aside>
  )
}
