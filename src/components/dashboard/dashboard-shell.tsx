import type { ReactNode } from 'react'

const CURRENT_USER_NAME = 'Sanjay'

interface DashboardShellProps {
  greeting: string
  summary: ReactNode
  toolbar?: ReactNode
  children: ReactNode
}

export function DashboardShell({ greeting, summary, toolbar, children }: DashboardShellProps) {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-2 overflow-y-auto p-5 md:h-screen md:overflow-hidden">
      <div className="flex shrink-0 flex-col gap-4 rounded-xl border border-border px-4 py-6 md:flex-row md:items-center md:justify-between md:gap-6">
        <div>
          <p className="text-sm text-muted-foreground">Production Control Dashboard</p>
          <h1 className="mt-1 text-xl font-semibold md:text-3xl">{greeting}, {CURRENT_USER_NAME}</h1>
        </div>
        <div className="w-full md:max-w-xl">{summary}</div>
      </div>

      {toolbar}

      <div className="flex min-h-0 flex-1 flex-col md:overflow-hidden">{children}</div>
    </main>
  )
}
