
import { Language } from '../types';

export interface DailyQuote {
  text: { en: string; bn: string };
  source: { en: string; bn: string };
}

const QUOTES: DailyQuote[] = [
  {
    text: {
      en: "The most beloved of deeds to Allah are those that are most consistent, even if they are small.",
      bn: "আল্লাহর কাছে সবচেয়ে প্রিয় আমল হলো তা যা নিয়মিত করা হয়, যদিও তা অল্প হয়।"
    },
    source: { en: "Sahih Bukhari", bn: "সহীহ বুখারী" }
  },
  {
    text: {
      en: "Fasting is a shield; so when one of you is fasting, he should not use foul language or behave foolishly.",
      bn: "রোজা একটি ঢাল; তাই তোমাদের মধ্যে যখন কেউ রোজা রাখে, সে যেন অশ্লীল কথা না বলে বা মূর্খতা না করে।"
    },
    source: { en: "Sahih Muslim", bn: "সহীহ মুসলিম" }
  },
  {
    text: {
      en: "The best among you are those who have the best manners and character.",
      bn: "তোমাদের মধ্যে সর্বোত্তম ব্যক্তি সেই যার আচার-আচরণ ও চরিত্র সবচেয়ে ভালো।"
    },
    source: { en: "Sahih Bukhari", bn: "সহীহ বুখারী" }
  },
  {
    text: {
      en: "Wealth does not decrease by giving in charity.",
      bn: "দান করলে কখনো সম্পদ কমে না।"
    },
    source: { en: "Sahih Muslim", bn: "সহীহ মুসলিম" }
  },
  {
    text: {
      en: "A Muslim is the one from whose tongue and hands the Muslims are safe.",
      bn: "প্রকৃত মুসলিম সেই ব্যক্তি যার জবান ও হাত থেকে অন্য মুসলিমরা নিরাপদ থাকে।"
    },
    source: { en: "Sahih Bukhari", bn: "সহীহ বুখারী" }
  },
  {
    text: {
      en: "The best of you are those who learn the Quran and teach it.",
      bn: "তোমাদের মধ্যে সর্বোত্তম সে যে নিজে কুরআন শেখে এবং অন্যকে শেখায়।"
    },
    source: { en: "Sahih Bukhari", bn: "সহীহ বুখারী" }
  },
  {
    text: {
      en: "Take advantage of five matters before five others: your youth before your old age, your health before your sickness, your wealth before your poverty, your free time before your preoccupation, and your life before your death.",
      bn: "পাঁচটি জিনিসের পূর্বে পাঁচটি জিনিসের মূল্যায়ন করো: বার্ধক্যের পূর্বে যৌবনের, অসুস্থতার পূর্বে সুস্থতার, দারিদ্র্যের পূর্বে সচ্ছলতার, ব্যস্ততার পূর্বে অবসরের এবং মৃত্যুর পূর্বে জীবনের।"
    },
    source: { en: "Mustadrak Al-Hakim", bn: "মুস্তাদরাক আল-হাকিম" }
  }
];

export function getDailyQuote(): DailyQuote {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  
  return QUOTES[dayOfYear % QUOTES.length];
}
