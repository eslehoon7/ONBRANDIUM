
import React from 'react';
import { SiteConfig } from '../types';

interface HeroProps {
  config: SiteConfig;
}

const Hero: React.FC<HeroProps> = ({ config }) => {
  const nodes = [
    { label: 'STRATEGY', x: '15%', y: '20%', size: 'w-16 h-16', delay: '0s' },
    { label: 'IDENTITY', x: '80%', y: '15%', size: 'w-20 h-20', delay: '1s' },
    { label: 'VALUE', x: '10%', y: '70%', size: 'w-24 h-24', delay: '2s' },
    { label: 'DESIGN', x: '85%', y: '75%', size: 'w-28 h-28', delay: '1.5s' },
    { label: 'UX / UI', x: '75%', y: '45%', size: 'w-14 h-14', delay: '0.5s' },
    { label: 'MARKETING', x: '25%', y: '50%', size: 'w-12 h-12', delay: '2.5s' },
  ];

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
    <section className="relative h-screen flex items-center justify-center overflow-hidden px-6">
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: `radial-gradient(${config.accentColor} 1px, transparent 1px)`, 
            backgroundSize: '80px 80px' 
          }}
        ></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-10 filter blur-[120px] rounded-full" 
             style={{ backgroundColor: config.accentColor }}></div>
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={config.accentColor} stopOpacity="0" />
              <stop offset="50%" stopColor={config.accentColor} stopOpacity="0.5" />
              {/* Fixed syntax error in stopOpacity: replaced "0} with "0" */}
              <stop offset="100%" stopColor={config.accentColor} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M 15% 20% L 50% 50% L 80% 15%" fill="none" stroke="url(#lineGrad)" strokeWidth="0.5" strokeDasharray="5,5" className="animate-[pulse_4s_infinite]" />
          <path d="M 10% 70% L 50% 50% L 85% 75%" fill="none" stroke="url(#lineGrad)" strokeWidth="0.5" strokeDasharray="5,5" className="animate-[pulse_5s_infinite]" />
          <path d="M 25% 50% L 50% 50% L 75% 45%" fill="none" stroke="url(#lineGrad)" strokeWidth="0.5" strokeDasharray="5,5" className="animate-[pulse_6s_infinite]" />
        </svg>

        {nodes.map((node, i) => (
          <div key={i} className={`absolute flex flex-col items-center justify-center animate-[float_8s_infinite_ease-in-out] opacity-30 hover:opacity-60 transition-opacity duration-700`} style={{ left: node.x, top: node.y, animationDelay: node.delay }}>
            <div className={`${node.size} rounded-full border border-dashed flex items-center justify-center p-2 mb-2 group`} style={{ borderColor: `${config.accentColor}40` }}>
              <div className="w-1/2 h-1/2 rounded-full blur-md group-hover:blur-sm transition-all" style={{ backgroundColor: `${config.accentColor}20` }}></div>
            </div>
            <span className="text-[10px] font-black tracking-[0.2em] text-white/40">{node.label}</span>
          </div>
        ))}
      </div>

      <div className="relative z-10 text-center max-w-5xl">
        <div className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[9px] font-bold tracking-[0.3em] uppercase mb-10 transition-all hover:border-cyan-400/30 opacity-0 animate-[slideDown_0.8s_ease-out_forwards]" style={{ color: config.accentColor }}>
          The Strategic Digital Artistry
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.2] tracking-normal mb-10 opacity-0 animate-[slideDown_0.8s_ease-out_0.2s_forwards] break-keep">
          {config.heroMainText.split(' ').map((word, i) => {
            // "브랜드", "움직일", "차례" 키워드가 포함된 단어에 밑줄 적용
            const cleanWord = word.replace(/[,,.]/g, '');
            const shouldUnderline = cleanWord.includes('브랜드') || cleanWord.includes('움직일') || cleanWord.includes('차례');
            
            return (
              <span key={i} className="inline-block mr-4 last:mr-0">
                {shouldUnderline ? (
                  <span className="relative inline-block">
                    <span className="relative z-10">{word}</span>
                    <span className="absolute bottom-1 left-0 w-full h-3 opacity-30 -rotate-1 skew-x-12" style={{ backgroundColor: config.accentColor }}></span>
                  </span>
                ) : word}
              </span>
            );
          })}
        </h1>

        <p className="text-base md:text-lg text-white/40 mb-12 max-w-xl mx-auto leading-relaxed font-light tracking-tight opacity-0 animate-[slideDown_0.8s_ease-out_0.4s_forwards] break-keep">
          {config.heroSubText}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 opacity-0 animate-[fadeIn_1s_ease-out_0.8s_forwards]">
          <button 
            onClick={() => scrollToSection('portfolio')}
            className="group relative px-8 sm:px-10 py-4 rounded-xl font-bold text-sm shadow-2xl transition-all hover:-translate-y-1 active:scale-95 overflow-hidden w-full sm:w-auto"
            style={{ backgroundColor: config.accentColor, color: '#000' }}
          >
            <span className="relative z-10 uppercase tracking-widest">Selected Projects</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
          </button>
          <button 
            onClick={() => scrollToSection('contact')}
            className="px-8 sm:px-10 py-4 rounded-xl font-bold text-sm border border-white/10 hover:bg-white/5 hover:border-white/20 transition-all text-center flex items-center justify-center bg-transparent text-white w-full sm:w-auto"
          >
            Get Consulted
          </button>
        </div>
      </div>
      
      <button 
        onClick={() => scrollToSection('portfolio')}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 group cursor-pointer bg-transparent border-none focus:outline-none transition-all duration-300 hover:scale-105 z-20"
      >
        <span className="text-[9px] font-bold tracking-[0.4em] uppercase text-white/40 group-hover:text-white group-hover:translate-y-0.5 transition-all duration-300">
          SCROLL TO EXPLORE
        </span>
        <div className="w-[22px] h-[36px] rounded-full border-1.5 border-white/20 flex justify-center p-1 group-hover:border-white/50 transition-colors duration-300">
          <div className="w-1 h-2 rounded-full bg-white/70 animate-[scrollWheel_1.6s_infinite_ease-in-out]"></div>
        </div>
      </button>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-30px) translateX(10px); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scrollWheel {
          0% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(8px); opacity: 0.1; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </section>
  );
};

export default Hero;
