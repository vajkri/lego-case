# Stack Research

**Domain:** Interactive presentation web app (custom slideshow with animated SVG map)
**Researched:** 2026-03-11
**Confidence:** HIGH — verified against official Next.js docs, motion.dev docs, and npm registry

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Next.js | 16.x (latest) | App framework | Current stable release (Oct 2025); Turbopack is default bundler; App Router is the only supported routing model going forward; static export (`output: 'export'`) is first-class — perfect for a fully static presentation with no server needs |
| React | 19.2 (bundled with Next 16) | UI rendering | Next.js 16 ships with React 19.2; React Compiler (stable in Next 16) auto-memoizes — no manual `useMemo`/`useCallback` needed for animation-heavy components |
| TypeScript | 5.x | Type safety | Required minimum for Next.js 16; content typed as data files prevents slide content errors at compile time |
| Motion (`motion/react`) | 12.x | Animations | Formerly Framer Motion, rebranded late 2024; `npm install motion`; import from `motion/react`; built-in `MotionConfig reducedMotion="user"` for prefers-reduced-motion; offsetPath/offsetDistance for car-along-path animation; no breaking changes from framer-motion v10+ |
| Tailwind CSS | 4.x | Styling | CSS-first config (no `tailwind.config.ts` needed for basic use); single `@import "tailwindcss"` line; 5x faster builds; CSS custom properties map naturally to LEGO design tokens; compatible with Next.js 16 via `@tailwindcss/postcss` |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `motion` (replaces `framer-motion`) | 12.x | All animation — map travel, full-screen takeovers, slide transitions, path following | Always; use `<AnimatePresence>` for enter/exit, `<MotionConfig reducedMotion="user">` at root for accessibility |
| `zustand` | 5.x | Slide navigation state | When slide state needs to be accessed by multiple components (map + slide overlay); lighter than Context + useReducer for this shape of state; prevents prop drilling through map/car/overlay hierarchy |
| `focus-trap-react` | 10.x | Focus trap for full-screen slide takeovers | When slide overlay opens — keyboard focus must be confined to slide content until user exits (WCAG 2.1.2 requirement) |
| `@radix-ui/react-visually-hidden` | 1.x | Screen-reader-only text | For ARIA live region announcements during slide transitions without visual noise |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| Turbopack | Bundler (default in Next.js 16) | No configuration needed; do not add custom webpack config — it disables Turbopack |
| ESLint (flat config) | Linting | Next.js 16 defaults to ESLint flat config; `next lint` command is removed — run ESLint directly |
| TypeScript strict mode | Type checking | Enable `"strict": true` in `tsconfig.json`; slide content data files become fully type-safe |
| `@tailwindcss/postcss` | Tailwind v4 integration | Replace `postcss.config.js` content — Tailwind v4 PostCSS plugin handles everything |

## Installation

