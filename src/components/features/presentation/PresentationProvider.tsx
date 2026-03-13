// src/components/features/presentation/PresentationProvider.tsx
// Manages all presentation navigation state.
// Phase 2: real reducer with full navigation logic, triggerRef for focus return.
// Phase 3: two-step car travel flow (ADVANCE → travel, ARRIVE → awaitingSlideOpen, ADVANCE → slide).
'use client'

import { createContext, useContext, useReducer, useRef, ReactNode } from 'react'
import { MotionConfig } from 'motion/react'
import type { PresentationState, Action } from '@/types/presentation'
import { stops } from '@/data/topics'

const initialState: PresentationState = {
  currentStop: 0,
  currentSlide: 0,
  mode: 'map',
  isCarTraveling: false,
  awaitingSlideOpen: false,
  visitedStops: [],  // empty — car starts before stop 0, first ADVANCE drives there
}

/**
 * Presentation state machine — keyboard navigation model (A11Y-05).
 *
 * ADVANCE (ArrowRight / Space):
 *   - Map mode, isCarTraveling: true  → no-op (ignore input during travel)
 *   - Map mode, awaitingSlideOpen: true → opens slide overlay for current stop
 *   - Map mode, parked at stop → starts car travel to next stop (increments currentStop, sets isCarTraveling)
 *   - Map mode, at last stop → no-op
 *   - Slide mode: advances sub-slide; on last sub-slide advances to next stop
 *     (or returns to map if already on the last stop)
 *
 * ARRIVE (dispatched by CarElement.onAnimationComplete):
 *   - Sets isCarTraveling: false, awaitingSlideOpen: true
 *   - Appends currentStop to visitedStops if not already present
 *
 * BACK (ArrowLeft):
 *   - Map mode, isCarTraveling: true → no-op
 *   - Map mode: opens previous stop at its LAST slide (no-op at first stop)
 *   - Slide mode: goes back one sub-slide; closes overlay at sub-slide 0
 *
 * CLOSE (Escape / Close button):
 *   - Always returns to map mode, preserving position for "Zoom in" restore
 *
 * JUMP_TO_STOP (stop node click / footer circle click):
 *   - Directly opens specified stop at sub-slide 0, resets travel state
 */
export function presentationReducer(state: PresentationState, action: Action): PresentationState {
  switch (action.type) {
    case 'ADVANCE': {
      if (state.mode === 'slide') {
        const currentStop = stops[state.currentStop]
        const isLastSlide = state.currentSlide === currentStop.slides.length - 1
        if (isLastSlide) {
          const isLastStop = state.currentStop === stops.length - 1
          if (isLastStop) {
            return { ...state, mode: 'map', currentSlide: 0 }
          }
          // Close overlay and start car travel to next stop — car drives first, then slides open on arrival
          return { ...state, currentStop: state.currentStop + 1, currentSlide: 0, mode: 'map', isCarTraveling: true }
        }
        return { ...state, currentSlide: state.currentSlide + 1 }
      } else {
        // Map mode: two-step travel model (Phase 3)
        if (state.isCarTraveling) return state  // no-op during travel

        if (state.awaitingSlideOpen) {
          // Car has arrived at current stop — open slide overlay
          return { ...state, mode: 'slide', currentSlide: 0, awaitingSlideOpen: false }
        }

        // Pre-start: car hasn't reached any stop yet — drive to stop 0
        if (state.visitedStops.length === 0) {
          return { ...state, isCarTraveling: true }
        }

        // Car is parked and presenter has already seen slides
        // → start travel to next stop
        const isLastStop = state.currentStop === stops.length - 1
        if (isLastStop) return state  // no-op at end of journey

        return {
          ...state,
          currentStop: state.currentStop + 1,
          isCarTraveling: true,
        }
      }
    }
    case 'ARRIVE': {
      // Ignore spurious arrivals (e.g. framer-motion fires onAnimationComplete on mount)
      if (!state.isCarTraveling) return state

      return {
        ...state,
        isCarTraveling: false,
        awaitingSlideOpen: true,
        visitedStops: state.visitedStops.includes(state.currentStop)
          ? state.visitedStops
          : [...state.visitedStops, state.currentStop],
      }
    }
    case 'BACK': {
      if (state.mode === 'slide') {
        if (state.currentSlide === 0) {
          return { ...state, mode: 'map' }
        }
        return { ...state, currentSlide: state.currentSlide - 1 }
      } else {
        // map mode
        if (state.isCarTraveling) return state  // no-op during travel
        if (state.currentStop === 0) {
          return state // no-op
        }
        const prevStop = state.currentStop - 1
        return {
          ...state,
          currentStop: prevStop,
          currentSlide: stops[prevStop].slides.length - 1,
          mode: 'slide',
        }
      }
    }
    case 'CLOSE': {
      return { ...state, mode: 'map' }
    }
    case 'JUMP_TO_STOP': {
      return {
        ...state,
        currentStop: action.stopIndex,
        currentSlide: 0,
        mode: 'slide',
        isCarTraveling: false,
        awaitingSlideOpen: false,
        visitedStops: state.visitedStops.includes(action.stopIndex)
          ? state.visitedStops
          : [...state.visitedStops, action.stopIndex],
      }
    }
    default:
      return state
  }
}

const PresentationContext = createContext<{
  state: PresentationState
  dispatch: React.Dispatch<Action>
  triggerRef: React.MutableRefObject<HTMLElement | null>
} | null>(null)

export function PresentationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(presentationReducer, initialState)
  const triggerRef = useRef<HTMLElement | null>(null)

  return (
    <PresentationContext.Provider value={{ state, dispatch, triggerRef }}>
      {/*
        MotionConfig wraps all children so every motion component in the tree
        automatically respects prefers-reduced-motion (FOUND-04).
        MotionConfig is itself a client component — placing it here is correct.
      */}
      <MotionConfig reducedMotion="user">
        {children}
      </MotionConfig>
    </PresentationContext.Provider>
  )
}

export function usePresentation() {
  const ctx = useContext(PresentationContext)
  if (!ctx) {
    throw new Error('usePresentation must be used within PresentationProvider')
  }
  return ctx
}
