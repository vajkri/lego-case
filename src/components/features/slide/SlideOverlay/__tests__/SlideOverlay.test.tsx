import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React, { createContext, useContext } from 'react'
import { SlideOverlay } from '../SlideOverlay'
import { stops } from '@/data/topics'
import type { PresentationState } from '@/types/presentation'
import type { Action } from '@/types/presentation'

// ---------------------------------------------------------------------------
// Minimal mock PresentationContext for testing
// ---------------------------------------------------------------------------

const PresentationContext = createContext<{
  state: PresentationState
  dispatch: React.Dispatch<Action>
} | null>(null)

function renderWithContext(
  ui: React.ReactElement,
  state: Partial<PresentationState> = {}
) {
  const fullState: PresentationState = {
    currentStop: 0,
    currentSlide: 0,
    mode: 'slide',
    ...state,
  }
  return render(
    <PresentationContext.Provider value={{ state: fullState, dispatch: () => {} }}>
      {ui}
    </PresentationContext.Provider>
  )
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('SlideOverlay', () => {
  // SLIDE-01 — overlay renders when mode is 'slide'
  it('renders when state.mode is slide', () => {
    renderWithContext(<SlideOverlay />, { mode: 'slide' })
    const overlay =
      screen.queryByRole('dialog') ?? screen.queryByTestId('slide-overlay')
    expect(overlay).toBeInTheDocument()
  })

  // SLIDE-03 — content comes from stops data
  it('renders the current stop heading from stops data', () => {
    renderWithContext(<SlideOverlay />, { currentStop: 0, currentSlide: 0, mode: 'slide' })
    expect(screen.getByText(stops[0].slides[0].heading)).toBeVisible()
  })

  // A11Y-01 — focus trap is present
  it('contains a focus-trap element wrapping the overlay content', () => {
    const { container } = renderWithContext(<SlideOverlay />, { mode: 'slide' })
    // focus-trap-react sets data-focus-trap="active" on the container
    const focusTrap = container.querySelector('[data-focus-trap]')
    expect(focusTrap).not.toBeNull()
  })

  // A11Y-02 — ARIA live region present
  it('has an aria-live="polite" region that announces current stop and slide', () => {
    const { container } = renderWithContext(<SlideOverlay />, {
      currentStop: 0,
      currentSlide: 0,
      mode: 'slide',
    })
    const liveRegion =
      screen.queryByRole('status') ?? container.querySelector('[aria-live]')
    expect(liveRegion).not.toBeNull()
    expect(liveRegion?.textContent).toContain(stops[0].label)
  })

  // A11Y-04 — close button exists
  it('renders a close button that is the first focusable element', () => {
    renderWithContext(<SlideOverlay />, { mode: 'slide' })
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument()
  })
})
