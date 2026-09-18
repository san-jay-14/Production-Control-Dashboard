import { Filter, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { SortKey } from '@/lib/job-filters'
import type { JobStatus } from '@/lib/types'

const statuses: JobStatus[] = ['Pending', 'In Progress', 'Delayed', 'Completed']

interface JobsToolbarProps {
  searchInput: string
  onSearchChange: (value: string) => void
  statusFilter: JobStatus | 'all'
  onStatusChange: (value: JobStatus | 'all') => void
  sortKey: SortKey
  onSortKeyChange: (value: SortKey) => void
}

export function JobsToolbar({
  searchInput,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sortKey,
  onSortKeyChange,
}: JobsToolbarProps) {
  return (
    <div className="flex gap-2">
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
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          {statuses.map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={sortKey} onValueChange={(v) => onSortKeyChange(v as SortKey)}>
        <SelectTrigger className="w-9 justify-center gap-0 border-none bg-foreground p-0 text-background md:hidden [&>svg:last-child]:hidden">
          <Filter className="h-4 w-4" />
        </SelectTrigger>
        <SelectContent align="end">
          <SelectItem value="dueDate">Sort by Due Date</SelectItem>
          <SelectItem value="quantity">Sort by Quantity</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
