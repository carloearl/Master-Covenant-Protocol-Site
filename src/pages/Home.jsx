import React, { useEffect, useRef, useState } from 'react';
import HeroSection from '@/components/home/HeroSection';
import HeroContent from '@/components/home/HeroContent';
import HomeDreamTeamCTA from '@/components/home/HomeDreamTeamCTA';
import ServicesGrid from '@/components/home/ServicesGrid';
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
  const isMobile = typeof window !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  return (
    <div ref={sectionRef} className={`w-full py-16 md:py-20 lg:py-24 ${className}`}>
      <div style={isMobile ? {} : style} className={isMobile ? '' : 'transition-all duration-500 ease-out'}>
        {children}
      </div>
    </div>
  );
};

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (!isMobile) {
      document.documentElement.style.scrollBehavior = 'smooth';
    } else {
      // Disable scroll snap and perspective effects on mobile
      document.documentElement.style.scrollBehavior = 'auto';
      document.body.style.scrollSnapType = 'none';
    }
    
    // Simulate initial load
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => {
      document.documentElement.style.scrollBehavior = '';
      clearTimeout(timer);
    };
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black">
        <div className="text-center space-y-6">
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
            <div className="absolute inset-3 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" 
              style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} 
            />
          </div>
          <h2 className="text-2xl font-black text-white animate-pulse">
            Initializing Security...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead 
        title="GlyphLock Security - Quantum-Resistant Cybersecurity Platform | Enterprise AI Security"
        description="GlyphLock Security LLC provides military-grade quantum-resistant cybersecurity with AI-powered threat detection, visual cryptography, blockchain security, and secure POS systems. GlyphBot AI assistant, secure QR codes, steganography tools, and Master Covenant framework."
        keywords="GlyphLock Security, quantum-resistant encryption, cybersecurity, AI security, blockchain security, visual cryptography, QR code security, steganography, security operations center, GlyphBot AI, Master Covenant"
        url="/"
      />
      
      {/* SEO H1 - Hidden but crawlable */}
      <h1 className="sr-only">GlyphLock Security LLC - Quantum-Resistant Cybersecurity Platform</h1>

      <main className="w-full relative" style={{ background: 'transparent' }}>
        
        {/* Hero Section */}
        <section className="w-full">
          <ScrollSection>
            <HeroSection />
          </ScrollSection>
          
          <div className="flex justify-center -mt-8">
            <CountdownPill />
          </div>
        </section>

        {/* Value Proposition */}
        <ScrollSection className="container-responsive">
          <HeroContent />
        </ScrollSection>

        {/* Dream Team CTA */}
        <ScrollSection className="container-responsive">
          <HomeDreamTeamCTA />
        </ScrollSection>

        {/* Services Overview */}
        <ScrollSection className="container-responsive">
          <ServicesGrid />
        </ScrollSection>

        {/* Technology Partners */}
        <ScrollSection>
          <TechnologyMarquee />
        </ScrollSection>

        {/* Final Call to Action */}
        <ScrollSection className="container-responsive">
          <CTASection />
        </ScrollSection>
      </main>
    </>
  );
}