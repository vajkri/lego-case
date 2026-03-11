# Pitfalls Research

**Domain:** Interactive Next.js presentation app — animated map + slide viewer (LEGO Migration Proposal)
**Researched:** 2026-03-11
**Confidence:** HIGH (critical pitfalls verified against official docs and active GitHub issues)

---

## Critical Pitfalls

### Pitfall 1: AnimatePresence Exit Animations Silently Fail in Next.js App Router

**What goes wrong:**
Exit animations (the `exit` prop on `motion.*` components) never play. Components unmount instantly, making slide-out transitions and map-to-slide takeover exit sequences look like hard cuts instead of smooth animations.

**Why it happens:**
Next.js App Router updates its internal context frequently during navigation, causing components wrapped in `AnimatePresence` to unmount before the exit animation has a chance to run. Entry animations (`initial`/`animate`) work fine because they run on mount — the problem is specific to the unmount phase. This is a known conflict between App Router's routing lifecycle and `AnimatePresence`'s "delay unmount until animation completes" mechanism. It affects Next.js 13, 14, and 15.

**How to avoid:**
This project does NOT use Next.js routing for slide navigation — slide state is managed in React state (not URL-driven route changes). This sidesteps the App Router/`AnimatePresence` conflict entirely. The pattern to use:

```tsx
// CORRECT: state-driven AnimatePresence (no router transitions involved)
<AnimatePresence mode="wait">
  {activeSlide && (
    <motion.div
      key={activeSlide.id}          // unique key per slide is required
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    />
  )}
</AnimatePresence>
```

If URL-based navigation is ever added, do NOT rely on `AnimatePresence` for exit animations across route boundaries without a `FrozenRouter` wrapper.

**Warning signs:**
- `exit` animations that appear to work in dev but not after `next build`
- Slides that disappear instantly on close instead of animating out
- Console warning about components unmounting faster than expected

**Phase to address:** Phase 1 (Foundation/Architecture) — establish the state-machine navigation model before any animation work begins.

---

### Pitfall 2: Missing `'use client'` Causes Hydration Errors on Framer Motion Components

**What goes wrong:**
A runtime hydration error: "Hydration failed because the initial UI does not match what was rendered on the server." The app may partially render then crash, or show a blank white screen.

**Why it happens:**
Framer Motion's `motion.*` components depend on browser-only APIs (`window`, `matchMedia`, DOM measurements). When a component using Framer Motion is not marked `'use client'`, Next.js App Router attempts to server-render it. The server-rendered HTML and the client hydration output differ, triggering React's hydration mismatch error. This is one of the most common sources of confusion when moving to App Router from Pages Router.

**How to avoid:**
Every component that uses `motion.*`, `AnimatePresence`, `useAnimation`, `useMotionValue`, or `useReducedMotion` must have `'use client'` at the top of the file. Create a wrapper component pattern:

```tsx
// components/features/map/MapCanvas.tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'
// ...
```

Do NOT add `'use client'` to every file — push it as deep as possible in the component tree to keep Server Components at the page/layout level where possible.

**Warning signs:**
- "Error: Hydration failed" in the browser console
- Animation components that render correctly in `next dev` but crash after `next build`
- TypeScript not catching the issue (this is a runtime error, not a compile error)

**Phase to address:** Phase 1 (Foundation) — establish the Server/Client component boundary architecture in the initial scaffold.

---

### Pitfall 3: Global Keyboard Listeners Accumulate and Conflict

**What goes wrong:**
Multiple `keydown` listeners attach on each render, causing the same keypress to fire the navigation handler 2, 4, or 8 times. Alternatively, arrow keys scroll the browser window at the same time as advancing the presentation, creating a jarring experience.

**Why it happens:**
Two separate failure modes:

1. **Listener accumulation**: `window.addEventListener('keydown', handler)` called inside `useEffect` without a cleanup return function. On each re-render a new listener is added; on rapid state changes (slide transitions) the handler fires for every accumulated listener.

