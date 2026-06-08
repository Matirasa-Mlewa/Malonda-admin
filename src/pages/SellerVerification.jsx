import React, { useEffect, useState } from 'react';
import { useAdmin } from '../context/AdminContext';

export default function SellerVerification() {
  const { verifications, fetchVerifications, approveVerify, rejectVerify, dataLoading } = useAdmin();
  const [confirm, setConfirm] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => { fetchVerifications(); }, []);

  const handleApprove = (v) => setConfirm({ type: 'approve', v });
  const handleReject  = (v) => setConfirm({ type: 'reject',  v });

  const doAction = async () => {
    if (!confirm) return;
    if (confirm.type === 'approve') {
      await approveVerify(confirm.v.userId);
    } else {
      await rejectVerify(confirm.v.userId, rejectReason || 'Documents unclear');
    }
    setConfirm(null);
    setRejectReason('');
  };

  const initials = (name = '') => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div>
      {/* Confirm modal */}
      {confirm && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.45)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
          <div style={{ background:'white', borderRadius:12, border:'1px solid #e3e1d9', padding:24, width:380, boxShadow:'0 4px 12px rgba(0,0,0,.1)' }}>
            <div style={{ fontSize:15, fontWeight:600, marginBottom:10 }}>
              {confirm.type === 'approve' ? 'Approve Verification' : 'Reject Verification'}
            </div>
            <div style={{ fontSize:13, color:'#3d3b38', marginBottom:14, lineHeight:1.6 }}>
              {confirm.type === 'approve'
                ? `Grant ${confirm.v.user?.name} the Verified badge? This allows them to sell on Malonda.`
                : `Reject ${confirm.v.user?.name}'s ID? They will be notified to resubmit.`}
            </div>
            {confirm.type === 'reject' && (
              <div style={{ marginBottom:16 }}>
                <label style={{ fontSize:12, color:'#7a7874', display:'block', marginBottom:5 }}>Rejection reason</label>
                <input value={rejectReason} onChange={e => setRejectReason(e.target.value)}
                  placeholder="e.g. ID photo is blurry"
                  style={{ width:'100%', padding:'9px 12px', border:'1px solid #e3e1d9', borderRadius:8, fontSize:13, outline:'none', fontFamily:'inherit' }} />
              </div>
            )}
            <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
              <button onClick={() => { setConfirm(null); setRejectReason(''); }}
                style={{ border:'1px solid #e3e1d9', background:'white', borderRadius:8, padding:'7px 14px', fontSize:13, cursor:'pointer' }}>Cancel</button>
              <button onClick={doAction}
                style={{ background: confirm.type === 'approve' ? '#0f6e56' : '#a32d2d', color:'white', border:'none', borderRadius:8, padding:'7px 14px', fontSize:13, cursor:'pointer' }}>
                {confirm.type === 'approve' ? '✓ Approve' : '✗ Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info banner */}
      <div style={{ background:'#e6f1fb', border:'1px solid #a8c8ef', borderRadius:12, padding:'12px 16px', display:'flex', gap:11, alignItems:'flex-start', marginBottom:16 }}>
        <span style={{ fontSize:16 }}>🪪</span>
        <div>
          <div style={{ fontSize:13, fontWeight:600, color:'#185fa5', marginBottom:2 }}>
            {verifications.length > 0 ? `${verifications.length} pending ID verification${verifications.length > 1 ? 's' : ''}` : 'All verifications reviewed'}
          </div>
          <div style={{ fontSize:12, color:'#7a7874' }}>Review each submission carefully. Ensure the selfie matches the National ID photo before approving.</div>
        </div>
      </div>

      <div style={{ background:'white', border:'1px solid #e3e1d9', borderRadius:12, overflow:'hidden' }}>
        <div style={{ padding:'13px 16px', borderBottom:'1px solid #e3e1d9', display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:13, fontWeight:600 }}>Pending Verifications</span>
          <span style={{ fontSize:11, color:'#7a7874' }}>{verifications.length} pending</span>
        </div>

        {dataLoading ? (
          <div style={{ padding:32, textAlign:'center', color:'#7a7874', fontSize:13 }}>Loading verifications…</div>
        ) : verifications.length === 0 ? (
          <div style={{ padding:36, textAlign:'center', color:'#7a7874', fontSize:13 }}>
            <div style={{ fontSize:36, marginBottom:10 }}>✅</div>
            <div style={{ fontWeight:600, marginBottom:4 }}>All caught up!</div>
            <div>No pending verifications at the moment.</div>
          </div>
        ) : (
          <div style={{ padding:'14px 16px', display:'flex', flexDirection:'column', gap:14 }}>
            {verifications.map(v => (
              <div key={v.id} style={{ border:'1px solid #e3e1d9', borderRadius:12, padding:16 }}>
                {/* User info */}
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
                  <div style={{ width:42, height:42, borderRadius:'50%', background:'#e6f1fb', color:'#185fa5', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:600, flexShrink:0 }}>
                    {initials(v.user?.name)}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:600, fontSize:14 }}>{v.user?.name || 'Unknown'}</div>
                    <div style={{ fontSize:11, color:'#7a7874' }}>{v.user?.phone}</div>
                    <div style={{ fontSize:11, color:'#7a7874' }}>ID: <span style={{ fontFamily:'monospace' }}>{v.nationalIdNo || 'Not provided'}</span></div>
                    <div style={{ fontSize:11, color:'#7a7874' }}>Submitted {new Date(v.submittedAt).toLocaleString()}</div>
                  </div>
                  <span style={{ background: v.status === 'PENDING' ? '#faeeda' : '#e1f5ee', color: v.status === 'PENDING' ? '#b45309' : '#0f6e56', padding:'2px 8px', borderRadius:10, fontSize:11, fontWeight:600 }}>
                    {v.status}
                  </span>
                </div>

                {/* ID & Selfie images */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
                  <div>
                    <div style={{ fontSize:11, color:'#7a7874', marginBottom:5 }}>National ID (front)</div>
                    {v.nationalIdUrl ? (
                      <a href={v.nationalIdUrl} target="_blank" rel="noopener noreferrer">
                        <img src={v.nationalIdUrl} alt="National ID" style={{ width:'100%', borderRadius:8, border:'1px solid #e3e1d9', maxHeight:120, objectFit:'cover', cursor:'pointer' }} />
                      </a>
                    ) : (
                      <div style={{ background:'#f4f3ef', border:'1px solid #e3e1d9', borderRadius:8, height:90, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, color:'#7a7874' }}>No ID uploaded</div>
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize:11, color:'#7a7874', marginBottom:5 }}>Selfie photo</div>
                    {v.selfieUrl ? (
                      <a href={v.selfieUrl} target="_blank" rel="noopener noreferrer">
                        <img src={v.selfieUrl} alt="Selfie" style={{ width:'100%', borderRadius:8, border:'1px solid #e3e1d9', maxHeight:120, objectFit:'cover', cursor:'pointer' }} />
                      </a>
                    ) : (
                      <div style={{ background:'#f4f3ef', border:'1px solid #e3e1d9', borderRadius:8, height:90, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, color:'#7a7874' }}>No selfie uploaded</div>
                    )}
                  </div>
                  {v.nationalIdBack && (
                    <div>
                      <div style={{ fontSize:11, color:'#7a7874', marginBottom:5 }}>National ID (back)</div>
                      <a href={v.nationalIdBack} target="_blank" rel="noopener noreferrer">
                        <img src={v.nationalIdBack} alt="National ID Back" style={{ width:'100%', borderRadius:8, border:'1px solid #e3e1d9', maxHeight:120, objectFit:'cover', cursor:'pointer' }} />
                      </a>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display:'flex', gap:8 }}>
                  <button onClick={() => handleApprove(v)}
                    style={{ background:'#0f6e56', color:'white', border:'none', borderRadius:8, padding:'8px 16px', fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}>
                    ✓ Approve — Grant Verified badge
                  </button>
                  <button onClick={() => handleReject(v)}
                    style={{ border:'1px solid #e8b4b4', color:'#a32d2d', background:'white', borderRadius:8, padding:'8px 14px', fontSize:13, cursor:'pointer' }}>
                    ✗ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
