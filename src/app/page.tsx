import { Dashboard } from '@/components/dashboard/dashboard'
import { getJobs } from '@/lib/jobs-service'
import { greeting } from '@/lib/greeting'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const jobs = await getJobs()
  return <Dashboard initialJobs={jobs} greeting={greeting()} />
}
