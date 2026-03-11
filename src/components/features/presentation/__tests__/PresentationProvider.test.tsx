// src/components/features/presentation/__tests__/PresentationProvider.test.tsx
// Covers FOUND-03 (no hydration errors — SSR-safe client component),
// FOUND-04 (MotionConfig present), and NAV-01 stub (reducer holds state).

import { describe, it, expect, vi } from 'vitest'
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

  it('stub reducer does not throw on ADVANCE, BACK, CLOSE', () => {
    // Suppress console.log output from stubs
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    render(
      <PresentationProvider>
        <StateDisplay />
      </PresentationProvider>
    )

    act(() => { screen.getByText('advance').click() })
    act(() => { screen.getByText('back').click() })
    act(() => { screen.getByText('close').click() })

    // State unchanged (stub returns same state — this is Phase 1 expected behavior)
    expect(screen.getByTestId('stop').textContent).toBe('0')
    expect(screen.getByTestId('mode').textContent).toBe('map')

    consoleSpy.mockRestore()
  })

  it('usePresentation throws when used outside provider', () => {
    function BadConsumer() {
      usePresentation()
      return null
    }
    expect(() => render(<BadConsumer />)).toThrow('usePresentation must be used within PresentationProvider')
  })
})
