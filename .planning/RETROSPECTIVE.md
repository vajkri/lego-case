# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v1.0 — Interactive Presentation

**Shipped:** 2026-03-15
**Phases:** 8 | **Plans:** 25 | **Commits:** 201

### What Was Built
- Next.js static export with typed data layer, keyboard navigation, and WCAG AA accessibility
- SVG world map with animated LEGO car (CSS motion path, 60fps), brick-stack stop markers, ambient SMIL animations
- LEGO design system: Tailwind v4 tokens, 6 content block components, variant system, depth shadows
- Minifig head progress track with facial expressions and semantic-colored connectors
- 18 slides across 5 stops with rich content blocks; production build clean

### What Worked
- Decimal phase insertion (3.1, 3.2, 3.3, 3.4) allowed design system and visual polish work to slot in without disrupting the original roadmap
- Content block component library (Phase 3.1) paid off immediately in Phase 4: authoring 18 slides was fast because all 6 block types were ready
- Typed data files caught content errors at compile time; no runtime surprises in the final walkthrough
- CSS motion path for car animation: zero JS animation overhead, GPU composited, smooth on any laptop
- SVG SMIL for ambient animations: native units, no viewBox scaling bugs, trivially respects prefers-reduced-motion

### What Was Inefficient
- Phase 03.4 (map visual redesign) was completed iteratively outside the formal plan/execute workflow, making tracking inconsistent
- Some summary files lack one-liner fields, making automated milestone stats extraction incomplete
- Performance metrics table in STATE.md accumulated inconsistent formats across phases (minutes vs task counts vs file counts)

### Patterns Established
- variantStyleMap pattern: inline styles for rgba-based tokens that Tailwind v4 cannot represent
- Brick depth via box-shadow (content blocks) vs border-bottom (buttons): two techniques for two contexts
- Color hierarchy: red = current, yellow = action, green = visited, grey = inactive
- Server Component layout with isolated client subtrees (PresentationProvider, KeyboardController, OverlayPresence)

### Key Lessons
1. Tailwind v4 silently drops rgba values from @theme. Always put rgba-based tokens in :root, not @theme.
2. Decimal phase insertion is powerful for discovered work, but each inserted phase should still go through formal planning to keep tracking clean.
3. A design system phase before content authoring dramatically reduces per-slide effort. Invest in component library early.
4. SVG SMIL is underrated for ambient animations: zero JS, native user units, built-in reduced-motion support via media query.

### Cost Observations
- Model mix: balanced profile (Opus for planning, Sonnet for execution)
- Timeline: 5 days from project init to shipped milestone
- Notable: Phases 1-3 (core architecture) took 3 days; Phases 3.1-4 (design + content) took 2 days

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Commits | Phases | Key Change |
|-----------|---------|--------|------------|
| v1.0 | 201 | 8 | Initial project; established decimal phase insertion pattern |

### Top Lessons (Verified Across Milestones)

1. Invest in a component library phase before content authoring phases
2. Keep rgba-based design tokens out of Tailwind v4 @theme
