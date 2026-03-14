'use client'
// src/components/features/map/MapCanvas.tsx
// Phase 3: Wired map view. Renders illustrated SVG map backdrop, LEGO stop nodes,
// animated LEGO car, and progress indicator. All driven by PresentationContext state.
//
// Layout: outer container fills available space; inner container maintains 7:4 aspect
// ratio (matching SVG viewBox 1400×800) via ResizeObserver "contain-fit" logic.
// A viewBox-matched overlay (1400×800 CSS px, transform-scaled) ensures the car's
// CSS offsetPath coordinates align exactly with the rendered SVG road.

import { useRef, useLayoutEffect, useState } from 'react'
import { stops } from '@/data/topics'
import { usePresentation } from '@/components/features/presentation'
import { MapSvg, MAP_VIEWBOX, HORIZON_Y } from './MapSvg'
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
  const [size, setSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 })

  useLayoutEffect(() => {
    const el = outerRef.current
    if (!el) return

    // Synchronous initial measurement — runs before browser paint, prevents flash
    const measure = () => {
      const { width: ow, height: oh } = el.getBoundingClientRect()
      const scale = Math.min(ow / VB_W, oh / VB_H)
      setSize({ w: VB_W * scale, h: VB_H * scale })
    }
    measure()

    // ResizeObserver for subsequent window/container resizes
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const scaleX = size.w / VB_W
  const scaleY = size.h / VB_H

  // Horizon position as % of inner container — drives full-bleed sky/grass split
  const horizonPct = `${(HORIZON_Y / VB_H) * 100}%`
  const belowHorizonPct = `${((VB_H - HORIZON_Y) / VB_H) * 100}%`

  return (
    <div
      ref={outerRef}
      className="w-full h-full flex items-center justify-center overflow-hidden"
    >
      {/* Inner container — fixed 7:4 aspect ratio, centered.
          Hidden until measured to prevent background flicker on first frame. */}
      <div className="relative" style={{ width: size.w, height: size.h, visibility: size.w ? 'visible' : 'hidden' }}>
        {/* Full-bleed sky — anchored to inner container, extends to fill viewport */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '-50vh',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100vw',
            height: `calc(${horizonPct} + 50vh)`,
            background: 'linear-gradient(to bottom, #3AAEE0 0%, #62C8EE 45%, #A8DFF5 100%)',
          }}
        />
        {/* Full-bleed grass — anchored to inner container, extends to fill viewport */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: horizonPct,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100vw',
            height: `calc(${belowHorizonPct} + 50vh)`,
            background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Ccircle cx='12' cy='12' r='3.7' fill='rgba(0,80,0,0.1)'/%3E%3C/svg%3E") repeat, linear-gradient(to bottom, #58CC3A 0%, #44B028 60%, #349A18 100%)`,
          }}
        />
        {/* Illustrated SVG world map content (transparent bg — sky/grass behind) */}
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
            style={{ zIndex: 10 }}
          />

          {/* Stop node buttons — positioned by their coordinate percentages */}
          {stops.map((stop, index) => (
            <StopNode
              key={stop.slug}
              stop={stop}
              index={index}
              isActive={state.currentStop === index && (state.visitedStops.length > 0 || state.isCarTraveling)}
              isVisited={state.visitedStops.includes(index)}
              isCarTraveling={state.isCarTraveling}
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
