# Project Research Summary

**Project:** LEGO Migration Proposal — Interactive Presentation App
**Domain:** Custom interactive single-presenter presentation web app (animated SVG map + slide viewer)
**Researched:** 2026-03-11
**Confidence:** HIGH

## Executive Summary

This is a bespoke interactive presentation built in Next.js App Router — a fully static, single-page app that doubles as its own proof of concept. The core mechanic is a LEGO-themed world map where an animated car travels between 14 topic "cities," and each city zooms into a full-screen slide takeover. The audience is mixed engineers and stakeholders, so the app must be both visually impressive and demonstrably well-built. Research strongly confirms this should be built as a static export (`output: 'export'`) with client-side-only state — no server, no dynamic routes, no CMS.

The recommended approach centers on Next.js 16 + React 19 + Motion 12 (formerly Framer Motion) + Tailwind v4 + Zustand. The architecture uses a single `PresentationProvider` with a `useReducer`-driven state machine at the root, an inline SVG map with CSS motion path animation for the car, and a `SlideOverlay` that mounts conditionally via client state — never via routing. This architecture sidesteps the most dangerous known pitfall: `AnimatePresence` exit animations silently failing when tied to Next.js App Router route transitions. By keeping navigation in React state and the URL fixed at `/`, the entire animation stack works predictably.

The primary risks are accessibility (focus management, ARIA live regions, and `prefers-reduced-motion` must be built in from Phase 2, not retrofitted), SVG animation performance (animating transforms rather than layout properties keeps the car on the GPU compositor thread), and scope creep (speaker notes, PDF export, URL deep linking, and CMS are explicitly out of scope for v1). The content authoring of all 14 topics from `proposal-content.md` is the highest-effort item and a hard prerequisite for every other feature.

## Key Findings

### Recommended Stack

The stack is well-resolved. Next.js 16 with App Router and `output: 'export'` gives a zero-server static deployment with React 19's compiler (auto-memoization helps animation-heavy components). Motion 12 (`motion/react`) handles all animation — car path travel via `offsetPath`/`offsetDistance`, slide takeovers via `AnimatePresence`, and global accessibility via `MotionConfig reducedMotion="user"`. Tailwind v4's CSS-first config maps cleanly to LEGO design tokens. Zustand 5 provides shared presentation state without prop-drilling through the deep map/car/overlay hierarchy.

**Core technologies:**
- **Next.js 16** (App Router, `output: 'export'`): sole framework; Turbopack default; static deployment, no server required
- **React 19.2**: bundled with Next.js 16; React Compiler eliminates manual memoization for animation components
- **Motion 12** (`motion/react`): all animation — SVG path travel, slide zoom transitions, AnimatePresence mount/unmount, reduced-motion compliance
- **Tailwind CSS 4**: CSS-first config; design tokens via CSS custom properties; responsive layout utilities
- **Zustand 5**: shared navigation state (topic index, sub-slide index, mode, car position) — lighter than Context+useReducer for sibling-heavy component tree
- **focus-trap-react 10**: WCAG 2.1.2 focus confinement inside slide overlay
- **@radix-ui/react-visually-hidden**: screen-reader-only ARIA live region announcements

### Expected Features

The feature dependency tree has a clear critical path. Content data structure → Navigation state machine → Map view → Car animation → City zoom-in takeover → Multi-slide sub-navigation → Return-to-map. The city zoom-in takeover is the single most complex feature and cannot be deferred; everything else flows from it.

