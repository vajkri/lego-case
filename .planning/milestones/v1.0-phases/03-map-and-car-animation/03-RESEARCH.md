# Phase 3: Map and Car Animation - Research

**Researched:** 2026-03-12
**Domain:** SVG map design, CSS motion path (offset-path/offset-distance), Motion/React v12 animation, state machine extension
**Confidence:** HIGH (core animation APIs), MEDIUM (coordinate alignment strategy)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **World map visual:** Stylized illustrated terrain map — NOT a real geographic world map. Flat illustration style (game map / LEGO instruction booklet feel). Road narrative: rural idyll (left) → modern city (right) mirroring AngularJS → React story. Visual elements: sky/grass palette from Screenshot 1, pond, mountains, road color from Screenshot 1, buildings/cityscape on right (Screenshot 2), clouds at varied heights, sun, windmill, small fence. Balanced density (Screenshot 1 as reference). Avoid: uniform cloud heights, overly dark sky/grass, awkward road curves, cows.
- **Built by the frontend-design skill** with the two screenshots as direct visual reference. Screenshots at `.planning/assets/map-inspiration/`. User uploads both screenshots at execution time.
- **Car element:** Red LEGO car SVG. Auto-rotates to face direction of travel (`offsetRotate: "auto"` CSS). Spring/bounce arrival animation. Two-step interaction model: Step 1 ADVANCE → car travels to next stop, parks, stop becomes active. Step 2 ADVANCE (car parked) → slide overlay opens.
- **Travel path:** One continuous winding SVG road path connecting all 5 stops in sequence. The road IS BOTH the visual road on the map AND the `offsetPath` for car animation. Road path shape determined during frontend-design SVG creation. Car travels forward (0→4) and backward (4→0) along same path. Backward = reversed offsetDistance direction.
- **Stop node markers:** LEGO-themed location marker. Always-visible stop name label. Three states: unvisited (hollow/muted), visited (filled LEGO yellow), active/current (brighter + focus ring). Each marker is a focusable `<button>` with JUMP_TO_STOP dispatch.
- **Progress indicator:** Marker states on map serve as primary progress cue. A separate progress bar/counter is Claude's discretion — keep simple and non-intrusive.
- **State machine changes:** Phase 2 ADVANCE on map mode now requires travel → arrival → parked → overlay flow. Requires new state field. Planner must coordinate this change.

### Claude's Discretion

- Exact SVG implementation of the LEGO-themed location marker
- Exact car SVG design (red LEGO car, Screenshot 1 as reference)
- Whether to add `mode: 'traveling'` or use a boolean flag `isCarTraveling: boolean`
- Input handling during car travel (research best UX practice)
- Road path `d` attribute values — designed during map design
- Stop coordinate values in data files — updated after SVG is built
- Progress indicator design on the map view (beyond marker states)

### Deferred Ideas (OUT OF SCOPE)

- Visual grouping / clustering of stops on map by theme
- Per-stop visual variation (different building types per stop matching content)
- Touch/swipe gesture support — v2 backlog (ENH-02)

</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| MAP-01 | SVG inline world map renders as root/default view with named stop nodes at defined coordinates | SVG inline component pattern; `<svg viewBox>` with nested elements; stops[] coordinates updated post-design |
| MAP-02 | Each stop node is a focusable `<button>` with visible label, keyboard-focusable, screen reader accessible | Existing StopNode.tsx pattern is reusable; add aria-label with stop name + visited state |
| MAP-03 | Visited stops have distinct visual state from unvisited | Three-class pattern: `unvisited` / `visited` / `active` driven by `state.currentStop` and a `visitedStops: Set<number>` tracked in state |
| MAP-04 | Progress indicator shows current position in journey | Marker states serve as primary cue; a simple "Stop X of 5" counter or dot row as secondary; driven by `state.currentStop` |
| CAR-01 | Red LEGO car element rendered on map, positioned at current stop | Inline SVG car element absolutely positioned; `offsetPath` + `offsetDistance` drives position |
| CAR-02 | Car animates along path to next stop using CSS motion path (`offsetPath`) | `style={{ offsetPath: path("...") }}` + `animate={{ offsetDistance: "X%" }}` via Motion v12 |
| CAR-03 | Car travel uses CSS transform properties (x/y), not SVG coordinate attributes — no layout/paint per frame | CSS motion path (`offset-path` + `offset-distance`) is a composited/paint-only property; `will-change: transform` hint can further promote to compositor layer |
| CAR-04 | Car travel is smooth, no dropped frames on standard laptop | CSS motion path animates outside layout; `will-change: transform` promotes to GPU layer; linear/spring easing via Motion; `MotionConfig reducedMotion="user"` already at root |