2. **Browser default conflicts**: Arrow keys and spacebar have browser-native behavior (scroll page, scroll within overflow containers). A presentation that uses these keys must call `event.preventDefault()` on the relevant keys.

**How to avoid:**
```tsx
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (['ArrowRight', 'ArrowLeft', ' '].includes(e.key)) {
      e.preventDefault()   // prevent browser scroll
    }
    // dispatch to navigation state machine
    dispatch({ type: 'KEY_PRESS', key: e.key })
  }

  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)   // critical
}, [dispatch])    // stable dispatch reference prevents listener churn
```

Use a stable callback reference (via `useCallback` or by passing a dispatch from `useReducer`) to keep the dependency array stable. Never put inline functions directly in `addEventListener` calls inside effects with empty dependency arrays — the reference won't match on cleanup.

**Warning signs:**
- Keyboard navigation advancing 2 or more slides per keypress
- Page scrolling visibly while slides advance
- Memory usage climbing over a long presentation session

**Phase to address:** Phase 2 (Navigation/Interaction) — implement keyboard handling correctly from the first pass, not as a retrofit.

---

### Pitfall 4: Accessibility Fails the Moment Animations Become Visually Central

**What goes wrong:**
The app looks impressive and passes a quick manual review but fails real accessibility audits because: (a) screen readers announce nothing as slides change; (b) users with vestibular disorders get motion-sick from the zoom animations; (c) focus management after slide transitions leaves keyboard users lost, with focus sitting on a now-hidden element.

**Why it happens:**
Three distinct issues that each require active effort:

1. **No ARIA live region**: When a slide takeover animates in, there is no DOM signal for screen readers. The visual transition is not perceived by AT.
2. **No `prefers-reduced-motion` support**: Framer Motion animations run regardless of the OS accessibility preference unless explicitly handled.
3. **Focus not moved after transition**: When a full-screen slide opens, focus remains on the map control that triggered it. The user must Tab extensively to reach slide content.

**How to avoid:**

For `prefers-reduced-motion`, use `MotionConfig` at the root level — this is the simplest global approach:
```tsx
// app/layout.tsx (or root 'use client' wrapper)
import { MotionConfig } from 'framer-motion'

<MotionConfig reducedMotion="user">
  {children}
</MotionConfig>
```
`reducedMotion="user"` automatically disables transform/layout animations when the OS setting is on, while preserving opacity and color transitions.

For focus management, use `autoFocus` on the first focusable element in each slide, or a `useEffect` that calls `.focus()` on a ref after the slide mounts:
```tsx
const headingRef = useRef<HTMLHeadingElement>(null)
useEffect(() => {
  headingRef.current?.focus()
}, []) // runs after mount, after AnimatePresence completes entry
```

For screen reader announcements, add a visually-hidden `role="status"` live region that updates with the current slide title:
```tsx
<div role="status" aria-live="polite" className="sr-only">
  {currentSlide.title}
</div>
```

**Warning signs:**
- Running VoiceOver/NVDA and hearing nothing announce when slides change
- Testing with `prefers-reduced-motion: reduce` in Chrome DevTools and seeing the full zoom animation still play
- Pressing Tab after a slide opens and having focus stuck outside the slide panel

**Phase to address:** Phase 2 (Navigation/Interaction) — accessibility cannot be bolted on at the end. Focus management and ARIA live regions must be part of the initial slide transition implementation.

---

### Pitfall 5: Animating SVG Layout Properties Causes Jank and Drops Frames

**What goes wrong:**
The animated LEGO car travel sequence stutters, particularly on mid-range hardware. Animations that should be 60fps visibly drop frames as the car moves along the path.

**Why it happens:**
Animating properties that trigger layout recalculation (e.g. `cx`/`cy` directly on SVG circles, absolute `x`/`y` coordinates, `width`/`height`) forces the browser to run layout and paint on every frame. This takes the animation off the compositor thread, causing frame drops.

Additionally, if the SVG map component re-renders (due to state updates in a parent) during the car animation, React's reconciliation interrupts the animation mid-flight.

