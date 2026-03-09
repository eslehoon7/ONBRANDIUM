import React, { useState, useEffect } from 'react';
import { INITIAL_PORTFOLIO, DEFAULT_CONFIG } from '../constants';
import { PortfolioItem, SiteConfig } from './types';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import PortfolioSection from './components/PortfolioSection';
import { db } from './firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { ArrowRight, X } from 'lucide-react';

function App() {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [viewMode, setViewMode] = useState<'public' | 'admin'>('public');
  const [showLogin, setShowLogin] = useState(false);
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'portfolio'));
        if (querySnapshot.empty) {
          // If Firestore is empty, use INITIAL_PORTFOLIO and save it to Firestore
          const initialData = INITIAL_PORTFOLIO;
          for (const item of initialData) {
            const { id, ...rest } = item; // Remove hardcoded ID
            await addDoc(collection(db, 'portfolio'), rest);
          }
          setPortfolio(initialData);
        } else {
          const data = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as PortfolioItem[];
          setPortfolio(data);
        }
      } catch (error) {
        console.error("Error fetching portfolio: ", error);
        // Fallback to initial data if fetch fails
        setPortfolio(INITIAL_PORTFOLIO);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  const handleToggleViewMode = () => {
    if (viewMode === 'public') {
      setShowLogin(true);
    } else {
      setViewMode('public');
    }
  };

  const handleLoginSuccess = () => {
    setShowLogin(false);
    setViewMode('admin');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      {/* Navigation */}
      <nav className="fixed w-full z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tighter">{config.companyName}</div>
          <div className="hidden md:flex gap-8 text-sm font-medium">
            <a href="#work" className="hover:text-gray-500 transition-colors">WORK</a>
            <a href="#about" className="hover:text-gray-500 transition-colors">ABOUT</a>
            <a href="#contact" className="hover:text-gray-500 transition-colors">CONTACT</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.1] tracking-tight mb-8 max-w-5xl">
            {config.heroMainText}
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 max-w-2xl leading-relaxed">
            {config.heroSubText}
          </p>
        </div>
      </section>

      {/* Portfolio Section */}
      <PortfolioSection portfolio={portfolio} onSelectProject={setSelectedProject} />

      {/* Footer */}
      <Footer config={config} viewMode={viewMode} onToggleViewMode={handleToggleViewMode} />

      {/* Admin Login Modal */}
      {showLogin && (
        <AdminLogin onLoginSuccess={handleLoginSuccess} onCancel={() => setShowLogin(false)} />
      )}

      {/* Admin Panel */}
      {viewMode === 'admin' && (
        <AdminPanel
          config={config}
          setConfig={setConfig}
          portfolio={portfolio}
          setPortfolio={setPortfolio}
          onClose={() => setViewMode('public')}
        />
      )}

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-white z-[70] overflow-y-auto">
          <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-gray-100 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold truncate pr-4">{selectedProject.title}</h2>
            <button 
              onClick={() => setSelectedProject(null)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors shrink-0"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="max-w-5xl mx-auto px-6 py-12">
            <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden mb-12">
              <img 
                src={selectedProject.imageUrl} 
                alt={selectedProject.title} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="md:col-span-2">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">{selectedProject.title}</h1>
                <p className="text-xl text-gray-600 leading-relaxed mb-8">
                  {selectedProject.description}
                </p>
              </div>
              
              <div>
                <div className="border-t border-gray-200 pt-6 mb-6">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Category</h3>
                  <p className="font-medium text-lg">{selectedProject.category}</p>
                </div>
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Share</h3>
                  <div className="flex gap-4">
                    <button className="text-gray-600 hover:text-black transition-colors font-medium">Copy Link</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
