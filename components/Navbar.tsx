
import React, { useState, useEffect } from 'react';
import { SiteConfig } from '../types';

interface NavbarProps {
  config: SiteConfig;
}

const Navbar: React.FC<NavbarProps> = ({ config }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Navbar height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-40 transition-all duration-300 ${isScrolled ? 'py-4 bg-black/80 backdrop-blur-md border-b border-white/10' : 'py-8 bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <button 
          onClick={(e) => window.scrollTo({ top: 0, behavior: 'smooth' })} 
          className="text-lg md:text-2xl font-black tracking-tighter flex items-center space-x-2 bg-transparent border-none cursor-pointer"
        >
          {config.logoUrl ? (
            <>
              <img 
                src={config.logoUrl} 
                alt={config.companyName} 
                className="h-6 sm:h-8 w-auto object-contain" 
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <span>{config.companyName}</span>
            </>
          ) : (
            <>
              <span className="w-8 h-8 rounded-lg flex items-center justify-center font-bold" style={{ backgroundColor: config.accentColor, color: '#000' }}>O</span>
              <span>{config.companyName}</span>
            </>
          )}
        </button>
        <div className="hidden md:flex space-x-12 font-medium text-sm tracking-widest uppercase">
          <button onClick={(e) => scrollToSection(e, 'portfolio')} className="hover:opacity-60 transition-opacity bg-transparent border-none cursor-pointer text-white">Portfolio</button>
          <button onClick={(e) => scrollToSection(e, 'about')} className="hover:opacity-60 transition-opacity bg-transparent border-none cursor-pointer text-white">About</button>
          <button onClick={(e) => scrollToSection(e, 'contact')} className="hover:opacity-60 transition-opacity bg-transparent border-none cursor-pointer text-white">Contact</button>
        </div>
        <button 
          onClick={(e) => scrollToSection(e, 'contact')}
          className="hidden sm:block border border-white/20 px-6 py-2 rounded-full text-xs font-bold hover:bg-white hover:text-black transition-all bg-transparent"
        >
          START PROJECT
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
