# Production Control Dashboard

A single-screen dashboard for an operations manager to track jobs, machine assignment, and issues needing attention.

## Tech Stack

- React + TypeScript + Vite
- Tailwind CSS
- shadcn/ui-style components built on Radix primitives
- lucide-react icons

No backend — jobs are a static mock dataset (`src/lib/mock-data.ts`), and status updates are held in local React state.

## Getting Started

```bash
pnpm install
pnpm dev
```

Open `http://localhost:5173`.

## Build

```bash
pnpm build
pnpm preview
```

## Deploying to Vercel

This is a plain Vite app, so no extra config is needed.

1. Push the repo to GitHub.
2. Import it in [Vercel](https://vercel.com/new).
3. Vercel auto-detects the Vite framework preset:
   - Build command: `pnpm build`
   - Output directory: `dist`
4. Deploy.

## Project Structure

```
src/
  App.tsx                     — page composition, owns jobs[] and selectedJobId
  lib/
    types.ts                  — Job, Machine, JobStatus, JobNote
    mock-data.ts              — static jobs[] and machines[]
    job-filters.ts            — pure filterJobs / searchJobs / sortJobs / isDueToday
    utils.ts                  — cn() classname helper
  hooks/
    use-jobs-filter.ts        — search/status/sort state, returns the derived job list
  components/
    dashboard/                — summary-cards, jobs-toolbar, jobs-table, status-badge, job-detail-panel
    ui/                       — button, input, select, sheet, table primitives
```

`jobs-table.tsx` is presentational only — all filtering, searching, and sorting happens in `useJobsFilter`.

## Assumptions

- **Delayed** is a manually set status, not derived from the due date. A separate `isDueToday` check drives the "Due Today" summary count.
- No backend or fetch simulation — jobs are a local array, so there's no loading/error state for initial data. The status update flow still simulates a network round trip (`setTimeout`) before committing.
- Sorting is triggered from the table's column headers (Quantity, Due Date), plus a compact sort menu on mobile where the headers aren't visible.
- The table paginates 9 jobs per page instead of scrolling.

## What I'd Improve With More Time

- Persist jobs to `localStorage` or a real API so a refresh doesn't reset state.
- Multi-select status filter and a dedicated "overdue" quick filter.
- Keyboard navigation between table rows.