</phase_requirements>

---

## Summary

Phase 3 replaces the Phase 1 blank `MapCanvas` placeholder with a fully illustrated SVG world map, replaces the plain-button `StopNode` with LEGO-themed markers, adds a red LEGO car element, and animates that car along the road path using CSS motion path. It also extends the Phase 2 state machine to support an intermediate "traveling" state that gives the presenter a deliberate beat between car arrival and slide opening.

The core animation technique is CSS motion path: a `<div>` (or `motion.div`) absolutely positioned over the SVG map with `style={{ offsetPath: 'path("...")' }}`. The car's position along the road is driven by animating `offsetDistance` from one stop's percentage to the next via Motion's `animate` prop with a spring or tween transition. The road SVG `<path>` element and the car's `offsetPath` use the identical `d` string — this is the single source of truth for both visual road and car movement path.

The most critical planning decision is the coordinate system architecture: the car element must be an HTML element (div) positioned absolutely over the SVG, not an SVG element, because CSS `offset-path` on an SVG element uses SVG user-unit coordinates, while on an HTML element it uses pixel coordinates. The recommended pattern is a single `<div>` wrapper that matches the SVG's rendered dimensions exactly, with the car as an absolutely-positioned `motion.div` child. This ensures the coordinate space for `path()` in `offset-path` matches the rendered SVG viewBox projection.

**Primary recommendation:** Use `motion.div` with `style={{ offsetPath: path("..."), offsetRotate: "auto" }}` and drive `animate={{ offsetDistance: "X%" }}` between precomputed stop percentages. The road `<path>` d-string is authored once by frontend-design and shared between SVG rendering and the car's offsetPath. State machine gains an `isCarTraveling: boolean` flag (simpler than a new mode value).

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| motion/react | ^12.35.2 (installed) | Car animation along path, arrival spring, stop marker transitions | Already installed, MotionConfig already at root |
| Tailwind v4 | ^4.2.1 (installed) | Map layout, marker states, responsive sizing | Already installed and configured |
| React / Next.js | 19 / 16 (installed) | Component tree, 'use client' boundary, static export | Project foundation |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| vitest + @testing-library/react | installed | Reducer unit tests for new traveling state | Testing state machine changes — no DOM needed for reducer |
| CSS `offset-path` / `offset-distance` | Browser native | GPU-composited car movement along path | Core animation primitive; used via motion/react style prop |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CSS motion path via `offset-path` | SVG `<animateMotion>` | animateMotion is purely declarative, harder to control imperatively from React state; motion path is better for JS-driven positional updates |
| CSS motion path | GSAP MotionPath | GSAP is more powerful for complex paths + responsive scaling but adds bundle weight; not needed for a single fixed path in a desktop-only static export |
| HTML `motion.div` for car | SVG `<g>` element | SVG elements don't benefit from the same CSS compositing path; coordinate units differ from HTML; HTML div is cleaner for offsetPath |

**Installation:** No new packages required — motion/react is already installed.

---

## Architecture Patterns

### Recommended Component Structure for Phase 3

```
src/components/features/map/
├── MapCanvas.tsx           # Replaced: now renders inline SVG + car layer
├── MapSvg.tsx              # NEW: the illustrated SVG world map (frontend-design output)
├── RoadPath.tsx            # NEW: exports ROAD_PATH_D constant + renders <path> element
├── StopNode.tsx            # Updated: LEGO marker design (3 visual states)
├── CarElement.tsx          # NEW: motion.div with offsetPath animation
├── MapProgressIndicator.tsx # NEW (optional): simple counter or dot row
└── index.ts                # Barrel export
```

