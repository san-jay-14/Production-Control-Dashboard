import { jobs } from './mock-data'
import type { Job } from './types'

const LATENCY_MS = 600

export async function getJobs(): Promise<Job[]> {
  await new Promise((resolve) => setTimeout(resolve, LATENCY_MS))
  return jobs
}
