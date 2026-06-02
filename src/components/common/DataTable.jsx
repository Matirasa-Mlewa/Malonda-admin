import React from 'react'
import { EmptyState } from '../ui'

/**
 * Generic DataTable
 * columns: [{ key, label, render?, width? }]
 * rows: array of data objects
 * rowClass: optional fn(row) => className
 */
export default function DataTable({ columns, rows, rowClass, emptyIcon, emptyTitle, emptyDesc }) {
  if (!rows || rows.length === 0) {
    return <EmptyState icon={emptyIcon || '📭'} title={emptyTitle || 'No data'} desc={emptyDesc} />
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key} style={col.width ? { width: col.width } : {}}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.id || i} className={rowClass ? rowClass(row) : ''}>
              {columns.map(col => (
                <td key={col.key}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
