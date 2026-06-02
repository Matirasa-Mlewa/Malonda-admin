import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useAdmin } from '../context/AdminContext'
import { useConfirm } from '../hooks/useConfirm'
import { AlertBanner, RiskBadge, StatusBadge, UserCell, ConfirmModal, FilterBar, Panel } from '../components/ui'
import DataTable from '../components/common/DataTable'

export default function FraudReports() {
  const { reports, users, resolveReport, suspendUser } = useAdmin()
  const { dialog, confirm, close, handleConfirm } = useConfirm()
  const [filter, setFilter] = useState('ALL')

  const highRisk    = reports.filter(r => r.risk === 'HIGH'   && r.status !== 'RESOLVED')
  const pending     = reports.filter(r => r.status === 'PENDING')
  const unresolved  = reports.filter(r => r.status !== 'RESOLVED')

  const filtered = reports.filter(r =>
    filter === 'ALL'         ? true :
    filter === 'PENDING'     ? r.status === 'PENDING' :
    filter === 'HIGH'        ? r.risk === 'HIGH' :
    filter === 'RESOLVED'    ? r.status === 'RESOLVED' : true
  )

  const handleResolve = r => confirm({
    title: 'Resolve Report',
    body: `Mark this report against "${r.reported}" as resolved? No further action will be taken.`,
    confirmLabel: 'Resolve',
    variant: 'success',
    onConfirm: () => { resolveReport(r.id); toast.success('Report resolved') },
  })

  const handleSuspend = r => {
    const user = users.find(u => u.name === r.reported)
    confirm({
      title: 'Suspend User',
      body: `Suspend "${r.reported}" based on this fraud report? They will not be able to buy or sell until reinstated.`,
      confirmLabel: 'Suspend',
      variant: 'danger',
      onConfirm: () => {
        if (user) suspendUser(user.id)
        resolveReport(r.id)
        toast.error(`${r.reported} has been suspended`)
      },
    })
  }

  const filters = [
    { key: 'ALL',      label: `All (${reports.length})` },
    { key: 'PENDING',  label: `Pending (${pending.length})` },
    { key: 'HIGH',     label: `High Risk (${highRisk.length})` },
    { key: 'RESOLVED', label: `Resolved (${reports.filter(r => r.status === 'RESOLVED').length})` },
  ]

  const columns = [
    { key: 'reporter', label: 'Reporter',     render: r => <span className="font-medium">{r.reporter}</span> },
    { key: 'reported', label: 'Reported User', render: r => <span className="font-medium" style={{ color: 'var(--red)' }}>{r.reported}</span> },
    { key: 'reason',   label: 'Reason',        render: r => <span className="text-sm" style={{ color: 'var(--text3)', maxWidth: 180, display: 'block' }}>{r.reason}</span> },
    { key: 'risk',     label: 'Risk',          render: r => <RiskBadge risk={r.risk} /> },
    { key: 'status',   label: 'Status',        render: r => <StatusBadge status={r.status} /> },
    { key: 'date',     label: 'Date',          render: r => <span className="text-sm text-muted">{r.date}</span> },
    {
      key: 'actions', label: 'Actions',
      render: r => r.status === 'RESOLVED'
        ? <span className="text-sm text-muted">Closed</span>
        : (
          <div className="action-btns">
            <button className="btn btn-sm" title="Investigate">🔍</button>
            <button className="btn btn-sm btn-success" onClick={() => handleResolve(r)}>Resolve</button>
            <button className="btn btn-sm btn-danger"  onClick={() => handleSuspend(r)}>Suspend</button>
          </div>
        ),
    },
  ]

  return (
    <>
      {highRisk.length > 0 && (
        <AlertBanner
          type="danger" icon="⚠️"
          title={`${highRisk.length} high-risk report${highRisk.length > 1 ? 's' : ''} require immediate action`}
          body="Multiple reports against the same user indicate a pattern of fraudulent behaviour. Consider suspending the account."
        />
      )}

      {unresolved.length === 0 && (
        <AlertBanner
          type="success" icon="✅"
          title="All reports resolved"
          body="No pending fraud reports at the moment. Great work keeping the marketplace safe!"
        />
      )}

      {/* Stats row */}
      <div className="grid-3 mb-16">
        <div className="metric-card">
          <div className="metric-label">Total Reports</div>
          <div className="metric-value">{reports.length}</div>
          <div className="metric-delta delta-down">⚠ {unresolved.length} unresolved</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">High Risk</div>
          <div className="metric-value" style={{ color: 'var(--red)' }}>{highRisk.length}</div>
          <div className="metric-delta delta-down">Needs immediate review</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Resolved</div>
          <div className="metric-value" style={{ color: 'var(--green)' }}>
            {reports.filter(r => r.status === 'RESOLVED').length}
          </div>
          <div className="metric-delta delta-up">✓ Closed</div>
        </div>
      </div>

      <Panel title="Fraud Reports">
        <FilterBar filters={filters} active={filter} onChange={setFilter} />
        <DataTable
          columns={columns}
          rows={filtered}
          rowClass={r => r.risk === 'HIGH' && r.status !== 'RESOLVED' ? 'row-flagged' : ''}
          emptyIcon="🛡️"
          emptyTitle="No reports found"
          emptyDesc="No reports match the selected filter"
        />
      </Panel>

      <ConfirmModal dialog={dialog} onClose={close} onConfirm={handleConfirm} />
    </>
  )
}
