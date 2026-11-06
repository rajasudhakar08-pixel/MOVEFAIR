# MOVEFAIR — Updated Implementation Plan

> **Version:** 2.0 · **Date:** 5 November 2026  
> **Implementation principle:** sophisticated backend, simple citizen experience.

## 1. Delivery strategy

Build one complete citizen journey first, then expand to planner analytics. The first vertical slice should cover one supported Chennai area and a small set of validated origin-destination (OD) journeys. Do not build every citywide data layer before validating the end-to-end flow.

### Recommended stack

- Frontend: React + TypeScript + Vite.
- Map: MapLibre GL JS.
- Backend: Python + FastAPI.
- Geospatial: GeoPandas, Shapely, pyproj, PostgreSQL/PostGIS.
- Transit: validated GTFS Schedule; GTFS Realtime only with authorised access.
- Routing: OpenTripPlanner with validated GTFS + OSM, or curated OD fallback for hackathon scope.
- Charts: Recharts or similar, used sparingly.
- AI: Gemini only for plain-language explanations of structured outputs.
- Design tools: Stitch for design; Antigravity IDE for engineering; GitHub for version control.

## 2. System architecture

```text
GCC GIS + supplied Theme7 data + CUMTA GTFS + OSM + operator fares + emissions factors
                         ↓
                Data ingestion / QA
                         ↓
             Canonical geospatial/transit store
                         ↓
     Ward analytics | Routing | Fare | Preferences | Emissions
           Saved journeys | Multi-stop | Scenarios
                         ↓
                     FastAPI
                         ↓
       Citizen web app            Planner workspace
       simple task UI              analytical map UI
```

## 3. Phase 0 — Prepare data and demo scope

1. Preserve Theme7 ZIP and original source files under `data/raw/`.
2. Create `data/manifest.csv` containing source, provider, URL, access date, effective date, licence, CRS, checksum and validation status.
3. Fetch current GCC ward polygons. Validate ward IDs, geometry, CRS and coverage.
4. Inspect supplied bus-stop workbook and route/Metro/rail shapefiles. Check coordinate ranges, duplicate clusters, generic station names and geographic outliers.
5. Obtain candidate CUMTA GTFS feeds. Validate `agency`, `routes`, `stops`, `trips`, `stop_times`, `calendar`, `calendar_dates` and `feed_info`; record service validity dates.
6. Confirm fare rules from current official MTC, CMRL and Southern Railway sources. Do not hard-code the supplied fare-reference PDF as current truth.
7. Obtain a Chennai OSM extract. Check pedestrian network coverage around selected OD pairs.
8. Select one demo area/ward and 3–5 representative OD journeys. Include public-transport-only options and an optional user-entered Rapido leg.
9. Create explicit demo fixtures labelled illustrative wherever real values are unavailable.

**Exit gate:** source provenance, licence, date, geography and known gaps documented; at least one validated ward and OD example.

## 4. Citizen feature implementation

### C01 — Simple Home and Journey Search

- Build a focused home with From/To fields, swap, search, recent places and favourite shortcuts.
- Add autocomplete backed by geocoding/place data; allow manual selection when location permission is denied.
- Keep advanced features one level deeper.
- Support guest journey search if backend access allows.

**Acceptance:** a first-time user can initiate a journey without onboarding or technical knowledge.

### C02 — Easy Route Comparison

- Generate feasible itinerary alternatives from OpenTripPlanner or curated routes.
- Calculate total duration, total fare where known, walking, transfers and modes.
- Select Cheapest, Fastest and Balanced options from available alternatives.
- If data for a metric is unavailable, show “Not available” rather than fabricate.

**Acceptance:** do not create fake alternatives; ranking matches displayed criteria.

### C03 — Simple Travel Preferences

- Provide presets: Spend less, Reach faster, Walk less, Fewer changes, Travel greener, Balanced.
- Map each preset to backend preference weights and any hard constraints.
- Keep weights hidden in normal UI; optional “Why this route?” explains the decision.
- Accessibility requirements are constraints/preferences, not just soft score values.

**Acceptance:** changing preference updates ordering in a predictable and explainable way.

### C04 — Step-by-Step Journey Guidance

- Normalise each itinerary to ordered legs with mode, start/end stop, scheduled time, duration, walking and fare.
- Display a plain-language timeline using verified stop/place names.
- Show scheduled/estimated status per relevant field.
- Include map and non-map list view.

**Acceptance:** no unsupported stop names, arrival promises or live status.

### C05 — Rapido + Public Transport

- MVP input component allows user to enter a Rapido Bike/Auto quote for a selected feeder leg.
- Tag value as user-entered with optional time captured; clearly separate it from official transit fares.
- Add the entered leg to fare/time/distance/emission aggregation.
- Later create an integration adapter only after partner permission, API docs and sandbox access.

**Acceptance:** no scraping/reverse engineering; no fabricated live quotation.

### C06 — Eco-Friendly Suggestions

