
import React, { useState, useEffect, useCallback } from 'react';
import { getPrayerTimes, getLocationName } from './services/prayerService';
import { UserLocation, PrayerTimes, AppView, Language, PrayerMethod } from './types';
import Dashboard from './components/Dashboard';
import ChatInterface from './components/ChatInterface';
import Navbar from './components/Navbar';
import QuranView from './components/QuranView';
import DuaView from './components/DuaView';
import ProgressView from './components/ProgressView';
import CalendarView from './components/CalendarView';
import LocationSelector from './components/LocationSelector';
import SettingsView from './components/SettingsView';
import PrivacyPolicy from './components/PrivacyPolicy';

const PRAYER_METHODS: PrayerMethod[] = [
  { id: 1, name: "Karachi" },
  { id: 2, name: "ISNA" },
  { id: 3, name: "MWL" },
  { id: 4, name: "Makker" },
  { id: 5, name: "Egypt" },
  { id: 8, name: "Gulf" },
  { id: 9, name: "Kuwait" },
  { id: 10, name: "Qatar" },
  { id: 11, name: "Singapore" },
  { id: 12, name: "France" },
  { id: 13, name: "Turkey" },
  { id: 14, name: "Russia" },
];

const TRANSLATIONS = {
  en: {
    greeting: 'Assalamu Alaikum',
    subGreeting: 'Nourishing your deen, naturally.',
    home: 'Home',
    quran: 'Quran',
    dua: 'Duas',
    chat: 'Nur AI',
    progress: 'Deen',
    settings: 'Settings',
    location: 'Location',
    verseOfDay: 'Verse of the Day',
    upcomingPrayer: 'Upcoming Prayer',
    method: 'Method',
    preDawn: 'Pre-dawn Prayer',
    detecting: 'Detecting...',
    mecca: 'Mecca, SA'
  },
  bn: {
    greeting: 'আসসালামু আলাইকুম',
    subGreeting: 'আপনার দ্বীনকে সমৃদ্ধ করুন স্বাভাবিকভাবে।',
    home: 'হোম',
    quran: 'কুরআন',
    dua: 'দুয়া',
    chat: 'নূর এআই',
    progress: 'দ্বীন',
    settings: 'সেটিংস',
    location: 'অবস্থান',
    verseOfDay: 'আজকের আয়াত',
    upcomingPrayer: 'পরবর্তী নামাজ',
    method: 'পদ্ধতি',
    preDawn: 'ভোরবেলা নামাজ',
    detecting: 'সনাক্ত করা হচ্ছে...',
    mecca: 'মক্কা, সৌদি আরব'
  }
};

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('nur_theme') as 'light' | 'dark') || 'dark';
  });
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('nur_lang') as Language) || 'en';
  });
  const [prayerMethod, setPrayerMethod] = useState<number>(() => {
    return Number(localStorage.getItem('nur_prayer_method')) || 2;
  });
  const [location, setLocation] = useState<UserLocation | null>(() => {
    const saved = localStorage.getItem('nur_location');
    return saved ? JSON.parse(saved) : null;
  });
  const [locationName, setLocationName] = useState<string>(() => {
    return localStorage.getItem('nur_location_name') || 'Detecting...';
  });
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Initial view logic: Check URL for ?view=privacy
  const [activeView, setActiveView] = useState<AppView>(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'privacy') return 'privacy';
    return 'home';
  });

  const [showLocationModal, setShowLocationModal] = useState(false);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('nur_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('nur_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('nur_prayer_method', prayerMethod.toString());
    if (location) {
      fetchTimes(location, locationName, prayerMethod);
    }
  }, [prayerMethod]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const t = TRANSLATIONS[language];

  const fetchTimes = useCallback(async (loc: UserLocation, name: string, method: number = prayerMethod) => {
    setLoading(true);
    setError(null);
    try {
      const times = await getPrayerTimes(loc, method);
      setPrayerTimes(times);
      setLocation(loc);
      setLocationName(name);
      localStorage.setItem('nur_location', JSON.stringify(loc));
      localStorage.setItem('nur_location_name', name);
    } catch (err) {
      setError('Could not fetch prayer times.');
    } finally {
      setLoading(false);
    }
  }, [prayerMethod]);

  const initLocation = useCallback(() => {
    if (location) {
      fetchTimes(location, locationName);
      return;
    }

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
          const name = await getLocationName(loc.lat, loc.lng);
          fetchTimes(loc, name);
        },
        async () => {
          const loc = { lat: 21.4225, lng: 39.8262 };
          fetchTimes(loc, t.mecca);
        }
      );
    } else {
      const loc = { lat: 21.4225, lng: 39.8262 };
      fetchTimes(loc, t.mecca);
    }
  }, [location, locationName, fetchTimes, t.mecca]);

  useEffect(() => {
    initLocation();
  }, [initLocation]);

  const handleLocationSelect = (loc: UserLocation, name: string) => {
    fetchTimes(loc, name);
    setShowLocationModal(false);
  };

  const useCurrentLocation = () => {
    if ("geolocation" in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
          const name = await getLocationName(loc.lat, loc.lng);
          fetchTimes(loc, name);
          setShowLocationModal(false);
        },
        () => {
          setError("Location access denied.");
          setLoading(false);
        }
      );
    }
  };

  const renderView = () => {
    switch (activeView) {
      case 'home':
        if (!prayerTimes) return null;
        return (
          <div className="space-y-6">
            <header className="px-2">
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--brand-olive)] to-amber-500">
                {t.greeting}
              </h1>
              <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">{t.subGreeting}</p>
            </header>
            <Dashboard 
              prayerTimes={prayerTimes!} 
              onViewCalendar={() => setActiveView('calendar')} 
              language={language}
              prayerMethodId={prayerMethod}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <DailyAyah language={language} />
               <NextPrayerWidget 
                prayerTimes={prayerTimes!} 
                language={language} 
                methodId={prayerMethod} 
               />
            </div>
          </div>
        );
      case 'quran':
        return <QuranView language={language} />;
      case 'dua':
        return <DuaView language={language} />;
      case 'chat':
        return <ChatInterface language={language} />;
      case 'progress':
        return <ProgressView language={language} />;
      case 'calendar':
        return <CalendarView location={location} onBack={() => setActiveView('home')} language={language} prayerMethodId={prayerMethod} />;
      case 'settings':
        return <SettingsView 
                  language={language} 
                  setLanguage={setLanguage} 
                  prayerMethod={prayerMethod} 
                  setPrayerMethod={setPrayerMethod}
                  onViewPrivacy={() => setActiveView('privacy')}
                />;
      case 'privacy':
        return <PrivacyPolicy language={language} onBack={() => setActiveView('settings')} />;
      default:
        return prayerTimes ? <Dashboard prayerTimes={prayerTimes!} onViewCalendar={() => setActiveView('calendar')} language={language} prayerMethodId={prayerMethod} /> : null;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen transition-colors duration-500">
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between glass border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#708238] rounded-lg flex items-center justify-center">
            <i className="fas fa-leaf text-white text-sm"></i>
          </div>
          <span className="font-bold text-lg tracking-tight">Nur AI</span>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800/10 dark:bg-white/5 border border-white/5 text-[var(--brand-olive)]"
          >
            <i className={`fas fa-${theme === 'dark' ? 'sun' : 'moon'}`}></i>
          </button>
          <button 
            onClick={() => setShowLocationModal(true)}
            className="text-xs text-slate-400 font-medium truncate max-w-[120px] flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-full border border-white/5"
          >
            <i className="fas fa-location-arrow text-[var(--brand-olive)]"></i>
            {locationName}
          </button>
        </div>
      </div>

      <Navbar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        locationName={locationName} 
        onChangeLocation={() => setShowLocationModal(true)}
        theme={theme}
        toggleTheme={toggleTheme}
        language={language}
      />

      <main className="flex-1 overflow-y-auto pt-24 pb-32 lg:pt-8 lg:pb-8 px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Always show Privacy view, bypass spinner */}
          {activeView === 'privacy' ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {renderView()}
            </div>
          ) : loading ? (
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-2 border-[#708238] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[#a4b465] text-sm font-medium animate-pulse">Bismillah...</p>
            </div>
          ) : error ? (
            <div className="text-center p-12 glass rounded-3xl border-red-500/30">
              <i className="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
              <p className="text-red-400">{error}</p>
              <button 
                onClick={() => setShowLocationModal(true)}
                className="mt-4 px-6 py-2 bg-[#708238] rounded-xl text-white text-sm font-bold"
              >
                Set Location Manually
              </button>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {renderView()}
            </div>
          )}
        </div>
      </main>

      {showLocationModal && (
        <LocationSelector 
          onSelect={handleLocationSelect} 
          onClose={() => setShowLocationModal(false)} 
          onUseCurrentLocation={useCurrentLocation}
          language={language}
        />
      )}
    </div>
  );
};

