
export interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
}

export interface RamadanDay {
  date: string;
  hijri: string;
  day: number;
  timings: PrayerTimes;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface UserLocation {
  lat: number;
  lng: number;
  city?: string;
}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  audio?: string;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean;
}

export interface SurahDetail {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  ayahs: Ayah[];
  translationEn: Ayah[];
  translationBn: Ayah[];
}

export interface DailyProgress {
  date: string;
  fasting: boolean;
  prayers: {
    fajr: boolean;
    dhuhr: boolean;
    asr: boolean;
    maghrib: boolean;
    isha: boolean;
  };
  quranPages: number;
}

export type AppView = 'home' | 'quran' | 'dua' | 'chat' | 'progress' | 'calendar' | 'settings' | 'privacy';
export type Language = 'en' | 'bn';

export interface PrayerMethod {
  id: number;
  name: string;
}
