import React, { useEffect, useState } from 'react';
import { useAdmin } from '../context/AdminContext';

export default function Transactions() {
  const { transactions, fetchTransactions, dataLoading } = useAdmin();
  const [filter, setFilter] = useState('ALL');
  const [query, setQuery]   = useState('');

  useEffect(() => { fetchTransactions(); }, []);

  const filtered = transactions.filter(t => {
    const matchF = filter === 'ALL' ? true : t.status === filter;
    const matchQ = !query || t.orderId?.includes(query) || t.user?.name?.toLowerCase().includes(query.toLowerCase());
    return matchF && matchQ;
  });

  const escrowed  = transactions.filter(t => t.status === 'PENDING');
  const completed = transactions.filter(t => t.status === 'SUCCESS');
  const total     = transactions.reduce((s, t) => s + Number(t.amount || 0), 0);

  const statusStyle = (s) => ({
    SUCCESS: { bg:'#e1f5ee', color:'#0f6e56', label:'Completed' },
    PENDING: { bg:'#e6f1fb', color:'#185fa5', label:'🔒 Escrow' },
    FAILED:  { bg:'#fcebeb', color:'#a32d2d', label:'Failed' },
    REFUNDED:{ bg:'#faeeda', color:'#ba7517', label:'Refunded' },
  }[s] || { bg:'#f4f3ef', color:'#5f5e5a', label: s });

  return (
    <div>
      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:16 }}>
        <div style={{ background:'white', border:'1px solid #e3e1d9', borderRadius:12, padding:'14px 16px' }}>
          <div style={{ fontSize:11, color:'#7a7874', marginBottom:6, textTransform:'uppercase', fontWeight:500 }}>Total Volume</div>
          <div style={{ fontSize:22, fontWeight:700 }}>MK {total.toLocaleString()}</div>
          <div style={{ fontSize:11, color:'#0f6e56', marginTop:6 }}>All transactions</div>
        </div>
        <div style={{ background:'white', border:'1px solid #e3e1d9', borderRadius:12, padding:'14px 16px' }}>
          <div style={{ fontSize:11, color:'#7a7874', marginBottom:6, textTransform:'uppercase', fontWeight:500 }}>In Escrow / Pending</div>
          <div style={{ fontSize:22, fontWeight:700, color:'#185fa5' }}>{escrowed.length}</div>
          <div style={{ fontSize:11, color:'#185fa5', marginTop:6 }}>🔒 Awaiting delivery confirmation</div>
        </div>
        <div style={{ background:'white', border:'1px solid #e3e1d9', borderRadius:12, padding:'14px 16px' }}>
          <div style={{ fontSize:11, color:'#7a7874', marginBottom:6, textTransform:'uppercase', fontWeight:500 }}>Completed</div>
          <div style={{ fontSize:22, fontWeight:700, color:'#0f6e56' }}>{completed.length}</div>
          <div style={{ fontSize:11, color:'#0f6e56', marginTop:6 }}>Successfully paid</div>
        </div>
      </div>

      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
        <div style={{ width:12, height:12, background:'#eef5fc', border:'1px solid #185fa5', borderRadius:3 }} />
        <span style={{ fontSize:12, color:'#7a7874' }}>Blue rows = funds in escrow (not yet released to seller)</span>
      </div>

      <div style={{ background:'white', border:'1px solid #e3e1d9', borderRadius:12, overflow:'hidden' }}>
        <div style={{ display:'flex', gap:8, padding:'10px 16px', borderBottom:'1px solid #e3e1d9', flexWrap:'wrap', alignItems:'center' }}>
          {[
            { key:'ALL',     label:`All (${transactions.length})` },
            { key:'PENDING', label:`Escrow (${escrowed.length})` },
            { key:'SUCCESS', label:`Completed (${completed.length})` },
            { key:'FAILED',  label:`Failed (${transactions.filter(t=>t.status==='FAILED').length})` },
          ].map(f => (
            <span key={f.key} onClick={() => setFilter(f.key)}
              style={{ padding:'4px 11px', borderRadius:20, border:`1px solid ${filter===f.key?'#1d9e75':'#e3e1d9'}`, fontSize:12, cursor:'pointer', background:filter===f.key?'#e1f5ee':'white', color:filter===f.key?'#0f6e56':'#3d3b38', fontWeight:filter===f.key?500:400 }}>
              {f.label}
            </span>
          ))}
          <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:6, background:'#f4f3ef', border:'1px solid #e3e1d9', borderRadius:8, padding:'6px 11px' }}>
            <span style={{ fontSize:13, color:'#7a7874' }}>🔍</span>
            <input placeholder="Search order or buyer…" value={query} onChange={e => setQuery(e.target.value)}
              style={{ border:'none', background:'transparent', fontSize:13, color:'#1a1916', outline:'none', width:180 }} />
          </div>
        </div>

        {dataLoading ? (
          <div style={{ padding:32, textAlign:'center', color:'#7a7874', fontSize:13 }}>Loading transactions…</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding:32, textAlign:'center', color:'#7a7874', fontSize:13 }}>
            <div style={{ fontSize:32, marginBottom:8 }}>💳</div>No transactions found
          </div>
        ) : (
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
              <thead>
                <tr>{['Transaction ID','User','Method','Amount','Status','Date'].map(h => (
                  <th key={h} style={{ textAlign:'left', padding:'9px 14px', fontSize:11, fontWeight:600, color:'#7a7874', background:'#f4f3ef', borderBottom:'1px solid #e3e1d9', textTransform:'uppercase', whiteSpace:'nowrap' }}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {filtered.map((tx, i) => {
                  const ss = statusStyle(tx.status);
                  return (
                    <tr key={tx.id || i} style={{ background: tx.status === 'PENDING' ? '#eef5fc' : 'white' }}>
                      <td style={{ padding:'10px 14px', borderBottom:'1px solid #e3e1d9', fontFamily:'monospace', fontSize:12 }}>{(tx.id || tx.transactionId || '—').slice(-12)}</td>
                      <td style={{ padding:'10px 14px', borderBottom:'1px solid #e3e1d9', fontWeight:500 }}>{tx.user?.name || '—'}</td>
                      <td style={{ padding:'10px 14px', borderBottom:'1px solid #e3e1d9', fontSize:12 }}>{tx.method?.replace('_',' ') || '—'}</td>
                      <td style={{ padding:'10px 14px', borderBottom:'1px solid #e3e1d9', fontWeight:500, fontFamily:'monospace', fontSize:12 }}>MK {Number(tx.amount||0).toLocaleString()}</td>
                      <td style={{ padding:'10px 14px', borderBottom:'1px solid #e3e1d9' }}>
                        <span style={{ background:ss.bg, color:ss.color, padding:'2px 8px', borderRadius:10, fontSize:11, fontWeight:600 }}>{ss.label}</span>
                      </td>
                      <td style={{ padding:'10px 14px', borderBottom:'1px solid #e3e1d9', fontSize:12, color:'#7a7874', whiteSpace:'nowrap' }}>{tx.initiatedAt ? new Date(tx.initiatedAt).toLocaleDateString() : '—'}</td>
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
