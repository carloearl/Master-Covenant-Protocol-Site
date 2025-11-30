import React, { useState } from "react";
import SEOHead from "@/components/SEOHead";
import { 
  Terminal, Package, Zap, Shield, QrCode, Link2, Webhook, 
  Copy, Check, ChevronRight, Download, Github, Book, Code2,
  Lock, Brain, Fingerprint
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CodeBlock = ({ code, language = "typescript", title }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
      {title && (
        <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-slate-800">
          <span className="text-xs text-slate-400 font-mono">{title}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}
      <pre className="p-4 overflow-x-auto text-sm">
        <code className="text-slate-300 font-mono whitespace-pre">{code}</code>
      </pre>
    </div>
  );
};

const Section = ({ id, title, icon: Icon, children }) => (
  <section id={id} className="scroll-mt-24">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-fuchsia-500/20 border border-cyan-400/40 flex items-center justify-center">
        <Icon className="w-5 h-5 text-cyan-400" />
      </div>
      <h2 className="text-2xl font-bold text-white">{title}</h2>
    </div>
    {children}
  </section>
);

export default function SDKDocs() {
  const navItems = [
    { id: "installation", label: "Installation", icon: Package },
    { id: "quickstart", label: "Quick Start", icon: Zap },
    { id: "chain", label: "AI Chain", icon: Brain },
    { id: "qr", label: "Steganographic QR", icon: QrCode },
    { id: "covenant", label: "Covenant", icon: Shield },
    { id: "webhooks", label: "Webhooks", icon: Webhook },
    { id: "errors", label: "Error Handling", icon: Lock },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <SEOHead
        title="GlyphLock SDK Documentation - Node.js SDK for Security & AI Orchestration"
        description="Official documentation for @glyphlock/sdk. Generate steganographic QR codes, verify covenant access, and orchestrate AI chains across OpenAI, Anthropic, and Gemini."
      />

      {/* Hero */}
      <div className="relative pt-24 pb-16 px-4 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(6,182,212,0.15),transparent_50%)]" />
        
        <div className="max-w-6xl mx-auto relative">
          <div className="flex items-center gap-3 mb-4">
            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50">v1.0.0</Badge>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/50">Stable</Badge>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-fuchsia-400 bg-clip-text text-transparent">
              @glyphlock/sdk
            </span>
          </h1>
          
          <p className="text-xl text-slate-400 max-w-2xl mb-8">
            The official Node.js SDK for GlyphLock. Steganographic security, covenant enforcement, and AI chain orchestration.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500">
              <Download className="w-4 h-4 mr-2" />
              npm install @glyphlock/sdk
            </Button>
            <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
              <Github className="w-4 h-4 mr-2" />
              View on GitHub
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex gap-12">
          {/* Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <nav className="sticky top-24 space-y-1">
              <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-4">
                Documentation
              </div>
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </a>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <main className="flex-1 space-y-16">
            
            {/* Installation */}
            <Section id="installation" title="Installation" icon={Package}>
              <p className="text-slate-400 mb-6">
                Install the GlyphLock SDK using npm, yarn, or pnpm:
              </p>
              
              <Tabs defaultValue="npm" className="mb-6">
                <TabsList className="bg-slate-900 border border-slate-800">
                  <TabsTrigger value="npm">npm</TabsTrigger>
                  <TabsTrigger value="yarn">yarn</TabsTrigger>
                  <TabsTrigger value="pnpm">pnpm</TabsTrigger>
                </TabsList>
                <TabsContent value="npm" className="mt-4">
                  <CodeBlock code="npm install @glyphlock/sdk" language="bash" />
                </TabsContent>
                <TabsContent value="yarn" className="mt-4">
                  <CodeBlock code="yarn add @glyphlock/sdk" language="bash" />
                </TabsContent>
                <TabsContent value="pnpm" className="mt-4">
                  <CodeBlock code="pnpm add @glyphlock/sdk" language="bash" />
                </TabsContent>
              </Tabs>

              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                <p className="text-sm text-amber-300">
                  <strong>Note:</strong> Always use environment variables for your API key. Never commit secrets to version control.
                </p>
              </div>
            </Section>

            {/* Quick Start */}
            <Section id="quickstart" title="Quick Start" icon={Zap}>
              <p className="text-slate-400 mb-6">
                Initialize the GlyphLock client with your API key and start making requests:
              </p>

              <CodeBlock
                title="lib/glyphlock.ts"
                code={`import { GlyphLock } from "@glyphlock/sdk";

const gl = new GlyphLock({
  apiKey: process.env.GLYPHLOCK_API_KEY!,
  chainMode: "openai-first",     // Primary: OpenAI, Fallback: Claude/Gemini
  environment: "production",
  timeoutMs: 30000
});

// AI Chain Example
const result = await gl.chainRun({
  input: "Draft an ability card for Alfred, the Glyph Architect.",
  model: "openai:gpt-4.1",
  fallback: ["anthropic:opus-3.5", "gemini:pro"],
  temperature: 0.4
});

console.log(result.output);
console.log("Model used:", result.modelUsed);
console.log("Latency:", result.latencyMs, "ms");`}
              />

              <div className="mt-6 grid md:grid-cols-3 gap-4">
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
                  <Brain className="w-6 h-6 text-cyan-400 mb-2" />
                  <h4 className="font-semibold text-white mb-1">AI Chain</h4>
                  <p className="text-xs text-slate-400">Orchestrate across OpenAI, Anthropic, Gemini with automatic fallback</p>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
                  <QrCode className="w-6 h-6 text-fuchsia-400 mb-2" />
                  <h4 className="font-semibold text-white mb-1">Stego QR</h4>
                  <p className="text-xs text-slate-400">Generate and decode steganographic QR codes</p>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
                  <Shield className="w-6 h-6 text-green-400 mb-2" />
                  <h4 className="font-semibold text-white mb-1">Covenant</h4>
                  <p className="text-xs text-slate-400">Verify access decisions with policy enforcement</p>
                </div>
              </div>
            </Section>

            {/* AI Chain */}
            <Section id="chain" title="AI Chain Orchestration" icon={Brain}>
              <p className="text-slate-400 mb-6">
                The chain module provides unified access to multiple AI providers with automatic fallback, health monitoring, and dynamic routing based on real-time performance metrics.
              </p>

              <CodeBlock
                title="Chain Configuration with Health Monitoring"
                code={`import { GlyphLock } from "@glyphlock/sdk";

const gl = new GlyphLock({
  apiKey: process.env.GLYPHLOCK_API_KEY!,
  chainMode: "gemini-first",        // Primary: Gemini (FREE), Fallback: OpenAI → Claude
  enableHealthRouting: true,        // Enable dynamic routing based on provider health
  maxRetries: 3,
  timeoutMs: 30000
});

// Run with health-aware fallback
const result = await gl.chainRun({
  input: "Analyze this smart contract for vulnerabilities...",
  persona: "SECURITY",              // Available: GENERAL, SECURITY, AUDIT, BLOCKCHAIN, DEBUGGER
  jsonMode: true,                   // Force JSON output (if provider supports it)
  temperature: 0.3,
  maxTokens: 2000,
  chainMode: "audit-optimized"      // Override chain mode for this call
});

// Response includes health metadata
console.log(result.output);
console.log("Provider:", result.provider);
console.log("Health Score:", result.meta.healthScore);
console.log("Latency:", result.latencyMs, "ms");
console.log("Attempts:", result.attemptCount);`}
              />

              <CodeBlock
                title="Audit Mode with Structured Output"
                code={`// Run security audit with structured JSON output
const audit = await gl.runAudit({
  target: "https://example.com/api/users",
  type: "api",
  context: {
    method: "POST",
    headers: { "Content-Type": "application/json" }
  }
});

// Audit returns structured data
console.log("Risk Score:", audit.audit.risk_score);       // 0-100
console.log("Severity:", audit.audit.severity);           // low/moderate/high/critical
console.log("Issues:", audit.audit.issues);               // Array of findings
console.log("Recommendations:", audit.audit.recommendations);`}
              />

              <CodeBlock
                title="Provider Health Monitoring"
                code={`// Get real-time health report
const health = gl.getHealthReport();

console.log("Providers:", health.providers);
// Each provider shows: successRate, avgLatencyMs, status, score

// Get recommended chain based on current health
const chain = gl.getRecommendedChain({
  requireJsonMode: true,   // Filter to JSON-capable providers
  requireAudit: true       // Filter to audit-capable providers
});

// Reset health metrics if needed
gl.resetHealth();

// Switch chain mode dynamically
gl.setChainMode("claude-first");`}
              />

              <div className="mt-6 grid md:grid-cols-2 gap-4">
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
                  <h4 className="font-semibold text-white mb-3">Chain Modes</h4>
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li><code className="text-green-400">gemini-first</code> — Gemini (FREE) → OpenAI → Claude</li>
                    <li><code className="text-cyan-400">openai-first</code> — GPT-4o → Gemini → Claude</li>
                    <li><code className="text-purple-400">claude-first</code> — Claude → OpenAI → Gemini</li>
                    <li><code className="text-amber-400">audit-optimized</code> — OpenAI → Claude → Gemini</li>
                    <li><code className="text-blue-400">free-only</code> — Gemini → OpenRouter only</li>
                    <li><code className="text-slate-400">balanced</code> — Load-balanced by health</li>
                  </ul>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
                  <h4 className="font-semibold text-white mb-3">Available Personas</h4>
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li><code className="text-cyan-400">GENERAL</code> — Default assistant mode</li>
                    <li><code className="text-red-400">SECURITY</code> — Threat & vulnerability focus</li>
                    <li><code className="text-amber-400">AUDIT</code> — Structured security analysis</li>
                    <li><code className="text-purple-400">BLOCKCHAIN</code> — Smart contracts & DeFi</li>
                    <li><code className="text-green-400">DEBUGGER</code> — Bug identification & fixes</li>
                    <li><code className="text-blue-400">ANALYTICS</code> — Data pattern analysis</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                <h4 className="font-semibold text-green-300 mb-2">JSON Mode per Provider</h4>
                <p className="text-sm text-slate-300 mb-3">
                  JSON mode is automatically enabled based on provider capabilities:
                </p>
                <ul className="space-y-1 text-sm text-slate-400">
                  <li>• <strong className="text-white">OpenAI</strong> — Full JSON schema support with strict mode</li>
                  <li>• <strong className="text-white">Gemini</strong> — JSON object mode via responseMimeType</li>
                  <li>• <strong className="text-white">Claude</strong> — JSON mode via system prompt</li>
                  <li>• <strong className="text-white">OpenRouter</strong> — Depends on underlying model</li>
                </ul>
              </div>
            </Section>

            {/* Steganographic QR */}
            <Section id="qr" title="Steganographic QR Codes" icon={QrCode}>
              <p className="text-slate-400 mb-6">
                Generate and decode QR codes with hidden steganographic payloads. Perfect for secure access tokens, covenant bindings, and tamper-evident markers.
              </p>

              <CodeBlock
                title="Encode & Decode"
                code={`import { GlyphLock } from "@glyphlock/sdk";
import fs from "fs";

const gl = new GlyphLock({ apiKey: process.env.GLYPHLOCK_API_KEY! });

// Encode data into a steganographic QR code
const encoded = await gl.qrEncode({
  data: "GLYPHLOCK::ACCESS::ALFRED",
  mode: "stego",           // "stego" for hidden payload, "raw" for plain QR
  level: "high",           // Error correction: low/medium/high/ultra
  format: "png",           // Output format: png/svg
  metadata: {
    role: "architect",
    tier: "S",
    expires: "2025-12-31"
  }
});

// Save to file
fs.writeFileSync("alfred-qr.png", encoded.imageBuffer);
console.log("Checksum:", encoded.checksum);

// Decode a QR code
const imageBuffer = fs.readFileSync("alfred-qr.png");
const decoded = await gl.qrDecode(imageBuffer);

console.log("Data:", decoded.data);
console.log("Mode:", decoded.mode);
console.log("Metadata:", decoded.metadata);`}
              />

              <div className="mt-6 grid md:grid-cols-2 gap-4">
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
                  <h4 className="font-semibold text-white mb-2">Security Levels</h4>
                  <ul className="space-y-1 text-sm text-slate-400">
                    <li><code className="text-green-400">low</code> — 7% error correction, max data</li>
                    <li><code className="text-yellow-400">medium</code> — 15% error correction</li>
                    <li><code className="text-orange-400">high</code> — 25% error correction</li>
                    <li><code className="text-red-400">ultra</code> — 30% + steganographic hardening</li>
                  </ul>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
                  <h4 className="font-semibold text-white mb-2">Use Cases</h4>
                  <ul className="space-y-1 text-sm text-slate-400">
                    <li>• Secure access tokens & passes</li>
                    <li>• Covenant binding proofs</li>
                    <li>• Tamper-evident product labels</li>
                    <li>• Hidden audit trails</li>
                  </ul>
                </div>
              </div>
            </Section>

            {/* Covenant */}
            <Section id="covenant" title="Covenant Verification" icon={Shield}>
              <p className="text-slate-400 mb-6">
                Verify access decisions against your covenant policies. Returns allow/deny decisions with reasoning and policy traces.
              </p>

              <CodeBlock
                title="Verify Access"
                code={`import { GlyphLock } from "@glyphlock/sdk";

const gl = new GlyphLock({ apiKey: process.env.GLYPHLOCK_API_KEY! });

// Verify if an action is allowed
const decision = await gl.covenantVerify({
  token: "user-session-or-signed-jwt",
  action: "read",
  resource: "/dream-team/alfred",
  context: {
    ip: "192.168.1.1",
    userAgent: "Mozilla/5.0...",
    timestamp: Date.now()
  }
});

if (!decision.allowed) {
  console.error("Access denied:", decision.reason);
  console.log("Policy ID:", decision.policyId);
  throw new Error(\`Forbidden: \${decision.reason}\`);
}

console.log("Access granted, trace:", decision.traceId);

// Response structure
interface CovenantVerifyResult {
  allowed: boolean;         // Whether the action is permitted
  reason?: string;          // Human-readable reason if denied
  policyId?: string;        // Which policy matched
  traceId?: string;         // Unique trace for audit logging
}`}
              />
            </Section>

            {/* Webhooks */}
            <Section id="webhooks" title="Webhooks" icon={Webhook}>
              <p className="text-slate-400 mb-6">
                Listen for real-time events from GlyphLock including covenant decisions, chain completions, and audit trail updates.
              </p>

              <CodeBlock
                title="Webhook Server"
                code={`import { GlyphLock } from "@glyphlock/sdk";

const gl = new GlyphLock({ apiKey: process.env.GLYPHLOCK_API_KEY! });

// Start webhook listener
const server = gl.listenWebhooks({
  port: 3001,
  path: "/glyphlock/webhook",
  secret: process.env.GLYPHLOCK_WEBHOOK_SECRET!,
  onEvent: async (event) => {
    console.log("Event received:", event.type, event.id);
    
    switch (event.type) {
      case "covenant.verified":
        console.log("Covenant check:", event.payload);
        break;
      case "chain.completed":
        console.log("Chain finished:", event.payload.modelUsed);
        break;
      case "qr.decoded":
        console.log("QR scanned:", event.payload.data);
        break;
      default:
        console.log("Unknown event:", event);
    }
  }
});

// Graceful shutdown
process.on("SIGTERM", () => server.close());`}
              />

              <div className="mt-6 bg-slate-900/50 border border-slate-800 rounded-xl p-4">
                <h4 className="font-semibold text-white mb-3">Available Event Types</h4>
                <div className="grid md:grid-cols-2 gap-2 text-sm">
                  <div className="text-slate-400"><code className="text-cyan-400">covenant.verified</code> — Access decision made</div>
                  <div className="text-slate-400"><code className="text-cyan-400">covenant.denied</code> — Access denied</div>
                  <div className="text-slate-400"><code className="text-cyan-400">chain.completed</code> — AI chain finished</div>
                  <div className="text-slate-400"><code className="text-cyan-400">chain.failed</code> — All providers failed</div>
                  <div className="text-slate-400"><code className="text-cyan-400">qr.encoded</code> — QR code generated</div>
                  <div className="text-slate-400"><code className="text-cyan-400">qr.decoded</code> — QR code scanned</div>
                </div>
              </div>
            </Section>

            {/* Error Handling */}
            <Section id="errors" title="Error Handling" icon={Lock}>
              <p className="text-slate-400 mb-6">
                All SDK methods throw <code className="text-cyan-400">GlyphLockError</code> on failure. Catch and handle appropriately.
              </p>

              <CodeBlock
                title="Error Handling"
                code={`import { GlyphLock, GlyphLockError } from "@glyphlock/sdk";

const gl = new GlyphLock({ apiKey: process.env.GLYPHLOCK_API_KEY! });

try {
  const result = await gl.chainRun({
    input: "Generate security report...",
    model: "openai:gpt-4.1"
  });
  console.log(result.output);
} catch (error) {
  if (error instanceof GlyphLockError) {
    console.error("GlyphLock Error:", error.message);
    console.error("Code:", error.code);           // e.g. "RATE_LIMITED"
    console.error("Status:", error.status);       // e.g. 429
    console.error("Details:", error.details);     // Additional context
    
    // Handle specific errors
    if (error.code === "RATE_LIMITED") {
      // Implement backoff
    } else if (error.code === "INVALID_API_KEY") {
      // Check configuration
    }
  } else {
    throw error;
  }
}

// Common error codes
// INVALID_API_KEY    — API key missing or invalid
// RATE_LIMITED       — Too many requests
// QUOTA_EXCEEDED     — Monthly quota reached
// PROVIDER_ERROR     — Upstream AI provider failed
// INVALID_INPUT      — Request validation failed
// NETWORK_ERROR      — Connection failed`}
              />
            </Section>

            {/* Footer CTA */}
            <div className="border-t border-slate-800 pt-12 mt-12">
              <div className="bg-gradient-to-r from-cyan-500/10 via-fuchsia-500/10 to-cyan-500/10 border border-cyan-500/30 rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">Ready to Build?</h3>
                <p className="text-slate-400 mb-6 max-w-xl mx-auto">
                  Get your API key from the GlyphLock Console and start integrating secure AI orchestration into your applications.
                </p>
                <div className="flex justify-center gap-4">
                  <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500">
                    Get API Key
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                    <Book className="w-4 h-4 mr-2" />
                    Full API Reference
                  </Button>
                </div>
              </div>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}