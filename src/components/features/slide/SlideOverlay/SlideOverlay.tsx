'use client'
import { motion } from 'motion/react'
import FocusTrap from 'focus-trap-react'
import { usePresentation } from '@/components/features/presentation'
import { stops } from '@/data/topics'
import { SlideHeader } from './SlideHeader'
import { SlideContent } from './SlideContent'
import { SlideNavArrows } from './SlideNavArrows'

export function SlideOverlay() {
  const { state, dispatch, triggerRef } = usePresentation()
  const stop = stops[state.currentStop]
  const slide = stop.slides[state.currentSlide]

  const handleClose = () => {
    // Focus return (A11Y-04): return focus to the element that triggered the overlay
    if (triggerRef.current) {
      triggerRef.current.focus()
    }
    dispatch({ type: 'CLOSE' })
  }

  // ARIA live announcement (A11Y-02) — announces on every slide change
  const announceText = `${stop.label}, slide ${state.currentSlide + 1} of ${stop.slides.length}`

  return (
    <FocusTrap focusTrapOptions={{ initialFocus: '#slide-close-btn', returnFocusOnDeactivate: false }}>
      <motion.div
        data-testid="slide-overlay"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.85 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="absolute inset-0 bg-slate-900 text-white flex flex-col"
      >
        {/* ARIA live region — mounted once, never conditionally rendered (A11Y-02) */}
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {announceText}
        </div>

        <SlideHeader
          stopLabel={stop.label}
          stopIndex={state.currentStop}
          totalSlides={stop.slides.length}
          currentSlide={state.currentSlide}
          onClose={handleClose}
        />

        <div className="flex-1 flex items-center relative px-16">
          <SlideNavArrows
            onBack={() => dispatch({ type: 'BACK' })}
            onAdvance={() => dispatch({ type: 'ADVANCE' })}
          />
          <SlideContent heading={slide.heading} lines={slide.lines} />
        </div>

      </motion.div>
    </FocusTrap>
  )
}