**Must have (table stakes):**
- All 14 topic slides authored from `proposal-content.md` — without this there is nothing to present
- Navigation state machine (topic index, sub-slide index, mode, car position) — backbone of everything
- LEGO world map with 14 city nodes — spatial orientation for audience
- Animated car traveling between cities — the core metaphor that signals animation capability
- City zoom-in full-screen takeover — the signature interaction; absence breaks the concept
- Return-to-map animation — completes the journey metaphor; zoom-in without zoom-out feels broken
- Multi-slide sub-navigation — required for content completeness across variable-length topics
- Keyboard navigation (arrows, space, escape) — table stakes and accessibility demonstration
- LEGO-inspired visual design tokens — must look credible to a LEGO audience
- Fullscreen mode — presentation context requires it; Fullscreen API
- `prefers-reduced-motion` throughout — signals accessibility competence; must be v1 not retrofit
- ARIA live regions for slide changes — screen reader accessibility
- Visible focus indicators — WCAG 2.4.7 compliance
- Visited city visual state — low-effort progress cue, reinforces journey narrative

**Should have (v1.x):**
- Touch/swipe support — if presenter uses tablet or audience gets self-guided URL

**Defer (v2+):**
- Speaker notes window — only if reused across multiple presenters
- Print/PDF export — export from `proposal-content.md` as a separate document, not from the app
- URL-per-slide deep linking — only if app becomes self-guided reference
- CMS integration — content in TypeScript files, redeploy on change

### Architecture Approach

The app has one route (`/`). All presentation state lives in a `PresentationProvider` (client component with `useReducer`) mounted in `app/layout.tsx`. The `SlideOverlay` is also mounted in the root layout and renders conditionally based on `mode === 'slide'` state — this is the core architectural decision that makes `AnimatePresence` exit animations work reliably. The map, car animator, and slide overlay are all siblings driven by context, never by routing.

**Major components:**
1. `PresentationProvider` — context + reducer; holds `topicIndex`, `subSlideIndex`, `mode`, `carPosition`; single source of truth
2. `KeyboardController` — `'use client'` component rendering `null`; attaches/detaches `keydown` on `window` via `useEffect`
3. `MapView` + `CarAnimator` + `CityNode` — renders SVG map; car travels via CSS motion path (`offsetPath`/`offsetDistance`)
4. `SlideOverlay` + `SlideContent` + `SubSlideProgress` — full-screen overlay; `AnimatePresence` handles zoom-in/zoom-out
5. `src/data/presentation.ts` + `src/data/topics/` — static TypeScript content; imported at build time, zero runtime fetch
6. `lib/presentation-reducer.ts` — pure function state machine; unit-testable without React

### Critical Pitfalls

1. **AnimatePresence exit animations silently fail in App Router** — avoid by using state-driven navigation (never route-driven); keep URL at `/` throughout; this project's architecture already sidesteps this if maintained correctly

2. **Missing `'use client'` causes hydration errors on Motion components** — add `'use client'` to every file using `motion.*`, `AnimatePresence`, or `useAnimation`; establish Server/Client boundaries in Phase 1 scaffold before any feature work

3. **Global keyboard listeners accumulate** — always return cleanup from `useEffect`; use stable `dispatch` reference as dependency; call `e.preventDefault()` on arrow keys and space to prevent browser scroll conflicts

4. **Accessibility fails when animation is visually central** — `MotionConfig reducedMotion="user"` at root (one line, added in Phase 1); ARIA live region for slide announcements; focus moved to slide heading after entry animation completes; Escape returns focus to triggering city node; these must be Phase 2, not a Phase 5 retrofit

5. **Animating SVG layout properties causes frame drops** — use `motion.g` with `x`/`y` transform props (GPU compositor thread), never `cx`/`cy` or absolute coordinate animation; never use `layout` prop on SVG elements; `React.memo` the car component to prevent re-renders during travel

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Foundation and Scaffold

**Rationale:** All pitfalls in the "Phase 1" category are architectural — wrong decisions here are expensive to undo. The static export config, `'use client'` boundaries, and the state machine model must be established before any feature work. Content data structure must exist before any component can render real content.
**Delivers:** Runnable static export with correct architecture skeleton; 14-topic typed data structure; `PresentationProvider` + reducer; `KeyboardController` stub; `MotionConfig reducedMotion="user"` at root; verified `next build` output
**Addresses:** Content data structure, navigation state machine (skeleton), LEGO design tokens (CSS custom properties registered)
**Avoids:** AnimatePresence route conflict (state-driven nav established from day one), hydration errors (`'use client'` boundaries set), static export breakage (`output: 'export'` + `images: { unoptimized: true }` configured)

