// src/data/topics/stop-03-how-we-work.ts
import type { Stop } from '@/types/presentation'

export const stopHowWeWork: Stop = {
  slug: 'how-we-work',
  label: 'How We Work',
  coordinates: { x: 50, y: 55 },
  slides: [
    {
      heading: 'Team Structure',
      lines: [
        'Two primary engineering teams: Platform Team and Content / Campaign Team',
        'Platform Team owns the core application shell, routing, performance, infrastructure, shared libraries, CI/CD, and developer tooling',
        'Content / Campaign Team owns campaigns, content pages, interactive experiences, and seasonal features',
        'Safety and privacy stakeholders review all features involving user data, interaction mechanics, and community or social features',
      ],
    },
    {
      heading: 'Storybook as Component Registry',
      lines: [
        'A single global Storybook instance serves as the component catalogue, documentation hub, and discovery tool',
        'Teams can easily discover existing components to prevent duplication',
        'Supports visual testing and improves collaboration between teams and designers',
        'Suggested structure: Foundations, Shared Components, Platform Components, Campaign Components, Feature Components',
      ],
    },
    {
      heading: 'CI/CD Strategy',
      lines: [
        'Start with a single centralized CI/CD pipeline',
        'Only two primary engineering teams makes simpler governance and easier integration testing viable',
        'If build times grow too large, introduce a dependency-aware build system such as Turborepo',
        'Turborepo runs tests only for affected modules, resulting in dramatically faster builds',
      ],
    },
    {
      heading: 'Testing Strategy',
      lines: [
        'CI includes unit tests, integration tests, and selective end-to-end tests',
        'Unit tests cover component rendering logic, props, interactions, and state changes',
        'Integration tests cover navigation, interaction flows, and CMS data integration',
        'End-to-end tests used sparingly for critical user journeys, authentication flows, and major feature areas',
        'Goal: maintain fast pipelines while ensuring reliability',
      ],
    },
    {
      heading: 'Privacy-First Analytics',
      lines: [
        'The platform measures engagement while respecting child privacy',
        'Core events tracked: session start, activity start, badge / reward unlock, progress milestones, return visits, and key interactions',
        'Page view tracking limited to important top-level screens',
        'Avoid tracking identifiable users — collect anonymous interaction data only',
        'No persistent identifiers without consent; pre-login analytics track only aggregated event data',
        'Recommended tooling: privacy-first platforms such as Plausible or an internal analytics pipeline',
        'Requirements: IP anonymization, no PII, aggregated reporting',
      ],
    },
  ],
}
