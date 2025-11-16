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
  const sectionRefs = useRef([]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
      
      const viewportCenter = window.innerHeight / 2;
      
      sectionRefs.current.forEach(section => {
        if (!section) return;
        
        const rect = section.getBoundingClientRect();
        const sectionCenter = rect.top + (rect.height / 2);
        const distanceFromCenter = Math.abs(sectionCenter - viewportCenter);
        const maxDistance = window.innerHeight;
        const normalizedDistance = Math.min(distanceFromCenter / maxDistance, 1);
        
        // Cylindrical effect: fade and push back when away from center
        const opacity = 1 - (normalizedDistance * 0.7);
        const scale = 1 - (normalizedDistance * 0.2);
        const translateZ = -normalizedDistance * 400;
        
        section.style.transform = `
          perspective(1500px) 
          translateZ(${translateZ}px) 
          scale(${scale})
        `;
        section.style.opacity = Math.max(0.3, opacity);
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
    <div className="text-white relative overflow-x-hidden" style={{ 
      perspective: '1500px',
      perspectiveOrigin: '50% 50%'
    }}>
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 glow-royal"
          aria-label="Back to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}

      <div ref={el => sectionRefs.current[0] = el} style={{ transformStyle: 'preserve-3d', willChange: 'transform, opacity' }}>
        <HeroSection />
      </div>

      <div ref={el => sectionRefs.current[1] = el} style={{ transformStyle: 'preserve-3d', willChange: 'transform, opacity' }}>
        <FeaturesSection />
      </div>

      <div ref={el => sectionRefs.current[2] = el} style={{ transformStyle: 'preserve-3d', willChange: 'transform, opacity' }}>
        <ServicesGrid />
      </div>

      <div ref={el => sectionRefs.current[3] = el} style={{ transformStyle: 'preserve-3d', willChange: 'transform, opacity' }}>
        <ComparisonSection />
      </div>
      
      <div ref={el => sectionRefs.current[4] = el} style={{ transformStyle: 'preserve-3d', willChange: 'transform, opacity' }}>
        <section className="py-24 relative">
          <div className="container mx-auto px-4 relative z-10">
            <TechStackCarousel />
          </div>
        </section>
      </div>

      <div ref={el => sectionRefs.current[5] = el} style={{ transformStyle: 'preserve-3d', willChange: 'transform, opacity' }}>
        <section className="py-24 relative">
          <div className="container mx-auto px-4 relative z-10">
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
      </div>

      <div ref={el => sectionRefs.current[6] = el} style={{ transformStyle: 'preserve-3d', willChange: 'transform, opacity' }}>
        <CTASection />
      </div>
    </div>
  );
}