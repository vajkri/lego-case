'use client'
// src/components/features/map/StopNode.tsx
// LEGO-themed stop marker with three visual states: active, visited, unvisited.
// Renders as a focusable <button> with always-visible stop name label (MAP-02).
// isActive=true: current stop — bright yellow + focus ring
// isVisited=true (and not active): visited — filled LEGO yellow, softer
// Neither: unvisited — hollow grey marker, muted

import type { Stop } from '@/types/presentation'
import { usePresentation } from '@/components/features/presentation'

interface StopNodeProps {
  stop: Stop
  index: number
  isActive: boolean    // current stop — brighter marker + focus ring
  isVisited: boolean   // car has reached this stop — filled LEGO yellow
  // isUnvisited = !isActive && !isVisited
}

// LEGO-themed map pin: circle head + pointed bottom — classic location marker styled LEGO
function MarkerPin({ variant }: { variant: 'active' | 'visited' | 'unvisited' }) {
  const colors = {
    active:    { fill: '#FFD700', stroke: '#B8860B', opacity: 1 },
    visited:   { fill: '#FFD700', stroke: '#B8860B', opacity: 0.75 },
    unvisited: { fill: 'transparent', stroke: '#9CA3AF', opacity: 1 },
  }
  const { fill, stroke, opacity } = colors[variant]
  return (
    <svg width="28" height="38" viewBox="0 0 28 38" fill="none" aria-hidden="true">
      {/* Circle head */}
      <circle cx="14" cy="13" r="11" fill={fill} stroke={stroke} strokeWidth="2.5" opacity={opacity} />
      {/* Small inner circle — LEGO stud aesthetic */}
      {variant !== 'unvisited' && (
        <circle cx="14" cy="13" r="5" fill={stroke} opacity="0.35" />
      )}
      {/* Pin point */}
      <path d="M 8,20 Q 14,36 20,20 Z" fill={fill} stroke={stroke} strokeWidth="2" strokeLinejoin="round" opacity={opacity} />
    </svg>
  )
}

export function StopNode({ stop, isActive, isVisited, index }: StopNodeProps) {
  const { dispatch, triggerRef } = usePresentation()

  const variant = isActive ? 'active' : isVisited ? 'visited' : 'unvisited'

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Store this button as the focus return target when overlay closes (A11Y-04)
    triggerRef.current = e.currentTarget
    dispatch({ type: 'JUMP_TO_STOP', stopIndex: index })
  }

  return (
    <button
      onClick={handleClick}
      data-state={variant}
      aria-label={`${stop.label} — stop ${index + 1} of 5`}
      style={{
        position: 'absolute',
        left: `${stop.coordinates.x}%`,
        top: `${stop.coordinates.y}%`,
        transform: 'translate(-50%, -100%)',  // anchor at bottom of pin, pointing to stop position
      }}
      className={[
        'flex flex-col items-center gap-1 bg-transparent border-0 p-1 cursor-pointer',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        isActive
          ? 'focus-visible:ring-yellow-500 scale-110'
          : 'focus-visible:ring-slate-400',
      ].join(' ')}
    >
      <MarkerPin variant={variant} />
      {/* Always-visible label — MAP-02 requires labels never hidden */}
      <span
        className={[
          'text-xs font-semibold px-1.5 py-0.5 rounded whitespace-nowrap',
          'bg-white/90 shadow-sm',
          isActive
            ? 'text-yellow-900 ring-1 ring-yellow-400'
            : isVisited
              ? 'text-slate-700'
              : 'text-slate-400',
        ].join(' ')}
      >
        {stop.label}
      </span>
    </button>
  )
}
