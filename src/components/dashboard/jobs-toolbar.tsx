import { Filter, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { SortDirection, SortKey } from '@/lib/job-filters'
import { JOB_STATUSES, type JobStatus } from '@/lib/types'

const sortOptions = [
  { value: 'dueDate-asc', key: 'dueDate', direction: 'asc', label: 'Due date (earliest)' },
  { value: 'dueDate-desc', key: 'dueDate', direction: 'desc', label: 'Due date (latest)' },
  { value: 'quantity-asc', key: 'quantity', direction: 'asc', label: 'Quantity (lowest)' },
  { value: 'quantity-desc', key: 'quantity', direction: 'desc', label: 'Quantity (highest)' },
] satisfies { value: string; key: SortKey; direction: SortDirection; label: string }[]

interface JobsToolbarProps {
  searchInput: string
  onSearchChange: (value: string) => void
  statusFilter: JobStatus | 'all'
  onStatusChange: (value: JobStatus | 'all') => void
  sortKey: SortKey
  sortDirection: SortDirection
  onSortChange: (key: SortKey, direction: SortDirection) => void
}

export function JobsToolbar({
  searchInput,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sortKey,
  sortDirection,
  onSortChange,
}: JobsToolbarProps) {
  return (
    <div className="flex shrink-0 gap-2">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search product, customer, or job ID"
          className="pl-8"
        />
      </div>
      <Select value={statusFilter} onValueChange={(v) => onStatusChange(v as JobStatus | 'all')}>
        <SelectTrigger aria-label="Filter by status" className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          {JOB_STATUSES.map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={`${sortKey}-${sortDirection}`}
        onValueChange={(v) => {
          const option = sortOptions.find((o) => o.value === v)
          if (option) onSortChange(option.key, option.direction)
        }}
      >
        <SelectTrigger
          aria-label="Sort jobs"
          showChevron={false}
          className="w-9 justify-center gap-0 border-none bg-foreground p-0 text-background md:hidden"
        >
          <Filter className="h-4 w-4" />
        </SelectTrigger>
        <SelectContent align="end">
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
