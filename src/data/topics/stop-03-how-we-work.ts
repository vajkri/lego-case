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
          type: 'callout',
          variant: 'default',
          text: 'Goal: maintain fast pipelines while ensuring reliability.',
        },
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
          type: 'bullet-list',
          variant: 'default',
          heading: 'Accessibility',
          items: [
            'Automated axe-core checks in CI on every build',
            'Most critical manual accessibility flows scripted with E2E tests and axe-core',
            'Storybook a11y addon for component-level review',
            'ESLint a11y plugin catches issues at development time',
          ],
        },
      ],
    },
    {
      heading: 'Instrumentation and Analytics',
      blocks: [
        {
          type: 'callout',
          variant: 'default',
          text: 'Measure engagement and retention, not page views. Anonymous by default; per-user tracking only with parental consent.',
        },
        {
          type: 'data-table',
          variant: 'default',
          headers: ['Event type', 'Examples', 'Measures'],
          rows: [
            ['Session', 'session_start, session_end', 'Retention (D1/D7/D30)'],
            ['Engagement', 'activity_start, badge_unlock, progress_milestone', 'Session depth, interactions'],
            ['Content', 'content_view, content_complete, series_progress', 'Time spent, completion rates'],
          ],
        },
        {
          type: 'bullet-list',
          variant: 'default',
          heading: 'How it works',
          items: [
            'Anonymous session IDs by default; no persistent identifiers',
            'Authenticated users with parental consent get per-user progress tracking',
            'A/B Testing: Feature flags assign sessions (not users) to experiment groups; compare aggregate metrics across groups',
            'Safety & Community reviews all new event types before they ship',
          ],
        },
      ],
    },
  ],
}
