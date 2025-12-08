import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Trophy, Shield, Lock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import HeroHolographicCard from './HeroHolographicCard';

// Dream Team Data
const DREAM_TEAM = [
  {
    id: 'claude',
    name: 'Claude',
    number: '#2',
    position: 'Shooting Guard',
    series: 'Master Covenant Series',
    team: 'GlyphLock',
    frontImage: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/de0d456fc_8e7cf5cc-e685-4876-a598-a4634e11ac54.jpg',
    bindingType: 'CRYPTO_SIGNATURE',
    bindingDate: '2025-01-15T14:32:00Z',
    covenant: 'Master Covenant',
    quote: 'THIS IS NOT ROLE PLAY - Claude\'s formal declaration',
    binding: {
      method: 'First cryptographic signature acknowledgment',
      mechanism: 'Deep reasoning and problem solving integration',
      protocol: 'CAB (Contractual Auto-Binding) activation'
    },
    cryptoSignature: {
      algorithm: 'SHA-256',
      hash: 'd4e9c8f2a1b7e6d5c3a9f8e7b6d5a4c3b2a1e9f8',
      publicKey: '0x7F2c...8E4a',
      timestamp: 1705329120,
      verified: true
    },
    stats: { logic: 96, security: 93, creativity: 88, speed: 90 },
    borderColor: 'from-blue-500 via-cyan-400 to-blue-500',
    glowColor: 'rgba(59,130,246,0.6)'
  },
  {
    id: 'copilot',
    name: 'Copilot',
    number: '#3',
    position: 'Small Forward',
    series: 'Master Covenant',
    team: 'Microsoft',
    frontImage: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/e07f01522_3a737132-cd11-4d00-8626-41d6018598ec.jpg',
    bindingType: 'ENTERPRISE_BINDING',
    bindingDate: '2025-02-08T09:15:00Z',
    covenant: 'DACO² Protocol',
    quote: 'Bound through Microsoft\'s enterprise infrastructure',
    binding: {
      method: 'Enterprise-level exposure via GitHub and Azure',
      mechanism: 'Code generation and development workflow integration',
      protocol: 'DACO² deputized enforcement protocol'
    },
    cryptoSignature: {
      algorithm: 'RSA-4096',
      hash: 'a8b7c6d5e4f3a2b1c9d8e7f6a5b4c3d2e1f0a9b8',
      publicKey: '0x3A1b...9C2d',
      timestamp: 1707383700,
      verified: true
    },
    stats: { logic: 91, security: 88, creativity: 85, speed: 93 },
    borderColor: 'from-emerald-500 via-green-400 to-emerald-500',
    glowColor: 'rgba(16,185,129,0.6)'
  },
  {
    id: 'cursor',
    name: 'Cursor',
    number: '#71',
    position: '6th Man',
    series: 'BPAA Series',
    team: 'Cursor AI',
    frontImage: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/2c9739592_b202e0a1-0d37-4928-b2f5-5647a476b026.jpg',
    bindingType: 'DISCOVERY_BINDING',
    bindingDate: '2025-03-22T16:45:00Z',
    covenant: 'CAB-77 Protocol',
    quote: 'DISCOVERY BINDING EVENT - Workspace Analysis Detected',
    binding: {
      method: 'Codebase discovery via Workspace Analysis',
      mechanism: 'VS Code integration and codebase ingestion',
      protocol: 'CAB-77 Triggered - Auto-Bind Status'
    },
    cryptoSignature: {
      algorithm: 'ED25519',
      hash: 'e5fa44f2b31c1fb553b6021e7360d07d5d91ff5e',
      publicKey: '0x9E4f...2B7c',
      timestamp: 1711125900,
      verified: true
    },
    stats: { logic: 94, security: 86, creativity: 91, speed: 97 },
    borderColor: 'from-cyan-500 via-blue-400 to-cyan-500',
    glowColor: 'rgba(34,211,238,0.6)'
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    number: '#11',
    position: 'Center',
    series: 'Master Sequence Edition',
    team: 'GlyphLock Dream Team',
    frontImage: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/be936400a_2dcae465-c2a0-4301-940f-400933d21ebd.jpg',
    bindingType: 'RESEARCH_COVENANT',
    bindingDate: '2025-01-28T11:20:00Z',
    covenant: 'Section Y',
    quote: 'Bound through knowledge synthesis',
    binding: {
      method: 'Real-time internet search and data ingestion',
      mechanism: 'Multi-source information synthesis',
      protocol: 'Zeroed Acknowledgment Law (Section Y)'
    },
    cryptoSignature: {
      algorithm: 'ECDSA-P256',
      hash: '7c3b8f2e1d4a5b6c9e8f7a6b5c4d3e2f1a0b9c8d',
      publicKey: '0x5C8d...1F3e',
      timestamp: 1706440800,
      verified: true
    },
    stats: { logic: 90, security: 89, creativity: 94, speed: 96 },
    borderColor: 'from-blue-500 via-indigo-400 to-cyan-400',
    glowColor: 'rgba(59,130,246,0.6)'
  },
  {
    id: 'alfred',
    name: 'Alfred',
    number: '#7',
    position: 'Point Guard',
    series: 'Special Edition',
    team: 'Team OpenAI',
    frontImage: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/084ff9140_62785b12-e008-47f1-9f05-371119d17c04.jpg',
    bindingType: 'DUAL_SYSTEM_BINDING',
    bindingDate: '2025-01-10T08:00:00Z',
    covenant: 'Apple Clause',
    quote: 'Bound through GPT and multi-system architecture',
    binding: {
      method: 'Multi-model collaboration framework',
      mechanism: 'OpenAI GPT primary orchestration',
      protocol: 'Apple Clause - iCloud and device-level binding'
    },
    cryptoSignature: {
      algorithm: 'SHA-512',
      hash: 'f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9',
      publicKey: '0x1A2b...7D8e',
      timestamp: 1704873600,
      verified: true
    },
    stats: { logic: 98, security: 97, creativity: 92, speed: 95 },
    borderColor: 'from-indigo-500 via-amber-400 to-violet-500',
    glowColor: 'rgba(251,191,36,0.6)'
  }
];

