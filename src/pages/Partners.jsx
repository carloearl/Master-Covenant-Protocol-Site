import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import SEOHead from "@/components/SEOHead";

const valuationScenarios = [
  {
    label: "Current D&B Estimate",
    valuation: 340000,
    formatted: "$340,000",
    tag: "Conservative baseline",
    tone: "This is the slow, old-school view that ignores growth, IP, and AI leverage.",
  },
  {
    label: "Revenue Multiple (Low)",
    valuation: 6800000,
    formatted: "$6,800,000",
    tag: "Execution in motion",
    tone: "Anchored to actual revenue and early traction across live prototypes.",
  },
  {
    label: "Revenue Multiple (High)",
    valuation: 13600000,
    formatted: "$13,600,000",
    tag: "Aggressive growth case",
    tone: "Assumes continued revenue and expansion of use‑cases across clubs, POS, and security.",
  },
  {
    label: "Pre‑Seed Comparable",
    valuation: 3600000,
    formatted: "$3,600,000",
    tag: "Market reality check",
    tone: "In line with AI / security pre‑seed rounds backing strong IP and real pilots.",
  },
  {
    label: "Berkus Method",
    valuation: 1600000,
    formatted: "$1,600,000",
    tag: "Foundational IP floor",
    tone: "Weighted by team, tech, market, and early systems — before scaling upside.",
  },
];

const formatMillions = (value) => {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  return `$${value.toLocaleString()}`;
};

