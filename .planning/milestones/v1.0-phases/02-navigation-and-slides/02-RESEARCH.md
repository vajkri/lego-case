# Phase 2: Navigation and Slides - Research

**Researched:** 2026-03-12
**Domain:** React state machine, Framer Motion overlay, accessibility (focus trap + ARIA live)
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Overlay animation:** Scale from center of viewport; entrance scale 0.85→1.0 + opacity 0→1 simultaneously; exit reverse; duration 0.35–0.45s; via Framer Motion `AnimatePresence` in root layout (SLIDE-02 constraint)
- **BACK on slide index 0** → close overlay, return to map at current stop (same as Escape/CLOSE)
- **BACK on map (mode='map')** → if stop > 0: open previous stop at its LAST slide; if stop = 0: no-op
- **ADVANCE on map at last stop (stop 4)** → no-op (block at end, do not wrap)
- **ADVANCE past last sub-slide** → close overlay, return to map (NAV-03)
- **Jump-to-stop:** Clicking stop node or footer circle dispatches `JUMP_TO_STOP` action; requires adding `{ type: 'JUMP_TO_STOP'; stopIndex: number }` to `Action` union in `src/types/presentation.ts`
- **Slide overlay layout:** Top bar (close X, stop badge + dot indicators), large centered heading, content card (sub-heading + paragraph + numbered-badge list), side nav arrows, fixed footer (progress circles 1–5, toggle Map/Zoom-in button, Prev/Next buttons), LEGO logo placeholder
- **Bullet reveal:** All lines appear at once when slide opens; no per-bullet stagger
- **Close / toggle behavior:** Close X = Map button = Escape → close overlay, return to map; Zoom in → open current stop at current sub-slide position
- **Focus management:** Focus trap via `focus-trap-react` or equivalent; focus starts on Close X button on open; returns to triggering stop node button on close (A11Y-04)
- **State-driven navigation:** URL stays at `/` throughout; mode transitions in reducer only

### Claude's Discretion
- Exact Tailwind class choices for placeholder skeleton styling
- Focus trap library choice (focus-trap-react vs custom) — whichever is cleaner
- Exact dot indicator design (filled circle vs ring vs other)
- Exact logo placeholder (wordmark vs brick icon)
- Animation easing curve (ease-out vs spring)

### Deferred Ideas (OUT OF SCOPE)
- Per-bullet stagger/reveal mechanic — defer to Phase 4 if desired
- Split-view map + slide overlay — Map button fully closes slide; no split view
- Touch/swipe gesture support — v2 backlog (ENH-02)
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| NAV-01 | Single `PresentationContext` (useReducer) manages currentStop, currentSlide, mode | Reducer pattern documented; real transitions replace Phase 1 stubs |
| NAV-02 | `KeyboardController` listens for ArrowRight/Space (advance), ArrowLeft (back), Escape (close) | Already implemented in Phase 1 — no changes needed; reducer makes it functional |
| NAV-03 | ADVANCE on last sub-slide → close overlay, return to map | Covered in reducer transition table |
| NAV-04 | ADVANCE on map triggers car travel + opens stop's slide | Phase 2: open slide only (car travel is Phase 3); reducer opens slide overlay directly |
| NAV-05 | Navigation state is deterministic and unit-testable independent of UI | Pure reducer function; pure unit tests with vitest; reducer isolated from components |
| SLIDE-01 | Full-screen slide overlay animates in (zoom/scale) via `AnimatePresence` | AnimatePresence + motion.div scale 0.85→1 + opacity 0→1 pattern confirmed |
| SLIDE-02 | Overlay rendered as conditional React element in layout (not route transition) | In root layout.tsx under `{state.mode === 'slide' && <SlideOverlay />}` wrapped by AnimatePresence |
| SLIDE-03 | Each slide renders topic content from typed data files — no hardcoded content | `stops[]` from `src/data/topics/index.ts`; SlideOverlay reads `stops[currentStop].slides[currentSlide]` |
| SLIDE-04 | Multi-sub-slide topics step through each sub-slide before returning to map | Reducer increments currentSlide; at last slide ADVANCE → mode='map' |
| SLIDE-05 | Overlay zooms back out on close, returning focus and view to map | AnimatePresence exit animation (reverse); focus returns to stop node button via ref |
| A11Y-01 | Focus trapped inside overlay while open (WCAG 2.1.2) | `focus-trap-react` v12 wrapping overlay content |
| A11Y-02 | ARIA live region announces current topic name + sub-slide number on change | `aria-live="polite"` region with content keyed to state changes |
| A11Y-03 | Visible focus indicators on all interactive elements (WCAG 2.4.7) | Tailwind `focus-visible:ring-2` on all buttons |
| A11Y-04 | When overlay closes, focus returns to city button that triggered it | `useRef` to store triggering element; `ref.current.focus()` on close |
| A11Y-05 | Keyboard navigation model documented in code with clear comments | Inline code comments; documented in reducer and component files |
</phase_requirements>