- Create a versioned `emission_factors` dataset with mode, vehicle, unit, factor, geography, year, occupancy assumption, source and boundary.
- Calculate each itinerary leg's emissions from distance and applicable factor; sum all legs.
- Compare baseline and alternatives for the same trip frequency and direction.
- Show cost/time/emission differences plus daily/weekly/monthly totals.
- Add “How is this calculated?” explanation.
- Do not recommend infeasible modes or violate user access needs.

**Acceptance:** emission units and assumptions are tested; estimate labels and source are visible.

### C07 — My Places & Routes

- Guest mode: local storage with versioned schema and delete control.
- Signed-in mode: authenticated user-owned records.
- Store label, origin/destination reference, preference and itinerary snapshot; avoid storing precise location unnecessarily.
- On reopen, refresh schedule/fare values and distinguish saved snapshot from current result.

**Acceptance:** save, rename, open, recalculate and delete; private routes are not public.

### C08 — My Travel Spending

- Calculate one-way or round-trip cost multiplied by travel frequency.
- Support daily, weekly and monthly display periods.
- Show mode-wise breakdown and potential savings from a selected alternative.
- Optional monthly transport budget; no mandatory income field.
- Do not classify users as poor/affluent or imply official affordability thresholds.

**Acceptance:** frequency and assumptions visible; inputs optional and not retained by default.

### C09 — Multi-Stop Travel

- Start with 3–5 stops and a supported geographic area.
- Allow add/remove/reorder and preserve requested order.
- Optional suggested ordering using pairwise journey costs/time and a simple heuristic.
- Re-route each leg and aggregate totals.
- Use accessible move-up/down controls as alternative to drag-and-drop.

**Acceptance:** totals equal leg sums; unsupported legs visible; heuristic not called globally optimal.

### C10 — Language, Accessibility and Travel Settings

- Add English/Tamil localisation files and string keys from the start.
- Add text-size, contrast and reduced-motion preferences.
- Add walking and verified step-free preference controls.
- Keep unknown station/footpath facilities unknown; do not infer accessibility from missing data.
- Ensure all map information is also available in a list/panel.

**Acceptance:** core citizen flow usable in both languages; keyboard/screen-reader labels; reduced-motion respected.

## 5. Planner workspace implementation

### P01 — Chennai Mobility Overview

- Aggregate only validated ward/stop/route/service indicators.
- Display coverage and data freshness beside each KPI.
- Avoid synthetic composite “efficiency” values.

### P02 — Explore Wards

- Render current GCC wards and selectable data layers.
- Support stop density, route coverage, walking access, service frequency and modelled cost context.
- Use one clear choropleth metric at a time with legend and definition.

### P03 — Ward Details

- Aggregate ward stops, routes, modes, access distance and frequency.
- Add a representative OD cost context only where the journey is valid.
- Label modelled index and any population proxy.
- Support comparison between selected wards without mismatched census geographies.

### P04 — Try a Transport Improvement

- Select a ward/corridor and baseline service.
- Change headway or add a hypothetical feeder connection/stop if geometry and route calculation support it.
- Expected waiting time may be approximated as `headway / 2` only under random-arrival and reliable-service assumptions; state this assumption.
- Recalculate sample journey time, access and fare impacts.
- Show baseline/proposed values with “Hypothetical simulation” label.

### P05 — Mobility Insights & Reports

- Generate summaries from deterministic metric output.
- Gemini may explain, not calculate or invent.
- Cite source IDs and assumptions; mark AI-generated narrative.

## 6. Shared platform functions

### Source/provenance model

Every result should carry:
`source_id`, `publisher`, `source_url`, `retrieved_at`, `effective_date`, `method`, `status_type`, `limitations`, `model_version`.

### Return/session behaviour

- Landing is public.
- Authentication is required only for account-backed functions.
- First sign-in may show Welcome Back.
- Valid returning session opens last-used workspace, default Mobility Explorer.
- Welcome Back remains reachable via Home.
- Secure session controls are separate from static browser caching.

### Welcome Back / Kathipara scene

- Time from client/device or trusted time source in Asia/Kolkata.
- Weather from a legitimate weather provider when configured; display location and update time.
- Traffic scene is a simulation unless an authorised live traffic source is integrated.
- Use time-of-day scene states and smooth transitions.
- Provide pause, reduced-motion and static fallback.
- Keep primary navigation and clock readable over the image.

## 7. API outline

```text
GET  /api/wards
GET  /api/wards/{ward_id}/summary
GET  /api/geo/layers?bbox=&layer=
GET  /api/places/search?q=
POST /api/journeys/plan
POST /api/journeys/rank
POST /api/journeys/rapido-leg       # calculation from user-entered amount only
POST /api/journeys/impact
POST /api/journeys/multi-stop
POST /api/spending/calculate
GET  /api/saved-places
POST /api/saved-places
GET  /api/saved-routes
POST /api/saved-routes
DELETE /api/saved-routes/{id}
GET  /api/planner/wards/{ward_id}
GET  /api/planner/metrics
POST /api/planner/scenarios
GET  /api/sources/{source_id}
```

Use typed Pydantic request/response objects. A route alternative should include legs, total cost, duration, walking, transfers, estimated emissions, recommendation label and provenance status.

