'use client'

import { useMemo, useRef, useState } from 'react'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'
import { SummaryCards } from '@/components/dashboard/summary-cards'
import { JobsToolbar } from '@/components/dashboard/jobs-toolbar'
import { JobsTable } from '@/components/dashboard/jobs-table'
import { JobDetailPanel } from '@/components/dashboard/job-detail-panel'
import { todayISO } from '@/lib/date'
import type { Job, JobStatus } from '@/lib/types'
import { useJobsFilter } from '@/hooks/use-jobs-filter'

interface DashboardProps {
  initialJobs: Job[]
  greeting: string
}

export function Dashboard({ initialJobs, greeting }: DashboardProps) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs)
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  const {
    searchInput,
    setSearchInput,
    statusFilter,
    setStatusFilter,
    sortKey,
    sortDirection,
    toggleSort,
    setSort,
    pageJobs,
    page,
    totalPages,
    goToPage,
    reset,
  } = useJobsFilter(jobs)

  const selectedJob = useMemo(
    () => jobs.find((job) => job.id === selectedJobId),
    [jobs, selectedJobId],
  )

  function selectJob(jobId: string) {
    triggerRef.current = document.activeElement as HTMLElement | null
    setSelectedJobId(jobId)
  }

  function restoreFocus() {
    triggerRef.current?.focus()
    triggerRef.current = null
  }

  function updateJobStatus(jobId: string, status: JobStatus): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        setJobs((prev) => prev.map((job) => (job.id === jobId ? { ...job, status, updatedAt: todayISO() } : job)))
        resolve()
      }, 250)
    })
  }

  return (
    <DashboardShell
      greeting={greeting}
      summary={<SummaryCards jobs={jobs} />}
      toolbar={
        <JobsToolbar
          searchInput={searchInput}
          onSearchChange={setSearchInput}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSortChange={setSort}
        />
      }
    >
      <JobsTable
        jobs={pageJobs}
        sortKey={sortKey}
        sortDirection={sortDirection}
        page={page}
        totalPages={totalPages}
        onPageChange={goToPage}
        onToggleSort={toggleSort}
        onSelectJob={selectJob}
        onResetFilters={reset}
      />

      <JobDetailPanel
        job={selectedJob}
        open={selectedJobId !== null}
        onOpenChange={(open) => !open && setSelectedJobId(null)}
        onUpdateStatus={updateJobStatus}
        onRestoreFocus={restoreFocus}
      />
    </DashboardShell>
  )
}
