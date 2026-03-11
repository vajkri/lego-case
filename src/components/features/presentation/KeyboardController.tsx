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
