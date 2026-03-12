import { describe, it, expect } from 'vitest'
import { presentationReducer } from '../PresentationProvider'
import type { PresentationState } from '@/types/presentation'
import { stops } from '@/data/topics'

// Fixture states — updated in Phase 3 to include isCarTraveling, awaitingSlideOpen, visitedStops
const mapState0: PresentationState = { currentStop: 0, currentSlide: 0, mode: 'map', isCarTraveling: false, awaitingSlideOpen: false, visitedStops: [0] }
const mapState2: PresentationState = { currentStop: 2, currentSlide: 0, mode: 'map', isCarTraveling: false, awaitingSlideOpen: false, visitedStops: [0, 1, 2] }
const mapState4: PresentationState = { currentStop: 4, currentSlide: 0, mode: 'map', isCarTraveling: false, awaitingSlideOpen: false, visitedStops: [0, 1, 2, 3, 4] }
const slideState: PresentationState = { currentStop: 2, currentSlide: 1, mode: 'slide', isCarTraveling: false, awaitingSlideOpen: false, visitedStops: [0, 1, 2] }
const slideState0: PresentationState = { currentStop: 2, currentSlide: 0, mode: 'slide', isCarTraveling: false, awaitingSlideOpen: false, visitedStops: [0, 1, 2] }

describe('presentationReducer', () => {
  // ADVANCE cases

  it('ADVANCE on map at stop 0 (awaitingSlideOpen: false) starts car travel to stop 1', () => {
    const result = presentationReducer(mapState0, { type: 'ADVANCE' })
    expect(result).toEqual({ ...mapState0, currentStop: 1, isCarTraveling: true })
  })

  it('ADVANCE on map at last stop (stop 4) is a no-op', () => {
    const result = presentationReducer(mapState4, { type: 'ADVANCE' })
    expect(result).toBe(mapState4)
  })

  it('ADVANCE during travel is a no-op', () => {
    const travelState: PresentationState = { ...mapState0, currentStop: 1, isCarTraveling: true }
    const result = presentationReducer(travelState, { type: 'ADVANCE' })
    expect(result).toBe(travelState)
  })

  it('ADVANCE on map when awaitingSlideOpen opens slide overlay', () => {
    const arrivedState: PresentationState = { ...mapState0, currentStop: 1, awaitingSlideOpen: true, visitedStops: [0, 1] }
    const result = presentationReducer(arrivedState, { type: 'ADVANCE' })
    expect(result).toEqual({ ...arrivedState, mode: 'slide', currentSlide: 0, awaitingSlideOpen: false })
  })

  it('ADVANCE on slide opens next sub-slide', () => {
    const result = presentationReducer(slideState0, { type: 'ADVANCE' })
    expect(result.currentSlide).toBe(1)
    expect(result.mode).toBe('slide')
  })

  it('ADVANCE on last sub-slide of a non-final stop advances to next stop in slide mode', () => {
    // stops[2] has 5 slides; last slide index is 4
    const lastSlideState: PresentationState = {
      currentStop: 2,
      currentSlide: stops[2].slides.length - 1,
      mode: 'slide',
      isCarTraveling: false,
      awaitingSlideOpen: false,
      visitedStops: [0, 1, 2],
    }
    const result = presentationReducer(lastSlideState, { type: 'ADVANCE' })
    expect(result.currentStop).toBe(3)
    expect(result.currentSlide).toBe(0)
    expect(result.mode).toBe('slide')
  })

  it('ADVANCE on last sub-slide of the last stop closes overlay (mode becomes map)', () => {
    const lastStopLastSlideState: PresentationState = {
      currentStop: 4,
      currentSlide: stops[4].slides.length - 1,
      mode: 'slide',
      isCarTraveling: false,
      awaitingSlideOpen: false,
      visitedStops: [0, 1, 2, 3, 4],
    }
    const result = presentationReducer(lastStopLastSlideState, { type: 'ADVANCE' })
    expect(result.mode).toBe('map')
    expect(result.currentStop).toBe(4)
    expect(result.currentSlide).toBe(0)
  })

  // ARRIVE cases

  it('ARRIVE sets isCarTraveling false, sets awaitingSlideOpen true, adds stop to visitedStops', () => {
    const travelState: PresentationState = { ...mapState0, currentStop: 1, isCarTraveling: true, visitedStops: [0] }
    const result = presentationReducer(travelState, { type: 'ARRIVE' })
    expect(result.isCarTraveling).toBe(false)
    expect(result.awaitingSlideOpen).toBe(true)
    expect(result.visitedStops).toContain(1)
  })

  it('ARRIVE does not duplicate stop in visitedStops', () => {
    const state: PresentationState = { ...mapState2, isCarTraveling: true }
    const result = presentationReducer(state, { type: 'ARRIVE' })
    expect(result.visitedStops.filter(s => s === 2).length).toBe(1)
  })

  // BACK cases

  it('BACK on map at stop 0 is a no-op', () => {
    const result = presentationReducer(mapState0, { type: 'BACK' })
    expect(result).toBe(mapState0)
  })

  it('BACK on map during travel is a no-op', () => {
    const travelState: PresentationState = { ...mapState2, isCarTraveling: true }
    const result = presentationReducer(travelState, { type: 'BACK' })
    expect(result).toBe(travelState)
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

  // JUMP_TO_STOP cases

  it('JUMP_TO_STOP sets currentStop, resets currentSlide to 0, opens slide mode', () => {
    const result = presentationReducer(mapState0, { type: 'JUMP_TO_STOP', stopIndex: 3 })
    expect(result.currentStop).toBe(3)
    expect(result.currentSlide).toBe(0)
    expect(result.mode).toBe('slide')
    expect(result.isCarTraveling).toBe(false)
    expect(result.awaitingSlideOpen).toBe(false)
  })
})
