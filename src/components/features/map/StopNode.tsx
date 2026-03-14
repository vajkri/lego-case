'use client'
// src/components/features/map/StopNode.tsx
// LEGO-themed stop marker — Build Progress Bricks with 5 visual states.
// Each stop renders a brick stack whose brick count matches its position (1–5).
// States: default (grey), hover (scale+shadow), focus (blue outline+scale),
//         active (colorful multi-brick palette + entrance animation), visited (all-green + color sweep)
// Labels are positioned above or below per stop.labelPosition (MAP-02 always visible).

import { useState } from 'react'
import type { Stop } from '@/types/presentation'
import { usePresentation } from '@/components/features/presentation'

// ─── SVG constants (from mockup stop-marker-states.html) ───────────────────
const VB_W = 48
const VB_H = 66

const POS = {
  plate:  { x: 2,  y: 57, w: 44, h: 7,  sy: 59 },
  level1: { x: 4,  y: 42, w: 40, h: 14, sy: 43 },
  level2: { y: 29, h: 13, sy: 30 },
  level3: { y: 16, h: 13, sy: 17 },
  halfL:  { x: 4,  w: 20 },
  halfR:  { x: 24, w: 20 },
}

const STUD = { w: 10, h: 4, rx: 0, shH: 5, shRx: 0 }
const STUD_X = { left: 9, right: 29 }

// ─── Color palettes ─────────────────────────────────────────────────────────
const COLORS = {
  grey:   { face: '#D4D4D8', shadow: '#B5B5B9', studFace: '#DCDCE0', studShadow: '#C0C0C4' },
  red:    { face: '#E3000B', shadow: '#B8000A', studFace: '#FF2A33', studShadow: '#C50009' },
  yellow: { face: '#F5CD2D', shadow: '#C4A000', studFace: '#FFD93D', studShadow: '#D4AD00' },
  blue:   { face: '#0055BF', shadow: '#003F8F', studFace: '#3388DD', studShadow: '#004AAA' },
  green:  { face: '#00A850', shadow: '#008040', studFace: '#2BC866', studShadow: '#009048' },
} as const

type ColorKey = keyof typeof COLORS

const PLATE = {
  grey:  { face: '#B5B5B9', shadow: '#9A9A9E' },
  green: { face: '#00A850', shadow: '#008040' },
}

// Active state: which color each brick position gets
const ACTIVE_COLORS = {
  level1:      'red'    as ColorKey,
  level2Left:  'yellow' as ColorKey,
  level2Right: 'blue'   as ColorKey,
  level3Left:  'red'    as ColorKey,
  level3Right: 'green'  as ColorKey,
}

// Brick layout per stop (0-indexed)
// null = no brick at that level/side; 'left' = left half only; 'both' = left + right halves
const BRICK_LAYOUTS = [
  { level2: null,   level3: null   },  // Stop 0: 1 brick  (level1 full)
  { level2: 'left', level3: null   },  // Stop 1: 2 bricks (+ level2 left half)
  { level2: 'both', level3: null   },  // Stop 2: 3 bricks (+ level2 right half)
  { level2: 'both', level3: 'left' },  // Stop 3: 4 bricks (+ level3 left half)
  { level2: 'both', level3: 'both' },  // Stop 4: 5 bricks (+ level3 right half)
] as const

type BrickState = 'default' | 'hover' | 'focus' | 'active' | 'visited'

// ─── BrickMarker SVG component ────────────────────────────────────────────
interface BrickMarkerProps {
  stopIndex: number
  state: BrickState
}

