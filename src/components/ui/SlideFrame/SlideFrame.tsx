// SlideFrame — chrome wrapper for the slide overlay
// Layout only: stud-pattern red header bar, grey-wash outer background, white inner card, nav arrow slots.
// NOT 'use client' — no hooks here. Parent (SlideOverlay) is 'use client'.
//
// CRITICAL: The close button MUST keep id="slide-close-btn" — it remains a FocusTrap fallback target.
// The advance arrow (id="slide-advance-btn") receives initial focus, but the close button id
// must stay for focus-trap's tabbable element detection.

import { Button } from '@/components/ui'

interface SlideFrameProps {
  onClose: () => void
  leftArrow?: React.ReactNode
  rightArrow?: React.ReactNode
  children: React.ReactNode
}

export function SlideFrame({ onClose, leftArrow, rightArrow, children }: SlideFrameProps) {
  return (
    <div className="bg-lego-grey-wash absolute inset-0 flex flex-col">
      {/* Red stud-pattern header bar — outer: full-bleed background */}
      <header className="bg-lego-red stud-pattern">
        <div className="section-container flex items-center justify-between py-3">
          {/* LEGO logo placeholder — left side */}
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-white/20 text-white font-display font-extrabold text-sm tracking-tight">
            LEGO
          </span>

          {/* Close button — right side. id="slide-close-btn" MUST remain for FocusTrap. */}
          <Button
            id="slide-close-btn"
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close slide overlay"
            className="w-10 h-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </Button>
        </div>
      </header>

      {/* White inner card — outer: full-bleed background */}
      <div className="bg-white flex-1 rounded-t-xl overflow-hidden shadow-lg">
        <div className="section-container flex items-center gap-4 py-8 h-full">
          {/* Left nav arrow */}
          <div className="shrink-0 self-center">
            {leftArrow}
          </div>

          {/* Content area */}
          <div className="flex-1 min-w-0 h-full overflow-y-auto flex flex-col items-center justify-center">
            {children}
          </div>

          {/* Right nav arrow */}
          <div className="shrink-0 self-center">
            {rightArrow}
          </div>
        </div>
      </div>
    </div>
  )
}
