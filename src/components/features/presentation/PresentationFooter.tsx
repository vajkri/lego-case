'use client'
import React from 'react'
import { usePresentation } from './PresentationProvider'
import { stops } from '@/data/topics'
import { Button } from '@/components/ui'

export function PresentationFooter() {
  const { state, dispatch } = usePresentation()

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

  return (
    <footer className="flex items-center gap-3 px-6 py-3 bg-white border-t border-gray-100 shadow-md">
      {/* Prev — grey brick button */}
      <Button variant="grey" size="icon" onClick={handleBack} aria-label="Previous">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </Button>

      {/* Progress track — UNCHANGED (Phase 03.3 redesigns this section) */}
      <div className="flex items-center flex-1 justify-center">
        {stops.map((stop, i) => (
          <React.Fragment key={stop.slug}>
            {i > 0 && (
              <div
                className={[
                  'flex-1 max-w-10 h-0.5 transition-colors',
                  i <= state.currentStop ? 'bg-green-500' : 'bg-gray-200',
                ].join(' ')}
              />
            )}
            <button
              onClick={() => handleJumpToStop(i)}
              aria-label={`Go to stop ${i + 1}: ${stop.label}`}
              aria-current={i === state.currentStop ? 'step' : undefined}
              className={[
                'w-8 h-8 rounded-full text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                i < state.currentStop
                  ? 'bg-green-500 text-white focus-visible:ring-green-400'
                  : i === state.currentStop
                    ? 'bg-amber-400 text-slate-900 focus-visible:ring-amber-400'
                    : 'bg-gray-200 text-gray-500 focus-visible:ring-gray-400',
              ].join(' ')}
            >
              {i < state.currentStop ? '✓' : i + 1}
            </button>
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
    </footer>
  )
}
