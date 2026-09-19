# Production Control Dashboard

A single-screen dashboard for an operations manager to track jobs, machine assignment, and issues needing attention.

## Tech Stack

- Next.js (App Router) + React + TypeScript
- Tailwind CSS v4
- shadcn/ui-style components built on Radix primitives
- lucide-react icons

No database. Jobs come from a static mock dataset of 38 jobs across 6 machines (`src/lib/mock-data.ts`), served through `getJobs()`, which adds a deliberate 600ms delay so the loading state is real rather than theoretical. Status updates are held in client React state.

## Getting Started

```bash
pnpm install
```

```bash
pnpm dev
```

Open `http://localhost:3000`.

## Build

```bash
pnpm build
```

```bash
pnpm start
```

## Deploying to Vercel

1. Push the repo to GitHub.
2. Import it in [Vercel](https://vercel.com/new).
3. The Next.js preset is detected automatically — no configuration needed.
4. Deploy.

## Project Structure

```
src/
  app/
    page.tsx                  — server component; awaits getJobs(), renders <Dashboard>
    layout.tsx                — html/body shell and metadata
    loading.tsx               — streamed skeleton shown while page.tsx resolves
    error.tsx                 — error boundary with a working Retry
    api/jobs/route.ts         — GET returns the mock jobs array
  lib/
    types.ts                  — Job, Machine, JobStatus, JobNote
    mock-data.ts              — static jobs[] and machines[]
    jobs-service.ts           — getJobs(); the single data source for page + route
    job-filters.ts            — pure filterJobs / searchJobs / sortJobs / isOverdue / isDueToday
    machines.ts               — machineById / machineName, indexed once
    date.ts                   — local-calendar ISO helpers and display formatting
    greeting.ts               — time-of-day greeting
  hooks/
    use-jobs-filter.ts        — search/status/sort/pagination state, returns the derived page
  components/
    dashboard/                — dashboard, dashboard-shell, summary-cards, jobs-toolbar,
                                jobs-table, jobs-table-skeleton, jobs-error,
                                status-badge, due-date, job-detail-panel
    ui/                       — button, input, select, sheet, table primitives
```

### State and data flow

| State                                                                | Owner                                                     |
| -------------------------------------------------------------------- | --------------------------------------------------------- |
| `jobs`                                                               | `dashboard.tsx`, seeded from the server via `initialJobs` |
| `searchTerm` / `statusFilter` / `sortKey` / `sortDirection` / `page` | `useJobsFilter`                                           |
| `selectedJobId`                                                      | `dashboard.tsx`                                           |
| unsaved status draft, `isUpdating`                                   | `job-detail-panel.tsx`, per job                           |

`jobs-table.tsx` is presentational: it renders the `jobs` array it is handed and derives nothing. Filtering, searching, sorting **and pagination** all happen in `useJobsFilter`. Pagination lives there rather than in the table because the page number is a function of the filtered list — keeping it in the table let the two disagree.

The three non-data states are visually distinct: **loading** is a grey shimmer of the table's shape, **error** is a red-tinted panel with a Retry button, **empty** is a dashed outline with a Reset filters button.

## Accessibility

Decisions worth noting:

- **Table rows keep their native `row` semantics.** A `role="button"` on `<tr>` overrides the role the table needs and breaks its accessibility tree. The row's `onClick` is a mouse convenience; the keyboard and screen-reader path is a real `<button>` in the Job ID cell, marked `aria-haspopup="dialog"`. Mobile cards are `<button>` elements rather than `div`s with a role, so Enter, Space and focus come from the platform instead of hand-written key handlers.
- **`aria-sort`** lives on the sortable header cells and tracks the active column and direction.
- **Focus returns to the row control** when the detail panel closes. Radix would normally restore it, but this panel is opened programmatically (no `DialogTrigger`) and its content is keyed per job, so the panel hands focus restoration back to the caller.
- **Select triggers carry explicit labels.** `role="combobox"` takes its name from a label, never from its content, so the visible value ("All statuses") does not name the control.
- **Overdue is not signalled by colour alone.** The overdue due date carries a warning icon and an `sr-only` "(overdue)", so the state survives both colour blindness and a screen reader.
- **Two theme colours were darkened to clear 4.5:1 on the `#f4f4f5` muted surfaces**: `--color-muted-foreground` to zinc-600 (`#71717a` measured 4.40:1) and `--color-destructive` to red-700 (`#dc2626` measured 4.39:1).

## Assumptions

- Dates display as `Sep 14, 2026`, formatted from the `YYYY-MM-DD` string directly. No `Date` parsing and no locale-aware formatting: `new Date('2026-09-14')` is UTC midnight and renders as the 13th west of Greenwich, and `Intl` output would disagree between the server render and hydration. Unparseable input falls back to the raw string rather than rendering `Invalid Date`.
- **Delayed** is a manually set status, not derived from the due date. **Overdue** is the separate computed flag (`isOverdue`): past due and not yet Completed. Both are surfaced, because they genuinely differ — a job can slip past its date with nobody having marked it, and a job can be marked Delayed while still due today. Overdue jobs are flagged inline on the due date in the table, the mobile cards and the detail panel, and counted in their own summary card.
- The greeting is resolved on the server and passed down, so the server-rendered HTML and the hydrated output always agree. The tradeoff is that it follows the server's clock, not the viewer's — reasonable for a single-site ops tool, wrong for a globally distributed one.
- The status update simulates a network round trip (`setTimeout`) before committing, so the pending/disabled/spinner states are exercised.
- Selection survives filtering: `selectedJob` is resolved against the full `jobs` array, not the visible page, so filtering while the panel is open never yanks it shut.
- The table paginates 9 jobs per page instead of scrolling the whole page. Changing a filter resets to page 1; changing a job's _status_ does not, so updating a row from page 2 leaves you on page 2.

## What I'd Improve With More Time

- Persist jobs to a real API or database so a refresh doesn't reset local status changes.
- Multi-select status filter and a dedicated "overdue" quick filter.
- A test suite. The pure logic in `job-filters.ts`, `date.ts` and `machines.ts` is written to be directly testable, but no tests ship here.
