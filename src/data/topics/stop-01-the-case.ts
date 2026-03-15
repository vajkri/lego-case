// src/data/topics/stop-01-the-case.ts
import type { Stop } from '@/types/presentation'

export const stopTheCase: Stop = {
  slug: 'the-case',
  label: 'The Case',
  // Coordinates updated in Phase 3 to match actual SVG road positions.
  // Update together with ROAD_PATH_D and STOP_OFFSETS in RoadPath.tsx if road geometry changes.
  coordinates: { x: 12, y: 80 },
  labelPosition: 'above',
  slides: [
    {
      heading: 'Where We Are Today',
      blocks: [
        {
          type: 'bullet-list',
          variant: 'default',
          items: [
            'Several million monthly active users across global markets',
            'AngularJS frontend, Node.js/Express.js backend, headless WordPress CMS',
            'Hosted from Billund co-location datacenter',
            'One feature team: PM, designer, UX, frontend + backend engineers',
            'Built as a content host to guide kids away from LEGO.com',
          ],
        },
        {
          type: 'bullet-list',
          heading: 'What holds us back',
          variant: 'red',
          items: [
            'Architecture wasn\u2019t designed for rich interactivity: games, social mechanics, progression',
            'Single team owns everything, can\u2019t parallelize as ambitions grow',
            'No ISR, streaming, or per-route rendering strategies: harder to optimize per device and network',
            'AngularJS has a shrinking ecosystem: harder to hire, fewer community resources',
          ],
        },
      ],
    },
    {
      heading: 'Goals',
      blocks: [
        {
          type: 'callout',
          variant: 'default',
          text: 'Data shows kids.lego.com is often the first brand touchpoint, especially in emerging markets. We want to reshape it into a dedicated experience for 6\u201312-year-olds.',
        },
        {
          type: 'two-column-cards',
          variant: 'yellow',
          cards: [
            {
              title: 'Fast, Engaging Experiences',
              description: 'Playful, interactive experiences for 6\u201312-year-olds that load instantly on any device, anywhere.',
            },
            {
              title: 'Multi-Team Parallel Work',
              description: 'Multiple teams ship independently with clear ownership and shared standards.',
            },
            {
              title: 'Global Performance',
              description: 'Optimized for emerging markets: low-bandwidth modes, resilient media, localization, carbon-aware delivery.',
            },
            {
              title: 'Privacy-First by Design',
              description: 'COPPA and GDPR-K compliant from the ground up: no PII, no persistent identifiers.',
            },
          ],
        },
      ],
    },
    {
      heading: 'Assumptions',
      blocks: [
        {
          type: 'bullet-list',
          variant: 'default',
          items: [
            'Two engineering teams to start: Platform Team and Content/Campaign Team',
            'Existing Node.js/Express.js backend and headless CMS (WordPress) remain in place',
            'Hosting from Billund co-location datacenter, no cloud migration in scope',
            'Design team will deliver LEGO-specific visual guidelines before component work begins',
            'Safety & Privacy team defines COPPA/GDPR-K compliance requirements upfront',
          ],
        },
      ],
    },
    {
      heading: 'What Success Looks Like',
      blocks: [
        {
          type: 'data-table',
          variant: 'default',
          headers: ['Metric', 'Target'],
          rows: [
            ['Day-1 retention (D1)', '> 40%'],
            ['Day-7 retention (D7)', '> 20%'],
            ['Day-30 retention (D30)', '> 10%'],
            ['Session depth (pages per visit)', '> 4'],
            ['Engagement rate (interactions per session)', '> 3'],
            ['Page load time (LCP)', '< 2.5 s'],
          ],
        },
        {
          type: 'callout',
          text: 'We stop measuring pages viewed and start measuring play experiences completed.',
        },
      ],
    },
  ],
}
