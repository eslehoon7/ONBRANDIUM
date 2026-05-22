import React from 'react';
import { SiteConfig } from '../types';

interface PartnersMarqueeProps {
  config: SiteConfig;
}

const PartnersMarquee: React.FC<PartnersMarqueeProps> = ({ config }) => {
  const partners = [
    { name: 'NEXUS LABS', desc: 'AI SYSTEM' },
    { name: 'AURA STUDIO', desc: 'FASHION & ART' },
    { name: 'VERTEX LABS', desc: 'WEB3 ARCH' },
    { name: 'VELOCITY OS', desc: 'SOFTWARE Engine' },
    { name: 'KINETIC CRAFT', desc: 'DEVICES' },
    { name: 'ATOMICA CO.', desc: 'AUTOMATION' },
    { name: 'NEOBRAND', desc: 'CO-CREATIVE' },
    { name: 'LOGIC & SENSE', desc: 'STRATEGY' },
  ];

  // Double the array to ensure seamless infinite looping
  const doubledPartners = [...partners, ...partners, ...partners];

  return (
    <div className="w-full bg-black py-10 border-b border-white/5 overflow-hidden flex items-center relative z-10">
      {/* Visual Accent Gradient Edge Mask */}
      <div className="absolute top-0 left-0 w-24 md:w-48 h-full bg-gradient-to-r from-black to-transparent z-20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-24 md:w-48 h-full bg-gradient-to-l from-black to-transparent z-20 pointer-events-none" />

      <div className="flex whitespace-nowrap animate-[marquee_40s_linear_infinite] hover:[animation-play-state:paused] cursor-pointer">
        {doubledPartners.map((pt, idx) => (
          <div 
            key={idx} 
            className="flex items-center gap-4 mx-8 md:mx-16 select-none group"
          >
            {/* Elegant minimalist dot indicator */}
            <span 
              className="w-1.5 h-1.5 rounded-full transition-transform duration-300 group-hover:scale-150" 
              style={{ backgroundColor: config.accentColor || '#00f0ff' }}
            />
            <div className="flex flex-col items-start">
              <span className="text-xl md:text-2xl font-black tracking-widest text-white/40 group-hover:text-white transition-colors duration-300 font-sans">
                {pt.name}
              </span>
              <span className="text-[8px] tracking-[0.2em] text-white/20 font-mono font-bold group-hover:text-white/40 transition-colors duration-300 uppercase">
                {pt.desc}
              </span>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};

export default PartnersMarquee;