### Pattern 1: CSS Motion Path for Car Travel

**What:** The car is a `motion.div` absolutely positioned over the SVG map. Its `style` prop sets the `offsetPath` using the road's SVG path string. Its `animate` prop drives `offsetDistance` to the target stop's precomputed percentage.

**When to use:** Whenever the car needs to move between stops. The `offsetDistance` value for each stop is computed as a fixed percentage of total path length. These percentages are constants authored at design time (or computed once using `SVGPathElement.getTotalLength()` and `getPointAtLength()`).

**Example:**
```typescript
// Source: motion.dev official docs pattern + MDN offset-path spec
// CarElement.tsx
'use client'
import { motion } from 'motion/react'

// ROAD_PATH_D is the identical d="" string used in <path> and here
const ROAD_PATH_D = 'M 50,400 C 100,300 200,350 ...'

// Stop percentages along the path — authored after frontend-design builds SVG
// These are NOT pixel values; they are 0–100 percentages of path total length
const STOP_OFFSETS = ['5%', '25%', '50%', '75%', '95%']

interface CarElementProps {
  targetStop: number
  isReversed: boolean
  onArrival: () => void
}

export function CarElement({ targetStop, isReversed, onArrival }: CarElementProps) {
  return (
    <motion.div
      style={{
        position: 'absolute',
        offsetPath: `path("${ROAD_PATH_D}")`,
        offsetRotate: isReversed ? 'reverse' : 'auto',
        willChange: 'transform',
        // car dimensions — centered on path via offset-anchor default (50% 50%)
        width: 48,
        height: 28,
      }}
      animate={{ offsetDistance: STOP_OFFSETS[targetStop] }}
      transition={{
        type: 'tween',
        duration: 1.2,
        ease: 'easeInOut',
      }}
      onAnimationComplete={onArrival}
    >
      {/* Car SVG content here */}
    </motion.div>
  )
}
```

**Key facts (HIGH confidence):**
- `offsetPath: 'path("...")'` — the CSS `path()` function; motion/react passes this as a style prop using camelCase `offsetPath`
- `animate={{ offsetDistance: "50%" }}` — motion/react animates camelCase CSS properties with string values containing units
- `onAnimationComplete` callback fires when the animate target is reached — use this to dispatch arrival action to reducer
- `offsetRotate: "auto"` — element auto-rotates to face forward along path direction (browser native)
- `offsetRotate: "reverse"` — element faces backward along path, correct for reverse travel
- `willChange: "transform"` — hints to browser to promote element to compositor layer; motion/react often adds this automatically but explicit hint reinforces it

### Pattern 2: State Machine Extension — isCarTraveling Flag

**What:** Add `isCarTraveling: boolean` to `PresentationState`. When true, ADVANCE on map is a no-op (or queued). When false and mode is `'map'`, ADVANCE starts travel.

**Why flag over new mode:** The `mode` field already semantically maps to `'map' | 'slide'`. Travel is a sub-state of map mode. A boolean flag keeps the mode field clean and avoids breaking every existing mode check.

**New state flow (replaces Phase 2 NAV-04 behavior):**

```
// Old (Phase 2):
mode='map' + ADVANCE → mode='slide'

// New (Phase 3):
mode='map', isCarTraveling=false + ADVANCE → mode='map', isCarTraveling=true, currentStop advances
// (car travel begins; CarElement.onAnimationComplete fires)
mode='map', isCarTraveling=true + ARRIVE (new action) → mode='map', isCarTraveling=false
// (car parked; presenter can now advance)
mode='map', isCarTraveling=false + ADVANCE → mode='slide'
// (overlay opens, same as Phase 2 first press)
```

**New action required:**
```typescript
// In src/types/presentation.ts — add to Action union:
| { type: 'ARRIVE' }  // dispatched by CarElement.onAnimationComplete
```

**Updated PresentationState:**
```typescript
export interface PresentationState {
  currentStop: number
  currentSlide: number
  mode: 'map' | 'slide'
  isCarTraveling: boolean   // NEW: Phase 3
  visitedStops: number[]    // NEW: Phase 3 — for MAP-03 visited state
}
```

