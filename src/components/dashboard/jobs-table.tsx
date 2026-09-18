import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, PackageSearch } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { StatusBadge } from '@/components/dashboard/status-badge'
import { machines } from '@/lib/mock-data'
import type { SortDirection, SortKey } from '@/lib/job-filters'
import type { Job } from '@/lib/types'

const PAGE_SIZE = 9

function machineName(machineId: string): string {
  return machines.find((m) => m.id === machineId)?.name ?? 'Unassigned'
}

interface JobsTableProps {
  jobs: Job[]
  sortKey: SortKey
  sortDirection: SortDirection
  onToggleSort: (key: SortKey) => void
  onSelectJob: (jobId: string) => void
  onResetFilters: () => void
}

function SortIcon({ active, direction }: { active: boolean; direction: SortDirection }) {
  if (!active) return <ArrowUpDown className="h-3 w-3 opacity-50" />
  return direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
}

export function JobsTable({
  jobs,
  sortKey,
  sortDirection,
  onToggleSort,
  onSelectJob,
  onResetFilters,
}: JobsTableProps) {
  const [page, setPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(jobs.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageJobs = jobs.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border py-16">
        <PackageSearch className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">No jobs match your filters</p>
        <Button variant="outline" size="sm" onClick={onResetFilters}>
          Reset filters
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="hidden rounded-lg border border-border md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job ID</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="text-center">
                <button
                  className="flex w-full items-center justify-center gap-1"
                  onClick={() => onToggleSort('quantity')}
                >
                  Quantity
                  <SortIcon active={sortKey === 'quantity'} direction={sortDirection} />
                </button>
              </TableHead>
              <TableHead>
                <button
                  className="flex items-center gap-1"
                  onClick={() => onToggleSort('dueDate')}
                >
                  Due Date
                  <SortIcon active={sortKey === 'dueDate'} direction={sortDirection} />
                </button>
              </TableHead>
              <TableHead>Machine</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageJobs.map((job) => (
              <TableRow
                key={job.id}
                tabIndex={0}
                role="button"
                onClick={() => onSelectJob(job.id)}
                onKeyDown={(e) => e.key === 'Enter' && onSelectJob(job.id)}
                className="cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground"
              >
                <TableCell className="font-medium">{job.id}</TableCell>
                <TableCell className="max-w-48 truncate">{job.productName}</TableCell>
                <TableCell className="max-w-36 truncate">{job.customerName}</TableCell>
                <TableCell className="text-center">{job.quantity.toLocaleString()}</TableCell>
                <TableCell>{job.dueDate}</TableCell>
                <TableCell>{machineName(job.machineId)}</TableCell>
                <TableCell>
                  <StatusBadge status={job.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-2 md:hidden">
        {pageJobs.map((job) => (
          <div
            key={job.id}
            tabIndex={0}
            role="button"
            onClick={() => onSelectJob(job.id)}
            onKeyDown={(e) => e.key === 'Enter' && onSelectJob(job.id)}
            className="flex flex-col gap-1.5 rounded-lg border border-border p-3 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{job.id}</span>
              <StatusBadge status={job.status} />
            </div>
            <p className="truncate text-sm">{job.productName}</p>
            <p className="text-xs text-muted-foreground">{job.customerName}</p>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Qty {job.quantity.toLocaleString()}</span>
              <span>Due {job.dueDate}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === 1}
            onClick={() => setPage(currentPage - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === totalPages}
            onClick={() => setPage(currentPage + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  )
}
