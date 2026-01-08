import React, { useMemo } from "react";

export default function TechnologyMarqueeEEE() {

  /* =====================================================
     CANONICAL COMPANY LIST — EDIT HERE ONLY
     ===================================================== */

  const ALL_COMPANIES = [
    // Cloud / Infra
    { name: "AWS", logo: "https://www.vectorlogo.zone/logos/amazon_aws/amazon_aws-ar21.svg" },
    { name: "Google Cloud", logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg" },
    { name: "Microsoft Azure", logo: "https://www.vectorlogo.zone/logos/microsoft_azure/microsoft_azure-ar21.svg" },
    { name: "Cloudflare", logo: "https://www.vectorlogo.zone/logos/cloudflare/cloudflare-ar21.svg" },
    { name: "DigitalOcean", logo: "https://www.vectorlogo.zone/logos/digitalocean/digitalocean-ar21.svg" },
    { name: "Heroku", logo: "https://upload.wikimedia.org/wikipedia/commons/e/ec/Heroku_logo.svg" },
    { name: "Vercel", logo: "https://www.vectorlogo.zone/logos/vercel/vercel-ar21.svg" },
    { name: "Netlify", logo: "https://www.vectorlogo.zone/logos/netlify/netlify-ar21.svg" },

    // Data / Backend
    { name: "PostgreSQL", logo: "https://www.vectorlogo.zone/logos/postgresql/postgresql-ar21.svg" },
    { name: "MongoDB", logo: "https://www.vectorlogo.zone/logos/mongodb/mongodb-ar21.svg" },
    { name: "Redis", logo: "https://www.vectorlogo.zone/logos/redis/redis-ar21.svg" },
    { name: "Firebase", logo: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Firebase_Logo.png" },
    { name: "Supabase", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Supabase_Logo.svg" },

    // AI / ML
    { name: "OpenAI", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg" },
    { name: "Anthropic", logo: "https://upload.wikimedia.org/wikipedia/commons/7/78/Anthropic_logo.svg" },
    { name: "Perplexity", logo: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/perplexity-ai-icon.png" },
    { name: "Hugging Face", logo: "https://huggingface.co/front/assets/huggingface_logo.svg" },
    { name: "NVIDIA", logo: "https://www.vectorlogo.zone/logos/nvidia/nvidia-ar21.svg" },

    // Dev / Product
    { name: "GitHub", logo: "https://www.vectorlogo.zone/logos/github/github-ar21.svg" },
    { name: "GitLab", logo: "https://www.vectorlogo.zone/logos/gitlab/gitlab-ar21.svg" },
    { name: "Docker", logo: "https://www.vectorlogo.zone/logos/docker/docker-ar21.svg" },
    { name: "Kubernetes", logo: "https://www.vectorlogo.zone/logos/kubernetes/kubernetes-ar21.svg" },
    { name: "Terraform", logo: "https://www.vectorlogo.zone/logos/terraformio/terraformio-ar21.svg" },
    { name: "Jenkins", logo: "https://www.vectorlogo.zone/logos/jenkins/jenkins-ar21.svg" },

    // Frontend
    { name: "React", logo: "https://www.vectorlogo.zone/logos/reactjs/reactjs-ar21.svg" },
    { name: "Next.js", logo: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Nextjs-logo.svg" },
    { name: "TypeScript", logo: "https://www.vectorlogo.zone/logos/typescriptlang/typescriptlang-ar21.svg" },
    { name: "TailwindCSS", logo: "https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-ar21.svg" },

    // Security
    { name: "CrowdStrike", logo: "https://upload.wikimedia.org/wikipedia/commons/3/3e/CrowdStrike_logo.svg" },
    { name: "Palo Alto Networks", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Palo_Alto_Networks_logo.svg" },
    { name: "Fortinet", logo: "https://upload.wikimedia.org/wikipedia/commons/6/62/Fortinet_logo.svg" },
    { name: "Zscaler", logo: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Zscaler_logo.svg" },
    { name: "Okta", logo: "https://www.vectorlogo.zone/logos/okta/okta-ar21.svg" },

    // Finance / Payments
    { name: "Stripe", logo: "https://logo.clearbit.com/stripe.com" },
    { name: "Square", logo: "https://logo.clearbit.com/squareup.com" },
    { name: "PayPal", logo: "https://www.vectorlogo.zone/logos/paypal/paypal-ar21.svg" },
    { name: "Visa", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" },
    { name: "Mastercard", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" },
    { name: "US Bank", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2d/US_Bank_logo_2020.svg" },

    // Platforms
    { name: "Apple", logo: "https://www.vectorlogo.zone/logos/apple/apple-ar21.svg" },
    { name: "Microsoft", logo: "https://www.vectorlogo.zone/logos/microsoft/microsoft-ar21.svg" },
    { name: "Google", logo: "https://www.vectorlogo.zone/logos/google/google-ar21.svg" },
    { name: "Amazon", logo: "https://www.vectorlogo.zone/logos/amazon/amazon-ar21.svg" },
    { name: "Meta", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg" },

    // GlyphLock ecosystem
    { name: "Base44", logo: "https://avatars.githubusercontent.com/u/145019558?s=200&v=4" }
  ];

  /* =====================================================
     CATEGORY GLOW (NO DRIFT)
     ===================================================== */

  const categories = useMemo(() => {
    const AI = new Set(["OpenAI","Anthropic","Perplexity","Hugging Face","NVIDIA"]);
    const FIN = new Set(["Stripe","Square","PayPal","Visa","Mastercard","US Bank"]);
    const SEC = new Set(["CrowdStrike","Palo Alto Networks","Fortinet","Zscaler","Okta"]);
    const pick = (n) => AI.has(n) ? "ai" : FIN.has(n) ? "fin" : SEC.has(n) ? "sec" : "core";
    return { pick };
  }, []);

  /* =====================================================
     AUTO-SPLIT — NOTHING CAN BE LOST
     ===================================================== */

  const rows = useMemo(() => {
    const r = [[],[],[]];
    ALL_COMPANIES.forEach((c,i)=>r[i%3].push(c));
    return r;
  }, []);

  const repeat = (arr,n)=>Array.from({length:n},()=>arr).flat();

  return (
    <section className="eee-wrap">

      {/* TRIPLE-E HEADER */}
      <div className="eee-header">
        <div className="eee-glyph"><span>E</span><span>E</span><span>E</span></div>
        <h2>Enterprise Engineering Excellence</h2>
      </div>

      {/* MARQUEE */}
      <div className="eee-fullbleed">
        {rows.map((row,i)=>(
          <div className="marquee-container" key={i}>
            <div className={`marquee-track ${i%2?"right":"left"}`}>
              {repeat(row,5).map((c,j)=>(
                <div key={c.name+j} className={`logo-item glow-${categories.pick(c.name)}`}>
                  <img src={c.logo} alt={c.name}/>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .eee-wrap{background:#000;padding:7rem 0;overflow:hidden}
        .eee-header{text-align:center;margin-bottom:3rem}
        .eee-glyph{font-size:5rem;font-weight:900;letter-spacing:.4em;color:#a78bfa;text-shadow:0 0 40px #a78bfa}
        h2{color:#fff;font-size:3rem;font-weight:900}
        .eee-fullbleed{width:100vw;left:50%;transform:translateX(-50%);position:relative}
        .marquee-container{overflow:hidden;padding:1.2rem 0;mask-image:linear-gradient(to right,transparent,black 5%,black 95%,transparent)}
        .marquee-track{display:flex;gap:3rem;width:max-content;animation:scroll-left 120s linear infinite}
        .marquee-track.right{animation-name:scroll-right}
        @keyframes scroll-left{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes scroll-right{from{transform:translateX(-50%)}to{transform:translateX(0)}}
        .logo-item{width:220px;height:110px;display:flex;align-items:center;justify-content:center}
        .logo-item img{max-width:100%;max-height:100%;filter:brightness(0) invert(1)}
        .glow-ai:hover img{filter:brightness(1) invert(0) drop-shadow(0 0 40px #a78bfa)}
        .glow-fin:hover img{filter:brightness(1) invert(0) drop-shadow(0 0 40px gold)}
        .glow-sec:hover img{filter:brightness(1) invert(0) drop-shadow(0 0 40px red)}
        .glow-core:hover img{filter:brightness(1) invert(0) drop-shadow(0 0 40px #6366f1)}
      `}</style>

    </section>
  );
}
