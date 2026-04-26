import React, { useEffect, useRef, useState } from 'react';
import { SiteConfig, PortfolioItem } from '../types';
import { getDirectImageUrl } from '../src/utils';

interface GallerySectionProps {
  config: SiteConfig;
  portfolio: PortfolioItem[];
  onSelectProject: (item: PortfolioItem) => void;
}

const GallerySection: React.FC<GallerySectionProps> = ({ config, portfolio, onSelectProject }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
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

  return (
    <section 
      id="gallery" 
      ref={sectionRef}
      className="py-32 px-6 md:px-12 bg-black scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className={`text-5xl md:text-7xl font-black tracking-tighter mb-4 italic opacity-0 ${isVisible ? 'animate-[slideDown_0.8s_ease-out_forwards]' : ''}`}>ALL WORKS</h2>
          <p className={`text-white/50 max-w-md text-lg opacity-0 ${isVisible ? 'animate-[slideDown_0.8s_ease-out_0.2s_forwards]' : ''}`}>업로드된 순서대로 모든 포트폴리오를 감상해보세요.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolio.slice(0, visibleCount).map((item, index) => (
            <div 
              key={item.id || index} 
              onClick={() => onSelectProject(item)}
              className={`group relative cursor-pointer opacity-0 ${isVisible ? 'animate-[fadeIn_1s_ease-out_forwards]' : ''}`}
              style={{ animationDelay: isVisible ? `${0.2 + (index % 10) * 0.1}s` : '0s' }}
            >
              <div className="relative overflow-hidden rounded-2xl aspect-[4/3] bg-neutral-900 border border-white/5 shadow-lg">
                <img 
                  src={getDirectImageUrl(item.imageUrl)} 
                  alt={item.title} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 lg:group-hover:scale-105 opacity-70 lg:group-hover:opacity-100"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" fill="%231a1a1a"><rect width="800" height="600" fill="%231a1a1a"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23555">Image not available</text><text x="50%" y="56%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%23555">Check link or permissions</text></svg>';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 lg:group-hover:opacity-40 transition-opacity"></div>
                
                {/* Overlay with CTA */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 lg:group-hover:opacity-100 transition-all duration-500 bg-black/20">
                   <div className="px-6 py-3 rounded-full border border-white/30 backdrop-blur-md text-[10px] font-bold tracking-[0.5em] uppercase">View Project</div>
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="text-xl font-bold mb-1 lg:group-hover:text-glow transition-all">{item.title}</h3>
                <div className="flex justify-between items-center text-white/40 text-xs">
                  <p className="line-clamp-1">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {visibleCount < portfolio.length && (
          <div className="mt-16 flex justify-center">
            <button 
              onClick={() => setVisibleCount(prev => prev + 6)}
              className="px-8 py-4 rounded-full border border-white/20 hover:bg-white/10 transition-colors uppercase tracking-[0.2em] text-xs font-bold flex items-center gap-2"
            >
              <span>+ Add More Works</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default GallerySection;
