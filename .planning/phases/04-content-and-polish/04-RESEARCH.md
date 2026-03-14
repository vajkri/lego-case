# Phase 4: Content and Polish - Research

**Researched:** 2026-03-14
**Domain:** TypeScript data modelling, React component composition, content authoring, Next.js static export QA
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Content voice**
- Sharpen freely for presentation impact — rewrite proposal-content.md text into punchy, active-voice delivery
- Use "we" voice throughout (collaborative, confident: "We ship less JavaScript", "Our teams own their components")
- Author NEW content for assignment gaps not in proposal-content.md: "Why React + Next.js" (framework pitch with SSR/SSG/ISR) and "Experience-First Architecture" (how the stack supports playful, animated experiences)
- Content source is proposal-content.md + case assignment PDF — no invented claims, but editorial freedom on wording and structure

**Slide structure (18 slides across 5 stops)**

Stop 1: The Case (4 slides)
1. "Why We Are Here" — CalloutBox (problem) + BulletList variant:red (opportunity)
2. "Business Requirements" — TwoColumnCards variant:yellow (4 pillars)
3. "Assumptions" — BulletList variant:default (key assumptions including: two engineering teams to start, existing backend and CMS infrastructure)
4. "What Success Looks Like" — DataTable variant:default (metrics) + CalloutBox (key shift)

Stop 2: Vision (4 slides)
1. "Why React + Next.js" — TwoColumnCards variant:default (framework benefits) [NEW CONTENT]
2. "Experience-First Architecture" — BulletList variant:yellow (how stack supports playful experiences) + CalloutBox [NEW CONTENT]
3. "Component Architecture" — NumberedSteps variant:yellow (build → document → promote)
4. "Design System Strategy" — TwoColumnCards variant:default (shared vs feature) + CalloutBox

Stop 3: How We Work (5 slides)
1. "Team Structure" — EntityCards variant:yellow (Platform, Content/Campaign, Safety/Privacy) + CalloutBox (future scaling)
2. "Storybook as Component Registry" — BulletList variant:default (benefits) + DataTable variant:default (structure)
3. "CI/CD & Release Strategy" — NumberedSteps variant:red (pipeline evolution)
4. "Testing Strategy" — DataTable variant:default (test layers) + CalloutBox (philosophy)
5. "Privacy-First Analytics" — BulletList variant:red (event tracking + guardrails) + TwoColumnCards variant:default (tooling vs compliance)

Stop 4: Migration (3 slides)
1. "Migration Strategy" — CalloutBox (why incremental) + BulletList variant:default (benefits)
2. "Migration Steps" — NumberedSteps variant:yellow (4-step plan)
3. "Risk Mitigation" — EntityCards variant:red (risk → mitigation)

Stop 5: Summary (2 slides)
1. "What We're Proposing" — BulletList variant:yellow (5 key takeaways)
2. "Questions?" — minimal closing slide inviting discussion

**Block sub-headings**
- Slide heading only for single-block slides — skip block-level heading (make BulletList heading optional)
- Context-dependent for multi-block slides: add sub-headings only when two blocks of the same type need disambiguation; different block types visually distinguish themselves

**Variant assignment (semantic)**
- Red = attention/urgency/critical (risks, current state, CI/CD rigor, privacy guardrails)
- Yellow = forward-looking/action/opportunity (steps, proposals, teams, key takeaways)
- Default = neutral/informational (data tables, process descriptions, technical details)
- CalloutBox stays always-yellow (established design system behavior)
- Distribution locked as mapped above — no per-block approval needed

**Slide pacing**
- ~18 slides for ~20 min presentation = ~70 seconds per slide
- Multi-block composition allowed per Claude's judgment (no strict rule)
- Stop 3 keeps all 5 slides separate (meatiest stop, covers multi-team arch + CI/CD + testing + analytics)
- Stop 5 gets a "Questions?" closing slide (the map view IS the visual journey-complete moment)

### Claude's Discretion

