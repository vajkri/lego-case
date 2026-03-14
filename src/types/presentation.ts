// src/types/presentation.ts
// Locked interface contracts for the presentation state machine.
// Defined in Phase 1 and consumed by all subsequent phases.
// Phase 3 additions: isCarTraveling, awaitingSlideOpen, visitedStops fields; ARRIVE action.
// Phase 4 additions: ContentBlock discriminated union; Slide.lines replaced with Slide.blocks.

import type { BlockVariant } from '@/components/ui/content-blocks/variants'

/**
 * Discriminated union of the 6 content block types.
 * Each member maps 1:1 to a UI component in src/components/ui/content-blocks/.
 */
export type ContentBlock =
  | { type: 'bullet-list'; heading?: string; items: string[]; variant?: BlockVariant }
  | { type: 'two-column-cards'; cards: { title: string; description: string }[]; variant?: BlockVariant }
  | { type: 'entity-cards'; entities: { initials: string; title: string; description: string }[]; variant?: BlockVariant }
  | { type: 'numbered-steps'; steps: { title: string; description: string }[]; variant?: BlockVariant }
  | { type: 'callout'; text: string }
  | { type: 'data-table'; headers: string[]; rows: string[][]; variant?: BlockVariant }

export interface Slide {
  heading: string
  /**
   * Typed content blocks rendered by SlideContent's block dispatcher.
   * Each block maps to one of the 6 UI components (BulletList, TwoColumnCards,
   * EntityCards, NumberedSteps, CalloutBox, DataTable).
   * Replaces the flat lines: string[] shape from Phase 1.
   */
  blocks: ContentBlock[]
}

export interface Stop {
  /** URL-safe identifier, e.g. 'the-case', 'vision' */
  slug: string
  /** Display name shown on city node, e.g. 'The Case' */
  label: string
  /**
   * Position on the map canvas as percentages of the SVG viewport dimensions.
   * Placeholder values used in Phase 1; real values assigned during Phase 3 map design.
   */
  coordinates: {
    x: number  // % of SVG viewport width, e.g. 45.2
    y: number  // % of SVG viewport height, e.g. 32.1
  }
  /** Manual label positioning above or below the brick marker -- set per stop to avoid road overlap */
  labelPosition: 'above' | 'below'
  slides: Slide[]
}

export interface PresentationState {
  /** Index into the stops[] array (0-based) */
  currentStop: number
  /** Index into stops[currentStop].slides (0-based) */
  currentSlide: number
  /** 'map' = map view; 'slide' = slide overlay is open */
  mode: 'map' | 'slide'
  /** true while car is animating between stops — ADVANCE is a no-op during travel (Phase 3) */
  isCarTraveling: boolean
  /** true after car arrives at stop — next ADVANCE opens the slide overlay instead of starting travel (Phase 3) */
  awaitingSlideOpen: boolean
  /** Indices of stops the car has reached — drives MAP-03 visited visual state (Phase 3) */
  visitedStops: number[]
}

/**
 * Reducer actions for the presentation state machine.
 * Implemented as stubs in Phase 1 (console.log only).
 * Phase 2 fills in real navigation logic.
 * Phase 3 adds ARRIVE for car animation completion.
 *
 * ADVANCE:      ArrowRight / Space — advance to next slide or next stop
 * BACK:         ArrowLeft          — go back one slide or close and return to map
 * CLOSE:        Escape             — close slide overlay and return to map
 * JUMP_TO_STOP: Clicking a stop node or footer circle — jump directly to that stop's first slide
 *               (Added in Phase 2 per CONTEXT.md approved decision)
 * ARRIVE:       Dispatched by CarElement.onAnimationComplete when car reaches target stop (Phase 3)
 */
export type Action =
  | { type: 'ADVANCE' }
  | { type: 'BACK' }
  | { type: 'CLOSE' }
  | { type: 'JUMP_TO_STOP'; stopIndex: number }
  | { type: 'ARRIVE' }  // dispatched by CarElement.onAnimationComplete when car reaches target stop
