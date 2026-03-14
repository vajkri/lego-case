'use client'
// src/components/features/map/CarElement.tsx
// Animates the red LEGO car along the road path using CSS motion path (CAR-02, CAR-03).
// Position is driven by offsetPath + offsetDistance — NOT top/left coordinates.
// onArrival fires via onAnimationComplete when car reaches the target offset.

import { motion } from 'motion/react'
import { ROAD_PATH_D, CAR_START_OFFSET } from './RoadPath'

interface CarElementProps {
  targetOffset: string       // e.g. '0%', '10%', '44%' — drives offsetDistance
  isMovingBackward: boolean  // true when going to a lower-index stop
  onArrival: () => void      // dispatched to reducer as ARRIVE action
  style?: React.CSSProperties  // additional styles (e.g. zIndex for layering)
}

// LEGO car — side view with studs, wheels, cabin, headlight/taillight
function CarSvg() {
  return (
    <svg width="60" height="40" viewBox="0 0 60 40" fill="none" aria-hidden="true">
      {/* Wheels */}
      <circle cx="15" cy="32" r="6" fill="#1f2937" />
      <circle cx="15" cy="32" r="3" fill="#9ca3af" />
      <circle cx="45" cy="32" r="6" fill="#1f2937" />
      <circle cx="45" cy="32" r="3" fill="#9ca3af" />
      {/* Car Body - Bottom Block */}
      <rect x="5" y="16" width="50" height="12" rx="2" fill="#ef4444" />
      <rect x="5" y="16" width="50" height="12" rx="2" fill="url(#car-highlight)" opacity="0.5" />
      {/* Car Body - Top Cabin */}
      <rect x="15" y="6" width="26" height="10" rx="2" fill="#ef4444" />
      <rect x="15" y="6" width="26" height="10" rx="2" fill="url(#car-highlight)" opacity="0.5" />
      {/* Windows */}
      <rect x="17" y="8" width="8" height="6" rx="1" fill="#60a5fa" opacity="0.8" />
      <rect x="27" y="8" width="12" height="6" rx="1" fill="#60a5fa" opacity="0.8" />
      {/* Studs */}
      <rect x="18" y="3" width="6" height="3" rx="1" fill="#ef4444" />
      <rect x="28" y="3" width="6" height="3" rx="1" fill="#ef4444" />
      {/* Headlight */}
      <circle cx="53" cy="22" r="2.5" fill="#fde047" />
      {/* Taillight */}
      <rect x="5" y="20" width="2" height="4" fill="#f87171" />
      <defs>
        <linearGradient id="car-highlight" x1="30" y1="0" x2="30" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" stopOpacity="0.4" />
          <stop offset="1" stopColor="black" stopOpacity="0.2" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function CarElement({ targetOffset, isMovingBackward, onArrival, style: extraStyle }: CarElementProps) {
  return (
    <motion.div
      data-testid="car-element"
      initial={{ offsetDistance: CAR_START_OFFSET }}
      style={{
        position: 'absolute',
        // CSS motion path — GPU composited, does NOT trigger layout/paint per frame (CAR-03)
        offsetPath: `path("${ROAD_PATH_D}")`,
        offsetRotate: 'auto',
        willChange: 'transform',  // GPU compositor hint
        width: 60,
        height: 40,
        // Right-side driving: Y offset shifts car perpendicular to path direction.
        // -10% = right side (forward), -90% = left side (backward).
        // scaleX(-1) flips car to face backward direction.
        transform: isMovingBackward
          ? 'translate(-50%, -90%) scaleX(-1)'
          : 'translate(-50%, -10%)',
        ...extraStyle,
      }}
      animate={{ offsetDistance: targetOffset }}
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
