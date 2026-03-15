// src/data/topics/stop-05-summary.ts
import type { Stop } from '@/types/presentation'

export const stopSummary: Stop = {
  slug: 'summary',
  label: 'Summary',
  // Coordinates updated in Phase 3 to match actual SVG road positions.
  // Update together with ROAD_PATH_D and STOP_OFFSETS in RoadPath.tsx if road geometry changes.
  coordinates: { x: 85, y: 47 },
  labelPosition: 'above',
  slides: [
    {
      heading: 'What We Are Proposing',
      blocks: [
        {
          type: 'bullet-list',
          variant: 'yellow',
          items: [
            'Scalable multi-team development: Platform and Campaign teams ship independently inside a shared monorepo',
            'Rapid campaign iteration: feature components owned locally, promoted to shared when needed, zero governance bottlenecks',
            'Privacy-first analytics: anonymous-only event data, no PII, COPPA and GDPR-K compliant from day one',
            'Modern performance architecture: SSR, Server Components, and image optimization for a global audience of children',
            'Safe incremental migration: one route at a time, zero business disruption, AngularJS retires gracefully',
          ],
        },
      ],
    },
    {
      heading: 'Questions?',
      blocks: [
        {
          type: 'callout',
          text: 'We are ready to walk through any part of the proposal in detail.',
        },
      ],
    },
  ],
}
