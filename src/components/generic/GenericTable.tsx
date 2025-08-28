'use client'
import * as React from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/shadcn/ui/table'
import { Input } from '../shadcn/ui/input'
import { Text } from './Text'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  className?: string
  tableClassName?: string
  hasFilter?: boolean
  filterColumn?: string //TODO: type filter props so when hasFilter = true you have to provide them
  filterPlaceholder?: string
  filterInputRowTitle?: string
  filterInputRowButton?: React.ReactNode
  noResultPlaceholder?: string
  enableRowSelection?: boolean
  // eslint-disable-next-line no-unused-vars
  onSelectionChange?: (selectedRows: TData[]) => void
}

export function GenericTable<TData, TValue>({
  columns,
  data,
  className,
  tableClassName,
  hasFilter = false,
  filterColumn,
  filterPlaceholder,
  filterInputRowTitle,
  filterInputRowButton,
  noResultPlaceholder,
  enableRowSelection,
  onSelectionChange
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      rowSelection
    },
    enableRowSelection: enableRowSelection ?? false,
    onRowSelectionChange: (updater) => {
      if (enableRowSelection) {
        setRowSelection(updater)
        if (onSelectionChange) {
          const newSelection = typeof updater === 'function' ? updater(rowSelection) : updater
          const selectedRows = table
            .getPreFilteredRowModel()
            .rows.filter((row) => newSelection[row.id])
            .map((row) => row.original)
          onSelectionChange(selectedRows)
        }
      }
    }
  })

  return (
    <div className={`w-full h-full flex flex-col items-end gap-4 ${className ?? ''}`}>
      {hasFilter && (
        <div className="w-full flex flex-row justify-between items-center">
          {filterInputRowTitle && (
            <Text size="xl" style="semibold">
              {`${filterInputRowTitle || 'Title'} (${table.getRowCount()})`}
            </Text>
          )}
          {filterInputRowButton && filterInputRowButton}
          <Input
            placeholder={filterPlaceholder}
            value={(table.getColumn(filterColumn!)?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn(filterColumn!)?.setFilterValue(event.target.value)}
            className="!w-1/3"
          />
        </div>
      )}
      <Table className={tableClassName ?? ''}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {noResultPlaceholder ? noResultPlaceholder : 'No results'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
