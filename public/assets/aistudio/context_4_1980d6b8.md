# MOVEFAIR — Project Context

> **Version:** 2.0 · **Date:** 5 November 2026  
> **Challenge:** Startup Peravai × CUMTA Mobility Challenge, PS7 — Transport Accessibility and Affordability  
> **Primary audience:** Citizens and everyday commuters across Chennai  
> **Secondary audience:** CUMTA, transport planners and mobility researchers  
> **Design status:** Approved visual direction; user-friendly feature refinement confirmed

## 1. Product in one sentence

**MOVEFAIR is an easy-to-use Chennai travel companion that helps residents find a practical way to get somewhere, understand what the journey will cost, and discover better-value or lower-emission alternatives, while giving mobility planners a separate workspace to study transport access and test service improvements.**

## 2. The problem

A commuter does not think in terms of GTFS feeds, headways, origin-destination matrices or accessibility indices. They ask:

1. Where do I want to go?
2. How do I get there?
3. How much will it cost and how long will it take?
4. Is there a better option for my needs?

The complete journey may involve walking, MTC bus, Metro, suburban rail and a first- or last-mile option such as Rapido. A low fare can come with long walking or waiting; a convenient option can cost more. Repeated journeys also create a monthly spending and environmental impact.

At city level, public transport availability is not the same as practical access. Some neighbourhoods have fewer useful connections, infrequent service or pedestrian barriers. CUMTA's PS7 asks for ward-level transport-cost context, origin-destination comparisons and a way to test improvements such as better bus services.

## 3. Product vision and promise

**Smarter journeys. Simpler choices. Better-connected Chennai.**

MOVEFAIR should make everyday travel choices understandable without exposing users to the technical complexity behind the calculations. Advanced spatial analysis and scenario tools remain available in a separate Planner Workspace.

## 4. Audiences

### 4.1 Citizens and commuters — primary experience

Designed for students, office commuters, families, senior citizens, visitors and people with different language, mobility and digital-literacy needs. A user should be able to search for a destination and understand the options without learning transport-planning terminology.

### 4.2 Mobility planners — separate experience

Designed for CUMTA and other authorised planners, analysts and researchers. This workspace can expose ward maps, stop and route coverage, scheduled frequency, methodology, modelled indicators and hypothetical service-improvement scenarios.

Do not mix planner-only controls into the normal citizen home screen.

## 5. Four citizen questions / product pillars

- **Find:** Where do I want to go? Search and discover a destination or nearby stop.
- **Travel:** How do I get there? Understand route alternatives and simple step-by-step directions.
- **Spend:** What will it cost? Compare the complete journey and recurring travel expenditure.
- **Choose better:** Is there a more convenient, affordable or lower-emission option? See clear trade-offs and savings.

Planner pillars remain: **Understand the city → Identify gaps → Test improvements → Explain findings.**

## 6. Main user flow

### Public and first-time user

```text
Public landing website
  → Login / register (or supported guest exploration)
  → Optional short preferences setup
  → Welcome Back / Chennai scene
  → Citizen Home / Mobility Explorer
  → Search destination
  → Compare a few understandable options
  → View step-by-step journey
  → Save route or review travel spending
```

### Returning authenticated user

- A valid returning session should open the user's last-used application workspace/location, defaulting to Mobility Explorer when no saved destination exists.
- The Welcome Back / Kathipara experience remains reachable through Home, but should not interrupt every returning session.
- Do not use browser cache as authentication. Use a secure session/token approach. Cache only non-sensitive assets and preferences.

### Planner user

```text
Planner access / workspace switch
  → Planner Overview
  → Explore wards or transport services
  → Open ward details
  → Try a transport improvement
  → Review and share an evidence-based report
```

Planner access should be controlled by account role or an explicit access mechanism. Do not assume every citizen account is an authorised planner.

## 7. Citizen feature philosophy

- Make the first action obvious: **From** and **To**, then **Find routes**.
- Present three useful route labels first: **Cheapest**, **Fastest** and **Balanced**. Additional options can appear under “More options”.
- Let users choose simple preferences such as Spend less, Reach faster, Walk less, Fewer changes and Travel greener.
- Hide algorithmic weights, scoring equations and technical metrics behind “How this was chosen”.
- Explain a journey step by step using familiar place and transport names.
- Keep Eco suggestions supportive and non-judgemental.
- Keep income optional. Prefer an optional travel budget for the everyday spending view.
- Make multi-stop planning secondary, not a first-screen burden.
- Provide Tamil and English as first-class language options, with consistent labels and translated interaction states.
- Do not make the map the only way to use the app. Important information must also be available as a list.

