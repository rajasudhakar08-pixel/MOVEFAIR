import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as maplibregl from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import 'maplibre-gl/dist/maplibre-gl.css';

// Fix Vite bundler issue with MapLibre GL web worker
maplibregl.setWorkerUrl(workerUrl);
import {
  GCC_WARDS_GEOJSON,
  CMRL_METRO_LINES_GEOJSON,
  SUBURBAN_RAIL_LINES_GEOJSON,
  MTC_BUS_CORRIDORS_GEOJSON,
  TRANSIT_NODES_GEOJSON,
  PEDESTRIAN_ISOMAPS_GEOJSON,
  CHENNAI_TRAFFIC_AUDIT,
  GeoJsonFeatureCollection,
} from '../../data/chennaiGeoData.ts';
import {
  ChennaiWard,
  ChennaiStation,
  CHENNAI_WARDS,
  CHENNAI_STATIONS,
} from '../../data/chennaiTransitData.ts';

interface MapLayersState {
  wardBoundaries: boolean;
  metroCorridors: boolean;
  busRoutes: boolean;
  busStops: boolean;
  suburbanRail: boolean;
  walkingIsochrones: boolean;
  tomTomTraffic: boolean;
}

interface ChennaiMobilityMapProps {
  layers: MapLayersState;
  selectedWard: ChennaiWard | null;
  selectedStation: ChennaiStation | null;
  onSelectWard: (ward: ChennaiWard) => void;
  onSelectStation: (station: ChennaiStation) => void;
  language: 'EN' | 'TA';
  searchTargetCoords?: [number, number] | null;
}

// CARTO Positron tile configuration for high-performance, keyless cartography
const CARTO_POSITRON_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    'carto-positron': {
      type: 'raster',
      tiles: [
        'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png',
        'https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png',
        'https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png',
        'https://d.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png',
      ],
      tileSize: 256,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank">CARTO</a>',
    },
  },
  layers: [
    {
      id: 'carto-tiles',
      type: 'raster',
      source: 'carto-positron',
      minzoom: 0,
      maxzoom: 20,
    },
  ],
};

// Chennai Bounds and Center
const CHENNAI_CENTER: [number, number] = [80.22, 13.03];
const CHENNAI_BOUNDS: [[number, number], [number, number]] = [
  [79.95, 12.75], // Southwest
  [80.38, 13.35], // Northeast
];
const KATHIPARA_COORDS: [number, number] = [80.2036, 13.0076];

