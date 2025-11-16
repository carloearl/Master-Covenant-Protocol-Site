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
  const [rotationX, setRotationX] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const rotation = (scrolled / 500) * 60; // Adjust divisor for rotation speed
      setRotationX(rotation);
      setShowBackToTop(scrolled > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  const radius = 2000; // Cylinder radius
  const anglePerSection = 60; // Degrees between sections

  return (
    <div className="text-white relative overflow-hidden">
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 glow-royal"
          aria-label="Back to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}

      <div 
        ref={containerRef}
        style={{ 
          perspective: '1500px',
          perspectiveOrigin: 'center center',
          minHeight: `${sections.length * 100}vh`
        }}
      >
        <div
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${rotationX}deg)`,
            transition: 'transform 0.05s ease-out',
            position: 'fixed',
            top: '50%',
            left: '50%',
            width: '100%',
            marginLeft: '-50%',
            marginTop: '-50vh'
          }}
        >
          {sections.map((section, index) => {
            const angle = index * anglePerSection;
            const translateZ = -radius;
            const rotateX = -angle;

            return (
              <div
                key={section.key}
                style={{
                  position: 'absolute',
                  width: '100%',
                  transformStyle: 'preserve-3d',
                  transform: `rotateX(${rotateX}deg) translateZ(${translateZ}px)`,
                  backfaceVisibility: 'hidden'
                }}
              >
                {section.component}
              </div>
            );
          })}
        </div>
      </div>

      {/* Spacer for scroll height */}
      <div style={{ height: `${sections.length * 100}vh` }} />
    </div>
  );
}