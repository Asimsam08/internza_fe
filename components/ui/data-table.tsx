import * as React from "react"
import { cn } from "@/lib/utils"

interface Column<T> {
  key: string
  header: string
  width?: string
  render?: (item: T) => React.ReactNode
}

function readCell(item: unknown, key: string): unknown {
  if (item && typeof item === "object") {
    return (item as Record<string, unknown>)[key]
  }
  return undefined
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (item: T, index: number) => string | number
  emptyMessage?: string
  emptySubMessage?: string
  className?: string
  rowClassName?: string
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = "No data available",
  emptySubMessage,
  className,
  rowClassName,
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className={cn("rounded-xl border border-secondary-200 bg-white", className)}>
        <div className="p-8 sm:p-12 text-center">
          <p className="text-sm sm:text-base text-secondary-600">{emptyMessage}</p>
          {emptySubMessage && (
            <p className="text-xs sm:text-sm text-secondary-400 mt-1">{emptySubMessage}</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("rounded-xl border border-secondary-200 bg-white overflow-hidden", className)}>
      {/* Desktop Table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-secondary-50 text-secondary-700 border-b border-secondary-200">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={cn(
                    "px-4 py-3 font-semibold text-xs uppercase tracking-wider",
                    col.width
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary-100">
            {data.map((item, index) => (
              <tr
                key={keyExtractor(item, index)}
                className={cn(
                  "hover:bg-secondary-50/50 transition-colors",
                  rowClassName
                )}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-secondary-600">
                    {col.render
                      ? col.render(item)
                      : String(readCell(item, col.key) ?? "—")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden divide-y divide-secondary-100">
        {data.map((item, index) => (
          <div
            key={keyExtractor(item, index)}
            className={cn("p-4 hover:bg-secondary-50/50 transition-colors", rowClassName)}
          >
            {columns.map((col) => (
              <div key={col.key} className="flex justify-between py-1.5">
                <span className="text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  {col.header}
                </span>
                <span className="text-sm text-secondary-700 text-right">
                  {col.render
                    ? col.render(item)
                    : String(readCell(item, col.key) ?? "—")}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
