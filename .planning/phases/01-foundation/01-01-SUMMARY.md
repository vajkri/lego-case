---
phase: 01-foundation
plan: "01"
subsystem: infra
tags: [next, react, tailwind, motion, zustand, vitest, typescript, postcss, static-export]

# Dependency graph
requires: []
provides:
  - Next.js 16 app with App Router and static export (output: 'export')
  - Tailwind v4 CSS-first setup via @tailwindcss/postcss and @import
  - Motion 12 and Zustand 5 installed and importable
  - Vitest 4 test harness with React Testing Library and jsdom
  - out/ build artifact with index.html
affects:
  - 01-02-types-test-scaffold
  - 01-03-data-files
  - 01-04-presentation-provider
  - 01-05-root-wiring

# Tech tracking
tech-stack:
  added:
    - next@16.1.6
    - react@19.2.4
    - react-dom@19.2.4
    - motion@12.35.2
    - zustand@5.0.11
    - tailwindcss@4.2.1
    - "@tailwindcss/postcss@4.2.1"
    - postcss@8.5.8
    - typescript@5.9.3
    - vitest@4.0.18
    - "@testing-library/react@16.3.2"
    - "@testing-library/jest-dom@6.9.1"
    - jsdom@28.1.0
    - "@vitejs/plugin-react@5.1.4"
  patterns:
    - "Static export via next.config.ts output: 'export' — no server runtime"
    - "Tailwind v4 CSS-first: @import 'tailwindcss' in globals.css, no tailwind.config.js"
    - "Vitest with globals: true and jsdom environment for React component testing"

key-files:
  created:
    - package.json
    - next.config.ts
    - postcss.config.mjs
    - tsconfig.json
    - src/app/globals.css
    - src/app/layout.tsx
    - src/app/page.tsx
    - vitest.config.ts
    - vitest.setup.ts
  modified: []

key-decisions:
  - "Used manual npm install instead of create-next-app because the repo root had existing files (.planning/, CLAUDE.md) that create-next-app rejected"
  - "Tailwind v4 uses @import 'tailwindcss' in CSS (not @tailwind directives) — no tailwind.config.js required"
  - "Motion 12 is the 'motion' npm package — not 'framer-motion' (old package name)"
  - "Static export chosen: output: 'export' in next.config.ts — no server-side rendering"

patterns-established:
  - "All library installs via npm; package-lock.json committed (omitted from task commits per plan)"
  - "next.config.ts (TypeScript) used instead of .js for type safety"
  - "postcss.config.mjs (ESM) for @tailwindcss/postcss plugin registration"

requirements-completed: [FOUND-01, FOUND-02, FOUND-03]

# Metrics
duration: 4min
completed: 2026-03-11
---

# Phase 1 Plan 01: Scaffold Next.js 16 static-export project with Tailwind v4, Motion 12, Zustand 5, and Vitest 4

**Next.js 16 app bootstrapped manually with static export, Tailwind v4 CSS-first config, Motion 12 + Zustand 5 installed, and Vitest 4 test harness with React Testing Library — next build exits 0 producing out/index.html**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-11T20:59:39Z
- **Completed:** 2026-03-11T21:03:42Z
- **Tasks:** 2
- **Files modified:** 9

## Accomplishments
- Bootstrapped Next.js 16 + React 19 project from scratch in a non-empty repo root
- Configured static export (output: 'export') with Tailwind v4 CSS-first setup and Motion 12 + Zustand 5
- Established Vitest 4 test harness with jsdom, React Testing Library, and jest-dom matchers
- Verified: `npm run build` exits 0 → out/index.html produced; `npm test --passWithNoTests` exits 0

## Task Commits

Each task was committed atomically:

1. **Task 1: Scaffold Next.js project and install dependencies** - `a844866` (feat)
2. **Task 2: Install and configure Vitest test harness** - `f3e025e` (feat)

**Plan metadata:** (docs commit created below)

## Files Created/Modified
- `package.json` - All dependency declarations and npm scripts (dev, build, start, lint, test)
- `next.config.ts` - Static export configuration with output: 'export' and images.unoptimized
- `postcss.config.mjs` - @tailwindcss/postcss plugin registration
- `tsconfig.json` - TypeScript config with bundler module resolution and @/* path alias
- `src/app/globals.css` - Tailwind v4 @import entry point with LEGO placeholder theme tokens
- `src/app/layout.tsx` - Root layout as server component (no 'use client'), metadata export
- `src/app/page.tsx` - Minimal stub page with Tailwind utility classes
- `vitest.config.ts` - Vitest config with jsdom environment, globals: true, @/* alias
- `vitest.setup.ts` - jest-dom import for extended matchers

## Decisions Made
- **Manual install instead of create-next-app:** create-next-app refused to scaffold into a non-empty directory (detected .planning/ and CLAUDE.md). Used `npm init` + manual package installs instead — same result, full control.
- **Tailwind v4 CSS-first approach:** No tailwind.config.js generated. v4 uses `@import "tailwindcss"` in CSS and @theme blocks for tokens.
- **Motion package name:** Confirmed `motion` (not `framer-motion`) is the correct v12 package name per plan instruction.
- **Static export:** output: 'export' in next.config.ts ensures the presentation app produces a static `out/` directory, no server runtime needed.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Used manual npm install instead of create-next-app**
- **Found during:** Task 1 (Scaffold Next.js project)
- **Issue:** `npx create-next-app@latest .` exited with error: "The directory lego-case contains files that could conflict: .planning/, CLAUDE.md"
- **Fix:** Ran `npm init -y` then manually installed Next.js, React, TypeScript, ESLint, and all required libraries via npm install. Created all config files manually following the exact specifications in the plan.
- **Files modified:** All Task 1 files — same as planned
- **Verification:** `npm run build` exits 0, out/index.html produced
- **Committed in:** a844866 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** The fix achieved identical output to create-next-app. All success criteria met. No scope creep.

## Issues Encountered
None beyond the create-next-app blocking issue documented above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Next.js 16 project builds and tests pass — all subsequent plans can scaffold on top of this
- `src/` directory structure ready for Plan 02 (types + test scaffold)
- Motion 12 and Zustand 5 are importable — Plans 04-05 can use them immediately
- No blockers for Phase 1 Plans 02-05

---
*Phase: 01-foundation*
*Completed: 2026-03-11*
