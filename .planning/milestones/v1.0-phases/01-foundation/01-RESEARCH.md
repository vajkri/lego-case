# Phase 1: Foundation - Research

**Researched:** 2026-03-11
**Domain:** Next.js 16 static export, Motion 12, Tailwind v4, useReducer context, TypeScript data modeling
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- Restructured from 14 individual topic stops to 5 grouped stops (Stop 1: The Case, Stop 2: Vision, Stop 3: How We Work, Stop 4: Migration, Stop 5: Summary)
- Top-level type is `Stop` (not `Topic`) — slug identifier only (no separate numeric id field)
- Map coordinates: `{ x: number; y: number }` as percentages of SVG viewport (e.g. `{ x: 45.2, y: 32.1 }`)
- Sub-slide type: `{ heading: string; content: React.ReactNode }` — minimum concrete shape `lines: string[]`, flexible for future
- File organization: `src/data/topics/` folder with `index.ts` barrel
- Full prose for all 5 stops authored in Phase 1, sourced from `.planning/assets/proposal-content.md`
- Phase 1 renders visible map placeholder: 5 labeled city node buttons positioned on a blank canvas using percentage coordinates (no SVG map yet)
- Keyboard presses visibly update a dev indicator showing current stop index — proves reducer wiring
- Full state interface defined: `{ currentStop: number; currentSlide: number; mode: 'map' | 'slide' }`
- Reducer actions stubbed in Phase 1 (console.log) — Phase 2 fills real logic
- `KeyboardController` mounts in root layout, listens for ArrowRight/Space (advance), ArrowLeft (back), Escape (close), dispatches to reducer
- All animation components use `'use client'` boundaries
- `MotionConfig reducedMotion="user"` wraps the presentation root
- CLAUDE.md component conventions: `ui/`, `layout/`, `features/` folders; barrel exports; PascalCase naming

### Claude's Discretion

- Exact dev indicator design for showing keyboard state in Phase 1
- Tailwind v4 configuration details (CSS variables vs config file approach)
- Zustand store structure (whether to use a single store or alongside useReducer)
- Component file names and exact directory layout within CLAUDE.md conventions

### Deferred Ideas (OUT OF SCOPE)

- Speaker notes mode (ENH-01)
- Touch/swipe gesture support (ENH-02)
- URL-per-slide deep linking (ENH-04)
- Visual grouping / clustering of stops on map by theme
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| FOUND-01 | Next.js 16 App Router with `output: 'export'` (fully static, no server required) | Static export config verified against official Next.js 16 docs |
| FOUND-02 | Motion 12 (`motion/react`), Tailwind v4, and Zustand installed and configured | Installation patterns verified for all three libraries |
| FOUND-03 | All animation components isolated behind `'use client'` — no hydration errors on `next build` | Client boundary rules and hydration pitfalls researched from official docs |
| FOUND-04 | `MotionConfig reducedMotion="user"` wraps the entire presentation root | MotionConfig API verified from motion.dev docs and search |
| FOUND-05 | TypeScript type definitions for all 5 stops (redesigned from 14): title, map position, array of sub-slides | TypeScript data modeling patterns researched; stop structure locked in CONTEXT.md |
| FOUND-06 | All 5 stop data files authored and content-complete from `proposal-content.md` | Content structure mapped from source document; 5 stops with natural sub-slide breakdowns |
| FOUND-07 | No unused code, consistent naming, clean component boundaries, any dev can understand in < 5 minutes | CLAUDE.md conventions + project structure patterns researched |
| QUAL-01 | Component structure matches CLAUDE.md conventions | CLAUDE.md read and incorporated throughout |
| QUAL-02 | All content rendered from data files — zero hardcoded presentation content in JSX | Data-driven architecture patterns documented |
| QUAL-03 | Simple and elegant: obvious solutions, minimal abstractions, readable over terse | Reflected in architecture patterns and anti-patterns below |
</phase_requirements>

---

## Summary

Phase 1 is a pure setup + architecture phase: no server is ever needed (fully static export), and the goal is a running skeleton that proves all the wiring is correct before real UI is built in Phase 2. The tech stack is: Next.js 16 App Router with `output: 'export'`, Motion 12 (`motion/react`), Tailwind v4 with CSS-first configuration, and Zustand alongside a `useReducer`-based `PresentationProvider`. All three libraries have stable APIs in their current versions and integrate with Next.js without issues.

