# MOVEFAIR — Updated Design System & Screen Specification

> **Version:** 2.0 · **Date:** 5 November 2026  
> **Status:** Approved visual direction retained; citizen UX simplified before Stitch.

## 1. Design objective

Preserve the approved four-screen visual template and make the citizen experience more approachable. The product must feel like a useful Chennai travel companion, not a professional transport-control dashboard. Advanced analytics belong in the separate Planner Workspace.

**Visual north star:** Contemporary Chennai Mobility — human, calm, professional, locally grounded, easy to scan and useful on ordinary phones.

## 2. Approved reference template

Use `design_reference_four_screen_template.png` as the visual reference for:
1. Public landing website.
2. Login / registration.
3. Kathipara-inspired Welcome Back page.
4. Main Mobility Explorer application shell.

Preserve the broad composition and character, not every pixel. Improve spacing, typography, map legitimacy, content clarity, responsive behaviour and interaction states.

## 3. Visual system (retain approved direction)

### Palette

| Token | Hex | Role |
|---|---|---|
| Canvas | `#F6F7F4` | Warm page background |
| Surface | `#FFFFFF` | Cards and panels |
| Surface muted | `#EEF1EC` | Quiet sections |
| Ink | `#202923` | Main text |
| Muted ink | `#6D7770` | Secondary text |
| Primary green | `#28745E` | Primary action/selection |
| Deep green | `#174D3D` | Brand emphasis |
| Transit blue | `#547F93` | Secondary transit information |
| Amber | `#D49A57` | Caution/highlight |
| Coral | `#BA625A` | Critical/error |
| Border | `#E4E8E2` | Dividers/cards |

### Typography

- Inter for UI and body.
- Optional Manrope for selected headings only.
- IBM Plex Mono sparingly for clock, timestamps, IDs and technical metadata.
- Use clear type hierarchy; don't oversize dashboard metrics.

### Components and visual restraint

- 8–12 px card radius, thin borders, subtle shadows.
- Clear labelled fields and visible focus states.
- One coherent line-icon family.
- Calm map basemap with restrained mode colours.
- Short purposeful motion; no gratuitous animation.
- Avoid cyberpunk, neon, glassmorphism, glowing outlines, gradients as decoration, 3D objects and generic AI/SaaS visuals.

## 4. Application architecture and navigation

### Public flow

Landing website → Login/register or guest entry → first-login Welcome Back → Citizen Home/Mobility Explorer.

### Returning user flow

Valid returning session → last-used workspace, default Mobility Explorer. Welcome Back remains reachable through Home. Do not force returning users to watch the welcome scene every time.

### Citizen navigation (five primary destinations)

1. **Home** — simple From/To search and frequent places.
2. **Explore Chennai** — nearby stops, map and local transport options.
3. **Plan a Journey** — route alternatives and multi-stop option.
4. **My Places & Routes** — saved locations and journeys.
5. **My Travel Spending** — travel expense and eco savings.

Profile/settings and Data & Methodology are secondary.

### Planner navigation (separate workspace)

1. Overview
2. Explore Wards
3. Transport Services
4. Try an Improvement
5. Insights & Reports
6. Data & Methods

## 5. Screen inventory — citizen

### S01 — Public Landing Website

- Public marketing/information website, not authenticated dashboard.
- Header: MOVEFAIR, Product, For Commuters, For Planners, Data & Methodology, Log in, Get Started.
- Hero message: **“Smarter, fairer and greener travel across Chennai.”**
- Supporting copy: plan journeys, compare travel options, understand travel costs and discover more accessible choices.
- Primary CTA: Explore MOVEFAIR; secondary CTA: See how it works.
- A composed Chennai mobility/product visual, then four simple pillars: Find, Travel, Spend, Choose better.
- Short commuter and planner sections; how it works; methodology/trust; footer.
- Avoid long feature lists and invented statistics. The actual product preview is more important than stock imagery.

### S02 — Login / Registration

- Calm split layout: subtle Chennai illustration/image panel, focused login/sign-up card.
- Email/password, validation, forgot password, password visibility and continue as guest.
- Only show social/phone sign-in if truly implemented.
- States: empty, focus, error, loading, success, expired session.
- Mobile becomes a single-column form.

