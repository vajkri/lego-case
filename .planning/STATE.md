---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: Ready for Phase 4
stopped_at: Completed 04-content-and-polish-02-PLAN.md
last_updated: "2026-03-15T15:30:41.189Z"
last_activity: "2026-03-14 — Phase 03.4 complete: full-bleed backgrounds, ambient animations, shadow system, car alignment"
progress:
  total_phases: 8
  completed_phases: 6
  total_plans: 25
  completed_plans: 24
  percent: 100
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-11)

**Core value:** A compelling, accessible, story-driven presentation that makes the migration case so clearly — for both engineers and business stakeholders — that the path forward feels obvious.
**Current focus:** Phase 4 — Content and Polish

## Current Position

Phase: 03.4 of 8 (Map Visual Redesign — complete)
Plan: iterative feedback — phase 03.4 done, next: Phase 4
Status: Ready for Phase 4
Last activity: 2026-03-14 — Phase 03.4 complete: full-bleed backgrounds, ambient animations, shadow system, car alignment

Progress: [██████████] 100% (7 of 8 phases complete; Phase 4 not yet planned)

## Performance Metrics

**Velocity:**
- Total plans completed: 15
- Average duration: ~5 min
- Total execution time: ~1.25 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-foundation | 5 | 22 min | 4 min |
| 02-navigation-and-slides | 5 | 37 min | 7 min |
| 03-map-and-car-animation | 5 | 15 min | 3 min |
| Phase 03.1-design-system-integration P01 | 12 | 2 tasks | 6 files |
| Phase 03.1-design-system-integration P03 | 4 | 2 tasks | 12 files |
| Phase 03.1 P02 | 15 | 2 tasks | 10 files |
| Phase 03.1-design-system-integration P04 | 3 | 1 tasks | 1 files |
| Phase 03.2-01 P01 | 8 min | 2 tasks | 8 files |
| Phase 03.2-stop-marker-redesign P02 | 525671min | 2 tasks | 10 files |
| Phase 03.2-stop-marker-redesign P02 | 35min | 2 tasks | 10 files |
| Phase 03.3-progress-track-redesign P01 | 4min | 2 tasks | 7 files |
| Phase 03.3 P02 | 168 | 2 tasks | 4 files |
| Phase 04-content-and-polish P01 | 6 | 2 tasks | 11 files |
| Phase 04-content-and-polish P02 | 10 | 2 tasks | 2 files |

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- Scaffold (01-01): Tailwind v4 CSS-first — @import 'tailwindcss' in globals.css, no tailwind.config.js required
- Scaffold (01-01): Motion 12 is the 'motion' npm package (not 'framer-motion' which is the v10 legacy package)
- Scaffold (01-01): Static export via output: 'export' in next.config.ts — no server runtime required for presentation app
- Architecture: State-driven navigation (never route-driven) — URL stays at `/` throughout
- Architecture: `SlideOverlay` mounted in root layout, rendered conditionally via `mode === 'slide'` state
- [Phase 01]: Types locked in Phase 1 — frozen contracts for all downstream plans
- [Phase 01]: Data sourced from proposal-content.md — no invented content; barrel stops[] is sole import point
- [Phase 01]: MotionConfig inside PresentationProvider so entire app tree inherits reducedMotion=user
- [Phase 01]: Root layout stays a Server Component — PresentationProvider and KeyboardController form isolated client subtrees
- [Phase 02]: triggerRef capture pattern for A11Y-04 focus return on overlay close
- [Phase 02]: OverlayPresence is a dedicated 'use client' wrapper so AnimatePresence can run while layout.tsx stays a Server Component
- [Footer refactor — 2026-03-12]: PresentationFooter extracted to root layout — always visible on both map and slide views
- [Phase 03]: awaitingSlideOpen boolean distinguishes just-arrived from returned-from-overlay; ARRIVE action dispatched by CarElement; visitedStops starts as [0]
- [Phase 03]: RoadPath.tsx: ROAD_PATH_D and STOP_OFFSETS co-located as single source of truth
- [Phase 03]: CarElement: Single motion.div with offsetPath/offsetDistance
- [Styleguide — 2026-03-14]: Design system v2 finalized — Baloo 2 + DM Sans fonts, LEGO Red accent, depth via hard box-shadow on content blocks, depth via border-bottom on buttons, variant system (default/red/yellow), 14px badge size, tint-md opacity reduced for contrast
- [Phase 03.1-01]: rgba() values in :root not @theme — Tailwind v4 @theme silently drops rgba color values; tints and depth shadows live in :root
- [Phase 03.1-01]: Button exports className prop for composition by downstream components (PresentationFooter, etc.)
- [Phase 03.1-01]: border-b-4 active:border-b-2 + active:translate-y-0.5 for Button brick press effect via pure CSS active: pseudo-class
- [Phase 03.1-03]: variantStyleMap uses inline style prop (not Tailwind classes) for rgba-based variant colors — Tailwind v4 cannot represent rgba values as tokens
- [Phase 03.1-03]: EntityCards defaults to yellow variant (yellow = primary action color per color hierarchy)
- [Phase 03.1-03]: Content block depth shadow via box-shadow CSS vars (not border-bottom) to preserve rounded corners
- [Phase 03.1]: SlideFrame is NOT 'use client' — layout-only, parent SlideOverlay owns client boundary
- [Phase 03.1]: close button id='slide-close-btn' is immutable FocusTrap constraint — documented in SlideFrame source
- [Phase 03.1]: Nav arrows inlined as ReactNode slots in SlideFrame — chrome slot pattern for flexible nav injection
- [Phase 03.1-design-system-integration]: SlideOverlay nav arrows consume Button primitive — no raw button elements with duplicated Tailwind class strings
- [Phase 03.2]: labelPosition is required (not optional) on Stop type — enforces compile-time completeness, prevents accidental omissions
- [Phase 03.2]: 5-state data-state test uses 'default' (not 'unvisited') per new spec — 1 test intentionally RED as forcing function for Plan 02
- [Phase 03.2]: MarkerPin removed entirely; BrickMarker is the complete replacement using brick-stack SVG as the new visual language for stop markers
- [Phase 03.2]: CSS fill transition (300ms ease) on SVG rect style prop (not SVG fill attribute) enables active-to-visited color sweep without JS animation library
- [Phase 03.2]: brick-drop animation applied only to topmost brick group element, not whole SVG, for per-brick entrance effect
- [Phase 03.2-stop-marker-redesign]: [Phase 03.2-02]: Road-side placement: labels-above stops offset -25px left, labels-below +25px right
- [Phase 03.2-stop-marker-redesign]: [Phase 03.2-02]: Brick sizing at 80% via SVG width/height (not CSS transform) to preserve correct stud proportions
- [Phase 03.2-stop-marker-redesign]: [Phase 03.2-02]: Dynamic SVG viewBox crops to content bounds per stop index — eliminates inflated gap above shorter stacks
- [Phase 03.2-stop-marker-redesign]: [Phase 03.2-02]: Static labels only 3 states (default/active/visited) — no hover/focus label changes after feedback round 4
- [Phase 03.2-stop-marker-redesign]: [Phase 03.2-02]: Brick color activation at 80% car travel (1.12s into 1.4s) via useEffect+setTimeout for visual anticipation
- [Phase 03.3-01]: SubSlideProgress size prop uses SIZE_CONFIG object mapping variant names to dimension values — not conditional ternaries
- [Phase 03.3-01]: MinifigHead face expressions are separate FC components — no transition on face features, only on rect fills (200ms)
- [Phase 03.3-01]: MinifigHead is a pure Server Component (no 'use client') — no hooks, no event handlers needed
- [Phase 03.3-02]: Red connectors use clip-path inset animation (sweep wipe) on mount; green visited connectors crossfade from red via CSS background transition
- [Phase 03.3-02]: MapProgressIndicator.tsx deleted — footer is now the sole progress indicator; MapProgressIndicator was already unused in MapCanvas
- [Phase 03.3-02]: Index-based hoveredIndex/focusedIndex (number|null) manages hover/focus for all 5 minifig head buttons with single React state pair
- [Phase 03.4]: Full-bleed sky/grass via CSS background layers in MapCanvas, anchored to inner container's horizon (44.375%), SVG has transparent background
- [Phase 03.4]: HORIZON_Y constant exported from MapSvg, consumed by MapCanvas — single source of truth for sky/grass split
- [Phase 03.4]: Road colors softened (#5C6370 edge, #6E7685 surface) to reduce visual dominance vs stop markers
- [Phase 03.4]: Car drives right side of road (Y offset -10%) via transform, flips with scaleX(-1) when backward
- [Phase 03.4]: Ambient animations via SVG SMIL (not CSS) — native user units avoid viewBox scaling mismatch. prefers-reduced-motion disables all
- [Phase 03.4]: Cloud wrapping: duplicate cloud at +1600 SVG units, animateTransform translates group by -1600, seamless infinite loop
- [Phase 03.4]: Shadow system: hard flat shadows (2-3px offset, no blur, rgba 0.06-0.1) matching sun direction (upper-left), applied to trees/buildings/mountains/windmill/stops/car
- [Phase 04-content-and-polish]: ContentBlock discriminated union (6 members) + switch dispatcher in SlideContent — Slide.lines replaced with Slide.blocks
- [Phase 04-content-and-polish]: CalloutBox data shape: { type: 'callout', text: string } — no ReactNode in data files, keeps stop data files JSX-free
- [Phase 04-content-and-polish]: BulletList heading is optional (heading?: string) — single-block slides omit block headings for cleaner slide layout
- [Phase 04-content-and-polish]: No production-blocking issues found — plan executed exactly as written after test mock fix

### Roadmap Evolution

- Phase 03.1 inserted after Phase 3: Design system integration — Tailwind tokens, UI components, CLAUDE.md docs (INSERTED)
- Phase 03.2 inserted after Phase 3.1: Stop marker redesign — chosen proposal in StopNode.tsx with label positioning (INSERTED)
- Phase 03.3 inserted after Phase 3: Progress track redesign — visual states for default, hover, current, visited (INSERTED)
- Phase 03.4 inserted after Phase 3: Map visual redesign — Legoesque aesthetic proposal mockups and implementation (INSERTED)

### Pending Todos

- [ ] Redesign onboarding with welcome message and keyboard shortcuts (2026-03-15) — area: ui
- [x] ~~Enlarge stop nodes (125%) and preserve brick colors when visited (2026-03-15) — area: ui~~ — done
- [ ] EntityCards initials circle color should match variant (2026-03-15) — area: ui
- [x] ~~Add favicon to project (2026-03-12) — area: ui~~ — done
- [x] ~~Add subtle animations to map elements (2026-03-12) — sun pulse, cloud drift, windmill rotation~~ — done
- [x] ~~Clean up shadows for map elements (2026-03-12) — road shadow removal, consistent depth treatment~~ — done

### Blockers/Concerns

None

## Session Continuity

Last session: 2026-03-15T15:17:03.030Z
Stopped at: Completed 04-content-and-polish-02-PLAN.md
Resume file: None
