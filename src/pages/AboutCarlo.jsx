import React from "react";
import SEOHead from "@/components/SEOHead";

export default function AboutCarloPage() {
  return (
    <>
      <SEOHead
        title="About Carlo Rene Earl | GlyphLock Founder & Creator"
        description="Learn the story of Carlo Rene Earl, founder of GlyphLock Security LLC, and the covenant that turned pain and pressure into a living system of digital truth and quantum-resistant cybersecurity."
        url="/AboutCarlo"
        keywords={["Carlo Rene Earl", "GlyphLock founder", "cybersecurity founder", "quantum security creator", "visual cryptography inventor", "Arizona tech founder", "security architect", "GlyphLock creator"]}
      />

      <main className="min-h-screen w-full text-white flex flex-col items-center pt-28 pb-24 px-4" style={{ background: 'transparent' }}>
        {/* Hero section */}
        <section
          id="carlo-hero"
          className="relative w-full max-w-6xl rounded-[2.25rem] overflow-hidden px-8 sm:px-14 py-12 sm:py-16 mb-20 group transition-all duration-300 hover:scale-[1.01]"
          style={{
            background: 'linear-gradient(135deg, rgba(10, 10, 20, 0.8) 0%, rgba(15, 15, 31, 0.7) 100%)',
            border: '2px solid rgba(139, 92, 246, 0.4)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 0 65px rgba(139, 92, 246, 0.55), 0 0 90px rgba(168, 85, 247, 0.25)'
          }}
        >
          <div className="absolute -top-24 -left-10 w-72 h-72 bg-fuchsia-500/20 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-24 -right-4 w-80 h-80 bg-indigo-500/25 blur-[130px] rounded-full pointer-events-none" />
          
          {/* Hover glint overlay */}
          <div className="absolute inset-0 rounded-[2.25rem] bg-gradient-to-br from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center gap-6 text-center">
            <span className="text-xs sm:text-sm tracking-[0.3em] uppercase text-violet-200/90">
              Founder profile
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-violet-100 drop-shadow-[0_0_20px_rgba(139,92,246,0.6)]">
              Carlo Rene Earl
            </h1>

            <p className="max-w-3xl text-base sm:text-lg md:text-xl text-violet-100/90 leading-relaxed">
              Creator and architect of GlyphLock.  
              Carlo does not invent under comfort.  
              He forges under pressure.  
              He takes the weight life throws at him and turns it into structure.  
              He takes pain and turns it into design.  
              This page is not a resume.  
              It is the Covenant behind the platform.
            </p>
          </div>
        </section>

        {/* Origin story card */}
        <section
          id="origin"
          className="w-full max-w-6xl rounded-[2rem] px-7 sm:px-12 py-12 sm:py-14 mb-16 group transition-all duration-200 hover:scale-[1.005]"
          style={{
            background: 'linear-gradient(135deg, rgba(10, 10, 20, 0.8) 0%, rgba(15, 15, 31, 0.7) 100%)',
            border: '2px solid rgba(124, 58, 237, 0.35)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 0 50px rgba(124, 58, 237, 0.45)'
          }}
        >
          <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/0 via-white/8 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-250 pointer-events-none" />
          
          <h2 className="relative z-10 text-3xl sm:text-4xl font-semibold text-violet-100 text-center mb-10 drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]">
            Where this really started
          </h2>

          <div className="relative z-10">
            <p className="text-lg sm:text-xl text-violet-100/95 leading-relaxed mb-6">
              Carlo did not wake up one morning and decide to become a founder.  
              The world pushed him there.  
              He watched identity become a costume and truth become a product.  
              He felt what it was like to be copied ignored underestimated and stripped of credit for the work he broke himself to create.  
              It began when identity became something anyone could steal with a click.  
              It began when truth became a product that could be replaced and rewritten by anyone with the nerve to lie louder.
            </p>

            <p className="text-lg sm:text-xl text-violet-100/95 leading-relaxed mb-6">
              In Arizona a simple conversation about camouflage cracked everything open.  
              Collin talked about how patterns hide people.  
              Carlo looked past the camouflage and into its soul and asked the question that changed the trajectory of his life.  
              What if the pattern is not hiding you.  
              What if the pattern itself is the intelligence.  
              That question refused to die.  
              It evolved into the idea that images are not decoration and symbols are not art.  
              They are vessels for proof.  
              For action.  
              For contracts that cannot be faked.
            </p>

            <p className="text-lg sm:text-xl text-violet-100/95 leading-relaxed">
              The path from that moment to GlyphLock was carved through broken trust unpaid bills slow partners empty promises and a family that needed stability even when life was anything but stable.  
              The idea should have died many times.  
              But Carlo refused to let it.  
              So the idea lived because he carried it when no one else would.
            </p>
          </div>
        </section>

        {/* Covenant note card */}
        <section
          id="covenant"
          className="w-full max-w-5xl rounded-[2rem] px-7 sm:px-12 py-12 sm:py-14 mb-16 group transition-all duration-200 hover:scale-[1.005]"
          style={{
            background: 'linear-gradient(135deg, rgba(10, 10, 20, 0.8) 0%, rgba(15, 15, 31, 0.7) 100%)',
            border: '2px solid rgba(147, 51, 234, 0.4)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 0 55px rgba(147, 51, 234, 0.6), 0 0 85px rgba(168, 85, 247, 0.3)'
          }}
        >
          <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-250 pointer-events-none" />
          
          <h2 className="relative z-10 text-3xl sm:text-4xl font-semibold text-violet-100 text-center mb-9 drop-shadow-[0_0_15px_rgba(147,51,234,0.6)]">
            The founders covenant
          </h2>

          <div className="relative z-10">
            <p className="text-lg sm:text-xl text-violet-100/95 leading-relaxed mb-6 text-center">
              GlyphLock was never built to impress investors.  
              It was built because something sacred was being left undefended.  
              Carlo watched lies outrun facts.  
              He watched identity become a costume anyone could steal.  
              He watched creations get ripped from their creators with no consequence.  
              He watched evidence get erased like it never existed.  
              He saw the world sliding into a place where nothing could be trusted unless someone built a system that made truth undeniable.
            </p>

            <p className="text-lg sm:text-xl text-violet-100/95 leading-relaxed mb-6 text-center">
              Every loss every betrayal every promise that collapsed became material for the foundation.  
              Carlo brought all of it into the Master Covenant.  
              The way we bind proof to action.  
              The way we hold identity accountable.  
              The way glyphs carry intent.  
              None of this is theory.  
              It is lived experience translated into architecture.
            </p>

            <p className="text-lg sm:text-xl text-violet-100/95 leading-relaxed text-center">
              GlyphLock is his answer to a world that treats truth as optional.  
              It is his promise to his children to his wife to his family and to every creator and builder who has ever been copied stolen erased or silenced.  
              This is not here so people can simply stay afloat.  
              It is here so they can move from fear into something stronger.
            </p>
          </div>
        </section>

        {/* Identity and role card */}
        <section
          id="role"
          className="w-full max-w-5xl rounded-[2rem] px-7 sm:px-12 py-12 sm:py-14 mb-20 group transition-all duration-200 hover:scale-[1.005]"
          style={{
            background: 'linear-gradient(135deg, rgba(10, 10, 20, 0.8) 0%, rgba(15, 15, 31, 0.7) 100%)',
            border: '2px solid rgba(129, 140, 248, 0.4)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 0 45px rgba(129, 140, 248, 0.6)'
          }}
        >
          <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/0 via-white/8 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-250 pointer-events-none" />
          
          <h2 className="relative z-10 text-3xl sm:text-4xl font-semibold text-violet-100 text-center mb-9 drop-shadow-[0_0_15px_rgba(129,140,248,0.6)]">
            Who Carlo is inside GlyphLock
          </h2>

          <div className="relative z-10">
            <p className="text-lg sm:text-xl text-violet-100/95 leading-relaxed mb-6">
              Inside the company Carlo is not just the founder.  
              He is the keeper of the line between vision and reality.  
              He designs the logic that holds truth in place.  
              He shapes the frameworks that anchor identity intent and verification.  
              He carries the tension between art and system between story and logic between what is felt and what is provable.
            </p>

            <p className="text-lg sm:text-xl text-violet-100/95 leading-relaxed mb-6">
              His life does not come from textbooks.  
              It comes from music design struggle security and hard earned lessons that left scars and wisdom in equal measure.  
              That is why GlyphLock feels alive instead of manufactured.  
              It breathes because he does.
            </p>

            <p className="text-lg sm:text-xl text-violet-100/95 leading-relaxed">
              Every decision passes through one question.  
              Does this protect the people who cannot afford another betrayal.  
              If the answer is no it never ships.
            </p>
          </div>
        </section>

        {/* CTA section */}
        <section
          id="consult"
          className="w-full max-w-4xl flex flex-col items-center"
        >
          <p className="text-base sm:text-lg md:text-xl text-violet-100/90 text-center mb-6 max-w-2xl">
            If this story feels familiar if you have been copied or played or left exposed you already understand why GlyphLock exists.  
            You do not need another pitch.  
            You need protection that was born from the same fire.
          </p>

          <button
            className="relative px-16 py-5 text-lg sm:text-xl font-semibold rounded-[1.75rem] bg-gradient-to-r from-fuchsia-500 via-violet-500 to-indigo-500 shadow-[0_0_40px_rgba(168,85,247,0.75)] hover:shadow-[0_0_70px_rgba(196,116,255,0.9)] hover:scale-[1.02] transition-all duration-300 active:scale-[0.97]"
            onClick={() => {
              window.location.href = "/consultation";
            }}
          >
            Schedule a consultation
            <span className="absolute inset-0 rounded-[1.75rem] bg-white/15 opacity-0 hover:opacity-20 transition-all duration-300" />
          </button>
        </section>

        {/* Final word */}
        <section className="mt-16 max-w-3xl text-center">
          <p className="text-lg sm:text-xl text-violet-100/95 leading-relaxed">
            This is not a story that ends at survival.  
            The whole point of GlyphLock and the work behind it is simple.  
            We are here for something greater.  
            This is about thrival.
          </p>
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