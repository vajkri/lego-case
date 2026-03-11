// src/components/features/map/StopNode.tsx
// Renders a single stop as a positioned button on the map canvas.
// Position is derived from stop.coordinates (percentage of viewport).
'use client'

import type { Stop } from '@/types/presentation'

interface StopNodeProps {
  stop: Stop
  isActive: boolean
}

export function StopNode({ stop, isActive }: StopNodeProps) {
  return (
    <button
      style={{
        position: 'absolute',
        left: `${stop.coordinates.x}%`,
        top: `${stop.coordinates.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      className={[
        'px-3 py-2 rounded-lg font-semibold text-sm border-2 transition-colors',
        isActive
          ? 'bg-yellow-400 border-yellow-600 text-yellow-900'
          : 'bg-white border-slate-300 text-slate-700 hover:border-slate-500',
      ].join(' ')}
    >
      {stop.label}
    </button>
  )
}
