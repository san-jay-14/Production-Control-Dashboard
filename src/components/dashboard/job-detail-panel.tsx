import { useState, type ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { StatusBadge } from '@/components/dashboard/status-badge'
import { DueDate } from '@/components/dashboard/due-date'
import { formatDate } from '@/lib/date'
import { machineName } from '@/lib/machines'
import { JOB_STATUSES, type Job, type JobStatus } from '@/lib/types'

type UpdateStatus = (jobId: string, status: JobStatus) => Promise<void>

const LABEL = 'text-[10px] uppercase tracking-wide text-muted-foreground'

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-lg bg-muted p-3">
      <p className={LABEL}>{label}</p>
      <p className="mt-0.5 font-medium">{children}</p>
    </div>
  )
}

interface JobDetailPanelProps {
  job: Job | undefined
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateStatus: UpdateStatus
  onRestoreFocus?: () => void
}

export function JobDetailPanel({
  job,
  open,
  onOpenChange,
  onUpdateStatus,
  onRestoreFocus,
}: JobDetailPanelProps) {
  return (
    <Sheet open={open && job !== undefined} onOpenChange={onOpenChange}>
      <SheetContent
        onCloseAutoFocus={(event) => {
          if (!onRestoreFocus) return
          event.preventDefault()
          onRestoreFocus()
        }}
      >
        {job && <JobDetail key={job.id} job={job} onUpdateStatus={onUpdateStatus} />}
      </SheetContent>
    </Sheet>
  )
}

function JobDetail({ job, onUpdateStatus }: { job: Job; onUpdateStatus: UpdateStatus }) {
  const [nextStatus, setNextStatus] = useState<JobStatus | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const selectedStatus = nextStatus ?? job.status

  async function handleSave() {
    if (!nextStatus || nextStatus === job.status) return
    setIsUpdating(true)
    await onUpdateStatus(job.id, nextStatus)
    setIsUpdating(false)
    setNextStatus(null)
  }

  return (
    <>
      <SheetHeader className="border-b border-border pb-5">
        <div className="flex items-center gap-2">
          <p className="text-xs text-muted-foreground">{job.id}</p>
          <StatusBadge status={job.status} />
        </div>
        <SheetTitle className="text-xl">{job.productName}</SheetTitle>
        <SheetDescription className="sr-only">
          Details and status controls for job {job.id}.
        </SheetDescription>
      </SheetHeader>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <Field label="Customer">{job.customerName}</Field>
        <Field label="Quantity">{job.quantity.toLocaleString()}</Field>
        <Field label="Due Date">
          <DueDate job={job} />
        </Field>
        <Field label="Machine">{machineName(job.machineId)}</Field>
      </div>

      <div>
        <p className={`mb-2 ${LABEL}`}>Notes</p>
        {job.notes.length === 0 ? (
          <p className="text-sm text-muted-foreground">No issues reported</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {job.notes.map((note) => (
              <li key={note.id} className="rounded-lg bg-muted p-3 text-sm">
                <p>{note.text}</p>
                <p className="mt-1 text-xs text-muted-foreground">{formatDate(note.createdAt)}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-auto flex flex-col gap-2 border-t border-border pt-5">
        <p id="update-status-label" className={LABEL}>
          Update Status
        </p>
        <Select value={selectedStatus} onValueChange={(v) => setNextStatus(v as JobStatus)}>
          <SelectTrigger aria-labelledby="update-status-label">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {JOB_STATUSES.map((status) => (
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
    </>
  )
}
