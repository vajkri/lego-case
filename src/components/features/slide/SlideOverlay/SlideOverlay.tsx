'use client'
import { useRef } from 'react'
import { motion } from 'motion/react'
import FocusTrap from 'focus-trap-react'
import { usePresentation } from '@/components/features/presentation'
import { stops } from '@/data/topics'
import { Button, SlideFrame, StopBadge, SubSlideProgress } from '@/components/ui'
import { SlideContent } from './SlideContent'

export function SlideOverlay() {
  const { state, dispatch, triggerRef } = usePresentation()

  // Freeze displayed content during exit animation — prevents flash of next stop's slide
  const frozenRef = useRef({ stopIndex: state.currentStop, slideIndex: state.currentSlide })
  if (state.mode === 'slide') {
    frozenRef.current = { stopIndex: state.currentStop, slideIndex: state.currentSlide }
  }

  const stop = stops[frozenRef.current.stopIndex]
  const slide = stop.slides[frozenRef.current.slideIndex]

  const handleClose = () => {
    // Focus return (A11Y-04): return focus to the element that triggered the overlay
    if (triggerRef.current) {
      triggerRef.current.focus()
    }
    dispatch({ type: 'CLOSE' })
  }

  // ARIA live announcement (A11Y-02) — announces on every slide change
  const announceText = `${stop.label}, slide ${state.currentSlide + 1} of ${stop.slides.length}`

  // Nav arrow chevron SVGs
  const leftChevron = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )

  const rightChevron = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )

  return (
    // FocusTrap (A11Y-01). Initial focus on advance arrow — follows user intent (they just clicked "next" to get here).
    <FocusTrap focusTrapOptions={{ initialFocus: '#slide-advance-btn', returnFocusOnDeactivate: false }}>
      <motion.div
        data-testid="slide-overlay"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.85 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="absolute inset-0 z-40"
      >
        {/* ARIA live region — mounted once, never conditionally rendered (A11Y-02) */}
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {announceText}
        </div>

        <SlideFrame
          onClose={handleClose}
          leftArrow={
            <Button
              variant="grey"
              size="icon"
              onClick={() => dispatch({ type: 'BACK' })}
              aria-label="Previous slide"
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lego-grey"
            >
              {leftChevron}
            </Button>
          }
          rightArrow={
            <Button
              id="slide-advance-btn"
              variant="red"
              size="icon"
              onClick={() => dispatch({ type: 'ADVANCE' })}
              aria-label="Next slide"
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lego-red"
            >
              {rightChevron}
            </Button>
          }
        >
          <StopBadge stopIndex={state.currentStop} stopLabel={stop.label} />
          <SubSlideProgress total={stop.slides.length} current={state.currentSlide} />
          <SlideContent heading={slide.heading} blocks={slide.blocks} />
        </SlideFrame>
      </motion.div>
    </FocusTrap>
  )
}
