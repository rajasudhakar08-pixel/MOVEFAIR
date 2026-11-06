import React from 'react';
import { motion } from 'motion/react';

interface LandingPageProps {
  onLaunchApp: () => void;
  onLoginClick: () => void;
  language: 'EN' | 'TA';
  setLanguage: (lang: 'EN' | 'TA') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchApp,
  onLoginClick,
  language,
  setLanguage,
}) => {
  const [activeTab, setActiveTab] = React.useState<string>('hero');

  // Complete bilingual dictionary for every single UI text element on the landing page
  const t = {
    // Nav items
    navHome: language === 'EN' ? 'Home' : 'முகப்பு',
    navFeatures: language === 'EN' ? 'Features' : 'அம்சங்கள்',
    navCommuters: language === 'EN' ? 'For Commuters' : 'பயணிகளுக்கு',
    navPlanners: language === 'EN' ? 'For Planners' : 'திட்டமிடுநருக்கு',
    navMethodology: language === 'EN' ? 'Data & Methodology' : 'தரவு & நெறிமுறை',
    loginBtn: language === 'EN' ? 'Log in' : 'உள்நுழைக',
    exploreBtn: language === 'EN' ? 'Explore App' : 'செயலியை திற',

    // Hero section
    platformBadge: language === 'EN'
      ? 'CHENNAI URBAN MOBILITY PLATFORM · CUMTA PS7'
      : 'சென்னை நகர்ப்புற போக்குவரத்து தளம் · CUMTA PS7',
    heroTitle: language === 'EN' ? (
      <>
        Smarter, Fairer & <br className="hidden sm:inline" />Greener Travel <br className="hidden sm:inline" />Across Chennai
      </>
    ) : (
      <>
        சென்னையில் புத்திசாலித்தனமான, <br className="hidden sm:inline" />நியாயமான மற்றும் <br className="hidden sm:inline" />பசுமைப் பயணம்
      </>
    ),
    heroSubtitle: language === 'EN'
      ? 'Plan your journeys, compare travel options, reduce costs and explore a more accessible and sustainable city across MTC buses, CMRL metro, and suburban rail.'
      : 'உங்கள் பயணங்களைத் திட்டமிடுங்கள், பயண விருப்பங்களை ஒப்பிட்டுப் பாருங்கள், செலவைக் குறைத்து, மாநகரப் பேருந்து, மெட்ரோ மற்றும் புறநகர் இரயில் மூலம் பசுமைச் சென்னையை ஆராயுங்கள்.',
    launchExplorerBtn: language === 'EN' ? 'Launch Mobility Explorer' : 'மொபிலிட்டி எக்ஸ்ப்ளோரரை துவங்கு',
    howItWorksBtn: language === 'EN' ? 'See How It Works' : 'எப்படி செயல்படுகிறது',
    poweredBy: language === 'EN' ? 'Powered by CUMTA & GCC GTFS' : 'CUMTA & GCC GTFS ஆதரவுடன்',
    noIncomeMandatory: language === 'EN' ? 'No Mandatory Income Input' : 'வருமான விவரங்கள் கட்டாயமில்லை',
    liveDataFeed: language === 'EN'
      ? 'Real-Time Data Feed: Chennai Central & CMRL Live'
      : 'நேரலை தரவு ஓட்டம்: சென்னை சென்ட்ரல் & CMRL நேரலை',

    // 4 Core Feature Cards
    feature1Title: language === 'EN' ? 'Plan & Compare Routes' : 'வழிகளை திட்டமிட்டு ஒப்பிடுங்கள்',
    feature1Desc: language === 'EN'
      ? 'Find Cheapest, Fastest & Balanced options across MTC, CMRL & suburban rail with step-by-step guidance.'
      : 'MTC பேருந்துகள், CMRL மெட்ரோ மற்றும் புறநகர் இரயில் மூலம் மலிவான, வேகமான மற்றும் சமநிலையான வழிகளைப் பெறுங்கள்.',

    feature2Title: language === 'EN' ? 'Save Money & Emissions' : 'பணத்தையும் உமிழ்வையும் மிச்சப்படுத்துங்கள்',
    feature2Desc: language === 'EN'
      ? 'Track recurring travel expenses, discover greener alternatives & reduce carbon footprint without hassle.'
      : 'மாதாந்திர பயணச் செலவுகளைக் கண்காணித்து, சுற்றுச்சூழலுக்கு உகந்த மாற்று வழிகளைத் தேர்ந்தெடுத்து கார்பன் தடத்தைக் குறையுங்கள்.',

    feature3Title: language === 'EN' ? 'Explore Ward Mobility' : 'வார்டு அளவிலான போக்குவரத்தை ஆராயுங்கள்',
    feature3Desc: language === 'EN'
      ? 'Visualise all 200 GCC wards, transit coverage, bus frequencies and walking accessibility catchment scores.'
      : 'சென்னை மாநகராட்சியின் 200 வார்டுகளின் போக்குவரத்து வசதி, பேருந்து அதிர்வெண் மற்றும் நடை அணுகல் மதிப்பெண்களைக் காண்க.',

    feature4Title: language === 'EN' ? 'Simulate Improvements' : 'போக்குவரத்து மேம்பாடுகளை உருவகப்படுத்துங்கள்',
    feature4Desc: language === 'EN'
      ? 'Planner-grade scenarios testing bus headway changes and feeder connectivity with clear impact metrics.'
      : 'பேருந்து கால இடைவெளி மாற்றங்கள் மற்றும் இணைப்பு வழித்தடங்களை சோதனை செய்து நேரடி விளைவு அளவீடுகளை ஆராயுங்கள்.',

    // For Commuters Section
    citizenDesignBadge: language === 'EN' ? 'Citizen First Design' : 'குடிமக்கள் மைய வடிவமைப்பு',
    commutersTitle: language === 'EN'
      ? 'Designed for Every Chennai Commuter'
      : 'ஒவ்வொரு சென்னை பயணிக்கும் ஏற்றவாறு வடிவமைக்கப்பட்டது',
    commutersDesc: language === 'EN'
      ? 'From students in Guindy to office commuters on OMR, travel choices made simple without technical transit jargon. Every journey answers four straightforward questions:'
      : 'கிண்டி மாணவர்கள் முதல் OMR அலுவலகப் பணியாளர்கள் வரை அனைவருக்கும் எளிய பயணத் தேர்வுகள். ஒவ்வொரு பயணமும் நான்கு தெளிவான கேள்விகளுக்கு விடையளிக்கிறது:',

    // 4 Citizen Steps
    step1Title: language === 'EN' ? '1. Find' : '1. கண்டறி',
    step1Question: language === 'EN' ? 'Where do you want to go?' : 'நீங்கள் எங்கு செல்ல வேண்டும்?',
    step1Desc: language === 'EN'
      ? 'Easy destination search with popular landmarks, metro stops, suburban stations, IT corridor tech parks, and quick recent shortcuts.'
      : 'முக்கிய அடையாளங்கள், மெட்ரோ நிலையங்கள், புறநகர் நிலையங்கள் மற்றும் IT பூங்காக்களுக்கான எளிய இலக்குத் தேடல்.',
    step1PreviewText: language === 'EN' ? 'Guindy Station to Tidel Park' : 'கிண்டி நிலையம் முதல் டைடல் பார்க் வரை',
    step1PreviewBadge: language === 'EN' ? 'Fastest' : 'மிக விரைவானது',
    step1PreviewSub: language === 'EN' ? 'Metro + MTC feeder available' : 'மெட்ரோ + MTC இணைப்பு பேருந்து உள்ளது',

    step2Title: language === 'EN' ? '2. Travel' : '2. பயணம்',
    step2Question: language === 'EN' ? 'How do you get there?' : 'அங்கு எப்படி செல்வது?',
    step2Desc: language === 'EN'
      ? 'Step-by-step guidance combining MTC buses, CMRL Metro, suburban rail, walk segments, and first/last-mile shared mobility.'
      : 'பேருந்து, மெட்ரோ, புறநகர் இரயில், நடை மற்றும் பகிரப்பட்ட ஆட்டோக்களை ஒருங்கிணைக்கும் படிப்படியான வழிகாட்டல்.',
    step2PreviewText: language === 'EN' ? 'Transit Combination' : 'போக்குவரத்து சேர்க்கை',
    step2Time: language === 'EN' ? '34 min' : '34 நிமிடம்',
    step2Walk: language === 'EN' ? 'Walk 4m' : 'நடை 4நிமி',
    step2BlueLine: language === 'EN' ? 'Blue Line' : 'நீல வழித்தடம்',

    step3Title: language === 'EN' ? '3. Spend' : '3. செலவு',
    step3Question: language === 'EN' ? 'What will it cost?' : 'இதற்கான கட்டணம் என்ன?',
    step3Desc: language === 'EN'
      ? 'Clear transparent single-trip fares and monthly commute budget projections without requiring personal bank or income details.'
      : 'தனிநபர் வங்கி அல்லது வருமான விவரங்கள் ஏதுமின்றி வெளிப்படையான கட்டணம் மற்றும் மாதாந்திர பட்ஜெட் கணிப்பு.',
    step3PreviewText: language === 'EN' ? 'Fare Comparison' : 'கட்டண ஒப்பீடு',
    step3FarePerTrip: language === 'EN' ? '₹28 / trip' : '₹28 / பயணம்',
    step3Savings: language === 'EN' ? 'Saves ₹1,240/month vs cab ride' : 'வாடகை காரை விட மாதம் ₹1,240 சேமிப்பு',

    step4Title: language === 'EN' ? '4. Choose Better' : '4. நல்வழி தேர்வு',
    step4Question: language === 'EN' ? 'Is there a greener option?' : 'பசுமையான வழி உள்ளதா?',
    step4Desc: language === 'EN'
      ? 'Constructive, non-judgmental eco nudges that spotlight rupees saved and kilograms of carbon avoided on every Chennai trip.'
      : 'சேமிக்கப்பட்ட பணம் மற்றும் தவிர்க்கப்பட்ட கார்பன் உமிழ்வை வெளிப்படுத்தும் ஆக்கபூர்வமான சுற்றுச்சூழல் வழிகாட்டல்.',
    step4EcoTag: language === 'EN' ? 'ECO CHOICE' : 'பசுமைத் தேர்வு',
    step4EcoTrees: language === 'EN' ? 'Equivalent to 3 urban trees planted' : '3 மரங்கள் நட்டதற்கு சமமான பலன்',

    // Trip Preview section
    tripPreviewBadge: language === 'EN' ? 'Live Trip Preview' : 'நேரலை பயண முன்னோட்டம்',
    tripPreviewTitle: language === 'EN'
      ? 'Compare Chennai Routes: Anna Nagar West → TIDEL Park'
      : 'சென்னை வழித்தட ஒப்பீடு: அண்ணா நகர் மேற்கு → டைடல் பார்க்',
    tripPreviewSimulated: language === 'EN'
      ? 'Simulated for: Peak Morning (08:30 AM)'
      : 'உருவகப்படுத்துதல்: காலை நெரிசல் நேரம் (08:30 AM)',

    cheapestOption: language === 'EN' ? 'Cheapest Option' : 'குறைந்த செலவு வழி',
    cheapestDesc: language === 'EN'
      ? 'Direct ordinary/deluxe service. Lowest expenditure for daily workers & university students.'
      : 'நேரடி சாதாரண/டீலக்ஸ் சேவை. தினசரி தொழிலாளர்கள் மற்றும் மாணவர்களுக்கு மிகக் குறைந்த செலவு.',

    fastestOption: language === 'EN' ? 'Fastest Option' : 'மிக விரைவான வழி',
    fastestMode: language === 'EN' ? 'Metro + Feeder Auto' : 'மெட்ரோ + ஃபீடர் ஆட்டோ',
    fastestDesc: language === 'EN'
      ? 'CMRL Green Line to Guindy interchange, followed by quick last-mile share auto to TIDEL.'
      : 'CMRL பச்சை வழித்தடத்தில் கிண்டி சந்திப்பு, பின் டைடல் பார்க்கிற்கு விரைவு ஷேர் ஆட்டோ.',

    balancedOption: language === 'EN' ? 'Balanced (Recommended)' : 'சமநிலையானது (பரிந்துரை)',
    balancedMode: language === 'EN' ? 'Metro + MTC AC-feeder' : 'மெட்ரோ + MTC குளிர்சாதன இணைப்பு',
    balancedDesc: language === 'EN'
      ? 'Optimised balance between commute expenditure, comfort in Chennai heat, and reliability.'
      : 'பயணச் செலவு, சென்னை வெயிலுக்கான சௌகரியம் மற்றும் நேர நம்பகத்தன்மையின் சிறந்த சமநிலை.',

    minsUnit: language === 'EN' ? 'mins' : 'நிமி',
    walkUnit: language === 'EN' ? 'walk' : 'நடை',

    // For Planners Section
    plannersBadge: language === 'EN' ? 'CUMTA Analytics Suite' : 'CUMTA பகுப்பாய்வுக் கருவிகள்',
    plannersTitle: language === 'EN'
      ? 'Empowering CUMTA & Urban Mobility Planners'
      : 'CUMTA மற்றும் நகர்ப்புற திட்டமிடுநர்களுக்கான அதிகாரம்',
    plannersDesc: language === 'EN'
      ? 'A dedicated analytical workspace to identify transport gaps, evaluate ward accessibility, and test operational improvements across the Chennai Metropolitan Area.'
      : 'சென்னை பெருநகரப் பகுதியில் போக்குவரத்து இடைவெளிகளைக் கண்டறிந்து, வார்டு அணுகலை ஆராய்ந்து, செயல்பாட்டு சீர்திருத்தங்களைச் சோதிக்கும் பிரத்யேக களம்.',
    explorePlannerBtn: language === 'EN'
      ? 'Explore Planner Workspace in App'
      : 'செயலியில் திட்டமிடுநர் களத்தை ஆராய்க',

    // Planner Card 1
    planner1Tag: language === 'EN' ? 'Spatial GIS' : 'இடஞ்சார்ந்த GIS',
    planner1Count: language === 'EN' ? '200 Wards' : '200 வார்டுகள்',
    planner1Title: language === 'EN' ? 'Ward Accessibility & Coverage' : 'வார்டு அணுகல் மற்றும் சேவைப் பரப்பு',
    planner1Desc: language === 'EN'
      ? 'Granular GCC ward-level spatial data, stop densities, and 500m/800m walking access catchment buffers to identify underserved residential pockets.'
      : 'சேவை குறைந்த பகுதிகளைக் கண்டறிய சென்னை வார்டு அளவிலான GIS தரவு, பேருந்து நிறுத்த அடர்த்தி மற்றும் 500மீ/800மீ நடை அணுகல் பகுப்பாய்வு.',
    planner1Metric: language === 'EN' ? 'Average Ward Walk Accessibility' : 'சராசரி வார்டு நடை அணுகல்',
    planner1Note: language === 'EN'
      ? 'Wards in Zone 13 & 14 show largest feeder deficits'
      : 'மண்டலம் 13 & 14 வார்டுகளில் இணைப்புப் பேருந்து பற்றாக்குறை அதிகம்',
    planner1Footer: language === 'EN'
      ? 'Layer: GCC Ward Shapefiles + OSM Pedestrian Network'
      : 'அடுக்கு: GCC வார்டு எல்லைகள் + OSM பாதசாரி வரைபடம்',

    // Planner Card 2
    planner2Tag: language === 'EN' ? 'Headway Engine' : 'கால இடைவெளி என்ஜின்',
    planner2Count: language === 'EN' ? 'GTFS Feeds' : 'GTFS தரவுகள்',
    planner2Title: language === 'EN' ? 'Frequency & Headway Analysis' : 'அதிர்வெண் & கால இடைவெளி பகுப்பாய்வு',
    planner2Desc: language === 'EN'
      ? 'Scheduled timetable evaluations and service density mapping. Contrast peak vs off-peak frequencies across key corridors like GST Road and OMR.'
      : 'ஜிஎஸ்டி சாலை மற்றும் ஓஎம்ஆர் போன்ற முக்கிய வழித்தடங்களில் நெரிசல் மற்றும் சாதாரண நேர அதிர்வெண்களை ஒப்பிடும் அட்டவணை மதிப்பீடு.',
    planner2Metric: language === 'EN' ? 'Peak Headway Adherence' : 'நெரிசல் நேர அட்டவணை கடைபிடிப்பு',
    planner2Note: language === 'EN'
      ? 'MTC Route 570 frequency: 6-8 mins during 08:00-11:00'
      : 'MTC தடம் 570 அதிர்வெண்: 08:00-11:00 வரை 6-8 நிமிடங்கள்',
    planner2Footer: language === 'EN'
      ? 'Scheduled timetable validations'
      : 'திட்டமிடப்பட்ட நேர அட்டவணை சரிபார்ப்புகள்',

    // Planner Card 3
    planner3Tag: language === 'EN' ? 'Simulation Lab' : 'உருவகப்படுத்துதல் கூடம்',
    planner3Count: language === 'EN' ? 'What-If Scenarios' : 'மாற்று சூழல் சோதனைகள்',
    planner3Title: language === 'EN' ? 'Policy & Scenario Testing' : 'கொள்கை மற்றும் சூழல் சோதனை',
    planner3Desc: language === 'EN'
      ? 'Simulate headway reductions, fleet reallocation, and feeder route additions with instant before-and-after impact metrics on citizen travel time.'
      : 'பேருந்து இடைவெளிக் குறைப்பு, பேருந்து மறுஒதுக்கீடு மற்றும் இணைப்புப் பேருந்து வழிகளைச் சோதித்து பயண நேர மாற்றங்களை முன்கூட்டியே கணக்கிடுங்கள்.',
    planner3Metric: language === 'EN' ? 'Potential Travel Time Reduction' : 'சாத்தியமான பயண நேரக் குறைப்பு',
    planner3Note: language === 'EN'
      ? 'Tested: 12 new midi-bus feeder loops at Alandur'
      : 'சோதிக்கப்பட்டது: ஆலந்தூரில் 12 புதிய மினி-பேருந்து சுற்றுகள்',
    planner3Footer: language === 'EN'
      ? 'Predictive accessibility impact reports'
      : 'முன்கணிப்பு அணுகல் தாக்க அறிக்கைகள்',

    // Data Integrity & Methodology
    governanceBadge: language === 'EN' ? 'Open Transit Data Governance' : 'திறந்தநிலை போக்குவரத்து தரவு நிர்வாகம்',
    governanceTitle: language === 'EN' ? 'Data Integrity, Provenance & Privacy' : 'தரவு ஒருமைப்பாடு, நம்பகத்தன்மை & தனியுரிமை',
    governanceDesc: language === 'EN'
      ? 'MOVEFAIR strictly classifies all calculations so commuters and planners understand the underlying truth of every single number.'
      : 'பயணிகள் மற்றும் திட்டமிடுநர்கள் ஒவ்வொரு கணக்கீட்டின் பின்னணியையும் தெளிவாகப் புரிந்துகொள்ளும் வகையில் MOVEFAIR வகைப்படுத்துகிறது.',

    provOfficialTag: language === 'EN' ? 'Official' : 'அதிகாரப்பூர்வ',
    provOfficialTitle: language === 'EN' ? 'Official Tariffs' : 'அரசு கட்டணங்கள்',
    provOfficialDesc: language === 'EN'
      ? 'Gazetted MTC stage fares, CMRL distance tables, and Southern Railway tickets.'
      : 'அரசிதழ் பதிவுபெற்ற MTC கட்டண நிலைகள், CMRL தொலைவு அட்டவணை மற்றும் தென்னக இரயில்வே டிக்கெட்டுகள்.',

    provScheduledTag: language === 'EN' ? 'Scheduled' : 'திட்டமிடப்பட்ட',
    provScheduledTitle: language === 'EN' ? 'Scheduled GTFS' : 'அட்டவணை GTFS தரவு',
    provScheduledDesc: language === 'EN'
      ? 'Published timetable departures and stop sequences validated against CUMTA feeds.'
      : 'CUMTA தரவுகளுடன் ஒப்பிட்டுச் சரிபார்க்கப்பட்ட அதிகாரப்பூர்வ புறப்படும் நேரங்கள் மற்றும் நிறுத்த வரிசைகள்.',

    provCalculatedTag: language === 'EN' ? 'Calculated' : 'கணக்கிடப்பட்ட',
    provCalculatedTitle: language === 'EN' ? 'Calculated Routes' : 'கணக்கிடப்பட்ட வழிகள்',
    provCalculatedDesc: language === 'EN'
      ? 'Deterministic multi-modal routing algorithms with real road and walk distances.'
      : 'உண்மையான சாலை மற்றும் நடை தொலைவுகளைக் கொண்ட பலவகை போக்குவரத்து வழிகாட்டல் வழிமுறைகள்.',

    provModelledTag: language === 'EN' ? 'Modelled' : 'மாதிரியாக்கப்பட்ட',
    provModelledTitle: language === 'EN' ? 'Modelled Emissions' : 'கார்பன் உமிழ்வு மாதிரி',
    provModelledDesc: language === 'EN'
      ? 'CO₂ emission factors derived from ARAI emission standards for Indian vehicles.'
      : 'இந்திய வாகனங்களுக்கான ARAI உமிழ்வு தரநிலைகளிலிருந்து பெறப்பட்ட கார்பன் உமிழ்வு காரணிகள்.',

    provUserTag: language === 'EN' ? 'User-Entered' : 'பயனர் உள்ளீடு',
    provUserTitle: language === 'EN' ? 'User Optional' : 'விருப்ப பயனர் தகவல்',
    provUserDesc: language === 'EN'
      ? 'Commute frequency & preferences stored strictly on-device in local session memory.'
      : 'பயண விருப்பங்கள் சாதனத்தின் உள்ளூர் நினைவகத்தில் மட்டுமே பாதுகாப்பாக சேமிக்கப்படுகின்றன.',

    citationsHeading: language === 'EN' ? 'Official Citations & Sources' : 'அதிகாரப்பூர்வ மேற்கோள்கள் & மூலங்கள்',
    citeCumtaGcc: language === 'EN'
      ? 'Chennai Comprehensive Mobility Plan (CMP), 200 Ward boundary GIS shapefiles.'
      : 'சென்னை விரிவான போக்குவரத்து திட்டம் (CMP), 200 வார்டு எல்லை GIS கோப்புகள்.',
    citeMtc: language === 'EN'
      ? 'Metropolitan Transport Corporation bus routes, fare stages, and terminal schedules.'
      : 'மாநகர போக்குவரத்துக் கழக பேருந்து வழித்தடங்கள், கட்டண நிலைகள் மற்றும் முனைய அட்டவணைகள்.',
    citeCmrlSr: language === 'EN'
      ? 'Phase 1 & Phase 2 network alignments and suburban Chennai timetables.'
      : 'கட்டம் 1 & கட்டம் 2 மெட்ரோ வழித்தடங்கள் மற்றும் சென்னை புறநகர் இரயில்வே அட்டவணைகள்.',
    citeOsm: language === 'EN'
      ? 'Road hierarchies, walkable footpaths, and pedestrian crossing infrastructure.'
      : 'சாலை வகைப்பாடுகள், நடைபாதைகள் மற்றும் பாதசாரி கடக்கும் உள்கட்டமைப்பு.',

    privacyHeading: language === 'EN' ? 'Strict Citizen Privacy Commitment' : 'கடுமையான குடிமக்கள் தனியுரிமை உறுதிப்பாடு',
    privacyDesc: language === 'EN'
      ? 'Fairness requires dignity. MOVEFAIR does not mandate salary disclosures to compute affordability. Commute expense estimates are computed transparently based purely on user-selected trip frequencies.'
      : 'சமத்துவத்திற்கு கண்ணியம் அவசியம். பயணச் செலவைக் கணக்கிட சம்பள விவரங்களை MOVEFAIR கேட்பதில்லை. பயனர் தேர்ந்தெடுக்கும் பயண எண்ணிக்கையின் அடிப்படையில் மட்டுமே செலவு வெளிப்படையாகக் கணக்கிடப்படுகிறது.',
    privacyLock: language === 'EN'
      ? 'No persistent location logs stored without explicit opt-in.'
      : 'உங்கள் அனுமதியின்றி இருப்பிடத் தகவல்கள் எதுவும் சேமிக்கப்படுவதில்லை.',

    // Footer
    footerBio: language === 'EN'
      ? 'Startup Peravai × CUMTA Mobility Challenge, PS7 — Transport Accessibility & Affordability. Benchmarking equity, connectivity, and emissions for the Greater Chennai metropolitan area.'
      : 'ஸ்டார்ட்அப் பேரவை × CUMTA மொபிலிட்டி சேலஞ்ச், PS7 — போக்குவரத்து அணுகல் & மலிவு விலை. பெருநகர சென்னைக்கான சமத்துவம், இணைப்பு மற்றும் உமிழ்வு மதிப்பீடு.',
    footerPs7Badge: language === 'EN' ? 'CUMTA Problem Statement 7' : 'CUMTA பிரச்சனை அறிக்கை 7',

    colProduct: language === 'EN' ? 'Product' : 'தயாரிப்பு',
    linkHomeOverview: language === 'EN' ? 'Home Overview' : 'முகப்பு கண்ணோட்டம்',
    linkExploreChennai: language === 'EN' ? 'Explore Chennai' : 'சென்னையை ஆராய்க',
    linkJourneyPlanner: language === 'EN' ? 'Journey Planner' : 'பயணத் திட்டமிடுநர்',
    linkTravelSpending: language === 'EN' ? 'Travel Spending' : 'பயணச் செலவு',
    linkGreenCommuteMeter: language === 'EN' ? 'Green Commute Meter' : 'பசுமைப் பயண மீட்டர்',

    colForPlanners: language === 'EN' ? 'For Planners' : 'திட்டமிடுநருக்கு',
    linkWardOverview: language === 'EN' ? 'Ward Overview (200 Wards)' : 'வார்டு கண்ணோட்டம் (200 வார்டுகள்)',
    linkServiceAnalysis: language === 'EN' ? 'Service Analysis' : 'சேவைப் பகுப்பாய்வு',
    linkScenarioModeler: language === 'EN' ? 'Scenario Modeler' : 'மாதிரி உத்திகள்',
    linkCatchmentBuffers: language === 'EN' ? 'Catchment Buffers (500m/800m)' : 'அணுகல் எல்லைகள் (500மீ/800மீ)',
    linkHeadwayHeatmaps: language === 'EN' ? 'Headway Heatmaps' : 'இடைவெளி வெப்ப வரைபடங்கள்',

    colResources: language === 'EN' ? 'Resources' : 'வளங்கள்',
    linkDataManifest: language === 'EN' ? 'Data Manifest' : 'தரவு அறிக்கை',
    linkGtfsFeeds: language === 'EN' ? 'GTFS Transit Feeds' : 'GTFS போக்குவரத்து தரவுகள்',
    linkMethodology: language === 'EN' ? 'Methodology & Standards' : 'நெறிமுறைகள் & தரநிலைகள்',
    linkOpenApi: language === 'EN' ? 'Open API Documentation' : 'ஓபன் API ஆவணங்கள்',
    linkGisExports: language === 'EN' ? 'Chennai Ward GIS Exports' : 'சென்னை வார்டு GIS கோப்புகள்',

    colGovernance: language === 'EN' ? 'Governance & Legal' : 'நிர்வாகம் & சட்டம்',
    linkPrivacyPolicy: language === 'EN' ? 'Privacy Policy' : 'தனியுரிமைக் கொள்கை',
    linkTermsOfService: language === 'EN' ? 'Terms of Service' : 'சேவை விதிமுறைகள்',
    linkOpenDataLicense: language === 'EN' ? 'Open Data License' : 'திறந்த தரவு உரிமம்',
    linkHelpDesk: language === 'EN' ? 'Help Desk & Feedback' : 'உதவி மையம் & பின்னூட்டம்',
    linkCumtaCoord: language === 'EN' ? 'CUMTA Coordination' : 'CUMTA ஒருங்கிணைப்பு',

    footerCopyright: language === 'EN'
      ? '© 2025–2026 MOVEFAIR Chennai Urban Mobility Observatory. All rights reserved.'
      : '© 2025–2026 MOVEFAIR சென்னை நகர்ப்புற போக்குவரத்து கண்காணிப்பகம். அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.',
    footerMadeFor: language === 'EN'
      ? 'Made for Chennai with open transit data.'
      : 'திறந்தநிலை போக்குவரத்து தரவுகளுடன் சென்னைக்காக உருவாக்கப்பட்டது.',
    footerAllOperational: language === 'EN' ? 'All systems operational' : 'அனைத்து அமைப்புகளும் இயங்குகின்றன',
  };

  const navItems = [
    { id: 'hero', label: t.navHome },
    { id: 'features', label: t.navFeatures },
    { id: 'commuters', label: t.navCommuters },
    { id: 'planners', label: t.navPlanners },
    { id: 'methodology', label: t.navMethodology },
  ];

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Listen to window scroll to update active nav tab automatically
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const sectionIds = ['methodology', 'planners', 'commuters', 'features', 'hero'];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop - 120;
          if (scrollY >= top) {
            setActiveTab(id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F6F7F4] text-[#202923] selection:bg-[#28745E] selection:text-white antialiased overflow-x-hidden w-full">
      {/* 1. Header */}
      <header className="w-full bg-[#F6F7F4]/95 backdrop-blur-md border-b border-[#E4E8E2] sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 h-20 flex items-center justify-between gap-4">
          {/* Logo with fixed width so it never crowds or overflows tabs */}
          <div className="flex items-center gap-3 group cursor-pointer flex-shrink-0" onClick={() => scrollToSection('hero')}>
            <div className="w-9 h-9 rounded-full bg-[#174D3D] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105 flex-shrink-0">
              <svg className="w-5 h-5 text-emerald-300" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" viewBox="0 0 24 24">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <div className="flex flex-col flex-shrink-0">
              <span className="text-xl font-extrabold tracking-tight text-[#174D3D] uppercase leading-none">Movefair</span>
              <span className="text-[10px] font-semibold text-[#6D7770] tracking-wider uppercase mt-1">Chennai Mobility</span>
            </div>
          </div>

          {/* Nav links with animated indicator and exact layout bounds */}
          <nav aria-label="Primary Navigation" className="hidden lg:flex items-center space-x-1 sm:space-x-2 xl:space-x-4 text-sm font-semibold flex-shrink-0">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center whitespace-nowrap ${
                    isActive ? 'text-[#174D3D] font-bold' : 'text-[#6D7770] hover:text-[#174D3D]'
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#174D3D] rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action buttons & language toggle */}
          <div className="flex items-center space-x-3">
            {/* Language toggle */}
            <div className="inline-flex items-center bg-[#E9EFE9] rounded-lg p-0.5 border border-[#d2ddd3] text-xs font-semibold text-[#6D7770] mr-2">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setLanguage('EN')}
                className={`px-2.5 py-1 rounded transition-all cursor-pointer ${language === 'EN' ? 'bg-white text-[#174D3D] shadow-xs font-bold' : 'hover:text-[#174D3D]'}`}
                title="Switch to English"
              >
                EN
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setLanguage('TA')}
                className={`px-2.5 py-1 rounded transition-all cursor-pointer ${language === 'TA' ? 'bg-white text-[#174D3D] shadow-xs font-bold' : 'hover:text-[#174D3D]'}`}
                title="தமிழுக்கு மாறவும்"
              >
                தமிழ்
              </motion.button>
            </div>

            <motion.button
              whileHover={{ scale: 1.03, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
              whileTap={{ scale: 0.96 }}
              onClick={onLoginClick}
              className="px-4 py-2 text-sm font-semibold text-[#174D3D] border border-[#174D3D]/30 rounded-lg hover:border-[#174D3D] transition-all cursor-pointer shadow-xs whitespace-nowrap"
            >
              {t.loginBtn}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03, backgroundColor: '#28745E' }}
              whileTap={{ scale: 0.96 }}
              onClick={onLaunchApp}
              className="px-5 py-2 text-sm font-semibold text-white bg-[#174D3D] rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <span>{t.exploreBtn}</span>
            </motion.button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <main className="flex-grow">
        <section id="hero" className="w-full relative overflow-hidden pt-8 pb-16 lg:py-16 border-b border-[#E4E8E2]">
          <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center min-h-[560px]">
              {/* Left col */}
              <div className="lg:col-span-6 flex flex-col justify-center z-10">
                <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-[#E9EFE9] border border-[#d2ddd3] mb-6 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-[#28745E] animate-pulse"></span>
                  <span className="text-xs font-bold tracking-wider text-[#28745E] uppercase">
                    {t.platformBadge}
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-[#202923] leading-[1.14] tracking-tight mb-5">
                  {t.heroTitle}
                </h1>

                <p className="text-base sm:text-lg text-[#6D7770] font-normal leading-relaxed max-w-xl mb-8">
                  {t.heroSubtitle}
                </p>

                <div className="flex flex-wrap items-center gap-4 mb-10">
                  <motion.button
                    whileHover={{ scale: 1.04, y: -2, boxShadow: '0 10px 25px -5px rgba(23, 77, 61, 0.4)' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={onLaunchApp}
                    className="inline-flex items-center justify-center px-6 py-3.5 rounded-lg text-white font-semibold bg-[#174D3D] hover:bg-[#28745E] shadow-sm transition-all group cursor-pointer"
                  >
                    <span>{t.launchExplorerBtn}</span>
                    <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </motion.button>
                  <motion.a
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    href="#how-it-works"
                    className="inline-flex items-center justify-center px-6 py-3.5 rounded-lg text-[#202923] font-semibold bg-white border border-[#E4E8E2] hover:bg-[#F6F7F4] hover:border-[#6D7770]/40 transition-all shadow-sm"
                  >
                    {t.howItWorksBtn}
                  </motion.a>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-xs text-[#6D7770]">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-[#28745E]">verified</span>
                    <span>{t.poweredBy}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-[#28745E]">lock</span>
                    <span>{t.noIncomeMandatory}</span>
                  </div>
                </div>
              </div>

              {/* Right col: curved photo visual with live pill badge */}
              <div className="lg:col-span-6 relative w-full h-[360px] sm:h-[440px] lg:h-[500px] flex items-center justify-center">
                <div className="relative w-full h-full max-w-[580px] hero-curved-frame overflow-hidden shadow-2xl border-4 border-white/95 bg-slate-200">
                  <img
                    alt="Chennai Central railway station, elevated metro rail viaduct, and green MTC bus on clean tree-lined avenue"
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700 ease-out"
                    src="/assets/aistudio/screen_7c99ed56.png"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>

                  {/* Floating Live Pill Status Badge */}
                  <div className="absolute bottom-5 left-6 sm:bottom-7 sm:left-8 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/80 shadow-lg flex items-center gap-2.5 pointer-events-auto">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-bold text-[#202923] tracking-wide">
                      {t.liveDataFeed}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Core Feature Cards (Below Hero) */}
            <div className="mt-14 pt-10 border-t border-[#E4E8E2] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="features">
              <div className="bg-white rounded-xl p-5 border border-[#E4E8E2] hover:border-[#28745E]/40 hover:shadow-md transition-all group">
                <div className="w-11 h-11 rounded-lg bg-[#E9EFE9] flex items-center justify-center text-[#28745E] mb-3.5 group-hover:bg-[#28745E] group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-2xl">directions_bus</span>
                </div>
                <h3 className="text-base font-bold text-[#202923] mb-1.5">{t.feature1Title}</h3>
                <p className="text-xs leading-relaxed text-[#6D7770]">
                  {t.feature1Desc}
                </p>
              </div>

              <div className="bg-white rounded-xl p-5 border border-[#E4E8E2] hover:border-[#28745E]/40 hover:shadow-md transition-all group">
                <div className="w-11 h-11 rounded-lg bg-[#E9EFE9] flex items-center justify-center text-[#28745E] mb-3.5 group-hover:bg-[#28745E] group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-2xl">eco</span>
                </div>
                <h3 className="text-base font-bold text-[#202923] mb-1.5">{t.feature2Title}</h3>
                <p className="text-xs leading-relaxed text-[#6D7770]">
                  {t.feature2Desc}
                </p>
              </div>

              <div className="bg-white rounded-xl p-5 border border-[#E4E8E2] hover:border-[#28745E]/40 hover:shadow-md transition-all group">
                <div className="w-11 h-11 rounded-lg bg-[#E9EFE9] flex items-center justify-center text-[#28745E] mb-3.5 group-hover:bg-[#28745E] group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-2xl">query_stats</span>
                </div>
                <h3 className="text-base font-bold text-[#202923] mb-1.5">{t.feature3Title}</h3>
                <p className="text-xs leading-relaxed text-[#6D7770]">
                  {t.feature3Desc}
                </p>
              </div>

              <div className="bg-white rounded-xl p-5 border border-[#E4E8E2] hover:border-[#28745E]/40 hover:shadow-md transition-all group">
                <div className="w-11 h-11 rounded-lg bg-[#E9EFE9] flex items-center justify-center text-[#28745E] mb-3.5 group-hover:bg-[#28745E] group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-2xl">tune</span>
                </div>
                <h3 className="text-base font-bold text-[#202923] mb-1.5">{t.feature4Title}</h3>
                <p className="text-xs leading-relaxed text-[#6D7770]">
                  {t.feature4Desc}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. For Commuters Section */}
        <section className="w-full py-20 bg-white border-b border-[#E4E8E2]" id="commuters">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
            <div className="max-w-3xl mb-14">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9EFE9] text-[#28745E] text-xs font-bold uppercase tracking-wider mb-3">
                {t.citizenDesignBadge}
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#202923] tracking-tight mb-4">
                {t.commutersTitle}
              </h2>
              <p className="text-base sm:text-lg text-[#6D7770]">
                {t.commutersDesc}
              </p>
            </div>

            {/* 4 Citizen Questions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Q1: Find */}
              <div className="bg-[#F6F7F4] rounded-2xl p-6 border border-[#E4E8E2] flex flex-col justify-between hover:shadow-lg transition-all">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-[#28745E] font-mono tracking-widest bg-white px-2.5 py-1 rounded-md border border-[#E4E8E2]">STEP 01</span>
                    <span className="material-symbols-outlined text-[#28745E]">travel_explore</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#202923] mb-2">{t.step1Title}</h3>
                  <p className="text-xs font-semibold text-[#174D3D] mb-3">{t.step1Question}</p>
                  <p className="text-sm text-[#6D7770] mb-6">
                    {t.step1Desc}
                  </p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#E4E8E2] text-xs space-y-2">
                  <div className="flex items-center gap-2 text-[#202923] font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="truncate">{t.step1PreviewText}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#6D7770]">
                    <span className="px-1.5 py-0.5 rounded bg-[#E9EFE9] text-[#174D3D] font-bold">{t.step1PreviewBadge}</span>
                    <span>{t.step1PreviewSub}</span>
                  </div>
                </div>
              </div>

              {/* Q2: Travel */}
              <div className="bg-[#F6F7F4] rounded-2xl p-6 border border-[#E4E8E2] flex flex-col justify-between hover:shadow-lg transition-all">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-[#547F93] font-mono tracking-widest bg-white px-2.5 py-1 rounded-md border border-[#E4E8E2]">STEP 02</span>
                    <span className="material-symbols-outlined text-[#547F93]">route</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#202923] mb-2">{t.step2Title}</h3>
                  <p className="text-xs font-semibold text-[#547F93] mb-3">{t.step2Question}</p>
                  <p className="text-sm text-[#6D7770] mb-6">
                    {t.step2Desc}
                  </p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#E4E8E2] text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#202923]">{t.step2PreviewText}</span>
                    <span className="font-mono text-[11px] text-[#6D7770]">{t.step2Time}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-[#547F93] font-semibold">
                    <span>{t.step2Walk}</span> → <span className="bg-blue-50 text-[#547F93] px-1 rounded">{t.step2BlueLine}</span> → <span>MTC 19B</span>
                  </div>
                </div>
              </div>

              {/* Q3: Spend */}
              <div className="bg-[#F6F7F4] rounded-2xl p-6 border border-[#E4E8E2] flex flex-col justify-between hover:shadow-lg transition-all">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-[#D49A57] font-mono tracking-widest bg-white px-2.5 py-1 rounded-md border border-[#E4E8E2]">STEP 03</span>
                    <span className="material-symbols-outlined text-[#D49A57]">account_balance_wallet</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#202923] mb-2">{t.step3Title}</h3>
                  <p className="text-xs font-semibold text-[#D49A57] mb-3">{t.step3Question}</p>
                  <p className="text-sm text-[#6D7770] mb-6">
                    {t.step3Desc}
                  </p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#E4E8E2] text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-[#202923]">
                    <span>{t.step3PreviewText}</span>
                    <span className="text-emerald-700 font-mono">{t.step3FarePerTrip}</span>
                  </div>
                  <div className="text-[11px] text-[#6D7770]">
                    {t.step3Savings}
                  </div>
                </div>
              </div>

              {/* Q4: Choose Better */}
              <div className="bg-[#F6F7F4] rounded-2xl p-6 border border-[#E4E8E2] flex flex-col justify-between hover:shadow-lg transition-all">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-[#28745E] font-mono tracking-widest bg-white px-2.5 py-1 rounded-md border border-[#E4E8E2]">STEP 04</span>
                    <span className="material-symbols-outlined text-[#28745E]">compost</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#202923] mb-2">{t.step4Title}</h3>
                  <p className="text-xs font-semibold text-[#28745E] mb-3">{t.step4Question}</p>
                  <p className="text-sm text-[#6D7770] mb-6">
                    {t.step4Desc}
                  </p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#E4E8E2] text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-[#28745E]">
                    <span>-2.4 kg CO₂e</span>
                    <span className="text-[10px] bg-emerald-100 text-[#174D3D] px-1.5 py-0.5 rounded font-bold">{t.step4EcoTag}</span>
                  </div>
                  <div className="text-[11px] text-[#6D7770]">
                    {t.step4EcoTrees}
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Journey Comparison Card */}
            <div className="mt-12 bg-[#F6F7F4] border border-[#E4E8E2] rounded-2xl p-6 sm:p-8" id="how-it-works">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#E4E8E2]">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#28745E]">{t.tripPreviewBadge}</span>
                  <h4 className="text-2xl font-bold text-[#202923]">{t.tripPreviewTitle}</h4>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#6D7770] font-mono">{t.tripPreviewSimulated}</span>
                </div>
              </div>

              {/* Trip Comparison 3 Options */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-5 border-2 border-emerald-600/30 relative">
                  <div className="absolute -top-3 left-4 bg-[#28745E] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                    {t.cheapestOption}
                  </div>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-lg font-bold text-[#202923]">MTC Bus 23C / 570</span>
                    <span className="text-xl font-bold text-[#28745E] font-mono">₹18</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[#6D7770] mb-4">
                    <span>⏱ 54 {t.minsUnit}</span>
                    <span>🌱 0.4 kg CO₂</span>
                    <span>🚶 350m {t.walkUnit}</span>
                  </div>
                  <p className="text-xs text-[#6D7770] leading-relaxed">
                    {t.cheapestDesc}
                  </p>
                </div>

                <div className="bg-white rounded-xl p-5 border border-[#E4E8E2] relative">
                  <div className="absolute -top-3 left-4 bg-[#547F93] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                    {t.fastestOption}
                  </div>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-lg font-bold text-[#202923]">{t.fastestMode}</span>
                    <span className="text-xl font-bold text-[#202923] font-mono">₹58</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[#6D7770] mb-4">
                    <span>⏱ 38 {t.minsUnit}</span>
                    <span>🌱 0.8 kg CO₂</span>
                    <span>🚶 150m {t.walkUnit}</span>
                  </div>
                  <p className="text-xs text-[#6D7770] leading-relaxed">
                    {t.fastestDesc}
                  </p>
                </div>

                <div className="bg-white rounded-xl p-5 border border-[#E4E8E2] relative">
                  <div className="absolute -top-3 left-4 bg-[#D49A57] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                    {t.balancedOption}
                  </div>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-lg font-bold text-[#202923]">{t.balancedMode}</span>
                    <span className="text-xl font-bold text-[#202923] font-mono">₹36</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[#6D7770] mb-4">
                    <span>⏱ 43 {t.minsUnit}</span>
                    <span>🌱 0.5 kg CO₂</span>
                    <span>🚶 220m {t.walkUnit}</span>
                  </div>
                  <p className="text-xs text-[#6D7770] leading-relaxed">
                    {t.balancedDesc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. For Planners Section */}
        <section className="w-full py-20 bg-[#F6F7F4] border-b border-[#E4E8E2]" id="planners">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#174D3D] text-white text-xs font-bold uppercase tracking-wider mb-3">
                  {t.plannersBadge}
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#202923] tracking-tight mb-4">
                  {t.plannersTitle}
                </h2>
                <p className="text-base sm:text-lg text-[#6D7770]">
                  {t.plannersDesc}
                </p>
              </div>
              <div>
                <button
                  onClick={onLaunchApp}
                  className="inline-flex items-center text-sm font-bold text-[#28745E] hover:text-[#174D3D] transition-colors gap-1 group cursor-pointer"
                >
                  <span>{t.explorePlannerBtn}</span>
                  <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Planner Card 1 */}
              <div className="bg-white rounded-2xl p-7 border border-[#E4E8E2] shadow-xs hover:shadow-lg transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#E9EFE9] text-[#174D3D] font-mono uppercase">{t.planner1Tag}</span>
                    <span className="text-xs text-[#6D7770] font-mono">{t.planner1Count}</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#202923] mb-3">{t.planner1Title}</h3>
                  <p className="text-sm text-[#6D7770] leading-relaxed mb-6">
                    {t.planner1Desc}
                  </p>
                  <div className="bg-[#F6F7F4] rounded-xl p-4 border border-[#E4E8E2] space-y-2 mb-6">
                    <div className="flex justify-between text-xs font-bold text-[#202923]">
                      <span>{t.planner1Metric}</span>
                      <span className="font-mono text-[#28745E]">72.4%</span>
                    </div>
                    <div className="w-full bg-[#E4E8E2] rounded-full h-1.5 overflow-hidden">
                      <div className="bg-[#28745E] h-1.5 rounded-full" style={{ width: '72.4%' }}></div>
                    </div>
                    <div className="text-[11px] text-[#6D7770]">{t.planner1Note}</div>
                  </div>
                </div>
                <div className="pt-4 border-t border-[#E4E8E2] flex items-center text-xs font-semibold text-[#174D3D]">
                  <span className="material-symbols-outlined text-sm mr-1.5">layers</span>
                  {t.planner1Footer}
                </div>
              </div>

              {/* Planner Card 2 */}
              <div className="bg-white rounded-2xl p-7 border border-[#E4E8E2] shadow-xs hover:shadow-lg transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-sky-50 text-[#547F93] font-mono uppercase">{t.planner2Tag}</span>
                    <span className="text-xs text-[#6D7770] font-mono">{t.planner2Count}</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#202923] mb-3">{t.planner2Title}</h3>
                  <p className="text-sm text-[#6D7770] leading-relaxed mb-6">
                    {t.planner2Desc}
                  </p>
                  <div className="bg-[#F6F7F4] rounded-xl p-4 border border-[#E4E8E2] space-y-2 mb-6">
                    <div className="flex justify-between text-xs font-bold text-[#202923]">
                      <span>{t.planner2Metric}</span>
                      <span className="font-mono text-[#547F93]">84.1%</span>
                    </div>
                    <div className="w-full bg-[#E4E8E2] rounded-full h-1.5 overflow-hidden">
                      <div className="bg-[#547F93] h-1.5 rounded-full" style={{ width: '84.1%' }}></div>
                    </div>
                    <div className="text-[11px] text-[#6D7770]">{t.planner2Note}</div>
                  </div>
                </div>
                <div className="pt-4 border-t border-[#E4E8E2] flex items-center text-xs font-semibold text-[#174D3D]">
                  <span className="material-symbols-outlined text-sm mr-1.5">schedule</span>
                  {t.planner2Footer}
                </div>
              </div>

              {/* Planner Card 3 */}
              <div className="bg-white rounded-2xl p-7 border border-[#E4E8E2] shadow-xs hover:shadow-lg transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-50 text-[#D49A57] font-mono uppercase">{t.planner3Tag}</span>
                    <span className="text-xs text-[#6D7770] font-mono">{t.planner3Count}</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#202923] mb-3">{t.planner3Title}</h3>
                  <p className="text-sm text-[#6D7770] leading-relaxed mb-6">
                    {t.planner3Desc}
                  </p>
                  <div className="bg-[#F6F7F4] rounded-xl p-4 border border-[#E4E8E2] space-y-2 mb-6">
                    <div className="flex justify-between text-xs font-bold text-[#202923]">
                      <span>{t.planner3Metric}</span>
                      <span className="font-mono text-[#D49A57]">-18.5%</span>
                    </div>
                    <div className="w-full bg-[#E4E8E2] rounded-full h-1.5 overflow-hidden">
                      <div className="bg-[#D49A57] h-1.5 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    <div className="text-[11px] text-[#6D7770]">{t.planner3Note}</div>
                  </div>
                </div>
                <div className="pt-4 border-t border-[#E4E8E2] flex items-center text-xs font-semibold text-[#174D3D]">
                  <span className="material-symbols-outlined text-sm mr-1.5">model_training</span>
                  {t.planner3Footer}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Data Integrity & Methodology */}
        <section className="w-full py-20 bg-white border-b border-[#E4E8E2]" id="methodology">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
            <div className="max-w-3xl mb-12">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9EFE9] text-[#28745E] text-xs font-bold uppercase tracking-wider mb-3">
                {t.governanceBadge}
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#202923] tracking-tight mb-4">
                {t.governanceTitle}
              </h2>
              <p className="text-base text-[#6D7770]">
                {t.governanceDesc}
              </p>
            </div>

            {/* Provenance Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
              <div className="p-4 rounded-xl border border-[#E4E8E2] bg-[#F6F7F4]">
                <div className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#174D3D] text-white mb-2 uppercase">{t.provOfficialTag}</div>
                <h4 className="text-sm font-bold text-[#202923] mb-1">{t.provOfficialTitle}</h4>
                <p className="text-xs text-[#6D7770]">{t.provOfficialDesc}</p>
              </div>
              <div className="p-4 rounded-xl border border-[#E4E8E2] bg-[#F6F7F4]">
                <div className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#547F93] text-white mb-2 uppercase">{t.provScheduledTag}</div>
                <h4 className="text-sm font-bold text-[#202923] mb-1">{t.provScheduledTitle}</h4>
                <p className="text-xs text-[#6D7770]">{t.provScheduledDesc}</p>
              </div>
              <div className="p-4 rounded-xl border border-[#E4E8E2] bg-[#F6F7F4]">
                <div className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#28745E] text-white mb-2 uppercase">{t.provCalculatedTag}</div>
                <h4 className="text-sm font-bold text-[#202923] mb-1">{t.provCalculatedTitle}</h4>
                <p className="text-xs text-[#6D7770]">{t.provCalculatedDesc}</p>
              </div>
              <div className="p-4 rounded-xl border border-[#E4E8E2] bg-[#F6F7F4]">
                <div className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#D49A57] text-white mb-2 uppercase">{t.provModelledTag}</div>
                <h4 className="text-sm font-bold text-[#202923] mb-1">{t.provModelledTitle}</h4>
                <p className="text-xs text-[#6D7770]">{t.provModelledDesc}</p>
              </div>
              <div className="p-4 rounded-xl border border-[#E4E8E2] bg-[#F6F7F4]">
                <div className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-700 text-white mb-2 uppercase">{t.provUserTag}</div>
                <h4 className="text-sm font-bold text-[#202923] mb-1">{t.provUserTitle}</h4>
                <p className="text-xs text-[#6D7770]">{t.provUserDesc}</p>
              </div>
            </div>

            {/* Citations & Privacy */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-[#E9EFE9]/50 border border-[#d2ddd3]">
                <h4 className="text-base font-bold text-[#174D3D] mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">database</span>
                  {t.citationsHeading}
                </h4>
                <ul className="text-xs text-[#6D7770] space-y-2 leading-relaxed">
                  <li>• <strong>CUMTA & GCC:</strong> {t.citeCumtaGcc}</li>
                  <li>• <strong>MTC Chennai:</strong> {t.citeMtc}</li>
                  <li>• <strong>CMRL & Southern Railway:</strong> {t.citeCmrlSr}</li>
                  <li>• <strong>OpenStreetMap:</strong> {t.citeOsm}</li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-[#E9EFE9]/50 border border-[#d2ddd3]">
                <h4 className="text-base font-bold text-[#174D3D] mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">shield</span>
                  {t.privacyHeading}
                </h4>
                <p className="text-xs text-[#6D7770] leading-relaxed mb-3">
                  {t.privacyDesc}
                </p>
                <div className="flex items-center gap-2 text-xs font-bold text-[#28745E]">
                  <span className="material-symbols-outlined text-sm">lock_clock</span>
                  <span>{t.privacyLock}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 6. Comprehensive Footer */}
      <footer className="w-full bg-[#F6F7F4] border-t border-[#E4E8E2] pt-14 pb-8">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 pb-12 border-b border-[#E4E8E2]">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#174D3D] flex items-center justify-center text-white">
                  <svg className="w-4 h-4 text-emerald-300" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <span className="text-lg font-extrabold tracking-tight text-[#174D3D] uppercase">Movefair</span>
              </div>
              <p className="text-xs text-[#6D7770] leading-relaxed max-w-sm mb-4">
                {t.footerBio}
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#E9EFE9] border border-[#d2ddd3] text-[11px] font-bold text-[#174D3D]">
                <span>{t.footerPs7Badge}</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#202923] mb-4">{t.colProduct}</h4>
              <ul className="text-xs space-y-2.5 text-[#6D7770]">
                <li><button onClick={onLaunchApp} className="hover:text-[#174D3D] text-left cursor-pointer">{t.linkHomeOverview}</button></li>
                <li><button onClick={onLaunchApp} className="hover:text-[#174D3D] text-left cursor-pointer">{t.linkExploreChennai}</button></li>
                <li><button onClick={onLaunchApp} className="hover:text-[#174D3D] text-left cursor-pointer">{t.linkJourneyPlanner}</button></li>
                <li><button onClick={onLaunchApp} className="hover:text-[#174D3D] text-left cursor-pointer">{t.linkTravelSpending}</button></li>
                <li><button onClick={onLaunchApp} className="hover:text-[#174D3D] text-left cursor-pointer">{t.linkGreenCommuteMeter}</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#202923] mb-4">{t.colForPlanners}</h4>
              <ul className="text-xs space-y-2.5 text-[#6D7770]">
                <li><button onClick={onLaunchApp} className="hover:text-[#174D3D] text-left cursor-pointer">{t.linkWardOverview}</button></li>
                <li><button onClick={onLaunchApp} className="hover:text-[#174D3D] text-left cursor-pointer">{t.linkServiceAnalysis}</button></li>
                <li><button onClick={onLaunchApp} className="hover:text-[#174D3D] text-left cursor-pointer">{t.linkScenarioModeler}</button></li>
                <li><button onClick={onLaunchApp} className="hover:text-[#174D3D] text-left cursor-pointer">{t.linkCatchmentBuffers}</button></li>
                <li><button onClick={onLaunchApp} className="hover:text-[#174D3D] text-left cursor-pointer">{t.linkHeadwayHeatmaps}</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#202923] mb-4">{t.colResources}</h4>
              <ul className="text-xs space-y-2.5 text-[#6D7770]">
                <li><a href="#methodology" className="hover:text-[#174D3D]">{t.linkDataManifest}</a></li>
                <li><a href="#methodology" className="hover:text-[#174D3D]">{t.linkGtfsFeeds}</a></li>
                <li><a href="#methodology" className="hover:text-[#174D3D]">{t.linkMethodology}</a></li>
                <li><button onClick={onLaunchApp} className="hover:text-[#174D3D] text-left cursor-pointer">{t.linkOpenApi}</button></li>
                <li><button onClick={onLaunchApp} className="hover:text-[#174D3D] text-left cursor-pointer">{t.linkGisExports}</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#202923] mb-4">{t.colGovernance}</h4>
              <ul className="text-xs space-y-2.5 text-[#6D7770]">
                <li><a href="#methodology" className="hover:text-[#174D3D]">{t.linkPrivacyPolicy}</a></li>
                <li><a href="#methodology" className="hover:text-[#174D3D]">{t.linkTermsOfService}</a></li>
                <li><a href="#methodology" className="hover:text-[#174D3D]">{t.linkOpenDataLicense}</a></li>
                <li><a href="#methodology" className="hover:text-[#174D3D]">{t.linkHelpDesk}</a></li>
                <li><a href="#methodology" className="hover:text-[#174D3D]">{t.linkCumtaCoord}</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6D7770]">
            <p>{t.footerCopyright}</p>
            <div className="flex items-center space-x-6">
              <span>{t.footerMadeFor}</span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 text-[#28745E] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                {t.footerAllOperational}
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
