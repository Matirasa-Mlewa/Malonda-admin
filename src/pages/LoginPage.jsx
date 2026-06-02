import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../context/AdminContext'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const { login, loading } = useAdmin()
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    const res = await login(phone, password)
    if (res.success) {
      toast.success('Welcome back, Admin!')
      navigate('/')
    } else {
      setError(res.error || 'Invalid credentials')
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 52, height: 52, background: 'var(--green)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, margin: '0 auto 12px' }}>
            🛒
          </div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>Malonda Admin</div>
          <div style={{ fontSize: 13, color: 'var(--text3)', marginTop: 2 }}>Secure admin access only</div>
        </div>

        {error && (
          <div style={{ background: 'var(--red-light)', border: '1px solid #e8b4b4', borderRadius: 'var(--radius)', padding: '10px 13px', fontSize: 13, color: 'var(--red)', marginBottom: 14 }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Admin Phone Number</label>
            <input
              className="form-input"
              type="tel"
              placeholder="+265 888 000 001"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', marginTop: 8 }}>
            {loading ? 'Signing in...' : 'Sign In to Admin Panel'}
          </button>
        </form>

        <div style={{ marginTop: 20, background: 'var(--gray-light)', borderRadius: 'var(--radius)', padding: '10px 13px', fontSize: 12, color: 'var(--text3)', textAlign: 'center', lineHeight: 1.6 }}>
          🔒 Admin access is logged and monitored.<br />
          Demo: <code>+265888000001</code> / <code>Admin@Malonda2024</code>
        </div>
      </div>
    </div>
  )
}
