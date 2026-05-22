import React, { useEffect, useRef, useState } from 'react';
import { SiteConfig } from '../types';
import { Palette, Code, Cpu, Globe, ArrowUpRight } from 'lucide-react';

interface ServicesSectionProps {
  config: SiteConfig;
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ config }) => {
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
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const services = [
    {
      icon: <Palette className="w-8 h-8" />,
      title: 'Premium Brand & UI/UX Design',
      titleKo: '아이디어만 있어도 시작할 수 있어요',
      desc: '방향이 잡히지 않아도 괜찮습니다.\n원하는 분위기나 참고 사이트 하나면, 전체 페이지 구조부터 함께 잡아드립니다.',
      features: ['브랜드 비주얼 아키텍처', '디테일 지향 인터랙션', '다이내믹 모션 프로토타이핑']
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: 'Full Stack Web Architecture',
      titleKo: '창구가 하나라 빠르고 정확해요',
      desc: '담당자가 여럿이면 말이 달라집니다.\n기획부터 개발까지 한 사람이 맡으니 오해 없이, 중간 단계 없이 진행됩니다.',
      features: ['싱글 페이지 고성능 앱', '헤드리스 CMS 통합', 'SEO 최적화 마크업 설계']
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: 'Next-Gen AI & Automation',
      titleKo: '운영하다 막혀도 직접 고칠 수 있어요',
      desc: '납품 후 작은 수정 때문에 다시 연락하지 않아도 됩니다.\n직접 관리할 수 있도록 사용법을 함께 안내해 드립니다.',
      features: ['AI 시스템 맞춤형 파이프라인', '지능형 자동화 시퀀스', '실시간 비즈니스 데이터 동기화']
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Global Scale Integration',
      titleKo: '비용보다 결과물이 먼저 증명해요',
      desc: '포트폴리오가 설명보다 낫습니다.\n실제 납품 결과물을 먼저 보여드리고, 그 다음에 금액을 이야기합니다.',
      features: ['다국어 & 퍼포먼스 패치', '글로벌 CDN 에지 탑재', '실시간 이상징후 트랙킹']
    }
  ];

  return (
    <section id="services" ref={sectionRef} className="py-32 px-6 md:px-12 scroll-mt-24 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] opacity-[0.03] filter blur-[100px] rounded-full pointer-events-none" style={{ backgroundColor: config.accentColor }}></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] opacity-[0.02] filter blur-[100px] rounded-full pointer-events-none" style={{ backgroundColor: config.accentColor }}></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 max-w-7xl mx-auto">
          <div>
            <h2 className={`text-5xl md:text-7xl font-extrabold tracking-normal leading-tight mb-4 opacity-0 ${isVisible ? 'animate-[slideDown_0.8s_ease-out_forwards]' : ''}`}>
              왜 온브랜디움을<br />선택할까요?
            </h2>
            <p className={`text-white/50 max-w-md text-lg opacity-0 ${isVisible ? 'animate-[slideDown_0.8s_ease-out_0.2s_forwards]' : ''}`}>감각적인 미학과 정밀한 엔지니어링을 결합한 4가지 핵심 솔루션입니다.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {services.map((svc, idx) => (
            <div 
              key={idx}
              className={`group p-8 md:p-12 bg-neutral-900/60 border border-white/5 rounded-2xl md:rounded-3xl hover:border-white/10 hover:bg-neutral-900 transition-all duration-500 relative flex flex-col justify-between opacity-0 ${isVisible ? 'animate-[slideDown_0.8s_ease-out_forwards]' : ''}`}
              style={{ animationDelay: isVisible ? `${idx * 0.15}s` : '0s' }}
            >
              <div>
                <div className="flex justify-between items-start mb-8">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-500" style={{ color: config.accentColor }}>
                    {svc.icon}
                  </div>
                  <span className="absolute right-6 top-6 md:right-10 md:top-8 text-7xl md:text-[9rem] font-extrabold opacity-10 group-hover:opacity-20 transition-all duration-500 leading-none select-none pointer-events-none">0{idx + 1}</span>
                </div>

                <div className="mb-6">
                  <span className="text-[10px] font-mono tracking-widest uppercase opacity-40 block mb-2">{svc.title}</span>
                  <h3 className="text-2xl font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors" style={{ color: isVisible ? undefined : 'white' }}>{svc.titleKo}</h3>
                </div>

                <p className="text-white/50 text-sm md:text-base leading-relaxed break-keep mb-8 font-light whitespace-pre-line">
                  {svc.desc}
                </p>
              </div>

              <div className="border-t border-white/5 pt-6 mt-6">
                <ul className="flex flex-wrap gap-x-6 gap-y-2">
                  {svc.features.map((feature, f_idx) => (
                    <li key={f_idx} className="text-xs text-white/40 flex items-center gap-1.5 font-medium">
                      <span className="w-1 h-1 rounded-full" style={{ backgroundColor: config.accentColor }}></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Decorative Subtle Corner Arrow */}
              <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0" style={{ color: config.accentColor }}>
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
