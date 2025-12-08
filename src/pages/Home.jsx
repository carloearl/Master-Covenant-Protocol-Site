import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import HeroSection from '@/components/home/HeroSection';
import HeroContent from '@/components/home/HeroContent';
import ServicesGrid from '@/components/home/ServicesGrid';
import DreamTeamHero from '@/components/home/DreamTeamHero';
import CTASection from '@/components/home/CTASection';
import TechnologyMarquee from '@/components/TechnologyMarquee';
import CountdownPill from '@/components/marketing/CountdownPill';
import SEOHead from '@/components/SEOHead';

const useScrollEffect = (sectionRef) => {
  const [style, setStyle] = useState({ transform: 'perspective(1000px)', opacity: 1 });

  useEffect(() => {
    // Disable scroll effects on mobile for performance
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      return;
    }

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
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
              rotation = (1 - progress) * 10;
              scale = 0.95 + (progress * 0.05);
              opacity = Math.max(0.5, progress);
            } else if (factor > 0) {
              const progress = Math.min(1, factor * 1.5);
              rotation = -progress * 10;
              scale = 1 - (progress * 0.05);
              opacity = Math.max(0.5, 1 - progress);
            }

            setStyle({
              transform: `perspective(1000px) rotateX(${rotation}deg) scale(${scale})`,
              opacity: opacity,
            });
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionRef]);

  return style;
};

const ScrollSection = ({ children, className = "" }) => {
  const sectionRef = useRef(null);
  const style = useScrollEffect(sectionRef);
  return (
    <section ref={sectionRef} className={`w-full relative py-8 md:py-12 ${className}`} style={{ background: 'transparent' }}>
      <div style={{ ...style, background: 'transparent' }} className="w-full transition-all duration-200 ease-out">
        {children}
      </div>
    </section>
  );
};

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => { document.documentElement.style.scrollBehavior = ''; };
  }, []);

  return (
    <>
      <SEOHead 
        title="GlyphLock Security - Quantum-Resistant Cybersecurity Platform | Enterprise AI Security"
        description="GlyphLock Security LLC provides military-grade quantum-resistant cybersecurity with AI-powered threat detection, visual cryptography, blockchain security, and secure POS systems. GlyphBot AI assistant, secure QR codes, steganography tools, and Master Covenant framework."
        keywords="GlyphLock Security, quantum-resistant encryption, cybersecurity, AI security, blockchain security, visual cryptography, QR code security, steganography, security operations center, GlyphBot AI, Master Covenant"
        url="/"
      />
      
      {/* SEO Content for Crawlers */}
      <div className="sr-only">
        <h1>GlyphLock Security LLC - Quantum-Resistant Cybersecurity Platform</h1>
        <p>Enterprise-grade security solutions including quantum-resistant encryption, AI-powered threat detection, visual cryptography, blockchain security, and comprehensive security operations.</p>
      </div>

      <div className="w-full relative" style={{ background: '#000000', pointerEvents: 'auto' }}>
        {/* Hero Video */}
        <ScrollSection>
          <HeroSection />
        </ScrollSection>

        {/* Launch Countdown Pill - Below Hero */}
        <div className="w-full mt-10">
          <CountdownPill />
        </div>

        {/* Hero Content - Stats & CTAs */}
        <ScrollSection>
          <HeroContent />
        </ScrollSection>

        {/* Dream Team Hero - Premium Holographic Cards */}
        <DreamTeamHero />

        {/* Services Grid */}
        <ScrollSection>
          <ServicesGrid />
        </ScrollSection>

        {/* Technology Partners Marquee */}
        <ScrollSection>
          <TechnologyMarquee />
        </ScrollSection>

        {/* Final CTA */}
        <ScrollSection>
          <CTASection />
        </ScrollSection>
      </div>
    </>
  );
}