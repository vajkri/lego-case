'use client'
// src/components/features/map/MapProgressIndicator.tsx
// Shows current position in the 5-stop journey.
// The stop marker states (visited/active/unvisited) are the primary progress cue.
// This is a secondary, non-intrusive counter.

interface MapProgressIndicatorProps {
  currentStop: number   // 0-4
  totalStops: number    // 5
  isCarTraveling: boolean
}

export function MapProgressIndicator({ currentStop, totalStops, isCarTraveling }: MapProgressIndicatorProps) {
  return (
    <div
      className="absolute bottom-4 right-4 flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-sm"
      aria-live="polite"
      aria-label={`Stop ${currentStop + 1} of ${totalStops}`}
    >
      {/* Dot row */}
      {Array.from({ length: totalStops }, (_, i) => (
        <div
          key={i}
          className={[
            'rounded-full transition-all duration-300',
            i === currentStop
              ? 'w-3 h-3 bg-yellow-500'
              : i < currentStop
                ? 'w-2 h-2 bg-yellow-300'
                : 'w-2 h-2 bg-slate-200',
          ].join(' ')}
        />
      ))}
      {/* Counter text */}
      <span className="text-xs font-medium text-slate-600 ml-1 select-none">
        {currentStop + 1}/{totalStops}
      </span>
      {/* Traveling indicator */}
      {isCarTraveling && (
        <span className="text-xs text-slate-400 italic select-none">traveling…</span>
      )}
    </div>
  )
}
