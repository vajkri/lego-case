# Architecture Research

**Domain:** Interactive single-presenter presentation app — Next.js App Router
**Researched:** 2026-03-11
**Confidence:** HIGH (routing patterns), MEDIUM (animation approach — App Router/Framer Motion integration has known friction)

## Standard Architecture

### System Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                     app/ (App Router)                            │
│  layout.tsx  ← root layout, mounts PresentationController       │
│              ← attaches global keyboard listener                 │
│              ← provides PresentationContext                      │
├──────────────────────────────────────────────────────────────────┤
│  page.tsx (route: /)                                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  MapView (client component)                               │   │
│  │  ┌─────────────┐   ┌────────────┐   ┌────────────────┐  │   │
│  │  │ MapCanvas   │   │ CityNode   │   │ CarAnimator    │  │   │
│  │  │ (SVG/CSS)   │   │ (×14)      │   │ (Framer Motion)│  │   │
│  │  └─────────────┘   └────────────┘   └────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
├──────────────────────────────────────────────────────────────────┤
│  SlideOverlay (renders ON TOP of map, full-screen)               │
│  ← mounted in root layout, driven by PresentationContext         │
│  ← NOT a separate route — stays within page.tsx subtree         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  SlideView (client component)                             │   │
│  │  ┌────────────────────┐   ┌──────────────────────────┐  │   │
│  │  │ SlideContent       │   │ SubSlideProgress         │  │   │
│  │  │ (per-topic render) │   │ (dots/counter for multi) │  │   │
│  │  └────────────────────┘   └──────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
├──────────────────────────────────────────────────────────────────┤
│                     Data Layer (static TS files)                 │
│  src/data/presentation.ts   ← typed content, all 14 topics      │
│  src/data/topics/           ← one file per topic (optional split)│
└──────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| `app/layout.tsx` | Root layout, mounts `PresentationProvider` + `SlideOverlay` | All children via context |
| `PresentationProvider` | Client component; holds `currentTopicIndex`, `currentSubSlideIndex`, `isSlideOpen` in `useReducer` | Consumed by all interactive components |
| `KeyboardController` | `useEffect`-based listener; dispatches navigation actions; mounts once in root layout | `PresentationContext` dispatch |
| `MapView` | Renders LEGO map, city nodes, animated car; reads topic list from data | `PresentationContext` for active/visited state |
| `CarAnimator` | Drives Framer Motion path animation of car between cities | `MapView` props; `PresentationContext` for target city |
| `CityNode` | Single city hotspot on map; highlights when active | `MapView` parent, `PresentationContext` |
| `SlideOverlay` | Full-screen overlay panel; AnimatePresence in/out; renders when `isSlideOpen` | `PresentationContext` |
| `SlideContent` | Renders the content for one topic/sub-slide; pure display | Props from `SlideOverlay` |
| `SubSlideProgress` | Dot or counter UI for topics with multiple sub-slides | Props from `SlideOverlay` |

## Recommended Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout — mounts PresentationProvider, KeyboardController, SlideOverlay
│   ├── page.tsx                # Route "/" — renders MapView
│   └── globals.css             # Global styles, CSS custom properties for design tokens
│
├── components/
│   ├── features/
│   │   ├── map/                # All map-related components
│   │   │   ├── MapView.tsx
│   │   │   ├── CarAnimator.tsx
│   │   │   ├── CityNode.tsx
│   │   │   └── index.ts
│   │   ├── slides/             # Slide overlay and content
│   │   │   ├── SlideOverlay.tsx
│   │   │   ├── SlideContent.tsx
│   │   │   ├── SubSlideProgress.tsx
│   │   │   └── index.ts
│   │   └── presentation/       # Presentation controller logic
│   │       ├── PresentationProvider.tsx    # Context + reducer
│   │       ├── KeyboardController.tsx      # Global keyboard listener
│   │       └── index.ts
│   └── ui/                     # Generic primitives (Button, Badge, etc.)
│
├── data/
│   ├── presentation.ts         # Master typed data export
│   └── topics/                 # One file per topic (optional; import into presentation.ts)
│       ├── 01-task.ts
│       ├── 02-goals.ts
│       └── ... (14 total)
│
├── hooks/
│   └── useKeyboard.ts          # useEffect keyboard event hook
│
├── types/
│   └── presentation.ts         # Topic, SubSlide, PresentationState interfaces
│
└── lib/
    └── presentation-reducer.ts # Pure reducer: NEXT_TOPIC, PREV_TOPIC, OPEN_SLIDE, etc.
