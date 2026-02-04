
import React, { useState, useEffect } from 'react';
import { DailyProgress, Language } from '../types';
import { getDailyQuote } from '../services/quotesService';

interface ProgressViewProps {
  language: Language;
}

const ProgressView: React.FC<ProgressViewProps> = ({ language }) => {
  const [progress, setProgress] = useState<DailyProgress>(() => {
    const saved = localStorage.getItem('deen_progress');
    if (saved) return JSON.parse(saved);
    return {
      date: new Date().toISOString().split('T')[0],
      fasting: false,
      prayers: { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false },
      quranPages: 0
    };
  });

  const [dailyQuote, setDailyQuote] = useState(getDailyQuote());

  const t = {
    en: {
      title: 'Daily Deen Tracker',
      sub: 'Small deeds, consistently done, are beloved to Allah.',
      salatToday: 'Salat Today',
      pagesRead: 'Pages Read',
      checklist: 'Faith Checklist',
      fastingNow: 'I am Fasting Today',
      goal: 'Daily Reflection'
    },
    bn: {
      title: 'প্রতিদিনের আমল ট্র্যাকার',
      sub: 'অল্প আমল যা নিয়মিত করা হয় তা আল্লাহর কাছে প্রিয়।',
      salatToday: 'আজকের নামাজ',
      pagesRead: 'পড়া হয়েছে',
      checklist: 'ঈমানি চেকলিস্ট',
      fastingNow: 'আমি আজ রোজা রেখেছি',
      goal: 'দৈনিক প্রতিফলন'
    }
  }[language];

  const toBengaliDigits = (num: number | string): string => {
    const benDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().split('').map(digit => /\d/.test(digit) ? benDigits[parseInt(digit)] : digit).join('');
  };

  useEffect(() => {
    localStorage.setItem('deen_progress', JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    // Refresh quote if the day changes while the app is open
    const checkDate = setInterval(() => {
      const newQuote = getDailyQuote();
      if (newQuote.text.en !== dailyQuote.text.en) {
        setDailyQuote(newQuote);
      }
    }, 60000);
    return () => clearInterval(checkDate);
  }, [dailyQuote]);

  const togglePrayer = (prayer: keyof typeof progress.prayers) => {
    setProgress(prev => ({
      ...prev,
      prayers: { ...prev.prayers, [prayer]: !prev.prayers[prayer] }
    }));
  };

  const completedPrayers = Object.values(progress.prayers).filter(Boolean).length;
  const prayerCountStr = language === 'bn' ? `${toBengaliDigits(completedPrayers)}/${toBengaliDigits(5)}` : `${completedPrayers}/5`;
  const pageCountStr = language === 'bn' ? toBengaliDigits(progress.quranPages) : progress.quranPages;

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <i className="fas fa-leaf text-[var(--brand-olive)]"></i>
          {t.title}
        </h2>
        <p className="text-sm text-slate-400 mt-1">{t.sub}</p>
      </header>

      {/* Main Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass p-6 rounded-3xl border-[var(--brand-olive)]/20 text-center flex flex-col items-center">
          <div className="text-3xl font-black text-[var(--brand-olive)] mb-1">{prayerCountStr}</div>
          <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">{t.salatToday}</div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-4 overflow-hidden">
            <div 
              className="h-full bg-[var(--brand-olive)] transition-all duration-500" 
              style={{ width: `${(completedPrayers / 5) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="glass p-6 rounded-3xl border-amber-500/20 text-center flex flex-col items-center">
          <div className="text-3xl font-black text-amber-500 mb-1">{pageCountStr}</div>
          <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">{t.pagesRead}</div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => setProgress(p => ({...p, quranPages: Math.max(0, p.quranPages - 1)}))} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/5">-</button>
            <button onClick={() => setProgress(p => ({...p, quranPages: p.quranPages + 1}))} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/5">+</button>
          </div>
        </div>
      </div>

      {/* Checklists */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 px-2">{t.checklist}</h3>
        
        <button 
          onClick={() => setProgress(prev => ({ ...prev, fasting: !prev.fasting }))}
          className={`w-full glass p-5 rounded-3xl flex items-center justify-between transition-all border ${
            progress.fasting ? 'border-[var(--brand-olive)]/30 bg-[var(--brand-olive)]/5' : 'border-white/5'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${progress.fasting ? 'bg-[var(--brand-olive)] text-white shadow-lg shadow-[var(--brand-olive)]/20' : 'bg-slate-900 text-slate-500'}`}>
              <i className="fas fa-utensils"></i>
            </div>
            <span className="font-bold">{t.fastingNow}</span>
          </div>
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${progress.fasting ? 'bg-[var(--brand-olive)] border-[var(--brand-olive)]' : 'border-white/10'}`}>
            {progress.fasting && <i className="fas fa-check text-xs text-white"></i>}
          </div>
        </button>

        <div className="grid grid-cols-1 gap-3">
          {(['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const).map(p => (
            <button 
              key={p}
              onClick={() => togglePrayer(p)}
              className={`glass p-4 rounded-2xl flex items-center justify-between transition-all border ${
                progress.prayers[p] ? 'border-[var(--brand-olive)]/20 bg-[var(--brand-olive)]/5' : 'border-white/5'
              }`}
            >
              <span className="capitalize font-medium text-slate-300">
                {language === 'bn' ? {fajr: 'ফজর', dhuhr: 'যোহর', asr: 'আসর', maghrib: 'মাগরিব', isha: 'এশা'}[p] : p} {language === 'en' ? 'Prayer' : 'নামাজ'}
              </span>
              <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${progress.prayers[p] ? 'bg-[var(--brand-olive)] border-[var(--brand-olive)]' : 'border-white/10'}`}>
                {progress.prayers[p] && <i className="fas fa-check text-[10px] text-white"></i>}
              </div>
            </button>
          ))}
        </div>
      </section>

      <div className="p-6 bg-[var(--brand-olive)]/10 border border-[var(--brand-olive)]/10 rounded-3xl text-center">
        <div className="text-xs text-[var(--brand-olive)] font-bold uppercase tracking-widest mb-2">{t.goal}</div>
        <p className="text-sm text-slate-400 italic mb-2">"{dailyQuote.text[language]}"</p>
        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">— {dailyQuote.source[language]}</div>
      </div>
    </div>
  );
};

export default ProgressView;
