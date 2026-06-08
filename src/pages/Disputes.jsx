import React, { useEffect, useState } from 'react';
import { useAdmin } from '../context/AdminContext';

export default function Disputes() {
  const { disputes, fetchDisputes, closeDispute, dataLoading } = useAdmin();
  const [confirm, setConfirm] = useState(null);

  useEffect(() => { fetchDisputes(); }, []);

  const open = disputes.filter(d => d.status !== 'CLOSED' && d.status !== 'COMPLETED' && d.status !== 'REFUNDED');

  const doAction = async () => {
    if (!confirm) return;
    await closeDispute(confirm.id, confirm.decision);
    setConfirm(null);
    fetchDisputes();
  };

  return (
    <div>
      {confirm && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.45)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
          <div style={{ background:'white', borderRadius:12, border:'1px solid #e3e1d9', padding:24, width:400 }}>
            <div style={{ fontSize:15, fontWeight:600, marginBottom:10 }}>{confirm.title}</div>
            <div style={{ fontSize:13, color:'#3d3b38', marginBottom:20, lineHeight:1.6 }}>{confirm.body}</div>
            <div style={{ background:'#faeeda', border:'1px solid #e5c98a', borderRadius:8, padding:'10px 12px', marginBottom:16, fontSize:12, color:'#92400e' }}>
              ⚠️ This action is irreversible and will release escrow funds.
            </div>
            <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
              <button onClick={() => setConfirm(null)} style={{ border:'1px solid #e3e1d9', background:'white', borderRadius:8, padding:'7px 14px', fontSize:13, cursor:'pointer' }}>Cancel</button>
              <button onClick={doAction} style={{ background: confirm.decision === 'release' ? '#0f6e56' : '#a32d2d', color:'white', border:'none', borderRadius:8, padding:'7px 14px', fontSize:13, cursor:'pointer' }}>{confirm.label}</button>
            </div>
          </div>
        </div>
      )}

      {open.length > 0 ? (
        <div style={{ background:'#faeeda', border:'1px solid #e5c98a', borderRadius:12, padding:'12px 16px', display:'flex', gap:11, marginBottom:16 }}>
          <span style={{ fontSize:16 }}>⚖️</span>
          <div>
            <div style={{ fontSize:13, fontWeight:600, color:'#ba7517', marginBottom:2 }}>Escrow funds held pending dispute resolution</div>
            <div style={{ fontSize:12, color:'#7a7874' }}>Do not release payment until you have reviewed evidence from both parties. This action is irreversible.</div>
          </div>
        </div>
      ) : (
        <div style={{ background:'#e1f5ee', border:'1px solid #a3d9c3', borderRadius:12, padding:'12px 16px', display:'flex', gap:11, marginBottom:16 }}>
          <span style={{ fontSize:16 }}>✅</span>
          <div style={{ fontSize:13, fontWeight:600, color:'#0f6e56' }}>No open disputes — marketplace operating smoothly</div>
        </div>
      )}

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:16 }}>
        <div style={{ background:'white', border:'1px solid #e3e1d9', borderRadius:12, padding:'14px 16px' }}>
          <div style={{ fontSize:11, color:'#7a7874', marginBottom:6, textTransform:'uppercase', fontWeight:500 }}>Total Disputes</div>
          <div style={{ fontSize:26, fontWeight:700 }}>{disputes.length}</div>
          <div style={{ fontSize:11, color: open.length > 0 ? '#a32d2d' : '#0f6e56', marginTop:6 }}>{open.length} still open</div>
        </div>
        <div style={{ background:'white', border:'1px solid #e3e1d9', borderRadius:12, padding:'14px 16px' }}>
          <div style={{ fontSize:11, color:'#7a7874', marginBottom:6, textTransform:'uppercase', fontWeight:500 }}>Open Disputes</div>
          <div style={{ fontSize:26, fontWeight:700, color: open.length > 0 ? '#a32d2d' : '#0f6e56' }}>{open.length}</div>
          <div style={{ fontSize:11, color:'#185fa5', marginTop:6 }}>🔒 Funds in escrow</div>
        </div>
        <div style={{ background:'white', border:'1px solid #e3e1d9', borderRadius:12, padding:'14px 16px' }}>
          <div style={{ fontSize:11, color:'#7a7874', marginBottom:6, textTransform:'uppercase', fontWeight:500 }}>Resolved</div>
          <div style={{ fontSize:26, fontWeight:700, color:'#0f6e56' }}>{disputes.length - open.length}</div>
          <div style={{ fontSize:11, color:'#0f6e56', marginTop:6 }}>Closed</div>
        </div>
      </div>

      {dataLoading ? (
        <div style={{ background:'white', border:'1px solid #e3e1d9', borderRadius:12, padding:32, textAlign:'center', color:'#7a7874', fontSize:13 }}>Loading disputes…</div>
      ) : disputes.length === 0 ? (
        <div style={{ background:'white', border:'1px solid #e3e1d9', borderRadius:12, padding:36, textAlign:'center', color:'#7a7874', fontSize:13 }}>
          <div style={{ fontSize:36, marginBottom:10 }}>⚖️</div>No disputes found
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {disputes.map((d, i) => {
            const isClosed = ['CLOSED','COMPLETED','REFUNDED'].includes(d.status);
            const statusStyle = isClosed
              ? { bg:'#f4f3ef', color:'#5f5e5a' }
              : d.status === 'DISPUTED' ? { bg:'#fcebeb', color:'#a32d2d' }
              : { bg:'#faeeda', color:'#ba7517' };

            return (
              <div key={d.id || i} style={{ background:'white', border:'1px solid #e3e1d9', borderRadius:12, overflow:'hidden' }}>
                <div style={{ padding:'13px 16px', borderBottom:'1px solid #e3e1d9', display:'flex', alignItems:'center', gap:8 }}>
                  <div>
                    <div style={{ fontWeight:600, fontSize:14 }}>Order #{d.id?.slice(-8).toUpperCase() || '—'}</div>
                    <div style={{ fontSize:11, color:'#7a7874', marginTop:2 }}>Opened {d.createdAt ? new Date(d.createdAt).toLocaleDateString() : '—'}</div>
                  </div>
                  <span style={{ marginLeft:'auto', background:statusStyle.bg, color:statusStyle.color, padding:'2px 10px', borderRadius:10, fontSize:11, fontWeight:600 }}>{d.status}</span>
                </div>

                <div style={{ padding:'14px 16px' }}>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
                    <div>
                      <div style={{ fontSize:11, color:'#7a7874', marginBottom:4 }}>Buyer</div>
                      <div style={{ fontWeight:600, fontSize:13 }}>{d.buyer?.name || d.buyerId?.slice(0,12) || '—'}</div>
                      <div style={{ fontSize:11, color:'#7a7874' }}>{d.buyer?.phone || ''}</div>
                    </div>
                    <div>
                      <div style={{ fontSize:11, color:'#7a7874', marginBottom:4 }}>Seller</div>
                      <div style={{ fontWeight:600, fontSize:13 }}>{d.seller?.name || d.sellerId?.slice(0,12) || '—'}</div>
                      <div style={{ fontSize:11, color:'#7a7874' }}>{d.seller?.phone || ''}</div>
                    </div>
                  </div>

                  {d.disputeReason && (
                    <div style={{ background:'#f4f3ef', borderRadius:8, padding:'10px 13px', marginBottom:14, fontSize:13, color:'#3d3b38', lineHeight:1.6, borderLeft:'3px solid #ba7517' }}>
                      💬 {d.disputeReason}
                    </div>
                  )}

                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <span style={{ fontSize:12, color:'#7a7874' }}>Escrowed:</span>
                      <span style={{ fontWeight:600, fontFamily:'monospace', fontSize:13 }}>MK {Number(d.totalAmount || 0).toLocaleString()}</span>
                      <span style={{ background:'#e6f1fb', color:'#185fa5', padding:'1px 8px', borderRadius:10, fontSize:11, fontWeight:600 }}>🔒 Held</span>
                    </div>

                    {!isClosed ? (
                      <div style={{ display:'flex', gap:8 }}>
                        <button onClick={() => setConfirm({ id:d.id, decision:'refund', title:'Refund Buyer', body:`Release MK ${Number(d.totalAmount||0).toLocaleString()} back to ${d.buyer?.name || 'buyer'}? Only proceed if the seller failed to deliver.`, label:'↩ Refund Buyer', variant:'danger' })}
                          style={{ border:'1px solid #e8b4b4', color:'#a32d2d', background:'white', borderRadius:8, padding:'7px 12px', fontSize:13, cursor:'pointer' }}>↩ Refund Buyer</button>
                        <button onClick={() => setConfirm({ id:d.id, decision:'release', title:'Release to Seller', body:`Release MK ${Number(d.totalAmount||0).toLocaleString()} to ${d.seller?.name || 'seller'}? Only proceed if satisfied the item was delivered.`, label:'→ Release Payment', variant:'success' })}
                          style={{ background:'#0f6e56', color:'white', border:'none', borderRadius:8, padding:'7px 12px', fontSize:13, cursor:'pointer' }}>→ Release to Seller</button>
                      </div>
                    ) : (
                      <span style={{ fontSize:12, color:'#7a7874' }}>Dispute closed</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
