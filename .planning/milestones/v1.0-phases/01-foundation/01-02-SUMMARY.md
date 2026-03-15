---
phase: 01-foundation
plan: "02"
subsystem: infra
tags: [typescript, types, vitest, tdd, presentation-state, data-layer]

# Dependency graph
requires:
  - phase: 01-foundation/01-01
    provides: Next.js 16 scaffold with Vitest 4 test harness and TypeScript config
provides:
  - src/types/presentation.ts with Stop, Slide, PresentationState, Action type definitions
  - src/data/topics/__tests__/stops.test.ts as a failing RED test scaffold (5 test cases)
affects:
  - 01-03-data-files
  - 01-04-presentation-provider
  - 01-05-root-wiring

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Interface-first type definition: types locked before implementation to prevent type drift"
    - "TDD RED scaffold: test file created against a not-yet-existing data module"

key-files:
  created:
    - src/types/presentation.ts
    - src/data/topics/__tests__/stops.test.ts
  modified: []

key-decisions:
  - "Type shapes locked in Phase 1 — PresentationState and Action types are frozen; Phase 2+ must revise this file to add fields"
  - "Stop type import added to test file to avoid implicit any on map callback in strict TypeScript"
  - "Test file intentionally RED: ../index not yet created — Plan 03 owns that file and makes tests GREEN"

patterns-established:
  - "All types imported via @/types/presentation path alias — downstream plans follow this import pattern"
  - "Test scaffold created before implementation module — enforces RED state discipline"

requirements-completed: [FOUND-05, QUAL-02, QUAL-03]

# Metrics
duration: 2min
completed: 2026-03-11
---

# Phase 1 Plan 02: Types + Test Scaffold Summary

**Locked TypeScript contracts for Stop, Slide, PresentationState, and Action types, plus a 5-case RED test scaffold that Plan 03 will turn GREEN**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-11T21:09:08Z
- **Completed:** 2026-03-11T21:11:00Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Created all four exported types in `src/types/presentation.ts` exactly as specified — frozen contracts for all downstream plans
- Created `src/data/topics/__tests__/stops.test.ts` with 5 test cases covering stop count, required fields, coordinate ranges, slide content, and slug uniqueness
- Added `Stop` type import to test file to resolve implicit any error in strict TypeScript
- Build (`npm run build`) exits 0 throughout

## Task Commits

Each task was committed atomically:

1. **Task 1: Create TypeScript type definitions** - `8dcd432` (feat)
2. **Task 2: Create data layer test scaffold** - `dd0b946` (test)

**Plan metadata:** (docs commit created below)

## Files Created/Modified
- `src/types/presentation.ts` - Stop, Slide, PresentationState, and Action type definitions; locked interface contracts for presentation state machine
- `src/data/topics/__tests__/stops.test.ts` - 5-case Vitest test scaffold for the data layer; intentionally RED until Plan 03 creates the stops index

## Decisions Made
- **Types frozen by design:** The plan explicitly locks these interfaces — downstream plans must not add fields to PresentationState or Action without revising this file.
- **Test file RED by design:** `../index` is not created in this plan. Plan 03 creates `src/data/topics/index.ts`, which turns this test GREEN.
- **Stop type annotation added:** The `stops.map((s) => s.slug)` callback required an explicit `Stop` type annotation to satisfy TypeScript strict mode. Added `import type { Stop }` to the test file to resolve this.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed implicit any on map callback in test file**
- **Found during:** Task 2 (Create data layer test scaffold)
- **Issue:** `stops.map((s) => s.slug)` produced `TS7006: Parameter 's' implicitly has an 'any' type` because `stops` is imported from a not-yet-created module
- **Fix:** Added `import type { Stop } from '@/types/presentation'` and annotated the callback parameter as `(s: Stop)`
- **Files modified:** `src/data/topics/__tests__/stops.test.ts`
- **Verification:** `npx tsc --noEmit` now shows only the expected `../index` module-not-found error; no implicit any errors
- **Committed in:** dd0b946 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 type bug)
**Impact on plan:** The fix maintains strict TypeScript compliance. No scope creep.

## Issues Encountered

**`npm test -- --passWithNoTests` exits 1 (not 0):** The plan's done criteria assumed `--passWithNoTests` would suppress the test suite failure caused by the missing `../index` module. In Vitest 4, a module-resolution error during collection is a suite failure (exit 1), not a "no tests" condition. This is an expected Vitest 4 behavior difference — the test is correctly in RED state and Plan 03 will make it GREEN.

**`npx tsc --noEmit` exits 1:** The single remaining TypeScript error (`Cannot find module '../index'`) is expected in the RED state. Plan 03 creates this file and resolves the error.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- `src/types/presentation.ts` is ready for all downstream imports via `@/types/presentation`
- Test scaffold at `src/data/topics/__tests__/stops.test.ts` waits for Plan 03's data files
- No blockers for Plan 03 (data files) or Plan 04 (PresentationProvider)

---
*Phase: 01-foundation*
*Completed: 2026-03-11*
