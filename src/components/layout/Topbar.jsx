import React from 'react'
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
  const title = PAGE_TITLES[location.pathname] || 'Admin'
  const totalAlerts = pendingCount.reports || 0

  return (
    <header style={{ height:56, background:'white', borderBottom:'1px solid #e3e1d9', display:'flex', alignItems:'center', padding:'0 20px', gap:12, flexShrink:0 }}>
      <div style={{ fontSize:15, fontWeight:600, flex:1 }}>{title}</div>

      {totalAlerts > 0 && (
        <button onClick={() => navigate('/fraud')}
          style={{ display:'flex', alignItems:'center', gap:5, background:'#fcebeb', color:'#a32d2d', fontSize:12, fontWeight:500, padding:'5px 11px', borderRadius:20, cursor:'pointer', border:'none', fontFamily:'inherit', animation:'pulse 2.5s infinite' }}>
          <span>⚠️</span>{totalAlerts} fraud alert{totalAlerts !== 1 ? 's' : ''}
        </button>
      )}

      <button style={{ display:'flex', alignItems:'center', justifyContent:'center', width:34, height:34, borderRadius:8, border:'1px solid #e3e1d9', background:'white', cursor:'pointer', color:'#3d3b38' }}>🔔</button>

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.6}}`}</style>
    </header>
  )
}
