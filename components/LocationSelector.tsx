
import React, { useState, useEffect } from 'react';
import { UserLocation, Language } from '../types';

interface LocationSelectorProps {
  onSelect: (loc: UserLocation, name: string) => void;
  onClose: () => void;
  onUseCurrentLocation: () => void;
  language: Language;
}

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ onSelect, onClose, onUseCurrentLocation, language }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);

  const t = {
    en: { title: 'Select Location', current: 'Current Location', currentSub: 'Use GPS / IP detection', searchPlaceholder: 'Search for your city...', noFound: 'No cities found for', enterMin: 'Enter at least 3 characters' },
    bn: { title: 'অবস্থান নির্বাচন করুন', current: 'বর্তমান অবস্থান', currentSub: 'জিপিএস / আইপি ব্যবহার করুন', searchPlaceholder: 'আপনার শহর খুঁজুন...', noFound: 'কোন শহর পাওয়া যায়নি:', enterMin: 'অন্তত ৩টি অক্ষর লিখুন' }
  }[language];

  useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`);
        const data = await response.json();
        setResults(data);
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="fixed inset-0 z-[100] flex items-end lg:items-center justify-center p-4 lg:p-0">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative w-full max-w-md glass border border-white/10 rounded-t-[2.5rem] lg:rounded-[2.5rem] overflow-hidden animate-in slide-in-from-bottom-full lg:zoom-in-95 duration-300">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">{t.title}</h3>
            <button onClick={onClose} className="text-slate-500 hover:text-white transition">
              <i className="fas fa-times"></i>
            </button>
          </div>

          <button 
            onClick={onUseCurrentLocation}
            className="w-full flex items-center justify-between p-4 bg-[var(--brand-olive)]/10 border border-[var(--brand-olive)]/20 rounded-2xl hover:bg-[var(--brand-olive)]/20 transition group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--brand-olive)] flex items-center justify-center text-white">
                <i className="fas fa-location-arrow"></i>
              </div>
              <div className="text-left">
                <div className="font-bold text-[var(--brand-olive)]">{t.current}</div>
                <div className="text-xs opacity-60 font-medium">{t.currentSub}</div>
              </div>
            </div>
            <i className="fas fa-chevron-right text-[var(--brand-olive)] transition group-hover:translate-x-1"></i>
          </button>

          <div className="relative">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
            <input 
              type="text" 
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder} 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-[var(--brand-olive)] outline-none transition"
            />
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-hide">
            {searching ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-[var(--brand-olive)] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : results.length > 0 ? (
              results.map((res, i) => (
                <button 
                  key={i}
                  onClick={() => onSelect({ lat: parseFloat(res.lat), lng: parseFloat(res.lon) }, res.display_name.split(',')[0])}
                  className="w-full p-4 hover:bg-white/5 rounded-2xl text-left border border-transparent hover:border-white/5 transition"
                >
                  <div className="font-medium text-sm truncate">{res.display_name}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5 font-bold uppercase tracking-widest">
                    {res.lat.slice(0, 6)}, {res.lon.slice(0, 6)}
                  </div>
                </button>
              ))
            ) : query.length >= 3 ? (
              <div className="text-center py-8 text-slate-500 text-sm italic">
                {t.noFound} "{query}"
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 text-xs font-bold uppercase tracking-widest opacity-30">
                {t.enterMin}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-black/40 text-center text-[10px] text-slate-500 uppercase font-bold tracking-[0.2em]">
          Powered by OpenStreetMap
        </div>
      </div>
    </div>
  );
};

export default LocationSelector;