- Slide type design: how to extend `Slide` interface to support content blocks (discriminated union, polymorphic blocks, etc.)
- SlideContent.tsx rendering approach: how to dispatch to correct content block component
- CalloutBox data representation in typed data files (since it takes ReactNode children)
- Exact text content for each slide (within editorial guidelines above)
- Whether BulletList heading becomes optional via type change or via empty string handling
- Test updates for changed Slide type

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| PERF-01 | `next build` completes without errors or warnings related to static export, server components, or image optimization | Static export is `output: 'export'` — verified working. Risk area is `'use client'` boundaries and dynamic imports. Type errors in data files will surface as build errors. |
| PERF-02 | App loads and is interactive in < 3 seconds on a standard laptop over Wi-Fi | Already static export — no SSR overhead. Phase 4 adds no new network dependencies. Content-only data files are tree-shakeable. No new risk introduced. |
| PERF-03 | No console errors or warnings in production build | Type safety in data files prevents runtime errors. ReactNode in data files must be authored carefully (plain JSX, not runtime-dependent content). |
</phase_requirements>

---

## Summary

Phase 4 is a content + type-system phase, not a UI-component phase. The visual primitives (BulletList, TwoColumnCards, EntityCards, NumberedSteps, CalloutBox, DataTable) are fully built and tested. What is missing is: (1) a `Slide` type that can carry typed block data rather than flat `string[]`, (2) a `SlideContent.tsx` that dispatches to those blocks, and (3) all 18 slides authored with real presentation content.

The core design challenge is the `Slide` type extension. The current shape `{ heading: string; lines: string[] }` is too flat. The replacement must be a discriminated union that lets TypeScript enforce correct block data at compile time while remaining clean to author in data files. A `ContentBlock` tagged-union approach (one discriminant `type` field per block kind) is idiomatic, directly maps to the six existing components, and is straightforward to render with a switch/map in `SlideContent.tsx`.

`CalloutBox` takes `React.ReactNode` children, which is awkward in plain TypeScript data files. The cleanest solution is to represent it as a plain string in the data type (`{ type: 'callout'; text: string }`) and render it as `<CalloutBox>{block.text}</CalloutBox>` in the dispatcher — this keeps all 5 stop files as pure data with no JSX imports.

**Primary recommendation:** Use a discriminated union `ContentBlock` type, replace `Slide.lines` with `Slide.blocks: ContentBlock[]`, make `BulletList.heading` optional (add `?`), rewrite `SlideContent.tsx` as a block renderer, and author all 18 slides in the data files. Then run `next build` and `npm test` as the verification gate.

---

## Standard Stack

### Core (already installed — no new packages needed)

| Library | Version | Purpose | Status |
|---------|---------|---------|--------|
| Next.js | ^16.1.6 | Static export build | Already configured |
| React | ^19.2.4 | Component rendering | Already installed |
| TypeScript | ^5.9.3 | Type safety in data files | Already configured |
| Vitest | ^4.0.18 | Test runner | Already configured |

### No New Dependencies

This phase installs nothing new. All required components exist. All required tooling exists. The phase is pure authoring + type extension.

---

## Architecture Patterns

### The ContentBlock Discriminated Union

**What:** Replace `Slide.lines: string[]` with `Slide.blocks: ContentBlock[]` where `ContentBlock` is a tagged union over the 6 block types.

**Why this shape:** TypeScript will enforce correct data shape per block type at compile time. Data files are plain object literals — no JSX, no imports from component files. The dispatcher in `SlideContent.tsx` is a straightforward array map with a switch.

**Type definition:**

```typescript
// src/types/presentation.ts

export type ContentBlock =
  | { type: 'bullet-list'; heading?: string; items: string[]; variant?: BlockVariant }
  | { type: 'two-column-cards'; cards: { title: string; description: string }[]; variant?: BlockVariant }
  | { type: 'entity-cards'; entities: { initials: string; title: string; description: string }[]; variant?: BlockVariant }
  | { type: 'numbered-steps'; steps: { title: string; description: string }[]; variant?: BlockVariant }
  | { type: 'callout'; text: string }
  | { type: 'data-table'; headers: string[]; rows: string[][]; variant?: BlockVariant }

export interface Slide {
  heading: string
  blocks: ContentBlock[]
}
```

