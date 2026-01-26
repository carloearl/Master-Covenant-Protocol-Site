import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const TECH_LOGOS = [
  // Cloud & Infrastructure
  { name: "AWS", logo: "https://www.vectorlogo.zone/logos/amazon_aws/amazon_aws-ar21.svg" },
  { name: "Google Cloud", logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg" },
  { name: "Microsoft Azure", logo: "https://www.vectorlogo.zone/logos/microsoft_azure/microsoft_azure-ar21.svg" },
  { name: "DigitalOcean", logo: "https://www.vectorlogo.zone/logos/digitalocean/digitalocean-ar21.svg" },
  { name: "Heroku", logo: "https://www.vectorlogo.zone/logos/heroku/heroku-ar21.svg" },
  { name: "Vercel", logo: "https://www.vectorlogo.zone/logos/vercel/vercel-ar21.svg" },
  { name: "Netlify", logo: "https://www.vectorlogo.zone/logos/netlify/netlify-ar21.svg" },
  
  // AI & ML
  { name: "OpenAI", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg" },
  { name: "Anthropic", logo: "https://www.vectorlogo.zone/logos/anthropic_ai/anthropic_ai-ar21.svg" },
  { name: "Google AI", logo: "https://www.vectorlogo.zone/logos/google/google-ar21.svg" },
  { name: "Hugging Face", logo: "https://www.vectorlogo.zone/logos/huggingface/huggingface-ar21.svg" },
  
  // Payments & Commerce
  { name: "Stripe", logo: "https://logo.clearbit.com/stripe.com" },
  { name: "PayPal", logo: "https://www.vectorlogo.zone/logos/paypal/paypal-ar21.svg" },
  { name: "Square", logo: "https://www.vectorlogo.zone/logos/square/square-ar21.svg" },
  
  // Development & Version Control
  { name: "GitHub", logo: "https://www.vectorlogo.zone/logos/github/github-ar21.svg" },
  { name: "GitLab", logo: "https://www.vectorlogo.zone/logos/gitlab/gitlab-ar21.svg" },
  { name: "Bitbucket", logo: "https://www.vectorlogo.zone/logos/bitbucket/bitbucket-ar21.svg" },
  { name: "Git", logo: "https://www.vectorlogo.zone/logos/git/git-ar21.svg" },
  
  // Containerization & Orchestration
  { name: "Docker", logo: "https://www.vectorlogo.zone/logos/docker/docker-ar21.svg" },
  { name: "Kubernetes", logo: "https://www.vectorlogo.zone/logos/kubernetes/kubernetes-ar21.svg" },
  { name: "Podman", logo: "https://www.vectorlogo.zone/logos/podman_io/podman_io-ar21.svg" },
  
  // Frontend Frameworks
  { name: "React", logo: "https://www.vectorlogo.zone/logos/reactjs/reactjs-ar21.svg" },
  { name: "Vue", logo: "https://www.vectorlogo.zone/logos/vuejs/vuejs-ar21.svg" },
  { name: "Angular", logo: "https://www.vectorlogo.zone/logos/angular/angular-ar21.svg" },
  { name: "Next.js", logo: "https://www.vectorlogo.zone/logos/nextjs/nextjs-ar21.svg" },
  { name: "Svelte", logo: "https://www.vectorlogo.zone/logos/sveltejs/sveltejs-ar21.svg" },
  
  // Backend & Runtime
  { name: "Node.js", logo: "https://www.vectorlogo.zone/logos/nodejs/nodejs-ar21.svg" },
  { name: "Python", logo: "https://www.vectorlogo.zone/logos/python/python-ar21.svg" },
  { name: "Go", logo: "https://www.vectorlogo.zone/logos/golang/golang-ar21.svg" },
  { name: "Rust", logo: "https://www.vectorlogo.zone/logos/rust/rust-ar21.svg" },
  { name: "Java", logo: "https://www.vectorlogo.zone/logos/java/java-ar21.svg" },
  { name: "Deno", logo: "https://www.vectorlogo.zone/logos/deno_land/deno_land-ar21.svg" },
  
  // Databases
  { name: "MongoDB", logo: "https://www.vectorlogo.zone/logos/mongodb/mongodb-ar21.svg" },
  { name: "PostgreSQL", logo: "https://www.vectorlogo.zone/logos/postgresql/postgresql-ar21.svg" },
  { name: "MySQL", logo: "https://www.vectorlogo.zone/logos/mysql/mysql-ar21.svg" },
  { name: "Redis", logo: "https://www.vectorlogo.zone/logos/redis/redis-ar21.svg" },
  { name: "Firebase", logo: "https://www.vectorlogo.zone/logos/firebase/firebase-ar21.svg" },
  { name: "Supabase", logo: "https://www.vectorlogo.zone/logos/supabase/supabase-ar21.svg" },
  { name: "Elastic", logo: "https://www.vectorlogo.zone/logos/elastic/elastic-ar21.svg" },
  
  // API & Integration
  { name: "GraphQL", logo: "https://www.vectorlogo.zone/logos/graphql/graphql-ar21.svg" },
  { name: "Postman", logo: "https://www.vectorlogo.zone/logos/getpostman/getpostman-ar21.svg" },
  { name: "Zapier", logo: "https://www.vectorlogo.zone/logos/zapier/zapier-ar21.svg" },
  { name: "IFTTT", logo: "https://www.vectorlogo.zone/logos/ifttt/ifttt-ar21.svg" },
  
  // Testing & Quality
  { name: "Jest", logo: "https://www.vectorlogo.zone/logos/jest/jest-ar21.svg" },
  { name: "Cypress", logo: "https://www.vectorlogo.zone/logos/cypress/cypress-ar21.svg" },
  { name: "Selenium", logo: "https://www.vectorlogo.zone/logos/seleniumhq/seleniumhq-ar21.svg" },
  
  // DevOps & CI/CD
  { name: "Jenkins", logo: "https://www.vectorlogo.zone/logos/jenkins/jenkins-ar21.svg" },
  { name: "GitHub Actions", logo: "https://www.vectorlogo.zone/logos/github/github-ar21.svg" },
  { name: "GitLab CI", logo: "https://www.vectorlogo.zone/logos/gitlab/gitlab-ar21.svg" },
  { name: "CircleCI", logo: "https://www.vectorlogo.zone/logos/circleci/circleci-ar21.svg" },
  { name: "Travis CI", logo: "https://www.vectorlogo.zone/logos/travis-ci/travis-ci-ar21.svg" },
  
  // Monitoring & Logging
  { name: "Datadog", logo: "https://www.vectorlogo.zone/logos/datadoghq/datadoghq-ar21.svg" },
  { name: "New Relic", logo: "https://www.vectorlogo.zone/logos/newrelic/newrelic-ar21.svg" },
  { name: "Sentry", logo: "https://www.vectorlogo.zone/logos/sentry/sentry-ar21.svg" },
  
  // Documentation & CMS
  { name: "Notion", logo: "https://www.vectorlogo.zone/logos/notion/notion-ar21.svg" },
  { name: "Markdown", logo: "https://www.vectorlogo.zone/logos/markdown/markdown-ar21.svg" },
  { name: "Confluence", logo: "https://www.vectorlogo.zone/logos/atlassian/atlassian-ar21.svg" },
  
  // Communication
  { name: "Slack", logo: "https://www.vectorlogo.zone/logos/slack/slack-ar21.svg" },
  { name: "Discord", logo: "https://www.vectorlogo.zone/logos/discordapp/discordapp-ar21.svg" },
  { name: "Telegram", logo: "https://www.vectorlogo.zone/logos/telegram/telegram-ar21.svg" },
  
  // Analytics
  { name: "Google Analytics", logo: "https://www.vectorlogo.zone/logos/google_analytics/google_analytics-ar21.svg" },
  { name: "Mixpanel", logo: "https://www.vectorlogo.zone/logos/mixpanel/mixpanel-ar21.svg" },
  
  // Styling & Design
  { name: "Tailwind CSS", logo: "https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-ar21.svg" },
  { name: "Figma", logo: "https://www.vectorlogo.zone/logos/figma/figma-ar21.svg" },
  { name: "Adobe XD", logo: "https://www.vectorlogo.zone/logos/adobe/adobe-ar21.svg" },
  
  // Base44 & Custom
  { name: "Base44", logo: "https://avatars.githubusercontent.com/u/145019558?s=200&v=4" }
];

export default function TechMarquee({ title, subtitle, logos = TECH_LOGOS }) {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });
  
  // Create 3 rows with different subsets and speeds
  const row1 = [...logos, ...logos, ...logos];
  const row2 = [...logos.slice(3), ...logos.slice(0, 3), ...logos.slice(3), ...logos.slice(0, 3), ...logos.slice(3), ...logos.slice(0, 3)];
  const row3 = [...logos.slice(5), ...logos.slice(0, 5), ...logos.slice(5), ...logos.slice(0, 5), ...logos.slice(5), ...logos.slice(0, 5)];

  return (
    <div ref={containerRef} className="w-full max-w-7xl mx-auto px-4 py-16">
      {title && (
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, x: -80 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-2xl md:text-3xl font-bold text-white mb-4"
          >
            {title}
          </motion.h2>
          {subtitle && (
            <motion.p 
              initial={{ opacity: 0, x: 80 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg text-white/90 max-w-4xl mx-auto"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 0.35 }}
        className="tech-marquee-wrapper"
      >
        {/* Row 1 - Fast Left */}
        <div className="marquee-row">
          <div className="marquee-track marquee-fast-left">
            {row1.map((company, idx) => (
              <div key={`row1-${company.name}-${idx}`} className="logo-card">
                <img 
                  src={company.logo} 
                  alt={company.name}
                  className="logo-image"
                  loading="lazy"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 - Medium Right */}
        <div className="marquee-row">
          <div className="marquee-track marquee-medium-right">
            {row2.map((company, idx) => (
              <div key={`row2-${company.name}-${idx}`} className="logo-card">
                <img 
                  src={company.logo} 
                  alt={company.name}
                  className="logo-image"
                  loading="lazy"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Row 3 - Fast Left */}
        <div className="marquee-row">
          <div className="marquee-track marquee-turbo-left">
            {row3.map((company, idx) => (
              <div key={`row3-${company.name}-${idx}`} className="logo-card">
                <img 
                  src={company.logo} 
                  alt={company.name}
                  className="logo-image"
                  loading="lazy"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <style>{`
        .tech-marquee-wrapper {
          position: relative;
          overflow: hidden;
          padding: 1rem 0;
          background: linear-gradient(to bottom, transparent, rgba(87,61,255,0.05), transparent);
        }
        
        .marquee-row {
          overflow: hidden;
          position: relative;
          margin: 1rem 0;
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
        
        .marquee-track {
          display: flex;
          gap: 3rem;
          width: max-content;
          will-change: transform;
        }
        
        .marquee-fast-left {
          animation: scroll-left 40s linear infinite;
        }
        
        .marquee-medium-right {
          animation: scroll-right 50s linear infinite;
        }
        
        .marquee-turbo-left {
          animation: scroll-left 35s linear infinite;
        }
        
        .marquee-row:hover .marquee-track {
          animation-play-state: paused;
        }
        
        .logo-card {
          flex-shrink: 0;
          width: 140px;
          height: 70px;
          padding: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          backdrop-filter: blur(8px);
        }
        
        .logo-card:hover {
          transform: scale(1.15) translateY(-5px);
          background: rgba(87,61,255,0.15);
          border-color: rgba(87,61,255,0.4);
          box-shadow: 0 8px 32px rgba(87,61,255,0.3);
        }
        
        .logo-image {
          max-width: 100%;
          max-height: 100%;
          width: auto;
          height: auto;
          object-fit: contain;
          filter: brightness(0) invert(1) opacity(0.65);
          transition: all 0.4s;
          background: rgba(87, 61, 255, 0.1);
          border-radius: 8px;
          padding: 0.5rem;
        }
        
        .logo-card:hover .logo-image {
          filter: brightness(1) invert(0) opacity(1);
        }
        
        .logo-image:not([src]), .logo-image[src=""] {
          background: linear-gradient(135deg, rgba(87, 61, 255, 0.15), rgba(168, 85, 247, 0.1));
          min-width: 80px;
          min-height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(168, 85, 247, 0.3);
          font-size: 0.75rem;
          font-weight: 600;
        }
        
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        
        @keyframes scroll-right {
          0% { transform: translateX(-33.333%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}