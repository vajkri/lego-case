# LEGO Migration Proposal — Interactive Presentation

## What This Is

An interactive Next.js web application that presents a proposal for migrating kids.lego.com from AngularJS to React + Next.js. Built as a LEGO-themed world map where a red LEGO car travels between 5 stop nodes, each revealing a full-screen animated slide overlay with rich content blocks. The audience is a mixed technical and stakeholder group at LEGO.

## Core Value

A compelling, accessible, story-driven presentation that makes the migration case so clearly, for both engineers and business stakeholders, that the path forward feels obvious.

## Requirements

### Validated

- ✓ SVG world map with 5 stop nodes as focusable brick-stack markers — v1.0
- ✓ Animated red LEGO car traveling between stops via CSS motion path (60fps) — v1.0
- ✓ Keyboard navigation: ArrowRight/Space advance, ArrowLeft back, Escape close — v1.0
- ✓ Full-screen animated slide overlay with AnimatePresence zoom takeover — v1.0
- ✓ Multi-slide support per stop with sub-slide stepping — v1.0
- ✓ WCAG AA accessibility: focus trap, ARIA live region, focus return, visible focus indicators — v1.0
- ✓ 18 slides across 5 stops authored with 6 content block types — v1.0
- ✓ LEGO design system: Tailwind v4 tokens, Baloo 2 + DM Sans fonts, depth shadows, variant system — v1.0
- ✓ Brick-stack stop markers (1-5 bricks) with 5 visual states and CSS animations — v1.0
- ✓ Minifig head progress track with expressions, semantic connectors, sub-slide dots — v1.0
- ✓ Full-bleed sky/grass backgrounds with ambient SMIL animations — v1.0
- ✓ Production build clean: zero errors, zero warnings, interactive in under 3 seconds — v1.0

### Active

- [ ] Each slide's copy is reviewed and refined for clarity, structure, and persuasive impact
- [ ] Content blocks are chosen optimally per slide (right block type for the message)
- [ ] Visual hierarchy within each slide guides the reader's eye effectively
- [ ] Consistent tone and pacing across all 5 stops
- [ ] No filler, redundancy, or vague language remains in any slide

### Out of Scope

- Backend / API — fully static presentation app
- CMS integration — content authored in TypeScript data files
- Mobile-optimized layout — desktop presentation context
- Authentication — no login required
- Real-time collaboration — single presenter use
- PDF / print export — CSS print breaks with animated map layout

## Context

- Shipped v1.0 with 4,576 LOC TypeScript across 188 files
- Tech stack: Next.js 16 (App Router, static export), Tailwind v4, Motion 12, Zustand
- 5 stops consolidate the original 14 topics into a tighter narrative arc
- The "meta" angle (presenting React+Next.js in React+Next.js) is a deliberate persuasion technique
- Design system established with variant system (default/red/yellow) and depth shadows

## Constraints

- **Stack**: Next.js (latest LTS), React, App Router — no Pages Router
- **Accessibility**: WCAG AA compliance and keyboard navigation demonstrated
- **Animation**: Motion 12 for map travel and slide transitions; SMIL for ambient map animations
- **Content source**: All slide content from TypeScript data files; no invented content
- **No backend**: Fully static / client-side via `output: 'export'`

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js App Router with static export | Demonstrates the exact recommendation; no server required | ✓ Good |
| LEGO map + car metaphor | Playful, memorable, on-brand; differentiates from standard slide deck | ✓ Good |
| Keyboard-first navigation | Demonstrates accessibility credibility to LEGO | ✓ Good |
| Content in TypeScript data files | Typed, co-located, no external CMS dependency for a demo | ✓ Good |
| Motion 12 for animations | Best-in-class React animation library; supports prefers-reduced-motion | ✓ Good |
| Tailwind v4 CSS-first config | No tailwind.config.js; tokens in globals.css @theme block | ✓ Good |
| rgba values in :root not @theme | Tailwind v4 silently drops rgba from @theme; workaround via CSS vars | ✓ Good |
| State-driven navigation (not routes) | URL stays at /; simpler than route-based slide navigation | ✓ Good |
| ContentBlock discriminated union | 6-member union with switch dispatcher; keeps data files JSX-free | ✓ Good |
| SVG SMIL for ambient animations | Native SVG units avoid viewBox scaling mismatch; no JS overhead | ✓ Good |
| 5 stops (consolidated from 14 topics) | Tighter narrative arc; each stop has 2-5 rich slides instead of 1 thin slide | ✓ Good |

## Current Milestone: v1.1 Polished Content

**Goal:** Review and refine every slide's copy and visual presentation for clarity, structure, and persuasive communication.

**Target:**
- Thorough copy edit of all 18 slides across 5 stops
- Optimal content block selection per slide
- Visual hierarchy and layout improvements
- Consistent tone and pacing throughout

---
*Last updated: 2026-03-15 after v1.1 milestone start*
