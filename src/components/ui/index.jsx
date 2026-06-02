import React from 'react'

// ── StatusBadge ────────────────────────────────────────────────────────────────
export function StatusBadge({ status }) {
  const map = {
    ACTIVE:       { cls: 'badge-green', label: 'Active' },
    SUSPENDED:    { cls: 'badge-red',   label: 'Suspended' },
    FLAGGED:      { cls: 'badge-red',   label: '⚑ Flagged' },
    PENDING:      { cls: 'badge-amber', label: 'Pending' },
    'UNDER REVIEW':{ cls:'badge-blue',  label: 'Reviewing' },
    RESOLVED:     { cls: 'badge-green', label: 'Resolved' },
    OPEN:         { cls: 'badge-red',   label: 'Open' },
    REVIEWING:    { cls: 'badge-amber', label: 'Reviewing' },
    CLOSED:       { cls: 'badge-gray',  label: 'Closed' },
  }
  const { cls = 'badge-gray', label = status } = map[status] || {}
  return <span className={`badge ${cls}`}>{label}</span>
}

// ── VerificationBadge ──────────────────────────────────────────────────────────
export function VerificationBadge({ level }) {
  if (level === 'TRUSTED')  return <span className="badge badge-amber">⭐ Trusted</span>
  if (level === 'VERIFIED') return <span className="badge badge-green">✓ Verified</span>
  return <span className="badge badge-gray">Basic</span>
}

// ── RiskBadge ──────────────────────────────────────────────────────────────────
export function RiskBadge({ risk }) {
  if (risk === 'HIGH')   return <span className="badge badge-red">High risk</span>
  if (risk === 'MEDIUM') return <span className="badge badge-amber">Medium</span>
  return <span className="badge badge-green">Low risk</span>
}

// ── TxBadge ────────────────────────────────────────────────────────────────────
export function TxBadge({ status }) {
  const map = {
    ESCROWED:  { cls: 'badge-blue',  label: '🔒 Escrow' },
    COMPLETED: { cls: 'badge-green', label: 'Completed' },
    PENDING:   { cls: 'badge-amber', label: 'Pending' },
    DISPUTED:  { cls: 'badge-red',   label: 'Disputed' },
  }
  const { cls = 'badge-gray', label = status } = map[status] || {}
  return <span className={`badge ${cls}`}>{label}</span>
}

// ── UserCell ───────────────────────────────────────────────────────────────────
export function UserCell({ initials, name, sub, avatarClass = 'av-gray' }) {
  return (
    <div className="user-cell">
      <div className={`avatar ${avatarClass}`}>{initials}</div>
      <div>
        <div className="font-medium" style={{ fontSize: 13 }}>{name}</div>
        {sub && <div className="text-xs text-muted">{sub}</div>}
      </div>
    </div>
  )
}

// ── AlertBanner ────────────────────────────────────────────────────────────────
export function AlertBanner({ type = 'danger', icon, title, body, action }) {
  const typeClass = { danger: 'alert-danger', warn: 'alert-warn', info: 'alert-info', success: 'alert-success' }
  return (
    <div className={`alert-banner ${typeClass[type] || 'alert-danger'}`}>
      {icon && <span className="alert-icon">{icon}</span>}
      <div style={{ flex: 1 }}>
        {title && <div className="alert-title">{title}</div>}
        {body  && <div className="alert-body">{body}</div>}
      </div>
      {action && <div className="alert-actions">{action}</div>}
    </div>
  )
}

// ── ConfirmModal ───────────────────────────────────────────────────────────────
export function ConfirmModal({ dialog, onClose, onConfirm }) {
  if (!dialog) return null
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-title">{dialog.title}</div>
        <div className="modal-body">{dialog.body}</div>
        <div className="modal-actions">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className={`btn btn-${dialog.variant || 'danger'}`} onClick={onConfirm}>
            {dialog.confirmLabel || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── LoadingSpinner ─────────────────────────────────────────────────────────────
export function LoadingSpinner({ size = 24 }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
      <div style={{
        width: size, height: size,
        border: '2.5px solid var(--gray-border)',
        borderTopColor: 'var(--green)',
        borderRadius: '50%',
        animation: 'spin .7s linear infinite',
      }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

// ── EmptyState ─────────────────────────────────────────────────────────────────
export function EmptyState({ icon = '✓', title, desc }) {
  return (
    <div className="empty-state">
      <div style={{ fontSize: 36, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{title}</div>
      {desc && <div>{desc}</div>}
    </div>
  )
}

// ── FilterBar ──────────────────────────────────────────────────────────────────
export function FilterBar({ filters, active, onChange, children }) {
  return (
    <div className="filter-bar">
      {filters.map(f => (
        <span
          key={f.key}
          className={`filter-chip${active === f.key ? ' active' : ''}`}
          onClick={() => onChange(f.key)}
        >
          {f.label}
        </span>
      ))}
      {children}
    </div>
  )
}

// ── Panel ──────────────────────────────────────────────────────────────────────
export function Panel({ title, count, action, children }) {
  return (
    <div className="panel">
      {title && (
        <div className="panel-head">
          <span className="panel-title">{title}</span>
          {count !== undefined && <span className="panel-count">{count}</span>}
          {action && <button className="panel-action btn-link">{action}</button>}
        </div>
      )}
      {children}
    </div>
  )
}

// ── MetricCard ─────────────────────────────────────────────────────────────────
export function MetricCard({ label, value, delta, deltaType = 'up', valueColor }) {
  return (
    <div className="metric-card">
      <div className="metric-label">{label}</div>
      <div className="metric-value" style={valueColor ? { color: valueColor } : {}}>{value}</div>
      {delta && (
        <div className={`metric-delta delta-${deltaType}`}>{delta}</div>
      )}
    </div>
  )
}