The most important architectural decision already locked is that navigation state is driven by React context + reducer, never by URL routing. This avoids the well-documented AnimatePresence/App Router exit-animation failure that affects modal-style overlays. The `PresentationProvider` must be a `'use client'` component wrapping everything in root layout — it cannot be a Server Component because it holds interactive state. Similarly, `KeyboardController` (with `useEffect` + `addEventListener`) is a leaf-level client component.

The data model shift from 14 flat topics to 5 grouped stops has already been decided. The `Stop` type needs `slug`, `label`, `coordinates`, and `slides` — where slides is `Array<{ heading: string; lines: string[] }>`. The content for all 5 stops exists in `proposal-content.md` and maps naturally to the 5-stop structure already decided.

**Primary recommendation:** Create the Next.js project with `create-next-app`, install the three libraries, wire `PresentationProvider` + `KeyboardController` as `'use client'` components in root layout, author the typed data files from `proposal-content.md`, and render the 5 stop nodes as positioned buttons on a blank canvas. Every component should be at the leaf of the client boundary tree.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next | 16.x (create-next-app gives 16.1.6) | App framework, static export | App Router + static export fully supported since v13.4; v16 is current stable |
| motion/react | 12.x (currently 12.35.0) | Animations, MotionConfig, AnimatePresence | Renamed from framer-motion; same API. Only animation library with native React 19 support and built-in `prefers-reduced-motion` |
| tailwindcss | 4.x | Utility CSS | v4 ships as CSS-first, no config.js required; significantly faster builds; officially documented with Next.js |
| zustand | 5.x | Lightweight global store | 1.2KB; no boilerplate; works transparently in `'use client'` components; team already listed it in requirements |
| typescript | 5.x (bundled with create-next-app) | Type safety for data model | Required for FOUND-05; `create-next-app --typescript` sets this up |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @tailwindcss/postcss | 4.x | PostCSS plugin for Tailwind v4 | Required — Tailwind v4 no longer uses the standalone CLI approach; PostCSS plugin is mandatory |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `motion/react` (Motion 12) | `framer-motion` | Same library — framer-motion is the old package name. Do NOT install both. |
| Tailwind v4 CSS-first config | `tailwind.config.js` with v3 | v3 config.js still works in v4 but CSS-first is simpler and the documented default for new projects |
| useReducer + Context | Zustand only | Both are fine; CONTEXT.md leaves this to discretion. Recommendation: use `useReducer` in `PresentationProvider` for the presentation state (pure, testable), Zustand reserved for any global UI state that spans future phases |

**Installation:**
```bash
npx create-next-app@latest lego-case --typescript --eslint --app --no-tailwind
cd lego-case
npm install motion zustand
npm install tailwindcss @tailwindcss/postcss postcss
```

Note: pass `--no-tailwind` to avoid `create-next-app` installing Tailwind v3 automatically. Install Tailwind v4 manually.

---

## Architecture Patterns

### Recommended Project Structure

```
src/
├── app/
│   ├── layout.tsx           # Root layout — mounts PresentationProvider + KeyboardController
│   ├── page.tsx             # Root page — renders MapCanvas (the placeholder map)
│   └── globals.css          # Tailwind v4 @import + @theme tokens
├── components/
│   ├── ui/                  # Generic reusable UI primitives
│   │   └── index.ts
│   ├── layout/              # Layout primitives
│   │   └── index.ts
│   └── features/
│       ├── presentation/    # PresentationProvider, KeyboardController
│       │   ├── PresentationProvider.tsx
│       │   ├── KeyboardController.tsx
│       │   └── index.ts
│       └── map/             # MapCanvas and stop node components
│           ├── MapCanvas.tsx
│           ├── StopNode.tsx
│           └── index.ts
├── data/
│   └── topics/              # Typed stop data (as decided in CONTEXT.md)
│       ├── stop-01-the-case.ts
│       ├── stop-02-vision.ts
│       ├── stop-03-how-we-work.ts
│       ├── stop-04-migration.ts
│       ├── stop-05-summary.ts
│       └── index.ts         # Barrel: export const stops: Stop[] = [...]
└── types/
    └── presentation.ts      # Stop, Slide, PresentationState, Action types
```