---

## Summary

Phase 2 replaces the Phase 1 stub reducer with a real deterministic navigation state machine, builds the full-screen slide overlay with entrance/exit animations, and wires all accessibility requirements. The core technical work is: (1) writing the pure `presentationReducer` with 4 action types and all edge cases, (2) building `SlideOverlay` as a conditionally rendered motion component in root layout, (3) wrapping overlay content with `focus-trap-react`, and (4) adding an ARIA live region for screen reader announcements.

The architecture is already locked from Phase 1: state-driven navigation (no route transitions), `AnimatePresence` in root layout, `KeyboardController` unchanged. The main new integration is `SlideOverlay` mounting in `layout.tsx` alongside `KeyboardController`. Focus return on close requires a `useRef` stored in context or passed down to capture the triggering element before overlay opens.

The data layer (`stops[]`) is complete from Phase 1. The reducer has no async operations — it is a pure function mapping (state, action) → state, making it trivially testable in isolation with vitest. The screenshot reference confirms the exact UI structure needed.

**Primary recommendation:** Build the reducer first (pure function, fully tested), then build SlideOverlay as a dumb component consuming context state, then add focus trap + ARIA live region as the final layer.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| motion/react | ^12.35.2 (installed) | AnimatePresence + motion.div for overlay animation | Already installed; `motion/react` is the v12 package name (not `framer-motion`) |
| focus-trap-react | ^12.0.0 | Focus trap inside overlay (A11Y-01) | Industry standard wrapper around `focus-trap`; 571+ dependents; WCAG 2.1.2 compliant |
| React useReducer | built-in | Navigation state machine (NAV-01, NAV-05) | Pure function; deterministic; no extra library needed |
| vitest | ^4.0.18 (installed) | Unit tests for reducer (NAV-05) | Already configured with jsdom + @testing-library/react |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @testing-library/react | ^16.3.2 (installed) | Component tests for SlideOverlay | Integration tests that render components |
| Tailwind v4 | ^4.2.1 (installed) | Placeholder skeleton styling | All visual styling; `focus-visible:ring-2` for A11Y-03 |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| focus-trap-react | Custom focus trap with useRef | Custom solution misses edge cases (iframe focus, initial focus config, deactivation cleanup); focus-trap-react is 3 lines of JSX |
| focus-trap-react | `@radix-ui/react-dialog` | Radix Dialog includes focus trap + ARIA roles but adds unnecessary dialog semantics to this overlay; overcoupled |

**Installation:**
```bash
npm install focus-trap-react
```

---

## Architecture Patterns

### Recommended Project Structure (new files in Phase 2)
```
src/
├── types/
│   └── presentation.ts          # Add JUMP_TO_STOP to Action union
├── components/
│   └── features/
│       ├── presentation/
│       │   ├── PresentationProvider.tsx  # Replace stub reducer with real logic
│       │   ├── KeyboardController.tsx    # No changes needed
│       │   └── __tests__/
│       │       ├── PresentationProvider.test.tsx  # Extend with reducer tests
│       │       └── reducer.test.ts                # NEW: pure reducer unit tests
│       ├── slide/
│       │   ├── SlideOverlay/
│       │   │   ├── index.ts               # barrel export
│       │   │   ├── SlideOverlay.tsx       # main overlay; AnimatePresence wrapper
│       │   │   ├── SlideHeader.tsx        # top bar: close X + stop badge + dots
│       │   │   ├── SlideContent.tsx       # heading + content card + numbered list
│       │   │   ├── SlideFooter.tsx        # progress circles + toggle + prev/next
│       │   │   └── SlideNavArrows.tsx     # left/right arrow buttons on sides
│       └── map/
│           └── StopNode.tsx              # Add onClick → JUMP_TO_STOP
└── app/
    └── layout.tsx                         # Mount SlideOverlay + AnimatePresence
```

