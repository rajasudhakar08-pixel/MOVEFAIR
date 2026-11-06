import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface LoginPageProps {
  onBackToHome: () => void;
  onLoginSuccess: (user: { name: string; email: string; role: 'commuter' | 'planner'; ward: string }) => void;
  language: 'EN' | 'TA';
  setLanguage: (lang: 'EN' | 'TA') => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onBackToHome,
  onLoginSuccess,
  language,
  setLanguage,
}) => {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('commuter@movefair.in');
  const [password, setPassword] = useState('pass1234');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('Ananya Raman');
  const [commuterType, setCommuterType] = useState<'daily' | 'student' | 'senior'>('daily');
  const [rememberMe, setRememberMe] = useState(true);

  // Translations dictionary for Login page
  const t = {
    backBtn: language === 'EN' ? 'Back to Overview' : 'முகப்பிற்குத் திரும்பு',
    liveNode: language === 'EN' ? 'CMRL • MTC • Suburban Live Node' : 'CMRL • MTC • புறநகர் நேரலை முனை',
    gridSubtitle: language === 'EN' ? 'Chennai Multi-Modal Transit Grid' : 'சென்னை பலவகை போக்குவரத்து கட்டமைப்பு',
    welcomeBack: language === 'EN' ? 'Welcome Back' : 'மீண்டும் வருக',
    joinMovefair: language === 'EN' ? 'Join Movefair Chennai' : 'மூவ்பேரில் இணையுங்கள்',
    descText: language === 'EN'
      ? 'Sign in to plan journeys, save routes, track real-time bus & metro schedules, and access personalized commuter insights across Chennai.'
      : 'சென்னையில் பேருந்து, மெட்ரோ மற்றும் புறநகர் இரயில் நேரங்களை அறிந்து, பயணங்களை எளிதாக திட்டமிட உள்நுழையவும்.',
    artworkCaption: language === 'EN'
      ? 'Chennai Unified Urban Mobility Platform • Real-Time Hub'
      : 'சென்னையின் ஒருங்கிணைந்த நகர்ப்புற பயணத் தளம் • நேரலை மையம்',
    partnerTitle: language === 'EN' ? 'Official Transit Partner Context' : 'அதிகாரப்பூர்வ போக்குவரத்து கூட்டாளர் சூழல்',
    partnerDesc: language === 'EN'
      ? 'Aligned with Chennai Unified Metropolitan Transport Authority (CUMTA) & Startup Peravai Mobility Challenge.'
      : 'சென்னை பெருநகர போக்குவரத்து ஆணையம் (CUMTA) & ஸ்டார்ட்அப் பேரவை மொபிலிட்டி சேலஞ்ச் உடன் ஒருங்கிணைக்கப்பட்டது.',
    tabLogin: language === 'EN' ? 'Log In' : 'உள்நுழைக',
    tabSignup: language === 'EN' ? 'Sign Up' : 'பதிவு செய்க',
    fullNameLabel: language === 'EN' ? 'Full Name' : 'முழு பெயர்',
    fullNamePlaceholder: language === 'EN' ? 'e.g. Ananya Raman' : 'எ.கா. அனன்யா ராமன்',
    emailLabel: language === 'EN' ? 'Official Email or Mobile Number' : 'மின்னஞ்சல் அல்லது கைபேசி எண்',
    emailPlaceholder: language === 'EN' ? 'commuter@movefair.in' : 'commuter@movefair.in',
    categoryLabel: language === 'EN' ? 'Commuter Category' : 'பயணி வகை',
    catDaily: language === 'EN' ? 'Daily' : 'தினசரி',
    catStudent: language === 'EN' ? 'Student' : 'மாணவர்',
    catSenior: language === 'EN' ? 'Senior' : 'முதியவர்',
    passwordLabel: language === 'EN' ? 'Password' : 'கடவுச்சொல்',
    forgotPassword: language === 'EN' ? 'Forgot password?' : 'மறந்துவிட்டதா?',
    passwordPlaceholder: language === 'EN' ? 'Enter password' : 'கடவுச்சொல்லை உள்ளிடவும்',
    rememberMe: language === 'EN' ? 'Remember this device' : 'நினைவில் கொள்க',
    tlsSecurity: language === 'EN' ? '256-bit TLS' : '256-பிட் TLS பாதுகாப்பு',
    loginSubmit: language === 'EN' ? 'Log In' : 'உள்நுழைக',
    signupSubmit: language === 'EN' ? 'Create Account' : 'கணக்கு தொடங்கு',
    orContinue: language === 'EN' ? 'or continue with' : 'அல்லது இதன் மூலம் தொடர்க',
    googleBtn: language === 'EN' ? 'Google' : 'கூகுள்',
    otpBtn: language === 'EN' ? 'Mobile OTP' : 'மொபைல் OTP',
    guestBypass: language === 'EN' ? 'Explore as Commuter without signing in' : 'உள்நுழையாமல் நேரடியாக பயன்பாட்டை அணுகுக',
    singaraCard: language === 'EN' ? 'Singara Chennai Card Ready' : 'சிங்கார சென்னை அட்டை தயார் நிலை',
    footerAuthority: language === 'EN' ? 'Integrated Multi-Modal Transit Authority' : 'ஒருங்கிணைந்த பலவகை போக்குவரத்து ஆணையம்',
    privacyPolicy: language === 'EN' ? 'Privacy Policy' : 'தனியுரிமைக் கொள்கை',
    termsOfService: language === 'EN' ? 'Terms of Service' : 'சேவை விதிமுறைகள்',
    openTransitData: language === 'EN' ? 'Open Transit Data' : 'திறந்தநிலை போக்குவரத்து தரவு',
    helpDesk: language === 'EN' ? 'Help Desk' : 'உதவி மையம்',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess({
      name: tab === 'login' ? 'Ananya Raman' : fullName || 'Chennai Commuter',
      email: email || 'commuter@movefair.in',
      role: 'commuter',
      ward: 'Ward 114 (Nungambakkam)',
    });
  };

  const handleGuestExplore = () => {
    onLoginSuccess({
      name: 'Guest Commuter',
      email: 'guest@movefair.in',
      role: 'commuter',
      ward: 'Ward 114 (GCC)',
    });
  };

  return (
    <div className="min-h-screen bg-[#F6F7F4] flex flex-col justify-between text-[#202923] font-sans antialiased">
      {/* Header */}
      <header className="w-full z-50 bg-[#F6F7F4]/90 backdrop-blur-xl border-b border-[#E4E8E2] shadow-[0_1px_8px_rgba(0,0,0,0.04)] flex-shrink-0">
        <div className="h-16 w-full px-6 lg:px-12 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onBackToHome}>
            <span className="w-2.5 h-2.5 rounded-full bg-[#005B47]"></span>
            <span className="font-extrabold text-lg tracking-tight text-[#005B47] uppercase">MOVEFAIR</span>
            <span className="hidden sm:inline-block text-[11px] font-bold uppercase tracking-wider text-[#3F4944] bg-[#E6F1E7] px-1.5 py-0.5 rounded">
              Chennai
            </span>
          </div>

          <nav className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="inline-flex items-center bg-[#E9EFE9] rounded-lg p-0.5 border border-[#d2ddd3] text-xs font-semibold text-[#6D7770]">
              <button
                type="button"
                onClick={() => setLanguage('EN')}
                className={`px-2.5 py-1 rounded transition-all cursor-pointer ${language === 'EN' ? 'bg-white text-[#174D3D] shadow-xs font-bold' : 'hover:text-[#174D3D]'}`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('TA')}
                className={`px-2.5 py-1 rounded transition-all cursor-pointer ${language === 'TA' ? 'bg-white text-[#174D3D] shadow-xs font-bold' : 'hover:text-[#174D3D]'}`}
              >
                தமிழ்
              </button>
            </div>

            <button
              onClick={onBackToHome}
              className="text-sm font-semibold text-[#3F4944] hover:text-[#151E18] transition-colors flex items-center gap-1.5 py-1 px-3 rounded hover:bg-[#E6F1E7] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>{t.backBtn}</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-[#005B47] flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Form Split */}
      <main className="w-full flex-1 flex flex-col justify-center px-6 lg:px-12 py-6">
        <div className="flex flex-col w-full max-w-[1440px] mx-auto h-full justify-between">
          {/* Top Bar utility */}
          <div className="w-full flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2 bg-[#E6F1E7] px-3 py-1 rounded-full text-[#3F4944] text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#005B47] animate-pulse"></span>
              <span>{t.liveNode}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLanguage(language === 'EN' ? 'TA' : 'EN')}
                className="flex items-center gap-1 text-xs uppercase bg-[#E1EBE1] hover:bg-[#DBE5DC] text-[#151E18] px-2.5 py-1 rounded transition-colors font-bold cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px] text-[#005B47]">translate</span>
                <span>{language === 'EN' ? 'தமிழ்' : 'English'}</span>
              </button>
            </div>
          </div>

          {/* Grid split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch flex-1">
            {/* Left column: Editorial & artwork */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs tracking-wider uppercase text-[#005B47] font-bold">
                  <span className="material-symbols-outlined text-[18px]">commute</span>
                  <span>{t.gridSubtitle}</span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#151E18] tracking-tight">
                  {tab === 'login' ? t.welcomeBack : t.joinMovefair}
                </h1>
                <p className="text-sm sm:text-base text-[#3F4944] max-w-lg leading-relaxed">
                  {t.descText}
                </p>
              </div>

              {/* Architectural Illustration Canvas (Chennai Central Clock Tower & Transit) */}
              <div className="relative w-full flex flex-col items-center justify-center">
                <div className="w-full rounded-2xl overflow-hidden border border-[#BEC9C3]/50 bg-white shadow-sm flex items-center justify-center max-h-[380px]">
                  <img
                    alt="Chennai Central clock tower, elevated metro rail viaduct, and MTC bus"
                    className="w-full h-full object-cover transition-all duration-300"
                    src="/assets/aistudio/screen_7c99ed56.png"
                  />
                </div>
                <div className="mt-2 text-center flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#005B47]"></span>
                  <p className="text-xs text-[#3F4944] font-medium">
                    {t.artworkCaption}
                  </p>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#005B47]"></span>
                </div>
              </div>

              {/* Trust note */}
              <div className="bg-[#E6F1E7] p-4 rounded-xl flex items-center gap-4 border border-[#BEC9C3]/40">
                <span className="material-symbols-outlined text-[#005B47] text-[22px]">verified_user</span>
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-[#151E18]">{t.partnerTitle}</p>
                  <p className="text-xs text-[#3F4944]">{t.partnerDesc}</p>
                </div>
              </div>
            </div>

            {/* Right column: Form card */}
            <div className="lg:col-span-5 flex flex-col justify-center items-center lg:items-end">
              <div className="w-full max-w-lg bg-white rounded-2xl p-6 lg:p-7 shadow-md border border-[#E4E8E2] flex flex-col justify-between">
                {/* Tabs with smooth slide transitions */}
                <div className="grid grid-cols-2 p-1 bg-[#ECF6ED] rounded-lg mb-4">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setTab('login')}
                    className={`py-2 text-center rounded-md text-sm font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      tab === 'login'
                        ? 'bg-white text-[#005B47] shadow-sm font-bold'
                        : 'text-[#3F4944] hover:text-[#151E18]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">login</span>
                    <span>{t.tabLogin}</span>
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setTab('signup')}
                    className={`py-2 text-center rounded-md text-sm font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      tab === 'signup'
                        ? 'bg-white text-[#005B47] shadow-sm font-bold'
                        : 'text-[#3F4944] hover:text-[#151E18]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">person_add</span>
                    <span>{t.tabSignup}</span>
                  </motion.button>
                </div>

                {/* Form with AnimatePresence */}
                <AnimatePresence mode="wait">
                  <motion.form
                    key={tab}
                    initial={{ opacity: 0, x: tab === 'login' ? -10 : 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: tab === 'login' ? 10 : -10 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    onSubmit={handleSubmit}
                    className="space-y-3.5"
                  >
                    {tab === 'signup' && (
                      <div className="space-y-1">
                        <label className="block text-xs font-semibold text-[#151E18]">
                          {t.fullNameLabel}
                        </label>
                        <div className="relative flex items-center">
                          <span className="material-symbols-outlined absolute left-3 text-[#6F7974] text-[18px]">badge</span>
                          <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder={t.fullNamePlaceholder}
                            required
                            className="w-full h-10 pl-10 pr-3 bg-[#ECF6ED] text-[#151E18] text-sm rounded-lg focus:bg-white focus:ring-2 focus:ring-[#005B47] outline-none transition-all border-none"
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-[#151E18]">
                        {t.emailLabel}
                      </label>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-3 text-[#6F7974] text-[18px]">mail</span>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={t.emailPlaceholder}
                          required
                          className="w-full h-10 pl-10 pr-3 bg-[#ECF6ED] text-[#151E18] text-sm rounded-lg focus:bg-white focus:ring-2 focus:ring-[#005B47] outline-none transition-all border-none"
                        />
                      </div>
                    </div>

                    {tab === 'signup' && (
                      <div className="space-y-1">
                        <label className="block text-xs font-semibold text-[#151E18]">
                          {t.categoryLabel}
                        </label>
                        <div className="grid grid-cols-3 gap-1.5">
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => setCommuterType('daily')}
                            className={`flex flex-col items-center justify-center py-2 px-2 rounded-lg border-2 text-center transition-all cursor-pointer ${
                              commuterType === 'daily'
                                ? 'border-[#005B47] bg-[#E1EBE1] text-[#005B47] font-bold shadow-xs'
                                : 'border-transparent bg-[#ECF6ED] text-[#3F4944]'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[18px] mb-0.5">directions_transit</span>
                            <span className="text-xs">{t.catDaily}</span>
                          </motion.button>
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => setCommuterType('student')}
                            className={`flex flex-col items-center justify-center py-2 px-2 rounded-lg border-2 text-center transition-all cursor-pointer ${
                              commuterType === 'student'
                                ? 'border-[#005B47] bg-[#E1EBE1] text-[#005B47] font-bold shadow-xs'
                                : 'border-transparent bg-[#ECF6ED] text-[#3F4944]'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[18px] mb-0.5">school</span>
                            <span className="text-xs">{t.catStudent}</span>
                          </motion.button>
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => setCommuterType('senior')}
                            className={`flex flex-col items-center justify-center py-2 px-2 rounded-lg border-2 text-center transition-all cursor-pointer ${
                              commuterType === 'senior'
                                ? 'border-[#005B47] bg-[#E1EBE1] text-[#005B47] font-bold shadow-xs'
                                : 'border-transparent bg-[#ECF6ED] text-[#3F4944]'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[18px] mb-0.5">elderly</span>
                            <span className="text-xs">{t.catSenior}</span>
                          </motion.button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-semibold text-[#151E18]">
                          {t.passwordLabel}
                        </label>
                        {tab === 'login' && (
                          <button type="button" className="text-xs text-[#005B47] hover:underline cursor-pointer">
                            {t.forgotPassword}
                          </button>
                        )}
                      </div>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-3 text-[#6F7974] text-[18px]">lock</span>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder={t.passwordPlaceholder}
                          required
                          className="w-full h-10 pl-10 pr-10 bg-[#ECF6ED] text-[#151E18] text-sm rounded-lg focus:bg-white focus:ring-2 focus:ring-[#005B47] outline-none transition-all border-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 text-[#6F7974] hover:text-[#151E18] p-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {showPassword ? 'visibility_off' : 'visibility'}
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 rounded text-[#005B47] focus:ring-[#005B47] bg-[#ECF6ED]"
                        />
                        <span className="text-xs text-[#3F4944]">
                          {t.rememberMe}
                        </span>
                      </label>
                      <div className="flex items-center gap-1 text-[#3F4944] text-[11px]">
                        <span className="material-symbols-outlined text-[14px] text-[#28745E]">lock</span>
                        <span>{t.tlsSecurity}</span>
                      </div>
                    </div>

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02, y: -1, backgroundColor: '#28745E' }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full h-11 bg-[#005B47] text-white font-bold rounded-lg shadow-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer mt-2"
                    >
                      <span>{tab === 'login' ? t.loginSubmit : t.signupSubmit}</span>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </motion.button>
                  </motion.form>
                </AnimatePresence>

                {/* Divider */}
                <div className="relative my-3.5 flex items-center justify-center">
                  <div className="w-full bg-[#E1EBE1] h-[1px]"></div>
                  <span className="absolute bg-white px-2 text-[11px] uppercase tracking-wider text-[#6F7974]">
                    {t.orContinue}
                  </span>
                </div>

                {/* Social buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    type="button"
                    className="w-full h-9 bg-[#ECF6ED] hover:bg-[#E1EBE1] text-[#151E18] text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.14z" fill="#4285F4"></path>
                      <path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z" fill="#34A853"></path>
                      <path d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z" fill="#FBBC05"></path>
                      <path d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" fill="#EA4335"></path>
                    </svg>
                    <span>{t.googleBtn}</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    type="button"
                    className="w-full h-9 bg-[#ECF6ED] hover:bg-[#E1EBE1] text-[#151E18] text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px] text-[#386477]">phone_iphone</span>
                    <span>{t.otpBtn}</span>
                  </motion.button>
                </div>

                {/* Guest bypass */}
                <div className="mt-3 text-center">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleGuestExplore}
                    type="button"
                    className="inline-flex items-center gap-1 text-xs text-[#3F4944] hover:text-[#005B47] transition-colors underline underline-offset-4 cursor-pointer font-medium"
                  >
                    <span>{t.guestBypass}</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_right_alt</span>
                  </motion.button>
                </div>

                {/* Singara Chennai card badge */}
                <div className="mt-3 bg-[#E6F1E7] rounded-lg px-3 py-1.5 flex items-center justify-between text-[#3F4944] text-[11px]">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <span className="material-symbols-outlined text-[16px] text-[#005B47]">credit_card</span>
                    <span>{t.singaraCard}</span>
                  </span>
                  <span className="font-mono text-[#6F7974]">v2.4.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#ECF6ED] border-t border-[#E4E8E2] flex-shrink-0">
        <div className="w-full px-6 lg:px-12 py-3 flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left text-xs text-[#3F4944]">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <span>© 2025–2026 MOVEFAIR Chennai Urban Mobility Platform.</span>
            <span className="hidden sm:inline">•</span>
            <span>{t.footerAuthority}</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onBackToHome} className="hover:text-[#151E18] cursor-pointer">{t.privacyPolicy}</button>
            <button onClick={onBackToHome} className="hover:text-[#151E18] cursor-pointer">{t.termsOfService}</button>
            <button onClick={onBackToHome} className="hover:text-[#151E18] cursor-pointer">{t.openTransitData}</button>
            <button onClick={onBackToHome} className="hover:text-[#151E18] cursor-pointer">{t.helpDesk}</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
