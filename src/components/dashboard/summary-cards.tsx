import { isDueToday, isOverdue } from '@/lib/job-filters'
import { cn } from '@/lib/utils'
import type { Job } from '@/lib/types'

export function SummaryCards({ jobs, loading = false }: { jobs: Job[]; loading?: boolean }) {
  const overdue = jobs.filter(isOverdue).length

  const cards = [
    { label: 'Total Jobs', value: jobs.length },
    { label: 'Delayed', value: jobs.filter((j) => j.status === 'Delayed').length },
    { label: 'Overdue', value: overdue, alert: overdue > 0 },
    { label: 'Due Today', value: jobs.filter(isDueToday).length },
    { label: 'Completed', value: jobs.filter((j) => j.status === 'Completed').length },
  ]

  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
      {cards.map(({ label, value, alert }) => (
        <div
          key={label}
          className="flex flex-col items-center justify-center rounded-xl border border-border p-3 text-center"
        >
          {loading ? (
            <span className="my-1.5 h-5 w-8 animate-pulse rounded-full bg-muted" />
          ) : (
            <span className={cn('text-2xl font-bold', alert && 'text-destructive')}>{value}</span>
          )}
          <span className="mt-0.5 text-xs text-muted-foreground">{label}</span>
        </div>
      ))}
    </div>
  )
}
