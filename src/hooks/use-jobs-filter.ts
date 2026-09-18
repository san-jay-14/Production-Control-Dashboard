import { useEffect, useMemo, useState } from 'react'
import { filterJobs, searchJobs, sortJobs, type SortDirection, type SortKey } from '@/lib/job-filters'
import type { Job, JobStatus } from '@/lib/types'

export function useJobsFilter(jobs: Job[]) {
  const [searchInput, setSearchInput] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<JobStatus | 'all'>('all')
  const [sortKey, setSortKey] = useState<SortKey>('dueDate')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  useEffect(() => {
    const timeout = setTimeout(() => setSearchTerm(searchInput), 200)
    return () => clearTimeout(timeout)
  }, [searchInput])

  const visibleJobs = useMemo(
    () => sortJobs(searchJobs(filterJobs(jobs, statusFilter), searchTerm), sortKey, sortDirection),
    [jobs, statusFilter, searchTerm, sortKey, sortDirection],
  )

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  function reset() {
    setSearchInput('')
    setSearchTerm('')
    setStatusFilter('all')
  }

  return {
    searchInput,
    setSearchInput,
    statusFilter,
    setStatusFilter,
    sortKey,
    sortDirection,
    toggleSort,
    visibleJobs,
    reset,
  }
}
