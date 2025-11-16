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

const ScrollSection = ({ children }) => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className={`w-full flex items-center justify-center px-2 sm:px-4 py-8 md:py-12 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="w-full">
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
    <div className="w-full overflow-x-hidden">
        
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