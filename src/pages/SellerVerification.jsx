import React from 'react'
import toast from 'react-hot-toast'
import { useAdmin } from '../context/AdminContext'
import { useConfirm } from '../hooks/useConfirm'
import { AlertBanner, RiskBadge, EmptyState, ConfirmModal } from '../components/ui'

export default function SellerVerification() {
  const { verifications, approveVerify, rejectVerify } = useAdmin()
  const { dialog, confirm, close, handleConfirm } = useConfirm()

  const handleApprove = v => confirm({
    title: 'Approve Verification',
    body:  `Grant ${v.name} the Verified badge? This allows them to sell on Malonda.`,
    confirmLabel: 'Approve',
    variant: 'success',
    onConfirm: () => { approveVerify(v.id); toast.success(`${v.name} is now Verified ✓`) },
  })

  const handleReject = v => confirm({
    title: 'Reject Verification',
    body:  `Reject ${v.name}'s ID? They will be notified and asked to resubmit.`,
    confirmLabel: 'Reject',
    variant: 'danger',
    onConfirm: () => { rejectVerify(v.id); toast.error(`${v.name}'s verification rejected`) },
  })

  return (
    <>
      {verifications.length > 0 && (
        <AlertBanner
          type="info" icon="🪪"
          title={`${verifications.length} pending ID verification${verifications.length > 1 ? 's' : ''}`}
          body="Review each submission carefully before approving. Check that the selfie matches the National ID photo."
        />
      )}

      <div className="panel">
        <div className="panel-head">
          <span className="panel-title">Pending Verifications</span>
          <span className="panel-count">{verifications.length} pending</span>
        </div>

        {verifications.length === 0
          ? <EmptyState icon="✅" title="All caught up!" desc="No pending verifications at the moment." />
          : (
            <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {verifications.map(v => (
                <div key={v.id} style={{ border: '1px solid var(--gray-border)', borderRadius: 'var(--radius-lg)', padding: 16 }}>
                  {/* Header */}
                  <div className="flex-between mb-12">
                    <div className="flex-row">
                      <div className="avatar av-blue" style={{ width: 38, height: 38, fontSize: 13 }}>
                        {v.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-semibold" style={{ fontSize: 14 }}>{v.name}</div>
                        <div className="text-xs text-muted">{v.phone}</div>
                        <div className="text-xs text-muted">ID: <span className="text-mono">{v.idNo}</span></div>
                        <div className="text-xs text-muted">Submitted {v.submitted}</div>
                      </div>
                    </div>
                    <RiskBadge risk={v.risk} />
                  </div>

                  {/* ID & Selfie preview */}
                  <div className="grid-2 mb-12">
                    <div>
                      <div className="text-xs text-muted mb-4">National ID (front)</div>
                      <div className="id-preview">🪪</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted mb-4">Selfie photo</div>
                      <div className="id-preview">🤳</div>
                    </div>
                  </div>

                  {v.risk === 'MEDIUM' && (
                    <div className="alert-banner alert-warn mb-12">
                      <span className="alert-icon">⚠️</span>
                      <div><div className="alert-title" style={{ color: 'var(--amber)' }}>Medium risk — verify carefully</div><div className="alert-body">Ensure face in selfie clearly matches the ID photo.</div></div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="action-btns">
                    <button className="btn btn-success" onClick={() => handleApprove(v)}>
                      ✓ Approve — Grant Verified badge
                    </button>
                    <button className="btn btn-danger" onClick={() => handleReject(v)}>
                      ✗ Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>

      <ConfirmModal dialog={dialog} onClose={close} onConfirm={handleConfirm} />
    </>
  )
}