### Pattern 1: Real Reducer with Full Transition Table
**What:** Replace stub reducer with pure (state, action) → state function covering all 4 action types and all boundary conditions.
**When to use:** Any time dispatched actions need real state changes.

```typescript
// src/components/features/presentation/PresentationProvider.tsx
// Source: derived from CONTEXT.md decisions + stops data shape

function presentationReducer(state: PresentationState, action: Action): PresentationState {
  const stop = stops[state.currentStop]
  const isLastSlide = state.currentSlide >= stop.slides.length - 1
  const isLastStop = state.currentStop >= stops.length - 1

  switch (action.type) {
    case 'ADVANCE': {
      if (state.mode === 'slide') {
        // On last sub-slide → close overlay, return to map
        if (isLastSlide) return { ...state, mode: 'map', currentSlide: 0 }
        // Otherwise advance sub-slide
        return { ...state, currentSlide: state.currentSlide + 1 }
      }
      // mode === 'map': ADVANCE at last stop → no-op (NAV-04 + context decision)
      if (isLastStop) return state
      // Open next stop at slide 0
      return { currentStop: state.currentStop + 1, currentSlide: 0, mode: 'slide' }
    }
    case 'BACK': {
      if (state.mode === 'slide') {
        // BACK on slide 0 → close overlay, stay at current stop
        if (state.currentSlide === 0) return { ...state, mode: 'map' }
        // Otherwise go back one sub-slide
        return { ...state, currentSlide: state.currentSlide - 1 }
      }
      // mode === 'map': BACK at stop 0 → no-op
      if (state.currentStop === 0) return state
      // BACK on map → open previous stop at its LAST slide
      const prevStop = stops[state.currentStop - 1]
      return {
        currentStop: state.currentStop - 1,
        currentSlide: prevStop.slides.length - 1,
        mode: 'slide',
      }
    }
    case 'CLOSE':
      // Escape or close button → return to map, keep currentStop/currentSlide for Zoom-in restore
      return { ...state, mode: 'map' }
    case 'JUMP_TO_STOP':
      // Clicking a stop node or footer circle → jump to that stop's first slide
      return { currentStop: action.stopIndex, currentSlide: 0, mode: 'slide' }
    default:
      return state
  }
}
```

### Pattern 2: AnimatePresence Overlay in Root Layout
**What:** Wrap the conditional `SlideOverlay` render inside `AnimatePresence` in `layout.tsx`.
**When to use:** Any full-screen overlay that needs entrance/exit animation — must NOT be a route transition.

```tsx
// src/app/layout.tsx
// Source: motion.dev AnimatePresence docs + CONTEXT.md SLIDE-02 decision

import { AnimatePresence } from 'motion/react'
import { SlideOverlay } from '@/components/features/slide/SlideOverlay'

// Inside the layout render, within PresentationProvider:
// NOTE: AnimatePresence must be a client component boundary.
// Wrap it in a client component if layout.tsx is a Server Component.

// In a client wrapper component:
<AnimatePresence>
  {state.mode === 'slide' && <SlideOverlay key="slide-overlay" />}
</AnimatePresence>
```

```tsx
// src/components/features/slide/SlideOverlay/SlideOverlay.tsx
// Source: motion.dev + CONTEXT.md animation spec

'use client'
import { motion } from 'motion/react'

export function SlideOverlay() {
  return (
    <motion.div
      key="slide-overlay"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      {className}
    >
      {/* overlay content */}
    </motion.div>
  )
}
```

**CRITICAL:** `AnimatePresence` itself must be in a `'use client'` component. Since `layout.tsx` is a Server Component, create a thin `OverlayPresence` client wrapper that renders `AnimatePresence` + conditional `SlideOverlay`. Mount it in layout.tsx alongside `KeyboardController`.

### Pattern 3: Focus Trap with Focus Return
**What:** Activate focus trap on overlay open; return focus to triggering element on close.
**When to use:** Any overlay/modal that captures user interaction.

