
import React, { useState } from 'react';
import { SiteConfig, PortfolioItem } from '../types';
import { GoogleGenAI } from "@google/genai";
import { getDirectImageUrl } from '../src/utils';

interface AdminPanelProps {
  config: SiteConfig;
  onUpdateConfig: (config: SiteConfig) => void;
  portfolio: PortfolioItem[];
  onUpdatePortfolio: (portfolio: PortfolioItem[]) => void;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ config, onUpdateConfig, portfolio, onUpdatePortfolio, onClose }) => {
  const [activeTab, setActiveTab] = useState<'config' | 'portfolio'>('config');
  const [editingPortfolio, setEditingPortfolio] = useState<PortfolioItem | null>(null);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onUpdateConfig({ ...config, [name]: value });
  };

  const handleAddPortfolio = () => {
    const newItem: PortfolioItem = {
      id: Date.now().toString(),
      title: '새로운 프로젝트',
      category: '랜딩홈페이지',
      imageUrl: 'https://picsum.photos/800/600',
      description: '프로젝트에 대한 간단한 설명입니다.'
    };
    onUpdatePortfolio([newItem, ...portfolio]);
  };

  const handleDeletePortfolio = (id: string) => {
    onUpdatePortfolio(portfolio.filter(item => item.id !== id));
  };

  const handleUpdatePortfolioItem = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editingPortfolio) return;
    const { name, value } = e.target;
    const updated = { ...editingPortfolio, [name]: value };
    setEditingPortfolio(updated);
    onUpdatePortfolio(portfolio.map(p => p.id === editingPortfolio.id ? updated : p));
  };

  const generateAiDescription = async () => {
    if (!editingPortfolio || isAiGenerating) return;
    setIsAiGenerating(true);
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        alert('API key is missing. Please provide a valid API key.');
        return;
      }
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `웹 디자인 에이전시 웹사이트에 들어갈 포트폴리오 설명을 작성해주세요.
        제목: ${editingPortfolio.title}
        카테고리: ${editingPortfolio.category}
        이 정보를 바탕으로 매우 고급스럽고 전문적인 한 문장의 마케팅 설명을 한국어로 작성하세요.`,
      });
      
      const newDesc = response.text.trim();
      const updated = { ...editingPortfolio, description: newDesc };
      setEditingPortfolio(updated);
      onUpdatePortfolio(portfolio.map(p => p.id === editingPortfolio.id ? updated : p));
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiGenerating(false);
    }
  };

  return (
    <div className="bg-neutral-950 min-h-screen text-white p-6 md:p-12 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black mb-2 tracking-tighter uppercase">ADMIN DASHBOARD</h1>
            <p className="text-white/50">온브랜디움 사이트의 모든 요소를 실시간으로 제어합니다.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex bg-neutral-900 p-1 rounded-xl">
              <button 
                onClick={() => setActiveTab('config')}
                className={`px-6 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'config' ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`}
              >
                사이트 커스터마이징
              </button>
              <button 
                onClick={() => setActiveTab('portfolio')}
                className={`px-6 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'portfolio' ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`}
              >
                포트폴리오 관리
              </button>
            </div>
            <button 
              onClick={onClose}
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              홈페이지로 돌아가기
            </button>
          </div>
        </header>

        {activeTab === 'config' ? (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-neutral-900/50 p-8 rounded-2xl border border-white/5 space-y-8">
              <h2 className="text-xl font-bold border-b border-white/10 pb-4 flex items-center gap-2">
                <span className="w-2 h-6 bg-cyan-400 rounded-full block"></span> 텍스트 & 문구 수정
              </h2>
              
              <div className="space-y-4">
                <label className="block">
                  <span className="text-xs uppercase font-bold tracking-widest text-white/40 mb-2 block">Logo URL</span>
                  <input name="logoUrl" value={config.logoUrl || ''} onChange={handleConfigChange} placeholder="이미지 URL을 입력하세요 (비워두면 텍스트 로고 사용)" className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 focus:border-cyan-400 outline-none transition-all" />
                </label>
                <label className="block">
                  <span className="text-xs uppercase font-bold tracking-widest text-white/40 mb-2 block">Site Title</span>
                  <input name="siteTitle" value={config.siteTitle} onChange={handleConfigChange} className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 focus:border-cyan-400 outline-none transition-all" />
                </label>
                <label className="block">
                  <span className="text-xs uppercase font-bold tracking-widest text-white/40 mb-2 block">Hero Main Text</span>
                  <input name="heroMainText" value={config.heroMainText} onChange={handleConfigChange} className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 focus:border-cyan-400 outline-none transition-all" />
                </label>
                <label className="block">
                  <span className="text-xs uppercase font-bold tracking-widest text-white/40 mb-2 block">Hero Sub Text</span>
                  <textarea name="heroSubText" rows={3} value={config.heroSubText} onChange={handleConfigChange} className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 focus:border-cyan-400 outline-none transition-all resize-none" />
                </label>
              </div>
            </div>

            <div className="bg-neutral-900/50 p-8 rounded-2xl border border-white/5 space-y-8">
              <h2 className="text-xl font-bold border-b border-white/10 pb-4 flex items-center gap-2">
                <span className="w-2 h-6 bg-cyan-400 rounded-full block"></span> 디자인 테마 & 색상
              </h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase font-bold tracking-widest text-white/40">Accent Color</label>
                  <div className="flex items-center gap-4">
                    <input type="color" name="accentColor" value={config.accentColor} onChange={handleConfigChange} className="w-12 h-12 bg-transparent rounded-lg cursor-pointer" />
                    <span className="font-mono text-sm">{config.accentColor}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase font-bold tracking-widest text-white/40">Primary Background</label>
                  <div className="flex items-center gap-4">
                    <input type="color" name="primaryColor" value={config.primaryColor} onChange={handleConfigChange} className="w-12 h-12 bg-transparent rounded-lg cursor-pointer" />
                    <span className="font-mono text-sm">{config.primaryColor}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">포트폴리오 리스트 ({portfolio.length})</h2>
                <button onClick={handleAddPortfolio} className="bg-cyan-400 text-black px-6 py-2 rounded-full font-bold text-xs hover:scale-105 transition-all">새 프로젝트 추가</button>
              </div>
              {portfolio.map((item, index) => (
                <div key={item.id || index} className={`p-4 bg-neutral-900 border ${editingPortfolio?.id === item.id ? 'border-cyan-400' : 'border-white/5'} rounded-xl flex items-center justify-between cursor-pointer hover:bg-neutral-800 transition-all`} onClick={() => setEditingPortfolio(item)}>
                  <div className="flex items-center gap-4">
                    <img src={getDirectImageUrl(item.imageUrl)} className="w-16 h-12 object-cover rounded-lg" alt="" referrerPolicy="no-referrer" />
                    <div><h4 className="font-bold">{item.title}</h4><p className="text-xs text-white/40">{item.category}</p></div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); handleDeletePortfolio(item.id); }} className="text-red-500 hover:text-red-400 p-2">삭제</button>
                </div>
              ))}
            </div>

            <div className="bg-neutral-900 p-8 rounded-2xl border border-white/5 h-fit sticky top-12">
              <h2 className="text-xl font-bold mb-8 italic">PROJECT EDITOR</h2>
              {editingPortfolio ? (
                <div className="space-y-6">
                  <label className="block">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-white/40 mb-1 block">Title</span>
                    <input name="title" value={editingPortfolio.title} onChange={handleUpdatePortfolioItem} className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-sm" />
                  </label>
                  <label className="block">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-white/40 mb-1 block">Category</span>
                    <select 
                      name="category" 
                      value={editingPortfolio.category} 
                      onChange={(e: any) => handleUpdatePortfolioItem(e)} 
                      className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-cyan-400 outline-none transition-all appearance-none"
                    >
                      <option value="랜딩홈페이지">랜딩홈페이지</option>
                      <option value="자동화기록">자동화기록</option>
                      <option value="자동화알림">자동화알림</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-white/40 mb-1 block">Main Image URL</span>
                    <input name="imageUrl" value={editingPortfolio.imageUrl} onChange={handleUpdatePortfolioItem} className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-sm" placeholder="https://..." />
                  </label>
                  <label className="block">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-white/40 mb-1 block">Full Image URL (Detail View)</span>
                    <input name="fullImageUrl" value={editingPortfolio.fullImageUrl || ''} onChange={handleUpdatePortfolioItem} className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-sm" placeholder="https://..." />
                  </label>
                  <label className="block">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-white/40 mb-1 block">Mobile Image URL (Detail View)</span>
                    <input name="mobileImageUrl" value={editingPortfolio.mobileImageUrl || ''} onChange={handleUpdatePortfolioItem} className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-sm" placeholder="https://..." />
                  </label>
                  <label className="block">
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-white/40 block">Description</span>
                      <button 
                        onClick={generateAiDescription} 
                        disabled={isAiGenerating}
                        className="text-[9px] font-black text-cyan-400 hover:underline flex items-center gap-1 disabled:opacity-30"
                      >
                        {isAiGenerating ? '생성 중...' : '✨ AI 생성'}
                      </button>
                    </div>
                    <textarea name="description" rows={4} value={editingPortfolio.description} onChange={handleUpdatePortfolioItem} className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-sm resize-none" />
                  </label>
                </div>
              ) : (
                <div className="text-center py-20 text-white/20 font-bold border-2 border-dashed border-white/5 rounded-2xl">편집할 프로젝트를 선택하세요</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