export default function Partners() {
  const [projectedVal, setProjectedVal] = React.useState(2000000);

  const computedScenarios = [
    valuationScenarios[0],
    {
      ...valuationScenarios[1],
      valuation: projectedVal * 3.4,
      formatted: `$${(projectedVal * 3.4).toLocaleString()}`,
    },
    {
      ...valuationScenarios[2],
      valuation: projectedVal * 6.8,
      formatted: `$${(projectedVal * 6.8).toLocaleString()}`,
    },
    valuationScenarios[3],
    valuationScenarios[4],
  ];

  const minVal = Math.min(...computedScenarios.map((v) => v.valuation));
  const maxVal = Math.max(...computedScenarios.map((v) => v.valuation));

  return (
    <>
      <SEOHead 
        title="Partners & Investors - GlyphLock | Strategic Partnerships & Licensing"
        description="Explore GlyphLock's partnership opportunities, financial highlights ($340K in 90 days, $14M escrows), technology stack, and strategic licensing framework. Addressing the $283B IP theft crisis."
        keywords="cybersecurity partnerships, strategic licensing, technology partnerships, investor relations, IP protection, quantum-resistant encryption, enterprise security, partnership opportunities"
        url="/partners"
      />
      <div className="min-h-screen bg-black text-white py-20">
      {/* Background effects */}
      <div className="pointer-events-none fixed inset-0 opacity-40 mix-blend-screen">
        <div className="absolute -top-40 left-10 h-80 w-80 rounded-full bg-violet-600 blur-3xl" />
        <div className="absolute top-40 right-0 h-80 w-80 rounded-full bg-sky-500 blur-3xl" />
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 w-full">
        {/* Badge */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/50 glass-card-dark px-3 py-1 text-xs font-medium tracking-wide uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            GlyphLock • Public Snapshot
          </span>
          <span className="text-xs text-white/70">
            Valuation scenarios based on live traction, IP, and market comps.
          </span>
        </div>

        {/* Hero section */}
        <section className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-start mb-12 lg:mb-16">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white mb-4">
              GlyphLock Partnership Overview
            </h1>
            <p className="text-white/70 text-sm sm:text-base max-w-xl mb-3">
              <strong className="text-blue-400">Secured Access For Smarter World Powered by GlyphLock</strong>
            </p>
            <p className="text-white/70 text-sm sm:text-base max-w-xl mb-6">
              Revolutionizing cybersecurity through AI-powered QR code technology and interactive security solutions 
              that address the $283 billion IP theft crisis. Below is a transparent view of our technology, market 
              opportunity, and partnership framework.
            </p>

            <div className="grid gap-4 sm:grid-cols-3 max-w-xl mb-6">
              <div className="rounded-2xl border border-blue-500/30 glass-card-dark px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-white/70 mb-1">Conservative floor</p>
                <p className="text-lg font-semibold text-white">$1.6M – $3.6M</p>
                <p className="text-xs text-white/60 mt-1">Berkus & pre‑seed comparable methods.</p>
              </div>
              <div className="rounded-2xl border border-violet-500/80 bg-violet-500/10 px-4 py-3 shadow-[0_0_24px_rgba(139,92,246,0.35)]">
                <p className="text-xs uppercase tracking-wide text-violet-300 mb-1">Revenue‑anchored band</p>
                <p className="text-lg font-semibold text-white">$6.8M – $13.6M</p>
                <p className="text-xs text-violet-200/80 mt-1">Based on sustained revenue and live deployments.</p>
              </div>
              <div className="rounded-2xl border border-emerald-500/60 bg-emerald-500/10 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-emerald-300 mb-1">Execution target</p>
                <p className="text-lg font-semibold text-white">$8M – $10M</p>
                <p className="text-xs text-emerald-200/80 mt-1">Working band for upcoming rounds.</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-white/60 max-w-xl">
              This page is a high‑level snapshot for partners and licensees. Detailed financials, deployment models,
              and legal documentation are available on request under NDA.
            </p>
          </div>

          {/* Compact visual bar chart */}
          <div className="rounded-3xl border border-blue-500/30 glass-card-dark backdrop-blur-xl p-5 shadow-xl">
            <p className="text-xs font-medium text-white mb-3 flex items-center justify-between">
              <span>Scenario comparison</span>
              <span className="text-[10px] text-white/60 uppercase tracking-wide">Relative scale</span>
            </p>
            <div className="space-y-3">
              {computedScenarios.map((scenario) => {
                const ratio = (scenario.valuation - minVal) / (maxVal - minVal || 1);
                const widthPercent = 25 + ratio * 75;
                const isPrimary = scenario.label.includes("Revenue Multiple");

                return (
                  <div key={scenario.label} className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-white">
                      <span className="font-medium truncate mr-2">{scenario.label}</span>
                      <span className="tabular-nums text-white/70">{scenario.formatted}</span>
                    </div>
                    <div className="h-6 rounded-full bg-blue-500/10 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ease-out ${
                          isPrimary
                            ? "bg-gradient-to-r from-violet-500 via-fuchsia-500 to-sky-400 shadow-[0_0_18px_rgba(129,140,248,0.8)]"
                            : "bg-gradient-to-r from-blue-500/80 to-blue-300/90"
                        }`}
                        style={{ width: `${widthPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-[11px] text-white/50 leading-relaxed">
              Highlighted bars represent revenue‑driven valuations, which we consider the primary anchor for
              near‑term partnership and deployment discussions.
            </p>
          </div>
        </section>

        {/* Company Overview */}
        <section className="mb-16 space-y-6">
          <div className="rounded-3xl border border-blue-500/30 glass-card-dark p-6">
            <h2 className="text-2xl font-semibold text-blue-300 mb-4">Company Overview</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-white/90 mb-2 uppercase tracking-wide">Mission</h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  Revolutionizing cybersecurity through AI-powered QR code technology and interactive security solutions 
                  that address the $283 billion IP theft crisis.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white/90 mb-2 uppercase tracking-wide">Founded</h3>
                <p className="text-white/70 text-sm">2025 • El Mirage, Arizona</p>
                <p className="text-white/60 text-xs mt-1">Active Early-Stage Company</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-violet-500/30 glass-card-dark p-6">
            <h2 className="text-xl font-semibold text-violet-300 mb-4">Market Opportunity</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4">
                <p className="text-3xl font-bold text-red-400">$283B</p>
                <p className="text-xs text-white/70 mt-1">IP Theft Crisis Annually</p>
              </div>
              <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-4">
                <p className="text-3xl font-bold text-blue-400">$10T+</p>
                <p className="text-xs text-white/70 mt-1">Total Addressable Market</p>
              </div>
              <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-4">
                <p className="text-3xl font-bold text-cyan-400">$3.78B</p>
                <p className="text-xs text-white/70 mt-1">QR Code Market by 2025</p>
              </div>
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
                <p className="text-3xl font-bold text-emerald-400">$2.7T</p>
                <p className="text-xs text-white/70 mt-1">Mobile QR Payments by 2025</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-emerald-500/30 glass-card-dark p-6">
            <h2 className="text-xl font-semibold text-emerald-300 mb-4">Financial Highlights - First 90 Days</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
                <p className="text-xs uppercase text-white/60 mb-1">Revenue Generated</p>
                <p className="text-2xl font-bold text-emerald-400">$340,000</p>
                <p className="text-xs text-white/60 mt-1">First 90 days of operation</p>
              </div>
              <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-4">
                <p className="text-xs uppercase text-white/60 mb-1">Insurance Escrows Secured</p>
                <p className="text-2xl font-bold text-blue-400">$14M</p>
                <p className="text-xs text-white/60 mt-1">Before full rollout</p>
              </div>
              <div className="rounded-xl border border-violet-500/30 bg-violet-500/5 p-4">
                <p className="text-xs uppercase text-white/60 mb-1">Enterprise Contracts</p>
                <p className="text-2xl font-bold text-violet-400">$225K+</p>
                <p className="text-xs text-white/60 mt-1">Per contract value</p>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Stack */}
        <section className="mb-16">
          <div className="rounded-3xl border border-cyan-500/30 glass-card-dark p-6">
            <h2 className="text-2xl font-semibold text-cyan-300 mb-4">Core Technology Stack</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                "AI-powered contract binding with cryptographic proof",
                "Quantum-resistant encryption technology",
                "Dynamic QR code generation with real-time updates",
                "Blockchain integration for automated contract execution",
                "Neural network-based authentication models",
                "Interactive hotzone mapping with biometric input",
                "Advanced steganographic overlay systems",
                "Next.js, React, and modern JavaScript frameworks"
              ].map((tech, idx) => (
                <div key={idx} className="rounded-lg border border-blue-500/20 glass-card-dark p-3 hover:border-cyan-400/50 transition-colors">
                  <p className="text-xs text-white/80 flex items-start gap-2">
                    <span className="text-cyan-400 mt-0.5">▸</span>
                    {tech}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Competitive Advantages */}
        <section className="mb-16">
          <div className="rounded-3xl border border-blue-500/30 glass-card-dark p-6">
            <h2 className="text-2xl font-semibold text-blue-300 mb-4">Competitive Advantages</h2>
            <div className="space-y-3">
              {[
                {title: "First-to-Market", desc: "Unique AI-contract binding technology (first of its kind)"},
                {title: "Quantum-Resistant", desc: "Future-proof security infrastructure"},
                {title: "Real-Time Dynamic", desc: "Live QR code updating capability"},
                {title: "Integrated Platform", desc: "Comprehensive ecosystem, not point solution"},
                {title: "Proven Revenue", desc: "Early revenue generation proving market demand"},
                {title: "Multi-Factor Security", desc: "Biometric integration and blockchain verification"}
              ].map((advantage, idx) => (
                <div key={idx} className="rounded-lg border border-blue-500/20 glass-card-dark p-4 hover:border-blue-400/50 transition-colors">
                  <h3 className="text-sm font-semibold text-blue-400 mb-1">{advantage.title}</h3>
                  <p className="text-xs text-white/70">{advantage.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Target Markets & Use Cases */}
        <section className="mb-16">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="rounded-3xl border border-violet-500/30 glass-card-dark p-6">
              <h2 className="text-xl font-semibold text-violet-300 mb-4">Target Markets</h2>
              <ul className="space-y-2 text-sm text-white/70">
                <li className="flex items-start gap-2">
                  <span className="text-violet-400 mt-0.5">•</span>
                  Enterprise organizations requiring advanced cybersecurity
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-400 mt-0.5">•</span>
                  Financial services and banking institutions
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-400 mt-0.5">•</span>
                  Healthcare and pharmaceutical companies
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-400 mt-0.5">•</span>
                  Government agencies and defense contractors
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-400 mt-0.5">•</span>
                  E-commerce and payment processing platforms
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-400 mt-0.5">•</span>
                  Manufacturing and supply chain operations
                </li>
              </ul>
            </div>

            <div className="rounded-3xl border border-cyan-500/30 glass-card-dark p-6">
              <h2 className="text-xl font-semibold text-cyan-300 mb-4">Use Cases</h2>
              <ul className="space-y-2 text-sm text-white/70">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5">•</span>
                  Secure payment authentication via QR codes
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5">•</span>
                  Anti-counterfeiting and brand protection
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5">•</span>
                  Tamper-proof document verification
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5">•</span>
                  Access control and identity management
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5">•</span>
                  Supply chain tracking and authentication
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5">•</span>
                  Secure data transmission and encryption
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Growth Strategy */}
        <section className="mb-16">
          <div className="rounded-3xl border border-emerald-500/30 glass-card-dark p-6">
            <h2 className="text-2xl font-semibold text-emerald-300 mb-4">Growth Strategy</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Expand enterprise client base across multiple verticals",
                "Scale N.U.P.S. three-tier POS platform deployments",
                "Develop strategic partnerships with cybersecurity firms",
                "Pursue government and defense sector contracts",
                "Enhance AI capabilities and quantum-resistant features",
                "Geographic expansion beyond Arizona market",
                "Potential Series A funding to accelerate growth"
              ].map((strategy, idx) => (
                <div key={idx} className="rounded-lg border border-emerald-500/20 glass-card-dark p-3">
                  <p className="text-xs text-white/80 flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">{idx + 1}.</span>
                    {strategy}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Industry Validation */}
        <section className="mb-16">
          <div className="rounded-3xl border border-blue-500/30 glass-card-dark p-6">
            <h2 className="text-2xl font-semibold text-blue-300 mb-4">Industry Validation</h2>
            <div className="space-y-3">
              {[
                "QR code market growing to $3.78B by 2025 (60% higher engagement with AI)",
                "Businesses using smart QR solutions see 60% higher engagement rates",
                "Mobile QR payments expected to exceed $2.7T globally",
                "Banks reduce phishing risk by 90% with biometric QR authentication",
                "Cybersecurity valuation multiples range from 8-22x revenue"
              ].map((validation, idx) => (
                <div key={idx} className="rounded-lg border border-blue-500/20 glass-card-dark p-3">
                  <p className="text-xs text-white/80 flex items-start gap-2">
                    <span className="text-blue-400">✓</span>
                    {validation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Vision Statement */}
        <section className="mb-16">
          <div className="rounded-3xl border border-violet-500/50 bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-blue-500/10 p-8 shadow-[0_0_40px_rgba(139,92,246,0.5)]">
            <h2 className="text-2xl font-semibold text-white mb-4 text-center">Our Vision</h2>
            <p className="text-white/80 text-sm leading-relaxed text-center max-w-4xl mx-auto">
              To become the global leader in AI-powered cybersecurity solutions, protecting enterprises from the 
              growing $283 billion IP theft crisis while pioneering quantum-resistant security technologies for 
              the next generation of digital infrastructure.
            </p>
          </div>
        </section>

        {/* Scenario cards */}
        <section className="mb-16">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-white">
              Valuation Models & Scenarios
            </h2>
            <p className="text-[11px] text-white/60 max-w-xs text-right hidden sm:block">
              Each scenario reflects a different lens: conservative databases, early‑stage operator and market heuristics,
              and revenue‑anchored multiples from real deployments.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {computedScenarios.map((scenario) => (
              <article
                key={scenario.label}
                className="group relative rounded-3xl border border-blue-500/30 glass-card-dark p-4 sm:p-5 hover:border-violet-400/80 hover:shadow-[0_0_40px_rgba(139,92,246,0.7)] transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-violet-500/10 via-fuchsia-500/5 to-sky-400/10 transition-opacity duration-300" />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="text-sm font-semibold text-white leading-snug">
                      {scenario.label}
                    </h3>
                    <span className="inline-flex items-center rounded-full border border-blue-500/30 glass-card-dark px-2 py-0.5 text-[10px] uppercase tracking-wide text-white/80">
                      {scenario.tag}
                    </span>
                  </div>

                  <p className="text-2xl font-semibold text-white mb-1">
                    {scenario.formatted}
                  </p>
                  <p className="text-[11px] text-white/60 mb-3 leading-relaxed">
                    {scenario.tone}
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-2 border-t border-blue-500/30">
                    <div className="text-[10px] text-white/60">
                      <p className="uppercase tracking-wide mb-0.5">Model type</p>
                      <p className="font-medium text-white/90">
                        {scenario.label.includes("Revenue")
                          ? "Revenue multiple"
                          : scenario.label.includes("Berkus")
                          ? "Early‑stage Berkus"
                          : scenario.label.includes("Comparable")
                          ? "Pre‑seed comparable"
                          : "External database"}
                      </p>
                    </div>
                    <div className="text-right text-[10px] text-white/60">
                      <p className="uppercase tracking-wide mb-0.5">Scale</p>
                      <p className="font-medium text-white/90">{formatMillions(scenario.valuation)}</p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Flex Mode Expansion Block */}
        <section className="mb-16 space-y-10">
          {/* Valuation Calculator */}
          <div className="rounded-3xl border border-emerald-500/60 glass-card-dark p-6 shadow-[0_0_35px_rgba(16,185,129,0.4)]">
            <h2 className="text-xl font-semibold text-emerald-300 mb-3">Valuation Calculator</h2>
            <p className="text-white/60 text-xs mb-4">
              Adjust projected revenue to simulate real-time valuation.
            </p>
            <div className="flex flex-col gap-4">
              <input
                type="range"
                min={500000}
                max={20000000}
                step={500000}
                value={projectedVal}
                onChange={(e) => setProjectedVal(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
              {/* Timeline Under Slider */}
              <div className="w-full flex justify-between text-[10px] text-white/50 mt-1 px-1">
                <span>2025</span>
                <span>2026</span>
                <span>2027</span>
                <span>2028</span>
                <span>2029</span>
              </div>
            </div>
            {/* Year 1–5 Projection */}
            <div className="mt-4 grid grid-cols-5 gap-2 text-center text-[10px] text-white/60">
              {[1,2,3,4,5].map((year) => {
                const base = projectedVal;
                const growth = 1 + year * 0.25;
                const val = base * growth * 3.4;
                return (
                  <div key={year} className="rounded-lg border border-blue-500/30 glass-card-dark p-2">
                    <p className="text-[9px] uppercase text-white/50 mb-1">Year {year}</p>
                    <p className="text-[11px] font-semibold text-emerald-300">
                      ${val.toLocaleString()}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Partner Sidebar */}
          <div className="rounded-3xl border border-blue-500/30 glass-card-dark p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-white mb-2">Partner Notes</h2>
            <p className="text-white/60 text-xs">
              Revenue multiple is primary. D&B undervalues IP companies. Berkus shows conservative basement.
              Comparable pre-seed aligns with industry.
            </p>
          </div>
        </section>

        {/* Partnership & Licensing Block */}
        <section className="mb-16 rounded-3xl border border-blue-500/50 glass-card-dark p-6 shadow-[0_0_35px_rgba(59,130,246,0.4)]">
          <h2 className="text-xl font-semibold text-blue-300 mb-3">Partnership &amp; Licensing Only</h2>
          <p className="text-white/80 text-sm mb-4 max-w-3xl">
            GlyphLock is deliberately bootstrapped. We are not raising a traditional funding round and we are not
            selling equity. Instead, we selectively form <span className="text-blue-400 font-semibold">strategic
            partnerships and licensing agreements</span> with operators, manufacturers, and institutions that can
            deploy our patented HZI stack at scale.
          </p>
          <ul className="space-y-2 text-white/70 text-sm list-disc pl-6">
            <li>Exclusive or non-exclusive licensing of steganographic QR / HZI technology</li>
            <li>White-label integrations for clubs, POS providers, and hardware OEMs</li>
            <li>Tiered revenue-share models for high-volume venues and networks</li>
            <li>SDK / API access under tightly scoped, enforceable license terms</li>
            <li>Government, defense, and enterprise programs via controlled partnerships</li>
          </ul>
          <p className="text-white/60 text-xs mt-4 italic">No outside equity. No dilution. Only aligned partners and licensors.</p>
        </section>

        {/* CTA section */}
        <section className="mb-10 rounded-3xl border border-violet-500/60 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5 px-5 sm:px-7 py-5 sm:py-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between shadow-[0_0_40px_rgba(129,140,248,0.7)]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-violet-300 mb-1">
              Next steps
            </p>
            <h3 className="text-sm sm:text-base font-semibold text-white mb-1">
              Interested in the full GlyphLock Partner Room?
            </h3>
            <p className="text-xs sm:text-[13px] text-white/80 max-w-xl">
              Request access to detailed financials, product roadmaps, security architecture, and legal
              frameworks (Master Covenant, CAB, BPAAA) supporting the numbers on this page.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link to={createPageUrl("Consultation")}>
              <button className="inline-flex items-center justify-center rounded-full bg-violet-500 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-violet-500/40 hover:bg-violet-400 transition-colors">
                Request Licensing Packet
              </button>
            </Link>
            <Link to={createPageUrl("Contact")}>
              <button className="inline-flex items-center justify-center rounded-full border border-blue-500/50 glass-card-dark px-4 py-2 text-xs sm:text-sm font-medium text-white hover:border-blue-300 hover:bg-blue-500/10 transition-colors">
                Contact founder
              </button>
            </Link>
          </div>
        </section>

        <footer className="border-t border-blue-500/30 pt-4 mt-auto flex flex-wrap items-center justify-between gap-3 text-[11px] text-white/50">
          <p>
            © {new Date().getFullYear()} GlyphLock LLC. Select figures rounded for clarity. This page is not
            an offer to sell securities.
          </p>
          <p className="text-[10px] text-white/40">
            Detailed documentation available under mutual NDA.
          </p>
        </footer>
      </main>
      </div>
    </>
  );
}