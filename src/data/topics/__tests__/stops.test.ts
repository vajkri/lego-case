// src/data/topics/__tests__/stops.test.ts
// Covers FOUND-05 (type shape) and FOUND-06 (content completeness).
// RED in Plan 02; GREEN after Plan 03 authors all 5 stop files.
// Phase 4: Updated for ContentBlock shape (blocks[] replaces lines[]).

import { describe, it, expect } from 'vitest'
import type { Stop } from '@/types/presentation'
import { stops } from '../index'

const VALID_BLOCK_TYPES = [
  'bullet-list',
  'two-column-cards',
  'entity-cards',
  'numbered-steps',
  'callout',
  'data-table',
] as const

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

  it('every slide has a heading and at least one content block', () => {
    for (const stop of stops) {
      for (const slide of stop.slides) {
        expect(slide.heading).toBeTruthy()
        expect(slide.blocks.length).toBeGreaterThan(0)
        for (const block of slide.blocks) {
          expect(block.type).toBeTruthy()
        }
      }
    }
  })

  it('every block type is one of the 6 known values', () => {
    for (const stop of stops) {
      for (const slide of stop.slides) {
        for (const block of slide.blocks) {
          expect(VALID_BLOCK_TYPES).toContain(block.type)
        }
      }
    }
  })

  it('slugs are unique', () => {
    const slugs = stops.map((s: Stop) => s.slug)
    const unique = new Set(slugs)
    expect(unique.size).toBe(stops.length)
  })

  it('every stop has a valid labelPosition', () => {
    for (const stop of stops) {
      expect(['above', 'below']).toContain(stop.labelPosition)
    }
  })
})
