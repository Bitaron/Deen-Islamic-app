
import React, { useState, useEffect } from 'react';
import { UserLocation, Language } from '../types';

interface CalendarViewProps {
  location: UserLocation | null;
  onBack: () => void;
  language: Language;
  prayerMethodId: number;
}

interface CalendarDay {
  date: string;
  hijri: string;
  fajr: string;
  maghrib: string;
  day: number;
}

const CalendarView: React.FC<CalendarViewProps> = ({ location, onBack, language, prayerMethodId }) => {
  const [calendar, setCalendar] = useState<CalendarDay[]>([]);
  const [loading, setLoading] = useState(true);

  const t = {
    en: { title: 'Islamic Calendar', sub: 'Prayer Timings & Hijri Dates', day: 'Day', date: 'Date', fajr: 'Fajr', maghrib: 'Maghrib', note: 'Prayer times and Hijri dates are calculated based on your current location and selected method. Ensure your settings are accurate for precise timings.', error: 'Failed to load calendar data.' },
    bn: { title: 'ইসলামী ক্যালেন্ডার', sub: 'নামাজের সময় এবং হিজরি তারিখ', day: 'দিন', date: 'তারিখ', fajr: 'ফজর', magহ্রিব: 'মাগরিব', note: 'আপনার বর্তমান অবস্থান এবং নির্বাচিত পদ্ধতির ভিত্তিতে নামাজের সময় এবং হিজরি তারিখ গণনা করা হয়। সঠিক সময়ের জন্য সেটিংস চেক করুন।', error: 'ক্যালেন্ডার ডাটা লোড করা সম্ভব হয়নি।' }
  }[language];

  const toBengaliDigits = (num: number | string): string => {
    const benDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().split('').map(digit => /\d/.test(digit) ? benDigits[parseInt(digit)] : digit).join('');
  };

  useEffect(() => {
    const fetchCalendar = async () => {
      if (!location) return;
      setLoading(true);
      try {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;

        const res = await fetch(
          `https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${location.lat}&longitude=${location.lng}&method=${prayerMethodId}`
        );
        const data = await res.json();
        
        if (data && data.data && Array.isArray(data.data)) {
          const days = data.data.map((day: any, index: number) => ({
            date: day.date.readable,
            hijri: `${day.date.hijri.day} ${day.date.hijri.month.en} ${day.date.hijri.year}`,
            fajr: day.timings.Fajr.split(' ')[0],
            maghrib: day.timings.Maghrib.split(' ')[0],
            day: index + 1
          }));
          setCalendar(days);
        } else {
          setCalendar([]);
        }
      } catch (err) {
        console.error("Failed to fetch calendar", err);
        setCalendar([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendar();
  }, [location, prayerMethodId]);

  return (
    <div className="space-y-6 pb-20">
      <header className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition"
        >
          <i className="fas fa-arrow-left"></i>
        </button>
        <div>
          <h2 className="text-2xl font-bold">{t.title}</h2>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{t.sub}</p>
        </div>
      </header>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="h-16 bg-white/5 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : calendar.length > 0 ? (
        <div className="glass rounded-3xl overflow-hidden border-white/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-[10px] uppercase font-bold text-slate-500 tracking-widest">
                  <th className="px-6 py-4">{t.day}</th>
                  <th className="px-6 py-4">{t.date}</th>
                  <th className="px-6 py-4">{t.fajr}</th>
                  <th className="px-6 py-4">{t.maghrib}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {calendar.map((day) => (
                  <tr key={day.day} className="hover:bg-[var(--brand-olive)]/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="w-7 h-7 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-xs font-bold text-[var(--brand-olive)] group-hover:bg-[var(--brand-olive)] group-hover:text-white transition">
                        {language === 'bn' ? toBengaliDigits(day.day) : day.day}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium">{day.date}</div>
                      <div className="text-[10px] text-slate-500 uppercase">{day.hijri}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-emerald-200">{language === 'bn' ? toBengaliDigits(day.fajr) : day.fajr}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-amber-200">{language === 'bn' ? toBengaliDigits(day.maghrib) : day.maghrib}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-slate-400 glass rounded-3xl border-white/5">
          {t.error}
        </div>
      )}

      <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-start gap-3">
        <i className="fas fa-moon text-emerald-500 mt-1"></i>
        <p className="text-xs text-slate-400 leading-relaxed">{t.note}</p>
      </div>
    </div>
  );
};

export default CalendarView;
