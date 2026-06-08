import React, { useEffect, useState } from 'react';
import { useAdmin } from '../context/AdminContext';

function badge(level) {
  if (level === 'TRUSTED')  return <span style={{ background:'#faeeda', color:'#b45309', padding:'2px 8px', borderRadius:10, fontSize:11, fontWeight:600 }}>⭐ Trusted</span>;
  if (level === 'VERIFIED') return <span style={{ background:'#e1f5ee', color:'#0f6e56', padding:'2px 8px', borderRadius:10, fontSize:11, fontWeight:600 }}>✓ Verified</span>;
  return <span style={{ background:'#f4f3ef', color:'#5f5e5a', padding:'2px 8px', borderRadius:10, fontSize:11, fontWeight:600 }}>Basic</span>;
}

export default function Users() {
  const { users, fetchUsers, suspendUser, activateUser, dataLoading } = useAdmin();
  const [filter, setFilter] = useState('ALL');
  const [query, setQuery]   = useState('');
  const [confirm, setConfirm] = useState(null);

  useEffect(() => { fetchUsers(); }, []);

  const filtered = users.filter(u => {
    const matchF =
      filter === 'ALL'       ? true :
      filter === 'ACTIVE'    ? !u.isSuspended :
      filter === 'SUSPENDED' ? u.isSuspended :
      filter === 'VERIFIED'  ? u.verificationLevel !== 'BASIC' : true;
    const matchQ = !query || u.name?.toLowerCase().includes(query.toLowerCase()) || u.phone?.includes(query);
    return matchF && matchQ;
  });

  const doAction = async () => {
    if (!confirm) return;
    if (confirm.action === 'suspend') await suspendUser(confirm.id);
    else await activateUser(confirm.id);
    setConfirm(null);
    fetchUsers();
  };

  const filters = [
    { key: 'ALL',       label: `All (${users.length})` },
    { key: 'ACTIVE',    label: `Active (${users.filter(u=>!u.isSuspended).length})` },
    { key: 'SUSPENDED', label: `Suspended (${users.filter(u=>u.isSuspended).length})` },
    { key: 'VERIFIED',  label: 'Verified / Trusted' },
  ];

  const initials = (name = '') => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div>
      {confirm && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.45)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
          <div style={{ background:'white', borderRadius:12, border:'1px solid #e3e1d9', padding:24, width:360, boxShadow:'0 4px 12px rgba(0,0,0,.1)' }}>
            <div style={{ fontSize:15, fontWeight:600, marginBottom:10 }}>{confirm.action === 'suspend' ? 'Suspend User' : 'Activate User'}</div>
            <div style={{ fontSize:13, color:'#3d3b38', marginBottom:20, lineHeight:1.6 }}>
              {confirm.action === 'suspend'
                ? `Suspend ${confirm.name}? They cannot buy or sell until reinstated.`
                : `Restore ${confirm.name}'s account and allow them to use Malonda again?`}
            </div>
            <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
              <button onClick={() => setConfirm(null)} style={{ border:'1px solid #e3e1d9', background:'white', borderRadius:8, padding:'7px 14px', fontSize:13, cursor:'pointer' }}>Cancel</button>
              <button onClick={doAction} style={{ background: confirm.action === 'suspend' ? '#a32d2d' : '#0f6e56', color:'white', border:'none', borderRadius:8, padding:'7px 14px', fontSize:13, cursor:'pointer' }}>
                {confirm.action === 'suspend' ? 'Suspend' : 'Activate'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ background:'white', border:'1px solid #e3e1d9', borderRadius:12, overflow:'hidden' }}>
        {/* Filter bar */}
        <div style={{ display:'flex', gap:8, alignItems:'center', padding:'10px 16px', borderBottom:'1px solid #e3e1d9', flexWrap:'wrap' }}>
          {filters.map(f => (
            <span key={f.key} onClick={() => setFilter(f.key)}
              style={{ padding:'4px 11px', borderRadius:20, border:`1px solid ${filter===f.key?'#1d9e75':'#e3e1d9'}`, fontSize:12, cursor:'pointer', background:filter===f.key?'#e1f5ee':'white', color:filter===f.key?'#0f6e56':'#3d3b38', fontWeight:filter===f.key?500:400 }}>
              {f.label}
            </span>
          ))}
          <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:6, background:'#f4f3ef', border:'1px solid #e3e1d9', borderRadius:8, padding:'6px 11px' }}>
            <span style={{ fontSize:13, color:'#7a7874' }}>🔍</span>
            <input placeholder="Search name or phone…" value={query} onChange={e => setQuery(e.target.value)}
              style={{ border:'none', background:'transparent', fontSize:13, color:'#1a1916', outline:'none', width:180 }} />
          </div>
        </div>

        {dataLoading ? (
          <div style={{ padding:32, textAlign:'center', color:'#7a7874', fontSize:13 }}>Loading users…</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding:32, textAlign:'center', color:'#7a7874', fontSize:13 }}>No users found</div>
        ) : (
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
              <thead>
                <tr>{['User','Phone','Verification','Status','Role','Actions'].map(h => (
                  <th key={h} style={{ textAlign:'left', padding:'9px 14px', fontSize:11, fontWeight:600, color:'#7a7874', background:'#f4f3ef', borderBottom:'1px solid #e3e1d9', textTransform:'uppercase', letterSpacing:'.3px', whiteSpace:'nowrap' }}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id} style={{ background: u.isSuspended ? '#fef7f0' : 'white' }}>
                    <td style={{ padding:'10px 14px', borderBottom:'1px solid #e3e1d9' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                        <div style={{ width:30, height:30, borderRadius:'50%', background:'#e1f5ee', color:'#0f6e56', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:600, flexShrink:0 }}>{initials(u.name)}</div>
                        <div>
                          <div style={{ fontWeight:500, fontSize:13 }}>{u.name}</div>
                          <div style={{ fontSize:11, color:'#7a7874' }}>Joined {new Date(u.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding:'10px 14px', borderBottom:'1px solid #e3e1d9', fontFamily:'monospace', fontSize:12 }}>{u.phone}</td>
                    <td style={{ padding:'10px 14px', borderBottom:'1px solid #e3e1d9' }}>{badge(u.verificationLevel)}</td>
                    <td style={{ padding:'10px 14px', borderBottom:'1px solid #e3e1d9' }}>
                      <span style={{ background: u.isSuspended ? '#fcebeb' : '#e1f5ee', color: u.isSuspended ? '#a32d2d' : '#0f6e56', padding:'2px 8px', borderRadius:10, fontSize:11, fontWeight:600 }}>
                        {u.isSuspended ? 'Suspended' : 'Active'}
                      </span>
                    </td>
                    <td style={{ padding:'10px 14px', borderBottom:'1px solid #e3e1d9' }}>
                      <span style={{ fontSize:11, color:'#7a7874' }}>{u.role}</span>
                    </td>
                    <td style={{ padding:'10px 14px', borderBottom:'1px solid #e3e1d9' }}>
                      <div style={{ display:'flex', gap:5 }}>
                        {u.isSuspended
                          ? <button onClick={() => setConfirm({ id: u.id, name: u.name, action: 'activate' })} style={{ border:'1px solid #a3d9c3', color:'#0f6e56', background:'white', borderRadius:8, padding:'4px 10px', fontSize:12, cursor:'pointer' }}>Activate</button>
                          : <button onClick={() => setConfirm({ id: u.id, name: u.name, action: 'suspend' })} style={{ border:'1px solid #e8b4b4', color:'#a32d2d', background:'white', borderRadius:8, padding:'4px 10px', fontSize:12, cursor:'pointer' }}>Suspend</button>
                        }
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
