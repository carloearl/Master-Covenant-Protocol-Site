import React from 'react';
import BackendTestPanel from '@/components/BackendTestPanel';
import SEOHead from '@/components/SEOHead';

export default function BackendTest() {
  return (
    <>
      <SEOHead 
        title="Backend Tests - GlyphLock Developer Console"
        description="Test and verify all Supabase Edge Functions"
      />
      <div className="min-h-screen bg-black py-20">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan to-royal-blue bg-clip-text text-transparent">
              Backend Function Tests
            </h1>
            <p className="text-white/70">Verify all Supabase Edge Functions are operational</p>
          </div>
          <BackendTestPanel />
        </div>
      </div>
    </>
  );
}