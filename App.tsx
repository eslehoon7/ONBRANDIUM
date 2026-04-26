
import React, { useState, useEffect } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { collection, getDocs, doc, writeBatch } from 'firebase/firestore';
import { db } from './src/firebase';
import { SiteConfig, PortfolioItem, ViewMode } from './types';
import { DEFAULT_CONFIG, INITIAL_PORTFOLIO } from './constants';
import { getDirectImageUrl } from './src/utils';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import PortfolioSection from './components/PortfolioSection';
import AboutSection from './components/AboutSection';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import ContactSection from './components/ContactSection';
import GallerySection from './components/GallerySection';
import AIConsultant from './components/AIConsultant';

const App: React.FC = () => {
  const [config, setConfig] = useState<SiteConfig>(() => {
    const saved = localStorage.getItem('onbrandium_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Update the cached logoUrl if it was the old broken Google Drive link
      let currentLogoUrl = parsed.logoUrl;
      if (!currentLogoUrl || currentLogoUrl.includes('drive.google.com/uc')) {
        currentLogoUrl = 'https://lh3.googleusercontent.com/d/1l6FzOa7qIbnjz9M2-tmSPPjwvPKadIFE';
      }
      return { ...DEFAULT_CONFIG, ...parsed, logoUrl: currentLogoUrl };
    }
    return DEFAULT_CONFIG;
  });

  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(() => {
    const saved = localStorage.getItem('onbrandium_portfolio');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  const [isPortfolioLoaded, setIsPortfolioLoaded] = useState(false);

  const [viewMode, setViewMode] = useState<ViewMode>('public');
  const [showLogin, setShowLogin] = useState(false);
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);

  useEffect(() => {
    localStorage.setItem('onbrandium_config', JSON.stringify(config));
    
    // Update document title dynamically
    if (config.siteTitle) {
      document.title = config.siteTitle;
    }

    // Update favicon dynamically
    if (config.logoUrl) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = getDirectImageUrl(config.logoUrl);
    }
  }, [config]);

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'portfolio'));
        if (querySnapshot.empty) {
          // Do not auto-seed or reset data unless explicitly asked.
          // Just use what is loaded (empty array) so users don't see unexpected default items coming back.
          setPortfolio([]);
        } else {
          const loadedPortfolio = querySnapshot.docs.map(docSnap => {
            const data = docSnap.data();
            return {
              ...data,
              id: data.id || docSnap.id
            } as PortfolioItem;
          });
          setPortfolio(loadedPortfolio);
        }
      } catch (error) {
        console.error("Error loading portfolio from Firestore:", error);
        // Do not reset to empty array, keep the cached version if an error occurs.
      } finally {
        setIsPortfolioLoaded(true);
      }
    };
    loadPortfolio();
  }, []);

  useEffect(() => {
    if (isPortfolioLoaded && portfolio.length >= 0) {
      localStorage.setItem('onbrandium_portfolio', JSON.stringify(portfolio));
    }
  }, [portfolio, isPortfolioLoaded]);

  const handleUpdateConfig = (newConfig: SiteConfig) => {
    setConfig(newConfig);
  };

  const handleUpdatePortfolio = async (newPortfolio: PortfolioItem[]) => {
    const previousPortfolio = [...portfolio];
    setPortfolio(newPortfolio);
    
    // Save to Firestore explicitly only when admin updates it
    try {
      const batch = writeBatch(db);
      const querySnapshot = await getDocs(collection(db, 'portfolio'));
      
      const currentIds = new Set(newPortfolio.map(p => p.id));
      querySnapshot.docs.forEach(docSnap => {
        if (!currentIds.has(docSnap.id)) {
          batch.delete(docSnap.ref);
        }
      });
      
      newPortfolio.forEach(item => {
        if (item.id) {
          batch.set(doc(collection(db, 'portfolio'), item.id), item);
        }
      });
      
      await batch.commit();
    } catch (error) {
      console.error("Error saving portfolio to Firestore:", error);
      alert("포트폴리오 저장 중 오류가 발생했습니다. 원본 데이터로 되돌립니다.");
      setPortfolio(previousPortfolio);
    }
  };

  return (
    <Router>
      <div className={`min-h-screen transition-colors duration-500`} style={{ backgroundColor: config.primaryColor }}>
        {viewMode === 'admin' ? (
          <AdminPanel 
            config={config} 
            onUpdateConfig={handleUpdateConfig} 
            portfolio={portfolio}
            onUpdatePortfolio={handleUpdatePortfolio}
            onClose={() => setViewMode('public')}
          />
        ) : (
          <>
            <Navbar config={config} />
            <main>
              <Hero config={config} />
              <PortfolioSection 
                config={config} 
                portfolio={portfolio} 
                onSelectProject={setSelectedProject}
              />
              <AboutSection config={config} />
              <GallerySection 
                config={config} 
                portfolio={portfolio} 
                onSelectProject={setSelectedProject}
              />
              <ContactSection config={config} />
            </main>
            <Footer 
              config={config} 
              viewMode={viewMode}
              onToggleViewMode={() => {
                if (viewMode === 'admin') {
                  setViewMode('public');
                } else {
                  setShowLogin(true);
                }
              }}
            />
            <AIConsultant config={config} />

            {/* Project Detail Modal */}
            {selectedProject && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300">
                <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setSelectedProject(null)}></div>
                <div className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-neutral-900 border border-white/10 rounded-2xl md:rounded-3xl shadow-2xl flex flex-col gap-8 p-6 md:p-10">
                  <button onClick={() => setSelectedProject(null)} className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-all z-10">
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                  
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-3/5 rounded-2xl overflow-hidden border border-white/5">
                      <img 
                        src={getDirectImageUrl(selectedProject.imageUrl)} 
                        alt={selectedProject.title} 
                        className="w-full h-auto" 
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" fill="%231a1a1a"><rect width="800" height="600" fill="%231a1a1a"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23555">Image not available</text><text x="50%" y="56%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%23555">Check link or permissions</text></svg>';
                        }}
                      />
                    </div>
                    <div className="w-full md:w-2/5 flex flex-col justify-center">
                      <span className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: config.accentColor }}>{selectedProject.category}</span>
                      <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-6 leading-tight break-keep">{selectedProject.title}</h2>
                      <p className="text-white/60 text-base md:text-lg leading-relaxed mb-10 break-keep">{selectedProject.description}</p>
                      <div className="pt-8 border-t border-white/5">
                        <a href="#contact" onClick={() => setSelectedProject(null)} className="inline-block px-10 py-4 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95 text-center" style={{ backgroundColor: config.accentColor, color: '#000' }}>SIMILAR PROJECT INQUIRY</a>
                      </div>
                    </div>
                  </div>

                  {(selectedProject.fullImageUrl || selectedProject.mobileImageUrl) && (
                    <div className="flex flex-col gap-12 pt-12 border-t border-white/10 mt-4">
                      {selectedProject.fullImageUrl && (
                        <div className="w-full rounded-2xl overflow-hidden border border-white/5">
                          <img 
                            src={getDirectImageUrl(selectedProject.fullImageUrl)} 
                            alt={`${selectedProject.title} Full View`} 
                            className="w-full h-auto" 
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      {selectedProject.mobileImageUrl && (
                        <div className="w-full max-w-sm mx-auto rounded-[2.5rem] overflow-hidden border-[8px] border-neutral-800 shadow-2xl">
                          <img 
                            src={getDirectImageUrl(selectedProject.mobileImageUrl)} 
                            alt={`${selectedProject.title} Mobile View`} 
                            className="w-full h-auto" 
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Admin Login Modal */}
            {showLogin && (
              <AdminLogin 
                onLoginSuccess={() => {
                  setShowLogin(false);
                  setViewMode('admin');
                }}
                onCancel={() => setShowLogin(false)}
              />
            )}
          </>
        )}
      </div>
    </Router>
  );
};

export default App;
