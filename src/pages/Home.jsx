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
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setShowBackToTop(window.scrollY > 400);
          
          if (contentRef.current) {
            const sections = contentRef.current.querySelectorAll('section');
            const viewportCenter = window.innerHeight / 2;
            
            sections.forEach(section => {
              const rect = section.getBoundingClientRect();
              const elementCenter = rect.top + (rect.height / 2);
              const distanceFromCenter = Math.abs(elementCenter - viewportCenter);
              const maxDistance = window.innerHeight * 0.8;
              const normalized = Math.min(distanceFromCenter / maxDistance, 1);
              
              const opacity = 1 - (normalized * 0.5);
              const translateZ = -normalized * 200;
              
              section.style.transform = `translateZ(${translateZ}px) scale(${1 - normalized * 0.05})`;
              section.style.opacity = `${Math.max(opacity, 0.5)}`;
              section.style.transition = 'transform 0.1s ease-out, opacity 0.1s ease-out';
            });
          }
          
          ticking = false;
        });
        
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
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
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110"
        style={{ 
          display: showBackToTop ? 'block' : 'none',
          zIndex: 99999,
          cursor: 'pointer',
          pointerEvents: 'auto'
        }}
        aria-label="Back to top"
      >
        <ArrowUp className="w-6 h-6" />
      </button>

      <div ref={contentRef} style={{ transformStyle: 'preserve-3d' }}>
        <HeroSection />
        <FeaturesSection />
        <ServicesGrid />
        <ComparisonSection />
        
        <section className="py-24 relative" style={{ willChange: 'transform, opacity' }}>
          <div className="container mx-auto px-4 relative">
            <TechStackCarousel />
          </div>
        </section>

        <section className="py-24 relative" style={{ willChange: 'transform, opacity' }}>
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