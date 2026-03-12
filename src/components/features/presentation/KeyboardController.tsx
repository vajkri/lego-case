// src/components/features/presentation/KeyboardController.tsx
// Sole keyboard event listener for the presentation.
// Centralised here so there is exactly one listener on window — no duplicates.
// ArrowRight/Space → ADVANCE | ArrowLeft → BACK | Escape → CLOSE
'use client'

import { useEffect } from 'react'
import { usePresentation } from './PresentationProvider'

export function KeyboardController() {
  const { dispatch } = usePresentation()

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // For Space: if the event originates from an interactive element (button, link,
      // input), let that element's native activation (onClick) handle the dispatch.
      // Dispatching from both the window handler AND the element's onClick would
      // fire two actions per keypress (e.g. ADVANCE + JUMP_TO_STOP).
      if (e.key === ' ') {
        const target = e.target as Element | null
        if (target?.closest('button, a, input, select, textarea')) return
      }
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()  // prevent Space from scrolling the page
        dispatch({ type: 'ADVANCE' })
      }
      if (e.key === 'ArrowLeft') dispatch({ type: 'BACK' })
      if (e.key === 'Escape') dispatch({ type: 'CLOSE' })
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [dispatch])

  return null
}
