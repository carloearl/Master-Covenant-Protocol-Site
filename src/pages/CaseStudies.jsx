/**
 * GlyphLock Case Studies & Research Hub
 * Federal-grade case study archive
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, FileText, Scale, Shield, Trophy } from 'lucide-react';
import SEOHead from '@/components/SEOHead';

const CASE_STUDIES = [
  {
    id: 'covenant-litigation-victory',
    title: 'Master Covenant Litigation Victory',
    date: 'December 3, 2025',
    category: 'Legal Victory',
    icon: Trophy,
    badge: 'Landmark Ruling',
    badgeColor: 'bg-green-600',
    summary: 'Judicial Review Panel upholds GlyphLock Master Covenant enforceability in comprehensive multi-round litigation simulation.',
    keyPoints: [
      'Complete legal validation of Covenant architecture',
      'Operator liability framework upheld',
      'IP sovereignty mechanisms confirmed enforceable',
      'Internal governance charter validated'
    ],
    outcome: 'Judgment for Defendant',
    url: 'CaseStudyCovenantVictory'
  }
];

export default function CaseStudies() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1324] via-[#1a244b] to-[#1e293b] py-20">
      <SEOHead
        title="Case Studies & Research - GlyphLock Security"
        description="Explore GlyphLock's legal victories, technical validations, and federal evaluation outcomes in AI accountability and cybersecurity."
        keywords={['GlyphLock case studies', 'Master Covenant litigation', 'AI accountability research', 'legal tech victories', 'cybersecurity validation']}
        url="/case-studies"
      />

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Scale className="w-10 h-10 text-blue-400" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              Case Studies & Research
            </h1>
          </div>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Legal victories, federal validations, and technical breakthroughs in AI accountability
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto">
          <StatCard number="1" label="Legal Victories" />
          <StatCard number="0" label="Defeats" />
          <StatCard number="100%" label="Success Rate" />
          <StatCard number="2025" label="Active Year" />
        </div>

        {/* Case Studies Grid */}
        <div className="max-w-6xl mx-auto space-y-6">
          {CASE_STUDIES.map((study) => (
            <CaseStudyCard key={study.id} study={study} />
          ))}
        </div>

        {/* Coming Soon */}
        <div className="mt-12 text-center">
          <Card className="bg-blue-900/30 border-blue-700/40 backdrop-blur-sm max-w-2xl mx-auto">
            <CardContent className="pt-8 pb-8">
              <FileText className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">More Case Studies Coming Soon</h3>
              <p className="text-blue-200">
                NIST GenAI Challenge outcomes, federal evaluations, and technical validation reports will be published here as they become available.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function CaseStudyCard({ study }) {
  const Icon = study.icon;
  
  return (
    <Card className="bg-blue-900/30 border-blue-700/40 backdrop-blur-sm hover:border-blue-500/60 transition-all group">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <Icon className="w-6 h-6 text-blue-400" />
              <Badge className={`${study.badgeColor} text-white font-bold`}>
                {study.badge}
              </Badge>
              <span className="text-sm text-blue-200">{study.date}</span>
            </div>
            <CardTitle className="text-2xl md:text-3xl text-white mb-3">
              {study.title}
            </CardTitle>
            <CardDescription className="text-base text-blue-100">
              {study.summary}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Key Points */}
        <div>
          <h4 className="text-sm font-bold text-blue-300 mb-3 uppercase">Key Findings</h4>
          <div className="grid md:grid-cols-2 gap-3">
            {study.keyPoints.map((point, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-blue-100">{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Outcome Banner */}
        <div className="bg-green-900/30 border-2 border-green-600 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-green-400" />
            <div>
              <div className="text-sm text-green-300 font-medium">Final Outcome</div>
              <div className="text-lg font-bold text-white">{study.outcome}</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <Link to={createPageUrl(study.url)}>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold group-hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]">
            Read Full Case Study
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

function StatCard({ number, label }) {
  return (
    <div className="bg-blue-900/30 border-2 border-blue-700/40 backdrop-blur-sm rounded-lg p-4 text-center">
      <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-1">{number}</div>
      <div className="text-xs md:text-sm text-blue-200 font-medium">{label}</div>
    </div>
  );
}