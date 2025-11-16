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
  const [sectionTransforms, setSectionTransforms] = useState([]);
  const sectionRefs = useRef([]);

  useEffect(() => {
    const handleScroll = () => {
      const viewportCenter = window.innerHeight / 2;
      const scrolled = window.scrollY;
      setShowBackToTop(scrolled > 400);

      const transforms = sectionRefs.current.map((ref) => {
        if (!ref) return { rotateX: 0, translateZ: 0, scale: 1 };
        
        const rect = ref.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const distanceFromCenter = sectionCenter - viewportCenter;
        const normalizedDistance = distanceFromCenter / viewportCenter;

        const rotateX = normalizedDistance * 15;
        const translateZ = Math.abs(normalizedDistance) * -200;
        const scale = 1 - Math.abs(normalizedDistance) * 0.1;

        return { 
          rotateX: Math.max(-30, Math.min(30, rotateX)), 
          translateZ: Math.max(-400, translateZ),
          scale: Math.max(0.8, Math.min(1, scale))
        };
      });

      setSectionTransforms(transforms);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sections = [
    { component: <HeroSection />, key: 'hero' },
    { component: <FeaturesSection />, key: 'features' },
    { component: <ServicesGrid />, key: 'services' },
    { component: <ComparisonSection />, key: 'comparison' },
    { 
      component: (
        <section className="py-24 relative">
          <div className="container mx-auto px-4 relative z-10">
            <TechStackCarousel />
          </div>
        </section>
      ), 
      key: 'tech' 
    },
    { 
      component: (
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
      ), 
      key: 'stats' 
    },
    { component: <CTASection />, key: 'cta' }
  ];

  return (
    <div className="text-white relative overflow-hidden" style={{ perspective: '1500px', perspectiveOrigin: '50% 50%' }}>
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 glow-royal"
          aria-label="Back to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}

      <div>
        {sections.map((section, index) => {
          const transform = sectionTransforms[index] || { rotateX: 0, translateZ: 0, scale: 1 };
          
          return (
            <div
              key={section.key}
              ref={(el) => (sectionRefs.current[index] = el)}
              style={{
                transformStyle: 'preserve-3d',
                transform: `rotateX(${transform.rotateX}deg) translateZ(${transform.translateZ}px) scale(${transform.scale})`,
                transition: 'transform 0.05s ease-out',
                transformOrigin: 'center center'
              }}
            >
              {section.component}
            </div>
          );
        })}
      </div>
    </div>
  );
}