import { DashboardShell } from '@/components/dashboard/dashboard-shell'
import { SummaryCards } from '@/components/dashboard/summary-cards'
import { JobsTableSkeleton } from '@/components/dashboard/jobs-table-skeleton'
import { greeting } from '@/lib/greeting'

export default function Loading() {
  return (
    <DashboardShell greeting={greeting()} summary={<SummaryCards jobs={[]} loading />}>
      <JobsTableSkeleton />
    </DashboardShell>
  )
}
