import { isDueToday } from '@/lib/job-filters'
import type { Job } from '@/lib/types'

export function SummaryCards({ jobs }: { jobs: Job[] }) {
  const total = jobs.length
  const delayed = jobs.filter((j) => j.status === 'Delayed').length
  const dueToday = jobs.filter(isDueToday).length
  const completed = jobs.filter((j) => j.status === 'Completed').length

  const cards = [
    { label: 'Total Jobs', value: total },
    { label: 'Delayed', value: delayed },
    { label: 'Due Today', value: dueToday },
    { label: 'Completed', value: completed },
  ]

  return (
    <div className="grid grid-cols-4 gap-2">
      {cards.map(({ label, value }) => (
        <div
          key={label}
          className="flex flex-col items-center justify-center rounded-xl border border-border p-3 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-md"
        >
          <span className="text-2xl font-bold">{value}</span>
          <span className="mt-0.5 text-xs text-muted-foreground">{label}</span>
        </div>
      ))}
    </div>
  )
}
