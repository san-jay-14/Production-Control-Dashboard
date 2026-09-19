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

function compareBy(a: Job, b: Job, sortKey: SortKey): number {
  switch (sortKey) {
    case 'quantity':
      return a.quantity - b.quantity
    case 'dueDate':
      return a.dueDate.localeCompare(b.dueDate)
  }
}

export function sortJobs(jobs: Job[], sortKey: SortKey, sortDirection: SortDirection): Job[] {
  const direction = sortDirection === 'asc' ? 1 : -1
  return [...jobs].sort((a, b) => compareBy(a, b, sortKey) * direction)
}

export function isOverdue(job: Job): boolean {
  return job.dueDate < todayISO() && job.status !== 'Completed'
}

export function isDueToday(job: Job): boolean {
  return job.dueDate === todayISO() && job.status !== 'Completed'
}
