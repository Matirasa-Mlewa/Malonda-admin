import React from 'react'
import toast from 'react-hot-toast'
import { useAdmin } from '../context/AdminContext'
import { useConfirm } from '../hooks/useConfirm'
import { AlertBanner, StatusBadge, TxBadge, EmptyState, ConfirmModal } from '../components/ui'

export default function Disputes() {
  const { disputes, closeDispute } = useAdmin()
  const { dialog, confirm, close, handleConfirm } = useConfirm()

  const open = disputes.filter(d => d.status !== 'CLOSED')

  const handleRefund = d => confirm({
    title: 'Refund Buyer',
    body: `Release the escrowed ${d.amount} back to ${d.buyer}? This is irreversible. Only proceed if you are satisfied the seller failed to deliver.`,
    confirmLabel: 'Refund Buyer',
    variant: 'danger',
    onConfirm: () => { closeDispute(d.id); toast.success(`Refund of ${d.amount} issued to ${d.buyer}`) },
  })

  const handleRelease = d => confirm({
    title: 'Release Payment to Seller',
    body: `Release ${d.amount} from escrow to ${d.seller}? Only do this if you are satisfied the item was delivered as described.`,
    confirmLabel: 'Release Payment',
    variant: 'success',
    onConfirm: () => { closeDispute(d.id); toast.success(`Payment of ${d.amount} released to ${d.seller}`) },
  })

  return (
    <>
      {open.length > 0 ? (
        <AlertBanner
          type="warn" icon="⚖️"
          title="Escrow funds are held pending dispute resolution"
          body="Do not release payment until you have reviewed evidence from both parties and are confident in your decision. This action is irreversible."
        />
      ) : (
        <AlertBanner
          type="success" icon="✅"
          title="No open disputes"
          body="All disputes have been resolved. Marketplace is operating smoothly."
        />
      )}

      {/* Stats */}
      <div className="grid-3 mb-16">
        <div className="metric-card">
          <div className="metric-label">Total Disputes</div>
          <div className="metric-value">{disputes.length}</div>
          <div className="metric-delta delta-down">{open.length} still open</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Total in Escrow</div>
          <div className="metric-value" style={{ color: 'var(--blue)', fontSize: 20 }}>
            MK 57,500
          </div>
          <div className="metric-delta" style={{ color: 'var(--blue)' }}>🔒 Held pending resolution</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Avg Resolution Time</div>
          <div className="metric-value" style={{ fontSize: 20 }}>36h</div>
          <div className="metric-delta delta-up">Target: under 48h</div>
        </div>
      </div>

      {disputes.length === 0
        ? <div className="panel"><EmptyState icon="⚖️" title="No disputes" desc="Nothing to review right now." /></div>
        : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {disputes.map(d => (
              <div key={d.id} className="panel">
                {/* Panel header */}
                <div className="panel-head">
                  <div>
                    <div className="font-semibold" style={{ fontSize: 14 }}>
                      {d.id} — Order <span className="text-mono">{d.order}</span>
                    </div>
                    <div className="text-xs text-muted" style={{ marginTop: 2 }}>Opened {d.opened}</div>
                  </div>
                  <StatusBadge status={d.status} />
                </div>

                <div style={{ padding: '14px 16px' }}>
                  {/* Buyer / Seller */}
                  <div className="grid-2 mb-12">
                    <div>
                      <div className="text-xs text-muted mb-4">Buyer</div>
                      <div className="flex-row">
                        <div className="avatar av-blue" style={{ width: 28, height: 28, fontSize: 10 }}>
                          {d.buyer.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="font-semibold" style={{ fontSize: 13 }}>{d.buyer}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted mb-4">Seller</div>
                      <div className="flex-row">
                        <div className="avatar av-amber" style={{ width: 28, height: 28, fontSize: 10 }}>
                          {d.seller.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="font-semibold" style={{ fontSize: 13 }}>{d.seller}</span>
                      </div>
                    </div>
                  </div>

                  {/* Issue description */}
                  <div style={{ background: 'var(--gray-light)', borderRadius: 'var(--radius)', padding: '10px 13px', marginBottom: 14, fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, borderLeft: '3px solid var(--amber)' }}>
                    💬 {d.issue}
                  </div>

                  {/* Escrow amount + actions */}
                  <div className="flex-between">
                    <div className="flex-row">
                      <span className="text-sm text-muted">Escrowed:</span>
                      <span className="font-semibold text-mono">{d.amount}</span>
                      <TxBadge status="ESCROWED" />
                    </div>

                    {d.status !== 'CLOSED' ? (
                      <div className="action-btns">
                        <button className="btn btn-sm" title="View evidence">📎 Evidence</button>
                        <button className="btn btn-sm btn-danger"  onClick={() => handleRefund(d)}>↩ Refund Buyer</button>
                        <button className="btn btn-sm btn-success" onClick={() => handleRelease(d)}>→ Release to Seller</button>
                      </div>
                    ) : (
                      <span className="badge badge-gray">Closed</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      <ConfirmModal dialog={dialog} onClose={close} onConfirm={handleConfirm} />
    </>
  )
}
