import { AlertTriangle, CheckCircle2, Circle, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { JobStatus } from '@/lib/types'

const styles: Record<JobStatus, string> = {
  Pending: 'border border-slate-200 bg-slate-50 text-slate-600',
  'In Progress': 'border border-blue-200 bg-blue-50 text-blue-700',
  Delayed: 'border border-red-200 bg-red-50 text-red-700',
  Completed: 'border border-green-200 bg-green-50 text-green-700',
}

const icons: Record<JobStatus, typeof Circle> = {
  Pending: Circle,
  'In Progress': Clock,
  Delayed: AlertTriangle,
  Completed: CheckCircle2,
}

export function StatusBadge({ status }: { status: JobStatus }) {
  const Icon = icons[status]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        styles[status],
      )}
    >
      <Icon className="h-3 w-3" />
      {status}
    </span>
  )
}
