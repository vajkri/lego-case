// src/data/topics/stop-02-vision.ts
import type { Stop } from '@/types/presentation'

export const stopVision: Stop = {
  slug: 'vision',
  label: 'Vision',
  // Coordinates updated in Phase 3 to match actual SVG road positions.
  // Update together with ROAD_PATH_D and STOP_OFFSETS in RoadPath.tsx if road geometry changes.
  coordinates: { x: 23, y: 70 },
  labelPosition: 'above',
  slides: [
    {
      heading: 'Frontend Architecture',
      lines: [
        'The platform will use a modular frontend architecture within a monorepo',
        'Shared tooling and standards across all teams',
        'Easy cross-team collaboration and simplified dependency management',
        'Clear ownership boundaries with unified CI/CD pipeline',
        'Monorepo enables sharing of UI components, utilities, and design tokens',
        'Especially beneficial because only a small number of teams contribute frontend code',
      ],
    },
    {
      heading: 'Component Architecture',
      lines: [
        'Teams own their components locally first to avoid bottlenecks',
        'Team builds component within their feature area',
        'Component is documented in Storybook',
        'If reused by multiple teams, it is promoted to a shared component',
        'This ensures rapid iteration, minimal governance overhead, and organic growth of the design system',
      ],
    },
    {
      heading: 'Design System Strategy',
      lines: [
        'The design system should be lightweight, not restrictive',
        'Shared layer contains design tokens: colors, spacing, typography',
        'Core UI primitives include buttons, form elements, layout primitives, and base typography',
        'Teams create feature-specific components such as avatar cards, activity widgets, quest progress UI, and story interaction panels',
        'Widely reused feature components are promoted into the shared system',
      ],
    },
  ],
}
