import { todayISO } from './date'
import type { Job, JobStatus } from './types'

export function filterJobs(jobs: Job[], statusFilter: JobStatus | 'all'): Job[] {
  if (statusFilter === 'all') return jobs
  return jobs.filter((job) => job.status === statusFilter)
}

export function searchJobs(jobs: Job[], searchTerm: string): Job[] {
  const term = searchTerm.trim().toLowerCase()
  if (!term) return jobs
  return jobs.filter(
    (job) =>
      job.productName.toLowerCase().includes(term) ||
      job.customerName.toLowerCase().includes(term) ||
      job.id.toLowerCase().includes(term),
  )
}

export type SortKey = 'dueDate' | 'quantity'
export type SortDirection = 'asc' | 'desc'

export function sortJobs(jobs: Job[], sortKey: SortKey, sortDirection: SortDirection): Job[] {
  const sorted = [...jobs].sort((a, b) => {
    if (sortKey === 'quantity') return a.quantity - b.quantity
    return a.dueDate.localeCompare(b.dueDate)
  })
  return sortDirection === 'asc' ? sorted : sorted.reverse()
}

export function isOverdue(job: Job): boolean {
  return job.dueDate < todayISO() && job.status !== 'Completed'
}

export function isDueToday(job: Job): boolean {
  return job.dueDate === todayISO() && job.status !== 'Completed'
}
