# LEGO Case — Design System Spec

> Visual reference: [styleguide.html](./mockups/styleguide.html) — open in browser for rendered examples.
> Inspiration source: [stop-marker-proposals.html](./mockups/stop-marker-proposals.html)

---

## 1. Design Tokens

### Fonts

| Token | Value | Role |
|-------|-------|------|
| `--font-display` | Baloo 2 (500–800) | Headings, labels, badges, buttons |
| `--font-body` | DM Sans (400–600, italic) | Body text, descriptions |

Google Fonts:
```
Baloo+2:wght@500;600;700;800
DM+Sans:ital,wght@0,400;0,500;0,600;1,400
```

### Colors

**Primary**

| Token | Hex | Role |
|-------|-----|------|
| `--lego-red` | #E3000B | Accent, chrome, badges, active states |
| `--lego-red-dark` | #A00008 | Button/card depth borders |
| `--lego-yellow` | #F5CD2D | Primary action button ONLY |
| `--lego-yellow-dark` | #D4A800 | Yellow depth borders |
| `--lego-blue` | #0055BF | Links, focus rings, info notes |
| `--lego-green` | #00A850 | Visited, success, complete states |

**Neutrals**

| Token | Hex | Role |
|-------|-----|------|
| `--lego-dark` | #2C2C2C | Headings, primary text |
| `--lego-grey` | #6D6E70 | Body secondary, labels (lightest safe text color) |
| `--lego-grey-light` | #A0A1A3 | **Decorative ONLY** — borders, depth shadows, disabled dots. Fails WCAG text contrast. |
| `--lego-grey-pale` | #D4D4D8 | Default borders, disabled dots |
| `--lego-grey-wash` | #F0EEE8 | Card bg, section bg, dividers |
| `--lego-cream` | #FAF8F2 | Page background |

**Tints (variant system)**

| Token | Value | Role |
|-------|-------|------|
| `--lego-red-tint` | rgba(227,0,11, 0.08) | Red variant backgrounds |
| `--lego-red-tint-md` | rgba(227,0,11, 0.10) | Red variant borders |
| `--lego-yellow-tint` | rgba(245,205,45, 0.12) | Yellow variant backgrounds |
| `--lego-yellow-tint-md` | rgba(245,205,45, 0.18) | Yellow variant borders |

### Borders

| Token | Value | Usage |
|-------|-------|-------|
| `--border-thin` | 1.5px | Internal dividers, table row separators |
| `--border-default` | 3px | Card outlines, content block borders, section dividers |
| `--border-depth` | 4px | Bottom-border depth effect on buttons |

**Depth system:** Buttons use `border-bottom: 4px` for press depth. Content blocks use a hard `box-shadow` (zero blur, 6px offset) — like a LEGO plate underneath the brick. This preserves clean rounded corners.

### Depth Shadows (content blocks)

| Token | Value | Usage |
|-------|-------|-------|
| `--depth-default` | `0 6px 0 0 var(--lego-grey-pale)` | Default variant cards/steps/tables |
| `--depth-red` | `0 6px 0 0 rgba(227,0,11, 0.18)` | Red variant blocks |
| `--depth-yellow` | `0 6px 0 0 rgba(245,205,45, 0.35)` | Yellow variant blocks |

### Radii

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 6px | Small badges, code blocks |
| `--radius-md` | 10px | Cards, content blocks |
| `--radius-lg` | 12px | Buttons |
| `--radius-xl` | 16px | Slide outer frame |
| `--radius-pill` | 999px | Stop badges, progress dots |

### Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | 0 1px 3px rgba(0,0,0,0.08) | Cards, labels |
| `--shadow-md` | 0 4px 12px rgba(0,0,0,0.10) | Footer bar |
| `--shadow-lg` | 0 8px 24px rgba(0,0,0,0.12) | Slide overlay |

---

## 2. Typography Scale

**Minimum content font size: 16px**. Exceptions only for UI chrome (badges, code).

### Baloo 2 (Display)

| Name | Weight | Size | Usage |
|------|--------|------|-------|
| Page Title | 800 | 40px | Slide main heading |
| Slide Heading | 700 | 30px | Section titles within slides |
| Section Heading | 700 | 22px | Content block subheadings |
| Card Title | 700 | 18px | Card headings, entity names |
| Step Number | 800 | 24px | Numbered step indicators |
| Button Text | 800 | 16px | Button labels |
| Badge/Label | 700 | 14px, uppercase | Stop badges — UI chrome exception |

### DM Sans (Body)

| Name | Weight | Size | Usage |
|------|--------|------|-------|
| Body | 400 | 16px | Paragraph text, descriptions |
| Body Emphasis | 600 | 16px | Bold inline, key terms |
| Body Secondary | 400 | 16px, grey | Captions, secondary info (differentiated by color) |

---

## 3. Buttons

LEGO brick style: `border-bottom: 4px` creates physical depth.

| Variant | Background | Text | Depth Border | Role |
|---------|-----------|------|--------------|------|
| Yellow | #F5CD2D | #2C2C2C (dark) | #D4A800 | Primary action (Zoom In) |
| Red | #E3000B | white | #A00008 | Forward/next |
| Grey | #F0EEE8 | #6D6E70 | #D4D4D8 | Back/secondary |

**Interaction states:**
- Hover: lighter background
- Active press: translateY(2px), border-bottom shrinks to 2px
- Disabled: opacity 0.4, cursor not-allowed

**Sizes:** Icon: 48×48px. Label: h-48px, px-22px. All `rounded-lg` (12px).

---

## 4. Slide Chrome

### Stop Badge
- Red pill: `--lego-red` background, white text
- "STOP N · LABEL" (uppercase, Baloo 2, 700, 14px)
- Single red accent for ALL stops

