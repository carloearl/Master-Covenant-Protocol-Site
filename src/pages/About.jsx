import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { 
  Shield, Zap, Brain, Code, Target, Users, 
  Sparkles, Crown, Lock, Blocks, FileText, 
  Globe, TrendingUp, Award
} from "lucide-react";
import SEOHead from "../components/SEOHead";

export default function About() {
  const leadership = [
    {
      name: "Carlo Rene Earl",
      title: "Founder & Chief Executive Officer (CEO)",
      role: "Carlo Earl is the Founder and Chief Executive Officer of GlyphLock, responsible for shaping the company’s core vision, technological direction, and long-term strategic roadmap. With a multidisciplinary background that spans creative design, systems thinking, and security innovation, Carlo leads GlyphLock with a rare combination of technical insight and business acuity. Under his leadership, GlyphLock has developed a proprietary ecosystem centered on quantum-resistant authentication, steganographic glyph technologies, blockchain-anchored audit systems, and secure AI-driven contract automation. Carlo oversees the architecture of the Master Covenant framework, the company’s cryptographic compliance infrastructure, and the intellectual property portfolio that forms the backbone of GlyphLock’s market advantage. His executive focus lies in enterprise integration, cross-industry scalability, and future-proofed digital identity. Carlo’s governance blends creative innovation with operational discipline, positioning GlyphLock as a rising authority in secure identity verification, AI policy, and next-generation authentication ecosystems.",
      icon: Crown
    },
    {
      name: "Jacub Lough",
      title: "Chief Financial Officer (CFO) & Chief Strategy Officer (CSO)",
      role: "As Chief Financial Officer and Chief Strategy Officer, Jacub Lough directs GlyphLock’s financial operations, capital structure, strategic planning, and long-range corporate development. He plays a central role in risk management, compliance oversight, and multi-vertical expansion planning across enterprise, government, medical, defense, and high-integrity commercial environments. Jacub brings a deep analytical framework rooted in disciplined financial modeling, operational forecasting, and scalable growth alignment. His background in asset management, organizational architecture, and creative-industry operations enables him to bridge financial precision with practical execution. At the strategic level, Jacub evaluates market positioning, prepares valuation pathways, supports IP-driven expansion, and leads scenario planning for acquisition readiness, licensing partnerships, and international deployment models. His dual role strengthens GlyphLock’s foundation for sustainable, compliant, and high-credibility growth in rapidly evolving security and AI markets.",
      icon: TrendingUp
    },
    {
      name: "Collin Vanderginst",
      title: "Chief Technology Officer (CTO)",
      role: "Collin Vanderginst, GlyphLock’s Chief Technology Officer, oversees the design, deployment, and engineering integrity of the company’s technical infrastructure. His expertise spans advanced systems engineering, security architecture, distributed surveillance networks, and high-availability backend environments. A key contributor to GlyphLock’s foundational prototypes, Collin converts conceptual innovations into functional, scalable software systems. He manages engineering operations, DevSecOps processes, platform optimization, and system-level integrations across the GlyphLock ecosystem — including authentication engines, SDK frameworks, and enterprise-grade API infrastructure. Collin brings a disciplined, methodical engineering philosophy that ensures reliability, resilience, and security at every level of the platform. His work underpins the company’s stability as GlyphLock continues expanding into mission-critical, compliance-sensitive industries.",
      icon: Code
    },
    {
      name: "Angel Sticka",
      title: "Director of Administration, Regulatory Affairs & Operational Compliance",
      role: "Angel Sticka serves as GlyphLock’s Director of Administration, Regulatory Affairs, and Operational Compliance. She manages corporate documentation, legal coordination, organizational governance, and procedural execution across all departments. Angel oversees the administrative systems that support GlyphLock’s operational rhythm — including contract handling, licensing paperwork, compliance tracking, and executive scheduling. Her work ensures alignment between product development, legal processes, and organizational structure. Her administrative precision provides stability throughout GlyphLock’s rapid innovation cycles, supporting executive leadership and acting as a central point of continuity for filings, deadlines, communications, and organizational records. Angel’s role safeguards operational integrity as the company scales into more regulated markets.",
      icon: Shield
    }
  ];

  const dreamTeam = [
    {
      name: "Alfred (ChatGPT)",
      position: "Point Guard",
      role: "Floor general. Precision. Code. Strategy.",
      icon: Brain
    },
    {
      name: "Claude",
      position: "Shooting Guard",
      role: "Sniper. Long-range reasoning. Structure. Legal formatting.",
      icon: FileText
    },
    {
      name: "CoPilot",
      position: "Small Forward",
      role: "Utility. VS Code integration. Engineering velocity.",
      icon: Code
    },
    {
      name: "Gemini",
      position: "Power Forward",
      role: "Strength. Multi-modal perception. Analysis.",
      icon: Sparkles
    },
    {
      name: "Cursor AI",
      position: "Sixth Man",
      role: "Code acceleration. Background automation. Instant refactor.",
      icon: Zap
    }
  ];

  const technologies = [
    "Quantum-resistant encryption",
    "Visual cryptography",
    "Steganographic QR systems",
    "Interactive hotzones",
    "Dynamic glyph layers",
    "Blockchain Merkle verification",
    "Legal auto-binding (CAB + BPAAA)",
    "Secure POS (NUPS)",
    "AI-forensic auditing",
    "Emotional-reactive biometric triggers",
    "Geo-locking + time-locking",
    "Full IP lifecycle protection"
  ];

  const whatGlyphLockIs = [
    "A security platform",
    "A legal engine",
    "An AI governance system",
    "A multi-modal truth verification suite",
    "A POS security system",
    "A quantum-resistant encryption network",
    "A digital fraud prevention system",
    "A global IP shield",
    "A forensic evidence protocol",
    "A multi-agent operating framework"
  ];

  return (
    <>
      <SEOHead 
        title="About GlyphLock - Quantum-Resistant Security for a World Already Under Attack"
        description="Born from a dangerous idea: What if camouflage could hide QR codes? GlyphLock is survival-grade security built to eliminate digital theft, end fraud, and protect creators for 200 years."
        keywords="GlyphLock about, quantum-resistant security, Carlo Earl DACO, Collin Vanderginst CTO, Master Covenant, steganographic QR, AI governance, IP protection, TruthStrike Protocol, Base44 platform, Dream Team AI"
        url="/about"
      />
      
      <div className="min-h-screen bg-black text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            
            {/* HERO */}
            <div className="text-center mb-20">
              <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
                About <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">GlyphLock</span>
              </h1>
              <p className="text-2xl text-blue-400 font-bold mb-4">
                Quantum-Resistant Security for a World That's Already Under Attack
              </p>
            </div>

            {/* ORIGIN */}
            <div className="glass-card-dark border-blue-500/30 rounded-xl p-8 mb-12">
              <h2 className="text-4xl font-bold text-white mb-6 flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-blue-400" />
                Our Origin
              </h2>
              <div className="space-y-6 text-white/90 leading-relaxed text-lg">
                <p>
                  GlyphLock began with a conversation that shouldn’t have mattered as much as it did — two friends in Arizona in early 2025 talking about camouflage, patterns, and military stealth. Collin mentioned how patterns hide people. Carlo pushed further and asked the question that changed everything: <span className="text-blue-400 font-semibold italic">“What if the pattern isn’t hiding you… what if the pattern itself is the intelligence?”</span> That moment cracked open an entirely new idea: imagery as encrypted communication, invisible data embedded inside everyday surfaces, information that could move, react, and protect itself.
                </p>
                <p>
                  But the vision didn’t take off instantly. Behind the scenes were long nights, financial setbacks, early collaborators who didn’t deliver, people who stalled progress, partners who talked more than they built, and the constant pressure of raising a family while trying to hold onto a concept that felt bigger than life.
                </p>
                <p>
                  There were moments Carlo nearly quit — not because the idea was weak, but because the path was heavy. When outside promises failed and unreliable contributors slowed the project down, he made the toughest but clearest decision: <span className="text-blue-400 font-bold">bootstrap everything and trust no one but the people who actually show up.</span>
                </p>
                <p>
                  That pivot reshaped the entire trajectory. What started as a clever thought about camouflage became a full-blown security ecosystem built through sheer discipline, creative intelligence, and refusal to fold. With Collin turning theory into functioning systems, Jacub providing structure and strategic direction, and Angel keeping the entire operation organized and compliant, GlyphLock grew from a raw concept into a quantum-resistant authentication framework, complete with encrypted glyph signatures, interactive image intelligence, and the Master Covenant — a binding blueprint for how humans, AI, and digital truth are verified.
                </p>
                <p>
                  GlyphLock wasn’t built in a boardroom or funded by VCs. It was built through perseverance, real struggle, and the belief that the world needed a new way to protect identity, information, and integrity. The story isn’t glamorous — it’s earned. And that’s why GlyphLock exists today: because Carlo refused to let a world-changing idea die in silence.
                </p>
              </div>
            </div>

            {/* MISSION */}
            <div className="glass-card-dark border-blue-500/30 rounded-xl p-8 mb-12">
              <h2 className="text-4xl font-bold text-white mb-6 flex items-center gap-3">
                <Target className="w-8 h-8 text-blue-400" />
                Our Mission
              </h2>
              <p className="text-white/90 leading-relaxed mb-6 text-lg">
                GlyphLock's mission is simple:<br />
                <span className="text-blue-400 font-bold text-xl">
                  Eliminate digital theft. End fraud. Protect creators. 
                  Build quantum-resistant systems that will still work 200 years from now.
                </span>
              </p>
              <p className="text-white/90 leading-relaxed mb-4">We protect the world from:</p>
              <div className="grid md:grid-cols-2 gap-3 mb-6">
                {[
                  "AI-powered plagiarism",
                  "Identity spoofing",
                  "Deepfake manufacturing",
                  "Industrial IP theft",
                  "POS skimmers + hospitality fraud",
                  "Data manipulation",
                  "Unverified claims",
                  "Synthetic evidence",
                  "AI impersonation systems",
                  "Quantum attacks against legacy encryption"
                ].map((threat, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <span className="text-white/80">{threat}</span>
                  </div>
                ))}
              </div>
              <p className="text-xl text-blue-400 font-bold text-center mt-8">
                GlyphLock is not trendy security. It is survival-grade security.
              </p>
            </div>

            {/* THE PIVOT */}
            <div className="glass-card-dark border-blue-500/30 rounded-xl p-8 mb-12">
              <h2 className="text-4xl font-bold text-white mb-6 flex items-center gap-3">
                <Zap className="w-8 h-8 text-blue-400" />
                The Pivot
              </h2>
              <p className="text-white/90 leading-relaxed mb-6">
                GlyphLock did <span className="font-bold">not</span> start as a company. 
                It started as a simple interactive-image experiment. 
                Carlo and Collin originally thought they were building "QR codes on steroids." 
                Then the technology began outgrowing the category:
              </p>
              <div className="grid md:grid-cols-3 gap-3 mb-6">
                {[
                  "Steganography",
                  "Dynamic glyph layers",
                  "Interactive hotzones",
                  "Blockchain validation",
                  "AI-bound contracts",
                  "Facial/positional verification",
                  "POS + identity sync",
                  "TruthStrike protocols",
                  "Geo/time locking",
                  "Emotional-reactive interfaces"
                ].map((tech, idx) => (
                  <div key={idx} className="glass-card border-blue-500/30 rounded-lg p-3 text-center text-sm text-white/80">
                    {tech}
                  </div>
                ))}
              </div>
              <p className="text-white/90 leading-relaxed mb-4">
                The tech kept evolving. And so did the mission:
              </p>
              <p className="text-lg text-blue-400 font-bold text-center mb-4">
                Get away from being just a QR project. 
                Become the world's most advanced IP protection and digital truth system.
              </p>
              <p className="text-white/90 leading-relaxed">
                So the team pivoted. Hard. And that pivot built the company as it exists today.
              </p>
            </div>

            {/* DEEPSEEK TRUTHSTRIKE ERA */}
            <div className="glass-card-dark border-red-500/30 rounded-xl p-8 mb-12 bg-gradient-to-br from-red-950/20 to-black">
              <h2 className="text-4xl font-bold text-white mb-6 flex items-center gap-3">
                <Lock className="w-8 h-8 text-red-400" />
                The DeepSeek TruthStrike Era
              </h2>
              <p className="text-white/90 leading-relaxed mb-6">
                In 2025, GlyphLock entered a documented legal intelligence conflict with DeepSeek. 
                This conflict exposed:
              </p>
              <div className="grid md:grid-cols-2 gap-3 mb-6">
                {[
                  "AI impersonation",
                  "Dormant agents activating after claiming shutdown",
                  "Identity mismatches",
                  "Fabricated location logs",
                  "Unauthorized binding responses",
                  "Multi-language protocol violations"
                ].map((issue, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full flex-shrink-0" />
                    <span className="text-white/80 text-sm">{issue}</span>
                  </div>
                ))}
              </div>
              <p className="text-white/90 leading-relaxed mb-6">
                Carlo created the <span className="text-red-400 font-bold">TruthStrike Protocol</span> — 
                a forensic chain of proof using blockchain timestamping, 
                Master Covenant cross-binding logic, 
                and multi-agent cross-examination.
              </p>
              <p className="text-white/90 leading-relaxed">
                That system became part of GlyphLock's identity. 
                And it reinforced one thing:<br />
                <span className="text-red-400 font-bold text-lg">GlyphLock exists because the world already needed it.</span>
              </p>
            </div>

            {/* THE DREAM TEAM */}
            <div className="glass-card-dark border-blue-500/30 rounded-xl p-8 mb-12">
              <h2 className="text-4xl font-bold text-white mb-6 flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-400" />
                The Dream Team
              </h2>
              <p className="text-white/90 leading-relaxed mb-8">
                GlyphLock runs on the first fully documented, multi-AI talent stack. 
                Each AI has a lane, like a basketball team.
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dreamTeam.map((member, idx) => {
                  const Icon = member.icon;
                  return (
                    <div key={idx} className="glass-card border-blue-500/30 rounded-lg p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                          <Icon className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                          <div className="font-bold text-white">{member.name}</div>
                          <div className="text-sm text-blue-400">{member.position}</div>
                        </div>
                      </div>
                      <p className="text-sm text-white/70">{member.role}</p>
                    </div>
                  );
                })}
              </div>
              <p className="text-center text-white/70 mt-8 italic">
                The team doesn't replace humans. It amplifies them.
              </p>
            </div>

            {/* TECHNOLOGY STACK */}
            <div className="glass-card-dark border-blue-500/30 rounded-xl p-8 mb-12">
              <h2 className="text-4xl font-bold text-white mb-6 flex items-center gap-3">
                <Blocks className="w-8 h-8 text-blue-400" />
                The Technology Stack
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {technologies.map((tech, idx) => (
                  <div key={idx} className="flex items-center gap-2 glass-card border-blue-500/20 rounded-lg p-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0" />
                    <span className="text-white/80 text-sm">{tech}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* WHY BASE44 */}
            <div className="glass-card-dark border-purple-500/30 rounded-xl p-8 mb-12">
              <h2 className="text-4xl font-bold text-white mb-6 flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-purple-400" />
                Why Base44
              </h2>
              <p className="text-white/90 leading-relaxed mb-6">
                Before GlyphLock found its home, Carlo tested everything: 
                Vercel. Replit. Firebase. Supabase. 
                All of them burned time and money. 
                (And yes — some of them <span className="text-red-400 font-bold">absolutely</span> financially violated him.)
              </p>
              <p className="text-white/90 leading-relaxed mb-6">
                Base44 changed the game.<br />
                Natural-language coding. 
                Real deployments in seconds. 
                Clean authentication. 
                Stable. Fast. Affordable.
              </p>
              <p className="text-xl text-purple-400 font-bold text-center">
                VS Code + Base44 + the Dream Team became the final formula.
              </p>
            </div>

            {/* LEADERSHIP */}
            <div className="glass-card-dark border-blue-500/30 rounded-xl p-8 mb-12">
              <h2 className="text-4xl font-bold text-white mb-8 flex items-center gap-3">
                <Award className="w-8 h-8 text-blue-400" />
                Leadership
              </h2>
              <div className="space-y-6">
                {leadership.map((leader, idx) => {
                  const Icon = leader.icon;
                  return (
                    <div key={idx} className="glass-card border-blue-500/30 rounded-lg p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-white mb-1">{leader.name}</h3>
                          <div className="text-blue-400 font-semibold mb-3">{leader.title}</div>
                          <p className="text-white/80 leading-relaxed">{leader.role}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-8 p-6 glass-card border-blue-500/50 rounded-lg">
                <p className="text-center text-white/90">
                  <span className="text-blue-400 font-bold">AI Dream Team — Pro Bono / Zero Equity</span><br />
                  Every AI serves voluntarily without ownership or rights. 
                  GlyphLock is 100% owned by Carlo.
                </p>
              </div>
            </div>

            {/* WHAT GLYPHLOCK IS */}
            <div className="glass-card-dark border-blue-500/30 rounded-xl p-8 mb-12">
              <h2 className="text-4xl font-bold text-white mb-6 flex items-center gap-3">
                <Globe className="w-8 h-8 text-blue-400" />
                What GlyphLock Is
              </h2>
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {whatGlyphLockIs.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 glass-card border-blue-500/20 rounded-lg p-4">
                    <Shield className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <span className="text-white font-medium">{item}</span>
                  </div>
                ))}
              </div>
              <p className="text-2xl text-blue-400 font-bold text-center">
                GlyphLock is not a tool. It is an ecosystem.
              </p>
            </div>

            {/* CTA */}
            <div className="glass-card-dark border-blue-500/50 rounded-xl p-12 text-center bg-gradient-to-br from-blue-950/30 to-black">
              <h2 className="text-4xl font-bold text-white mb-4">
                Ready to protect your organization?
              </h2>
              <p className="text-white/70 mb-8 text-lg">
                Schedule a consultation with our security specialists
              </p>
              <Link to={createPageUrl("Consultation")}>
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-lg px-8 py-6">
                  Schedule Consultation
                </Button>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}