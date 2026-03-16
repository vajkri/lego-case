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
          variant: 'yellow',
          text: 'Strangler fig pattern: the new system grows around the old one, route by route, until AngularJS can be retired.',
        },
        {
          type: 'bullet-list',
          variant: 'default',
          heading: 'Why this approach',
          items: [
            'Risk is isolated to one route at a time; a failure cannot break the rest of the site',
            'Teams validate SSR, deployment, and CMS integration early on a low-stakes route',
            'Each completed migration reduces the AngularJS footprint and builds team confidence',
            'No big-bang cutover; the business runs uninterrupted throughout',
          ],
        },
      ],
    },
    {
      heading: 'Migration Steps',
      blocks: [
        {
          type: 'numbered-steps',
          variant: 'default',
          steps: [
            {
              title: 'Establish Next.js foundation',
              description: 'App shell, routing, SSR, navigation, layout components. Navigation first: simple and high visibility.',
            },
            {
              title: 'Route traffic with a reverse proxy',
              description: 'CDN routes migrated paths to Next.js, everything else to AngularJS. One domain, two apps, seamless to users.',
            },
            {
              title: 'Migrate first simple route',
              description: 'Validate architecture, test deployment pipeline, confirm SSR in production. Roll back by flipping the proxy rule.',
            },
            {
              title: 'Iterate route by route',
              description: 'Group by type: campaign pages, game pages, content pages. Each follows the same pattern.',
            },
            {
              title: 'Retire AngularJS',
              description: 'As routes migrate, the AngularJS surface shrinks. Once empty, remove it entirely and simplify infrastructure.',
            },
          ],
        },
      ],
    },
  ],
}
