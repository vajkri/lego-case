'use client'
// src/components/features/map/CarElement.tsx
// Animates the red LEGO car along the road path using CSS motion path (CAR-02, CAR-03).
// Position is driven by offsetPath + offsetDistance — NOT top/left coordinates.
// onArrival fires via onAnimationComplete when car reaches targetStop.

import { motion } from 'motion/react'
import { ROAD_PATH_D, STOP_OFFSETS } from './RoadPath'

interface CarElementProps {
  targetStop: number         // 0-4 — drives offsetDistance to STOP_OFFSETS[targetStop]
  isMovingBackward: boolean  // true when going to a lower-index stop
  onArrival: () => void      // dispatched to reducer as ARRIVE action
}

// The car SVG — simple top-down view, red LEGO car with stud on roof
function CarSvg() {
  return (
    <svg width="48" height="28" viewBox="0 0 48 28" fill="none" aria-hidden="true">
      {/* Car body */}
      <rect x="2" y="8" width="44" height="16" rx="4" fill="#E32B2B" />
      {/* Car cabin/roof */}
      <rect x="12" y="4" width="22" height="14" rx="3" fill="#C82020" />
      {/* Windshield */}
      <rect x="14" y="5" width="18" height="10" rx="2" fill="#A8D4E8" opacity="0.9" />
      {/* LEGO stud on roof */}
      <circle cx="23" cy="4" r="3" fill="#B81C1C" />
      <circle cx="23" cy="4" r="2" fill="#D82020" />
      {/* Wheels */}
      <circle cx="11" cy="24" r="4" fill="#1A1A1A" />
      <circle cx="37" cy="24" r="4" fill="#1A1A1A" />
      <circle cx="11" cy="4" r="4" fill="#1A1A1A" />
      <circle cx="37" cy="4" r="4" fill="#1A1A1A" />
      {/* Wheel highlights */}
      <circle cx="11" cy="24" r="2" fill="#333333" />
      <circle cx="37" cy="24" r="2" fill="#333333" />
    </svg>
  )
}

export function CarElement({ targetStop, isMovingBackward, onArrival }: CarElementProps) {
  return (
    <motion.div
      data-testid="car-element"
      style={{
        position: 'absolute',
        // CSS motion path — GPU composited, does NOT trigger layout/paint per frame (CAR-03)
        offsetPath: `path("${ROAD_PATH_D}")`,
        offsetRotate: isMovingBackward ? 'reverse' : 'auto',
        willChange: 'transform',  // GPU compositor hint
        width: 48,
        height: 28,
        // Center the car on the path point using CSS transform (not top/left positioning)
        transform: 'translate(-50%, -50%)',
      }}
      animate={{ offsetDistance: STOP_OFFSETS[targetStop] }}
      transition={{
        type: 'tween',
        duration: 1.4,
        ease: [0.4, 0, 0.2, 1],  // material ease-in-out — smooth acceleration/deceleration
      }}
      onAnimationComplete={() => {
        onArrival()  // → dispatch({ type: 'ARRIVE' }) in MapCanvas
      }}
    >
      <CarSvg />
    </motion.div>
  )
}