```tsx
// src/components/features/slide/SlideOverlay/SlideOverlay.tsx
// Source: focus-trap-react README + CONTEXT.md A11Y-04 decision

import FocusTrap from 'focus-trap-react'

export function SlideOverlay() {
  return (
    <FocusTrap
      focusTrapOptions={{
        initialFocus: '#slide-close-btn',     // first focus: Close X button
        returnFocusOnDeactivate: false,        // we handle return manually (A11Y-04)
      }}
    >
      <motion.div ...>
        <button id="slide-close-btn" onClick={handleClose}>×</button>
        {/* rest of overlay */}
      </motion.div>
    </FocusTrap>
  )
}
```

**Focus return (A11Y-04):** The stop node button that triggered the open must be stored before the overlay mounts, then `.focus()` called on close. Pattern: store a `triggerRef` in `PresentationContext` that `StopNode` sets on click before dispatching `JUMP_TO_STOP`, and `SlideOverlay` calls `triggerRef.current?.focus()` before unmounting (via `useEffect` cleanup or `onExitComplete`).

### Pattern 4: ARIA Live Region for Announcements
**What:** A visually-hidden `div` with `aria-live="polite"` whose text content updates when state changes.
**When to use:** Any dynamic content change that screen readers need to announce (A11Y-02).

```tsx
// Source: MDN ARIA live regions + React implementation pattern

// Persistent element mounted once in PresentationProvider or root layout:
<div
  aria-live="polite"
  aria-atomic="true"
  className="sr-only"  // visually hidden, not display:none (must be in DOM)
>
  {state.mode === 'slide'
    ? `${stops[state.currentStop].label}, slide ${state.currentSlide + 1} of ${stops[state.currentStop].slides.length}`
    : 'Map view'}
</div>
```

**Critical:** The `aria-live` element must remain mounted in the DOM at all times — do NOT conditionally render it. Recreating the element causes screen readers to lose track of the live region. Mount it once at provider level; update text content only.

### Pattern 5: Pure Reducer Unit Tests
**What:** Test the reducer as a pure function — no component rendering needed.
**When to use:** NAV-05 (deterministic, unit-testable).

```typescript
// src/components/features/presentation/__tests__/reducer.test.ts
// Source: Redux testing guide + vitest patterns

import { describe, it, expect } from 'vitest'
import { presentationReducer } from '../PresentationProvider'
import type { PresentationState } from '@/types/presentation'

const mapState: PresentationState = { currentStop: 0, currentSlide: 0, mode: 'map' }
const slideState: PresentationState = { currentStop: 2, currentSlide: 1, mode: 'slide' }

describe('presentationReducer', () => {
  it('ADVANCE on map opens next stop at slide 0', () => {
    const next = presentationReducer(mapState, { type: 'ADVANCE' })
    expect(next).toEqual({ currentStop: 1, currentSlide: 0, mode: 'slide' })
  })
  it('ADVANCE on last stop (map) is a no-op', () => {
    const lastStop = { ...mapState, currentStop: 4 }
    expect(presentationReducer(lastStop, { type: 'ADVANCE' })).toEqual(lastStop)
  })
  // ... etc
})
```

### Anti-Patterns to Avoid
- **AnimatePresence inside Server Component:** `AnimatePresence` requires client context. Never import it directly in `layout.tsx` without a `'use client'` boundary — wrap in a client component.
- **Conditional AnimatePresence wrapper:** Do NOT write `isOpen && <AnimatePresence>`. AnimatePresence must always be mounted; put the conditional inside it.
- **ARIA live region recreated on state change:** Do NOT `{isSlide && <div aria-live="polite">}`. Mount once, update text.
- **focus-trap-react with Fragment child:** The FocusTrap child must be a single DOM element (div/section), not a Fragment.
- **Calling `focus()` synchronously during exit animation:** Focus return should happen after the exit animation via `onExitComplete` callback on AnimatePresence, or via a `useEffect` cleanup that defers with `setTimeout(0)`.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Focus trap | Custom Tab key interceptor | focus-trap-react | Handles Shift+Tab, iframe focus, initial focus config, cleanup on unmount — 15+ edge cases |
| Exit animations after React unmount | useEffect + setTimeout tricks | AnimatePresence from motion/react | React removes DOM on unmount; AnimatePresence keeps element alive until exit finishes |
| Screen reader live announcements | Polling or MutationObserver | `aria-live` DOM attribute | Browser + AT handle natively; custom polling is fragile |

