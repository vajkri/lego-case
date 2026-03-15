# Roadmap: LEGO Migration Proposal

## Milestones

- ✅ **v1.0 Interactive Presentation** - Phases 1-4 (shipped 2026-03-15)
- 🚧 **v1.1 Polished Content** - Phases 5-8 (in progress)

## Phases

<details>
<summary>✅ v1.0 Interactive Presentation (Phases 1-4) — SHIPPED 2026-03-15</summary>

### Phase 1: Foundation
**Goal**: Scaffold, types, and data layer are in place so all subsequent phases can build
**Plans**: 5 plans

Plans:
- [x] 01-01: Project scaffold, Next.js config, Tailwind v4 setup
- [x] 01-02: Stop data types and typed data layer
- [x] 01-03: Root layout, PresentationProvider, KeyboardController
- [x] 01-04: Static content files (stop-01 through stop-05)
- [x] 01-05: Barrel exports and type validation

### Phase 2: Navigation and Slides
**Goal**: Users can navigate between stops and view slide overlays with keyboard support
**Plans**: 5 plans

Plans:
- [x] 02-01: State machine (mode/stop/slide)
- [x] 02-02: SlideOverlay with AnimatePresence zoom transition
- [x] 02-03: Keyboard navigation (ArrowRight/Space/ArrowLeft/Escape)
- [x] 02-04: WCAG AA accessibility (focus trap, ARIA live region, focus return)
- [x] 02-05: Sub-slide stepping within stops

### Phase 3: Map and Car Animation
**Goal**: The world map with animated car and stop markers creates the LEGO travel metaphor
**Plans**: 5 plans

Plans:
- [x] 03-01: SVG world map with stop node positions
- [x] 03-02: CSS motion path car animation (60fps)
- [x] 03-03: Stop marker states (default/hover/focus/active/visited)
- [x] 03-04: Car-to-stop travel sequencing and state transitions
- [x] 03-05: Ambient SMIL animations (clouds, sun, windmill)

### Phase 3.1: Design System Integration (INSERTED)
**Goal**: LEGO design system tokens, UI components, and content blocks are documented and consistent
**Plans**: 4 plans

Plans:
- [x] 03.1-01: Tailwind v4 tokens, Button component, depth system
- [x] 03.1-02: SlideFrame chrome, StopBadge, SubSlideProgress
- [x] 03.1-03: Six content block types with variant system
- [x] 03.1-04: CLAUDE.md design system documentation

### Phase 3.2: Stop Marker Redesign (INSERTED)
**Goal**: Brick-stack stop markers replace pin markers with correct label positioning
**Plans**: 2 plans

Plans:
- [x] 03.2-01: BrickMarker SVG component with 5 visual states
- [x] 03.2-02: Label positioning (above/below) and brick entrance animation

### Phase 3.3: Progress Track Redesign (INSERTED)
**Goal**: Minifig head progress track with facial expressions and semantic connectors
**Plans**: 2 plans

Plans:
- [x] 03.3-01: MinifigHead component with face expression variants
- [x] 03.3-02: Connector sweep animation and visited state transitions

### Phase 3.4: Map Visual Redesign (INSERTED)
**Goal**: Full-bleed sky/grass background and ambient map elements complete the LEGO world aesthetic
**Plans**: 1 plan

Plans:
- [x] 03.4-01: Sky/grass backgrounds, road color, ambient SMIL animations

### Phase 4: Content and Polish
**Goal**: All 18 slides authored with rich content blocks and production build is clean
**Plans**: 2 plans

Plans:
- [x] 04-01: ContentBlock discriminated union + switch dispatcher; all 18 slides authored
- [x] 04-02: Production build validation, zero errors, zero warnings

</details>

---

### 🚧 v1.1 Polished Content (In Progress)

**Milestone Goal:** Every slide's copy and visual presentation is clear, persuasive, factually correct, and aligned to the case assignment requirements.

#### Phase 5: Assignment Coverage Audit
**Goal**: Every required topic area from the case assignment is verifiably present across the 5 stops
**Depends on**: Phase 4
**Requirements**: ASGN-01, ASGN-02, ASGN-03, ASGN-04, ASGN-05, ASGN-06
**Success Criteria** (what must be TRUE):
  1. Reading the slides, a reviewer can identify where each of the 4 required areas (modern framework, multi-team architecture, measurement/learning, migration plan) is addressed
  2. The framework stop (stop 2) covers performance, accessibility, DX, i18n, SSR/SSG/ISR, testability, and experience-first design for children
  3. The architecture stop covers shared design system, Storybook component library, monorepo/micro-frontend strategy, CI/CD, versioning, and release strategy
  4. The measurement stop covers instrumentation for retention/time-spent/session-depth, privacy-preserving analytics, A/B testing, and children's data guardrails
  5. The migration stop covers the AngularJS strangler pattern, interoperability, progressive rollout, user disruption, and operational risk
