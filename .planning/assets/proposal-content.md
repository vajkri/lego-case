# kids.lego.com – Frontend Architecture Proposal
*A scalable, privacy-first platform for engaging digital experiences for children*

---

# 1. Goals

The new frontend platform should:

- Deliver **fast, engaging experiences** for children aged 6–12
- Support **multiple teams working in parallel**
- Maintain **high performance globally and carbon-aware delivery**
- Focus on **inclusivity and accessibility for children**
- Enable **rapid campaign/content updates**
- Ensure **privacy-first analytics** compliant with COPPA and GDPR
- Support for **emerging markets** 
  - (low bandwidth modes, resilient media delivery, localization, and device constraints).

Key success metrics from the business perspective:

- User retention (D1, D7, D30)
- Session length & depth
- Engagement and loyalty

---

# 2. Frontend Architecture

## Core Approach

The platform will use a **modular frontend architecture within a monorepo**.

Goals:

- Shared tooling and standards
- Easy cross-team collaboration
- Simplified dependency management
- Clear ownership boundaries

### Monorepo Advantages

- Easier sharing of:
    - UI components
    - utilities
    - design tokens
- Consistent CI/CD pipeline
- Simplified refactoring
- Unified dependency management

This is especially beneficial because only **a small number of teams contribute frontend code**.

---

# 3. Team Structure

Two primary engineering teams:

### Platform Team
Responsible for:

- core application shell
- routing
- performance
- infrastructure
- shared libraries
- CI/CD
- developer tooling

### Content / Campaign Team

Responsible for:

- campaigns
- content pages
- interactive experiences
- seasonal features

### Safety & Privacy Oversight

Safety and privacy stakeholders must review features involving:

- user data
- interaction mechanics
- community or social features

---

# 4. Component Architecture

## Principle: Velocity First

To avoid bottlenecks, teams **own their components locally first**.

Workflow:

1. Team builds component within their feature area
2. Component is documented in Storybook
3. If reused by multiple teams → promoted to shared component

This ensures:

- rapid iteration
- minimal governance overhead
- organic growth of the design system

---

# 5. Design System Strategy

The design system should be **lightweight**, not restrictive.

## Shared Design Assets

Shared layer contains:

- design tokens (colors, spacing, typography)
- core UI primitives
    - buttons
    - form elements
    - layout primitives
    - base typography

## Feature Components

Teams create components specific to their features:

Examples:

- avatar cards
- activity widgets
- quest progress UI
- story interaction panels

If reused widely → promoted into the shared system.

---

# 6. Storybook as Component Registry

A **single global Storybook instance** will serve as:

- component catalogue
- documentation hub
- discovery tool for teams

Benefits:

- teams can easily discover existing components
- prevents duplication
- supports visual testing
- improves collaboration between teams and designers

Suggested structure:
* Storybook
* Foundations
* Shared Components
* Platform Components
* Campaign Components
* Feature Components

---

# 7. CI/CD Strategy

Start with a **single centralized CI/CD pipeline**.

Reasons:

- only two primary engineering teams
- simpler governance
- easier integration testing

If build times grow too large, introduce optimization.

### Optimization Option

Use a **dependency-aware build system** (e.g. Turborepo).

Benefits:

- runs tests only for affected modules
- dramatically faster builds
- ideal for large monorepos

---

# 8. Testing Strategy

CI should include:

### Unit Tests

Test component behavior:

- rendering logic
- props
- interactions
- state changes

### Integration Tests

Test key flows:

- navigation
- interaction flows
- CMS data integration

### End-to-End Tests (Selective)

Use sparingly for:

- critical user journeys
- authentication flows
- major feature areas

Goal: **maintain fast pipelines while ensuring reliability**.

---

# 10. Analytics & Measurement

The platform should measure engagement while respecting child privacy.

## Key Events to Track

Core engagement events:

- session start
- activity start
- badge / reward unlock
- progress milestones
- return visits
- key interactions

Page view tracking should be limited to **important top-level screens**.

---

# 11. Privacy-First Analytics

Because the platform targets children:

- avoid tracking identifiable users
- collect **anonymous interaction data**
- no persistent identifiers without consent

Pre-login analytics should:

- only track **aggregated event data**
- not store identifiable information

---

# 12. Analytics Pipeline

Recommended approach:

- send anonymous event data
- store aggregated interaction metrics
- visualize engagement trends

Possible tooling:

- privacy-first analytics platforms (e.g. Plausible)
- or internal analytics pipeline

Important requirements:

- IP anonymization
- no PII
- aggregated reporting

---

# 13. Migration Strategy

The platform currently uses **AngularJS**, which is end-of-life.

Migration should balance:

- risk
- development velocity
- operational stability

## Selected Approach: Incremental Route Migration

A hybrid approach:

- migrate **one route at a time**
- gradually replace AngularJS pages with Next.js pages

This approach:

- reduces risk
- allows early validation
- supports gradual rollout

---

# 14. Migration Steps

### Step 1 – Establish Next.js Foundation

Create the new application shell:

- routing
- SSR
- navigation
- layout components

Navigation can be recreated early since it is relatively simple.

---

### Step 2 – Migrate First Route

Start with a **simple route with minimal dependencies**.

Goals:

- validate architecture
- test deployment pipeline
- ensure SSR works correctly

---

### Step 3 – Iterate Route by Route

Gradually migrate additional routes.

Routes should be grouped by type:

Examples:

- campaign pages
- game pages
- content pages
- profile areas

Each migration follows the same pattern.

---

### Step 4 – Replace AngularJS Sections

As routes migrate:

- AngularJS sections shrink
- Next.js gradually takes over

Eventually AngularJS can be fully removed.

---

# 15. Risk Mitigation

Risks include:

### Legacy Integration Complexity
Mitigation:
- start with simple routes
- gradually handle complex integrations

### Performance on Low-End Devices
Mitigation:
- strict performance budgets
- minimal JavaScript where possible

### Team Coordination
Mitigation:
- shared Storybook
- component discovery
- clear ownership boundaries

---

# 16. Summary

This architecture enables:

- scalable multi-team development
- rapid campaign iteration
- privacy-first analytics
- modern performance architecture
- safe incremental migration from AngularJS

The result is a **flexible, maintainable platform designed for engaging digital play experiences for children.**