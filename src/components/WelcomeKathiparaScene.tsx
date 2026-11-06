/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// Aerial photography assets for Kathipara Junction dayparts
import dawnBg from '../assets/images/kathipara_dawn_aerial_1793910832000.jpg';
import middayBg from '../assets/images/kathipara_daytime_aerial_1793910804534.jpg';
import duskBg from '../assets/images/kathipara_dusk_aerial.png';
import nightBg from '../assets/images/kathipara_night_aerial_1793910819129.jpg';

interface WelcomeKathiparaSceneProps {
  userName: string;
  onOpenExplorer: () => void;
  onPlanJourney: () => void;
  onSavedRoutes: () => void;
  onCommuteSpending: () => void;
  onBackToLanding: () => void;
  language: 'EN' | 'TA';
  setLanguage?: (lang: 'EN' | 'TA') => void;
}

type DaypartMode = 'dawn' | 'midday' | 'dusk' | 'night';

interface ModeProfile {
  time: string;
  ampm: string;
  flowTextEN: string;
  flowTextTA: string;
  weatherIcon: string;
  temp: string;
  weatherDescEN: string;
  weatherDescTA: string;
  footerInfoEN: string;
  footerInfoTA: string;
  trafficDensityMultiplier: number;
  bgImage: string;
  tintOverlay: string;
  ambientLight: number;
}

const PROFILES: Record<DaypartMode, ModeProfile> = {
  dawn: {
    time: '06:00',
    ampm: 'AM',
    flowTextEN: 'Dawn Transit Flow Building',
    flowTextTA: 'விடியற்காலை போக்குவரத்து தொடங்குகிறது',
    weatherIcon: '🌅',
    temp: '24°C',
    weatherDescEN: 'Morning Breeze',
    weatherDescTA: 'காலை தென்றல்',
    footerInfoEN: 'Time-aware simulation · 24°C Morning Breeze · Asia/Kolkata',
    footerInfoTA: 'நேர உணர்வு உருவகப்படுத்துதல் · 24°C காலை தென்றல் · ஆசியா/கொல்கத்தா',
    trafficDensityMultiplier: 0.85,
    bgImage: dawnBg,
    tintOverlay:
      'radial-gradient(circle at 50% 25%, rgba(255, 180, 110, 0.16), rgba(60, 120, 180, 0.08) 55%, rgba(10, 25, 20, 0.25))',
    ambientLight: 0.75,
  },
  midday: {
    time: '12:00',
    ampm: 'PM',
    flowTextEN: 'Peak Multi-Modal Flow Active',
    flowTextTA: 'முழுமையான போக்குவரத்து இயக்கம்',
    weatherIcon: '☀️',
    temp: '32°C',
    weatherDescEN: 'Sunny',
    weatherDescTA: 'வெயில்',
    footerInfoEN: 'Time-aware simulation · 32°C Sunny · Asia/Kolkata',
    footerInfoTA: 'நேர உணர்வு உருவகப்படுத்துதல் · 32°C வெயில் · ஆசியா/கொல்கத்தா',
    trafficDensityMultiplier: 1.15,
    bgImage: middayBg,
    tintOverlay:
      'radial-gradient(circle at 50% 20%, rgba(255, 245, 210, 0.10), rgba(80, 160, 220, 0.05) 60%, rgba(12, 28, 22, 0.20))',
    ambientLight: 1.0,
  },
  dusk: {
    time: '06:42',
    ampm: 'PM',
    flowTextEN: 'Evening Peak Rush Flow Active',
    flowTextTA: 'உச்ச மாலை நெரிசல் போக்குவரத்து',
    weatherIcon: '🌆',
    temp: '28°C',
    weatherDescEN: 'Clear Twilight',
    weatherDescTA: 'தெளிவான அந்தி வானம்',
    footerInfoEN: 'Time-aware simulation · 28°C Clear Twilight · Asia/Kolkata',
    footerInfoTA: 'நேர உணர்வு உருவகப்படுத்துதல் · 28°C தெளிவான அந்தி · ஆசியா/கொல்கத்தா',
    trafficDensityMultiplier: 1.45,
    bgImage: duskBg,
    tintOverlay:
      'radial-gradient(circle at 65% 30%, rgba(255, 120, 50, 0.18), rgba(120, 50, 150, 0.10) 60%, transparent 85%)',
    ambientLight: 0.45,
  },
  night: {
    time: '12:00',
    ampm: 'AM',
    flowTextEN: 'Highway Night Corridor Flow',
    flowTextTA: 'இரவு நெடுஞ்சாலை சீரான போக்குவரத்து',
    weatherIcon: '🌙',
    temp: '26°C',
    weatherDescEN: 'Clear Sky',
    weatherDescTA: 'தெளிவான இரவு வானம்',
    footerInfoEN: 'Time-aware simulation · 26°C Clear Sky · Asia/Kolkata',
    footerInfoTA: 'நேர உணர்வு உருவகப்படுத்துதல் · 26°C தெளிவான இரவு · ஆசியா/கொல்கத்தா',
    trafficDensityMultiplier: 0.8,
    bgImage: nightBg,
    tintOverlay:
      'radial-gradient(circle at 50% 50%, rgba(0, 91, 71, 0.12), transparent 75%)',
    ambientLight: 0.15,
  },
};

// Normalized Point within the 16:9 aerial photography frame (1920x1080)
interface Point {
  x: number;
  y: number;
}

type VehicleType = 'bus' | 'auto' | 'bike' | 'car';

interface RoadLane {
  id: string;
  name: string;
  points: Point[];
  speedFactor: number;
  allowedTypes: VehicleType[];
  isElevated: boolean;
}

/**
 * EXACT GEOMETRY CALIBRATION FOR KATHIPARA JUNCTION AERIAL PHOTOGRAPHS
 * Carefully calibrated to the 16:9 aerial photographs across dawn, midday, dusk, and night.
 */
