import { render, screen } from '@testing-library/react'
import { BulletList } from '../BulletList'
import { TwoColumnCards } from '../TwoColumnCards'
import { EntityCards } from '../EntityCards'
import { NumberedSteps } from '../NumberedSteps'
import { CalloutBox } from '../CalloutBox'
import { DataTable } from '../DataTable'

// ─── BulletList ───────────────────────────────────────────────────────────────

describe('BulletList', () => {
  const defaultProps = {
    heading: 'Key Points',
    items: ['First item', 'Second item', 'Third item'],
  }

  it('renders without crashing', () => {
    render(<BulletList {...defaultProps} />)
    expect(screen.getByText('Key Points')).toBeTruthy()
  })

  it('renders heading text', () => {
    render(<BulletList {...defaultProps} />)
    expect(screen.getByText('Key Points')).toBeTruthy()
  })

  it('renders all list items', () => {
    render(<BulletList {...defaultProps} />)
    expect(screen.getByText('First item')).toBeTruthy()
    expect(screen.getByText('Second item')).toBeTruthy()
    expect(screen.getByText('Third item')).toBeTruthy()
  })

  it('renders with default variant (no variant prop)', () => {
    const { container } = render(<BulletList {...defaultProps} />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.boxShadow).toBe('var(--depth-default)')
  })

  it('renders with red variant', () => {
    const { container } = render(<BulletList {...defaultProps} variant="red" />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.boxShadow).toBe('var(--depth-red)')
  })

  it('renders with yellow variant', () => {
    const { container } = render(<BulletList {...defaultProps} variant="yellow" />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.boxShadow).toBe('var(--depth-yellow)')
  })
})

// ─── TwoColumnCards ───────────────────────────────────────────────────────────

describe('TwoColumnCards', () => {
  const defaultProps = {
    cards: [
      { title: 'Card One', description: 'Description for card one' },
      { title: 'Card Two', description: 'Description for card two' },
    ],
  }

  it('renders without crashing', () => {
    render(<TwoColumnCards {...defaultProps} />)
    expect(screen.getByText('Card One')).toBeTruthy()
  })

  it('renders all card titles', () => {
    render(<TwoColumnCards {...defaultProps} />)
    expect(screen.getByText('Card One')).toBeTruthy()
    expect(screen.getByText('Card Two')).toBeTruthy()
  })

  it('renders all card descriptions', () => {
    render(<TwoColumnCards {...defaultProps} />)
    expect(screen.getByText('Description for card one')).toBeTruthy()
    expect(screen.getByText('Description for card two')).toBeTruthy()
  })

  it('renders with default variant', () => {
    const { container } = render(<TwoColumnCards {...defaultProps} />)
    const cards = container.querySelectorAll('[data-testid="two-col-card"]')
    expect(cards[0].getAttribute('style')).toContain('var(--depth-default)')
  })

  it('renders with red variant', () => {
    const { container } = render(<TwoColumnCards {...defaultProps} variant="red" />)
    const cards = container.querySelectorAll('[data-testid="two-col-card"]')
    expect(cards[0].getAttribute('style')).toContain('var(--depth-red)')
  })

  it('renders with yellow variant', () => {
    const { container } = render(<TwoColumnCards {...defaultProps} variant="yellow" />)
    const cards = container.querySelectorAll('[data-testid="two-col-card"]')
    expect(cards[0].getAttribute('style')).toContain('var(--depth-yellow)')
  })
})

// ─── EntityCards ─────────────────────────────────────────────────────────────

describe('EntityCards', () => {
  const defaultProps = {
    entities: [
      { initials: 'AB', title: 'Entity Alpha', description: 'Alpha description' },
      { initials: 'CD', title: 'Entity Beta', description: 'Beta description' },
    ],
  }

  it('renders without crashing', () => {
    render(<EntityCards {...defaultProps} />)
    expect(screen.getByText('Entity Alpha')).toBeTruthy()
  })

  it('renders all entity titles', () => {
    render(<EntityCards {...defaultProps} />)
    expect(screen.getByText('Entity Alpha')).toBeTruthy()
    expect(screen.getByText('Entity Beta')).toBeTruthy()
  })

  it('renders all entity initials', () => {
    render(<EntityCards {...defaultProps} />)
    expect(screen.getByText('AB')).toBeTruthy()
    expect(screen.getByText('CD')).toBeTruthy()
  })

  it('renders all entity descriptions', () => {
    render(<EntityCards {...defaultProps} />)
    expect(screen.getByText('Alpha description')).toBeTruthy()
    expect(screen.getByText('Beta description')).toBeTruthy()
  })

  it('renders with default variant (yellow)', () => {
    const { container } = render(<EntityCards {...defaultProps} />)
    const cards = container.querySelectorAll('[data-testid="entity-card"]')
    expect(cards[0].getAttribute('style')).toContain('var(--depth-yellow)')
  })

  it('renders with red variant', () => {
    const { container } = render(<EntityCards {...defaultProps} variant="red" />)
    const cards = container.querySelectorAll('[data-testid="entity-card"]')
    expect(cards[0].getAttribute('style')).toContain('var(--depth-red)')
  })
})

