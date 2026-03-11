// src/types/presentation.ts
// Locked interface contracts for the presentation state machine.
// Defined in Phase 1 and consumed by all subsequent phases.
// Do NOT add fields to PresentationState or Action in Phase 2+ without revising this file.

export interface Slide {
  heading: string
  /**
   * Minimum concrete content shape.
   * Each string is one bullet-point line rendered in the slide body.
   * React.ReactNode upgrade deferred to Phase 2+ if richer content is needed.
   */
  lines: string[]
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
  slides: Slide[]
}

export interface PresentationState {
  /** Index into the stops[] array (0-based) */
  currentStop: number
  /** Index into stops[currentStop].slides (0-based) */
  currentSlide: number
  /** 'map' = map view; 'slide' = slide overlay is open */
  mode: 'map' | 'slide'
}

/**
 * Reducer actions for the presentation state machine.
 * Implemented as stubs in Phase 1 (console.log only).
 * Phase 2 fills in real navigation logic.
 *
 * ADVANCE: ArrowRight / Space — advance to next slide or next stop
 * BACK:    ArrowLeft          — go back one slide or close and return to map
 * CLOSE:   Escape             — close slide overlay and return to map
 */
export type Action =
  | { type: 'ADVANCE' }
  | { type: 'BACK' }
  | { type: 'CLOSE' }
