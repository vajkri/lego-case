---
phase: 04-content-and-polish
plan: 01
subsystem: ui
tags: [typescript, react, content-blocks, slide-data, presentation]

# Dependency graph
requires:
  - phase: 03.1-design-system-integration
    provides: 6 content block UI components (BulletList, TwoColumnCards, EntityCards, NumberedSteps, CalloutBox, DataTable) + BlockVariant type
  - phase: 02-navigation-and-slides
    provides: SlideOverlay + SlideContent components, Slide type shape
provides:
  - ContentBlock discriminated union type exported from presentation.ts
  - Slide.blocks replaces Slide.lines
  - SlideContent block dispatcher rendering all 6 block types
  - 18 fully-authored slides across 5 stops with rich presentation content
affects: [04-02, any phase consuming Slide type or stops data]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - ContentBlock discriminated union for typed slide content — 6 members mapping 1:1 to UI components
    - SlideContent as block dispatcher — switch(block.type) renders to correct component
    - Data files contain pure typed data (no JSX) — CalloutBox content is { type: 'callout', text: '...' }
    - BulletList heading is optional — single-block slides omit heading, multi-block slides add only when disambiguation needed

key-files:
  created: []
  modified:
    - src/types/presentation.ts
    - src/components/ui/content-blocks/BulletList.tsx
    - src/components/features/slide/SlideOverlay/SlideContent.tsx
    - src/components/features/slide/SlideOverlay/SlideOverlay.tsx
    - src/data/topics/__tests__/stops.test.ts
    - src/components/features/map/__tests__/StopNode.test.tsx
    - src/data/topics/stop-01-the-case.ts
    - src/data/topics/stop-02-vision.ts
    - src/data/topics/stop-03-how-we-work.ts
    - src/data/topics/stop-04-migration.ts
    - src/data/topics/stop-05-summary.ts

key-decisions:
  - "ContentBlock is a discriminated union (not polymorphic class) — switch(block.type) gives exhaustive TS type narrowing"
  - "BulletList heading becomes optional (heading?: string) — single-block slides omit heading for cleaner layout"
  - "CalloutBox data shape: { type: 'callout', text: string } — no ReactNode in data files, text passed as string then rendered as children"
  - "SlideContent layout: flex-1 flex flex-col gap-6 overflow-y-auto — handles multi-block slides without overflow"
  - "Slide heading uses text-[30px] font-bold (Slide Heading scale per CLAUDE.md), not text-4xl/40px (Page Title scale)"

patterns-established:
  - "Block dispatcher pattern: renderBlock(block: ContentBlock, index: number) switch statement in SlideContent.tsx"
  - "Data-only stop files: pure TypeScript data with no JSX or React imports — all content is serializable"
  - "Variant semantics: red=urgency/current, yellow=action/forward-looking, default=neutral/informational"

requirements-completed: [PERF-01, PERF-03]

# Metrics
duration: 6min
completed: 2026-03-14
---

# Phase 4 Plan 01: Type System + Content Authoring Summary

**ContentBlock discriminated union + SlideContent block dispatcher + 18 fully-authored slides across 5 stops using all 6 content block types**

## Performance

- **Duration:** 6 min
- **Started:** 2026-03-14T21:25:31Z
- **Completed:** 2026-03-14T21:31:06Z
- **Tasks:** 2
- **Files modified:** 11

## Accomplishments

- Extended Slide type with `blocks: ContentBlock[]` discriminated union — 6 members, each mapping 1:1 to a UI component
- Rewrote SlideContent.tsx as a block dispatcher with exhaustive switch on block.type
- Authored all 18 slides (4+4+5+3+2) with rich, presentation-quality content using "we" voice — new content for "Why React + Next.js" and "Experience-First Architecture"

## Task Commits

Each task was committed atomically:

1. **Task 1: Type contracts + block dispatcher + test updates** - `131e70d` (feat)
2. **Task 2: Author all 18 slides across 5 stops** - `9cdc189` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified

- `src/types/presentation.ts` — Added ContentBlock union type + BlockVariant import; replaced Slide.lines with Slide.blocks
- `src/components/ui/content-blocks/BulletList.tsx` — Made heading prop optional with conditional render
- `src/components/features/slide/SlideOverlay/SlideContent.tsx` — Rewritten as 6-way block dispatcher; layout uses overflow-y-auto
- `src/components/features/slide/SlideOverlay/SlideOverlay.tsx` — Changed lines={slide.lines} to blocks={slide.blocks}
- `src/data/topics/__tests__/stops.test.ts` — Updated assertions from lines[] to blocks[]; added block type validity test
- `src/components/features/map/__tests__/StopNode.test.tsx` — Fixed mock data broken by Slide type change (Rule 1)
- `src/data/topics/stop-01-the-case.ts` — 4 slides: Why We Are Here, Business Requirements, Assumptions, What Success Looks Like
- `src/data/topics/stop-02-vision.ts` — 4 slides: Why React + Next.js, Experience-First Architecture, Component Architecture, Design System Strategy
- `src/data/topics/stop-03-how-we-work.ts` — 5 slides: Team Structure, Storybook, CI/CD & Release, Testing Strategy, Privacy-First Analytics
- `src/data/topics/stop-04-migration.ts` — 3 slides: Migration Strategy, Migration Steps, Risk Mitigation
- `src/data/topics/stop-05-summary.ts` — 2 slides: What We Are Proposing, Questions?

## Decisions Made

- ContentBlock uses a discriminated union rather than a polymorphic pattern — switch(block.type) gives exhaustive TypeScript narrowing at zero runtime cost
- CalloutBox content stored as `{ type: 'callout', text: string }` in data files (not ReactNode) — keeps data files JSX-free and serializable
- SlideContent outer div uses `overflow-y-auto` — multi-block slides (3+ blocks) scroll gracefully within the SlideFrame card
- Slide heading rendered at 30px (Slide Heading scale per typography spec in CLAUDE.md), not 40px (Page Title scale)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed StopNode.test.tsx mock data broken by Slide type change**
- **Found during:** Task 1 (Type contracts + block dispatcher)
- **Issue:** `StopNode.test.tsx` had `slides: [{ heading: 'Heading', lines: ['Line 1'] }]` in mock data — `lines` no longer exists on the Slide type after the Phase 4 type change
- **Fix:** Updated mock to `slides: [{ heading: 'Heading', blocks: [{ type: 'bullet-list' as const, items: ['Line 1'] }] }]`
- **Files modified:** `src/components/features/map/__tests__/StopNode.test.tsx`
- **Verification:** TypeScript no longer reports error on this file
- **Committed in:** `131e70d` (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - Bug)
**Impact on plan:** Necessary correctness fix directly caused by the Slide type change. No scope creep.

## Issues Encountered

- Pre-existing TypeScript errors in `StopNode.test.tsx` (`isCarTraveling` missing prop) and `Button.test.tsx`/`ContentBlocks.test.tsx` (vitest types not in tsconfig) — all pre-date Phase 4, logged as out-of-scope
- Pre-existing test failures in MinifigHead and CarElement/StopNode test suites — confirmed not caused by Phase 4 changes

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- All 18 slides render typed content blocks through the block dispatcher
- SlideContent.tsx is fully integrated — all 6 block types tested via stops.test.ts
- Ready for Phase 4 Plan 02 (production verification: build + Lighthouse + WCAG audit)
- Pre-existing StopNode.test.tsx `isCarTraveling` prop errors are deferred — not blocking production build

---
*Phase: 04-content-and-polish*
*Completed: 2026-03-14*
