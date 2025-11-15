import React from "react";

export default function TechStackCarousel() {
  // Row 1: 25 logos scrolling left
  const row1Companies = [
    { name: "AWS", logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" },
    { name: "Google Cloud", logo: "https://www.vectorlogo.zone/logos/google_cloud/google_cloud-ar21.svg" },
    { name: "Microsoft Azure", logo: "https://www.vectorlogo.zone/logos/microsoft_azure/microsoft_azure-ar21.svg" },
    { name: "Vercel", logo: "https://www.vectorlogo.zone/logos/vercel/vercel-ar21.svg" },
    { name: "Docker", logo: "https://www.vectorlogo.zone/logos/docker/docker-ar21.svg" },
    { name: "PostgreSQL", logo: "https://www.vectorlogo.zone/logos/postgresql/postgresql-ar21.svg" },
    { name: "MongoDB", logo: "https://www.vectorlogo.zone/logos/mongodb/mongodb-ar21.svg" },
    { name: "Oracle", logo: "https://www.vectorlogo.zone/logos/oracle/oracle-ar21.svg" },
    { name: "Redis", logo: "https://www.vectorlogo.zone/logos/redis/redis-ar21.svg" },
    { name: "Snowflake", logo: "https://www.vectorlogo.zone/logos/snowflake/snowflake-ar21.svg" },
    { name: "ChatGPT", logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg" },
    { name: "NVIDIA", logo: "https://www.vectorlogo.zone/logos/nvidia/nvidia-ar21.svg" },
    { name: "Anthropic", logo: "https://www.vectorlogo.zone/logos/anthropic/anthropic-ar21.svg" },
    { name: "Hugging Face", logo: "https://huggingface.co/front/assets/huggingface_logo.svg" },
    { name: "GitHub", logo: "https://www.vectorlogo.zone/logos/github/github-ar21.svg" },
    { name: "GitLab", logo: "https://www.vectorlogo.zone/logos/gitlab/gitlab-ar21.svg" },
    { name: "Datadog", logo: "https://www.vectorlogo.zone/logos/datadoghq/datadoghq-ar21.svg" },
    { name: "Cloudflare", logo: "https://www.vectorlogo.zone/logos/cloudflare/cloudflare-ar21.svg" },
    { name: "Okta", logo: "https://www.vectorlogo.zone/logos/okta/okta-ar21.svg" },
    { name: "Snyk", logo: "https://www.vectorlogo.zone/logos/snyk/snyk-ar21.svg" },
    { name: "Stripe", logo: "https://www.vectorlogo.zone/logos/stripe/stripe-ar21.svg" },
    { name: "PayPal", logo: "https://www.vectorlogo.zone/logos/paypal/paypal-ar21.svg" },
    { name: "Salesforce", logo: "https://www.vectorlogo.zone/logos/salesforce/salesforce-ar21.svg" },
    { name: "Slack", logo: "https://www.vectorlogo.zone/logos/slack/slack-ar21.svg" },
    { name: "Twilio", logo: "https://www.vectorlogo.zone/logos/twilio/twilio-ar21.svg" }
  ];

  // Row 2: 25 logos scrolling right
  const row2Companies = [
    { name: "Netlify", logo: "https://www.vectorlogo.zone/logos/netlify/netlify-ar21.svg" },
    { name: "DigitalOcean", logo: "https://www.vectorlogo.zone/logos/digitalocean/digitalocean-ar21.svg" },
    { name: "Kubernetes", logo: "https://www.vectorlogo.zone/logos/kubernetes/kubernetes-ar21.svg" },
    { name: "Terraform", logo: "https://www.vectorlogo.zone/logos/terraformio/terraformio-ar21.svg" },
    { name: "Supabase", logo: "https://www.vectorlogo.zone/logos/supabase/supabase-ar21.svg" },
    { name: "MySQL", logo: "https://www.vectorlogo.zone/logos/mysql/mysql-ar21.svg" },
    { name: "PlanetScale", logo: "https://www.vectorlogo.zone/logos/planetscale/planetscale-ar21.svg" },
    { name: "CockroachDB", logo: "https://www.vectorlogo.zone/logos/cockroachlabs/cockroachlabs-ar21.svg" },
    { name: "SendGrid", logo: "https://www.vectorlogo.zone/logos/sendgrid/sendgrid-ar21.svg" },
    { name: "Cohere", logo: "https://www.vectorlogo.zone/logos/cohere/cohere-ar21.svg" },
    { name: "New Relic", logo: "https://www.vectorlogo.zone/logos/newrelic/newrelic-ar21.svg" },
    { name: "Grafana", logo: "https://www.vectorlogo.zone/logos/grafana/grafana-ar21.svg" },
    { name: "Jenkins", logo: "https://www.vectorlogo.zone/logos/jenkins/jenkins-ar21.svg" },
    { name: "Sentry", logo: "https://sentry-brand.storage.googleapis.com/sentry-logo-black.svg" },
    { name: "Auth0", logo: "https://www.vectorlogo.zone/logos/auth0/auth0-ar21.svg" },
    { name: "Palo Alto", logo: "https://www.vectorlogo.zone/logos/paloaltonetworks/paloaltonetworks-ar21.svg" },
    { name: "HashiCorp", logo: "https://www.vectorlogo.zone/logos/hashicorp/hashicorp-ar21.svg" },
    { name: "Square", logo: "https://www.vectorlogo.zone/logos/squareup/squareup-ar21.svg" },
    { name: "Braintree", logo: "https://www.vectorlogo.zone/logos/braintreepayments/braintreepayments-ar21.svg" },
    { name: "SAP", logo: "https://www.vectorlogo.zone/logos/sap/sap-ar21.svg" },
    { name: "IBM", logo: "https://www.vectorlogo.zone/logos/ibm/ibm-ar21.svg" },
    { name: "Postman", logo: "https://www.vectorlogo.zone/logos/getpostman/getpostman-ar21.svg" },
    { name: "Atlassian", logo: "https://www.vectorlogo.zone/logos/atlassian/atlassian-ar21.svg" },
    { name: "Segment", logo: "https://www.vectorlogo.zone/logos/segment/segment-ar21.svg" },
    { name: "Figma", logo: "https://www.vectorlogo.zone/logos/figma/figma-ar21.svg" }
  ];

  return (
    <div className="overflow-hidden py-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
          Integrated with <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">World-Class Technologies</span>
        </h2>
        <p className="text-lg text-gray-400">Built on the world's most reliable and secure infrastructure.</p>
      </div>

      {/* Row 1 - Scrolls Left */}
      <div className="relative mb-8 marquee-container">
        <div className="flex animate-marquee-left gap-8">
          {[...row1Companies, ...row1Companies].map((company, idx) => (
            <div key={idx} className="flex-shrink-0 logo-wrapper">
              <img 
                src={company.logo} 
                alt={company.name}
                className="h-12 w-auto object-contain tech-logo"
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Row 2 - Scrolls Right */}
      <div className="relative marquee-container">
        <div className="flex animate-marquee-right gap-8">
          {[...row2Companies, ...row2Companies].map((company, idx) => (
            <div key={idx} className="flex-shrink-0 logo-wrapper">
              <img 
                src={company.logo} 
                alt={company.name}
                className="h-12 w-auto object-contain tech-logo"
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        @keyframes marquee-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
        
        .animate-marquee-left {
          animation: marquee-left 60s linear infinite;
          will-change: transform;
        }
        
        .animate-marquee-right {
          animation: marquee-right 60s linear infinite;
          will-change: transform;
        }
        
        .marquee-container:hover .animate-marquee-left,
        .marquee-container:hover .animate-marquee-right {
          animation-play-state: paused;
        }
        
        .tech-logo {
          filter: brightness(0) invert(1);
          transition: all 0.3s ease-in-out;
        }
        
        .logo-wrapper:hover .tech-logo {
          filter: brightness(1) invert(0);
          transform: scale(1.1);
          filter: drop-shadow(0 0 10px #00BFFF);
        }
      `}</style>
    </div>
  );
}