# MOVEFAIR — Updated Feature Specification

> **Version:** 2.0 · **Date:** 5 November 2026  
> **Product rule:** Simple citizen experience first; analytical complexity stays in the Planner Workspace.

## 0. How to read this document

- **Citizen P0:** needed for the first useful commuter experience.
- **Citizen P1:** useful secondary citizen functionality.
- **Planner P0/P1:** separate analytical workspace for CUMTA/planners.
- **Later / partner-dependent:** not part of the initial build unless data access is confirmed.
- All values must carry a source/status label: official, scheduled, calculated, estimated/modelled, user-entered or live.

---

# PART A — CITIZEN EXPERIENCE

## C01. Simple Home and Journey Search — P0

**User need:** “I want to go somewhere. Help me find how.”

**What the user sees:**
- A clear prompt: **Where are you going today?**
- `From` and `To` fields, current location where permitted, swap control and `Find routes` action.
- Recent destinations and optional shortcuts such as Home, College and Work.
- Four quiet shortcuts: Explore Chennai, My Places & Routes, My Travel Spending and Multi-stop trip.

**Behaviour:** Search is available without mandatory registration where supported. The home screen must not overwhelm the user with planner KPIs or multiple charts.

**Acceptance:** A first-time user can begin a simple search without understanding the product or configuring preferences.

## C02. Easy Route Comparison — P0

**User need:** “Show me a few good ways to get there.”

Display the most useful alternatives first:
- **Cheapest** — lowest available total fare.
- **Fastest** — shortest estimated door-to-door time.
- **Balanced** — a reasonable trade-off between cost and time.

Each option shows total fare, duration, transport modes, walking and transfers. Additional alternatives appear under **More travel options**.

**Acceptance:** Labels are based on actual calculated alternatives; no fake fare/time. If only one viable itinerary exists, show it without fabricating alternatives.

## C03. Simple Travel Preferences — P0

**User need:** “Let me tell MOVEFAIR what matters to me.”

Simple options, not numerical weights:
- Spend less.
- Reach faster.
- Walk less.
- Fewer changes.
- Travel greener.
- Balanced.

A user may choose one main preference; optional accessibility needs can be added separately. The backend may apply weighted ranking, but sliders/weight equations are hidden from the standard interface.

**Acceptance:** Changing the preference predictably changes route ordering when data supports it; the app briefly explains why.

## C04. Step-by-Step Journey Guidance — P0

**User need:** “Tell me what to do at each stage.”

Show an ordered journey:
1. Walk to a stop/station or first-mile pickup.
2. Board the named service where verified.
3. Get down at the right stop/station.
4. Transfer if required.
5. Walk or take an optional last-mile leg to the destination.

Use familiar place names, mode icons, simple language and approximate duration. Keep route IDs, GTFS identifiers and technical details behind `More details`.

**Acceptance:** Every instruction is derived from a supported itinerary; unsupported stop names/times are not invented.

## C05. Rapido + Public Transport Connections — P0 fallback

**User need:** “Can Rapido help me reach the bus/Metro or finish my trip?”

Show Rapido Bike/Auto as an optional first- or last-mile choice where appropriate. Compare it with walking or an available bus feeder. Show the public-transport portion and feeder fare separately, then combined journey cost/time.

**MVP:** user-entered Rapido fare, or clearly labelled illustrative estimate. No live quote is assumed.

**Later:** approved partner API, availability and permitted deep-link/booking handoff only after written permission and documentation.

**Acceptance:** no scraping or reverse engineering; user-entered amount is clearly marked; user can omit Rapido and compare public transport alone.

## C06. Eco-Friendly Travel Suggestions — P0

**User need:** “Is there a practical option that costs less or creates fewer emissions?”

Show a concise recommendation when a feasible alternative exists:
- Baseline mode/journey.
- Suggested alternative.
- Estimated fare difference.
- Estimated time difference.
- Estimated CO₂e avoided.
- Daily, weekly and monthly savings selector.

Put emission-factor source/year, vehicle/occupancy assumptions and methodology under `How is this calculated?`.

**Acceptance:** emissions are estimated from documented factors and leg distances; comparable trip frequency/direction is used; recommendations respect accessibility and user preferences; no guilt-based language.

## C07. My Places & Routes — P0

**User need:** “Let me quickly reuse places and journeys I travel often.”

Rename the former Saved Routes area to **My Places & Routes**. Users can save Home, College, Work, other favourite places and frequently travelled routes. Each route has a simple `Find route` or `Go` action.

**Acceptance:** guest mode may use local storage; account mode may sync; user can rename/delete; stale timetable/fare snapshot is refreshed when reopened; private locations are not public.

## C08. My Travel Spending — P0

**User need:** “How much am I spending on travel?”

Show daily, weekly and monthly estimated travel expenditure, mode-wise breakdown and potential savings from an alternative. User selects typical travel days/frequency. An optional monthly travel budget can be entered to understand budget share.

**Do not require income.** Do not assign a poverty or affordability classification.

**Acceptance:** calculations show trip frequency and fare assumptions; budget input is optional and not retained by default.

## C09. Multi-Stop Travel — P1

**User need:** “I need to visit a few places in one trip.”

Allow start, 3–5 intermediate/final stops, add/remove, reorder and calculate. Offer `Keep my order` and `Suggest an efficient order` only when supported. A route timeline and map show each leg. Keep this as a secondary action inside Plan a Journey.

**Acceptance:** totals reconcile with legs; unsupported legs are surfaced; heuristic ordering is not labelled globally optimal.

