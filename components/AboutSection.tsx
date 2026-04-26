import React, { useEffect, useRef, useState } from 'react';
import { SiteConfig } from '../types';

interface AboutSectionProps {
  config: SiteConfig;
}

const AboutSection: React.FC<AboutSectionProps> = ({ config }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const features = [
    { title: '브랜드 전략 수립', desc: '타겟 분석과 시장 조사를 통한 최적의 디지털 전략 수립' },
    { title: '프리미엄 UI/UX', desc: '사용자 중심의 설계와 미학적 완성도가 결합된 디자인' },
    { title: '고성능 개발', desc: '최신 기술 스택을 활용한 빠르고 안정적인 시스템 구축' }
  ];

  return (
    <section id="about" ref={sectionRef} className="py-24 px-6 md:px-12 bg-black border-y border-white/5 scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className={`text-4xl md:text-5xl font-bold mb-8 leading-tight opacity-0 ${isVisible ? 'animate-[slideDown_0.8s_ease-out_forwards]' : ''} break-keep`}>
              압도적인 전문성으로 <br/>
              <span style={{ color: config.accentColor }}>결과를 디자인합니다</span>
            </h2>
            <div className="space-y-6">
              {features.map((item, idx) => (
                <div 
                  key={idx} 
                  className={`flex gap-4 opacity-0 ${isVisible ? 'animate-[slideDown_0.8s_ease-out_forwards]' : ''}`}
                  style={{ animationDelay: isVisible ? `${0.2 + idx * 0.2}s` : '0s' }}
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: `${config.accentColor}20`, color: config.accentColor }}>
                    0{idx + 1}
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-1">{item.title}</h4>
                    <p className="text-white/60">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div 
            className={`relative group opacity-0 ${isVisible ? 'animate-[fadeIn_1s_ease-out_forwards]' : ''}`}
            style={{ animationDelay: isVisible ? `${0.2 + features.length * 0.2 + 0.2}s` : '0s' }}
          >
            <div className="absolute -inset-4 bg-cyan-500/10 rounded-2xl blur-2xl group-hover:bg-cyan-500/20 transition-all"></div>
            <img 
              src="https://picsum.photos/seed/work/800/600" 
              className="relative w-full h-auto rounded-xl border border-white/10 shadow-2xl" 
              alt="Work process" 
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" fill="%231a1a1a"><rect width="800" height="600" fill="%231a1a1a"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23555">Image not available</text><text x="50%" y="56%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%23555">Check link or permissions</text></svg>';
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