### S03 — Optional Welcome & Preferences

- Short optional onboarding, 3–5 simple steps maximum.
- Ask preferred language, usual travel priorities, optional walking/access preferences and commute pattern.
- Skip controls; no mandatory income or exact home address.

### S04 — Welcome Back / Kathipara Scene

This is the signature welcome screen. Use the supplied Kathipara Junction aerial/interchange photos as reference, with Uptown Food Street as secondary Chennai context if represented accurately.

**Time-aware states:**
- Around 6 AM: soft sunrise, cool light and lighter traffic.
- Around 10 AM: brighter sun and more traffic.
- Afternoon: full daylight and realistic road flow.
- Evening: warm sunset and increased traffic; street lights begin switching on.
- Night: illuminated roads/buildings, night traffic.
- Rain: localised rain/wet-road effects when a weather provider indicates rain near Kathipara.

Show live IST clock/date and weather/source update status. Traffic must be labelled simulation unless sourced from an authorised live feed. Do not imply CCTV or actual traffic measurement.

**Overlay:** MOVEFAIR mark, friendly greeting, large but balanced time, weather chip, primary `Open Mobility Explorer`, secondary `Plan a Journey`, `My Places & Routes`, `My Travel Spending`, location caption `Kathipara Junction, Chennai`, scene mode label, pause/reduced-motion control.

Ensure text remains legible over the image. Provide static fallback and respect reduced-motion preference. First login may show this screen; returning valid sessions go directly to last-used workspace.

### S05 — Citizen Home / Mobility Explorer

The first operational screen should keep the journey search obvious. Map and simple home content can coexist:
- From/To search near the top.
- Quick destinations and recent journeys.
- Large but not overwhelming Chennai map preview.
- Nearby stops and transport layers behind a simple filter.
- Quick actions: Find routes, Explore nearby, My Places & Routes, My Travel Spending.
- Don't put ward burden indices, ridership graphs or advanced KPIs on citizen Home.

### S06 — Easy Journey Planner

- From and To inputs, swap, map selection, departure time/date.
- Simple preference chips: Spend less, Reach faster, Walk less, Fewer changes, Travel greener, Balanced.
- Multi-stop trip is an optional secondary action.
- Advanced options are collapsed.

### S07 — Route Comparison Results

- Present Cheapest, Fastest and Balanced alternatives first.
- Each compact card shows total cost, journey time, mode sequence, walking and changes/transfers.
- Eco estimate can appear as a secondary detail.
- `More travel options` expands additional routes.
- Avoid prominent numerical score gauges and technical weight sliders.
- If data is missing, show unavailable/estimated labels.

### S08 — Step-by-Step Journey Details

- Clear vertical timeline: walk → bus/Metro/rail → transfer → last mile.
- Verified stop/station names, leg times/durations and fare where known.
- Map preview alongside on desktop; expandable map on mobile.
- Save route action.
- Technical identifiers live under More details.

### S09 — Eco-Friendly Suggestions

- Compare current/usual route with a practical lower-emission alternative.
- Show estimated money saved, CO₂e avoided and time difference.
- Simple daily/weekly/monthly selector.
- `How is this calculated?` opens factors and assumptions.
- Non-judgemental tone; feasibility/access requirements respected.

### S10 — My Places & Routes

- Simple cards for Home, College, Work, favourites and frequent journeys.
- One-tap Find Route/Go action.
- Rename, edit and delete.
- Empty state invites user to save a place or route.
- Do not expose private saved locations.

### S11 — Multi-Stop Trip

- Start, a few intermediate stops and destination.
- Add/remove/reorder; lock sequence or suggest efficient order.
- Keep 3–5 stops for MVP.
- Accessible alternative to drag-and-drop.

### S12 — Multi-Stop Results

- Numbered map points, leg-by-leg timeline and total cost/time/walking/transfers/emissions.
- Edit/reorder and save trip.
- Label suggested ordering as heuristic where applicable.

### S13 — My Travel Spending

