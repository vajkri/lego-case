'use client'
import React, { useState } from 'react'
import { usePresentation } from './PresentationProvider'
import { stops } from '@/data/topics'
import { Button } from '@/components/ui'
import { SubSlideProgress } from '@/components/ui'
import { MinifigHead } from './MinifigHead'

export function PresentationFooter() {
  const { state, dispatch } = usePresentation()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)

  const handleBack = () => dispatch({ type: 'BACK' })
  const handleAdvance = () => dispatch({ type: 'ADVANCE' })
  const handleJumpToStop = (i: number) => dispatch({ type: 'JUMP_TO_STOP', stopIndex: i })

  const handleToggle = () => {
    if (state.mode === 'slide') {
      dispatch({ type: 'CLOSE' })
    } else {
      dispatch({ type: 'JUMP_TO_STOP', stopIndex: state.currentStop })
    }
  }

  const getHeadState = (i: number): 'default' | 'current' | 'visited' => {
    if (i === state.currentStop) return 'current'
    if (state.visitedStops.includes(i) && i < state.currentStop) return 'visited'
    return 'default'
  }

  const getConnectorStyle = (i: number): React.CSSProperties => {
    // Connector at index i connects stop i-1 to stop i
    const leftVisited = state.visitedStops.includes(i - 1) && i - 1 < state.currentStop
    const rightVisited = state.visitedStops.includes(i) && i < state.currentStop

    if (leftVisited && rightVisited) {
      // Both sides visited — green sweep
      return {
        height: '3px',
        borderRadius: '999px',
        background: `linear-gradient(to right, var(--color-lego-green) 50%, var(--color-lego-grey-pale) 50%)`,
        backgroundSize: '200% 100%',
        backgroundPosition: 'left',
        transition: 'background-position 200ms ease-out',
      }
    } else if (i === state.currentStop) {
      // Connector leading into current stop — red
      return {
        height: '3px',
        borderRadius: '999px',
        background: 'var(--color-lego-red)',
        transition: 'background 200ms ease',
      }
    } else {
      // Upcoming — grey
      return {
        height: '3px',
        borderRadius: '999px',
        background: 'var(--color-lego-grey-pale)',
        transition: 'background 200ms ease',
      }
    }
  }

  const getButtonStyle = (i: number): React.CSSProperties => {
    const base: React.CSSProperties = {
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: '2px',
      outline: 'none',
      transition: 'all 0.25s ease',
    }

    if (focusedIndex === i) {
      return {
        ...base,
        outline: '3px solid #0055BF',
        outlineOffset: '4px',
        borderRadius: '10px',
        transform: 'scale(1.08)',
      }
    }
    if (hoveredIndex === i) {
      return {
        ...base,
        transform: 'scale(1.1)',
        filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.2))',
      }
    }
    return base
  }

  return (
    <footer className="bg-white border-t border-gray-100 shadow-md">
      <div className="section-container flex items-center gap-3 py-3">
        {/* Prev — grey brick button */}
        <Button variant="grey" size="icon" onClick={handleBack} aria-label="Previous">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Button>

        {/* Progress track — minifig heads with semantic connectors and sub-slide dots */}
        <div className="flex items-center flex-1 justify-center">
          {stops.map((stop, i) => (
            <React.Fragment key={stop.slug}>
              {i > 0 && (
                <div
                  className="flex-1 max-w-10 self-center"
                  style={getConnectorStyle(i)}
                />
              )}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => handleJumpToStop(i)}
                  aria-label={`Go to stop ${i + 1}: ${stop.label}`}
                  aria-current={i === state.currentStop ? 'step' : undefined}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onFocus={() => setFocusedIndex(i)}
                  onBlur={() => setFocusedIndex(null)}
                  style={getButtonStyle(i)}
                >
                  <MinifigHead state={getHeadState(i)} />
                </button>
                {i === state.currentStop ? (
                  <SubSlideProgress
                    total={stops[state.currentStop].slides.length}
                    current={state.currentSlide}
                    size="sm"
                  />
                ) : (
                  <div className="min-h-[8px]" />
                )}
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Map / Zoom in toggle — yellow primary action button */}
        <Button variant="yellow" size="label" onClick={handleToggle}>
          {state.mode === 'slide' ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                <line x1="9" y1="3" x2="9" y2="18" />
                <line x1="15" y1="6" x2="15" y2="21" />
              </svg>
              Map
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="11" y1="8" x2="11" y2="14" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
              Zoom in
            </>
          )}
        </Button>

        {/* Next — red brick button */}
        <Button variant="red" size="icon" onClick={handleAdvance} aria-label="Next">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Button>
      </div>
    </footer>
  )
}