## 8. Planner feature philosophy

Planner tools may be more analytical but must remain readable. Use plain labels such as “Explore wards”, “Transport services” and “Try a transport improvement”. Show metric definitions, data coverage and methodology alongside each result. Do not present a modelled index as observed household spending or a simulation as an official operational forecast.

## 9. Rapido integration stance

Rapido is an optional first-/last-mile travel choice that can complement public transport, not a default replacement for it. The initial implementation can accept a fare manually entered by a user or show clearly labelled illustrative values. Live fare, availability or booking integration must only be added with approved partner API/sandbox access and permission. Do not scrape or reverse-engineer the app. Show the total journey cost and the Rapido leg separately.

## 10. Data and truthfulness principles

Every journey or indicator must be clearly identifiable as one of:
- **Official / observed:** directly published or measured by an identified source.
- **Scheduled:** calculated from a published timetable; not real-time.
- **Calculated:** deterministic calculation from named inputs.
- **Estimated / modelled:** based on assumptions or statistical methods.
- **User-entered:** entered by the commuter (for example, a Rapido fare quote).
- **Live:** only when connected to an authorised live source, with a freshness timestamp.

Important known limitations:
- Supplied Theme7 data includes route/station geometries and stop coordinates, but geometry alone does not provide valid current stop sequences, timetables or frequency.
- The supplied Metro station labels and some rail labels need reconciliation with official operator data.
- Current fare rules must be checked against operator sources and effective dates.
- GCC ward geography and historical Census/TAZ geographies may not align; do not join them without a verified crosswalk.
- No validated ward-level observed household commute expenditure has been established. Any ward burden layer must be explicitly modelled.
- Live bus tracking requires an authorised GTFS Realtime/operator source. Static GTFS is scheduled information only.
- No unrestricted Rapido quote API is assumed.
- CO₂ values are estimates dependent on emission factors, vehicle type, occupancy, trip distance and calculation boundary.

## 11. Approved visual direction

The approved four-screen reference establishes the direction:
- Contemporary Chennai Mobility: professional, human, warm, calm and locally grounded.
- Warm ivory/white surfaces, dark readable typography, muted green actions, restrained blue/amber information accents.
- Clean typography, moderate corner radii, thin borders and subtle shadows.
- Real Chennai context and authentic transport geography; avoid generic futuristic city imagery.
- No cyberpunk, neon gradients, excessive glassmorphism, glowing borders or decorative analytics.
- Landing page is a public information website. Login follows. The Chennai welcome scene and authenticated application are separate stages.
- Kathipara Junction is the signature Welcome Back visual, with time-aware lighting/traffic simulation and weather response when a reliable source is available.

## 12. Welcome Back / Kathipara concept

A scenic, time-aware simulation inspired by the supplied Kathipara interchange images. Around 6 AM, use soft sunrise and low traffic; around 10 AM, bright daylight and more traffic; afternoon, full daylight; evening, warm sunset and increasing traffic; night, road/building lights and night traffic. Add localised rain effects only if a weather source indicates rain near Kathipara. Show a live IST clock/date and weather/source status.

If no verified live traffic source is available, label the scene **“Time-aware simulation”**. Do not imply CCTV or measured live traffic. Keep primary actions readable: Open Mobility Explorer, Plan a Journey, My Places & Routes and My Travel Spending. Include pause/reduced-motion and static fallback. Returning authenticated users go directly to their last workspace; the scene remains accessible from Home.

## 13. Technical direction

- Frontend: React + TypeScript.
- Maps: MapLibre GL JS.
- Backend: Python + FastAPI.
- Geospatial: GeoPandas, Shapely, pyproj, PostgreSQL/PostGIS.
- Transit: validated GTFS Schedule; GTFS Realtime only if approved data exists.
- Routing: OpenTripPlanner with validated feeds and OSM; curated OD fallback for the hackathon.
- Charts: restrained Recharts or equivalent.
- AI: Gemini may explain already-calculated results; deterministic backend remains the source of truth.
- Design: Stitch using this document, `features.md`, `implementations.md`, `design.md` and approved reference image.

## 14. Product success criteria

A citizen should be able to search a journey, understand three practical alternatives, inspect the steps, compare cost/time and estimated emissions, save a frequent route, and understand recurring travel spend without technical explanation.

A planner should be able to select a ward, understand transport coverage and access limitations, change a service assumption and compare a clearly labelled hypothetical scenario.
