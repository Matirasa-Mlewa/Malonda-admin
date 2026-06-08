import React, { useEffect, useState } from 'react';
import { useAdmin } from '../context/AdminContext';

export default function Products() {
  const { products, fetchProducts, removeProduct, dataLoading } = useAdmin();
  const [filter, setFilter] = useState('ALL');
  const [query, setQuery]   = useState('');
  const [confirm, setConfirm] = useState(null);

  useEffect(() => { fetchProducts(); }, []);

  const filtered = products.filter(p => {
    const matchF = filter === 'ALL' ? true : filter === 'FLAGGED' ? p.status === 'FLAGGED' || p.status === 'SUSPENDED' : p.category === filter;
    const matchQ = !query || p.name?.toLowerCase().includes(query.toLowerCase()) || p.seller?.name?.toLowerCase().includes(query.toLowerCase());
    return matchF && matchQ;
  });

  const flagged = products.filter(p => p.status === 'FLAGGED' || p.status === 'SUSPENDED');

  const doRemove = async () => {
    if (!confirm) return;
    await removeProduct(confirm.id);
    setConfirm(null);
  };

  const statusStyle = (s) => ({
    ACTIVE:    { bg:'#e1f5ee', color:'#0f6e56', label:'Active' },
    FLAGGED:   { bg:'#fcebeb', color:'#a32d2d', label:'⚑ Flagged' },
    SUSPENDED: { bg:'#fcebeb', color:'#a32d2d', label:'Suspended' },
    DRAFT:     { bg:'#f4f3ef', color:'#5f5e5a', label:'Draft' },
    SOLD:      { bg:'#faeeda', color:'#ba7517', label:'Sold' },
  }[s] || { bg:'#f4f3ef', color:'#5f5e5a', label: s || 'Unknown' });

  return (
    <div>
      {confirm && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.45)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
          <div style={{ background:'white', borderRadius:12, border:'1px solid #e3e1d9', padding:24, width:380 }}>
            <div style={{ fontSize:15, fontWeight:600, marginBottom:10 }}>Remove Listing</div>
            <div style={{ fontSize:13, color:'#3d3b38', marginBottom:20, lineHeight:1.6 }}>Remove "{confirm.name}" from the marketplace? The seller will be notified.</div>
            <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
              <button onClick={() => setConfirm(null)} style={{ border:'1px solid #e3e1d9', background:'white', borderRadius:8, padding:'7px 14px', fontSize:13, cursor:'pointer' }}>Cancel</button>
              <button onClick={doRemove} style={{ background:'#a32d2d', color:'white', border:'none', borderRadius:8, padding:'7px 14px', fontSize:13, cursor:'pointer' }}>🗑 Remove</button>
            </div>
          </div>
        </div>
      )}

      {flagged.length > 0 && (
        <div style={{ background:'#fcebeb', border:'1px solid #e8b4b4', borderRadius:12, padding:'12px 16px', display:'flex', gap:11, marginBottom:16 }}>
          <span style={{ fontSize:16 }}>⚑</span>
          <div>
            <div style={{ fontSize:13, fontWeight:600, color:'#a32d2d', marginBottom:2 }}>{flagged.length} flagged listing{flagged.length > 1 ? 's' : ''} need review</div>
            <div style={{ fontSize:12, color:'#7a7874' }}>These products may violate marketplace policies.</div>
          </div>
        </div>
      )}

      <div style={{ background:'white', border:'1px solid #e3e1d9', borderRadius:12, overflow:'hidden' }}>
        <div style={{ display:'flex', gap:8, padding:'10px 16px', borderBottom:'1px solid #e3e1d9', flexWrap:'wrap', alignItems:'center' }}>
          {[
            { key:'ALL',     label:`All (${products.length})` },
            { key:'FLAGGED', label:`Flagged (${flagged.length})` },
            { key:'Electronics', label:'Electronics' },
            { key:'Food',    label:'Food' },
            { key:'Clothing',label:'Clothing' },
          ].map(f => (
            <span key={f.key} onClick={() => setFilter(f.key)}
              style={{ padding:'4px 11px', borderRadius:20, border:`1px solid ${filter===f.key?'#1d9e75':'#e3e1d9'}`, fontSize:12, cursor:'pointer', background:filter===f.key?'#e1f5ee':'white', color:filter===f.key?'#0f6e56':'#3d3b38', fontWeight:filter===f.key?500:400 }}>
              {f.label}
            </span>
          ))}
          <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:6, background:'#f4f3ef', border:'1px solid #e3e1d9', borderRadius:8, padding:'6px 11px' }}>
            <span style={{ fontSize:13, color:'#7a7874' }}>🔍</span>
            <input placeholder="Search products or sellers…" value={query} onChange={e => setQuery(e.target.value)}
              style={{ border:'none', background:'transparent', fontSize:13, color:'#1a1916', outline:'none', width:200 }} />
          </div>
        </div>

        {dataLoading ? (
          <div style={{ padding:32, textAlign:'center', color:'#7a7874', fontSize:13 }}>Loading products…</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding:32, textAlign:'center', color:'#7a7874', fontSize:13 }}>
            <div style={{ fontSize:32, marginBottom:8 }}>📦</div>No products found
          </div>
        ) : (
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
              <thead>
                <tr>{['Product','Seller','Category','Price','Status','Action'].map(h => (
                  <th key={h} style={{ textAlign:'left', padding:'9px 14px', fontSize:11, fontWeight:600, color:'#7a7874', background:'#f4f3ef', borderBottom:'1px solid #e3e1d9', textTransform:'uppercase', whiteSpace:'nowrap' }}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => {
                  const ss = statusStyle(p.status);
                  return (
                    <tr key={p.id || i} style={{ background: p.status === 'FLAGGED' || p.status === 'SUSPENDED' ? '#fef7f0' : 'white' }}>
                      <td style={{ padding:'10px 14px', borderBottom:'1px solid #e3e1d9', fontWeight:500 }}>{p.name}</td>
                      <td style={{ padding:'10px 14px', borderBottom:'1px solid #e3e1d9' }}>{p.seller?.name || '—'}</td>
                      <td style={{ padding:'10px 14px', borderBottom:'1px solid #e3e1d9' }}>
                        <span style={{ background:'#f4f3ef', color:'#5f5e5a', padding:'2px 8px', borderRadius:10, fontSize:11 }}>{p.category}</span>
                      </td>
                      <td style={{ padding:'10px 14px', borderBottom:'1px solid #e3e1d9', fontFamily:'monospace', fontSize:12 }}>MK {Number(p.price||0).toLocaleString()}</td>
                      <td style={{ padding:'10px 14px', borderBottom:'1px solid #e3e1d9' }}>
                        <span style={{ background:ss.bg, color:ss.color, padding:'2px 8px', borderRadius:10, fontSize:11, fontWeight:600 }}>{ss.label}</span>
                      </td>
                      <td style={{ padding:'10px 14px', borderBottom:'1px solid #e3e1d9' }}>
                        <button onClick={() => setConfirm({ id:p.id, name:p.name })}
                          style={{ border:'1px solid #e8b4b4', color:'#a32d2d', background:'white', borderRadius:8, padding:'4px 10px', fontSize:12, cursor:'pointer' }}>🗑 Remove</button>
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
