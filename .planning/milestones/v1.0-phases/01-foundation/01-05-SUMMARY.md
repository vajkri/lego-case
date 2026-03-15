---
phase: 01-foundation
plan: 05
subsystem: ui
tags: [nextjs, react, tailwind, typescript, mapcanvas, presentationprovider, keyboard]

# Dependency graph
requires:
  - phase: 01-04
    provides: PresentationProvider with stub reducer and KeyboardController
  - phase: 01-03
    provides: stops[] data array from src/data/topics/index.ts
provides:
  - Root layout wiring PresentationProvider + KeyboardController
  - MapCanvas component with 5 positioned stop nodes and dev state indicator
  - StopNode positioned button component using stop.coordinates percentages
  - Barrel export for map components
  - Verified static build out/index.html
affects: [02-slides, 03-map, 04-polish]

# Tech tracking
tech-stack:
  added: []
  patterns: [server-component-layout, client-subtree-via-import, percentage-positioning]

key-files:
  created:
    - src/components/features/map/MapCanvas.tsx
    - src/components/features/map/StopNode.tsx
    - src/components/features/map/index.ts
  modified:
    - src/app/layout.tsx
    - src/app/page.tsx

key-decisions:
  - "Root layout stays a Server Component — PresentationProvider and KeyboardController form their own client subtrees when imported"
  - "MapCanvas uses position:absolute + left/top percentages from stop.coordinates — no layout library needed for Phase 1"
  - "Dev indicator (stop/slide/mode overlay) is intentionally left in for Phase 1 to verify reducer wiring, removed in Phase 4"

patterns-established:
  - "Server layout + client subtrees: layout.tsx is a Server Component; 'use client' components imported into it form isolated client boundaries"
  - "Percentage coordinate positioning: StopNode uses stop.coordinates.x/y as % values with translate(-50%,-50%) centering"
  - "Active stop highlight: currentStop index compared to map index to apply yellow highlight to active StopNode"

requirements-completed: [FOUND-07, QUAL-01, QUAL-03]

# Metrics
duration: 8min
completed: 2026-03-12
---

# Phase 1 Plan 05: Root Wiring + MapCanvas Summary

**Next.js root layout wired with PresentationProvider and KeyboardController; MapCanvas renders 5 percentage-positioned stop nodes with a dev state indicator; static build clean at out/index.html**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-03-12T05:40:00Z
- **Completed:** 2026-03-12T05:46:00Z
- **Tasks:** 2 (1 auto + 1 checkpoint:human-verify)
- **Files modified:** 5

## Accomplishments
- Root layout mounts PresentationProvider (context + MotionConfig) and KeyboardController (null-rendering keyboard listener) as client subtrees from a Server Component
- MapCanvas renders 5 stop nodes from stops[] data, each positioned by stop.coordinates (percentage of viewport width/height), with active stop highlighted yellow
- Dev state indicator (top-left overlay) confirms stub reducer is wired — currentStop, currentSlide, mode visible in real time
- `npm run build` exits 0, `out/index.html` exists — Phase 1 static export fully verified
- All 9 tests pass (5 data tests + 4 PresentationProvider tests)

## Task Commits

Each task was committed atomically:

1. **Task 1: Wire root layout and create MapCanvas components** - `6e93a74` (feat)
2. **Task 2: Human verify — Phase 1 foundation complete** - approved by user; no code changes

**Plan metadata:** (docs commit — see final commit hash)

## Files Created/Modified
- `src/app/layout.tsx` - Root layout mounting PresentationProvider wrapping children, with KeyboardController sibling
- `src/app/page.tsx` - Root page rendering MapCanvas as sole child
- `src/components/features/map/MapCanvas.tsx` - Blank canvas with 5 positioned StopNodes and dev state indicator
- `src/components/features/map/StopNode.tsx` - Positioned button component using stop.coordinates as CSS % values
- `src/components/features/map/index.ts` - Barrel export for MapCanvas and StopNode

## Decisions Made
- Root layout stays a Server Component (no 'use client') — importing client components into it creates isolated client subtrees, which is idiomatic Next.js App Router
- Dev indicator retained in Phase 1 to visually confirm reducer wiring; to be removed in Phase 4
- StopNode uses `position: absolute` with `left/top` as percentages derived from `stop.coordinates` — simple, sufficient for Phase 1 placeholder

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Phase 1 Foundation complete: all 5 plans done, all 10 requirements covered (FOUND-01 through FOUND-07, QUAL-01 through QUAL-03)
- Phase 2 (Slides) can begin: PresentationProvider context, KeyboardController, and Stop data contracts are all in place
- Blockers carried forward: LEGO design tokens not yet resolved; AnimatePresence overlay-in-layout pattern needs Phase 2 proof-of-concept spike before wiring all 14 slides

---
*Phase: 01-foundation*
*Completed: 2026-03-12*
