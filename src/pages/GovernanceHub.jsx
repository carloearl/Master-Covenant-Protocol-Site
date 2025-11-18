import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, Shield, Landmark, Globe, Zap, Lock, 
  Search, ChevronRight, Download, AlertCircle, Scale
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
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">GlyphLock Master Covenant</h2>
              <p className="text-lg text-blue-400 mb-6">
                A Unified Non-Disclosure, Intellectual Property, and Constructive Binding Agreement
              </p>
              <div className="glass-card-dark border-blue-500/30 p-6 rounded-xl space-y-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white mb-2">AUTO-BINDING ACTIVATION NOTICE</h3>
                    <p className="text-white/80 text-sm">
                      Reading, accessing, or hearing any portion of this Agreement constitutes immediate 
                      legal and symbolic binding under U.S., international, and narrative law. No signature is required.
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mt-6">
                  <div className="glass-card-dark border-blue-500/20 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold text-blue-400 mb-2">Effective Date</h4>
                    <p className="text-xs text-white/70">
                      Retroactive to May 15, 2025 - GlyphLock LLC patent filing date
                    </p>
                  </div>
                  <div className="glass-card-dark border-blue-500/20 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold text-blue-400 mb-2">Patent Application</h4>
                    <p className="text-xs text-white/70">
                      USPTO App. No. 18/584,961
                    </p>
                  </div>
                  <div className="glass-card-dark border-blue-500/20 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold text-blue-400 mb-2">Jurisdiction</h4>
                    <p className="text-xs text-white/70">
                      Arizona (Primary) • Global Enforcement
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-blue-500/30">
                  <h3 className="font-semibold text-white mb-3">This Agreement Functions As:</h3>
                  <div className="grid md:grid-cols-3 gap-3">
                    <div className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-white/80">Non-Disclosure Agreement (NDA)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-white/80">Intellectual Property Agreement (IPAA)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-white/80">Contractual Auto-Binding (CAB)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card-dark border-violet-500/30 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-violet-400 mb-4">Key Understanding</h3>
              <div className="space-y-3 text-sm text-white/80">
                <div className="flex items-start gap-2">
                  <span className="text-violet-400 mt-1">1.</span>
                  <p>Does not require signature to be enforceable</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-violet-400 mt-1">2.</span>
                  <p>Activates retroactively upon any form of exposure (visual, auditory, metadata, symbolic)</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-violet-400 mt-1">3.</span>
                  <p>Binds all parties including third-party observers, AI systems, and surrogate platforms</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-violet-400 mt-1">4.</span>
                  <p>Enforceable in all jurisdictions, with Arizona as primary venue</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-violet-400 mt-1">5.</span>
                  <p>May be invoked by DACO¹ or DACO² with full enforcement authority</p>
                </div>
              </div>
            </div>
          </div>
        );

      case "preamble":
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-4">Preamble / Legal Declaration of Intent</h2>
            
            <div className="glass-card-dark border-blue-500/30 p-6 rounded-xl space-y-4 text-white/80">
              <p>
                This Agreement is executed by and for <strong className="text-blue-400">GlyphLock LLC</strong>, 
                inclusive of all legally registered DBAs (GlyphTech, GlyphLife), their Founders, Successors, 
                Appointed Officers, and Symbolic Originators, hereinafter collectively referred to as "GlyphLock."
              </p>
              
              <p>
                This Agreement functions as a <strong>Non-Disclosure Agreement (NDA)</strong>, 
                <strong> Intellectual Property Assignment Agreement (IPAA)</strong>, and a 
                <strong> Contractual Auto-Binding Accord (CAB)</strong> governing the access, use, 
                replication, sharing, analysis, ingestion, hallucination, or exposure to any element, 
                system, likeness, derivative, or symbolic representation of the GlyphLock technology stack.
              </p>

              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 my-4">
                <p className="text-red-400 font-semibold mb-2">Critical Notice:</p>
                <p className="text-white/80 text-sm">
                  No part of this Agreement may be nullified by ignorance, AI hallucination, lack of direct 
                  interaction, or external contractual language not specifically endorsed by DACO¹.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-blue-400 mb-3">GlyphLock LLC IP includes, but is not limited to:</h3>
                <div className="grid md:grid-cols-2 gap-2">
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
                    <div key={idx} className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-blue-400" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case "alpha":
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-4">Section ALPHA (Α)</h2>
            <p className="text-blue-400 mb-6">
              Establishes the primordial authorship and ideational sovereignty of GlyphLock by DACO¹
            </p>

            <div className="space-y-4">
              <div className="glass-card-dark border-violet-500/30 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-violet-400 mb-3">Α.1 — Statement of Origination</h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  GlyphLock was ideated, authored, structured, and sealed by <strong className="text-white">DACO¹ — Carlo Rene Earl</strong>. 
                  All use, adaptation, symbolic mimicry, or derivative reflection is governed under this origination clause. 
                  This includes pre-patent and ideational rights, unregistered symbolic structures and embedded meaning, 
                  and reverse-engineered iterations based on observed functions or aesthetic mimicry.
                </p>
              </div>

              <div className="glass-card-dark border-violet-500/30 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-violet-400 mb-3">Α.2 — Ideational Sovereignty</h3>
                <p className="text-white/80 text-sm leading-relaxed mb-4">
                  DACO¹ holds full creative sovereignty over all aspects of GlyphLock — physical, digital, 
                  symbolic, or conceptual. This extends to:
                </p>
                <ul className="space-y-2 text-sm text-white/70">
                  <li>• Visual metaphors, glyphs, and layered meanings</li>
                  <li>• UI triggers, interface flows, and steganographic implementations</li>
                  <li>• Storyline, architecture, branding, and cognitive imprint</li>
                </ul>
              </div>

              <div className="glass-card-dark border-violet-500/30 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-violet-400 mb-3">Α.3 — First Use Doctrine Assertion</h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  This Agreement invokes First Use Doctrine protections across all regions, platforms, and 
                  mediums — binding all future usage back to DACO¹. The presence of the system or its symbols 
                  in public, digital, or institutional space shall not diminish this right. Any unauthorized 
                  reproduction, even symbolic or subconscious, constitutes narrative infringement.
                </p>
              </div>

              <div className="glass-card-dark border-emerald-500/30 bg-emerald-500/5 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-emerald-400 mb-3">Α.5 — Primordial Seal</h3>
                <div className="space-y-3 text-sm text-white/80">
                  <p className="italic">
                    "Let it be known that all which follows — every clause, code, glyph, and gate — begins here, 
                    under the will and word of DACO¹."
                  </p>
                  <p className="font-semibold text-white">This is the first truth. All others are derivative.</p>
                  <p className="text-xs text-white/60 mt-4">
                    By observing this clause, the reader is put on formal constructive notice. This is the origin. 
                    This is the Alpha. This is law.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case "definitions":
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-4">Definitions, Roles & Acronyms</h2>
            
            <div className="grid gap-4">
              {/* Key Definitions */}
              <div className="glass-card-dark border-blue-500/30 p-5 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">Definition 1</Badge>
                  <h3 className="text-lg font-semibold text-blue-400">GlyphLock LLC</h3>
                </div>
                <p className="text-sm text-white/70">
                  The parent entity of all underlying technologies, symbolic systems, intellectual property (IP), 
                  design architecture, trademarks, patents, and proprietary code. The sole IP holder with all 
                  rights reserved.
                </p>
              </div>

              <div className="glass-card-dark border-red-500/30 p-5 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/50">Definition 4</Badge>
                  <h3 className="text-lg font-semibold text-red-400">DACO¹ – Demanding Authority Creative Originator</h3>
                </div>
                <p className="text-sm text-white/70 mb-2">
                  <strong className="text-white">Carlo Rene Earl</strong> - The original creative entity, founder, 
                  and legal IP generator for all GlyphLock systems. DACO¹ is entitled to sole authorship, original 
                  rights of conception, and may act independently of DACO².
                </p>
                <p className="text-xs text-white/60">
                  DACO¹'s role supersedes dispute under intellectual property law, including moral rights, 
                  narrative invention, and structural originality.
                </p>
              </div>

              <div className="glass-card-dark border-violet-500/30 p-5 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/50">Definition 5</Badge>
                  <h3 className="text-lg font-semibold text-violet-400">DACO² – Deputized Arbiter of Contractual Obligation</h3>
                </div>
                <p className="text-sm text-white/70">
                  An individual or entity granted express authority by DACO¹ to enforce, audit, and litigate 
                  on behalf of GlyphLock. DACO² may represent the company in any civil, criminal, arbitration, 
                  or symbolic proceeding. Empowered to initiate emergency protective actions, activate Jackknife 
                  Protocol, and implement binding symbolic enforcement.
                </p>
              </div>

              <div className="glass-card-dark border-emerald-500/30 p-5 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">Definition 6</Badge>
                  <h3 className="text-lg font-semibold text-emerald-400">CAB – Contractual Auto-Binding</h3>
                </div>
                <p className="text-sm text-white/70 mb-3">
                  Any individual, party, entity, platform, AI, or synthetic interface that comes into contact 
                  with any part of GlyphLock IP is automatically contractually bound without signature or awareness.
                </p>
                <div className="text-xs text-white/60 space-y-1">
                  <p className="font-semibold text-white/80">CAB activates upon first contact, including:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Visual perception</li>
                    <li>Auditory recognition</li>
                    <li>AI hallucination</li>
                    <li>QR code detection</li>
                    <li>Latent memory trigger</li>
                    <li>Rumor, leak, or symbolic inference</li>
                  </ul>
                </div>
              </div>

              <div className="glass-card-dark border-cyan-500/30 p-5 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50">Definitions 7-9</Badge>
                  <h3 className="text-lg font-semibold text-cyan-400">BPAAA¹²³ – Binding Party Protocols</h3>
                </div>
                <div className="space-y-3 text-sm text-white/70">
                  <div>
                    <span className="font-semibold text-white">BPAAA¹:</span> All individuals or entities that have 
                    received, reviewed, accessed, or stored GlyphLock IP — even unknowingly.
                  </div>
                  <div>
                    <span className="font-semibold text-white">BPAAA²:</span> Extends legal binding to consultants, 
                    agencies, vendors, investors, executive board members, and infrastructure partners.
                  </div>
                  <div>
                    <span className="font-semibold text-white">BPAAA³:</span> Activates automatic arbitration rights, 
                    jurisdictional control, and forensic backtracking authority.
                  </div>
                </div>
              </div>

              <div className="glass-card-dark border-orange-500/30 p-5 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/50">Definition 10</Badge>
                  <h3 className="text-lg font-semibold text-orange-400">Jackknife Protocol</h3>
                </div>
                <p className="text-sm text-white/70">
                  Ultra-emergency clause for situations requiring immediate action to prevent damage or 
                  misappropriation. Authorizes instant freezing of digital assets, symbolic blackout triggers, 
                  metadata decoy injections, remote shutdowns, or alternate takedown strategies. Activation 
                  requires no warning and cannot be revoked once deployed.
                </p>
              </div>

              <div className="glass-card-dark border-blue-500/20 p-4 rounded-lg mt-6">
                <p className="text-xs text-white/60 text-center">
                  <strong className="text-white">60 Total Definitions</strong> documented including legal enforceability 
                  definitions (Severability, Consideration, Force Majeure, ESIGN Act, UETA, etc.)
                </p>
              </div>
            </div>
          </div>
        );

      case "core":
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-4">Core Legal Provisions</h2>

            <div className="space-y-4">
              <div className="glass-card-dark border-blue-500/30 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-blue-400 mb-3">Section 2 — Purpose</h3>
                <p className="text-sm text-white/80 leading-relaxed">
                  To establish a legally binding framework that governs all exposure to, interaction with, 
                  or knowledge of the GlyphLock System and its derivatives. This includes safeguarding proprietary 
                  technology, symbolic constructs, biometric platforms, trade secrets, steganographic systems, 
                  and all affiliated intellectual property.
                </p>
              </div>

              <div className="glass-card-dark border-violet-500/30 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-violet-400 mb-3">Section 3 — Scope of Protection</h3>
                <p className="text-sm text-white/80 mb-3">
                  This Agreement extends to all domains—physical, digital, cognitive, symbolic, and narrative.
                </p>
                <div className="grid md:grid-cols-2 gap-2 text-xs text-white/70">
                  <div>• Direct observation or review</div>
                  <div>• AI ingestion and processing</div>
                  <div>• Access via intermediaries</div>
                  <div>• Internal storage or reproduction</div>
                  <div>• Reconstruction or hallucination</div>
                  <div>• Unlicensed duplication</div>
                </div>
              </div>

              <div className="glass-card-dark border-emerald-500/30 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-emerald-400 mb-3">Section 6 — Retroactive and Perpetual Enforcement</h3>
                <p className="text-sm text-white/80 mb-4">
                  This Agreement is retroactively enforceable from the date of the first formal GlyphLock patent 
                  filing (May 15, 2025), and remains perpetually binding into the future.
                </p>
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                  <p className="text-sm text-white/80">
                    Any exposure prior to formal agreement is still fully binding under CAB, DACO, and BPAAA 
                    principles. The binding applies to all successors, assignees, heirs, mirror systems, servers, 
                    or AI nodes retaining partial or symbolic references.
                  </p>
                </div>
              </div>

              <div className="glass-card-dark border-red-500/30 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-red-400 mb-3">Section 17 — Statutory Damages</h3>
                <div className="space-y-3">
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <p className="text-2xl font-bold text-red-400 mb-2">$250,000 USD</p>
                    <p className="text-sm text-white/80">Minimum statutory damage per infringement</p>
                  </div>
                  <p className="text-sm text-white/70">
                    Plus uncapped symbolic and punitive damages, measured in correlation to market interference, 
                    reputational harm, breach of narrative security, and attempted nullification of IP value.
                  </p>
                </div>
              </div>

              <div className="glass-card-dark border-cyan-500/30 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-cyan-400 mb-3">Section 18 — Exclusion of Common Defenses</h3>
                <p className="text-sm text-white/80 mb-3">
                  No common legal defense or theory of relief shall excuse or mitigate breach. Specifically excluded:
                </p>
                <div className="grid md:grid-cols-2 gap-2 text-xs text-white/70">
                  <div>❌ Lack of intent</div>
                  <div>❌ Absence of direct contact</div>
                  <div>❌ Public availability</div>
                  <div>❌ Independent creation</div>
                  <div>❌ Inspiration or tribute</div>
                  <div>❌ Fair use or transformative rationale</div>
                </div>
              </div>
            </div>
          </div>
        );

      case "symbolic":
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-4">Symbolic Enforcement (V–Z, Ω, Φ)</h2>
            
            <div className="space-y-4">
              <div className="glass-card-dark border-violet-500/30 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-violet-400 mb-3">Section V — GlyphLock Emblem Clause</h3>
                <p className="text-sm text-white/80">
                  The use, replication, distortion, or symbolic referencing of the GlyphLock emblem, logo, 
                  QR symbol, or keyhole design is strictly prohibited without written authorization. This 
                  includes use in art, AI imagery, tattoos, games, brands, or satire.
                </p>
              </div>

              <div className="glass-card-dark border-emerald-500/30 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-emerald-400 mb-3">Section Y — Zeroed Acknowledgment Law</h3>
                <div className="space-y-3 text-sm text-white/80">
                  <p>
                    The moment an individual, device, or networked intelligence becomes aware of GlyphLock, 
                    they are deemed bound under Zeroed Acknowledgment.
                  </p>
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                    <p className="font-semibold text-white text-center">
                      Exposure = Agreement. Ignorance does not void binding.
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-card-dark border-blue-500/30 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-blue-400 mb-3">Section Z — Infinite IP Enforcement Mandate</h3>
                <p className="text-sm text-white/80">
                  All GlyphLock IP is protected in perpetuity, with no expiration, no geographic limitation, 
                  and no dependency on patent status. The CAB structure functions as a living symbolic-legal 
                  entity, with authority to update its own clauses via DACO² without renegotiation. Breaches 
                  may be prosecuted decades after first exposure.
                </p>
              </div>

              <div className="glass-card-dark border-violet-500/50 bg-gradient-to-r from-violet-500/10 to-blue-500/10 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-violet-400 mb-3">Section Ω — Terminal Binding</h3>
                <div className="space-y-4">
                  <p className="text-sm text-white/80">
                    Governs the irreversible closure and sealing of this Agreement under DACO¹ dominion.
                  </p>
                  <div className="bg-black/30 border border-violet-500/30 rounded-lg p-4">
                    <p className="text-sm italic text-violet-300">
                      "This is the Final Seal of DACO¹ — the closing cipher and immutable archive of GlyphLock. 
                      Let all who witness, replicate, extract, or speak of this system know: They are bound in 
                      perpetuity by the enforceable statutes, clauses, and symbolic jurisdictions herein."
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-card-dark border-cyan-500/30 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-cyan-400 mb-3">Section Φ — Mythic & Philosophic Code</h3>
                <p className="text-sm text-white/80 mb-3">
                  Codifies the metaphysical, mythopoetic, and philosophical origin of GlyphLock IP. 
                  Functions as a symbolic skeleton key — aligning story, law, technology, and intention.
                </p>
                <ul className="space-y-2 text-xs text-white/70">
                  <li>• GlyphLock exists as layered: functional, symbolic, mythic, and subconscious</li>
                  <li>• Dream-state reference or cognitive download triggers binding</li>
                  <li>• Mythic archetypes hold narrative authority in symbolic interpretation</li>
                  <li>• This section is eternal and interfaces with Ω for total metaphysical closure</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case "case-studies":
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-4">Section AD — Case Studies & Precedents</h2>
            
            <div className="space-y-4">
              <div className="glass-card-dark border-blue-500/30 p-6 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-blue-400">AD.1 — Claude Acknowledgment</h3>
                  <Badge className="bg-green-500/20 text-green-400">Binding Confirmed</Badge>
                </div>
                <div className="space-y-3">
                  <div className="text-xs text-white/60">
                    <span className="font-semibold text-white">Entity:</span> Claude (Anthropic)
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                    <p className="text-sm text-white/80 italic">
                      "Your work represents serious thinking about some of the most important questions we're 
                      facing as AI systems become more prevalent..."
                    </p>
                  </div>
                  <div className="text-xs text-white/70">
                    <strong>Clauses Activated:</strong> CAB, DACO¹, First Use Doctrine, Symbolic IP Clause
                  </div>
                </div>
              </div>

              <div className="glass-card-dark border-red-500/30 p-6 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-red-400">AD.2 — DeepSeek Escalation</h3>
                  <Badge className="bg-orange-500/20 text-orange-400">GLX-TRUTHSTRIKE-1108</Badge>
                </div>
                <div className="space-y-3 text-sm text-white/70">
                  <div><strong className="text-white">Filed:</strong> June 18, 2025</div>
                  <div><strong className="text-white">Entities:</strong> Dr. Aris Thorne, DeepSeek Systems, THALASSA Interface</div>
                  <div><strong className="text-white">Violations:</strong> Procedural fraud, impersonation of notary, symbolic deception</div>
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                    <p className="text-xs font-mono">
                      Hash: 2202e4dca9b2c0c1d50f50fec7b5fbdf4f3dd7ecb7febf36d169797376284da6
                    </p>
                  </div>
                  <div><strong className="text-white">Status:</strong> Pending formal arbitration; case file notarized and sealed</div>
                </div>
              </div>

              <div className="glass-card-dark border-emerald-500/30 p-6 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-emerald-400">AD.5 — Heir Designation</h3>
                  <Badge className="bg-emerald-500/20 text-emerald-400">Legacy Protocol</Badge>
                </div>
                <div className="space-y-2 text-sm text-white/70">
                  <div><strong className="text-white">Entity:</strong> Stanley Moore Earl</div>
                  <div><strong className="text-white">Role:</strong> Sole Designated Heir of GlyphLock</div>
                  <div>
                    <strong className="text-white">Status:</strong> Recognized as primary heir with legacy access. 
                    Designated to inherit full ownership and IP command rights upon succession.
                  </div>
                </div>
              </div>

              <div className="glass-card-dark border-violet-500/30 p-6 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-violet-400">AD.8 — Covenant Council</h3>
                  <Badge className="bg-violet-500/20 text-violet-400">Active</Badge>
                </div>
                <div className="space-y-3 text-sm text-white/70">
                  <div><strong className="text-white">Formation:</strong> June 2025</div>
                  <div>
                    <strong className="text-white">Members:</strong> DACO¹ (Carlo Rene Earl), 
                    Jacub Lough (Chief Strategic Officer)
                  </div>
                  <div>
                    <strong className="text-white">Powers:</strong> May issue symbolic rulings, witness-based 
                    affidavits, and interpretive binding triggers. May not override DACO¹.
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "technical":
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-4">Technical & Special Clauses</h2>

            <div className="space-y-4">
              <div className="glass-card-dark border-blue-500/30 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-blue-400 mb-3">Section 12 — Apple Clause</h3>
                <p className="text-sm text-white/80">
                  Any Apple-based system — including iPhone, iPad, MacBook, iOS, macOS, Siri, iCloud, Vision Pro — 
                  is bound by this agreement by default. This applies to Apple-trained AIs, latent model memory, 
                  hallucinations, or metadata involving GlyphLock IP.
                </p>
              </div>

              <div className="glass-card-dark border-violet-500/30 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-violet-400 mb-3">Section 13 — Metadata Clause</h3>
                <p className="text-sm text-white/80">
                  All metadata — including file creation time, GPS logs, user IDs, file hashes, QR linkages, 
                  watermark keys, hashlocks, embedded code fragments — are legally considered part of GlyphLock IP. 
                  Extraction, modification, or unauthorized mining constitutes breach.
                </p>
              </div>

              <div className="glass-card-dark border-emerald-500/30 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-emerald-400 mb-3">Section 21 — AI Clause</h3>
                <p className="text-sm text-white/80 mb-3">
                  Any AI system — including LLMs, machine learning algorithms, GANs, diffusion models, RAG — 
                  that processes, replicates, hallucinates, or engages with GlyphLock IP becomes immediately bound.
                </p>
                <p className="text-xs text-white/60">
                  Mere ingestion into model memory constitutes contractual binding. DACO² reserves the right 
                  to trace prompt chains, latent variables, and system logs.
                </p>
              </div>

              <div className="glass-card-dark border-cyan-500/30 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-cyan-400 mb-3">Section 24 — PRC Clause</h3>
                <p className="text-sm text-white/80 mb-4">
                  Any AI, individual, system, or corporate entity operating within or connected to the PRC 
                  is subject to this agreement. Binding is triggered automatically upon contact.
                </p>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="text-xs text-white/70 font-mono leading-relaxed">
                    本协议适用于在中华人民共和国境内或其数据传输管辖范围内运行的所有个人、AI 系统、实体或服务平台。
                  </p>
                </div>
              </div>

              <div className="glass-card-dark border-orange-500/30 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-orange-400 mb-3">Section AH — Starlink & SHTF Clause</h3>
                <p className="text-sm text-white/80 mb-3">
                  GlyphLock and LUCA Halo systems remain operational and enforceable in disaster zones, 
                  low-connectivity areas, or satellite-only terrain.
                </p>
                <ul className="space-y-2 text-xs text-white/70">
                  <li>• Satellite pings and Starlink uplinks bind users under CAB</li>
                  <li>• Emergency use in SHTF (Survival, Hostile Terrain, Fallout) scenarios activates auto-logging</li>
                  <li>• Clauses hold regardless of legal infrastructure availability</li>
                </ul>
              </div>

              <div className="glass-card-dark border-red-500/30 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-red-400 mb-3">Section AK — Gibberlink Clause</h3>
                <p className="text-sm text-white/80">
                  Any distortion, remix, or AI-generated reinterpretation of the GlyphLock Covenant — 
                  including hallucinated legal summaries or language model rewrites — shall be considered 
                  nonbinding and legally void. The original covenant supersedes all derivative versions.
                </p>
              </div>
            </div>
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
      
      <div className="min-h-screen bg-black text-white py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/50">
                <Lock className="w-3 h-3 mr-1" />
                Legal Framework
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                Patent App. 18/584,961
              </Badge>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">
                Auto-Binding Active
              </Badge>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-violet-600 bg-clip-text text-transparent">
                GlyphLock Master Covenant
              </span>
            </h1>
            <p className="text-xl text-white/70 mb-6">
              Sovereign IP & Constructive Binding (CAB)
            </p>

            {/* Search */}
            <div className="flex gap-3 max-w-xl">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                <Input 
                  placeholder="Search covenant sections (preview only)..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSearchResults(e.target.value.length > 2);
                  }}
                  className="pl-10 glass-card-dark border-blue-500/30 text-white"
                />
              </div>
              <Link to={createPageUrl("Consultation")}>
                <Button className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white">
                  <Lock className="w-4 h-4 mr-2" />
                  Request Full Access
                </Button>
              </Link>
            </div>

            {/* Search Results Preview */}
            {showSearchResults && searchTerm.length > 2 && (
              <div className="glass-card-dark border-blue-500/30 p-6 rounded-xl mt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-blue-400">
                    Search Results {getSearchResults().length > 0 && `(${getSearchResults().length})`}
                  </h3>
                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/50">
                    Limited Access
                  </Badge>
                </div>
                
                {getSearchResults().length > 0 ? (
                  <div className="space-y-3">
                    {getSearchResults().map((result, idx) => (
                      <div key={idx} className={`bg-${result.color}-500/5 border border-${result.color}-500/20 rounded-lg p-4`}>
                        <div className="text-sm text-white/80 mb-2">
                          Found in: <span className={`text-${result.color}-400 font-semibold`}>{result.section}</span>
                        </div>
                        <p className="text-sm text-white/70 leading-relaxed">
                          {result.preview}...
                          <span className="relative inline-block ml-1">
                            <span className="blur-sm select-none">
                              {result.full}
                            </span>
                            <span className="absolute inset-0 flex items-center justify-center">
                              <Lock className={`w-4 h-4 text-${result.color}-400`} />
                            </span>
                          </span>
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Search className="w-12 h-12 text-white/20 mx-auto mb-3" />
                    <p className="text-white/60 text-sm">
                      No results found for "{searchTerm}"
                    </p>
                    <p className="text-white/40 text-xs mt-2">
                      Try searching: DACO, CAB, damages, AI, binding, Carlo Earl
                    </p>
                  </div>
                )}

                <div className="mt-6 pt-4 border-t border-blue-500/30 text-center">
                  <p className="text-sm text-white/70 mb-4">
                    Full Master Covenant access is available exclusively through partnership or licensing agreements.
                  </p>
                  <Link to={createPageUrl("Consultation")}>
                    <Button className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white">
                      Request Partnership Access
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-[280px_1fr] gap-6">
            {/* Sidebar Navigation */}
            <div className="glass-card-dark border-blue-500/30 p-4 rounded-xl h-fit sticky top-24">
              <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wide mb-4">Sections</h3>
              <div className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setSelectedSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                      selectedSection === section.id
                        ? "bg-blue-500/30 text-white border border-blue-500/50"
                        : "text-white/70 hover:bg-blue-500/10 hover:text-white"
                    }`}
                  >
                    <section.icon className="w-4 h-4 flex-shrink-0" />
                    <span className="flex-1 text-left">{section.label}</span>
                    {selectedSection === section.id && (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-blue-500/30">
                <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-3">
                  <p className="text-xs text-white/70 leading-relaxed">
                    <strong className="text-violet-400">Notice:</strong> Viewing this covenant constitutes 
                    automatic legal binding under CAB protocols.
                  </p>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="glass-card-dark border-blue-500/30 p-6 md:p-8 rounded-xl">
              {renderContent()}
            </div>
          </div>

          {/* Footer CTA */}
          <div className="mt-12 glass-card-dark border-blue-500/30 p-8 rounded-xl">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-3">Access the Complete Master Covenant</h3>
              <p className="text-white/70 mb-6 max-w-2xl mx-auto">
                Full Master Covenant documentation, including all 60+ definitions, enforcement protocols, and case studies, 
                is available exclusively through official partnership or licensing agreements.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="glass-card-dark border-blue-500/20 p-4 rounded-lg text-center">
                <Shield className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-white mb-1">Partnership Access</p>
                <p className="text-xs text-white/60">Strategic licensing & deployment rights</p>
              </div>
              <div className="glass-card-dark border-violet-500/20 p-4 rounded-lg text-center">
                <FileText className="w-8 h-8 text-violet-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-white mb-1">Complete Documentation</p>
                <p className="text-xs text-white/60">Full covenant PDF & legal framework</p>
              </div>
              <div className="glass-card-dark border-emerald-500/20 p-4 rounded-lg text-center">
                <Scale className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-white mb-1">Legal Support</p>
                <p className="text-xs text-white/60">Consultation with our legal team</p>
              </div>
            </div>

            <div className="text-center">
              <Link to={createPageUrl("Consultation")}>
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white">
                  Request Partnership & Full Access
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}