**Key insight:** Focus trapping looks simple (intercept Tab) but has ~15 edge cases that focus-trap handles. Custom solutions break in non-obvious ways (screen readers, reversed tab order, scrollable containers, iframes).

---

## Common Pitfalls

### Pitfall 1: AnimatePresence in Server Component
**What goes wrong:** Build fails or overlay never animates out because AnimatePresence cannot run in RSC context.
**Why it happens:** `layout.tsx` is a Server Component by default in Next.js App Router. Importing `AnimatePresence` there without a `'use client'` boundary causes a server/client mismatch.
**How to avoid:** Create a thin `'use client'` wrapper — e.g. `OverlayPresence.tsx` — that contains `AnimatePresence` + conditional `SlideOverlay`. Mount this component in `layout.tsx` the same way `KeyboardController` is mounted.
**Warning signs:** No exit animation observed; console error about hooks in server context.

### Pitfall 2: Exit Animation Fires but Component Disappears Immediately
**What goes wrong:** The overlay closes instantly without animating out.
**Why it happens:** The three requirements for AnimatePresence exit are all needed simultaneously: (1) AnimatePresence wraps the conditional, (2) the motion child has a stable `key`, (3) the motion child is a direct child of AnimatePresence. Missing any one causes silent failure.
**How to avoid:** `<AnimatePresence>{state.mode === 'slide' && <motion.div key="slide-overlay" exit={...}>}` — key must be stable across renders.
**Warning signs:** `exit` prop defined but overlay disappears without animation.

### Pitfall 3: Focus Trap Activates Before Overlay is Visible
**What goes wrong:** Focus jumps to the Close button before the scale animation completes — jarring for keyboard users.
**Why it happens:** FocusTrap activates on mount by default; motion.div starts animation on mount simultaneously.
**How to avoid:** FocusTrap wraps the motion.div; the animation and focus activation happen together — this is fine. If jarring, delay with `focusTrapOptions.delayInitialFocus: true`.
**Warning signs:** Screen reader announces content before animation starts.

### Pitfall 4: ARIA Live Region Not Announcing
**What goes wrong:** Screen reader does not read slide changes.
**Why it happens:** Most common cause: the `aria-live` element is unmounted and remounted (React key change or conditional render), losing the live region registration with the AT.
**How to avoid:** Mount the live region element ONCE — never conditionally. Change only its text content. Keep it in `PresentationProvider` render, not inside `SlideOverlay`.
**Warning signs:** Screen reader announces the first slide change but not subsequent ones.

### Pitfall 5: focus-trap-react `focusTrapOptions` Not Updating
**What goes wrong:** Changing `focusTrapOptions` props after mount has no effect.
**Why it happens:** focus-trap-react reads `focusTrapOptions` only once (documented behavior). State-dependent values in callbacks will be stale.
**How to avoid:** Avoid state-dependent values in `focusTrapOptions`. Use static selectors (`initialFocus: '#slide-close-btn'`). For dynamic behavior, use `active` prop instead.
**Warning signs:** `initialFocus` points to wrong element after state changes.

### Pitfall 6: `stops` Import in Reducer Creates Circular Dependency
**What goes wrong:** Build fails or runtime error with circular imports.
**Why it happens:** If `presentationReducer` is extracted to a separate `reducer.ts` file that imports from `@/data/topics`, and `PresentationProvider` imports both, there can be dependency cycles.
**How to avoid:** Keep reducer in `PresentationProvider.tsx` (as established in Phase 1), or extract to `reducer.ts` as a sibling — import `stops` directly in `reducer.ts` rather than passing it as argument. The data module does not import from presentation, so no cycle exists.
**Warning signs:** "Cannot access 'X' before initialization" at runtime.

---

## Code Examples

Verified patterns from official sources and Phase 1 codebase:

### JUMP_TO_STOP Action Addition (approved in CONTEXT.md)
```typescript
// src/types/presentation.ts — add to Action union
// Source: CONTEXT.md locked decision

export type Action =
  | { type: 'ADVANCE' }
  | { type: 'BACK' }
  | { type: 'CLOSE' }
  | { type: 'JUMP_TO_STOP'; stopIndex: number }  // NEW in Phase 2
```

