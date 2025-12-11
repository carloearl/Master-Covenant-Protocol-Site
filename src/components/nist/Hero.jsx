/**
 * NIST Challenge Hero Section - Federal Grade
 * WCAG AA compliant, professional federal styling
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CountdownTimer from '@/components/ui/CountdownTimer';

export default function Hero() {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0a1324] via-[#1a244b] to-[#1e293b] py-20 md:py-32">
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px),
              linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Keyhole watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
        <svg className="w-96 h-96" viewBox="0 0 100 100" fill="currentColor">
          <circle cx="50" cy="35" r="20" />
          <rect x="42" y="50" width="16" height="30" />
        </svg>
      </div>

      <div className="w-full relative z-10 mb-12">
        {/* Hero Image with Branding */}
        <img 
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/c7baa454d_4f6d13c7-16d8-4204-b8eb-92dd206546ea1.png"
          alt="NIST x GlyphLock - Federal Validation in Progress"
          className="w-full h-auto object-cover"
          loading="eager"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">

        {/* CTAs positioned below hero image */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Button
            size="lg"
            className="bg-white text-blue-900 hover:bg-gray-100 font-semibold shadow-lg"
            onClick={() => scrollToSection('technical')}
            aria-label="View Technical Approach section"
          >
            View Technical Approach
          </Button>
          <Button
            size="lg"
            className="bg-blue-600 text-white hover:bg-blue-700 font-semibold shadow-lg"
            onClick={() => scrollToSection('timeline')}
            aria-label="Track progress timeline"
          >
            Track Our Progress
          </Button>
        </div>

        {/* Countdown Timer Container */}
        <div className="max-w-2xl mx-auto bg-blue-900/30 backdrop-blur-sm rounded-lg p-6 md:p-8 border border-blue-700/40 shadow-[0_0_15px_rgba(59,130,246,0.2)]" role="timer" aria-label="Countdown to dry-run submission">
          <div className="text-center text-blue-100 mb-4 text-base md:text-lg font-semibold">
            Days Until Dry-Run Submission
          </div>
          <CountdownTimer targetDate="2026-01-28T00:00:00" />
        </div>
      </div>
    </section>
  );
}