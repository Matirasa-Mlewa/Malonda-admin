import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../context/AdminContext'

export default function LoginPage() {
  const { login, loading } = useAdmin()
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const normalizedPhone = phone.startsWith('+') ? phone : `+265${phone.replace(/^0/, '')}`
    const res = await login(normalizedPhone, password)
    if (res.success) {
      navigate('/')
    } else {
      setError(res.error || 'Invalid credentials or not an admin account')
    }
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f4f3ef', padding:20 }}>
      <div style={{ background:'white', border:'1px solid #e3e1d9', borderRadius:12, padding:36, width:'100%', maxWidth:380, boxShadow:'0 4px 12px rgba(0,0,0,.1)' }}>
        {/* Brand */}
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ width:54, height:54, background:'#0f6e56', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, margin:'0 auto 12px' }}>🛒</div>
          <div style={{ fontSize:18, fontWeight:700 }}>Malonda App Admin</div>
          <div style={{ fontSize:13, color:'#7a7874', marginTop:2 }}>Secure admin access only</div>
        </div>

        {error && (
          <div style={{ background:'#fcebeb', border:'1px solid #e8b4b4', borderRadius:8, padding:'10px 13px', fontSize:13, color:'#a32d2d', marginBottom:14 }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom:14 }}>
            <label style={{ display:'block', fontSize:12, fontWeight:500, color:'#3d3b38', marginBottom:5 }}>Admin Phone Number</label>
            <div style={{ display:'flex', gap:8 }}>
              <select style={{ width:90, padding:'9px 8px', border:'1px solid #e3e1d9', borderRadius:8, fontSize:13, background:'white', outline:'none' }}>
                <option>🇲🇼 +265</option>
              </select>
              <input
                type="tel"
                placeholder="888 000 001"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
                style={{ flex:1, padding:'9px 12px', border:'1px solid #e3e1d9', borderRadius:8, fontSize:14, outline:'none', fontFamily:'inherit' }}
              />
            </div>
          </div>

          <div style={{ marginBottom:16 }}>
            <label style={{ display:'block', fontSize:12, fontWeight:500, color:'#3d3b38', marginBottom:5 }}>Password</label>
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ width:'100%', padding:'9px 12px', border:'1px solid #e3e1d9', borderRadius:8, fontSize:14, fontFamily:'inherit', outline:'none' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width:'100%', padding:'12px', background:'#0f6e56', color:'white', border:'none', borderRadius:8, fontSize:15, fontWeight:600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? .7 : 1, fontFamily:'inherit' }}
          >
            {loading ? 'Signing in…' : 'Sign In to Admin Panel'}
          </button>
        </form>

        <div style={{ marginTop:20, background:'#f4f3ef', borderRadius:8, padding:'10px 13px', fontSize:12, color:'#7a7874', textAlign:'center', lineHeight:1.6 }}>
          🔒 Admin access is logged and monitored.<br />
          Only accounts with role <strong>ADMIN</strong> can sign in here.
        </div>
      </div>
    </div>
  )
}
