import React, { useState, useEffect, useRef } from "react";

export default function TechStackCarousel() {
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef(null);

  const techStack = [
    { name: "Twilio", label: "Comms and OTP", logo: "https://www.vectorlogo.zone/logos/twilio/twilio-ar21.svg" },
    { name: "SendGrid", label: "Transactional mail", logo: "https://www.vectorlogo.zone/logos/sendgrid/sendgrid-ar21.svg" },
    { name: "Firebase", label: "Auth and realtime", logo: "https://www.vectorlogo.zone/logos/firebase/firebase-ar21.svg" },
    { name: "Replit", label: "Rapid dev", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Repl.it_logo.svg" },
    { name: "Vercel", label: "Edge deploy", logo: "https://www.vectorlogo.zone/logos/vercel/vercel-ar21.svg" },
    { name: "Base44", label: "AI infra", logo: "https://app.base44.com/logo.svg" },
    { name: "JWT", label: "Token layer", logo: "https://www.vectorlogo.zone/logos/jwt/jwt-ar21.svg" },
    { name: "VS Code", label: "Main IDE", logo: "https://www.vectorlogo.zone/logos/visualstudio_code/visualstudio_code-ar21.svg" },
    { name: "Claude", label: "Shooting guard", logo: "https://upload.wikimedia.org/wikipedia/commons/1/13/ChatGPT-Logo.png" },
    { name: "Gemini", label: "Small forward", logo: "https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg" },
    { name: "OpenAI", label: "Point guard", logo: "https://www.vectorlogo.zone/logos/openai/openai-ar21.svg" },
    { name: "Perplexity", label: "Power forward", logo: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/perplexity-ai-icon.png" }
  ];

  useEffect(() => {
    if (trackRef.current) {
      const children = Array.from(trackRef.current.children);
      const halfLength = children.length / 2;
      
      if (children.length <= techStack.length) {
        children.forEach(child => {
          const clone = child.cloneNode(true);
          trackRef.current.appendChild(clone);
        });
      }
    }
  }, []);

  return (
    <div className="w-full max-w-[1100px] mx-auto px-6 py-6 rounded-3xl bg-gradient-to-b from-gray-900 via-slate-950 to-slate-950 border border-slate-700/30 shadow-2xl shadow-blue-500/25 relative overflow-hidden">
      {/* Glow Orbit */}
      <div className="absolute inset-[-40%] opacity-55 pointer-events-none mix-blend-screen">
        <div className="absolute inset-0 bg-gradient-radial from-blue-500/14 via-transparent to-transparent" style={{ backgroundPosition: '10% 10%' }}></div>
        <div className="absolute inset-0 bg-gradient-radial from-pink-500/16 via-transparent to-transparent" style={{ backgroundPosition: '90% 20%' }}></div>
        <div className="absolute inset-0 bg-gradient-radial from-teal-500/12 via-transparent to-transparent" style={{ backgroundPosition: '50% 100%' }}></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex justify-between items-baseline mb-5 gap-4 flex-wrap">
        <div>
          <div className="text-sm uppercase tracking-[0.17em] text-gray-400 mb-0.5">
            GlyphLock Dream Stack
          </div>
          <div className="text-xs text-gray-600">
            Bound by BPAAA, powered by real tools, not AI slop
          </div>
        </div>
        <div className="text-xs text-gray-600">
          Hover to light them up
        </div>
      </div>

      {/* Carousel */}
      <div 
        className="relative overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <div 
          ref={trackRef}
          className="flex items-center gap-14"
          style={{
            animation: isPaused ? 'none' : 'scroll 26s linear infinite',
            willChange: 'transform'
          }}
        >
          {techStack.map((tech, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1.5 min-w-[88px] flex-shrink-0">
              <div className="w-[90px] h-[54px] rounded-full bg-gradient-to-br from-gray-800 via-slate-950 to-slate-950 border border-slate-700/35 flex items-center justify-center transition-all duration-250 hover:-translate-y-1 hover:border-indigo-400/80 hover:shadow-[0_0_18px_rgba(129,140,248,0.75),0_0_60px_rgba(59,130,246,0.55)] hover:bg-gradient-to-br hover:from-gray-800 hover:to-slate-950 group">
                <img 
                  src={tech.logo} 
                  alt={tech.name}
                  className="max-w-[70%] max-h-9 object-contain grayscale opacity-45 transition-all duration-220 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
                />
              </div>
              <div className="text-xs uppercase tracking-[0.14em] text-gray-400 whitespace-nowrap">
                {tech.name}
              </div>
              <div className="text-[0.65rem] text-gray-600 hidden sm:block">
                {tech.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}