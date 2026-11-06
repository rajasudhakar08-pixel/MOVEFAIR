export interface ChennaiStation {
  id: string;
  name: string;
  tamilName: string;
  type: 'metro' | 'suburban' | 'bus_terminus' | 'hub';
  lines: string[];
  x: number; // SVG coordinate (0 - 1600)
  y: number; // SVG coordinate (0 - 1000)
  zone?: string;
  interchange: boolean;
}

export interface ChennaiWard {
  id: string;
  wardNumber: number;
  name: string;
  tamilName: string;
  zone: string;
  zoneNumber: number;
  censusTract: string;
  transitCoverage: 'High' | 'Medium' | 'Low';
  coverageTier: string;
  busStopsCount: number;
  metroStationsCount: number;
  walkShed400m: number; // percentage
  avgHeadwayMinutes: number;
  points: string; // SVG polygon points
  centroid: { x: number; y: number };
  representativeFare: string;
  greenCommuteShare: number; // percentage
  modalSplit: {
    mtcBus: number;
    metro: number;
    suburban: number;
    autoWalk: number;
  };
}

export interface TransitRouteOption {
  id: string;
  type: 'cheapest' | 'fastest' | 'balanced' | 'green';
  title: string;
  subtitle: string;
  totalFare: number;
  durationMinutes: number;
  co2Kg: number;
  walkMeters: number;
  transfersCount: number;
  tag: string;
  tagColor: string;
  summary: string;
  steps: {
    order: number;
    mode: 'walk' | 'bus' | 'metro' | 'train' | 'rapido';
    instruction: string;
    tamilInstruction: string;
    detail: string;
    duration: string;
    fare?: number;
    distance?: string;
  }[];
}

export const CHENNAI_STATIONS: ChennaiStation[] = [
  {
    id: 'central',
    name: 'Chennai Central (Puratchi Thalaivar Dr. MGR)',
    tamilName: 'சென்ட்ரல் ரயில் நிலையம்',
    type: 'hub',
    lines: ['CMRL Blue Line', 'CMRL Green Line', 'Southern Railway Main'],
    x: 1120,
    y: 285,
    zone: 'Zone V (Royapuram)',
    interchange: true,
  },
  {
    id: 'govt-estate',
    name: 'Government Estate',
    tamilName: 'அரசினர் தோட்டம்',
    type: 'metro',
    lines: ['CMRL Blue Line'],
    x: 1030,
    y: 360,
    zone: 'Zone IX',
    interchange: false,
  },
  {
    id: 'thousand-lights',
    name: 'Thousand Lights',
    tamilName: 'ஆயிரம் விளக்கு',
    type: 'metro',
    lines: ['CMRL Blue Line'],
    x: 930,
    y: 470,
    zone: 'Zone IX (Ward 114)',
    interchange: false,
  },
  {
    id: 'cmbt',
    name: 'CMBT Koyambedu Terminal',
    tamilName: 'கோயம்பேடு பேருந்து முனையம்',
    type: 'bus_terminus',
    lines: ['CMRL Green Line', 'MTC Major Hub'],
    x: 460,
    y: 330,
    zone: 'Zone X (Koyambedu)',
    interchange: true,
  },
  {
    id: 'vadapalani',
    name: 'Vadapalani Hub',
    tamilName: 'வடபழனி',
    type: 'metro',
    lines: ['CMRL Green Line', 'MTC Depot'],
    x: 560,
    y: 510,
    zone: 'Zone X',
    interchange: true,
  },
  {
    id: 'guindy',
    name: 'Guindy Intermodal Hub',
    tamilName: 'கிண்டி',
    type: 'hub',
    lines: ['CMRL Blue Line', 'Southern Railway Suburban', 'MTC Radial'],
    x: 730,
    y: 720,
    zone: 'Zone XIII',
    interchange: true,
  },
  {
    id: 'alandur',
    name: 'Alandur (Kathipara Junction)',
    tamilName: 'ஆலந்தூர் (கத்திப்பாரா சந்திப்பு)',
    type: 'hub',
    lines: ['CMRL Blue Line', 'CMRL Green Line', 'GST Arterial Bus'],
    x: 670,
    y: 770,
    zone: 'Zone XII (Alandur)',
    interchange: true,
  },
  {
    id: 'tidel',
    name: 'TIDEL Park (Taramani)',
    tamilName: 'டைடல் பார்க்',
    type: 'suburban',
    lines: ['MRTS Rail', 'OMR Express Feeder'],
    x: 1090,
    y: 920,
    zone: 'Zone XIII',
    interchange: true,
  },
  {
    id: 'tambaram',
    name: 'Tambaram Gateway',
    tamilName: 'தாம்பரம்',
    type: 'hub',
    lines: ['Southern Railway', 'MTC South Hub'],
    x: 320,
    y: 990,
    zone: 'Tambaram Corporation',
    interchange: true,
  },
];

