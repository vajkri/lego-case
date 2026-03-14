// src/components/ui/SlideFrame/__tests__/SlideFrame.test.tsx
// Tests for SlideFrame chrome wrapper, StopBadge, and SubSlideProgress components.

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { SlideFrame } from '../SlideFrame'
import { StopBadge } from '../StopBadge'
import { SubSlideProgress } from '../SubSlideProgress'

// ---------------------------------------------------------------------------
// SlideFrame
// ---------------------------------------------------------------------------
describe('SlideFrame', () => {
  it('renders a close button with id="slide-close-btn" (CRITICAL — FocusTrap regression)', () => {
    render(
      <SlideFrame onClose={() => {}}>
        <div>Content</div>
      </SlideFrame>
    )
    const closeBtn = document.getElementById('slide-close-btn')
    expect(closeBtn).not.toBeNull()
  })

  it('close button has aria-label="Close slide overlay"', () => {
    render(
      <SlideFrame onClose={() => {}}>
        <div>Content</div>
      </SlideFrame>
    )
    const closeBtn = screen.getByRole('button', { name: /close slide overlay/i })
    expect(closeBtn).toBeTruthy()
  })

  it('renders a header element with stud-pattern class', () => {
    const { container } = render(
      <SlideFrame onClose={() => {}}>
        <div>Content</div>
      </SlideFrame>
    )
    const header = container.querySelector('header')
    expect(header).not.toBeNull()
    expect(header?.className).toContain('stud-pattern')
  })

  it('renders children inside the component', () => {
    render(
      <SlideFrame onClose={() => {}}>
        <div data-testid="child-content">Hello</div>
      </SlideFrame>
    )
    expect(screen.getByTestId('child-content')).toBeTruthy()
    expect(screen.getByText('Hello')).toBeTruthy()
  })

  it('renders leftArrow slot when provided', () => {
    render(
      <SlideFrame onClose={() => {}} leftArrow={<button data-testid="left-arrow">Left</button>}>
        <div>Content</div>
      </SlideFrame>
    )
    expect(screen.getByTestId('left-arrow')).toBeTruthy()
  })

  it('renders rightArrow slot when provided', () => {
    render(
      <SlideFrame onClose={() => {}} rightArrow={<button data-testid="right-arrow">Right</button>}>
        <div>Content</div>
      </SlideFrame>
    )
    expect(screen.getByTestId('right-arrow')).toBeTruthy()
  })
})

// ---------------------------------------------------------------------------
// StopBadge
// ---------------------------------------------------------------------------
describe('StopBadge', () => {
  it('renders "STOP 1" for stopIndex=0', () => {
    render(<StopBadge stopIndex={0} stopLabel="Introduction" />)
    expect(screen.getByText(/STOP 1/i)).toBeTruthy()
  })

  it('renders "STOP 3" for stopIndex=2', () => {
    render(<StopBadge stopIndex={2} stopLabel="Some Stop" />)
    expect(screen.getByText(/STOP 3/i)).toBeTruthy()
  })

  it('renders the stop label text', () => {
    render(<StopBadge stopIndex={0} stopLabel="My Label" />)
    expect(screen.getByText(/My Label/i)).toBeTruthy()
  })
})

// ---------------------------------------------------------------------------
// SubSlideProgress
// ---------------------------------------------------------------------------
describe('SubSlideProgress', () => {
  it('renders the correct number of span elements for total=3', () => {
    const { container } = render(<SubSlideProgress total={3} current={0} />)
    const dots = container.querySelectorAll('span')
    expect(dots.length).toBe(3)
  })

  it('renders correct dots for total=1', () => {
    const { container } = render(<SubSlideProgress total={1} current={0} />)
    const dots = container.querySelectorAll('span')
    expect(dots.length).toBe(1)
  })

  it('current dot (index matches current prop) has a different style than non-current dots', () => {
    const { container } = render(<SubSlideProgress total={3} current={1} />)
    const dots = container.querySelectorAll('span')
    // Dot at index 1 is the current dot — wider pill (22px inline style)
    // The current dot class includes 'h-2' (pill height)
    expect(dots[1].className).toContain('h-2')
    // Verify non-current and current dots differ (current has a unique class/style)
    expect(dots[0].className).not.toBe(dots[1].className)
  })

  it('container div is aria-hidden="true" (decorative)', () => {
    const { container } = render(<SubSlideProgress total={3} current={0} />)
    const wrapper = container.querySelector('[aria-hidden="true"]')
    expect(wrapper).not.toBeNull()
  })
})
