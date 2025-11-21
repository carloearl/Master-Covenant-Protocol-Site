import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Database, Code, Terminal, CheckCircle2 } from 'lucide-react';

export default function SupabaseBackendGuide() {
  const supabaseConfig = {
    url: "https://kygisdokikvzgzwonzxk.supabase.co",
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5Z2lzZG9raWt2emd6d29uenhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3NDU2MTIsImV4cCI6MjA3OTMyMTYxMn0.W9bN3UvoWWvkUridK71JVGsvB7f8gPhDv5OyGiEiIIs"
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan to-royal-blue bg-clip-text text-transparent">
            GlyphLock Supabase Backend
          </h1>
          <p className="text-white/70">Enterprise-grade architecture with Deno Edge Functions</p>
        </div>

        <div className="grid gap-6 mb-8">
          <Card className="glass-card border-cyan/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Database className="w-5 h-5 text-cyan" />
                Supabase Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-white">
              <div>
                <p className="text-sm text-white/70 mb-1">Project URL:</p>
                <code className="block bg-black/50 p-3 rounded border border-cyan/20 text-cyan text-sm overflow-x-auto">
                  {supabaseConfig.url}
                </code>
              </div>
              <div>
                <p className="text-sm text-white/70 mb-1">Anon Key:</p>
                <code className="block bg-black/50 p-3 rounded border border-cyan/20 text-cyan text-xs overflow-x-auto break-all">
                  {supabaseConfig.anonKey}
                </code>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-royal-blue/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Terminal className="w-5 h-5 text-royal-blue" />
                Required Secrets (Set in Supabase Dashboard)
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white">
              <ul className="space-y-2">
                {[
                  'SUPABASE_URL',
                  'SUPABASE_ANON_KEY', 
                  'SUPABASE_SERVICE_ROLE_KEY',
                  'BASE_URL (https://glyphlock.io)',
                  'KEY_PEPPER (random string)',
                  'STRIPE_SECRET_KEY',
                  'STRIPE_WEBHOOK_SECRET'
                ].map((secret) => (
                  <li key={secret} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <code className="text-sm">{secret}</code>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="glass-card border-ultraviolet/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Code className="w-5 h-5 text-ultraviolet" />
                Deployment Commands
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-white/70 mb-2">1. Install Supabase CLI:</p>
                  <code className="block bg-black/50 p-3 rounded border border-ultraviolet/20 text-sm">
                    npm i supabase --save-dev<br/>
                    npx supabase login
                  </code>
                </div>
                <div>
                  <p className="text-sm text-white/70 mb-2">2. Link Project:</p>
                  <code className="block bg-black/50 p-3 rounded border border-ultraviolet/20 text-sm">
                    npx supabase link --project-ref kygisdokikvzgzwonzxk
                  </code>
                </div>
                <div>
                  <p className="text-sm text-white/70 mb-2">3. Push Database Schema:</p>
                  <code className="block bg-black/50 p-3 rounded border border-ultraviolet/20 text-sm">
                    npx supabase db push
                  </code>
                </div>
                <div>
                  <p className="text-sm text-white/70 mb-2">4. Deploy Functions:</p>
                  <code className="block bg-black/50 p-3 rounded border border-ultraviolet/20 text-sm overflow-x-auto">
                    npx supabase functions deploy health<br/>
                    npx supabase functions deploy keys-generate<br/>
                    npx supabase functions deploy keys-rotate<br/>
                    npx supabase functions deploy stripe-checkout<br/>
                    npx supabase functions deploy stripe-webhook<br/>
                    npx supabase functions deploy sdk-generate<br/>
                    npx supabase functions deploy crm-sync<br/>
                    npx supabase functions deploy logs-list<br/>
                    npx supabase functions deploy admin-users-list<br/>
                    npx supabase functions deploy admin-users-update
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-cyan/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Shield className="w-5 h-5 text-cyan" />
                Backend Structure
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white">
              <pre className="bg-black/50 p-4 rounded border border-cyan/20 text-xs overflow-x-auto">
{`supabase/
  functions/
    _shared/
      cors.ts          # CORS headers
      auth.ts          # JWT auth helpers
      db.ts            # Supabase clients
      security.ts      # Key generation
      types.ts         # TypeScript types
    
    health/
      index.ts         # Health check
    
    keys-generate/
      index.ts         # Generate API keys
    
    keys-rotate/
      index.ts         # Rotate secret keys
    
    sdk-generate/
      index.ts         # SDK distribution
    
    stripe-checkout/
      index.ts         # Stripe checkout
    
    stripe-webhook/
      index.ts         # Stripe webhooks
    
    crm-sync/
      index.ts         # CRM integration
    
    logs-list/
      index.ts         # Audit logs
    
    admin-users-list/
      index.ts         # Admin users
    
    admin-users-update/
      index.ts         # Admin updates
  
  migrations/
    0001_glyphlock_core.sql  # Core schema`}
              </pre>
            </CardContent>
          </Card>

          <Card className="glass-card border-green-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                Next Steps
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white">
              <ol className="space-y-3 list-decimal list-inside">
                <li>Download the full backend structure (see download links below)</li>
                <li>Place files in your project root directory</li>
                <li>Run the deployment commands above</li>
                <li>Create "sdks" storage bucket in Supabase Dashboard</li>
                <li>Test health endpoint: <code className="text-cyan">https://kygisdokikvzgzwonzxk.supabase.co/functions/v1/health</code></li>
                <li>Update Base44 frontend to call Supabase functions</li>
              </ol>
            </CardContent>
          </Card>
        </div>

        <div className="glass-card border-royal-blue/30 p-6">
          <h3 className="text-xl font-bold mb-4 text-white">Download Complete Backend Structure</h3>
          <p className="text-white/70 mb-4">
            All TypeScript files, migrations, and configuration are ready. Copy the structure from the initial message and create these files in your separate backend repository.
          </p>
          <div className="bg-black/50 p-4 rounded border border-royal-blue/20">
            <p className="text-sm text-white/70 mb-2">Function Base URL:</p>
            <code className="text-cyan text-sm">
              https://kygisdokikvzgzwonzxk.supabase.co/functions/v1/
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}