```bash
# Bootstrap (includes Next.js 16, React 19, TypeScript, Tailwind v4, ESLint)
npx create-next-app@latest lego-case --typescript --tailwind --eslint --app

# Animation
npm install motion

# Slide navigation state
npm install zustand

# Accessibility: focus trap for slide takeover overlays
npm install focus-trap-react

# Accessibility: visually hidden for screen reader announcements
npm install @radix-ui/react-visually-hidden
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| `motion` (motion/react) | `react-spring` | If you need physics-based spring animations and find Motion's spring easing insufficient; Motion's springs are good enough for a presentation context |
| `motion` (motion/react) | CSS transitions only | For simple hover states and color changes — but NOT for the SVG path following, AnimatePresence slide entry/exit, or coordinated sequences this app needs |
| `motion` (motion/react) | `GSAP` | GSAP is more powerful for complex timeline-driven sequences (e.g., staggered children, scroll-driven). Consider GSAP only if the car-travel sequence needs frame-precise choreography across 10+ simultaneous animated elements. For this app's complexity level, Motion is sufficient and has better React DX. |
| `zustand` | `useReducer` + Context | `useReducer` is fine for a single component hierarchy; use it if the slide state only flows top-down. Prefer zustand when map, car, and slide overlay are siblings deep in a tree — zustand avoids prop drilling without Context re-render storms |
| `zustand` | Jotai | Jotai is better for many small atoms; zustand's single store with slices is a better fit for a finite state machine (map → travel → arrive → slide → return) |
| SVG inline | `react-leaflet` / map library | Leaflet is for real geographic maps; this is a custom illustrated LEGO world map — inline SVG is the only approach that allows custom illustration, animation, and LEGO styling |
| Tailwind CSS v4 | CSS Modules | CSS Modules work fine; Tailwind v4 is recommended because LEGO design tokens map naturally to CSS custom properties, and Tailwind's responsive utilities handle the full-screen/panel layout without bespoke media query code |
| `focus-trap-react` | Manual focus management | Manual focus management (ref + `element.focus()`) is sufficient for simple cases but `focus-trap-react` handles edge cases: nested focusable elements, portals, and return-focus-on-close automatically — worth the dependency for WCAG compliance |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `framer-motion` (old package name) | The package still works but `motion` is the current package; `framer-motion` re-exports from `motion` in v11+, adding unnecessary indirection | `npm install motion` with `import { motion } from "motion/react"` |
| `react-spring` | API complexity (hooks only) makes coordinated multi-element sequences harder to read; no built-in `AnimatePresence` equivalent for mount/unmount | `motion` (`AnimatePresence` + `variants`) |
| `@react-three/fiber` / Canvas for map | WebGL/3D rendering is massive overkill for a 2D illustrated map; adds 500KB+ bundle and steep complexity for no visual benefit | Inline SVG with Motion path animations |
| Redux / Redux Toolkit | Drastically over-engineered for a single-presenter app with ~15 slides and finite state transitions | `zustand` (5KB) |
| `next/router` (Pages Router) | Project constraint specifies App Router only; Pages Router is deprecated trajectory in Next.js 16 | App Router (`app/` directory) |
| Server Actions | Static export disables server-side features; Server Actions require a Node.js server | Client-side state only — no server needed for a presentation |
| `react-use` | Large utility library for a presentation that needs 2-3 hooks; brings unnecessary bundle weight | Native React hooks (`useEffect`, `useCallback`, `useRef`) + zustand |
| Anime.js | No React-idiomatic API; imperative DOM manipulation fights React's reconciler during animated slide transitions | `motion` |

## Stack Patterns by Variant

**For the SVG map with car travel:**
- Render the map as an inline SVG component (`<svg>` in JSX)
- Encode city positions as coordinate data in a TypeScript data file
- Animate the car using Motion's `offsetPath` (CSS Motion Path) — set `offsetPath` to an SVG `<path>` `d` attribute string, animate `offsetDistance` from 0% to 100%
- Use `useMotionValue` + `useTransform` to derive car rotation from path tangent

**For full-screen slide takeovers:**
- Use `<AnimatePresence mode="wait">` wrapping the slide overlay
- Animate `scale` from ~0.1 + `opacity: 0` to `scale: 1` + `opacity: 1` (zoom-from-city-node effect)
- Wrap the overlay in `<FocusTrap active={isOpen}>` from `focus-trap-react`
- On open: `aria-live="polite"` region announces slide title to screen readers
- On close: return focus to the city node button that triggered the transition

**For keyboard navigation:**
- Global `useEffect` + `window.addEventListener('keydown', ...)` in a `useKeyboard` hook at the presentation root
- Arrow keys: advance/retreat between cities (when on map) or between sub-slides (when in slide overlay)
- `Escape` / `Backspace`: close slide overlay and return to map
- `Space`: same as right arrow (advance)
- Wrap each city node in a `<button>` for native keyboard focusability

**For prefers-reduced-motion compliance:**
- Wrap entire app in `<MotionConfig reducedMotion="user">` — Motion automatically disables transform/layout animations when system setting is enabled while preserving opacity transitions
- Do NOT rely on CSS-only media queries for motion — MotionConfig handles this for all Motion components globally

**For static deployment:**
- Set `output: 'export'` in `next.config.ts`
- Mark all interactive components with `'use client'` (map, keyboard handler, slide state)
- Static page shell can be a Server Component; the presentation `<PresentationApp>` is a client boundary
- Access `window`/`document` only inside `useEffect` — Next.js pre-renders client components to HTML at build time

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| `next@16.x` | `react@19.2`, `typescript@5.x` | Node.js 20.9+ required (Node 18 dropped in Next 16) |
| `motion@12.x` | `react@18+`, `react@19` | React 19 fully supported; no breaking changes from framer-motion v10+ |
| `tailwindcss@4.x` | `next@16.x` | Requires `@tailwindcss/postcss` instead of standalone PostCSS plugin; no `tailwind.config.ts` required but supported |
| `zustand@5.x` | `react@18+`, `react@19` | Zustand v5 dropped legacy context provider; use `create()` directly |
| `focus-trap-react@10.x` | `react@18+` | Works with React 19; check for React 19 peer dep warnings, add `--legacy-peer-deps` if needed |

## Sources

- [nextjs.org/blog/next-16](https://nextjs.org/blog/next-16) — Next.js 16 stable release notes (Oct 2025); Turbopack default, React 19.2, breaking changes — HIGH confidence
- [nextjs.org/docs/app/guides/static-exports](https://nextjs.org/docs/app/guides/static-exports) — Static export constraints (no Server Actions, no dynamic functions) — HIGH confidence
- [motion.dev/docs/react](https://motion.dev/docs/react) — Motion for React (formerly Framer Motion) current documentation — HIGH confidence
- [motion.dev/docs/react-accessibility](https://motion.dev/docs/react-accessibility) — `MotionConfig reducedMotion` API — HIGH confidence (referenced in official docs)
- [motion.dev/tutorials/react-motion-path](https://motion.dev/tutorials/react-motion-path) — offsetPath/offsetDistance animation along SVG paths — HIGH confidence
- [tailwindcss.com/blog/tailwindcss-v4](https://tailwindcss.com/blog/tailwindcss-v4) — Tailwind v4 release (Jan 2025), CSS-first config — HIGH confidence
- npm registry: `framer-motion@12.35.2` (latest, 2 days ago), `motion` package active — MEDIUM confidence (npm search results)
- WebSearch: zustand v5, focus-trap-react current patterns — MEDIUM confidence (community sources, cross-referenced with package readmes)

---
*Stack research for: LEGO interactive presentation app (Next.js App Router, animated SVG map, keyboard navigation, WCAG AA)*
*Researched: 2026-03-11*
