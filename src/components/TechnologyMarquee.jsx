import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function TechnologyMarquee() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  /* =========================
     ALL COMPANIES (UNCHANGED)
     ========================= */

  const row1Logos = [
    { name: "AWS", logo: "https://www.vectorlogo.zone/logos/amazon_aws/amazon_aws-ar21.svg" },
    { name: "Google Cloud", logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg" },
    { name: "Microsoft Azure", logo: "https://www.vectorlogo.zone/logos/microsoft_azure/microsoft_azure-ar21.svg" },
    { name: "Vercel", logo: "https://www.vectorlogo.zone/logos/vercel/vercel-ar21.svg" },
    { name: "Docker", logo: "https://www.vectorlogo.zone/logos/docker/docker-ar21.svg" },
    { name: "PostgreSQL", logo: "https://www.vectorlogo.zone/logos/postgresql/postgresql-ar21.svg" },
    { name: "MongoDB", logo: "https://www.vectorlogo.zone/logos/mongodb/mongodb-ar21.svg" },
    { name: "Redis", logo: "https://www.vectorlogo.zone/logos/redis/redis-ar21.svg" },
    { name: "OpenAI", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg" },
    { name: "NVIDIA", logo: "https://www.vectorlogo.zone/logos/nvidia/nvidia-ar21.svg" },
    { name: "Hugging Face", logo: "https://huggingface.co/front/assets/huggingface_logo.svg" },
    { name: "GitHub", logo: "https://www.vectorlogo.zone/logos/github/github-ar21.svg" },
    { name: "Cloudflare", logo: "https://www.vectorlogo.zone/logos/cloudflare/cloudflare-ar21.svg" },
    { name: "Stripe", logo: "https://logo.clearbit.com/stripe.com" },
    { name: "Square", logo: "https://logo.clearbit.com/squareup.com" },
    { name: "Kubernetes", logo: "https://www.vectorlogo.zone/logos/kubernetes/kubernetes-ar21.svg" },
    { name: "Terraform", logo: "https://www.vectorlogo.zone/logos/terraformio/terraformio-ar21.svg" },
    { name: "Supabase", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Supabase_Logo.svg" },
    { name: "React", logo: "https://www.vectorlogo.zone/logos/reactjs/reactjs-ar21.svg" },
    { name: "Node.js", logo: "https://www.vectorlogo.zone/logos/nodejs/nodejs-ar21.svg" },
    { name: "Python", logo: "https://www.vectorlogo.zone/logos/python/python-ar21.svg" },
    { name: "TypeScript", logo: "https://www.vectorlogo.zone/logos/typescriptlang/typescriptlang-ar21.svg" },
    { name: "Next.js", logo: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Nextjs-logo.svg" },
    { name: "TailwindCSS", logo: "https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-ar21.svg" },
    { name: "GraphQL", logo: "https://www.vectorlogo.zone/logos/graphql/graphql-ar21.svg" },
    { name: "Auth0", logo: "https://www.vectorlogo.zone/logos/auth0/auth0-ar21.svg" },
    { name: "CrowdStrike", logo: "https://upload.wikimedia.org/wikipedia/commons/3/3e/CrowdStrike_logo.svg" },
    { name: "Palo Alto", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Palo_Alto_Networks_logo.svg" },
    { name: "Fortinet", logo: "https://upload.wikimedia.org/wikipedia/commons/6/62/Fortinet_logo.svg" },
    { name: "Check Point", logo: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Check_Point_Logo.svg" },
    { name: "Zscaler", logo: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Zscaler_logo.svg" },
    { name: "Cisco", logo: "https://www.vectorlogo.zone/logos/cisco/cisco-ar21.svg" },
    { name: "Okta", logo: "https://www.vectorlogo.zone/logos/okta/okta-ar21.svg" },
    { name: "Datadog", logo: "https://www.vectorlogo.zone/logos/datadoghq/datadoghq-ar21.svg" },
    { name: "Grafana", logo: "https://www.vectorlogo.zone/logos/grafana/grafana-ar21.svg" },
    { name: "Sentry", logo: "https://www.vectorlogo.zone/logos/sentry/sentry-ar21.svg" },
    { name: "Netlify", logo: "https://www.vectorlogo.zone/logos/netlify/netlify-ar21.svg" },
    { name: "Firebase", logo: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Firebase_Logo.png" },
    { name: "Heroku", logo: "https://upload.wikimedia.org/wikipedia/commons/e/ec/Heroku_logo.svg" },
    { name: "DigitalOcean", logo: "https://www.vectorlogo.zone/logos/digitalocean/digitalocean-ar21.svg" },
    { name: "GoDaddy", logo: "https://upload.wikimedia.org/wikipedia/commons/3/36/GoDaddy_logo.svg" },
    { name: "Base44", logo: "https://avatars.githubusercontent.com/u/145019558?s=200&v=4" }
  ];

  const row2Logos = [
    { name: "Salesforce", logo: "https://www.vectorlogo.zone/logos/salesforce/salesforce-ar21.svg" },
    { name: "Oracle", logo: "https://www.vectorlogo.zone/logos/oracle/oracle-ar21.svg" },
    { name: "SAP", logo: "https://www.vectorlogo.zone/logos/sap/sap-ar21.svg" },
    { name: "IBM", logo: "https://www.vectorlogo.zone/logos/ibm/ibm-ar21.svg" },
    { name: "ServiceNow", logo: "https://upload.wikimedia.org/wikipedia/commons/5/57/ServiceNow_logo.svg" },
    { name: "Workday", logo: "https://www.vectorlogo.zone/logos/workday/workday-ar21.svg" },
    { name: "Snowflake", logo: "https://www.vectorlogo.zone/logos/snowflake/snowflake-ar21.svg" },
    { name: "Databricks", logo: "https://www.vectorlogo.zone/logos/databricks/databricks-ar21.svg" },
    { name: "Tableau", logo: "https://www.vectorlogo.zone/logos/tableau/tableau-ar21.svg" },
    { name: "PagerDuty", logo: "https://www.vectorlogo.zone/logos/pagerduty/pagerduty-ar21.svg" },
    { name: "Perplexity", logo: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/perplexity-ai-icon.png" },
    { name: "Anthropic", logo: "https://upload.wikimedia.org/wikipedia/commons/7/78/Anthropic_logo.svg" }
  ];

  const row3Logos = [
    { name: "Apple", logo: "https://www.vectorlogo.zone/logos/apple/apple-ar21.svg" },
    { name: "Microsoft", logo: "https://www.vectorlogo.zone/logos/microsoft/microsoft-ar21.svg" },
    { name: "Google", logo: "https://www.vectorlogo.zone/logos/google/google-ar21.svg" },
    { name: "Amazon", logo: "https://www.vectorlogo.zone/logos/amazon/amazon-ar21.svg" },
    { name: "Meta", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg" },
    { name: "Tesla", logo: "https://www.vectorlogo.zone/logos/tesla/tesla-ar21.svg" },
    { name: "SpaceX", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2e/SpaceX_logo_black.svg" },
    { name: "PayPal", logo: "https://www.vectorlogo.zone/logos/paypal/paypal-ar21.svg" },
    { name: "Visa", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" },
    { name: "Mastercard", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" }
  ];

  const repeat = (arr) => [...arr, ...arr, ...arr, ...arr];

  const AI = new Set(["OpenAI","Anthropic","Hugging Face","Perplexity","NVIDIA"]);
  const FINANCE = new Set(["Stripe","Square","PayPal","Visa","Mastercard"]);
  const SECURITY = new Set(["CrowdStrike","Palo Alto","Fortinet","Check Point","Zscaler","Cloudflare"]);

  const classify = (name) =>
    AI.has(name) ? "ai" : FINANCE.has(name) ? "finance" : SECURITY.has(name) ? "security" : "default";

  return (
    <div ref={containerRef} className="w-full max-w-7xl mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="space-y-4"
      >
        {[row1Logos, row2Logos, row3Logos].map((row, i) => (
          <div key={i} className="marquee-container">
            <div className={`marquee ${i % 2 ? "right" : ""}`} style={{ animationDuration: `${90 + i * 15}s` }}>
              {repeat(row).map((c, idx) => (
                <div key={`${c.name}-${idx}`} className={`logo-item ${classify(c.name)}`}>
                  <img
                    src={c.logo}
                    alt={c.name}
                    className="logo-img"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.closest(".logo-item")?.remove();
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </motion.div>

      <style>{`
        .marquee-container { overflow: hidden; }
        .marquee { display: flex; gap: 2rem; width: max-content; animation: scroll-left linear infinite; }
        .marquee.right { animation-name: scroll-right; }

        .logo-item {
          width: 120px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s ease;
        }

        .logo-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          image-rendering: -webkit-optimize-contrast;
          filter: brightness(0) invert(1) opacity(0.7);
          transition: filter 0.3s ease;
        }

        .logo-item:hover { transform: scale(1.15) translateY(-2px); z-index: 10; }

        .logo-item.default:hover .logo-img {
          filter: brightness(1) invert(0) opacity(1)
            drop-shadow(0 0 18px rgba(99,102,241,0.9));
        }

        .logo-item.finance:hover .logo-img {
          filter: brightness(1) invert(0) opacity(1)
            drop-shadow(0 0 18px rgba(255,215,0,0.9));
        }

        .logo-item.security:hover .logo-img {
          filter: brightness(1) invert(0) opacity(1)
            drop-shadow(0 0 18px rgba(255,60,60,0.9));
        }

        .logo-item.ai {
          animation: aiPulse 2.6s ease-in-out infinite;
        }

        @keyframes aiPulse {
          0%,100% { filter: none; }
          50% { filter: drop-shadow(0 0 14px rgba(124,58,237,0.6)); }
        }

        @keyframes scroll-left { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes scroll-right { from { transform: translateX(-50%); } to { transform: translateX(0); } }
      `}</style>
    </div>
  );
}

