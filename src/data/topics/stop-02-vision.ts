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
      heading: 'Why React + Next.js',
      blocks: [
        {
          type: 'two-column-cards',
          variant: 'default',
          cards: [
            {
              title: 'SSR, SSG, and ISR Built In',
              description: 'Next.js ships server-side rendering, static generation, and incremental regeneration out of the box — exactly what a globally distributed kids platform needs for fast first loads.',
            },
            {
              title: 'App Router for Nested Layouts',
              description: 'The App Router lets Platform and Campaign teams own their layouts independently. Shared chrome wraps feature routes without code coupling.',
            },
            {
              title: 'React Ecosystem + TypeScript',
              description: 'The largest frontend ecosystem on the planet — battle-tested libraries, rich tooling, first-class TypeScript support. Our teams hire for this stack.',
            },
            {
              title: 'i18n + Image Optimization',
              description: 'Built-in internationalization and automatic image optimization mean emerging market support is configuration, not custom engineering.',
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
            'Server Components render static content on the server — zero JavaScript sent to the browser for content that never changes',
            'Client Components add interactivity only where the experience demands it — animations, games, drag interactions',
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
              description: 'Teams own components within their feature area. No approval gates, no shared-component bottlenecks — move fast and ship.',
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
          text: 'Lightweight, not restrictive — teams move fast, the system grows organically.',
        },
      ],
    },
  ],
}
