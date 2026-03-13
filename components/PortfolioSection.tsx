
import React, { useEffect, useRef, useState } from 'react';
import { SiteConfig, PortfolioItem } from '../types';
import { getDirectImageUrl } from '../src/utils';

interface PortfolioSectionProps {
  config: SiteConfig;
  portfolio: PortfolioItem[];
  onSelectProject: (item: PortfolioItem) => void;
}

const PortfolioSection: React.FC<PortfolioSectionProps> = ({ config, portfolio, onSelectProject }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCategoryView, setSelectedCategoryView] = useState<string | null>(null);
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

  const categories = ['랜딩홈페이지', '자동화기록', '자동화알림'];
  
  const categoryCards = categories.map(cat => {
    const items = portfolio.filter(p => p.category === cat);
    return {
      category: cat,
      coverImage: items.length > 0 ? items[0].imageUrl : `https://picsum.photos/seed/${encodeURIComponent(cat)}/800/600`,
      count: items.length,
      title: cat,
      description: cat === '랜딩홈페이지' 
        ? '브랜드의 가치를 전달하는 매력적인 랜딩페이지' 
        : cat === '자동화기록' 
          ? '데이터 시각화 및 비즈니스 인사이트 제공 시스템' 
          : '사용자 경험을 극대화하는 스마트 알림 플랫폼'
    };
  });

  const categoryPortfolio = selectedCategoryView 
    ? portfolio.filter(item => item.category === selectedCategoryView)
    : [];

  return (
    <section 
      id="portfolio"
      ref={sectionRef}
      className="py-32 px-6 md:px-12 scroll-mt-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 max-w-7xl mx-auto">
        <div>
          <h2 className={`text-5xl md:text-7xl font-black tracking-tighter mb-4 italic opacity-0 ${isVisible ? 'animate-[slideDown_0.8s_ease-out_forwards]' : ''}`}>SELECTED WORKS</h2>
          <p className={`text-white/50 max-w-md text-lg opacity-0 ${isVisible ? 'animate-[slideDown_0.8s_ease-out_0.2s_forwards]' : ''}`}>우리가 완성한 감각적인 프로젝트들을 통해 온브랜디움만의 특별함을 느껴보세요.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {categoryCards.map((card, index) => (
          <div 
            key={card.category} 
            onClick={() => setSelectedCategoryView(card.category)}
            className={`group relative overflow-hidden rounded-3xl cursor-pointer opacity-0 bg-neutral-900 border border-white/5 shadow-2xl aspect-[4/5] ${isVisible ? 'animate-[fadeIn_1s_ease-out_forwards]' : ''}`}
            style={{ animationDelay: isVisible ? `${0.4 + index * 0.2}s` : '0s' }}
          >
            <img 
              src={getDirectImageUrl(card.coverImage)} 
              alt={card.title} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${encodeURIComponent(card.category)}/800/600`;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8 transition-opacity duration-300">
              <span className="text-xs font-bold tracking-[0.3em] uppercase mb-3" style={{ color: config.accentColor }}>{card.count} PROJECTS</span>
              <h3 className="text-3xl font-black tracking-tight mb-3">{card.title}</h3>
              <p className="text-white/70 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0 line-clamp-1">{card.description}</p>
            </div>
            
            {/* Overlay with CTA */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-black/20">
               <div className="px-6 py-3 rounded-full border border-white/30 backdrop-blur-md text-[10px] font-bold tracking-[0.5em] uppercase">View Category</div>
            </div>
          </div>
        ))}
      </div>

      {/* Category Projects Modal */}
      {selectedCategoryView && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setSelectedCategoryView(null)}></div>
          <div className="relative w-full max-w-7xl max-h-[90vh] overflow-y-auto bg-neutral-950 border border-white/10 rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-12">
            <button onClick={() => setSelectedCategoryView(null)} className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-all z-10">
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            
            <div className="mb-12">
              <span className="text-sm font-bold tracking-[0.3em] uppercase mb-4 block" style={{ color: config.accentColor }}>CATEGORY</span>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter">{selectedCategoryView}</h2>
            </div>

            {categoryPortfolio.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categoryPortfolio.map((item, index) => (
                  <div 
                    key={item.id || index} 
                    onClick={() => onSelectProject(item)}
                    className="group relative cursor-pointer"
                  >
                    <div className="relative overflow-hidden rounded-2xl aspect-[4/3] bg-neutral-900 border border-white/5 shadow-lg">
                      <img 
                        src={getDirectImageUrl(item.imageUrl)} 
                        alt={item.title} 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-70 group-hover:opacity-100"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${item.id || 'fallback'}/800/600`;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity"></div>
                      
                      {/* Overlay with CTA */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-black/20">
                         <div className="px-6 py-3 rounded-full border border-white/30 backdrop-blur-md text-[10px] font-bold tracking-[0.5em] uppercase">View Project</div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h3 className="text-xl font-bold mb-1 group-hover:text-glow transition-all">{item.title}</h3>
                      <p className="text-white/40 text-xs line-clamp-1">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-white/40 border border-dashed border-white/10 rounded-2xl">
                이 카테고리에 등록된 프로젝트가 없습니다.
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default PortfolioSection;
