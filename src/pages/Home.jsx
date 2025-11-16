import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import TechStackCarousel from "@/components/TechStackCarousel";
import ComparisonSection from "@/components/ComparisonSection";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import ServicesGrid from "@/components/home/ServicesGrid";
import CTASection from "@/components/home/CTASection";

export default function Home() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrolled / maxScroll;
      setScrollProgress(progress);
      setShowBackToTop(scrolled > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const depth = scrollProgress * 500;
  const rotateAmount = scrollProgress * 8;

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

      <div style={{ 
        transform: `translateZ(${-depth}px) rotateX(${rotateAmount}deg) scale(${1 + scrollProgress * 0.2})`,
        transformStyle: 'preserve-3d',
        transition: 'transform 0.08s ease-out'
      }}>
        <div style={{ 
          transform: `rotateX(-2deg)`,
          transformStyle: 'preserve-3d',
          transformOrigin: 'center top'
        }}>
          <HeroSection />
        </div>

        <div style={{ 
          transform: `rotateX(-1.5deg)`,
          transformStyle: 'preserve-3d',
          transformOrigin: 'center top'
        }}>
          <FeaturesSection />
        </div>

        <div style={{ 
          transform: `rotateX(-1deg)`,
          transformStyle: 'preserve-3d',
          transformOrigin: 'center top'
        }}>
          <ServicesGrid />
        </div>

        <div style={{ 
          transform: `rotateX(-0.5deg)`,
          transformStyle: 'preserve-3d',
          transformOrigin: 'center top'
        }}>
          <ComparisonSection />
        </div>

        <section className="py-24 relative" style={{ 
          transform: `rotateX(-0.3deg)`,
          transformStyle: 'preserve-3d',
          transformOrigin: 'center top'
        }}>
          <div className="container mx-auto px-4 relative z-10">
            <TechStackCarousel />
          </div>
        </section>

        <section className="py-24 relative" style={{ 
          transform: `rotateX(-0.2deg)`,
          transformStyle: 'preserve-3d',
          transformOrigin: 'center top'
        }}>
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

        <div style={{ 
          transform: `rotateX(-0.1deg)`,
          transformStyle: 'preserve-3d',
          transformOrigin: 'center top'
        }}>
          <CTASection />
        </div>
      </div>
    </div>
  );
}