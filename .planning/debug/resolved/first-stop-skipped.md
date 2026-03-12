---
status: resolved
trigger: "Stop at index 0 never opens — overlay always starts on stop 2 Vision"
created: 2026-03-12T00:00:00Z
updated: 2026-03-12T00:00:03Z
---

## Current Focus

hypothesis: Space keydown fires window-level ADVANCE dispatch AND also activates the focused button (button click on keyup). If the focused button is stop-1 (auto-focused by browser for some reason), JUMP_TO_STOP(1) fires and React applies it after ADVANCE, landing on Vision. The fix: guard KeyboardController to skip dispatch when Space keydown target is a button — let the button's native click handle it.
test: apply e.target button guard in KeyboardController; also add console.log(e.target) to surface which element is focused when Space is pressed
expecting: either (a) guard eliminates the double-dispatch and The Case opens correctly, or (b) log reveals the focused element is not stop 0 — informing whether we also need initial focus management
next_action: await human verification that Space now correctly opens stop 0 "The Case"

## Symptoms

expected: Pressing Space (or ArrowRight) on initial load opens the SlideOverlay for stop 0 "The Case"
actual: Space opens stop index 1 "Vision" (stop 2 in 1-based user labeling). ArrowRight may be fixed. Space is uniquely broken.
errors: No console errors reported
reproduction: Run `npm run dev`, visit localhost:3000, press Space
started: Partial fix: ArrowRight fixed, Space still broken after checkpoint verification

## Eliminated

- hypothesis: MapCanvas passes wrong index
  evidence: MapCanvas uses `stops.map((stop, index) => ...)` — index is correct 0-based
  timestamp: 2026-03-12T00:00:01Z

- hypothesis: Stop data array starts at index 1
  evidence: topics/index.ts exports `[stopTheCase, stopVision, ...]` — stopTheCase is at index 0
  timestamp: 2026-03-12T00:00:01Z

- hypothesis: JUMP_TO_STOP skips index 0
  evidence: StopNode dispatches `{ type: 'JUMP_TO_STOP', stopIndex: index }` correctly; reducer sets currentStop directly — JUMP_TO_STOP is fine
  timestamp: 2026-03-12T00:00:01Z

- hypothesis: ADVANCE reducer wrong (increments before opening)
  evidence: Fix applied — map mode ADVANCE now keeps currentStop and only changes mode to 'slide'. ArrowRight confirmed working.
  timestamp: 2026-03-12T00:00:02Z

- hypothesis: Double ADVANCE from StrictMode double effect
  evidence: React StrictMode cleans up and re-adds the effect — net result is ONE listener. Double listener is not the cause.
  timestamp: 2026-03-12T00:00:03Z

- hypothesis: Double ADVANCE produces Vision (stop 0 has 2 slides, so 2×ADVANCE gives slide 1 not stop 1)
  evidence: stop-01-the-case.ts has 2 slides. Two ADVANCEs from map mode: ADVANCE1 → {stop:0,slide:0,mode:slide}, ADVANCE2 → {stop:0,slide:1,mode:slide}. Still stop 0, not stop 1. Ruled out.
  timestamp: 2026-03-12T00:00:03Z

## Evidence

- timestamp: 2026-03-12T00:00:01Z
  checked: PresentationProvider.tsx ADVANCE reducer, map mode branch
  found: (original bug) `return { currentStop: state.currentStop + 1, currentSlide: 0, mode: 'slide' }` — always incremented before opening
  implication: Fixed in prior session.

- timestamp: 2026-03-12T00:00:03Z
  checked: KeyboardController.tsx Space handling
  found: `e.preventDefault()` called on keydown prevents scroll but may NOT prevent button activation in all browsers. Space keyup still fires click on the focused button in some environments.
  implication: If a button is focused when Space is pressed, both window ADVANCE dispatch AND button click dispatch can fire.

- timestamp: 2026-03-12T00:00:03Z
  checked: StopNode.tsx onClick handler
  found: dispatches `JUMP_TO_STOP(index)` not `ADVANCE`. If stop-1 button is focused and Space click fires → JUMP_TO_STOP(1) → Vision.
  implication: The stop-1 button being focused (intentionally or by browser) + Space button activation = JUMP_TO_STOP(1) fires.

- timestamp: 2026-03-12T00:00:03Z
  checked: React dispatch batching with ADVANCE + JUMP_TO_STOP(1) in same tick
  found: React applies dispatches sequentially. ADVANCE first → {stop:0, mode:slide}; then JUMP_TO_STOP(1) → {stop:1, mode:slide}. Final render: Vision.
  implication: This is the only sequence that produces Vision. Requires stop-1 button to be focused when Space is pressed.

- timestamp: 2026-03-12T00:00:03Z
  checked: How stop-1 button could be focused on page load
  found: Browser may auto-focus stop-1 instead of stop-0 due to scroll restoration, OS/browser focus behavior, or previous page state. Yellow highlight on stop-0 is `isActive` (state.currentStop === 0), NOT focus — these are separate. Stop-1 could have keyboard focus (focus-visible ring) while stop-0 has the yellow isActive background.
  implication: User may be misidentifying active (yellow bg) vs focused (yellow ring) button.

## Resolution

root_cause: Space keydown triggers BOTH (a) window keydown → ADVANCE dispatch via KeyboardController, AND (b) button click activation on keyup → JUMP_TO_STOP dispatch via StopNode. If the focused button is stop-1 (browser auto-focus, not necessarily stop-0), React applies ADVANCE then JUMP_TO_STOP(1) in sequence, landing on Vision.

fix: |
  1. Guard KeyboardController: for Space, if e.target is a button/link/input, return early and let the
     element's native click handle dispatch. This eliminates the double-dispatch.
  2. This also correctly handles slide mode: when a slide-nav button is focused and Space pressed,
     only the button's onClick fires ADVANCE (not two ADVANCE dispatches).

verification: All 25 tests pass after fix. Fix targets the double-dispatch mechanism: KeyboardController now returns early when Space keydown target is a button/link/input, delegating entirely to the element's native click handler. Human verification needed for the actual browser interaction.

files_changed:
  - src/components/features/presentation/PresentationProvider.tsx
  - src/components/features/presentation/__tests__/reducer.test.ts
  - src/components/features/presentation/__tests__/PresentationProvider.test.tsx
  - src/components/features/presentation/KeyboardController.tsx (new fix)
