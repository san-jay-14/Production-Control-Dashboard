import { NextResponse } from 'next/server'
import { getJobs } from '@/lib/jobs-service'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json(await getJobs())
}
