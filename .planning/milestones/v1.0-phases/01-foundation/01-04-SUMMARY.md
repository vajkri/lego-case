---
phase: 01-foundation
plan: "04"
subsystem: ui
tags: [react, motion, useReducer, context, keyboard, typescript]

# Dependency graph
requires:
  - phase: 01-02
    provides: "PresentationState and Action TypeScript types locked as frozen contracts"
provides:
  - "PresentationProvider: useReducer context with stub reducer and MotionConfig wrapper"
  - "usePresentation hook: typed access to { state, dispatch } with out-of-provider guard"
  - "KeyboardController: centralised window keydown listener dispatching ADVANCE/BACK/CLOSE"
  - "Barrel index.ts for presentation feature directory"
  - "Placeholder barrel exports for ui/ and layout/ component directories"
affects: [01-05, phase-2, phase-3]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "useReducer + createContext for typed presentation state machine"
    - "MotionConfig reducedMotion='user' wrapping entire component tree"
    - "Client components marked with 'use client' at file top"
    - "TDD: RED commit (failing test) → GREEN commit (implementation)"

key-files:
  created:
    - src/components/features/presentation/PresentationProvider.tsx
    - src/components/features/presentation/KeyboardController.tsx
    - src/components/features/presentation/index.ts
    - src/components/features/presentation/__tests__/PresentationProvider.test.tsx
    - src/components/ui/index.ts
    - src/components/layout/index.ts
  modified: []

key-decisions:
  - "Stub reducer pattern: Phase 1 reducer returns unchanged state and console.logs actions — Phase 2 fills in real transitions without touching the wiring"
  - "MotionConfig placed inside PresentationProvider so all motion components automatically inherit prefers-reduced-motion without per-component setup"
  - "KeyboardController is a null-returning component (not a hook) so it mounts once in root layout as a sibling to page content"

patterns-established:
  - "Stub-first reducer: implement the wiring correctly in Phase 1, defer state logic to Phase 2"
  - "Centralised keyboard listener: one component owns window.addEventListener — no duplicates possible"
  - "CLAUDE.md barrel convention: every component directory has index.ts exporting with 'export * from'"

requirements-completed: [FOUND-03, FOUND-04, QUAL-01, QUAL-03]

# Metrics
duration: 5min
completed: 2026-03-11
---

# Phase 1 Plan 04: PresentationProvider + KeyboardController Summary

**useReducer context wired with stub reducer and MotionConfig; centralised keyboard listener dispatching typed actions — all 'use client' with passing unit tests**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-03-11T22:20:00Z
- **Completed:** 2026-03-11T22:21:30Z
- **Tasks:** 2 (Task 1 TDD: RED + GREEN; Task 2 included in Task 1 TDD cycle)
- **Files modified:** 6

## Accomplishments
- PresentationProvider with useReducer, MotionConfig wrapper, and usePresentation hook
- KeyboardController dispatching ADVANCE/BACK/CLOSE on ArrowRight/Space/ArrowLeft/Escape
- 4 unit tests passing: render, initial state, stub reducer no-throw, hook outside-provider guard
- Placeholder barrel exports for ui/ and layout/ satisfying CLAUDE.md folder conventions

## Task Commits

Each task was committed atomically:

1. **Task 1 RED (failing test)** - `8b85a76` (test)
2. **Task 1 GREEN (implementation)** - `6d7e136` (feat)

_Note: Task 2 (write provider unit tests) was absorbed into the Task 1 TDD cycle — tests were written in RED before implementation._

## Files Created/Modified
- `src/components/features/presentation/PresentationProvider.tsx` - useReducer context, stub reducer, MotionConfig wrapper, usePresentation hook
- `src/components/features/presentation/KeyboardController.tsx` - global keydown listener on window, dispatches typed actions
- `src/components/features/presentation/index.ts` - barrel export for presentation feature
- `src/components/features/presentation/__tests__/PresentationProvider.test.tsx` - 4 unit tests covering render, state, reducer, and hook guard
- `src/components/ui/index.ts` - placeholder barrel for UI primitives
- `src/components/layout/index.ts` - placeholder barrel for layout primitives

## Decisions Made
- Stub reducer pattern: Phase 1 proves the wiring; Phase 2 replaces console.log stubs with real navigation logic without touching component structure
- MotionConfig placed inside PresentationProvider so the entire app tree inherits `reducedMotion='user'` automatically (FOUND-04 requirement)
- KeyboardController is a null-rendering component rather than a hook so it mounts once in the root layout without requiring a custom hook wrapper

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- PresentationProvider and KeyboardController are ready to be mounted in root layout (Plan 05)
- Phase 2 can import usePresentation from the barrel and implement real ADVANCE/BACK/CLOSE transitions
- All 9 tests pass (5 data + 4 provider); build succeeds with static export

---
*Phase: 01-foundation*
*Completed: 2026-03-11*

## Self-Check: PASSED

- FOUND: src/components/features/presentation/PresentationProvider.tsx
- FOUND: src/components/features/presentation/KeyboardController.tsx
- FOUND: src/components/features/presentation/index.ts
- FOUND: src/components/features/presentation/__tests__/PresentationProvider.test.tsx
- FOUND: src/components/ui/index.ts
- FOUND: src/components/layout/index.ts
- FOUND: commit 8b85a76 (test RED)
- FOUND: commit 6d7e136 (feat GREEN)