### Pattern 1: Static Export Configuration

**What:** Next.js generates a fully static `out/` folder at build time. No server needed.
**When to use:** Always for this project — `output: 'export'` must be set from the start.

```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
}

export default nextConfig
```

**What to watch:** The default `next/image` component requires a server for optimization. Since we use no external images (SVG map, no `<Image>` components needed in Phase 1), this is not a concern yet. If images are needed later, add `images: { unoptimized: true }` or a custom loader.

### Pattern 2: PresentationProvider — `'use client'` Context with useReducer

**What:** A client component wrapping the entire app, providing presentation state via React context.
**When to use:** Any component that holds React state, useEffect, or context MUST be `'use client'`.

```typescript
// Source: https://nextjs.org/docs/app/getting-started/server-and-client-components
// src/components/features/presentation/PresentationProvider.tsx
'use client'

import { createContext, useContext, useReducer, ReactNode } from 'react'
import type { PresentationState, Action } from '@/types/presentation'

const initialState: PresentationState = {
  currentStop: 0,
  currentSlide: 0,
  mode: 'map',
}

function presentationReducer(state: PresentationState, action: Action): PresentationState {
  switch (action.type) {
    case 'ADVANCE':
      console.log('[stub] ADVANCE', state)
      return state
    case 'BACK':
      console.log('[stub] BACK', state)
      return state
    case 'CLOSE':
      console.log('[stub] CLOSE', state)
      return state
    default:
      return state
  }
}

const PresentationContext = createContext<{
  state: PresentationState
  dispatch: React.Dispatch<Action>
} | null>(null)

export function PresentationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(presentationReducer, initialState)
  return (
    <PresentationContext.Provider value={{ state, dispatch }}>
      {children}
    </PresentationContext.Provider>
  )
}

export function usePresentation() {
  const ctx = useContext(PresentationContext)
  if (!ctx) throw new Error('usePresentation must be used within PresentationProvider')
  return ctx
}
```

### Pattern 3: KeyboardController — Leaf Client Component

**What:** A component whose only job is to listen to keyboard events and dispatch to the reducer. Has no visual output.
**When to use:** Global keyboard listeners always belong in a `'use client'` component with `useEffect`.

```typescript
// src/components/features/presentation/KeyboardController.tsx
'use client'

import { useEffect } from 'react'
import { usePresentation } from './PresentationProvider'

export function KeyboardController() {
  const { dispatch } = usePresentation()

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === ' ') dispatch({ type: 'ADVANCE' })
      if (e.key === 'ArrowLeft') dispatch({ type: 'BACK' })
      if (e.key === 'Escape') dispatch({ type: 'CLOSE' })
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [dispatch])

  return null
}
```

### Pattern 4: Root Layout — Server Component with Client Providers

**What:** Root layout is a Server Component (default in App Router) but imports Client Components.
**When to use:** Always — importing a client component into a server component is fine and correct.

```typescript
// Source: https://nextjs.org/docs/app/getting-started/server-and-client-components (Context providers section)
// app/layout.tsx  — NO 'use client' here
import { PresentationProvider } from '@/components/features/presentation/PresentationProvider'
import { KeyboardController } from '@/components/features/presentation/KeyboardController'
import { MotionConfig } from 'motion/react'
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PresentationProvider>
          <MotionConfig reducedMotion="user">
            <KeyboardController />
            {children}
          </MotionConfig>
        </PresentationProvider>
      </body>
    </html>
  )
}
```

**Critical note:** `MotionConfig` from `motion/react` is itself a client component. It can be rendered inside a Server Component because the Server Component passes it `children` as a prop — this is the standard pattern documented in Next.js for wrapping third-party providers.

### Pattern 5: Tailwind v4 CSS-first Configuration

**What:** Tailwind v4 drops `tailwind.config.js` by default. Configuration lives in CSS via `@theme`.
**When to use:** From the start — this is the only officially documented setup for v4 + Next.js.

```css
/* app/globals.css */
@import "tailwindcss";

/* Optional: define design tokens. LEGO tokens are deferred to Phase 4.
   Use placeholder values now, override in Phase 4. */
@theme {
  --color-brand: oklch(0.7 0.2 85);   /* placeholder warm yellow */
  --font-display: 'Inter', sans-serif;
}
```

