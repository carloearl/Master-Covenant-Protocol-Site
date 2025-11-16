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

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="text-white relative overflow-hidden snap-y snap-mandatory h-screen overflow-y-scroll">
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 glow-royal"
          aria-label="Back to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}

      <section className="snap-start h-screen">
        <HeroSection />
      </section>

      <section className="snap-start min-h-screen">
        <FeaturesSection />
      </section>

      <section className="snap-start min-h-screen">
        <ServicesGrid />
      </section>

      <section className="snap-start min-h-screen">
        <ComparisonSection />
      </section>

      <section className="snap-start min-h-screen py-24 relative">
        <div className="container mx-auto px-4 relative z-10">
          <TechStackCarousel />
        </div>
      </section>

      <section className="snap-start min-h-screen py-24 relative">
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

      <section className="snap-start min-h-screen">
        <CTASection />
      </section>
    </div>
  );
}