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

      <div className="container mx-auto px-4 relative z-10">
        {/* NIST + GlyphLock Branding */}
        <div className="flex items-center justify-center gap-4 mb-8 flex-wrap" role="banner">
          <h1 className="text-3xl md:text-4xl font-bold text-white">NIST</h1>
          <span className="text-3xl md:text-4xl text-blue-400" aria-hidden="true">×</span>
          <span className="text-3xl md:text-4xl font-bold text-white shadow-[0_0_10px_rgba(90,0,200,0.15)]">GLYPHLOCK</span>
        </div>

        {/* Participant Badge */}
        <div className="flex justify-center mb-6">
          <Badge className="bg-blue-900/40 text-blue-100 border-blue-400/50 px-6 py-2 text-sm backdrop-blur-sm">
            NIST GenAI Challenge Participant 2026
          </Badge>
        </div>

        {/* Main Title */}
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white text-center mb-6">
          Federal Validation in Progress
        </h2>

        {/* Subtitle */}
        <p className="text-lg md:text-xl lg:text-2xl text-blue-100 text-center mb-8 max-w-3xl mx-auto">
          Competing in NIST GenAI Challenge Across Three AI Modalities
        </p>

        {/* Modality Badges */}
        <div className="flex flex-wrap justify-center gap-4 mb-12" role="list">
          <Badge className="bg-blue-800/40 text-blue-100 border-blue-500/50 px-4 md:px-6 py-2 md:py-3 text-base md:text-lg backdrop-blur-sm">
            📝 Text
          </Badge>
          <Badge className="bg-blue-800/40 text-blue-100 border-blue-500/50 px-4 md:px-6 py-2 md:py-3 text-base md:text-lg backdrop-blur-sm">
            🖼️ Image
          </Badge>
          <Badge className="bg-blue-800/40 text-blue-100 border-blue-500/50 px-4 md:px-6 py-2 md:py-3 text-base md:text-lg backdrop-blur-sm">
            💻 Code
          </Badge>
        </div>

        {/* Value Proposition */}
        <p className="text-base md:text-lg text-blue-200 text-center italic mb-12 max-w-2xl mx-auto px-4">
          "The world's first legal-technical AI accountability platform validated through federal evaluation"
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Button
            size="lg"
            className="bg-white text-blue-900 hover:bg-gray-100 font-semibold"
            onClick={() => scrollToSection('technical')}
            aria-label="View Technical Approach section"
          >
            View Technical Approach
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-blue-300 text-blue-100 hover:bg-blue-900/30 font-semibold"
            onClick={() => scrollToSection('timeline')}
            aria-label="Track progress timeline"
          >
            Track Our Progress
          </Button>
        </div>

        {/* Countdown Timer Container */}
        <div className="max-w-2xl mx-auto bg-blue-900/30 backdrop-blur-sm rounded-lg p-6 md:p-8 border border-blue-700/40" role="timer" aria-label="Countdown to dry-run submission">
          <div className="text-center text-blue-100 mb-4 text-base md:text-lg font-semibold">
            Days Until Dry-Run Submission
          </div>
          <CountdownTimer targetDate="2026-01-28T00:00:00" />
        </div>
      </div>
    </section>
  );
}