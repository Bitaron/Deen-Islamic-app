
import React, { useState, useRef, useEffect } from 'react';
import { chatWithAI } from '../services/geminiService';
import { ChatMessage, Language } from '../types';

interface ChatInterfaceProps {
  language: Language;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ language }) => {
  const t = {
    en: {
      botName: 'Nur Assistant',
      status: 'Online • Spiritual Companion',
      initialMsg: 'Assalamu Alaikum! I am Nur, your personal Islamic AI. You can ask me about Quranic verses, Sahih Hadith, Fiqh guidance, Zakat calculations, or daily spiritual growth tips.',
      placeholder: 'Search for wisdom...',
      errorMsg: 'I am having trouble connecting right now. Please try again later.'
    },
    bn: {
      botName: 'নূর সহকারী',
      status: 'অনলাইন • আধ্যাত্মিক সঙ্গী',
      initialMsg: 'আসসালামু আলাইকুম! আমি নূর, আপনার ব্যক্তিগত ইসলামী এআই। আপনি আমাকে কুরআনের আয়াত, সহীহ হাদীস, ফিকাহ নির্দেশিকা, যাকাত গণনা বা দৈনন্দিন আধ্যাত্মিক বৃদ্ধির টিপস সম্পর্কে জিজ্ঞাসা করতে পারেন।',
      placeholder: 'জ্ঞানের সন্ধান করুন...',
      errorMsg: 'আমার সংযোগ করতে সমস্যা হচ্ছে। দয়া করে পরে আবার চেষ্টা করুন।'
    }
  }[language];

  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: t.initialMsg, timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      const response = await chatWithAI(input, history);
      const botMsg: ChatMessage = { role: 'model', text: response, timestamp: new Date() };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: t.errorMsg, 
        timestamp: new Date() 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="glass rounded-3xl overflow-hidden border-white/5 flex flex-col h-[500px]">
      <div className="bg-[#1a1c0d]/60 p-5 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-[#708238] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#708238]/20">
              <i className="fas fa-leaf"></i>
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#a4b465] border-2 border-slate-900 rounded-full"></div>
          </div>
          <div>
            <h3 className="font-bold text-sm">{t.botName}</h3>
            <span className="text-[10px] text-[#a4b465] font-bold uppercase tracking-wider">{t.status}</span>
          </div>
        </div>
        <button className="text-slate-400 hover:text-white transition">
          <i className="fas fa-ellipsis-h"></i>
        </button>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide"
      >
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 text-sm chat-text ${
              msg.role === 'user' 
                ? 'bg-[#708238] text-white rounded-tr-none shadow-lg shadow-[#708238]/20' 
                : 'bg-white/5 text-slate-200 border border-white/5 rounded-tl-none'
            }`}>
              {msg.text}
              <div className={`text-[10px] mt-2 opacity-50 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-none p-4 flex space-x-1">
              <div className="w-1.5 h-1.5 bg-[#708238] rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-[#708238] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1.5 h-1.5 bg-[#708238] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-black/20 border-t border-white/5">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t.placeholder}
            className="w-full bg-slate-800/50 border border-white/10 rounded-2xl py-4 pl-5 pr-14 text-sm focus:outline-none focus:border-[#708238] transition"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className={`absolute right-2 w-10 h-10 flex items-center justify-center rounded-xl transition-all ${
              input.trim() && !isTyping ? 'bg-[#708238] text-white shadow-lg shadow-[#708238]/20' : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
