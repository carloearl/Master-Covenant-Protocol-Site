import React, { useState, useEffect, useRef } from "react";

export default function TechStackCarousel() {
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef(null);

  const techStack = [
    { name: "AWS", label: "Cloud Infrastructure", logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" },
    { name: "Google Cloud", label: "AI & ML Platform", logo: "https://www.vectorlogo.zone/logos/google_cloud/google_cloud-ar21.svg" },
    { name: "Microsoft", label: "Azure Enterprise", logo: "https://www.vectorlogo.zone/logos/microsoft/microsoft-ar21.svg" },
    { name: "Oracle", label: "Database Systems", logo: "https://www.vectorlogo.zone/logos/oracle/oracle-ar21.svg" },
    { name: "IBM", label: "Quantum Computing", logo: "https://www.vectorlogo.zone/logos/ibm/ibm-ar21.svg" },
    { name: "Stripe", label: "Payment Processing", logo: "https://www.vectorlogo.zone/logos/stripe/stripe-ar21.svg" },
    { name: "OpenAI", label: "AI Integration", logo: "https://www.vectorlogo.zone/logos/openai/openai-ar21.svg" },
    { name: "Anthropic", label: "Claude AI", logo: "https://upload.wikimedia.org/wikipedia/commons/7/78/Anthropic_logo.svg" },
    { name: "Vercel", label: "Edge Computing", logo: "https://www.vectorlogo.zone/logos/vercel/vercel-ar21.svg" },
    { name: "Cloudflare", label: "Security & CDN", logo: "https://www.vectorlogo.zone/logos/cloudflare/cloudflare-ar21.svg" },
    { name: "MongoDB", label: "Database", logo: "https://www.vectorlogo.zone/logos/mongodb/mongodb-ar21.svg" },
    { name: "PostgreSQL", label: "SQL Database", logo: "https://www.vectorlogo.zone/logos/postgresql/postgresql-ar21.svg" },
    { name: "Docker", label: "Containerization", logo: "https://www.vectorlogo.zone/logos/docker/docker-ar21.svg" },
    { name: "Kubernetes", label: "Orchestration", logo: "https://www.vectorlogo.zone/logos/kubernetes/kubernetes-ar21.svg" },
    { name: "GitHub", label: "Version Control", logo: "https://www.vectorlogo.zone/logos/github/github-ar21.svg" },
    { name: "Twilio", label: "Communications", logo: "https://www.vectorlogo.zone/logos/twilio/twilio-ar21.svg" },
    { name: "Redis", label: "Caching", logo: "https://www.vectorlogo.zone/logos/redis/redis-ar21.svg" },
    { name: "Nginx", label: "Web Server", logo: "https://www.vectorlogo.zone/logos/nginx/nginx-ar21.svg" },
    { name: "Node.js", label: "Runtime", logo: "https://www.vectorlogo.zone/logos/nodejs/nodejs-ar21.svg" },
    { name: "React", label: "UI Framework", logo: "https://www.vectorlogo.zone/logos/reactjs/reactjs-ar21.svg" },
    { name: "TensorFlow", label: "Machine Learning", logo: "https://www.vectorlogo.zone/logos/tensorflow/tensorflow-ar21.svg" },
    { name: "Terraform", label: "Infrastructure", logo: "https://www.vectorlogo.zone/logos/terraformio/terraformio-ar21.svg" },
    { name: "Jenkins", label: "CI/CD", logo: "https://www.vectorlogo.zone/logos/jenkins/jenkins-ar21.svg" },
    { name: "Grafana", label: "Monitoring", logo: "https://www.vectorlogo.zone/logos/grafana/grafana-ar21.svg" }
  ];

  useEffect(() => {
    if (trackRef.current) {
      const children = Array.from(trackRef.current.children);
      
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
            Trusted By Industry Leaders
          </div>
          <div className="text-xs text-gray-600">
            Built using the same technology as these world-class companies
          </div>
        </div>
        <div className="text-xs text-gray-600">
          Hover to explore
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
            animation: isPaused ? 'none' : 'scroll 30s linear infinite',
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