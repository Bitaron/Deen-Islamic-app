
import { PrayerTimes, UserLocation } from '../types';

/**
 * Fetches prayer times from Aladhan API (Free)
 * Ramadan 2026 is expected to start approx Feb 18, 2026.
 */
export async function getPrayerTimes(location: UserLocation, method: number = 2, date: Date = new Date()): Promise<PrayerTimes> {
  const { lat, lng } = location;
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const response = await fetch(
    `https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${lat}&longitude=${lng}&method=${method}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch prayer times');
  }

  const data = await response.json();
  return data.data.timings;
}

export async function getLocationName(lat: number, lng: number): Promise<string> {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
    const data = await response.json();
    return data.address.city || data.address.town || data.address.village || 'Your Location';
  } catch {
    return 'Your Location';
  }
}

// Ramadan 2026 Specific Helper
export const RAMADAN_START_2026 = new Date('2026-02-18');
export const RAMADAN_END_2026 = new Date('2026-03-20');

export function isRamadan(date: Date): boolean {
  return date >= RAMADAN_START_2026 && date <= RAMADAN_END_2026;
}
