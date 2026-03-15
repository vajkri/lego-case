# Phase 4: Content and Polish - Context

**Gathered:** 2026-03-14
**Status:** Ready for planning

<domain>
## Phase Boundary

Author all 5 stop slides with rich, presentation-ready content using the 6 content block types built in Phase 03.1 (BulletList, TwoColumnCards, EntityCards, NumberedSteps, CalloutBox, DataTable). Content must cover all 4 case assignment requirements: (1) modern web framework, (2) multi-team architecture, (3) measurement & learning, (4) migration plan. Extend the Slide type to support content blocks, update SlideContent.tsx to render them, and verify production build (PERF-01, PERF-02, PERF-03).

Does NOT include: map changes (03.4), navigation/state changes, new UI components, or animation work.

</domain>

<decisions>
## Implementation Decisions

### Content voice
- Sharpen freely for presentation impact — rewrite proposal-content.md text into punchy, active-voice delivery
- Use "we" voice throughout (collaborative, confident: "We ship less JavaScript", "Our teams own their components")
- Author NEW content for assignment gaps not in proposal-content.md: "Why React + Next.js" (framework pitch with SSR/SSG/ISR) and "Experience-First Architecture" (how the stack supports playful, animated experiences)
- Content source is proposal-content.md + case assignment PDF — no invented claims, but editorial freedom on wording and structure

### Slide structure (18 slides across 5 stops)

**Stop 1: The Case (4 slides)**
1. "Why We Are Here" — CalloutBox (problem) + BulletList variant:red (opportunity)
2. "Business Requirements" — TwoColumnCards variant:yellow (4 pillars)
3. "Assumptions" — BulletList variant:default (key assumptions including: two engineering teams to start, existing backend and CMS infrastructure)
4. "What Success Looks Like" — DataTable variant:default (metrics) + CalloutBox (key shift)

**Stop 2: Vision (4 slides)**
1. "Why React + Next.js" — TwoColumnCards variant:default (framework benefits) [NEW CONTENT]
2. "Experience-First Architecture" — BulletList variant:yellow (how stack supports playful experiences) + CalloutBox [NEW CONTENT]
3. "Component Architecture" — NumberedSteps variant:yellow (build → document → promote)
4. "Design System Strategy" — TwoColumnCards variant:default (shared vs feature) + CalloutBox

**Stop 3: How We Work (5 slides)**
1. "Team Structure" — EntityCards variant:yellow (Platform, Content/Campaign, Safety/Privacy) + CalloutBox (future scaling)
2. "Storybook as Component Registry" — BulletList variant:default (benefits) + DataTable variant:default (structure)
3. "CI/CD & Release Strategy" — NumberedSteps variant:red (pipeline evolution)
4. "Testing Strategy" — DataTable variant:default (test layers) + CalloutBox (philosophy)
5. "Privacy-First Analytics" — BulletList variant:red (event tracking + guardrails) + TwoColumnCards variant:default (tooling vs compliance)

**Stop 4: Migration (3 slides)**
1. "Migration Strategy" — CalloutBox (why incremental) + BulletList variant:default (benefits)
2. "Migration Steps" — NumberedSteps variant:yellow (4-step plan)
3. "Risk Mitigation" — EntityCards variant:red (risk → mitigation)

**Stop 5: Summary (2 slides)**
1. "What We're Proposing" — BulletList variant:yellow (5 key takeaways)
2. "Questions?" — minimal closing slide inviting discussion

### Block sub-headings
- Slide heading only for single-block slides — skip block-level heading (make BulletList heading optional)
- Context-dependent for multi-block slides: add sub-headings only when two blocks of the same type need disambiguation; different block types visually distinguish themselves

### Variant assignment (semantic)
- Red = attention/urgency/critical (risks, current state, CI/CD rigor, privacy guardrails)
- Yellow = forward-looking/action/opportunity (steps, proposals, teams, key takeaways)
- Default = neutral/informational (data tables, process descriptions, technical details)
- CalloutBox stays always-yellow (established design system behavior)
- Distribution locked as mapped above — no per-block approval needed

### Slide pacing
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

</decisions>

<specifics>
## Specific Ideas

- Assumptions slide should list: "Two engineering teams (Platform + Content/Campaign) to start", "Existing Node.js/Express.js backend and headless CMS (WordPress) in place", "Hosting from Billund co-location datacenter", "Design team will deliver LEGO-specific visual guidelines", "Safety & Privacy team defines COPPA/GDPR-K compliance requirements"
- The case assignment explicitly says "list your assumptions" — the Assumptions slide directly addresses this
- "Why React + Next.js" slide should cover SSR/SSG/ISR, App Router, React ecosystem, TypeScript, i18n — mapped to kids.lego.com needs
- "Experience-First Architecture" slide should show how Server Components + client interactivity split supports playful animated experiences without compromising low-end device performance
- Use the frontend-design skill for content authoring — visual quality matters
- The content map was reviewed and approved in the assumptions discussion prior to this context session

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `BulletList` (`ui/content-blocks/`): heading + items[] + variant — heading prop needs to become optional
- `TwoColumnCards` (`ui/content-blocks/`): cards[{title, description}] + variant
- `EntityCards` (`ui/content-blocks/`): entities[{initials, title, description}] + variant (defaults yellow)
- `NumberedSteps` (`ui/content-blocks/`): steps[{title, description}] + variant
- `CalloutBox` (`ui/content-blocks/`): children (ReactNode) — always yellow, no variant prop
- `DataTable` (`ui/content-blocks/`): headers[] + rows[][] + variant
- `variantStyleMap` (`ui/content-blocks/variants.ts`): BlockVariant type + style maps
- `SlideFrame` (`ui/SlideFrame/`): Chrome wrapper with stud header, grey-wash, white card — accepts children

### Established Patterns
- `Slide` type: `{ heading: string; lines: string[] }` — needs extension to support blocks
- `SlideContent.tsx`: Currently renders all slides as numbered list — needs rewrite to dispatch content blocks
- Content in TypeScript data files (`src/data/topics/stop-01..05.ts`) — data files are the single source of truth
- `variantStyleMap` uses inline `style` prop (not Tailwind classes) for rgba-based variant colors
- `'use client'` on all interactive components; SlideFrame is NOT 'use client'
- QUAL-02 requirement: zero hardcoded content in JSX — all from data files

### Integration Points
- `src/types/presentation.ts`: Extend `Slide` interface with content block types
- `src/data/topics/stop-01..05.ts`: Rewrite all 5 data files with new content + block types
- `src/components/features/slide/SlideOverlay/SlideContent.tsx`: Rewrite to render content blocks
- `src/components/ui/content-blocks/BulletList.tsx`: Make `heading` prop optional
- `src/data/topics/__tests__/stops.test.ts`: Update tests for new Slide shape
- `src/components/ui/content-blocks/index.ts`: Verify all blocks are exported

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-content-and-polish*
*Context gathered: 2026-03-14*
