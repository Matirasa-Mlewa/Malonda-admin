import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Chart, registerables } from 'chart.js'
import { useAdmin } from '../context/AdminContext'
import { AlertBanner, MetricCard, Panel, TxBadge } from '../components/ui'
import { METRICS, CHART_DATA } from '../data/mockData'

Chart.register(...registerables)

export default function Dashboard() {
  const navigate = useNavigate()
  const { transactions, pendingCount, reports } = useAdmin()
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    if (!chartRef.current) return
    if (chartInstance.current) chartInstance.current.destroy()
    chartInstance.current = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels: CHART_DATA.labels,
        datasets: [{
          label: 'Transactions',
          data: CHART_DATA.values,
          backgroundColor: '#1d9e75',
          borderRadius: 5,
          borderSkipped: false,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { size: 11 }, color: '#7a7874' }, beginAtZero: true },
          x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#7a7874' } },
        },
      },
    })
    return () => chartInstance.current?.destroy()
  }, [])

  const highRiskReports = reports.filter(r => r.risk === 'HIGH' && r.status !== 'RESOLVED')

  return (
    <>
      {highRiskReports.length > 0 && (
        <AlertBanner
          type="danger"
          icon="⚠️"
          title={`${highRiskReports.length} high-risk fraud report${highRiskReports.length > 1 ? 's' : ''} require immediate review`}
          body="Multiple reports against the same user indicate a pattern of fraudulent activity."
          action={<button className="btn btn-danger btn-sm" onClick={() => navigate('/fraud')}>Review now</button>}
        />
      )}

      {/* Metrics */}
      <div className="metrics-grid">
        <MetricCard label="Total Users"        value={METRICS.totalUsers.toLocaleString()} delta="↑ +48 this week"  deltaType="up" />
        <MetricCard label="Verified Sellers"   value={METRICS.verifiedSellers}             delta="↑ +12 this week"  deltaType="up" valueColor="var(--blue)" />
        <MetricCard label="Active Listings"    value={METRICS.activeListings}              delta="↑ +24 today"      deltaType="up" />
        <MetricCard label="Transactions"       value={METRICS.totalTransactions.toLocaleString()} delta="↑ +18 today" deltaType="up" />
        <MetricCard label="Fraud Reports"      value={pendingCount.reports}                delta="⚠ action needed"  deltaType="down" valueColor="var(--red)" />
      </div>

      <div className="grid-2" style={{ marginBottom: 16 }}>
        {/* Chart */}
        <Panel title="Transaction volume — last 7 days">
          <div style={{ padding: '12px 16px', height: 180 }}>
            <canvas ref={chartRef} />
          </div>
        </Panel>

        {/* Pending actions */}
        <Panel title="Pending actions">
          <table>
            <thead><tr><th>Type</th><th>Count</th><th>Action</th></tr></thead>
            <tbody>
              {[
                { type: 'ID verifications',  count: pendingCount.verifications, cls: 'badge-amber', path: '/verify' },
                { type: 'Fraud reports',     count: pendingCount.reports,       cls: 'badge-red',   path: '/fraud' },
                { type: 'Open disputes',     count: pendingCount.disputes,      cls: 'badge-red',   path: '/disputes' },
                { type: 'Flagged products',  count: 1,                          cls: 'badge-amber', path: '/products' },
              ].map(item => (
                <tr key={item.type}>
                  <td>{item.type}</td>
                  <td><span className={`badge ${item.cls}`}>{item.count}</span></td>
                  <td><button className="btn btn-sm" onClick={() => navigate(item.path)}>Review</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>

      {/* Recent transactions */}
      <Panel title="Recent transactions" count="last 5">
        <table>
          <thead>
            <tr><th>Order ID</th><th>Buyer</th><th>Seller</th><th>Amount</th><th>Status</th><th>Date</th></tr>
          </thead>
          <tbody>
            {transactions.slice(0, 5).map(tx => (
              <tr key={tx.id} className={tx.status === 'ESCROWED' ? 'row-escrow' : ''}>
                <td className="text-mono">{tx.id}</td>
                <td>{tx.buyer}</td>
                <td>{tx.seller}</td>
                <td className="font-medium text-mono">{tx.amount}</td>
                <td><TxBadge status={tx.status} /></td>
                <td className="text-muted text-sm">{tx.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </>
  )
}
