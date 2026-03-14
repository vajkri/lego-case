'use client'
import { Button } from '@/components/ui'

interface SlideNavArrowsProps {
  onBack: () => void
  onAdvance: () => void
}

// SlideNavArrows — kept for potential reuse but no longer imported by SlideOverlay directly.
// SlideOverlay now inlines the nav buttons via SlideFrame's leftArrow/rightArrow slots.
export function SlideNavArrows({ onBack, onAdvance }: SlideNavArrowsProps) {
  return (
    <>
      {/* Left arrow — grey brick-style button */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2">
        <Button variant="grey" size="icon" onClick={onBack} aria-label="Previous slide">
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
        </Button>
      </div>

      {/* Right arrow — red brick-style button */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        <Button variant="red" size="icon" onClick={onAdvance} aria-label="Next slide">
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
        </Button>
      </div>
    </>
  )
}
