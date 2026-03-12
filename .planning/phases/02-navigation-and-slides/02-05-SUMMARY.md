---
phase: 02-navigation-and-slides
plan: 05
subsystem: ui
tags: [react, motion, framer-motion, animatepresence, accessibility, keyboard-navigation, focus-management]

# Dependency graph
requires:
  - phase: 02-04
    provides: SlideOverlay component with entrance/exit animations, focus trap, ARIA live region
  - phase: 02-02
    provides: PresentationProvider with usePresentation hook, triggerRef, real reducer
  - phase: 02-03
    provides: StopNode dispatching JUMP_TO_STOP and capturing triggerRef

provides:
  - OverlayPresence client wrapper mounting AnimatePresence + conditional SlideOverlay in root layout
  - onExitComplete focus return to triggerRef.current (A11Y-04)
  - Barrel export for slide feature (src/components/features/slide/index.ts)
  - Complete Phase 2 interactive flow: keyboard navigation drives animated overlay transitions
affects:
  - 03-map-and-animation (uses layout.tsx wiring pattern)
  - 04-polish-and-deploy (removes dev indicator, adds real assets)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "AnimatePresence in 'use client' wrapper pattern — required because layout.tsx is a Server Component"
    - "onExitComplete for deferred focus return — fires after exit animation completes (~0.4s), ensuring DOM is stable"
    - "setTimeout(0) inside onExitComplete to yield event loop before focus()"
    - "KeyboardController Space key early-return guard for button/link targets to prevent double-dispatch"

key-files:
  created:
    - src/components/features/slide/OverlayPresence.tsx
    - src/components/features/slide/index.ts
  modified:
    - src/app/layout.tsx
    - src/components/features/presentation/KeyboardController.tsx
    - src/components/features/presentation/PresentationProvider.tsx
    - src/components/features/presentation/__tests__/PresentationProvider.test.tsx
    - src/components/features/presentation/__tests__/reducer.test.ts

key-decisions:
  - "OverlayPresence is a dedicated 'use client' wrapper because AnimatePresence cannot run in a Server Component (layout.tsx must stay a Server Component)"
  - "AnimatePresence is always mounted; conditional SlideOverlay is inside it — required for exit animations to play"
  - "SlideOverlay key='slide-overlay' is stable so AnimatePresence can track mount/unmount correctly"
  - "Bug fix: map-mode ADVANCE now opens current stop (not next); reducer logic was off-by-one"
  - "Bug fix: Space key in KeyboardController returns early when target is a button/link to prevent double-dispatch — Space triggers both window ADVANCE and button click"

patterns-established:
  - "OverlayPresence pattern: client wrapper owns AnimatePresence; layout.tsx stays Server Component"
  - "Focus return pattern: onExitComplete + setTimeout(0) + triggerRef.current?.focus()"
  - "Keyboard guard pattern: check event.target.tagName before dispatching to prevent interaction conflicts"

requirements-completed: [SLIDE-01, SLIDE-02, SLIDE-05, A11Y-04]

# Metrics
duration: ~20min
completed: 2026-03-12
---

# Phase 2 Plan 05: OverlayPresence Integration Summary

**AnimatePresence wired into root layout via OverlayPresence client wrapper, completing the full Phase 2 interactive flow with keyboard navigation, animated slide overlay, focus trap, and focus return**

## Performance

- **Duration:** ~20 min
- **Started:** 2026-03-12T14:30:00Z
- **Completed:** 2026-03-12T15:51:00Z
- **Tasks:** 2 (1 auto + 1 human-verify checkpoint)
- **Files modified:** 7

## Accomplishments

- OverlayPresence client component wraps AnimatePresence for correct exit animation support in Server Component layout
- focus return on overlay close via onExitComplete + triggerRef.current?.focus() (satisfies A11Y-04)
- Two reducer/controller bugs found and fixed during human verification: first-stop-skipped and Space double-dispatch
- All 25 tests pass across 4 test files after bug fixes

## Task Commits

Each task was committed atomically:

1. **Task 1: Create OverlayPresence and wire into layout** - `cadf006` (feat)
2. **Bug fix: Space key guard in KeyboardController** - `b863236` (fix)
3. **Bug fix: debug doc for first-stop-skipped** - `20d1b4a` (docs)

