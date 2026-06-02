import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useAdmin } from '../context/AdminContext'
import { useConfirm } from '../hooks/useConfirm'
import { AlertBanner, StatusBadge, ConfirmModal, FilterBar, Panel } from '../components/ui'
import DataTable from '../components/common/DataTable'

export default function Products() {
  const { products, removeProduct } = useAdmin()
  const { dialog, confirm, close, handleConfirm } = useConfirm()
  const [filter, setFilter] = useState('ALL')
  const [query, setQuery] = useState('')

  const flagged = products.filter(p => p.status === 'FLAGGED')

  const filtered = products.filter(p => {
    const matchFilter =
      filter === 'ALL'     ? true :
      filter === 'FLAGGED' ? p.status === 'FLAGGED' :
      p.category === filter
    const matchQuery = !query || p.name.toLowerCase().includes(query.toLowerCase()) || p.seller.toLowerCase().includes(query.toLowerCase())
    return matchFilter && matchQuery
  })

  const handleRemove = p => confirm({
    title: 'Remove Listing',
    body: `Remove "${p.name}" from the marketplace? The seller will be notified.`,
    confirmLabel: 'Remove',
    variant: 'danger',
    onConfirm: () => { removeProduct(p.id); toast.error(`"${p.name}" removed`) },
  })

  const filters = [
    { key: 'ALL',         label: `All (${products.length})` },
    { key: 'FLAGGED',     label: `Flagged (${flagged.length})` },
    { key: 'Electronics', label: 'Electronics' },
    { key: 'Food',        label: 'Food' },
    { key: 'Clothing',    label: 'Clothing' },
  ]

  const columns = [
    { key: 'name',     label: 'Product',  render: p => <span className="font-medium">{p.name}</span> },
    { key: 'seller',   label: 'Seller' },
    { key: 'category', label: 'Category', render: p => <span className="badge badge-gray" style={{ fontSize: 11 }}>{p.category}</span> },
    { key: 'price',    label: 'Price',    render: p => <span className="text-mono">{p.price}</span> },
    { key: 'status',   label: 'Status',   render: p => <StatusBadge status={p.status} /> },
    { key: 'flags',    label: 'Flags',    render: p => p.flags > 0 ? <span style={{ color: 'var(--red)', fontWeight: 600 }}>{p.flags} ⚑</span> : <span className="text-muted">—</span>, width: 70 },
    {
      key: 'actions', label: 'Actions',
      render: p => (
        <div className="action-btns">
          <button className="btn btn-sm btn-icon" title="View details">👁</button>
          <button className="btn btn-sm btn-danger" onClick={() => handleRemove(p)}>🗑 Remove</button>
        </div>
      ),
    },
  ]

  return (
    <>
      {flagged.length > 0 && (
        <AlertBanner
          type="danger" icon="⚑"
          title={`${flagged.length} flagged listing${flagged.length > 1 ? 's' : ''} need review`}
          body="These products have been reported by multiple users and may violate marketplace policies."
        />
      )}

      <Panel title="All Products">
        <FilterBar filters={filters} active={filter} onChange={setFilter}>
          <div className="search-wrap" style={{ marginLeft: 'auto' }}>
            <span style={{ fontSize: 13, color: 'var(--text3)' }}>🔍</span>
            <input placeholder="Search products or sellers..." value={query} onChange={e => setQuery(e.target.value)} />
          </div>
        </FilterBar>
        <DataTable
          columns={columns}
          rows={filtered}
          rowClass={p => p.status === 'FLAGGED' ? 'row-flagged' : ''}
          emptyTitle="No products found"
          emptyDesc="Try adjusting your filters"
        />
      </Panel>

      <ConfirmModal dialog={dialog} onClose={close} onConfirm={handleConfirm} />
    </>
  )
}
