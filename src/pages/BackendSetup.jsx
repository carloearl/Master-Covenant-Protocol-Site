import React from 'react';
import SupabaseBackendGuide from '@/components/SupabaseBackendGuide';
import SEOHead from '@/components/SEOHead';

export default function BackendSetup() {
  return (
    <>
      <SEOHead 
        title="Backend Setup - GlyphLock Enterprise Architecture"
        description="Complete guide to deploying GlyphLock's Supabase backend with Deno Edge Functions"
      />
      <SupabaseBackendGuide />
    </>
  );
}