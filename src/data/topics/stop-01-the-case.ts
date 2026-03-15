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
            'AngularJS frontend, Node.js/Express.js backend, headless WordPress CMS, hosted from Billund',
            'Several million global active users, but primarily a content host to guide kids away from LEGO.com',
            'Architecture not designed for rich interactivity, games, social mechanics, or progression',
            'Single team owns everything; cannot parallelize as ambitions grow',
            'AngularJS end-of-life: no SSR/SSG/ISR, shrinking ecosystem',
          ],
        },
        {
          type: 'callout',
          variant: 'yellow',
          text: 'Data shows kids.lego.com is often the first brand touchpoint, especially in emerging markets. ' +
              'The new business strategy calls for reshaping it into a dedicated experience for 6 to 12-year-olds.',
        },
      ],
    },
    {
      heading: 'Functional Requirements',
      blocks: [
        {
          type: 'bullet-list',
          variant: 'default',
          heading: 'Experience',
          items: [
            'Kid-first visual language, navigation, and interactions for ages 6 to 12',
            'Story-driven flows, micro-interactions, progress systems, and collections',
          ],
        },
        {
          type: 'bullet-list',
          variant: 'default',
          heading: 'Social and gaming',
          items: [
            'Safe-by-design mechanics: challenges, badges, quests, build prompts',
          ],
        },
        {
          type: 'bullet-list',
          variant: 'default',
          heading: 'Content',
          items: [
            'Episodic content and progression to drive longer sessions and return visits',
            'Localization and emerging market support',
          ],
        },
      ],
    },
    {
      heading: 'Non-Functional Requirements',
      blocks: [
        {
          type: 'data-table',
          variant: 'default',
          headers: ['Area', 'Requirement'],
          rows: [
            ['Performance', 'Optimized for low-end devices and networks; carbon-aware delivery'],
            ['Accessibility', 'WCAG with child-specific usability; age-appropriate language; strong visual cues'],
            ['Safety', 'COPPA and GDPR-K compliant; parental gates; no PII or persistent identifiers'],
            ['Scalability', 'Architecture supports multiple teams working in parallel with independent delivery'],
            ['Success metrics', 'Retention (D1/D7/D30) and session depth over page views and top-of-funnel reach'],
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
            'Existing headless CMS and microservices (auth, progress, profiles) remain',
            'Next.js replaces the Express.js layer, no new backend services or databases are introduced',
            'Two engineering teams to start: Platform Team and Content & Storytelling Team',
            'Safety & Privacy team defines COPPA/GDPR-K compliance requirements upfront',
          ],
        },
      ],
    },
  ],
}
