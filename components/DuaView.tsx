
import React, { useState } from 'react';
import { Language } from '../types';

interface Dua {
  category: string;
  title: { en: string; bn: string };
  arabic: string;
  transliteration: string;
  translation: { en: string; bn: string };
  reference?: string;
}

const HISNUL_MUSLIM: Dua[] = [
  {
    category: "Morning & Evening",
    title: { en: "Morning/Evening Protection", bn: "সকাল-সন্ধ্যার আমল" },
    arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّমَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    transliteration: "Bismillahil-ladhi la yadurru ma'as-mihi shay'un fil-ardi wa la fis-sama'i wa Huwas-Sami'ul-'Alim",
    translation: { 
      en: "In the name of Allah, with whose name nothing can cause harm in the earth or in the heavens, and He is the All-Hearing, the All-Knowing.",
      bn: "আল্লাহর নামে, যাঁর নামের বরকতে আসমান ও যমীনে কোনো কিছুই কোনো ক্ষতি করতে পারে না, আর তিনি সর্বশ্রোতা ও সর্বজ্ঞ।"
    },
    reference: "Abu Dawud & Tirmidhi"
  },
  {
    category: "Ramadan",
    title: { en: "Dua for Opening Fast (Iftar)", bn: "ইফতারের দোয়া" },
    arabic: "ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الأَجْرُ إِنْ শَاءَ اللَّهُ",
    transliteration: "Dhahaba adh-dhama'u wabtallat al-'uruqu wa thabata al-ajru in sha' Allah",
    translation: { 
      en: "The thirst has gone, the veins are moistened, and the reward is confirmed, if Allah wills.",
      bn: "পিপাসা দূর হয়েছে, শিরাগুলো সিক্ত হয়েছে এবং আল্লাহ চাহেন তো পুরস্কারও নির্ধারিত হয়েছে।"
    }
  },
  {
    category: "Mosque",
    title: { en: "Entering the Mosque", bn: "মসজিদে প্রবেশের দোয়া" },
    arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
    transliteration: "Allahum-maftah li abwaba rahmatik",
    translation: { 
      en: "O Allah, open the gates of Your mercy for me.",
      bn: "হে আল্লাহ! আমার জন্য তোমার রহমতের দরজাগুলো খুলে দাও।"
    }
  },
  {
    category: "Sleep",
    title: { en: "Before Sleeping", bn: "ঘুমানোর পূর্বে দোয়া" },
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    transliteration: "Bismika Allahumma amutu wa ahya",
    translation: { 
      en: "In Your name, O Allah, I die and I live.",
      bn: "হে আল্লাহ! তোমার নামেই আমি মরি এবং তোমার নামেই জীবিত হই।"
    }
  },
  {
    category: "Waking Up",
    title: { en: "Upon Waking Up", bn: "ঘুম থেকে উঠে দোয়া" },
    arabic: "الْحَمْدُ للهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    transliteration: "Alhamdu lillahil-ladhi ahyana ba'da ma amatana wa ilaihin-nushur",
    translation: { 
      en: "Praise is to Allah Who gives us life after He has caused us to die and to Him is the return.",
      bn: "সমস্ত প্রশংসা আল্লাহর জন্য, যিনি আমাদেরকে মারার পর পুনরায় জীবিত করেছেন এবং তাঁর দিকেই ফিরে যেতে হবে।"
    }
  },
  {
    category: "Difficulties",
    title: { en: "During Distress", bn: "বিপদ-আপদে দোয়া" },
    arabic: "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
    transliteration: "Hasbiyallahu la ilaha illa Huwa 'alayhi tawakkaltu wa Huwa Rabbul-'Arshil-'Azim",
    translation: { 
      en: "Allah is sufficient for me. There is none worthy of worship but Him. I have placed my trust in Him, He is Lord of the Majestic Throne.",
      bn: "আমার জন্য আল্লাহই যথেষ্ট, তিনি ছাড়া আর কোনো ইলাহ নেই। আমি তাঁরই উপর ভরসা করেছি আর তিনি সুমহান আরশের অধিপতি।"
    },
    reference: "Surah At-Tawbah 9:129"
  },
  {
    category: "Character",
    title: { en: "Guidance to Good Character", bn: "উত্তম চরিত্রের দোয়া" },
    arabic: "اللَّهُمَّ اهْدِنِي لِأَحْسَنِ الْأَعْمَالِ وَأَحْسَنِ الْأَخْلَاقِ لَا يَهْدِي لِأَحْسَنِهَا إِلَّا أَنْتَ",
    transliteration: "Allahumma-hdini li-ahsanil-a'mali wa ahsanil-akhlaqi la yahdi li-ahsaniha illa Anta",
    translation: { 
      en: "O Allah, guide me to the best of deeds and the best of manners, for none can guide to the best of them but You.",
      bn: "হে আল্লাহ! আমাকে সর্বোত্তম আমল ও সর্বোত্তম চরিত্রের দিকে পরিচালিত কর, তুমি ছাড়া আর কেউ উত্তম চরিত্রের দিকে পরিচালিত করতে পারে না।"
    }
  }
];

