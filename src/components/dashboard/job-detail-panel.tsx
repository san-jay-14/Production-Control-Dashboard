import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { StatusBadge } from '@/components/dashboard/status-badge'
import { machines } from '@/lib/mock-data'
import type { Job, JobStatus } from '@/lib/types'

const statuses: JobStatus[] = ['Pending', 'In Progress', 'Delayed', 'Completed']

interface JobDetailPanelProps {
  job: Job | undefined
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateStatus: (jobId: string, status: JobStatus) => Promise<void>
}

export function JobDetailPanel({ job, open, onOpenChange, onUpdateStatus }: JobDetailPanelProps) {
  const [nextStatus, setNextStatus] = useState<JobStatus | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  if (!job) return null

  const selectedStatus = nextStatus ?? job.status
  const machine = machines.find((m) => m.id === job.machineId)

  async function handleSave() {
    if (!job || !nextStatus || nextStatus === job.status) return
    setIsUpdating(true)
    await onUpdateStatus(job.id, nextStatus)
    setIsUpdating(false)
    setNextStatus(null)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader className="border-b border-border pb-5">
          <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground">{job.id}</p>
            <StatusBadge status={job.status} />
          </div>
          <SheetTitle className="text-xl">{job.productName}</SheetTitle>
        </SheetHeader>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-muted p-3">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Customer</p>
            <p className="mt-0.5 font-medium">{job.customerName}</p>
          </div>
          <div className="rounded-lg bg-muted p-3">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Quantity</p>
            <p className="mt-0.5 font-medium">{job.quantity.toLocaleString()}</p>
          </div>
          <div className="rounded-lg bg-muted p-3">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Due Date</p>
            <p className="mt-0.5 font-medium">{job.dueDate}</p>
          </div>
          <div className="rounded-lg bg-muted p-3">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Machine</p>
            <p className="mt-0.5 font-medium">{machine?.name ?? 'Unassigned'}</p>
          </div>
        </div>

        <div>
          <p className="mb-2 text-[10px] uppercase tracking-wide text-muted-foreground">Notes</p>
          {job.notes.length === 0 ? (
            <p className="text-sm text-muted-foreground">No issues reported</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {job.notes.map((note) => (
                <li key={note.id} className="rounded-lg bg-muted p-3 text-sm">
                  <p>{note.text}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{note.createdAt}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-auto flex flex-col gap-2 border-t border-border pt-5">
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Update Status</p>
          <Select value={selectedStatus} onValueChange={(v) => setNextStatus(v as JobStatus)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleSave}
            disabled={isUpdating || !nextStatus || nextStatus === job.status}
          >
            {isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
            {isUpdating ? 'Updating…' : 'Update Status'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