**Plans**: TBD

Plans:
- [ ] 05-01: Read case assignment PDF and audit all 5 stop data files for topic coverage
- [ ] 05-02: Fill identified gaps in stop data files (add missing topics, correct incomplete coverage)

#### Phase 6: Diagram Planning and Implementation
**Goal**: Slides that explain architecture, flows, or relationships have visual diagrams that communicate more clearly than text alone
**Depends on**: Phase 5
**Requirements**: VIS-05, VIS-06
**Success Criteria** (what must be TRUE):
  1. A Diagram content block type exists and renders within the slide overlay
  2. Slides identified as needing diagrams (e.g., architecture, migration flow, analytics pipeline) have visual explanations
  3. Diagrams are clear, labeled, and readable at slide scale without zooming
**Plans**: TBD

Plans:
- [ ] 06-01: Create Diagram content block type and identify which slides need diagrams
- [ ] 06-02: Create and integrate diagrams into stop data files

#### Phase 7: Per-Stop Copy and Visual Refinement
**Goal**: Every slide in every stop has clear, accurate copy and uses the optimal content block for its message
**Depends on**: Phase 6
**Requirements**: COPY-01, COPY-02, COPY-03, COPY-04, COPY-05, COPY-06, VIS-01, VIS-02, VIS-03, VIS-04
**Success Criteria** (what must be TRUE):
  1. Reading any slide, the key argument or data point is immediately apparent (front-loaded, not buried)
  2. Every bullet list uses parallel grammatical structure across all items
  3. Technical claims (framework capabilities, performance numbers, architectural descriptions) are factually accurate and could be verified by an engineer
  4. A non-technical stakeholder reading any slide can understand the point without needing to ask for clarification
  5. Each slide uses the content block type that best matches its message structure (table for comparisons, numbered steps for sequences, diagrams for architecture, etc.)
**Plans**: TBD

Plans:
- [ ] 07-01: Refine stop-01 and stop-02 data files (copy quality, block type selection, visual hierarchy)
- [ ] 07-02: Refine stop-03 and stop-04 data files (copy quality, block type selection, visual hierarchy)
- [ ] 07-03: Refine stop-05 data file (copy quality, block type selection, visual hierarchy)

#### Phase 8: Narrative Polish
**Goal**: The full 5-stop sequence tells a coherent, well-paced story that builds to a clear conclusion
**Depends on**: Phase 7
**Requirements**: FLOW-01, FLOW-02, FLOW-03
**Success Criteria** (what must be TRUE):
  1. Each stop's slides, read in sequence, tell a self-contained story with a clear opening, supporting evidence, and a conclusion
  2. Reading through all 5 stops in order, the narrative builds — early stops establish the problem, later stops deliver the solution, the final stop lands the summary
  3. No stop feels padded (excessive slides restating the same point) and no stop feels thin (a single slide where two or three would build the case)
**Plans**: TBD

Plans:
- [ ] 08-01: Cross-stop narrative review and final adjustments to pacing, slide count, and transitional framing

## Progress

**Execution Order:**
Phases execute in numeric order: 5 → 6 → 7 → 8

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Foundation | v1.0 | 5/5 | Complete | 2026-03-15 |
| 2. Navigation and Slides | v1.0 | 5/5 | Complete | 2026-03-15 |
| 3. Map and Car Animation | v1.0 | 5/5 | Complete | 2026-03-15 |
| 3.1. Design System Integration | v1.0 | 4/4 | Complete | 2026-03-15 |
| 3.2. Stop Marker Redesign | v1.0 | 2/2 | Complete | 2026-03-15 |
| 3.3. Progress Track Redesign | v1.0 | 2/2 | Complete | 2026-03-15 |
| 3.4. Map Visual Redesign | v1.0 | 1/1 | Complete | 2026-03-15 |
| 4. Content and Polish | v1.0 | 2/2 | Complete | 2026-03-15 |
| 5. Assignment Coverage Audit | v1.1 | 0/2 | Not started | - |
| 6. Diagram Planning and Implementation | v1.1 | 0/2 | Not started | - |
| 7. Per-Stop Copy and Visual Refinement | v1.1 | 0/3 | Not started | - |
| 8. Narrative Polish | v1.1 | 0/1 | Not started | - |
