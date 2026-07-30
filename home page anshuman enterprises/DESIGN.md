---
name: Heritage Electric
colors:
  surface: '#fcf9f4'
  surface-dim: '#dcdad5'
  surface-bright: '#fcf9f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3ee'
  surface-container: '#f0ede9'
  surface-container-high: '#ebe8e3'
  surface-container-highest: '#e5e2dd'
  on-surface: '#1c1c19'
  on-surface-variant: '#524343'
  inverse-surface: '#31302d'
  inverse-on-surface: '#f3f0eb'
  outline: '#857373'
  outline-variant: '#d7c1c2'
  surface-tint: '#8b4c50'
  primary: '#170002'
  on-primary: '#ffffff'
  primary-container: '#3d0e14'
  on-primary-container: '#ba7377'
  inverse-primary: '#ffb3b6'
  secondary: '#9c4145'
  on-secondary: '#ffffff'
  secondary-container: '#fe8d90'
  on-secondary-container: '#76252b'
  tertiary: '#755b00'
  on-tertiary: '#ffffff'
  tertiary-container: '#c8a74c'
  on-tertiary-container: '#4f3d00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdada'
  primary-fixed-dim: '#ffb3b6'
  on-primary-fixed: '#390b11'
  on-primary-fixed-variant: '#6f353a'
  secondary-fixed: '#ffdad9'
  secondary-fixed-dim: '#ffb3b3'
  on-secondary-fixed: '#400009'
  on-secondary-fixed-variant: '#7d2a30'
  tertiary-fixed: '#ffe08f'
  tertiary-fixed-dim: '#e6c364'
  on-tertiary-fixed: '#241a00'
  on-tertiary-fixed-variant: '#584400'
  background: '#fcf9f4'
  on-background: '#1c1c19'
  surface-variant: '#e5e2dd'
  deep-maroon: '#3D0E14'
  crimson-maroon: '#6B1C23'
  prestige-gold: '#C9A84C'
  warm-canvas: '#FAF7F2'
  onyx-text: '#111111'
typography:
  display-lg:
    fontFamily: EB Garamond
    fontSize: 64px
    fontWeight: '500'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: EB Garamond
    fontSize: 40px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-xl:
    fontFamily: EB Garamond
    fontSize: 48px
    fontWeight: '500'
    lineHeight: '1.2'
  headline-lg:
    fontFamily: EB Garamond
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.3'
  headline-md:
    fontFamily: EB Garamond
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Montserrat
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Montserrat
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Montserrat
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-lg:
    fontFamily: Montserrat
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Montserrat
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 32px
  margin-desktop: 64px
  margin-mobile: 24px
  section-gap-lg: 120px
  section-gap-sm: 80px
---

## Brand & Style

This design system embodies the intersection of industrial reliability and high-end luxury. Designed for a premier electrical contracting firm, the aesthetic balances the gravitas of a heritage brand with the precision of modern technology.

The design style is **Modern Luxury**, characterized by:
- **Quiet Sophistication:** Expansive use of whitespace to signify exclusivity and premium service.
- **Architectural Precision:** A rigorous adherence to an 8pt grid, ensuring structural integrity across all layouts.
- **Tactile Materiality:** Subtle use of depth, soft shadows, and metallic accents that evoke the feel of high-quality hardware.
- **Craftsmanship:** A blend of classical serif typography with clean, geometric sans-serif for a functional yet timeless appeal.

## Colors

The palette is anchored by deep, regal maroons that convey strength and longevity. 

- **Primary & Secondary Maroons:** Used for structural elements, headers, and high-impact backgrounds to establish authority.
- **Prestige Gold:** This is an accent color used sparingly for interactive cues, highlights, and decorative borders to signify quality.
- **Warm Canvas:** Replacing harsh pure whites with `#FAF7F2` creates a softer, more sophisticated editorial feel.
- **Onyx Text:** Pure black is avoided in favor of `#111111` to maintain high contrast while appearing more natural and premium.

## Typography

The typography strategy employs **EB Garamond** (as a premium alternative to Cormorant) for display and headline roles to evoke a sense of tradition and excellence. 

**Montserrat** is used for all functional body and label text. Its geometric clarity balances the decorative nature of the serif headlines. For labels and buttons, utilize Montserrat in uppercase with slight tracking (letter-spacing) to enhance the "luxury brand" feel.

## Layout & Spacing

The layout follows a **Fixed Grid** system centered on the page for desktop views to maintain a curated, editorial feel. 

- **8pt Rhythm:** All padding, margins, and component heights must be multiples of 8px.
- **Generous Gaps:** Section vertical spacing should be aggressive (80px–120px) to allow the content to breathe.
- **Desktop Grid:** 12-column layout with 32px gutters.
- **Mobile Grid:** 4-column layout with 16px gutters and 24px side margins.
- **Visual Weight:** Use asymmetrical layouts for showcase sections while keeping functional data/contracting forms strictly symmetrical and aligned to the grid.

## Elevation & Depth

Hierarchy is established through **Soft Ambient Shadows** and **Tonal Layering** rather than harsh lines.

- **Surface Layers:** The base layer is `Warm Canvas`. Cards and containers use `Pure White`.
- **Shadow Profile:** Shadows should be extremely diffused (e.g., `0px 10px 30px rgba(61, 14, 20, 0.05)`), using a tiny hint of the Primary Maroon hue to keep the shadow "warm" rather than grey.
- **Interactive Depth:** On hover, cards should subtly lift using a slightly more pronounced shadow and a microscopic scale increase (1.02x).
- **Glassmorphism:** Navigation bars use a high-blur (20px) backdrop filter with 80% opacity of `Warm Canvas` to maintain context while scrolling.

## Shapes

The design system utilizes **Rounded** geometry to soften the industrial nature of electrical contracting.

- **Primary Radius:** All cards, input fields, and main containers use a `1rem` (16px) or `1.5rem` (24px) radius.
- **Inner Radius:** When nesting elements (like an image inside a card), the inner radius should be 8px smaller than the outer radius to maintain visual harmony.
- **Gold Accents:** Utilize thin (1px) borders in `Prestige Gold` for high-priority elements like "Request a Quote" buttons or featured service cards.

## Components

### Buttons
- **Primary:** Deep Maroon background, White text, 24px radius. 
- **Secondary:** Transparent background with a 1px Prestige Gold border and Gold text.
- **Interaction:** Subtle "glow" effect using a low-opacity Gold shadow on hover.

### High-End Cards
- Use `Pure White` backgrounds against the `Warm Canvas` page. 
- Padding should be generous (min 40px). 
- Use EB Garamond for card titles to maintain the premium feel.

### Input Fields
- Underlined style or softly rounded borders. 
- Use `Montserrat` for placeholder text. 
- Focus state should transition the border color to Prestige Gold.

### Sophisticated Navigation
- Minimalist top bar. 
- Use `Label-LG` typography for links.
- The "Call to Action" in the nav should be the only filled button to drive conversion.

### Lists & Specifications
- For technical electrical specs, use a clean 2-column list with `Prestige Gold` bullet points or icons to make technical data feel curated.