// ─── NumberedSteps ────────────────────────────────────────────────────────────

describe('NumberedSteps', () => {
  const defaultProps = {
    steps: [
      { title: 'Step One', description: 'First step description' },
      { title: 'Step Two', description: 'Second step description' },
    ],
  }

  it('renders without crashing', () => {
    render(<NumberedSteps {...defaultProps} />)
    expect(screen.getByText('Step One')).toBeTruthy()
  })

  it('renders all step titles', () => {
    render(<NumberedSteps {...defaultProps} />)
    expect(screen.getByText('Step One')).toBeTruthy()
    expect(screen.getByText('Step Two')).toBeTruthy()
  })

  it('renders all step descriptions', () => {
    render(<NumberedSteps {...defaultProps} />)
    expect(screen.getByText('First step description')).toBeTruthy()
    expect(screen.getByText('Second step description')).toBeTruthy()
  })

  it('renders step numbers', () => {
    render(<NumberedSteps {...defaultProps} />)
    expect(screen.getByText('1')).toBeTruthy()
    expect(screen.getByText('2')).toBeTruthy()
  })

  it('renders with default variant', () => {
    const { container } = render(<NumberedSteps {...defaultProps} />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.boxShadow).toBe('var(--depth-default)')
  })

  it('renders with red variant', () => {
    const { container } = render(<NumberedSteps {...defaultProps} variant="red" />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.boxShadow).toBe('var(--depth-red)')
  })

  it('renders with yellow variant', () => {
    const { container } = render(<NumberedSteps {...defaultProps} variant="yellow" />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.boxShadow).toBe('var(--depth-yellow)')
  })
})

// ─── CalloutBox ───────────────────────────────────────────────────────────────

describe('CalloutBox', () => {
  it('renders without crashing', () => {
    render(<CalloutBox>Important message here</CalloutBox>)
    expect(screen.getByText('Important message here')).toBeTruthy()
  })

  it('renders children content', () => {
    render(<CalloutBox><span>Child content</span></CalloutBox>)
    expect(screen.getByText('Child content')).toBeTruthy()
  })

  it('always uses yellow variant styles', () => {
    const { container } = render(<CalloutBox>Always yellow</CalloutBox>)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.boxShadow).toBe('var(--depth-yellow)')
  })
})

// ─── DataTable ────────────────────────────────────────────────────────────────

describe('DataTable', () => {
  const defaultProps = {
    headers: ['Name', 'Role', 'Team'],
    rows: [
      ['Alice', 'Engineer', 'Platform'],
      ['Bob', 'Designer', 'Product'],
    ],
  }

  it('renders without crashing', () => {
    render(<DataTable {...defaultProps} />)
    expect(screen.getByText('Name')).toBeTruthy()
  })

  it('renders all headers', () => {
    render(<DataTable {...defaultProps} />)
    expect(screen.getByText('Name')).toBeTruthy()
    expect(screen.getByText('Role')).toBeTruthy()
    expect(screen.getByText('Team')).toBeTruthy()
  })

  it('renders all row data', () => {
    render(<DataTable {...defaultProps} />)
    expect(screen.getByText('Alice')).toBeTruthy()
    expect(screen.getByText('Engineer')).toBeTruthy()
    expect(screen.getByText('Platform')).toBeTruthy()
    expect(screen.getByText('Bob')).toBeTruthy()
    expect(screen.getByText('Designer')).toBeTruthy()
    expect(screen.getByText('Product')).toBeTruthy()
  })

  it('renders a table element', () => {
    const { container } = render(<DataTable {...defaultProps} />)
    expect(container.querySelector('table')).toBeTruthy()
  })

  it('renders with default variant', () => {
    const { container } = render(<DataTable {...defaultProps} />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.boxShadow).toBe('var(--depth-default)')
  })

  it('renders with red variant', () => {
    const { container } = render(<DataTable {...defaultProps} variant="red" />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.boxShadow).toBe('var(--depth-red)')
  })

  it('renders with yellow variant', () => {
    const { container } = render(<DataTable {...defaultProps} variant="yellow" />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.boxShadow).toBe('var(--depth-yellow)')
  })
})
