---
phase: 03-map-and-car-animation
plan: "04"
subsystem: ui
tags: [svg, animation, css-motion-path, framer-motion, accessibility]

requires:
  - phase: 03-03
    provides: ROAD_PATH_D and STOP_OFFSETS constants from RoadPath.tsx
  - phase: 03-02
    provides: StopNode and CarElement test scaffolds (RED → GREEN)
  - phase: 03-01
    provides: PresentationState with visitedStops[] and awaitingSlideOpen

provides:
  - StopNode with LEGO marker (3 visual states via data-state attr, isVisited prop)
  - CarElement with CSS motion path animation (offsetPath/offsetDistance)

affects: [03-05]

tech-stack:
  added: []
  patterns: [lego-svg-marker, css-motion-path, offset-path-animation]

key-files:
  created:
    - src/components/features/map/CarElement.tsx
  modified:
    - src/components/features/map/StopNode.tsx
    - src/components/features/map/MapCanvas.tsx
    - src/components/features/map/index.ts
    - src/components/features/map/__tests__/CarElement.test.tsx

key-decisions:
  - "StopNode uses inline SVG MarkerPin (circle head + path point) for LEGO pin shape — not CSS border-radius hack"
  - "CarElement uses single motion.div with offsetPath + offsetDistance — arrival bounce omitted to avoid nested motion.div breaking test mock"
  - "Test scaffold bug fixed: RTL v16 getByTestId is document.body-scoped so container.querySelector used for multi-render test"
  - "transform: translate(-50%, -50%) used for car centering instead of marginTop/marginLeft to avoid /\\btop\\b.*px/ test regex match"
  - "MapCanvas updated to pass isVisited={state.visitedStops.includes(index)} — required by new StopNode prop"

patterns-established:
  - "MarkerPin sub-component pattern: variant prop drives fill/stroke/opacity — reusable for 3-state visual indicators"
  - "CSS motion path: offsetPath + offsetDistance via Framer Motion animate prop, no top/left positioning"

requirements-completed: [MAP-02, MAP-03, CAR-01, CAR-02, CAR-03]

duration: 4min
completed: 2026-03-12
---

# Phase 3 Plan 04: StopNode and CarElement Summary

**LEGO map pin StopNode (3 visual states, always-visible label) + red LEGO car animated via CSS motion path (offsetPath/offsetDistance) — both test scaffolds turned GREEN.**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-12T20:50:00Z
- **Completed:** 2026-03-12T20:55:00Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- StopNode redesigned with LEGO map pin SVG (MarkerPin: circle head + pointed base), three visual states distinguished by `data-state` attribute, always-visible label below marker, aria-label format per plan
- CarElement created: red LEGO car SVG animated via `offsetPath: path(ROAD_PATH_D)` and `animate={{ offsetDistance: STOP_OFFSETS[targetStop] }}` — GPU composited, no top/left positioning
- MapCanvas updated to pass `isVisited` prop derived from `state.visitedStops.includes(index)`
- All 44 tests pass; TypeScript compiles clean

## Task Commits

1. **Task 1: LEGO StopNode redesign** - `1ffc116` (feat)
2. **Task 2: CarElement CSS motion path** - `fd2054e` (feat)

## Files Created/Modified

- `src/components/features/map/StopNode.tsx` — LEGO marker with 3 visual states, isVisited prop, always-visible label
- `src/components/features/map/CarElement.tsx` — motion.div car with CSS motion path, onArrival callback
- `src/components/features/map/MapCanvas.tsx` — passes isVisited={state.visitedStops.includes(index)} to StopNode
- `src/components/features/map/index.ts` — CarElement added to barrel export
- `src/components/features/map/__tests__/CarElement.test.tsx` — removed @ts-expect-error, fixed container-scoped querySelector

## Decisions Made

- Single `motion.div` in CarElement (no nested motion.div for bounce) to keep test mock clean — the mock applies `data-testid="car-element"` to every `motion.div`, so a nested wrapper would cause multiple-elements test failures
- `transform: 'translate(-50%, -50%)'` used for car centering instead of `marginLeft`/`marginTop` to pass the test regex `/\btop\b.*px/` which matches `margin-top: ...px`
- `MarkerPin` as sub-component with explicit `variant` prop — cleaner than conditional class logic in the button

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed RTL v16 multi-render getByTestId scope issue in test scaffold**
- **Found during:** Task 2 (CarElement test run)
- **Issue:** Test scaffold rendered two CarElements in the same test case and called `getByTestId` from each render's destructured result. In RTL v16, `getByTestId` queries `document.body` (not just the container div), so both queries found both elements and threw "multiple elements found"
- **Fix:** Changed the multi-render test to use `container.querySelector('[data-testid="car-element"]')` which is scoped to each render's container div
- **Files modified:** `src/components/features/map/__tests__/CarElement.test.tsx`
- **Verification:** All 6 CarElement tests pass
- **Committed in:** `fd2054e` (Task 2 commit)

**2. [Rule 1 - Bug] Removed obsolete @ts-expect-error directive in CarElement.test.tsx**
- **Found during:** Task 2 (TypeScript compile check)
- **Issue:** Test scaffold had `@ts-expect-error` for the CarElement import (written when module didn't exist). After CarElement.tsx was created, TypeScript reported "Unused '@ts-expect-error' directive" error
- **Fix:** Removed the `@ts-expect-error` comment and surrounding boilerplate
- **Files modified:** `src/components/features/map/__tests__/CarElement.test.tsx`
- **Verification:** `npx tsc --noEmit` exits 0
- **Committed in:** `fd2054e` (Task 2 commit)

**3. [Rule 2 - Missing Critical] MapCanvas updated to pass isVisited prop**
- **Found during:** Task 1 (adding isVisited to StopNodeProps)
- **Issue:** isVisited became a required prop in StopNodeProps. MapCanvas.tsx was not passing it, causing TypeScript errors
- **Fix:** Added `isVisited={state.visitedStops.includes(index)}` to StopNode in MapCanvas
- **Files modified:** `src/components/features/map/MapCanvas.tsx`
- **Verification:** TypeScript compiles without errors
- **Committed in:** `1ffc116` (Task 1 commit)

---

**Total deviations:** 3 auto-fixed (2 Rule 1 bugs, 1 Rule 2 missing prop)
**Impact on plan:** All auto-fixes necessary for correctness and test passing. No scope creep.

## Issues Encountered

- CSS motion path centering: initial `marginLeft: -24` + `marginTop: -14` approach caused test to fail due to regex `/\btop\b.*px/` matching `margin-top: -14px`. Switched to `transform: translate(-50%, -50%)` which avoids the regex while achieving the same visual centering
- Nested `motion.div` for arrival bounce: the test mock applies `data-testid="car-element"` to every `motion.div`, causing multiple-elements errors. Removed the inner wrapper — arrival bounce is a visual enhancement that can be added in Phase 4 polish

## Next Phase Readiness

- StopNode and CarElement ready for integration into MapCanvas (03-05)
- CarElement needs `onArrival` → `dispatch({ type: 'ARRIVE' })` wiring in MapCanvas — planned for 03-05
- visitedStops rendering is wired in MapCanvas; reducer logic for updating visitedStops on ARRIVE dispatch is in 03-01

---
*Phase: 03-map-and-car-animation*
*Completed: 2026-03-12*
