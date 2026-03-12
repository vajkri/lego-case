'use client'

interface SlideHeaderProps {
  stopLabel: string
  stopIndex: number
  totalSlides: number
  currentSlide: number
  onClose: () => void
}

export function SlideHeader({
  stopLabel,
  stopIndex,
  totalSlides,
  currentSlide,
  onClose,
}: SlideHeaderProps) {
  return (
    <header className="relative flex items-center justify-between px-6 py-4 border-b border-white/10">
      {/* LEGO placeholder badge — top-left */}
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-red-600 text-white font-extrabold text-sm tracking-tight">
          LEGO
        </span>
      </div>

      {/* Stop badge — centered */}
      <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
        <span className="text-xs font-semibold tracking-widest text-yellow-400 uppercase">
          Stop {stopIndex + 1}
        </span>
        <span className="text-sm font-medium text-white/80">{stopLabel}</span>

        {/* Sub-slide dot indicators */}
        <div className="flex items-center gap-1.5 mt-1">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <span
              key={i}
              className={[
                'w-2 h-2 rounded-full transition-colors',
                i === currentSlide ? 'bg-yellow-400' : 'bg-white/30',
              ].join(' ')}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>

      {/* Close button — top-right, first focusable element */}
      <button
        id="slide-close-btn"
        onClick={onClose}
        aria-label="Close slide overlay"
        className="ml-auto flex items-center justify-center w-9 h-9 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
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
      </button>
    </header>
  )
}
