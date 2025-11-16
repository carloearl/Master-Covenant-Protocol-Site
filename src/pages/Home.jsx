import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import TechStackCarousel from '@/components/TechStackCarousel';
import ComparisonSection from '@/components/ComparisonSection';
import HeroSection from '@/components/home/HeroSection';
import HeroContent from '@/components/home/HeroContent';
import FeaturesSection from '@/components/home/FeaturesSection';
import ServicesGrid from '@/components/home/ServicesGrid';
import BoundAICards from '@/components/home/BoundAICards';
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

        let rotation = 0;
        let scale = 1;
        let opacity = 1;

        if (factor < 0) {
          const progress = Math.min(1, (1 + factor) * 1.2);
          rotation = (1 - progress) * 25;
          scale = 0.85 + (progress * 0.15);
          opacity = Math.max(0, progress);
        } else if (factor > 0) {
          const progress = Math.min(1, factor * 1.2);
          rotation = -progress * 25;
          scale = 1 - (progress * 0.15);
          opacity = Math.max(0, 1 - progress);
        }

        requestAnimationFrame(() => {
            setStyle({
              transform: `perspective(1000px) rotateX(${rotation}deg) scale(${scale})`,
              opacity: opacity,
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
    <section ref={sectionRef} className="min-h-screen w-full flex items-center justify-center px-2 sm:px-4 snap-start snap-always">
      <div style={style} className="w-full transition-all duration-150 ease-out pointer-events-auto">
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
    <div 
      ref={scrollContainerRef} 
      className="h-screen w-full overflow-y-scroll overflow-x-hidden snap-y snap-mandatory" 
      style={{ pointerEvents: 'auto', scrollBehavior: 'smooth' }}
    >
        
        <ScrollSection containerRef={scrollContainerRef}>
            <HeroSection />
        </ScrollSection>

        <ScrollSection containerRef={scrollContainerRef}>
            <HeroContent />
        </ScrollSection>

        <ScrollSection containerRef={scrollContainerRef}>
            <ServicesGrid />
        </ScrollSection>

        <ScrollSection containerRef={scrollContainerRef}>
            <BoundAICards />
        </ScrollSection>

        <ScrollSection containerRef={scrollContainerRef}>
            <FeaturesSection />
        </ScrollSection>
        
        <ScrollSection containerRef={scrollContainerRef}>
            <ComparisonSection />
        </ScrollSection>
        
        <ScrollSection containerRef={scrollContainerRef}>
            <TechStackCarousel />
        </ScrollSection>

        <ScrollSection containerRef={scrollContainerRef}>
            <CTASection />
        </ScrollSection>
    </div>
  );
}