---
name: Luminous Commerce
colors:
  surface: '#fff8f2'
  surface-dim: '#e3d9c9'
  surface-bright: '#fff8f2'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fdf2e2'
  surface-container: '#f7ecdc'
  surface-container-high: '#f2e7d7'
  surface-container-highest: '#ece1d1'
  on-surface: '#201b11'
  on-surface-variant: '#4f4633'
  inverse-surface: '#353025'
  inverse-on-surface: '#faefdf'
  outline: '#817660'
  outline-variant: '#d3c5ac'
  surface-tint: '#785a00'
  primary: '#785a00'
  on-primary: '#ffffff'
  primary-container: '#eab308'
  on-primary-container: '#604700'
  inverse-primary: '#f7be1d'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e2dfde'
  on-secondary-container: '#636262'
  tertiary: '#795900'
  on-tertiary: '#ffffff'
  tertiary-container: '#ecb210'
  on-tertiary-container: '#614700'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdf9a'
  primary-fixed-dim: '#f7be1d'
  on-primary-fixed: '#251a00'
  on-primary-fixed-variant: '#5a4300'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#ffdf9f'
  tertiary-fixed-dim: '#f9bd22'
  on-tertiary-fixed: '#261a00'
  on-tertiary-fixed-variant: '#5c4300'
  background: '#fff8f2'
  on-background: '#201b11'
  surface-variant: '#ece1d1'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Montserrat
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Montserrat
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Montserrat
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Montserrat
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
---

## Brand & Style

The brand identity focuses on the intersection of technical utility and aesthetic home improvement. The design system facilitates a premium shopping experience for electrical decorative products, targeting homeowners and interior designers who value precision and style.

The visual direction follows a **Corporate / Modern** style with **Minimalist** influences. It prioritizes clarity and high-quality product photography, using a "gallery-first" approach. The interface is characterized by clean lines, ample negative space, and a bold color palette derived from the brand’s core identity. The emotional response should be one of confidence, reliability, and modern sophistication.

## Colors

The palette is anchored by a high-energy **Bold Yellow**, used strategically for primary actions and brand emphasis. This is balanced against a **Dark Charcoal** secondary color that provides professional weight and contrast.

- **Primary (Yellow):** Used for Call-to-Action buttons, active states, and highlighting product features.
- **Secondary (Charcoal):** Used for typography, navigation bars, and structural icons.
- **Neutral:** An off-white background (`#FAFAFA`) prevents eye strain and feels more premium than pure white, while light grays handle borders and secondary information.
- **Functional:** Success, Error, and Warning colors should be used sparingly, maintaining the primary yellow as the dominant interactive signal.

## Typography

The design system utilizes **Montserrat** across all levels to maintain a geometric, modern, and highly legible appearance. 

The type scale is designed with a strong hierarchy:
- **Headlines:** Use Bold (700) and Semi-Bold (600) weights to create immediate impact against the light backgrounds.
- **Body Copy:** Set with generous line height (1.5x) to ensure readability for technical product specifications.
- **Labels:** Small labels and "Overlines" should use Medium (500) or Semi-Bold (600) weights, often in uppercase for product categories or status badges to differentiate them from body text.

## Layout & Spacing

This design system uses a **Fixed Grid** model for desktop to ensure product imagery remains consistent across different monitor sizes, and a **Fluid Grid** for mobile devices.

- **Desktop Layout:** 12-column grid with a 1280px max-width. Gutters are fixed at 24px to provide "breathing room" between product cards.
- **Mobile Layout:** 4-column fluid grid with 16px side margins. 
- **Spacing Philosophy:** We employ a 8px-based linear scale. Section vertical spacing should be aggressive (`lg` or `xl`) to allow the electrical products to be perceived as individual design pieces rather than cluttered inventory.

## Elevation & Depth

To maintain a clean and modern aesthetic, depth is created through **Tonal Layers** and **Ambient Shadows**.

- **Level 0 (Base):** The off-white canvas.
- **Level 1 (Cards):** Surfaces use a pure white background with a very soft, diffused shadow (Y: 4px, Blur: 20px, Opacity: 4% Black). On hover, this elevation increases slightly to indicate interactivity.
- **Level 2 (Dropdowns/Modals):** More defined shadows to separate functional overlays from the content below (Y: 8px, Blur: 30px, Opacity: 8% Black).
- **Outlines:** Subtle 1px borders in Light Gray (`#E5E7EB`) are used for input fields and secondary containers instead of shadows to keep the UI from feeling "heavy."

## Shapes

The shape language is **Rounded**, balancing the technical nature of electrical products with a friendly, consumer-facing accessibility. 

- **Standard Elements:** Buttons, input fields, and small cards use a 0.5rem (8px) radius.
- **Large Containers:** Product cards and hero sections use 1rem (16px) for a more modern, "app-like" feel.
- **Interactive States:** Buttons retain their radius but may use a subtle scale-down effect (0.98) on click to feel more tactile.

## Components

### Buttons
- **Primary:** Bold Yellow background, Dark Charcoal text. High contrast is essential. No border.
- **Secondary:** Transparent background with a 2px Dark Charcoal border.
- **Tertiary:** Text-only with a heavy underline on hover, used for "Read More" or "View All" links.

### Product Cards
- Pure white background with 16px padding.
- Imagery should occupy the top 60% of the card on a light-gray neutral placeholder if no image exists.
- Titles are Semi-Bold Montserrat; prices are Primary Yellow.

### Input Fields
- White background with a 1px Light Gray border.
- On focus, the border transitions to Dark Charcoal with a 2px "ring" of the Primary Yellow at 20% opacity.

### Navigation
- Top navigation uses a sticky header with a white background. 
- Main categories use Dark Charcoal text; the "Cart" or "Profile" icons can use the Primary Yellow for visual weight.

### Chips & Badges
- Used for "Sale," "New," or "In Stock" indicators.
- Rounded (Pill-shaped) with small uppercase Montserrat text. 
- Use Primary Yellow for "New" and a muted charcoal for technical categories.