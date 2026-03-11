# Phase 1: Foundation - Context

**Gathered:** 2026-03-11
**Status:** Ready for planning

<domain>
## Phase Boundary

Set up the Next.js project from scratch: static export configuration, all dependencies installed and configured, typed data for all 5 presentation stops with full content, component architecture boundaries established, and a stub navigation layer that proves the wiring works.

**Important:** During this discussion, the presentation structure was redesigned from 14 flat topic stops to 5 grouped stops (see decisions below). The requirements and roadmap docs still reference "14 topics" and must be updated as part of Phase 1 or before planning begins.

</domain>

<decisions>
## Implementation Decisions

### Presentation structure
- Restructured from 14 individual topic stops to 5 grouped stops
- Stop 1: **The Case** — Why we're here, Goals
- Stop 2: **Vision** — Frontend Architecture, Component Architecture, Design System Strategy
- Stop 3: **How We Work** — Team Structure, Storybook, CI/CD, Testing, Analytics
- Stop 4: **Migration** — Migration Strategy, Migration Steps, Risk Mitigation
- Stop 5: **Summary**
- Each stop has multiple sub-slides derived from content structure in proposal-content.md

### Data model
- Top-level type is `Stop` (not `Topic`) — slug identifier only (no separate numeric id field)
- Map coordinates: `{ x: number; y: number }` as percentages of SVG viewport (e.g. `{ x: 45.2, y: 32.1 }`)
- Sub-slide type: `{ heading: string; content: React.ReactNode }` — flexible content slot
  - Minimum concrete shape: `lines: string[]` array for bullet-point content
  - ReactNode allows future richer content without type changes
- File organization: `src/data/topics/` folder with `index.ts` barrel

### Content completeness
- Full prose for all 5 stops authored in Phase 1, sourced from `.planning/assets/proposal-content.md`
- Sub-slide count and breakdown derived from natural content structure (not fixed per stop)
- No placeholder content — FOUND-06 met fully in Phase 1

### Root view
- Phase 1 renders a visible map placeholder: 5 labeled city node buttons positioned on a blank canvas using percentage coordinates
- No SVG world map yet (Phase 3) — just positioned nodes that prove the data wiring
- Keyboard presses visibly update state (e.g. a dev indicator showing current stop index) — proves reducer wiring before Phase 2 builds real UI on top

### PresentationProvider state interface
- Full interface defined in Phase 1: `{ currentStop: number; currentSlide: number; mode: 'map' | 'slide' }`
- Reducer actions stubbed (defined but no-op or console.log) — Phase 2 fills in real logic
- Interface is locked; Phase 2 only adds action implementations, not new state fields

### KeyboardController
- Mounts in root layout and listens for: `ArrowRight` / `Space` (advance), `ArrowLeft` (back), `Escape` (close)
- Dispatches to reducer in Phase 1 — stub actions log to console
- No real navigation behavior yet; proves event wiring is correct

### Claude's Discretion
- Exact dev indicator design for showing keyboard state in Phase 1
- Tailwind v4 configuration details (CSS variables vs config file approach)
- Zustand store structure (whether to use a single store or alongside useReducer)
- Component file names and exact directory layout within CLAUDE.md conventions

</decisions>

<specifics>
## Specific Ideas

- The "meta" angle matters: the app IS built with the recommended stack (React + Next.js), which is itself an argument. Architecture choices should be visible and clean.
- Content accuracy is higher priority than visual polish in Phase 1 — get the words right first
- The task brief's 4 pillars (Framework, Architecture, Measurement, Migration) map to stops 2-4 (with Stop 1 as context-setter and Stop 5 as summary)

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- None — clean slate. Only CLAUDE.md exists at project root.

### Established Patterns
- CLAUDE.md defines component conventions: `ui/`, `layout/`, `features/` folders; barrel exports; PascalCase naming
- All animation components must use `'use client'` boundary
- `MotionConfig reducedMotion="user"` wraps presentation root

### Integration Points
- `src/data/topics/index.ts` → consumed by `PresentationProvider` and all map/slide components
- `PresentationProvider` → wraps app in root layout, exposes context to all components
- `KeyboardController` → mounted in root layout alongside provider

</code_context>

<deferred>
## Deferred Ideas

- Speaker notes mode — v2 backlog (ENH-01)
- Touch/swipe gesture support — v2 backlog (ENH-02)
- URL-per-slide deep linking — v2 backlog (ENH-04)
- Visual grouping / clustering of stops on map by theme — could revisit in Phase 3 if map layout warrants it

</deferred>

---

*Phase: 01-foundation*
*Context gathered: 2026-03-11*
