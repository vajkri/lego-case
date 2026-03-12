import { describe, it, expect } from 'vitest'
import { presentationReducer } from '../PresentationProvider'
import type { PresentationState } from '@/types/presentation'
import { stops } from '@/data/topics'

// Fixture states
const mapState0: PresentationState = { currentStop: 0, currentSlide: 0, mode: 'map' }
const mapState2: PresentationState = { currentStop: 2, currentSlide: 0, mode: 'map' }
const mapState4: PresentationState = { currentStop: 4, currentSlide: 0, mode: 'map' }
const slideState: PresentationState = { currentStop: 2, currentSlide: 1, mode: 'slide' }
const slideState0: PresentationState = { currentStop: 2, currentSlide: 0, mode: 'slide' }

describe('presentationReducer', () => {
  // ADVANCE cases

  it('ADVANCE on map at stop 0 opens stop 1 at slide 0 in slide mode', () => {
    const result = presentationReducer(mapState0, { type: 'ADVANCE' })
    expect(result).toEqual({ currentStop: 1, currentSlide: 0, mode: 'slide' })
  })

  it('ADVANCE on map at last stop (stop 4) is a no-op', () => {
    const result = presentationReducer(mapState4, { type: 'ADVANCE' })
    expect(result).toEqual(mapState4)
  })

  it('ADVANCE on slide opens next sub-slide', () => {
    const result = presentationReducer(slideState0, { type: 'ADVANCE' })
    expect(result.currentSlide).toBe(1)
    expect(result.mode).toBe('slide')
  })

  it('ADVANCE on last sub-slide of a stop closes overlay (mode becomes map)', () => {
    // stops[2] has 5 slides; last slide index is 4
    const lastSlideState: PresentationState = {
      currentStop: 2,
      currentSlide: stops[2].slides.length - 1,
      mode: 'slide',
    }
    const result = presentationReducer(lastSlideState, { type: 'ADVANCE' })
    expect(result).toEqual({ ...lastSlideState, mode: 'map', currentSlide: 0 })
  })

  // BACK cases

  it('BACK on map at stop 0 is a no-op', () => {
    const result = presentationReducer(mapState0, { type: 'BACK' })
    expect(result).toEqual(mapState0)
  })

  it('BACK on map at stop 2 opens stop 1 at its last slide in slide mode', () => {
    const result = presentationReducer(mapState2, { type: 'BACK' })
    expect(result.currentStop).toBe(1)
    expect(result.mode).toBe('slide')
    expect(result.currentSlide).toBe(stops[1].slides.length - 1)
  })

  it('BACK on slide index 0 closes overlay (mode becomes map)', () => {
    const result = presentationReducer(slideState0, { type: 'BACK' })
    expect(result).toEqual({ ...slideState0, mode: 'map' })
  })

  it('BACK on slide index 1 goes back to slide 0', () => {
    const result = presentationReducer(slideState, { type: 'BACK' })
    expect(result.currentSlide).toBe(0)
  })

  // CLOSE cases

  it('CLOSE returns to map mode, preserving currentStop and currentSlide', () => {
    const result = presentationReducer(slideState, { type: 'CLOSE' })
    expect(result.mode).toBe('map')
    expect(result.currentStop).toBe(slideState.currentStop)
    expect(result.currentSlide).toBe(slideState.currentSlide)
  })

  // JUMP_TO_STOP cases (action type added in Wave 1 — TypeScript error acceptable in Wave 0)

  it('JUMP_TO_STOP sets currentStop, resets currentSlide to 0, opens slide mode', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = presentationReducer(mapState0, { type: 'JUMP_TO_STOP', stopIndex: 3 } as any)
    expect(result).toEqual({ currentStop: 3, currentSlide: 0, mode: 'slide' })
  })
})
