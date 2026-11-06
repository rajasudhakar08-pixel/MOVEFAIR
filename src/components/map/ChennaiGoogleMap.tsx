/// <reference types="@types/google.maps" />
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  APIProvider,
  Map as GoogleMap,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap,
} from '@vis.gl/react-google-maps';
import {
  GCC_WARDS_GEOJSON,
  CMRL_METRO_LINES_GEOJSON,
  SUBURBAN_RAIL_LINES_GEOJSON,
  MTC_BUS_CORRIDORS_GEOJSON,
  TRANSIT_NODES_GEOJSON,
  PEDESTRIAN_ISOMAPS_GEOJSON,
  CHENNAI_TRAFFIC_AUDIT,
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

interface ChennaiGoogleMapProps {
  layers: MapLayersState;
  selectedWard: ChennaiWard | null;
  selectedStation: ChennaiStation | null;
  onSelectWard: (ward: ChennaiWard) => void;
  onSelectStation: (station: ChennaiStation) => void;
  language: 'EN' | 'TA';
  searchTargetCoords?: [number, number] | null;
  onPlanFromLocation?: (name: string) => void;
}

const CHENNAI_CENTER = { lat: 13.03, lng: 80.22 };
const KATHIPARA_COORDS = { lat: 13.0076, lng: 80.2036 };
const CENTRAL_COORDS = { lat: 13.0827, lng: 80.2757 };

/**
 * Inner map controller to manage Google Maps Platform features:
 * Traffic Layer, GeoJSON layers (GCC Wards, CMRL Metro, MTC Bus corridors),
 * camera fly-to animations, and interactive feature selection.
 */
function MapFeatureController({
  layers,
  selectedWard,
  selectedStation,
  onSelectWard,
  language,
  searchTargetCoords,
}: {
  layers: MapLayersState;
  selectedWard: ChennaiWard | null;
  selectedStation: ChennaiStation | null;
  onSelectWard: (ward: ChennaiWard) => void;
  language: 'EN' | 'TA';
  searchTargetCoords?: [number, number] | null;
}) {
  const map = useMap();
  const trafficLayerRef = useRef<google.maps.TrafficLayer | null>(null);
  const dataLayerAddedRef = useRef(false);

  // 1. Google Maps Real-time Traffic Layer
  useEffect(() => {
    if (!map) return;

    if (!trafficLayerRef.current) {
      trafficLayerRef.current = new google.maps.TrafficLayer();
    }

    if (layers.tomTomTraffic) {
      trafficLayerRef.current.setMap(map);
    } else {
      trafficLayerRef.current.setMap(null);
    }

    return () => {
      if (trafficLayerRef.current) {
        trafficLayerRef.current.setMap(null);
      }
    };
  }, [map, layers.tomTomTraffic]);

  // 2. Add GeoJSON layers for GCC Wards and Transit Lines to Google Maps Data layer
  useEffect(() => {
    if (!map || dataLayerAddedRef.current) return;

    try {
      // Add GCC Wards GeoJSON
      map.data.addGeoJson(GCC_WARDS_GEOJSON as any);

      // Add Pedestrian Isochrones
      map.data.addGeoJson(PEDESTRIAN_ISOMAPS_GEOJSON as any);

      // Add CMRL Metro lines
      map.data.addGeoJson(CMRL_METRO_LINES_GEOJSON as any);

      // Add Suburban rail lines
      map.data.addGeoJson(SUBURBAN_RAIL_LINES_GEOJSON as any);

      // Add MTC Bus corridors
      map.data.addGeoJson(MTC_BUS_CORRIDORS_GEOJSON as any);

      // Click on GeoJSON feature
      map.data.addListener('click', (event: google.maps.Data.MouseEvent) => {
        const feature = event.feature;
        const wardId = feature.getProperty('ward_id');

        if (wardId) {
          const found = CHENNAI_WARDS.find(
            (w) => w.id === wardId || w.wardNumber.toString() === wardId
          );
          if (found) {
            onSelectWard(found);
          } else {
            const wardMatch: ChennaiWard = {
              id: String(wardId),
              wardNumber: parseInt(String(wardId), 10) || 100,
              name: String(feature.getProperty('name') || `Ward ${wardId}`),
              tamilName: String(feature.getProperty('tamil_name') || `வார்டு ${wardId}`),
              zone: String(feature.getProperty('zone_name') || 'Zone IX Teynampet'),
              zoneNumber: parseInt(String(feature.getProperty('zone_id')), 10) || 9,
              censusTract: String(feature.getProperty('census_tract') || '033'),
              transitCoverage: (feature.getProperty('transit_coverage') as any) || 'High',
              coverageTier: String(feature.getProperty('coverage_tier') || 'Core Radial Corridor'),
              busStopsCount: Number(feature.getProperty('bus_stops_count')) || 32,
              metroStationsCount: Number(feature.getProperty('metro_stations_count')) || 1,
              walkShed400m: Number(feature.getProperty('walk_shed_400m')) || 80,
              avgHeadwayMinutes: Number(feature.getProperty('avg_headway_min')) || 5,
              points: '',
              centroid: { x: 0, y: 0 },
              representativeFare: String(feature.getProperty('representative_fare') || '₹18'),
              greenCommuteShare: Number(feature.getProperty('green_commute_share')) || 75,
              modalSplit: { mtcBus: 52, metro: 28, suburban: 12, autoWalk: 8 },
            };
            onSelectWard(wardMatch);
          }
        }
      });

      dataLayerAddedRef.current = true;
    } catch (e) {
      console.warn('Error adding GeoJSON layers to Google Map:', e);
    }
  }, [map, onSelectWard]);

  // 3. Dynamic styling of Google Maps Data layer based on toggled layers
  useEffect(() => {
    if (!map || !dataLayerAddedRef.current) return;

    map.data.setStyle((feature: google.maps.Data.Feature): google.maps.Data.StyleOptions => {
      const geomType = feature.getGeometry()?.getType();
      const wardId = feature.getProperty('ward_id') ? String(feature.getProperty('ward_id')) : '';
      const corridorName = String(feature.getProperty('corridor_name') || '');
      const lineName = String(feature.getProperty('line_name') || '');
      const routeNumber = String(feature.getProperty('route_number') || '');
      const isMetro = Boolean(lineName) || corridorName.includes('Metro');
      const isSuburban = corridorName.includes('Suburban');
      const isBus = Boolean(routeNumber) || corridorName.includes('MTC');
      const isWalkshed = Boolean(feature.getProperty('walkshed_id') || feature.getProperty('isochrone_minutes'));

      // 1. GCC Wards Polygons
      if (geomType === 'Polygon' || geomType === 'MultiPolygon') {
        if (isWalkshed) {
          if (!layers.walkingIsochrones) {
            return { visible: false };
          }
          return {
            fillColor: '#10b981',
            fillOpacity: 0.2,
            strokeColor: '#059669',
            strokeWeight: 1.5,
            zIndex: 1,
          };
        }

        // Ward boundary
        if (!layers.wardBoundaries) {
          return { visible: false };
        }

        const isSelected = selectedWard && selectedWard.id === wardId;
        const coverage = String(feature.getProperty('transit_coverage') || 'High');
        const fillColor = coverage === 'High' ? '#005B47' : coverage === 'Medium' ? '#386477' : '#D49A57';

        return {
          fillColor,
          fillOpacity: isSelected ? 0.35 : 0.12,
          strokeColor: isSelected ? '#005B47' : '#005B47',
          strokeWeight: isSelected ? 3.5 : 1.5,
          zIndex: isSelected ? 10 : 2,
        };
      }

      // 2. Transit Lines
      if (geomType === 'LineString' || geomType === 'MultiLineString') {
        if (isMetro) {
          if (!layers.metroCorridors) return { visible: false };
          const color = String(feature.getProperty('color') || '#0284c7');
          return {
            strokeColor: color,
            strokeWeight: 4.5,
            strokeOpacity: 0.9,
            zIndex: 8,
          };
        }

        if (isSuburban) {
          if (!layers.suburbanRail) return { visible: false };
          return {
            strokeColor: '#1e3a2b',
            strokeWeight: 3.5,
            strokeOpacity: 0.85,
            zIndex: 6,
          };
        }

        if (isBus) {
          if (!layers.busRoutes) return { visible: false };
          const color = String(feature.getProperty('color') || '#005B47');
          return {
            strokeColor: color,
            strokeWeight: 3,
            strokeOpacity: 0.8,
            zIndex: 5,
          };
        }
      }

      return { visible: true };
    });
  }, [map, layers, selectedWard]);

  // 4. Fly to selected ward centroid if selected
  useEffect(() => {
    if (!map || !selectedWard) return;

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

      map.panTo({ lat: avgLat, lng: avgLng });
      map.setZoom(14);
    }
  }, [map, selectedWard]);

  // 5. Fly to selected station
  useEffect(() => {
    if (!map || !selectedStation) return;

    const nodeFeature = TRANSIT_NODES_GEOJSON.features.find(
      (f) =>
        f.properties.station_id === selectedStation.id ||
        f.properties.id === selectedStation.id ||
        f.properties.name.toLowerCase().includes(selectedStation.name.toLowerCase())
    );

    if (nodeFeature && nodeFeature.geometry) {
      const coords = nodeFeature.geometry.coordinates;
      map.panTo({ lat: coords[1], lng: coords[0] });
      map.setZoom(15);
    }
  }, [map, selectedStation]);

  // 6. Fly to search coordinates
  useEffect(() => {
    if (!map || !searchTargetCoords) return;

    map.panTo({ lat: searchTargetCoords[1], lng: searchTargetCoords[0] });
    map.setZoom(14.5);
  }, [map, searchTargetCoords]);

  return null;
}