`BlockVariant` is re-exported from `src/components/ui/content-blocks/variants.ts` — import it in `presentation.ts` or duplicate the type inline. Keeping it co-located in `variants.ts` and importing is cleaner (single source of truth).

**Important:** `BlockVariant` is currently in `src/components/ui/content-blocks/variants.ts`. To avoid importing UI components into types, extract `BlockVariant` to `src/types/presentation.ts` or a shared `src/types/blocks.ts`. Alternatively, keep it in `variants.ts` and import from there in `presentation.ts` — this is fine since `variants.ts` has no React import in the type definition itself.

### SlideContent.tsx Block Dispatcher

**What:** Rewrite `SlideContent.tsx` to render an array of `ContentBlock` items.

**Pattern:**

```typescript
// src/components/features/slide/SlideOverlay/SlideContent.tsx
'use client'

import {
  BulletList,
  TwoColumnCards,
  EntityCards,
  NumberedSteps,
  CalloutBox,
  DataTable,
} from '@/components/ui'
import type { ContentBlock } from '@/types/presentation'

function renderBlock(block: ContentBlock, index: number) {
  switch (block.type) {
    case 'bullet-list':
      return <BulletList key={index} heading={block.heading ?? ''} items={block.items} variant={block.variant} />
    case 'two-column-cards':
      return <TwoColumnCards key={index} cards={block.cards} variant={block.variant} />
    case 'entity-cards':
      return <EntityCards key={index} entities={block.entities} variant={block.variant} />
    case 'numbered-steps':
      return <NumberedSteps key={index} steps={block.steps} variant={block.variant} />
    case 'callout':
      return <CalloutBox key={index}>{block.text}</CalloutBox>
    case 'data-table':
      return <DataTable key={index} headers={block.headers} rows={block.rows} variant={block.variant} />
  }
}

interface SlideContentProps {
  heading: string
  blocks: ContentBlock[]
}

export function SlideContent({ heading, blocks }: SlideContentProps) {
  return (
    <div className="flex-1 flex flex-col gap-6 w-full max-w-4xl mx-auto px-4 py-8 overflow-y-auto">
      <h2 className="font-display font-bold text-[30px] text-lego-dark leading-tight tracking-tight">
        {heading}
      </h2>
      <div className="flex flex-col gap-4">
        {blocks.map((block, i) => renderBlock(block, i))}
      </div>
    </div>
  )
}
```

### SlideOverlay.tsx Integration Point

`SlideOverlay.tsx` currently passes `heading` and `lines` to `SlideContent`:

```typescript
// Current (line 104):
<SlideContent heading={slide.heading} lines={slide.lines} />

// After Phase 4:
<SlideContent heading={slide.heading} blocks={slide.blocks} />
```

This is a one-line change in `SlideOverlay.tsx`.

### BulletList heading: make it optional

Current signature:
```typescript
interface BulletListProps {
  heading: string   // required
  items: string[]
  variant?: BlockVariant
}
```

Change to:
```typescript
interface BulletListProps {
  heading?: string  // optional
  items: string[]
  variant?: BlockVariant
}
```

And render conditionally:
```typescript
{heading && (
  <h3 className="font-display font-bold text-[22px] text-lego-dark mb-4">
    {heading}
  </h3>
)}
```

### Data File Pattern

Each stop file replaces its `slides` array. Example (Stop 1, Slide 1):

```typescript
// src/data/topics/stop-01-the-case.ts
import type { Stop } from '@/types/presentation'

export const stopTheCase: Stop = {
  slug: 'the-case',
  label: 'The Case',
  coordinates: { x: 12, y: 80 },
  labelPosition: 'above',
  slides: [
    {
      heading: 'Why We Are Here',
      blocks: [
        {
          type: 'callout',
          text: 'kids.lego.com runs on AngularJS — end of life since 2022. This is not a tech upgrade. It is a business continuity decision.',
        },
        {
          type: 'bullet-list',
          variant: 'red',
          items: [
            'No modern tooling, no SSR, no TypeScript',
            'Every new feature fights the framework instead of shipping value',
            'The longer we wait, the bigger the risk',
          ],
        },
      ],
    },
    // ...
  ],
}
```

