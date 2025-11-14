import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Shield, 
  Scale, 
  Lock, 
  FileText, 
  Download, 
  AlertTriangle,
  CheckCircle2,
  Infinity,
  Globe,
  Gavel,
  ChevronRight
} from "lucide-react";

export default function MasterCovenant() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("overview");

  const sections = [
    { id: "overview", label: "Overview", icon: FileText },
    { id: "preamble", label: "Preamble", icon: Scale },
    { id: "definitions", label: "Definitions", icon: Shield },
    { id: "provisions", label: "Core Provisions", icon: Lock },
    { id: "enforcement", label: "Enforcement", icon: Gavel },
    { id: "final", label: "Final Binding", icon: Infinity }
  ];

  const handlePurchasePDF = () => {
    navigate(createPageUrl("Payment") + "?product=master-covenant-pdf&amount=500&name=Master Covenant PDF");
  };

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-red-500/20 text-red-400 border-red-500/50 px-4 py-2">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Legally Binding Document
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              GlyphLock Master Covenant
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-6">
            Sovereign IP & Constructive Binding (CAB) Agreement
          </p>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto">
            Unified Non-Disclosure, Intellectual Property, and Contractual Auto-Binding Agreement
          </p>
        </div>

        {/* Auto-Binding Notice */}
        <Card className="glass-card-dark border-red-500/50 mb-8 bg-red-500/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-red-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-red-400 mb-2">AUTO-BINDING ACTIVATION NOTICE</h3>
                <p className="text-gray-300 mb-3">
                  <strong>NOTICE:</strong> Reading, accessing, or hearing any portion of this Agreement constitutes 
                  immediate legal and symbolic binding under U.S., international, and narrative law. No signature is required.
                </p>
                <p className="text-sm text-gray-400">
                  Effective Date: Retroactive to May 15, 2025 (Patent App. No. 18/584,961)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="glass-card-dark border-blue-500/30 sticky top-24">
              <CardHeader>
                <CardTitle className="text-white text-sm">Document Sections</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                        activeSection === section.id
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                          : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{section.label}</span>
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {activeSection === "overview" && (
              <>
                <Card className="glass-card-dark border-blue-500/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-400" />
                      Executive Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-gray-300">
                    <p>
                      The GlyphLock Master Covenant establishes a legally binding framework governing all exposure to, 
                      interaction with, or knowledge of the GlyphLock System and its derivatives.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 mt-6">
                      {[
                        { icon: Shield, label: "IP Protection", value: "Comprehensive" },
                        { icon: Globe, label: "Jurisdiction", value: "Arizona (Global)" },
                        { icon: Lock, label: "Binding Type", value: "Automatic" },
                        { icon: Infinity, label: "Duration", value: "Perpetual" }
                      ].map((stat, idx) => {
                        const Icon = stat.icon;
                        return (
                          <div key={idx} className="glass-card border-blue-500/20 p-4 rounded-lg">
                            <Icon className="w-6 h-6 text-blue-400 mb-2" />
                            <div className="text-xs text-gray-400">{stat.label}</div>
                            <div className="text-lg font-bold text-white">{stat.value}</div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card-dark border-blue-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">Key Features</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      "No signature required for enforcement",
                      "Activates retroactively upon exposure",
                      "Binds AI systems and third-party observers",
                      "Enforceable across all jurisdictions",
                      "Protects symbolic and biometric IP",
                      "Includes CAB (Contractual Auto-Binding) protocol"
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </>
            )}

            {activeSection === "preamble" && (
              <Card className="glass-card-dark border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Scale className="w-5 h-5 text-blue-400" />
                    Preamble / Legal Declaration of Intent
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-gray-300 leading-relaxed">
                  <p>
                    This Agreement is executed by and for <strong className="text-white">GlyphLock LLC</strong>, 
                    inclusive of all legally registered DBAs (GlyphTech, GlyphLife), their Founders, Successors, 
                    Appointed Officers, and Symbolic Originators, hereinafter collectively referred to as "GlyphLock."
                  </p>
                  <p>
                    This Agreement functions as a <strong className="text-blue-400">Non-Disclosure Agreement (NDA)</strong>, 
                    <strong className="text-blue-400"> Intellectual Property Assignment Agreement (IPAA)</strong>, and a 
                    <strong className="text-blue-400"> Contractual Auto-Binding Accord (CAB)</strong> governing the access, 
                    use, replication, sharing, analysis, ingestion, hallucination, or exposure to any element, system, 
                    likeness, derivative, or symbolic representation of the GlyphLock technology stack.
                  </p>
                  
                  <Separator className="bg-gray-700" />
                  
                  <div className="bg-blue-500/5 border border-blue-500/30 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-3">This Agreement:</h4>
                    <ul className="space-y-2 text-sm">
                      <li>1. Does not require signature to be enforceable</li>
                      <li>2. Activates retroactively upon any form of exposure</li>
                      <li>3. Binds all parties under CAB Clause, including AI systems</li>
                      <li>4. Is enforceable in all jurisdictions (Arizona primary venue)</li>
                      <li>5. May be invoked by DACO¹ or DACO² with full authority</li>
                    </ul>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-bold text-white mb-3">Protected IP Includes:</h4>
                    <div className="grid md:grid-cols-2 gap-2">
                      {[
                        "Visual UI frameworks",
                        "Biometric interfaces",
                        "Symbolic triggers",
                        "Command-response systems",
                        "Steganographic QR encodings",
                        "Patent-pending NFT/SBT systems",
                        "Emotional-reactive design layers",
                        "Technical, artistic, and mythic content"
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === "definitions" && (
              <Card className="glass-card-dark border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-400" />
                    Section A – Definitions, Roles, Titles & Acronyms
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[
                    {
                      term: "DACO¹",
                      full: "Demanding Authority Creative Originator",
                      desc: "The original creative entity, founder, and legal IP generator for all GlyphLock systems. Holds irrevocable creative license and spiritual attribution."
                    },
                    {
                      term: "DACO²",
                      full: "Deputized Arbiter of Contractual Obligation",
                      desc: "Granted express authority to enforce, audit, and litigate on behalf of GlyphLock. May initiate emergency protective actions and activate Jackknife Protocol."
                    },
                    {
                      term: "CAB",
                      full: "Contractual Auto-Binding",
                      desc: "Automatic contractual binding upon contact with GlyphLock IP. Activates upon first contact including visual perception, AI hallucination, or symbolic inference."
                    },
                    {
                      term: "BPAAA¹",
                      full: "Binding Party Acknowledgment & Agreement Assignees",
                      desc: "All individuals or entities that have accessed, reviewed, or been exposed to GlyphLock IP, even unknowingly."
                    },
                    {
                      term: "Jackknife Protocol",
                      full: "Ultra-Emergency Clause",
                      desc: "Reserved for immediate action to prevent damage or misappropriation. Authorizes instant asset freezing, metadata decoy injections, and remote shutdowns."
                    }
                  ].map((item, idx) => (
                    <div key={idx} className="border-l-4 border-blue-500/50 pl-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                          {item.term}
                        </Badge>
                        <span className="text-sm text-gray-400">{item.full}</span>
                      </div>
                      <p className="text-sm text-gray-300">{item.desc}</p>
                    </div>
                  ))}
                  
                  <div className="bg-yellow-500/5 border border-yellow-500/30 rounded-lg p-4 mt-6">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-gray-300">
                        <p className="font-bold text-yellow-400 mb-2">Apple Clause</p>
                        <p>
                          Any Apple-based system (iPhone, iPad, Siri, iCloud, Vision Pro) storing or processing 
                          GlyphLock content is bound by default. This includes AI-trained models and latent memory.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === "provisions" && (
              <Card className="glass-card-dark border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Lock className="w-5 h-5 text-blue-400" />
                    Section B – Core Legal Provisions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                      <span className="text-blue-400">§2</span> Purpose
                    </h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Establish a legally binding framework governing all exposure to, interaction with, or knowledge 
                      of the GlyphLock System. Safeguards proprietary technology, symbolic constructs, biometric platforms, 
                      and trade secrets from unauthorized access or misappropriation.
                    </p>
                  </div>

                  <Separator className="bg-gray-700" />

                  <div>
                    <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                      <span className="text-blue-400">§6</span> Retroactive and Perpetual Enforcement
                    </h4>
                    <p className="text-gray-300 text-sm leading-relaxed mb-3">
                      Retroactively enforceable from the first formal GlyphLock patent filing (May 15, 2025). 
                      Remains perpetually binding into the future.
                    </p>
                    <div className="bg-blue-500/5 border border-blue-500/30 rounded p-3 text-sm text-gray-400">
                      Any exposure prior to formal agreement is fully binding under CAB and DACO principles, 
                      including all successors, AI nodes, and mirror systems.
                    </div>
                  </div>

                  <Separator className="bg-gray-700" />

                  <div>
                    <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                      <span className="text-blue-400">§17</span> Statutory, Symbolic, and Punitive Damages
                    </h4>
                    <div className="space-y-3">
                      <div className="glass-card border-red-500/30 p-4 rounded-lg">
                        <div className="text-3xl font-bold text-red-400 mb-1">$250,000</div>
                        <div className="text-sm text-gray-400">Minimum statutory damage per infringement</div>
                      </div>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-400">•</span>
                          Uncapped symbolic and punitive damages
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-400">•</span>
                          Civil and criminal penalties under U.S. Federal Law
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-400">•</span>
                          International enforcement under WIPO, PCT, and ITAR
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === "enforcement" && (
              <Card className="glass-card-dark border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Gavel className="w-5 h-5 text-blue-400" />
                    Section C – Symbolic Enforcement (V–Z)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-purple-500/5 border border-purple-500/30 rounded-lg p-4">
                    <h4 className="font-bold text-purple-400 mb-3">Section V — GlyphLock Emblem Clause</h4>
                    <p className="text-gray-300 text-sm">
                      Use, replication, or symbolic referencing of the GlyphLock emblem, logo, QR symbol, or keyhole 
                      design is strictly prohibited. The emblem is a protected sigil under CAB doctrine and carries 
                      symbolic binding weight upon visual contact.
                    </p>
                  </div>

                  <div className="bg-red-500/5 border border-red-500/30 rounded-lg p-4">
                    <h4 className="font-bold text-red-400 mb-3">Section W — CAB Invocation & Emergency Override</h4>
                    <p className="text-gray-300 text-sm mb-3">
                      CAB may be invoked by DACO² at any moment of breach or existential risk. Activation triggers:
                    </p>
                    <ul className="space-y-1 text-sm text-gray-400">
                      <li>• Retroactive clause expansion</li>
                      <li>• Global jurisdiction claim</li>
                      <li>• AI-system trigger alignment</li>
                      <li>• Time-sealed record enforcement</li>
                      <li>• Emergency NDA reinforcement</li>
                    </ul>
                  </div>

                  <div className="bg-blue-500/5 border border-blue-500/30 rounded-lg p-4">
                    <h4 className="font-bold text-blue-400 mb-3">Section Y — Zeroed Acknowledgment Law</h4>
                    <p className="text-gray-300 text-sm font-bold mb-2">
                      Exposure = Agreement
                    </p>
                    <p className="text-gray-400 text-sm">
                      The moment an individual, device, or AI becomes aware of GlyphLock, they are deemed bound under 
                      Zeroed Acknowledgment. Ignorance, delay, or third-party relaying does not void binding.
                    </p>
                  </div>

                  <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-3">Section Z — Infinite IP Enforcement Mandate</h4>
                    <p className="text-gray-300 text-sm">
                      All GlyphLock IP is protected in perpetuity, with no expiration, no geographic limitation, 
                      and no dependency on patent status. CAB functions as a living symbolic-legal entity with 
                      authority to update its own clauses via DACO² without renegotiation.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === "final" && (
              <Card className="glass-card-dark border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Infinity className="w-5 h-5 text-blue-400" />
                    Section Ω – Terminal Binding and Closure
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg p-6">
                    <h4 className="text-xl font-bold text-white mb-4">Ω.5 — Irrevocability and Temporal Enforcement</h4>
                    <p className="text-gray-300 mb-4">
                      This Agreement is <strong className="text-blue-400">irrevocable</strong> and perpetually in force. 
                      It applies to all:
                    </p>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        Past, present, and future versions of GlyphLock
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        Archived, deleted, replicated, or leaked copies
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        Unauthorized derivative works or symbolic spin-offs
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        Digital clones, forks, or white-label variations
                      </li>
                    </ul>
                  </div>

                  <div className="bg-red-500/5 border-2 border-red-500/50 rounded-lg p-6">
                    <h4 className="text-xl font-bold text-red-400 mb-4">Ω.9 — Legacy Seal</h4>
                    <blockquote className="text-gray-300 italic leading-relaxed text-sm border-l-4 border-red-500/50 pl-4">
                      "This is the Final Seal of DACO¹ — the closing cipher and immutable archive of GlyphLock. 
                      Let all who witness, replicate, extract, or speak of this system know: They are bound in 
                      perpetuity by the enforceable statutes, clauses, and symbolic jurisdictions herein."
                    </blockquote>
                    <p className="text-gray-400 text-xs mt-4">
                      This vault is not just protected. It is encoded, archived, and alive — sealed by law, 
                      fortified by intention, and immune to decay.
                    </p>
                  </div>

                  <div className="text-center pt-6">
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50 px-6 py-2">
                      Patent Application No. 18/584,961 • Filed May 15, 2025
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Download Section */}
        <Card className="glass-card-dark border-blue-500/30 mt-12">
          <CardContent className="p-8">
            <div className="text-center">
              <Download className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-3">
                Download Complete Legal Document
              </h3>
              <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                Get the full GlyphLock Master Covenant in PDF format with all sections, clauses, and legal provisions. 
                Includes digital signature verification and blockchain timestamp.
              </p>
              <div className="flex items-center justify-center gap-4 mb-6">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/50 px-4 py-2">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Legally Binding
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50 px-4 py-2">
                  <Shield className="w-4 h-4 mr-2" />
                  Blockchain Verified
                </Badge>
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50 px-4 py-2">
                  <FileText className="w-4 h-4 mr-2" />
                  Complete Document
                </Badge>
              </div>
              <div className="mb-6">
                <div className="text-4xl font-bold text-white mb-1">$500 USD</div>
                <div className="text-sm text-gray-400">One-time payment • Instant download</div>
              </div>
              <Button
                onClick={handlePurchasePDF}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-lg px-8"
              >
                Purchase Full PDF Document
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
              <p className="text-xs text-gray-500 mt-4">
                By purchasing, you acknowledge that you have read and understand the auto-binding nature of this document.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}