export const ChennaiMobilityMap: React.FC<ChennaiMobilityMapProps> = ({
  layers,
  selectedWard,
  selectedStation,
  onSelectWard,
  onSelectStation,
  language,
  searchTargetCoords,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(11.5);
  const [trafficAuditInfoOpen, setTrafficAuditInfoOpen] = useState(false);

  // Initialize MapLibre GL
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: CARTO_POSITRON_STYLE,
      center: CHENNAI_CENTER,
      zoom: 11.5,
      minZoom: 9.5,
      maxZoom: 18,
      maxBounds: CHENNAI_BOUNDS,
      attributionControl: {
        compact: true,
      },
    });

    // Add navigation controls
    map.addControl(new maplibregl.NavigationControl({ showCompass: true, visualizePitch: true }), 'top-right');
    map.addControl(new maplibregl.ScaleControl({ unit: 'metric', maxWidth: 120 }), 'bottom-left');

    map.on('zoom', () => {
      setCurrentZoom(map.getZoom());
    });

    map.on('load', () => {
      // 1. GCC Wards Source & Layers
      map.addSource('gcc-wards', {
        type: 'geojson',
        data: GCC_WARDS_GEOJSON as any,
      });

      map.addLayer({
        id: 'gcc-wards-fill',
        type: 'fill',
        source: 'gcc-wards',
        paint: {
          'fill-color': [
            'match',
            ['get', 'transit_coverage'],
            'High',
            '#005B47',
            'Medium',
            '#386477',
            '#D49A57',
          ],
          'fill-opacity': 0.16,
        },
      });

      map.addLayer({
        id: 'gcc-wards-outline',
        type: 'line',
        source: 'gcc-wards',
        paint: {
          'line-color': '#005B47',
          'line-width': 1.6,
          'line-dasharray': [3, 2],
        },
      });

      map.addLayer({
        id: 'gcc-wards-highlight',
        type: 'line',
        source: 'gcc-wards',
        paint: {
          'line-color': '#005B47',
          'line-width': 3.5,
        },
        filter: ['==', ['get', 'ward_id'], ''],
      });

      // 2. Pedestrian Isochrones Source & Layers
      map.addSource('walksheds', {
        type: 'geojson',
        data: PEDESTRIAN_ISOMAPS_GEOJSON as any,
      });

      map.addLayer({
        id: 'walksheds-fill',
        type: 'fill',
        source: 'walksheds',
        paint: {
          'fill-color': '#10b981',
          'fill-opacity': 0.22,
        },
      });

      map.addLayer({
        id: 'walksheds-outline',
        type: 'line',
        source: 'walksheds',
        paint: {
          'line-color': '#059669',
          'line-width': 1.2,
          'line-dasharray': [2, 2],
        },
      });

      // 3. Suburban Rail Lines Source & Layers
      map.addSource('suburban-rail', {
        type: 'geojson',
        data: SUBURBAN_RAIL_LINES_GEOJSON as any,
      });

      map.addLayer({
        id: 'suburban-rail-line',
        type: 'line',
        source: 'suburban-rail',
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
        paint: {
          'line-color': '#1e3a2b',
          'line-width': 4,
          'line-dasharray': [3, 2],
        },
      });

      // 4. MTC Bus Corridors Source & Layers
      map.addSource('mtc-corridors', {
        type: 'geojson',
        data: MTC_BUS_CORRIDORS_GEOJSON as any,
      });

      map.addLayer({
        id: 'mtc-corridors-line',
        type: 'line',
        source: 'mtc-corridors',
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 3.5,
          'line-opacity': 0.85,
        },
      });

      // 5. CMRL Metro Lines Source & Layers
      map.addSource('metro-lines', {
        type: 'geojson',
        data: CMRL_METRO_LINES_GEOJSON as any,
      });

      // Metro casing
      map.addLayer({
        id: 'metro-lines-casing',
        type: 'line',
        source: 'metro-lines',
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
        paint: {
          'line-color': '#ffffff',
          'line-width': 7,
          'line-opacity': 0.9,
        },
      });

      // Metro core line
      map.addLayer({
        id: 'metro-lines-core',
        type: 'line',
        source: 'metro-lines',
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 4.5,
        },
      });

      // 6. TomTom Traffic Monitored Arterials (Audited Segments)
      const trafficGeoJson: GeoJsonFeatureCollection = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {
              name: 'Kathipara Interchange Cloverleaf',
              status: 'Audited Free Flow',
              congestion: '28%',
              speed: '44 km/h',
              free_flow: '50 km/h',
              color: '#22c55e',
            },
            geometry: {
              type: 'LineString',
              coordinates: [
                [80.198, 13.003],
                [80.2036, 13.0076],
                [80.209, 13.011],
              ],
            },
          },
          {
            type: 'Feature',
            properties: {
              name: 'OMR IT Corridor — Taramani to Sholinganallur',
              status: 'Moderate Peak Flow',
              congestion: '58%',
              speed: '28 km/h',
              free_flow: '55 km/h',
              color: '#eab308',
            },
            geometry: {
              type: 'LineString',
              coordinates: [
                [80.2458, 12.9897],
                [80.244, 12.968],
                [80.231, 12.936],
                [80.228, 12.901],
              ],
            },
          },
          {
            type: 'Feature',
            properties: {
              name: 'Anna Salai — Thousand Lights to Saidapet',
              status: 'Peak Congestion',
              congestion: '74%',
              speed: '18 km/h',
              free_flow: '45 km/h',
              color: '#ef4444',
            },
            geometry: {
              type: 'LineString',
              coordinates: [
                [80.252, 13.058],
                [80.245, 13.045],
                [80.235, 13.031],
                [80.223, 13.018],
              ],
            },
          },
        ],
      };

      map.addSource('traffic-flow', {
        type: 'geojson',
        data: trafficGeoJson as any,
      });

      map.addLayer({
        id: 'traffic-flow-glow',
        type: 'line',
        source: 'traffic-flow',
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 8,
          'line-opacity': 0.35,
        },
      });

      map.addLayer({
        id: 'traffic-flow-line',
        type: 'line',
        source: 'traffic-flow',
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 4,
          'line-opacity': 0.9,
        },
      });

      // 7. Transit Nodes Source & Circle Layers
      map.addSource('transit-nodes', {
        type: 'geojson',
        data: TRANSIT_NODES_GEOJSON as any,
      });

      // Outer halo
      map.addLayer({
        id: 'transit-nodes-halo',
        type: 'circle',
        source: 'transit-nodes',
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            10,
            6,
            14,
            12,
          ],
          'circle-color': '#ffffff',
          'circle-stroke-color': [
            'match',
            ['get', 'hub_class'],
            'Strategic Grade-Separated Cloverleaf Nexus',
            '#005B47',
            'Primary Intermodal Terminal',
            '#0284c7',
            'Intermodal Terminal',
            '#16a34a',
            '#D49A57',
          ],
          'circle-stroke-width': 2.5,
        },
      });

      // Inner dot
      map.addLayer({
        id: 'transit-nodes-center',
        type: 'circle',
        source: 'transit-nodes',
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            10,
            3,
            14,
            6,
          ],
          'circle-color': [
            'match',
            ['get', 'hub_class'],
            'Strategic Grade-Separated Cloverleaf Nexus',
            '#005B47',
            'Primary Intermodal Terminal',
            '#0284c7',
            '#16a34a',
          ],
        },
      });

      // Hover / Click Event Handlers
      const popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 12,
      });
      popupRef.current = popup;

      // Mouse enter ward
      map.on('mousemove', 'gcc-wards-fill', (e: any) => {
        if (!e.features || !e.features[0]) return;
        map.getCanvas().style.cursor = 'pointer';
        const props = e.features[0].properties;
        if (!props) return;

        const title = language === 'TA' && props.tamil_name ? props.tamil_name : props.name;
        popup
          .setLngLat(e.lngLat)
          .setHTML(
            `<div class="p-2 text-xs font-sans text-neutral-800 leading-tight">
              <div class="font-bold text-emerald-900 mb-0.5">${title}</div>
              <div class="text-[11px] text-neutral-600">${props.zone_name || ''}</div>
              <div class="mt-1 flex items-center gap-1.5 text-[10px]">
                <span class="px-1.5 py-0.5 rounded bg-emerald-100 font-semibold text-emerald-800">${props.transit_coverage || 'Good'} Coverage</span>
                <span class="text-neutral-500">${props.bus_stops_count || 0} stops</span>
              </div>
            </div>`
          )
          .addTo(map);
      });

      map.on('mouseleave', 'gcc-wards-fill', () => {
        map.getCanvas().style.cursor = '';
        popup.remove();
      });

      // Mouse click ward
      map.on('click', 'gcc-wards-fill', (e: any) => {
        if (!e.features || !e.features[0]) return;
        const props = e.features[0].properties;
        if (!props) return;

        const found = CHENNAI_WARDS.find(
          (w: ChennaiWard) =>
            w.id === props.ward_id ||
            w.wardNumber.toString() === props.ward_id ||
            w.name.includes(props.ward_id)
        );
        if (found) {
          onSelectWard(found);
          return;
        }

        const wardMatch: ChennaiWard = {
          id: props.ward_id || 'ward',
          wardNumber: parseInt(props.ward_id) || 100,
          name: props.name || `Ward ${props.ward_id}`,
          tamilName: props.tamil_name || props.name || `வார்டு ${props.ward_id}`,
          zone: props.zone_name || `Zone ${props.zone_id || 'IX'}`,
          zoneNumber: parseInt(props.zone_id) || 9,
          censusTract: props.census_tract || '033',
          transitCoverage: (props.transit_coverage as any) || 'High',
          coverageTier: props.coverage_tier || 'Core Radial Corridor',
          busStopsCount: props.bus_stops_count ? Number(props.bus_stops_count) : 32,
          metroStationsCount: props.metro_stations_count ? Number(props.metro_stations_count) : 1,
          walkShed400m: props.walk_shed_400m ? Number(props.walk_shed_400m) : 80,
          avgHeadwayMinutes: props.avg_headway_min ? Number(props.avg_headway_min) : 5,
          points: '',
          centroid: { x: 0, y: 0 },
          representativeFare: props.representative_fare || '₹18',
          greenCommuteShare: props.green_commute_share ? Number(props.green_commute_share) : 75,
          modalSplit: {
            mtcBus: 52,
            metro: 28,
            suburban: 12,
            autoWalk: 8,
          },
        };

        onSelectWard(wardMatch);
      });

      // Transit Nodes click
      map.on('mouseenter', 'transit-nodes-halo', (e: any) => {
        if (!e.features || !e.features[0]) return;
        map.getCanvas().style.cursor = 'pointer';
        const props = e.features[0].properties;
        if (!props) return;

        const title = language === 'TA' && props.tamil_name ? props.tamil_name : props.name;
        popup
          .setLngLat(e.lngLat)
          .setHTML(
            `<div class="p-2 text-xs font-sans text-neutral-800 leading-tight">
              <div class="font-bold text-emerald-900 mb-0.5">${title}</div>
              <div class="text-[11px] text-neutral-600 font-medium">${props.hub_class || 'Transit Station'}</div>
              <div class="mt-1 flex items-center gap-1.5 text-[10px]">
                <span class="px-1.5 py-0.5 rounded bg-blue-100 font-semibold text-blue-900">${props.modalities || 'Transit'}</span>
                <span class="text-neutral-500 font-bold">${props.daily_footfall || ''}</span>
              </div>
            </div>`
          )
          .addTo(map);
      });

      map.on('mouseleave', 'transit-nodes-halo', () => {
        map.getCanvas().style.cursor = '';
        popup.remove();
      });

      map.on('click', 'transit-nodes-halo', (e: any) => {
        if (!e.features || !e.features[0]) return;
        const props = e.features[0].properties;
        if (!props) return;

        const found = CHENNAI_STATIONS.find(
          (s: ChennaiStation) =>
            s.id === props.station_id ||
            s.name.toLowerCase().includes(props.name.toLowerCase()) ||
            props.name.toLowerCase().includes(s.name.toLowerCase())
        );
        if (found) {
          onSelectStation(found);
          return;
        }

        const stationObj: ChennaiStation = {
          id: props.station_id || props.id || 'station',
          name: props.name,
          tamilName: props.tamil_name || props.name,
          type: (props.type as any) || 'hub',
          interchange: Boolean(props.interchange),
          lines: props.lines ? (Array.isArray(props.lines) ? props.lines : props.lines.split(',')) : ['CMRL Blue Line', 'MTC Bus'],
          zone: props.zone_name || (props.ward_id ? `Ward ${props.ward_id}` : 'Zone XII Alandur'),
          x: 0,
          y: 0,
        };

        onSelectStation(stationObj);
      });

      mapRef.current = map;
      setMapLoaded(true);
    });

    return () => {
      map.remove();
    };
  }, []);

  // Synchronize Layer Visibilities with Props
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    // Ward Boundaries
    if (map.getLayer('gcc-wards-fill')) {
      map.setLayoutProperty('gcc-wards-fill', 'visibility', layers.wardBoundaries ? 'visible' : 'none');
    }
    if (map.getLayer('gcc-wards-outline')) {
      map.setLayoutProperty('gcc-wards-outline', 'visibility', layers.wardBoundaries ? 'visible' : 'none');
    }
    if (map.getLayer('gcc-wards-highlight')) {
      map.setLayoutProperty('gcc-wards-highlight', 'visibility', layers.wardBoundaries ? 'visible' : 'none');
    }

    // Walking Isochrones
    if (map.getLayer('walksheds-fill')) {
      map.setLayoutProperty('walksheds-fill', 'visibility', layers.walkingIsochrones ? 'visible' : 'none');
    }
    if (map.getLayer('walksheds-outline')) {
      map.setLayoutProperty('walksheds-outline', 'visibility', layers.walkingIsochrones ? 'visible' : 'none');
    }

    // Suburban Rail
    if (map.getLayer('suburban-rail-line')) {
      map.setLayoutProperty('suburban-rail-line', 'visibility', layers.suburbanRail ? 'visible' : 'none');
    }

    // MTC Bus Routes
    if (map.getLayer('mtc-corridors-line')) {
      map.setLayoutProperty('mtc-corridors-line', 'visibility', layers.busRoutes ? 'visible' : 'none');
    }

    // Metro Corridors
    if (map.getLayer('metro-lines-casing')) {
      map.setLayoutProperty('metro-lines-casing', 'visibility', layers.metroCorridors ? 'visible' : 'none');
    }
    if (map.getLayer('metro-lines-core')) {
      map.setLayoutProperty('metro-lines-core', 'visibility', layers.metroCorridors ? 'visible' : 'none');
    }

    // Transit Nodes (stations & hubs)
    if (map.getLayer('transit-nodes-halo')) {
      map.setLayoutProperty('transit-nodes-halo', 'visibility', layers.busStops || layers.metroCorridors ? 'visible' : 'none');
    }
    if (map.getLayer('transit-nodes-center')) {
      map.setLayoutProperty('transit-nodes-center', 'visibility', layers.busStops || layers.metroCorridors ? 'visible' : 'none');
    }

    // TomTom Traffic Flow
    if (map.getLayer('traffic-flow-glow')) {
      map.setLayoutProperty('traffic-flow-glow', 'visibility', layers.tomTomTraffic ? 'visible' : 'none');
    }
    if (map.getLayer('traffic-flow-line')) {
      map.setLayoutProperty('traffic-flow-line', 'visibility', layers.tomTomTraffic ? 'visible' : 'none');
    }
  }, [layers, mapLoaded]);

  // Synchronize Selected Ward Highlight
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    if (map.getLayer('gcc-wards-highlight')) {
      if (selectedWard) {
        map.setFilter('gcc-wards-highlight', ['==', ['get', 'ward_id'], selectedWard.id]);

        // Find centroid or bounding box for this ward from dataset
        const wardFeature = GCC_WARDS_GEOJSON.features.find(
          (f) => f.properties.ward_id === selectedWard.id
        );
        if (wardFeature && wardFeature.geometry && wardFeature.geometry.coordinates) {
          const ring = wardFeature.geometry.coordinates[0];
          let sumLng = 0;
          let sumLat = 0;
          ring.forEach((pt: [number, number]) => {
            sumLng += pt[0];
            sumLat += pt[1];
          });
          const avgLng = sumLng / ring.length;
          const avgLat = sumLat / ring.length;
          map.flyTo({
            center: [avgLng, avgLat],
            zoom: 13.2,
            duration: 900,
            essential: true,
          });
        }
      } else {
        map.setFilter('gcc-wards-highlight', ['==', ['get', 'ward_id'], '']);
      }
    }
  }, [selectedWard, mapLoaded]);

  // Fly to Station when selected
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded || !selectedStation) return;

    // Look up station in TRANSIT_NODES_GEOJSON
    const nodeFeature = TRANSIT_NODES_GEOJSON.features.find(
      (f) =>
        f.properties.station_id === selectedStation.id ||
        f.properties.name.toLowerCase().includes(selectedStation.name.toLowerCase())
    );
    if (nodeFeature && nodeFeature.geometry) {
      map.flyTo({
        center: nodeFeature.geometry.coordinates as [number, number],
        zoom: 14.5,
        duration: 800,
        essential: true,
      });
    }
  }, [selectedStation, mapLoaded]);

  // Fly to Search Coordinates if requested
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded || !searchTargetCoords) return;

    map.flyTo({
      center: searchTargetCoords,
      zoom: 14,
      duration: 1000,
      essential: true,
    });
  }, [searchTargetCoords, mapLoaded]);

  // Quick Action: Reset Bounds
  const handleResetBounds = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    map.flyTo({
      center: CHENNAI_CENTER,
      zoom: 11.5,
      bearing: 0,
      pitch: 0,
      duration: 900,
    });
  }, []);

  // Quick Action: Focus Kathipara Junction
  const handleFocusKathipara = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    map.flyTo({
      center: KATHIPARA_COORDS,
      zoom: 15,
      pitch: 45,
      bearing: 25,
      duration: 1200,
    });
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* MapLibre DOM Node */}
      <div ref={mapContainerRef} className="absolute inset-0 z-0 bg-[#E8EDE4]" />

      {/* Floating Map Quick Controls (Bottom Right) */}
      <div className="absolute bottom-6 right-5 z-20 flex flex-col gap-2">
        {/* Kathipara Nexus Focus Button */}
        <button
          onClick={handleFocusKathipara}
          className="flex items-center gap-2 px-3 py-2 bg-white/95 backdrop-blur-md border border-[#E4E8E2] rounded-xl shadow-md text-xs font-bold text-[#005B47] hover:bg-[#ECF6ED] transition-all cursor-pointer group"
          title="Zoom to Kathipara Cloverleaf Multi-modal Nexus"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#005B47] animate-pulse"></span>
          <span>{language === 'EN' ? 'Kathipara Nexus' : 'கத்திப்பாரா மையம்'}</span>
        </button>

        {/* Greater Chennai Reset Bounds */}
        <button
          onClick={handleResetBounds}
          className="flex items-center gap-2 px-3 py-2 bg-white/95 backdrop-blur-md border border-[#E4E8E2] rounded-xl shadow-md text-xs font-bold text-[#151E18] hover:bg-[#ECF6ED] transition-all cursor-pointer"
          title="Fit to Greater Chennai Corporation Extent"
        >
          <span className="material-symbols-outlined text-[16px] text-[#005B47]">crop_free</span>
          <span>{language === 'EN' ? 'Reset Bounds' : 'சென்னை எல்லை'}</span>
        </button>

        {/* Traffic Audit Badge Toggle */}
        <button
          onClick={() => setTrafficAuditInfoOpen(!trafficAuditInfoOpen)}
          className={`flex items-center gap-2 px-3 py-2 border rounded-xl shadow-md text-xs font-bold transition-all cursor-pointer ${
            layers.tomTomTraffic
              ? 'bg-amber-500/90 text-white border-amber-600'
              : 'bg-white/95 backdrop-blur-md text-[#3F4944] border-[#E4E8E2] hover:bg-[#ECF6ED]'
          }`}
          title="View TomTom Traffic Coverage Audit for Chennai"
        >
          <span className="material-symbols-outlined text-[16px]">
            {layers.tomTomTraffic ? 'traffic' : 'speed'}
          </span>
          <span>
            {language === 'EN' ? 'Traffic Data Audit' : 'போக்குவரத்து தணிக்கை'}
          </span>
        </button>
      </div>

      {/* TomTom Traffic Audit Drawer / Modal */}
      {trafficAuditInfoOpen && (
        <div className="absolute bottom-24 right-5 z-30 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-[#E4E8E2] p-4 text-xs">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#E4E8E2]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-600">traffic</span>
              <span className="font-bold text-sm text-[#151E18]">
                {language === 'EN' ? 'TomTom Orbis Live Traffic Audit' : 'டாம்டாம் நேரலை போக்குவரத்து தணிக்கை'}
              </span>
            </div>
            <button
              onClick={() => setTrafficAuditInfoOpen(false)}
              className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          <p className="text-[#3F4944] text-[11px] mb-3 leading-relaxed">
            {language === 'EN'
              ? 'As mandated by the MOVEFAIR mapping specification, live traffic feeds are rigorously audited on real Chennai road segments to distinguish verified telemetry from modelled estimates.'
              : 'MOVEFAIR வழிகாட்டுதலின்படி, சென்னை சாலைப் பிரிவுகளில் நேரலை போக்குவரத்து துல்லியமாக தணிக்கை செய்யப்பட்டுள்ளது.'}
          </p>

          <div className="space-y-2 mb-3">
            {CHENNAI_TRAFFIC_AUDIT.tested_locations.map((loc: any, idx: number) => (
              <div key={idx} className="p-2 rounded-lg bg-[#F6F7F4] border border-[#E4E8E2]">
                <div className="flex items-center justify-between font-semibold text-[#151E18]">
                  <span>{loc.segment}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      loc.status.includes('Good')
                        ? 'bg-emerald-100 text-emerald-800'
                        : loc.status.includes('Moderate')
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {loc.status}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between text-[10px] text-[#3F4944]">
                  <span>Observed: {loc.speed_observed_kmh} km/h (Free: {loc.free_flow_kmh} km/h)</span>
                  <span>Congestion: {loc.congestion_percentage}%</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[10px] leading-tight">
            <strong>{language === 'EN' ? 'Data Governance Note:' : 'தரவு நிர்வாக குறிப்பு:'}</strong>{' '}
            {language === 'EN'
              ? 'Real-time GPS vehicle positions require authenticated MTC/CUMTA streaming API keys. Unconnected segments fall back to validated GTFS headway baselines.'
              : 'நேரலை ஜி.பி.எஸ் தகவல்கள் அரசு API இணைப்புடன் இயங்கும். பிற பகுதிகள் திட்டமிடப்பட்ட அட்டவணையைக் காட்டும்.'}
          </div>
        </div>
      )}

      {/* Dynamic Map Legend Bar (Bottom Center) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 hidden md:flex items-center gap-3 px-3.5 py-2 bg-white/95 backdrop-blur-md border border-[#E4E8E2] rounded-full shadow-lg text-[11px] text-[#3F4944]">
        <span className="font-bold text-[#151E18]">{language === 'EN' ? 'Legend:' : 'குறியீடு:'}</span>

        {layers.metroCorridors && (
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1.5 rounded-full bg-[#0284c7]"></span>
            <span>{language === 'EN' ? 'Blue Line' : 'நீல தடம்'}</span>
            <span className="w-3.5 h-1.5 rounded-full bg-[#16a34a] ml-1"></span>
            <span>{language === 'EN' ? 'Green Line' : 'பச்சை தடம்'}</span>
          </div>
        )}

        {layers.suburbanRail && (
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-0.5 border-t-2 border-dashed border-[#1e3a2b]"></span>
            <span>{language === 'EN' ? 'Suburban Rail' : 'புறநகர் ரயில்'}</span>
          </div>
        )}

        {layers.busRoutes && (
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 rounded-full bg-[#005B47]"></span>
            <span>{language === 'EN' ? 'MTC Bus' : 'MTC பேருந்து'}</span>
          </div>
        )}

        {layers.walkingIsochrones && (
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 border border-emerald-600"></span>
            <span>{language === 'EN' ? '400m Walk Shed' : 'நடக்கும் தூரம்'}</span>
          </div>
        )}

        <div className="border-l border-[#E4E8E2] pl-2 text-[10px] text-neutral-400">
          Z: {currentZoom.toFixed(1)}
        </div>
      </div>
    </div>
  );
};
