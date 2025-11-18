import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import TechnologyMarquee from '@/components/TechnologyMarquee';
import ComparisonSection from '@/components/ComparisonSection';
import HeroSection from '@/components/home/HeroSection';
import HeroContent from '@/components/home/HeroContent';
import FeaturesSection from '@/components/home/FeaturesSection';
import ServicesGrid from '@/components/home/ServicesGrid';
import BoundAICards from '@/components/home/BoundAICards';
import BoundAISystemsSection from '@/components/home/BoundAISystemsSection';
import CTASection from '@/components/home/CTASection';
import SEOHead from '@/components/SEOHead';
import SecurityMonitor from '@/components/SecurityMonitor';

const useScrollEffect = (sectionRef) => {
  const [style, setStyle] = useState({ transform: 'perspective(1000px)', opacity: 1 });

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const { top, height } = sectionRef.current.getBoundingClientRect();
        const screenHeight = window.innerHeight;
        
        const elementCenter = top + height / 2;
        const screenCenter = screenHeight / 2;
        const distance = screenCenter - elementCenter;
        
        const factor = distance / (screenCenter * 1.5);

        let rotation = 0;
        let scale = 1;
        let opacity = 1;

        if (factor < 0) {
          const progress = Math.max(0, Math.min(1, (1 + factor) * 1.5));
          rotation = (1 - progress) * 15;
          scale = 0.9 + (progress * 0.1);
          opacity = Math.max(0.3, progress);
        } else if (factor > 0) {
          const progress = Math.min(1, factor * 1.5);
          rotation = -progress * 15;
          scale = 1 - (progress * 0.1);
          opacity = Math.max(0.3, 1 - progress);
        }

        requestAnimationFrame(() => {
          setStyle({
            transform: `perspective(1000px) rotateX(${rotation}deg) scale(${scale})`,
            opacity: opacity,
          });
        });
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sectionRef]);

  return style;
};

const ScrollSection = ({ children }) => {
  const sectionRef = useRef(null);
  const style = useScrollEffect(sectionRef);
  return (
    <section ref={sectionRef} className="w-full min-h-screen flex items-center justify-center relative py-8 md:py-16">
      <div className="absolute inset-0 -z-10">
        <div className="glass-card w-full h-full mx-auto rounded-none md:w-[95%] md:h-[90%] md:rounded-3xl" />
      </div>
      <div style={style} className="w-full transition-all duration-200 ease-out">
        {children}
      </div>
    </section>
  );
};

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  return (
    <>
      <SEOHead 
        title="GlyphLock - Quantum-Resistant Cybersecurity & AI Security Platform"
        description="Enterprise cybersecurity with quantum-resistant encryption, AI threat detection, visual cryptography, blockchain security, and secure POS systems. Protect your business with GlyphLock."
        keywords="quantum-resistant encryption, cybersecurity platform, AI security, threat detection, visual cryptography, QR code security, blockchain security, enterprise security, POS system, fraud prevention, data encryption, security operations center, GlyphBot AI assistant"
        url="/"
      />
      <SecurityMonitor />
      <div className="w-full">
        <ScrollSection>
          <HeroSection />
        </ScrollSection>

      <ScrollSection>
        <HeroContent />
      </ScrollSection>

      <ScrollSection>
        <ServicesGrid />
      </ScrollSection>

      <ScrollSection>
        <BoundAISystemsSection />
      </ScrollSection>

      <ScrollSection>
        <BoundAICards />
      </ScrollSection>

      <ScrollSection>
        <FeaturesSection />
      </ScrollSection>
      
      <ScrollSection>
        <ComparisonSection />
      </ScrollSection>
      
      <ScrollSection>
        <TechnologyMarquee />
      </ScrollSection>

      <ScrollSection>
        <CTASection />
      </ScrollSection>
      </div>
    </>
  );
}