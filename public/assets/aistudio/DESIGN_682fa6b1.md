---
name: Movefair Chennai Mobility
colors:
  surface: '#f2fcf2'
  surface-dim: '#d3ddd3'
  surface-bright: '#f2fcf2'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#ecf6ed'
  surface-container: '#e6f1e7'
  surface-container-high: '#e1ebe1'
  surface-container-highest: '#dbe5dc'
  on-surface: '#151e18'
  on-surface-variant: '#3f4944'
  inverse-surface: '#29332c'
  inverse-on-surface: '#e9f3ea'
  outline: '#6f7974'
  outline-variant: '#bec9c3'
  surface-tint: '#1b6a55'
  primary: '#005b47'
  on-primary: '#ffffff'
  primary-container: '#28745e'
  on-primary-container: '#acf7db'
  inverse-primary: '#8bd5bb'
  secondary: '#386477'
  on-secondary: '#ffffff'
  secondary-container: '#bae6fd'
  on-secondary-container: '#3d687b'
  tertiary: '#245848'
  on-tertiary: '#ffffff'
  tertiary-container: '#3e715f'
  on-tertiary-container: '#bcf3dd'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#a7f2d6'
  primary-fixed-dim: '#8bd5bb'
  on-primary-fixed: '#002117'
  on-primary-fixed-variant: '#00513e'
  secondary-fixed: '#bee9ff'
  secondary-fixed-dim: '#a1cde3'
  on-secondary-fixed: '#001f2a'
  on-secondary-fixed-variant: '#1e4c5e'
  tertiary-fixed: '#b7eed8'
  tertiary-fixed-dim: '#9cd2bc'
  on-tertiary-fixed: '#002117'
  on-tertiary-fixed-variant: '#1a4f3f'
  background: '#f2fcf2'
  on-background: '#151e18'
  surface-variant: '#dbe5dc'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Manrope
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Manrope
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.005em
  headline-sm:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
  tabular-clock:
    fontFamily: IBM Plex Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  tabular-fare:
    fontFamily: IBM Plex Mono
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

This design system embodies a civic-minded, human, and grounded public transportation interface tailored for Chennai’s multi-modal urban transit grid (MTC buses, CMRL metro, suburban trains, and auto-rickshaw first/last mile links). 

The visual atmosphere balances civic responsibility with modern product refinement. It completely rejects neon-heavy "smart city" dashboards, dark-mode cyberpunk tropes, and high-gloss gradients in favor of an editorial, warm-ivory canvas that feels legible under direct sunlight on a coastal street corner. The emotional tone is reassuring, predictable, unhurried, and functional—catering equally to everyday commuters rushing through Chennai Central and transit planners auditing inter-modal wait times.

Design movement influences:
- **Warm Civic Modernism**: Natural light surfaces, crisp white content cards, structured typography hierarchies, and tactile borders that mirror physical transit passes and signage.
- **Bilingual & Multi-Modal Clarity**: Designed from the core to support simultaneous English and Tamil script rendering with equal baseline optical weight.

## Colors

The palette is anchored in Chennai’s transit infrastructure and coastal urban flora. Rather than standard synthetic digital blues, the system relies on deep foliage and civic greens balanced by maritime rail slates.

### Color Roles & Guidelines

- **Primary Action (`#28745E` - MTC Emerald)**: Used for primary calls-to-action, active segment pills, live transit indicators, confirmed bookings, and primary step nodes in a multi-leg journey.
- **Brand Deep Green (`#174D3D` - Forest Shade)**: Used for authoritative headers, navigation top bars, badge containers, and high-emphasis brand anchors.
- **Transit Secondary (`#547F93` - Rail Slate)**: Represents CMRL Metro lines, MRTS / Suburban rail networks, multi-modal transfer tags, and secondary action touchpoints.
- **Surface Canvas (`#F6F7F4` - Warm Ivory)**: The global canvas background. Provides soft contrast without the glare of pure `#FFFFFF`, softening visual fatigue in bright outdoors.
- **Surface Container (`#FFFFFF`)**: Distinct, card-level floating surfaces holding active trip data, schedules, and inputs.
- **Surface Muted (`#EEF1EC`)**: Segment controls, disabled states, route timeline tracks, and input field backgrounds.
- **Ink Primary (`#202923`)**: Deep charcoal with an organic green undertone. Used for headers, primary route numbers, and critical journey milestones.
- **Ink Secondary (`#6D7770`)**: Calibrated for high readability of platform numbers, intermediate stop lists, metadata, and helper text.
- **Border Default (`#E4E8E2`)**: 1px structural framing for crisp containment without visual clutter.
- **Amber Notice & Savings (`#D49A57`)**: Peak hour delays, dynamic fare savings alerts, and bus crowding warnings.
- **Coral Critical (`#BA625A`)**: Service disruptions, missed transfers, cancelled services, and validation errors.

## Typography

The typographic hierarchy separates structural wayfinding and storytelling from high-density data parsing:

1. **Display & Section Headings (`Manrope`)**: Geometric yet humanist. Handles station hubs, transit interchange summaries, and primary dashboard titles with high legibility and dignity.
2. **Interface & Narrative Body (`Inter`)**: The operational backbone. Engineered for extreme legibility at small sizes, accommodating dense stop sequences, accessibility guidelines, and bilingual Tamil/English pairing where clear horizontal proportions prevent ascender clashing.
3. **Transit Timestamps & Fares (`IBM Plex Mono`)**: Dedicated to countdown clocks (e.g., `04 MIN`, `17:42 IST`), platform numbers, transit pass QR alphanumeric payloads, and Indian Rupee (`₹`) fare breakdowns. The monospaced pitch ensures that tabular departure boards don't jitter during real-time GPS telemetry updates.

