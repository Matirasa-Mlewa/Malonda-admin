import React, { useEffect, useState } from 'react';
import { useAdmin } from '../context/AdminContext';

export default function FraudReports() {
  const { reports, fetchReports, resolveReport, suspendUser, dataLoading } = useAdmin();
  const [filter, setFilter] = useState('ALL');
  const [confirm, setConfirm] = useState(null);

  useEffect(() => { fetchReports(); }, []);

  const filtered = reports.filter(r =>
    filter === 'ALL'      ? true :
    filter === 'PENDING'  ? r.status === 'PENDING' :
    filter === 'HIGH'     ? r.risk === 'HIGH' :
    filter === 'RESOLVED' ? r.status === 'RESOLVED' : true
  );

  const riskColor = (r) => r === 'HIGH' ? { bg:'#fcebeb', color:'#a32d2d' } : r === 'MEDIUM' ? { bg:'#faeeda', color:'#ba7517' } : { bg:'#e1f5ee', color:'#0f6e56' };
  const statusColor = (s) => s === 'RESOLVED' ? { bg:'#e1f5ee', color:'#0f6e56' } : s === 'UNDER REVIEW' ? { bg:'#e6f1fb', color:'#185fa5' } : { bg:'#faeeda', color:'#ba7517' };

  const doAction = async () => {
    if (!confirm) return;
    if (confirm.action === 'resolve') await resolveReport(confirm.id);
    else if (confirm.action === 'suspend') { await suspendUser(confirm.userId); await resolveReport(confirm.id); }
    setConfirm(null);
    fetchReports();
  };

  const highRisk = reports.filter(r => r.risk === 'HIGH' && r.status !== 'RESOLVED');
  const unresolved = reports.filter(r => r.status !== 'RESOLVED');

  return (
    <div>
      {confirm && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.45)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
          <div style={{ background:'white', borderRadius:12, border:'1px solid #e3e1d9', padding:24, width:380 }}>
            <div style={{ fontSize:15, fontWeight:600, marginBottom:10 }}>{confirm.title}</div>
            <div style={{ fontSize:13, color:'#3d3b38', marginBottom:20, lineHeight:1.6 }}>{confirm.body}</div>
            <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
              <button onClick={() => setConfirm(null)} style={{ border:'1px solid #e3e1d9', background:'white', borderRadius:8, padding:'7px 14px', fontSize:13, cursor:'pointer' }}>Cancel</button>
              <button onClick={doAction} style={{ background: confirm.variant === 'success' ? '#0f6e56' : '#a32d2d', color:'white', border:'none', borderRadius:8, padding:'7px 14px', fontSize:13, cursor:'pointer' }}>{confirm.label}</button>
            </div>
          </div>
        </div>
      )}

      {highRisk.length > 0 && (
        <div style={{ background:'#fcebeb', border:'1px solid #e8b4b4', borderRadius:12, padding:'12px 16px', display:'flex', gap:11, marginBottom:16 }}>
          <span style={{ fontSize:16 }}>⚠️</span>
          <div>
            <div style={{ fontSize:13, fontWeight:600, color:'#a32d2d', marginBottom:2 }}>{highRisk.length} high-risk reports require immediate action</div>
            <div style={{ fontSize:12, color:'#7a7874' }}>Multiple reports against the same user indicate a pattern of fraudulent behaviour.</div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:16 }}>
        {[
          { label:'Total Reports', value: reports.length, color:'#1a1916' },
          { label:'High Risk',     value: highRisk.length, color:'#a32d2d' },
          { label:'Resolved',      value: reports.filter(r=>r.status==='RESOLVED').length, color:'#0f6e56' },
        ].map(s => (
          <div key={s.label} style={{ background:'white', border:'1px solid #e3e1d9', borderRadius:12, padding:'14px 16px' }}>
            <div style={{ fontSize:11, color:'#7a7874', marginBottom:6, textTransform:'uppercase', letterSpacing:'.4px', fontWeight:500 }}>{s.label}</div>
            <div style={{ fontSize:26, fontWeight:700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background:'white', border:'1px solid #e3e1d9', borderRadius:12, overflow:'hidden' }}>
        <div style={{ display:'flex', gap:8, padding:'10px 16px', borderBottom:'1px solid #e3e1d9', flexWrap:'wrap' }}>
          {[
            { key:'ALL',      label:`All (${reports.length})` },
            { key:'PENDING',  label:`Pending (${reports.filter(r=>r.status==='PENDING').length})` },
            { key:'HIGH',     label:`High Risk (${highRisk.length})` },
            { key:'RESOLVED', label:`Resolved (${reports.filter(r=>r.status==='RESOLVED').length})` },
          ].map(f => (
            <span key={f.key} onClick={() => setFilter(f.key)}
              style={{ padding:'4px 11px', borderRadius:20, border:`1px solid ${filter===f.key?'#1d9e75':'#e3e1d9'}`, fontSize:12, cursor:'pointer', background:filter===f.key?'#e1f5ee':'white', color:filter===f.key?'#0f6e56':'#3d3b38', fontWeight:filter===f.key?500:400 }}>
              {f.label}
            </span>
          ))}
        </div>

        {dataLoading ? (
          <div style={{ padding:32, textAlign:'center', color:'#7a7874', fontSize:13 }}>Loading reports…</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding:32, textAlign:'center', color:'#7a7874', fontSize:13 }}>
            <div style={{ fontSize:32, marginBottom:8 }}>🛡️</div>No reports found
          </div>
        ) : (
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
              <thead>
                <tr>{['Reporter','Reported User','Reason','Risk','Status','Date','Actions'].map(h => (
                  <th key={h} style={{ textAlign:'left', padding:'9px 14px', fontSize:11, fontWeight:600, color:'#7a7874', background:'#f4f3ef', borderBottom:'1px solid #e3e1d9', textTransform:'uppercase', whiteSpace:'nowrap' }}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => {
                  const rc = riskColor(r.risk);
                  const sc = statusColor(r.status);
                  return (
                    <tr key={r.id || i} style={{ background: r.risk === 'HIGH' && r.status !== 'RESOLVED' ? '#fef7f0' : 'white' }}>
                      <td style={{ padding:'10px 14px', borderBottom:'1px solid #e3e1d9' }}>{r.reporter?.name || r.reporterId?.slice(0,8) || '—'}</td>
                      <td style={{ padding:'10px 14px', borderBottom:'1px solid #e3e1d9', fontWeight:500, color:'#a32d2d' }}>{r.reported?.name || r.reportedId?.slice(0,8) || '—'}</td>
                      <td style={{ padding:'10px 14px', borderBottom:'1px solid #e3e1d9', fontSize:12, color:'#7a7874', maxWidth:160 }}>{r.reason}</td>
                      <td style={{ padding:'10px 14px', borderBottom:'1px solid #e3e1d9' }}>
                        <span style={{ background:rc.bg, color:rc.color, padding:'2px 8px', borderRadius:10, fontSize:11, fontWeight:600 }}>{r.risk || 'MEDIUM'}</span>
                      </td>
                      <td style={{ padding:'10px 14px', borderBottom:'1px solid #e3e1d9' }}>
                        <span style={{ background:sc.bg, color:sc.color, padding:'2px 8px', borderRadius:10, fontSize:11, fontWeight:600 }}>{r.status}</span>
                      </td>
                      <td style={{ padding:'10px 14px', borderBottom:'1px solid #e3e1d9', fontSize:12, color:'#7a7874', whiteSpace:'nowrap' }}>{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—'}</td>
                      <td style={{ padding:'10px 14px', borderBottom:'1px solid #e3e1d9' }}>
                        {r.status !== 'RESOLVED' ? (
                          <div style={{ display:'flex', gap:5 }}>
                            <button onClick={() => setConfirm({ id:r.id, action:'resolve', title:'Resolve Report', body:`Mark report against "${r.reported?.name || 'user'}" as resolved?`, label:'Resolve', variant:'success' })}
                              style={{ border:'1px solid #a3d9c3', color:'#0f6e56', background:'white', borderRadius:8, padding:'4px 10px', fontSize:12, cursor:'pointer' }}>Resolve</button>
                            <button onClick={() => setConfirm({ id:r.id, userId:r.reportedId, action:'suspend', title:'Suspend User', body:`Suspend "${r.reported?.name || 'user'}" based on this fraud report?`, label:'Suspend', variant:'danger' })}
                              style={{ border:'1px solid #e8b4b4', color:'#a32d2d', background:'white', borderRadius:8, padding:'4px 10px', fontSize:12, cursor:'pointer' }}>Suspend</button>
                          </div>
                        ) : <span style={{ fontSize:12, color:'#7a7874' }}>Closed</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
