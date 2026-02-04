
import React from 'react';
import { AppView, Language } from '../types';

interface NavbarProps {
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  locationName: string;
  onChangeLocation: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  language: Language;
}

const Navbar: React.FC<NavbarProps> = ({ activeView, setActiveView, locationName, onChangeLocation, theme, toggleTheme, language }) => {
  const labels = {
    en: { home: 'Home', quran: 'Quran', dua: 'Duas', chat: 'Nur AI', progress: 'Deen', settings: 'Settings', location: 'Location' },
    bn: { home: 'হোম', quran: 'কুরআন', dua: 'দুয়া', chat: 'নূর এআই', progress: 'দ্বীন', settings: 'সেটিংস', location: 'অবস্থান' }
  }[language];

  const navItems: { icon: string; label: string; view: AppView }[] = [
    { icon: 'home', label: labels.home, view: 'home' },
    { icon: 'book-open', label: labels.quran, view: 'quran' },
    { icon: 'heart', label: labels.dua, view: 'dua' },
    { icon: 'leaf', label: labels.chat, view: 'chat' },
    { icon: 'chart-line', label: labels.progress, view: 'progress' },
    { icon: 'cog', label: labels.settings, view: 'settings' }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden lg:flex flex-col w-64 glass border-r p-6 h-screen sticky top-0 transition-all duration-500">
        <div className="flex items-center justify-between mb-10 px-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#708238] rounded-xl flex items-center justify-center shadow-lg shadow-[#708238]/20">
              <i className="fas fa-leaf text-white text-xl"></i>
            </div>
            <span className="text-xl font-bold tracking-tight">Nur AI</span>
          </div>
          
          <button 
            onClick={toggleTheme}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800/10 dark:bg-white/5 text-[var(--brand-olive)] border border-white/5 transition hover:scale-110"
          >
            <i className={`fas fa-${theme === 'dark' ? 'sun' : 'moon'} text-xs`}></i>
          </button>
        </div>

        <div className="flex-1 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => setActiveView(item.view)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeView === item.view 
                  ? 'bg-[#708238]/10 text-[#708238] dark:text-[#a4b465] border border-[#708238]/20 font-bold' 
                  : 'text-slate-500 hover:bg-white/10'
              }`}
            >
              <i className={`fas fa-${item.icon} w-5`}></i>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        <button 
          onClick={onChangeLocation}
          className="mt-auto p-4 bg-slate-800/5 dark:bg-[#1a1c0d]/40 rounded-2xl border border-[var(--brand-olive)]/30 text-left hover:bg-white/10 transition-colors"
        >
          <div className="flex items-center justify-between text-xs text-[var(--brand-olive)] font-semibold mb-1 uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <i className="fas fa-location-arrow"></i>
              <span>{labels.location}</span>
            </div>
            <i className="fas fa-pencil-alt text-[10px]"></i>
          </div>
          <div className="text-sm font-medium truncate opacity-80">{locationName}</div>
        </button>
      </nav>

      {/* Mobile Bottom Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 glass border-t px-2 py-3 z-50 flex justify-around items-center rounded-t-[2.5rem] shadow-2xl">
        {navItems.map((item) => (
          <button 
            key={item.view} 
            onClick={() => setActiveView(item.view)}
            className={`relative flex flex-col items-center py-2 px-4 transition-all duration-300 ${
              activeView === item.view ? 'text-[var(--brand-olive)]' : 'text-slate-500'
            }`}
          >
            {activeView === item.view && (
              <div className="absolute top-0 w-8 h-1 bg-[#708238] rounded-full animate-in fade-in slide-in-from-top-1"></div>
            )}
            <i className={`fas fa-${item.icon} text-lg mb-1`}></i>
            <span className="text-[10px] uppercase font-bold tracking-widest">{item.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
};

export default Navbar;
