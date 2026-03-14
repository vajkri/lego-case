// src/data/topics/stop-03-how-we-work.ts
import type { Stop } from '@/types/presentation'

export const stopHowWeWork: Stop = {
  slug: 'how-we-work',
  label: 'How We Work',
  // Coordinates updated in Phase 3 to match actual SVG road positions.
  // Update together with ROAD_PATH_D and STOP_OFFSETS in RoadPath.tsx if road geometry changes.
  coordinates: { x: 39, y: 89 },
  labelPosition: 'below',
  slides: [
    {
      heading: 'Team Structure',
      blocks: [
        {
          type: 'entity-cards',
          variant: 'yellow',
          entities: [
            {
              initials: 'PT',
              title: 'Platform Team',
              description: 'Owns the core application shell, routing, performance budgets, shared libraries, CI/CD pipeline, developer tooling, and infrastructure.',
            },
            {
              initials: 'CC',
              title: 'Content / Campaign Team',
              description: 'Owns campaigns, content pages, interactive experiences, and seasonal features. Ships fast within the platform boundaries.',
            },
            {
              initials: 'SP',
              title: 'Safety & Privacy',
              description: 'Reviews all features involving user data, interaction mechanics, and community or social elements. Defines COPPA/GDPR-K requirements.',
            },
          ],
        },
        {
          type: 'callout',
          text: 'Additional teams (Localization, Accessibility, Game) join the monorepo as the platform scales — same tools, same standards.',
        },
      ],
    },
    {
      heading: 'Storybook as Component Registry',
      blocks: [
        {
          type: 'bullet-list',
          variant: 'default',
          items: [
            'A single global Storybook instance is the component catalogue, documentation hub, and discovery tool for every team',
            'Teams search before building — prevents duplication before it starts',
            'Visual testing catches regressions without writing pixel-diff tests by hand',
            'Designers review components directly in Storybook — no staging environment needed for visual sign-off',
          ],
        },
        {
          type: 'data-table',
          variant: 'default',
          headers: ['Category', 'Contents'],
          rows: [
            ['Foundations', 'Tokens, typography, color palette, spacing scale'],
            ['Shared', 'Buttons, inputs, cards, layout primitives'],
            ['Platform', 'App shell, navigation, route wrappers'],
            ['Campaign', 'Seasonal banners, promo cards, feature flags'],
            ['Feature', 'Team-specific components not yet promoted to shared'],
          ],
        },
      ],
    },
    {
      heading: 'CI/CD & Release Strategy',
      blocks: [
        {
          type: 'numbered-steps',
          variant: 'red',
          steps: [
            {
              title: 'Start Centralized',
              description: 'A single pipeline for two teams. Simpler governance, easier integration testing, one place to debug failures.',
            },
            {
              title: 'Monitor Build Times',
              description: 'Track pipeline duration as the codebase grows. Set a threshold — if median build time exceeds 10 minutes, it is time to act.',
            },
            {
              title: 'Introduce Turborepo If Needed',
              description: 'Turborepo adds dependency-aware task scheduling to the monorepo. Unchanged packages are cached and skipped automatically.',
            },
            {
              title: 'Run Tests for Affected Modules Only',
              description: 'With Turborepo, a change to the Campaign Team components triggers only Campaign and Shared tests — not the full suite.',
            },
          ],
        },
      ],
    },
    {
      heading: 'Testing Strategy',
      blocks: [
        {
          type: 'data-table',
          variant: 'default',
          headers: ['Layer', 'Scope', 'Tools'],
          rows: [
            ['Unit', 'Component rendering, props, interactions, state changes', 'Vitest + Testing Library'],
            ['Integration', 'Navigation flows, CMS data integration, route behavior', 'Vitest + MSW'],
            ['E2E (selective)', 'Critical journeys, auth flows, major feature areas', 'Playwright'],
          ],
        },
        {
          type: 'callout',
          text: 'Fast pipelines, high confidence — test what matters, skip what does not.',
        },
      ],
    },
    {
      heading: 'Privacy-First Analytics',
      blocks: [
        {
          type: 'bullet-list',
          variant: 'red',
          items: [
            'Core events tracked: session start, activity start, badge unlock, progress milestones, return visits',
            'Page view tracking limited to top-level screens only — not every internal navigation',
            'No personally identifiable information collected at any point',
            'No persistent identifiers without explicit consent — anonymous session IDs only',
          ],
        },
        {
          type: 'two-column-cards',
          variant: 'default',
          cards: [
            {
              title: 'Tooling',
              description: 'Plausible Analytics or an internal event pipeline. Both support anonymous event collection with no third-party tracking scripts.',
            },
            {
              title: 'Compliance',
              description: 'IP anonymization on every request. No PII in any event payload. All reporting is aggregated — no individual user trails.',
            },
          ],
        },
      ],
    },
  ],
}
