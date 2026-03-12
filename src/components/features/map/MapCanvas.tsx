// src/components/features/map/MapCanvas.tsx
// Phase 1 placeholder: a blank canvas with 5 positioned stop nodes.
// The real SVG world map is added in Phase 3.
// Dev indicator (top-left) proves the reducer is wired — remove in Phase 4.
'use client'

import { stops } from '@/data/topics'
import { usePresentation } from '@/components/features/presentation'
import { StopNode } from './StopNode'

export function MapCanvas() {
  const { state } = usePresentation()

  return (
    <div className="relative w-full h-screen bg-slate-100">
      {/* DEV INDICATOR — Phase 1 only. Remove in Phase 4 (or when no longer needed).
          Shows that keyboard events reach the reducer and state updates render. */}
      <div className="absolute top-4 left-4 font-mono text-xs bg-black/80 text-green-400 px-3 py-2 rounded select-none">
        <div>stop: {state.currentStop}</div>
        <div>slide: {state.currentSlide}</div>
        <div>mode: {state.mode}</div>
      </div>

      {stops.map((stop, index) => (
        <StopNode
          key={stop.slug}
          stop={stop}
          isActive={state.currentStop === index}
          index={index}
        />
      ))}
    </div>
  )
}