PostCSS config (required):
```javascript
// postcss.config.mjs
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
}
export default config
```

### Pattern 6: TypeScript Data Model

**What:** Typed definitions for the 5-stop presentation data.
**When to use:** Define in Phase 1, referenced by all future phases.

```typescript
// src/types/presentation.ts

export interface Slide {
  heading: string
  lines: string[]        // minimum concrete shape; React.ReactNode promoted here in Phase 2+ if needed
}

export interface Stop {
  slug: string           // e.g. 'the-case', 'vision'
  label: string          // Display name, e.g. 'The Case'
  coordinates: {
    x: number            // % of SVG viewport width
    y: number            // % of SVG viewport height
  }
  slides: Slide[]
}

export interface PresentationState {
  currentStop: number
  currentSlide: number
  mode: 'map' | 'slide'
}

export type Action =
  | { type: 'ADVANCE' }
  | { type: 'BACK' }
  | { type: 'CLOSE' }
```

### Anti-Patterns to Avoid

- **Adding `'use client'` to root layout:** Root `app/layout.tsx` should NOT have `'use client'`. Import client components into it; they form their own client subtree. If `layout.tsx` becomes a client component, the entire layout loses server rendering.
- **Using Zustand for presentation navigation state:** The requirements explicitly call for `useReducer` for nav state (NAV-01). Zustand is in the stack but should not duplicate reducer responsibilities.
- **Using `next/image` without configuring a loader:** Static export does not support the default `next/image` optimizer. Either use plain `<img>` tags or add `images: { unoptimized: true }` in `next.config.ts` before using `next/image`.
- **Putting `motion` components in Server Components:** Any component that imports from `motion/react` will fail in a Server Component. Wrap or add `'use client'` to the file.
- **Inline content in JSX:** QUAL-02 requires all content to come from data files. No hardcoded strings in component bodies.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Global `prefers-reduced-motion` | Custom media query listeners | `MotionConfig reducedMotion="user"` | Handles SSR/hydration timing correctly; applies to all motion children globally |
| Keyboard event dispatching | Direct `window.addEventListener` in multiple components | Single `KeyboardController` client component with `useEffect` | Centralised event source; no duplicate listeners; easier to test |
| CSS utility classes | Custom CSS modules for spacing/color | Tailwind v4 utilities | Already in stack; consistent with project conventions |
| State dispatch boilerplate | Per-component `useState` for current stop/slide | `usePresentation()` hook from `PresentationProvider` | Single source of truth; matches Phase 2 nav requirements already designed |

**Key insight:** This phase is primarily wiring. The custom code is thin — TypeScript types, data files, and thin component shells. Everything else is configuration of already-chosen libraries.

---

## Common Pitfalls

### Pitfall 1: MotionConfig is a Client Component — Placement in Layout

**What goes wrong:** Importing `MotionConfig` from `motion/react` in a Server Component causes a build error ("You're importing a component that needs `useState`...").
**Why it happens:** `MotionConfig` uses React state internally to propagate config to children.
**How to avoid:** In `app/layout.tsx` (a Server Component), render `MotionConfig` as a child prop of a client provider. The pattern shown above (`PresentationProvider` wraps `MotionConfig`) is correct because `PresentationProvider` is already `'use client'`. Alternatively, wrap `MotionConfig` in its own `'use client'` wrapper component.
**Warning signs:** Build error mentioning `useState` or `useContext` in a Server Component.

### Pitfall 2: Hydration Errors from Browser-Only APIs in Client Components

**What goes wrong:** `window`, `localStorage`, or `navigator` accessed outside `useEffect` causes hydration mismatch — the server renders one output, the client renders another.
**Why it happens:** Client Components are pre-rendered to HTML during `next build`. The pre-render runs without browser APIs, then hydrates in the browser.
**How to avoid:** Any browser API access must live inside `useEffect`. The `KeyboardController` pattern (adding event listeners in `useEffect`) is the correct approach.
**Warning signs:** "Hydration failed because the initial UI does not match what was rendered on the server" in console.

### Pitfall 3: `next/image` Fails in Static Export Without Loader Configuration

