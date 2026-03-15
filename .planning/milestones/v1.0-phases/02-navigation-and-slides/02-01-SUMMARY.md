---
phase: 02-navigation-and-slides
plan: 01
subsystem: testing
tags: [vitest, react-testing-library, reducer, tdd, wave-0]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: "PresentationState, Action types, stops[] data, PresentationProvider, KeyboardController"
provides:
  - "Failing reducer test scaffold (10 tests, RED) for all ADVANCE/BACK/CLOSE/JUMP_TO_STOP behaviors"
  - "Failing SlideOverlay test scaffold (5 tests, RED) for SLIDE-01, SLIDE-03, A11Y-01, A11Y-02, A11Y-04"
affects:
  - 02-02 (reducer implementation must make reducer.test.ts GREEN)
  - 02-03 (SlideOverlay implementation must make SlideOverlay.test.tsx GREEN)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Wave 0 test scaffold pattern: write failing tests before any implementation (Nyquist compliance)"
    - "renderWithContext helper pattern: mock PresentationContext in tests with controllable state"
    - "TypeScript cast with `as any` for forward-referencing action types not yet in union"

key-files:
  created:
    - src/components/features/presentation/__tests__/reducer.test.ts
    - src/components/features/slide/SlideOverlay/__tests__/SlideOverlay.test.tsx
  modified: []

key-decisions:
  - "Wave 0 test scaffolds import from modules that do not exist yet — this is deliberate RED state, not an error"
  - "SlideOverlay tests use a local mock PresentationContext (not importing real one) to avoid circular deps and keep tests isolated"
  - "JUMP_TO_STOP test uses `as any` cast since the action type is added to the union in Wave 1 (02-02)"

patterns-established:
  - "renderWithContext helper: wrap UI in mock PresentationContext with Partial<PresentationState> override"
  - "Fixture states: named constants (mapState0, mapState4, slideState0) for reducer test inputs"

requirements-completed: [NAV-01, NAV-03, NAV-04, NAV-05, SLIDE-01, SLIDE-03, SLIDE-04, A11Y-01, A11Y-02, A11Y-04]

# Metrics
duration: 5min
completed: 2026-03-12
---

# Phase 2 Plan 01: Wave 0 Test Scaffolds Summary

**Two failing test files (15 tests total) establishing the full reducer and SlideOverlay contracts before any Wave 1-2 implementation exists**

## Performance

- **Duration:** 5 min
- **Started:** 2026-03-12T07:33:08Z
- **Completed:** 2026-03-12T07:38:00Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Created `reducer.test.ts` with 10 test cases covering all ADVANCE/BACK/CLOSE/JUMP_TO_STOP reducer behaviors — in RED state because `presentationReducer` is not yet exported
- Created `SlideOverlay.test.tsx` with 5 test cases covering SLIDE-01, SLIDE-03, A11Y-01, A11Y-02, A11Y-04 — in RED state because `SlideOverlay` component does not exist yet
- Established `renderWithContext` helper pattern for isolating component tests from real PresentationProvider

## Task Commits

Each task was committed atomically:

1. **Task 1: Reducer test scaffold (RED)** - `024da17` (test)
2. **Task 2: SlideOverlay test scaffold (RED)** - `b233130` (test)

**Plan metadata:** (pending final docs commit)

## Files Created/Modified

- `src/components/features/presentation/__tests__/reducer.test.ts` - 10 failing reducer tests covering ADVANCE/BACK/CLOSE/JUMP_TO_STOP
- `src/components/features/slide/SlideOverlay/__tests__/SlideOverlay.test.tsx` - 5 failing SlideOverlay tests with renderWithContext helper

## Decisions Made

- SlideOverlay tests use a local mock `PresentationContext` (not importing from PresentationProvider) to avoid coupling and keep test setup simple
- JUMP_TO_STOP action uses `as any` cast since the action union is extended in Wave 1 (02-02) — TypeScript error is acceptable in Wave 0
- Wave 0 tests intentionally import non-existent modules — failing import = correct RED state

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Both test files are in RED state — Wave 1 (02-02) must export `presentationReducer` and implement real ADVANCE/BACK/CLOSE/JUMP_TO_STOP logic to make `reducer.test.ts` GREEN
- Wave 2 (02-03) must create `src/components/features/slide/SlideOverlay/SlideOverlay.tsx` to make `SlideOverlay.test.tsx` GREEN
- The `renderWithContext` helper in SlideOverlay.test.tsx assumes the component accepts no props (state comes from context) — Wave 2 must respect this interface

---
*Phase: 02-navigation-and-slides*
*Completed: 2026-03-12*