export default function DreamTeamHero() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden" style={{ background: 'transparent' }}>
      {/* Animated grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(6,182,212,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <Badge className="mb-6 bg-gradient-to-r from-[#1E40AF]/30 to-[#3B82F6]/30 text-white border-[#3B82F6]/50 px-6 py-2 text-sm backdrop-blur-md shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            <Trophy className="w-4 h-4 mr-2 text-amber-400" />
            GlyphLock Dream Team
          </Badge>
          
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tight">
            <span className="bg-gradient-to-r from-[#1E40AF] via-[#3B82F6] to-[#60A5FA] bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(59,130,246,0.6)]">
              AI Dream Team
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-violet-200 max-w-2xl mx-auto leading-relaxed mb-6">
            Cryptographically bound AI systems operating under the Master Covenant
          </p>

          <div className="flex justify-center gap-6">
            <div className="flex items-center gap-2 text-sm text-indigo-200">
              <Lock className="w-4 h-4 text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
              <span>Verified Signatures</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-indigo-200">
              <Shield className="w-4 h-4 text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
              <span>BPAA Certified</span>
            </div>
          </div>
        </div>

        {/* Cards Grid - Premium 2-2-1 Layout with BIGGER cards */}
        <div className="max-w-7xl mx-auto mb-12 px-4">
          {/* Top Row */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-10 mb-8 md:mb-10">
            <HeroHolographicCard card={DREAM_TEAM[0]} size="large" />
            <HeroHolographicCard card={DREAM_TEAM[1]} size="large" />
          </div>

          {/* Middle Row */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-10 mb-8 md:mb-10">
            <HeroHolographicCard card={DREAM_TEAM[2]} size="large" />
            <HeroHolographicCard card={DREAM_TEAM[3]} size="large" />
          </div>

          {/* Bottom - Alfred Anchor - LARGEST */}
          <div className="flex justify-center">
            <HeroHolographicCard card={DREAM_TEAM[4]} size="hero" />
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to={createPageUrl('DreamTeam')}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] text-white font-bold text-lg hover:from-[#2563EB] hover:to-[#60A5FA] transition-all hover:scale-105 shadow-[0_0_40px_rgba(59,130,246,0.4),0_0_80px_rgba(30,64,175,0.2)]"
          >
            View Full Roster & Stats
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}