export const CHENNAI_WARDS: ChennaiWard[] = [
  {
    id: 'ward-114',
    wardNumber: 114,
    name: 'Ward 114 — Nungambakkam / Thousand Lights',
    tamilName: 'வார்டு 114 — நுங்கம்பாக்கம் / ஆயிரம் விளக்கு',
    zone: 'Zone IX (Teynampet)',
    zoneNumber: 9,
    censusTract: '033',
    transitCoverage: 'High',
    coverageTier: 'Tier 1 (Top 5% in Chennai Metro)',
    busStopsCount: 42,
    metroStationsCount: 2,
    walkShed400m: 84,
    avgHeadwayMinutes: 3.8,
    points: '820,440 920,420 980,480 940,590 860,600 790,530',
    centroid: { x: 885, y: 510 },
    representativeFare: '₹18 — ₹32',
    greenCommuteShare: 68,
    modalSplit: {
      mtcBus: 54,
      metro: 26,
      suburban: 12,
      autoWalk: 8,
    },
  },
  {
    id: 'ward-115',
    wardNumber: 115,
    name: 'Ward 115 — T. Nagar / Panagal Park',
    tamilName: 'வார்டு 115 — தி.நகர் / பனகல் பூங்கா',
    zone: 'Zone X (Kodambakkam)',
    zoneNumber: 10,
    censusTract: '034',
    transitCoverage: 'High',
    coverageTier: 'Tier 1 (Dense Retail Hub)',
    busStopsCount: 38,
    metroStationsCount: 1,
    walkShed400m: 79,
    avgHeadwayMinutes: 4.2,
    points: '860,600 940,590 990,690 890,720 810,660',
    centroid: { x: 890, y: 650 },
    representativeFare: '₹15 — ₹30',
    greenCommuteShare: 64,
    modalSplit: {
      mtcBus: 60,
      metro: 18,
      suburban: 14,
      autoWalk: 8,
    },
  },
  {
    id: 'ward-160',
    wardNumber: 160,
    name: 'Ward 160 — Alandur / Kathipara Cloverleaf',
    tamilName: 'வார்டு 160 — ஆலந்தூர் / கத்திப்பாரா',
    zone: 'Zone XII (Alandur)',
    zoneNumber: 12,
    censusTract: '051',
    transitCoverage: 'High',
    coverageTier: 'Multi-Modal Junction',
    busStopsCount: 29,
    metroStationsCount: 2,
    walkShed400m: 82,
    avgHeadwayMinutes: 3.5,
    points: '610,720 730,710 740,820 620,830',
    centroid: { x: 675, y: 770 },
    representativeFare: '₹20 — ₹40',
    greenCommuteShare: 72,
    modalSplit: {
      mtcBus: 48,
      metro: 34,
      suburban: 10,
      autoWalk: 8,
    },
  },
  {
    id: 'ward-104',
    wardNumber: 104,
    name: 'Ward 104 — Anna Nagar West',
    tamilName: 'வார்டு 104 — அண்ணா நகர் மேற்கு',
    zone: 'Zone VIII (Anna Nagar)',
    zoneNumber: 8,
    censusTract: '028',
    transitCoverage: 'Medium',
    coverageTier: 'Tier 2 (Planned Residential Grid)',
    busStopsCount: 31,
    metroStationsCount: 1,
    walkShed400m: 74,
    avgHeadwayMinutes: 6.2,
    points: '690,410 820,440 790,530 680,510 650,450',
    centroid: { x: 730, y: 470 },
    representativeFare: '₹18 — ₹35',
    greenCommuteShare: 59,
    modalSplit: {
      mtcBus: 52,
      metro: 28,
      suburban: 5,
      autoWalk: 15,
    },
  },
  {
    id: 'ward-77',
    wardNumber: 77,
    name: 'Ward 77 — Royapuram / Beach Corridor',
    tamilName: 'வார்டு 77 — ராயபுரம்',
    zone: 'Zone V (Royapuram)',
    zoneNumber: 5,
    censusTract: '018',
    transitCoverage: 'High',
    coverageTier: 'Suburban Port Spine',
    busStopsCount: 36,
    metroStationsCount: 1,
    walkShed400m: 88,
    avgHeadwayMinutes: 4.8,
    points: '820,440 920,420 950,330 830,340',
    centroid: { x: 880, y: 380 },
    representativeFare: '₹10 — ₹25',
    greenCommuteShare: 76,
    modalSplit: {
      mtcBus: 45,
      metro: 15,
      suburban: 32,
      autoWalk: 8,
    },
  },
];

