import { useEffect, useMemo, useState } from 'react'
import { filterJobs, searchJobs, sortJobs, type SortDirection, type SortKey } from '@/lib/job-filters'
import type { Job, JobStatus } from '@/lib/types'

const PAGE_SIZE = 9

export function useJobsFilter(jobs: Job[]) {
  const [searchInput, setSearchInput] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<JobStatus | 'all'>('all')
  const [sortKey, setSortKey] = useState<SortKey>('dueDate')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [page, setPage] = useState(1)

  useEffect(() => {
    const timeout = setTimeout(() => setSearchTerm(searchInput), 200)
    return () => clearTimeout(timeout)
  }, [searchInput])

  const filterSignature = JSON.stringify([searchTerm, statusFilter, sortKey, sortDirection])
  const [lastSignature, setLastSignature] = useState(filterSignature)
  if (lastSignature !== filterSignature) {
    setLastSignature(filterSignature)
    setPage(1)
  }

  const visibleJobs = useMemo(
    () => sortJobs(searchJobs(filterJobs(jobs, statusFilter), searchTerm), sortKey, sortDirection),
    [jobs, statusFilter, searchTerm, sortKey, sortDirection],
  )

  const totalPages = Math.max(1, Math.ceil(visibleJobs.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageJobs = useMemo(
    () => visibleJobs.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [visibleJobs, currentPage],
  )

  function goToPage(next: number) {
    setPage(Math.min(Math.max(next, 1), totalPages))
  }

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  function setSort(key: SortKey, direction: SortDirection) {
    setSortKey(key)
    setSortDirection(direction)
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
    setSort,
    visibleJobs,
    pageJobs,
    page: currentPage,
    totalPages,
    goToPage,
    reset,
  }
}
