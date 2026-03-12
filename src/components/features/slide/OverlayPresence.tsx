// src/components/features/slide/OverlayPresence.tsx
// Client wrapper required because AnimatePresence cannot run in a Server Component (layout.tsx).
// AnimatePresence is always mounted; the conditional SlideOverlay is inside it.
// onExitComplete handles focus return (A11Y-04) — fires after exit animation completes.
'use client'

import { AnimatePresence } from 'motion/react'
import { usePresentation } from '@/components/features/presentation'
import { SlideOverlay } from './SlideOverlay'

export function OverlayPresence() {
  const { state, triggerRef } = usePresentation()

  const handleExitComplete = () => {
    // A11Y-04: Return focus to the stop node button that triggered the overlay.
    // Called by AnimatePresence after exit animation fully completes (~0.4s).
    // Using setTimeout(0) to yield to the event loop and ensure DOM is stable.
    setTimeout(() => {
      triggerRef.current?.focus()
    }, 0)
  }

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {state.mode === 'slide' && <SlideOverlay key="slide-overlay" />}
    </AnimatePresence>
  )
}