## 8. Suggested data entities

- `wards`: ID, name, geometry, source version.
- `stops`: ID, name, coordinates, mode, operator, source version.
- `routes`: ID, name, mode, operator, geometry, source version.
- `trips`, `stop_times`, `service_calendar`: validated GTFS tables.
- `fare_rules`: operator, mode, rules, amount, currency, effective date and source.
- `emission_factors`: mode/vehicle, factor, unit, year, geography, occupancy, source.
- `journey_snapshots`: route legs, fare/time/distance/emissions and input versions.
- `saved_places`, `saved_routes`: owner or guest key, label, location reference, preferences, timestamps.
- `ward_metrics`: ward, metric, value, unit, method, source and confidence.
- `scenarios`: baseline, changed parameters, outputs, assumptions and model version.
- `source_registry`: URL, provider, date, licence and validation status.

Do not store user income or exact home location by default.

## 9. Recommended frontend components

- `PublicSiteHeader`, `HeroSection`, `FeaturePillars`, `ProductPreview`.
- `AuthPanel`, `GuestEntry`, `PreferenceSetup`.
- `WelcomeScene`, `ISTClock`, `WeatherStatus`, `SceneControls`.
- `CommuterAppShell`, `PlannerAppShell`, `WorkspaceSwitcher`.
- `JourneySearch`, `LocationAutocomplete`, `RecentPlaceChip`.
- `JourneyOptionCard`, `JourneyStepTimeline`, `PreferencePicker`.
- `EcoSavingsPanel`, `PeriodSelector`, `TravelSpendingSummary`.
- `SavedPlaceCard`, `SavedRouteCard`, `MultiStopEditor`.
- `MobilityMap`, `MapLayerPicker`, `WardSummaryPanel`, `WardMetricList`.
- `ScenarioControls`, `BeforeAfterSummary`, `SourceDetails`.
- `StatusLabel`, `LoadingState`, `EmptyState`, `ErrorState`, `NoDataState`.

## 10. Delivery phases and exit criteria

### Phase 0 — Data and product setup
- Audit supplied ZIP and external source licences/dates.
- Validate GCC ward layer, bus stops and candidate GTFS.
- Choose one demo area and 3–5 journeys.
- Confirm fare sources and emission-factor methodology.
**Exit:** reproducible dataset manifest and explicit unsupported-data list.

### Phase 1 — Visual shell and citizen journey search
- Implement landing/auth flow, Welcome Back and commuter shell.
- Build From/To search and recent/favourite places.
**Exit:** user can reach search and select a supported OD pair.

### Phase 2 — Route results and guidance
- Build itinerary alternatives and Cheapest/Fastest/Balanced labels.
- Build preference presets and step timeline.
- Add provenance labels and unknown data states.
**Exit:** at least 3 curated OD journeys are validated or limited alternatives shown honestly.

### Phase 3 — Spending, eco and saved routes
- Fare engine and daily/weekly/monthly cost.
- Emissions estimate and comparisons.
- Optional travel budget.
- Saved places/routes.
- Manual Rapido quote leg.
**Exit:** cost and emissions totals reconcile with leg calculations; saved routes persist and can be deleted.

### Phase 4 — Multi-stop and citizen accessibility
- Constrained 3–5 stop journey builder.
- Tamil/English core localisation.
- Walking/access preferences and reduced-motion settings.
**Exit:** itinerary totals reconcile; accessibility unknowns are handled honestly.

### Phase 5 — Planner workspace
- Ward map and ward detail.
- Stop density, route coverage and pedestrian access indicators.
- Simple service frequency analysis when GTFS validates.
- Scenario control and before/after comparison.
**Exit:** selected ward metrics trace to validated sources; simulated results carry assumptions.

### Phase 6 — Polish and demonstration
- Mobile responsive refinement.
- Empty/loading/error/stale-data states.
- Methodology/source panel.
- End-to-end demo script: citizen journey first, planner intervention second.
**Exit:** complete demo works without relying on Rapido API or unavailable live bus data.

## 11. Test checklist

- Search flow works with location permission denied and manual location entry.
- Cheapest/Fastest/Balanced match actual alternatives.
- Preference selection changes ranking predictably.
- Step timeline sums to journey duration and leg details.
- Rapido user-entered fare remains visibly user-entered.
- Fare totals and monthly spending formulas pass unit tests.
- CO₂ totals reconcile across legs and period frequency.
- Saved places/routes can be renamed/deleted and are not public.
- Multi-stop totals equal the sum of legs.
- Tamil/English text fits controls without clipping.
- Reduced motion disables the animated welcome scene.
- Planner map metrics include source/date/definition.
- Scenario output is reproducible and labelled hypothetical.
- No scheduled data is styled as live.

## 12. Design implementation rule

Stitch designs the citizen journey first and planner workspace second. Do not ask Stitch to expose backend concepts as user-facing controls. The UI says “Spend less”; the backend applies ranking weights. The UI says “Try a transport improvement”; the backend runs the scenario model. Technical complexity remains in the implementation and methodology layers.
