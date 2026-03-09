import { useState } from 'react';
import { INITIAL_PORTFOLIO, DEFAULT_CONFIG } from './constants';
import { PortfolioItem } from './types';
import Footer from './components/Footer';
import PortfolioSection from './components/PortfolioSection';
import { X } from 'lucide-react';

function App() {
  const [config] = useState(DEFAULT_CONFIG);
  const [portfolio] = useState<PortfolioItem[]>(INITIAL_PORTFOLIO);
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      {/* Navigation */}
      <nav className="fixed w-full z-40 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tighter">{config.companyName}</div>
          <div className="hidden md:flex gap-8 text-sm font-medium">
            <a href="#work" className="hover:text-gray-400 transition-colors">WORK</a>
            <a href="#about" className="hover:text-gray-400 transition-colors">ABOUT</a>
            <a href="#contact" className="hover:text-gray-400 transition-colors">CONTACT</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.1] tracking-tight mb-8 max-w-5xl">
            {config.heroMainText}
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl leading-relaxed">
            {config.heroSubText}
          </p>
        </div>
      </section>

      {/* Portfolio Section */}
      <PortfolioSection portfolio={portfolio} onSelectProject={setSelectedProject} />

      {/* Footer */}
      <Footer config={config} />

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black z-[70] overflow-y-auto">
          <div className="sticky top-0 bg-black/80 backdrop-blur-md z-10 border-b border-white/10 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold truncate pr-4">{selectedProject.title}</h2>
            <button 
              onClick={() => setSelectedProject(null)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors shrink-0"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="max-w-5xl mx-auto px-6 py-12">
            <div className="aspect-video bg-white/5 rounded-2xl overflow-hidden mb-12">
              <img 
                src={selectedProject.imageUrl} 
                alt={selectedProject.title} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="md:col-span-2">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">{selectedProject.title}</h1>
                <p className="text-xl text-gray-400 leading-relaxed mb-8">
                  {selectedProject.description}
                </p>
              </div>
              
              <div>
                <div className="border-t border-white/10 pt-6 mb-6">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Category</h3>
                  <p className="font-medium text-lg">{selectedProject.category}</p>
                </div>
                <div className="border-t border-white/10 pt-6">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Share</h3>
                  <div className="flex gap-4">
                    <button className="text-gray-400 hover:text-white transition-colors font-medium">Copy Link</button>
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
