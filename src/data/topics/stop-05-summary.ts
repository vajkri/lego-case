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
      heading: 'What This Enables',
      blocks: [
        {
          type: 'bullet-list',
          variant: 'default',
          items: [
            'Multiple teams shipping independently from day one',
            'Playful, animated experiences that perform on low-end devices',
            'Privacy-safe analytics aligned to engagement and retention metrics',
            'Safe migration with no business disruption',
            'A reliable platform that scales as the organization grows',
          ],
        },
      ],
    },
    {
      heading: 'Questions?',
      blocks: [
        {
          type: 'callout',
          variant: 'default',
          text: 'Ready to walk through any part of the proposal in detail.',
        },
      ],
    },
  ],
}
