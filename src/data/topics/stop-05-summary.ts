// src/data/topics/stop-05-summary.ts
import type { Stop } from '@/types/presentation'

export const stopSummary: Stop = {
  slug: 'summary',
  label: 'Summary',
  coordinates: { x: 85, y: 50 },
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