const ROAD_LANES: RoadLane[] = [
  // 1. Bottom Foreground Arterial - Eastbound (Airport / Guindy approach towards Inner Ring Road)
  {
    id: 'gst_foreground_east',
    name: 'GST Road Foreground Eastbound',
    points: [
      { x: -0.04, y: 0.925 },
      { x: 0.16, y: 0.890 },
      { x: 0.38, y: 0.865 },
      { x: 0.60, y: 0.860 },
      { x: 0.82, y: 0.875 },
      { x: 1.04, y: 0.915 },
    ],
    speedFactor: 1.0,
    allowedTypes: ['bus', 'auto', 'car', 'bike'],
    isElevated: false,
  },
  // 2. Bottom Foreground Arterial - Westbound
  {
    id: 'gst_foreground_west',
    name: 'GST Road Foreground Westbound',
    points: [
      { x: 1.04, y: 0.885 },
      { x: 0.82, y: 0.850 },
      { x: 0.60, y: 0.835 },
      { x: 0.38, y: 0.840 },
      { x: 0.16, y: 0.865 },
      { x: -0.04, y: 0.900 },
    ],
    speedFactor: 0.95,
    allowedTypes: ['bus', 'auto', 'car', 'bike'],
    isElevated: false,
  },
  // 3. Main Central Flyover - Northeast Bound (Airport / Tambaram to Guindy / Anna Salai)
  {
    id: 'main_flyover_ne',
    name: 'Main Flyover Northeast (Airport -> Guindy)',
    points: [
      { x: -0.04, y: 0.755 },
      { x: 0.12, y: 0.680 },
      { x: 0.26, y: 0.595 },
      { x: 0.40, y: 0.525 },
      { x: 0.54, y: 0.465 },
      { x: 0.70, y: 0.415 },
      { x: 0.86, y: 0.365 },
      { x: 1.04, y: 0.320 },
    ],
    speedFactor: 1.25,
    allowedTypes: ['car', 'bus', 'auto', 'bike'],
    isElevated: true,
  },
  // 4. Main Central Flyover - Southwest Bound (Guindy / Anna Salai to Airport / Tambaram)
  {
    id: 'main_flyover_sw',
    name: 'Main Flyover Southwest (Guindy -> Airport)',
    points: [
      { x: 1.04, y: 0.305 },
      { x: 0.86, y: 0.348 },
      { x: 0.70, y: 0.398 },
      { x: 0.54, y: 0.448 },
      { x: 0.40, y: 0.508 },
      { x: 0.26, y: 0.578 },
      { x: 0.12, y: 0.662 },
      { x: -0.04, y: 0.738 },
    ],
    speedFactor: 1.2,
    allowedTypes: ['car', 'bus', 'auto', 'bike'],
    isElevated: true,
  },
  // 5. Transverse Cross Flyover - Southeast Bound (Porur / Mount-Poonamallee to Inner Ring Road)
  {
    id: 'transverse_flyover_se',
    name: 'Cross Flyover Southeast (Porur -> Ekkattuthangal)',
    points: [
      { x: 0.16, y: 0.305 },
      { x: 0.30, y: 0.390 },
      { x: 0.46, y: 0.480 },
      { x: 0.62, y: 0.570 },
      { x: 0.78, y: 0.670 },
      { x: 0.98, y: 0.785 },
    ],
    speedFactor: 1.1,
    allowedTypes: ['car', 'auto', 'bike', 'bus'],
    isElevated: true,
  },
  // 6. Transverse Cross Flyover - Northwest Bound
  {
    id: 'transverse_flyover_nw',
    name: 'Cross Flyover Northwest',
    points: [
      { x: 0.98, y: 0.760 },
      { x: 0.78, y: 0.650 },
      { x: 0.62, y: 0.550 },
      { x: 0.46, y: 0.460 },
      { x: 0.30, y: 0.370 },
      { x: 0.16, y: 0.285 },
    ],
    speedFactor: 1.05,
    allowedTypes: ['car', 'auto', 'bike', 'bus'],
    isElevated: true,
  },
  // 7. Signature Southern Cloverleaf Loop (Encircling the "I LOVE CHENNAI" park garden)
  {
    id: 'south_cloverleaf_loop',
    name: 'Grand South Cloverleaf Loop (I LOVE CHENNAI)',
    points: [
      { x: 0.675, y: 0.565 },
      { x: 0.680, y: 0.655 },
      { x: 0.640, y: 0.755 },
      { x: 0.540, y: 0.825 },
      { x: 0.435, y: 0.825 },
      { x: 0.335, y: 0.775 },
      { x: 0.285, y: 0.685 },
      { x: 0.305, y: 0.595 },
      { x: 0.375, y: 0.535 },
    ],
    speedFactor: 0.85,
    allowedTypes: ['car', 'auto', 'bike'],
    isElevated: true,
  },
  // 8. Western Cloverleaf Loop (Around lush western landscaped knoll)
  {
    id: 'west_cloverleaf_loop',
    name: 'West Cloverleaf Ramp',
    points: [
      { x: 0.350, y: 0.455 },
      { x: 0.250, y: 0.470 },
      { x: 0.175, y: 0.525 },
      { x: 0.185, y: 0.615 },
      { x: 0.265, y: 0.655 },
      { x: 0.345, y: 0.610 },
      { x: 0.385, y: 0.525 },
    ],
    speedFactor: 0.8,
    allowedTypes: ['car', 'auto', 'bike'],
    isElevated: true,
  },
  // 9. Eastern Cloverleaf Loop (Around eastern circular garden)
  {
    id: 'east_cloverleaf_loop',
    name: 'East Cloverleaf Ramp',
    points: [
      { x: 0.610, y: 0.475 },
      { x: 0.710, y: 0.465 },
      { x: 0.805, y: 0.505 },
      { x: 0.820, y: 0.585 },
      { x: 0.755, y: 0.640 },
      { x: 0.655, y: 0.610 },
      { x: 0.585, y: 0.530 },
    ],
    speedFactor: 0.8,
    allowedTypes: ['car', 'auto', 'bike'],
    isElevated: true,
  },
  // 10. Northern Cloverleaf Loop (Upper quadrant between flyovers)
  {
    id: 'north_cloverleaf_loop',
    name: 'North Cloverleaf Ramp',
    points: [
      { x: 0.465, y: 0.415 },
      { x: 0.515, y: 0.355 },
      { x: 0.585, y: 0.365 },
      { x: 0.605, y: 0.425 },
      { x: 0.535, y: 0.465 },
      { x: 0.475, y: 0.430 },
    ],
    speedFactor: 0.75,
    allowedTypes: ['car', 'auto', 'bike'],
    isElevated: true,
  },
  // 11. Outer Southwest Connecting Slip Ramp (Towards St. Thomas Mount / Porur)
  {
    id: 'outer_slip_sw',
    name: 'Outer Slip Southwest',
    points: [
      { x: -0.04, y: 0.685 },
      { x: 0.075, y: 0.585 },
      { x: 0.175, y: 0.480 },
      { x: 0.295, y: 0.390 },
    ],
    speedFactor: 0.9,
    allowedTypes: ['car', 'auto', 'bike'],
    isElevated: false,
  },
  // 12. Outer Southeast Connecting Slip Ramp (Towards Inner Ring Road)
  {
    id: 'outer_slip_se',
    name: 'Outer Slip Southeast',
    points: [
      { x: 0.785, y: 0.730 },
      { x: 0.865, y: 0.660 },
      { x: 0.925, y: 0.560 },
      { x: 0.955, y: 0.450 },
    ],
    speedFactor: 0.9,
    allowedTypes: ['car', 'auto', 'bike'],
    isElevated: false,
  },
  // 13. Upper-Left Approach Inbound (Porur / Mount-Poonamallee incoming to Kathipara)
  {
    id: 'upper_left_inbound',
    name: 'Porur Approach Inbound',
    points: [
      { x: -0.04, y: 0.330 },
      { x: 0.08, y: 0.355 },
      { x: 0.20, y: 0.395 },
      { x: 0.34, y: 0.445 },
      { x: 0.46, y: 0.490 },
    ],
    speedFactor: 1.05,
    allowedTypes: ['bus', 'auto', 'car', 'bike'],
    isElevated: false,
  },
  // 14. Upper-Left Approach Outbound (Kathipara outgoing towards Porur / Poonamallee)
  {
    id: 'upper_left_outbound',
    name: 'Porur Approach Outbound',
    points: [
      { x: 0.46, y: 0.470 },
      { x: 0.34, y: 0.425 },
      { x: 0.20, y: 0.375 },
      { x: 0.08, y: 0.335 },
      { x: -0.04, y: 0.310 },
    ],
    speedFactor: 1.05,
    allowedTypes: ['bus', 'auto', 'car', 'bike'],
    isElevated: false,
  },
  // 15. St. Thomas Mount / Butt Road Link (Mid-Left incoming arterial)
  {
    id: 'st_thomas_mount_link',
    name: 'St. Thomas Mount Link',
    points: [
      { x: -0.04, y: 0.520 },
      { x: 0.08, y: 0.535 },
      { x: 0.18, y: 0.560 },
      { x: 0.28, y: 0.590 },
      { x: 0.38, y: 0.620 },
    ],
    speedFactor: 0.95,
    allowedTypes: ['auto', 'car', 'bike'],
    isElevated: false,
  },
];

// Chennai Metro Rail (CMRL) Elevated Dedicated Viaducts
// Line 1: Airport to Little Mount / Guindy Elevated Viaduct with iconic concrete piers
const CMRL_METRO_LINE_1: Point[] = [
  { x: -0.04, y: 0.295 },
  { x: 0.160, y: 0.330 },
  { x: 0.340, y: 0.375 },
  { x: 0.520, y: 0.440 },
  { x: 0.680, y: 0.500 },
  { x: 0.840, y: 0.580 },
  { x: 1.040, y: 0.675 },
];

