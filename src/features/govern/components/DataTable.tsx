import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface Column<T> {
  key: string
  header: string
  render: (row: T) => ReactNode
  headerClassName?: string
  cellClassName?: string
}

interface DataTableProps<T extends { id: string }> {
  columns: Column<T>[]
  rows: T[]
  mobileCard: (row: T) => ReactNode
  emptyMessage?: string
  rowClassName?: (row: T) => string
}

export function DataTable<T extends { id: string }>({
  columns,
  rows,
  mobileCard,
  emptyMessage = 'No data',
  rowClassName,
}: DataTableProps<T>) {
  if (rows.length === 0) {
    return <p className="text-muted-foreground text-sm py-8 text-center">{emptyMessage}</p>
  }
  return (
    <>
      <div className="hidden md:block bg-card border border-border rounded-sm overflow-hidden mb-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted">
              {columns.map(col => (
                <th key={col.key} className={cn('text-left px-4 py-3 text-[10px] uppercase tracking-widest text-muted-foreground font-semibold', col.headerClassName)}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.id} className={cn('border-b border-border last:border-0 hover:bg-muted/40 transition-colors duration-150', rowClassName?.(row))}>
                {columns.map(col => (
                  <td key={col.key} className={cn('px-4 py-3', col.cellClassName)}>
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="md:hidden space-y-3 mb-6">
        {rows.map(row => <div key={row.id}>{mobileCard(row)}</div>)}
      </div>
    </>
  )
}