### OverlayPresence Client Wrapper (layout bridge pattern)
```tsx
// src/components/features/slide/OverlayPresence.tsx
// Needed because layout.tsx is a Server Component
'use client'

import { AnimatePresence } from 'motion/react'
import { usePresentation } from '@/components/features/presentation'
import { SlideOverlay } from './SlideOverlay'

export function OverlayPresence() {
  const { state } = usePresentation()
  return (
    <AnimatePresence>
      {state.mode === 'slide' && <SlideOverlay key="slide-overlay" />}
    </AnimatePresence>
  )
}
```

### StopNode Click Handler Addition
```tsx
// src/components/features/map/StopNode.tsx — add onClick
'use client'
import { usePresentation } from '@/components/features/presentation'

export function StopNode({ stop, index, isActive }: StopNodeProps) {
  const { dispatch } = usePresentation()
  return (
    <button
      onClick={() => dispatch({ type: 'JUMP_TO_STOP', stopIndex: index })}
      // existing styles...
    >
      {stop.label}
    </button>
  )
}
```

### Visually Hidden (sr-only) ARIA Live Region
```tsx
// Tailwind v4 — sr-only utility positions element off-screen without display:none
// Source: Tailwind docs; display:none hides from AT, sr-only does not
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {announceText}
</div>
```

### focus-trap-react Minimal Integration
```tsx
// Source: focus-trap-react README (v11/v12 API)
import FocusTrap from 'focus-trap-react'

<FocusTrap focusTrapOptions={{ initialFocus: '#slide-close-btn' }}>
  <div>  {/* single non-Fragment child */}
    <button id="slide-close-btn">Close</button>
  </div>
</FocusTrap>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `framer-motion` package name | `motion` package, import from `motion/react` | v11 (2024) | Already in package.json as `motion`; correct import path is `motion/react` |
| Route-based slide transitions | State-driven, AnimatePresence in layout | App Router (2023) | Route transitions break exit animations; state-driven is the correct pattern |
| Custom focus lock | focus-trap-react | Pre-2020 | Battle-tested; handles edge cases custom solutions miss |

**Deprecated/outdated:**
- `framer-motion` import: was `import { motion } from 'framer-motion'`; now `import { motion } from 'motion/react'` — already correct in this project (FOUND-02).
- `useReducer` with Immer for immutability: not needed here; state shape is shallow, spread is sufficient.

---

## Open Questions

1. **Focus return timing with AnimatePresence exit animation**
   - What we know: Focus should return to triggering stop node button (A11Y-04). AnimatePresence keeps overlay in DOM during exit (~0.4s). If `focus()` is called immediately on close dispatch, the overlay is still visible but focus has left it — potentially allowing keyboard interaction with map while overlay is animating out.
   - What's unclear: Whether calling `focus()` before exit completes causes UX issues in practice.
   - Recommendation: Call `triggerRef.current?.focus()` in the `onExitComplete` callback of `AnimatePresence`. This defers focus return until overlay is fully removed. If `FocusTrap` deactivation needs to happen first, use `focusTrapOptions.returnFocusOnDeactivate: false` and handle manually.

2. **`triggerRef` storage location**
   - What we know: When overlay closes, focus must return to the stop node button that was clicked. The SlideOverlay component needs to know which button to return to.
   - What's unclear: Whether to store `triggerRef` in context, as a separate React ref passed via context, or in a custom hook.
   - Recommendation: Add a `triggerRef: React.MutableRefObject<HTMLElement | null>` to `PresentationContext` value. `StopNode` sets `triggerRef.current = event.currentTarget` before dispatching. `SlideOverlay` reads `triggerRef.current` for focus return. This is cleaner than prop drilling.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest ^4.0.18 + @testing-library/react ^16.3.2 |
| Config file | `vitest.config.ts` (exists at project root) |
| Quick run command | `npx vitest run src/components/features/presentation` |
| Full suite command | `npm test` (runs `vitest run`) |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| NAV-01 | PresentationContext provides state + dispatch | unit | `npx vitest run src/components/features/presentation/__tests__/PresentationProvider.test.tsx` | ✅ exists (extend with real reducer tests) |
| NAV-02 | KeyboardController dispatches correct actions | unit | `npx vitest run src/components/features/presentation` | ✅ (covered via reducer + integration) |
| NAV-03 | ADVANCE on last sub-slide → mode='map' | unit (reducer) | `npx vitest run --reporter=verbose` | ❌ Wave 0: `reducer.test.ts` |
| NAV-04 | ADVANCE on map → opens slide overlay | unit (reducer) | `npx vitest run --reporter=verbose` | ❌ Wave 0: `reducer.test.ts` |
| NAV-05 | Reducer is pure/deterministic | unit (reducer) | `npx vitest run --reporter=verbose` | ❌ Wave 0: `reducer.test.ts` |
| SLIDE-01 | SlideOverlay renders in slide mode | unit (component) | `npx vitest run src/components/features/slide` | ❌ Wave 0: `SlideOverlay.test.tsx` |
| SLIDE-02 | Overlay in layout, not route | manual smoke | `npm run build` passes without errors | — |
| SLIDE-03 | Slide content from data, not hardcoded | unit (component) | `npx vitest run src/components/features/slide` | ❌ Wave 0: `SlideOverlay.test.tsx` |
| SLIDE-04 | Sub-slide stepping works | unit (reducer) | `npx vitest run --reporter=verbose` | ❌ Wave 0: `reducer.test.ts` |
| SLIDE-05 | Exit animation (visual) | manual smoke | observe in browser | manual-only |
| A11Y-01 | Focus trap activates | unit (component) | `npx vitest run src/components/features/slide` | ❌ Wave 0 |
| A11Y-02 | ARIA live region present + updates | unit (component) | `npx vitest run src/components/features/slide` | ❌ Wave 0 |
| A11Y-03 | Visible focus indicators | manual smoke | keyboard navigation in browser | manual-only |
| A11Y-04 | Focus returns to trigger on close | unit (component) | `npx vitest run src/components/features/slide` | ❌ Wave 0 |
| A11Y-05 | Code comments present | code review | — | manual-only |

### Sampling Rate
- **Per task commit:** `npx vitest run src/components/features/presentation`
- **Per wave merge:** `npm test`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/components/features/presentation/__tests__/reducer.test.ts` — covers NAV-01, NAV-03, NAV-04, NAV-05, SLIDE-04, BACK boundary cases, JUMP_TO_STOP
- [ ] `src/components/features/slide/SlideOverlay/__tests__/SlideOverlay.test.tsx` — covers SLIDE-01, SLIDE-03, A11Y-01, A11Y-02, A11Y-04