```

### Structure Rationale

- **`features/map/` vs `features/slides/`:** These are the two visual modes — map and slide — and their components have no direct coupling. Separating them makes the build order explicit.
- **`features/presentation/`:** Contains only orchestration logic (state, keyboard). Depends on `map/` and `slides/` but neither depends on it.
- **`data/topics/`:** One file per topic keeps each content block independently editable. The master `presentation.ts` imports and assembles them in order.
- **`lib/presentation-reducer.ts`:** Pure function; testable without React. Encodes all state transition rules including "sub-slide exhausted → return to map" logic.

## Architectural Patterns

### Pattern 1: Client-State Overlay (Chosen over parallel routes)

**What:** Slides are NOT separate URL routes. A single `SlideOverlay` component in the root layout renders conditionally based on `PresentationContext.isSlideOpen`. The URL stays `/` throughout the entire presentation.

**Why this, not parallel routes / intercepting routes:**
- Parallel + intercepting routes support URL-per-slide and deep linking, but add significant file system complexity (`@modal` slots, `default.tsx` catch-alls, `(.)/` intercept folders).
- This app has no need for deep linking — there is one presenter navigating linearly.
- Client state avoids the `default.js` hard-reload mismatch problem that parallel route slots have on full refresh.
- Framer Motion `AnimatePresence` works cleanly for a conditional overlay that mounts/unmounts in place — no route-level unmount/remount interference.

**Confidence:** HIGH — verified against official Next.js parallel route docs; the added complexity solves problems (shareable URLs, history) this app doesn't have.

**Example:**
```typescript
// app/layout.tsx
import { PresentationProvider } from '@/components/features/presentation'
import { SlideOverlay } from '@/components/features/slides'
import { KeyboardController } from '@/components/features/presentation'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PresentationProvider>
          <KeyboardController />
          {children}         {/* MapView renders here via page.tsx */}
          <SlideOverlay />   {/* Overlay layered on top via position:fixed */}
        </PresentationProvider>
      </body>
    </html>
  )
}
```

### Pattern 2: useReducer for Presentation State

**What:** A single `useReducer` in `PresentationProvider` holds all navigation state. Actions are dispatched by `KeyboardController` and (optionally) map click handlers.

**When to use:** Any time multiple components need to read or write the same navigation state. Context + reducer is the correct App Router pattern for client-side global state that doesn't need persistence.

**Why not Zustand here:** The state is small, co-located in one provider, and doesn't need to persist across sessions. Zustand would add a dependency for no benefit at this scale.

**State shape:**
```typescript
interface PresentationState {
  topicIndex: number          // 0–13, current city
  subSlideIndex: number       // 0–N within current topic
  mode: 'map' | 'slide'       // what's visible
  carPosition: 'idle' | 'traveling' | 'arrived'
}

type PresentationAction =
  | { type: 'NEXT' }           // advance: next sub-slide, or next topic, or return to map
  | { type: 'PREV' }           // reverse
  | { type: 'OPEN_SLIDE' }     // car arrived → open slide
  | { type: 'CLOSE_SLIDE' }    // ESC / last sub-slide advances → close
  | { type: 'GO_TO_TOPIC'; index: number }  // click on city node
```

### Pattern 3: Global Keyboard Listener via Client Component

**What:** `KeyboardController` is a `'use client'` component that renders `null` and contains only a `useEffect` that attaches/detaches `keydown` on `window`.

**Why a component, not a hook called from a page:** In App Router, `page.tsx` is a server component by default. A `useEffect` cannot live there. The pattern is to push all browser-API side effects into a dedicated client component mounted in a layout.

**Why `useEffect` cleanup matters:** The layout persists across the entire session — `KeyboardController` mounts once and never unmounts during normal navigation. The cleanup function is still required for React Strict Mode double-invocation in development.

**Example:**
```typescript
// components/features/presentation/KeyboardController.tsx
'use client'

import { useEffect } from 'react'
import { usePresentationDispatch } from './PresentationProvider'

export function KeyboardController() {
  const dispatch = usePresentationDispatch()

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          e.preventDefault()
          dispatch({ type: 'NEXT' })
          break
        case 'ArrowLeft':
          e.preventDefault()
          dispatch({ type: 'PREV' })
          break
        case 'Escape':
          dispatch({ type: 'CLOSE_SLIDE' })
          break
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [dispatch])

  return null
}
```

### Pattern 4: Framer Motion Overlay Animation (with known caveats)

**What:** `SlideOverlay` uses `AnimatePresence` with a direct `motion.div` child (unique `key` on the open topic) to animate in/out.

**Known limitation:** `AnimatePresence` for route-level page transitions in App Router is fragile (Next.js wraps pages in internal providers that interfere). However, this app avoids that problem entirely because the overlay is NOT a route change — it is a conditional render within a persistent layout. This is the clean case for `AnimatePresence`.

**Confidence:** MEDIUM — the overlay-in-layout pattern avoids the known App Router/AnimatePresence route conflict, but should be validated early in Phase 1.

**Example:**
```typescript
// components/features/slides/SlideOverlay.tsx
'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { usePresentationState } from '../presentation/PresentationProvider'
import { SlideContent } from './SlideContent'

