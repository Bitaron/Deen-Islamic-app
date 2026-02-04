
import React, { useState, useEffect, useRef } from 'react';
import { Surah, SurahDetail, Language } from '../types';

interface QuranViewProps {
  language: Language;
}

const QuranView: React.FC<QuranViewProps> = ({ language }) => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [surahContent, setSurahContent] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const [search, setSearch] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const t = {
    en: { 
      title: 'The Holy Quran', 
      search: 'Search Surah by name or number...', 
      ayahs: 'Ayahs', 
      back: 'Back to surahs',
      translationEn: 'Sahih International',
      translationBn: 'Mufti Taki Usmani',
      bismillah: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
      loadingSurah: 'Opening Surah...',
      revelation: 'Revelation',
      error: 'Could not load Quran content.'
    },
    bn: { 
      title: 'পবিত্র কুরআন', 
      search: 'নাম বা নম্বর দিয়ে সূরা খুঁজুন...', 
      ayahs: 'আয়াত', 
      back: 'ফিরে যান',
      translationEn: 'সহীহ ইন্টারন্যাশনাল',
      translationBn: 'মুফতী তকী উসমানী',
      bismillah: 'পরম করুণাময় অসীম দয়ালু আল্লাহর নামে শুরু করছি।',
      loadingSurah: 'সূরা খোলা হচ্ছে...',
      revelation: 'অবতরণ',
      error: 'কুরআন লোড করা সম্ভব হয়নি।'
    }
  }[language];

  useEffect(() => {
    fetch('https://api.alquran.cloud/v1/surah')
      .then(res => res.json())
      .then(data => {
        if (data && data.data && Array.isArray(data.data)) {
          setSurahs(data.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const toBengaliDigits = (num: number | string): string => {
    const benDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().split('').map(digit => /\d/.test(digit) ? benDigits[parseInt(digit)] : digit).join('');
  };

  const loadSurah = async (surah: Surah) => {
    setSelectedSurah(surah);
    setContentLoading(true);
    setSurahContent(null);
    
    try {
      // Use correct api.alquran.cloud domain for surah editions
      const res = await fetch(`https://api.alquran.cloud/v1/surah/${surah.number}/editions/quran-uthmani,en.sahih,bn.bengali`);
      const data = await res.json();
      
      if (data && Array.isArray(data.data) && data.data.length >= 3) {
        const content: SurahDetail = {
          ...surah,
          ayahs: data.data[0].ayahs || [],
          translationEn: data.data[1].ayahs || [],
          translationBn: data.data[2].ayahs || []
        };
        setSurahContent(content);
      }
      
      if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0;
    } catch (err) {
      console.error("Failed to load surah content", err);
    } finally {
      setContentLoading(false);
    }
  };

  const filteredSurahs = Array.isArray(surahs) ? surahs.filter(s => 
    s.englishName.toLowerCase().includes(search.toLowerCase()) || 
    s.number.toString() === search ||
    s.name.includes(search)
  ) : [];

  if (selectedSurah) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        <header className="flex items-center justify-between glass p-4 rounded-3xl border-white/5 sticky top-0 z-10 backdrop-blur-xl">
          <button 
            onClick={() => setSelectedSurah(null)}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition group"
          >
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[var(--brand-olive)] group-hover:text-white transition">
              <i className="fas fa-arrow-left"></i>
            </div>
            <span className="text-sm font-bold hidden sm:inline">{t.back}</span>
          </button>
          <div className="text-center flex-1 px-4">
            <h2 className="text-xl font-bold truncate">{selectedSurah.englishName}</h2>
            <p className="text-[10px] text-[var(--brand-olive)] font-bold uppercase tracking-[0.2em]">
              {selectedSurah.name} • {language === 'bn' ? toBengaliDigits(selectedSurah.numberOfAyahs) : selectedSurah.numberOfAyahs} {t.ayahs}
            </p>
          </div>
          <div className="w-10 h-10"></div>
        </header>

        {contentLoading ? (
          <div className="h-[50vh] flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-2 border-[var(--brand-olive)] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[var(--brand-olive)] text-sm font-medium animate-pulse">{t.loadingSurah}</p>
          </div>
        ) : surahContent && Array.isArray(surahContent.ayahs) ? (
          <div className="space-y-8 pb-20">
            <div className="text-center space-y-4 py-8 glass rounded-[3rem] border-white/5 bg-gradient-to-b from-[var(--brand-olive)]/10 to-transparent">
              <div className="arabic text-4xl text-emerald-100">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
              <p className="text-xs text-slate-400 italic px-8">{t.bismillah}</p>
              <div className="flex justify-center gap-8 pt-4">
                <div className="text-center">
                  <div className="text-[9px] text-slate-500 uppercase font-black tracking-widest">{t.revelation}</div>
                  <div className="text-sm font-bold text-[var(--brand-olive)]">{selectedSurah.revelationType}</div>
                </div>
                <div className="text-center">
                  <div className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Surah No.</div>
                  <div className="text-sm font-bold text-[var(--brand-olive)]">{language === 'bn' ? toBengaliDigits(selectedSurah.number) : selectedSurah.number}</div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {surahContent.ayahs.map((ayah, index) => (
                <div key={ayah.number} className="group relative">
                  <div className="glass p-6 rounded-[2.5rem] border-white/5 hover:border-[var(--brand-olive)]/30 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-[var(--brand-olive)]/5">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-8 h-8 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-[10px] font-black text-[var(--brand-olive)] group-hover:bg-[var(--brand-olive)] group-hover:text-white transition-all">
                        {language === 'bn' ? toBengaliDigits(ayah.numberInSurah) : ayah.numberInSurah}
                      </div>
                      <div className="flex gap-2">
                        <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500 hover:text-white transition">
                          <i className="fas fa-play text-[10px]"></i>
                        </button>
                        <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500 hover:text-white transition">
                          <i className="fas fa-share-alt text-[10px]"></i>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="arabic text-3xl text-right leading-[1.8] text-emerald-50 mb-8 selectable" dir="rtl">
                        {selectedSurah.number !== 1 && selectedSurah.number !== 9 && ayah.numberInSurah === 1 
                          ? ayah.text.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', '').trim() 
                          : ayah.text}
                      </div>

                      <div className="space-y-4 pt-6 border-t border-white/5">
                        <div className="relative pl-4 border-l-2 border-amber-500/20">
                          <div className="text-[8px] text-amber-500/60 uppercase font-bold tracking-widest mb-1">{t.translationEn}</div>
                          <p className="text-sm text-slate-300 leading-relaxed selectable">{surahContent.translationEn?.[index]?.text || ''}</p>
                        </div>
                        <div className="relative pl-4 border-l-2 border-[var(--brand-olive)]/20">
                          <div className="text-[8px] text-[var(--brand-olive)]/60 uppercase font-bold tracking-widest mb-1">{t.translationBn}</div>
                          <p className="text-sm text-slate-200 leading-relaxed selectable">{surahContent.translationBn?.[index]?.text || ''}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
           <div className="p-12 text-center text-slate-400">
             {t.error}
           </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <i className="fas fa-book-open text-[var(--brand-olive)]"></i>
            {t.title}
          </h2>
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">
            {language === 'bn' ? toBengaliDigits(surahs.length) : surahs.length} Surahs
          </div>
        </div>
        <div className="relative group">
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[var(--brand-olive)] transition-colors"></i>
          <input 
            type="text" 
            placeholder={t.search} 
            className="w-full bg-white/5 border border-white/10 rounded-3xl py-4 pl-12 pr-4 text-sm focus:border-[var(--brand-olive)]/50 focus:bg-[var(--brand-olive)]/5 outline-none transition-all shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="h-24 glass rounded-3xl animate-pulse border-white/5"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-20">
          {filteredSurahs.map((surah) => (
            <button 
              key={surah.number} 
              onClick={() => loadSurah(surah)}
              className="glass p-5 rounded-3xl border-white/5 flex items-center justify-between hover:bg-[var(--brand-olive)]/10 hover:border-[var(--brand-olive)]/30 transition-all group text-left relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-[var(--brand-olive)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center font-black text-sm text-[var(--brand-olive)] group-hover:bg-[var(--brand-olive)] group-hover:text-white transition-all shadow-inner">
                  {language === 'bn' ? toBengaliDigits(surah.number) : surah.number}
                </div>
                <div>
                  <h4 className="font-bold group-hover:text-[var(--brand-olive)] transition-colors">{surah.englishName}</h4>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-0.5">{surah.englishNameTranslation}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="arabic text-2xl text-emerald-200 group-hover:text-emerald-100 transition-colors mb-1">{surah.name}</div>
                <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest opacity-60">
                  {language === 'bn' ? toBengaliDigits(surah.numberOfAyahs) : surah.numberOfAyahs} {t.ayahs}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuranView;