function BrickMarker({ stopIndex, state }: BrickMarkerProps) {
  const layout = BRICK_LAYOUTS[Math.min(stopIndex, 4)]

  // Determine color key for a given brick position
  function getColorKey(position: 'level1' | 'level2Left' | 'level2Right' | 'level3Left' | 'level3Right'): ColorKey {
    if (state === 'active') return ACTIVE_COLORS[position]
    if (state === 'visited') return 'green'
    return 'grey'
  }

  function getPlateColors() {
    if (state === 'active' || state === 'visited') return PLATE.green
    return PLATE.grey
  }

  // Render a single brick rect pair (shadow + face) + optional stud
  function renderBrick(
    x: number, y: number, w: number, h: number, sy: number,
    colorKey: ColorKey,
    studXPositions: number[]  // empty = no studs
  ) {
    const c = COLORS[colorKey]
    return (
      <>
        {/* Shadow rect */}
        <rect
          x={x} y={sy} width={w} height={h + 1} rx="2"
          style={{ fill: c.shadow, transition: 'fill 300ms ease' }}
        />
        {/* Face rect */}
        <rect
          x={x} y={y} width={w} height={h} rx="2"
          style={{ fill: c.face, transition: 'fill 300ms ease' }}
        />
        {/* Studs */}
        {studXPositions.map((sx) => (
          <g key={`stud-group-${sx}`}>
            {/* Stud shadow */}
            <rect
              x={sx} y={y - STUD.shH + 1} width={STUD.w} height={STUD.shH} rx={STUD.shRx}
              style={{ fill: c.studShadow, transition: 'fill 300ms ease' }}
            />
            {/* Stud face */}
            <rect
              x={sx} y={y - STUD.h} width={STUD.w} height={STUD.h} rx={STUD.rx}
              style={{ fill: c.studFace, transition: 'fill 300ms ease' }}
            />
          </g>
        ))}
      </>
    )
  }

  const plate = getPlateColors()

  // Determine which level is the topmost (for stud rendering + animation class)
  const hasLevel3 = layout.level3 !== null
  const hasLevel2 = layout.level2 !== null

  // Active state = animate the topmost brick group
  const topGroupClass = state === 'active' ? 'brick-drop-in' : undefined

  return (
    <svg
      width={VB_W}
      height={VB_H}
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* Baseplate */}
      <rect
        x={POS.plate.x} y={POS.plate.sy} width={POS.plate.w} height={POS.plate.h + 1} rx="2.5"
        style={{ fill: plate.shadow, transition: 'fill 300ms ease' }}
      />
      <rect
        x={POS.plate.x} y={POS.plate.y} width={POS.plate.w} height={POS.plate.h} rx="2.5"
        style={{ fill: plate.face, transition: 'fill 300ms ease' }}
      />

      {/* Level 1 — full brick (always present, topmost only if no level 2/3) */}
      <g className={!hasLevel2 ? topGroupClass : undefined}>
        {renderBrick(
          POS.level1.x, POS.level1.y, POS.level1.w, POS.level1.h, POS.level1.sy,
          getColorKey('level1'),
          !hasLevel2 ? [STUD_X.left, STUD_X.right] : []
        )}
      </g>

      {/* Level 2 — half bricks (present if stopIndex >= 1) */}
      {hasLevel2 && (
        <g className={!hasLevel3 ? topGroupClass : undefined}>
          {/* Left half brick (always present if level2 exists) */}
          {renderBrick(
            POS.halfL.x, POS.level2.y, POS.halfL.w, POS.level2.h, POS.level2.sy,
            getColorKey('level2Left'),
            !hasLevel3 ? [STUD_X.left] : []
          )}
          {/* Right half brick (present if level2 === 'both') */}
          {layout.level2 === 'both' && renderBrick(
            POS.halfR.x, POS.level2.y, POS.halfR.w, POS.level2.h, POS.level2.sy,
            getColorKey('level2Right'),
            !hasLevel3 ? [STUD_X.right] : []
          )}
        </g>
      )}

      {/* Level 3 — half bricks (present if stopIndex >= 3) */}
      {hasLevel3 && (
        <g className={topGroupClass}>
          {/* Left half brick (always present if level3 exists) */}
          {renderBrick(
            POS.halfL.x, POS.level3.y, POS.halfL.w, POS.level3.h, POS.level3.sy,
            getColorKey('level3Left'),
            [STUD_X.left]
          )}
          {/* Right half brick (present if level3 === 'both') */}
          {layout.level3 === 'both' && renderBrick(
            POS.halfR.x, POS.level3.y, POS.halfR.w, POS.level3.h, POS.level3.sy,
            getColorKey('level3Right'),
            [STUD_X.right]
          )}
        </g>
      )}
    </svg>
  )
}