### Recommended Project Structure (unchanged from current)

```
src/
├── types/
│   └── presentation.ts      # Extend Slide + add ContentBlock union
├── data/topics/
│   ├── stop-01-the-case.ts  # Rewrite with blocks[]
│   ├── stop-02-vision.ts
│   ├── stop-03-how-we-work.ts
│   ├── stop-04-migration.ts
│   └── stop-05-summary.ts
├── components/
│   ├── ui/content-blocks/
│   │   └── BulletList.tsx   # Make heading optional
│   └── features/slide/SlideOverlay/
│       └── SlideContent.tsx  # Rewrite as block dispatcher
```

### Anti-Patterns to Avoid

- **Importing React/JSX into data files:** Do not use `<CalloutBox>` inside stop-XX.ts files. Keep data files as pure object literals. Represent callout content as `{ type: 'callout'; text: string }`.
- **Using `as any` or casting:** The discriminated union provides full type safety — trust it.
- **Keeping `lines: string[]` alongside `blocks`:** Remove `lines` entirely from `Slide`. Do not make it optional; a dead field creates confusion and requires dual handling.
- **Inline style in SlideContent:** Content blocks already handle their own variant styles via `variantStyleMap`. SlideContent is layout-only.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Block rendering dispatch | Custom if/else chain | Switch over discriminated union | Exhaustiveness checked by TypeScript |
| Callout content in data files | JSX in .ts files | `{ type: 'callout'; text: string }` | JSX requires React import, breaks plain data file convention |
| Optional heading handling | Empty string check `heading !== ''` | Optional prop with `heading?:` | TypeScript type is the contract, not empty string convention |
| Variant type duplication | Re-declaring `'default' \| 'red' \| 'yellow'` in presentation.ts | Import `BlockVariant` from variants.ts | Single source of truth |

---

## Common Pitfalls

### Pitfall 1: Test suite breaks on Slide shape change

**What goes wrong:** `stops.test.ts` currently asserts `slide.lines.length > 0` and iterates over `slide.lines`. After replacing `lines` with `blocks`, this test will fail with a TypeScript error and a runtime assertion failure.

**Why it happens:** The test was written to the old `Slide` shape. It is not wrong — it is just out of date.

**How to avoid:** Update `stops.test.ts` in the same plan as the type change. New assertions:
- Every slide has `blocks` array with at least one block
- Every block has a `type` field that is one of the 6 known values

**Warning signs:** TypeScript error `Property 'lines' does not exist on type 'Slide'` in the test file.

### Pitfall 2: SlideOverlay.tsx not updated after Slide shape change

**What goes wrong:** `SlideOverlay.tsx` accesses `slide.lines` on line 104 (passed to `SlideContent`). After the type change, TypeScript will report an error. `next build` will fail (PERF-01 violation).

**How to avoid:** Update `SlideOverlay.tsx` in the same plan as the type change to pass `blocks` instead of `lines`.

### Pitfall 3: CalloutBox children as ReactNode in data files

**What goes wrong:** If `ContentBlock` for callout is typed as `{ type: 'callout'; children: React.ReactNode }`, data files must import React and use JSX syntax — turning them into `.tsx` files or adding React imports to `.ts` files.

**How to avoid:** Type callout data as `{ type: 'callout'; text: string }`. The dispatcher wraps the string: `<CalloutBox>{block.text}</CalloutBox>`. This is the correct boundary — data is pure, components render it.

### Pitfall 4: Multi-block slides overflow the slide frame

**What goes wrong:** SlideFrame has a fixed-height white inner card. Multiple tall blocks (e.g., EntityCards with 3 entities + CalloutBox) can overflow without scroll.