**How to avoid:**
- Animate `transform` properties exclusively: use `x`, `y`, `rotate`, `scale` props on `motion.g` or `motion.circle` elements — these map to CSS transforms that run on the GPU compositor thread.
- Isolate the animated car component so parent state changes (slide open/close) do not cause it to re-render mid-animation. Use `React.memo` on the car component.
- Do NOT use Framer Motion's `layout` prop on SVG elements — SVG does not have a layout system and `layout` animations are unsupported on SVG.
- For the car path interpolation, use `motion.path` `pathLength` or `offsetDistance` (CSS motion path) rather than animating raw coordinate attributes.

```tsx
// GOOD: compositor-thread transform animation
<motion.g animate={{ x: targetX, y: targetY }} transition={{ duration: 1.2, ease: 'easeInOut' }}>
  <CarIcon />
</motion.g>

// BAD: triggers layout on every frame
<motion.circle animate={{ cx: targetX, cy: targetY }} />
```

**Warning signs:**
- Animation looks smooth in Chrome DevTools with CPU throttling off, but stutters on a real laptop
- Performance tab shows long paint tasks during car movement
- `layout` prop on SVG elements silently does nothing (no error, just missing animation)

**Phase to address:** Phase 3 (Map Animation) — establish correct SVG animation patterns in the first spike before building all 14 city nodes.

---

### Pitfall 6: Next.js Static Export (`output: 'export'`) Breaks Several Expected Features

**What goes wrong:**
The app builds fine in `next dev` but `next build` either errors or produces an export where features silently do not work. This is a silent failure — the build succeeds but the deployed site is broken.

**Why it happens:**
The project is fully static (no backend, no server). Using `output: 'export'` in `next.config.js` is the correct approach. However, several features that work in dev are unsupported in static export:

- `next/image` default loader: requires a server-side optimization endpoint. In static export, the default loader throws a build error. Must use `unoptimized: true` or a custom loader.
- Server Actions: not supported. (This project has no server actions, so not a risk.)
- `cookies()`, `headers()`: not supported. (Not applicable here.)
- Dynamic routes without `generateStaticParams()`: build will error.
- `useParams()` on client components: does not work with static export.

**How to avoid:**
Configure `next.config.js` correctly from the start:
```js
// next.config.js
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,   // required for static export with no CDN image service
  },
}
```

Since this is a single-page presentation (not a multi-route app), the routing surface is minimal — but any future decision to put slides at `/slide/[id]` URLs requires `generateStaticParams()` to pre-generate all paths at build time.

**Warning signs:**
- `next build` error mentioning image optimization or dynamic routes
- Images loading in `next dev` but 404ing in the static export
- `next build` succeeds but the `out/` folder is missing expected files

