// MinifigHead — LEGO minifig head SVG with 3 facial expressions
// Pure presentational component (no client directive needed — no hooks or event handlers).
//
// State → visual meaning (per color hierarchy):
//   default  → grey  — "not yet" / upcoming stop
//   current  → yellow — "where you are" / active stop
//   visited  → green  — "where you've been" / completed stop
//
// All rect elements use inline style fill with CSS transition (not SVG fill attribute)
// so fill transitions work correctly — same pattern as BrickMarker (Phase 03.2).
//
// SVG is aria-hidden="true" — decorative; parent button provides accessible label.

export type HeadState = 'default' | 'current' | 'visited'

interface MinifigHeadProps {
  state: HeadState
  width?: number
  height?: number
}

const HEAD_COLORS: Record<HeadState, { head: string; stud: string; neck: string }> = {
  default: { head: '#D4D4D8', stud: '#B5B5B9', neck: '#B5B5B9' },
  current: { head: '#F5CD2D', stud: '#E8C020', neck: '#D4A800' },
  visited: { head: '#00A850', stud: '#008040', neck: '#008040' },
}

function DefaultFace() {
  return (
    <>
      <circle cx="12" cy="18" r="1.8" fill="#6D6E70" />
      <circle cx="22" cy="18" r="1.8" fill="#6D6E70" />
      <path d="M 12,24 Q 17,27 22,24" stroke="#6D6E70" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </>
  )
}

function CurrentFace() {
  return (
    <>
      <path d="M 9,17 Q 12,14 15,17" stroke="#2C2C2C" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M 19,17 Q 22,14 25,17" stroke="#2C2C2C" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M 9,23 Q 17,30 25,23" stroke="#2C2C2C" strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="8" cy="21" r="2" fill="rgba(227,0,11,0.12)" />
      <circle cx="26" cy="21" r="2" fill="rgba(227,0,11,0.12)" />
    </>
  )
}

function VisitedFace() {
  return (
    <>
      <circle cx="12" cy="17" r="2" fill="white" />
      <path d="M 19,17 Q 22,14.5 25,17" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M 11,24 Q 17,28 23,24" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M 14,3.5 L 16,5.5 L 21,1.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  )
}

const FACE_COMPONENTS: Record<HeadState, React.FC> = {
  default: DefaultFace,
  current: CurrentFace,
  visited: VisitedFace,
}

import React from 'react'

export function MinifigHead({ state, width = 31, height = 37 }: MinifigHeadProps) {
  const colors = HEAD_COLORS[state]
  const Face = FACE_COMPONENTS[state]
  const fillStyle = (color: string) => ({ fill: color, transition: 'fill 200ms ease' })

  return (
    <svg
      viewBox="0 0 34 40"
      width={width}
      height={height}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Stud — flat cylinder on top */}
      <rect x="11" y="2" width="12" height="4" rx="1" style={fillStyle(colors.stud)} />
      {/* Head — rounded rectangle body */}
      <rect x="3" y="6" width="28" height="26" rx="8" style={fillStyle(colors.head)} />
      {/* Neck — wider base below head */}
      <rect x="9.8" y="32" width="14.4" height="4" rx="1" style={fillStyle(colors.neck)} />
      {/* Face expression — instant swap (no transition on features) */}
      <Face />
    </svg>
  )
}
