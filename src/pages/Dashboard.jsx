import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chart, registerables } from 'chart.js';
import { useAdmin } from '../context/AdminContext';

Chart.register(...registerables);

function MetricCard({ label, value, delta, deltaType = 'up', valueColor, loading }) {
  return (
    <div style={{ background: 'white', border: '1px solid #e3e1d9', borderRadius: 12, padding: '14px 16px' }}>
      <div style={{ fontSize: 11, color: '#7a7874', fontWeight: 500, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.4px' }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, lineHeight: 1, color: valueColor || '#1a1916' }}>
        {loading ? <span style={{ color: '#e3e1d9' }}>—</span> : (value ?? '—')}
      </div>
      {delta && <div style={{ fontSize: 11, marginTop: 6, color: deltaType === 'up' ? '#0f6e56' : deltaType === 'down' ? '#a32d2d' : '#ba7517' }}>{delta}</div>}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { stats, reports, fetchStats, fetchReports, transactions, fetchTransactions, dataLoading } = useAdmin();
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    fetchStats();
    fetchReports();
    fetchTransactions();
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();
    chartInstance.current = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{ label: 'Transactions', data: [42, 58, 35, 71, 63, 88, 54], backgroundColor: '#1d9e75', borderRadius: 5, borderSkipped: false }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { size: 11 }, color: '#7a7874' }, beginAtZero: true },
          x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#7a7874' } },
        },
      },
    });
    return () => chartInstance.current?.destroy();
  }, []);

  const highRisk = (reports || []).filter(r => r.risk === 'HIGH' && r.status !== 'RESOLVED');
  const pendingReports = (reports || []).filter(r => r.status !== 'RESOLVED').length;
  const recentTx = (transactions || []).slice(0, 5);

  const txStatusColor = (s) => s === 'SUCCESS' ? '#0f6e56' : s === 'PENDING' ? '#ba7517' : s === 'FAILED' ? '#a32d2d' : '#185fa5';

  return (
    <div>
      {highRisk.length > 0 && (
        <div style={{ background: '#fcebeb', border: '1px solid #e8b4b4', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: 11, marginBottom: 16 }}>
          <span style={{ fontSize: 16 }}>⚠️</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#a32d2d', marginBottom: 2 }}>{highRisk.length} high-risk fraud report{highRisk.length > 1 ? 's' : ''} require immediate review</div>
            <div style={{ fontSize: 12, color: '#7a7874' }}>Multiple reports against the same user indicate a pattern of fraudulent behaviour.</div>
          </div>
          <button onClick={() => navigate('/fraud')} style={{ background: '#a32d2d', color: 'white', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap' }}>Review now</button>
        </div>
      )}

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12, marginBottom: 18 }}>
        <MetricCard label="Total Users"      value={stats?.users?.toLocaleString()}         delta="↑ Live count"    deltaType="up"   loading={!stats} />
        <MetricCard label="Verified Sellers" value={stats?.verifiedSellers}                  delta="Active sellers"  deltaType="up"   loading={!stats} valueColor="#185fa5" />
        <MetricCard label="Active Listings"  value={stats?.products?.toLocaleString()}       delta="On marketplace"  deltaType="up"   loading={!stats} />
        <MetricCard label="Transactions"     value={stats?.orders?.toLocaleString()}         delta="Total orders"    deltaType="up"   loading={!stats} />
        <MetricCard label="Fraud Reports"    value={pendingReports}                          delta="⚠ Unresolved"   deltaType="down" loading={dataLoading} valueColor="#a32d2d" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Chart */}
        <div style={{ background: 'white', border: '1px solid #e3e1d9', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '13px 16px', borderBottom: '1px solid #e3e1d9', fontSize: 13, fontWeight: 600 }}>Transaction volume — last 7 days</div>
          <div style={{ padding: '12px 16px', height: 180 }}><canvas ref={chartRef} /></div>
        </div>

        {/* Pending actions */}
        <div style={{ background: 'white', border: '1px solid #e3e1d9', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '13px 16px', borderBottom: '1px solid #e3e1d9', fontSize: 13, fontWeight: 600 }}>Pending actions</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead><tr>{['Type','Count','Action'].map(h => <th key={h} style={{ textAlign:'left', padding:'9px 14px', fontSize:11, fontWeight:600, color:'#7a7874', background:'#f4f3ef', borderBottom:'1px solid #e3e1d9', textTransform:'uppercase', letterSpacing:'.3px' }}>{h}</th>)}</tr></thead>
            <tbody>
              {[
                { type: 'ID verifications', count: stats?.pendingVerifications ?? '—', path: '/verify', cls: 'amber' },
                { type: 'Fraud reports',    count: pendingReports,                     path: '/fraud',  cls: 'red' },
                { type: 'Open disputes',    count: stats?.disputes ?? '—',             path: '/disputes',cls: 'red' },
              ].map(item => (
                <tr key={item.type}>
                  <td style={{ padding: '10px 14px', borderBottom: '1px solid #e3e1d9' }}>{item.type}</td>
                  <td style={{ padding: '10px 14px', borderBottom: '1px solid #e3e1d9' }}>
                    <span style={{ background: item.cls === 'red' ? '#fcebeb' : '#faeeda', color: item.cls === 'red' ? '#a32d2d' : '#ba7517', padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 600 }}>{item.count}</span>
                  </td>
                  <td style={{ padding: '10px 14px', borderBottom: '1px solid #e3e1d9' }}>
                    <button onClick={() => navigate(item.path)} style={{ border: '1px solid #e3e1d9', background: 'white', borderRadius: 8, padding: '4px 10px', fontSize: 12, cursor: 'pointer' }}>Review</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent transactions */}
      <div style={{ background: 'white', border: '1px solid #e3e1d9', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '13px 16px', borderBottom: '1px solid #e3e1d9', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Recent Transactions</span>
          <span style={{ fontSize: 11, color: '#7a7874' }}>live from database</span>
        </div>
        {dataLoading ? (
          <div style={{ padding: 24, textAlign: 'center', color: '#7a7874', fontSize: 13 }}>Loading transactions…</div>
        ) : recentTx.length === 0 ? (
          <div style={{ padding: 24, textAlign: 'center', color: '#7a7874', fontSize: 13 }}>No transactions yet</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead><tr>{['Order ID','Buyer','Seller','Amount','Status','Date'].map(h => <th key={h} style={{ textAlign:'left', padding:'9px 14px', fontSize:11, fontWeight:600, color:'#7a7874', background:'#f4f3ef', borderBottom:'1px solid #e3e1d9', textTransform:'uppercase' }}>{h}</th>)}</tr></thead>
            <tbody>
              {recentTx.map((tx, i) => (
                <tr key={tx.id || i} style={{ background: tx.status === 'PENDING' ? '#eef5fc' : 'white' }}>
                  <td style={{ padding:'10px 14px', borderBottom:'1px solid #e3e1d9', fontFamily:'monospace', fontSize:12 }}>{tx.orderId ? tx.orderId.slice(-8).toUpperCase() : tx.id?.slice(-8)}</td>
                  <td style={{ padding:'10px 14px', borderBottom:'1px solid #e3e1d9' }}>{tx.user?.name || '—'}</td>
                  <td style={{ padding:'10px 14px', borderBottom:'1px solid #e3e1d9' }}>{tx.order?.sellerId?.slice(0,8) || '—'}</td>
                  <td style={{ padding:'10px 14px', borderBottom:'1px solid #e3e1d9', fontWeight:500, fontFamily:'monospace', fontSize:12 }}>MK {Number(tx.amount || 0).toLocaleString()}</td>
                  <td style={{ padding:'10px 14px', borderBottom:'1px solid #e3e1d9' }}>
                    <span style={{ background: txStatusColor(tx.status) + '22', color: txStatusColor(tx.status), padding:'2px 8px', borderRadius:10, fontSize:11, fontWeight:600 }}>{tx.status}</span>
                  </td>
                  <td style={{ padding:'10px 14px', borderBottom:'1px solid #e3e1d9', fontSize:12, color:'#7a7874' }}>{tx.initiatedAt ? new Date(tx.initiatedAt).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
