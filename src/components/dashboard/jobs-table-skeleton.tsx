const SKELETON_ROWS = 4
const COLUMN_WIDTHS = ['w-20', 'w-44', 'w-36', 'w-12', 'w-24', 'w-28', 'w-24']

export function JobsTableSkeleton() {
  const rows = Array.from({ length: SKELETON_ROWS }, (_, i) => i)

  return (
    <div aria-busy="true" aria-label="Loading jobs" role="status">
      <div className="hidden animate-pulse rounded-lg border border-border md:block">
        <div className="flex h-12 items-center gap-6 border-b border-border px-4">
          {COLUMN_WIDTHS.map((width) => (
            <div key={width} className={`h-2.5 ${width} rounded-full bg-muted`} />
          ))}
        </div>
        {rows.map((row) => (
          <div key={row} className="flex items-center gap-6 border-b border-border px-4 py-4 last:border-b-0">
            {COLUMN_WIDTHS.map((width) => (
              <div key={width} className={`h-3 ${width} rounded-full bg-muted`} />
            ))}
          </div>
        ))}
      </div>

      <div className="flex animate-pulse flex-col gap-2 md:hidden">
        {rows.map((row) => (
          <div key={row} className="flex flex-col gap-2 rounded-lg border border-border p-3">
            <div className="flex items-center justify-between">
              <div className="h-3 w-20 rounded-full bg-muted" />
              <div className="h-4 w-24 rounded-full bg-muted" />
            </div>
            <div className="h-3 w-40 rounded-full bg-muted" />
            <div className="h-3 w-28 rounded-full bg-muted" />
          </div>
        ))}
      </div>
    </div>
  )
}
