// src/components/features/presentation/__tests__/MinifigHead.test.tsx
// Tests for MinifigHead SVG component — 3 facial expressions, color states, accessible markup.

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import React from 'react'
import { MinifigHead } from '../MinifigHead'

describe('MinifigHead — SVG anatomy', () => {
  it('renders an SVG element with default width=28 and height=34', () => {
    const { container } = render(<MinifigHead state="default" />)
    const svg = container.querySelector('svg')
    expect(svg).not.toBeNull()
    expect(svg?.getAttribute('width')).toBe('28')
    expect(svg?.getAttribute('height')).toBe('34')
  })

  it('renders SVG with custom width and height when provided', () => {
    const { container } = render(<MinifigHead state="default" width={40} height={48} />)
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('width')).toBe('40')
    expect(svg?.getAttribute('height')).toBe('48')
  })

  it('SVG has aria-hidden="true" (decorative element)', () => {
    const { container } = render(<MinifigHead state="default" />)
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('aria-hidden')).toBe('true')
  })

  it('renders 3 rect elements (stud, head, neck)', () => {
    const { container } = render(<MinifigHead state="default" />)
    const rects = container.querySelectorAll('rect')
    expect(rects.length).toBe(3)
  })

  it('all rect elements have inline style with fill and transition properties', () => {
    const { container } = render(<MinifigHead state="default" />)
    const rects = container.querySelectorAll('rect')
    rects.forEach(rect => {
      expect(rect.style.fill).not.toBe('')
      expect(rect.style.transition).toContain('fill')
    })
  })
})

describe('MinifigHead — state="default" face expression', () => {
  it('renders 2 circle elements (dot eyes)', () => {
    const { container } = render(<MinifigHead state="default" />)
    // 3 rects (stud, head, neck) + 2 circles (eyes) = 5 elements with fill
    const circles = container.querySelectorAll('circle')
    expect(circles.length).toBe(2)
  })

  it('renders 1 path element (smile)', () => {
    const { container } = render(<MinifigHead state="default" />)
    const paths = container.querySelectorAll('path')
    expect(paths.length).toBe(1)
  })

  it('head rect fill is #D4D4D8 (grey)', () => {
    const { container } = render(<MinifigHead state="default" />)
    // Head rect is the second rect (index 1: stud=0, head=1, neck=2)
    // jsdom normalizes hex to rgb, so we check both representations
    const rects = container.querySelectorAll('rect')
    const fill = rects[1].style.fill
    expect(fill === '#D4D4D8' || fill === 'rgb(212, 212, 216)').toBe(true)
  })
})

describe('MinifigHead — state="current" face expression', () => {
  it('renders 5 face elements (2 crescent eye paths + 1 grin path + 2 blush circles)', () => {
    const { container } = render(<MinifigHead state="current" />)
    const paths = container.querySelectorAll('path')
    const circles = container.querySelectorAll('circle')
    // 3 paths (left eye arc, right eye arc, grin) + 2 circles (blush)
    expect(paths.length).toBe(3)
    expect(circles.length).toBe(2)
  })

  it('head rect fill is #F5CD2D (yellow)', () => {
    const { container } = render(<MinifigHead state="current" />)
    const rects = container.querySelectorAll('rect')
    // jsdom normalizes hex to rgb
    const fill = rects[1].style.fill
    expect(fill === '#F5CD2D' || fill === 'rgb(245, 205, 45)').toBe(true)
  })
})

describe('MinifigHead — state="visited" face expression', () => {
  it('renders 4 face elements (1 open eye circle + 1 wink arc path + 1 smile path + 1 checkmark path)', () => {
    const { container } = render(<MinifigHead state="visited" />)
    const paths = container.querySelectorAll('path')
    const circles = container.querySelectorAll('circle')
    // 3 paths (wink arc, smile, checkmark) + 1 circle (open eye)
    expect(paths.length).toBe(3)
    expect(circles.length).toBe(1)
  })

  it('head rect fill is #00A850 (green)', () => {
    const { container } = render(<MinifigHead state="visited" />)
    const rects = container.querySelectorAll('rect')
    // jsdom normalizes hex to rgb
    const fill = rects[1].style.fill
    expect(fill === '#00A850' || fill === 'rgb(0, 168, 80)').toBe(true)
  })
})
