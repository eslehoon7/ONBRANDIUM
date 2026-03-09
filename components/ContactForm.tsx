
import React from 'react';
import { SiteConfig } from '../types';

interface ContactFormProps {
  config: SiteConfig;
}

const ContactForm: React.FC<ContactFormProps> = ({ config }) => {
  return (
    <div className="w-full max-w-2xl mx-auto bg-neutral-900/30 p-8 md:p-12 rounded-3xl border border-white/5 backdrop-blur-sm">
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-widest text-white/40 block ml-1">성명</label>
            <input 
              type="text" 
              placeholder="홍길동"
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-white/20 focus:border-cyan-400 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-widest text-white/40 block ml-1">연락처</label>
            <input 
              type="tel" 
              placeholder="010-0000-0000"
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-white/20 focus:border-cyan-400 outline-none transition-all"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-[10px] uppercase font-bold tracking-widest text-white/40 block ml-1">이메일</label>
          <input 
            type="email" 
            placeholder="example@onbrandium.com"
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-white/20 focus:border-cyan-400 outline-none transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase font-bold tracking-widest text-white/40 block ml-1">프로젝트 내용</label>
          <textarea 
            rows={5}
            placeholder="제작하시려는 웹사이트의 목적과 상세 내용을 입력해주세요."
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-white/20 focus:border-cyan-400 outline-none transition-all resize-none"
          ></textarea>
        </div>

        <button 
          type="submit"
          className="w-full py-5 rounded-xl font-black text-lg transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
          style={{ backgroundColor: config.accentColor, color: '#000' }}
        >
          문의 보내기
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