### Pattern 3: Input Handling During Travel

**Recommendation (Claude's Discretion — research finding):** Ignore inputs during car travel.

**Rationale:** This is a presentation tool used by a single presenter at controlled pace. The two-step model is *intentional pacing* — the presenter expects to wait. Skipping-to-destination would undermine the metaphor (the journey matters). Queuing would cause confusing double-fires. Ignoring input is the simplest, most predictable behavior: `if (state.isCarTraveling) return state` for ADVANCE and BACK in map mode.

**KeyboardController change required:** No change needed — the reducer no-ops are sufficient. The controller dispatches ADVANCE; the reducer ignores it while `isCarTraveling: true`.

### Pattern 4: Coordinate System Architecture

**Critical: HTML element for car, NOT SVG element**

The car `motion.div` must be a sibling to the `<svg>` element (or overlaid using `position: absolute`), NOT a child of the `<svg>`. Reason:

- When `offset-path` is applied to an **HTML element**, coordinates in `path()` are in pixels relative to the element's nearest positioned ancestor.
- When `offset-path` is applied to an **SVG element**, coordinates are in SVG user units (the viewBox coordinate system).

The recommended wrapper architecture:

```tsx
// MapCanvas.tsx
<div className="relative w-full h-screen">
  {/* Illustrated SVG map — fills the container */}
  <MapSvg className="absolute inset-0 w-full h-full" />

  {/* Car layer — same absolute bounds as SVG */}
  {/* CarElement uses offsetPath with px coords matching SVG viewBox projected to screen */}
  <CarElement targetStop={state.currentStop} ... />

  {/* Stop node buttons — absolutely positioned over SVG */}
  {stops.map((stop, index) => (
    <StopNode key={stop.slug} stop={stop} ... />
  ))}
</div>
```

**Coordinate derivation:** The SVG viewBox (e.g. `0 0 1200 700`) maps to the rendered container size. The `path()` string in `offsetPath` uses the same coordinate space as the SVG `<path d="">`. If the SVG has `viewBox="0 0 1200 700"` and renders at 1200×700px, coordinates are identical. If the SVG scales responsively, the HTML `offset-path` does NOT scale automatically — the path() string remains in original pixel values. **For a desktop-only presentation app rendered full-screen, this is acceptable** — the viewport is predictable and the SVG will be designed for full-screen dimensions.

### Pattern 5: Dual-Path Strategy (Visual Road + Car Path)

The road is both:
1. An SVG `<path>` element rendered as the visual road (with stroke color, width, etc.)
2. The value of `offsetPath: path("...")` on the car element

Both use the same `d` attribute string. This string is the single source of truth. Exporting it as a TypeScript constant avoids drift:

```typescript
// src/components/features/map/RoadPath.tsx
export const ROAD_PATH_D =
  'M 80,500 C 150,450 250,480 ...'  // authored by frontend-design

export function RoadPath() {
  return (
    <path
      d={ROAD_PATH_D}
      stroke="#c8a05a"
      strokeWidth={12}
      fill="none"
      strokeLinecap="round"
    />
  )
}
```

### Anti-Patterns to Avoid

- **Animating SVG attribute coordinates directly** (e.g. `cx`, `cy`, `x`, `y`) — triggers layout/paint on every frame; violates CAR-03. Use offsetPath instead.
- **Using `<animateMotion>` SVG element** — declarative, not React-state-driven; can't stop/start based on reducer state.
- **Animating `left` / `top` CSS properties** — triggers layout reflow on every frame; same violation as CAR-03.
- **Putting the car `<g>` inside the `<svg>` and using offsetPath** — SVG user-unit coordinate mismatch causes car to appear at wrong position unless exact viewBox math is applied.
- **Not exporting `ROAD_PATH_D` as a shared constant** — the SVG road and the offsetPath drift apart silently during edits.
- **Computing stop offsets at render time via getTotalLength()** — causes layout thrashing; compute once in a module-level constant or on first mount, then cache.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Path-following animation | Custom requestAnimationFrame with getPointAtLength() | CSS `offset-path` + Motion animate | Browser handles interpolation; GPU composited; 10 lines vs 80+ |
| Spring/bounce arrival effect | Custom damped oscillation math | Motion `transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}` | Physics correct; respects MotionConfig reducedMotion automatically |
| Visited stop tracking | LocalStorage or separate Zustand store | Add `visitedStops: number[]` to existing PresentationState | Reducer pattern is already established; no new dependencies |
| Stop coordinate percentages | Runtime getTotalLength() on every render | Module-level constant array authored after SVG design | getTotalLength() is a layout operation; constant is zero-cost |
| Car rotation on path | Manual `Math.atan2()` angle calculation | `offsetRotate: "auto"` (CSS native) | Browser computes tangent angle natively |

**Key insight:** The entire car animation problem is solved by three CSS properties (`offset-path`, `offset-distance`, `offset-rotate`) and one Motion animate call. Do not abstract this into a custom hook unless needed for multiple animated elements.

---

## Common Pitfalls

### Pitfall 1: offset-path Coordinates Don't Scale with SVG viewBox

**What goes wrong:** Frontend-design builds the SVG with `viewBox="0 0 1200 700"`. The path() string uses those coordinates. On a 2560×1600 HiDPI display, the SVG scales to fill the viewport but the `offset-path: path("...")` string still uses 1200×700 pixel values. The car follows the path at the wrong scale.

**Why it happens:** CSS `offset-path` on HTML elements uses CSS pixel coordinates, not SVG user units. When the SVG scales via `width: 100%; height: 100%`, its internal coordinate system scales too, but the HTML element's `offset-path` does not.

**How to avoid:** Design the SVG for the intended fixed viewport dimensions (1920×1080 or similar) and use `object-fit: cover` / `contain` only if needed. For a full-screen desktop presentation with `h-screen w-full`, use `preserveAspectRatio="xMidYMid meet"` and ensure the SVG always renders at viewBox aspect ratio. Alternatively, derive stop percentages along path length (not coordinates) — percentage-based `offset-distance` is immune to scaling because it's relative to total path length.

**Warning signs:** Car appears to travel at correct speed but ends up at wrong location; car goes off the visible road.

### Pitfall 2: Car SVG Element Inside `<svg>` with offset-path

**What goes wrong:** Placing the car as a `<g>` or `<image>` inside the `<svg>` and applying `offset-path` works in some browsers but uses SVG user-unit coordinates, not CSS pixel coordinates. Behavior differs cross-browser.

**Why it happens:** SVG coordinate system is separate from CSS layout coordinate system. MDN notes: "If you're applying the CSS to an element within SVG, those coordinate values will use the coordinate system set up within that SVG's viewBox."

**How to avoid:** Keep the car as an HTML `<div>` (`motion.div`) that is a sibling to or overlaid on the `<svg>`, not nested inside it.

**Warning signs:** Car position looks correct in Chrome but wrong in Firefox or Safari.

### Pitfall 3: ADVANCE Reducer Test Failures After State Shape Change

**What goes wrong:** Adding `isCarTraveling` and `visitedStops` to `PresentationState` breaks existing reducer tests that compare `toEqual({ currentStop: 0, currentSlide: 0, mode: 'map' })` without the new fields.

**Why it happens:** All existing test fixtures use the old shape. `toEqual` does deep equality — missing fields fail the match.

**How to avoid:** Update all test fixture definitions in `reducer.test.ts` to include `isCarTraveling: false` and `visitedStops: []`. Add new test cases for travel flow. Do this in a Wave 0 task before implementing the reducer change.

**Warning signs:** All existing reducer tests fail immediately after adding new fields to the initial state.

### Pitfall 4: onAnimationComplete Not Firing on Reduced Motion

**What goes wrong:** `MotionConfig reducedMotion="user"` is at root. When `prefers-reduced-motion: reduce` is active, Motion may skip or instant-complete the animation. If `onAnimationComplete` is not called in this case, the `ARRIVE` action never dispatches and the car is stuck in `isCarTraveling: true` forever.

**Why it happens:** Motion respects reduced motion by either skipping animations or completing them instantly. The `onAnimationComplete` should still fire in both cases, but this should be verified.

**How to avoid:** Test with `prefers-reduced-motion: reduce` in Chrome DevTools. Add a fallback: if `isCarTraveling` is true for more than N ms without an ARRIVE action, dispatch ARRIVE as a safety net (optional; only if testing reveals the issue).

**Warning signs:** App becomes unresponsive after first ADVANCE when reduced motion is enabled.

### Pitfall 5: Stop Percentage Values Authored Before Path is Final

**What goes wrong:** STOP_OFFSETS constants are hardcoded during development based on an estimated path, then the path is changed during design iteration. The car stops at wrong locations.

**Why it happens:** Tight coupling between path geometry and stop percentage values.

**How to avoid:** The path `d` string and the `STOP_OFFSETS` array are co-located in the same file (`RoadPath.tsx` or `mapConfig.ts`). The plan notes that stop coordinate values are updated after frontend-design finalizes the SVG. Use inline comments marking them as "design-time constants, update together with ROAD_PATH_D."

---

## Code Examples

Verified patterns from Motion v12 official docs and MDN:

### Car Motion Path Setup
```typescript
// Source: motion.dev tutorials/react-motion-path pattern + MDN offset-path
// Confirmed: animate prop accepts camelCase CSS motion path properties

<motion.div
  style={{
    position: 'absolute',
    offsetPath: `path("${ROAD_PATH_D}")`,   // CSS path() function via camelCase style prop
    offsetRotate: 'auto',                   // auto-faces direction of travel
    willChange: 'transform',               // promote to compositor layer
    width: 48,
    height: 24,
  }}
  animate={{ offsetDistance: STOP_OFFSETS[targetStop] }}  // "0%" to "100%"
  transition={{
    type: 'tween',
    duration: 1.2,
    ease: [0.4, 0, 0.2, 1],               // material ease-in-out
  }}
  onAnimationComplete={handleArrival}      // fires when offsetDistance reaches target
/>
```

### Arrival Spring Bounce
```typescript
// Source: Motion docs — duration-based spring with bounce parameter
// Apply as a SECOND animation after arrival, on a scale/translate property

<motion.div
  animate={isArrived ? { scale: [1, 1.15, 0.95, 1] } : {}}
  transition={{ type: 'spring', duration: 0.5, bounce: 0.4 }}
/>
// OR use animate keyframe array: scale: [1, 1.2, 1]
// transition: { type: 'spring', stiffness: 400, damping: 12 }
```

### onAnimationComplete Callback
```typescript
// Source: Motion docs pattern — callback receives latest animated values
<motion.div
  animate={{ offsetDistance: STOP_OFFSETS[targetStop] }}
  onAnimationComplete={() => {
    dispatch({ type: 'ARRIVE' })  // triggers reducer: isCarTraveling → false
  }}
/>
```

### Backward Travel (offsetRotate: "reverse")
```typescript
// Source: MDN offset-rotate — "reverse" is equivalent to "auto 180deg"
// Correct for car driving from stop 4 back to stop 3

const isMovingBackward = targetStop < previousStop

<motion.div
  style={{
    offsetPath: `path("${ROAD_PATH_D}")`,
    offsetRotate: isMovingBackward ? 'reverse' : 'auto',
  }}
  animate={{ offsetDistance: STOP_OFFSETS[targetStop] }}
  // Motion interpolates from current offsetDistance to new target
  // Going from "75%" to "50%" moves backward along path
/>
```

### New PresentationState with Travel Fields
```typescript
// src/types/presentation.ts addition
export interface PresentationState {
  currentStop: number
  currentSlide: number
  mode: 'map' | 'slide'
  isCarTraveling: boolean  // true while car is in motion
  visitedStops: number[]   // indices of stops the car has reached
}

// Initial state in PresentationProvider:
const initialState: PresentationState = {
  currentStop: 0,
  currentSlide: 0,
  mode: 'map',
  isCarTraveling: false,
  visitedStops: [0],  // start 0 is "visited" from the beginning
}
```

### Reducer ADVANCE Case — New Two-Step Map Flow
```typescript
case 'ADVANCE': {
  if (state.mode === 'slide') {
    // ... existing slide logic unchanged ...
  }
  if (state.mode === 'map') {
    if (state.isCarTraveling) return state  // ignore during travel

    // Car is parked. Two-step: first time opens travel, second time opens slide.
    // "Parked at current stop, overlay not open" → begin travel to next stop
    const isLastStop = state.currentStop === stops.length - 1
    if (isLastStop) return state  // no-op at end

    // Start traveling: advance stop index, set traveling flag
    // CarElement reads targetStop from state.currentStop and starts animation
    const nextStop = state.currentStop + 1
    return {
      ...state,
      currentStop: nextStop,
      isCarTraveling: true,
    }
    // After car arrives → ARRIVE action → isCarTraveling: false
    // Next ADVANCE → mode: 'slide' (second step)
  }
}

case 'ARRIVE': {
  return {
    ...state,
    isCarTraveling: false,
    visitedStops: state.visitedStops.includes(state.currentStop)
      ? state.visitedStops
      : [...state.visitedStops, state.currentStop],
  }
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| SVG `<animateMotion>` for path following | CSS `offset-path` + JS animation library | ~2018-2020 | JS control over animation state; GPU composited |
| `requestAnimationFrame` + `getPointAtLength()` | CSS motion path | ~2020 | Browser-native interpolation; less JS |
| `framer-motion` npm package | `motion` npm package (motion/react) | Late 2024 | Same API; project already uses `motion` |
| GSAP MotionPath for complex paths | CSS offset-path sufficient for simple paths | Ongoing | GSAP still needed for responsive scaling; overkill for fixed-viewport |

**Deprecated/outdated:**
- `motion-path` CSS property name: renamed to `offset-path` in final spec (both work in modern browsers but `offset-path` is correct)
- `framer-motion` import: now `motion/react` — project already uses correct package

---

## Open Questions

1. **Responsive path scaling**
   - What we know: CSS `offset-path: path()` uses fixed pixel coordinates; SVG scales with viewport
   - What's unclear: How much does the SVG scale in practice? If designed for 1920×1080 and presented on 1440×900, is the mismatch acceptable?
   - Recommendation: Design the map SVG for a fixed aspect ratio and use CSS `aspect-ratio` to prevent scaling. Full-screen `h-screen w-full` with SVG `preserveAspectRatio="xMidYMid meet"` should keep it stable for the intended desktop presentation context. Flag for human verification during Phase 4.

2. **Stop percentage computation**
   - What we know: `STOP_OFFSETS` must be `["5%", "28%", "52%", "75%", "95%"]` (example) matching actual stop positions along path
   - What's unclear: These values can't be computed until frontend-design finalizes the path `d` string. The plan must sequence this correctly.
   - Recommendation: A Wave 0 task should scaffold the constants file with placeholder values; a later wave updates them after the SVG is built and visually verified.

3. **visitedStops initial state — should stop 0 start as visited?**
   - What we know: The presenter starts at stop 0 with the car parked there
   - What's unclear: Whether stop 0 marker should show "visited" (yellow) from the beginning or only after first ADVANCE
   - Recommendation: Initialize `visitedStops: [0]` — the car starts at stop 0, so it is "active/visited" from the start. Keeps the visual consistent.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.0.18 + @testing-library/react 16.3.2 |
| Config file | `vitest.config.ts` (root) |
| Quick run command | `npx vitest run src/components/features/presentation/__tests__/reducer.test.ts` |
| Full suite command | `npx vitest run` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| MAP-01 | SVG map renders with stop nodes | smoke/visual | human verification (SVG visual) | manual-only |
| MAP-02 | Stop nodes are focusable buttons with labels | unit (render) | `npx vitest run src/components/features/map/__tests__/StopNode.test.tsx` | ❌ Wave 0 |
| MAP-03 | Visited/active/unvisited visual states render | unit (render) | `npx vitest run src/components/features/map/__tests__/StopNode.test.tsx` | ❌ Wave 0 |
| MAP-04 | Progress indicator reflects currentStop | unit (render) | included in StopNode/MapCanvas tests | ❌ Wave 0 |
| CAR-01 | Car element renders at correct stop | unit (render) | `npx vitest run src/components/features/map/__tests__/CarElement.test.tsx` | ❌ Wave 0 |
| CAR-02 | Car animate prop has correct offsetDistance target | unit (render) | included in CarElement test | ❌ Wave 0 |
| CAR-03 | Car uses offsetPath not top/left coordinates | unit (style assertion) | included in CarElement test | ❌ Wave 0 |
| CAR-04 | Smooth animation — no dropped frames | manual | DevTools Performance tab during playback | manual-only |
| State | ADVANCE on map starts travel (isCarTraveling) | unit (reducer) | `npx vitest run src/components/features/presentation/__tests__/reducer.test.ts` | ✅ (needs update) |
| State | ARRIVE sets isCarTraveling false, updates visitedStops | unit (reducer) | same file | ✅ (needs new cases) |
| State | ADVANCE during travel is no-op | unit (reducer) | same file | ✅ (needs new cases) |
| State | Second ADVANCE (parked) opens slide | unit (reducer) | same file | ✅ (needs new cases) |
| State | BACK from first slide returns to map | unit (reducer) | existing, unchanged | ✅ |

### Sampling Rate
- **Per task commit:** `npx vitest run src/components/features/presentation/__tests__/reducer.test.ts`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/components/features/map/__tests__/StopNode.test.tsx` — covers MAP-02, MAP-03 (3 visual states render correctly)
- [ ] `src/components/features/map/__tests__/CarElement.test.tsx` — covers CAR-01, CAR-02, CAR-03 (renders with correct style props)
- [ ] Existing `reducer.test.ts` — needs new test cases for `isCarTraveling`, `ARRIVE` action, two-step ADVANCE flow, ADVANCE-during-travel no-op. Does NOT need Wave 0 file creation (file exists), but the planner must include a "update reducer tests" task in the plan.

---

## Sources

### Primary (HIGH confidence)
- MDN Web Docs: `offset-path`, `offset-distance`, `offset-rotate` — spec-level CSS property documentation; browser support, syntax, coordinate system behavior
- MDN Web Docs: Motion path guide (`/en-US/docs/Web/CSS/Guides/Motion_path`) — how offset-* properties work together
- motion.dev tutorials/react-motion-path — official Motion library tutorial confirming `offsetDistance` as camelCase style + animate prop pattern; `initial={{ offsetDistance: "0%" }} animate={{ offsetDistance: "100%" }}` syntax
- Existing project codebase: `PresentationProvider.tsx`, `reducer.test.ts`, `MapCanvas.tsx`, `StopNode.tsx` — confirmed existing patterns, state shape, test conventions

### Secondary (MEDIUM confidence)
- CSS-Tricks `create-a-responsive-css-motion-path` — verified with MDN that offset-path coordinates don't scale with SVG; fixed-viewport recommendation
- CSS-Tricks almanac `offset-path` — confirmed `offset-rotate: auto` and `offset-rotate: reverse` behavior
- WebSearch aggregated result confirming `onAnimationComplete` fires when animation completes; provides `(latest) => void` callback signature
- WebSearch aggregated result confirming `type: "spring"` with `bounce` and `duration` is valid Motion transition config
- danielcwilson.com motion-path-quirks — confirmed `offset-path 0,0` coordinate origin behavior

### Tertiary (LOW confidence)
- WebSearch result suggesting `willChange: 'transform'` promotes offsetPath animations to compositor layer — not explicitly confirmed by Chrome official docs for offset-path specifically; standard practice for compositing hints

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — motion/react is installed; CSS motion path is baseline-available (since March 2022 per MDN); all APIs confirmed via official docs
- Architecture: HIGH for HTML-element car pattern; MEDIUM for coordinate alignment (viewport-assumption is reasonable but not proven for all display sizes)
- Pitfalls: HIGH for coordinate system and test breakage pitfalls (sourced from MDN + existing codebase); MEDIUM for onAnimationComplete+reducedMotion edge case (not directly verified)
- State machine design: HIGH — new fields and actions are well-defined; two-step flow matches CONTEXT.md locked decisions exactly

**Research date:** 2026-03-12
**Valid until:** 2026-04-12 (motion/react v12 API stable; CSS motion path spec stable)
