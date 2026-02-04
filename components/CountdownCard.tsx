
import React, { useState, useEffect } from 'react';
import { PrayerTimes, Language } from '../types';
import { isRamadan } from '../services/prayerService';
import { getDailyQuote } from '../services/quotesService';

interface CountdownCardProps {
  prayerTimes: PrayerTimes;
  language: Language;
}

const CountdownCard: React.FC<CountdownCardProps> = ({ prayerTimes, language }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [nextEvent, setNextEvent] = useState<string>('');
  const [dates, setDates] = useState<{ gregorian: string; hijri: string; bangla: string }>({
    gregorian: '',
    hijri: '',
    bangla: ''
  });
  const [dailyQuote, setDailyQuote] = useState(getDailyQuote());

  const labels = {
    en: { comingUp: 'Coming up', suhoor: 'Suhoor', iftar: 'Iftar', ah: 'AH', bengaliEra: 'Bengali Era' },
    bn: { comingUp: 'শীঘ্রই আসছে', suhoor: 'সেহরি', iftar: 'ইফতার', ah: 'হিজরি', bengaliEra: 'বঙ্গাব্দ' }
  }[language];

  const toBengaliDigits = (num: number | string): string => {
    const benDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().split('').map(digit => /\d/.test(digit) ? benDigits[parseInt(digit)] : digit).join('');
  };

  const calculateBanglaSolarDate = (date: Date) => {
    const year = date.getFullYear();
    const day = date.getDate();

    let banglaYear = year - 593;
    let boishakh1 = new Date(year, 3, 14); 
    
    if (date < boishakh1) {
      banglaYear = year - 594;
      boishakh1 = new Date(year - 1, 3, 14);
    }

    const diffInMs = date.getTime() - boishakh1.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    const banglaMonths = [
      "বৈশাখ", "জ্যৈষ্ঠ", "আষাঢ়", "শ্রাবণ", "ভাদ্র", "আশ্বিন",
      "কার্তিক", "অগ্রহায়ণ", "পৌষ", "মাঘ", "ফাল্গুন", "চৈত্র"
    ];

    const isLeapYear = (y: number) => (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);
    const monthDays = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, isLeapYear(year) ? 31 : 30, 30];

    let remainingDays = diffInDays;
    let banglaMonthIndex = 0;
    
    for (let i = 0; i < monthDays.length; i++) {
      if (remainingDays < monthDays[i]) {
        banglaMonthIndex = i;
        break;
      }
      remainingDays -= monthDays[i];
    }

    const banglaDay = remainingDays + 1;
    const banglaMonth = banglaMonths[banglaMonthIndex];

    let suffix = '';
    if (banglaDay === 1) suffix = 'লা';
    else if (banglaDay === 2 || banglaDay === 3) suffix = 'রা';
    else if (banglaDay === 4) suffix = 'ঠা';
    else if (banglaDay >= 5 && banglaDay <= 18) suffix = 'ই';
    else if (banglaDay >= 19 && banglaDay <= 31) suffix = 'শে';

    const dayStr = language === 'bn' ? `${toBengaliDigits(banglaDay)}${suffix}` : `${banglaDay}${suffix}`;
    const yearStr = language === 'bn' ? toBengaliDigits(banglaYear) : banglaYear;

    return `${dayStr} ${banglaMonth}, ${yearStr} ${labels.bengaliEra}`;
  };

  useEffect(() => {
    const formatDates = () => {
      const now = new Date();
      
      const gregorian = new Intl.DateTimeFormat(language === 'bn' ? 'bn-BD' : 'en-GB', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      }).format(now);

      const hijriFormatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      const hijriParts = hijriFormatter.formatToParts(now);
      const hDay = hijriParts.find(p => p.type === 'day')?.value;
      const hMonth = hijriParts.find(p => p.type === 'month')?.value;
      const hYear = hijriParts.find(p => p.type === 'year')?.value;

      const dayVal = language === 'bn' ? toBengaliDigits(hDay || '') : hDay;
      const yearVal = language === 'bn' ? toBengaliDigits(hYear || '') : hYear;

      const hijri = `${hMonth} ${dayVal}, ${yearVal} ${labels.ah}`;
      const bangla = calculateBanglaSolarDate(now);

      return { gregorian, hijri, bangla };
    };

    setDates(formatDates());
    setDailyQuote(getDailyQuote());

    const timer = setInterval(() => {
      const now = new Date();
      const currentlyRamadan = isRamadan(now);

      const getPrayerDate = (timeStr: string, daysOffset = 0) => {
        const d = new Date();
        const [h, m] = timeStr.split(':').map(Number);
        d.setHours(h, m, 0, 0);
        if (daysOffset !== 0) d.setDate(d.getDate() + daysOffset);
        return d;
      };

      let targetTime: Date;
      let label: string;

      if (currentlyRamadan) {
        const fajr = getPrayerDate(prayerTimes.Fajr);
        const maghrib = getPrayerDate(prayerTimes.Maghrib);
        if (now < fajr) { targetTime = fajr; label = language === 'en' ? 'Suhoor (Fajr)' : 'সেহরি (ফজর)'; }
        else if (now < maghrib) { targetTime = maghrib; label = language === 'en' ? 'Iftar (Maghrib)' : 'ইফতার (মাগরিব)'; }
        else { targetTime = getPrayerDate(prayerTimes.Fajr, 1); label = language === 'en' ? 'Suhoor (Tomorrow)' : 'সেহরি (আগামীকাল)'; }
      } else {
        const prayers = [
          { name: language === 'en' ? 'Fajr' : 'ফজর', time: getPrayerDate(prayerTimes.Fajr) },
          { name: language === 'en' ? 'Dhuhr' : 'যোহর', time: getPrayerDate(prayerTimes.Dhuhr) },
          { name: language === 'en' ? 'Asr' : 'আসর', time: getPrayerDate(prayerTimes.Asr) },
          { name: language === 'en' ? 'Maghrib' : 'মাগরিব', time: getPrayerDate(prayerTimes.Maghrib) },
          { name: language === 'en' ? 'Isha' : 'এশা', time: getPrayerDate(prayerTimes.Isha) },
        ];
        const nextSalah = prayers.find(p => p.time > now);
        if (nextSalah) { targetTime = nextSalah.time; label = nextSalah.name; }
        else { targetTime = getPrayerDate(prayerTimes.Fajr, 1); label = language === 'en' ? 'Fajr (Tomorrow)' : 'ফজর (আগামীকাল)'; }
      }

      const diff = targetTime.getTime() - now.getTime();
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      const timeStr = language === 'bn' 
        ? `${toBengaliDigits(h.toString().padStart(2, '0'))}:${toBengaliDigits(m.toString().padStart(2, '0'))}:${toBengaliDigits(s.toString().padStart(2, '0'))}`
        : `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

      setTimeLeft(timeStr);
      setNextEvent(label);
      
      if (now.getHours() === 0 && now.getMinutes() === 0 && now.getSeconds() === 0) {
        setDates(formatDates());
        setDailyQuote(getDailyQuote());
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [prayerTimes, language]);

  return (
    <div className="glass rounded-3xl p-8 border-[var(--brand-olive)]/30 bg-gradient-to-br from-[var(--brand-olive)]/10 to-transparent h-full flex flex-col items-center justify-center text-center relative overflow-hidden group shadow-lg transition-all duration-500">
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-[var(--brand-olive)]/5 rounded-full blur-3xl group-hover:bg-[var(--brand-olive)]/10 transition-all"></div>
      
      {/* Date Information Hub */}
      <div className="flex flex-col gap-4 mb-8 w-full animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="relative self-center">
          <div className="flex items-center gap-2 text-[15px] text-[var(--brand-olive)] font-black uppercase tracking-[0.1em] bg-[var(--brand-olive)]/10 py-2.5 px-6 rounded-full border border-[var(--brand-olive)]/20 shadow-xl shadow-[var(--brand-olive)]/5">
            <i className="fas fa-moon text-[11px]"></i>
            {dates.hijri}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] w-6 bg-gradient-to-r from-transparent to-amber-500/40"></div>
            <div className="text-[14px] text-amber-600 dark:text-amber-500 font-bold tracking-tight">
              {dates.bangla}
            </div>
            <div className="h-[1px] w-6 bg-gradient-to-l from-transparent to-amber-500/40"></div>
          </div>
          <div className="text-[12px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-widest opacity-80">
            {dates.gregorian}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1 mb-6">
        <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mb-1">{labels.comingUp}</span>
        <div className="flex items-center gap-2">
           <span className="w-2 h-2 bg-[var(--brand-olive)] rounded-full animate-pulse shadow-[0_0_10px_var(--brand-olive)]"></span>
           <span className="text-lg font-bold uppercase tracking-[0.2em] opacity-90">
            {nextEvent}
          </span>
        </div>
      </div>
      
      <div className="text-7xl font-black tracking-tighter drop-shadow-lg mb-10 tabular-nums filter transition-all duration-500">
        {timeLeft || '00:00:00'}
      </div>
      
      <div className="flex gap-3 w-full">
        <div className="flex-1 bg-white/5 dark:bg-black/20 rounded-2xl py-4 px-4 border border-white/10 hover:border-[var(--brand-olive)]/40 transition-all cursor-default group/btn shadow-sm">
          <div className="text-[9px] text-slate-500 uppercase font-black mb-1 tracking-[0.2em] group-hover/btn:text-[var(--brand-olive)] transition-colors">{labels.suhoor}</div>
          <div className="text-2xl font-black text-[var(--brand-olive)]">
            {language === 'bn' ? toBengaliDigits(prayerTimes.Fajr) : prayerTimes.Fajr}
          </div>
        </div>
        <div className="flex-1 bg-white/5 dark:bg-black/20 rounded-2xl py-4 px-4 border border-white/10 hover:border-amber-500/40 transition-all cursor-default group/btn shadow-sm">
          <div className="text-[9px] text-slate-500 uppercase font-black mb-1 tracking-[0.2em] group-hover/btn:text-amber-500 transition-colors">{labels.iftar}</div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {language === 'bn' ? toBengaliDigits(prayerTimes.Maghrib) : prayerTimes.Maghrib}
          </div>
        </div>
      </div>
      
      <div className="mt-10 pt-6 border-t border-[var(--brand-olive)]/10 w-full">
        <div className="italic text-slate-500 text-[12px] leading-relaxed px-6 opacity-70 group-hover:opacity-100 transition-opacity duration-500">
          "{dailyQuote.text[language]}"
          <div className="not-italic font-bold text-[10px] mt-2 opacity-50 uppercase tracking-widest text-slate-400">
            — {dailyQuote.source[language]}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownCard;
