// src/data/topics/__tests__/stops.test.ts
// Covers FOUND-05 (type shape) and FOUND-06 (content completeness).
// RED in Plan 02; GREEN after Plan 03 authors all 5 stop files.

import { describe, it, expect } from 'vitest'
import type { Stop } from '@/types/presentation'
import { stops } from '../index'

describe('stops data', () => {
  it('has exactly 5 stops', () => {
    expect(stops).toHaveLength(5)
  })

  it('every stop has required string fields', () => {
    for (const stop of stops) {
      expect(stop.slug).toBeTruthy()
      expect(stop.label).toBeTruthy()
      expect(Array.isArray(stop.slides)).toBe(true)
      expect(stop.slides.length).toBeGreaterThan(0)
    }
  })

  it('every stop has valid percentage coordinates', () => {
    for (const stop of stops) {
      expect(stop.coordinates.x).toBeGreaterThanOrEqual(0)
      expect(stop.coordinates.x).toBeLessThanOrEqual(100)
      expect(stop.coordinates.y).toBeGreaterThanOrEqual(0)
      expect(stop.coordinates.y).toBeLessThanOrEqual(100)
    }
  })

  it('every slide has a heading and at least one content line', () => {
    for (const stop of stops) {
      for (const slide of stop.slides) {
        expect(slide.heading).toBeTruthy()
        expect(slide.lines.length).toBeGreaterThan(0)
        for (const line of slide.lines) {
          expect(line).toBeTruthy()
        }
      }
    }
  })

  it('slugs are unique', () => {
    const slugs = stops.map((s: Stop) => s.slug)
    const unique = new Set(slugs)
    expect(unique.size).toBe(stops.length)
  })
})
