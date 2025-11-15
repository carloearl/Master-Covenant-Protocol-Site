import React from "react";

export default function TechStackCarousel() {
  // 50 reliable tech partner logos split into two rows
  const row1Companies = [
    { name: "AWS", logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" },
    { name: "Google Cloud", logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg" },
    { name: "Microsoft Azure", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Microsoft_Azure.svg" },
    { name: "Anthropic", logo: "https://upload.wikimedia.org/wikipedia/commons/7/78/Anthropic_logo.svg" },
    { name: "OpenAI", logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg" },
    { name: "Meta", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg" },
    { name: "NVIDIA", logo: "https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg" },
    { name: "Docker", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Docker_%28container_engine%29_logo.svg" },
    { name: "Kubernetes", logo: "https://upload.wikimedia.org/wikipedia/commons/3/39/Kubernetes_logo_without_workmark.svg" },
    { name: "PostgreSQL", logo: "https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg" },
    { name: "MongoDB", logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/MongoDB_Logo.svg" },
    { name: "Redis", logo: "https://upload.wikimedia.org/wikipedia/commons/6/64/Logo-redis.svg" },
    { name: "MySQL", logo: "https://upload.wikimedia.org/wikipedia/commons/0/0a/MySQL_textlogo.svg" },
    { name: "Stripe", logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" },
    { name: "PayPal", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" },
    { name: "Twilio", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Twilio-logo-red.svg" },
    { name: "GitHub", logo: "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" },
    { name: "GitLab", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e1/GitLab_logo.svg" },
    { name: "Cloudflare", logo: "https://upload.wikimedia.org/wikipedia/commons/9/94/Cloudflare_Logo.svg" },
    { name: "Slack", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg" },
    { name: "Salesforce", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg" },
    { name: "Oracle", logo: "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg" },
    { name: "IBM", logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" },
    { name: "Vercel", logo: "https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png" },
    { name: "Netlify", logo: "https://www.vectorlogo.zone/logos/netlify/netlify-icon.svg" }
  ];

  const row2Companies = [
    { name: "DigitalOcean", logo: "https://upload.wikimedia.org/wikipedia/commons/f/ff/DigitalOcean_logo.svg" },
    { name: "Terraform", logo: "https://www.vectorlogo.zone/logos/terraformio/terraformio-icon.svg" },
    { name: "Supabase", logo: "https://www.vectorlogo.zone/logos/supabase/supabase-icon.svg" },
    { name: "Grafana", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a1/Grafana_logo.svg" },
    { name: "Jenkins", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e9/Jenkins_logo.svg" },
    { name: "Auth0", logo: "https://www.vectorlogo.zone/logos/auth0/auth0-icon.svg" },
    { name: "Okta", logo: "https://www.vectorlogo.zone/logos/okta/okta-icon.svg" },
    { name: "HashiCorp", logo: "https://www.vectorlogo.zone/logos/hashicorp/hashicorp-icon.svg" },
    { name: "Postman", logo: "https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg" },
    { name: "Figma", logo: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg" },
    { name: "Datadog", logo: "https://www.vectorlogo.zone/logos/datadoghq/datadoghq-icon.svg" },
    { name: "SendGrid", logo: "https://www.vectorlogo.zone/logos/sendgrid/sendgrid-icon.svg" },
    { name: "Snowflake", logo: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Snowflake_Logo.svg" },
    { name: "Atlassian", logo: "https://upload.wikimedia.org/wikipedia/commons/a/ad/Atlassian-logo.svg" },
    { name: "SAP", logo: "https://upload.wikimedia.org/wikipedia/commons/5/59/SAP_2011_logo.svg" },
    { name: "React", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" },
    { name: "Node.js", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg" },
    { name: "Python", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg" },
    { name: "Tailwind CSS", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg" },
    { name: "TypeScript", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg" },
    { name: "Hugging Face", logo: "https://huggingface.co/front/assets/huggingface_logo.svg" },
    { name: "Nginx", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Nginx_logo.svg" },
    { name: "Apache", logo: "https://upload.wikimedia.org/wikipedia/commons/d/db/Apache_Software_Foundation_Logo_%282016%29.svg" },
    { name: "Linux", logo: "https://upload.wikimedia.org/wikipedia/commons/3/35/Tux.svg" },
    { name: "Ubuntu", logo: "https://upload.wikimedia.org/wikipedia/commons/9/9e/UbuntuCoF.svg" }
  ];

  return (
    <div className="py-16 overflow-hidden">
      <div className="container mx-auto px-4 mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Integrated with <span style={{ color: '#00BFFF' }}>World-Class Technologies</span>
        </h2>
        <p className="text-gray-400 text-lg">Built on the world's most reliable and secure infrastructure</p>
      </div>

      {/* Row 1 - Scrolls Left */}
      <div className="marquee-wrapper mb-8">
        <div className="marquee-content marquee-left">
          {[...row1Companies, ...row1Companies, ...row1Companies].map((company, idx) => (
            <div key={`row1-${idx}`} className="logo-item">
              <img 
                src={company.logo} 
                alt={company.name}
                className="logo-img"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Row 2 - Scrolls Right */}
      <div className="marquee-wrapper">
        <div className="marquee-content marquee-right">
          {[...row2Companies, ...row2Companies, ...row2Companies].map((company, idx) => (
            <div key={`row2-${idx}`} className="logo-item">
              <img 
                src={company.logo} 
                alt={company.name}
                className="logo-img"
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .marquee-wrapper {
          width: 100%;
          overflow: hidden;
          position: relative;
        }

        .marquee-content {
          display: flex;
          gap: 4rem;
          align-items: center;
        }

        .marquee-left {
          animation: scroll-left 80s linear infinite;
        }

        .marquee-right {
          animation: scroll-right 80s linear infinite;
        }

        .marquee-wrapper:hover .marquee-content {
          animation-play-state: paused;
        }

        .logo-item {
          flex-shrink: 0;
          width: 120px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          filter: grayscale(100%) brightness(0) invert(1);
          opacity: 0.6;
          transition: all 0.3s ease-in-out;
        }

        .logo-item:hover .logo-img {
          filter: grayscale(0%) brightness(1) invert(0);
          opacity: 1;
          transform: scale(1.15);
          filter: drop-shadow(0 0 15px #00BFFF);
        }

        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33%);
          }
        }

        @keyframes scroll-right {
          0% {
            transform: translateX(-33.33%);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}