**How to avoid:** Add `overflow-y-auto` to the `SlideContent` scroll container (already included in the example above). Verify visually for the slides with the most content (Stop 3 Slide 1 has EntityCards + CalloutBox, Stop 3 Slide 5 has BulletList + TwoColumnCards).

**Warning signs:** Content clipped below the bottom of the slide chrome.

### Pitfall 5: TwoColumnCards with odd number of cards

**What goes wrong:** The grid is `grid-cols-2`. An odd number of cards (e.g., 3 cards) leaves a half-row gap. Some slides may use 3-card TwoColumnCards.

**How to avoid:** Author all TwoColumnCards slides with even card counts (2 or 4). The slide structure in CONTEXT.md prescribes specific card groups — verify counts during authoring. If an odd count is genuinely needed, use EntityCards instead.

### Pitfall 6: Existing test failures (pre-existing, not Phase 4 caused)

**What is already failing:** Two test files fail before Phase 4 begins:
- `CarElement.test.tsx` — 6 tests fail due to `window.matchMedia is not a function` (jsdom limitation, not a Phase 4 concern)
- `MinifigHead.test.tsx` — 1 test fails due to hardcoded SVG dimension expectation vs actual implementation

**How to avoid:** These failures are pre-existing and out of Phase 4 scope. The planner should not include fixing these as Phase 4 tasks. The Phase 4 test gate is: all stops-related tests pass + SlideContent + ContentBlocks tests pass.

---

## Code Examples

Verified from reading the actual codebase:

### Current Slide type (to be replaced)

```typescript
// src/types/presentation.ts (current)
export interface Slide {
  heading: string
  lines: string[]   // flat string array — remove this
}
```

### Current SlideOverlay integration point

```typescript
// src/components/features/slide/SlideOverlay/SlideOverlay.tsx (line 104)
<SlideContent heading={slide.heading} lines={slide.lines} />
// Change to:
<SlideContent heading={slide.heading} blocks={slide.blocks} />
```

### BulletList current heading (required) vs needed (optional)

```typescript
// Current (BulletList.tsx line 3):
interface BulletListProps {
  heading: string   // must become heading?: string
  items: string[]
  variant?: BlockVariant
}
```

### Current stops test assertions that must be updated

```typescript
// src/data/topics/__tests__/stops.test.ts (lines 32-38)
it('every slide has a heading and at least one content line', () => {
  for (const stop of stops) {
    for (const slide of stop.slides) {
      expect(slide.heading).toBeTruthy()
      expect(slide.lines.length).toBeGreaterThan(0)  // lines → blocks
      for (const line of slide.lines) {               // lines → blocks
        expect(line).toBeTruthy()
      }
    }
  }
})
```

New assertion after Phase 4:
```typescript
it('every slide has a heading and at least one content block', () => {
  for (const stop of stops) {
    for (const slide of stop.slides) {
      expect(slide.heading).toBeTruthy()
      expect(slide.blocks.length).toBeGreaterThan(0)
      for (const block of slide.blocks) {
        expect(block.type).toBeTruthy()
      }
    }
  }
})
```

---

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| `lines: string[]` flat content | `blocks: ContentBlock[]` typed union | TypeScript enforces correct block shape at compile time |
| SlideContent renders numbered list | SlideContent dispatches to 6 block components | Visual richness without runtime magic |
| `heading: string` required on BulletList | `heading?: string` optional | Multi-block slides can omit redundant headings |

---

## Open Questions

1. **Slide heading typography: 30px or 40px?**
   - What we know: CLAUDE.md specifies "Slide Heading: Baloo 2, 30px, 700". Current SlideContent uses `text-4xl` (40px).
   - What's unclear: Current SlideContent is being fully replaced — the new heading style should follow CLAUDE.md.
   - Recommendation: Use `text-[30px] font-display font-bold` per CLAUDE.md design system spec.