export const SAMPLE_JOURNEYS: TransitRouteOption[] = [
  {
    id: 'opt-cheapest',
    type: 'cheapest',
    title: 'MTC Bus 23C / 570 Radial',
    subtitle: 'Direct ordinary/deluxe service · Lowest daily expenditure',
    totalFare: 18,
    durationMinutes: 54,
    co2Kg: 0.4,
    walkMeters: 350,
    transfersCount: 0,
    tag: 'Cheapest Option',
    tagColor: '#28745E',
    summary: 'Lowest fare option, direct ordinary bus with reliable boarding at Anna Nagar.',
    steps: [
      {
        order: 1,
        mode: 'walk',
        instruction: 'Walk 350m to Anna Nagar West Bus Depot',
        tamilInstruction: 'அண்ணா நகர் மேற்கு பணிமனைக்கு 350 மீ நடக்கவும்',
        detail: 'Paved pedestrian sidewalk along 2nd Avenue',
        duration: '4 mins',
        distance: '350m',
      },
      {
        order: 2,
        mode: 'bus',
        instruction: 'Board MTC Route 570 towards Tidel Park / Kelambakkam',
        tamilInstruction: 'MTC பேருந்து 570-ல் ஏறவும்',
        detail: 'Scheduled departure every 8 mins · Fare Stage 12',
        duration: '46 mins',
        fare: 18,
        distance: '18.2 km',
      },
      {
        order: 3,
        mode: 'walk',
        instruction: 'Alight at TIDEL Park junction and walk 120m to destination entrance',
        tamilInstruction: 'டைடல் பார்க் நிறுத்தத்தில் இறங்கி 120 மீ நடக்கவும்',
        detail: 'Pedestrian signal crossing with zebra crossing',
        duration: '2 mins',
        distance: '120m',
      },
    ],
  },
  {
    id: 'opt-fastest',
    type: 'fastest',
    title: 'CMRL Green Line + Feeder Link',
    subtitle: 'Metro Green Line via Guindy interchange + short last-mile feeder',
    totalFare: 58,
    durationMinutes: 38,
    co2Kg: 0.8,
    walkMeters: 180,
    transfersCount: 1,
    tag: 'Fastest Option',
    tagColor: '#547F93',
    summary: 'Fastest door-to-door transit avoiding GST & Anna Salai peak vehicular bottlenecks.',
    steps: [
      {
        order: 1,
        mode: 'walk',
        instruction: 'Walk 100m to Thirumangalam Metro Station',
        tamilInstruction: 'திருமங்கலம் மெட்ரோ நிலையத்திற்கு 100 மீ நடக்கவும்',
        detail: 'Entry Gate B (Elevator & Step-Free Accessible)',
        duration: '2 mins',
        distance: '100m',
      },
      {
        order: 2,
        mode: 'metro',
        instruction: 'Board CMRL Green Line Train towards St. Thomas Mount / Guindy',
        tamilInstruction: 'CMRL மெட்ரோ பச்சை வழித்தடத்தில் ஏறவும்',
        detail: 'Headway 6 mins · Air-conditioned corridor',
        duration: '24 mins',
        fare: 35,
        distance: '14.5 km',
      },
      {
        order: 3,
        mode: 'rapido',
        instruction: 'Transfer to First/Last-Mile Shared Feeder or Auto to TIDEL Park',
        tamilInstruction: 'டைடல் பார்க்கிற்கு ஷேர் ஆட்டோ / ஃபீடர் இணைப்பில் செல்லவும்',
        detail: 'Pre-fixed fare stage or Rapido feeder estimate',
        duration: '10 mins',
        fare: 23,
        distance: '3.4 km',
      },
      {
        order: 4,
        mode: 'walk',
        instruction: 'Arrive at TIDEL Park main foyer',
        tamilInstruction: 'டைடல் பார்க் வருகை',
        detail: 'Destination reached',
        duration: '2 mins',
        distance: '80m',
      },
    ],
  },
  {
    id: 'opt-balanced',
    type: 'balanced',
    title: 'Metro + MTC AC-Feeder Mini Bus',
    subtitle: 'Optimal trade-off between speed, air-conditioned comfort, and cost',
    totalFare: 36,
    durationMinutes: 43,
    co2Kg: 0.5,
    walkMeters: 220,
    transfersCount: 1,
    tag: 'Balanced (Recommended)',
    tagColor: '#D49A57',
    summary: 'The best balance: cool Metro ride with integrated MTC feeder shuttle directly to gate.',
    steps: [
      {
        order: 1,
        mode: 'walk',
        instruction: 'Walk 140m to Anna Nagar Tower Metro Station',
        tamilInstruction: 'அண்ணா நகர் டவர் மெட்ரோ நிலையத்திற்கு 140 மீ நடக்கவும்',
        detail: 'Well-lit pedestrian pathway',
        duration: '3 mins',
        distance: '140m',
      },
      {
        order: 2,
        mode: 'metro',
        instruction: 'Take CMRL Green Line to Alandur Interchange',
        tamilInstruction: 'ஆலந்தூர் சந்திப்பு வரை CMRL மெட்ரோ ரயிலில் செல்லவும்',
        detail: 'Fast transit across Kathipara junction elevated corridor',
        duration: '22 mins',
        fare: 25,
        distance: '13.1 km',
      },
      {
        order: 3,
        mode: 'bus',
        instruction: 'Transfer to MTC Midi-Bus Feeder Loop (Route S96) to Tidel Park',
        tamilInstruction: 'MTC மினி-பஸ் எஸ்96-ல் ஏறவும்',
        detail: 'Dedicated shuttle connecting Alandur and OMR Tech Corridor',
        duration: '16 mins',
        fare: 11,
        distance: '4.8 km',
      },
      {
        order: 4,
        mode: 'walk',
        instruction: 'Walk 80m into TIDEL Park campus',
        tamilInstruction: '80 மீ வளாகத்திற்குள் நடக்கவும்',
        detail: 'Gate 2 security entrance',
        duration: '2 mins',
        distance: '80m',
      },
    ],
  },
];

export const POPULAR_LOCATIONS = [
  { name: 'Guindy Station', zone: 'Zone XIII', type: 'Metro + Suburban' },
  { name: 'TIDEL Park, OMR', zone: 'Zone XIII', type: 'IT Corridor Hub' },
  { name: 'Anna Nagar West', zone: 'Zone VIII', type: 'Residential Hub' },
  { name: 'Chennai Central', zone: 'Zone V', type: 'Main Terminal' },
  { name: 'Kathipara / Alandur', zone: 'Zone XII', type: 'Cloverleaf Interchange' },
  { name: 'Koyambedu CMBT', zone: 'Zone X', type: 'Bus Terminus' },
  { name: 'Thousand Lights', zone: 'Zone IX', type: 'Anna Salai Arterial' },
  { name: 'Tambaram Gateway', zone: 'Tambaram', type: 'South Rail Interchange' },
];
