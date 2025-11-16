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

const useScrollEffect = (sectionRef) => {
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
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sectionRef]);

  return style;
};

const ScrollSection = ({ children }) => {
  const sectionRef = useRef(null);
  const style = useScrollEffect(sectionRef);
  return (
    <section ref={sectionRef} className="w-full py-4">
      <div style={style} className="w-full transition-all duration-150 ease-out pointer-events-auto">
        {children}
      </div>
    </section>
  );
};

export default function Home() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (email) {
      navigate(createPageUrl("Consultation") + `?email=${encodeURIComponent(email)}`);
    }
  };

  return (
    <div className="w-full">
        
        <ScrollSection>
            <HeroSection />
        </ScrollSection>

        <ScrollSection>
            <HeroContent />
        </ScrollSection>

        <ScrollSection>
            <ServicesGrid />
        </ScrollSection>

        <ScrollSection>
            <BoundAICards />
        </ScrollSection>

        <ScrollSection>
            <FeaturesSection />
        </ScrollSection>
        
        <ScrollSection>
            <ComparisonSection />
        </ScrollSection>
        
        <ScrollSection>
            <TechStackCarousel />
        </ScrollSection>

        <ScrollSection>
            <CTASection />
        </ScrollSection>
    </div>
  );
}