### Sub-Slide Progress
- Current: wider pill (22×8px), `--lego-red`
- Visited: 8×8px circle, `--lego-red` at 45% opacity
- Upcoming: 8×8px circle, `--lego-grey-pale`

### Close Button
- Top-right, 40×40px, `rounded-md`
- No back arrow top-left (explicitly excluded)

---

## 5. Content Types — Variant System

Six content block patterns. Most support three color variants via a single `variant` prop:

| Variant | Background | Border | Depth Shadow | Accent |
|---------|-----------|--------|-------------|--------|
| `default` | white | `--lego-grey-pale` | `--depth-default` | Grey |
| `red` | `--lego-red-tint` | `--lego-red-tint-md` | `--depth-red` | Red |
| `yellow` | `--lego-yellow-tint` | `--lego-yellow-tint-md` | `--depth-yellow` | Yellow |

### 1. BulletList (variants: default, red, yellow)
Heading + bullets. Variant controls bullet dot color.

### 2. TwoColumnCards (variants: default, red, yellow)
Side-by-side cards with 3px border + depth shadow. Variant controls tint, border, and shadow.

### 3. EntityCards (variants: default, red, yellow)
Full-width stacked cards. Rounded badge (48×48px) with initials on left. Title + description. Tinted background + depth shadow. **Yellow recommended** as default for entities.

### 4. NumberedSteps (variants: default, red, yellow)
Large step numbers (24px Baloo 2 800) + description. Tinted background rows + depth shadow.

### 5. CalloutBox
Yellow-bordered emphasis box with yellow tint background + depth shadow. Fixed variant (always yellow).

### 6. DataTable (variants: default, red, yellow)
Tinted header row + depth shadow. First column bold. Variant controls header bg, border, and shadow.

---

## 6. Footer Navigation

`[Grey Back] [Yellow Toggle] [Red Forward]`

- Map mode: Yellow = "Zoom In", Red = advance
- Slide mode: Yellow = "Map", Red = next sub-slide
- Disable back at start, forward at end

---

## 7. Accessibility — WCAG 2.2 AA

### Color Contrast

| Pairing | Ratio | Result |
|---------|-------|--------|
| Dark (#2C2C2C) on White | 14.5:1 | AAA |
| Grey (#6D6E70) on White | 5.3:1 | AA |
| White on Red (#E3000B) | 5.0:1 | AA |
| Red on White | 5.0:1 | AA |
| Dark on Yellow (#F5CD2D) | 9.3:1 | AAA |
| Grey Light (#A0A1A3) on White | 2.6:1 | **FAIL** — decorative only |

### WCAG 2.2 Checklist

| Criterion | Status | Implementation |
|-----------|--------|---------------|
| 1.4.3 Contrast (Min) | Pass | All text ≥ 4.5:1. Grey Light restricted to decorative. |
| 1.4.4 Resize Text | Pass | 16px body minimum. Relative units in React. No clip at 200%. |
| 1.4.11 Non-text Contrast | Pass | Focus rings, buttons, dots all ≥ 3:1. |
| 1.4.12 Text Spacing | Pass | No fixed-height text containers. |
| 2.4.7 Focus Visible | Pass | 2px solid ring, offset-2, always visible. |
| 2.4.11 Focus Not Obscured | Pass | Z-index stacking ensures focus ring visibility. |
| 2.5.8 Target Size | Pass | 48×48px buttons. 44px min interactive targets. |

### Performance Considerations
- Only 2 Google Font families loaded (preconnect + display=swap)
- CSS custom properties for theming (no JS runtime for colors)
- Variant system: one prop changes all colors (no extra render passes)
- `prefers-reduced-motion` respected via MotionConfig in React tree

---

## 8. Signature Elements

### Stud Dot Pattern
```css
radial-gradient(circle at 12px 12px, rgba(255,255,255,0.06) 6px, transparent 6px)
background-size: 32px 32px
```

### LEGO Brick Depth
```css
/* Buttons: border-bottom press effect */
border-bottom: 4px solid var(--variant-depth);

/* Content blocks: hard box-shadow plate effect */
box-shadow: 0 6px 0 0 var(--depth-color);
```

### Color Hierarchy
- Red = "where you are" (location, current state)
- Yellow = "what to do next" (primary action)
- Green = "where you've been" (visited, complete)
- Grey = "not yet / go back" (disabled, secondary)

---

## 9. Decision Log

| Decision | Chosen | Alternative | Reason |
|----------|--------|-------------|--------|
| Accent color | LEGO Red #E3000B | LEGO Blue #0055BF | Most iconic; "danger" concern mitigated by playful context |
| Per-stop colors | Single red | Multi-color (Figma Make) | User preference: consistency |
| Back button (slide) | Excluded | Include (Figma Make) | User preference: close button top-right only |
| Min font size | 16px content | 14px | Accessibility + readability |
| Default border | 3px | 1.5px | Tactile, sturdy, matches LEGO brick weight |
| Card depth | Hard box-shadow (0 6px 0 0) | border-bottom: 4px | Shadow preserves rounded corners; matches Figma Make reference |
| Yellow button text | #2C2C2C (dark) | Brown | 9.3:1 contrast vs ~2.9:1 |
| Content variants | default/red/yellow | fixed colors | Flexible system; one prop controls all related colors |
| Entity card style | Badge-left, tint bg, uniform border | Left-border accent | User feedback: left-border is generic AI pattern |
| Badge size | 14px | 12px | Better readability while still compact |
| Tint-md opacity | Red 0.10, Yellow 0.18 | Red 0.15, Yellow 0.25 | Lighter tints improve contrast on colored cards |
