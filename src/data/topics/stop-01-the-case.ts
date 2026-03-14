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
      heading: 'Why We Are Here',
      blocks: [
        {
          type: 'callout',
          text: 'kids.lego.com runs on AngularJS — a framework that reached end-of-life in 2022. This is a business continuity issue, not just a technology upgrade.',
        },
        {
          type: 'bullet-list',
          variant: 'red',
          items: [
            'No server-side rendering — every page load starts from a blank HTML shell',
            'No TypeScript — runtime errors surface in production, not at build time',
            'No modern tooling — slow builds, no tree-shaking, no code splitting',
            'Fighting the framework — workarounds outnumber conventions',
          ],
        },
      ],
    },
    {
      heading: 'Business Requirements',
      blocks: [
        {
          type: 'two-column-cards',
          variant: 'yellow',
          cards: [
            {
              title: 'Fast, Engaging Experiences',
              description: 'Deliver playful, interactive experiences for children aged 6–12 that load instantly on any device, anywhere in the world.',
            },
            {
              title: 'Multi-Team Parallel Work',
              description: 'Platform and Content/Campaign teams ship independently without stepping on each other — clear ownership, shared standards.',
            },
            {
              title: 'Global Performance + Carbon-Aware',
              description: 'Sub-second loads in emerging markets with low-bandwidth modes, resilient media delivery, and localization built in from day one.',
            },
            {
              title: 'Privacy-First by Design',
              description: 'COPPA and GDPR-K compliance from the ground up — no PII, no persistent identifiers, anonymous-only engagement signals.',
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
            'Hosting from Billund co-location datacenter — no cloud migration in scope',
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
