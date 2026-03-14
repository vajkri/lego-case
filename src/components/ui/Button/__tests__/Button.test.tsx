import { render, screen } from '@testing-library/react'
import { Button } from '../Button'

describe('Button', () => {
  describe('data-testid', () => {
    it('renders with data-testid="button"', () => {
      render(<Button variant="yellow">Click me</Button>)
      expect(screen.getByTestId('button')).toBeTruthy()
    })
  })

  describe('variants', () => {
    it('yellow variant has bg-lego-yellow class', () => {
      render(<Button variant="yellow">Yellow</Button>)
      expect(screen.getByTestId('button').className).toContain('bg-lego-yellow')
    })

    it('yellow variant has border-lego-yellow-dark class', () => {
      render(<Button variant="yellow">Yellow</Button>)
      expect(screen.getByTestId('button').className).toContain('border-lego-yellow-dark')
    })

    it('red variant has bg-lego-red class', () => {
      render(<Button variant="red">Red</Button>)
      expect(screen.getByTestId('button').className).toContain('bg-lego-red')
    })

    it('red variant has border-lego-red-dark class', () => {
      render(<Button variant="red">Red</Button>)
      expect(screen.getByTestId('button').className).toContain('border-lego-red-dark')
    })

    it('grey variant has bg-lego-grey-wash class', () => {
      render(<Button variant="grey">Grey</Button>)
      expect(screen.getByTestId('button').className).toContain('bg-lego-grey-wash')
    })

    it('grey variant has border-lego-grey-pale class', () => {
      render(<Button variant="grey">Grey</Button>)
      expect(screen.getByTestId('button').className).toContain('border-lego-grey-pale')
    })
  })

  describe('sizes', () => {
    it('icon size has w-12 class', () => {
      render(<Button variant="yellow" size="icon">icon</Button>)
      expect(screen.getByTestId('button').className).toContain('w-12')
    })

    it('icon size has h-12 class', () => {
      render(<Button variant="yellow" size="icon">icon</Button>)
      expect(screen.getByTestId('button').className).toContain('h-12')
    })

    it('label size (default) has h-12 class', () => {
      render(<Button variant="yellow">label</Button>)
      expect(screen.getByTestId('button').className).toContain('h-12')
    })
  })

  describe('disabled state', () => {
    it('disabled button has opacity-40 class', () => {
      render(<Button variant="yellow" disabled>Disabled</Button>)
      expect(screen.getByTestId('button').className).toContain('opacity-40')
    })

    it('disabled button has cursor-not-allowed class', () => {
      render(<Button variant="yellow" disabled>Disabled</Button>)
      expect(screen.getByTestId('button').className).toContain('cursor-not-allowed')
    })

    it('disabled button has disabled attribute', () => {
      render(<Button variant="yellow" disabled>Disabled</Button>)
      expect(screen.getByTestId('button')).toBeDisabled()
    })
  })

  describe('content and attributes', () => {
    it('renders children content', () => {
      render(<Button variant="yellow">Click me</Button>)
      expect(screen.getByText('Click me')).toBeTruthy()
    })

    it('has aria-label when provided', () => {
      render(<Button variant="red" aria-label="Close slide">X</Button>)
      expect(screen.getByTestId('button')).toHaveAttribute('aria-label', 'Close slide')
    })

    it('has type="button" by default', () => {
      render(<Button variant="grey">Back</Button>)
      expect(screen.getByTestId('button')).toHaveAttribute('type', 'button')
    })
  })
})
