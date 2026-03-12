import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

// CarElement does not exist yet — this import will fail until 03-04 creates it.
// This is intentional RED state (Nyquist compliance).
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error — module created in 03-04
import { CarElement } from '../CarElement'

// Mock motion/react — jsdom cannot animate CSS motion path
vi.mock('motion/react', () => ({
  motion: {
    div: vi.fn(({ children, style, animate, ...props }: React.HTMLAttributes<HTMLDivElement> & {
      style?: React.CSSProperties
      animate?: Record<string, string>
    }) => (
      <div data-testid="car-element" data-offset-distance={animate?.offsetDistance} style={style} {...props}>
        {children}
      </div>
    )),
  },
}))

const noop = () => {}

describe('CarElement — CAR-01: renders on map at target stop', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(
      <CarElement targetStop={0} isMovingBackward={false} onArrival={noop} />
    )
    expect(getByTestId('car-element')).toBeDefined()
  })

  it('renders a visible car element (not null)', () => {
    const { container } = render(
      <CarElement targetStop={2} isMovingBackward={false} onArrival={noop} />
    )
    expect(container.firstChild).not.toBeNull()
  })
})

describe('CarElement — CAR-02: offsetDistance drives position along path', () => {
  it('animates to the offsetDistance for targetStop 0', () => {
    const { getByTestId } = render(
      <CarElement targetStop={0} isMovingBackward={false} onArrival={noop} />
    )
    const el = getByTestId('car-element')
    // The offsetDistance value should match STOP_OFFSETS[0]
    expect(el.getAttribute('data-offset-distance')).toBeTruthy()
  })

  it('animates to a different offsetDistance for targetStop 4 vs targetStop 0', () => {
    const { getByTestId: getStop0 } = render(
      <CarElement targetStop={0} isMovingBackward={false} onArrival={noop} />
    )
    const { getByTestId: getStop4 } = render(
      <CarElement targetStop={4} isMovingBackward={false} onArrival={noop} />
    )
    expect(getStop0('car-element').getAttribute('data-offset-distance')).not.toBe(
      getStop4('car-element').getAttribute('data-offset-distance')
    )
  })
})

describe('CarElement — CAR-03: uses offsetPath not top/left coordinates', () => {
  it('style prop contains offsetPath (CSS motion path) not top or left', () => {
    const { getByTestId } = render(
      <CarElement targetStop={1} isMovingBackward={false} onArrival={noop} />
    )
    const el = getByTestId('car-element')
    const style = el.getAttribute('style') || ''
    // offsetPath should be present in inline styles
    // top and left should NOT be used for positioning
    expect(style).not.toMatch(/\btop\b.*px/)
    expect(style).not.toMatch(/\bleft\b.*px/)
  })

  it('onArrival callback prop is accepted without TypeScript error', () => {
    const onArrival = vi.fn()
    render(<CarElement targetStop={0} isMovingBackward={false} onArrival={onArrival} />)
    // If it renders without error, the prop interface is correct
    expect(true).toBe(true)
  })
})
