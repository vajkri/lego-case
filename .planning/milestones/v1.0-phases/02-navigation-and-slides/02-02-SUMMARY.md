---
phase: 02-navigation-and-slides
plan: "02"
subsystem: ui
tags: [react, typescript, reducer, state-machine, vitest, tdd, accessibility]

# Dependency graph
requires:
  - phase: 02-01
    provides: RED test scaffold — reducer.test.ts with 10 failing tests importing presentationReducer
  - phase: 01-foundation
    provides: PresentationProvider stub, Action type, stops[] data
provides:
  - Real presentationReducer exported from PresentationProvider.tsx (all 4 actions implemented)
  - JUMP_TO_STOP action variant added to Action union in presentation.ts
  - triggerRef (MutableRefObject<HTMLElement | null>) in PresentationContext and usePresentation return
  - 10 reducer unit tests GREEN (pure function tests, no rendering)
affects:
  - 02-03 (StopNode dispatches JUMP_TO_STOP, captures triggerRef)
  - 02-04 (SlideOverlay reads triggerRef to return focus on close)
  - 02-05 (KeyboardController dispatches ADVANCE/BACK/CLOSE)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Exported pure reducer function for direct unit testing without component mounting"
    - "useRef for focus management stored in context value, not component state"
    - "Referential equality preserved on no-op transitions (return state, not spread)"

key-files:
  created: []
  modified:
    - src/types/presentation.ts
    - src/components/features/presentation/PresentationProvider.tsx
    - src/components/features/presentation/__tests__/PresentationProvider.test.tsx

key-decisions:
  - "presentationReducer exported as named function (not anonymous) so test files can import it directly without React context"
  - "No-op transitions return the same state reference (return state) for React.memo optimization — spread would create new object"
  - "triggerRef stored in context value (not a separate context) to keep API surface minimal"
  - "PresentationProvider.test.tsx updated to test real reducer behavior — Phase 1 stub test assertions obsoleted"

patterns-established:
  - "A11Y-05 navigation model documented as JSDoc on the reducer — canonical reference for all future navigation decisions"
  - "BACK on map at non-zero stop opens previous stop at its LAST slide (not slide 0) — enables reverse traversal"

requirements-completed: [NAV-01, NAV-02, NAV-03, NAV-04, NAV-05]

# Metrics
duration: 5min
completed: 2026-03-12
---

# Phase 02 Plan 02: Real Reducer + triggerRef Summary

**Pure presentationReducer state machine replacing Phase 1 stub — all 4 actions (ADVANCE, BACK, CLOSE, JUMP_TO_STOP) with 10 GREEN unit tests and triggerRef in context**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-03-12T06:33:19Z
- **Completed:** 2026-03-12T06:38:00Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- Added JUMP_TO_STOP action variant to Action union with stopIndex payload
- Replaced Phase 1 stub reducer with real state machine implementing all navigation behaviors
- Exported presentationReducer as named function enabling direct unit testing without component rendering
- Added triggerRef (MutableRefObject<HTMLElement | null>) to context value and usePresentation return for Phase 2 Wave 2 focus management
- All 10 reducer tests GREEN (pure function tests — fast, no DOM rendering required)

## Task Commits

1. **Task 1: Add JUMP_TO_STOP to Action union** — `d3b31b6` (feat)
2. **Task 2: Real reducer + triggerRef in context** — `3a939e3` (feat)

## Files Created/Modified

- `src/types/presentation.ts` — Added JUMP_TO_STOP variant to Action union; updated JSDoc comment block
- `src/components/features/presentation/PresentationProvider.tsx` — Real reducer exported, triggerRef in context, A11Y-05 comment block
- `src/components/features/presentation/__tests__/PresentationProvider.test.tsx` — Updated stub test assertions to match real reducer behavior

## Decisions Made

- Exported presentationReducer as named export (not module-level private) to enable direct unit testing in reducer.test.ts
- No-op transitions (last stop ADVANCE, first stop BACK) return same state reference to preserve referential equality for React optimization
- triggerRef stored in PresentationContext value (not a separate context) — minimal API surface, single import point for consumers

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Updated PresentationProvider.test.tsx stub assertions to match real reducer**
- **Found during:** Task 2 (real reducer implementation)
- **Issue:** Phase 1 test "stub reducer does not throw on ADVANCE, BACK, CLOSE" asserted state unchanged after ADVANCE — valid for stub, broken for real reducer (ADVANCE from stop 0 map opens stop 1)
- **Fix:** Replaced stub assertion test with real behavior test: ADVANCE opens stop 1, CLOSE returns to map
- **Files modified:** src/components/features/presentation/__tests__/PresentationProvider.test.tsx
- **Verification:** Full test suite runs with 19/19 tests passing
- **Committed in:** 3a939e3 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 — bug in Phase 1 test that tested stub behavior)
**Impact on plan:** Necessary fix — Phase 1 test was intentionally testing stub behavior; Phase 2 replaces the stub, so the test must match real behavior.

## Issues Encountered

None — implementation was straightforward. The test scaffold from 02-01 (RED) provided a clear specification that drove implementation.

## Next Phase Readiness

- presentationReducer fully tested and exported — ready for KeyboardController wiring (02-05)
- triggerRef in context — ready for SlideOverlay focus-return implementation (02-04)
- JUMP_TO_STOP in Action union — ready for StopNode dispatch wiring (02-03)
- All 3 wave dependencies for plan 02-02 satisfied

---
*Phase: 02-navigation-and-slides*
*Completed: 2026-03-12*
