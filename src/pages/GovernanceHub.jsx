import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Shield, Scale, Lock, FileText, Download, AlertTriangle, CheckCircle2,
  Infinity, Globe, Gavel, ChevronRight, Brain, BookOpen, FileCheck, Briefcase
} from "lucide-react";

export default function GovernanceHub() {
  const navigate = useNavigate();
  const [activeCovenantSection, setActiveCovenantSection] = useState("overview");

  const covenantSections = [
    { id: "overview", label: "Overview", icon: Shield },
    { id: "preamble", label: "Preamble", icon: FileText },
    { id: "definitions", label: "Definitions", icon: Scale },
    { id: "provisions", label: "Core Provisions", icon: Lock },
    { id: "enforcement", label: "Enforcement", icon: AlertTriangle },
    { id: "jurisdiction", label: "Jurisdiction", icon: Globe },
    { id: "damages", label: "Remedies & Damages", icon: Briefcase },
    { id: "binding", label: "Auto-Binding Protocol", icon: FileCheck },
    { id: "final", label: "Final Seal", icon: CheckCircle2 }
  ];



  const handlePurchasePDF = () => {
    navigate(createPageUrl("Payment") + "?product=master-covenant-pdf&amount=500&name=Master Covenant PDF");
  };

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <Badge className="mb-4 glass-royal border-blue-500/50">
            <Brain className="w-4 h-4 mr-2" />
            Legal Framework & AI Governance
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
            GlyphLock <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Master Covenant
            </span>
          </h1>
          <p className="text-xl text-cyan-300/80 max-w-3xl mx-auto mb-4">
            Proprietary Legal Framework for Intellectual Property Protection and Automated Contractual Enforcement
          </p>
          <Badge className="glass-royal border-red-500/50 text-red-400">
            <AlertTriangle className="w-3 h-3 mr-2" />
            Auto-Binding Upon Exposure • No Signature Required
          </Badge>
        </div>

        <div className="w-full">
            <div className="grid lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <div className="glass-card-dark border-cyan-500/30 rounded-xl sticky top-24 p-6">
                  <h3 className="text-cyan-300 text-sm font-bold mb-4">Document Sections</h3>
                  <div className="space-y-2">
                    {covenantSections.map((section) => {
                      const Icon = section.icon;
                      return (
                        <button
                          key={section.id}
                          onClick={() => setActiveCovenantSection(section.id)}
                          className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                            activeCovenantSection === section.id
                              ? 'bg-blue-600/40 text-cyan-300 border border-cyan-500/50'
                              : 'text-white/70 hover:bg-blue-900/20 hover:text-cyan-300'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-sm">{section.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3 space-y-6">
                {activeCovenantSection === "overview" && (
                  <>
                    <div className="glass-card-dark border-cyan-500/30 rounded-xl p-6">
                      <h2 className="text-cyan-300 flex items-center gap-2 text-xl font-bold mb-4">
                        <FileText className="w-5 h-5 text-cyan-400" />
                        Executive Summary
                      </h2>
                      <div className="space-y-4 text-white">
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
                              <div key={idx} className="glass-card-dark border-blue-500/30 p-4 rounded-lg">
                                <Icon className="w-6 h-6 text-cyan-400 mb-2" />
                                <div className="text-xs text-cyan-300/60">{stat.label}</div>
                                <div className="text-lg font-bold text-white">{stat.value}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="glass-card-dark border-cyan-500/30 rounded-xl p-6">
                      <h2 className="text-cyan-300 font-bold mb-4">Key Features</h2>
                      <div className="space-y-3">
                        {[
                          "Self-executing contractual mechanism requiring no manual signature",
                          "Retroactive enforcement provisions pursuant to common law precedent",
                          "Binds natural persons, legal entities, automated systems, and AI agents",
                          "Multi-jurisdictional enforceability under U.S. Federal and Arizona state law",
                          "Comprehensive protection of trade secrets, patent claims, and copyrighted works",
                          "Automated Contractual Binding (CAB) protocol activating upon first exposure",
                          "Statutory and punitive damages framework with uncapped liability",
                          "Emergency protective measures including injunctive relief and asset freezing"
                        ].map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                            <span className="text-white text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {activeCovenantSection === "preamble" && (
                  <div className="glass-card-dark border-cyan-500/30 rounded-xl p-6">
                    <h2 className="text-cyan-300 flex items-center gap-2 text-xl font-bold mb-4">
                      <Scale className="w-5 h-5 text-cyan-400" />
                      Preamble / Legal Declaration of Intent
                    </h2>
                    <div className="space-y-4 text-white leading-relaxed text-sm">
                      <p>
                        This Agreement is entered into by and on behalf of <strong className="text-cyan-300">GlyphLock Security LLC</strong>, 
                        a limited liability company duly organized and existing under the laws of the State of Arizona, 
                        inclusive of all registered DBAs, trade names, affiliates, subsidiaries, successors-in-interest, 
                        assigns, and authorized representatives (hereinafter collectively referred to as <strong>"GlyphLock"</strong> 
                        or the <strong>"Company"</strong>).
                      </p>
                      <p>
                        This Covenant constitutes a legally binding <strong className="text-blue-400">Multi-Purpose Protective Instrument</strong> 
                        functioning simultaneously as: (i) a <strong>Non-Disclosure Agreement (NDA)</strong> pursuant to the 
                        Uniform Trade Secrets Act (UTSA) and 18 U.S.C. § 1836; (ii) an <strong>Intellectual Property Rights Assignment 
                        and Acknowledgment Agreement (IPRAA)</strong> under 17 U.S.C. § 101 et seq. and 35 U.S.C. § 271; 
                        (iii) a <strong>Contractual Auto-Binding Protocol (CAB)</strong> establishing immediate and irrevocable 
                        obligations upon exposure, access, or knowledge acquisition; and (iv) an <strong>Enforcement Framework</strong> 
                        authorizing injunctive relief, statutory damages, and emergency protective measures.
                      </p>

                      <Separator className="bg-cyan-700/30" />

                      <div className="glass-card-dark border-blue-500/30 rounded-lg p-4">
                        <h4 className="font-bold text-cyan-300 mb-3">Enforceability and Binding Mechanics:</h4>
                        <ul className="space-y-2 text-xs text-white leading-relaxed">
                          <li><strong>1. No Manual Signature Required:</strong> Binding occurs automatically upon exposure, 
                          consistent with electronic contract formation principles under 15 U.S.C. § 7001 (E-SIGN Act) and 
                          the doctrine of implied-in-fact contracts.</li>
                          <li><strong>2. Retroactive Enforcement Provisions:</strong> Obligations apply retroactively to all 
                          prior exposure events, supported by equitable estoppel and unjust enrichment doctrines.</li>
                          <li><strong>3. Universal Binding Scope:</strong> Applies to natural persons, corporate entities, 
                          governmental bodies, automated systems, artificial intelligence agents, and any entity capable of 
                          processing, analyzing, or retaining information.</li>
                          <li><strong>4. Jurisdictional Enforceability:</strong> Primary venue in Maricopa County, Arizona, 
                          with supplemental jurisdiction claims available in all U.S. Federal Courts and applicable international tribunals.</li>
                          <li><strong>5. Delegated Enforcement Authority:</strong> Authorized representatives may invoke 
                          emergency provisions, initiate legal proceedings, and execute protective orders without prior judicial approval in exigent circumstances.</li>
                        </ul>
                      </div>

                      <div className="mt-6">
                        <h4 className="font-bold text-cyan-300 mb-3">Protected Intellectual Property Assets (Non-Exhaustive):</h4>
                        <div className="grid md:grid-cols-2 gap-2">
                          {[
                            "Proprietary visual cryptography algorithms and frameworks",
                            "Multi-factor biometric authentication systems",
                            "Steganographic encoding and decoding methodologies",
                            "QR-based secure data transmission protocols",
                            "Blockchain-integrated verification architectures",
                            "Trade secret business processes and operational workflows",
                            "Patentable security automation technologies (Patent App. No. 18/584,961)",
                            "Copyrighted software, documentation, and user interfaces",
                            "Symbolic representation systems and design elements",
                            "Proprietary API structures and integration protocols"
                          ].map((item, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs">
                              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1 flex-shrink-0"></div>
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeCovenantSection === "definitions" && (
                  <div className="glass-card-dark border-cyan-500/30 rounded-xl p-6">
                    <h2 className="text-cyan-300 flex items-center gap-2 text-xl font-bold mb-4">
                      <Shield className="w-5 h-5 text-cyan-400" />
                      Section A – Definitions, Roles, Titles & Acronyms
                    </h2>
                    <div className="space-y-6">
                      {[
                        {
                          term: "Protected IP",
                          full: "Proprietary Intellectual Property Assets",
                          desc: "All trade secrets, patent claims, copyrighted works, trademarks, and confidential business information owned, developed, or controlled by GlyphLock, including derivative works, improvements, and modifications."
                        },
                        {
                          term: "CAB Protocol",
                          full: "Contractual Auto-Binding Mechanism",
                          desc: "A self-executing contractual framework whereby binding obligations attach immediately upon exposure to, access of, or knowledge acquisition regarding Protected IP, without requirement of manual signature, explicit consent, or formal acknowledgment. Operates pursuant to principles of implied-in-fact contracts and electronic transaction law."
                        },
                        {
                          term: "Exposure Event",
                          full: "Initial Contact or Knowledge Acquisition",
                          desc: "Any act of viewing, accessing, processing, analyzing, copying, transmitting, discussing, or otherwise acquiring knowledge of Protected IP through any means, including visual observation, electronic transmission, automated processing, or third-party disclosure."
                        },
                        {
                          term: "Bound Party",
                          full: "Obligated Entity or Individual",
                          desc: "Any natural person, legal entity, automated system, artificial intelligence agent, or organizational unit that has experienced an Exposure Event and is thereby subject to the obligations, restrictions, and remedial provisions set forth herein."
                        },
                        {
                          term: "Emergency Protocol",
                          full: "Exigent Circumstances Protective Measures",
                          desc: "Expedited enforcement mechanisms available upon reasonable belief of imminent misappropriation, unauthorized disclosure, or competitive harm, including ex parte injunctive relief, temporary restraining orders, and asset preservation orders."
                        },
                        {
                          term: "Statutory Damages",
                          full: "Liquidated Damages Framework",
                          desc: "Pre-established monetary penalties ranging from $100,000 to $250,000 per violation, plus uncapped punitive damages, treble damages for willful infringement, and full recovery of attorneys' fees and costs."
                        }
                      ].map((item, idx) => (
                        <div key={idx} className="border-l-4 border-blue-500/50 pl-4">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge className="bg-blue-500/20 text-cyan-300 border-cyan-500/50">
                              {item.term}
                            </Badge>
                            <span className="text-sm text-cyan-300/70">{item.full}</span>
                          </div>
                          <p className="text-sm text-white">{item.desc}</p>
                        </div>
                      ))}

                      <div className="glass-card-dark border-purple-500/30 rounded-lg p-4 mt-6">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                          <div className="text-xs text-white leading-relaxed">
                            <p className="font-bold text-purple-400 mb-2">Technology Platform Binding Provisions</p>
                            <p>
                              Any computational system, cloud storage infrastructure, or automated processing environment 
                              (including but not limited to Apple iOS/macOS ecosystem, Google Cloud Platform, Microsoft Azure, 
                              Amazon Web Services) that stores, processes, analyzes, or maintains Protected IP in any form 
                              becomes subject to this Covenant. This extends to AI training datasets, cached memory systems, 
                              and distributed ledger technologies.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeCovenantSection === "provisions" && (
                  <div className="glass-card-dark border-cyan-500/30 rounded-xl p-6">
                    <h2 className="text-cyan-300 flex items-center gap-2 text-xl font-bold mb-4">
                      <Lock className="w-5 h-5 text-cyan-400" />
                      Section B – Core Legal Provisions
                    </h2>
                    <div className="space-y-6 text-white">
                      <div>
                        <h4 className="font-bold text-cyan-300 mb-3 flex items-center gap-2">
                          <span className="text-blue-400">§2</span> Purpose
                        </h4>
                        <p className="text-sm leading-relaxed">
                          To establish a comprehensive, enforceable, and self-executing contractual framework pursuant to 
                          17 U.S.C. § 101 et seq., 35 U.S.C. § 271, and applicable state trade secret statutes, governing 
                          all exposure to, interaction with, processing, analysis, replication, derivative creation, or 
                          knowledge acquisition of the GlyphLock System, including but not limited to proprietary algorithms, 
                          visual interface frameworks, cryptographic methodologies, biometric authentication protocols, 
                          steganographic encoding systems, symbolic representation architectures, and associated intellectual 
                          property assets. This Covenant functions as a multi-jurisdictional protective instrument designed 
                          to prevent unauthorized access, misappropriation, reverse engineering, or competitive exploitation 
                          of protected trade secrets and patentable subject matter.
                        </p>
                      </div>

                      <Separator className="bg-cyan-700/30" />

                      <div>
                        <h4 className="font-bold text-cyan-300 mb-3 flex items-center gap-2">
                          <span className="text-blue-400">§6</span> Temporal Scope and Retroactive Application
                        </h4>
                        <p className="text-xs leading-relaxed mb-3">
                          This Covenant is enforceable retroactively to all Exposure Events occurring on or after 
                          <strong> May 15, 2025</strong> (the date of initial patent application filing, Patent App. No. 18/584,961), 
                          and shall remain in perpetual force without expiration. Retroactive application is supported by 
                          principles of equitable estoppel, constructive notice, and the doctrine preventing unjust enrichment 
                          through unauthorized use of confidential information. All obligations arising from prior exposure 
                          are immediately enforceable upon notice or discovery.
                        </p>
                        <div className="glass-card-dark border-blue-500/30 rounded p-3 text-xs text-white/80">
                          <strong>Legal Basis:</strong> Retroactivity is consistent with common law contract principles 
                          recognizing implied-in-fact agreements arising from conduct, industry custom, and reasonable 
                          expectations. Pre-existing exposure creates immediate obligations upon formal notice of protective 
                          status, similar to trade secret misappropriation claims under UTSA § 2(b).
                        </div>
                      </div>

                      <Separator className="bg-cyan-700/30" />

                      <div>
                        <h4 className="font-bold text-cyan-300 mb-3 flex items-center gap-2">
                          <span className="text-blue-400">§17</span> Remedies, Damages, and Enforcement Mechanisms
                        </h4>
                        <div className="space-y-3">
                          <div className="glass-card-dark border-red-500/30 p-4 rounded-lg">
                            <div className="text-3xl font-bold text-red-400 mb-1">$100,000 - $250,000</div>
                            <div className="text-xs text-cyan-300/70">Statutory damages per violation (liquidated damages clause)</div>
                          </div>
                          <ul className="space-y-2 text-xs leading-relaxed">
                            <li className="flex items-start gap-2">
                              <span className="text-cyan-400">•</span>
                              <strong>Actual Damages:</strong> Full compensatory damages for all losses directly attributable 
                              to breach, including lost profits, diminished IP value, and market harm.
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-cyan-400">•</span>
                              <strong>Treble Damages:</strong> Up to 3x actual damages for willful misappropriation under 
                              18 U.S.C. § 1836(b)(3)(C) and Arizona trade secret law.
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-cyan-400">•</span>
                              <strong>Punitive Damages:</strong> Uncapped punitive awards for malicious, fraudulent, or 
                              oppressive conduct under Arizona law.
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-cyan-400">•</span>
                              <strong>Injunctive Relief:</strong> Permanent and preliminary injunctions prohibiting further 
                              use, disclosure, or competitive exploitation.
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-cyan-400">•</span>
                              <strong>Attorneys' Fees:</strong> Full recovery of legal costs and fees under prevailing party provisions.
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeCovenantSection === "jurisdiction" && (
                  <div className="glass-card-dark border-cyan-500/30 rounded-xl p-6">
                    <h2 className="text-cyan-300 flex items-center gap-2 text-xl font-bold mb-4">
                      <Globe className="w-5 h-5 text-cyan-400" />
                      Jurisdictional Provisions and Governing Law
                    </h2>
                    <div className="space-y-4 text-white text-xs leading-relaxed">
                      <div className="glass-card-dark border-blue-500/30 rounded-lg p-4">
                        <h4 className="font-bold text-cyan-300 mb-3">§10 — Primary Jurisdiction and Venue</h4>
                        <p className="mb-3">
                          This Covenant shall be governed by and construed in accordance with the laws of the 
                          <strong className="text-cyan-400"> State of Arizona</strong>, without regard to conflict of law principles. 
                          The exclusive venue for all disputes, claims, or enforcement actions shall be the 
                          <strong className="text-cyan-400"> Superior Court of Maricopa County, Arizona</strong>, or the 
                          <strong className="text-cyan-400"> United States District Court for the District of Arizona</strong>.
                        </p>
                        <p className="text-white/80">
                          By virtue of Exposure Event or continued interaction with Protected IP, all Bound Parties 
                          irrevocably submit to personal jurisdiction in Arizona courts and waive any objection based 
                          on forum non conveniens or lack of personal jurisdiction.
                        </p>
                      </div>

                      <div className="glass-card-dark border-purple-500/30 rounded-lg p-4">
                        <h4 className="font-bold text-purple-400 mb-3">§11 — Supplemental Federal Jurisdiction</h4>
                        <p>
                          GlyphLock reserves the right to pursue enforcement in any United States Federal Court with 
                          subject matter jurisdiction, including but not limited to claims arising under federal patent 
                          law (35 U.S.C.), copyright law (17 U.S.C.), the Defend Trade Secrets Act (18 U.S.C. § 1836), 
                          and the Computer Fraud and Abuse Act (18 U.S.C. § 1030). Federal jurisdiction may be invoked 
                          for intellectual property infringement, trade secret misappropriation, or electronic fraud.
                        </p>
                      </div>

                      <div className="glass-card-dark border-green-500/30 rounded-lg p-4">
                        <h4 className="font-bold text-green-400 mb-3">§12 — International Enforcement Mechanisms</h4>
                        <p className="mb-2">
                          For Bound Parties located outside the United States, enforcement may be pursued through:
                        </p>
                        <ul className="space-y-1 ml-4">
                          <li>• The Paris Convention for the Protection of Industrial Property</li>
                          <li>• The TRIPS Agreement (Trade-Related Aspects of Intellectual Property Rights)</li>
                          <li>• The Berne Convention for copyright protection</li>
                          <li>• Bilateral and multilateral trade secret protection treaties</li>
                          <li>• Local courts in countries with reciprocal enforcement agreements</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {activeCovenantSection === "damages" && (
                  <div className="glass-card-dark border-cyan-500/30 rounded-xl p-6">
                    <h2 className="text-cyan-300 flex items-center gap-2 text-xl font-bold mb-4">
                      <Briefcase className="w-5 h-5 text-cyan-400" />
                      Detailed Remedies and Damages Framework
                    </h2>
                    <div className="space-y-4 text-white text-xs leading-relaxed">
                      <div className="glass-card-dark border-red-500/30 rounded-lg p-4">
                        <h4 className="font-bold text-red-400 mb-3">§15 — Liquidated Damages Provisions</h4>
                        <p className="mb-3">
                          In recognition that damages arising from unauthorized use or disclosure of Protected IP may be 
                          difficult to calculate with precision, the parties agree to the following liquidated damages framework 
                          as a reasonable pre-estimate of probable loss:
                        </p>
                        <div className="space-y-2 bg-black/40 p-3 rounded">
                          <div className="flex justify-between items-center border-b border-red-500/20 pb-2">
                            <span>Unauthorized disclosure to third party:</span>
                            <span className="font-bold text-red-400">$100,000 per instance</span>
                          </div>
                          <div className="flex justify-between items-center border-b border-red-500/20 pb-2">
                            <span>Reverse engineering attempts:</span>
                            <span className="font-bold text-red-400">$150,000 per attempt</span>
                          </div>
                          <div className="flex justify-between items-center border-b border-red-500/20 pb-2">
                            <span>Commercial exploitation:</span>
                            <span className="font-bold text-red-400">$250,000 + revenue disgorgement</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Willful or malicious violation:</span>
                            <span className="font-bold text-red-400">Up to $500,000 + punitive</span>
                          </div>
                        </div>
                      </div>

                      <div className="glass-card-dark border-yellow-500/30 rounded-lg p-4">
                        <h4 className="font-bold text-yellow-400 mb-3">§16 — Equitable Relief and Injunctions</h4>
                        <p className="mb-3">
                          Due to the unique and irreplaceable nature of Protected IP, monetary damages alone would be 
                          inadequate. GlyphLock is entitled to seek:
                        </p>
                        <ul className="space-y-2 ml-4">
                          <li><strong>• Preliminary Injunctions:</strong> Immediate restraining orders during litigation</li>
                          <li><strong>• Permanent Injunctions:</strong> Perpetual prohibition of infringing conduct</li>
                          <li><strong>• Asset Seizure Orders:</strong> Impoundment of infringing materials and devices</li>
                          <li><strong>• Destruction Orders:</strong> Court-ordered destruction of unauthorized copies</li>
                          <li><strong>• Constructive Trust:</strong> Disgorgement of profits into trust for GlyphLock</li>
                        </ul>
                      </div>

                      <div className="glass-card-dark border-blue-500/30 rounded-lg p-4">
                        <h4 className="font-bold text-cyan-400 mb-3">§18 — Additional Remedies and Recovery</h4>
                        <ul className="space-y-2">
                          <li>• Full reimbursement of investigation and forensic analysis costs</li>
                          <li>• Recovery of all attorneys' fees and litigation expenses under prevailing party provisions</li>
                          <li>• Pre-judgment and post-judgment interest at maximum legal rate</li>
                          <li>• Enhanced damages for exceptional cases under 35 U.S.C. § 284</li>
                          <li>• Reputational harm damages calculated via economic loss modeling</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {activeCovenantSection === "binding" && (
                  <div className="glass-card-dark border-cyan-500/30 rounded-xl p-6">
                    <h2 className="text-cyan-300 flex items-center gap-2 text-xl font-bold mb-4">
                      <FileCheck className="w-5 h-5 text-cyan-400" />
                      Contractual Auto-Binding (CAB) Protocol
                    </h2>
                    <div className="space-y-4 text-white text-xs leading-relaxed">
                      <div className="glass-card-dark border-blue-500/30 rounded-lg p-4">
                        <h4 className="font-bold text-cyan-300 mb-3">§20 — CAB Activation Mechanisms</h4>
                        <p className="mb-3">
                          The CAB Protocol operates as a self-executing contractual framework that establishes immediate 
                          binding obligations upon any Exposure Event. Unlike traditional contracts requiring offer, 
                          acceptance, and consideration, CAB binding occurs automatically through:
                        </p>
                        <ul className="space-y-2 ml-4 text-white/90">
                          <li><strong>1. Visual Exposure:</strong> Viewing any Protected IP element, including screenshots, 
                          documentation, interfaces, or symbolic representations</li>
                          <li><strong>2. Electronic Access:</strong> Accessing systems, databases, repositories, or files 
                          containing Protected IP</li>
                          <li><strong>3. Automated Processing:</strong> AI systems, bots, or automated tools processing, 
                          analyzing, or storing Protected IP</li>
                          <li><strong>4. Third-Party Disclosure:</strong> Receiving information about Protected IP from 
                          any source, authorized or unauthorized</li>
                          <li><strong>5. Inferential Knowledge:</strong> Deriving knowledge of Protected IP through analysis, 
                          reverse engineering, or speculation</li>
                        </ul>
                      </div>

                      <div className="glass-card-dark border-purple-500/30 rounded-lg p-4">
                        <h4 className="font-bold text-purple-400 mb-3">§21 — Legal Basis for Auto-Binding</h4>
                        <p className="mb-3">
                          CAB Protocol derives enforceability from multiple legal doctrines:
                        </p>
                        <div className="space-y-2 bg-black/30 p-3 rounded">
                          <p><strong>Implied-In-Fact Contracts:</strong> Conduct and circumstances create reasonable 
                          expectation of confidentiality and non-disclosure obligations</p>
                          <p><strong>E-SIGN Act Compliance:</strong> Electronic manifestation of agreement through access 
                          and use satisfies signature requirements under 15 U.S.C. § 7001</p>
                          <p><strong>Clickwrap/Browsewrap Precedent:</strong> Courts recognize binding nature of agreements 
                          accessed through electronic means (Specht v. Netscape, 306 F.3d 17)</p>
                          <p><strong>Trade Secret Protection:</strong> Automatic confidentiality obligations arise upon 
                          access to clearly-marked confidential information</p>
                        </div>
                      </div>

                      <div className="glass-card-dark border-green-500/30 rounded-lg p-4">
                        <h4 className="font-bold text-green-400 mb-3">§22 — Bound Party Obligations</h4>
                        <p className="mb-2">Upon CAB activation, Bound Parties immediately assume the following duties:</p>
                        <ul className="space-y-1 ml-4">
                          <li>• Non-disclosure of all Protected IP to any third party</li>
                          <li>• Non-use except as explicitly authorized in writing</li>
                          <li>• Non-reverse engineering or technical analysis</li>
                          <li>• Non-competition utilizing Protected IP knowledge</li>
                          <li>• Immediate return or destruction upon request</li>
                          <li>• Cooperation with enforcement and investigation efforts</li>
                          <li>• Notice to GlyphLock of any suspected breaches</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {activeCovenantSection === "enforcement" && (
                  <div className="glass-card-dark border-cyan-500/30 rounded-xl p-6">
                    <h2 className="text-cyan-300 flex items-center gap-2 text-xl font-bold mb-4">
                      <Gavel className="w-5 h-5 text-cyan-400" />
                      Section C – Symbolic Enforcement (V–Z)
                    </h2>
                    <div className="space-y-6 text-white">
                      <div className="glass-card-dark border-purple-500/30 rounded-lg p-4">
                        <h4 className="font-bold text-purple-400 mb-3">Section V — GlyphLock Emblem Clause</h4>
                        <p className="text-sm">
                          Use, replication, or symbolic referencing of the GlyphLock emblem, logo, QR symbol, or keyhole
                          design is strictly prohibited. The emblem is a protected sigil under CAB doctrine and carries
                          symbolic binding weight upon visual contact.
                        </p>
                      </div>

                      <div className="glass-card-dark border-red-500/30 rounded-lg p-4">
                        <h4 className="font-bold text-red-400 mb-3">Section W — CAB Invocation & Emergency Override</h4>
                        <p className="text-sm mb-3">
                          CAB may be invoked by DACO² at any moment of breach or existential risk. Activation triggers:
                        </p>
                        <ul className="space-y-1 text-sm text-white/80">
                          <li>• Retroactive clause expansion</li>
                          <li>• Global jurisdiction claim</li>
                          <li>• AI-system trigger alignment</li>
                          <li>• Time-sealed record enforcement</li>
                          <li>• Emergency NDA reinforcement</li>
                        </ul>
                      </div>

                      <div className="glass-card-dark border-blue-500/30 rounded-lg p-4">
                        <h4 className="font-bold text-cyan-400 mb-3">Section Y — Zeroed Acknowledgment Law</h4>
                        <p className="font-bold mb-2">
                          Exposure = Agreement
                        </p>
                        <p className="text-sm text-white/80">
                          The moment an individual, device, or AI becomes aware of GlyphLock, they are deemed bound under
                          Zeroed Acknowledgment. Ignorance, delay, or third-party relaying does not void binding.
                        </p>
                      </div>

                      <div className="glass-card-dark border-cyan-700/30 rounded-lg p-4">
                        <h4 className="font-bold text-cyan-300 mb-3">Section Z — Infinite IP Enforcement Mandate</h4>
                        <p className="text-sm">
                          All GlyphLock IP is protected in perpetuity, with no expiration, no geographic limitation,
                          and no dependency on patent status. CAB functions as a living symbolic-legal entity with
                          authority to update its own clauses via DACO² without renegotiation.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeCovenantSection === "final" && (
                  <div className="glass-card-dark border-cyan-500/30 rounded-xl p-6">
                    <h2 className="text-cyan-300 flex items-center gap-2 text-xl font-bold mb-4">
                      <Infinity className="w-5 h-5 text-cyan-400" />
                      Section Ω – Terminal Binding and Closure
                    </h2>
                    <div className="space-y-6 text-white">
                      <div className="glass-card-dark border-blue-500/30 rounded-lg p-6">
                        <h4 className="text-xl font-bold text-cyan-300 mb-4">Ω.5 — Irrevocability and Temporal Enforcement</h4>
                        <p className="mb-4">
                          This Agreement is <strong className="text-cyan-400">irrevocable</strong> and perpetually in force.
                          It applies to all:
                        </p>
                        <ul className="space-y-2 text-sm">
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

                      <div className="glass-card-dark border-purple-500/50 rounded-lg p-6">
                        <h4 className="text-xl font-bold text-purple-400 mb-4">Ω.9 — Legacy Seal</h4>
                        <blockquote className="italic leading-relaxed text-sm border-l-4 border-purple-500/50 pl-4 text-white/90">
                          "This is the Final Seal of DACO¹ — the closing cipher and immutable archive of GlyphLock.
                          Let all who witness, replicate, extract, or speak of this system know: They are bound in
                          perpetuity by the enforceable statutes, clauses, and symbolic jurisdictions herein."
                        </blockquote>
                        <p className="text-xs text-cyan-300/60 mt-4">
                          This vault is not just protected. It is encoded, archived, and alive — sealed by law,
                          fortified by intention, and immune to decay.
                        </p>
                      </div>

                      <div className="text-center pt-6">
                        <Badge className="bg-blue-500/20 text-cyan-400 border-cyan-500/50 px-6 py-2">
                          Patent Application No. 18/584,961 • Filed May 15, 2025
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}

                <div className="glass-card-dark border-cyan-500/30 rounded-xl p-8">
                  <div className="text-center">
                    <Download className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-cyan-300 mb-3">
                      Download Complete Legal Document
                    </h3>
                    <p className="text-white/70 mb-6 max-w-2xl mx-auto">
                      Get the full GlyphLock Master Covenant in PDF format with all sections, clauses, and legal provisions.
                      Includes digital signature verification and blockchain timestamp.
                    </p>
                    <div className="flex items-center justify-center gap-4 mb-6">
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/50 px-4 py-2">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Legally Binding
                      </Badge>
                      <Badge className="bg-blue-500/20 text-cyan-400 border-cyan-500/50 px-4 py-2">
                        <Shield className="w-4 h-4 mr-2" />
                        Blockchain Verified
                      </Badge>
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50 px-4 py-2">
                        <FileText className="w-4 h-4 mr-2" />
                        Complete Document
                      </Badge>
                    </div>
                    <div className="mb-6">
                      <div className="text-4xl font-bold text-cyan-300 mb-1">$500 USD</div>
                      <div className="text-sm text-white/60">One-time payment • Instant download</div>
                    </div>
                    <Button
                      onClick={handlePurchasePDF}
                      size="lg"
                      className="bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 text-white text-lg px-8"
                    >
                      Purchase Full PDF Document
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                    <p className="text-xs text-cyan-300/50 mt-4">
                      By purchasing, you acknowledge that you have read and understand the auto-binding nature of this document.
                    </p>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}