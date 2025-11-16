import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import TechStackCarousel from '@/components/TechStackCarousel';
import ComparisonSection from '@/components/ComparisonSection';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import ServicesGrid from '@/components/home/ServicesGrid';
import CTASection from '@/components/home/CTASection';

export default function Home() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const scrollContainerRef = useRef(null);
  const contentRef = useRef(null);
  const [style, setStyle] = useState({ transform: 'perspective(1000px)', opacity: 1 });

  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current && scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const scrollTop = container.scrollTop;
        const scrollHeight = container.scrollHeight - container.clientHeight;
        
        // Calculate scroll progress (0 at top, 1 at bottom)
        const scrollProgress = scrollTop / scrollHeight;
        
        // Map to rotation range: start tilted forward, end tilted back
        const rotation = (scrollProgress - 0.5) * -30; // -15 to +15 degrees
        const scale = 0.95 + (1 - Math.abs(scrollProgress - 0.5) * 2) * 0.05;

        requestAnimationFrame(() => {
          setStyle({
            transform: `perspective(1000px) rotateX(${rotation}deg) scale(${scale})`,
            opacity: 1,
          });
        });
      }
    };
    
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (email) {
      navigate(createPageUrl("Consultation") + `?email=${encodeURIComponent(email)}`);
    }
  };

  return (
    <div ref={scrollContainerRef} className="h-screen w-full overflow-y-scroll overflow-x-hidden" style={{ pointerEvents: 'auto' }}>
      <div ref={contentRef} style={style} className="transition-all duration-150 ease-out pointer-events-auto">
        
        <section className="h-screen w-full flex items-center justify-center">
          <HeroSection />
        </section>

        <section className="h-screen w-full flex items-center justify-center">
          <ServicesGrid />
        </section>
        
        <section className="h-screen w-full flex items-center justify-center">
          <div className="w-full max-w-7xl mx-auto px-4">
            <TechStackCarousel />
          </div>
        </section>

        <section className="h-screen w-full flex items-center justify-center">
          <FeaturesSection />
        </section>
        
        <section className="h-screen w-full flex items-center justify-center">
          <ComparisonSection />
        </section>

        <section className="h-screen w-full flex items-center justify-center">
          <CTASection />
        </section>
      </div>
    </div>
  );
}