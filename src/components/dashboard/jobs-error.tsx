import { AlertTriangle, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function JobsError({ onRetry }: { onRetry: () => void }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 py-16"
    >
      <AlertTriangle className="h-8 w-8 text-destructive" />
      <div className="text-center">
        <p className="text-sm font-medium">Couldn&rsquo;t load jobs</p>
        <p className="mt-0.5 text-sm text-muted-foreground">Something went wrong fetching the job list.</p>
      </div>
      <Button variant="outline" size="sm" onClick={onRetry}>
        <RotateCcw className="h-3.5 w-3.5" />
        Retry
      </Button>
    </div>
  )
}
