import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Book, Shield, Key, Code, Webhook, FileJson, Layout, 
  ChevronRight, ExternalLink, Lock, Server, Terminal, AlertTriangle
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SEOHead from "@/components/SEOHead";
import DeveloperKeys from "@/components/dashboard/DeveloperKeys";

const SECTIONS = [
  { id: "api-keys", label: "API Key Management", icon: Key },
  { id: "quickstart", label: "Quickstart", icon: Terminal },
  { id: "authentication", label: "Authentication", icon: Lock },
  { id: "endpoints", label: "Core Endpoints", icon: Server },
  { id: "sdks", label: "SDKs & Libraries", icon: Code },
  { id: "webhooks", label: "Webhooks", icon: Webhook },
  { id: "security", label: "Security & Compliance", icon: Shield },
];

export default function DeveloperConsole() {
  const [activeSection, setActiveSection] = useState("api-keys");

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      <SEOHead 
        title="GlyphLock Developer API Console" 
        description="Public, Secret, and Environment API Keys with rotating cryptographic GlyphHash, blockchain logs, and enterprise SDKs."
      />

      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-blue-900/30 bg-black/95 fixed h-full overflow-y-auto hidden md:block z-20">
        <div className="p-6 border-b border-blue-900/30">
          <Link to={createPageUrl("Home")} className="flex items-center gap-2">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/d92107808_glyphlock-3d-logo.png"
              alt="GlyphLock"
              className="h-6 w-auto"
            />
            <span className="font-bold tracking-tight">Developers</span>
          </Link>
        </div>
        <nav className="p-4 space-y-1">
          {SECTIONS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                activeSection === item.id 
                  ? "bg-blue-900/30 text-blue-400 font-medium" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-6 mt-auto border-t border-blue-900/30">
          <div className="bg-blue-950/30 rounded-lg p-3 border border-blue-500/20">
            <h4 className="text-xs font-bold text-blue-400 mb-1">API Status</h4>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-gray-300">All Systems Operational</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 min-h-screen bg-gradient-to-b from-black via-blue-950/10 to-black">
        
        {/* Top Bar */}
        <header className="h-16 border-b border-blue-900/30 bg-black/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-8">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>Console</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">v1.4.2</span>
          </div>
          <div className="flex items-center gap-4">
             <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Book className="w-4 h-4 mr-2" />
                Docs
             </Button>
             <Button variant="outline" size="sm" className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
                Enterprise Support
             </Button>
          </div>
        </header>

        <div className="max-w-5xl mx-auto p-8 space-y-20">

          {/* 1. API Key Management Center */}
          <section id="api-keys" className="scroll-mt-24">
            <DeveloperKeys />
          </section>

          {/* 2. Quickstart */}
          <section id="quickstart" className="scroll-mt-24 space-y-6">
            <div className="border-b border-gray-800 pb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Terminal className="w-6 h-6 text-blue-400" />
                Quickstart
              </h2>
              <p className="text-gray-400 mt-1">Get up and running with GlyphLock in less than 2 minutes.</p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-3">
                <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-800">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white mb-4">1</div>
                    <h3 className="font-bold text-white mb-2">Install SDK</h3>
                    <p className="text-sm text-gray-400">Install our lightweight, zero-dependency SDK for your platform.</p>
                </div>
                <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-800">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white mb-4">2</div>
                    <h3 className="font-bold text-white mb-2">Configure Keys</h3>
                    <p className="text-sm text-gray-400">Export your Tri-Keys as environment variables in your project.</p>
                </div>
                <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-800">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white mb-4">3</div>
                    <h3 className="font-bold text-white mb-2">Glyph Bind</h3>
                    <p className="text-sm text-gray-400">Bind your assets or logic to the secure GlyphLock network.</p>
                </div>
            </div>

            <div className="bg-black rounded-xl border border-gray-800 overflow-hidden">
                <div className="flex items-center gap-4 px-4 py-2 bg-gray-900/50 border-b border-gray-800">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/20" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                        <div className="w-3 h-3 rounded-full bg-green-500/20" />
                    </div>
                    <span className="text-xs text-gray-500 font-mono">bash</span>
                </div>
                <div className="p-4 font-mono text-sm text-gray-300">
                    <p><span className="text-blue-400">$</span> npm install @glyphlock/sdk</p>
                    <p className="mt-2"><span className="text-blue-400">$</span> export GLX_SECRET_KEY="GLX-SEC-..."</p>
                    <p className="mt-2"><span className="text-blue-400">$</span> node app.js</p>
                    <p className="mt-4 text-green-400">✓ GlyphLock Secure Tunnel Established (24ms)</p>
                </div>
            </div>
          </section>

          {/* 3. Authentication */}
          <section id="authentication" className="scroll-mt-24 space-y-6">
             <div className="border-b border-gray-800 pb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Lock className="w-6 h-6 text-purple-400" />
                Authentication
              </h2>
              <p className="text-gray-400 mt-1">All API requests must be authenticated using Bearer tokens or Signature Headers.</p>
            </div>
            
            <div className="prose prose-invert max-w-none text-gray-300">
                <p>
                    GlyphLock uses a dual-layer authentication strategy. For client-side requests, use your 
                    <code className="mx-1 px-1 bg-gray-800 rounded text-blue-300">GLX-PUB</code> key. 
                    For server-side operations, use your <code className="mx-1 px-1 bg-gray-800 rounded text-purple-300">GLX-SEC</code> key.
                </p>
                <p className="mt-4">
                    Requests without valid authentication will return <code className="text-red-400">401 Unauthorized</code>.
                </p>
            </div>

            <Tabs defaultValue="js" className="w-full">
                <TabsList className="bg-gray-900 border border-gray-800">
                    <TabsTrigger value="js">Node.js</TabsTrigger>
                    <TabsTrigger value="curl">cURL</TabsTrigger>
                    <TabsTrigger value="python">Python</TabsTrigger>
                </TabsList>
                <TabsContent value="js" className="mt-4">
                    <div className="bg-black rounded-xl border border-gray-800 p-4 font-mono text-sm text-gray-300">
<pre>{`import { GlyphClient } from '@glyphlock/sdk';

const client = new GlyphClient({
  secretKey: process.env.GLX_SECRET_KEY
});

const status = await client.auth.verify();
console.log(status); // { active: true, environment: 'live' }`}</pre>
                    </div>
                </TabsContent>
                <TabsContent value="curl" className="mt-4">
                    <div className="bg-black rounded-xl border border-gray-800 p-4 font-mono text-sm text-gray-300">
<pre>{`curl -X GET https://api.glyphlock.io/v1/auth/verify \\
  -H "Authorization: Bearer GLX-SEC-LIVE-..." \\
  -H "Content-Type: application/json"`}</pre>
                    </div>
                </TabsContent>
                <TabsContent value="python" className="mt-4">
                    <div className="bg-black rounded-xl border border-gray-800 p-4 font-mono text-sm text-gray-300">
<pre>{`from glyphlock import GlyphClient

client = GlyphClient(secret_key="GLX-SEC-...")
status = client.auth.verify()
print(status)`}</pre>
                    </div>
                </TabsContent>
            </Tabs>
          </section>

          {/* 4. Endpoints */}
          <section id="endpoints" className="scroll-mt-24 space-y-6">
             <div className="border-b border-gray-800 pb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Server className="w-6 h-6 text-green-400" />
                Core Endpoints
              </h2>
              <p className="text-gray-400 mt-1">Direct REST API access for custom integrations.</p>
            </div>

            <div className="space-y-4">
                {[
                    { method: "POST", path: "/v1/glyph/bind", desc: "Bind data to a secure glyph hash" },
                    { method: "GET", path: "/v1/glyph/{id}", desc: "Retrieve verified glyph data" },
                    { method: "POST", path: "/v1/hotzone/scan", desc: "Initiate a security scan" },
                    { method: "POST", path: "/v1/steganography/embed", desc: "Embed hidden data into media" },
                ].map((ep, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-gray-900/30 border border-gray-800 hover:border-gray-700 transition-colors">
                        <div className="flex items-center gap-4">
                            <Badge variant="outline" className={`
                                ${ep.method === 'GET' ? 'text-blue-400 border-blue-900' : ''}
                                ${ep.method === 'POST' ? 'text-green-400 border-green-900' : ''}
                            `}>{ep.method}</Badge>
                            <code className="text-sm text-gray-300 font-mono">{ep.path}</code>
                        </div>
                        <span className="text-sm text-gray-500">{ep.desc}</span>
                    </div>
                ))}
            </div>
          </section>

           {/* 5. SDKs */}
           <section id="sdks" className="scroll-mt-24 space-y-6">
             <div className="border-b border-gray-800 pb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Code className="w-6 h-6 text-yellow-400" />
                SDKs & Libraries
              </h2>
              <p className="text-gray-400 mt-1">Official libraries for every major platform.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Node.js', 'Python', 'Go', 'Java', '.NET', 'Ruby', 'PHP', 'Rust'].map((lang) => (
                    <div key={lang} className="p-4 rounded-lg bg-gray-900/30 border border-gray-800 hover:border-blue-500/50 transition-all cursor-pointer group">
                        <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors">{lang}</h4>
                        <p className="text-xs text-gray-500 mt-1">v2.1.0 • Official</p>
                    </div>
                ))}
            </div>
          </section>

          {/* 6. Webhooks */}
          <section id="webhooks" className="scroll-mt-24 space-y-6">
             <div className="border-b border-gray-800 pb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Webhook className="w-6 h-6 text-pink-400" />
                Webhooks
              </h2>
              <p className="text-gray-400 mt-1">Real-time event notifications for your application.</p>
            </div>

            <div className="bg-blue-950/10 border border-blue-500/20 rounded-lg p-6">
                <h3 className="font-bold text-white mb-2">Event Types</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> glyph.created</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> hotzone.alert</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> security.breach_attempt</li>
                </ul>
                <div className="mt-4 pt-4 border-t border-blue-500/20">
                    <Button variant="outline" size="sm" className="border-blue-500/30 text-blue-400">Manage Webhooks</Button>
                </div>
            </div>
          </section>

          {/* 7. Security */}
          <section id="security" className="scroll-mt-24 space-y-6 pb-20">
             <div className="border-b border-gray-800 pb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Shield className="w-6 h-6 text-red-400" />
                Security & Compliance
              </h2>
              <p className="text-gray-400 mt-1">Enterprise-grade security standards and certifications.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl bg-gray-900/30 border border-gray-800">
                    <Shield className="w-8 h-8 text-green-500 mb-4" />
                    <h3 className="font-bold text-white mb-2">SOC 2 Type II</h3>
                    <p className="text-sm text-gray-400">GlyphLock is fully compliant with SOC 2 Type II standards for security, availability, and confidentiality.</p>
                </div>
                <div className="p-6 rounded-xl bg-gray-900/30 border border-gray-800">
                    <Lock className="w-8 h-8 text-purple-500 mb-4" />
                    <h3 className="font-bold text-white mb-2">End-to-End Encryption</h3>
                    <p className="text-sm text-gray-400">All data is encrypted in transit (TLS 1.3) and at rest (AES-256-GCM).</p>
                </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}