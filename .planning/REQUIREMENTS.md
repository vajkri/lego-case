# Requirements: LEGO Migration Proposal — Interactive Presentation

**Defined:** 2026-03-11
**Core Value:** A compelling, accessible, story-driven presentation that makes the migration case so clearly — for both engineers and business stakeholders — that the path forward feels obvious.

---

## v1 Requirements

Requirements for initial release. Each maps to a roadmap phase.

### Foundation

- [x] **FOUND-01**: Project initializes as a Next.js 16 App Router app with `output: 'export'` (fully static, no server required)
- [x] **FOUND-02**: Motion 12 (`motion/react`), Tailwind v4, and Zustand are installed and configured with correct Next.js integration
- [x] **FOUND-03**: All animation components are isolated behind `'use client'` boundaries — no hydration errors on `next build`
- [x] **FOUND-04**: `MotionConfig reducedMotion="user"` wraps the entire presentation root so all animations respect `prefers-reduced-motion` globally
- [x] **FOUND-05**: TypeScript type definitions exist for all 14 topics: title, map position coordinates, array of sub-slides (each with heading and content)
- [x] **FOUND-06**: All 14 topic data files are authored and content-complete, sourced from `.planning/assets/proposal-content.md`
- [x] **FOUND-07**: Codebase follows industry best practices: no unused code, consistent naming, clean component boundaries, and obvious DX (any dev can understand the structure in < 5 minutes)

### Map

- [ ] **MAP-01**: An SVG inline world map renders as the root/default view with 14 named city nodes at defined coordinates
- [ ] **MAP-02**: Each city node is a focusable `<button>` with visible label, keyboard-focusable, and accessible via screen reader
- [ ] **MAP-03**: Visited cities have a distinct visual state from unvisited cities
- [ ] **MAP-04**: A progress indicator shows the presenter's current position in the 14-topic journey

### Car & Travel

- [ ] **CAR-01**: A red LEGO car element is rendered on the map and positioned at the current city
- [ ] **CAR-02**: When advancing to the next topic, the car animates along a path from the current city to the next city using CSS motion path (`offsetPath`)
- [ ] **CAR-03**: Car travel animation uses CSS transform properties (`x`/`y`), not SVG coordinate attributes, to avoid layout/paint on every frame
- [ ] **CAR-04**: Car travel animation is smooth and does not drop frames on a standard laptop

### Navigation

- [x] **NAV-01**: A single `PresentationContext` (useReducer) manages: current topic index, current sub-slide index, and whether the slide overlay is open
- [ ] **NAV-02**: A `KeyboardController` client component mounted in root layout listens globally for: `ArrowRight`/`Space` (advance), `ArrowLeft` (back), `Escape` (close slide / return to map)
- [x] **NAV-03**: Pressing advance on the last sub-slide of a topic closes the slide overlay and returns to the map view
- [x] **NAV-04**: Pressing advance on the map (no slide open) triggers car travel to next city and opens that city's slide
- [x] **NAV-05**: Navigation state is deterministic and unit-testable independent of UI

### Slides

- [x] **SLIDE-01**: When the car arrives at a city, a full-screen slide overlay animates in (zoom/scale takeover) via `AnimatePresence`
- [ ] **SLIDE-02**: Slide overlay is rendered as a conditional React element in layout (not a route transition) to avoid the known App Router/AnimatePresence incompatibility
- [x] **SLIDE-03**: Each slide renders its topic content (heading, body) from typed data files — no hardcoded slide content in components
- [x] **SLIDE-04**: Multi-sub-slide topics step through each sub-slide in sequence before returning to the map
- [ ] **SLIDE-05**: Slide overlay zooms back out smoothly when closing, returning focus and view to the map

### Accessibility

