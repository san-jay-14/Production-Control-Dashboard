const SKELETON_ROWS = 5

export function JobsTableSkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading jobs"
      className="flex animate-pulse flex-col gap-3 rounded-lg border border-border p-4"
    >
      {Array.from({ length: SKELETON_ROWS }, (_, row) => (
        <div key={row} className="h-8 rounded-md bg-muted" />
      ))}
    </div>
  )
}
