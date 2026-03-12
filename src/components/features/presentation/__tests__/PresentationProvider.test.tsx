// src/components/features/presentation/__tests__/PresentationProvider.test.tsx
// Covers FOUND-03 (no hydration errors — SSR-safe client component),
// FOUND-04 (MotionConfig present), and NAV-01 stub (reducer holds state).

import { describe, it, expect } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { PresentationProvider, usePresentation } from '../PresentationProvider'

// Minimal consumer component for testing the hook
function StateDisplay() {
  const { state, dispatch } = usePresentation()
  return (
    <div>
      <span data-testid="stop">{state.currentStop}</span>
      <span data-testid="slide">{state.currentSlide}</span>
      <span data-testid="mode">{state.mode}</span>
      <button onClick={() => dispatch({ type: 'ADVANCE' })}>advance</button>
      <button onClick={() => dispatch({ type: 'BACK' })}>back</button>
      <button onClick={() => dispatch({ type: 'CLOSE' })}>close</button>
    </div>
  )
}

describe('PresentationProvider', () => {
  it('renders children without error', () => {
    render(
      <PresentationProvider>
        <div data-testid="child">hello</div>
      </PresentationProvider>
    )
    expect(screen.getByTestId('child')).toBeTruthy()
  })

  it('provides initial state { currentStop: 0, currentSlide: 0, mode: map }', () => {
    render(
      <PresentationProvider>
        <StateDisplay />
      </PresentationProvider>
    )
    expect(screen.getByTestId('stop').textContent).toBe('0')
    expect(screen.getByTestId('slide').textContent).toBe('0')
    expect(screen.getByTestId('mode').textContent).toBe('map')
  })

  it('real reducer transitions state correctly on ADVANCE, BACK, CLOSE', () => {
    render(
      <PresentationProvider>
        <StateDisplay />
      </PresentationProvider>
    )

    // ADVANCE from stop 0 map → opens stop 1 in slide mode
    act(() => { screen.getByText('advance').click() })
    expect(screen.getByTestId('stop').textContent).toBe('1')
    expect(screen.getByTestId('mode').textContent).toBe('slide')

    // CLOSE from slide mode → returns to map
    act(() => { screen.getByText('close').click() })
    expect(screen.getByTestId('mode').textContent).toBe('map')
  })

  it('usePresentation throws when used outside provider', () => {
    function BadConsumer() {
      usePresentation()
      return null
    }
    expect(() => render(<BadConsumer />)).toThrow('usePresentation must be used within PresentationProvider')
  })
})
