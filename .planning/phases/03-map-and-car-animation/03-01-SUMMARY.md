---
phase: 03-map-and-car-animation
plan: 01
subsystem: ui
tags: [react, typescript, state-machine, reducer, vitest, tdd]

# Dependency graph
requires:
  - phase: 02-navigation-and-slides
    provides: PresentationState (currentStop, currentSlide, mode), presentationReducer, usePresentation hook, Action union with ADVANCE/BACK/CLOSE/JUMP_TO_STOP
provides:
  - Extended PresentationState with isCarTraveling, awaitingSlideOpen, visitedStops fields
  - ARRIVE action in Action union (dispatched by CarElement on animation complete)
  - Two-step ADVANCE flow in reducer (travel then open overlay)
  - awaitingSlideOpen flag cleanly distinguishes "just arrived" from "returned from overlay"
affects:
  - 03-02 (MapCanvas — reads visitedStops for node visual state)
  - 03-03 (StopNode — reads visitedStops, isCarTraveling)
  - 03-04 (CarElement — dispatches ARRIVE, reads isCarTraveling)
  - 03-05 (KeyboardController — existing ADVANCE wiring now triggers travel)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - awaitingSlideOpen flag pattern for distinguishing post-arrival state from post-overlay-close state
    - No-op reducers return same state reference (not spread) for React.memo referential equality

key-files:
  created: []
  modified:
    - src/types/presentation.ts
    - src/components/features/presentation/PresentationProvider.tsx
    - src/components/features/presentation/__tests__/reducer.test.ts
    - src/components/features/presentation/__tests__/PresentationProvider.test.tsx

key-decisions:
  - "awaitingSlideOpen boolean field added to PresentationState to cleanly distinguish just-arrived (open overlay next) from returned-from-overlay (travel next) — simpler than visitedStops-based inference"
  - "ARRIVE action added to Action union; dispatched by CarElement.onAnimationComplete in plan 03-04"
  - "initialState.visitedStops starts as [0] — stop 0 is active/visited from presentation start"
  - "BACK on map during travel is a no-op (consistent with ADVANCE no-op during travel)"

patterns-established:
  - "Two-step ADVANCE on map: first press starts travel (isCarTraveling: true), ARRIVE sets awaitingSlideOpen: true, second press opens overlay"
  - "No-op returns: same state reference returned (not spread) for referential equality in React.memo"

requirements-completed: [CAR-02, CAR-03, MAP-03]

# Metrics
duration: 4min
completed: 2026-03-12
---

# Phase 3 Plan 01: Two-Step Car Travel State Machine Summary

**Extended PresentationState with isCarTraveling/awaitingSlideOpen/visitedStops and a two-step ADVANCE flow: first press starts car travel, ARRIVE confirms arrival, second press opens slide overlay**

## Performance

- **Duration:** ~4 min
- **Started:** 2026-03-12T18:06:00Z
- **Completed:** 2026-03-12T18:10:00Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Added three new fields to PresentationState: `isCarTraveling`, `awaitingSlideOpen`, `visitedStops`
- Added `ARRIVE` to the Action union (dispatched by CarElement on animation complete)
- Rewrote map-mode ADVANCE logic: travel first, then open overlay after arrival
- All 55 tests pass across the full test suite; TypeScript compiles cleanly

## Task Commits

Each task was committed atomically (TDD: RED → GREEN):

1. **RED: Failing tests for travel flow** - `252ed0b` (test)
2. **Task 1: Updated type contracts** - `3615a00` (feat)
3. **Task 2: Reducer + initialState implementation** - `9b5d540` (feat)

_Note: RED commit precedes both GREEN commits per TDD protocol_

## Files Created/Modified

- `src/types/presentation.ts` — Added isCarTraveling, awaitingSlideOpen, visitedStops to PresentationState; added ARRIVE to Action union
- `src/components/features/presentation/PresentationProvider.tsx` — Two-step ADVANCE map logic, ARRIVE case, BACK no-op during travel, JUMP_TO_STOP travel reset, updated initialState
- `src/components/features/presentation/__tests__/reducer.test.ts` — All fixtures updated with new shape; new tests for travel flow (16 total test cases)
- `src/components/features/presentation/__tests__/PresentationProvider.test.tsx` — Updated integration test for Phase 3 ADVANCE behavior

## Decisions Made

- **awaitingSlideOpen flag:** The two-step flow needs to distinguish "just arrived at stop — open overlay next" from "came back from overlay — travel next." The cleanest solution is a dedicated boolean rather than inferring from visitedStops (which would be ambiguous). Set to `true` by ARRIVE, cleared by ADVANCE when opening overlay.
- **visitedStops starts as [0]:** Stop 0 is the car's starting position and is "active" from the beginning of the presentation.
- **BACK on map during travel is no-op:** Consistent with ADVANCE being a no-op during travel — input is ignored while the car is in motion.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Updated PresentationProvider.test.tsx integration test for Phase 3 behavior**
- **Found during:** Task 2 verification (full test suite run)
- **Issue:** Existing integration test asserted old Phase 2 behavior: "ADVANCE on map at stop 0 → opens stop 0 in slide mode." With Phase 3, ADVANCE now starts car travel to stop 1.
- **Fix:** Updated test assertion to match new two-step flow (stop increments to 1, mode stays 'map')
- **Files modified:** src/components/features/presentation/__tests__/PresentationProvider.test.tsx
- **Verification:** All 55 tests pass
- **Committed in:** 9b5d540 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 bug — stale test reflecting old behavior)
**Impact on plan:** The fix was necessary for a green test suite. No scope creep — only the directly affected test file was updated.

## Issues Encountered

None — plan executed smoothly. The `awaitingSlideOpen` design decision was already worked through in the plan's action section; the correct approach was clear before implementation.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- State machine contracts are locked: `isCarTraveling`, `awaitingSlideOpen`, `visitedStops`, and `ARRIVE` are all available for plans 03-02 through 03-05
- Plans 03-02 (MapCanvas), 03-03 (StopNode), 03-04 (CarElement), and 03-05 (KeyboardController) can proceed in their respective waves
- No blockers

---
*Phase: 03-map-and-car-animation*
*Completed: 2026-03-12*

## Self-Check: PASSED

- src/types/presentation.ts — FOUND
- src/components/features/presentation/PresentationProvider.tsx — FOUND
- src/components/features/presentation/__tests__/reducer.test.ts — FOUND
- .planning/phases/03-map-and-car-animation/03-01-SUMMARY.md — FOUND
- Commit 252ed0b (RED tests) — FOUND
- Commit 3615a00 (type contracts) — FOUND
- Commit 9b5d540 (reducer implementation) — FOUND