const DailyAyah: React.FC<{ language: Language }> = ({ language }) => {
  const t = TRANSLATIONS[language];
  return (
    <div className="glass p-5 rounded-3xl border-[var(--brand-olive)]/10 bg-gradient-to-br from-[var(--brand-olive)]/5 to-transparent shadow-sm">
      <div className="flex items-center gap-3 mb-2 text-[var(--brand-olive)]">
        <i className="fas fa-seedling"></i>
        <span className="text-xs font-bold uppercase tracking-wider">{t.verseOfDay}</span>
      </div>
      <p className="text-sm italic mb-2 opacity-80">
        {language === 'en' 
          ? '"So remember Me; I will remember you. And be grateful to Me and do not deny Me."' 
          : '"অতএব তোমরা আমাকে স্মরণ কর, আমি তোমাদেরকে স্মরণ করব। আর আমার প্রতি কৃতজ্ঞ হও এবং আমার প্রতি অজ্ঞ কৃতজ্ঞ হয়ো না।"'}
      </p>
      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
        — {language === 'en' ? 'Al-Baqarah 2:152' : 'আল-বাকারা ২:১৫২'}
      </p>
    </div>
  );
};

const NextPrayerWidget: React.FC<{ prayerTimes: PrayerTimes; language: Language; methodId: number }> = ({ prayerTimes, language, methodId }) => {
  const t = TRANSLATIONS[language];
  const methodName = PRAYER_METHODS.find(m => m.id === methodId)?.name || "Standard";

  const getNextPrayer = () => {
    const now = new Date();
    const getPrayerDate = (timeStr: string) => {
      const d = new Date();
      const [h, m] = timeStr.split(':').map(Number);
      d.setHours(h, m, 0, 0);
      return d;
    };

    const prayers = [
      { name: language === 'en' ? 'Fajr' : 'ফজর', time: getPrayerDate(prayerTimes.Fajr) },
      { name: language === 'en' ? 'Dhuhr' : 'যোহর', time: getPrayerDate(prayerTimes.Dhuhr) },
      { name: language === 'en' ? 'Asr' : 'আসর', time: getPrayerDate(prayerTimes.Asr) },
      { name: language === 'en' ? 'Maghrib' : 'মাগরিব', time: getPrayerDate(prayerTimes.Maghrib) },
      { name: language === 'en' ? 'Isha' : 'এশা', time: getPrayerDate(prayerTimes.Isha) },
    ];

    const next = prayers.find(p => p.time > now) || prayers[0];
    return next;
  };

  const nextPrayer = getNextPrayer();

  return (
    <div className="glass p-5 rounded-3xl border-white/5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
         <span className="text-xs font-bold text-slate-500 uppercase">{t.upcomingPrayer}</span>
         <span className="text-[10px] text-[var(--brand-olive)]/60 uppercase font-black tracking-widest bg-[var(--brand-olive)]/5 px-2 py-0.5 rounded-md">
           {methodName}
         </span>
      </div>
      <div className="flex justify-between items-center">
        <div>
          <div className="text-2xl font-bold">{nextPrayer.name}</div>
          <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest opacity-60">
            {nextPrayer.name === (language === 'en' ? 'Fajr' : 'ফজর') ? t.preDawn : ''}
          </div>
        </div>
        <div className="text-3xl font-black text-[var(--brand-olive)]">
          {nextPrayer.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
        </div>
      </div>
    </div>
  );
};

export default App;