// ─── StopNode component ──────────────────────────────────────────────────
interface StopNodeProps {
  stop: Stop
  index: number
  isActive: boolean
  isVisited: boolean
}

// Inline style objects per variant state
function getMarkerStyle(variant: BrickState): React.CSSProperties {
  const base: React.CSSProperties = {
    transition: 'all 0.25s ease',
    transformOrigin: 'center bottom',
  }
  if (variant === 'hover') return {
    ...base,
    transform: 'scale(1.1)',
    filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.18))',
  }
  if (variant === 'focus') return {
    ...base,
    outline: '3px solid #0055BF',
    outlineOffset: '4px',
    borderRadius: '4px',
    transform: 'scale(1.08)',
  }
  if (variant === 'active') return {
    ...base,
    transform: 'translateY(-3px)',
    filter: 'drop-shadow(0 5px 12px rgba(0,0,0,0.22))',
  }
  return base
}

function getLabelStyle(variant: BrickState): React.CSSProperties {
  const base: React.CSSProperties = {
    fontFamily: 'var(--font-display)',
    fontSize: '14px',
    fontWeight: 600,
    whiteSpace: 'nowrap',
    padding: '3px 12px',
    borderRadius: '8px',
    transition: 'all 0.25s ease',
  }
  if (variant === 'hover') return {
    ...base,
    background: 'rgba(160,161,163,0.22)',
    color: '#6D6E70',
    fontWeight: 700,
  }
  if (variant === 'focus') return {
    ...base,
    background: 'rgba(0,85,191,0.1)',
    color: '#0055BF',
    fontWeight: 700,
  }
  if (variant === 'active') return {
    ...base,
    background: '#F5CD2D',
    color: '#2C2C2C',
    fontWeight: 700,
  }
  if (variant === 'visited') return {
    ...base,
    background: 'rgba(0,168,80,0.12)',
    color: '#00A850',
  }
  // default
  return {
    ...base,
    background: 'rgba(160,161,163,0.15)',
    color: '#6D6E70',
  }
}

export function StopNode({ stop, isActive, isVisited, index }: StopNodeProps) {
  const { dispatch, triggerRef } = usePresentation()
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  // State priority: active > focus > hover > visited > default
  const variant: BrickState = isActive
    ? 'active'
    : isFocused
      ? 'focus'
      : isHovered
        ? 'hover'
        : isVisited
          ? 'visited'
          : 'default'

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Store this button as the focus return target when overlay closes (A11Y-04)
    triggerRef.current = e.currentTarget
    dispatch({ type: 'JUMP_TO_STOP', stopIndex: index })
  }

  // Label above: flex-col puts label first (above marker)
  // Label below: flex-col-reverse puts label last (below marker, rendered first in DOM)
  const flexDirection = stop.labelPosition === 'above' ? 'column' : 'column-reverse'

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      data-state={variant}
      aria-label={`${stop.label} — stop ${index + 1} of 5`}
      style={{
        position: 'absolute',
        left: `${stop.coordinates.x}%`,
        top: `${stop.coordinates.y}%`,
        transform: 'translate(-50%, -100%)',
        background: 'transparent',
        border: 0,
        padding: '4px',
        cursor: 'pointer',
        outline: 'none',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection,
          alignItems: 'center',
          gap: '4px',
        }}
      >
        {/* Always-visible label — MAP-02 requires labels never hidden */}
        <span style={getLabelStyle(variant)}>
          {stop.label}
        </span>

        {/* Marker wrapper — receives transform, shadow, and focus outline */}
        <div style={getMarkerStyle(variant)}>
          <BrickMarker stopIndex={index} state={variant} />
        </div>
      </div>
    </button>
  )
}
