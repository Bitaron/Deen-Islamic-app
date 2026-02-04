
import React from 'react';
import { PrayerTimes, Language } from '../types';
import PrayerTimesCard from './PrayerTimesCard';
import CountdownCard from './CountdownCard';

interface DashboardProps {
  prayerTimes: PrayerTimes;
  onViewCalendar: () => void;
  language: Language;
  prayerMethodId: number;
}

const Dashboard: React.FC<DashboardProps> = ({ prayerTimes, onViewCalendar, language, prayerMethodId }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <CountdownCard prayerTimes={prayerTimes} language={language} />
      </div>
      <div className="lg:col-span-2">
        <PrayerTimesCard prayerTimes={prayerTimes} onViewCalendar={onViewCalendar} language={language} prayerMethodId={prayerMethodId} />
      </div>
    </div>
  );
};

export default Dashboard;