**What goes wrong:** `next build` fails with an error about image optimization not being compatible with static export.
**Why it happens:** The default `next/image` loader requires a running Next.js server to resize images on demand. Static export has no server.
**How to avoid:** In Phase 1, avoid `next/image` entirely (no external images needed). If plain `<img>` tags are needed, use them. Document in `next.config.ts` that an image loader will be required if `next/image` is adopted.
**Warning signs:** Build error mentioning `loader` or `unoptimized`.

### Pitfall 4: Tailwind v4 Without PostCSS Plugin

**What goes wrong:** `@import "tailwindcss"` in globals.css does nothing; classes don't apply.
**Why it happens:** Tailwind v4 no longer uses a standalone PostCSS config automatically. The `@tailwindcss/postcss` plugin must be explicitly added to `postcss.config.mjs`.
**How to avoid:** Always create `postcss.config.mjs` with the plugin after installing Tailwind v4.
**Warning signs:** Tailwind utility classes in JSX produce no visual effect; no CSS in browser inspector for Tailwind utilities.

### Pitfall 5: Installing Both `framer-motion` and `motion`

**What goes wrong:** Version conflicts, duplicate bundle size, import confusion.
**Why it happens:** `framer-motion` is the old package name. Motion 12 ships as `motion` with the React export at `motion/react`.
**How to avoid:** Install only `motion`. Import as `import { ... } from 'motion/react'`.
**Warning signs:** Both appear in `node_modules`; bundle size unexpectedly large.

### Pitfall 6: FOUND-05 References "14 topics" but Locked Decision is 5 Stops

**What goes wrong:** Implementing 14 data files instead of 5 — misreading REQUIREMENTS.md which hasn't been updated yet.
**Why it happens:** REQUIREMENTS.md still says "14 topics" but CONTEXT.md locked the redesign to 5 grouped stops.
**How to avoid:** CONTEXT.md decisions override stale requirement text. Build 5 `Stop` data files. The requirements doc should be updated as part of Phase 1 (noted in CONTEXT.md).
**Warning signs:** Data folder has more than 5 stop files.

---

## Code Examples

Verified patterns from official sources:

### Stop Data File (example)
```typescript
// src/data/topics/stop-01-the-case.ts
import type { Stop } from '@/types/presentation'

export const stopTheCase: Stop = {
  slug: 'the-case',
  label: 'The Case',
  coordinates: { x: 20, y: 40 },   // Placeholder — real values assigned during Phase 3 map design
  slides: [
    {
      heading: 'Why We Are Here',
      lines: [
        'kids.lego.com currently runs on AngularJS — end of life',
        'No modern tooling, no SSR, no type safety',
        'Migration is a business continuity issue, not just a tech upgrade',
      ],
    },
    {
      heading: 'Goals',
      lines: [
        'Fast, engaging experiences for children aged 6–12',
        'Multiple teams working in parallel without stepping on each other',
        'Privacy-first analytics compliant with COPPA and GDPR',
        'Support for emerging markets: low bandwidth, localization',
      ],
    },
  ],
}
```

### Barrel Export for Data
```typescript
// src/data/topics/index.ts
import { stopTheCase } from './stop-01-the-case'
import { stopVision } from './stop-02-vision'
import { stopHowWeWork } from './stop-03-how-we-work'
import { stopMigration } from './stop-04-migration'
import { stopSummary } from './stop-05-summary'
import type { Stop } from '@/types/presentation'

export const stops: Stop[] = [
  stopTheCase,
  stopVision,
  stopHowWeWork,
  stopMigration,
  stopSummary,
]
```

### MapCanvas Placeholder (Phase 1 proof-of-wiring)
```typescript
// src/components/features/map/MapCanvas.tsx
'use client'

import { stops } from '@/data/topics'
import { usePresentation } from '@/components/features/presentation/PresentationProvider'
import { StopNode } from './StopNode'

export function MapCanvas() {
  const { state } = usePresentation()

  return (
    <div className="relative w-full h-screen bg-slate-100">
      {/* Dev indicator — shows reducer is wired */}
      <div className="absolute top-4 left-4 font-mono text-sm bg-black text-white px-2 py-1 rounded">
        stop: {state.currentStop} | slide: {state.currentSlide} | mode: {state.mode}
      </div>
      {stops.map((stop, index) => (
        <StopNode key={stop.slug} stop={stop} isActive={state.currentStop === index} />
      ))}
    </div>
  )
}
```

