# LEGO Migration Proposal — Project Overview

## Purpose
An interactive Next.js web application that presents a proposal for migrating kids.lego.com from AngularJS to React + Next.js. It uses a LEGO-themed world map metaphor where a red LEGO car travels between "cities" (topic nodes). When the car arrives at a topic, a full-screen animated overlay reveals slide content.

The presentation IS the proposal — building it in React + Next.js demonstrates the recommendation by example.

## Target Audience
Mixed technical and stakeholder group at LEGO.

## Tech Stack
- **Framework**: Next.js (latest, App Router) with static export (`output: 'export'`)
- **UI**: React 19, Tailwind CSS v4 (PostCSS plugin)
- **Animation**: Motion (Framer Motion v12+)
- **State**: Zustand
- **Focus management**: focus-trap-react
- **Testing**: Vitest + Testing Library (jsdom)
- **Linting**: ESLint via eslint-config-next (no separate config file)
- **Language**: TypeScript (strict mode)
- **Path alias**: `@/*` → `./src/*`

## Key Constraints
- Fully static / client-side — no backend
- Accessibility: WCAG AA, keyboard-first navigation
- All content sourced from TypeScript data files in `src/data/topics/`
- Desktop-first (presentation context)
