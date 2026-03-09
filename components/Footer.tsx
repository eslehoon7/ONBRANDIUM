
import React from 'react';
import { SiteConfig, ViewMode } from '../types';

interface FooterProps {
  config: SiteConfig;
  viewMode: ViewMode;
  onToggleViewMode: () => void;
}

const Footer: React.FC<FooterProps> = ({ config, viewMode, onToggleViewMode }) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-black py-20 px-6 border-t border-white/10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
            className="text-3xl font-black tracking-tighter mb-8 block bg-transparent border-none cursor-pointer text-white text-left flex items-center space-x-2"
          >
            {config.logoUrl ? (
              <>
                <img src={config.logoUrl} alt={config.companyName} className="h-10 object-contain" referrerPolicy="no-referrer" />
                <span>{config.companyName}</span>
              </>
            ) : (
              config.companyName
            )}
          </button>
          <p className="text-white/40 max-w-sm mb-8 leading-relaxed text-sm">
            온브랜디움은 브랜드의 철학을 시각화하고,<br/>
            비즈니스의 성공을 위한 디지털 솔루션을 제공하는<br/>
            글로벌 웹 디자인 에이전시 입니다.
          </p>
          <div className="flex space-x-6">
            <a href={config.instagramUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all">
              <span className="text-xs font-bold italic">IG</span>
            </a>
            <a href={config.kakaoUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all">
              <span className="text-xs font-bold italic">KK</span>
            </a>
          </div>
        </div>
        
        <div>
          <h4 className="text-xs font-bold tracking-widest uppercase mb-6 opacity-40">Quick Links</h4>
          <ul className="space-y-4 font-medium flex flex-col items-start">
            <li><button onClick={() => scrollToSection('portfolio')} className="hover:text-cyan-400 transition-colors bg-transparent border-none cursor-pointer text-white text-sm">PORTFOLIO</button></li>
            <li><button onClick={() => scrollToSection('about')} className="hover:text-cyan-400 transition-colors bg-transparent border-none cursor-pointer text-white text-sm">ABOUT</button></li>
            <li><button onClick={() => scrollToSection('contact')} className="hover:text-cyan-400 transition-colors bg-transparent border-none cursor-pointer text-white text-sm">CONTACT</button></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-xs font-bold tracking-widest uppercase mb-6 opacity-40">Inquiries</h4>
          <p className="text-xl font-bold mb-4 break-all">{config.contactEmail}</p>
          <p className="text-white/40 text-sm leading-relaxed mb-4">
            경기도 평택시 중앙로 121<br/>
            2층 5호 주식회사 시나노애플
          </p>
          <button 
            onClick={onToggleViewMode}
            className="text-white/40 text-sm leading-relaxed hover:text-white transition-colors text-left"
          >
            {viewMode === 'admin' ? '사이트 보기' : '관리자 모드'}
          </button>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-white/20 text-xs">© 2024 {config.companyName}. All rights reserved.</p>
        <p className="text-white/20 text-xs uppercase tracking-widest">Crafted with precision by Onbrandium</p>
      </div>
    </footer>
  );
};

export default Footer;
