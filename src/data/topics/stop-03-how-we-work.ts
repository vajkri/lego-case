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
          variant: 'default',
          entities: [
            {
              initials: 'PT',
              title: 'Platform Team',
              description: 'App shell, routing, performance budgets, shared libraries, CI/CD pipeline, developer tooling.',
            },
            {
              initials: 'CT',
              title: 'Content & Storytelling Team',
              description: 'Campaigns, content pages, interactive experiences, seasonal features. Ships fast within platform boundaries.',
            },
            {
              initials: 'FT',
              title: 'Future Teams',
              description: 'Additional teams (e.g. Games & Interactives) join the monorepo as the platform scales. Same tools, same standards.',
            },
          ],
        },
        {
          type: 'callout',
          variant: 'default',
          text: 'Safety & Community is a cross-cutting governance function. Reviews features involving user data and community elements; defines COPPA/GDPR-K requirements.',
        },
      ],
    },
    {
      heading: 'CI/CD and Release Strategy',
      blocks: [
        {
          type: 'numbered-steps',
          variant: 'default',
          steps: [
            {
              title: 'Trunk-based development',
              description: 'Short-lived feature branches, merge to main daily.',
            },
            {
              title: 'Single centralized pipeline',
              description: 'Lint, test, build on every merge to main.',
            },
            {
              title: 'Automatic deploy to staging',
              description: 'Every green build goes to staging immediately.',
            },
            {
              title: 'Manual promotion to production',
              description: 'Safety & Community can gate sensitive features; feature flags for gradual rollout.',
            },
          ],
        },
        {
          type: 'callout',
          variant: 'default',
          text: 'If build times grow, introduce Turborepo for dependency-aware builds. Split pipelines further as the team count and codebase scale.',
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
          text: 'Fast pipelines, high confidence. Test what matters, skip what does not.',
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
            'Page view tracking limited to top-level screens only, not every internal navigation',
            'No personally identifiable information collected at any point',
            'No persistent identifiers without explicit consent. Anonymous session IDs only',
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
              description: 'IP anonymization on every request. No PII in any event payload. All reporting is aggregated, no individual user trails.',
            },
          ],
        },
      ],
    },
  ],
}
