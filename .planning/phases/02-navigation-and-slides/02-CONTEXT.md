# Phase 2: Navigation and Slides - Context

**Gathered:** 2026-03-12
**Status:** Ready for planning

<domain>
## Phase Boundary

Implement the full keyboard navigation state machine, the full-screen slide overlay with enter/exit animation, multi-sub-slide stepping, and all accessibility requirements (focus trap, ARIA live regions, focus return). The map and car animation are Phase 3; this phase wires the state machine and slide overlay that Phase 3 will hand off to.

</domain>

<decisions>
## Implementation Decisions

### Overlay animation
- Scale from center of viewport (not from stop node position — avoids Phase 3 DOM coordinate dependency)
- Entrance: scale 0.85→1.0 + opacity 0→1 simultaneously
- Exit: reverse of entrance (scale down + fade out — symmetrical)
- Duration: 0.35–0.45s (cinematic but not slow)
- Implemented via Framer Motion `AnimatePresence` in root layout (SLIDE-02 constraint)

### BACK/boundary navigation logic
- **BACK on slide index 0 of any stop** → close overlay, return to map at current stop (same as Escape/CLOSE)
- **BACK on map (mode='map')** → if stop > 0: open previous stop at its LAST slide; if stop = 0: no-op
- **ADVANCE on map at last stop (stop 4)** → no-op (block at end, do not wrap)
- **ADVANCE past last sub-slide** → close overlay, return to map (existing requirement NAV-03)

### Jump-to-stop navigation
- Clicking a stop node on the map (Phase 2: positioned placeholders; Phase 3: real map nodes) jumps directly to that stop's first slide
- Clicking a stop circle in the slide footer also jumps to that stop
- Both dispatch a new `JUMP_TO_STOP` action — requires adding `{ type: 'JUMP_TO_STOP'; stopIndex: number }` to the `Action` union in `src/types/presentation.ts`
- Note: `presentation.ts` comment says not to add fields without revising — this is an approved addition in Phase 2

### Slide overlay layout structure
Layout from screenshot reference (`.planning/assets/Screenshot 2026-03-12 at 06.32.20.png`):

**Top bar (outside card)**
- Left: empty (no back arrow)
- Top-right: Close button (X) — visible affordance to close overlay and return to map
- Top-center: Stop label badge showing "STOP X  STOP NAME" (e.g. "STOP 3  HOW WE WORK") + sub-slide dot indicators (filled/unfilled dots for sub-slide position)

**Main content (outside card)**
- Large centered heading (the current sub-slide heading, e.g. "CI/CD Strategy")

**Content card (rounded box)**
- Sub-section heading (bold, accent color — placeholder)
- Description paragraph
- Numbered list items with circular number badges (not standard bullets)

**Side navigation arrows**
- Left arrow button and right arrow button on the sides of the slide
- Dispatch BACK / ADVANCE — identical behavior to ArrowLeft / ArrowRight keyboard

**Fixed footer**
- Overall stop progress: numbered circles 1–5 connected by a progress line
  - Visited stops show checkmark, current stop highlighted, future stops muted
  - Small sub-slide dot indicators below the active stop circle
  - Circles are clickable → dispatch JUMP_TO_STOP
- Bottom-right: Toggle button
  - When slide open: label "Map" → clicking closes overlay, returns to map
  - When map showing: label "Zoom in" → clicking opens current stop at current sub-slide position
- Bottom-left/right: Prev (←) and Next (→) navigation buttons (same as side arrows + keyboard)

**LEGO logo**
- Small logo placeholder in a corner (top-right or bottom area) — slot for real asset in Phase 4

### Slide visual completeness
- Structured skeleton: full HTML/component structure with semantic slots (stop label, heading, content, counter, footer)
- Styled with placeholder Tailwind classes designed to be swapped for design tokens in Phase 4
- Content-legible and presentable (suitable for showing to stakeholders in Phase 2 state)
- Not final visual design — exact colors, typefaces, spacing defer to Phase 4

