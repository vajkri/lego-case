// src/data/topics/stop-02-vision.ts
import type { Stop } from '@/types/presentation'

export const stopVision: Stop = {
  slug: 'vision',
  label: 'Vision',
  // Coordinates updated in Phase 3 to match actual SVG road positions.
  // Update together with ROAD_PATH_D and STOP_OFFSETS in RoadPath.tsx if road geometry changes.
  coordinates: { x: 27, y: 67 },
  labelPosition: 'above',
  slides: [
    {
      heading: 'System Overview',
      blocks: [
        {
          type: 'data-table',
          variant: 'default',
          headers: ['Layer', 'Technology', 'Role'],
          rows: [
            ['Frontend', 'Next.js (React)', 'App shell, routing, rendering strategies, UI'],
            ['Design system', 'Figma tokens + Storybook', 'Consistency across teams'],
            ['CDN', 'Edge caching', 'Static assets, ISR pages, images for global reach'],
            ['Backend (existing)', 'Node.js/Express.js', 'API layer, CMS integration, microservices'],
            ['CMS (existing)', 'Headless WordPress', 'Content management'],
            ['Hosting (existing)', 'Billund co-location', 'Infrastructure'],
          ],
        },
      ],
    },
    {
      heading: 'Why React + Next.js',
      blocks: [
        {
          type: 'two-column-cards',
          variant: 'default',
          cards: [
            {
              title: 'Largest Ecosystem',
              description: 'Powers 45% of professional web development. The largest talent pool, which matters when scaling to multiple teams.',
            },
            {
              title: 'Less JavaScript Shipped',
              description: 'React Server Components keep JS off the client. Critical for cheap devices in emerging markets.',
            },
            {
              title: 'Progressive Loading',
              description: 'Streaming and Suspense load content progressively; users see meaningful UI before all data has arrived.',
            },
            {
              title: 'Great fit for CMS Content',
              description: 'ISR regenerates pages on demand. No full rebuild when content editors publish.',
            },
            {
              title: 'Global by Default',
              description: 'Built-in i18n, image optimization, and font optimization for a worldwide kids audience.',
            },
            {
              title: 'AI-Ready Development',
              description: 'Dominant in LLM training data. AI tools write, debug, and refactor React measurably better than less-represented stacks.',
            },
          ],
        },
      ],
    },
    {
      heading: 'Frontend Architecture',
      blocks: [
        {
          type: 'bullet-list',
          variant: 'default',
          items: [
            'A governed monorepo over micro-frontends: shared components, tokens, and tooling in one dependency tree',
            'Teams own feature directories',
            'Shared code maintained by Platform, contributed to by all via PR with team-owner approval',
          ],
        },
        {
          type: 'diagram',
          variant: 'default',
          content:
            'src/\n' +
            '\u251C\u2500\u2500 components/\n' +
            '\u2502   \u2514\u2500\u2500 shared/         Design system, shared UI\n' +
            '\u251C\u2500\u2500 features/\n' +
            '\u2502   \u251C\u2500\u2500 campaigns/      Content, promotions, experiences\n' +
            '\u2502   \u251C\u2500\u2500 games/          Quests, challenges, play\n' +
            '\u2502   \u2514\u2500\u2500 shell/          App shell, routing, layouts\n' +
            '\u2514\u2500\u2500 styles/\n' +
            '    \u2514\u2500\u2500 tokens/         Design tokens (Figma sync)',
        },
      ],
    },
    {
      heading: 'Component Workflow',
      blocks: [
        {
          type: 'numbered-steps',
          variant: 'default',
          steps: [
            {
              title: 'Tokens mirror Figma',
              description: 'Design tokens are the single source of truth, documented in Storybook and kept in sync with Figma.',
            },
            {
              title: 'Stories live with components',
              description: 'Every shared component has a co-located story. Storybook is set up from day one.',
            },
            {
              title: 'Build locally, promote when reused',
              description: 'Teams build in their feature directory. When a second team needs it, it moves to shared via PR with Platform review.',
            },
            {
              title: 'Visual regression catches drift',
              description: 'Storybook snapshots detect unintended changes to shared components before they reach production.',
            },
          ],
        },
      ],
    },
  ],
}
