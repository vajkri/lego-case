// src/data/topics/stop-01-the-case.ts
import type { Stop } from '@/types/presentation'

export const stopTheCase: Stop = {
  slug: 'the-case',
  label: 'The Case',
  coordinates: { x: 15, y: 50 },
  slides: [
    {
      heading: 'Why We Are Here',
      lines: [
        'kids.lego.com currently runs on AngularJS — end of life',
        'No modern tooling, no SSR, no type safety',
        'Migration is a business continuity issue, not just a tech upgrade',
      ],
    },
    {
      heading: 'Goals',
      lines: [
        'Deliver fast, engaging experiences for children aged 6–12',
        'Support multiple teams working in parallel',
        'Maintain high performance globally and carbon-aware delivery',
        'Focus on inclusivity and accessibility for children',
        'Enable rapid campaign and content updates',
        'Ensure privacy-first analytics compliant with COPPA and GDPR',
        'Support emerging markets: low bandwidth, resilient media, localization',
      ],
    },
  ],
}
