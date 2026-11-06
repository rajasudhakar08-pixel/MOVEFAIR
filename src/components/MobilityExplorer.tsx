import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChennaiMobilityMap } from './map/ChennaiMobilityMap.tsx';
import { ChennaiGoogleMap } from './map/ChennaiGoogleMap.tsx';
import {
  CHENNAI_STATIONS,
  CHENNAI_WARDS,
  SAMPLE_JOURNEYS,
  POPULAR_LOCATIONS,
  TransitRouteOption,
  ChennaiWard,
  ChennaiStation,
} from '../data/chennaiTransitData.ts';

interface MobilityExplorerProps {
  userName: string;
  userWard: string;
  onOpenWelcomeScene: () => void;
  onLogout: () => void;
  language: 'EN' | 'TA';
  setLanguage: (lang: 'EN' | 'TA') => void;
  initialTab?: 'explorer' | 'planner' | 'saved' | 'spending' | 'plannertools';
}

export const MobilityExplorer: React.FC<MobilityExplorerProps> = ({
  userName,
  userWard,
  onOpenWelcomeScene,
  onLogout,
  language,
  setLanguage,
  initialTab = 'explorer',
}) => {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<
    'explorer' | 'planner' | 'saved' | 'spending' | 'plannertools'
  >(initialTab);

  // Map Engine switcher ('google' = Google Maps Platform, 'carto' = Carto Positron GIS)
  const [mapEngine, setMapEngine] = useState<'google' | 'carto'>('google');

  // Map layer controls
  const [layers, setLayers] = useState({
    wardBoundaries: true,
    metroCorridors: true,
    busRoutes: true,
    busStops: true,
    suburbanRail: false,
    walkingIsochrones: true,
    tomTomTraffic: false,
  });

  const [isLayersCollapsed, setIsLayersCollapsed] = useState(false);
  const [selectedWard, setSelectedWard] = useState<ChennaiWard | null>(CHENNAI_WARDS[0]);
  const [selectedStation, setSelectedStation] = useState<ChennaiStation | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);
  const [searchTargetCoords, setSearchTargetCoords] = useState<[number, number] | null>(null);
  const [serviceStatusToast, setServiceStatusToast] = useState<string | null>(null);

  // Map viewport scale and pan
  const [mapScale, setMapScale] = useState(1.0);
  const [searchQuery, setSearchQuery] = useState('');

  // Journey planner state
  const [origin, setOrigin] = useState('Anna Nagar West');
  const [destination, setDestination] = useState('TIDEL Park, OMR');
  const [selectedPreference, setSelectedPreference] = useState<
    'balanced' | 'cheapest' | 'fastest' | 'green' | 'walk_less'
  >('balanced');
  const [activeRouteDetail, setActiveRouteDetail] = useState<TransitRouteOption | null>(
    SAMPLE_JOURNEYS[2] // Balanced default
  );

  // Spending calculator state
  const [commuteDaysPerWeek, setCommuteDaysPerWeek] = useState(5);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');

  // Planner tools state
  const [scenarioHeadwayReduction, setScenarioHeadwayReduction] = useState(25); // percentage
  const [scenarioFeederBuses, setScenarioFeederBuses] = useState(12);

  // Saved routes
  const [savedRoutesList, setSavedRoutesList] = useState([
    {
      id: '1',
      titleEN: 'Home to Office',
      titleTA: 'வீட்டிலிருந்து அலுவலகம்',
      from: 'Anna Nagar West',
      fromTA: 'அண்ணா நகர் மேற்கு',
      to: 'TIDEL Park, OMR',
      toTA: 'டைடல் பார்க், OMR',
      modeEN: 'Metro + MTC Feeder',
      modeTA: 'மெட்ரோ + MTC இணைப்பு',
      fare: '₹36',
      durationEN: '43 min',
      durationTA: '43 நிமிடம்',
    },
    {
      id: '2',
      titleEN: 'College Routine',
      titleTA: 'கல்லூரிப் பயணம்',
      from: 'Tambaram Gateway',
      fromTA: 'தாம்பரம் முனையம்',
      to: 'Guindy Intermodal Hub',
      toTA: 'கிண்டி போக்குவரத்து மையம்',
      modeEN: 'Southern Suburban Rail',
      modeTA: 'தென்னக புறநகர் இரயில்',
      fare: '₹10',
      durationEN: '32 min',
      durationTA: '32 நிமிடம்',
    },
    {
      id: '3',
      titleEN: 'Shopping Weekend',
      titleTA: 'வார இறுதி பயணம்',
      from: 'Thousand Lights',
      fromTA: 'ஆயிரம் விளக்கு',
      to: 'Panagal Park, T. Nagar',
      toTA: 'பனகல் பார்க், தி.நகர்',
      modeEN: 'MTC Route 23C',
      modeTA: 'MTC தடம் 23C',
      fare: '₹15',
      durationEN: '22 min',
      durationTA: '22 நிமிடம்',
    },
  ]);

  const handleSwapLocations = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleSelectWard = (ward: ChennaiWard) => {
    setSelectedWard(ward);
    setSelectedStation(null);
    setIsInspectorOpen(true);
  };

  const handleSelectStation = (station: ChennaiStation) => {
    setSelectedStation(station);
    setIsInspectorOpen(true);
    // Lookup real WGS84 coordinate
    if (station.id === 'alandur' || station.name.includes('Alandur')) {
      setSearchTargetCoords([80.2036, 13.0076]);
    } else if (station.id === 'central' || station.name.includes('Central')) {
      setSearchTargetCoords([80.2757, 13.0827]);
    } else if (station.id === 'guindy' || station.name.includes('Guindy')) {
      setSearchTargetCoords([80.2125, 13.0093]);
    } else if (station.id === 'tidel' || station.name.includes('TIDEL')) {
      setSearchTargetCoords([80.2458, 12.9897]);
    } else if (station.id === 'airport' || station.name.includes('Airport')) {
      setSearchTargetCoords([80.1705, 12.9815]);
    } else if (station.id === 'cmbt' || station.name.includes('CMBT')) {
      setSearchTargetCoords([80.2057, 13.0694]);
    } else if (station.id === 'tambaram' || station.name.includes('Tambaram')) {
      setSearchTargetCoords([80.1172, 12.9255]);
    } else if (station.id === 'egmore' || station.name.includes('Egmore')) {
      setSearchTargetCoords([80.2611, 13.0792]);
    } else if (station.name.includes('Vadapalani')) {
      setSearchTargetCoords([80.2117, 13.0514]);
    } else if (station.name.includes('Thousand Lights')) {
      setSearchTargetCoords([80.2522, 13.0583]);
    }
  };

  // Filtered stations for search
  const filteredStations = searchQuery
    ? CHENNAI_STATIONS.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.tamilName.includes(searchQuery)
      )
    : [];

  // Bilingual translation dictionary for MobilityExplorer
  const t = {
    // Sidebar
    subBrand: language === 'EN' ? 'Chennai Urban Mobility' : 'சென்னை நகர்ப்புற போக்குவரத்து',
    navExplorer: language === 'EN' ? 'Mobility Explorer' : 'நகர்வு வரைபடம்',
    navPlanner: language === 'EN' ? 'Plan a Journey' : 'பயணத் திட்டம்',
    navSaved: language === 'EN' ? 'Saved Routes' : 'சேமித்த வழிகள்',
    navSpending: language === 'EN' ? 'Commute Spending' : 'பயணச் செலவு',
    transitGovernance: language === 'EN' ? 'Transit Governance' : 'போக்குவரத்து நிர்வாகம்',
    navPlannerWorkspace: language === 'EN' ? 'Planner Workspace' : 'திட்டமிடுநர் களம்',
    navKathipara: language === 'EN' ? 'Kathipara Simulation' : 'கத்திப்பாரா காட்சி',
    greenImpact: language === 'EN' ? 'Green Commute Impact' : 'பசுமைப் பயண தாக்கம்',
    co2Avoided: language === 'EN' ? 'CO₂ avoided' : 'கார்பன் சேமிப்பு',
    greenEquiv: language === 'EN'
      ? 'Equivalent to 3 MTC bus transit commutes vs cab rides'
      : 'வாடகை காரை விட 3 பேருந்து பயணங்களின் கார்பன் சேமிப்பு',
    signOut: language === 'EN' ? 'Sign out' : 'வெளியேறு',

    // Header
    searchPlaceholder: language === 'EN'
      ? 'Search for a place, stop, route or ward (e.g. Guindy, Kathipara, Anna Nagar, Ward 114)'
      : 'இடம், நிறுத்தம், வழித்தடம் அல்லது வார்டைத் தேடவும் (எ.கா: கிண்டி, கத்திப்பாரா, அண்ணா நகர்)',
    suggestedHead: language === 'EN' ? 'Suggested Stations & Wards' : 'பரிந்துரைக்கப்பட்ட நிலையங்கள் & வார்டுகள்',
    noStationsFound: language === 'EN'
      ? 'No matching stations. Try "Guindy", "Kathipara", "Central"'
      : 'பொருந்தும் நிலையங்கள் இல்லை. "கிண்டி", "கத்திப்பாரா", "சென்ட்ரல்" என முயற்சிக்கவும்',
    gtfsSynced: language === 'EN' ? 'Live GTFS Synced' : 'நேரலை GTFS ஒத்திசைவு',
    cityWeather: language === 'EN' ? '28°C Chennai' : '28°C சென்னை',
    notifStatus: language === 'EN'
      ? 'All systems operational: MTC GTFS validated, CMRL Blue/Green lines on schedule.'
      : 'அனைத்து அமைப்புகளும் இயங்குகின்றன: MTC GTFS சரிபார்க்கப்பட்டது, CMRL நீல/பச்சை வழித்தடங்கள் சரியான நேரத்தில் இயங்குகின்றன.',

    // Layer drawer
    mapLayers: language === 'EN' ? 'Map Layers' : 'வரைபட அடுக்குகள்',
    activeCount: language === 'EN' ? 'Active' : 'இயக்கத்தில்',
    adminGroup: language === 'EN' ? 'Civic Administrative' : 'நகராட்சி நிர்வாகம்',
    gccGis: 'GCC GIS',
    wardBoundaries: language === 'EN' ? 'GCC Ward Boundaries' : 'சென்னை வார்டு எல்லைகள்',
    wardBoundariesDesc: language === 'EN' ? 'Official Layer 4 GeoJSON Polygons' : 'அதிகாரப்பூர்வ அடுக்கு 4 GeoJSON எல்லைகள்',
    transitCorridorsGroup: language === 'EN' ? 'CUMTA Transit Corridors' : 'CUMTA போக்குவரத்து வழித்தடங்கள்',
    gtfsValidated: language === 'EN' ? 'GTFS Validated' : 'GTFS சரிபார்க்கப்பட்டது',
    metroCorridors: language === 'EN' ? 'CMRL Metro Corridors' : 'CMRL மெட்ரோ வழித்தடங்கள்',
    metroCorridorsDesc: language === 'EN' ? 'Phase 1 Blue & Green alignment' : 'கட்டம் 1 நீல & பச்சை வழித்தடம்',
    busRoutes: language === 'EN' ? 'MTC Bus Routes' : 'MTC பேருந்து வழித்தடங்கள்',
    busRoutesDesc: language === 'EN' ? 'Core radial routes (21G, 19B, 570, 70V)' : 'முக்கிய ஆர வழித்தடங்கள் (21G, 19B, 570, 70V)',
    busStops: language === 'EN' ? 'MTC Bus Stops' : 'MTC பேருந்து நிறுத்தங்கள்',
    busStopsDesc: language === 'EN' ? 'Validated roadside boarding nodes' : 'சரிபார்க்கப்பட்ட சாலை நிறுத்தங்கள்',
    suburbanRail: language === 'EN' ? 'Southern Railway Suburban' : 'தென்னக இரயில்வே புறநகர்',
    suburbanRailDesc: language === 'EN' ? 'Beach-Tambaram & MRTS Corridors' : 'கடற்கரை-தாம்பரம் & MRTS வழித்தடங்கள்',
    walkingIsochrones: language === 'EN' ? 'Walking Isochrones' : 'நடை அணுகல் வளையங்கள்',
    walkingIsochronesDesc: language === 'EN' ? 'OSMnx walkable transit sheds' : 'OSMnx பாதசாரி அணுகல் எல்லைகள்',
    telemetryGroup: language === 'EN' ? 'Real-time Telemetry' : 'நேரலை தொலை அளவீடு',
    experimental: language === 'EN' ? 'Experimental' : 'பரிசோதனை நிலை',
    liveBusGps: language === 'EN' ? 'Live MTC Bus GPS' : 'நேரலை MTC பேருந்து GPS',
    feedPending: language === 'EN' ? 'Feed Pending' : 'தரவு நிலுவை',
    feedPendingDesc: language === 'EN'
      ? 'MTC operator telemetry integration pending CUMTA open API release.'
      : 'CUMTA ஓபன் API வெளியீட்டிற்காக MTC நேரலை GPS காத்திருக்கிறது.',
    tomtomTraffic: language === 'EN' ? 'TomTom Orbis Live Traffic' : 'TomTom நேரலை போக்குவரத்து',
    trialMode: language === 'EN' ? 'Trial mode' : 'சோதனை முறை',

    // Floating filters
    filterMultiModal: language === 'EN' ? 'Multi-Modal View' : 'பலவகை போக்குவரத்து',
    filterMetro: language === 'EN' ? 'CMRL Metro' : 'CMRL மெட்ரோ',
    filterBus: language === 'EN' ? 'MTC Bus Grid' : 'MTC பேருந்து கட்டமைப்பு',
    filterWardAnalytics: language === 'EN' ? 'GCC Ward Analytics' : 'சென்னை வார்டு பகுப்பாய்வு',

    // Inspector
    verifiedGeom: language === 'EN'
      ? 'Verified Geometry: GCC ArcGIS Boundary & CUMTA 2026 GTFS Transit Shed.'
      : 'சரிபார்க்கப்பட்ட எல்லை: GCC ArcGIS வரைபடம் & CUMTA 2026 GTFS தரவு.',
    transitCoverage: language === 'EN' ? 'Transit Coverage' : 'போக்குவரத்து பரப்பு',
    mtcBusStops: language === 'EN' ? 'MTC Bus Stops' : 'MTC பேருந்து நிறுத்தங்கள்',
    stopsLabel: language === 'EN' ? 'stops' : 'நிறுத்தங்கள்',
    avgHeadwayLabel: language === 'EN' ? 'Avg headway' : 'சராசரி இடைவெளி',
    metroStationsLabel: language === 'EN' ? 'Metro Stations' : 'மெட்ரோ நிலையங்கள்',
    nodesLabel: language === 'EN' ? 'nodes' : 'நிலையங்கள்',
    blueGreenAlignment: language === 'EN' ? 'Blue / Green alignment' : 'நீல / பச்சை வழித்தடம்',
    walkShed400m: language === 'EN' ? '400m Walk Shed' : '400மீ நடை பரப்பு',
    walkShedDesc: language === 'EN' ? 'Residents within 5m walk' : '5 நிமிட நடை தூர மக்கள்',
    repCommute: language === 'EN' ? 'Representative Commute' : 'மாதிரி தினசரி பயணம்',
    greenShare: language === 'EN' ? 'Green Share' : 'பசுமைப் பங்கு',
    planFromHere: language === 'EN' ? 'Plan Journey from here' : 'இங்கிருந்து பயணத் திட்டம்',
    compareBtn: language === 'EN' ? 'Compare' : 'ஒப்பிடு',
    resetNorth: language === 'EN' ? 'Reset North' : 'திசையை மீட்டமை',
    zoomIn: language === 'EN' ? 'Zoom In' : 'பெரிதாக்கு',
    zoomOut: language === 'EN' ? 'Zoom Out' : 'சிறிதாக்கு',
    centerMyWard: language === 'EN' ? 'Center on My Ward' : 'என் வார்டைக் காட்டு',
    legendCmrlBlue: language === 'EN' ? 'CMRL Blue' : 'CMRL நீலம்',
    legendCmrlGreen: language === 'EN' ? 'CMRL Green' : 'CMRL பச்சை',
    legendMtc: language === 'EN' ? 'MTC Corridors' : 'MTC வழித்தடங்கள்',
    legendShed: language === 'EN' ? '5-Min Shed' : '5-நிமி நடை எல்லை',

    // Planner Tab
    planJourneyTitle: language === 'EN' ? 'Plan a Journey' : 'பயணத் திட்டம்',
    planJourneySub: language === 'EN'
      ? 'Compare Cheapest, Fastest, and Balanced multi-modal itineraries across Chennai.'
      : 'சென்னையின் மலிவான, வேகமான மற்றும் சமநிலையான பலவகை வழித்தடங்களை ஒப்பிடுங்கள்.',
    fromLabel: language === 'EN' ? 'From' : 'புறப்படும் இடம்',
    toLabel: language === 'EN' ? 'To' : 'சேரும் இடம்',
    swapLocations: language === 'EN' ? 'Swap locations' : 'இடங்களை மாற்று',
    prioritize: language === 'EN' ? 'Prioritize:' : 'முன்னுரிமை:',
    prefBalanced: language === 'EN' ? 'Balanced' : 'சமநிலையானது',
    prefSpendLess: language === 'EN' ? 'Spend Less' : 'குறைந்த செலவு',
    prefReachFaster: language === 'EN' ? 'Reach Faster' : 'விரைவான பயணம்',
    prefTravelGreener: language === 'EN' ? 'Travel Greener' : 'பசுமைப் பயணம்',
    prefWalkLess: language === 'EN' ? 'Walk Less' : 'குறைந்த நடை',
    minsUnit: language === 'EN' ? 'mins' : 'நிமி',
    walkUnit: language === 'EN' ? 'walk' : 'நடை',
    directTransit: language === 'EN' ? 'Direct Transit' : 'நேரடிப் பயணம்',
    transferLabel: language === 'EN' ? 'Transfer' : 'மாற்றல்',
    transfersLabel: language === 'EN' ? 'Transfers' : 'மாற்றல்கள்',
    viewDetails: language === 'EN' ? 'View details →' : 'விவரங்களைக் காண்க →',
    saveRouteBtn: language === 'EN' ? 'Save Route' : 'வழியைச் சேமி',
    calculateSpendBtn: language === 'EN' ? 'Calculate Monthly Spend' : 'மாதாந்திர செலவைக் கணக்கிடு',

    // Saved Routes Tab
    savedTitle: language === 'EN' ? 'My Places & Routes' : 'என் இடங்கள் & வழிகள்',
    savedSub: language === 'EN'
      ? 'Quickly reuse journeys and frequent transit commutes across Chennai.'
      : 'அடிக்கடி பயன்படுத்தும் சென்னை பயண வழிகளை எளிதில் அணுகுங்கள்.',
    planNewRoute: language === 'EN' ? 'Plan New Route' : 'புதிய வழியைத் திட்டமிடு',
    findLiveRoutes: language === 'EN' ? 'Find Live Routes' : 'நேரலை வழியைக் காண்க',
    deleteRoute: language === 'EN' ? 'Delete' : 'நீக்கு',

    // Spending Tab
    spendingTitle: language === 'EN' ? 'My Travel Spending & Eco Meter' : 'என் பயணச் செலவு & பசுமை மீட்டர்',
    spendingSub: language === 'EN'
      ? 'Understand recurring Chennai commute expenses and green savings without disclosing private income.'
      : 'வருமான விவரங்களை வெளிப்படுத்தாமல் மாதாந்திர பயணச் செலவுகளையும் சேமிப்பையும் அறிந்து கொள்ளுங்கள்.',
    commuteProfile: language === 'EN' ? 'Commute Profile' : 'பயண விவரக்குறிப்பு',
    roundTrip: language === 'EN' ? '(Round Trip)' : '(இருவழிப் பயணம்)',
    periodDaily: language === 'EN' ? 'Daily' : 'தினசரி',
    periodWeekly: language === 'EN' ? 'Weekly' : 'வாராந்திர',
    periodMonthly: language === 'EN' ? 'Monthly (22 Days)' : 'மாதாந்திர (22 நாட்கள்)',
    commuteFreq: language === 'EN' ? 'Commute Frequency' : 'பயண அதிர்வெண்',
    commuteFreqSub: language === 'EN' ? 'Select how many days you commute per week' : 'வாரத்திற்கு எத்தனை நாட்கள் பயணம் செய்கிறீர்கள்',
    daysLabel: language === 'EN' ? 'days' : 'நாட்கள்',
    transitChoiceTitle: language === 'EN' ? 'MOVEFAIR Metro + Bus' : 'MOVEFAIR மெட்ரோ + பேருந்து',
    transitCostSub: language === 'EN' ? 'Estimated commute cost' : 'கணிக்கப்பட்ட பயணச் செலவு',
    co2PerRoundTrip: language === 'EN' ? 'kg CO₂ per round-trip' : 'கிகி CO₂ இருவழிப் பயணத்திற்கு',
    cabTitle: language === 'EN' ? 'App-based Cab / Auto' : 'வாடகை கார் / ஆட்டோ',
    cabRateSub: language === 'EN' ? 'Average ride-hail rate' : 'சராசரி வாடகைக் கட்டணம்',
    netSavingsTitle: language === 'EN' ? 'Net Wallet & Earth Savings' : 'பணப்பை & பூமிக்கான நிகர சேமிப்பு',
    savedInPocket: language === 'EN' ? 'Saved in your pocket' : 'உங்கள் பாக்கெட்டில் சேமிப்பு',
    avoidsMonthly: language === 'EN' ? 'Avoids' : 'சேமிக்கிறது',
    co2MonthlyUnit: language === 'EN' ? 'kg CO₂ monthly' : 'கிகி CO₂ மாதம்',

    // Planner Tools Tab
    plannerToolsTag: language === 'EN' ? 'CUMTA Mobility Challenge · PS7' : 'CUMTA மொபிலிட்டி சேலஞ்ச் · PS7',
    plannerToolsTitle: language === 'EN' ? 'Planner Workspace & What-If Scenario Lab' : 'திட்டமிடுநர் களம் & மாதிரி உத்திகள் கூடம்',
    plannerToolsSub: language === 'EN'
      ? 'Simulate headway reductions, fleet reallocation, and feeder route additions across GCC wards.'
      : 'சென்னை வார்டுகளில் பேருந்து இடைவெளிக் குறைப்பு, பேருந்து மறுஒதுக்கீடு மற்றும் இணைப்பு வழிகளை உருவகப்படுத்துங்கள்.',
    scenario1Title: language === 'EN'
      ? 'Scenario 1: Alandur / Kathipara Feeder Loop Enhancement'
      : 'சூழல் 1: ஆலந்தூர் / கத்திப்பாரா இணைப்புப் பேருந்து மேம்பாடு',
    headwayReductLabel: language === 'EN' ? 'Peak Headway Reduction:' : 'உச்ச நேர இடைவெளிக் குறைப்பு:',
    headwayMin: language === 'EN' ? '10% (Minor frequency bump)' : '10% (சிறிய அதிர்வெண் அதிகரிப்பு)',
    headwayMax: language === 'EN' ? '50% (Doubled service)' : '50% (இரட்டிப்பு சேவை)',
    feederLoopsLabel: language === 'EN' ? 'New Midi-Bus Feeder Loops:' : 'புதிய மினி-பேருந்து சுற்றுகள்:',
    unitsLabel: language === 'EN' ? 'units' : 'எண்ணிக்கை',
    loopsMin: language === 'EN' ? '4 loops (Local catchment)' : '4 சுற்றுகள் (உள்ளூர் பரப்பு)',
    loopsMax: language === 'EN' ? '24 loops (Corridor wide)' : '24 சுற்றுகள் (முழு வழித்தட பரப்பு)',
    avgWaitTime: language === 'EN' ? 'Average Commuter Wait Time' : 'சராசரி பயணி காத்திருப்பு நேரம்',
    waitReduction: language === 'EN' ? 'wait reduction' : 'காத்திருப்பு நேரக் குறைப்பு',
    walkAccessibility: language === 'EN' ? '400m Walk Shed Accessibility' : '400மீ நடை பரப்பு அணுகல்',
    popReached: language === 'EN' ? 'population reached' : 'மக்கள் சென்றடைவு',
    projDailyShift: language === 'EN' ? 'Projected Daily Shift to Transit' : 'கணிக்கப்பட்ட தினசரி போக்குவரத்து மாற்றம்',
    tripsPerDay: language === 'EN' ? 'trips / day' : 'பயணங்கள் / நாள்',
    modalShiftDesc: language === 'EN' ? 'Estimated modal shift from 2-wheelers' : 'இருசக்கர வாகனங்களிலிருந்து மாறுதல் கணிப்பு',
  };

  return (
    <div className="bg-[#F2FCF2] font-sans text-[#151E18] antialiased min-h-screen flex">
      {/* 1. Left Sidebar Navigation */}
      <aside className="fixed left-0 top-0 h-screen w-72 bg-white z-40 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-r border-[#E4E8E2]">
        <div className="flex flex-col flex-1 overflow-y-auto px-4 py-5">
          {/* Brand Header */}
          <div className="flex items-center gap-3 px-3 pb-6 border-b border-[#E4E8E2]/60">
            <div className="w-9 h-9 rounded-lg bg-[#005B47] flex items-center justify-center text-white shadow-sm">
              <span className="material-symbols-outlined text-[22px]">near_me</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-[#151E18]">MOVEFAIR</span>
                <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-[#E1EBE1] text-[#005B47]">MAA</span>
              </div>
              <span className="text-xs text-[#3F4944]">{t.subBrand}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5 mt-4">
            <motion.button
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('explorer')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer text-left ${
                activeTab === 'explorer'
                  ? 'bg-[#28745E] text-white shadow-sm font-bold'
                  : 'text-[#3F4944] hover:bg-[#E6F1E7] hover:text-[#151E18]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">explore</span>
              <span className="flex-1">{t.navExplorer}</span>
              <span className={`w-2 h-2 rounded-full ${activeTab === 'explorer' ? 'bg-white' : 'bg-[#005B47]'}`}></span>
            </motion.button>

            <motion.button
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('planner')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer text-left ${
                activeTab === 'planner'
                  ? 'bg-[#28745E] text-white shadow-sm font-bold'
                  : 'text-[#3F4944] hover:bg-[#E6F1E7] hover:text-[#151E18]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">route</span>
              <span className="flex-1">{t.navPlanner}</span>
            </motion.button>

            <motion.button
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('saved')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer text-left ${
                activeTab === 'saved'
                  ? 'bg-[#28745E] text-white shadow-sm font-bold'
                  : 'text-[#3F4944] hover:bg-[#E6F1E7] hover:text-[#151E18]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">bookmark</span>
              <span className="flex-1">{t.navSaved}</span>
              <span className="px-2 py-0.5 rounded-full bg-[#E1EBE1] text-[#151E18] text-xs font-mono">
                {savedRoutesList.length}
              </span>
            </motion.button>

            <motion.button
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('spending')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer text-left ${
                activeTab === 'spending'
                  ? 'bg-[#28745E] text-white shadow-sm font-bold'
                  : 'text-[#3F4944] hover:bg-[#E6F1E7] hover:text-[#151E18]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">payments</span>
              <span className="flex-1">{t.navSpending}</span>
            </motion.button>

            <div className="my-3 mx-2 h-px bg-[#E4E8E2]"></div>

            <div className="px-3 pb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#3F4944]">
                {t.transitGovernance}
              </span>
            </div>

            <motion.button
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('plannertools')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer text-left ${
                activeTab === 'plannertools'
                  ? 'bg-[#28745E] text-white shadow-sm font-bold'
                  : 'text-[#3F4944] hover:bg-[#E6F1E7] hover:text-[#151E18]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">build</span>
              <span className="flex-1">{t.navPlannerWorkspace}</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#DBE5DC] text-[#3F4944]">
                CUMTA
              </span>
            </motion.button>

            <motion.button
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenWelcomeScene}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-[#3F4944] hover:bg-[#E6F1E7] hover:text-[#151E18] transition-all cursor-pointer text-left"
            >
              <span className="material-symbols-outlined text-[20px] text-amber-600">traffic</span>
              <span className="flex-1">{t.navKathipara}</span>
            </motion.button>
          </nav>
        </div>

        {/* Green Commute Impact Card in Sidebar */}
        <div className="p-4 flex flex-col gap-3 bg-white border-t border-[#E4E8E2]">
          <div className="p-3.5 rounded-xl bg-[#ECF6ED] flex flex-col gap-2 border border-[#E4E8E2]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#005B47] uppercase tracking-wide">{t.greenImpact}</span>
              <span className="material-symbols-outlined text-[16px] text-[#005B47]">eco</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold text-[#151E18] tabular-nums font-mono">14.8 kg</span>
              <span className="text-xs text-[#3F4944]">{t.co2Avoided}</span>
            </div>
            <div className="w-full bg-[#DBE5DC] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#005B47] h-full rounded-full w-3/4"></div>
            </div>
            <p className="text-[11px] text-[#3F4944] leading-tight">
              {t.greenEquiv}
            </p>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => setLanguage(language === 'EN' ? 'TA' : 'EN')}
              className="flex items-center gap-1.5 text-xs text-[#3F4944] hover:text-[#005B47] font-semibold cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">translate</span>
              <span>{language === 'EN' ? 'தமிழ்' : 'English'}</span>
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-semibold cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              <span>{t.signOut}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <div className="pl-72 flex-1 flex flex-col min-h-screen">
        {/* Top App Header */}
        <header className="sticky top-0 left-72 right-0 h-16 bg-white/95 backdrop-blur-xl z-30 flex items-center justify-between px-6 shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#E4E8E2]">
          {/* Universal Search Bar */}
          <div className="flex items-center gap-4 flex-1 max-w-2xl relative">
            <div className="relative w-full flex items-center">
              <span className="material-symbols-outlined absolute left-3.5 text-[#3F4944] text-[20px]">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full h-10 pl-10 pr-14 rounded-lg bg-[#ECF6ED] text-[#151E18] text-xs placeholder:text-[#3F4944] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#005B47] transition-all border-none"
              />
              <span className="absolute right-3 text-xs text-[#3F4944] px-1.5 py-0.5 rounded bg-[#E1EBE1] font-mono">
                ⌘K
              </span>
            </div>

            {/* Quick dropdown when searching */}
            {searchQuery && (
              <div className="absolute top-12 left-0 right-0 bg-white rounded-xl shadow-xl border border-[#E4E8E2] p-2 z-50">
                <span className="text-[11px] font-bold text-[#6D7770] px-3 py-1 block uppercase">
                  {t.suggestedHead}
                </span>
                {filteredStations.length > 0 ? (
                  filteredStations.map((st) => (
                    <button
                      key={st.id}
                      onClick={() => {
                        handleSelectStation(st);
                        setSearchQuery('');
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#ECF6ED] flex items-center justify-between text-xs cursor-pointer"
                    >
                      <div>
                        <span className="font-bold text-[#151E18]">
                          {language === 'EN' ? st.name : st.tamilName}
                        </span>
                        <span className="text-[11px] text-[#6D7770] block">
                          {language === 'EN' ? st.tamilName : st.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#E1EBE1] text-[#005B47]">
                        {st.type}
                      </span>
                    </button>
                  ))
                ) : (
                  <p className="px-3 py-2 text-xs text-[#6D7770]">{t.noStationsFound}</p>
                )}
              </div>
            )}
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-4">
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ECF6ED] border border-[#E4E8E2]">
              <span className="w-2 h-2 rounded-full bg-[#005B47] animate-pulse"></span>
              <span className="text-xs font-bold text-[#151E18]">{t.gtfsSynced}</span>
              <span className="text-[#3F4944] text-xs">·</span>
              <span className="text-xs text-[#3F4944] font-mono">{t.cityWeather}</span>
            </div>

            {/* Quick language toggle in header */}
            <div className="inline-flex items-center bg-[#E9EFE9] rounded-lg p-0.5 border border-[#d2ddd3] text-xs font-semibold text-[#6D7770]">
              <button
                type="button"
                onClick={() => setLanguage('EN')}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${language === 'EN' ? 'bg-white text-[#174D3D] shadow-xs font-bold' : 'hover:text-[#174D3D]'}`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('TA')}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${language === 'TA' ? 'bg-white text-[#174D3D] shadow-xs font-bold' : 'hover:text-[#174D3D]'}`}
              >
                தமிழ்
              </button>
            </div>

            <button
              onClick={() => setServiceStatusToast(serviceStatusToast ? null : t.notifStatus)}
              className="relative w-9 h-9 rounded-lg flex items-center justify-center text-[#3F4944] hover:bg-[#ECF6ED] transition-colors cursor-pointer"
              title="Notifications & Service Status"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-600 rounded-full"></span>
            </button>

            <div className="h-6 w-px bg-[#E4E8E2]"></div>

            <div className="flex items-center gap-3 pl-1">
              <div className="flex flex-col text-right">
                <span className="text-sm font-bold text-[#151E18] leading-none">{userName}</span>
                <span className="text-xs text-[#3F4944]">{userWard}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#005B47] flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[18px]">person</span>
              </div>
            </div>
          </div>
        </header>

        {/* In-App Service Status Banner Toast */}
        {serviceStatusToast && (
          <div className="absolute top-18 left-1/2 -translate-x-1/2 z-50 max-w-lg w-[calc(100%-2rem)] bg-white/95 backdrop-blur-md border border-emerald-600/30 shadow-2xl rounded-2xl p-3.5 flex items-start gap-3">
            <span className="material-symbols-outlined text-emerald-700 text-[20px] shrink-0 mt-0.5">info</span>
            <div className="flex-1 text-xs text-[#151E18] font-medium leading-relaxed">
              {serviceStatusToast}
            </div>
            <button
              onClick={() => setServiceStatusToast(null)}
              className="text-neutral-400 hover:text-neutral-700 cursor-pointer p-0.5"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        )}

        {/* 3. Sub-views depending on active tab */}
        <AnimatePresence mode="wait">
        {activeTab === 'explorer' && (
          <motion.div
            key="tab-explorer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative w-full h-[calc(100vh-4rem)] overflow-hidden bg-[#F2FCF2]"
          >
            {/* Real Cartographic Mobility Map Engine (Google Maps Platform or Carto GIS) */}
            {mapEngine === 'google' ? (
              <ChennaiGoogleMap
                layers={layers}
                selectedWard={selectedWard}
                selectedStation={selectedStation}
                onSelectWard={handleSelectWard}
                onSelectStation={handleSelectStation}
                language={language}
                searchTargetCoords={searchTargetCoords}
                onPlanFromLocation={(loc) => {
                  setOrigin(loc);
                  setActiveTab('planner');
                }}
              />
            ) : (
              <ChennaiMobilityMap
                layers={layers}
                selectedWard={selectedWard}
                selectedStation={selectedStation}
                onSelectWard={handleSelectWard}
                onSelectStation={handleSelectStation}
                language={language}
                searchTargetCoords={searchTargetCoords}
              />
            )}

            {/* FLOATING TOP-LEFT: Map Layers Drawer */}
            <div
              className={`absolute top-5 left-5 z-20 w-80 max-h-[calc(100vh-8.5rem)] flex flex-col bg-white rounded-xl shadow-lg border border-[#E4E8E2] transition-all duration-300 ${
                isLayersCollapsed ? 'h-14 overflow-hidden' : ''
              }`}
            >
              <div className="flex items-center justify-between px-4 py-3 bg-[#ECF6ED] rounded-t-xl border-b border-[#E4E8E2]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-[#005B47]">layers</span>
                  <span className="text-sm font-bold text-[#151E18]">{t.mapLayers}</span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#E1EBE1] text-[#3F4944]">
                    {Object.values(layers).filter(Boolean).length} {t.activeCount}
                  </span>
                </div>
                <button
                  onClick={() => setIsLayersCollapsed(!isLayersCollapsed)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[#3F4944] hover:bg-[#E1EBE1] transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isLayersCollapsed ? 'unfold_more' : 'unfold_less'}
                  </span>
                </button>
              </div>

              {!isLayersCollapsed && (
                <div className="overflow-y-auto p-3.5 flex flex-col gap-4 text-xs">
                  {/* Map Engine Selection */}
                  <div className="flex flex-col gap-1.5 p-2 bg-[#ECF6ED] rounded-xl border border-[#d2ddd3]">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#3F4944]">
                        {language === 'EN' ? 'Cartography Engine' : 'வரைபட இயந்திரம்'}
                      </span>
                      <span className="text-[10px] font-bold text-[#005B47] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                        {mapEngine === 'google' ? 'Google Maps Platform' : 'Carto Positron'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-[#E4E8E2]">
                      <button
                        onClick={() => setMapEngine('google')}
                        className={`flex-1 py-1.5 px-2 rounded-md font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          mapEngine === 'google'
                            ? 'bg-[#005B47] text-white shadow-xs'
                            : 'text-[#3F4944] hover:bg-[#F2FCF2]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[15px]">public</span>
                        <span>Google Maps</span>
                      </button>
                      <button
                        onClick={() => setMapEngine('carto')}
                        className={`flex-1 py-1.5 px-2 rounded-md font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          mapEngine === 'carto'
                            ? 'bg-[#005B47] text-white shadow-xs'
                            : 'text-[#3F4944] hover:bg-[#F2FCF2]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[15px]">layers</span>
                        <span>Carto GIS</span>
                      </button>
                    </div>
                  </div>

                  {/* Administrative group */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#3F4944]">
                        {t.adminGroup}
                      </span>
                      <span className="text-[10px] font-bold text-[#005B47]">{t.gccGis}</span>
                    </div>
                    <label className="flex items-start gap-2.5 p-2 rounded-lg bg-[#ECF6ED]/70 hover:bg-[#E1EBE1] cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={layers.wardBoundaries}
                        onChange={(e) => setLayers({ ...layers, wardBoundaries: e.target.checked })}
                        className="mt-0.5 w-4 h-4 rounded text-[#005B47] focus:ring-0"
                      />
                      <div className="flex flex-col leading-tight">
                        <span className="font-bold text-[#151E18]">{t.wardBoundaries}</span>
                        <span className="text-[11px] text-[#3F4944]">{t.wardBoundariesDesc}</span>
                      </div>
                    </label>
                  </div>

                  {/* Transit corridors */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#3F4944]">
                        {t.transitCorridorsGroup}
                      </span>
                      <span className="text-[10px] font-bold text-[#386477]">{t.gtfsValidated}</span>
                    </div>

                    <label className="flex items-start gap-2.5 p-2 rounded-lg bg-[#ECF6ED]/70 hover:bg-[#E1EBE1] cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={layers.metroCorridors}
                        onChange={(e) => setLayers({ ...layers, metroCorridors: e.target.checked })}
                        className="mt-0.5 w-4 h-4 rounded text-[#005B47] focus:ring-0"
                      />
                      <div className="flex flex-col leading-tight">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-[#151E18]">{t.metroCorridors}</span>
                          <span className="w-2 h-2 rounded-full bg-[#386477]"></span>
                        </div>
                        <span className="text-[11px] text-[#3F4944]">{t.metroCorridorsDesc}</span>
                      </div>
                    </label>

                    <label className="flex items-start gap-2.5 p-2 rounded-lg bg-[#ECF6ED]/70 hover:bg-[#E1EBE1] cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={layers.busRoutes}
                        onChange={(e) => setLayers({ ...layers, busRoutes: e.target.checked })}
                        className="mt-0.5 w-4 h-4 rounded text-[#005B47] focus:ring-0"
                      />
                      <div className="flex flex-col leading-tight">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-[#151E18]">{t.busRoutes}</span>
                          <span className="w-2 h-2 rounded-full bg-[#005B47]"></span>
                        </div>
                        <span className="text-[11px] text-[#3F4944]">{t.busRoutesDesc}</span>
                      </div>
                    </label>

                    <label className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-[#ECF6ED] cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={layers.busStops}
                        onChange={(e) => setLayers({ ...layers, busStops: e.target.checked })}
                        className="mt-0.5 w-4 h-4 rounded text-[#005B47] focus:ring-0"
                      />
                      <div className="flex flex-col leading-tight">
                        <span className="font-semibold text-[#151E18]">{t.busStops}</span>
                        <span className="text-[11px] text-[#3F4944]">{t.busStopsDesc}</span>
                      </div>
                    </label>

                    <label className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-[#ECF6ED] cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={layers.suburbanRail}
                        onChange={(e) => setLayers({ ...layers, suburbanRail: e.target.checked })}
                        className="mt-0.5 w-4 h-4 rounded text-[#005B47] focus:ring-0"
                      />
                      <div className="flex flex-col leading-tight">
                        <span className="font-semibold text-[#151E18]">{t.suburbanRail}</span>
                        <span className="text-[11px] text-[#3F4944]">{t.suburbanRailDesc}</span>
                      </div>
                    </label>

                    <label className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-[#ECF6ED] cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={layers.walkingIsochrones}
                        onChange={(e) => setLayers({ ...layers, walkingIsochrones: e.target.checked })}
                        className="mt-0.5 w-4 h-4 rounded text-[#005B47] focus:ring-0"
                      />
                      <div className="flex flex-col leading-tight">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-[#151E18]">{t.walkingIsochrones}</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#E1EBE1] text-[#005B47]">
                            400m / 5m
                          </span>
                        </div>
                        <span className="text-[11px] text-[#3F4944]">{t.walkingIsochronesDesc}</span>
                      </div>
                    </label>
                  </div>

                  {/* Real-time Telemetry Section */}
                  <div className="p-3 rounded-lg bg-[#ECF6ED] flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase text-[#151E18]">{t.telemetryGroup}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#DBE5DC] text-[#3F4944]">
                        {t.experimental}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1 pt-1 opacity-60">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#3F4944] font-medium">{t.liveBusGps}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-700">
                          {t.feedPending}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#6D7770]">{t.feedPendingDesc}</p>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={layers.tomTomTraffic}
                          onChange={(e) => setLayers({ ...layers, tomTomTraffic: e.target.checked })}
                          className="w-4 h-4 rounded text-[#005B47] focus:ring-0"
                        />
                        <span className="text-xs text-[#151E18] font-medium">{t.tomtomTraffic}</span>
                      </label>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#E1EBE1] text-[#3F4944]">
                        {t.trialMode}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* FLOATING TOP CENTER: View Filters & Engine Mode */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 z-20 hidden md:flex items-center p-1 bg-white rounded-xl shadow-md border border-[#E4E8E2]">
              <div className="flex items-center bg-[#ECF6ED] p-0.5 rounded-lg mr-2 border border-[#d2ddd3]">
                <button
                  onClick={() => setMapEngine('google')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    mapEngine === 'google' ? 'bg-[#005B47] text-white shadow-xs' : 'text-[#3F4944] hover:text-[#005B47]'
                  }`}
                  title="Switch to Google Maps Platform"
                >
                  <span className="material-symbols-outlined text-[15px]">public</span>
                  <span>Google Maps</span>
                </button>
                <button
                  onClick={() => setMapEngine('carto')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    mapEngine === 'carto' ? 'bg-[#005B47] text-white shadow-xs' : 'text-[#3F4944] hover:text-[#005B47]'
                  }`}
                  title="Switch to Carto Positron GIS"
                >
                  <span className="material-symbols-outlined text-[15px]">layers</span>
                  <span>Carto GIS</span>
                </button>
              </div>

              <button
                onClick={() => setLayers({ ...layers, metroCorridors: true, busRoutes: true, wardBoundaries: true })}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#005B47] text-white text-xs font-bold shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">commute</span>
                <span>{t.filterMultiModal}</span>
              </button>
              <button
                onClick={() => setLayers({ ...layers, metroCorridors: true, busRoutes: false, suburbanRail: false })}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[#3F4944] hover:bg-[#E6F1E7] text-xs font-semibold"
              >
                <span className="material-symbols-outlined text-[18px]">directions_subway</span>
                <span>{t.filterMetro}</span>
              </button>
              <button
                onClick={() => setLayers({ ...layers, metroCorridors: false, busRoutes: true, busStops: true })}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[#3F4944] hover:bg-[#E6F1E7] text-xs font-semibold"
              >
                <span className="material-symbols-outlined text-[18px]">directions_bus</span>
                <span>{t.filterBus}</span>
              </button>
              <button
                onClick={() => setActiveTab('plannertools')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[#3F4944] hover:bg-[#E6F1E7] text-xs font-semibold"
              >
                <span className="material-symbols-outlined text-[18px]">location_city</span>
                <span>{t.filterWardAnalytics}</span>
              </button>
            </div>

            {/* FLOATING RIGHT: Entity Inspector Card */}
            {isInspectorOpen && (selectedWard || selectedStation) && (
              <div className="absolute top-5 right-5 z-20 w-96 flex flex-col bg-white rounded-xl shadow-xl border border-[#E4E8E2] overflow-hidden">
                {/* Banner */}
                <div className="relative h-28 bg-[#ECF6ED] flex items-end p-4 border-b border-[#E4E8E2]">
                  <div className="relative z-10 flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#005B47] text-white">
                        {selectedStation ? selectedStation.type.toUpperCase() : selectedWard?.zone}
                      </span>
                      <span className="text-[11px] text-[#3F4944] font-semibold">
                        {selectedStation ? selectedStation.lines.join(' • ') : `Tract ${selectedWard?.censusTract}`}
                      </span>
                    </div>
                    <h2 className="text-xl font-extrabold text-[#151E18] leading-tight">
                      {selectedStation
                        ? (language === 'EN' ? selectedStation.name : selectedStation.tamilName)
                        : (language === 'EN' ? selectedWard?.name.split(' — ')[1] : selectedWard?.tamilName)}
                    </h2>
                    <span className="text-xs text-[#3F4944]">
                      {selectedStation
                        ? (language === 'EN' ? selectedStation.tamilName : selectedStation.name)
                        : (language === 'EN' ? selectedWard?.tamilName : selectedWard?.name)}
                    </span>
                  </div>
                  <button
                    onClick={() => setIsInspectorOpen(false)}
                    className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-white text-[#3F4944] hover:bg-[#E6F1E7] flex items-center justify-center cursor-pointer shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>

                {/* Body */}
                <div className="p-4 flex flex-col gap-3.5 text-xs">
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#ECF6ED]">
                    <span className="material-symbols-outlined text-[18px] text-[#005B47]">verified</span>
                    <span className="text-[#3F4944] flex-1">
                      {t.verifiedGeom}
                    </span>
                  </div>

                  {selectedWard && (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2.5 rounded-lg bg-[#ECF6ED] flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-[#3F4944]">{t.transitCoverage}</span>
                        <span className="text-base font-extrabold text-[#005B47] mt-0.5">{selectedWard.transitCoverage}</span>
                        <span className="text-[10px] text-[#6D7770]">{selectedWard.coverageTier}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#ECF6ED] flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-[#3F4944]">{t.mtcBusStops}</span>
                        <span className="text-base font-extrabold text-[#151E18] font-mono mt-0.5">{selectedWard.busStopsCount} {t.stopsLabel}</span>
                        <span className="text-[10px] text-[#6D7770]">{t.avgHeadwayLabel} {selectedWard.avgHeadwayMinutes}m</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#ECF6ED] flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-[#3F4944]">{t.metroStationsLabel}</span>
                        <span className="text-base font-extrabold text-[#386477] font-mono mt-0.5">{selectedWard.metroStationsCount} {t.nodesLabel}</span>
                        <span className="text-[10px] text-[#6D7770]">{t.blueGreenAlignment}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#ECF6ED] flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-[#3F4944]">{t.walkShed400m}</span>
                        <span className="text-base font-extrabold text-[#005B47] font-mono mt-0.5">{selectedWard.walkShed400m}%</span>
                        <span className="text-[10px] text-[#6D7770]">{t.walkShedDesc}</span>
                      </div>
                    </div>
                  )}

                  {selectedWard && (
                    <div className="p-3 rounded-lg bg-[#ECF6ED] flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#151E18] uppercase">{t.repCommute}</span>
                        <span className="text-[11px] font-bold text-[#005B47]">MTC / Metro</span>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <span className="font-mono text-base font-bold text-[#151E18]">{selectedWard.representativeFare}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">
                          {selectedWard.greenCommuteShare}% {t.greenShare}
                        </span>
                      </div>
                      {/* Modal split bar */}
                      <div className="w-full h-2 rounded-full overflow-hidden flex bg-[#DBE5DC]">
                        <div style={{ width: `${selectedWard.modalSplit.mtcBus}%` }} className="bg-[#005B47]" title="Bus"></div>
                        <div style={{ width: `${selectedWard.modalSplit.metro}%` }} className="bg-[#386477]" title="Metro"></div>
                        <div style={{ width: `${selectedWard.modalSplit.suburban}%` }} className="bg-[#245848]" title="Rail"></div>
                        <div style={{ width: `${selectedWard.modalSplit.autoWalk}%` }} className="bg-amber-600" title="Auto/Walk"></div>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-[#6D7770]">
                        <span>MTC {selectedWard.modalSplit.mtcBus}%</span>
                        <span>Metro {selectedWard.modalSplit.metro}%</span>
                        <span>Rail {selectedWard.modalSplit.suburban}%</span>
                        <span>Walk {selectedWard.modalSplit.autoWalk}%</span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => {
                        if (selectedWard) setOrigin(selectedWard.name.split(' — ')[1]);
                        setActiveTab('planner');
                      }}
                      className="flex-1 h-10 rounded-lg bg-[#005B47] hover:bg-[#28745E] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">route</span>
                      <span>{t.planFromHere}</span>
                    </button>
                    <button
                      onClick={() => setServiceStatusToast(`Comparing ${selectedWard?.name} transit coverage (Walk shed ${selectedWard?.walkShed400m}%, Headway ${selectedWard?.avgHeadwayMinutes}m) against Greater Chennai benchmarks.`)}
                      className="h-10 px-3.5 rounded-lg bg-[#ECF6ED] hover:bg-[#E1EBE1] text-[#151E18] text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">compare_arrows</span>
                      <span>{t.compareBtn}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom-left Legend */}
            <div className="absolute bottom-12 left-5 z-20 hidden lg:flex items-center gap-4 px-3.5 py-2 rounded-lg bg-white/95 backdrop-blur shadow-sm border border-[#E4E8E2] text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-1.5 rounded-full bg-[#386477]"></span>
                <span className="text-[#151E18] font-medium">{t.legendCmrlBlue}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-1.5 rounded-full bg-[#005B47]"></span>
                <span className="text-[#151E18] font-medium">{t.legendCmrlGreen}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-1 border-b-2 border-dashed border-[#245848]"></span>
                <span className="text-[#151E18] font-medium">{t.legendMtc}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#A7F2D6] border border-[#005B47]"></span>
                <span className="text-[#151E18] font-medium">{t.legendShed}</span>
              </div>
            </div>

            {/* Fixed Status Bar at Bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-9 z-30 bg-white/95 backdrop-blur px-5 flex items-center justify-between text-xs text-[#3F4944] border-t border-[#E4E8E2]">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="font-bold text-[#151E18]">1 km</span>
                  <div className="w-12 h-1 border-b border-l border-r border-[#151E18]"></div>
                  <span>0.6 mi</span>
                </div>
                <div className="h-3 w-px bg-[#E4E8E2]"></div>
                <div className="hidden sm:flex items-center gap-1 font-mono">
                  <span className="material-symbols-outlined text-[14px]">pin_drop</span>
                  <span className="text-[#151E18]">13.0827° N, 80.2707° E</span>
                  <span>(EPSG:4326 WGS84)</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#ECF6ED]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#005B47]"></span>
                  <span className="font-mono text-[#151E18]">GTFS: Oct 2026 Validated</span>
                </div>
                <span className="hidden md:inline text-[11px] text-[#6D7770]">
                  © MapTiler © OpenStreetMap © GCC GIS Server
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* 4. Plan a Journey View */}
        {activeTab === 'planner' && (
          <motion.div
            key="tab-planner"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="flex-1 p-6 lg:p-8 max-w-6xl mx-auto w-full"
          >
            <div className="mb-6">
              <h1 className="text-3xl font-extrabold text-[#151E18] tracking-tight">{t.planJourneyTitle}</h1>
              <p className="text-sm text-[#3F4944]">
                {t.planJourneySub}
              </p>
            </div>

            {/* From / To Search Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E4E8E2] mb-8">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                {/* From input */}
                <div className="md:col-span-5 relative">
                  <label className="block text-xs font-bold text-[#3F4944] uppercase mb-1">{t.fromLabel}</label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-[#005B47] text-[18px]">radio_button_checked</span>
                    <input
                      type="text"
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      className="w-full h-11 pl-10 pr-3 rounded-xl bg-[#ECF6ED] text-sm font-semibold text-[#151E18] focus:bg-white focus:ring-2 focus:ring-[#005B47] outline-none border-none"
                    />
                  </div>
                </div>

                {/* Swap button */}
                <div className="md:col-span-2 flex justify-center pt-5">
                  <button
                    onClick={handleSwapLocations}
                    className="w-10 h-10 rounded-full bg-[#ECF6ED] hover:bg-[#E1EBE1] text-[#005B47] flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                    title={t.swapLocations}
                  >
                    <span className="material-symbols-outlined text-[20px]">swap_horiz</span>
                  </button>
                </div>

                {/* To input */}
                <div className="md:col-span-5 relative">
                  <label className="block text-xs font-bold text-[#3F4944] uppercase mb-1">{t.toLabel}</label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-red-600 text-[18px]">location_on</span>
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full h-11 pl-10 pr-3 rounded-xl bg-[#ECF6ED] text-sm font-semibold text-[#151E18] focus:bg-white focus:ring-2 focus:ring-[#005B47] outline-none border-none"
                    />
                  </div>
                </div>
              </div>

              {/* Preferences Chips */}
              <div className="mt-5 pt-4 border-t border-[#E4E8E2] flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-[#3F4944] mr-1">{t.prioritize}</span>
                  <button
                    onClick={() => setSelectedPreference('balanced')}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                      selectedPreference === 'balanced'
                        ? 'bg-[#005B47] text-white shadow-xs'
                        : 'bg-[#ECF6ED] text-[#3F4944] hover:bg-[#E1EBE1]'
                    }`}
                  >
                    {t.prefBalanced}
                  </button>
                  <button
                    onClick={() => setSelectedPreference('cheapest')}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                      selectedPreference === 'cheapest'
                        ? 'bg-[#005B47] text-white shadow-xs'
                        : 'bg-[#ECF6ED] text-[#3F4944] hover:bg-[#E1EBE1]'
                    }`}
                  >
                    {t.prefSpendLess}
                  </button>
                  <button
                    onClick={() => setSelectedPreference('fastest')}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                      selectedPreference === 'fastest'
                        ? 'bg-[#005B47] text-white shadow-xs'
                        : 'bg-[#ECF6ED] text-[#3F4944] hover:bg-[#E1EBE1]'
                    }`}
                  >
                    {t.prefReachFaster}
                  </button>
                  <button
                    onClick={() => setSelectedPreference('green')}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                      selectedPreference === 'green'
                        ? 'bg-[#005B47] text-white shadow-xs'
                        : 'bg-[#ECF6ED] text-[#3F4944] hover:bg-[#E1EBE1]'
                    }`}
                  >
                    {t.prefTravelGreener}
                  </button>
                  <button
                    onClick={() => setSelectedPreference('walk_less')}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                      selectedPreference === 'walk_less'
                        ? 'bg-[#005B47] text-white shadow-xs'
                        : 'bg-[#ECF6ED] text-[#3F4944] hover:bg-[#E1EBE1]'
                    }`}
                  >
                    {t.prefWalkLess}
                  </button>
                </div>

                <div className="text-xs text-[#6D7770] font-mono">
                  Origin: GCC Ward 104 • Dest: GCC Ward 172
                </div>
              </div>
            </div>

            {/* Route Comparison 3 Option Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {SAMPLE_JOURNEYS.map((opt) => {
                const isSelected = activeRouteDetail?.id === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setActiveRouteDetail(opt)}
                    className={`bg-white rounded-2xl p-5 border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#005B47] shadow-md ring-1 ring-[#005B47]'
                        : 'border-[#E4E8E2] hover:border-[#BEC9C3] hover:shadow-sm'
                    }`}
                  >
                    <div className="absolute -top-3 left-4 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs" style={{ backgroundColor: opt.tagColor }}>
                      {language === 'EN' ? opt.tag : opt.type === 'cheapest' ? 'மலிவான வழி' : opt.type === 'fastest' ? 'விரைவான வழி' : 'சமநிலையான வழி'}
                    </div>

                    <div>
                      <div className="flex justify-between items-baseline mb-2 pt-1">
                        <span className="text-base font-bold text-[#151E18]">
                          {language === 'EN' ? opt.title : opt.type === 'cheapest' ? 'MTC பேருந்து 23C / 570' : opt.type === 'fastest' ? 'மெட்ரோ + ஃபீடர் ஆட்டோ' : 'மெட்ரோ + MTC இணைப்பு பேருந்து'}
                        </span>
                        <span className="text-xl font-bold font-mono text-[#005B47]">₹{opt.totalFare}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[#6D7770] mb-3">
                        <span>⏱ {opt.durationMinutes} {t.minsUnit}</span>
                        <span>🌱 {opt.co2Kg} kg CO₂</span>
                        <span>🚶 {opt.walkMeters}m {t.walkUnit}</span>
                      </div>
                      <p className="text-xs text-[#3F4944] leading-relaxed mb-4">
                        {language === 'EN' ? opt.subtitle : opt.type === 'cheapest' ? 'நேரடி சாதாரண/டீலக்ஸ் சேவை. குறைந்த கட்டணம்.' : opt.type === 'fastest' ? 'கிண்டி சந்திப்பு வழியாக விரைவு ஆட்டோ இணைப்பு.' : 'வெப்பக் குறைப்பு, நேரம் & கட்டணத்தின் சிறந்த சமநிலை.'}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#E4E8E2] flex items-center justify-between text-xs font-semibold">
                      <span className="text-[#005B47]">
                        {opt.transfersCount === 0 ? t.directTransit : `${opt.transfersCount} ${t.transferLabel}`}
                      </span>
                      <span className="text-[#386477]">{t.viewDetails}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Step-by-Step Guidance Timeline for Selected Itinerary */}
            {activeRouteDetail && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#E4E8E2]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E4E8E2]">
                  <div>
                    <div className="inline-block px-2 py-0.5 rounded text-[11px] font-bold text-white mb-2 uppercase" style={{ backgroundColor: activeRouteDetail.tagColor }}>
                      {language === 'EN' ? activeRouteDetail.tag : activeRouteDetail.type === 'cheapest' ? 'மலிவான வழி' : activeRouteDetail.type === 'fastest' ? 'விரைவான வழி' : 'சமநிலையான வழி'}
                    </div>
                    <h3 className="text-2xl font-bold text-[#151E18]">
                      {language === 'EN' ? activeRouteDetail.title : activeRouteDetail.type === 'cheapest' ? 'MTC பேருந்து 23C / 570' : activeRouteDetail.type === 'fastest' ? 'மெட்ரோ + ஃபீடர் ஆட்டோ' : 'மெட்ரோ + MTC AC-ஃபீடர்'}
                    </h3>
                    <p className="text-xs text-[#6D7770] mt-1">{activeRouteDetail.summary}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => {
                        setSavedRoutesList((prev) => [
                          ...prev,
                          {
                            id: Date.now().toString(),
                            titleEN: `${origin} to ${destination}`,
                            titleTA: `${origin} முதல் ${destination} வரை`,
                            from: origin,
                            fromTA: origin,
                            to: destination,
                            toTA: destination,
                            modeEN: activeRouteDetail.title,
                            modeTA: activeRouteDetail.title,
                            fare: `₹${activeRouteDetail.totalFare}`,
                            durationEN: `${activeRouteDetail.durationMinutes} min`,
                            durationTA: `${activeRouteDetail.durationMinutes} நிமி`,
                          },
                        ]);
                        setServiceStatusToast(language === 'EN' ? 'Route saved to My Places & Routes!' : 'வழித்தடம் சேமித்த வழிகளில் சேர்க்கப்பட்டது!');
                      }}
                      className="px-4 py-2 rounded-lg border border-[#005B47] text-[#005B47] hover:bg-[#E6F1E7] text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">bookmark_add</span>
                      <span>{t.saveRouteBtn}</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setActiveTab('spending')}
                      className="px-4 py-2 rounded-lg bg-[#005B47] text-white hover:bg-[#28745E] text-xs font-bold transition cursor-pointer"
                    >
                      {t.calculateSpendBtn}
                    </motion.button>
                  </div>
                </div>

                {/* Ordered Timeline */}
                <div className="mt-6 space-y-6">
                  {activeRouteDetail.steps.map((step, idx) => (
                    <div key={idx} className="flex gap-4">
                      {/* Step Indicator Node */}
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-[#ECF6ED] border-2 border-[#005B47] flex items-center justify-center text-[#005B47] font-bold text-xs">
                          {step.order}
                        </div>
                        {idx < activeRouteDetail.steps.length - 1 && (
                          <div className="w-0.5 h-full bg-[#E4E8E2] my-1"></div>
                        )}
                      </div>

                      {/* Step Content */}
                      <div className="flex-1 pb-4">
                        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                          <h4 className="text-sm font-bold text-[#151E18]">
                            {language === 'EN' ? step.instruction : step.tamilInstruction}
                          </h4>
                          <span className="text-xs font-mono font-bold text-[#005B47]">
                            {step.fare ? `₹${step.fare} · ${step.duration}` : step.duration}
                          </span>
                        </div>
                        <p className="text-xs text-[#005B47] font-medium mt-0.5">
                          {language === 'EN' ? step.tamilInstruction : step.instruction}
                        </p>
                        <p className="text-xs text-[#6D7770] mt-1">{step.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* 5. Saved Routes View */}
        {activeTab === 'saved' && (
          <motion.div
            key="tab-saved"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="flex-1 p-6 lg:p-8 max-w-5xl mx-auto w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-extrabold text-[#151E18] tracking-tight">{t.savedTitle}</h1>
                <p className="text-sm text-[#3F4944]">
                  {t.savedSub}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setActiveTab('planner')}
                className="px-4 py-2 rounded-lg bg-[#005B47] text-white hover:bg-[#28745E] text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>{t.planNewRoute}</span>
              </motion.button>
            </div>

            {/* Quick destination chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {POPULAR_LOCATIONS.slice(0, 4).map((loc, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setDestination(loc.name);
                    setActiveTab('planner');
                  }}
                  className="bg-white p-4 rounded-xl border border-[#E4E8E2] hover:border-[#005B47] shadow-xs cursor-pointer transition-all"
                >
                  <span className="text-xs font-bold text-[#005B47] block uppercase">{loc.type}</span>
                  <span className="text-sm font-bold text-[#151E18]">{loc.name}</span>
                  <span className="text-[11px] text-[#6D7770] block mt-0.5">{loc.zone}</span>
                </motion.div>
              ))}
            </div>

            {/* Saved List */}
            <div className="space-y-4">
              {savedRoutesList.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-5 rounded-2xl border border-[#E4E8E2] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#ECF6ED] flex items-center justify-center text-[#005B47]">
                      <span className="material-symbols-outlined text-[22px]">route</span>
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-[#151E18]">
                        {language === 'EN' ? item.titleEN : item.titleTA}
                      </h4>
                      <p className="text-xs text-[#6D7770]">
                        {(language === 'EN' ? item.from : item.fromTA)} → {(language === 'EN' ? item.to : item.toTA)}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] font-semibold text-[#005B47]">
                          {language === 'EN' ? item.modeEN : item.modeTA}
                        </span>
                        <span className="text-[11px] text-[#6D7770]">·</span>
                        <span className="text-[11px] font-mono text-[#151E18] font-bold">{item.fare}</span>
                        <span className="text-[11px] text-[#6D7770]">·</span>
                        <span className="text-[11px] text-[#6D7770]">
                          {language === 'EN' ? item.durationEN : item.durationTA}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => {
                        setOrigin(item.from);
                        setDestination(item.to);
                        setActiveTab('planner');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#005B47] text-white hover:bg-[#28745E] text-xs font-bold transition cursor-pointer"
                    >
                      {t.findLiveRoutes}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSavedRoutesList(savedRoutesList.filter((r) => r.id !== item.id))}
                      className="p-1.5 text-gray-400 hover:text-red-600 transition cursor-pointer"
                      title={t.deleteRoute}
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </motion.button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 6. Commute Spending & Eco Impact View */}
        {activeTab === 'spending' && (
          <motion.div
            key="tab-spending"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="flex-1 p-6 lg:p-8 max-w-5xl mx-auto w-full"
          >
            <div className="mb-6">
              <h1 className="text-3xl font-extrabold text-[#151E18] tracking-tight">{t.spendingTitle}</h1>
              <p className="text-sm text-[#3F4944]">
                {t.spendingSub}
              </p>
            </div>

            {/* Calculations Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#E4E8E2] mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E4E8E2]">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#005B47]">{t.commuteProfile}</span>
                  <h3 className="text-xl font-bold text-[#151E18]">Anna Nagar West ↔ TIDEL Park {t.roundTrip}</h3>
                </div>
                {/* Period switch */}
                <div className="inline-flex p-1 bg-[#ECF6ED] rounded-lg">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedTimePeriod('daily')}
                    className={`px-3 py-1 rounded text-xs font-bold transition cursor-pointer ${
                      selectedTimePeriod === 'daily' ? 'bg-white text-[#005B47] shadow-xs' : 'text-[#3F4944]'
                    }`}
                  >
                    {t.periodDaily}
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedTimePeriod('weekly')}
                    className={`px-3 py-1 rounded text-xs font-bold transition cursor-pointer ${
                      selectedTimePeriod === 'weekly' ? 'bg-white text-[#005B47] shadow-xs' : 'text-[#3F4944]'
                    }`}
                  >
                    {t.periodWeekly}
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedTimePeriod('monthly')}
                    className={`px-3 py-1 rounded text-xs font-bold transition cursor-pointer ${
                      selectedTimePeriod === 'monthly' ? 'bg-white text-[#005B47] shadow-xs' : 'text-[#3F4944]'
                    }`}
                  >
                    {t.periodMonthly}
                  </motion.button>
                </div>
              </div>

              {/* Slider for Days per week */}
              <div className="py-4 border-b border-[#E4E8E2] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#151E18]">{t.commuteFreq}</span>
                  <span className="text-xs text-[#6D7770] block">{t.commuteFreqSub}</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="7"
                    value={commuteDaysPerWeek}
                    onChange={(e) => setCommuteDaysPerWeek(Number(e.target.value))}
                    className="w-32 accent-[#005B47]"
                  />
                  <span className="text-sm font-bold font-mono text-[#005B47] w-12">{commuteDaysPerWeek} {t.daysLabel}</span>
                </div>
              </div>

              {/* Comparison Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                {/* Public Transit Choice */}
                <div className="p-5 rounded-2xl bg-[#ECF6ED] border border-[#005B47]/30 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#005B47] px-2 py-0.5 rounded bg-emerald-100">
                      {t.transitChoiceTitle}
                    </span>
                    <div className="mt-3">
                      <span className="text-3xl font-extrabold font-mono text-[#005B47]">
                        ₹{selectedTimePeriod === 'daily' ? 72 : selectedTimePeriod === 'weekly' ? 72 * commuteDaysPerWeek : 72 * commuteDaysPerWeek * 4.3}
                      </span>
                      <span className="text-xs text-[#3F4944] block mt-0.5">{t.transitCostSub}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#005B47]/20 text-xs text-[#005B47] font-semibold">
                    🌱 0.8 {t.co2PerRoundTrip}
                  </div>
                </div>

                {/* Private Car / Cab */}
                <div className="p-5 rounded-2xl bg-white border border-[#E4E8E2] flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#6D7770] px-2 py-0.5 rounded bg-gray-100">
                      {t.cabTitle}
                    </span>
                    <div className="mt-3">
                      <span className="text-3xl font-extrabold font-mono text-[#151E18]">
                        ₹{selectedTimePeriod === 'daily' ? 440 : selectedTimePeriod === 'weekly' ? 440 * commuteDaysPerWeek : 440 * commuteDaysPerWeek * 4.3}
                      </span>
                      <span className="text-xs text-[#6D7770] block mt-0.5">{t.cabRateSub}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#E4E8E2] text-xs text-red-600 font-semibold">
                    🔥 5.4 {t.co2PerRoundTrip}
                  </div>
                </div>

                {/* Savings Nudge */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-[#174D3D] to-[#005B47] text-white flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                      {t.netSavingsTitle}
                    </span>
                    <div className="mt-3">
                      <span className="text-3xl font-extrabold font-mono text-emerald-300">
                        ₹{selectedTimePeriod === 'daily' ? 368 : selectedTimePeriod === 'weekly' ? 368 * commuteDaysPerWeek : Math.round(368 * commuteDaysPerWeek * 4.3)}
                      </span>
                      <span className="text-xs text-emerald-100 block mt-0.5">{t.savedInPocket}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/20 text-xs font-semibold text-emerald-200">
                    🌳 {t.avoidsMonthly} {Math.round(4.6 * commuteDaysPerWeek * 4.3)} {t.co2MonthlyUnit}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 7. Planner Workspace (CUMTA PS7 Tools) */}
        {activeTab === 'plannertools' && (
          <motion.div
            key="tab-plannertools"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="flex-1 p-6 lg:p-8 max-w-6xl mx-auto w-full"
          >
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#005B47] text-white text-xs font-bold uppercase tracking-wider mb-2">
                  {t.plannerToolsTag}
                </div>
                <h1 className="text-3xl font-extrabold text-[#151E18] tracking-tight">
                  {t.plannerToolsTitle}
                </h1>
                <p className="text-sm text-[#3F4944]">
                  {t.plannerToolsSub}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-[#6D7770] font-mono">Model: CMP-2026-v2</span>
              </div>
            </div>

            {/* Scenario Builder Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#E4E8E2] mb-8">
              <h3 className="text-xl font-bold text-[#151E18] mb-4">
                {t.scenario1Title}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-[#151E18] mb-1">
                    {t.headwayReductLabel} {scenarioHeadwayReduction}%
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    value={scenarioHeadwayReduction}
                    onChange={(e) => setScenarioHeadwayReduction(Number(e.target.value))}
                    className="w-full accent-[#005B47]"
                  />
                  <div className="flex justify-between text-[11px] text-[#6D7770] mt-1">
                    <span>{t.headwayMin}</span>
                    <span>{t.headwayMax}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#151E18] mb-1">
                    {t.feederLoopsLabel} {scenarioFeederBuses} {t.unitsLabel}
                  </label>
                  <input
                    type="range"
                    min="4"
                    max="24"
                    value={scenarioFeederBuses}
                    onChange={(e) => setScenarioFeederBuses(Number(e.target.value))}
                    className="w-full accent-[#005B47]"
                  />
                  <div className="flex justify-between text-[11px] text-[#6D7770] mt-1">
                    <span>{t.loopsMin}</span>
                    <span>{t.loopsMax}</span>
                  </div>
                </div>
              </div>

              {/* Before vs After Impact Box */}
              <div className="mt-8 pt-6 border-t border-[#E4E8E2] grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-4 rounded-xl bg-[#ECF6ED] border border-[#005B47]/20">
                  <span className="text-xs text-[#3F4944] font-semibold block">{t.avgWaitTime}</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-bold font-mono text-[#005B47]">
                      {Math.round(8.5 * (1 - scenarioHeadwayReduction / 100))} {t.minsUnit}
                    </span>
                    <span className="text-xs text-[#6D7770] line-through">8.5 {t.minsUnit}</span>
                  </div>
                  <span className="text-[11px] text-[#005B47] font-bold block mt-1">
                    ↓ -{scenarioHeadwayReduction}% {t.waitReduction}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#ECF6ED] border border-[#005B47]/20">
                  <span className="text-xs text-[#3F4944] font-semibold block">{t.walkAccessibility}</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-bold font-mono text-[#005B47]">
                      {Math.min(74 + Math.round(scenarioFeederBuses * 0.8), 96)}%
                    </span>
                    <span className="text-xs text-[#6D7770]">Baseline: 74%</span>
                  </div>
                  <span className="text-[11px] text-[#005B47] font-bold block mt-1">
                    ↑ +{Math.round(scenarioFeederBuses * 0.8)}% {t.popReached}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#ECF6ED] border border-[#005B47]/20">
                  <span className="text-xs text-[#3F4944] font-semibold block">{t.projDailyShift}</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-bold font-mono text-[#005B47]">
                      +{Math.round(scenarioHeadwayReduction * 140 + scenarioFeederBuses * 220)}
                    </span>
                    <span className="text-xs text-[#3F4944]">{t.tripsPerDay}</span>
                  </div>
                  <span className="text-[11px] text-[#005B47] font-bold block mt-1">
                    {t.modalShiftDesc}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </div>
  );
};