## Layout & Spacing

The layout is built on a responsive 4px/8px incremental rhythm configured for rapid thumb accessibility on mobile devices and structured multi-column trip planning on wider screens.

- **Mobile (< 640px)**: 4-column fluid grid. Outer margin is locked to `1rem` (16px) with an interior column gutter of `0.75rem` (12px). Interactive cards stretch across the full interior canvas. Bottom sheets and persistent bottom bar navigation anchor thumb reaches.
- **Tablet (640px - 1024px)**: 8-column layout. Margin expands to `1.5rem` (24px) with a `1rem` (16px) gutter. Trip search split-views show map exploration on one half and itinerary cards on the other.
- **Desktop (> 1024px)**: 12-column layout with a maximum container constraint of `1200px` centered on `#F6F7F4` canvas. Sidebar navigation handles municipal agency tools and multi-leg commuter pass logs.
- **Spacing Rhythm**: Component padding relies strictly on `space-sm` (8px) for badges and metadata tags, `space-md` (12px) for list cells and dense transit stops, and `space-lg` (20px) for card body padding.

## Elevation & Depth

Depth is established primarily through clean tonal layering and hairline structural boundaries, rather than deep shadows.

- **Layer 0 (Canvas Base)**: `#F6F7F4`. Holds the map underlay, master list view backgrounds, and general layout backdrops.
- **Layer 1 (Card / Resting Surface)**: Pure `#FFFFFF` surface enclosed by a 1px solid `#E4E8E2` border. Elevation is supported by a quiet, diffused ambient drop: `0px 2px 4px rgba(32, 41, 35, 0.04)`.
- **Layer 2 (Floating Action / Active Wayfinding Node)**: `#FFFFFF` surface elevated over transit maps or interactive layers with `0px 6px 16px rgba(32, 41, 35, 0.08)`. Border remains 1px `#E4E8E2`.
- **Layer 3 (Modals & Route Sheets)**: `#FFFFFF` sheets anchored to bottom or screen center, accompanied by a translucent backdrop barrier (`rgba(32, 41, 35, 0.36)`). Ambient shadow: `0px 12px 32px rgba(32, 41, 35, 0.12)`.
- **Strict Avoidance**: No harsh black drop shadows, saturated color-glows, or multi-colored neon glass gradients. Every card edge must feel crisp, solid, and reliable in outdoor lighting.

## Shapes

The interface embraces a roundedness tier of `2` (8px to 16px base radius), communicating a contemporary, welcoming civic presence that avoids sharp aggressive corners while maintaining clear rectangular geometry.

- **Small Controls & Tags (8px / `rounded-md`)**: Transport mode indicators (Bus `MTC`, Metro `CMRL`), status indicators, timestamp badges, and text input boxes.
- **Interactive Cards & Sheets (12px - 16px / `rounded-lg` to `rounded-xl`)**: Itinerary cards, fare breakdowns, ticket inspection passes, and modal dialogs.
- **Interactive Action Buttons (10px / `rounded-md`)**: Consistent ergonomic curvature matching hand interaction points.
- **Pill Tags (`rounded-full`)**: Filter chips (e.g., "AC Only", "Metro Fast", "Direct Route"), live indicators, and transfer connector indicators.

## Components

### Buttons
- **Primary**: Solid `#28745E` background with white label text. Hover/Active transitions to `#174D3D`. Height: 44px (touch-friendly). 10px corner radius.
- **Secondary (Transit Link)**: `#547F93` background with white text, or pure `#FFFFFF` background with 1px `#547F93` outline and text.
- **Tertiary / Ghost**: Transparent background, `#28745E` text, subtle `#EEF1EC` background fill on active hover.

### Chips & Filter Tags
- **Default Inactive**: Background `#EEF1EC`, border 1px `#E4E8E2`, text `#6D7770`.
- **Active / Selected**: Background `#28745E`, border 1px `#28745E`, text `#FFFFFF`.
- **Transit Mode Badges**: Pill-shaped micro-badges. Bus uses `#28745E` tint, Metro uses `#547F93`, Suburban Rail uses `#202923`.

### Lists & Journey Timelines
- Multi-stop itineraries use a vertical 2px track line colored in `#E4E8E2` with mode-colored circular nodes (4px white interior dot).
- Row items utilize `#FFFFFF` background with subtle 1px bottom border in `#E4E8E2`.
- Real-time ETA updates sit right-aligned using `tabular-clock` (`IBM Plex Mono`).

### Form Inputs & Station Selectors
- Background `#FFFFFF` (or `#EEF1EC` for search fields).
- 1px border `#E4E8E2`, focusing to 1.5px `#28745E` with no glowing outer ring.
- Placeholder text in `#6D7770`. Text entry in `#202923`. Height: 48px to accommodate finger tap targets.

### Transit Cards (Multi-Leg & Fare Summaries)
- Clean `#FFFFFF` base, 12px radius, 1px `#E4E8E2` border.
- Integrated fare breakdown in the card footer using `#EEF1EC` background with `tabular-fare` monospaced currency typography.
- Status notices for delays or crowd conditions integrated inside the card using amber (`#D49A57`) or coral (`#BA625A`) 10% tint bands with solid indicator icons.