### Phase 2: Navigation and Slide System

**Rationale:** The keyboard controller, slide overlay, and sub-slide state machine are tightly coupled. Building them together avoids the pitfall of accessibility being bolted on afterward — focus management and ARIA live regions must be part of the initial slide transition implementation, not a retrofit.
**Delivers:** Full keyboard navigation (arrows, space, escape); `SlideOverlay` with `AnimatePresence` zoom transition; `SlideContent` rendering all 14 topics; sub-slide progress; focus trap in overlay; ARIA live regions; visited city state; fullscreen mode
**Uses:** Motion 12 `AnimatePresence`, `focus-trap-react`, `@radix-ui/react-visually-hidden`, Zustand or `useReducer` (confirm which during phase)
**Implements:** `SlideOverlay`, `SlideContent`, `SubSlideProgress`, `KeyboardController` (full wiring)
**Avoids:** Accessibility retrofit cost (WCAG requirements built in, not added); keyboard listener accumulation (centralized controller, cleanup function, `preventDefault` on navigation keys)

### Phase 3: Map and Car Animation

**Rationale:** Map animation depends on Phase 1 (data with `mapPosition` coordinates) and Phase 2 (state machine that drives `carPosition`). SVG animation correctness must be established in a spike before all 14 city nodes are built — changing animation approach across 14 nodes is expensive.
**Delivers:** Inline SVG LEGO map with 14 city nodes at correct positions; animated car traveling between cities via CSS motion path; city zoom-in and return-to-map animations; visited city visual state (CSS-driven from Phase 2 state)
**Uses:** Motion 12 `offsetPath`/`offsetDistance`, `motion.g` with transform props (not `cx`/`cy`)
**Implements:** `MapView`, `CarAnimator`, `CityNode`
**Avoids:** SVG animation frame drops (correct compositor-thread patterns from first spike); inline variant object re-triggers (variants defined at module scope); car animation interrupted by parent re-renders (`React.memo` on car component)

### Phase 4: Content and Polish

**Rationale:** Content authoring is the highest-effort table-stakes item but can proceed in parallel with Phase 3 once the data structure and slide rendering are stable from Phase 2. This phase finalizes LEGO visual design from Figma tokens, refines all 14 topic slides, and completes the "looks done but isn't" checklist from PITFALLS.md.
**Delivers:** All 14 topics fully authored and visually polished; LEGO design tokens applied throughout; progress indicator; responsive layout validated across projector resolutions; full "looks done but isn't" checklist verified
**Addresses:** LEGO visual design tokens, progress indicator, responsive viewport handling, no FOUC

### Phase Ordering Rationale

- Architecture-before-features: the three Phase 1 pitfalls (exit animation conflict, hydration errors, static export config) are cheap to prevent and expensive to fix once features are built on top of wrong assumptions
- Accessibility-in-Phase-2: PITFALLS.md explicitly flags accessibility retrofit as HIGH recovery cost; building focus management and ARIA alongside the first slide transition avoids this
- Map animation last: the car animation depends on both the data (Phase 1) and the state machine (Phase 2); the SVG performance pitfall is best caught early in Phase 3 via a single-city spike before all 14 nodes are built
- Content authoring spans phases: the data structure is created in Phase 1, but full content authoring and polish belongs in Phase 4 after the rendering pipeline is stable

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 3 (Map Animation):** CSS motion path (`offsetPath`/`offsetDistance`) in Motion 12 has sparse examples in App Router context; spike with a single city-to-city path is recommended before committing to the full 14-node implementation
- **Phase 2 (Slide Overlay):** The `AnimatePresence` overlay-in-layout pattern avoids the known App Router conflict, but should be validated in an early proof of concept before all content is wired in

