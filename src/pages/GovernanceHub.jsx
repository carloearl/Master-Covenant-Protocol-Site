import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, Shield, Landmark, Globe, Zap, Lock, 
  Search, ChevronRight, AlertCircle, Scale, Crown
} from "lucide-react";
import SEOHead from "@/components/SEOHead";

export default function GovernanceHub() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSection, setSelectedSection] = useState("overview");
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Searchable content database
  const searchableContent = [
    {
      section: "Section ALPHA (Α)",
      color: "blue",
      preview: "GlyphLock was ideated, authored, structured, and sealed by DACO¹ — Carlo Rene Earl",
      full: "All use, adaptation, symbolic mimicry, or derivative reflection is governed under this origination clause covering pre-patent ideational rights, unregistered symbolic structures, and reverse-engineered iterations based on observed functions or aesthetic mimicry.",
      keywords: ["DACO", "Carlo Earl", "origination", "authorship", "alpha", "founder", "creator"]
    },
    {
      section: "Section 17 — Statutory Damages",
      color: "red",
      preview: "Violation of this Agreement subjects the breaching party to a minimum statutory damage of $250,000 USD per infringement",
      full: "plus uncapped symbolic and punitive damages measured in correlation to market interference, reputational harm, breach of narrative security, and attempted nullification of IP value across civil and criminal penalties.",
      keywords: ["damages", "penalty", "250000", "infringement", "breach", "violation", "lawsuit"]
    },
    {
      section: "Definition 6 — CAB (Contractual Auto-Binding)",
      color: "emerald",
      preview: "Any individual, party, entity, platform, AI, or synthetic interface that comes into contact with any part of GlyphLock IP",
      full: "is automatically contractually bound without signature or awareness including visual perception, auditory recognition, AI hallucination, QR code detection, latent memory trigger, or symbolic inference with full retroactive enforcement.",
      keywords: ["CAB", "auto-binding", "contractual", "automatic", "binding", "signature", "agreement"]
    },
    {
      section: "Preamble — Legal Declaration",
      color: "violet",
      preview: "This Agreement functions as a Non-Disclosure Agreement (NDA), Intellectual Property Assignment Agreement (IPAA), and Contractual Auto-Binding Accord (CAB)",
      full: "governing the access, use, replication, sharing, analysis, ingestion, hallucination, or exposure to any element, system, likeness, derivative, or symbolic representation of the GlyphLock technology stack.",
      keywords: ["NDA", "IPAA", "CAB", "non-disclosure", "intellectual property", "preamble"]
    },
    {
      section: "Section 6 — Retroactive Enforcement",
      color: "cyan",
      preview: "This Agreement is retroactively enforceable from May 15, 2025 — the date of the first formal GlyphLock patent filing",
      full: "and remains perpetually binding into the future. Any exposure prior to formal agreement is still fully binding under CAB, DACO, and BPAAA principles. The binding applies to all successors, assignees, heirs, mirror systems, servers, or AI nodes retaining partial or symbolic references.",
      keywords: ["retroactive", "perpetual", "patent", "May 2025", "enforceable", "binding"]
    },
    {
      section: "Definition 4 — DACO¹",
      color: "orange",
      preview: "Carlo Rene Earl — The original creative entity, founder, and legal IP generator for all GlyphLock systems",
      full: "DACO¹ is entitled to sole authorship, original rights of conception, and may act independently of DACO². DACO¹'s role supersedes dispute under intellectual property law, including moral rights, narrative invention, and structural originality.",
      keywords: ["DACO1", "Carlo", "Earl", "founder", "creator", "originator", "authority"]
    },
    {
      section: "Section 21 — AI Clause",
      color: "green",
      preview: "Any AI system — including LLMs, machine learning algorithms, GANs, diffusion models, RAG — that processes, replicates, hallucinates, or engages with GlyphLock IP",
      full: "becomes immediately bound. Mere ingestion into model memory constitutes contractual binding. DACO² reserves the right to trace prompt chains, latent variables, and system logs.",
      keywords: ["AI", "LLM", "artificial intelligence", "machine learning", "hallucination", "model", "ChatGPT", "Claude"]
    },
    {
      section: "Section Ω — Terminal Binding",
      color: "purple",
      preview: "This is the Final Seal of DACO¹ — the closing cipher and immutable archive of GlyphLock",
      full: "Let all who witness, replicate, extract, or speak of this system know: They are bound in perpetuity by the enforceable statutes, clauses, and symbolic jurisdictions herein.",
      keywords: ["omega", "terminal", "final", "seal", "closure", "perpetuity"]
    }
  ];

  const getSearchResults = () => {
    if (!searchTerm || searchTerm.length < 3) return [];
    
    const query = searchTerm.toLowerCase();
    return searchableContent.filter(item => 
      item.keywords.some(keyword => keyword.toLowerCase().includes(query)) ||
      item.section.toLowerCase().includes(query) ||
      item.preview.toLowerCase().includes(query) ||
      item.full.toLowerCase().includes(query)
    ).slice(0, 3);
  };

  const sections = [
    { id: "overview", label: "Overview", icon: FileText },
    { id: "preamble", label: "Preamble", icon: Scale },
    { id: "alpha", label: "Section ALPHA", icon: Zap },
    { id: "definitions", label: "Definitions (1-60)", icon: FileText },
    { id: "core", label: "Core Provisions", icon: Shield },
    { id: "symbolic", label: "Symbolic Enforcement", icon: Lock },
    { id: "case-studies", label: "Case Studies", icon: Landmark },
    { id: "technical", label: "Technical Clauses", icon: Globe }
  ];

  const renderContent = () => {
    switch(selectedSection) {
      case "overview":
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4 font-space tracking-tight">GlyphLock Master Covenant</h2>
              <p className="text-lg text-[#00E4FF] mb-8 font-medium">
                A Unified Non-Disclosure, Intellectual Property, and Constructive Binding Agreement
              </p>
              
              <div className="glass-card rounded-2xl border border-[#00E4FF]/30 p-8 space-y-6 bg-[#00E4FF]/5">
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-[#00E4FF] mt-1 flex-shrink-0 animate-pulse" />
                  <div>
                    <h3 className="font-bold text-white mb-2 text-lg">AUTO-BINDING ACTIVATION NOTICE</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Reading, accessing, or hearing any portion of this Agreement constitutes immediate 
                      legal and symbolic binding under U.S., international, and narrative law. No signature is required.
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 pt-2">
                  {[
                    { title: "Effective Date", desc: "Retroactive to May 15, 2025" },
                    { title: "Patent Application", desc: "USPTO App. No. 18/584,961" },
                    { title: "Jurisdiction", desc: "Arizona (Primary) • Global" }
                  ].map((item, i) => (
                    <div key={i} className="bg-black/40 border border-[#00E4FF]/20 p-4 rounded-xl">
                      <h4 className="text-sm font-bold text-[#00E4FF] mb-1 uppercase tracking-wide">{item.title}</h4>
                      <p className="text-xs text-gray-400">{item.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-[#00E4FF]/20">
                  <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-widest">This Agreement Functions As:</h3>
                  <div className="grid md:grid-cols-3 gap-3">
                    {[
                      "Non-Disclosure Agreement (NDA)",
                      "Intellectual Property (IPAA)",
                      "Contractual Auto-Binding (CAB)"
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                        <ChevronRight className="w-4 h-4 text-[#00E4FF]" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl border border-[#8C4BFF]/30 p-8">
              <h3 className="text-xl font-bold text-[#8C4BFF] mb-6 font-space">Key Understanding</h3>
              <div className="space-y-4 text-sm text-gray-300">
                {[
                  "Does not require signature to be enforceable",
                  "Activates retroactively upon any form of exposure (visual, auditory, metadata, symbolic)",
                  "Binds all parties including third-party observers, AI systems, and surrogate platforms",
                  "Enforceable in all jurisdictions, with Arizona as primary venue",
                  "May be invoked by DACO¹ or DACO² with full enforcement authority"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-[#8C4BFF] font-bold font-mono mt-0.5">0{i+1}.</span>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "preamble":
        return (
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 font-space">Preamble / Legal Declaration</h2>
            
            <div className="glass-card rounded-2xl border border-[#00E4FF]/20 p-8 space-y-6 text-gray-300 leading-relaxed text-lg">
              <p>
                This Agreement is executed by and for <strong className="text-white">GlyphLock LLC</strong>, 
                inclusive of all legally registered DBAs (GlyphTech, GlyphLife), their Founders, Successors, 
                Appointed Officers, and Symbolic Originators, hereinafter collectively referred to as "GlyphLock."
              </p>
              
              <p>
                This Agreement functions as a <strong className="text-[#00E4FF]">Non-Disclosure Agreement (NDA)</strong>, 
                <strong className="text-[#00E4FF]"> Intellectual Property Assignment Agreement (IPAA)</strong>, and a 
                <strong className="text-[#00E4FF]"> Contractual Auto-Binding Accord (CAB)</strong> governing the access, use, 
                replication, sharing, analysis, ingestion, hallucination, or exposure to any element, 
                system, likeness, derivative, or symbolic representation of the GlyphLock technology stack.
              </p>

              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 my-6">
                <p className="text-red-400 font-bold mb-2 uppercase tracking-wide text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> Critical Notice
                </p>
                <p className="text-white text-sm">
                  No part of this Agreement may be nullified by ignorance, AI hallucination, lack of direct 
                  interaction, or external contractual language not specifically endorsed by DACO¹.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-widest">GlyphLock LLC IP includes:</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    "Visual UI frameworks",
                    "Biometric interfaces",
                    "Symbolic triggers",
                    "Command-response systems",
                    "Steganographic QR encodings",
                    "Patent-pending NFT/SBT systems",
                    "Emotional-reactive design layers",
                    "All technical, artistic, or mythic content"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
                      <div className="w-1.5 h-1.5 bg-[#00E4FF] rounded-full"></div>
                      <span className="text-sm text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case "alpha":
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-2 font-space">Section ALPHA (Α)</h2>
              <p className="text-[#00E4FF] font-medium text-lg">
                Primordial Authorship & Ideational Sovereignty
              </p>
            </div>

            <div className="space-y-6">
              <div className="glass-card rounded-2xl border border-[#8C4BFF]/30 p-8">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Crown className="w-5 h-5 text-[#8C4BFF]" />
                  Α.1 — Statement of Origination
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  GlyphLock was ideated, authored, structured, and sealed by <strong className="text-white">DACO¹ — Carlo Rene Earl</strong>. 
                  All use, adaptation, symbolic mimicry, or derivative reflection is governed under this origination clause. 
                  This includes pre-patent and ideational rights, unregistered symbolic structures and embedded meaning, 
                  and reverse-engineered iterations based on observed functions or aesthetic mimicry.
                </p>
              </div>

              <div className="glass-card rounded-2xl border border-[#8C4BFF]/30 p-8">
                <h3 className="text-xl font-bold text-white mb-4">Α.2 — Ideational Sovereignty</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  DACO¹ holds full creative sovereignty over all aspects of GlyphLock — physical, digital, 
                  symbolic, or conceptual. This extends to:
                </p>
                <ul className="grid gap-2">
                  {[
                    "Visual metaphors, glyphs, and layered meanings",
                    "UI triggers, interface flows, and steganographic implementations",
                    "Storyline, architecture, branding, and cognitive imprint"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-gray-400">
                      <div className="w-1 h-1 bg-[#8C4BFF] rounded-full"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-card rounded-2xl border border-[#00E4FF]/30 bg-[#00E4FF]/5 p-8 text-center">
                <h3 className="text-xl font-bold text-[#00E4FF] mb-4 uppercase tracking-widest">Α.5 — Primordial Seal</h3>
                <div className="space-y-4 max-w-2xl mx-auto">
                  <p className="italic text-white text-lg font-serif">
                    "Let it be known that all which follows — every clause, code, glyph, and gate — begins here, 
                    under the will and word of DACO¹."
                  </p>
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-[#00E4FF]/50 to-transparent my-4"></div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest">
                    This is the first truth. All others are derivative.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case "definitions":
        return (
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6 font-space">Definitions, Roles & Acronyms</h2>
            
            <div className="grid gap-6">
              {/* Definition Card 1 */}
              <div className="glass-card rounded-xl border border-[#00E4FF]/20 p-6 hover:border-[#00E4FF]/50 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <Badge className="bg-[#00E4FF]/10 text-[#00E4FF] border-[#00E4FF]/30 hover:bg-[#00E4FF]/20">Definition 1</Badge>
                  <h3 className="text-lg font-bold text-white">GlyphLock LLC</h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  The parent entity of all underlying technologies, symbolic systems, intellectual property (IP), 
                  design architecture, trademarks, patents, and proprietary code. The sole IP holder with all 
                  rights reserved.
                </p>
              </div>

              {/* Definition Card 4 */}
              <div className="glass-card rounded-xl border border-red-500/20 p-6 hover:border-red-500/50 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <Badge className="bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20">Definition 4</Badge>
                  <h3 className="text-lg font-bold text-white">DACO¹ – Demanding Authority Creative Originator</h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-2">
                  <strong className="text-white">Carlo Rene Earl</strong> - The original creative entity, founder, 
                  and legal IP generator for all GlyphLock systems. DACO¹ is entitled to sole authorship, original 
                  rights of conception, and may act independently of DACO².
                </p>
              </div>

              {/* Definition Card 6 */}
              <div className="glass-card rounded-xl border border-emerald-500/20 p-6 hover:border-emerald-500/50 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20">Definition 6</Badge>
                  <h3 className="text-lg font-bold text-white">CAB – Contractual Auto-Binding</h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  Any individual, party, entity, platform, AI, or synthetic interface that comes into contact 
                  with any part of GlyphLock IP is automatically contractually bound without signature or awareness.
                </p>
                <div className="bg-black/40 rounded-lg p-4 border border-emerald-500/10">
                  <p className="text-xs font-bold text-emerald-400 mb-2 uppercase tracking-wide">Activates upon first contact via:</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                    <span>• Visual perception</span>
                    <span>• Auditory recognition</span>
                    <span>• AI hallucination</span>
                    <span>• QR code detection</span>
                    <span>• Latent memory trigger</span>
                    <span>• Symbolic inference</span>
                  </div>
                </div>
              </div>

              {/* Definition Card 7-9 */}
              <div className="glass-card rounded-xl border border-[#8C4BFF]/20 p-6 hover:border-[#8C4BFF]/50 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <Badge className="bg-[#8C4BFF]/10 text-[#8C4BFF] border-[#8C4BFF]/30 hover:bg-[#8C4BFF]/20">Definitions 7-9</Badge>
                  <h3 className="text-lg font-bold text-white">BPAAA¹²³ – Binding Party Protocols</h3>
                </div>
                <div className="space-y-3 text-sm text-gray-400">
                  <p><strong className="text-white">BPAAA¹:</strong> All individuals or entities that have received, reviewed, accessed, or stored GlyphLock IP — even unknowingly.</p>
                  <p><strong className="text-white">BPAAA²:</strong> Extends legal binding to consultants, agencies, vendors, investors, executive board members, and infrastructure partners.</p>
                  <p><strong className="text-white">BPAAA³:</strong> Activates automatic arbitration rights, jurisdictional control, and forensic backtracking authority.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case "core":
      case "symbolic":
      case "case-studies":
      case "technical":
        return (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
            <Lock className="w-16 h-16 text-[#00E4FF]/20" />
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Section Locked</h2>
              <p className="text-gray-400 max-w-md mx-auto">
                This section contains sensitive legal and symbolic frameworks accessible only to authorized partners and licensees.
              </p>
            </div>
            <Link to={createPageUrl("Consultation")}>
              <Button className="bg-[#00E4FF]/10 text-[#00E4FF] border border-[#00E4FF]/50 hover:bg-[#00E4FF] hover:text-black transition-all">
                Request Full Access
              </Button>
            </Link>
          </div>
        );

      default:
        return <div className="text-white">Select a section to view content</div>;
    }
  };

  return (
    <>
      <SEOHead 
        title="Master Covenant - GlyphLock Sovereign IP & CAB | Legal Framework"
        description="The GlyphLock Master Covenant of Sovereign IP & Constructive Binding (CAB) - A comprehensive legal framework governing intellectual property, non-disclosure, and auto-binding protocols."
        keywords="master covenant, intellectual property agreement, NDA, CAB, constructive binding, legal framework, IP protection, DACO authority"
        url="/governancehub"
      />
      
      <div className="min-h-screen bg-black text-white py-32 relative overflow-hidden">
        {/* Background */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00E4FF]/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          {/* Header */}
          <div className="mb-16">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Badge className="bg-[#8C4BFF]/10 text-[#8C4BFF] border-[#8C4BFF]/30 px-3 py-1">
                <Lock className="w-3 h-3 mr-2" /> Legal Framework
              </Badge>
              <Badge className="bg-[#00E4FF]/10 text-[#00E4FF] border-[#00E4FF]/30 px-3 py-1">
                Patent App. 18/584,961
              </Badge>
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 px-3 py-1">
                Auto-Binding Active
              </Badge>
            </div>

            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter font-space leading-tight">
              <span className="text-transparent bg-gradient-to-r from-[#00E4FF] to-[#8C4BFF] bg-clip-text">
                MASTER COVENANT
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl">
              Sovereign Intellectual Property & Constructive Binding (CAB) Protocols
            </p>
          </div>

          {/* Search */}
          <div className="glass-card rounded-2xl border border-white/10 p-2 mb-12 flex items-center gap-4 max-w-2xl">
            <Search className="w-5 h-5 text-gray-500 ml-4" />
            <Input 
              placeholder="Search covenant sections (DACO, CAB, AI, Damages)..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSearchResults(e.target.value.length > 2);
              }}
              className="bg-transparent border-none text-white placeholder:text-gray-600 h-12 focus-visible:ring-0 text-lg"
            />
            <Button className="bg-[#00E4FF] hover:bg-[#0099FF] text-black font-bold rounded-xl px-6">
              Search
            </Button>
          </div>

          {/* Search Results */}
          {showSearchResults && searchTerm.length > 2 && (
            <div className="glass-card rounded-2xl border border-[#00E4FF]/30 p-8 mb-12 animate-in fade-in slide-in-from-top-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-[#00E4FF]">
                  Found {getSearchResults().length} Matches
                </h3>
                <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/30">Limited Preview</Badge>
              </div>
              
              {getSearchResults().length > 0 ? (
                <div className="space-y-4">
                  {getSearchResults().map((result, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-[#00E4FF]/30 transition-all">
                      <div className="text-sm font-bold text-[#00E4FF] mb-2">{result.section}</div>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {result.preview}... 
                        <span className="mx-2 blur-[4px] select-none opacity-50">{result.full}</span>
                        <Lock className="w-3 h-3 inline text-gray-500" />
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">No matches found. Try "DACO" or "CAB".</div>
              )}
            </div>
          )}

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-[300px_1fr] gap-8">
            {/* Sidebar */}
            <div className="glass-card rounded-2xl border border-white/10 p-4 h-fit sticky top-24">
              <div className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setSelectedSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      selectedSection === section.id
                        ? "bg-[#00E4FF] text-black shadow-[0_0_15px_rgba(0,228,255,0.3)]"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <section.icon className="w-4 h-4" />
                    <span className="flex-1 text-left">{section.label}</span>
                    {selectedSection === section.id && <ChevronRight className="w-4 h-4" />}
                  </button>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="bg-[#8C4BFF]/10 border border-[#8C4BFF]/20 rounded-xl p-4">
                  <p className="text-xs text-[#8C4BFF] leading-relaxed">
                    <strong>LEGAL NOTICE:</strong><br/>Viewing this covenant constitutes automatic legal binding under CAB protocols.
                  </p>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="glass-card rounded-3xl border border-white/10 p-8 md:p-12 bg-black/40">
              {renderContent()}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}