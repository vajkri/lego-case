# Roadmap: LEGO Migration Proposal — Interactive Presentation

## Overview

Four phases deliver the presentation app. Phase 1 establishes the architectural skeleton — static export validation, typed data structure, and dev conventions — so every subsequent phase builds on correct foundations. Phase 2 wires the interactive core: keyboard navigation, slide overlays, and accessibility all in one coherent delivery (not retrofitted). Phase 3 adds the animated map and car travel that complete the LEGO world metaphor. Phase 4 authors all 14 topic slides to completion and applies LEGO visual design, producing a presentation that is polished enough to give at LEGO.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation** - Next.js static export scaffold, typed topic data structure, and project conventions established (completed 2026-03-12)
- [x] **Phase 2: Navigation and Slides** - Full keyboard navigation, slide overlay with AnimatePresence, and accessibility built in from day one (completed 2026-03-12)
- [ ] **Phase 3: Map and Car Animation** - Inline SVG world map with 14 city nodes and animated car traveling between them
- [ ] **Phase 4: Content and Polish** - All 14 topics fully authored, LEGO design tokens applied, production build verified

## Phase Details

### Phase 1: Foundation
**Goal**: The project runs as a verified static export with correct architecture boundaries, typed data for all 5 stops (redesigned from 14 topics), and dev conventions that any developer can follow immediately.
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-04, FOUND-05, FOUND-06, FOUND-07, QUAL-01, QUAL-02, QUAL-03
**Success Criteria** (what must be TRUE):
  1. `next build` completes and `out/` directory is a fully static export with no server components, no hydration errors, and no console warnings
  2. All 5 stop entries exist in TypeScript data files with typed coordinates, slide headings, and body content sourced from `proposal-content.md`
  3. A developer who has never seen the codebase can identify every major component and its responsibility within 5 minutes by reading the folder structure and file names alone
  4. All animation components are wrapped in `'use client'` boundaries and `MotionConfig reducedMotion="user"` wraps the presentation root — verifiable by inspecting the component tree
  5. The `PresentationProvider` reducer and `KeyboardController` stub are mounted and the app renders its root view without errors
**Plans**: 5 plans

Plans:
- [x] 01-01-PLAN.md — Project scaffold: Next.js static export, Tailwind v4, Motion, Zustand, Vitest
- [ ] 01-02-PLAN.md — TypeScript types and data layer test scaffold
- [ ] 01-03-PLAN.md — Author all 5 stop data files from proposal-content.md
- [ ] 01-04-PLAN.md — PresentationProvider, KeyboardController, and provider unit tests
- [ ] 01-05-PLAN.md — Root layout wiring, MapCanvas, human verification

### Phase 2: Navigation and Slides
**Goal**: A presenter can navigate through all 5 stops using only the keyboard, see each stop's slides in a full-screen overlay, step through sub-slides, and return to the map — with accessibility correct from the start.
**Depends on**: Phase 1
**Requirements**: NAV-01, NAV-02, NAV-03, NAV-04, NAV-05, SLIDE-01, SLIDE-02, SLIDE-03, SLIDE-04, SLIDE-05, A11Y-01, A11Y-02, A11Y-03, A11Y-04, A11Y-05
**Success Criteria** (what must be TRUE):
  1. Pressing ArrowRight or Space from the map advances to the next stop's slides; pressing ArrowLeft goes back; pressing Escape closes the current slide and returns to the map
  2. The slide overlay animates in as a full-screen zoom takeover and animates back out when closed — both transitions play correctly in a production build
  3. On a stop with 3 sub-slides, pressing ArrowRight steps through all 3 in sequence, then closes the overlay and returns to the map on the final advance
  4. When the slide overlay opens, focus is trapped inside it; when it closes, focus returns to the stop node button that triggered it — verifiable with a keyboard-only walkthrough
  5. A screen reader announces the current stop name and sub-slide number each time they change, without the user taking any extra action
**Plans**: 5 plans

Plans:
- [ ] 02-01-PLAN.md — Wave 0: Reducer and SlideOverlay test scaffolds (RED state)
- [ ] 02-02-PLAN.md — Real reducer implementation + JUMP_TO_STOP action + triggerRef in context
- [ ] 02-03-PLAN.md — StopNode wiring: JUMP_TO_STOP dispatch + triggerRef capture
- [ ] 02-04-PLAN.md — SlideOverlay component tree with focus trap and ARIA live region
- [ ] 02-05-PLAN.md — OverlayPresence layout wiring + human verification

### Phase 3: Map and Car Animation
**Goal**: The LEGO world map is visible as the root view with all 5 named stop nodes, and the red LEGO car travels smoothly between stops on the GPU compositor thread without dropped frames.
**Depends on**: Phase 2
**Requirements**: MAP-01, MAP-02, MAP-03, MAP-04, CAR-01, CAR-02, CAR-03, CAR-04
**Success Criteria** (what must be TRUE):
  1. The root view shows an SVG world map with all 5 stop nodes labeled, each rendered as a focusable button accessible by keyboard tab order and announced by a screen reader
  2. Pressing advance on the map triggers the red LEGO car to animate along a path from the current stop to the next stop before the slide overlay opens
  3. Stops the presenter has already visited display a visually distinct state from unvisited stops, and a progress indicator shows the current position in the 5-stop journey
  4. Car travel animation runs at 60fps on a standard laptop — no visible jank during stop-to-stop transitions — verified by watching Chrome DevTools Performance panel during travel
**Plans**: 5 plans

Plans:
- [ ] 03-01-PLAN.md — State machine extension: isCarTraveling + awaitingSlideOpen + ARRIVE action + reducer tests
- [ ] 03-02-PLAN.md — Wave 0 test scaffolds: StopNode.test.tsx + CarElement.test.tsx (RED state)
- [ ] 03-03-PLAN.md — Illustrated SVG world map: MapSvg + RoadPath constants
- [ ] 03-04-PLAN.md — LEGO StopNode redesign (3 states) + CarElement motion path implementation
- [ ] 03-05-PLAN.md — MapCanvas wiring + MapProgressIndicator + stop coordinate update + human verification

### Phase 4: Content and Polish
**Goal**: All 5 stop slides are fully authored and visually complete with LEGO-inspired design tokens, the production build is clean, and the presentation is ready to give.
**Depends on**: Phase 3
**Requirements**: PERF-01, PERF-02, PERF-03
**Success Criteria** (what must be TRUE):
  1. `next build` completes with zero errors, zero warnings related to static export, server components, or image optimization, and zero console errors in the production build
  2. The app is interactive in under 3 seconds on a standard laptop over Wi-Fi, measured from navigation to first meaningful paint
  3. A run-through of all 5 stops from first to last produces no broken slides, placeholder content, missing data, or visual regressions
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 5/5 | Complete   | 2026-03-12 |
| 2. Navigation and Slides | 5/5 | Complete   | 2026-03-12 |
| 3. Map and Car Animation | 3/5 | In Progress|  |
| 4. Content and Polish | 0/TBD | Not started | - |