// Line 2: St. Thomas Mount to Koyambedu Sweeping Elevated Curve (with illuminated "CHENNAI METRO" viaduct)
const CMRL_METRO_LINE_2: Point[] = [
  { x: 1.040, y: 0.130 },
  { x: 0.780, y: 0.255 },
  { x: 0.645, y: 0.355 },
  { x: 0.565, y: 0.455 },
  { x: 0.640, y: 0.580 },
  { x: 0.760, y: 0.680 },
  { x: 0.880, y: 0.780 },
  { x: 1.040, y: 0.880 },
];

interface VehicleSim {
  id: number;
  laneIndex: number;
  progress: number;
  speed: number;
  type: VehicleType;
  color: string;
  hasHeadlights: boolean;
  length: number;
  width: number;
  trail: { x: number; y: number; alpha: number }[];
}

interface MetroTrainSim {
  lineIndex: 1 | 2;
  progress: number;
  speed: number;
  coaches: number;
  coachLength: number;
  coachWidth: number;
}

interface RainParticle {
  x: number;
  y: number;
  len: number;
  speed: number;
}

export const WelcomeKathiparaScene: React.FC<WelcomeKathiparaSceneProps> = ({
  userName,
  onOpenExplorer,
  onPlanJourney,
  onSavedRoutes,
  onCommuteSpending,
  onBackToLanding,
  language,
  setLanguage,
}) => {
  const [mode, setMode] = useState<DaypartMode>('night');
  const [isRaining, setIsRaining] = useState(false);
  const [isLiveClock, setIsLiveClock] = useState(true);
  const [isSimulating, setIsSimulating] = useState(true);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [showLandmarkCard, setShowLandmarkCard] = useState(false);

  // Time & Date strings
  const [istTimeStr, setIstTimeStr] = useState('12:00');
  const [istAmPm, setIstAmPm] = useState('AM');
  const [istDateStr, setIstDateStr] = useState('IST · Fri, 6 Nov');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Metro train simulation progress refs
  const metro1Ref = useRef<MetroTrainSim>({
    lineIndex: 1,
    progress: 0.42,
    speed: 0.00038,
    coaches: 4,
    coachLength: 26,
    coachWidth: 7,
  });

  const metro2Ref = useRef<MetroTrainSim>({
    lineIndex: 2,
    progress: 0.85,
    speed: 0.00032,
    coaches: 4,
    coachLength: 26,
    coachWidth: 7,
  });

  // Real-time IST clock synchronization
  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const options: Intl.DateTimeFormatOptions = {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        };
        const formatter = new Intl.DateTimeFormat('en-US', options);
        const parts = formatter.formatToParts(now);
        const hour = parts.find((p) => p.type === 'hour')?.value || '12';
        const minute = parts.find((p) => p.type === 'minute')?.value || '00';
        const dayPeriod = parts.find((p) => p.type === 'dayPeriod')?.value || 'AM';

        setIstTimeStr(`${hour}:${minute}`);
        setIstAmPm(dayPeriod);

        if (language === 'EN') {
          const dateFmt = new Intl.DateTimeFormat('en-US', {
            timeZone: 'Asia/Kolkata',
            weekday: 'short',
            day: 'numeric',
            month: 'short',
          }).format(now);
          setIstDateStr(`IST · ${dateFmt}`);
        } else {
          const dayMap: Record<number, string> = {
            0: 'ஞாயிறு', 1: 'திங்கள்', 2: 'செவ்வாய்', 3: 'புதன்',
            4: 'வியாழன்', 5: 'வெள்ளி', 6: 'சனி',
          };
          const monthMap: Record<number, string> = {
            0: 'ஜனவரி', 1: 'பிப்ரவரி', 2: 'மார்ச்', 3: 'ஏப்ரல்',
            4: 'மே', 5: 'ஜூன்', 6: 'ஜூலை', 7: 'ஆகஸ்ட்',
            8: 'செப்டம்பர்', 9: 'அக்டோபர்', 10: 'நவம்பர்', 11: 'டிசம்பர்',
          };
          const dayName = dayMap[now.getDay()] || 'வெள்ளி';
          const monthName = monthMap[now.getMonth()] || 'நவம்பர்';
          setIstDateStr(`இந்திய நேரம் · ${dayName}, ${now.getDate()} ${monthName}`);
        }

        // Auto determine mode from current IST hour if live sync is engaged
        if (isLiveClock) {
          const hour24 = parseInt(
            new Intl.DateTimeFormat('en-US', {
              timeZone: 'Asia/Kolkata',
              hour: 'numeric',
              hour12: false,
            }).format(now),
            10
          );
          if (hour24 >= 5 && hour24 < 10) {
            setMode('dawn');
          } else if (hour24 >= 10 && hour24 < 16) {
            setMode('midday');
          } else if (hour24 >= 16 && hour24 < 20) {
            setMode('dusk');
          } else {
            setMode('night');
          }
        }
      } catch (err) {
        console.error('Error updating IST clock:', err);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [isLiveClock, language]);

  // Handler to return to live real-time simulation immediately
  const handleReturnToLiveRealTime = useCallback(() => {
    setIsLiveClock(true);
    try {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      };
      const formatter = new Intl.DateTimeFormat('en-US', options);
      const parts = formatter.formatToParts(now);
      const hour = parts.find((p) => p.type === 'hour')?.value || '12';
      const minute = parts.find((p) => p.type === 'minute')?.value || '00';
      const dayPeriod = parts.find((p) => p.type === 'dayPeriod')?.value || 'AM';

      setIstTimeStr(`${hour}:${minute}`);
      setIstAmPm(dayPeriod);

      const hour24 = parseInt(
        new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Kolkata',
          hour: 'numeric',
          hour12: false,
        }).format(now),
        10
      );
      if (hour24 >= 5 && hour24 < 10) {
        setMode('dawn');
      } else if (hour24 >= 10 && hour24 < 16) {
        setMode('midday');
      } else if (hour24 >= 16 && hour24 < 20) {
        setMode('dusk');
      } else {
        setMode('night');
      }
    } catch (err) {
      console.error('Error switching to live IST:', err);
    }
  }, []);

  // Auto-cycle dayparts if not live synced and simulating
  useEffect(() => {
    if (!isSimulating || isLiveClock) return;
    const modes: DaypartMode[] = ['dawn', 'midday', 'dusk', 'night'];
    const timer = setInterval(() => {
      setMode((prev) => {
        const nextIndex = (modes.indexOf(prev) + 1) % modes.length;
        return modes[nextIndex];
      });
    }, 14000);
    return () => clearInterval(timer);
  }, [isSimulating, isLiveClock]);

  // =========================================================================
  // ENHANCED TRAFFIC & METRO RAIL SIMULATION CANVAS
  // Mapped with 100% precision to the background aerial photograph geometry
  // =========================================================================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    /**
     * Compute exact transformation parameters matching CSS `object-cover object-center`
     * of the 16:9 aerial photography.
     */
    const getTransform = () => {
      const imgAspect = 16 / 9;
      const viewAspect = width / height;
      let drawW: number;
      let drawH: number;
      let offX: number;
      let offY: number;

      if (viewAspect > imgAspect) {
        drawW = width;
        drawH = width / imgAspect;
        offX = 0;
        offY = (height - drawH) / 2;
      } else {
        drawH = height;
        drawW = height * imgAspect;
        offX = (width - drawW) / 2;
        offY = 0;
      }

      const pixelScale = drawW / 1920; // 1:1 scale at 1080p aerial photograph
      return { drawW, drawH, offX, offY, pixelScale };
    };

    /**
     * Catmull-Rom Spline Interpolation with tangent vector calculation
     */
    const getSplinePoint = (
      points: Point[],
      t: number,
      tr: ReturnType<typeof getTransform>
    ): { x: number; y: number; angle: number } => {
      if (!points || points.length < 2) return { x: 0, y: 0, angle: 0 };
      const n = points.length - 1;
      const clampedT = Math.max(0, Math.min(1, t));
      const idx = Math.min(Math.floor(clampedT * n), n - 1);
      const subT = clampedT * n - idx;

      const p0 = points[Math.max(0, idx - 1)] || points[0];
      const p1 = points[idx] || points[0];
      const p2 = points[Math.min(n, idx + 1)] || points[n];
      const p3 = points[Math.min(n, idx + 2)] || points[n];

      const t2 = subT * subT;
      const t3 = t2 * subT;

      const f1 = -0.5 * t3 + t2 - 0.5 * subT;
      const f2 = 1.5 * t3 - 2.5 * t2 + 1.0;
      const f3 = -1.5 * t3 + 2.0 * t2 + 0.5 * subT;
      const f4 = 0.5 * t3 - 0.5 * t2;

      const normX = p0.x * f1 + p1.x * f2 + p2.x * f3 + p3.x * f4;
      const normY = p0.y * f1 + p1.y * f2 + p2.y * f3 + p3.y * f4;

      const screenX = tr.offX + normX * tr.drawW;
      const screenY = tr.offY + normY * tr.drawH;

      // Next point for tangent angle
      const nextT = Math.min(1, clampedT + 0.012);
      const nextIdx = Math.min(Math.floor(nextT * n), n - 1);
      const nextSubT = nextT * n - nextIdx;

      const np0 = points[Math.max(0, nextIdx - 1)] || points[0];
      const np1 = points[nextIdx] || points[0];
      const np2 = points[Math.min(n, nextIdx + 1)] || points[n];
      const np3 = points[Math.min(n, nextIdx + 2)] || points[n];

      const nt2 = nextSubT * nextSubT;
      const nt3 = nt2 * nextSubT;

      const nf1 = -0.5 * nt3 + nt2 - 0.5 * nextSubT;
      const nf2 = 1.5 * nt3 - 2.5 * nt2 + 1.0;
      const nf3 = -1.5 * nt3 + 2.0 * nt2 + 0.5 * nextSubT;
      const nf4 = 0.5 * nt3 - 0.5 * nt2;

      const nNormX = np0.x * nf1 + np1.x * nf2 + np2.x * nf3 + np3.x * nf4;
      const nNormY = np0.y * nf1 + np1.y * nf2 + np2.y * nf3 + np3.y * nf4;

      const nScreenX = tr.offX + nNormX * tr.drawW;
      const nScreenY = tr.offY + nNormY * tr.drawH;

      const angle = Math.atan2(nScreenY - screenY, nScreenX - screenX);
      return { x: screenX, y: screenY, angle };
    };

    // Initialize vehicle fleet calibrated to realistic proportions across all 15 lanes
    const FLEET_SIZE = 180;
    const vehicles: VehicleSim[] = [];

    const CAR_PALETTE = ['#FFFFFF', '#E2E8F0', '#0284C7', '#DC2626', '#475569', '#1E293B', '#D97706'];

    for (let i = 0; i < FLEET_SIZE; i++) {
      // Round-robin distribution guarantees every road in the interchange is actively populated
      const laneIdx = i % ROAD_LANES.length;
      const lane = ROAD_LANES[laneIdx];
      const typeRoll = Math.random();

      let type: VehicleType = 'car';
      if (lane.allowedTypes.includes('bus') && typeRoll < 0.22) {
        type = 'bus';
      } else if (lane.allowedTypes.includes('auto') && typeRoll < 0.44) {
        type = 'auto';
      } else if (lane.allowedTypes.includes('bike') && typeRoll < 0.62) {
        type = 'bike';
      } else {
        type = 'car';
      }

      const length =
        type === 'bus' ? 28 : type === 'auto' ? 10 : type === 'bike' ? 6 : 14;
      const vWidth =
        type === 'bus' ? 8.5 : type === 'auto' ? 5.5 : type === 'bike' ? 3 : 6.5;

      const baseSpeed =
        type === 'bus'
          ? 0.00075 + Math.random() * 0.0004
          : type === 'auto'
          ? 0.00095 + Math.random() * 0.0005
          : type === 'bike'
          ? 0.00130 + Math.random() * 0.0007
          : 0.00115 + Math.random() * 0.0006;

      const color =
        type === 'bus'
          ? Math.random() > 0.4
            ? '#124838' // Iconic MTC Green
            : '#0B4F8A' // MTC Deluxe Blue Express
          : type === 'auto'
          ? '#F59E0B' // Chennai yellow auto
          : type === 'bike'
          ? '#DC2626'
          : CAR_PALETTE[Math.floor(Math.random() * CAR_PALETTE.length)];

      vehicles.push({
        id: i,
        laneIndex: laneIdx,
        progress: Math.random(),
        speed: baseSpeed * lane.speedFactor,
        type,
        color,
        hasHeadlights: Math.random() > 0.15,
        length,
        width: vWidth,
        trail: [],
      });
    }

    // Rain drop particles
    const rainParticles: RainParticle[] = [];
    for (let r = 0; r < 140; r++) {
      rainParticles.push({
        x: Math.random(),
        y: Math.random(),
        len: 12 + Math.random() * 18,
        speed: 0.025 + Math.random() * 0.02,
      });
    }

    // =========================================================================
    // MAIN RENDER LOOP
    // =========================================================================
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const tr = getTransform();
      const currentProfile = PROFILES[mode] || PROFILES.night;
      const isDay = mode === 'dawn' || mode === 'midday';
      const density = currentProfile.trafficDensityMultiplier;
      const activeVehicleCount = Math.min(
        vehicles.length,
        Math.floor(FLEET_SIZE * Math.min(density, 1.45))
      );

      if (isSimulating) {
        // ---------------------------------------------------------------------
        // 1. CHENNAI METRO RAIL (CMRL) ELEVATED TRAINS
        // Rendered on elevated concrete viaduct tracks
        // ---------------------------------------------------------------------
        const drawMetroTrain = (sim: MetroTrainSim, linePoints: Point[], colorHex: string) => {
          sim.progress += sim.speed * (mode === 'dusk' ? 1.2 : 1.0);
          if (sim.progress >= 1.0) sim.progress = 0;

          const totalCoaches = sim.coaches;
          const coachLen = sim.coachLength * tr.pixelScale;
          const coachWid = sim.coachWidth * tr.pixelScale;
          const gap = 2.5 * tr.pixelScale;

          // Draw coaches from tail to front
          for (let c = 0; c < totalCoaches; c++) {
            const coachOffset = (c - (totalCoaches - 1) / 2) * 0.018;
            const coachProgress = Math.max(0, Math.min(1, sim.progress + coachOffset));
            const pt = getSplinePoint(linePoints, coachProgress, tr);

            ctx.save();
            ctx.translate(pt.x, pt.y);
            ctx.rotate(pt.angle);

            // Elevated Drop Shadow on ground
            ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
            ctx.beginPath();
            ctx.roundRect(-coachLen / 2 + 3 * tr.pixelScale, 6 * tr.pixelScale, coachLen, coachWid, 2);
            ctx.fill();

            // Stainless Steel Coach Body
            ctx.fillStyle = '#E2E8F0';
            ctx.beginPath();
            ctx.roundRect(-coachLen / 2, -coachWid / 2, coachLen, coachWid, 2);
            ctx.fill();

            // CMRL Iconic Blue Racing Stripe
            ctx.fillStyle = colorHex;
            ctx.fillRect(-coachLen / 2, -coachWid * 0.25, coachLen, coachWid * 0.5);

            // Passenger Windows with interior illumination
            ctx.fillStyle = isDay ? '#0F172A' : '#7DD3FC';
            if (!isDay) {
              ctx.shadowColor = '#38BDF8';
              ctx.shadowBlur = 6 * tr.pixelScale;
            }
            const winStep = 4 * tr.pixelScale;
            for (let w = -coachLen / 2 + 3 * tr.pixelScale; w < coachLen / 2 - 3 * tr.pixelScale; w += winStep) {
              ctx.fillRect(w, -coachWid * 0.4, 2.5 * tr.pixelScale, coachWid * 0.8);
            }
            ctx.shadowBlur = 0;

            // Front Pilot Coach Headlight (Leading coach)
            if (c === totalCoaches - 1) {
              // Aerodynamic Nose
              ctx.fillStyle = '#0284C7';
              ctx.beginPath();
              ctx.arc(coachLen / 2, 0, coachWid / 2, -Math.PI / 2, Math.PI / 2);
              ctx.fill();

              // High-Intensity Forward Headlight Beam
              if (!isDay) {
                const beamLen = 90 * tr.pixelScale;
                const beamGrad = ctx.createRadialGradient(
                  coachLen / 2,
                  0,
                  2,
                  coachLen / 2 + beamLen * 0.6,
                  0,
                  beamLen
                );
                beamGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
                beamGrad.addColorStop(0.3, 'rgba(186, 230, 253, 0.65)');
                beamGrad.addColorStop(1, 'rgba(186, 230, 253, 0)');

                ctx.fillStyle = beamGrad;
                ctx.beginPath();
                ctx.moveTo(coachLen / 2, -coachWid / 3);
                ctx.lineTo(coachLen / 2 + beamLen, -coachWid * 1.8);
                ctx.lineTo(coachLen / 2 + beamLen, coachWid * 1.8);
                ctx.lineTo(coachLen / 2, coachWid / 3);
                ctx.closePath();
                ctx.fill();
              }
            }

            // Rear Red Tail Marker (Last coach)
            if (c === 0 && !isDay) {
              ctx.fillStyle = '#EF4444';
              ctx.shadowColor = '#EF4444';
              ctx.shadowBlur = 8;
              ctx.beginPath();
              ctx.arc(-coachLen / 2, -coachWid / 4, 1.8 * tr.pixelScale, 0, Math.PI * 2);
              ctx.arc(-coachLen / 2, coachWid / 4, 1.8 * tr.pixelScale, 0, Math.PI * 2);
              ctx.fill();
              ctx.shadowBlur = 0;
            }

            ctx.restore();
          }
        };

        // Render Train 1 on Airport-Guindy Corridor
        drawMetroTrain(metro1Ref.current, CMRL_METRO_LINE_1, '#0284C7');
        // Render Train 2 on St. Thomas Mount-Koyambedu Corridor
        drawMetroTrain(metro2Ref.current, CMRL_METRO_LINE_2, '#2563EB');

        // ---------------------------------------------------------------------
        // 2. ROAD VEHICLES (MTC Buses, Autos, Cars, Bikes)
        // Scaled and aligned to Kathipara flyovers & cloverleaf ramps
        // ---------------------------------------------------------------------
        for (let i = 0; i < activeVehicleCount; i++) {
          const v = vehicles[i];
          if (!v) continue;
          const lane = ROAD_LANES[v.laneIndex];
          if (!lane || lane.points.length < 2) continue;

          // Advance vehicle progress
          v.progress += v.speed * (mode === 'dusk' ? 1.25 : 1.0);
          if (v.progress >= 1.0) {
            v.progress = 0;
            // Switch to another valid lane smoothly
            v.laneIndex = Math.floor(Math.random() * ROAD_LANES.length);
          }

          const pt = getSplinePoint(lane.points, v.progress, tr);

          const vLen = v.length * tr.pixelScale;
          const vWid = v.width * tr.pixelScale;

          ctx.save();
          ctx.translate(pt.x, pt.y);
          ctx.rotate(pt.angle);

          if (isDay) {
            // ===============================================================
            // DAYTIME & DAWN: Authentic Chennai Top-Down Vehicle Renderings
            // ===============================================================

            // Soft road shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
            ctx.beginPath();
            ctx.ellipse(1 * tr.pixelScale, 2 * tr.pixelScale, vLen * 0.55, vWid * 0.6, 0, 0, Math.PI * 2);
            ctx.fill();

            if (v.type === 'bus') {
              // MTC Transit Bus (Long rectangular chassis, roof vents, destination LED)
              ctx.fillStyle = v.color;
              ctx.beginPath();
              ctx.roundRect(-vLen / 2, -vWid / 2, vLen, vWid, 2 * tr.pixelScale);
              ctx.fill();

              // White Roof Hatch
              ctx.fillStyle = '#FFFFFF';
              ctx.beginPath();
              ctx.roundRect(-vLen * 0.35, -vWid * 0.3, vLen * 0.65, vWid * 0.6, 1 * tr.pixelScale);
              ctx.fill();

              // Front Windshield
              ctx.fillStyle = '#0F172A';
              ctx.fillRect(vLen * 0.35, -vWid * 0.45, vLen * 0.12, vWid * 0.9);

              // Route destination board (Glowing Amber)
              ctx.fillStyle = '#F59E0B';
              ctx.fillRect(vLen * 0.45, -vWid * 0.3, vLen * 0.05, vWid * 0.6);

              // Rear Window
              ctx.fillStyle = '#0F172A';
              ctx.fillRect(-vLen * 0.48, -vWid * 0.4, vLen * 0.06, vWid * 0.8);
            } else if (v.type === 'auto') {
              // Classic Chennai Yellow Auto-Rickshaw (Trapezoidal canopy)
              // Black rear canvas hood
              ctx.fillStyle = '#111827';
              ctx.beginPath();
              ctx.roundRect(-vLen * 0.48, -vWid * 0.5, vLen * 0.6, vWid, 1.5 * tr.pixelScale);
              ctx.fill();

              // Bright yellow front cowl
              ctx.fillStyle = '#F59E0B';
              ctx.beginPath();
              ctx.roundRect(vLen * 0.1, -vWid * 0.45, vLen * 0.38, vWid * 0.9, 1 * tr.pixelScale);
              ctx.fill();

              // Front windshield
              ctx.fillStyle = '#0284C7';
              ctx.fillRect(vLen * 0.22, -vWid * 0.35, vLen * 0.1, vWid * 0.7);
            } else if (v.type === 'bike') {
              // Commuter Motorbike / Scooter
              ctx.fillStyle = '#DC2626';
              ctx.fillRect(-vLen * 0.45, -vWid * 0.4, vLen * 0.9, vWid * 0.8);

              // Rider with Helmet
              ctx.fillStyle = '#0F172A';
              ctx.beginPath();
              ctx.arc(0, 0, vWid * 0.5, 0, Math.PI * 2);
              ctx.fill();
            } else {
              // Standard Passenger Car / Taxi Cab
              ctx.fillStyle = v.color;
              ctx.beginPath();
              ctx.roundRect(-vLen / 2, -vWid / 2, vLen, vWid, 2 * tr.pixelScale);
              ctx.fill();

              // Cabin roof glass reflection
              ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
              ctx.beginPath();
              ctx.roundRect(-vLen * 0.25, -vWid * 0.35, vLen * 0.5, vWid * 0.7, 1 * tr.pixelScale);
              ctx.fill();

              // Front windshield
              ctx.fillStyle = '#0F172A';
              ctx.fillRect(vLen * 0.25, -vWid * 0.38, vLen * 0.12, vWid * 0.76);

              // Rear windshield
              ctx.fillStyle = '#0F172A';
              ctx.fillRect(-vLen * 0.38, -vWid * 0.38, vLen * 0.1, vWid * 0.76);
            }
          } else {
            // ===============================================================
            // NIGHT & DUSK: Volumetric Headlights, Taillight Light-Trails & Glow
            // Matching the iconic midnight long-exposure photograph of Kathipara
            // ===============================================================

            // Dark aerodynamic silhouette
            ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
            ctx.beginPath();
            ctx.roundRect(-vLen / 2, -vWid / 2, vLen, vWid, 1.5 * tr.pixelScale);
            ctx.fill();

            // Headlight Forward Cones (Warm White / Amber)
            if (v.hasHeadlights) {
              const beamDist = (v.type === 'bus' ? 55 : 38) * tr.pixelScale;
              const beamSpread = (v.type === 'bus' ? 14 : 10) * tr.pixelScale;

              const beamGrad = ctx.createRadialGradient(
                vLen / 2,
                0,
                2,
                vLen / 2 + beamDist * 0.7,
                0,
                beamDist
              );
              beamGrad.addColorStop(0, 'rgba(255, 250, 220, 0.9)');
              beamGrad.addColorStop(0.25, 'rgba(254, 240, 138, 0.55)');
              beamGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');

              ctx.fillStyle = beamGrad;
              ctx.beginPath();
              ctx.moveTo(vLen / 2, -vWid * 0.3);
              ctx.lineTo(vLen / 2 + beamDist, -beamSpread);
              ctx.lineTo(vLen / 2 + beamDist, beamSpread);
              ctx.lineTo(vLen / 2, vWid * 0.3);
              ctx.closePath();
              ctx.fill();

              // Dual Headlight LED Bulbs
              ctx.fillStyle = '#FFFFFF';
              ctx.shadowColor = '#FEF08A';
              ctx.shadowBlur = 6 * tr.pixelScale;
              ctx.beginPath();
              ctx.arc(vLen / 2, -vWid * 0.3, 1.4 * tr.pixelScale, 0, Math.PI * 2);
              ctx.arc(vLen / 2, vWid * 0.3, 1.4 * tr.pixelScale, 0, Math.PI * 2);
              ctx.fill();
              ctx.shadowBlur = 0;
            }

            // Dual Ruby Taillights with Streak Trails
            ctx.fillStyle = '#EF4444';
            ctx.shadowColor = '#DC2626';
            ctx.shadowBlur = 8 * tr.pixelScale;
            ctx.beginPath();
            ctx.arc(-vLen / 2, -vWid * 0.3, 1.5 * tr.pixelScale, 0, Math.PI * 2);
            ctx.arc(-vLen / 2, vWid * 0.3, 1.5 * tr.pixelScale, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Long Exposure Taillight Ribbon Trailing Behind
            const trailLen = (mode === 'dusk' ? 16 : 28) * tr.pixelScale;
            ctx.strokeStyle = 'rgba(239, 68, 68, 0.75)';
            ctx.lineWidth = 1.6 * tr.pixelScale;
            ctx.beginPath();
            ctx.moveTo(-vLen / 2, -vWid * 0.3);
            ctx.lineTo(-vLen / 2 - trailLen, -vWid * 0.3);
            ctx.moveTo(-vLen / 2, vWid * 0.3);
            ctx.lineTo(-vLen / 2 - trailLen, vWid * 0.3);
            ctx.stroke();
          }

          ctx.restore();
        }

        // ---------------------------------------------------------------------
        // 3. MONSOON RAIN PARTICLES & WET ROAD SHEEN
        // ---------------------------------------------------------------------
        if (isRaining) {
          ctx.strokeStyle = 'rgba(195, 230, 255, 0.5)';
          ctx.lineWidth = 1.2 * tr.pixelScale;

          rainParticles.forEach((drop) => {
            drop.y += drop.speed;
            drop.x -= drop.speed * 0.22;
            if (drop.y > 1.0) {
              drop.y = 0;
              drop.x = Math.random();
            }
            if (drop.x < 0) drop.x = 1.0;

            const rx = drop.x * width;
            const ry = drop.y * height;

            ctx.beginPath();
            ctx.moveTo(rx, ry);
            ctx.lineTo(rx - drop.len * 0.22, ry + drop.len);
            ctx.stroke();

            // Splash ripples near bottom roads
            if (ry > height * 0.65 && Math.random() > 0.88) {
              ctx.beginPath();
              ctx.ellipse(rx, ry, 3 * tr.pixelScale, 1.2 * tr.pixelScale, 0, 0, Math.PI * 2);
              ctx.strokeStyle = 'rgba(215, 240, 255, 0.28)';
              ctx.stroke();
            }
          });
        }
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [mode, isSimulating, isRaining]);

  const p = PROFILES[mode] || PROFILES.night;
  const displayClock = isLiveClock ? istTimeStr : p.time;
  const displayAmPm = isLiveClock ? istAmPm : p.ampm;
  const currentFlowText = language === 'EN' ? p.flowTextEN : p.flowTextTA;
  const currentWeatherDesc = isRaining
    ? language === 'EN'
      ? 'Rain (Monsoon Drizzle)'
      : 'மழை (பருவமழை தூறல்)'
    : language === 'EN'
    ? p.weatherDescEN
    : p.weatherDescTA;
  const currentFooterInfo = isRaining
    ? language === 'EN'
      ? 'Time-aware simulation · 25°C Rain (Monsoon Drizzle) · Asia/Kolkata'
      : 'நேர உணர்வு உருவகப்படுத்துதல் · 25°C மழை (பருவமழை) · ஆசியா/கொல்கத்தா'
    : language === 'EN'
    ? p.footerInfoEN
    : p.footerInfoTA;

  return (
    <div className="relative w-full min-h-screen h-screen overflow-hidden bg-[#0A1612] select-none font-sans flex flex-col justify-between">
      {/* ========================================================================= */}
      {/* 1. PHOTOGRAPHIC AERIAL BASE LAYER: High-Res Real Photos of Kathipara     */}
      {/* Crossfades smoothly across Dawn, Midday, Dusk, and Night modes           */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Dawn Aerial */}
        <img
          src={dawnBg}
          alt="Kathipara Junction cloverleaf interchange in Chennai at sunrise dawn"
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ease-in-out ${
            mode === 'dawn' ? 'opacity-100' : 'opacity-0'
          }`}
        />
        {/* Midday Aerial */}
        <img
          src={middayBg}
          alt="Kathipara Junction cloverleaf interchange in Chennai during bright daylight"
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ease-in-out ${
            mode === 'midday' ? 'opacity-100' : 'opacity-0'
          }`}
        />
        {/* Dusk Aerial */}
        <img
          src={duskBg}
          alt="Kathipara Junction cloverleaf interchange in Chennai during sunset twilight"
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ease-in-out ${
            mode === 'dusk' ? 'opacity-100' : 'opacity-0'
          }`}
        />
        {/* Night Aerial */}
        <img
          src={nightBg}
          alt="Kathipara Junction cloverleaf flyover in Chennai illuminated at midnight"
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ease-in-out ${
            mode === 'night' ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>

      {/* Dynamic Ambient Color Grading */}
      <div
        className="absolute inset-0 transition-all duration-700 pointer-events-none z-[1]"
        style={{ background: p.tintOverlay }}
      />

      {/* Subtle top & bottom contrast scrims to guarantee text & dock legibility without obscuring the interchange */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none z-[2]" />

      {/* Rain Wet Road Reflection Overlay */}
      {isRaining && (
        <div className="absolute inset-0 transition-opacity duration-500 pointer-events-none z-[3] bg-sky-950/20" />
      )}

      {/* Dynamic Traffic & Metro Simulation Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-10 pointer-events-none"
      />

      {/* ========================================================================= */}
      {/* 2. FOREGROUND INTERACTION LAYER: Clean, Non-Overlapping HUD              */}
      {/* ========================================================================= */}
      <div className="relative z-20 flex flex-col justify-between h-full p-4 sm:p-6 lg:p-7 overflow-y-auto sm:overflow-hidden">
        {/* --- Top Floating Navigation Bar --- */}
        <header className="flex items-center justify-between gap-3 w-full">
          {/* Brand & Subtitle */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onBackToLanding}
              className="flex items-center gap-2 drop-shadow-md cursor-pointer hover:opacity-90 transition-opacity focus:outline-none"
              title={language === 'EN' ? 'Back to Landing Page' : 'முகப்பு பக்கத்திற்கு திரும்பு'}
            >
              <span className="material-symbols-outlined text-2xl text-emerald-400">location_on</span>
              <span className="font-extrabold text-xl tracking-tight text-white drop-shadow whitespace-nowrap">
                MOVEFAIR
              </span>
            </button>
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs font-semibold text-emerald-300 shadow-sm whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>{language === 'EN' ? 'Kathipara Grid Feed · Synced' : 'கத்திப்பாரா கட்டமைப்பு · ஒத்திசைக்கப்பட்டது'}</span>
            </div>
          </div>

          {/* Right Controls: Weather, Language, IST Clock Sync, Focus Mode, Profile */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Weather Chip */}
            <div className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center gap-2 text-xs font-medium shadow-sm whitespace-nowrap shrink-0">
              <span className="text-sm">{isRaining ? '🌧️' : p.weatherIcon}</span>
              <span className="font-semibold text-white">{isRaining ? '25°C' : p.temp}</span>
              <span className="text-slate-300 hidden sm:inline">{currentWeatherDesc}</span>
              <span className="text-slate-400 hidden sm:inline">· {language === 'EN' ? 'Chennai' : 'சென்னை'}</span>
            </div>

            {/* Language Selector */}
            {setLanguage && (
              <div className="rounded-full bg-black/40 backdrop-blur-md border border-white/10 p-0.5 text-xs font-semibold flex items-center shadow-sm shrink-0">
                <button
                  type="button"
                  onClick={() => setLanguage('EN')}
                  className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer whitespace-nowrap ${
                    language === 'EN'
                      ? 'bg-emerald-600 text-white font-bold shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('TA')}
                  className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer whitespace-nowrap ${
                    language === 'TA'
                      ? 'bg-emerald-600 text-white font-bold shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  தமிழ்
                </button>
              </div>
            )}

            {/* Live Clock Sync Toggle */}
            <button
              onClick={() => setIsLiveClock(!isLiveClock)}
              className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-semibold transition cursor-pointer whitespace-nowrap shrink-0 border ${
                isLiveClock
                  ? 'bg-emerald-700/80 text-white border-emerald-400/80 shadow-md backdrop-blur-md'
                  : 'bg-black/40 text-slate-300 border-white/10 hover:text-white backdrop-blur-md'
              }`}
              title={language === 'EN' ? 'Toggle Live Real-Time Clock Sync' : 'நேரலை கடிகார ஒத்திசைவை இயக்கு/நிறுத்து'}
            >
              <span className="material-symbols-outlined text-sm">schedule</span>
              <span className="hidden md:inline">
                {isLiveClock
                  ? language === 'EN' ? 'Live IST Synced' : 'நேரலை IST ஒத்திசைவு'
                  : language === 'EN' ? 'Sync Live' : 'நேரலை ஒத்திசை'}
              </span>
            </button>

            {/* Focus / Cinema Mode Toggle Button */}
            <button
              onClick={() => setIsFocusMode(!isFocusMode)}
              className="p-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-slate-200 hover:text-white hover:scale-105 transition cursor-pointer shrink-0"
              title={
                isFocusMode
                  ? language === 'EN' ? 'Show controls' : 'கட்டுப்பாடுகளை காட்டு'
                  : language === 'EN' ? 'Focus view (hide HUD)' : 'முழுத்திரை பார்வை'
              }
            >
              <span className="material-symbols-outlined text-base">
                {isFocusMode ? 'visibility' : 'visibility_off'}
              </span>
            </button>

            {/* Open Explorer User Avatar Icon */}
            <button
              onClick={onOpenExplorer}
              className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:scale-105 transition cursor-pointer shrink-0"
              title={language === 'EN' ? 'Open Mobility Explorer' : 'செயலியை திற'}
            >
              <span className="material-symbols-outlined text-sm">person</span>
            </button>
          </div>
        </header>

        {/* --- Center Upper-Left Monumental Salutation (Floating typography without obstructing box) --- */}
        <AnimatePresence>
          {!isFocusMode && (
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.3 }}
              className="my-auto py-2 max-w-xl flex flex-col items-start z-20 pointer-events-none select-none"
            >
              <div className="space-y-3 w-full pointer-events-auto">
                {/* Greeting */}
                <div>
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.98)]">
                    {language === 'EN'
                      ? `Welcome back, ${userName || 'Ananya Raman'}!`
                      : `வணக்கம், ${userName || 'அனன்யா ராமன்'}!`}
                  </h1>
                  <p className="text-sm sm:text-base text-slate-100 font-medium drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] mt-1.5 max-w-lg">
                    {language === 'EN'
                      ? 'Explore smarter, fairer & greener ways to move across Chennai'
                      : 'சென்னையில் எளிமையான, பசுமையான பயண வழிகளை கண்டறியுங்கள்'}
                  </p>
                </div>

                {/* Monumental Clock Readout */}
                <div className="flex flex-col items-start pt-1">
                  <div className="flex items-baseline gap-2 sm:gap-4 whitespace-nowrap">
                    <span className="font-mono-tabular text-6xl sm:text-7xl md:text-8xl lg:text-[92px] font-bold tracking-tight text-white drop-shadow-[0_6px_28px_rgba(0,0,0,0.98)] leading-none select-text">
                      {displayClock}
                    </span>
                    <span className="font-mono-tabular text-2xl sm:text-3xl md:text-4xl font-bold text-emerald-400 drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] leading-none select-text">
                      {displayAmPm}
                    </span>
                  </div>

                  <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs sm:text-sm font-mono text-slate-100 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
                    <span className="font-semibold whitespace-nowrap">{istDateStr}</span>
                    <span className="text-emerald-400 font-bold">•</span>
                    <span className="text-emerald-300 font-semibold whitespace-nowrap">{currentFlowText}</span>
                  </div>

                  {/* Return to Live Real-Time Badge when a preset is previewed */}
                  {!isLiveClock && (
                    <motion.button
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={handleReturnToLiveRealTime}
                      className="mt-2.5 px-3 py-1.5 rounded-full bg-emerald-950/85 hover:bg-emerald-900 border border-emerald-400/60 text-emerald-200 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xl backdrop-blur-md group"
                      title={language === 'EN' ? 'Click to return to live real-time Kathipara simulation' : 'நேரலை உருவகப்படுத்துதலுக்கு திரும்பு'}
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>
                        {language === 'EN'
                          ? `Previewing ${mode.toUpperCase()} · Return to Live Real-Time`
                          : `மாதிரி பார்வை (${mode.toUpperCase()}) · நேரலைக்கு திரும்பு`}
                      </span>
                      <span className="text-white font-bold transition-transform group-hover:rotate-180 duration-300">↺</span>
                    </motion.button>
                  )}
                </div>

                {/* Clean unboxed transit text (Anti-slop: zero pill capsules) */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] pt-1">
                  <span className="text-emerald-300 font-semibold">MTC Bus</span>
                  <span>·</span>
                  <span className="text-sky-300 font-semibold">CMRL Metro</span>
                  <span>·</span>
                  <span className="text-amber-300 font-semibold">Auto Rickshaw</span>
                  <span>·</span>
                  <span className="text-slate-300">Alandur Intermodal Interchange</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- Bottom Zone: Quick Action Dock & Simulation Controls --- */}
        <div className="space-y-3 z-20 w-full">
          {/* Action Dock */}
          <div className="w-full flex items-center justify-center">
            <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-2xl bg-black/55 backdrop-blur-2xl shadow-2xl border border-white/20 w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={onOpenExplorer}
                className="flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-[#005B47] hover:bg-[#004737] text-white font-semibold text-xs sm:text-sm transition-all duration-200 shadow-lg group cursor-pointer whitespace-nowrap shrink-0 flex-1 sm:flex-none border border-emerald-400/40"
              >
                <span className="material-symbols-outlined text-base sm:text-lg">explore</span>
                <span>{language === 'EN' ? 'Open Mobility Explorer' : 'நகர்வு வரைபடத்தை திற'}</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={onPlanJourney}
                className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-white/95 hover:bg-white text-slate-800 hover:text-slate-900 font-semibold text-xs sm:text-sm transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 flex-1 sm:flex-none shadow-md"
              >
                <span className="material-symbols-outlined text-base sm:text-lg text-emerald-800">sync_alt</span>
                <span>{language === 'EN' ? 'Plan a Journey' : 'பயணத் திட்டம்'}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={onSavedRoutes}
                className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-white/95 hover:bg-white text-slate-800 hover:text-slate-900 font-semibold text-xs sm:text-sm transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 flex-1 sm:flex-none shadow-md"
              >
                <span className="material-symbols-outlined text-base sm:text-lg text-emerald-800">bookmark</span>
                <span>{language === 'EN' ? 'Saved Routes' : 'சேமித்த வழிகள்'}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={onCommuteSpending}
                className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-white/95 hover:bg-white text-slate-800 hover:text-slate-900 font-semibold text-xs sm:text-sm transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 flex-1 sm:flex-none shadow-md"
              >
                <span className="material-symbols-outlined text-base sm:text-lg text-emerald-800">bar_chart</span>
                <span>{language === 'EN' ? 'Commute Insights' : 'பயணச் செலவு'}</span>
              </motion.button>
            </div>
          </div>

          {/* Bottom Control Bar: Location Geotag & Time-of-day Presets */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-2.5 text-xs w-full pt-0.5">
            {/* Left Geotag & Landmark Info */}
            <div className="flex items-center gap-2 text-slate-300 whitespace-nowrap shrink-0">
              <div className="flex items-center gap-1.5 font-medium text-white drop-shadow">
                <span className="material-symbols-outlined text-base text-emerald-400">location_on</span>
                <span className="font-semibold">
                  {language === 'EN' ? 'Kathipara Junction, Chennai' : 'கத்திப்பாரா சந்திப்பு, சென்னை'}
                </span>
              </div>
              <span className="text-slate-500 hidden sm:inline">•</span>
              <span className="text-slate-200 hidden md:inline drop-shadow">
                {currentFooterInfo}
              </span>
              <button
                onClick={() => setShowLandmarkCard(!showLandmarkCard)}
                className="px-2 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-400/40 text-emerald-300 text-[11px] font-semibold flex items-center gap-1 hover:bg-emerald-900/80 transition cursor-pointer"
                title="View Kathipara cloverleaf facts"
              >
                <span>I ❤️ CHENNAI</span>
                <span className="material-symbols-outlined text-[13px]">info</span>
              </button>
            </div>

            {/* Right: Presets, Rain Toggle & Simulation Controls */}
            <div className="flex flex-wrap items-center justify-center gap-2 shrink-0">
              {/* Daypart Presets Segmented Bar with Come back to Live Real-Time Button */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 shrink-0">
                {/* Dedicated Come Back to Live Real-Time Button */}
                <button
                  type="button"
                  onClick={handleReturnToLiveRealTime}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                    isLiveClock
                      ? 'bg-emerald-600 text-white font-semibold shadow-xs border border-emerald-400/50'
                      : 'text-emerald-300 hover:text-white hover:bg-emerald-950/50 font-medium'
                  }`}
                  title={
                    language === 'EN'
                      ? 'Come back to live real-time Kathipara simulation'
                      : 'நேரலை உருவகப்படுத்துதலுக்கு திரும்பு'
                  }
                >
                  <span className={`w-2 h-2 rounded-full ${isLiveClock ? 'bg-white animate-pulse' : 'bg-emerald-400'}`} />
                  <span>{language === 'EN' ? 'Live Real-Time' : 'நேரலை IST'}</span>
                </button>

                <div className="h-4 w-px bg-white/20 my-auto" />

                <button
                  type="button"
                  onClick={() => {
                    setIsLiveClock(false);
                    setMode('dawn');
                  }}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    mode === 'dawn' && !isLiveClock
                      ? 'bg-[#005B47] text-white font-semibold shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {language === 'EN' ? 'Dawn 06:00' : 'விடியல் 06:00'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsLiveClock(false);
                    setMode('midday');
                  }}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    mode === 'midday' && !isLiveClock
                      ? 'bg-[#005B47] text-white font-semibold shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {language === 'EN' ? 'Midday 12:00' : 'நண்பகல் 12:00'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsLiveClock(false);
                    setMode('dusk');
                  }}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    mode === 'dusk' && !isLiveClock
                      ? 'bg-[#005B47] text-white font-semibold shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {language === 'EN' ? 'Dusk 18:42' : 'அந்தி 18:42'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsLiveClock(false);
                    setMode('night');
                  }}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    mode === 'night' && !isLiveClock
                      ? 'bg-[#005B47] text-white font-semibold shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {language === 'EN' ? 'Night 00:00' : 'இரவு 00:00'}
                </button>

                {/* Rain Toggle */}
                <button
                  type="button"
                  onClick={() => setIsRaining(!isRaining)}
                  className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 border-l border-white/20 ml-0.5 pl-2 cursor-pointer whitespace-nowrap shrink-0 ${
                    isRaining
                      ? 'text-sky-300 bg-sky-950/80 border-sky-400/50 font-medium'
                      : 'text-slate-300 hover:text-white'
                  }`}
                  title={language === 'EN' ? 'Toggle Monsoon Drizzle' : 'மழை தூறலை இயக்கு/நிறுத்து'}
                >
                  <span className="material-symbols-outlined text-xs">rainy</span>
                  <span>{language === 'EN' ? 'Rain' : 'மழை'}</span>
                </button>
              </div>

              {/* Pause/Play Simulation */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 shrink-0">
                <button
                  onClick={() => setIsSimulating(!isSimulating)}
                  className="w-7 h-7 flex items-center justify-center text-white hover:scale-110 transition cursor-pointer"
                  title={
                    isSimulating
                      ? language === 'EN' ? 'Pause traffic simulation' : 'உருவகப்படுத்துதலை நிறுத்து'
                      : language === 'EN' ? 'Resume traffic simulation' : 'உருவகப்படுத்துதலை இயக்கு'
                  }
                >
                  <span className="material-symbols-outlined text-base">
                    {isSimulating ? 'pause' : 'play_arrow'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Info on Kathipara Landmark */}
        <AnimatePresence>
          {showLandmarkCard && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute bottom-24 left-6 z-30 max-w-sm p-4 rounded-xl bg-black/85 backdrop-blur-xl border border-emerald-400/30 text-white shadow-2xl"
            >
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-white/10">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-sm">
                  <span className="material-symbols-outlined text-base">hub</span>
                  <span>Kathipara Junction & Alandur</span>
                </div>
                <button
                  onClick={() => setShowLandmarkCard(false)}
                  className="text-slate-400 hover:text-white p-0.5 cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Asia's largest cloverleaf interchange spanning 500,000+ daily commuter trips. Seamlessly integrates Grand Southern Trunk (GST) Road, Inner Ring Road, Mount-Poonamallee Road, and Chennai Metro Rail (CMRL Corridor 1 & 2 elevated viaducts).
              </p>
              <div className="mt-3 flex items-center justify-between text-[11px] text-emerald-300 font-mono">
                <span>Coordinates: 13.0076° N, 80.2036° E</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
