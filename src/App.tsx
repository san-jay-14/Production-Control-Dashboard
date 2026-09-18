import { useMemo, useState } from 'react'
import { SummaryCards } from '@/components/dashboard/summary-cards'
import { JobsToolbar } from '@/components/dashboard/jobs-toolbar'
import { JobsTable } from '@/components/dashboard/jobs-table'
import { JobDetailPanel } from '@/components/dashboard/job-detail-panel'
import { jobs as initialJobs } from '@/lib/mock-data'
import { todayISO } from '@/lib/date'
import type { Job, JobStatus } from '@/lib/types'
import { useJobsFilter } from '@/hooks/use-jobs-filter'

function greeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function App() {
  const [jobs, setJobs] = useState<Job[]>(initialJobs)
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const {
    searchInput,
    setSearchInput,
    statusFilter,
    setStatusFilter,
    sortKey,
    sortDirection,
    toggleSort,
    visibleJobs,
    reset,
  } = useJobsFilter(jobs)

  const selectedJob = useMemo(
    () => jobs.find((job) => job.id === selectedJobId),
    [jobs, selectedJobId],
  )

  function updateJobStatus(jobId: string, status: JobStatus): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        setJobs((prev) => prev.map((job) => (job.id === jobId ? { ...job, status, updatedAt: todayISO() } : job)))
        resolve()
      }, 250)
    })
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-2 overflow-y-auto p-5 md:h-screen md:overflow-hidden">
      <div className="flex flex-col gap-4 rounded-xl border border-border px-4 py-6 transition-shadow duration-200 hover:shadow-md md:flex-row md:items-center md:justify-between md:gap-6">
        <div>
          <p className="text-sm text-muted-foreground">Production Control Dashboard</p>
          <h1 className="mt-1 text-xl font-semibold md:text-3xl">{greeting()}, Sanjay</h1>
        </div>
        <div className="w-full md:max-w-xl">
          <SummaryCards jobs={jobs} />
        </div>
      </div>

      <JobsToolbar
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        sortKey={sortKey}
        onSortKeyChange={toggleSort}
      />

      <div className="flex flex-1 flex-col md:overflow-hidden">
        <JobsTable
          jobs={visibleJobs}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onToggleSort={toggleSort}
          onSelectJob={setSelectedJobId}
          onResetFilters={reset}
        />
      </div>

      <JobDetailPanel
        job={selectedJob}
        open={selectedJobId !== null}
        onOpenChange={(open) => !open && setSelectedJobId(null)}
        onUpdateStatus={updateJobStatus}
      />
    </div>
  )
}

export default App