---

## Sources

### Primary (HIGH confidence)
- `motion/react` installed at `^12.35.2` — confirmed from package.json
- `focus-trap-react` README (v11.0.5) — FocusTrap component API, props, usage example
- Phase 1 source files — PresentationProvider, KeyboardController, types/presentation.ts, layout.tsx, StopNode.tsx
- CONTEXT.md — all locked decisions, layout spec, animation spec
- MDN: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-live — aria-live="polite" for slide announcements

### Secondary (MEDIUM confidence)
- motion.dev AnimatePresence docs summary (via WebSearch): conditional render pattern, key requirement, `initial={false}` option, exit animation three requirements
- focus-trap-react npm page (v12.0.0 latest, March 2026 per search results): React >= 18 requirement, active/paused props

### Tertiary (LOW confidence — flag for validation)
- focus-trap-react `delayInitialFocus` option — mentioned in community sources; verify in README before use
- `onExitComplete` callback on AnimatePresence for focus return timing — described in motion.dev docs summary; verify exact prop name against `motion/react` v12 API

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries already installed or well-documented (focus-trap-react)
- Reducer logic: HIGH — pure function, all cases derived directly from CONTEXT.md locked decisions
- AnimatePresence pattern: HIGH — established pattern confirmed across multiple sources; v12 API consistent with v11
- Focus trap integration: HIGH — focus-trap-react README confirms API; only `delayInitialFocus` is LOW
- ARIA live region: HIGH — MDN spec, React implementation pattern confirmed
- Pitfalls: MEDIUM-HIGH — most derived from established Next.js + motion patterns

**Research date:** 2026-03-12
**Valid until:** 2026-04-12 (stable libraries; motion/react v12 unlikely to break API in 30 days)
