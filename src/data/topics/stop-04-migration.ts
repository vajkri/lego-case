// src/data/topics/stop-04-migration.ts
import type { Stop } from '@/types/presentation'

export const stopMigration: Stop = {
  slug: 'migration',
  label: 'Migration',
  // Coordinates updated in Phase 3 to match actual SVG road positions.
  // Update together with ROAD_PATH_D and STOP_OFFSETS in RoadPath.tsx if road geometry changes.
  coordinates: { x: 58, y: 56 },
  labelPosition: 'above',
  slides: [
    {
      heading: 'Incremental Route Migration',
      lines: [
        'The platform currently uses AngularJS, which is end-of-life',
        'Migration must balance risk, development velocity, and operational stability',
        'Selected approach: incremental route migration — migrate one route at a time',
        'Gradually replace AngularJS pages with Next.js pages',
        'This hybrid approach reduces risk, allows early validation, and supports gradual rollout',
      ],
    },
    {
      heading: 'Migration Steps',
      lines: [
        'Step 1: Establish Next.js foundation — routing, SSR, navigation, layout components',
        'Navigation can be recreated early as it is relatively simple',
        'Step 2: Migrate first route — start with a simple route with minimal dependencies to validate architecture and test the deployment pipeline',
        'Step 3: Iterate route by route — group routes by type: campaign pages, game pages, content pages, profile areas',
        'Step 4: Replace AngularJS sections — as routes migrate, AngularJS sections shrink until it can be fully removed',
      ],
    },
    {
      heading: 'Risk Mitigation',
      lines: [
        'Legacy integration complexity: start with simple routes and gradually handle complex integrations',
        'Performance on low-end devices: enforce strict performance budgets and minimize JavaScript where possible',
        'Team coordination: use shared Storybook, component discovery, and clear ownership boundaries',
      ],
    },
  ],
}
