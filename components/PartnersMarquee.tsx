import React from 'react';
import { SiteConfig } from '../types';

interface PartnersMarqueeProps {
  config: SiteConfig;
}

const BrandLogos = [
  // 1. NEXUS LABS
  () => (
    <div className="flex flex-col items-start select-none text-white/30 hover:text-white/85 transition-colors duration-500 font-sans leading-none">
      <span className="text-2xl font-black tracking-widest uppercase">NEXUS</span>
      <span className="text-[9px] font-bold tracking-[0.3em] text-white/20 uppercase mt-1">RESEARCH LABS</span>
    </div>
  ),
  // 2. AURA STUDIO
  () => (
    <div className="flex items-center gap-2 select-none text-white/30 hover:text-white/85 transition-colors duration-500">
      <div className="w-5 h-5 rounded-full border-2 border-current border-t-transparent animate-[spin_6s_linear_infinite]" />
      <span className="text-xl font-bold tracking-[0.15em] uppercase font-sans">AURA STUDIO</span>
    </div>
  ),
  // 3. CODECRAFT
  () => (
    <div className="flex items-center gap-2 select-none text-white/30 hover:text-white/85 transition-colors duration-500 font-mono">
      <span className="text-xl font-bold tracking-tight">&lt;CODECRAFT&gt;</span>
    </div>
  ),
  // 4. ATTIC CREATIVE
  () => (
    <div className="flex flex-col items-center select-none text-white/30 hover:text-white/85 transition-colors duration-500 leading-none">
      <span className="text-base font-black tracking-[0.25em] uppercase">ATTIC</span>
      <div className="w-8 h-[1px] bg-current my-0.5" />
      <span className="text-[8px] font-bold tracking-[0.15em] text-white/25 uppercase">CREATIVE APART</span>
    </div>
  ),
  // 5. SPROUT TECH
  () => (
    <div className="flex items-center gap-2 select-none text-white/30 hover:text-white/85 transition-colors duration-500 font-sans">
      <svg className="h-6 w-auto text-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22V12M12 12c-2-2.5-5-2-5-2s.5 4.5 5 5c4.5-0.5 5-5 5-5s-3-0.5-5 2" />
      </svg>
      <span className="text-xl font-extrabold tracking-tight">sprout.</span>
    </div>
  ),
  // 6. SLOW MONO
  () => (
    <div className="flex items-center select-none text-white/30 hover:text-white/85 transition-colors duration-500 border border-white/20 px-3 py-1 font-sans text-xs tracking-[0.3em] uppercase">
      SLOW MONO
    </div>
  ),
  // 7. PLAN B DESIGN
  () => (
    <div className="flex items-center gap-1.5 select-none text-white/30 hover:text-white/85 transition-colors duration-500 font-sans">
      <span className="text-2xl font-black tracking-tighter">PLAN_B</span>
      <span className="text-[10px] font-medium tracking-[0.1em] text-white/25 uppercase align-bottom border-l border-white/20 pl-1.5">WORKS</span>
    </div>
  ),
  // 8. 서울시립대학교 (UNIVERSITY OF SEOUL)
  () => (
    <div className="flex items-center gap-3.5 select-none text-white/50 hover:text-white/95 transition-all duration-500 transform hover:scale-105">
      <svg className="h-[28px] w-auto text-current" viewBox="0 0 54 30" fill="none">
        {/* Outline rounded rectangle with exact border thickness and corner radius */}
        <rect x="0.75" y="0.75" width="52.5" height="28.5" rx="4.5" stroke="currentColor" strokeWidth="1.5" />
        
        {/* Inner vertical stripes divided by magnificent S-curve transition wave */}
        {Array.from({ length: 18 }, (_, i) => {
          const x = 3.6 + i * 2.62;
          const t = i / 17;
          // Fluid transition curve matching the split diagonal slope in image
          const ease = 1 - (t * t * (3 - 2 * t));
          const ySplit = 5.0 + ease * 20.0;
          
          const gap = 2.2; // Space between top and bottom bar
          const topStart = 2.2;
          const topEnd = ySplit - gap / 2;
          const bottomStart = ySplit + gap / 2;
          const bottomEnd = 27.8;
          
          return (
            <g key={i}>
              {topEnd > topStart && (
                <rect x={x} y={topStart} width={1.2} height={topEnd - topStart} fill="currentColor" />
              )}
              {bottomEnd > bottomStart && (
                <rect x={x} y={bottomStart} width={1.2} height={bottomEnd - bottomStart} fill="currentColor" />
              )}
            </g>
          );
        })}
      </svg>
      <div className="flex flex-col items-start leading-none gap-0.5">
        <span 
          className="text-[19px] tracking-tight text-white font-extrabold"
          style={{
            fontFamily: '"Apple SD Gothic Neo", "Malgun Gothic", "맑은 고딕", "Noto Sans KR", sans-serif',
            letterSpacing: '-0.04em',
            fontWeight: 850
          }}
        >
          서울시립대학교
        </span>
        <span 
          className="text-[9.2px] font-bold tracking-[0.11em] text-white/45 uppercase"
          style={{
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}
        >
          UNIVERSITY OF SEOUL
        </span>
      </div>
    </div>
  ),
  // 9. COWORK CO.
  () => (
    <div className="flex items-center gap-2 select-none text-white/30 hover:text-white/85 transition-colors duration-500 font-sans">
      <svg className="h-5 w-auto" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="4">
        <circle cx="20" cy="20" r="16" />
        <circle cx="20" cy="20" r="8" />
      </svg>
      <span className="text-lg font-black tracking-widest uppercase">COWORK</span>
    </div>
  ),
  // 10. MINDLOOP
  () => (
    <div className="flex flex-col items-start select-none text-white/30 hover:text-white/85 transition-colors duration-500 leading-none">
      <span className="text-xl font-bold tracking-widest uppercase font-mono">MINDLOOP</span>
      <span className="text-[8px] tracking-[0.2em] text-white/20 uppercase mt-0.5 font-sans">SYSTEMS INC.</span>
    </div>
  ),
  // 11. LINE & SPACE
  () => (
    <div className="flex items-center gap-2.5 select-none text-white/30 hover:text-white/85 transition-colors duration-500 font-sans">
      <span className="text-lg font-light tracking-[0.25em] uppercase">LINE</span>
      <span className="text-white/10 font-thin text-xl">|</span>
      <span className="text-lg font-extrabold tracking-[0.1em] uppercase">SPACE</span>
    </div>
  ),
  // 12. AORA TECH
  () => (
    <div className="flex items-center gap-1.5 select-none text-white/30 hover:text-white/85 transition-colors duration-500 font-sans">
      <div className="w-3.5 h-3.5 bg-current rounded-sm rotate-45" />
      <span className="text-xl font-black tracking-tight uppercase">AORA</span>
    </div>
  )
];

const PartnersMarquee: React.FC<PartnersMarqueeProps> = ({ config }) => {
  // Triple the list to ensure there are absolutely no gaps during seamless loops
  const tripledLogos = [...BrandLogos, ...BrandLogos, ...BrandLogos];

  return (
    <div className="w-full bg-black py-10 border-b border-white/5 overflow-hidden flex items-center relative z-10">
      {/* Visual Accent Gradient Edge Mask */}
      <div className="absolute top-0 left-0 w-24 md:w-48 h-full bg-gradient-to-r from-black to-transparent z-20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-24 md:w-48 h-full bg-gradient-to-l from-black to-transparent z-20 pointer-events-none" />

      {/* Track moving slowly (50s duration) */}
      <div className="flex whitespace-nowrap animate-[marquee_50s_linear_infinite] hover:[animation-play-state:paused] cursor-pointer">
        {tripledLogos.map((Logo, idx) => (
          <div 
            key={idx} 
            className="flex items-center justify-center mx-10 md:mx-16"
          >
            <Logo />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-33.3333%);
          }
        }
      `}</style>
    </div>
  );
};

export default PartnersMarquee;