- [x] **A11Y-01**: Focus is trapped inside the slide overlay while it is open (WCAG 2.1.2) — implemented via `focus-trap-react` or equivalent
- [x] **A11Y-02**: An ARIA live region announces the current topic name and sub-slide number when they change, for screen reader users
- [x] **A11Y-03**: All interactive elements (city nodes, slide close button) have visible focus indicators meeting WCAG 2.4.7
- [x] **A11Y-04**: When the slide overlay closes, focus returns to the city button that triggered it
- [ ] **A11Y-05**: The keyboard navigation model is documented in code with clear comments — demonstrating accessibility competence to LEGO reviewers

### Performance & Quality

- [ ] **PERF-01**: `next build` completes without errors or warnings related to static export, server components, or image optimization
- [ ] **PERF-02**: The app loads and is interactive in < 3 seconds on a standard laptop over Wi-Fi
- [ ] **PERF-03**: No console errors or warnings in production build
- [x] **QUAL-01**: Component structure matches the conventions in `CLAUDE.md` (ui/, layout/, features/ folders; barrel exports; PascalCase naming)
- [x] **QUAL-02**: All content is rendered from data files — zero hardcoded presentation content in component JSX
- [x] **QUAL-03**: The codebase is simple and elegant: prefer obvious solutions over clever ones, minimal abstractions, readable over terse

---

## v2 Requirements

Deferred to future iteration. Tracked but not in current roadmap.

### Enhancements

- **ENH-01**: Speaker notes mode (second window or overlay, not blocking)
- **ENH-02**: Touch/swipe gesture support for tablet use
- **ENH-03**: Presentation remote / clicker device support (media key events)
- **ENH-04**: URL-per-slide deep linking (requires architectural change to routing model)

---

## Out of Scope

| Feature | Reason |
|---------|--------|
| PDF / print export | CSS print breaks severely with animated map layout; single-focus v1 |
| Backend / API | Fully static presentation; no data persistence needed |
| CMS integration | Content authored in TypeScript data files; no external dependency |
| Mobile-responsive layout | Desktop presentation context; mobile layout adds complexity for no gain in v1 |
| Authentication | No login required for a presentation app |
| Real-time collaboration | Single-presenter use case |

---

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1 | Pending |
| FOUND-02 | Phase 1 | Pending |
| FOUND-03 | Phase 1 | Complete |
| FOUND-04 | Phase 1 | Complete |
| FOUND-05 | Phase 1 | Complete |
| FOUND-06 | Phase 1 | Complete |
| FOUND-07 | Phase 1 | Complete |
| QUAL-01 | Phase 1 | Complete |
| QUAL-02 | Phase 1 | Complete |
| QUAL-03 | Phase 1 | Complete |
| NAV-01 | Phase 2 | Complete |
| NAV-02 | Phase 2 | Pending |
| NAV-03 | Phase 2 | Complete |
| NAV-04 | Phase 2 | Complete |
| NAV-05 | Phase 2 | Complete |
| SLIDE-01 | Phase 2 | Complete |
| SLIDE-02 | Phase 2 | Pending |
| SLIDE-03 | Phase 2 | Complete |
| SLIDE-04 | Phase 2 | Complete |
| SLIDE-05 | Phase 2 | Pending |
| A11Y-01 | Phase 2 | Complete |
| A11Y-02 | Phase 2 | Complete |
| A11Y-03 | Phase 2 | Complete |
| A11Y-04 | Phase 2 | Complete |
| A11Y-05 | Phase 2 | Pending |
| MAP-01 | Phase 3 | Pending |
| MAP-02 | Phase 3 | Pending |
| MAP-03 | Phase 3 | Pending |
| MAP-04 | Phase 3 | Pending |
| CAR-01 | Phase 3 | Pending |
| CAR-02 | Phase 3 | Pending |
| CAR-03 | Phase 3 | Pending |
| CAR-04 | Phase 3 | Pending |
| PERF-01 | Phase 4 | Pending |
| PERF-02 | Phase 4 | Pending |
| PERF-03 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 36 total
- Mapped to phases: 36
- Unmapped: 0

---
*Requirements defined: 2026-03-11*
*Last updated: 2026-03-11 — traceability updated to match roadmap phases*