### StopNode Positioned by Percentage Coordinates
```typescript
// src/components/features/map/StopNode.tsx
'use client'

import type { Stop } from '@/types/presentation'

interface StopNodeProps {
  stop: Stop
  isActive: boolean
}

export function StopNode({ stop, isActive }: StopNodeProps) {
  return (
    <button
      style={{
        position: 'absolute',
        left: `${stop.coordinates.x}%`,
        top: `${stop.coordinates.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      className={`px-3 py-2 rounded-lg font-semibold text-sm border-2 ${
        isActive ? 'bg-yellow-400 border-yellow-600' : 'bg-white border-slate-300'
      }`}
    >
      {stop.label}
    </button>
  )
}
```

---

## Content Map: proposal-content.md → 5 Stops

The source document at `.planning/assets/proposal-content.md` maps directly to the 5-stop structure:

| Stop | Label | Source Sections | Sub-slides |
|------|-------|-----------------|-----------|
| 1 | The Case | §1 Goals, §13 (AngularJS context) | 2 slides: "Why We Are Here", "Goals" |
| 2 | Vision | §2 Frontend Architecture, §4 Component Architecture, §5 Design System Strategy | 3 slides: "Frontend Architecture", "Component Architecture", "Design System Strategy" |
| 3 | How We Work | §3 Team Structure, §6 Storybook, §7 CI/CD, §8 Testing, §10-12 Analytics | 5 slides: "Team Structure", "Storybook as Registry", "CI/CD Strategy", "Testing Strategy", "Privacy-First Analytics" |
| 4 | Migration | §13 Migration Strategy, §14 Migration Steps, §15 Risk Mitigation | 3 slides: "Incremental Route Migration", "Migration Steps", "Risk Mitigation" |
| 5 | Summary | §16 Summary | 1 slide: "Summary" |

Total: 14 sub-slides across 5 stops — the data files are straightforward to author from the source.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `framer-motion` package name | `motion` package with `motion/react` entry | Motion 11+ | Must import from `motion/react`, not `framer-motion`. Both still on npm but `framer-motion` is legacy. |
| `tailwind.config.js` | `@theme {}` in CSS file | Tailwind v4 (Jan 2025) | No JavaScript config needed for new projects; faster builds (5x full, 100x incremental) |
| `next export` CLI command | `output: 'export'` in `next.config.ts` | Next.js v14 | `next export` was removed in v14. Use config option only. |
| `output: 'standalone'` | `output: 'export'` | N/A — different modes | `standalone` is for Docker/server deploy; `export` is for static file hosting. This project uses `export`. |

**Deprecated/outdated:**
- `next export` CLI: removed in Next.js v14. Use `output: 'export'` in config.
- `framer-motion` package: still works but is legacy. New installs should use `motion`.
- `tailwind.config.js`: still supported in v4 via a compatibility flag, but new projects should use CSS-first approach.

---

## Open Questions

1. **Zustand store structure alongside useReducer**
   - What we know: CONTEXT.md leaves this to Claude's discretion
   - What's unclear: Whether a Zustand store is needed at all in Phase 1 (the requirements only mention `useReducer` for nav state)
   - Recommendation: Do NOT add Zustand in Phase 1. The only state needed is presentation nav state which is covered by `useReducer` + Context. Introduce Zustand only if Phase 2 surfaces a genuine need (e.g. separate UI state that doesn't belong in the presentation reducer).

2. **Placeholder coordinates for 5 stop nodes**
   - What we know: Phase 3 will design the real SVG world map; coordinates are percentages of SVG viewport
   - What's unclear: What percentage positions look reasonable on a blank canvas for Phase 1
   - Recommendation: Spread stops horizontally: `{ x: 15, y: 50 }`, `{ x: 30, y: 35 }`, `{ x: 50, y: 55 }`, `{ x: 70, y: 40 }`, `{ x: 85, y: 50 }`. These are visual placeholders only, will be replaced in Phase 3.

3. **`next/image` vs plain `<img>` for the dev indicator**
   - What we know: Static export requires either `unoptimized: true` or a custom loader for `next/image`
   - What's unclear: Whether any images are needed in Phase 1 (the placeholder map has no imagery)
   - Recommendation: Use plain `<img>` or no images at all in Phase 1. Add `images: { unoptimized: true }` to `next.config.ts` as a safety measure for future phases.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None detected — Wave 0 must establish |
| Config file | None — see Wave 0 |
| Quick run command | `npm test` (once configured) |
| Full suite command | `npm test -- --passWithNoTests` |

**Recommended framework:** Vitest + React Testing Library. Rationale: Vitest is the standard for Next.js/Vite-adjacent stacks in 2025, integrates with TypeScript without extra config, and `@testing-library/react` is the standard for component testing.

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FOUND-01 | `next build` produces `out/` directory | smoke | `npm run build` | ❌ Wave 0 |
| FOUND-03 | No hydration errors in static export | smoke | `npm run build` (check exit code + stderr) | ❌ Wave 0 |
| FOUND-04 | MotionConfig with reducedMotion="user" present in component tree | unit | `vitest run src/components/features/presentation/` | ❌ Wave 0 |
| FOUND-05 | Stop type has slug, label, coordinates, slides fields | unit | `vitest run src/types/` or type check only | ❌ Wave 0 |
| FOUND-06 | All 5 stops exist in `stops[]` array with non-empty slides | unit | `vitest run src/data/topics/` | ❌ Wave 0 |
| FOUND-07 | `src/components/` follows `ui/`, `layout/`, `features/` structure | manual | `ls src/components/` visual check | n/a |
| QUAL-02 | No hardcoded strings in component JSX | manual/lint | ESLint rule or code review | n/a |
| NAV-01 stub | PresentationProvider renders without errors | unit | `vitest run src/components/features/presentation/` | ❌ Wave 0 |

### Sampling Rate

- **Per task commit:** `npm run build` (verifies static export integrity)
- **Per wave merge:** `npm run build && npm test -- --passWithNoTests`
- **Phase gate:** Full build succeeds, `out/` directory exists, no console errors

### Wave 0 Gaps

- [ ] `vitest.config.ts` — framework install: `npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom`
- [ ] `src/data/topics/__tests__/stops.test.ts` — covers FOUND-05, FOUND-06
- [ ] `src/components/features/presentation/__tests__/PresentationProvider.test.tsx` — covers FOUND-03, FOUND-04, NAV-01 stub

---

## Sources

### Primary (HIGH confidence)

- [Next.js static exports official docs](https://nextjs.org/docs/app/guides/static-exports) — verified `output: 'export'` config, unsupported features list, version history
- [Next.js Server and Client Components docs](https://nextjs.org/docs/app/getting-started/server-and-client-components) — `'use client'` boundary rules, context provider pattern in layout
- [Tailwind CSS v4 with Next.js install guide](https://tailwindcss.com/docs/guides/nextjs) — verified PostCSS plugin approach, CSS-first `@import "tailwindcss"`
- [motion.dev MotionConfig docs](https://motion.dev/docs/react-motion-config) — `reducedMotion="user"` prop verified

### Secondary (MEDIUM confidence)

- [Tailwind v4 release announcement](https://tailwindcss.com/blog/tailwindcss-v4) — CSS-first configuration, `@theme` directive, performance claims
- [Motion upgrade guide](https://motion.dev/docs/react-upgrade-guide) — package rename from `framer-motion` to `motion`, no breaking changes in v12
- WebSearch results confirming Motion 12.35.0 current version (March 2026)
- WebSearch results confirming Zustand 5.x as current standard for simple React state

### Tertiary (LOW confidence)

- Medium/DEV community articles on Zustand vs useReducer patterns — used for context only, not for architectural decisions

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all library versions and installation patterns verified against official docs
- Architecture: HIGH — `'use client'` boundary rules and context provider patterns verified from Next.js official docs
- Pitfalls: HIGH — hydration, image optimization, MotionConfig placement all verified from official sources
- Content mapping: HIGH — directly read `proposal-content.md` and mapped to 5-stop structure

**Research date:** 2026-03-11
**Valid until:** 2026-06-11 (90 days — Next.js, Tailwind, and Motion are stable; Tailwind v4 is newly released so check for breaking changes if > 30 days pass)