### Bullet reveal behavior
- All bullet lines appear at once when the slide opens — no per-bullet stagger or reveal mechanic
- Pacing controlled by presenter speech, not animations

### Close / toggle behavior
- **Close X button (top-right)**: closes overlay → returns to map → focus returns to current stop's node button (A11Y-04)
- **Map button (footer, when slide open)**: same as Close — closes overlay, returns to map
- **Zoom in button (footer, when map showing)**: opens current stop's slide at current sub-slide position (restores position)
- **Escape key**: same as Close

### Focus management
- Focus trap active while overlay is open (A11Y-01) — implemented via `focus-trap-react` or equivalent
- Focus starts on the Close X button (first focusable element) when overlay opens
- When overlay closes, focus returns to the stop node button that triggered the open (A11Y-04)

### Claude's Discretion
- Exact Tailwind class choices for placeholder skeleton styling
- Focus trap library choice (focus-trap-react vs custom) — whichever is cleaner
- Exact dot indicator design (filled circle vs ring vs other)
- Exact logo placeholder (wordmark vs brick icon)
- Animation easing curve (ease-out vs spring)

</decisions>

<specifics>
## Specific Ideas

- Reference screenshot at `.planning/assets/Screenshot 2026-03-12 at 06.32.20.png` — the stop label badge + sub-slide dots top-center, large heading, numbered-list content card, and footer progress bar with toggle button are all visible there
- The toggle button is the primary "return to map" affordance for a non-keyboard user — label must be clear ("Map" / "Zoom in"), not just an icon
- "Zoom in" feels intentional — it reinforces the map metaphor (zooming into a city to see its content)
- Numbered list items with circular number badges (as in the screenshot) — not standard `•` bullets
- Style accuracy is lower priority than content accuracy in Phase 2; Phase 4 applies design tokens

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `PresentationProvider` + `usePresentation` hook (`src/components/features/presentation/PresentationProvider.tsx`): state + dispatch already wired; Phase 2 replaces stub reducer with real logic
- `KeyboardController` (`src/components/features/presentation/KeyboardController.tsx`): already mounted in root layout, dispatches ADVANCE/BACK/CLOSE; no changes needed
- `MapCanvas` + `StopNode` (`src/components/features/map/`): Phase 2 adds JUMP_TO_STOP dispatch to StopNode click handler
- `src/data/topics/index.ts`: `stops[]` array with all 5 stops and their sub-slides — SlideOverlay reads from this

### Established Patterns
- `'use client'` boundary required on all animation components (FOUND-03)
- `MotionConfig reducedMotion="user"` at PresentationProvider level — all motion components inherit this automatically (FOUND-04)
- `useReducer` pattern with locked `PresentationState` + `Action` types in `src/types/presentation.ts`
- State-driven navigation — URL stays at `/` throughout; mode transitions happen in reducer only

### Integration Points
- `SlideOverlay` (new in Phase 2) mounts in `src/app/layout.tsx` alongside `KeyboardController` — rendered conditionally by `state.mode === 'slide'` via `AnimatePresence`
- `StopNode` needs a click handler dispatching `JUMP_TO_STOP` — Phase 2 adds this
- Footer stop circles inside `SlideOverlay` also dispatch `JUMP_TO_STOP`
- `src/types/presentation.ts` needs one new Action variant: `{ type: 'JUMP_TO_STOP'; stopIndex: number }`

</code_context>

<deferred>
## Deferred Ideas

- Per-bullet stagger/reveal mechanic (each ArrowRight reveals next bullet) — could add in Phase 4 if desired, deferred to keep reducer simple in Phase 2
- Split-view map + slide overlay — user clarified Map button fully closes slide; no split view needed
- Touch/swipe gesture support — v2 backlog (ENH-02, already in Phase 1 deferred)

</deferred>

---

*Phase: 02-navigation-and-slides*
*Context gathered: 2026-03-12*
