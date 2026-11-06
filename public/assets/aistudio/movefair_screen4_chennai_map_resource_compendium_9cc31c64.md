# MOVEFAIR — Screen 4: Chennai Map Resource Compendium

**A single reference document for Stitch design, Antigravity engineering and map-data validation**  

**Official geography · Basemaps · Transit data · Live traffic · Technical documentation**  

**Prepared:** 5 November 2026  
**Project:** Startup Peravai × CUMTA Mobility Challenge · PS7

> This Markdown edition is a text-and-table conversion of the supplied Word compendium. All source URLs are retained as clickable links. Use the Word version when you need the original page layout.

## Contents

- [1. Executive summary](#1-executive-summary)

- [2. The four layers of map accuracy](#2-the-four-layers-of-map-accuracy)

- [3. Official Chennai geography resources](#3-official-chennai-geography-resources)

- [4. Basemap providers and map rendering technology](#4-basemap-providers-and-map-rendering-technology)

- [5. Public transport sources: MTC, Metro and suburban rail](#5-public-transport-sources-mtc-metro-and-suburban-rail)

- [6. Transit data standards and routing engine](#6-transit-data-standards-and-routing-engine)

- [7. Live road traffic options](#7-live-road-traffic-options)

- [8. Additional map and reference datasets](#8-additional-map-and-reference-datasets)

- [9. Supplied Theme7 ZIP — complete map-related file inventory](#9-supplied-theme7-zip-complete-map-related-file-inventory)

- [10. Data and integration status — what each source can truthfully power](#10-data-and-integration-status-what-each-source-can-truthfully-power)

- [11. What to give Stitch versus Antigravity](#11-what-to-give-stitch-versus-antigravity)

- [12. Recommended Screen 4 layer architecture](#12-recommended-screen-4-layer-architecture)

- [13. Recommended acquisition and validation workflow](#13-recommended-acquisition-and-validation-workflow)

- [14. Coordinate systems, formats and file handling](#14-coordinate-systems-formats-and-file-handling)

- [15. Non-negotiable accuracy and licensing notes](#15-non-negotiable-accuracy-and-licensing-notes)

- [16. Master link index — all map-relevant links](#16-master-link-index-all-map-relevant-links)

- [17. Recommended attachment package for Screen 4](#17-recommended-attachment-package-for-screen-4)

- [18. Recommended final decisions for MOVEFAIR](#18-recommended-final-decisions-for-movefair)

- [19. Research and verification notes](#19-research-and-verification-notes)

---

**MOVEFAIR**

A single reference document for Stitch design, Antigravity engineering and map-data validation

**OFFICIAL GEOGRAPHY  ·  BASEMAPS  ·  TRANSIT DATA  ·  LIVE TRAFFIC  ·  TECHNICAL DOCS**

> **Purpose**<br>This document consolidates every map-relevant resource collected for MOVEFAIR Screen 4: the official Chennai geography services, transit feeds and operator references, basemap providers, pedestrian-network sources, traffic services, live-bus references, technical documentation and the supplied Theme7 data inventory. Use it as the single link register for the design and implementation team.

Prepared: 5 November 2026  |  Research status: links checked against current source pages where possible

Project: Startup Peravai × CUMTA Mobility Challenge · PS7

## 1. Executive summary

Screen 4 is the authenticated MOVEFAIR Mobility Explorer. It must use a real, interactive map, not a static illustration. The map should be assembled from separate, independently switchable layers. A geographically accurate base map is not automatically live traffic; a bus timetable is not live vehicle tracking.

| **Layer** | **Recommended source** | **What it supplies** | **Status / caveat** |
| --- | --- | --- | --- |
| **Basemap** | **MapTiler Streets v4 + MapLibre GL JS** | **Roads, streets, buildings, water, labels and places** | **Recommended starting stack; API key and attribution required** |
| **GCC geography** | **GCC ArcGIS Administrative Boundary service** | **Ward, zone and region polygons** | **Official GCC coverage; not all CMA local bodies** |
| **Wider CMA context** | **Tamil Nadu GIS CUMTA viewer / CMA boundary resource** | **CUMTA boundary and local-body context** | **Use as wider extent/reference; verify download/API access per layer** |
| **Public transport** | **CUMTA GTFS + operator references** | **MTC/Metro/suburban stops, routes and schedules** | **Static feeds; validate service dates and data quality** |
| **Walking network** | **OpenStreetMap + OSMnx** | **Footways, walkable streets and network routing** | **Completeness varies; ODbL attribution/licensing applies** |
| **Live road traffic** | **TomTom Orbis Traffic API (test first)** | **Traffic flow and incidents** | **India listed as supported; test actual Kathipara/Chennai road coverage** |
| **Live MTC buses** | **MTC official live-tracking experience** | **Public-facing bus tracking experience** | **No public developer API/feed contract verified; request permission** |

> **Recommended implementation combination**<br>MapLibre GL JS + MapTiler Streets + GCC Ward GIS + CUMTA GTFS + OpenStreetMap pedestrian network. Trial TomTom Orbis traffic on Kathipara and selected arterial roads. Add MTC live vehicle positions only after MTC/CUMTA confirms an authorised integration feed.

## 2. The four layers of map accuracy

| **Layer type** | **Meaning** | **Example resource** | **Do not confuse it with** |
| --- | --- | --- | --- |
| **Basemap** | **The underlying geography and visual cartography** | **MapTiler Streets; OSM-derived map tiles** | **Live traffic or transit schedules** |
| **Official geography** | **Administrative boundary data used for ward/zone analysis** | **GCC ArcGIS; TNGIS CUMTA** | **A citywide ward system outside GCC** |
| **Transport network** | **Stops, lines, trips and scheduled services** | **CUMTA GTFS; MTC/CMRL/SR official info** | **Moving live vehicles** |
| **Real-time overlays** | **Continuously refreshed road flow or actual vehicle locations** | **TomTom traffic; approved MTC live feed** | **A time-based visual simulation or static GTFS** |

## 3. Official Chennai geography resources

These are the most important sources for making the map recognisably and geographically Chennai. Use GCC ward geometry only within GCC. Use the wider CUMTA/CMA boundary for metropolitan context; do not extend GCC ward polygons to Avadi, Tambaram or other local bodies unless an appropriate local-body boundary dataset is separately acquired.

**GEO-01  GCC Administrative Boundary MapServer**

> **Owner: Greater Chennai Corporation  |  Type: Official ArcGIS REST service  |  Priority: Essential**

**Use: **Primary administrative geography. The service lists Region Boundary (Layer 6), Zone_Boundary (Layer 5) and Ward_Boundary (Layer 4). It reports EPSG:32644 and supports JSON, GeoJSON and PBF queries.

**Limit / validation: **Confirm current ward count, ward IDs, service metadata and retrieval date when downloading. The GCC service covers GCC, not the complete CMA.

> [<https://gisgcc.chennaicorporation.gov.in/server/rest/services/GCCPublic/GCC_AdminBoundary/MapServer](https://gisgcc.chennaicorporation.gov.in/server/rest/services/GCCPublic/GCC_AdminBoundary/MapServer>)

**GEO-02  GCC Ward_Boundary — Layer 4**

> **Owner: Greater Chennai Corporation  |  Type: Official polygon feature layer  |  Priority: Essential**

**Use: **Use for choropleth boundaries, assigning stops/stations to wards and ward-level aggregation.

**Limit / validation: **Layer CRS is reported as EPSG:32644. Reproject to EPSG:4326 for browser display; use an appropriate metric CRS for distances/areas. Validate polygons and attributes.

> [<https://gisgcc.chennaicorporation.gov.in/server/rest/services/GCCPublic/GCC_AdminBoundary/MapServer/4](https://gisgcc.chennaicorporation.gov.in/server/rest/services/GCCPublic/GCC_AdminBoundary/MapServer/4>)

**GEO-03  GCC Zone_Boundary — Layer 5**

> **Owner: Greater Chennai Corporation  |  Type: Official polygon feature layer  |  Priority: Useful**

**Use: **Display GCC zones and offer zone-level map navigation/context.

**Limit / validation: **Do not substitute zones for wards. Check current IDs and geometry before aggregating.

> [<https://gisgcc.chennaicorporation.gov.in/server/rest/services/GCCPublic/GCC_AdminBoundary/MapServer/5](https://gisgcc.chennaicorporation.gov.in/server/rest/services/GCCPublic/GCC_AdminBoundary/MapServer/5>)

**GEO-04  GCC Region Boundary — Layer 6**

> **Owner: Greater Chennai Corporation  |  Type: Official polygon feature layer  |  Priority: Useful**

**Use: **Wider corporation-level regional context and map framing.

**Limit / validation: **Validate semantics and relationship to zones/wards in service metadata.

> [<https://gisgcc.chennaicorporation.gov.in/server/rest/services/GCCPublic/GCC_AdminBoundary/MapServer/6](https://gisgcc.chennaicorporation.gov.in/server/rest/services/GCCPublic/GCC_AdminBoundary/MapServer/6>)

**GCC GeoJSON query pattern**

> Use this as a request template to retrieve all ward polygons in WGS84. Test the response and preserve the raw response plus retrieval timestamp.

<https://gisgcc.chennaicorporation.gov.in/server/rest/services/GCCPublic/GCC_AdminBoundary/MapServer/4/query?where=1%3D1&outFields=*&returnGeometry=true&outSR=4326&f=geojson>

**GEO-05  GCC Collaboration GIS MapServer**

> **Owner: Greater Chennai Corporation  |  Type: Official ArcGIS REST service  |  Priority: High value**

**Use: **Supplementary urban infrastructure layers. Child layers include River_GCC (1), CentreLine (2), CarriageWay (3), Buildings (4), Vehicular_Subways (5), Ward (6), Zone (7), Storm_Water_Drain (8) and bridge-related category (0).

**Limit / validation: **Centreline is a road reference, not a verified pedestrian/footpath network. Carriageway is not a sidewalk layer. Check each child layer schema and date.

> [<https://gisgcc.chennaicorporation.gov.in/server/rest/services/GCCDepts/GCC_COLLABORATION_LAYER/MapServer](https://gisgcc.chennaicorporation.gov.in/server/rest/services/GCCDepts/GCC_COLLABORATION_LAYER/MapServer>)

**GEO-05.2  CentreLine — Layer 2  [Official GCC GIS]**

> [<https://gisgcc.chennaicorporation.gov.in/server/rest/services/GCCDepts/GCC_COLLABORATION_LAYER/MapServer/2](https://gisgcc.chennaicorporation.gov.in/server/rest/services/GCCDepts/GCC_COLLABORATION_LAYER/MapServer/2>)

> Road geometry and any available road/ward attributes; useful as a GCC road reference.

**GEO-05.3  CarriageWay — Layer 3  [Official GCC GIS]**

> [<https://gisgcc.chennaicorporation.gov.in/server/rest/services/GCCDepts/GCC_COLLABORATION_LAYER/MapServer/3](https://gisgcc.chennaicorporation.gov.in/server/rest/services/GCCDepts/GCC_COLLABORATION_LAYER/MapServer/3>)

> Carriageway geometry; road-infrastructure context, not pedestrian access.

**GEO-05.4  Buildings — Layer 4  [Official GCC GIS]**

> [<https://gisgcc.chennaicorporation.gov.in/server/rest/services/GCCDepts/GCC_COLLABORATION_LAYER/MapServer/4](https://gisgcc.chennaicorporation.gov.in/server/rest/services/GCCDepts/GCC_COLLABORATION_LAYER/MapServer/4>)

> Building geometry where published; useful for local map detail.

**GEO-05.5  Vehicular_Subways — Layer 5  [Official GCC GIS]**

> [<https://gisgcc.chennaicorporation.gov.in/server/rest/services/GCCDepts/GCC_COLLABORATION_LAYER/MapServer/5](https://gisgcc.chennaicorporation.gov.in/server/rest/services/GCCDepts/GCC_COLLABORATION_LAYER/MapServer/5>)

> Vehicular subway locations/geometry, useful as road-network context.

**GEO-05.1  River_GCC — Layer 1  [Official GCC GIS]**

> [<https://gisgcc.chennaicorporation.gov.in/server/rest/services/GCCDepts/GCC_COLLABORATION_LAYER/MapServer/1](https://gisgcc.chennaicorporation.gov.in/server/rest/services/GCCDepts/GCC_COLLABORATION_LAYER/MapServer/1>)

> River geometry; physical barrier/context layer.

**GEO-05.8  Storm_Water_Drain — Layer 8  [Official GCC GIS]**

> [<https://gisgcc.chennaicorporation.gov.in/server/rest/services/GCCDepts/GCC_COLLABORATION_LAYER/MapServer/8](https://gisgcc.chennaicorporation.gov.in/server/rest/services/GCCDepts/GCC_COLLABORATION_LAYER/MapServer/8>)

> Drainage infrastructure context; not a pedestrian routing layer.

**GEO-06  GCC Revenue Portal Roads API**

> **Owner: Greater Chennai Corporation  |  Type: Official ArcGIS REST road layer  |  Priority: Supplementary**

**Use: **An additional road line layer that can be compared with GCC CentreLine and OSM.

**Limit / validation: **Service extent appears focused within GCC. Inspect layer fields, positional alignment, update history and reuse terms before preferring it over the main basemap.

> [<https://gisgcc.chennaicorporation.gov.in/server/rest/services/Revenue/PortalRoadsAPI/MapServer](https://gisgcc.chennaicorporation.gov.in/server/rest/services/Revenue/PortalRoadsAPI/MapServer>)

**GEO-07  Tamil Nadu GIS — CUMTA Map Viewer**

> **Owner: Tamil Nadu GIS / TNeGA  |  Type: Official interactive GIS viewer  |  Priority: Essential reference**

**Use: **Visual reference and layer-discovery source for CUMTA boundary, corporations, municipalities, urban local bodies, major roads, bus shelters and other thematic layers.

**Limit / validation: **The viewer is primarily a discovery/reference interface. Do not assume every visible layer has a public bulk-download API. The viewer indicates a maximum of three selected layers at a time.

> [<https://tngis.tn.gov.in/apps/cumta/](https://tngis.tn.gov.in/apps/cumta/>)

**GEO-08  Chennai Urban Metropolitan Transport Authority Boundary**

> **Owner: CUMTA-derived / OpenCity catalogue  |  Type: Open geographic dataset listing  |  Priority: Useful**

**Use: **Use to define the wider metropolitan study area and distinguish CMA coverage from GCC ward coverage.

**Limit / validation: **Boundary alone does not provide ward polygons for all CMA local bodies. Inspect the download format, source vintage and licence on the dataset page.

> [<https://data.opencity.in/dataset/chennai-urban-metropolitan-transport-authority-boundary](https://data.opencity.in/dataset/chennai-urban-metropolitan-transport-authority-boundary>)

**GEO-09  OpenCity Chennai Mobility Catalogue**

> **Owner: OpenCity  |  Type: Dataset directory  |  Priority: Useful**

**Use: **Discover supplementary Chennai transport/civic map datasets including MRTS geometry, road centreline, bus-stop audits and crash resources.

**Limit / validation: **Catalogue metadata can vary. Inspect each dataset's own download, update date and licence. Some entries may be reference-only or non-commercial.

> [<https://data.opencity.in/dataset/?groups=chennai&tags=Mobility](https://data.opencity.in/dataset/?groups=chennai&tags=Mobility>)

## 4. Basemap providers and map rendering technology

A renderer draws a map; a basemap provider supplies its underlying tiles/style. MOVEFAIR should keep these separate so a provider can be changed without rebuilding the app. The recommended starting point is MapLibre GL JS with MapTiler Streets vector tiles, subject to API-key restrictions, plan limits and attribution.

**BASE-01  MapLibre GL JS documentation**

> **Owner: MapLibre project  |  Type: Open-source map renderer documentation  |  Priority: Essential**

**Use: **Primary browser map renderer. Provides WebGL map display, controls, GeoJSON/vector sources, layer styling, click/hover events and map navigation.

**Limit / validation: **MapLibre is not a map-data provider. It needs a style/tile source, data overlays, and correct CORS/attribution handling.

> [<https://maplibre.org/maplibre-gl-js/docs/](https://maplibre.org/maplibre-gl-js/docs/>)

**BASE-02  MapLibre Style Specification**

> **Owner: MapLibre project  |  Type: Map style specification  |  Priority: Essential**

**Use: **Defines how map sources, layers, paint/layout properties, symbols, camera defaults and style metadata are represented.

**Limit / validation: **Use the current spec compatible with the installed MapLibre GL JS version.

> [<https://maplibre.org/maplibre-style-spec/](https://maplibre.org/maplibre-style-spec/>)

**BASE-03  MapLibre GeoJSON Source reference**

> **Owner: MapLibre project  |  Type: Developer reference  |  Priority: Essential**

**Use: **Shows how to add GeoJSON feature data, including ward polygons, stop points and route lines, as map sources.

**Limit / validation: **Browser-loaded GeoJSON must be served from the same domain or have suitable CORS headers. Large layers may need tiling/clustering.

> [<https://maplibre.org/maplibre-style-spec/sources/](https://maplibre.org/maplibre-style-spec/sources/>)

**BASE-04  MapTiler Streets v4**

> **Owner: MapTiler  |  Type: Hosted vector basemap style  |  Priority: Essential**

**Use: **Recommended street basemap for Chennai: streets, road hierarchy, labels, buildings and place context. Use Streets v4 as the initial style.

**Limit / validation: **Requires an API key. Check current usage plan, allowed origins, attribution and production terms. Test map detail around Kathipara, Guindy and selected localities.

> [<https://www.maptiler.com/maps/streets/](https://www.maptiler.com/maps/streets/>)

**BASE-05  MapTiler + MapLibre integration guide**

> **Owner: MapTiler  |  Type: Developer guide  |  Priority: Essential**

**Use: **Official example for using a MapTiler style URL in MapLibre GL JS. Example style URL: <https://api.maptiler.com/maps/streets-v4/style.json?key=YOUR_MAPTILER_API_KEY>.

**Limit / validation: **Do not paste the real key into Stitch, public prompts or source control. Store it in an environment variable and restrict key origins/usage.

> [<https://docs.maptiler.com/maplibre/](https://docs.maptiler.com/maplibre/>)

**BASE-06  MapTiler API reference**

> **Owner: MapTiler  |  Type: Developer/API documentation  |  Priority: Essential**

**Use: **Style JSON, tile, TileJSON and map endpoints; useful for the basemap integration.

**Limit / validation: **API requires a valid account key. Review current terms and plan before deploying.

> [<https://docs.maptiler.com/cloud/api/reference/](https://docs.maptiler.com/cloud/api/reference/>)

**BASE-07  MapTiler API key guide**

> **Owner: MapTiler  |  Type: Credential/security guide  |  Priority: Essential**

**Use: **Create and secure a key; restrict by HTTP origin or other supported key controls.

**Limit / validation: **Browser keys are public to the browser. Restrict them, monitor quota and never treat them like server secrets.

> [<https://docs.maptiler.com/guides/developer/credentials/api-key/](https://docs.maptiler.com/guides/developer/credentials/api-key/>)

**BASE-08  OpenStreetMap main map**

> **Owner: OpenStreetMap Foundation / contributors  |  Type: Open geographic map data  |  Priority: Essential**

**Use: **Visual spot-check of street/footway coverage and local geography; source of OSM-derived map data.

**Limit / validation: **ODbL attribution and share-alike conditions may apply to derived databases. OSM data accuracy/completeness varies by location.

> [<https://www.openstreetmap.org/](https://www.openstreetmap.org/>)

**BASE-09  Geofabrik India extract**

> **Owner: Geofabrik  |  Type: Downloadable OSM PBF extract  |  Priority: Engineering**

**Use: **Download OSM road, pedestrian and place data for offline geospatial processing. Download India PBF then clip to the project area.

**Limit / validation: **India PBF is large (about 1.6 GB at the time of review). The extract is refreshed; record timestamp and clip to GCC/CMA. OSM ODbL obligations remain.

> [<https://download.geofabrik.de/asia/india.html](https://download.geofabrik.de/asia/india.html>)

**BASE-10  OpenStreetMap copyright and licence**

> **Owner: OpenStreetMap Foundation  |  Type: Licence/attribution reference  |  Priority: Essential**

**Use: **Explains ODbL attribution and requirements for use of OpenStreetMap data.

**Limit / validation: **Follow attribution and derivative-database requirements; check legal/licence implications for redistributed data.

> [<https://www.openstreetmap.org/copyright](https://www.openstreetmap.org/copyright>)

**BASE-11  OSM tile usage policy**

> **Owner: OpenStreetMap Foundation  |  Type: Tile-service usage policy  |  Priority: Essential**

**Use: **Read before using the public tile.openstreetmap.org service in a prototype or production app.

**Limit / validation: **Public tile server has limited capacity, best-effort service and no SLA. Must show attribution, follow caching/user-agent/referrer requirements; bulk scraping/prefetching is prohibited. Prefer MapTiler or self-hosted tiles for production.

> [<https://operations.osmfoundation.org/policies/tiles/](https://operations.osmfoundation.org/policies/tiles/>)

**BASE-12  Overpass API documentation**

> **Owner: OpenStreetMap community  |  Type: OSM feature-query API reference  |  Priority: Supplementary**

**Use: **Query specific OSM objects such as footways, crossings, station entrances and roads for small targeted research/validation tasks.

**Limit / validation: **Public instances are shared resources with usage limits. Do not use broad repeated queries or build a production tile service from Overpass. For reproducible ingestion use a dated extract.

> [<https://wiki.openstreetmap.org/wiki/Overpass_API](https://wiki.openstreetmap.org/wiki/Overpass_API>)

**BASE-13  OSMnx documentation**

> **Owner: OSMnx project  |  Type: Python geospatial network toolkit  |  Priority: Engineering**

**Use: **Download/model walkable street networks, compute shortest paths and inspect pedestrian network coverage for accessibility calculations.

**Limit / validation: **OSMnx supports walk/drive/bike network types, but network tags can be incomplete. Validate network coverage around selected stops and wards.

> [<https://osmnx.readthedocs.io/en/stable/getting-started.html](https://osmnx.readthedocs.io/en/stable/getting-started.html>)

## 5. Public transport sources: MTC, Metro and suburban rail

**TRANS-01  CUMTA Transit Data Chennai**

> **Owner: CUMTA  |  Type: Static GTFS portal and network viewer  |  Priority: Essential**

**Use: **Primary dataset entry point for MTC, CMRL and Southern Railway suburban GTFS feeds; use for stop/route/trip/schedule layers after validation.

**Limit / validation: **Portal-reported 2,448 indexed routes, 2,846 mapped stops and 3 agencies are portal counts, not a guarantee of current valid feeds. Inspect each ZIP, feed_info, service dates, stop IDs, trip links and validation results.

> [<https://opendata.cumta.org/](https://opendata.cumta.org/>)

**TRANS-02  MTC official website**

> **Owner: Metropolitan Transport Corporation, Chennai  |  Type: Official operator portal  |  Priority: Essential**

**Use: **Entry point for bus routes, schedule search, service notices and the official live-tracking links.

**Limit / validation: **A public website does not establish a public API. Use direct pages below and request permission for integrations.

> [<https://mtcbus.tn.gov.in/](https://mtcbus.tn.gov.in/>)

**TRANS-03  MTC route-wise information**

> **Owner: MTC  |  Type: Official route and stage lookup  |  Priority: Essential**

**Use: **Validate route identities, stages, origin/destination naming and route information.

**Limit / validation: **The page was indexed as updated 7 August 2026 during research. Recheck the page and returned service details at implementation time.

> [<https://mtcbus.tn.gov.in/Home/routewiseinfo](https://mtcbus.tn.gov.in/Home/routewiseinfo>)

**TRANS-04  MTC bus timing schedule**

> **Owner: MTC  |  Type: Official timetable search  |  Priority: Essential**

**Use: **Check current bus timing schedule by route/origin/destination. Page indicated times in 24-hour format and an update date of 11 September 2026 during research.

**Limit / validation: **Search results may be user-interface only; do not assume a bulk download/API exists. Confirm timetable validity for the route/day.

> [<https://mtcbus.tn.gov.in/Home/bustypetimingsearch](https://mtcbus.tn.gov.in/Home/bustypetimingsearch>)

**TRANS-05  MTC bus type-wise timing search**

> **Owner: MTC  |  Type: Official timing lookup  |  Priority: Useful**

**Use: **Additional operator timing search by bus type, route, origin and destination.

**Limit / validation: **Use as a validation/reference interface; not a replacement for a structured GTFS feed.

> [<https://mtcbus.tn.gov.in/Home/bus_timing_search](https://mtcbus.tn.gov.in/Home/bus_timing_search>)

**TRANS-06  MTC live-tracking experience**

> **Owner: MTC  |  Type: Official user-facing tracking service  |  Priority: Partner/permission dependent**

**Use: **Reference for live bus tracking screens and potential official tracking availability. MTC website news states live tracking is available on the website.

**Limit / validation: **No public developer API/feed contract was verified. Do not scrape the portal, reverse engineer private endpoints or display its data inside MOVEFAIR without written permission. Ask MTC/CUMTA for approved GTFS-RT/API access.

> [<https://commuter.mtcbusits.in/](https://commuter.mtcbusits.in/>)

**TRANS-07  Chennai Metro Rail official site**

> **Owner: Chennai Metro Rail Limited  |  Type: Official operator portal  |  Priority: Essential**

**Use: **Validate station names, operational corridors, service notices and fare information.

**Limit / validation: **Separate operational Phase I services from Phase II corridors that may be under construction or planned. Do not label every line on a Phase I/II map as currently operational.

> [<https://chennaimetrorail.org/](https://chennaimetrorail.org/>)

**TRANS-08  CMRL Phase I & II route map PDF**

> **Owner: CMRL  |  Type: Official PDF map  |  Priority: High value reference**

**Use: **Visual reference for the Metro corridor geography and station naming. The map file is labelled updated 18 December 2024.

**Limit / validation: **It includes Phase I and Phase II; status must be checked station/corridor by station/corridor. It is a schematic/geographic reference, not a GTFS feed.

> [<https://chennaimetrorail.org/wp-content/uploads/2025/02/Phase-I-II-Map-Updated-Map-18.12.2024-PHASE-1-2-MAP.pdf](https://chennaimetrorail.org/wp-content/uploads/2025/02/Phase-I-II-Map-Updated-Map-18.12.2024-PHASE-1-2-MAP.pdf>)

**TRANS-09  CMRL fare table**

> **Owner: CMRL  |  Type: Official operator fare page  |  Priority: Essential for fare engine**

**Use: **Validate fare values for Metro journey-leg calculations.

**Limit / validation: **Record the tariff effective date and any fare product/concession rules; recheck before release.

> [<https://chennaimetrorail.org/cmrl-fare-table/](https://chennaimetrorail.org/cmrl-fare-table/>)

**TRANS-10  Southern Railway official site**

> **Owner: Southern Railway / Indian Railways  |  Type: Official railway portal  |  Priority: Essential**

**Use: **Validate Chennai suburban station names, service notices, timetables and operator information.

**Limit / validation: **No public bulk Chennai suburban GTFS or open API was verified. Use CUMTA feed if valid and cross-check selected routes against official information.

> [<https://sr.indianrailways.gov.in/](https://sr.indianrailways.gov.in/>)

**TRANS-11  National Train Enquiry System**

> **Owner: Indian Railways  |  Type: Official train enquiry service  |  Priority: Useful**

**Use: **Operational reference for train running information and train status when validating selected rail services.

**Limit / validation: **Not confirmed as a bulk third-party route-planning API or redistributable data feed.

> [<https://enquiry.indianrail.gov.in/ntes/](https://enquiry.indianrail.gov.in/ntes/>)

## 6. Transit data standards and routing engine

**TECH-01  GTFS Schedule overview**

> **Owner: GTFS community standard  |  Type: Open transit data specification  |  Priority: Essential**

**Use: **Defines static public transport data stored in ZIP text files: agency, stops, routes, trips, stop_times, calendar and calendar_dates, plus optional files such as fares, transfers and pathways.

**Limit / validation: **Static schedule data does not contain live vehicle positions. Check feed validity dates, timezone and file consistency.

> [<https://gtfs.org/documentation/overview/](https://gtfs.org/documentation/overview/>)

**TECH-02  GTFS Schedule reference**

> **Owner: GTFS community standard  |  Type: Detailed field/schema reference  |  Priority: Engineering**

**Use: **Use when parsing GTFS files and designing the canonical transport database.

**Limit / validation: **Specification changes over time; implementation should pin to a known supported version and validate feed conformance.

> [<https://gtfs.org/documentation/schedule/reference/](https://gtfs.org/documentation/schedule/reference/>)

**TECH-03  GTFS Realtime reference**

> **Owner: GTFS community standard  |  Type: Realtime transit data specification  |  Priority: Future / access dependent**

**Use: **Describes VehiclePositions, TripUpdates and ServiceAlerts when an operator publishes an approved realtime feed.

**Limit / validation: **A standard does not mean Chennai agencies publish an accessible feed. Confirm source, permissions, freshness and identifiers.

> [<https://gtfs.org/documentation/realtime/](https://gtfs.org/documentation/realtime/>)

**TECH-04  OpenTripPlanner data sources**

> **Owner: OpenTripPlanner project  |  Type: Multimodal routing engine documentation  |  Priority: Engineering**

**Use: **OpenTripPlanner can build multimodal networks from OpenStreetMap and GTFS/GTFS-RT and calculate walk + transit itineraries.

**Limit / validation: **Requires feed preparation, graph build and configuration; route quality is only as good as the feed and street network.

> [<https://docs.opentripplanner.org/en/latest/Data-Sources/](https://docs.opentripplanner.org/en/latest/Data-Sources/>)

**TECH-05  OpenTripPlanner GraphQL API**

> **Owner: OpenTripPlanner project  |  Type: Routing API docs  |  Priority: Engineering**

**Use: **Reference for integrating OTP journey searches into FastAPI/frontend workflows.

**Limit / validation: **Check the deployed OTP version and API schema; use the version-specific docs.

> [<https://docs.opentripplanner.org/en/latest/Apis/](https://docs.opentripplanner.org/en/latest/Apis/>)

## 7. Live road traffic options

Road traffic flow and bus GPS are different datasets. Traffic APIs may estimate road speed/congestion; they do not reveal a bus vehicle position unless the transit operator separately publishes that data.

**LIVE-01  TomTom Orbis Traffic API**

> **Owner: TomTom  |  Type: Traffic Flow and Traffic Incidents API  |  Priority: Recommended traffic trial**

**Use: **Best first candidate to test for a live road traffic overlay on Kathipara, Guindy and selected arterial corridors. India is listed in the Orbis market coverage table for both Traffic Flow and Traffic Incidents.

**Limit / validation: **Country-level market support does not prove detailed coverage on every local road. Test exact Chennai segments, response freshness, update cadence, costs, terms and attribution before choosing. Requires API access/key.

> [<https://docs.tomtom.com/traffic-api/documentation/tomtom-orbis-maps/v2/](https://docs.tomtom.com/traffic-api/documentation/tomtom-orbis-maps/v2/>)

**LIVE-02  TomTom Orbis Traffic market coverage**

> **Owner: TomTom  |  Type: Coverage reference  |  Priority: Essential validation**

**Use: **Confirms which countries are supported for Traffic Flow and Traffic Incidents. India appears in the Asia table.

**Limit / validation: **Always test the exact local roads and zoom levels; coverage may vary by road class and segment.

> [<https://docs.tomtom.com/traffic-api/documentation/tomtom-orbis-maps/v2/product-information/market-coverage](https://docs.tomtom.com/traffic-api/documentation/tomtom-orbis-maps/v2/product-information/market-coverage>)

**LIVE-03  TomTom Traffic Flow service**

> **Owner: TomTom  |  Type: Traffic API endpoint documentation  |  Priority: Engineering**

**Use: **Technical reference for retrieving traffic flow data after obtaining access.

**Limit / validation: **Use the current Orbis v2 docs for new work; older v1 documentation may describe legacy endpoint behavior.

> [<https://docs.tomtom.com/traffic-api/documentation/tomtom-orbis-maps/v2/traffic-flow/traffic-flow-service](https://docs.tomtom.com/traffic-api/documentation/tomtom-orbis-maps/v2/traffic-flow/traffic-flow-service>)

**LIVE-04  Google Maps TrafficLayer / TransitLayer**

> **Owner: Google Maps Platform  |  Type: Hosted real-time map overlay  |  Priority: Alternative**

**Use: **Alternative for showing current traffic and transit layers on Google Maps JavaScript API maps. TrafficLayer refreshes frequently but not instantly; layers are available in selected regions.

**Limit / validation: **This is a Google Maps JS feature, not a drop-in MapLibre layer. Test Chennai availability, pricing, attribution and terms before adopting. Do not mix two map engines casually in one screen.

> [<https://developers.google.com/maps/documentation/javascript/trafficlayer](https://developers.google.com/maps/documentation/javascript/trafficlayer>)

**LIVE-05  Google Maps traffic-aware routing**

> **Owner: Google Maps Platform  |  Type: Traffic-aware routing documentation  |  Priority: Alternative**

**Use: **Alternative route-time estimates that take traffic into account, where supported.

**Limit / validation: **Requires Google Maps Platform configuration/billing and region support checks. Distinct from a raw MapLibre overlay.

> [<https://developers.google.com/maps/documentation/javascript/routes/traffic-options](https://developers.google.com/maps/documentation/javascript/routes/traffic-options>)

**LIVE-06  Mapbox Traffic Data**

> **Owner: Mapbox  |  Type: Licensed traffic speed dataset  |  Priority: Commercial alternative**

**Use: **Provides typical and live estimated road speeds; documentation says live speeds are observed within the last 15 minutes.

**Limit / validation: **Traffic Data requires a separate licence. Confirm India/Chennai market access, terms, price and MapLibre interoperability before considering it.

> [<https://docs.mapbox.com/data/traffic/](https://docs.mapbox.com/data/traffic/>)

**LIVE-07  Mapbox Traffic v1 tileset**

> **Owner: Mapbox  |  Type: Vector traffic tile reference  |  Priority: Commercial alternative**

**Use: **Technical documentation for Mapbox traffic tileset and TileJSON/vector tile access.

**Limit / validation: **Requires appropriate Mapbox access and licensing; do not assume the tileset can be consumed in any renderer or redistributed without restrictions.

> [<https://docs.mapbox.com/data/tilesets/reference/mapbox-traffic-v1/](https://docs.mapbox.com/data/tilesets/reference/mapbox-traffic-v1/>)

## 8. Additional map and reference datasets

**ADD-01  Chennai MTC Performance Data (2020–21 to 2025–26)**

> **Owner: OpenCity / operator-derived  |  Type: CSV aggregate performance data  |  Priority: Supplementary**

**Use: **City-level operational context and supplementary dashboard data.

**Limit / validation: **Aggregate, not a route-level live map feed. Check licence and data dictionary.

> [<https://data.opencity.in/dataset/c7bf200b-03e1-403f-99be-487d3c4a294a/resource/0c917fe2-aaef-4873-95f3-4da9e50620f3/download/0c917fe2-aaef-4873-95f3-4da9e50620f3.csv](https://data.opencity.in/dataset/c7bf200b-03e1-403f-99be-487d3c4a294a/resource/0c917fe2-aaef-4873-95f3-4da9e50620f3/download/0c917fe2-aaef-4873-95f3-4da9e50620f3.csv>)

**ADD-02  Chennai Metro Monthly Usage Data**

> **Owner: OpenCity / CMRL-derived  |  Type: CSV ridership series  |  Priority: Supplementary**

**Use: **Monthly Metro ridership trend context; use in analytics, not station-level live display.

**Limit / validation: **Aggregate monthly data cannot identify rider origin/destination or ward-level flows. Inspect series date range and definitions.

> [<https://data.opencity.in/dataset/118434fe-dd69-4dd3-a6a8-4c577326cc34/resource/c63ef5a0-e7d2-49b3-9c88-5ca5ce309fcf/download/cmrl-metro-ridership-2023-26.csv](https://data.opencity.in/dataset/118434fe-dd69-4dd3-a6a8-4c577326cc34/resource/c63ef5a0-e7d2-49b3-9c88-5ca5ce309fcf/download/cmrl-metro-ridership-2023-26.csv>)

**ADD-03  Chennai Bus Stop Audit Data**

> **Owner: Oorvani Foundation / Nagariyal / OpenCity catalogue  |  Type: Bus-stop audit observations  |  Priority: Supplementary**

**Use: **Reference for shelter, signage, passenger information, accessibility and stop quality attributes.

**Limit / validation: **Not a citywide stop inventory; check exact survey coverage, source, licence and any non-commercial restrictions before reuse.

> [<https://data.opencity.in/dataset/?groups=chennai&tags=Mobility](https://data.opencity.in/dataset/?groups=chennai&tags=Mobility>)

**ADD-04  Chennai Road Crashes Data (1998–2025)**

> **Owner: OpenCity / police-derived catalogue  |  Type: Historical aggregate crash counts  |  Priority: Supplementary**

**Use: **Potential context layer for safety analytics if a geocoded source is later obtained.

**Limit / validation: **Annual aggregate data is not geocoded; it cannot create ward incident hotspots by itself.

> [<https://data.opencity.in/dataset/chennai-road-crashes-data](https://data.opencity.in/dataset/chennai-road-crashes-data>)

**ADD-05  Chennai MRTS Data**

> **Owner: OpenCity catalogue  |  Type: KML line/station reference  |  Priority: Supplementary**

**Use: **Supplementary geometry cross-check for MRTS line/stations.

**Limit / validation: **Not a timetable or fare dataset. Verify resource link, vintage and names.

> [<https://data.opencity.in/dataset/?groups=chennai&tags=Mobility](https://data.opencity.in/dataset/?groups=chennai&tags=Mobility>)

**ADD-06  Chennai Road Centerline Map**

> **Owner: OpenCity / GCC-derived catalogue  |  Type: KML road line layer  |  Priority: Supplementary**

**Use: **Road geometry cross-check against GCC and OSM.

**Limit / validation: **May be a separate vintage from current GCC GIS. Check resource date and metadata.

> [<https://data.opencity.in/dataset/chennai-road-centerline-map](https://data.opencity.in/dataset/chennai-road-centerline-map>)

## 9. Supplied Theme7 ZIP — complete map-related file inventory

The team-provided Theme7(1).zip was inspected. It contains spatial geometry and a stop workbook useful for map prototyping, but most layers lack full operational schedules, live positions or reliable metadata. Keep the ZIP intact as the original input and process a copy into canonical datasets.

| **Supplied file / folder** | **Observed size / records** | **Geometry / CRS** | **MOVEFAIR use** | **Caveat / action** |
| --- | --- | --- | --- | --- |
| **Public Transport/MTC/routes_merged.shp + sidecars** | **1,348 route geometry records; 680 distinct route_num reported** | **Polyline; EPSG:4326** | **Initial MTC route line reference; spatial overlay** | **No stop sequences, trips, stop_times, calendar or fare rules. Validate IDs and current route alignments against CUMTA/MTC.** |
| **Public Transport/Metro Rail/Operational_Metro.shp + sidecars** | **4 corridor features** | **Polyline; EPSG:4326** | **Initial Metro corridor visual reference** | **Includes Phase/status labels; filename “Operational” does not prove every line is operating. Verify current CMRL status.** |
| **Public Transport/Metro Rail/Operational_Metro_Stns.shp + sidecars** | **51 station point features** | **Point; EPSG:4326** | **Initial Metro station point layer** | **Names are generic KML-derived labels; reconcile with current official CMRL station IDs/names.** |
| **Public Transport/Suburban Rail/Rail_Network_Updated.shp + sidecars** | **53 line features** | **Polyline; EPSG:32644** | **Suburban/MRTS geometry context** | **Mixed types include Suburban, MRTS, MRTS&Sub and CheckAD; validate and filter. No timetable or trip sequence.** |
| **Public Transport/Suburban Rail/Suburban Stations.kml** | **70 placemarks** | **Point; WGS84 coordinates** | **Initial station point references** | **Generic “Stations 1–70” names; match to official station register.** |
| **Tambaram, Avadi, GCC Bus Stops List 1.xlsx** | **GCC 2,227 rows; Avadi 143; Tambaram 347; total 2,717** | **Latitude/longitude; WGS84** | **Stop-point seed for density, nearby transit and map markers** | **No source date/licence/route/frequency fields. Validate coordinates, outliers and duplicates; repeated names may be different stops.** |
| **Road Network Old CMA/Road_Network_Old CMA.shp + sidecars** | **7,644 road links** | **Polyline; EPSG:32644** | **Historical road-network comparison/context** | **Old CMA vintage; not a current footway or live congestion graph. Speed attribute appears free-flow reference, not live speed.** |
| **Traffic Analysis Zones/TAZ_old-CMA.shp + sidecars** | **280 polygon zones** | **Polygon; EPSG:32644** | **Legacy zone-map context** | **Do not assume it matches the CMDA CMP zone geography or current wards; metadata/crosswalk needed.** |
| **Public Transport/PT Fare Structure.pdf** | **One-page fare reference** | **PDF** | **Source locator for CMRL/MTC and suburban fare references** | **Suburban fare chart is cropped/incomplete; MTC link leads to a fare page with an old effective date in earlier review. Do not use as tariff authority.** |

> **Practical conclusion about Theme7**<br>Theme7 is a useful geometry seed, not a complete live Chennai transport map. Use GCC/CUMTA/official operator data to reconcile it. Do not publish generic station names, out-of-date route shapes or unsupported service status as official facts.

## 10. Data and integration status — what each source can truthfully power

| **MOVEFAIR map feature** | **Required data** | **Can build now?** | **Required validation / limitation** |
| --- | --- | --- | --- |
| **Accurate road basemap** | **MapTiler Streets / OSM-derived tiles** | **Yes, with provider key** | **Provider terms, credits, Chennai detail and style loads** |
| **GCC ward overlay** | **GCC Ward_Boundary Layer 4** | **Yes** | **Ward IDs/count, CRS conversion, valid geometries** |
| **Wider CMA boundary** | **TNGIS / CUMTA boundary** | **Reference now; data integration after layer access** | **Confirm layer download/API and local-body coverage** |
| **MTC/Metro/suburban routes and stops** | **CUMTA GTFS + operator validation** | **Yes, after feed QA** | **Feed dates, missing files, IDs, station status, schedules** |
| **Bus-stop points** | **Theme7 workbook + current GTFS/CUMTA data** | **Yes, after validation** | **Date/source/licence, duplicates, coordinate checks** |
| **Walking access** | **OSM footways/walkable graph** | **Yes, after OSM QA** | **Missing pathways, crossings, station entrances; network vs straight-line distance** |
| **Scheduled departure/frequency** | **GTFS stop_times/trips/calendar** | **If feeds validate** | **Show Scheduled; static timetable is not real-time** |
| **Live road traffic** | **TomTom Orbis / Google / licensed provider** | **Provider trial required** | **Test actual road segments; API key, region availability, update cadence, price** |
| **Live MTC bus positions** | **MTC-approved feed/API** | **Not yet established for third-party use** | **Official tracker exists; obtain written permission and endpoint/feed specification** |
| **Selected ward/stop information popups** | **Validated feature properties** | **Yes** | **Avoid showing unsupported details; give source/date label** |

## 11. What to give Stitch versus Antigravity

### 11.1 Attachments for Stitch (design reference)

- The approved four-screen MOVEFAIR reference collage.

- The approved Kathipara aerial photographs (for the Welcome Back scene; not a substitute for the Screen 4 map).

- Screenshots of the GCC Ward GIS map, TNGIS CUMTA map, CUMTA transit network viewer, MapTiler Streets at Chennai city scale and Kathipara zoom level, and the MTC live-tracking interface.

- The project documents context.md, features.md and design.md; plus the Screen 4 map integration prompt.

- This compendium, or at minimum its source register and layer specifications.

> **Do not send Stitch giant raw datasets**<br>Stitch needs visual references and the screen/component specification. Raw shapefiles, a full India OSM PBF, GTFS ZIPs and API secrets are for the engineering workspace. Stitch can design layer controls and states, but it cannot make a map geographically accurate merely by reading a web link.

### 11.2 Inputs for Antigravity (actual map engineering)

- Original Theme7(1).zip, preserved unmodified.

- Downloaded GCC ward GeoJSON plus retrieval date and raw ArcGIS service metadata.

- CUMTA GTFS ZIPs for MTC, CMRL and suburban rail, with feed validation reports.

- MapTiler key stored in a local .env file; never committed or pasted into Stitch.

- Clipped OSM PBF/GeoPackage for the selected Chennai coverage area, with download date and licence notes.

- TomTom traffic trial credentials only after exact road coverage is confirmed; keep server-side secrets protected where possible.

- Written MTC/CUMTA permission and API/feed details before integrating real bus positions.

- Official route/station names and fare tables with effective dates.

## 12. Recommended Screen 4 layer architecture

| **Layer ID** | **Display name** | **Geometry/data** | **Default state** | **Popup / interaction** |
| --- | --- | --- | --- | --- |
| **base** | **Chennai Streets** | **MapTiler vector style** | **On** | **Pan, zoom, search, geolocation** |
| **gcc_wards** | **Ward boundaries** | **GCC polygon GeoJSON** | **Off or subtle outline** | **Ward number/name; open Ward Snapshot** |
| **mtc_stops** | **MTC bus stops** | **GTFS stops / validated stop points** | **On at useful zoom** | **Stop name; routes; scheduled departures if supported** |
| **mtc_routes** | **MTC bus routes** | **GTFS route shapes or validated line geometry** | **Off until selected / toggle** | **Route name/number; origin/destination; source** |
| **metro** | **Metro stations and corridors** | **Official CMRL/CUMTA feed and validated geometry** | **On** | **Official station name; corridor; status** |
| **suburban** | **Suburban railway** | **CUMTA/official station and route data** | **On or optional** | **Station name; service info** |
| **walk_access** | **Walking access** | **OSM pedestrian network** | **Off / on demand** | **Walking route/nearest stop distance; data coverage caveat** |
| **traffic_live** | **Live road traffic** | **TomTom or other tested provider** | **Off** | **Congestion level; provider; last update; no-data state** |
| **mtc_live** | **Live MTC buses** | **Authorised live feed only** | **Off / disabled until access** | **Vehicle position; last update; stale-feed state** |

### 12.1 Required interaction states

- Layer toggle on/off and loading state.

- No data / unavailable / stale source state. Never show fake live markers.

- Stop, station, route and ward selection with contextual panel or bottom sheet.

- Layer legend that explains mode colours and traffic severity.

- Search result selection moves the map to the actual selected geometry.

- Clustering for dense stop markers and progressive labels at different zoom levels.

- Visible attribution and source/freshness information.

- Mobile map with bottom-sheet details and accessible list alternative.

## 13. Recommended acquisition and validation workflow

1. Define the map extent: GCC ward-level core, with a wider CMA boundary for orientation. Make this explicit in the UI.

1. Fetch GCC ward polygons from Layer 4. Save raw JSON/GeoJSON, service metadata, retrieval timestamp and CRS.

1. Download the current CUMTA GTFS feeds. Save feed_info, dates and all original ZIPs. Run a GTFS validator and inspect stops/routes/trips/stop_times/calendars.

1. Compare the Theme7 MTC route lines and stop workbook against the CUMTA feed. Preserve source IDs and record unmatched/duplicate/out-of-area points.

1. Reconcile Metro and suburban station names and operating status against official operator references. Separate operational, under-construction and proposed corridors.

1. Prepare a clipped OSM pedestrian network for the chosen MVP area. Check graph connectivity around Kathipara, Guindy and selected wards.

1. Implement MapLibre + MapTiler base map. Add one overlay at a time and check CRS, CORS, performance and layer order.

1. Trial TomTom Traffic Flow on Kathipara and a small corridor set. Confirm returned road segments, timestamp, update interval and provider terms. Do not turn the layer on by default until validated.

1. Ask MTC/CUMTA for approved live vehicle API/GTFS-RT details. Until approved, show scheduled MTC data or link to the official tracker.

1. Run a final visual/geographic QA: compare known junctions, roads, station locations, ward outlines and route alignments against official sources.

## 14. Coordinate systems, formats and file handling

| **Data source/file** | **Known or expected CRS/format** | **Recommended handling** |
| --- | --- | --- |
| **GCC Admin Boundary** | **EPSG:32644 service; JSON/GeoJSON/PBF query support** | **Keep raw; convert/export to EPSG:4326 for browser; use EPSG:32644 for local metric calculations** |
| **Theme7 MTC routes** | **EPSG:4326 Shapefile** | **Keep all .shp/.shx/.dbf/.prj/.cpg/.qmd sidecars; convert to GeoPackage/GeoJSON for processing** |
| **Theme7 Metro geometry** | **EPSG:4326 Shapefile** | **Resolve generic labels and status before display** |
| **Theme7 suburban rail** | **EPSG:32644 Shapefile; KML stations WGS84** | **Reproject consistently; reconcile station names and service type** |
| **Theme7 bus stops workbook** | **Latitude/longitude, WGS84** | **Normalise to stop_id/name/lat/lon/source; check coordinate ranges and duplicate proximity** |
| **Theme7 old CMA roads and TAZ** | **EPSG:32644 Shapefiles** | **Historical reference only; do not assume current CMA/ward crosswalk** |
| **CUMTA GTFS** | **ZIP containing text tables; standard uses WGS84 coordinates** | **Preserve ZIP; validate file references and service dates; version per feed** |
| **OSM Geofabrik** | **PBF extract** | **Clip to project extent; preserve timestamp and ODbL attribution** |

### 14.1 Suggested data folders

data/  raw/                  # untouched source downloads and Theme7 originals  interim/              # normalised intermediate files  processed/            # validated wards, stops, routes and layers  gtfs/                 # one folder per agency/feed version  osm/                  # dated clipped Chennai OSM extract  metadata/             # source manifest, licences, CRS, checksums  qa/                   # validation reports and unmatched records  demo/                 # small clearly-labelled demonstration fixtures

## 15. Non-negotiable accuracy and licensing notes

- A basemap is not live traffic. Street data may be updated periodically, while a traffic overlay uses separate provider data and timestamps.

- Static GTFS is not real-time. It provides service schedules, routes and stops. GTFS Realtime needs an actual publisher and authorised feed.

- MTC has a public live-tracking experience, but a public developer API or redistribution permission was not verified. Do not scrape or reverse-engineer it.

- TomTom lists India for Traffic Flow and Traffic Incidents. That is not proof of high-quality traffic on every street in Chennai; test exact road segments before showing a live traffic layer.

- Google TrafficLayer is available in selected regions and belongs to Google Maps JavaScript API. It is not a direct MapLibre overlay.

- Mapbox Traffic Data requires a separate Traffic Data licence. Check market access and renderer/contract terms before considering it.

- OpenStreetMap data is licensed under ODbL and attribution is required. The public OSM tile service is best-effort and has strict usage rules; do not bulk download/prefetch its tiles.

- GCC CentreLine is not a footpath map. Do not infer that every road is pedestrian-accessible.

- Phase I & II Metro diagram includes different construction/operating statuses. Validate exact status before styling lines as operational.

- No data is not the same as zero. Missing bus stops, footpaths, fares, station facilities or traffic data must render as unknown/unavailable, not as absence.

- Keep API keys out of Stitch prompts, shared screenshots, Git commits and public documents. Put secrets in environment variables and restrict browser keys by origin.

## 16. Master link index — all map-relevant links

Use this index as the central set of links to copy into Stitch, Antigravity, project documentation or stakeholder requests. URLs are grouped by function. Links to live operator portals and provider products may change; recheck before implementation.

### Official Chennai geography

> **GCC Administrative Boundary service — **[<https://gisgcc.chennaicorporation.gov.in/server/rest/services/GCCPublic/GCC_AdminBoundary/MapServer](https://gisgcc.chennaicorporation.gov.in/server/rest/services/GCCPublic/GCC_AdminBoundary/MapServer>)

> **GCC Ward Boundary Layer 4 — **[<https://gisgcc.chennaicorporation.gov.in/server/rest/services/GCCPublic/GCC_AdminBoundary/MapServer/4](https://gisgcc.chennaicorporation.gov.in/server/rest/services/GCCPublic/GCC_AdminBoundary/MapServer/4>)

> **GCC Ward GeoJSON query template — **[<https://gisgcc.chennaicorporation.gov.in/server/rest/services/GCCPublic/GCC_AdminBoundary/MapServer/4/query?where=1%3D1&outFields=*&returnGeometry=true&outSR=4326&f=geojson](https://gisgcc.chennaicorporation.gov.in/server/rest/services/GCCPublic/GCC_AdminBoundary/MapServer/4/query?where=1%3D1&outFields=*&returnGeometry=true&outSR=4326&f=geojson>)

> **GCC Zone Boundary Layer 5 — **[<https://gisgcc.chennaicorporation.gov.in/server/rest/services/GCCPublic/GCC_AdminBoundary/MapServer/5](https://gisgcc.chennaicorporation.gov.in/server/rest/services/GCCPublic/GCC_AdminBoundary/MapServer/5>)

> **GCC Region Boundary Layer 6 — **[<https://gisgcc.chennaicorporation.gov.in/server/rest/services/GCCPublic/GCC_AdminBoundary/MapServer/6](https://gisgcc.chennaicorporation.gov.in/server/rest/services/GCCPublic/GCC_AdminBoundary/MapServer/6>)

> **GCC Collaboration Layer MapServer — **[<https://gisgcc.chennaicorporation.gov.in/server/rest/services/GCCDepts/GCC_COLLABORATION_LAYER/MapServer](https://gisgcc.chennaicorporation.gov.in/server/rest/services/GCCDepts/GCC_COLLABORATION_LAYER/MapServer>)

> **GCC CentreLine Layer 2 — **[<https://gisgcc.chennaicorporation.gov.in/server/rest/services/GCCDepts/GCC_COLLABORATION_LAYER/MapServer/2](https://gisgcc.chennaicorporation.gov.in/server/rest/services/GCCDepts/GCC_COLLABORATION_LAYER/MapServer/2>)

> **GCC CarriageWay Layer 3 — **[<https://gisgcc.chennaicorporation.gov.in/server/rest/services/GCCDepts/GCC_COLLABORATION_LAYER/MapServer/3](https://gisgcc.chennaicorporation.gov.in/server/rest/services/GCCDepts/GCC_COLLABORATION_LAYER/MapServer/3>)

> **GCC Buildings Layer 4 — **[<https://gisgcc.chennaicorporation.gov.in/server/rest/services/GCCDepts/GCC_COLLABORATION_LAYER/MapServer/4](https://gisgcc.chennaicorporation.gov.in/server/rest/services/GCCDepts/GCC_COLLABORATION_LAYER/MapServer/4>)

> **GCC Vehicular Subways Layer 5 — **[<https://gisgcc.chennaicorporation.gov.in/server/rest/services/GCCDepts/GCC_COLLABORATION_LAYER/MapServer/5](https://gisgcc.chennaicorporation.gov.in/server/rest/services/GCCDepts/GCC_COLLABORATION_LAYER/MapServer/5>)

> **GCC River Layer 1 — **[<https://gisgcc.chennaicorporation.gov.in/server/rest/services/GCCDepts/GCC_COLLABORATION_LAYER/MapServer/1](https://gisgcc.chennaicorporation.gov.in/server/rest/services/GCCDepts/GCC_COLLABORATION_LAYER/MapServer/1>)

> **GCC Storm Water Drain Layer 8 — **[<https://gisgcc.chennaicorporation.gov.in/server/rest/services/GCCDepts/GCC_COLLABORATION_LAYER/MapServer/8](https://gisgcc.chennaicorporation.gov.in/server/rest/services/GCCDepts/GCC_COLLABORATION_LAYER/MapServer/8>)

> **GCC Revenue Portal Roads API — **[<https://gisgcc.chennaicorporation.gov.in/server/rest/services/Revenue/PortalRoadsAPI/MapServer](https://gisgcc.chennaicorporation.gov.in/server/rest/services/Revenue/PortalRoadsAPI/MapServer>)

> **Tamil Nadu GIS CUMTA viewer — **[<https://tngis.tn.gov.in/apps/cumta/](https://tngis.tn.gov.in/apps/cumta/>)

> **CMA/CUMTA boundary OpenCity listing — **[<https://data.opencity.in/dataset/chennai-urban-metropolitan-transport-authority-boundary](https://data.opencity.in/dataset/chennai-urban-metropolitan-transport-authority-boundary>)

### Public transport and operator references

> **CUMTA Transit Data Portal — **[<https://opendata.cumta.org/](https://opendata.cumta.org/>)

> **MTC official website — **[<https://mtcbus.tn.gov.in/](https://mtcbus.tn.gov.in/>)

> **MTC route-wise information — **[<https://mtcbus.tn.gov.in/Home/routewiseinfo](https://mtcbus.tn.gov.in/Home/routewiseinfo>)

> **MTC bus timing schedule — **[<https://mtcbus.tn.gov.in/Home/bustypetimingsearch](https://mtcbus.tn.gov.in/Home/bustypetimingsearch>)

> **MTC bus type-wise timing search — **[<https://mtcbus.tn.gov.in/Home/bus_timing_search](https://mtcbus.tn.gov.in/Home/bus_timing_search>)

> **MTC commuter / live tracking portal — **[<https://commuter.mtcbusits.in/](https://commuter.mtcbusits.in/>)

> **CMRL official website — **[<https://chennaimetrorail.org/](https://chennaimetrorail.org/>)

> **CMRL Phase I and II map PDF (map dated 18 Dec 2024) — **[<https://chennaimetrorail.org/wp-content/uploads/2025/02/Phase-I-II-Map-Updated-Map-18.12.2024-PHASE-1-2-MAP.pdf](https://chennaimetrorail.org/wp-content/uploads/2025/02/Phase-I-II-Map-Updated-Map-18.12.2024-PHASE-1-2-MAP.pdf>)

> **CMRL official fare table — **[<https://chennaimetrorail.org/cmrl-fare-table/](https://chennaimetrorail.org/cmrl-fare-table/>)

> **Southern Railway — **[<https://sr.indianrailways.gov.in/](https://sr.indianrailways.gov.in/>)

> **National Train Enquiry System — **[<https://enquiry.indianrail.gov.in/ntes/](https://enquiry.indianrail.gov.in/ntes/>)

> **OpenCity Chennai mobility catalogue — **[<https://data.opencity.in/dataset/?groups=chennai&tags=Mobility](https://data.opencity.in/dataset/?groups=chennai&tags=Mobility>)

> **OpenCity Chennai MTC Performance CSV — **[<https://data.opencity.in/dataset/c7bf200b-03e1-403f-99be-487d3c4a294a/resource/0c917fe2-aaef-4873-95f3-4da9e50620f3/download/0c917fe2-aaef-4873-95f3-4da9e50620f3.csv](https://data.opencity.in/dataset/c7bf200b-03e1-403f-99be-487d3c4a294a/resource/0c917fe2-aaef-4873-95f3-4da9e50620f3/download/0c917fe2-aaef-4873-95f3-4da9e50620f3.csv>)

> **OpenCity Chennai Metro Monthly Usage CSV — **[<https://data.opencity.in/dataset/118434fe-dd69-4dd3-a6a8-4c577326cc34/resource/c63ef5a0-e7d2-49b3-9c88-5ca5ce309fcf/download/cmrl-metro-ridership-2023-26.csv](https://data.opencity.in/dataset/118434fe-dd69-4dd3-a6a8-4c577326cc34/resource/c63ef5a0-e7d2-49b3-9c88-5ca5ce309fcf/download/cmrl-metro-ridership-2023-26.csv>)

> **OpenCity Chennai Road Crashes — **[<https://data.opencity.in/dataset/chennai-road-crashes-data](https://data.opencity.in/dataset/chennai-road-crashes-data>)

> **OpenCity Chennai Road Centerline — **[<https://data.opencity.in/dataset/chennai-road-centerline-map](https://data.opencity.in/dataset/chennai-road-centerline-map>)

### Basemap, OSM and map renderer

> **MapLibre GL JS docs — **[<https://maplibre.org/maplibre-gl-js/docs/](https://maplibre.org/maplibre-gl-js/docs/>)

> **MapLibre style specification — **[<https://maplibre.org/maplibre-style-spec/](https://maplibre.org/maplibre-style-spec/>)

> **MapLibre sources / GeoJSON — **[<https://maplibre.org/maplibre-style-spec/sources/](https://maplibre.org/maplibre-style-spec/sources/>)

> **MapTiler Streets — **[<https://www.maptiler.com/maps/streets/](https://www.maptiler.com/maps/streets/>)

> **MapTiler + MapLibre guide — **[<https://docs.maptiler.com/maplibre/](https://docs.maptiler.com/maplibre/>)

> **MapTiler API reference — **[<https://docs.maptiler.com/cloud/api/reference/](https://docs.maptiler.com/cloud/api/reference/>)

> **MapTiler API key guide — **[<https://docs.maptiler.com/guides/developer/credentials/api-key/](https://docs.maptiler.com/guides/developer/credentials/api-key/>)

> **OpenStreetMap — **[<https://www.openstreetmap.org/](https://www.openstreetmap.org/>)

> **OpenStreetMap copyright/licence — **[<https://www.openstreetmap.org/copyright](https://www.openstreetmap.org/copyright>)

> **OpenStreetMap tile usage policy — **[<https://operations.osmfoundation.org/policies/tiles/](https://operations.osmfoundation.org/policies/tiles/>)

> **Geofabrik India PBF extract — **[<https://download.geofabrik.de/asia/india.html](https://download.geofabrik.de/asia/india.html>)

> **Overpass API wiki — **[<https://wiki.openstreetmap.org/wiki/Overpass_API](https://wiki.openstreetmap.org/wiki/Overpass_API>)

> **OSMnx getting started — **[<https://osmnx.readthedocs.io/en/stable/getting-started.html](https://osmnx.readthedocs.io/en/stable/getting-started.html>)

### Realtime traffic providers

> **TomTom Orbis Traffic API — **[<https://docs.tomtom.com/traffic-api/documentation/tomtom-orbis-maps/v2/](https://docs.tomtom.com/traffic-api/documentation/tomtom-orbis-maps/v2/>)

> **TomTom Orbis Traffic market coverage — **[<https://docs.tomtom.com/traffic-api/documentation/tomtom-orbis-maps/v2/product-information/market-coverage](https://docs.tomtom.com/traffic-api/documentation/tomtom-orbis-maps/v2/product-information/market-coverage>)

> **Google Maps Traffic / Transit layers — **[<https://developers.google.com/maps/documentation/javascript/trafficlayer](https://developers.google.com/maps/documentation/javascript/trafficlayer>)

> **Google Maps traffic-aware routes — **[<https://developers.google.com/maps/documentation/javascript/routes/traffic-options](https://developers.google.com/maps/documentation/javascript/routes/traffic-options>)

> **Mapbox Traffic Data — **[<https://docs.mapbox.com/data/traffic/](https://docs.mapbox.com/data/traffic/>)

> **Mapbox Traffic v1 tileset — **[<https://docs.mapbox.com/data/tilesets/reference/mapbox-traffic-v1/](https://docs.mapbox.com/data/tilesets/reference/mapbox-traffic-v1/>)

### Transit data standards and routing

> **GTFS Schedule overview — **[<https://gtfs.org/documentation/overview/](https://gtfs.org/documentation/overview/>)

> **GTFS Schedule reference — **[<https://gtfs.org/documentation/schedule/reference/](https://gtfs.org/documentation/schedule/reference/>)

> **GTFS Realtime reference — **[<https://gtfs.org/documentation/realtime/](https://gtfs.org/documentation/realtime/>)

> **OpenTripPlanner data sources — **[<https://docs.opentripplanner.org/en/latest/Data-Sources/](https://docs.opentripplanner.org/en/latest/Data-Sources/>)

> **OpenTripPlanner API docs — **[<https://docs.opentripplanner.org/en/latest/Apis/](https://docs.opentripplanner.org/en/latest/Apis/>)

## 17. Recommended attachment package for Screen 4

| **Give to Stitch (visual/design references)** | **Give to Antigravity (engineering/data inputs)** |
| --- | --- |
| **Approved four-screen reference collage** | **Original Theme7(1).zip** |
| **Kathipara photographs (welcome scene only)** | **GCC Ward_Boundary GeoJSON + metadata** |
| **Screenshot: GCC ward GIS** | **CUMTA GTFS ZIPs + validation reports** |
| **Screenshot: Tamil Nadu GIS CUMTA viewer** | **MTC/CMRL/Southern Railway current operator references** |
| **Screenshot: CUMTA Transit Data network viewer** | **Theme7 bus-stop workbook and all shapefile sidecars** |
| **Screenshot: MapTiler Streets at Chennai city level** | **Clipped OSM PBF/GeoPackage + source timestamp/licence** |
| **Screenshot: MapTiler Streets around Kathipara/Guindy** | **MapTiler key in local environment file** |
| **Screenshot: MTC live-tracking experience** | **TomTom traffic credentials only after local coverage test** |
| **This resource compendium + Screen 4 prompt** | **MTC/CUMTA written permission and API specification if live bus integration is granted** |

> **Do not upload to Stitch**<br>Do not upload raw full-size India OSM extracts, every shapefile sidecar, API secrets or unverified data exports. Stitch needs visual references, source names, layer requirements and explicit fallback states. The engineering team needs the actual geospatial/GTFS files and credentials in protected local configuration.

## 18. Recommended final decisions for MOVEFAIR

| **Decision** | **Recommendation** | **Why** |
| --- | --- | --- |
| **Renderer** | **MapLibre GL JS** | **Open-source WebGL renderer; supports vector styles and custom GeoJSON layers.** |
| **Basemap** | **MapTiler Streets v4** | **Fastest credible start with restricted API key; actual Chennai streets/labels.** |
| **GCC ward layer** | **Official GCC Layer 4** | **Authoritative ward geometry for GCC-specific map analysis.** |
| **Wider CMA boundary** | **TNGIS CUMTA / CMA boundary data** | **Correctly communicates wider study extent without overextending GCC wards.** |
| **Transit** | **CUMTA GTFS, checked against operators** | **One normalised source for scheduled MTC/Metro/suburban data, subject to QA.** |
| **Walking** | **OSM + OSMnx** | **Supports network walking rather than straight-line distance; verify local completeness.** |
| **Live road traffic** | **Trial TomTom Orbis first** | **India is listed for Traffic Flow and Incidents; actual corridor coverage still must be tested.** |
| **Live MTC bus positions** | **MTC-approved feed only** | **Official tracking interface exists; public developer API/redistribution not confirmed.** |
| **Initial validation geography** | **Kathipara, Guindy and a few corridors/wards** | **Small enough to spot-check accurately before expanding citywide.** |

## 19. Research and verification notes

Research date: 5 November 2026. The compendium includes official agency endpoints, public data portals, operator pages, technical specifications and provider documentation that were discovered or checked during the research process. Provider products, APIs, prices, access policies and feed contents can change. Recheck live pages, licence terms, plan limits, feed date ranges and local map/traffic coverage before implementing.

The CUMTA portal-reported counts are reproduced as portal claims, not independently verified data totals. TomTom India coverage is based on its official market-coverage table; it is not a guarantee of coverage on each road in Chennai. MTC live tracking is an official user-facing capability; no public developer API contract was confirmed. MapTiler/MapLibre, Google TrafficLayer and Mapbox Traffic are alternative provider/technology choices and should not be layered together without an explicit architecture decision.

> **One-line implementation north star**<br>A geographically accurate Chennai basemap, GCC ward polygons, validated CUMTA/operator transit layers, OSM-based walking access, and separately permissioned live traffic/bus feeds — all with source labels, timestamps, attribution and honest unavailable states.
