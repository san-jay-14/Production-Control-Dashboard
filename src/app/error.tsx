'use client'

import { useRouter } from 'next/navigation'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'
import { SummaryCards } from '@/components/dashboard/summary-cards'
import { JobsError } from '@/components/dashboard/jobs-error'
import { greeting } from '@/lib/greeting'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ reset }: ErrorPageProps) {
  const router = useRouter()

  function retry() {
    router.refresh()
    reset()
  }

  return (
    <DashboardShell greeting={greeting()} summary={<SummaryCards jobs={[]} loading />}>
      <JobsError onRetry={retry} />
    </DashboardShell>
  )
}