export function SlideOverlay() {
  const { mode, topicIndex, subSlideIndex } = usePresentationState()

  return (
    <AnimatePresence>
      {mode === 'slide' && (
        <motion.div
          key={topicIndex}  // key change triggers exit/enter animation
          className="slide-overlay"
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.3, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <SlideContent topicIndex={topicIndex} subSlideIndex={subSlideIndex} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

## Data Flow

### Navigation Flow

```
KeyboardController (keydown event)
    ↓
dispatch({ type: 'NEXT' })
    ↓
presentation-reducer.ts (pure function)
    ↓ (returns new state)
PresentationContext (React Context)
    ↓ (re-renders subscribers)
MapView ← reads topicIndex, carPosition
CarAnimator ← animates car to new city coordinates
SlideOverlay ← reads mode, renders when mode === 'slide'
SlideContent ← reads topicIndex + subSlideIndex, renders content
```

### Content Data Flow

```
src/data/topics/01-task.ts  ← authored content (TypeScript literal)
    ↓
src/data/presentation.ts    ← assembles topics array, exported as const
    ↓ (imported at build time, zero runtime fetch)
SlideContent.tsx            ← receives topicIndex as prop, accesses topics[topicIndex]
    ↓
JSX render of slide text, bullets, code blocks, etc.
```

### Key Data Flows

1. **Map → Slide transition:** `NEXT` action while `mode === 'map'` and `carPosition === 'arrived'` sets `mode: 'slide'`. `SlideOverlay` renders. Car stays at city on the map (visible behind overlay or hidden).
2. **Sub-slide advance:** `NEXT` while `mode === 'slide'` and `subSlideIndex < topic.subSlides.length - 1` increments `subSlideIndex`. Same topic, same overlay — `SlideContent` re-renders with next sub-slide.
3. **Slide exit:** `NEXT` while at last sub-slide dispatches `CLOSE_SLIDE`. Overlay exits via `AnimatePresence`. `mode` returns to `'map'`.  Map is visible again with car at current city.
4. **Next city travel:** After slide closes, `NEXT` dispatches `GO_TO_NEXT_TOPIC` and sets `carPosition: 'traveling'`. `CarAnimator` animates. On complete, calls `ARRIVED` action.

## Typed Content Data Structure

The 14 topics have variable sub-slide counts (1–4 based on proposal content). Type the data to match:

```typescript
// types/presentation.ts
export interface SubSlide {
  heading?: string
  body: string          // markdown-like prose or structured content
  bullets?: string[]
  codeBlock?: { lang: string; code: string }
  visualHint?: string   // for future Figma design tokens integration
}

export interface Topic {
  id: string                  // e.g. 'goals', 'frontend-architecture'
  cityName: string            // label on the map
  mapPosition: { x: number; y: number }  // % coordinates on map canvas
  subSlides: SubSlide[]       // always at least 1
}

export type PresentationData = Topic[]
```

Keeping `mapPosition` in the same data file as slide content means moving a city on the map is one change in one file. All 14 topics have positions, content, and sub-slides co-located.

## Suggested Build Order

This order respects hard dependencies — each phase has everything it needs from the previous.

1. **Data + types first** — `types/presentation.ts` and `src/data/presentation.ts` with all 14 topics. No UI yet, but ensures content is accessible and typed before any component is written. Validates the content structure decision (flat array vs. grouped).

2. **PresentationProvider + reducer** — Pure state logic, unit-testable. No rendering needed. Defines the state machine that drives everything else.

3. **Root layout wiring** — `app/layout.tsx` with `PresentationProvider`, `KeyboardController`, `SlideOverlay` scaffold (renders nothing yet). Establishes the component mount hierarchy.

4. **MapView skeleton** — Static map canvas with 14 city nodes at correct positions. No car animation yet. Confirm layout and design tokens work at this stage.

5. **CarAnimator** — Framer Motion path animation between cities. Depends on `mapPosition` from data and `topicIndex` from context.

6. **SlideOverlay + SlideContent** — Full-screen overlay that reads from context and renders topic content. Validate `AnimatePresence` zoom transition here.

7. **SubSlideProgress + multi-slide logic** — Dots/counter UI, reducer logic for sub-slide indexing. Depends on SlideContent being stable.

8. **Keyboard navigation wiring** — `KeyboardController` dispatching real actions; full end-to-end flow.

9. **Accessibility pass** — ARIA labels, focus management (trap focus in overlay), `prefers-reduced-motion` guards on all Framer Motion variants.

10. **Polish** — LEGO visual design tokens from Figma, responsive layout, final animation tuning.

## Anti-Patterns

### Anti-Pattern 1: Separate Routes per Slide (`/slides/[topic]`)

**What people do:** Create a dynamic route `app/slides/[topic]/page.tsx` for each slide, navigating with `router.push`.

**Why it's wrong for this app:**
- Route transitions in App Router unmount/remount pages; this breaks `AnimatePresence` zoom animations without the fragile `FrozenRouter` internal-API hack.
- Every keyboard press triggers a full Next.js navigation cycle — unnecessary overhead for what is pure in-memory state.
- The map background would need to persist across routes, requiring either a parallel route slot (complex file system) or being reconstructed each time (flash/flicker).

**Do this instead:** Keep everything in `/` with client state. Routes solve URL shareability — this presenter app has no need for that.

### Anti-Pattern 2: Server Components for Interactive Map/Slide Components

**What people do:** Attempt to keep `MapView` or `SlideContent` as RSC to avoid `'use client'` boundaries.

**Why it's wrong:** The entire presentation is driven by real-time client state (`topicIndex`, `mode`). Components reading from `PresentationContext` must be client components. Attempting to push RSC too deep creates awkward prop-drilling through the server/client boundary.

**Do this instead:** Mark `PresentationProvider` and all its consumers as `'use client'`. The data files (`src/data/presentation.ts`) remain static imports — they never need to be server-fetched.

### Anti-Pattern 3: useState per Component for Navigation State

**What people do:** Put `topicIndex` in `MapView`'s local state and lift it as needed.

**Why it's wrong:** `KeyboardController` (mounted in layout), `MapView` (mounted in page), and `SlideOverlay` (mounted in layout) all need the same state. Lifting state to the layout via callbacks across the RSC/client boundary is complex and fragile.

**Do this instead:** `PresentationContext` as a single source of truth. All three components are already client components; context is the natural pattern.

### Anti-Pattern 4: Framer Motion AnimatePresence Around Route Children in layout.tsx

**What people do:** Wrap `{children}` in `AnimatePresence` in `layout.tsx` to get page transitions.

**Why it's wrong:** Next.js wraps page components in internal providers — `AnimatePresence` cannot detect entry/exit of the actual page component. This requires the `FrozenRouter` hack that accesses `next/dist/shared/lib/app-router-context.shared-runtime` (an internal, non-public API that can break on any Next.js update).

**Do this instead:** Use `AnimatePresence` only for the `SlideOverlay` conditional render, not for route-level transitions. This app only has one route anyway.

## Integration Points

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `PresentationProvider` → consumers | React Context (`usePresentationState`, `usePresentationDispatch`) | Split into two contexts to avoid re-renders when only reading state |
| `KeyboardController` → state | `usePresentationDispatch` hook | Fires actions; never reads state directly |
| `CarAnimator` → `SlideOverlay` | Via context: `CarAnimator` dispatches `ARRIVED` → reducer sets `mode: 'slide'` | Decoupled: animation completion triggers overlay |
| `data/presentation.ts` → components | Direct import (static TypeScript) | No prop drilling through layout; components import data directly |

## Sources

- [Next.js Parallel Routes — Official Docs](https://nextjs.org/docs/app/api-reference/file-conventions/parallel-routes) — verified 2026-02-27 (HIGH confidence)
- [Next.js Intercepting Routes — Official Docs](https://nextjs.org/docs/app/api-reference/file-conventions/intercepting-routes) (HIGH confidence)
- [Next.js Server and Client Components — Official Docs](https://nextjs.org/docs/app/getting-started/server-and-client-components) (HIGH confidence)
- [Framer Motion + App Router AnimatePresence issue #49279](https://github.com/vercel/next.js/issues/49279) — confirms route-level AnimatePresence is broken (MEDIUM confidence — issue thread, not official docs)
- [Solving Framer Motion Page Transitions in Next.js App Router](https://www.imcorfitz.com/posts/adding-framer-motion-page-transitions-to-next-js-app-router) — FrozenRouter workaround, documented functional through Next.js 16.0.7 (MEDIUM confidence — community article, uses internal APIs)
- [How to animate route transitions in app directory — Next.js Discussion #42658](https://github.com/vercel/next.js/discussions/42658) (MEDIUM confidence)

---
*Architecture research for: LEGO Interactive Presentation App — Next.js App Router*
*Researched: 2026-03-11*