## Files Created/Modified

- `src/components/features/slide/OverlayPresence.tsx` - Client wrapper; AnimatePresence always mounted, conditional SlideOverlay inside, onExitComplete handles A11Y-04 focus return
- `src/components/features/slide/index.ts` - Barrel export for slide feature (OverlayPresence + SlideOverlay)
- `src/app/layout.tsx` - Mounts OverlayPresence alongside KeyboardController inside PresentationProvider
- `src/components/features/presentation/KeyboardController.tsx` - Space key early-return guard when target is button/link
- `src/components/features/presentation/PresentationProvider.tsx` - Reducer fix: map-mode ADVANCE opens current stop (not next)
- `src/components/features/presentation/__tests__/PresentationProvider.test.tsx` - Tests updated for correct reducer behavior
- `src/components/features/presentation/__tests__/reducer.test.ts` - Tests updated for correct ADVANCE behavior

## Decisions Made

- Used a dedicated `OverlayPresence` client wrapper rather than attempting to use `AnimatePresence` directly in the Server Component layout — this was the established plan pattern, now validated
- `SlideOverlay key="slide-overlay"` kept stable across renders so AnimatePresence correctly detects mount/unmount transitions
- `setTimeout(0)` inside `onExitComplete` yields to the event loop before calling `triggerRef.current?.focus()` to ensure DOM has settled after animation

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Reducer: map-mode ADVANCE opened next stop instead of current stop**
- **Found during:** Task 2 (human verification — Test 1: basic advance flow)
- **Issue:** Pressing ArrowRight on map was opening stop index 1 instead of stop index 0 (current position). Reducer's ADVANCE action incremented stopIndex before opening slides.
- **Fix:** Corrected reducer so map-mode ADVANCE opens slides for `state.currentStopIndex` (current stop), not `state.currentStopIndex + 1`
- **Files modified:** `src/components/features/presentation/PresentationProvider.tsx`, `src/components/features/presentation/__tests__/reducer.test.ts`
- **Verification:** All 25 tests pass; human verified correct stop opens in browser
- **Committed in:** `b863236` (combined with Space key fix)

**2. [Rule 1 - Bug] KeyboardController Space key caused double-dispatch on focused stop node buttons**
- **Found during:** Task 2 (human verification — debugging first-stop-skipped)
- **Issue:** Pressing Space on a focused StopNode triggered both `window` keydown handler (dispatching ADVANCE) and the button's native click handler (dispatching JUMP_TO_STOP), causing navigation to skip the first stop
- **Fix:** Added early return in KeyboardController when Space keydown target is a `BUTTON`, `A`, or `INPUT` element, delegating entirely to native click handler
- **Files modified:** `src/components/features/presentation/KeyboardController.tsx`, `src/components/features/presentation/__tests__/PresentationProvider.test.tsx`
- **Verification:** All 25 tests pass; Space key on stop node now correctly opens that stop only
- **Committed in:** `b863236`

---

**Total deviations:** 2 auto-fixed (both Rule 1 bugs)
**Impact on plan:** Both fixes essential for correct navigation behavior. No scope creep.

## Issues Encountered

During human verification a regression was discovered where the first stop was being skipped when using keyboard navigation. Root cause was two interacting bugs: (1) the reducer opened currentStopIndex+1 instead of currentStopIndex on ADVANCE from map mode, and (2) Space key triggered both the window listener and the button click. Both fixed in a single commit `b863236`. A debug document was filed at `.planning/debug/resolved/first-stop-skipped.md`.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- Phase 2 complete: all 5 plans executed, all 15 requirements (NAV-01 through A11Y-05) addressed
- Full interactive flow verified in browser: keyboard navigation, animated overlay in/out, focus trap, focus return, click navigation, build succeeds
- Phase 3 (map and animation) can begin: MapCanvas is present, StopNode buttons dispatch correctly, PresentationProvider reducer is stable
- Blocker still open: SVG path `d` attribute strings for car travel routes not yet designed — Phase 3 must design these as part of map SVG creation

---
*Phase: 02-navigation-and-slides*
*Completed: 2026-03-12*