Phases with standard patterns (skip research):
- **Phase 1 (Foundation):** Next.js static export config, `'use client'` boundaries, and Zustand store setup are well-documented with official examples
- **Phase 4 (Content/Polish):** Content authoring in TypeScript data files and Tailwind design token application follow established patterns

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All core packages verified against official docs; version compatibility confirmed; Motion 12/Next.js 16 pairing explicitly supported |
| Features | HIGH | Feature list derived from clear product requirements; dependency tree is explicit; anti-features are well-argued |
| Architecture | HIGH (routing), MEDIUM (animation) | Client-state overlay pattern verified against official Next.js parallel route docs; AnimatePresence overlay-in-layout avoids known App Router conflict but needs early validation |
| Pitfalls | HIGH | All critical pitfalls verified against official GitHub issues and docs; recovery costs accurately assessed |

**Overall confidence:** HIGH

### Gaps to Address

- **SVG map path data:** The actual SVG path `d` attribute strings for car travel routes between cities are not defined in research. These must be designed as part of the map SVG creation in Phase 3 — coordinate data is typed but the route geometry is not yet defined.
- **AnimatePresence overlay-in-layout validation:** Research flags this as MEDIUM confidence. Validate with a minimal proof of concept in Phase 1 or early Phase 2 before building all 14 slides on top of it.
- **LEGO design tokens:** Research references Figma tokens but the actual token values (LEGO yellow, red, black, white; typeface choices) are not resolved. These need to come from the Figma Make design or a design decision in Phase 4.
- **Sub-slide count per topic:** Research notes topics have 1–4 sub-slides, but the exact breakdown from `proposal-content.md` needs to be confirmed when authoring the data structure in Phase 1.

## Sources

### Primary (HIGH confidence)

- [nextjs.org/blog/next-16](https://nextjs.org/blog/next-16) — Next.js 16 stable release notes; Turbopack default, React 19.2, breaking changes
- [nextjs.org/docs/app/guides/static-exports](https://nextjs.org/docs/app/guides/static-exports) — static export constraints
- [motion.dev/docs/react](https://motion.dev/docs/react) — Motion 12 for React (formerly Framer Motion) current documentation
- [motion.dev/docs/react-accessibility](https://motion.dev/docs/react-accessibility) — `MotionConfig reducedMotion` API
- [motion.dev/tutorials/react-motion-path](https://motion.dev/tutorials/react-motion-path) — `offsetPath`/`offsetDistance` animation along SVG paths
- [tailwindcss.com/blog/tailwindcss-v4](https://tailwindcss.com/blog/tailwindcss-v4) — Tailwind v4 CSS-first config
- [nextjs.org/docs/app/api-reference/file-conventions/parallel-routes](https://nextjs.org/docs/app/api-reference/file-conventions/parallel-routes) — parallel routes verified; confirms client-state overlay is simpler for this use case
- [reveal.js](https://revealjs.com/) — feature reference for table stakes
- [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) — motion accessibility

### Secondary (MEDIUM confidence)

- [github.com/vercel/next.js/issues/49279](https://github.com/vercel/next.js/issues/49279) — AnimatePresence exit animations broken in App Router (confirmed active issue)
- [github.com/vercel/next.js/discussions/42658](https://github.com/vercel/next.js/discussions/42658) — AnimatePresence route transition discussion; FrozenRouter workaround documented
- [imcorfitz.com — Solving Framer Motion Page Transitions](https://www.imcorfitz.com/posts/adding-framer-motion-page-transitions-to-next-js-app-router) — FrozenRouter workaround; uses internal APIs; not recommended for this project
- npm registry — zustand v5, focus-trap-react v10 current patterns

### Tertiary (LOW confidence)

- Community articles on Next.js hydration errors and `'use client'` patterns — consistent with official docs but community-sourced

---
*Research completed: 2026-03-11*
*Ready for roadmap: yes*
