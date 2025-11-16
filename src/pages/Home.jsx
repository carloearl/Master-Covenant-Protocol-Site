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

      if (contentRef.current) {
        const elements = contentRef.current.children;
        const viewportCenter = window.innerHeight / 2 + window.scrollY;

        Array.from(elements).forEach((element) => {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + window.scrollY;
          const elementCenter = elementTop + rect.height / 2;
          const distanceFromCenter = elementCenter - viewportCenter;
          const normalizedDistance = distanceFromCenter / (window.innerHeight / 2);

          const rotateX = normalizedDistance * 12;
          const translateZ = Math.abs(normalizedDistance) * -150;
          const opacity = 1 - Math.abs(normalizedDistance) * 0.3;

          element.style.transform = `rotateX(${rotateX}deg) translateZ(${translateZ}px)`;
          element.style.opacity = Math.max(0.4, Math.min(1, opacity));
        });
      }
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
    <div className="text-white relative overflow-hidden" style={{ perspective: '2000px', perspectiveOrigin: '50% 50%' }}>
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 glow-royal"
          aria-label="Back to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}

      <div ref={contentRef} style={{ transformStyle: 'preserve-3d' }}>
        <div style={{ transformStyle: 'preserve-3d', transformOrigin: 'center center' }}>
          <HeroSection />
        </div>
        
        <div style={{ transformStyle: 'preserve-3d', transformOrigin: 'center center' }}>
          <FeaturesSection />
        </div>
        
        <div style={{ transformStyle: 'preserve-3d', transformOrigin: 'center center' }}>
          <ServicesGrid />
        </div>
        
        <div style={{ transformStyle: 'preserve-3d', transformOrigin: 'center center' }}>
          <ComparisonSection />
        </div>

        <section className="py-24 relative" style={{ transformStyle: 'preserve-3d', transformOrigin: 'center center' }}>
          <div className="container mx-auto px-4 relative z-10">
            <TechStackCarousel />
          </div>
        </section>

        <section className="py-24 relative" style={{ transformStyle: 'preserve-3d', transformOrigin: 'center center' }}>
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

        <div style={{ transformStyle: 'preserve-3d', transformOrigin: 'center center' }}>
          <CTASection />
        </div>
      </div>
    </div>
  );
}