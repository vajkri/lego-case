# LEGO Migration Proposal — Interactive Presentation

## What This Is

An interactive Next.js web application that presents a proposal for migrating kids.lego.com from AngularJS to React + Next.js. The presentation uses a LEGO-themed world map metaphor where a red LEGO car travels between "cities" (topics). When the car arrives at a topic, a full-screen animated takeover reveals the slide content. The audience is a mixed technical and stakeholder group at LEGO.

## Core Value

A compelling, accessible, story-driven presentation that makes the migration case so clearly — for both engineers and business stakeholders — that the path forward feels obvious.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Map view with all 14 topic nodes displayed as named cities
- [ ] Animated red LEGO car that travels between city nodes on the map
- [ ] Keyboard navigation (arrow keys, spacebar) advances the car to next/previous city
- [ ] Full-screen animated zoom takeover when car arrives at a city — slides fill the screen
- [ ] Multi-slide support per topic: some cities have 1 slide, others have 3-4 (step through within city before map returns)
- [ ] Keyboard navigation within slide sets (arrow keys advance sub-slides, then returns to map)
- [ ] Accessibility-first: ARIA labels, keyboard-only navigable, screen-reader friendly
- [ ] Content for all 14 topics authored from `.planning/assets/proposal-content.md`
- [ ] Topics: Task (intro), Goals, Frontend Architecture, Team Structure, Component Architecture, Design System Strategy, Storybook, CI/CD Strategy, Testing Strategy, Analytics & Measurement, Migration Strategy, Migration Steps, Risk Mitigation, Summary
- [ ] LEGO-inspired visual style (colors, typography) — detailed design from Figma Make (TBD)
- [ ] Smooth, polished animations throughout (map travel, zoom in/out, slide transitions)
- [ ] Responsive layout (desktop-first; presentation context)

### Out of Scope

- Backend / API — fully static presentation app
- CMS integration — content is authored in code/data files
- Mobile-optimized layout — desktop presentation context
- Authentication — no login required
- Real-time collaboration — single presenter use

## Context

- The presentation IS the proposal: building it in React + Next.js demonstrates the recommendation by example
- Content is nearly 100% complete in `.planning/assets/proposal-content.md` (14 sections)
- Visual design is being created separately in Figma Make — will be shared when ready; implementation should be design-system-ready so tokens/styles can be swapped in
- Content accuracy and structure are higher priority than animation polish
- The "meta" angle (presenting React+Next.js in React+Next.js) is a deliberate persuasion technique for the technical audience

## Constraints

- **Stack**: Next.js (latest LTS), React, App Router — no Pages Router
- **Accessibility**: Must demonstrate WCAG AA compliance and keyboard navigation — presenter is signaling accessibility competence to LEGO
- **Animation**: Framer Motion preferred for map travel and slide transitions (smooth, controllable, accessible with `prefers-reduced-motion`)
- **Content source**: All slide content from `.planning/assets/proposal-content.md` — do not invent content
- **No backend**: Fully static / client-side

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js App Router | Demonstrates the exact recommendation; latest patterns | — Pending |
| LEGO map + car metaphor | Playful, memorable, on-brand — differentiates from a standard slide deck | — Pending |
| Keyboard-first navigation | Demonstrates accessibility credibility to LEGO | — Pending |
| Content in TypeScript data files | Typed, co-located, no external CMS dependency for a demo | — Pending |
| Framer Motion for animations | Best-in-class React animation library; supports `prefers-reduced-motion` | — Pending |

---
*Last updated: 2026-03-11 after initialization*
