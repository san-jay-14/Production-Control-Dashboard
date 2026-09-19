import { AlertTriangle } from 'lucide-react'
import { formatDate } from '@/lib/date'
import { isOverdue } from '@/lib/job-filters'
import type { Job } from '@/lib/types'

export function DueDate({ job }: { job: Job }) {
  const formatted = formatDate(job.dueDate)

  if (!isOverdue(job)) return formatted

  return (
    <span className="inline-flex items-center gap-1 font-medium text-destructive">
      <AlertTriangle className="h-3 w-3 shrink-0" aria-hidden="true" />
      {formatted}
      <span className="sr-only">(overdue)</span>
    </span>
  )
}
