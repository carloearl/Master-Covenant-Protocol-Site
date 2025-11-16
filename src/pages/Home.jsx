import React, { useState, useEffect, useRef } from "react";
import { ArrowUp } from "lucide-react";
import TechStackCarousel from "@/components/TechStackCarousel";
import ComparisonSection from "@/components/ComparisonSection";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import ServicesGrid from "@/components/home/ServicesGrid";
import CTASection from "@/components/home/CTASection";

export default function Home() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
      
      if (!contentRef.current) return;
      
      const sections = contentRef.current.querySelectorAll('section');
      const viewportCenter = window.innerHeight / 2;
      
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const elementCenter = rect.top + (rect.height / 2);
        const distanceFromCenter = Math.abs(elementCenter - viewportCenter);
        const maxDistance = window.innerHeight * 0.8;
        const normalizedDistance = Math.min(distanceFromCenter / maxDistance, 1);
        
        const scale = 1 - (normalizedDistance * 0.08);
        const translateZ = -normalizedDistance * 250;
        
        section.style.transform = `perspective(1500px) translateZ(${translateZ}px) scale(${scale})`;
        section.style.transition = 'transform 0.15s ease-out';
        section.style.willChange = 'transform';
        section.style.backfaceVisibility = 'hidden';
        section.style.WebkitFontSmoothing = 'antialiased';
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="text-white relative" style={{ 
      perspective: '1500px',
      perspectiveOrigin: '50% 50%'
    }}>
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-[999] bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 glow-royal"
          aria-label="Back to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}

      <div ref={contentRef} style={{ transformStyle: 'preserve-3d', position: 'relative', zIndex: 50 }}>
        <HeroSection />
        <FeaturesSection />
        <ServicesGrid />
        <ComparisonSection />
        
        <section className="py-24 relative">
          <div className="container mx-auto px-4 relative">
            <TechStackCarousel />
          </div>
        </section>

        <section className="py-24 relative">
          <div className="container mx-auto px-4 relative">
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="glass-royal p-8 rounded-2xl text-center">
                <div className="text-5xl font-bold mb-2 text-blue-400">1.5PB+</div>
                <div className="text-white/80">Petabytes of Threat Data Analyzed</div>
              </div>
              <div className="glass-royal p-8 rounded-2xl text-center">
                <div className="text-5xl font-bold mb-2 text-blue-400">4 Million+</div>
                <div className="text-white/80">Malicious Events Neutralized</div>
              </div>
              <div className="glass-royal p-8 rounded-2xl text-center">
                <div className="text-5xl font-bold mb-2 text-blue-400">120+</div>
                <div className="text-white/80">Zero-Day Vulnerabilities Identified</div>
              </div>
            </div>
          </div>
        </section>

        <CTASection />
      </div>
    </div>
  );
}