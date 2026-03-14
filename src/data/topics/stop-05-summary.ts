// src/data/topics/stop-05-summary.ts
import type { Stop } from '@/types/presentation'

export const stopSummary: Stop = {
  slug: 'summary',
  label: 'Summary',
  // Coordinates updated in Phase 3 to match actual SVG road positions.
  // Update together with ROAD_PATH_D and STOP_OFFSETS in RoadPath.tsx if road geometry changes.
  coordinates: { x: 86, y: 44 },
  labelPosition: 'above',
  slides: [
    {
      heading: 'Summary',
      lines: [
        'This architecture enables scalable multi-team development',
        'Rapid campaign iteration through a flexible component system',
        'Privacy-first analytics compliant with COPPA and GDPR',
        'Modern performance architecture for a global audience of children',
        'Safe incremental migration from AngularJS with minimal operational risk',
        'The result is a flexible, maintainable platform designed for engaging digital play experiences for children',
      ],
    },
  ],
}
