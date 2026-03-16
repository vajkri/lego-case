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
            ['Design system', 'Shared tokens + Storybook', 'Consistency across teams'],
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
      heading: 'Experience-First Architecture',
      blocks: [
        {
          type: 'bullet-list',
          variant: 'yellow',
          items: [
            'Server Components render static content on the server: zero JavaScript sent to the browser for content that never changes',
            'Client Components add interactivity only where needed: animations, games, drag interactions',
            'The split is explicit at the code level: `use client` marks the boundary, not a config file',
            'Low-end devices on slow networks get full content instantly; rich interactions layer on top progressively',
          ],
        },
        {
          type: 'callout',
          text: 'We ship less JavaScript to the browser while keeping every interaction as playful as kids expect.',
        },
      ],
    },
    {
      heading: 'Component Architecture',
      blocks: [
        {
          type: 'numbered-steps',
          variant: 'yellow',
          steps: [
            {
              title: 'Build Locally First',
              description: 'Teams own components within their feature area. No approval gates, no shared-component bottlenecks. Move fast and ship.',
            },
            {
              title: 'Document in Storybook',
              description: 'Every component gets a story. Storybook is the single source of visual truth, searchable by any team, reviewable by design.',
            },
            {
              title: 'Promote When Reused',
              description: 'If a second team wants the same component, it moves to the shared layer. The design system grows organically from real usage.',
            },
          ],
        },
      ],
    },
    {
      heading: 'Design System Strategy',
      blocks: [
        {
          type: 'two-column-cards',
          variant: 'default',
          cards: [
            {
              title: 'Shared Layer',
              description: 'Design tokens (colors, spacing, typography), core UI primitives (buttons, form elements, layout). Owned by Platform Team. Stable and versioned.',
            },
            {
              title: 'Feature Layer',
              description: 'Team-specific components: avatar cards, quest progress UI, campaign widgets, story panels. Owned by the team that builds them.',
            },
          ],
        },
        {
          type: 'callout',
          text: 'Lightweight, not restrictive. Teams move fast, the system grows organically.',
        },
      ],
    },
  ],
}
