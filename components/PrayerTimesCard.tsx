
import React from 'react';
import { PrayerTimes, Language, PrayerMethod } from '../types';

interface PrayerTimesCardProps {
  prayerTimes: PrayerTimes;
  onViewCalendar: () => void;
  language: Language;
  prayerMethodId: number;
}

const PRAYER_METHODS: PrayerMethod[] = [
  { id: 1, name: "Karachi" },
  { id: 2, name: "ISNA" },
  { id: 3, name: "MWL" },
  { id: 4, name: "Makkah" },
  { id: 5, name: "Egypt" },
  { id: 8, name: "Gulf" },
  { id: 9, name: "Kuwait" },
  { id: 10, name: "Qatar" },
  { id: 11, name: "Singapore" },
  { id: 12, name: "France" },
  { id: 13, name: "Turkey" },
  { id: 14, name: "Russia" },
];

const PrayerTimesCard: React.FC<PrayerTimesCardProps> = ({ prayerTimes, onViewCalendar, language, prayerMethodId }) => {
  const labels = {
    en: { schedule: 'Prayer Schedule', method: 'Method', imsak: 'Imsak Time', viewCalendar: 'View Calendar' },
    bn: { schedule: 'নামাজের সময়সূচী', method: 'পদ্ধতি', imsak: 'ইমসাকের সময়', viewCalendar: 'ক্যালেন্ডার দেখুন' }
  }[language];

  const methodName = PRAYER_METHODS.find(m => m.id === prayerMethodId)?.name || "Standard";

  const toBengaliDigits = (num: number | string): string => {
    const benDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().split('').map(digit => /\d/.test(digit) ? benDigits[parseInt(digit)] : digit).join('');
  };

  const prayers = [
    { name: language === 'en' ? 'Fajr' : 'ফজর', time: prayerTimes.Fajr, icon: 'sun' },
    { name: language === 'en' ? 'Dhuhr' : 'যোহর', time: prayerTimes.Dhuhr, icon: 'sun' },
    { name: language === 'en' ? 'Asr' : 'আসর', time: prayerTimes.Asr, icon: 'cloud-sun' },
    { name: language === 'en' ? 'Maghrib' : 'মাগরিব', time: prayerTimes.Maghrib, icon: 'cloud-moon' },
    { name: language === 'en' ? 'Isha' : 'এশা', time: prayerTimes.Isha, icon: 'moon' }
  ];

  const formatTime = (time: string) => language === 'bn' ? toBengaliDigits(time) : time;

  return (
    <div className="glass rounded-3xl p-6 shadow-sm h-full transition-all duration-500">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold">{labels.schedule}</h3>
        <span className="text-[10px] bg-[var(--brand-olive)]/10 px-3 py-1 rounded-full text-slate-500 font-bold uppercase tracking-widest border border-[var(--brand-olive)]/20">
          {labels.method}: {methodName}
        </span>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {prayers.map((prayer) => (
          <div 
            key={prayer.name} 
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 dark:bg-black/10 border border-white/10 hover:border-[var(--brand-olive)]/30 hover:bg-[var(--brand-olive)]/5 transition-all group shadow-sm"
          >
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3 group-hover:bg-[var(--brand-olive)] transition-colors">
              <i className={`fas fa-${prayer.icon} text-slate-400 group-hover:text-white`}></i>
            </div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{prayer.name}</span>
            <span className="text-xl font-bold">{formatTime(prayer.time)}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-[var(--brand-olive)]/5 border border-[var(--brand-olive)]/10 rounded-2xl p-4 flex items-center justify-between shadow-inner">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-[var(--brand-olive)]/20 rounded-lg flex items-center justify-center">
            <i className="fas fa-utensils text-[var(--brand-olive)] text-sm"></i>
          </div>
          <div>
            <div className="text-[10px] text-[var(--brand-olive)] font-black uppercase tracking-widest">{labels.imsak}</div>
            <div className="font-bold opacity-80">{formatTime(prayerTimes.Imsak)}</div>
          </div>
        </div>
        <button 
          onClick={onViewCalendar}
          className="text-xs font-bold text-[var(--brand-olive)] hover:opacity-70 flex items-center gap-1 transition"
        >
          {labels.viewCalendar} <i className="fas fa-chevron-right text-[10px]"></i>
        </button>
      </div>
    </div>
  );
};

export default PrayerTimesCard;
