import React, { useState } from 'react'
import { useAdmin } from '../context/AdminContext'
import { TxBadge, MetricCard, Panel, FilterBar } from '../components/ui'
import DataTable from '../components/common/DataTable'

export default function Transactions() {
  const { transactions } = useAdmin()
  const [filter, setFilter] = useState('ALL')
  const [query, setQuery] = useState('')

  const escrowed  = transactions.filter(t => t.status === 'ESCROWED')
  const completed = transactions.filter(t => t.status === 'COMPLETED')
  const pending   = transactions.filter(t => t.status === 'PENDING')

  const filtered = transactions.filter(t => {
    const matchFilter =
      filter === 'ALL'       ? true :
      filter === 'ESCROWED'  ? t.status === 'ESCROWED' :
      filter === 'COMPLETED' ? t.status === 'COMPLETED' :
      filter === 'PENDING'   ? t.status === 'PENDING' : true
    const matchQuery = !query ||
      t.id.toLowerCase().includes(query.toLowerCase()) ||
      t.buyer.toLowerCase().includes(query.toLowerCase()) ||
      t.seller.toLowerCase().includes(query.toLowerCase())
    return matchFilter && matchQuery
  })

  const filters = [
    { key: 'ALL',       label: `All (${transactions.length})` },
    { key: 'ESCROWED',  label: `In Escrow (${escrowed.length})` },
    { key: 'COMPLETED', label: `Completed (${completed.length})` },
    { key: 'PENDING',   label: `Pending (${pending.length})` },
  ]

  const columns = [
    { key: 'id',     label: 'Order ID', render: t => <span className="text-mono">{t.id}</span> },
    { key: 'buyer',  label: 'Buyer',    render: t => <span className="font-medium">{t.buyer}</span> },
    { key: 'seller', label: 'Seller',   render: t => t.seller },
    { key: 'amount', label: 'Amount',   render: t => <span className="text-mono font-medium">{t.amount}</span> },
    { key: 'status', label: 'Status',   render: t => <TxBadge status={t.status} /> },
    { key: 'date',   label: 'Date',     render: t => <span className="text-sm text-muted">{t.date}</span> },
    {
      key: 'actions', label: 'Actions',
      render: t => (
        <div className="action-btns">
          <button className="btn btn-sm btn-icon" title="View details">👁</button>
          {t.status === 'ESCROWED' && (
            <button className="btn btn-sm" style={{ fontSize: 11 }}>View Escrow</button>
          )}
        </div>
      ),
    },
  ]

  return (
    <>
      {/* Stats */}
      <div className="grid-3 mb-16">
        <MetricCard
          label="Total Volume (Month)"
          value="MK 4.2M"
          delta="↑ +18% vs last month"
          deltaType="up"
        />
        <MetricCard
          label="In Escrow"
          value={`MK 203K`}
          delta={`🔒 ${escrowed.length} orders held`}
          deltaType="up"
          valueColor="var(--blue)"
        />
        <MetricCard
          label="Platform Fees"
          value="MK 84K"
          delta="2% of total volume"
          deltaType="up"
          valueColor="var(--green)"
        />
      </div>

      {/* Escrow legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <div style={{ width: 12, height: 12, background: '#eef5fc', border: '1px solid var(--blue)', borderRadius: 3 }} />
        <span className="text-sm text-muted">Blue rows = funds held in escrow (not yet released)</span>
      </div>

      <Panel title="All Transactions">
        <FilterBar filters={filters} active={filter} onChange={setFilter}>
          <div className="search-wrap" style={{ marginLeft: 'auto' }}>
            <span style={{ fontSize: 13, color: 'var(--text3)' }}>🔍</span>
            <input
              placeholder="Search order, buyer, seller..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
        </FilterBar>
        <DataTable
          columns={columns}
          rows={filtered}
          rowClass={t => t.status === 'ESCROWED' ? 'row-escrow' : ''}
          emptyIcon="💳"
          emptyTitle="No transactions found"
          emptyDesc="Try a different filter or search term"
        />
      </Panel>
    </>
  )
}
