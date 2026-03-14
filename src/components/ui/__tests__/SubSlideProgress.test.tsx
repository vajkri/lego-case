// src/components/ui/__tests__/SubSlideProgress.test.tsx
// Tests for the promoted SubSlideProgress component with size prop.

import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import React from 'react'
import { SubSlideProgress } from '../SubSlideProgress'

// Mock motion/react — SubSlideProgress uses motion.span for dot animations
vi.mock('motion/react', () => ({
  motion: {
    span: ({ children, className, style, animate, transition, ...rest }: React.HTMLAttributes<HTMLSpanElement> & { children?: React.ReactNode; animate?: Record<string, unknown>; transition?: Record<string, unknown> }) => (
      <span className={className} style={{ ...style, ...(animate as React.CSSProperties) }} {...rest}>{children}</span>
    ),
  },
}))

describe('SubSlideProgress — size="default" (or omitted)', () => {
  it('renders dots with h-2 class by default', () => {
    const { container } = render(<SubSlideProgress total={3} current={0} />)
    const dots = container.querySelectorAll('span')
    dots.forEach(dot => {
      expect(dot.className).toContain('h-2')
    })
  })

  it('current dot has width 22px', () => {
    const { container } = render(<SubSlideProgress total={3} current={1} />)
    const dots = container.querySelectorAll('span')
    expect(dots[1].style.width).toBe('22px')
  })

  it('non-current dot has width 8px', () => {
    const { container } = render(<SubSlideProgress total={3} current={1} />)
    const dots = container.querySelectorAll('span')
    expect(dots[0].style.width).toBe('8px')
    expect(dots[2].style.width).toBe('8px')
  })

  it('container has gap-1.5 class', () => {
    const { container } = render(<SubSlideProgress total={3} current={0} />)
    const wrapper = container.querySelector('div')
    expect(wrapper?.className).toContain('gap-1.5')
  })
})

describe('SubSlideProgress — size="sm"', () => {
  it('renders dots with h-1.5 class', () => {
    const { container } = render(<SubSlideProgress total={3} current={0} size="sm" />)
    const dots = container.querySelectorAll('span')
    dots.forEach(dot => {
      expect(dot.className).toContain('h-1.5')
    })
  })

  it('current dot has width 16px', () => {
    const { container } = render(<SubSlideProgress total={3} current={1} size="sm" />)
    const dots = container.querySelectorAll('span')
    expect(dots[1].style.width).toBe('16px')
  })

  it('non-current dot has width 6px', () => {
    const { container } = render(<SubSlideProgress total={3} current={1} size="sm" />)
    const dots = container.querySelectorAll('span')
    expect(dots[0].style.width).toBe('6px')
    expect(dots[2].style.width).toBe('6px')
  })

  it('container has gap-0.5 class', () => {
    const { container } = render(<SubSlideProgress total={3} current={0} size="sm" />)
    const wrapper = container.querySelector('div')
    expect(wrapper?.className).toContain('gap-0.5')
  })
})

describe('SubSlideProgress — backward compatibility (no size prop)', () => {
  it('renders correctly without size prop (defaults to default behavior)', () => {
    const { container } = render(<SubSlideProgress total={2} current={0} />)
    const dots = container.querySelectorAll('span')
    expect(dots.length).toBe(2)
    // Defaults to 'default' size
    expect(dots[0].className).toContain('h-2')
    expect(dots[0].style.width).toBe('22px') // current (index 0 = current)
    expect(dots[1].style.width).toBe('8px')  // non-current
  })
})

describe('SubSlideProgress — accessibility', () => {
  it('container div has aria-hidden="true" (decorative)', () => {
    const { container } = render(<SubSlideProgress total={3} current={0} />)
    const wrapper = container.querySelector('[aria-hidden="true"]')
    expect(wrapper).not.toBeNull()
  })
})
