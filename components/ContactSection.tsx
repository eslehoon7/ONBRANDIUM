import React, { useEffect, useRef, useState } from 'react';
import { SiteConfig } from '../types';
import ContactForm from './ContactForm';

interface ContactSectionProps {
  config: SiteConfig;
}

const ContactSection: React.FC<ContactSectionProps> = ({ config }) => {
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
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="contact" ref={sectionRef} className="py-32 px-6 scroll-mt-24">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h2 className={`text-3xl md:text-6xl font-black mb-6 italic tracking-tighter uppercase opacity-0 ${isVisible ? 'animate-[slideDown_0.8s_ease-out_forwards]' : ''}`}>
          Let's build your vision.
        </h2>
        <p className={`text-lg text-white/50 max-w-2xl mx-auto opacity-0 ${isVisible ? 'animate-[slideDown_0.8s_ease-out_0.2s_forwards]' : ''} break-keep`}>
          당신의 브랜드가 가진 잠재력을 최상의 디자인으로 끌어올립니다.
        </p>
      </div>
      <div className={`opacity-0 ${isVisible ? 'animate-[fadeIn_1s_ease-out_0.4s_forwards]' : ''}`}>
        <ContactForm config={config} />
      </div>
    </section>
  );
};

export default ContactSection;