2. **"Questions?" slide — what blocks does it contain?**
   - What we know: CONTEXT.md calls it "minimal closing slide inviting discussion". No block type is specified.
   - Recommendation: A single `{ type: 'callout'; text: 'We are ready to walk through any part of the proposal in detail.' }` block. Simple, on-brand, uses the established CalloutBox visual.

3. **Stop slide counts: 18 total (4+4+5+3+2) — does the slide count test need updating?**
   - What we know: Current `stops.test.ts` checks `slides.length > 0` per stop, not exact counts. Stop-01 currently has 2 slides; Phase 4 expands it to 4.
   - Recommendation: Do not add a strict per-stop slide count assertion to the test (it would be brittle). The structural test (each stop has at least 1 slide, each slide has at least 1 block) is sufficient.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 4.0.18 |
| Config file | `vitest.config.ts` |
| Quick run command | `npm test -- --reporter=verbose src/data/topics` |
| Full suite command | `npm test` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PERF-01 | `next build` completes with zero errors | build smoke | `npm run build` | N/A — build command |
| PERF-02 | App interactive in < 3s | manual/smoke | `npm run build && npm start` (manual) | N/A — manual |
| PERF-03 | No console errors in production | manual/smoke | Open built site in browser (manual) | N/A — manual |

Supporting (structural integrity that prevents PERF-01 violations):

| Behavior | Test Type | Automated Command | File Exists? |
|----------|-----------|-------------------|-------------|
| All stops have correct block shapes | unit | `npm test -- src/data/topics` | ✅ (needs update) |
| ContentBlocks render correctly | unit | `npm test -- src/components/ui/content-blocks` | ✅ |
| SlideOverlay renders from data | unit | `npm test -- src/components/features/slide` | ✅ (needs update) |

### Sampling Rate

- **Per task commit:** `npm test -- src/data/topics/__tests__/stops.test.ts`
- **Per wave merge:** `npm test`
- **Phase gate:** `npm test` (all tests green, excluding pre-existing CarElement/MinifigHead failures) + `npm run build` exits 0

### Wave 0 Gaps

No new test files needed. Existing files require updates:
- [ ] `src/data/topics/__tests__/stops.test.ts` — update `lines` assertions to `blocks` assertions (covers PERF-01 structural integrity)
- [ ] `src/components/features/slide/SlideOverlay/__tests__/SlideOverlay.test.tsx` — verify test still passes after `SlideContent` props change (currently passes; should remain passing if `heading` is still passed)

---

## Sources

### Primary (HIGH confidence)

All findings are based on direct inspection of the live codebase. No external libraries are being added. All conclusions are derived from reading:
- `src/types/presentation.ts` — current Slide interface
- `src/components/ui/content-blocks/*.tsx` — all 6 block components and their props
- `src/components/features/slide/SlideOverlay/SlideContent.tsx` — current renderer
- `src/components/features/slide/SlideOverlay/SlideOverlay.tsx` — integration point
- `src/data/topics/stop-01..05.ts` — current data shape
- `src/data/topics/__tests__/stops.test.ts` — existing test assertions
- `CLAUDE.md` — design system conventions and typography scale
- `.planning/phases/04-content-and-polish/04-CONTEXT.md` — locked decisions

### Secondary (MEDIUM confidence)

- `npm test` output — confirms pre-existing test failures are in CarElement (matchMedia) and MinifigHead (dimension), not in content-related files
- `next.config.ts` + `package.json` — confirms `output: 'export'` and all required packages already installed

### Tertiary (LOW confidence)

None — all research is from live codebase inspection.

---

## Metadata

**Confidence breakdown:**
- Type system design: HIGH — based on reading all relevant type files and component signatures
- Content authoring: HIGH — source material (proposal-content.md) is in the repo; slide map is locked in CONTEXT.md
- Build/performance (PERF-01/02/03): HIGH — no new packages, no new routes, static export already configured
- Test updates needed: HIGH — directly read the test file and identified exact assertions to change

**Research date:** 2026-03-14
**Valid until:** 2026-04-14 (stable codebase, no moving parts)
