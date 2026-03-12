---
phase: 02-navigation-and-slides
plan: 03
subsystem: ui
tags: [react, tailwind, state-machine, accessibility, keyboard-nav]

# Dependency graph
requires:
  - phase: 02-navigation-and-slides
    provides: "Real reducer with JUMP_TO_STOP action and triggerRef in context (02-02)"
provides:
  - "StopNode button dispatches JUMP_TO_STOP and captures triggerRef for focus return"
  - "MapCanvas passes index prop to each StopNode"
  - "Focus-visible ring on StopNode buttons for A11Y-03"
affects: [02-04, 02-05]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "triggerRef pattern: capture e.currentTarget before dispatch so SlideOverlay can return focus on close"
    - "focus-visible: Tailwind focus-visible:ring-* for keyboard focus indicators without affecting mouse users"

key-files:
  created: []
  modified:
    - src/components/features/map/StopNode.tsx
    - src/components/features/map/MapCanvas.tsx
    - src/components/features/presentation/PresentationProvider.tsx
    - src/types/presentation.ts
    - src/components/features/presentation/__tests__/PresentationProvider.test.tsx

key-decisions:
  - "Auto-fixed 02-02 as blocker: JUMP_TO_STOP, real reducer, and triggerRef were prerequisites for StopNode wiring"
  - "Updated PresentationProvider.test.tsx assertions from stub behavior to real reducer behavior"

patterns-established:
  - "triggerRef capture: always store e.currentTarget before dispatch so overlay close can return focus"
  - "focus-visible ring: focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-500 on all interactive map nodes"

requirements-completed: [NAV-04, A11Y-03]

# Metrics
duration: 3min
completed: 2026-03-12
---

# Phase 02 Plan 03: StopNode Navigation Wiring Summary

**StopNode click handler dispatches JUMP_TO_STOP with triggerRef capture for A11Y focus return, wired via usePresentation() hook**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-12T06:33:16Z
- **Completed:** 2026-03-12T06:36:30Z
- **Tasks:** 2 (+ 1 blocker fix for 02-02)
- **Files modified:** 5

## Accomplishments

- StopNode now dispatches `JUMP_TO_STOP` on click with correct stopIndex
- triggerRef captured before dispatch enables A11Y-04 focus return when overlay closes
- Focus-visible ring (`focus-visible:ring-2 focus-visible:ring-yellow-500`) satisfies A11Y-03
- MapCanvas passes `index={index}` to each StopNode — minimal targeted change
- Blocker fix: implemented real 02-02 prerequisite (real reducer + JUMP_TO_STOP type + triggerRef)

## Task Commits

Each task was committed atomically:

1. **Blocker fix (02-02): Real reducer + JUMP_TO_STOP + triggerRef** - `3a939e3` (feat)
2. **Task 1: Wire StopNode to dispatch JUMP_TO_STOP** - `931626d` (feat)
3. **Task 2: Pass index prop from MapCanvas** - `0fe7605` (feat)

## Files Created/Modified

- `src/components/features/map/StopNode.tsx` - Added index prop, usePresentation hook call, handleClick with triggerRef capture and JUMP_TO_STOP dispatch, focus-visible ring classes
- `src/components/features/map/MapCanvas.tsx` - Added `index={index}` to StopNode in stops.map() render
- `src/components/features/presentation/PresentationProvider.tsx` - Real reducer replacing Phase 1 stubs, triggerRef added to context, presentationReducer exported
- `src/types/presentation.ts` - JUMP_TO_STOP added to Action union
- `src/components/features/presentation/__tests__/PresentationProvider.test.tsx` - Updated test assertions from stub to real reducer behavior

## Decisions Made

- Updated PresentationProvider.test.tsx to reflect real reducer behavior (stub reducer test was Phase 1 era, now replaced)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Implemented missing 02-02 prerequisites**
- **Found during:** Task 1 setup (before writing any code)
- **Issue:** 02-02 had not been executed; JUMP_TO_STOP was not in Action union, triggerRef was not in context, real reducer was not implemented — all required for Task 1
- **Fix:** Applied all 02-02 changes: added JUMP_TO_STOP to Action union, rewrote PresentationProvider with real reducer (exported), added triggerRef to context, updated PresentationProvider.test.tsx for real reducer behavior
- **Files modified:** src/types/presentation.ts, src/components/features/presentation/PresentationProvider.tsx, src/components/features/presentation/__tests__/PresentationProvider.test.tsx
- **Verification:** 10 reducer tests pass, 4 provider tests pass, TypeScript clean
- **Committed in:** 3a939e3

---

**Total deviations:** 1 auto-fixed (blocking prerequisite)
**Impact on plan:** 02-02 implementation was a prerequisite that could not be skipped. No scope creep — only the minimum required to unblock 02-03.

## Issues Encountered

- SlideOverlay.test.tsx remains in RED state (expected — SlideOverlay component is Wave 2 work in 02-04/02-05)

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- StopNode is fully wired: clicking any city node on the map will open that stop's slides
- triggerRef pattern established for focus return on overlay close (used by SlideOverlay in 02-04)
- 02-04 (SlideOverlay component) can proceed — it has usePresentation() returning triggerRef

---
*Phase: 02-navigation-and-slides*
*Completed: 2026-03-12*
