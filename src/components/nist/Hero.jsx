/**
 * NIST Challenge Hero Section - Federal Grade
 * Clean, professional federal styling with integrated branding
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import CountdownTimer from '@/components/ui/CountdownTimer';

export default function Hero() {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#e8edf4] via-[#d8dfe8] to-[#c8d0dc] py-16 md:py-24">
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(15,23,42,0.03) 1px, transparent 1px),
              linear-gradient(rgba(15,23,42,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* NIST x GlyphLock Branding - with glow ring */}
        <div className="max-w-5xl mx-auto mb-12 rounded-2xl p-1 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600" style={{ boxShadow: '0 0 30px rgba(59, 130, 246, 0.4), 0 0 60px rgba(59, 130, 246, 0.2)' }}>
          <div className="bg-white rounded-xl p-4 md:p-6">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/8dfe928b5_600dbe4b-1ef2-48e9-ac08-a02a1f4879e5.png"
              alt="NIST x GlyphLock - GenAI Challenge Participant 2026"
              className="w-full h-auto"
              loading="eager"
            />
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <Button
            size="lg"
            className="bg-blue-700 text-white hover:bg-blue-800 font-semibold shadow-lg px-8 py-6 text-lg border-2 border-blue-800"
            onClick={() => scrollToSection('technical')}
            aria-label="View Technical Approach section"
          >
            View Technical Approach
          </Button>
          <Button
            size="lg"
            className="bg-gray-800 text-white hover:bg-gray-900 font-semibold shadow-lg px-8 py-6 text-lg border-2 border-gray-900"
            onClick={() => scrollToSection('timeline')}
            aria-label="Track progress timeline"
          >
            Track Our Progress
          </Button>
        </div>

        {/* Countdown Timer Container - with glow */}
        <div className="max-w-2xl mx-auto bg-white rounded-xl p-6 md:p-8 border-2 border-blue-300 shadow-xl" style={{ boxShadow: '0 0 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(59, 130, 246, 0.15)' }} role="timer" aria-label="Countdown to dry-run submission">
          <div className="text-center text-gray-900 mb-4 text-base md:text-lg font-bold uppercase tracking-wide">
            Days Until Dry-Run Submission
          </div>
          <CountdownTimer targetDate="2026-01-28T00:00:00" />
        </div>
      </div>
    </section>
  );
}