**Phase to address:** Phase 1 (Foundation) — add `output: 'export'` to `next.config.js` in the initial scaffold and confirm a successful static build before any feature work.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| `suppressHydrationWarning` on motion components | Silences hydration console errors fast | Masks real hydration bugs; hides genuine SSR/client mismatches | Never — fix the root `'use client'` boundary instead |
| Inline animation variants (objects defined inside render) | Faster to write | Variants are recreated every render, causing subtle animation re-triggers; bloats JSX | Never for shared/reused variants; acceptable for truly one-off animations |
| Attaching keyboard listeners in multiple components | Each feature "owns" its keys | Multiple listeners conflict; difficult to reason about key ownership | Never — centralize in a single keyboard controller |
| Skipping `prefers-reduced-motion` until the end | Ship animations faster | Accessibility retrofit is expensive; motion-sensitive users get a broken experience from day one | Never — `MotionConfig reducedMotion="user"` is a single line at the root |
| `react.memo` on everything | Prevents all SVG re-renders | Obscures bugs; memoization overhead can exceed render cost for cheap components | Only on components that provably re-render during animations |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Framer Motion + App Router | Wrapping entire layout in `AnimatePresence` expecting page exit animations to work | Use state-driven `AnimatePresence` for in-page transitions; avoid relying on it for route-level exit animations |
| Framer Motion + SSR | Using `motion.*` in Server Components or in files without `'use client'` | All Framer Motion usage must be inside `'use client'` components |
| `next/image` + static export | Using `<Image>` without configuring a custom loader or `unoptimized: true` | Add `images: { unoptimized: true }` to `next.config.js` when using `output: 'export'` |
| SVG + Framer Motion layout animations | Using `layout` prop on SVG elements expecting FLIP animations | Never use `layout` on SVG; animate positional transforms via `x`/`y` directly |
| Keyboard events + browser defaults | Arrow keys and spacebar scroll the page while also advancing slides | Call `e.preventDefault()` for navigation keys in the `keydown` handler |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Animating SVG `cx`/`cy` or absolute coordinates | Visible frame drops on mid-range hardware; Chrome Performance panel shows long paint tasks | Use `motion.g` with `x`/`y` transform props instead | From the first animation; no scale threshold |
| Multiple `keydown` listeners accumulating | Each keypress fires navigation N times (where N = number of re-renders since mount) | Return cleanup function from `useEffect`; use stable handler reference | Immediately visible on first state change if cleanup is missing |
| Variant objects defined inline in render | Animations re-trigger unexpectedly on parent re-renders | Define variants outside component or with `useMemo` | With any parent state changes, which in this app happen on every keypress |
| Parent component re-rendering during car animation | Car animation stutters or resets mid-travel | `React.memo` on the car component; separate animation state from slide state | Any time slide state changes while car is in motion |
| `AnimatePresence` without unique `key` props | Exit animations never play; components appear to teleport | Always set a unique `key` per conditional child of `AnimatePresence` | From the start; no scale threshold |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| No visual indication of current position in the presentation | Audience loses track of where they are in the 14-topic flow | Show a progress indicator or highlight the current city on the map even during slide view |
| Zoom-in animation that cannot be interrupted | If presenter accidentally hits advance, they must wait for the full animation to complete before correcting | Make animations interruptible — Framer Motion handles this natively when `animate` prop changes mid-animation |
| Focus lands outside the slide after zoom-in | Keyboard user must Tab many times to reach slide content | Move focus to slide heading immediately after entry animation completes |
| No escape route from slide back to map | Keyboard user gets trapped inside a slide | Ensure Escape key always returns to map view; test this explicitly |
| Reduced-motion users see the full-screen zoom with no fallback | Users with vestibular disorders get motion sick; degrades accessibility credibility (counter to the project's goal of demonstrating accessibility) | `MotionConfig reducedMotion="user"` at root; fade instead of scale for reduced-motion users |

---

## "Looks Done But Isn't" Checklist

- [ ] **Keyboard navigation:** Works in `next dev` — verify it also works after `next build && npx serve out` (static export can change event handling subtly)
- [ ] **Exit animations:** Slides animate out, not just in — test by closing a slide and confirming the exit animation plays
- [ ] **Reduced motion:** Open Chrome DevTools > Rendering > "Emulate CSS media feature prefers-reduced-motion: reduce" — the zoom animations should be replaced by fades
- [ ] **Screen reader:** Tab through the entire presentation with VoiceOver (macOS) — every slide change should be announced
- [ ] **Focus management:** Open a slide, then confirm Tab lands inside the slide content (not on a hidden map element behind the overlay)
- [ ] **Escape key:** Close a slide with Escape — confirm focus returns to the map/trigger element (not lost entirely)
- [ ] **Static build:** `next build` completes with zero errors and the `out/` folder contains all expected assets
- [ ] **Keyboard conflicts:** Arrow keys and spacebar do NOT scroll the page while navigating slides

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Exit animations broken due to App Router conflict | LOW (in this app — state-driven nav avoids the issue) | Confirm slide state is managed in React state, not URL routing; if URL routing was added, wrap with FrozenRouter |
| Hydration errors from missing `'use client'` | LOW | Add `'use client'` to the component file containing `motion.*`; trace the error to the exact component in the stack trace |
| Keyboard listener accumulation | LOW | Add `return () => window.removeEventListener(...)` to all `useEffect` keyboard registrations |
| Static export image failures | LOW | Add `images: { unoptimized: true }` to `next.config.js` |
| SVG animation performance | MEDIUM | Profile with Chrome DevTools Performance tab; switch animating properties from absolute coordinates to transform-based `x`/`y` props |
| Accessibility retrofit (focus, ARIA, reduced motion) | HIGH if deferred to end | Build in from Phase 2; retroactively adding focus management to complex animated components is expensive |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| AnimatePresence exit animations broken | Phase 1 (Foundation) — use state-driven nav, never route-driven | Close a slide and confirm exit animation plays |
| Missing `'use client'` hydration errors | Phase 1 (Foundation) — establish Server/Client component boundaries | `next build` produces no hydration warnings; `next start` shows no console errors |
| Static export configuration | Phase 1 (Foundation) — add `output: 'export'` to config | `next build` succeeds; `out/` folder served with `npx serve out` works fully |
| Global keyboard listener accumulation | Phase 2 (Navigation) — centralized keyboard controller from day one | DevTools Memory tab shows no listener growth after repeated slide transitions |
| Accessibility (focus, ARIA, reduced motion) | Phase 2 (Navigation) — implement alongside transition logic | VoiceOver announces slide changes; Escape returns focus; reduced-motion setting removes zoom |
| SVG animation layout thrashing | Phase 3 (Map Animation) — correct transform patterns from first spike | Chrome Performance tab shows no paint tasks during car travel |
| Inline variant objects causing re-triggers | Phase 3 (Map Animation) — define variants at module scope | Animations do not re-trigger on parent re-renders |
| `next/image` static export failure | Phase 1 (Foundation) | `next build` completes without image optimization errors |

---

## Sources

- [Next.js Static Exports — Official Docs](https://nextjs.org/docs/app/guides/static-exports) (verified 2026-02-27)
- [AnimatePresence exit animations broken in Next.js 14 App Router](https://github.com/vercel/next.js/discussions/42658)
- [App router issue with Framer Motion shared layout animations — vercel/next.js #49279](https://github.com/vercel/next.js/issues/49279)
- [Framer Motion compatibility in Next.js 14: 'use client' workaround](https://medium.com/@dolce-emmy/resolving-framer-motion-compatibility-in-next-js-14-the-use-client-workaround-1ec82e5a0c75)
- [Solving Framer Motion Page Transitions in Next.js App Router](https://www.imcorfitz.com/posts/adding-framer-motion-page-transitions-to-next-js-app-router)
- [Next.js Hydration Errors: Real Causes and Prevention](https://medium.com/@blogs-world/next-js-hydration-errors-in-2026-the-real-causes-fixes-and-prevention-checklist-4a8304d53702)
- [Motion for React — Accessibility Guide](https://motion.dev/docs/react-accessibility)
- [useReducedMotion hook — motion.dev](https://motion.dev/docs/react-use-reduced-motion)
- [Design accessible animation and movement — Pope Tech](https://blog.pope.tech/2025/12/08/design-accessible-animation-and-movement/)
- [Master React SVG Integration, Animation and Optimization — Strapi](https://strapi.io/blog/mastering-react-svg-integration-animation-optimization)
- [SVG layout animations unsupported note — Framer Motion docs](https://www.framer.com/motion/layout-animations/)
- [How to add keyboard shortcuts to React app — Devtrium](https://devtrium.com/posts/how-keyboard-shortcut)
- [prefers-reduced-motion — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)
- [Common mistakes with the Next.js App Router — Vercel Blog](https://vercel.com/blog/common-mistakes-with-the-next-js-app-router-and-how-to-fix-them)

---
*Pitfalls research for: Interactive Next.js presentation app — LEGO Migration Proposal*
*Researched: 2026-03-11*
