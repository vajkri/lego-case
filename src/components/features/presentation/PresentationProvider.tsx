// src/components/features/presentation/PresentationProvider.tsx
// Manages all presentation navigation state.
// Phase 1: reducer actions are stubs (console.log, no state change).
// Phase 2 implements real ADVANCE/BACK/CLOSE logic.
'use client'

import { createContext, useContext, useReducer, ReactNode } from 'react'
import { MotionConfig } from 'motion/react'
import type { PresentationState, Action } from '@/types/presentation'

const initialState: PresentationState = {
  currentStop: 0,
  currentSlide: 0,
  mode: 'map',
}

// Stub reducer — actions are no-ops in Phase 1.
// Phase 2 replaces the console.log calls with real state transitions.
function presentationReducer(state: PresentationState, action: Action): PresentationState {
  switch (action.type) {
    case 'ADVANCE':
      console.log('[stub] ADVANCE dispatched', state)
      return state
    case 'BACK':
      console.log('[stub] BACK dispatched', state)
      return state
    case 'CLOSE':
      console.log('[stub] CLOSE dispatched', state)
      return state
    default:
      return state
  }
}

const PresentationContext = createContext<{
  state: PresentationState
  dispatch: React.Dispatch<Action>
} | null>(null)

export function PresentationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(presentationReducer, initialState)
  return (
    <PresentationContext.Provider value={{ state, dispatch }}>
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
