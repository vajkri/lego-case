'use client'
import type { Stop } from '@/types/presentation'

interface SlideFooterProps {
  stops: Stop[]
  currentStop: number
  currentSlide: number
  mode: 'map' | 'slide'
  onJumpToStop: (index: number) => void
  onClose: () => void
  onToggle: () => void
  onBack: () => void
  onAdvance: () => void
}

export function SlideFooter({
  stops,
  currentStop,
  mode,
  onJumpToStop,
  onToggle,
  onBack,
  onAdvance,
}: SlideFooterProps) {
  return (
    <footer className="flex items-center justify-between px-6 py-4 border-t border-white/10 gap-4">
      {/* Prev button */}
      <button
        onClick={onBack}
        aria-label="Previous"
        className="flex items-center justify-center w-10 h-10 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
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
      </button>

      {/* Progress circles 1-5 */}
      <div className="flex items-center gap-3 flex-1 justify-center">
        {stops.map((stop, i) => (
          <button
            key={stop.slug}
            onClick={() => onJumpToStop(i)}
            aria-label={`Go to stop ${i + 1}: ${stop.label}`}
            aria-current={i === currentStop ? 'step' : undefined}
            className={[
              'w-8 h-8 rounded-full font-bold text-sm transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-900',
              i < currentStop
                ? 'bg-green-500 text-white focus-visible:ring-green-300'
                : i === currentStop
                  ? 'bg-yellow-400 text-slate-900 focus-visible:ring-yellow-300'
                  : 'bg-slate-600 text-slate-300 focus-visible:ring-slate-400',
            ].join(' ')}
          >
            {i < currentStop ? '✓' : i + 1}
          </button>
        ))}
      </div>

      {/* Toggle button — "Map" when slide open, "Zoom in" when map showing */}
      <button
        onClick={onToggle}
        className="px-4 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors border border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        {mode === 'slide' ? 'Map' : 'Zoom in'}
      </button>

      {/* Next button */}
      <button
        onClick={onAdvance}
        aria-label="Next"
        className="flex items-center justify-center w-10 h-10 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
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
      </button>
    </footer>
  )
}
