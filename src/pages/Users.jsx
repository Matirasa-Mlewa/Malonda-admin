import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useAdmin } from '../context/AdminContext'
import { useConfirm } from '../hooks/useConfirm'
import { AlertBanner, VerificationBadge, StatusBadge, UserCell, ConfirmModal, FilterBar, Panel } from '../components/ui'
import DataTable from '../components/common/DataTable'

export default function Users() {
  const { users, suspendUser, activateUser } = useAdmin()
  const { dialog, confirm, close, handleConfirm } = useConfirm()
  const [filter, setFilter] = useState('ALL')
  const [query, setQuery] = useState('')

  const suspended = users.filter(u => u.status === 'SUSPENDED')

  const filtered = users.filter(u => {
    const matchFilter =
      filter === 'ALL'       ? true :
      filter === 'ACTIVE'    ? u.status === 'ACTIVE' :
      filter === 'SUSPENDED' ? u.status === 'SUSPENDED' :
      filter === 'VERIFIED'  ? u.level !== 'BASIC' : true
    const matchQuery = !query || u.name.toLowerCase().includes(query.toLowerCase()) || u.phone.includes(query)
    return matchFilter && matchQuery
  })

  const handleSuspend = user => confirm({
    title: 'Suspend User',
    body:  `Suspend ${user.name}? They cannot buy or sell until reinstated.`,
    confirmLabel: 'Suspend',
    variant: 'danger',
    onConfirm: () => { suspendUser(user.id); toast.error(`${user.name} suspended`) },
  })

  const handleActivate = user => confirm({
    title: 'Activate User',
    body: `Restore ${user.name}'s account and allow them to use Malonda again?`,
    confirmLabel: 'Activate',
    variant: 'success',
    onConfirm: () => { activateUser(user.id); toast.success(`${user.name} activated`) },
  })

  const filters = [
    { key: 'ALL',       label: `All (${users.length})` },
    { key: 'ACTIVE',    label: `Active (${users.filter(u=>u.status==='ACTIVE').length})` },
    { key: 'SUSPENDED', label: `Suspended (${suspended.length})` },
    { key: 'VERIFIED',  label: 'Verified / Trusted' },
  ]

  const columns = [
    { key: 'user',   label: 'User',         render: u => <UserCell initials={u.initials} name={u.name} sub={`Joined ${u.joined}`} avatarClass={u.avatarClass} /> },
    { key: 'phone',  label: 'Phone',        render: u => <span className="text-mono">{u.phone}</span> },
    { key: 'level',  label: 'Verification', render: u => <VerificationBadge level={u.level} /> },
    { key: 'status', label: 'Status',       render: u => <StatusBadge status={u.status} /> },
    { key: 'orders', label: 'Orders',       render: u => <span style={{ textAlign: 'center', display: 'block' }}>{u.orders}</span>, width: 70 },
    {
      key: 'actions', label: 'Actions',
      render: u => (
        <div className="action-btns">
          <button className="btn btn-sm btn-icon" title="View">👁</button>
          {u.status === 'ACTIVE'
            ? <button className="btn btn-sm btn-danger" onClick={() => handleSuspend(u)}>Suspend</button>
            : <button className="btn btn-sm btn-success" onClick={() => handleActivate(u)}>Activate</button>
          }
        </div>
      ),
    },
  ]

  return (
    <>
      {suspended.length > 0 && (
        <AlertBanner
          type="warn" icon="ℹ️"
          title={`${suspended.length} suspended account${suspended.length > 1 ? 's' : ''}`}
          body={suspended.map(u => u.name).join(', ') + ' — currently suspended.'}
        />
      )}

      <Panel title="All Users">
        <FilterBar filters={filters} active={filter} onChange={setFilter}>
          <div className="search-wrap" style={{ marginLeft: 'auto' }}>
            <span style={{ fontSize: 13, color: 'var(--text3)' }}>🔍</span>
            <input placeholder="Search name or phone..." value={query} onChange={e => setQuery(e.target.value)} />
          </div>
        </FilterBar>
        <DataTable
          columns={columns}
          rows={filtered}
          rowClass={u => u.status === 'SUSPENDED' ? 'row-flagged' : ''}
          emptyTitle="No users found"
          emptyDesc="Try adjusting your filters"
        />
      </Panel>

      <ConfirmModal dialog={dialog} onClose={close} onConfirm={handleConfirm} />
    </>
  )
}
