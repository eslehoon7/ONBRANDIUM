
import React, { useState, useEffect } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { collection, getDocs, doc, writeBatch } from 'firebase/firestore';
import { db } from './src/firebase';
import { SiteConfig, PortfolioItem, ViewMode } from './types';
import { DEFAULT_CONFIG, INITIAL_PORTFOLIO } from './constants';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import PortfolioSection from './components/PortfolioSection';
import AboutSection from './components/AboutSection';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import ContactSection from './components/ContactSection';
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

  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [isPortfolioLoaded, setIsPortfolioLoaded] = useState(false);

  const [viewMode, setViewMode] = useState<ViewMode>('public');
  const [showLogin, setShowLogin] = useState(false);
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);

  useEffect(() => {
    localStorage.setItem('onbrandium_config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'portfolio'));
        if (querySnapshot.empty) {
          const batch = writeBatch(db);
          INITIAL_PORTFOLIO.forEach((item) => {
            const docRef = doc(collection(db, 'portfolio'), item.id);
            batch.set(docRef, item);
          });
          await batch.commit();
          setPortfolio(INITIAL_PORTFOLIO);
        } else {
          const loadedPortfolio = querySnapshot.docs.map(docSnap => docSnap.data() as PortfolioItem);
          setPortfolio(loadedPortfolio);
        }
      } catch (error) {
        console.error("Error loading portfolio from Firestore:", error);
        setPortfolio(INITIAL_PORTFOLIO);
      } finally {
        setIsPortfolioLoaded(true);
      }
    };
    loadPortfolio();
  }, []);

  useEffect(() => {
    if (!isPortfolioLoaded) return;
    
    const savePortfolio = async () => {
      try {
        const batch = writeBatch(db);
        const querySnapshot = await getDocs(collection(db, 'portfolio'));
        
        const currentIds = new Set(portfolio.map(p => p.id));
        querySnapshot.docs.forEach(docSnap => {
          if (!currentIds.has(docSnap.id)) {
            batch.delete(docSnap.ref);
          }
        });
        
        portfolio.forEach(item => {
          batch.set(doc(collection(db, 'portfolio'), item.id), item);
        });
        
        await batch.commit();
      } catch (error) {
        console.error("Error saving portfolio to Firestore:", error);
      }
    };

    const timeoutId = setTimeout(savePortfolio, 1000);
    return () => clearTimeout(timeoutId);
  }, [portfolio, isPortfolioLoaded]);

  const handleUpdateConfig = (newConfig: SiteConfig) => {
    setConfig(newConfig);
  };

  const handleUpdatePortfolio = (newPortfolio: PortfolioItem[]) => {
    setPortfolio(newPortfolio);
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
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12 animate-in fade-in duration-300">
                <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setSelectedProject(null)}></div>
                <div className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-neutral-900 border border-white/10 rounded-3xl shadow-2xl flex flex-col md:flex-row gap-8 p-6 md:p-10">
                  <button onClick={() => setSelectedProject(null)} className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-all z-10">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                  <div className="w-full md:w-3/5 rounded-2xl overflow-hidden border border-white/5">
                    <img src={selectedProject.imageUrl} alt={selectedProject.title} className="w-full h-full object-cover"/>
                  </div>
                  <div className="w-full md:w-2/5 flex flex-col justify-center">
                    <span className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: config.accentColor }}>{selectedProject.category}</span>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-6 leading-tight">{selectedProject.title}</h2>
                    <p className="text-white/60 text-lg leading-relaxed mb-10">{selectedProject.description}</p>
                    <div className="pt-8 border-t border-white/5">
                      <a href="#contact" onClick={() => setSelectedProject(null)} className="inline-block px-10 py-4 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95 text-center" style={{ backgroundColor: config.accentColor, color: '#000' }}>SIMILAR PROJECT INQUIRY</a>
                    </div>
                  </div>
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
