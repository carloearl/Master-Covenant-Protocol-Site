/**
 * CTA Section Component
 * Final conversion section
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Mail, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function CTASection() {
  return (
    <section className="py-16 bg-gradient-to-br from-[#0a1324] via-[#1a244b] to-[#1e293b]">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
            Ready to Implement Accountable AI?
          </h2>
          <p className="text-lg md:text-xl text-blue-100 mb-8 leading-relaxed">
            GlyphLock's Master Covenant framework brings federal-grade AI accountability 
            to your enterprise. Request early access to our platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to={createPageUrl('Consultation')}>
              <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100 w-full sm:w-auto">
                <Mail className="w-5 h-5 mr-2" />
                Schedule Consultation
              </Button>
            </Link>
            <Link to={createPageUrl('Contact')}>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto">
                <FileText className="w-5 h-5 mr-2" />
                Request Demo
              </Button>
            </Link>
          </div>

          {/* Use Cases */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <UseCaseCard
              icon="⚖️"
              title="Legal & Compliance"
              description="AI governance for law firms and regulatory bodies"
            />
            <UseCaseCard
              icon="📰"
              title="Media & Publishing"
              description="Content authenticity verification"
            />
            <UseCaseCard
              icon="🏦"
              title="Financial Services"
              description="AI-generated report validation"
            />
            <UseCaseCard
              icon="🏥"
              title="Healthcare"
              description="Medical AI accountability"
            />
          </div>

          {/* Social Proof */}
          <div className="border-t border-blue-400/30 pt-8">
            <p className="text-sm text-blue-200 mb-4">
              Validated by NIST • Patent-Pending Technology • Enterprise Ready
            </p>
            <div className="flex justify-center gap-6 flex-wrap">
              <Link to={createPageUrl('About')} className="text-sm text-blue-200 hover:text-white transition-colors">
                Learn More About GlyphLock
              </Link>
              <Link to={createPageUrl('MasterCovenant')} className="text-sm text-blue-200 hover:text-white transition-colors">
                Read Master Covenant Spec
              </Link>
              <Link to={createPageUrl('Pricing')} className="text-sm text-blue-200 hover:text-white transition-colors">
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function UseCaseCard({ icon, title, description }) {
  return (
    <div className="p-4 md:p-6 rounded-lg bg-blue-800/20 backdrop-blur-sm border-2 border-blue-600/40 hover:bg-blue-800/30 hover:border-blue-500/60 transition-all shadow-[0_0_10px_rgba(90,0,200,0.15)]">
      <div className="text-3xl mb-3" aria-hidden="true">{icon}</div>
      <h4 className="font-bold text-blue-100 mb-2 text-sm md:text-base">{title}</h4>
      <p className="text-xs md:text-sm text-blue-200 leading-relaxed">{description}</p>
    </div>
  );
}