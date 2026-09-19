import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, PackageSearch } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { StatusBadge } from '@/components/dashboard/status-badge'
import { DueDate } from '@/components/dashboard/due-date'
import { machineName } from '@/lib/machines'
import type { SortDirection, SortKey } from '@/lib/job-filters'
import type { Job } from '@/lib/types'

interface JobsTableProps {
  jobs: Job[]
  sortKey: SortKey
  sortDirection: SortDirection
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  onToggleSort: (key: SortKey) => void
  onSelectJob: (jobId: string) => void
  onResetFilters: () => void
}

function SortIcon({ active, direction }: { active: boolean; direction: SortDirection }) {
  if (!active) return <ArrowUpDown className="h-3 w-3 opacity-50" />
  return direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
}

function ariaSort(active: boolean, direction: SortDirection): 'ascending' | 'descending' | 'none' {
  if (!active) return 'none'
  return direction === 'asc' ? 'ascending' : 'descending'
}

export function JobsTable({
  jobs,
  sortKey,
  sortDirection,
  page,
  totalPages,
  onPageChange,
  onToggleSort,
  onSelectJob,
  onResetFilters,
}: JobsTableProps) {
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
      <div className="hidden min-h-0 flex-1 overflow-auto rounded-lg border border-border md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job ID</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead
                className="text-center"
                aria-sort={ariaSort(sortKey === 'quantity', sortDirection)}
              >
                <button
                  className="flex w-full items-center justify-center gap-1 rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground"
                  onClick={() => onToggleSort('quantity')}
                >
                  Quantity
                  <SortIcon active={sortKey === 'quantity'} direction={sortDirection} />
                </button>
              </TableHead>
              <TableHead aria-sort={ariaSort(sortKey === 'dueDate', sortDirection)}>
                <button
                  className="flex items-center gap-1 rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground"
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
            {jobs.map((job) => (
              <TableRow key={job.id} onClick={() => onSelectJob(job.id)} className="cursor-pointer">
                <TableCell className="font-medium">
                  <button
                    type="button"
                    aria-haspopup="dialog"
                    onClick={() => onSelectJob(job.id)}
                    className="rounded-sm underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground"
                  >
                    {job.id}
                  </button>
                </TableCell>
                <TableCell className="max-w-48 truncate">{job.productName}</TableCell>
                <TableCell className="max-w-36 truncate">{job.customerName}</TableCell>
                <TableCell className="text-center">{job.quantity.toLocaleString()}</TableCell>
                <TableCell>
                  <DueDate job={job} />
                </TableCell>
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
        {jobs.map((job) => (
          <button
            key={job.id}
            type="button"
            aria-haspopup="dialog"
            onClick={() => onSelectJob(job.id)}
            className="flex w-full flex-col gap-1.5 rounded-lg border border-border p-3 text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground"
          >
            <span className="flex items-center justify-between">
              <span className="text-sm font-medium">{job.id}</span>
              <StatusBadge status={job.status} />
            </span>
            <span className="block truncate text-sm">{job.productName}</span>
            <span className="block truncate text-xs text-muted-foreground">
              {job.customerName} · {machineName(job.machineId)}
            </span>
            <span className="flex justify-between text-xs text-muted-foreground">
              <span>Qty {job.quantity.toLocaleString()}</span>
              <span>
                Due <DueDate job={job} />
              </span>
            </span>
          </button>
        ))}
      </div>

      <div className="mt-3 flex shrink-0 items-center justify-between text-sm text-muted-foreground">
        <span aria-live="polite">
          Page {page} of {totalPages}
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            aria-label="Previous page"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="Next page"
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  )
}
