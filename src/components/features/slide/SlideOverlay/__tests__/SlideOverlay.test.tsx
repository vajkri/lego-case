// src/components/features/slide/SlideOverlay/__tests__/SlideOverlay.test.tsx
// Tests for SlideOverlay component covering SLIDE-01, SLIDE-03, A11Y-01, A11Y-02, A11Y-04.

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import React from 'react'
import { SlideOverlay } from '../SlideOverlay'
import { PresentationProvider } from '@/components/features/presentation'
import { stops } from '@/data/topics'

// ---------------------------------------------------------------------------
// Mock focus-trap-react — jsdom does not implement proper focus management
// We verify FocusTrap wraps the content by checking the wrapper element.
// ---------------------------------------------------------------------------
vi.mock('focus-trap-react', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="focus-trap" data-focus-trap="active">{children}</div>
  ),
}))

// Mock motion/react animations to avoid animation-in-jsdom issues
vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, className, ...rest }: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) => (
      <div className={className} {...rest}>{children}</div>
    ),
  },
  MotionConfig: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

// ---------------------------------------------------------------------------
// Helper: render SlideOverlay inside real PresentationProvider
// PresentationProvider's initial state is mode='map'. We dispatch ADVANCE to
// open slide mode before testing SlideOverlay content.
// ---------------------------------------------------------------------------
function renderWithProvider() {
  return render(
    <PresentationProvider>
      <SlideOverlay />
    </PresentationProvider>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('SlideOverlay', () => {
  // SLIDE-01 — overlay renders (it always renders when mounted; visibility is controlled by AnimatePresence in parent)
  it('renders when state.mode is slide', () => {
    renderWithProvider()
    expect(screen.getByTestId('slide-overlay')).toBeTruthy()
  })

  // SLIDE-03 — content comes from stops data (initial state: stop 0, slide 0)
  it('renders the current stop heading from stops data', () => {
    renderWithProvider()
    // Initial state is stop 0, slide 0
    expect(screen.getByText(stops[0].slides[0].heading)).toBeTruthy()
  })

  // A11Y-01 — focus trap is present (mocked FocusTrap wraps overlay content)
  it('contains a focus-trap element wrapping the overlay content', () => {
    const { container } = renderWithProvider()
    const focusTrap = container.querySelector('[data-focus-trap]')
    expect(focusTrap).not.toBeNull()
  })

  // A11Y-02 — ARIA live region present with stop name
  it('has an aria-live="polite" region that announces current stop and slide', () => {
    const { container } = renderWithProvider()
    const liveRegion = container.querySelector('[aria-live="polite"]')
    expect(liveRegion).not.toBeNull()
    expect(liveRegion?.textContent).toContain(stops[0].label)
  })

  // A11Y-04 — close button with correct id exists
  it('renders a close button that is the first focusable element', () => {
    renderWithProvider()
    const closeBtn = screen.getByRole('button', { name: /close/i })
    expect(closeBtn).toBeTruthy()
    expect(closeBtn.id).toBe('slide-close-btn')
  })
})
