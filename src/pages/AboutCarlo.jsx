import React, { useState } from "react";
import SEOHead from "@/components/SEOHead";
import { Shield, Lock, Zap, Sparkles } from "lucide-react";
import InteractiveWebGrid from "@/components/global/InteractiveWebGrid";

export default function AboutCarloPage() {
  const [easterEggFound, setEasterEggFound] = useState(false);
  const [easterEggClicks, setEasterEggClicks] = useState(0);

  const handleEasterEggClick = () => {
    setEasterEggClicks(prev => prev + 1);
    if (easterEggClicks + 1 >= 3) {
      setEasterEggFound(true);
      setEasterEggClicks(0);
    }
  };

  return (
    <>
      <SEOHead
        title="This Is Not a Resume | Carlo Rene Earl - GlyphLock Founder"
        description="The covenant behind GlyphLock. Carlo Rene Earl doesn't invent from comfort—he forges under pressure, turning pain into design and truth into unbreakable architecture."
        url="/AboutCarlo"
        keywords={["Carlo Rene Earl", "GlyphLock founder", "cybersecurity founder", "Master Covenant", "visual cryptography", "Arizona tech founder", "quantum security", "truth architecture"]}
      />

      {/* Interactive Web Grid Background */}
      <InteractiveWebGrid />

      <main className="min-h-screen w-full text-white flex flex-col items-center pt-20 pb-24 px-4 relative z-10" style={{ background: 'transparent' }}>
        
        {/* Enhanced Easter Egg Modal */}
        {easterEggFound && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-xl animate-in fade-in duration-500">
            <div className="absolute inset-0 overflow-hidden">
              {/* Animated particles */}
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-blue-400 rounded-full animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${2 + Math.random() * 3}s`
                  }}
                />
              ))}
            </div>
            
            <div className="relative max-w-2xl mx-4 p-10 rounded-[2.5rem] overflow-hidden animate-in zoom-in duration-700"
              style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(99, 102, 241, 0.25) 50%, rgba(139, 92, 246, 0.3) 100%)',
                border: '3px solid rgba(59, 130, 246, 0.8)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 0 150px rgba(59, 130, 246, 1), inset 0 0 100px rgba(99, 102, 241, 0.3)'
              }}
            >
              {/* Rotating glow orbs */}
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-500/40 rounded-full blur-3xl animate-spin" style={{ animationDuration: '10s' }} />
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-indigo-500/40 rounded-full blur-3xl animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
              
              <div className="relative z-10 text-center space-y-6">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="text-8xl animate-bounce drop-shadow-[0_0_30px_rgba(59,130,246,1)]">🔐</div>
                    <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-cyan-300 animate-spin" style={{ animationDuration: '3s' }} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-4xl font-black text-white drop-shadow-[0_0_20px_rgba(59,130,246,0.8)]">
                    Pattern Recognition Unlocked
                  </h3>
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-px w-12 bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
                    <Shield className="w-5 h-5 text-blue-400 animate-pulse" />
                    <div className="h-px w-12 bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
                  </div>
                </div>
                
                <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border-2 border-blue-400/50 backdrop-blur-md">
                  <p className="text-2xl text-blue-100 leading-relaxed font-light italic">
                    "The pattern is the intelligence."
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-400 to-blue-400" />
                    <span className="text-sm text-blue-300 font-semibold tracking-wider">CARLO, 2025</span>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent via-blue-400 to-blue-400" />
                  </div>
                </div>

                <div className="pt-4">
                  <p className="text-sm text-blue-200/80 mb-4">You discovered the hidden truth behind GlyphLock</p>
                  <button
                    onClick={() => setEasterEggFound(false)}
                    className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 text-white font-bold text-lg shadow-[0_0_40px_rgba(59,130,246,0.8)] hover:shadow-[0_0_60px_rgba(59,130,246,1)] transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    <span className="relative z-10">Continue The Journey</span>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* NOT A RESUME - Hero */}
        <section className="relative w-full max-w-6xl mb-16">
          <div 
            className="relative rounded-[2.5rem] overflow-hidden px-8 sm:px-16 py-16 sm:py-20 group transition-all duration-500 hover:scale-[1.02]"
            style={{
              background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.2) 0%, rgba(49, 46, 129, 0.15) 100%)',
              border: '3px solid rgba(59, 130, 246, 0.5)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 0 100px rgba(59, 130, 246, 0.6), inset 0 0 80px rgba(79, 70, 229, 0.1)'
            }}
          >
            {/* Animated royal blue/indigo/violet orbs */}
            <div className="absolute -top-32 -left-20 w-96 h-96 bg-blue-600/40 blur-[140px] rounded-full pointer-events-none animate-pulse shadow-[0_0_200px_rgba(59,130,246,0.6)]" />
            <div className="absolute -bottom-32 -right-20 w-96 h-96 bg-indigo-600/40 blur-[140px] rounded-full pointer-events-none animate-pulse shadow-[0_0_200px_rgba(99,102,241,0.6)]" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/20 blur-[160px] rounded-full pointer-events-none animate-pulse shadow-[0_0_250px_rgba(139,92,246,0.4)]" style={{ animationDelay: '2s' }} />
            
            <div className="relative z-10 flex flex-col items-center gap-8 text-center">
              <div className="inline-block px-6 py-2 rounded-full bg-blue-500/20 border border-blue-400/50 backdrop-blur-sm">
                <span className="text-sm tracking-[0.4em] uppercase text-blue-200 font-bold">
                  This Is Not a Resume
                </span>
              </div>

              <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white drop-shadow-[0_0_30px_rgba(59,130,246,0.8)] leading-tight">
                This Is The<br/>
                <span className="bg-gradient-to-r from-blue-300 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                  Covenant
                </span>
              </h1>

              <p className="max-w-4xl text-xl sm:text-2xl text-blue-100 leading-relaxed font-light">
                Behind GlyphLock.
              </p>
            </div>
          </div>
        </section>

        {/* Opening Statement */}
        <section className="w-full max-w-5xl mb-20 px-4">
          <div className="space-y-8">
            <p className="text-2xl sm:text-3xl md:text-4xl text-white font-bold leading-tight text-center">
              I do not invent from comfort.
            </p>
            <p className="text-2xl sm:text-3xl md:text-4xl text-white font-bold leading-tight text-center">
              I forge under pressure.
            </p>
            <p className="text-xl sm:text-2xl text-blue-200 leading-relaxed text-center max-w-4xl mx-auto">
              I take what life throws at me and turn it into structure. I take pain and turn it into design. 
              GlyphLock was not born from ambition or trend chasing. <span className="text-white font-semibold">It was born from necessity.</span>
            </p>
            <p className="text-lg sm:text-xl text-blue-200/90 leading-relaxed text-center max-w-4xl mx-auto">
              From watching truth get bent, identity get stolen, and creators get erased while the world pretended that was normal.
            </p>
          </div>
        </section>

        {/* Where This Really Started */}
        <section
          className="w-full max-w-6xl rounded-3xl px-8 sm:px-14 py-14 sm:py-16 mb-16 group transition-all duration-300 hover:scale-[1.005]"
          style={{
            background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.15) 0%, rgba(49, 46, 129, 0.1) 100%)',
            border: '2px solid rgba(59, 130, 246, 0.4)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 0 60px rgba(59, 130, 246, 0.5)'
          }}
        >
          <h2 className="text-3xl sm:text-5xl font-black text-white text-center mb-12 drop-shadow-[0_0_20px_rgba(59,130,246,0.7)]">
            Where This Really Started
          </h2>

          <div className="space-y-8 text-lg sm:text-xl leading-relaxed">
            <p className="text-blue-100">
              <span className="text-white font-semibold">I didn't wake up one morning and decide to become a founder.</span> The world pushed me there.
            </p>

            <p className="text-blue-100">
              I watched identity turn into a costume anyone could wear. I watched truth become a product—rewritten, replaced, sold to whoever lied louder. 
              I experienced what it feels like to be <span className="text-cyan-300 font-semibold">copied, ignored, underestimated,</span> and stripped of credit for work I broke myself to create.
            </p>

            <div 
              className="relative p-8 rounded-2xl bg-gradient-to-br from-blue-500/15 to-indigo-500/10 border-2 border-blue-400/50 shadow-[inset_0_0_40px_rgba(59,130,246,0.2)] cursor-pointer transition-all duration-500 hover:shadow-[inset_0_0_80px_rgba(59,130,246,0.4),0_0_60px_rgba(59,130,246,0.7),0_0_100px_rgba(99,102,241,0.5)] hover:border-blue-300 hover:scale-[1.02] group"
              onClick={handleEasterEggClick}
              title={easterEggClicks > 0 ? `${3 - easterEggClicks} more...` : "Something's here..."}
            >
              {easterEggClicks > 0 && (
                <div className="absolute top-2 right-2 flex gap-1">
                  {[...Array(easterEggClicks)].map((_, i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  ))}
                </div>
              )}
              
              {/* Subtle pulsing glow hint */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/0 via-indigo-400/10 to-violet-400/0 opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-700" />
              <p className="text-blue-100">
                In Arizona, a simple conversation cracked everything open. Collin talked about camouflage—how patterns hide people. 
                I wasn't interested in hiding. I looked past the surface and asked the question that wouldn't let me go:
              </p>
              <p className="text-2xl sm:text-3xl text-white font-bold mt-6 text-center">
                What if the pattern isn't hiding you?<br/>
                <span className="bg-gradient-to-r from-blue-300 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                  What if the pattern <em>is</em> the intelligence?
                </span>
              </p>
            </div>

            <p className="text-blue-100">
              That question changed everything. It became the realization that <span className="text-white font-semibold">images are not decoration and symbols are not art alone.</span> 
              They are vessels. For proof. For intent. For action. For contracts that cannot be faked.
            </p>
          </div>
        </section>

        {/* The Path to GlyphLock */}
        <section className="w-full max-w-6xl mb-16 px-4">
          <div className="relative rounded-3xl px-8 sm:px-14 py-14 sm:py-16 overflow-hidden group"
            style={{
              background: 'linear-gradient(135deg, rgba(20, 20, 40, 0.6) 0%, rgba(30, 20, 50, 0.5) 100%)',
              border: '2px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(16px)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <h3 className="relative z-10 text-3xl sm:text-4xl font-bold text-white mb-8 text-center">
              The Path to GlyphLock
            </h3>
            
            <p className="relative z-10 text-lg sm:text-xl text-violet-100 leading-relaxed text-center max-w-4xl mx-auto">
              The road from that moment to GlyphLock was carved through <span className="text-red-300">broken trust, unpaid bills, slow partners, empty promises,</span> and a family that needed stability when life offered none.
            </p>
            
            <p className="relative z-10 text-xl sm:text-2xl text-white font-semibold mt-8 text-center">
              The idea should have died more times than I can count.
            </p>
            
            <p className="relative z-10 text-lg sm:text-xl text-violet-100 leading-relaxed mt-4 text-center">
              But I carried it when no one else would. Not because it was easy—but because <span className="text-cyan-300 font-semibold">letting it die would have meant accepting a world where truth has no spine.</span>
            </p>
          </div>
        </section>

        {/* The Covenant - MAIN SECTION */}
        <section
          className="w-full max-w-6xl rounded-[3rem] px-8 sm:px-16 py-16 sm:py-20 mb-16 relative overflow-hidden group"
          style={{
            background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.2) 0%, rgba(49, 46, 129, 0.15) 50%, rgba(67, 56, 202, 0.18) 100%)',
            border: '3px solid rgba(59, 130, 246, 0.6)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 0 120px rgba(59, 130, 246, 0.8), inset 0 0 100px rgba(79, 70, 229, 0.15)'
          }}
        >
          {/* Floating icons */}
          <div className="absolute top-10 right-10 opacity-20 animate-pulse">
            <Shield className="w-24 h-24 text-blue-300" />
          </div>
          <div className="absolute bottom-10 left-10 opacity-20 animate-pulse" style={{ animationDelay: '1.5s' }}>
            <Lock className="w-20 h-20 text-indigo-300" />
          </div>
          <div className="absolute top-1/2 left-1/4 opacity-10 animate-pulse" style={{ animationDelay: '0.7s' }}>
            <Zap className="w-16 h-16 text-cyan-300" />
          </div>

          <div className="relative z-10">
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-blue-500/30 border-2 border-blue-400 backdrop-blur-md shadow-[0_0_30px_rgba(59,130,246,0.6)]">
                <Shield className="w-5 h-5 text-blue-200" />
                <span className="text-sm tracking-[0.3em] uppercase text-blue-100 font-bold">The Covenant</span>
              </div>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white text-center mb-16 drop-shadow-[0_0_40px_rgba(59,130,246,1)] leading-tight">
              GlyphLock Was Never Built<br/>
              <span className="bg-gradient-to-r from-blue-200 via-indigo-200 to-cyan-200 bg-clip-text text-transparent">
                To Impress Investors
              </span>
            </h2>

            <div className="space-y-10 max-w-5xl mx-auto">
              <p className="text-xl sm:text-2xl text-violet-100 leading-relaxed text-center font-light">
                It was built because <span className="text-white font-bold">something sacred was being left undefended.</span>
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-red-500/10 border border-red-400/30 backdrop-blur-sm">
                  <p className="text-lg text-red-200 font-semibold">I watched lies outrun facts.</p>
                </div>
                <div className="p-6 rounded-2xl bg-orange-500/10 border border-orange-400/30 backdrop-blur-sm">
                  <p className="text-lg text-orange-200 font-semibold">I watched identity become disposable.</p>
                </div>
                <div className="p-6 rounded-2xl bg-yellow-500/10 border border-yellow-400/30 backdrop-blur-sm">
                  <p className="text-lg text-yellow-200 font-semibold">I watched creations ripped from their makers without consequence.</p>
                </div>
                <div className="p-6 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-400/30 backdrop-blur-sm">
                  <p className="text-lg text-fuchsia-200 font-semibold">I watched evidence vanish as if it never existed.</p>
                </div>
              </div>

              <div className="mt-12 p-10 rounded-3xl bg-gradient-to-br from-blue-500/20 to-indigo-500/15 border-2 border-blue-300/50 shadow-[inset_0_0_60px_rgba(59,130,246,0.2)]">
                <p className="text-xl sm:text-2xl text-white leading-relaxed text-center">
                  Every betrayal, every collapse, every loss became <span className="text-cyan-300 font-bold">material for the foundation.</span>
                </p>
                <p className="text-lg sm:text-xl text-blue-200 leading-relaxed text-center mt-6">
                  I poured all of it into the Master Covenant—the way proof binds to action, the way identity is held accountable, the way glyphs carry intent.
                </p>
                <p className="text-xl text-white font-bold text-center mt-6">
                  None of this is theory. It is lived experience translated into architecture.
                </p>
              </div>

              <div className="mt-16 text-center">
                <p className="text-2xl sm:text-3xl text-white font-bold leading-tight mb-4">
                  GlyphLock is my answer to a world that treats truth as optional.
                </p>
                <p className="text-lg sm:text-xl text-blue-200 leading-relaxed max-w-3xl mx-auto">
                  It is my promise to my children, my wife, my family—and to every creator, builder, and thinker who has ever been 
                  <span className="text-red-300 font-semibold"> copied, stolen from, erased, or silenced.</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* My Role Inside GlyphLock */}
        <section
          className="w-full max-w-6xl rounded-3xl px-8 sm:px-14 py-14 sm:py-16 mb-16 group transition-all duration-300 hover:scale-[1.005]"
          style={{
            background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.15) 0%, rgba(49, 46, 129, 0.1) 100%)',
            border: '2px solid rgba(59, 130, 246, 0.4)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 0 60px rgba(59, 130, 246, 0.5)'
          }}
        >
          <h2 className="text-3xl sm:text-5xl font-black text-white text-center mb-12 drop-shadow-[0_0_20px_rgba(59,130,246,0.8)]">
            My Role Inside GlyphLock
          </h2>

          <div className="space-y-8 max-w-4xl mx-auto">
            <p className="text-xl sm:text-2xl text-white font-bold leading-tight text-center">
              Inside this company, I'm not just the founder.
            </p>
            
            <p className="text-xl sm:text-2xl text-violet-100 leading-relaxed text-center">
              <span className="text-white font-semibold">I'm the line between vision and reality.</span>
            </p>

            <div className="grid sm:grid-cols-3 gap-6 mt-12">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/15 to-violet-500/10 border border-indigo-400/30 backdrop-blur-sm">
                <p className="text-lg text-indigo-200 font-semibold text-center">I design the logic that holds truth in place.</p>
              </div>
              <div className="p-6 rounded-2xl bg-gradient-to-br from-violet-500/15 to-fuchsia-500/10 border border-violet-400/30 backdrop-blur-sm">
                <p className="text-lg text-violet-200 font-semibold text-center">I shape the frameworks that anchor identity, intent, and verification.</p>
              </div>
              <div className="p-6 rounded-2xl bg-gradient-to-br from-fuchsia-500/15 to-pink-500/10 border border-fuchsia-400/30 backdrop-blur-sm">
                <p className="text-lg text-fuchsia-200 font-semibold text-center">I carry the tension between art and system, story and logic.</p>
              </div>
            </div>

            <div className="mt-12 p-8 rounded-2xl bg-blue-500/10 border-2 border-blue-400/40 backdrop-blur-md">
              <p className="text-lg sm:text-xl text-blue-100 leading-relaxed text-center">
                I didn't learn this from textbooks. I learned it through <span className="text-white font-semibold">music, design, struggle, security,</span> and hard-earned scars that came with real lessons.
              </p>
              <p className="text-lg sm:text-xl text-white font-semibold text-center mt-4">
                That's why GlyphLock feels alive instead of manufactured.
              </p>
            </div>

            <div className="mt-12 p-10 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-blue-500/15 border-2 border-cyan-400/50 shadow-[inset_0_0_40px_rgba(6,182,212,0.2)]">
              <p className="text-2xl sm:text-3xl text-white font-bold text-center leading-tight mb-6">
                Every decision passes one question:
              </p>
              <p className="text-xl sm:text-2xl text-cyan-100 font-semibold text-center italic leading-relaxed">
                "Does this protect the people who can't afford another betrayal?"
              </p>
              <p className="text-lg text-white text-center mt-6">
                If the answer is no, it never ships.
              </p>
            </div>
          </div>
        </section>

        {/* If You're Here */}
        <section className="w-full max-w-5xl mb-16 px-4">
          <div className="relative rounded-3xl px-8 sm:px-14 py-14 sm:py-16 overflow-hidden group"
            style={{
              background: 'linear-gradient(135deg, rgba(87, 61, 255, 0.1) 0%, rgba(168, 60, 255, 0.08) 100%)',
              border: '2px solid rgba(168, 85, 247, 0.4)',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 0 70px rgba(168, 85, 247, 0.6)'
            }}
          >
            <h2 className="text-3xl sm:text-5xl font-black text-white text-center mb-10">
              If You're Here
            </h2>

            <div className="space-y-6 max-w-3xl mx-auto text-center">
              <p className="text-xl sm:text-2xl text-blue-100 leading-relaxed">
                If this story feels familiar—if you've been <span className="text-red-300 font-semibold">copied, played, erased, or left exposed</span>—you already understand why GlyphLock exists.
              </p>

              <p className="text-2xl sm:text-3xl text-white font-bold leading-tight">
                You don't need another pitch.
              </p>

              <p className="text-xl sm:text-2xl text-cyan-300 font-semibold leading-relaxed">
                You need protection that was forged in the same fire.
              </p>
            </div>
          </div>
        </section>

        {/* CTA - Schedule Consultation */}
        <section className="w-full max-w-4xl flex flex-col items-center mb-20">
          <button
            className="group relative px-20 py-6 text-xl sm:text-2xl font-bold rounded-[2rem] bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 shadow-[0_0_80px_rgba(59,130,246,0.9)] hover:shadow-[0_0_120px_rgba(59,130,246,1)] hover:scale-[1.05] transition-all duration-500 active:scale-[0.98]"
            onClick={() => {
              window.location.href = "/consultation";
            }}
          >
            <span className="relative z-10">Schedule a Consultation</span>
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 rounded-[2rem] bg-white/10 opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500" />
          </button>
        </section>

        {/* Final Statement - Thrival */}
        <section className="w-full max-w-5xl">
          <div 
            className="relative rounded-[3rem] px-10 sm:px-16 py-16 sm:py-20 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.2) 0%, rgba(49, 46, 129, 0.15) 50%, rgba(67, 56, 202, 0.12) 100%)',
              border: '3px solid rgba(59, 130, 246, 0.6)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 0 100px rgba(59, 130, 246, 0.8), inset 0 0 80px rgba(79, 70, 229, 0.2)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-indigo-500/10 animate-pulse" style={{ animationDuration: '4s' }} />
            
            <div className="relative z-10 text-center space-y-8">
              <p className="text-2xl sm:text-3xl text-white font-bold leading-tight">
                This isn't about survival.
              </p>
              
              <p className="text-xl sm:text-2xl text-blue-200 leading-relaxed">
                GlyphLock exists for something greater.
              </p>

              <p className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight">
                <span className="bg-gradient-to-r from-blue-200 via-cyan-200 to-indigo-200 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(59,130,246,0.9)]">
                  This is about THRIVAL.
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* Structured Data for SEO */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Carlo Rene Earl",
            "jobTitle": "Founder & CEO",
            "worksFor": {
              "@type": "Organization",
              "name": "GlyphLock Security LLC",
              "url": "https://glyphlock.io"
            },
            "description": "Creator and architect of GlyphLock, turning pressure into systems and pain into design for quantum-resistant cybersecurity.",
            "url": "https://glyphlock.io/AboutCarlo",
            "knowsAbout": [
              "Cybersecurity",
              "Quantum-resistant encryption",
              "Visual cryptography",
              "Blockchain security",
              "AI security",
              "Identity protection"
            ]
          })}
        </script>
      </main>
    </>
  );
}