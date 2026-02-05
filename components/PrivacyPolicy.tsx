
import React from 'react';
import { Language } from '../types';

interface PrivacyPolicyProps {
  language: Language;
  onBack: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ language, onBack }) => {
  const content = {
    en: {
      title: 'Privacy Policy',
      lastUpdated: 'Last Updated: Ramadan 2026 Ready',
      intro: 'Nur AI is committed to protecting your spiritual and digital privacy. This policy explains how we handle your data.',
      sections: [
        {
          h: '1. Data Collection',
          p: 'Nur AI is designed with a "Local First" approach. Your prayer progress, location preferences, and theme settings are stored locally on your device using browser LocalStorage. We do not maintain a central database of your personal identity.'
        },
        {
          h: '2. Artificial Intelligence',
          p: 'When you chat with Nur AI, your messages are processed by Google Gemini API. These interactions are subject to Google\'s privacy terms. We do not use your chat history for advertising or external profiling.'
        },
        {
          h: '3. Location Services',
          p: 'We request location access solely to calculate accurate prayer times. Your coordinates are used locally or sent to open-source geocoding APIs (like Nominatim) to display your city name. We do not track or store your movement history.'
        },
        {
          h: '4. Third-Party Services',
          p: 'We use Aladhan API for prayer times and Alquran.cloud for Quranic text. No personally identifiable information is shared with these services.'
        }
      ],
      back: 'Back to Settings'
    },
    bn: {
      title: 'গোপনীয়তা নীতি',
      lastUpdated: 'সর্বশেষ আপডেট: রমজান ২০২৬',
      intro: 'নূর এআই আপনার আধ্যাত্মিক এবং ডিজিটাল গোপনীয়তা রক্ষায় প্রতিশ্রুতিবদ্ধ। এই নীতিটি ব্যাখ্যা করে আমরা কীভাবে আপনার ডেটা পরিচালনা করি।',
      sections: [
        {
          h: '১. তথ্য সংগ্রহ',
          p: 'নূর এআই "লোকাল ফার্স্ট" পদ্ধতিতে ডিজাইন করা হয়েছে। আপনার নামাজের অগ্রগতি, অবস্থানের পছন্দ এবং থিম সেটিংস আপনার ডিভাইসে ব্রাউজার লোকালস্টোরেজ ব্যবহার করে সংরক্ষিত হয়। আমরা আপনার ব্যক্তিগত পরিচয়ের কোনো কেন্দ্রীয় ডাটাবেস রাখি না।'
        },
        {
          h: '২. কৃত্রিম বুদ্ধিমত্তা',
          p: 'যখন আপনি নূর এআই-এর সাথে চ্যাট করেন, আপনার বার্তাগুলো গুগল জেমিনি এপিআই দ্বারা প্রসেস করা হয়। এই মিথস্ক্রিয়াগুলো গুগলের গোপনীয়তা শর্তাবলীর অধীন। আমরা বিজ্ঞাপনের জন্য আপনার চ্যাট হিস্ট্রি ব্যবহার করি না।'
        },
        {
          h: '৩. অবস্থান পরিষেবা',
          p: 'আমরা শুধুমাত্র সঠিক নামাজের সময় গণনার জন্য লোকেশন অ্যাক্সেস চাই। আপনার স্থানাঙ্কগুলো স্থানীয়ভাবে ব্যবহার করা হয় বা আপনার শহরের নাম দেখানোর জন্য ওপেন-সোর্স জিওকোডিং এপিআই-তে পাঠানো হয়। আমরা আপনার চলাফেরার ইতিহাস ট্র্যাক করি না।'
        },
        {
          h: '৪. থার্ড-পার্টি সার্ভিস',
          p: 'আমরা নামাজের সময়ের জন্য Aladhan API এবং কুরআনের টেক্সটের জন্য Alquran.cloud ব্যবহার করি। এই পরিষেবাগুলোর সাথে ব্যক্তিগতভাবে শনাক্তযোগ্য কোনো তথ্য শেয়ার করা হয় না।'
        }
      ],
      back: 'সেটিংসে ফিরে যান'
    }
  }[language];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 pb-20 max-w-2xl mx-auto">
      <header className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition group"
        >
          <i className="fas fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
        </button>
        <div>
          <h2 className="text-2xl font-bold">{content.title}</h2>
          <p className="text-[10px] text-[var(--brand-olive)] font-bold uppercase tracking-widest">{content.lastUpdated}</p>
        </div>
      </header>

      <div className="glass p-6 md:p-10 rounded-[2.5rem] border-white/5 space-y-8 leading-relaxed text-slate-300 shadow-2xl">
        <p className="font-medium text-[var(--brand-olive)] bg-[var(--brand-olive)]/5 p-4 rounded-2xl border border-[var(--brand-olive)]/10">
          {content.intro}
        </p>
        
        <div className="space-y-8">
          {content.sections.map((s, i) => (
            <section key={i} className="space-y-3">
              <h3 className="text-white font-bold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-olive)]"></span>
                {s.h}
              </h3>
              <p className="text-sm opacity-80 pl-3.5 border-l border-white/10">{s.p}</p>
            </section>
          ))}
        </div>

        <div className="pt-8 border-t border-white/5 text-[10px] text-slate-500 text-center uppercase tracking-[0.3em] font-black">
          © 2026 Nur AI Ecosystem • Developed for the Ummah
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
