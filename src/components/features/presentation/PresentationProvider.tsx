// src/components/features/presentation/PresentationProvider.tsx
// Manages all presentation navigation state.
// Phase 2: real reducer with full navigation logic, triggerRef for focus return.
'use client'

import { createContext, useContext, useReducer, useRef, ReactNode } from 'react'
import { MotionConfig } from 'motion/react'
import type { PresentationState, Action } from '@/types/presentation'
import { stops } from '@/data/topics'

const initialState: PresentationState = {
  currentStop: 0,
  currentSlide: 0,
  mode: 'map',
}

/**
 * Presentation state machine — keyboard navigation model (A11Y-05).
 *
 * ADVANCE (ArrowRight / Space):
 *   - Map mode: opens next stop's slides (no-op at last stop)
 *   - Slide mode: advances sub-slide; closes overlay on last sub-slide
 *
 * BACK (ArrowLeft):
 *   - Map mode: opens previous stop at its LAST slide (no-op at first stop)
 *   - Slide mode: goes back one sub-slide; closes overlay at sub-slide 0
 *
 * CLOSE (Escape / Close button):
 *   - Always returns to map mode, preserving position for "Zoom in" restore
 *
 * JUMP_TO_STOP (stop node click / footer circle click):
 *   - Directly opens specified stop at sub-slide 0
 */
export function presentationReducer(state: PresentationState, action: Action): PresentationState {
  switch (action.type) {
    case 'ADVANCE': {
      if (state.mode === 'slide') {
        const currentStop = stops[state.currentStop]
        const isLastSlide = state.currentSlide === currentStop.slides.length - 1
        if (isLastSlide) {
          return { ...state, mode: 'map', currentSlide: 0 }
        }
        return { ...state, currentSlide: state.currentSlide + 1 }
      } else {
        // map mode
        const isLastStop = state.currentStop === stops.length - 1
        if (isLastStop) {
          return state // no-op
        }
        return { currentStop: state.currentStop + 1, currentSlide: 0, mode: 'slide' }
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
        if (state.currentStop === 0) {
          return state // no-op
        }
        const prevStop = state.currentStop - 1
        return {
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
      return { currentStop: action.stopIndex, currentSlide: 0, mode: 'slide' }
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
