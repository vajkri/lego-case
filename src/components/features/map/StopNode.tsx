// src/components/features/map/StopNode.tsx
// Renders a single stop as a positioned button on the map canvas.
// Position is derived from stop.coordinates (percentage of viewport).
'use client'

import type { Stop } from '@/types/presentation'
import { usePresentation } from '@/components/features/presentation'

interface StopNodeProps {
  stop: Stop
  isActive: boolean
  index: number
}

export function StopNode({ stop, isActive, index }: StopNodeProps) {
  const { dispatch, triggerRef } = usePresentation()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Store this button as the focus return target when overlay closes (A11Y-04)
    triggerRef.current = e.currentTarget
    dispatch({ type: 'JUMP_TO_STOP', stopIndex: index })
  }

  return (
    <button
      onClick={handleClick}
      style={{
        position: 'absolute',
        left: `${stop.coordinates.x}%`,
        top: `${stop.coordinates.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      className={[
        'px-3 py-2 rounded-lg font-semibold text-sm border-2 transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-500',
        isActive
          ? 'bg-yellow-400 border-yellow-600 text-yellow-900'
          : 'bg-white border-slate-300 text-slate-700 hover:border-slate-500',
      ].join(' ')}
    >
      {stop.label}
    </button>
  )
}