export const ChennaiGoogleMap: React.FC<ChennaiGoogleMapProps> = ({
  layers,
  selectedWard,
  selectedStation,
  onSelectWard,
  onSelectStation,
  language,
  searchTargetCoords,
  onPlanFromLocation,
}) => {
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid' | 'terrain'>('roadmap');
  const [activeStationInfo, setActiveStationInfo] = useState<any | null>(null);
  const [trafficAuditOpen, setTrafficAuditOpen] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(12);

  // Access provisioned API Key from environment
  const apiKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) || '';

  const handleStationClick = useCallback((node: any) => {
    setActiveStationInfo(node);

    const stationObj: ChennaiStation = {
      id: node.properties.station_id || node.properties.id || 'station',
      name: node.properties.name,
      tamilName: node.properties.tamil_name || node.properties.name,
      type: (node.properties.type as any) || 'hub',
      interchange: Boolean(node.properties.interchange),
      lines: node.properties.lines
        ? Array.isArray(node.properties.lines)
          ? node.properties.lines
          : node.properties.lines.split(',')
        : ['CMRL Metro', 'MTC Bus'],
      zone: node.properties.zone_name || (node.properties.ward_id ? `Ward ${node.properties.ward_id}` : 'Zone XII Alandur'),
      x: 0,
      y: 0,
    };
    onSelectStation(stationObj);
  }, [onSelectStation]);

  return (
    <div className="relative w-full h-full min-h-[400px] overflow-hidden select-none">
      <APIProvider
        apiKey={apiKey}
        libraries={['places', 'geometry', 'routes']}
        solutionChannel="GMP_mcp_codeassist_v1_aistudio"
      >
        <GoogleMap
          id="chennai-main-map"
          mapId="DEMO_MAP_ID"
          defaultCenter={CHENNAI_CENTER}
          defaultZoom={12}
          mapTypeId={mapType}
          style={{ width: '100%', height: '100%' }}
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          gestureHandling="greedy"
          fullscreenControl={false}
          streetViewControl={true}
          mapTypeControl={false}
          onZoomChanged={(e) => {
            if (e.detail?.zoom) setCurrentZoom(Math.round(e.detail.zoom * 10) / 10);
          }}
        >
          {/* Synchronized GeoJSON & Traffic Feature Controller */}
          <MapFeatureController
            layers={layers}
            selectedWard={selectedWard}
            selectedStation={selectedStation}
            onSelectWard={onSelectWard}
            language={language}
            searchTargetCoords={searchTargetCoords}
          />

          {/* Transit Hubs & Stations rendered via AdvancedMarker (Zero-Legacy) */}
          {(layers.busStops || layers.metroCorridors) &&
            TRANSIT_NODES_GEOJSON.features.map((feature: any) => {
              const coords = feature.geometry.coordinates;
              const props = feature.properties;
              const isKathipara = props.id === 'kathipara';
              const isMetro = props.type === 'metro';
              const isCentral = props.id === 'central';

              return (
                <AdvancedMarker
                  key={feature.id || props.id}
                  position={{ lat: coords[1], lng: coords[0] }}
                  title={props.name}
                  onClick={() => handleStationClick(feature)}
                >
                  {isKathipara ? (
                    <div className="relative group cursor-pointer animate-bounce">
                      <div className="w-8 h-8 rounded-full bg-[#005B47] text-white flex items-center justify-center shadow-lg ring-4 ring-emerald-300">
                        <span className="material-symbols-outlined text-[18px]">hub</span>
                      </div>
                      <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#005B47] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                        Kathipara Nexus
                      </span>
                    </div>
                  ) : isCentral ? (
                    <div className="relative group cursor-pointer">
                      <div className="w-7 h-7 rounded-full bg-rose-700 text-white flex items-center justify-center shadow-md ring-2 ring-white">
                        <span className="material-symbols-outlined text-[16px]">train</span>
                      </div>
                    </div>
                  ) : isMetro ? (
                    <Pin
                      background="#0284c7"
                      borderColor="#ffffff"
                      glyphColor="#ffffff"
                      scale={0.9}
                    />
                  ) : (
                    <Pin
                      background="#16a34a"
                      borderColor="#ffffff"
                      glyphColor="#ffffff"
                      scale={0.8}
                    />
                  )}
                </AdvancedMarker>
              );
            })}

          {/* Station / Hub InfoWindow Popup */}
          {activeStationInfo && (
            <InfoWindow
              position={{
                lat: activeStationInfo.geometry.coordinates[1],
                lng: activeStationInfo.geometry.coordinates[0],
              }}
              onCloseClick={() => setActiveStationInfo(null)}
            >
              <div className="p-1 max-w-xs text-xs font-sans text-neutral-800">
                <div className="flex items-start justify-between gap-2 border-b border-neutral-200 pb-1.5 mb-1.5">
                  <div>
                    <h4 className="font-bold text-sm text-[#005B47] leading-snug">
                      {language === 'TA' && activeStationInfo.properties.tamil_name
                        ? activeStationInfo.properties.tamil_name
                        : activeStationInfo.properties.name}
                    </h4>
                    <p className="text-[11px] text-neutral-500 font-medium">
                      {activeStationInfo.properties.operator || 'CUMTA / CMRL Transit'}
                    </p>
                  </div>
                  {activeStationInfo.properties.interchange && (
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold whitespace-nowrap">
                      {language === 'EN' ? 'Interchange' : 'சந்திப்பு'}
                    </span>
                  )}
                </div>

                <div className="space-y-1 text-[11px] mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px] text-sky-600">directions_subway</span>
                    <span className="font-semibold">{language === 'EN' ? 'Lines:' : 'தடங்கள்:'}</span>
                    <span className="text-neutral-700">
                      {Array.isArray(activeStationInfo.properties.lines)
                        ? activeStationInfo.properties.lines.join(', ')
                        : activeStationInfo.properties.lines || 'Metro & Bus'}
                    </span>
                  </div>

                  {activeStationInfo.properties.first_train && (
                    <div className="flex items-center gap-1.5 text-neutral-600">
                      <span className="material-symbols-outlined text-[14px] text-amber-600">schedule</span>
                      <span>
                        {activeStationInfo.properties.first_train} – {activeStationInfo.properties.last_train}
                      </span>
                    </div>
                  )}

                  {activeStationInfo.properties.wheelchair_access && (
                    <div className="flex items-center gap-1 text-emerald-700 text-[10px] font-semibold">
                      <span className="material-symbols-outlined text-[13px]">accessible</span>
                      <span>{language === 'EN' ? 'Universal Access & Tactile Paths' : 'மாற்றுத்திறனாளி வசதி'}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  {onPlanFromLocation && (
                    <button
                      onClick={() => {
                        onPlanFromLocation(activeStationInfo.properties.name);
                        setActiveStationInfo(null);
                      }}
                      className="flex-1 py-1 px-2 bg-[#005B47] text-white rounded-lg font-semibold text-[11px] hover:bg-[#004737] transition cursor-pointer text-center"
                    >
                      {language === 'EN' ? 'Plan From Here' : 'இங்கிருந்து தொடங்கு'}
                    </button>
                  )}
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </APIProvider>

      {/* Floating Google Maps Style Switcher (Top Right) */}
      <div className="absolute top-5 right-5 z-20 flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-xl shadow-md border border-[#E4E8E2] text-xs font-semibold">
        <button
          onClick={() => setMapType('roadmap')}
          className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
            mapType === 'roadmap' ? 'bg-[#005B47] text-white' : 'text-[#3F4944] hover:bg-[#ECF6ED]'
          }`}
          title="Google Maps Vector Roadmap"
        >
          <span className="material-symbols-outlined text-[15px]">map</span>
          <span>{language === 'EN' ? 'Default' : 'வரைபடம்'}</span>
        </button>

        <button
          onClick={() => setMapType('satellite')}
          className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
            mapType === 'satellite' ? 'bg-[#005B47] text-white' : 'text-[#3F4944] hover:bg-[#ECF6ED]'
          }`}
          title="Google High-Resolution Satellite View"
        >
          <span className="material-symbols-outlined text-[15px]">satellite_alt</span>
          <span>{language === 'EN' ? 'Satellite' : 'செயற்கைக்கோள்'}</span>
        </button>

        <button
          onClick={() => setMapType('terrain')}
          className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
            mapType === 'terrain' ? 'bg-[#005B47] text-white' : 'text-[#3F4944] hover:bg-[#ECF6ED]'
          }`}
          title="Topographical & Elevation Terrain"
        >
          <span className="material-symbols-outlined text-[15px]">landscape</span>
          <span>{language === 'EN' ? 'Terrain' : 'நிலப்பரப்பு'}</span>
        </button>
      </div>

      {/* Floating Map Navigation & Presets Controls (Bottom Right) */}
      <div className="absolute bottom-6 right-5 z-20 flex flex-col gap-2">
        {/* Kathipara Nexus Focus */}
        <button
          onClick={() => {
            const mapInstance = (window as any).__googleMapInstance;
            if (mapInstance) {
              mapInstance.panTo(KATHIPARA_COORDS);
              mapInstance.setZoom(16);
              mapInstance.setHeading?.(25);
              mapInstance.setTilt?.(45);
            }
          }}
          className="flex items-center gap-2 px-3 py-2 bg-white/95 backdrop-blur-md border border-[#E4E8E2] rounded-xl shadow-md text-xs font-bold text-[#005B47] hover:bg-[#ECF6ED] transition-all cursor-pointer group"
          title="Zoom to Kathipara Cloverleaf Multi-modal Nexus"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#005B47] animate-pulse"></span>
          <span>{language === 'EN' ? 'Kathipara Nexus' : 'கத்திப்பாரா மையம்'}</span>
        </button>

        {/* Central Station Focus */}
        <button
          onClick={() => {
            const mapInstance = (window as any).__googleMapInstance;
            if (mapInstance) {
              mapInstance.panTo(CENTRAL_COORDS);
              mapInstance.setZoom(15.5);
            }
          }}
          className="flex items-center gap-2 px-3 py-2 bg-white/95 backdrop-blur-md border border-[#E4E8E2] rounded-xl shadow-md text-xs font-bold text-[#151E18] hover:bg-[#ECF6ED] transition-all cursor-pointer"
          title="Zoom to Puratchi Thalaivar Dr. MGR Central Hub"
        >
          <span className="material-symbols-outlined text-[16px] text-rose-700">train</span>
          <span>{language === 'EN' ? 'Central Hub' : 'சென்ட்ரல் மையம்'}</span>
        </button>

        {/* Greater Chennai Reset Bounds */}
        <button
          onClick={() => {
            const mapInstance = (window as any).__googleMapInstance;
            if (mapInstance) {
              mapInstance.panTo(CHENNAI_CENTER);
              mapInstance.setZoom(12);
              mapInstance.setTilt?.(0);
              mapInstance.setHeading?.(0);
            }
          }}
          className="flex items-center gap-2 px-3 py-2 bg-white/95 backdrop-blur-md border border-[#E4E8E2] rounded-xl shadow-md text-xs font-bold text-[#151E18] hover:bg-[#ECF6ED] transition-all cursor-pointer"
          title="Fit to Greater Chennai Corporation Extent"
        >
          <span className="material-symbols-outlined text-[16px] text-[#005B47]">crop_free</span>
          <span>{language === 'EN' ? 'Reset Bounds' : 'சென்னை எல்லை'}</span>
        </button>

        {/* Live Google Traffic Badge Toggle */}
        <button
          onClick={() => setTrafficAuditOpen(!trafficAuditOpen)}
          className={`flex items-center gap-2 px-3 py-2 border rounded-xl shadow-md text-xs font-bold transition-all cursor-pointer ${
            layers.tomTomTraffic
              ? 'bg-amber-500/95 text-white border-amber-600'
              : 'bg-white/95 backdrop-blur-md text-[#3F4944] border-[#E4E8E2] hover:bg-[#ECF6ED]'
          }`}
          title="View Google Maps & CUMTA Live Traffic Telemetry"
        >
          <span className="material-symbols-outlined text-[16px]">
            {layers.tomTomTraffic ? 'traffic' : 'speed'}
          </span>
          <span>{language === 'EN' ? 'Live Traffic Feeds' : 'நேரலை போக்குவரத்து'}</span>
        </button>
      </div>

      {/* Traffic Telemetry Drawer Modal */}
      {trafficAuditOpen && (
        <div className="absolute bottom-24 right-5 z-30 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-[#E4E8E2] p-4 text-xs">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#E4E8E2]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-600">traffic</span>
              <span className="font-bold text-sm text-[#151E18]">
                {language === 'EN' ? 'Google Maps Live Traffic Telemetry' : 'கூகுள் வரைபட நேரலை போக்குவரத்து'}
              </span>
            </div>
            <button
              onClick={() => setTrafficAuditOpen(false)}
              className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          <p className="text-[#3F4944] text-[11px] mb-3 leading-relaxed">
            {language === 'EN'
              ? 'Real-time traffic density is dynamically visualized via Google Maps TrafficLayer across Chennai arterials, paired with audited speed indices.'
              : 'கூகுள் வரைபட டிராஃபிக் லேயர் மூலம் சென்னையின் முக்கிய சாலைகளில் நேரலை நெரிசல் அளவிடப்படுகிறது.'}
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

          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-[10px] leading-tight">
            <strong>{language === 'EN' ? 'Active Feed:' : 'செயல்பாட்டு நிலை:'}</strong>{' '}
            {language === 'EN'
              ? 'Google Maps Platform TrafficLayer is active and streaming live arterial speeds across Greater Chennai.'
              : 'கூகுள் வரைபட நேரலை போக்குவரத்து அடுக்கு சென்னையில் செயல்படுகிறது.'}
          </div>
        </div>
      )}

      {/* Dynamic Map Legend Bar (Bottom Center) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 hidden md:flex items-center gap-3 px-3.5 py-2 bg-white/95 backdrop-blur-md border border-[#E4E8E2] rounded-full shadow-lg text-[11px] text-[#3F4944]">
        <div className="flex items-center gap-1.5 font-bold text-[#151E18]">
          <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
          <span>Google Maps Platform</span>
        </div>

        {layers.metroCorridors && (
          <div className="flex items-center gap-1.5 border-l border-[#E4E8E2] pl-2">
            <span className="w-3.5 h-1.5 rounded-full bg-[#0284c7]"></span>
            <span>{language === 'EN' ? 'CMRL Metro' : 'மெட்ரோ'}</span>
          </div>
        )}

        {layers.busRoutes && (
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 rounded-full bg-[#005B47]"></span>
            <span>{language === 'EN' ? 'MTC Bus' : 'பேருந்து'}</span>
          </div>
        )}

        {layers.suburbanRail && (
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-0.5 border-t-2 border-dashed border-[#1e3a2b]"></span>
            <span>{language === 'EN' ? 'Suburban Rail' : 'புறநகர் ரயில்'}</span>
          </div>
        )}

        {layers.tomTomTraffic && (
          <div className="flex items-center gap-1 text-amber-700 font-semibold">
            <span className="material-symbols-outlined text-[13px]">traffic</span>
            <span>{language === 'EN' ? 'Live Traffic' : 'டிராஃபிக்'}</span>
          </div>
        )}

        <div className="border-l border-[#E4E8E2] pl-2 text-[10px] text-neutral-400 font-mono-tabular">
          Z: {currentZoom}
        </div>
      </div>
    </div>
  );
};
