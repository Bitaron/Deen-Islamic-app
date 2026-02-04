
import React, { useState, useEffect } from 'react';
import { Language, PrayerMethod } from '../types';

interface SettingsViewProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  prayerMethod: number;
  setPrayerMethod: (method: number) => void;
  onViewPrivacy: () => void;
}

const PRAYER_METHODS: PrayerMethod[] = [
  { id: 1, name: "University of Islamic Sciences, Karachi" },
  { id: 2, name: "Islamic Society of North America (ISNA)" },
  { id: 3, name: "Muslim World League" },
  { id: 4, name: "Umm Al-Qura University, Makkah" },
  { id: 5, name: "Egyptian General Authority of Survey" },
  { id: 8, name: "Gulf Region" },
  { id: 9, name: "Kuwait" },
  { id: 10, name: "Qatar" },
  { id: 11, name: "Majlis Ugama Islam Singapura, Singapore" },
  { id: 12, name: "Union Organization islamic de France" },
  { id: 13, name: "Diyanet İşleri Başkanlığı, Turkey" },
  { id: 14, name: "Spiritual Administration of Muslims of Russia" },
];

const SettingsView: React.FC<SettingsViewProps> = ({ language, setLanguage, prayerMethod, setPrayerMethod, onViewPrivacy }) => {
  const [hasKey, setHasKey] = useState<boolean>(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  const t = {
    en: {
      title: 'Settings & Privacy',
      subTitle: 'Configure your professional AI connection and app preferences.',
      langTitle: 'App Language',
      langSub: 'Select your preferred language for the interface.',
      enLabel: 'English',
      bnLabel: 'Bengali',
      methodTitle: 'Prayer Schedule Method',
      methodSub: 'Choose your local calculation standard.',
      hostingTitle: 'No Server? No Problem!',
      hostingSub: 'Free Professional Hosting',
      deploymentTitle: 'Deployment Status',
      aiTitle: 'Vertex AI Secure Link',
      aiSub: 'Enterprise API Logic',
      linkKey: 'Link Professional Key',
      updateKey: 'Update Store Credentials',
      install: 'Install to Home Screen',
      package: 'Package ID',
      version: 'App Version',
      privacy: 'Privacy Policy & Terms'
    },
    bn: {
      title: 'সেটিংস ও গোপনীয়তা',
      subTitle: 'আপনার এআই সংযোগ এবং অ্যাপের পছন্দগুলি কনফিগার করুন।',
      langTitle: 'অ্যাপের ভাষা',
      langSub: 'ইন্টারফেসের জন্য আপনার পছন্দের ভাষা নির্বাচন করুন।',
      enLabel: 'ইংরেজি',
      bnLabel: 'বাংলা',
      methodTitle: 'নামাজের সময়সূচী পদ্ধতি',
      methodSub: 'আপনার স্থানীয় গণনার মান নির্বাচন করুন।',
      hostingTitle: 'সার্ভার নেই? কোন সমস্যা নেই!',
      hostingSub: 'ফ্রি প্রফেশনাল হোস্টিং',
      deploymentTitle: 'ডিপ্লয়মেন্ট স্ট্যাটাস',
      aiTitle: 'ভার্টেক্স এআই সিকিউর লিঙ্ক',
      aiSub: 'এন্টারপ্রাইজ এপিআই লজিক',
      linkKey: 'প্রফেশনাল কী লিঙ্ক করুন',
      updateKey: 'স্টোর ক্রেডেনশিয়াল আপডেট করুন',
      install: 'হোম স্ক্রিনে ইনস্টল করুন',
      package: 'প্যাকেজ আইডি',
      version: 'অ্যাপ ভার্সন',
      privacy: 'গোপনীয়তা নীতি ও শর্তাবলী'
    }
  }[language];

  useEffect(() => {
    const checkKey = async () => {
      // @ts-ignore
      if (window.aistudio && window.aistudio.hasSelectedApiKey) {
        // @ts-ignore
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
      }
    };
    
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    checkKey();
    
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleSelectKey = async () => {
    // @ts-ignore
    if (window.aistudio && window.aistudio.openSelectKey) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      setHasKey(true);
    }
  };

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') setInstallPrompt(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 pb-20">
      <header>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <i className="fas fa-cog text-slate-400"></i>
          {t.title}
        </h2>
        <p className="text-sm text-slate-400 mt-1">{t.subTitle}</p>
      </header>

      {/* Language Selection Section */}
      <section className="glass rounded-3xl p-6 border-[var(--brand-olive)]/20 bg-gradient-to-br from-[var(--brand-olive)]/10 to-transparent">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[var(--brand-olive)] flex items-center justify-center text-white shadow-lg shadow-[var(--brand-olive)]/20">
            <i className="fas fa-language"></i>
          </div>
          <div>
            <h3 className="font-bold">{t.langTitle}</h3>
            <p className="text-[10px] text-[var(--brand-olive)] font-bold uppercase tracking-widest">{t.langSub}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => setLanguage('en')}
            className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${
              language === 'en' 
                ? 'bg-[var(--brand-olive)] text-white border-[var(--brand-olive)] shadow-lg shadow-[var(--brand-olive)]/20' 
                : 'bg-white/5 text-slate-400 border-white/5 hover:border-white/20'
            }`}
          >
            <span className="text-xl font-bold">EN</span>
            <span className="text-xs font-medium">{t.enLabel}</span>
          </button>
          <button 
            onClick={() => setLanguage('bn')}
            className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${
              language === 'bn' 
                ? 'bg-[var(--brand-olive)] text-white border-[var(--brand-olive)] shadow-lg shadow-[var(--brand-olive)]/20' 
                : 'bg-white/5 text-slate-400 border-white/5 hover:border-white/20'
            }`}
          >
            <span className="text-xl font-bold">BN</span>
            <span className="text-xs font-medium">{t.bnLabel}</span>
          </button>
        </div>
      </section>

      {/* Prayer Method Section */}
      <section className="glass rounded-3xl p-6 border-[var(--brand-olive)]/20 bg-gradient-to-br from-[var(--brand-olive)]/10 to-transparent">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[var(--brand-olive)] flex items-center justify-center text-white shadow-lg shadow-[var(--brand-olive)]/20">
            <i className="fas fa-calculator"></i>
          </div>
          <div>
            <h3 className="font-bold">{t.methodTitle}</h3>
            <p className="text-[10px] text-[var(--brand-olive)] font-bold uppercase tracking-widest">{t.methodSub}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          {PRAYER_METHODS.map((method) => (
            <button 
              key={method.id}
              onClick={() => setPrayerMethod(method.id)}
              className={`w-full p-4 rounded-xl border text-left transition-all ${
                prayerMethod === method.id 
                  ? 'bg-[var(--brand-olive)]/20 border-[var(--brand-olive)] text-[var(--brand-olive)] font-bold' 
                  : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/10'
              }`}
            >
              <div className="text-sm">{method.name}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Professional AI Access */}
      <section className="glass rounded-3xl p-6 border-white/5 bg-gradient-to-br from-emerald-950/20 to-transparent">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <i className="fas fa-shield-alt"></i>
            </div>
            <div>
              <h3 className="font-bold">{t.aiTitle}</h3>
              <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">{t.aiSub}</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${hasKey ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
            {hasKey ? 'Connected' : 'Standard'}
          </div>
        </div>

        <button 
          onClick={handleSelectKey}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-500/10 mb-4"
        >
          <i className="fas fa-key"></i>
          {hasKey ? t.updateKey : t.linkKey}
        </button>
      </section>

      {/* Privacy & Legal */}
      <section className="space-y-3">
        <button 
          onClick={onViewPrivacy}
          className="w-full p-5 glass rounded-3xl border border-white/5 flex items-center justify-between hover:bg-white/5 transition"
        >
          <div className="flex items-center gap-3">
            <i className="fas fa-file-contract text-slate-500"></i>
            <span className="font-bold text-sm">{t.privacy}</span>
          </div>
          <i className="fas fa-chevron-right text-xs opacity-30"></i>
        </button>

        {installPrompt && (
          <button 
            onClick={handleInstall}
            className="w-full p-4 bg-white text-black font-bold rounded-2xl flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <i className="fas fa-download"></i>
              <span>{t.install}</span>
            </div>
            <i className="fas fa-arrow-right text-xs transition group-hover:translate-x-1"></i>
          </button>
        )}
        
        <div className="glass rounded-3xl p-4 border-white/5 space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">{t.package}</span>
            <span className="font-mono text-[10px] text-emerald-400">com.nur.deenai</span>
          </div>
        </div>
      </section>

      <div className="text-center pt-4 opacity-30">
        <div className="text-[10px] font-black uppercase tracking-[0.4em] mb-1">NUR ECOSYSTEM</div>
        <div className="text-[8px] uppercase tracking-widest">Built for the Global Ummah</div>
      </div>
    </div>
  );
};

export default SettingsView;