## C10. Language, Accessibility and Travel Settings — P0

**User need:** “Make the app comfortable for me to use.”

- English and Tamil selection; remember preference.
- Larger text, high contrast and reduced motion.
- Walking preference: Walk less / Normal / Walking is okay.
- Accessibility preferences such as avoid stairs or prefer step-free connections only where facilities are verified.
- Clear step-by-step text and optional future audio guidance.

**Acceptance:** language switch covers all primary flows and errors; unknown accessibility information remains unknown; map content has list alternatives; controls are keyboard and screen-reader accessible.

---

# PART B — PLANNER WORKSPACE (SEPARATE)

## P01. Chennai Mobility Overview — Planner P0

Show city-level coverage and defined indicators only: wards analysed, mapped stops/routes, service data coverage, potential access gaps and recent scenarios. Include dates and data completeness. Avoid arbitrary “mobility efficiency” scores.

## P02. Explore Wards — Planner P0

A clean map with a small set of understandable layers: public transport coverage, bus-stop distribution, walking access, service frequency and modelled mobility-cost context. Selecting a ward opens its summary. Show one main indicator at a time, with a clear legend.

## P03. Ward Details — Planner P0

Show ward identity, transport modes, stops, routes, nearest walking access, scheduled frequency where available, representative journey cost and data limitations. Allow comparison with another ward. Do not present modelled figures as observed household spending.

## P04. Try a Transport Improvement — Planner P0

Simple scenario controls: choose ward/corridor; change bus frequency; add a hypothetical feeder link/stop where network data permits; compare current and proposed service. Show estimated change in wait, total time, access and cost. Mark as hypothetical, not an official CUMTA forecast.

## P05. Mobility Insights & Reports — Planner P1

Summarise observed indicators, access gaps, reference journey comparisons and scenario results. Gemini may explain structured results but cannot create facts, fares or unsupported recommendations. Include sources and assumptions.

---

# PART C — SHARED PLATFORM CAPABILITIES

## X01. Source and Data Transparency — P0

Every important fare, time, map layer, emissions figure or planner metric has a visible status: Official, Scheduled, Calculated, Estimated, User-entered or Live. Provide source, effective/download date and brief methodology. Make this understandable without showing technical file names to ordinary commuters.

## X02. Session and Return Behaviour — P0

- Landing is public.
- Login/register follows when user wants an account-backed experience.
- First successful login can show the Welcome Back scene.
- Returning valid sessions go to last-used workspace, default Mobility Explorer.
- Home allows deliberate return to the Kathipara Welcome Back scene.
- Do not use browser cache as authentication.

## X03. Welcome Back / Kathipara Scene — P0 visual experience

A time-aware simulation inspired by the supplied Kathipara Junction references. Daypart lighting/traffic and local weather response; live IST clock; weather/source status; visible actions to open Mobility Explorer, plan a journey, open My Places & Routes and view My Travel Spending. If traffic isn't from an authorised live source, label it simulation. Include pause/reduced-motion/static fallback. See `design.md`.

---

# PART D — LATER / DATA-DEPENDENT CAPABILITIES

These are not removed from the product vision, but must not clutter the citizen MVP:

- Live bus location and arrival estimates: only with authorised GTFS Realtime/operator feed.
- Rapido live quote/availability: only with approved partner API/sandbox.
- Actual ward-level household commute burden: only with representative, geography-aligned observed data.
- Advanced passenger-demand forecasting: only with sufficient historical and spatially appropriate passenger/OD data.
- Detailed accessibility/barrier reporting: expand after verified pedestrian and station-facility data is available.
- Advanced scoring sliders: optional advanced mode only if user testing shows value.

## 1. Citizen navigation (five primary destinations)

1. **Home** — simple journey search and frequent places.
2. **Explore Chennai** — nearby/ward/transport map.
3. **Plan a Journey** — route search, preferences and multi-stop option.
4. **My Places & Routes** — saved places and journeys.
5. **My Travel Spending** — spending and eco savings.

Profile/settings and Data & Methodology are secondary destinations.

## 2. Planner navigation

1. Overview
2. Explore Wards
3. Transport Services
4. Try an Improvement
5. Insights & Reports
6. Data & Methods

## 3. Product-wide quality requirements

- Plain language; avoid unexplained technical terminology.
- Tamil and English are first-class options.
- Never make the map the only way to access journey information.
- Works on ordinary phones and slower connections; map and Welcome scene load progressively.
- Data labels distinguish scheduled, live, calculated and estimated information.
- Optional income/budget; privacy-preserving handling.
- No fabricated station names, timetables, fare quotes or live traffic.
- Reduced motion, readable contrast, keyboard and assistive technology support.

## 4. Citizen MVP acceptance demo

A first-time citizen can:
1. Open MOVEFAIR and understand its purpose.
2. Search an origin and destination.
3. Compare Cheapest, Fastest and Balanced where viable.
4. Choose a preference such as Spend less or Walk less.
5. Follow simple journey steps.
6. See a Rapido feeder option only as a clearly labelled user-entered/illustrative estimate unless partner access exists.
7. Compare a greener option and estimated daily/weekly/monthly savings.
8. Save a favourite route/place.
9. Review travel spending without entering income.
10. Plan a constrained multi-stop trip.

A planner can:
1. Select a ward and review access/transport information.
2. Compare wards.
3. Try a hypothetical bus frequency/feeder improvement.
4. See assumptions and sources.
