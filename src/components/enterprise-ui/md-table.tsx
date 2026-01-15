"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown, ChevronUp, ChevronsUpDown, ChevronLeft, ChevronRight } from "lucide-react"

export interface Column<T> {
  key: keyof T | string
  title: string
  width?: number | string
  align?: "left" | "center" | "right"
  sortable?: boolean
  render?: (value: unknown, record: T, index: number) => React.ReactNode
}

export interface MdTableProps<T> {
  columns: Column<T>[]
  data: T[]
  rowKey?: keyof T | ((record: T) => string)
  loading?: boolean
  striped?: boolean
  bordered?: boolean
  hoverable?: boolean
  size?: "sm" | "md" | "lg"
  pagination?: {
    current: number
    pageSize: number
    total: number
    onChange: (page: number, pageSize: number) => void
  }
  onSort?: (key: string, direction: "asc" | "desc" | null) => void
  emptyText?: string
  className?: string
}

export function MdTable<T extends Record<string, unknown>>({
  columns,
  data,
  rowKey = "id" as keyof T,
  loading,
  striped = true,
  bordered,
  hoverable = true,
  size = "md",
  pagination,
  onSort,
  emptyText = "暂无数据",
  className,
}: MdTableProps<T>) {
  const [sortKey, setSortKey] = React.useState<string | null>(null)
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc" | null>(null)

  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }

  const cellPaddingClasses = {
    sm: "px-3 py-2",
    md: "px-4 py-3",
    lg: "px-6 py-4",
  }

  const getRowKey = (record: T, index: number): string => {
    if (typeof rowKey === "function") {
      return rowKey(record)
    }
    return String(record[rowKey]) || String(index)
  }

  const handleSort = (key: string) => {
    let newDirection: "asc" | "desc" | null = "asc"
    if (sortKey === key) {
      if (sortDirection === "asc") newDirection = "desc"
      else if (sortDirection === "desc") newDirection = null
    }
    setSortKey(newDirection ? key : null)
    setSortDirection(newDirection)
    onSort?.(key, newDirection)
  }

  const totalPages = pagination ? Math.ceil(pagination.total / pagination.pageSize) : 0

  return (
    <div className={cn("w-full", className)}>
      <div className="overflow-x-auto rounded-lg border border-border shadow-sm">
        <table className={cn("w-full", sizeClasses[size])}>
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={cn(
                    cellPaddingClasses[size],
                    "font-semibold text-foreground",
                    column.align === "center" && "text-center",
                    column.align === "right" && "text-right",
                    column.sortable && "cursor-pointer select-none hover:bg-muted transition-colors",
                    bordered && "border-r border-border last:border-r-0",
                  )}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(String(column.key))}
                >
                  <div
                    className={cn(
                      "flex items-center gap-1",
                      column.align === "center" && "justify-center",
                      column.align === "right" && "justify-end",
                    )}
                  >
                    {column.title}
                    {column.sortable && (
                      <span className="text-muted-foreground">
                        {sortKey === column.key ? (
                          sortDirection === "asc" ? (
                            <ChevronUp className="h-4 w-4 text-primary" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-primary" />
                          )
                        ) : (
                          <ChevronsUpDown className="h-4 w-4" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className={cn(cellPaddingClasses[size], "text-center")}>
                  <div className="flex items-center justify-center gap-2 py-8">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <span className="text-muted-foreground">加载中...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className={cn(cellPaddingClasses[size], "text-center text-muted-foreground py-12")}
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              data.map((record, index) => (
                <tr
                  key={getRowKey(record, index)}
                  className={cn(
                    "border-b border-border last:border-b-0 transition-colors",
                    striped && index % 2 === 1 && "bg-muted/30",
                    hoverable && "hover:bg-primary-light",
                  )}
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className={cn(
                        cellPaddingClasses[size],
                        column.align === "center" && "text-center",
                        column.align === "right" && "text-right",
                        bordered && "border-r border-border last:border-r-0",
                      )}
                    >
                      {column.render
                        ? column.render(record[column.key as keyof T], record, index)
                        : String(record[column.key as keyof T] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between px-4 py-3 bg-card border-t border-border">
          <span className="text-sm text-muted-foreground">共 {pagination.total} 条</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={pagination.current === 1}
              onClick={() => pagination.onChange(pagination.current - 1, pagination.pageSize)}
              className="p-1.5 rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (pagination.current <= 3) {
                  pageNum = i + 1
                } else if (pagination.current >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = pagination.current - 2 + i
                }
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => pagination.onChange(pageNum, pagination.pageSize)}
                    className={cn(
                      "h-8 w-8 rounded-md text-sm font-medium transition-colors",
                      pagination.current === pageNum ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                    )}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>
            <button
              type="button"
              disabled={pagination.current === totalPages}
              onClick={() => pagination.onChange(pagination.current + 1, pagination.pageSize)}
              className="p-1.5 rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