- Daily/weekly/monthly estimated spending.
- Mode-wise breakdown.
- Optional travel budget; income not required.
- Compare current and alternative route spending.
- Clear calculation explanation; avoid intimidating financial dashboards.

### S14 — Language, Accessibility & Settings

- English/Tamil, text size, contrast, reduced motion.
- Walking preference and verified step-free preference.
- Optional personal travel budget settings.
- Privacy and saved-data controls.

## 6. Screen inventory — planner

### P01 — Planner Overview

City-level map and only defined indicators: wards analysed, mapped stops/routes, data coverage, potential access gaps and saved scenarios. Show freshness and coverage beside KPIs.

### P02 — Explore Wards

Left simple indicator picker, central ward map, selected-ward panel and legend. Layers: transport coverage, stop distribution, walking access, service frequency and modelled cost context. Display one main choropleth metric at a time.

### P03 — Ward Details

Ward profile: transport modes, stops/routes, walking access, schedule/frequency if available, representative journey cost, modelled burden components and limitations. Compare with another ward.

### P04 — Transport Services

Operator/mode filters, route map, stop details and scheduled departure/frequency information. Never present schedule as live vehicle location.

### P05 — Try a Transport Improvement

Simple controls for selected ward/corridor, bus frequency/headway and hypothetical feeder link/stop. Show baseline vs proposed travel time, cost, wait and access. Clearly label hypothetical simulation.

### P06 — Insights & Reports

Evidence-led summary of ward indicators and scenario outcomes; sources and assumptions. Gemini can explain structured outputs but cannot invent numbers.

## 7. Shared utility screens/panels

- **Data & Methodology:** source, date, fare/CO₂ method, route explanation and model assumptions.
- **Ward Snapshot:** compact details opened from map selection.
- **Source Details drawer:** accessible from important metrics and route cards.
- **Notifications/service information:** scheduled departures and published alerts only where available.
- **Empty/loading/error/stale/partial-data states:** designed, not left to browser defaults.

## 8. Main reusable components

- Public header and footer.
- Auth panel and guest entry.
- Welcome scene, IST clock and weather status.
- Citizen app shell and Planner shell.
- From/To location input.
- Preference chips.
- Journey option card.
- Journey timeline.
- Map and simple layer picker.
- Saved place/route card.
- Eco savings panel and period selector.
- Multi-stop editor.
- Ward summary and planner metric card.
- Baseline/proposed scenario comparison.
- Source/status label and methodology drawer.

## 9. Content and language

Prefer:
- “From” and “To”, not “Origin” and “Destination”.
- “How to reach the station”, not “First-mile connectivity”.
- “Time between buses”, not “Headway”.
- “Travel spending”, not “Cost-burden index” in citizen screens.
- “Add another stop”, not “Multi-modal optimisation”.
- “Try a transport improvement” in planner controls.

All primary citizen flows should be designed for English and Tamil. Ensure layouts can accommodate longer translations.

## 10. Responsive and accessibility rules

- Desktop: 230–250 px sidebar where needed, compact top bar, readable map/panel split.
- Mobile: bottom navigation, full-width map, expandable bottom sheet, stacked route cards and timeline-first route details.
- Large touch targets, keyboard focus, readable contrast and labels.
- Never use colour alone for status or mode.
- All map-based information needs a list/panel alternative.
- Reduced motion and static Welcome scene.
- Do not make the welcome animation block access to primary actions.

## 11. Visual QA checklist

- Landing is clearly public website; not confused with logged-in app.
- Authentication offers guest exploration where supported.
- Welcome Back uses Kathipara-inspired time-aware simulation and clear IST/weather status.
- Returning user opens last-used app workspace, default Mobility Explorer.
- Citizen Home foregrounds search, not analytics.
- Three route recommendations are understandable without technical knowledge.
- Route steps use familiar transport and location names.
- Spending and eco screens use simple period-based comparisons.
- Planner analytics remain separate from citizen navigation.
- All estimates and schedules are correctly labelled.
- Mobile and Tamil layouts are intentional.
- No cyberpunk/neon/glassmorphism or decorative AI-looking dashboard filler.
