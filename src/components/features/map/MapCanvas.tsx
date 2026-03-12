'use client'
// src/components/features/map/MapCanvas.tsx
// Phase 3: Wired map view. Renders illustrated SVG map backdrop, LEGO stop nodes,
// animated LEGO car, and progress indicator. All driven by PresentationContext state.

import { useRef } from 'react'
import { stops } from '@/data/topics'
import { usePresentation } from '@/components/features/presentation'
import { MapSvg } from './MapSvg'
import { StopNode } from './StopNode'
import { CarElement } from './CarElement'
import { MapProgressIndicator } from './MapProgressIndicator'

export function MapCanvas() {
  const { state, dispatch } = usePresentation()

  // Use a ref to track the previous stop for direction computation.
  // isMovingBackward is true when currentStop just decreased (BACK action).
  const previousStopRef = useRef(state.currentStop)
  const isMovingBackward = state.currentStop < previousStopRef.current
  // Update previousStop when car has parked at the new stop (not during travel)
  if (!state.isCarTraveling && previousStopRef.current !== state.currentStop) {
    previousStopRef.current = state.currentStop
  }

  const handleCarArrival = () => {
    dispatch({ type: 'ARRIVE' })
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Illustrated SVG world map backdrop */}
      <MapSvg className="absolute inset-0 w-full h-full" />

      {/* Car element — absolutely positioned over the SVG, driven by CSS motion path */}
      <CarElement
        targetStop={state.currentStop}
        isMovingBackward={isMovingBackward}
        onArrival={handleCarArrival}
      />

      {/* Stop node buttons — positioned by their coordinate percentages */}
      {stops.map((stop, index) => (
        <StopNode
          key={stop.slug}
          stop={stop}
          index={index}
          isActive={state.currentStop === index}
          isVisited={state.visitedStops.includes(index)}
        />
      ))}

      {/* Progress indicator — bottom-right, non-intrusive */}
      <MapProgressIndicator
        currentStop={state.currentStop}
        totalStops={stops.length}
        isCarTraveling={state.isCarTraveling}
      />

      {/* DEV INDICATOR — remove in Phase 4 */}
      <div className="absolute top-4 left-4 font-mono text-xs bg-black/80 text-green-400 px-3 py-2 rounded select-none z-50">
        <div>stop: {state.currentStop}</div>
        <div>slide: {state.currentSlide}</div>
        <div>mode: {state.mode}</div>
        <div>traveling: {String(state.isCarTraveling)}</div>
        <div>awaiting: {String(state.awaitingSlideOpen)}</div>
      </div>
    </div>
  )
}
