'use client'
// src/components/features/map/MapCanvas.tsx
// Phase 3: Wired map view. Renders illustrated SVG map backdrop, LEGO stop nodes,
// animated LEGO car, and progress indicator. All driven by PresentationContext state.
//
// Layout: outer container fills available space; inner container maintains 7:4 aspect
// ratio (matching SVG viewBox 1400×800) via ResizeObserver "contain-fit" logic.
// A viewBox-matched overlay (1400×800 CSS px, transform-scaled) ensures the car's
// CSS offsetPath coordinates align exactly with the rendered SVG road.

import { useRef, useEffect, useState } from 'react'
import { stops } from '@/data/topics'
import { usePresentation } from '@/components/features/presentation'
import { MapSvg, MAP_VIEWBOX } from './MapSvg'
import { StopNode } from './StopNode'
import { CarElement } from './CarElement'
import { STOP_OFFSETS, CAR_START_OFFSET } from './RoadPath'

const VB_W = MAP_VIEWBOX.width   // 1400
const VB_H = MAP_VIEWBOX.height  // 800

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

  // --- Contain-fit sizing: fit 1400×800 inside the available space ---
  const outerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<{ w: number; h: number }>({ w: VB_W, h: VB_H })

  useEffect(() => {
    const el = outerRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const { width: ow, height: oh } = entry.contentRect
      const scale = Math.min(ow / VB_W, oh / VB_H)
      setSize({ w: VB_W * scale, h: VB_H * scale })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const scaleX = size.w / VB_W
  const scaleY = size.h / VB_H

  return (
    <div
      ref={outerRef}
      className="w-full h-full flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#3AAEE0' }}
    >
      {/* Inner container — fixed 7:4 aspect ratio, centered */}
      <div className="relative" style={{ width: size.w, height: size.h }}>
        {/* Illustrated SVG world map backdrop */}
        <MapSvg className="absolute inset-0 w-full h-full" />

        {/* Coordinate-matched overlay: 1400×800 CSS px, scaled to match SVG render.
            Car offsetPath and stop coordinates operate in this space. */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: VB_W,
            height: VB_H,
            transformOrigin: '0 0',
            transform: `scale(${scaleX}, ${scaleY})`,
          }}
        >
          {/* Car element — CSS motion path in 1400×800 coordinate space */}
          <CarElement
            targetOffset={
              state.visitedStops.length === 0 && !state.isCarTraveling
                ? CAR_START_OFFSET
                : STOP_OFFSETS[state.currentStop]
            }
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
        </div>

        {/* DEV INDICATOR — remove in Phase 4 */}
        <div className="absolute top-4 left-4 font-mono text-xs bg-black/80 text-green-400 px-3 py-2 rounded select-none z-50">
          <div>stop: {state.currentStop}</div>
          <div>slide: {state.currentSlide}</div>
          <div>mode: {state.mode}</div>
          <div>traveling: {String(state.isCarTraveling)}</div>
          <div>awaiting: {String(state.awaitingSlideOpen)}</div>
        </div>
      </div>
    </div>
  )
}
