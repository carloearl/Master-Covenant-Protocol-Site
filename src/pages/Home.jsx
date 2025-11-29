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
import DreamTeamRoster from '@/components/DreamTeamRoster';

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
        title="GlyphLock Security - Quantum-Resistant Cybersecurity Platform | Enterprise AI Security Solutions"
        description="GlyphLock Security LLC provides military-grade quantum-resistant cybersecurity with AI-powered threat detection, visual cryptography, blockchain security, and secure POS systems. Founded in El Mirage, Arizona by Carlo Rene Earl, Collin Vanderginst, and Jacub Lough. Comprehensive security solutions including GlyphBot AI assistant, secure QR code generation, steganography tools, security operations center, and Master Covenant framework for enterprise protection."
        keywords="GlyphLock Security LLC, quantum-resistant encryption Arizona, cybersecurity platform El Mirage, AI security threat detection, blockchain security, visual cryptography tools, QR code security generator, steganography encryption, security operations center SOC, enterprise security solutions, POS system NUPS, GlyphBot AI assistant, fraud prevention, identity protection, data encryption, Carlo Rene Earl founder, Collin Vanderginst CTO, Jacub Lough CSO CFO, military-grade encryption, security consulting, security audit, hotzone mapper, Master Covenant security"
        url="/"
      />
      
      {/* Explicit content for crawlers */}
      <div className="sr-only">
        <h1>GlyphLock Security LLC - Quantum-Resistant Cybersecurity Platform</h1>
        <p>
          GlyphLock Security LLC is a cutting-edge cybersecurity company based in El Mirage, Arizona, 
          founded in January 2025 by Carlo Rene Earl (Founder & Owner), Collin Vanderginst (Chief Technology Officer), 
          and Jacub Lough (Chief Security Officer & Chief Financial Officer).
        </p>
        <p>
          We provide enterprise-grade security solutions including quantum-resistant encryption, AI-powered threat detection, 
          visual cryptography, blockchain security, secure QR code generation, steganography tools, and comprehensive 
          security operations center services.
        </p>
        <p>
          Our flagship products include GlyphBot AI Assistant for intelligent security analysis, N.U.P.S. POS System 
          for secure payment processing, Hotzone Mapper for security visualization, and Master Covenant security framework.
        </p>
        <p>
          Contact us at glyphlock@gmail.com or call +1-424-246-6499 for security consultations and enterprise solutions.
        </p>
        <p>Services: Cybersecurity consulting, threat detection, fraud prevention, identity protection, security audits, 
          quantum-resistant encryption, AI security tools, blockchain security, visual cryptography.</p>
        <p>Industries served: Enterprise, healthcare, finance, government, retail, hospitality, technology.</p>
      </div>
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
        <DreamTeamRoster />
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