// Added missing interface definition for the component props
interface DuaViewProps {
  language: Language;
}

const DuaView: React.FC<DuaViewProps> = ({ language }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const categories = ['All', ...Array.from(new Set(HISNUL_MUSLIM.map(d => d.category)))];

  const t = {
    en: { 
      title: 'Hisnul Muslim', 
      sub: 'Fortress of the Muslim: Authentic Supplications',
      search: 'Search supplications...',
      copy: 'Copied!',
      reference: 'Ref'
    },
    bn: { 
      title: 'হিসনুল মুসলিম', 
      sub: 'মুসলিম দুর্গ: সহীহ দুআ ও যিকর',
      search: 'দুআ খুঁজুন...',
      copy: 'কপি হয়েছে!',
      reference: 'সূত্র'
    }
  }[language];

  const filteredDuas = HISNUL_MUSLIM.filter(dua => {
    const matchesCategory = activeCategory === 'All' || dua.category === activeCategory;
    const matchesSearch = dua.title.en.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          dua.title.bn.includes(searchQuery) ||
                          dua.translation.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dua.translation.bn.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (dua: Dua) => {
    const text = `${dua.title[language]}\n\n${dua.arabic}\n\n${dua.transliteration}\n\n${dua.translation[language]}`;
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="px-2">
        <h2 className="text-3xl font-black flex items-center gap-3">
          <i className="fas fa-shield-halved text-[var(--brand-olive)]"></i>
          {t.title}
        </h2>
        <p className="text-sm text-slate-400 mt-1 font-medium">{t.sub}</p>
      </header>

      {/* Search & Filter */}
      <div className="space-y-4 px-2">
        <div className="relative group">
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[var(--brand-olive)] transition-colors"></i>
          <input 
            type="text" 
            placeholder={t.search} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-[var(--brand-olive)] outline-none transition-all shadow-sm"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-xs font-bold transition-all border ${
                activeCategory === cat 
                  ? 'bg-[var(--brand-olive)] border-[var(--brand-olive)] text-white shadow-lg shadow-[var(--brand-olive)]/20' 
                  : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Dua List */}
      <div className="space-y-6">
        {filteredDuas.map((dua, i) => (
          <div key={i} className="group relative">
            <div className="glass p-8 rounded-[2.5rem] border-white/5 hover:border-[var(--brand-olive)]/30 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-[var(--brand-olive)]/5">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-[10px] text-[var(--brand-olive)] font-black uppercase tracking-[0.2em] mb-1">
                    {dua.category}
                  </div>
                  <h3 className="text-lg font-bold text-slate-100 group-hover:text-white transition-colors">
                    {dua.title[language]}
                  </h3>
                </div>
                <button 
                  onClick={() => handleCopy(dua)}
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 hover:text-[var(--brand-olive)] hover:bg-[var(--brand-olive)]/10 transition-all active:scale-90"
                >
                  <i className="fas fa-clone"></i>
                </button>
              </div>

              <div className="arabic text-3xl text-right leading-[2] text-emerald-100 mb-8 selectable" dir="rtl">
                {dua.arabic}
              </div>

              <div className="space-y-4 pt-6 border-t border-white/5">
                <div className="relative pl-4 border-l-2 border-slate-700/50">
                  <p className="text-xs italic text-slate-400 leading-relaxed selectable">{dua.transliteration}</p>
                </div>
                <div className="relative pl-4 border-l-2 border-[var(--brand-olive)]/30">
                  <p className="text-sm text-slate-200 leading-relaxed selectable">{dua.translation[language]}</p>
                </div>
              </div>

              {dua.reference && (
                <div className="mt-6 flex justify-end">
                  <div className="text-[9px] font-black uppercase tracking-widest text-slate-500 bg-black/20 px-3 py-1.5 rounded-lg border border-white/5">
                    {t.reference}: {dua.reference}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {filteredDuas.length === 0 && (
          <div className="text-center py-20 glass rounded-[2.5rem] border-white/5">
            <i className="fas fa-search text-4xl text-slate-700 mb-4"></i>
            <p className="text-slate-500 font-medium">No results found for your search.</p>
          </div>
        )}
      </div>

      <div className="text-center pt-4 opacity-30 pb-10">
        <div className="text-[10px] font-black uppercase tracking-[0.4em] mb-1">AUTHENTIC SUNNAH</div>
        <div className="text-[8px] uppercase tracking-widest">Based on Sa'id bin Ali bin Wahf Al-Qahtani's Hisnul Muslim</div>
      </div>
    </div>
  );
};

export default DuaView;
