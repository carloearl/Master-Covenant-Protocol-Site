import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import TechStackCarousel from '@/components/TechStackCarousel';
import ComparisonSection from '@/components/ComparisonSection';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import ServicesGrid from '@/components/home/ServicesGrid';
import CTASection from '@/components/home/CTASection';

const useScrollEffect = (sectionRef, containerRef) => {
  const [style, setStyle] = useState({ transform: 'perspective(1000px)', opacity: 0 });

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const { top, height } = sectionRef.current.getBoundingClientRect();
        const screenHeight = window.innerHeight;
        
        const elementCenter = top + height / 2;
        const screenCenter = screenHeight / 2;
        const distance = screenCenter - elementCenter;
        
        const factor = distance / (screenCenter * 1.1);

        const rotation = -factor * 15;
        const scale = 1 - Math.abs(factor) * 0.1;
        
        // Improved continuous fade: smoother transition from 0 to 1 to 0
        const normalizedDistance = Math.abs(factor);
        const opacity = Math.max(0, Math.min(1, 1 - Math.pow(normalizedDistance, 1.5) * 0.8));

        requestAnimationFrame(() => {
            setStyle({
              transform: `perspective(1000px) rotateX(${rotation}deg) scale(${scale})`,
              opacity: opacity,
              transition: 'opacity 0.15s ease-out',
            });
        });
      }
    };
    
    const scrollContainer = containerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [sectionRef, containerRef]);

  return style;
};

const ScrollSection = ({ children, containerRef }) => {
  const sectionRef = useRef(null);
  const style = useScrollEffect(sectionRef, containerRef);
  return (
    <section ref={sectionRef} className="h-screen w-full flex items-center justify-center relative">
      <div style={style} className="w-full transition-transform duration-100 ease-out pointer-events-auto">
        {children}
      </div>
    </section>
  );
};

export default function Home() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const scrollContainerRef = useRef(null);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (email) {
      navigate(createPageUrl("Consultation") + `?email=${encodeURIComponent(email)}`);
    }
  };

  return (
    <div ref={scrollContainerRef} className="h-screen w-full overflow-y-scroll overflow-x-hidden" style={{ pointerEvents: 'auto' }}>
        
        <ScrollSection containerRef={scrollContainerRef}>
            <HeroSection />
        </ScrollSection>

        <ScrollSection containerRef={scrollContainerRef}>
            <ServicesGrid />
        </ScrollSection>
        
        <ScrollSection containerRef={scrollContainerRef}>
            <div className="w-full max-w-7xl mx-auto px-4">
                <TechStackCarousel />
            </div>
        </ScrollSection>

        <ScrollSection containerRef={scrollContainerRef}>
            <FeaturesSection />
        </ScrollSection>
        
        <ScrollSection containerRef={scrollContainerRef}>
            <ComparisonSection />
        </ScrollSection>

        <ScrollSection containerRef={scrollContainerRef}>
            <CTASection />
        </ScrollSection>
    </div>
  );
}