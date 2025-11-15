import React from "react";

export default function TechStackCarousel() {
  // Row 1: 25 logos (logos with text built-in don't need labels)
  const row1Companies = [
    { name: "AWS", logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg", hasText: true },
    { name: "Google Cloud", logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg", hasText: true },
    { name: "Microsoft Azure", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Microsoft_Azure.svg", hasText: true },
    { name: "Anthropic", logo: "https://upload.wikimedia.org/wikipedia/commons/7/78/Anthropic_logo.svg", hasText: true },
    { name: "OpenAI", logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg", hasText: false },
    { name: "Meta", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg", hasText: true },
    { name: "NVIDIA", logo: "https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg", hasText: true },
    { name: "Docker", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Docker_%28container_engine%29_logo.svg", hasText: true },
    { name: "Kubernetes", logo: "https://upload.wikimedia.org/wikipedia/commons/3/39/Kubernetes_logo_without_workmark.svg", hasText: false },
    { name: "PostgreSQL", logo: "https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg", hasText: false },
    { name: "MongoDB", logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/MongoDB_Logo.svg", hasText: true },
    { name: "Redis", logo: "https://upload.wikimedia.org/wikipedia/commons/6/64/Logo-redis.svg", hasText: true },
    { name: "MySQL", logo: "https://upload.wikimedia.org/wikipedia/commons/0/0a/MySQL_textlogo.svg", hasText: true },
    { name: "Stripe", logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg", hasText: true },
    { name: "PayPal", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg", hasText: true },
    { name: "Twilio", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Twilio-logo-red.svg", hasText: true },
    { name: "GitHub", logo: "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg", hasText: false },
    { name: "GitLab", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e1/GitLab_logo.svg", hasText: true },
    { name: "Cloudflare", logo: "https://upload.wikimedia.org/wikipedia/commons/9/94/Cloudflare_Logo.svg", hasText: true },
    { name: "Slack", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg", hasText: false },
    { name: "Salesforce", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg", hasText: true },
    { name: "Oracle", logo: "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg", hasText: true },
    { name: "IBM", logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg", hasText: true },
    { name: "Vercel", logo: "https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png", hasText: false },
    { name: "Netlify", logo: "https://www.vectorlogo.zone/logos/netlify/netlify-icon.svg", hasText: false }
  ];

  // Row 2: 25 logos
  const row2Companies = [
    { name: "DigitalOcean", logo: "https://upload.wikimedia.org/wikipedia/commons/f/ff/DigitalOcean_logo.svg", hasText: true },
    { name: "Terraform", logo: "https://www.vectorlogo.zone/logos/terraformio/terraformio-icon.svg", hasText: false },
    { name: "Supabase", logo: "https://www.vectorlogo.zone/logos/supabase/supabase-icon.svg", hasText: false },
    { name: "Grafana", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a1/Grafana_logo.svg", hasText: true },
    { name: "Jenkins", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e9/Jenkins_logo.svg", hasText: true },
    { name: "Auth0", logo: "https://www.vectorlogo.zone/logos/auth0/auth0-icon.svg", hasText: false },
    { name: "Okta", logo: "https://www.vectorlogo.zone/logos/okta/okta-icon.svg", hasText: false },
    { name: "HashiCorp", logo: "https://www.vectorlogo.zone/logos/hashicorp/hashicorp-icon.svg", hasText: false },
    { name: "Postman", logo: "https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg", hasText: false },
    { name: "Figma", logo: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg", hasText: true },
    { name: "Datadog", logo: "https://www.vectorlogo.zone/logos/datadoghq/datadoghq-icon.svg", hasText: false },
    { name: "SendGrid", logo: "https://www.vectorlogo.zone/logos/sendgrid/sendgrid-icon.svg", hasText: false },
    { name: "Snowflake", logo: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Snowflake_Logo.svg", hasText: true },
    { name: "Atlassian", logo: "https://upload.wikimedia.org/wikipedia/commons/a/ad/Atlassian-logo.svg", hasText: true },
    { name: "SAP", logo: "https://upload.wikimedia.org/wikipedia/commons/5/59/SAP_2011_logo.svg", hasText: true },
    { name: "React", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg", hasText: false },
    { name: "Node.js", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg", hasText: true },
    { name: "Python", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg", hasText: false },
    { name: "Tailwind", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg", hasText: false },
    { name: "TypeScript", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg", hasText: false },
    { name: "Hugging Face", logo: "https://huggingface.co/front/assets/huggingface_logo.svg", hasText: false },
    { name: "Nginx", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Nginx_logo.svg", hasText: true },
    { name: "Apache", logo: "https://upload.wikimedia.org/wikipedia/commons/d/db/Apache_Software_Foundation_Logo_%282016%29.svg", hasText: true },
    { name: "Linux", logo: "https://upload.wikimedia.org/wikipedia/commons/3/35/Tux.svg", hasText: false },
    { name: "Ubuntu", logo: "https://upload.wikimedia.org/wikipedia/commons/9/9e/UbuntuCoF.svg", hasText: false }
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
              {!company.hasText && <span className="logo-name">{company.name}</span>}
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
              {!company.hasText && <span className="logo-name">{company.name}</span>}
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
          gap: 2.5rem;
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
          width: 85px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .logo-img {
          width: 70px;
          height: 35px;
          object-fit: contain;
          filter: grayscale(100%) brightness(0) invert(1);
          opacity: 0.7;
          transition: all 0.3s ease-in-out;
        }

        .logo-name {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.5);
          text-align: center;
          white-space: nowrap;
          transition: all 0.3s ease-in-out;
          font-weight: 500;
        }

        .logo-item:hover .logo-img {
          filter: grayscale(0%) brightness(1) invert(0);
          opacity: 1;
          transform: scale(1.15);
        }

        .logo-item:hover .logo-name {
          color: #00BFFF;
          font-weight: 600;
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