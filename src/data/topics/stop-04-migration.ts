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
      heading: 'Migration Strategy',
      blocks: [
        {
          type: 'callout',
          text: 'We migrate one route at a time. Each migration validates the architecture, tests the pipeline, and ships a win — without touching what is already working.',
        },
        {
          type: 'bullet-list',
          variant: 'default',
          items: [
            'Risk is isolated to one route at a time — a failure in one migration cannot break the rest of the site',
            'Teams validate SSR, deployment, and CMS integration early on a low-stakes route',
            'Each completed migration reduces the AngularJS footprint and builds team confidence',
            'No big-bang cutover — the business runs uninterrupted throughout the entire migration',
          ],
        },
      ],
    },
    {
      heading: 'Migration Steps',
      blocks: [
        {
          type: 'numbered-steps',
          variant: 'yellow',
          steps: [
            {
              title: 'Establish the Next.js Foundation',
              description: 'Set up the new application shell: routing, SSR config, navigation, layout components, and CI/CD. Navigation is recreated first — relatively simple and high visibility.',
            },
            {
              title: 'Migrate the First Simple Route',
              description: 'Choose a route with minimal dependencies. Validate architecture end-to-end, prove the deployment pipeline, confirm SSR works correctly in production.',
            },
            {
              title: 'Iterate Route by Route',
              description: 'Group routes by type — campaign pages, game pages, content pages, profile areas. Each group follows the same pattern. Teams build confidence with each iteration.',
            },
            {
              title: 'Replace Remaining AngularJS Sections',
              description: 'As routes migrate, the AngularJS surface shrinks. Once all routes are migrated, AngularJS can be removed entirely and the infrastructure simplified.',
            },
          ],
        },
      ],
    },
    {
      heading: 'Risk Mitigation',
      blocks: [
        {
          type: 'entity-cards',
          variant: 'red',
          entities: [
            {
              initials: 'LC',
              title: 'Legacy Integration Complexity',
              description: 'Start with routes that have minimal AngularJS dependencies. Complex integrations (auth, shared state, deep CMS wiring) come later, once the pattern is proven.',
            },
            {
              initials: 'PF',
              title: 'Performance on Low-End Devices',
              description: 'Enforce strict performance budgets from day one. Server Components minimize JavaScript shipped to the browser. Lighthouse CI gates every pull request.',
            },
            {
              initials: 'TC',
              title: 'Team Coordination',
              description: 'Storybook provides shared component discovery. Clear ownership boundaries prevent both teams from migrating the same route simultaneously.',
            },
          ],
        },
      ],
    },
  ],
}
