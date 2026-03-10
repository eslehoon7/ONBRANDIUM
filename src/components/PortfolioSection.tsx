import { useState } from 'react';
import { PortfolioItem } from '../types';
import { ArrowRight, X } from 'lucide-react';

interface PortfolioSectionProps {
  portfolio: PortfolioItem[];
  onSelectProject: (item: PortfolioItem) => void;
}

export default function PortfolioSection({ portfolio, onSelectProject }: PortfolioSectionProps) {
  const [selectedCategoryView, setSelectedCategoryView] = useState<string | null>(null);

  const categories = ['랜딩홈페이지', '자동화기록', '자동화알림'];

  const categoryCards = categories.map(category => {
    const items = portfolio.filter(item => item.category === category);
    return {
      category,
      count: items.length,
      coverImage: items.length > 0 ? items[0].imageUrl : 'https://picsum.photos/seed/placeholder/1200/800',
      description: category === '랜딩홈페이지' ? '브랜드의 가치를 극대화하는 웹 경험' : 
                   category === '자동화기록' ? '데이터 기반 비즈니스 솔루션' : 
                   '효율성을 높이는 지능형 알림 시스템'
    };
  });

  const categoryPortfolio = selectedCategoryView 
    ? portfolio.filter(item => item.category === selectedCategoryView)
    : [];

  return (
    <section className="py-24 px-6 md:px-12 bg-black" id="work">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">SELECTED WORKS</h2>
            <p className="text-gray-400 text-lg max-w-2xl">
              온브랜디움이 완성한 혁신적인 디지털 경험들을 카테고리별로 확인해보세요.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categoryCards.map((card, index) => (
            <div 
              key={index} 
              className="group cursor-pointer"
              onClick={() => setSelectedCategoryView(card.category)}
            >
              <div className="relative aspect-[4/5] w-full mb-6 overflow-hidden bg-white/5 rounded-2xl">
                <img 
                  src={card.coverImage} 
                  alt={card.category} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-black/80 backdrop-blur-sm p-6 rounded-xl transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 border border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-lg">프로젝트 보기</span>
                      <ArrowRight size={20} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start w-full">
                <span className="text-sm font-bold text-white/50 uppercase tracking-widest mb-3 leading-none">
                  {card.count} Projects
                </span>
                <h3 className="text-2xl font-bold mb-3 leading-tight whitespace-nowrap">{card.category}</h3>
                <p className="text-gray-400 break-keep">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Modal */}
      {selectedCategoryView && (
        <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
          <div className="sticky top-0 bg-black/80 backdrop-blur-md z-10 border-b border-white/10 px-6 py-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">{selectedCategoryView}</h2>
            <button 
              onClick={() => setSelectedCategoryView(null)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categoryPortfolio.map((item) => (
                <div 
                  key={item.id} 
                  className="group cursor-pointer"
                  onClick={() => onSelectProject(item)}
                >
                  <div className="relative aspect-video mb-4 overflow-hidden bg-white/5 rounded-xl">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-gray-300 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-gray-400 line-clamp-2 text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-black group-hover:border-white transition-all duration-300">
                      <ArrowRight size={18} className="transform -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {categoryPortfolio.length === 0 && (
              <div className="text-center py-24 text-gray-500">
                이 카테고리에 등록된 프로젝트가 없습니다.
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
