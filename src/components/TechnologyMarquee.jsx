import React from "react";

export default function TechnologyMarquee() {
  // Row 1: 75 logos (main cybersecurity, cloud, AI ecosystem)
  const row1Logos = [
    { name: "AWS", logo: "https://www.vectorlogo.zone/logos/amazon_aws/amazon_aws-ar21.svg" },
    { name: "Google Cloud", logo: "https://www.vectorlogo.zone/logos/google_cloud/google_cloud-ar21.svg" },
    { name: "Microsoft Azure", logo: "https://www.vectorlogo.zone/logos/microsoft_azure/microsoft_azure-ar21.svg" },
    { name: "Vercel", logo: "https://www.vectorlogo.zone/logos/vercel/vercel-ar21.svg" },
    { name: "Docker", logo: "https://www.vectorlogo.zone/logos/docker/docker-ar21.svg" },
    { name: "PostgreSQL", logo: "https://www.vectorlogo.zone/logos/postgresql/postgresql-ar21.svg" },
    { name: "MongoDB", logo: "https://www.vectorlogo.zone/logos/mongodb/mongodb-ar21.svg" },
    { name: "Redis", logo: "https://www.vectorlogo.zone/logos/redis/redis-ar21.svg" },
    { name: "OpenAI", logo: "https://www.vectorlogo.zone/logos/openai/openai-ar21.svg" },
    { name: "NVIDIA", logo: "https://www.vectorlogo.zone/logos/nvidia/nvidia-ar21.svg" },
    { name: "Hugging Face", logo: "https://www.vectorlogo.zone/logos/huggingface/huggingface-ar21.svg" },
    { name: "GitHub", logo: "https://www.vectorlogo.zone/logos/github/github-ar21.svg" },
    { name: "Cloudflare", logo: "https://www.vectorlogo.zone/logos/cloudflare/cloudflare-ar21.svg" },
    { name: "Stripe", logo: "https://www.vectorlogo.zone/logos/stripe/stripe-ar21.svg" },
    { name: "Kubernetes", logo: "https://www.vectorlogo.zone/logos/kubernetes/kubernetes-ar21.svg" },
    { name: "Terraform", logo: "https://www.vectorlogo.zone/logos/terraformio/terraformio-ar21.svg" },
    { name: "Supabase", logo: "https://www.vectorlogo.zone/logos/supabase/supabase-ar21.svg" },
    { name: "React", logo: "https://www.vectorlogo.zone/logos/reactjs/reactjs-ar21.svg" },
    { name: "Node.js", logo: "https://www.vectorlogo.zone/logos/nodejs/nodejs-ar21.svg" },
    { name: "Python", logo: "https://www.vectorlogo.zone/logos/python/python-ar21.svg" },
    { name: "TypeScript", logo: "https://www.vectorlogo.zone/logos/typescriptlang/typescriptlang-ar21.svg" },
    { name: "Next.js", logo: "https://www.vectorlogo.zone/logos/nextjs/nextjs-ar21.svg" },
    { name: "TailwindCSS", logo: "https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-ar21.svg" },
    { name: "GraphQL", logo: "https://www.vectorlogo.zone/logos/graphql/graphql-ar21.svg" },
    { name: "Auth0", logo: "https://www.vectorlogo.zone/logos/auth0/auth0-ar21.svg" },
    { name: "CrowdStrike", logo: "https://upload.wikimedia.org/wikipedia/commons/3/3e/CrowdStrike_logo.svg" },
    { name: "Palo Alto", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Palo_Alto_Networks_logo.svg" },
    { name: "Fortinet", logo: "https://upload.wikimedia.org/wikipedia/commons/6/62/Fortinet_logo.svg" },
    { name: "Check Point", logo: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Check_Point_Logo.svg" },
    { name: "Zscaler", logo: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Zscaler_logo.svg" },
    { name: "Claude", logo: "https://upload.wikimedia.org/wikipedia/commons/7/78/Anthropic_logo.svg" },
    { name: "Gemini", logo: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg" },
    { name: "Cisco", logo: "https://www.vectorlogo.zone/logos/cisco/cisco-ar21.svg" },
    { name: "Okta", logo: "https://www.vectorlogo.zone/logos/okta/okta-ar21.svg" },
    { name: "Datadog", logo: "https://www.vectorlogo.zone/logos/datadoghq/datadoghq-ar21.svg" },
    { name: "Grafana", logo: "https://www.vectorlogo.zone/logos/grafana/grafana-ar21.svg" },
    { name: "Sentry", logo: "https://www.vectorlogo.zone/logos/sentry/sentry-ar21.svg" },
    { name: "Netlify", logo: "https://www.vectorlogo.zone/logos/netlify/netlify-ar21.svg" },
    { name: "Firebase", logo: "https://www.vectorlogo.zone/logos/firebase/firebase-ar21.svg" },
    { name: "Heroku", logo: "https://www.vectorlogo.zone/logos/heroku/heroku-ar21.svg" },
    { name: "DigitalOcean", logo: "https://www.vectorlogo.zone/logos/digitalocean/digitalocean-ar21.svg" },
    { name: "Ansible", logo: "https://www.vectorlogo.zone/logos/ansible/ansible-ar21.svg" },
    { name: "Jenkins", logo: "https://www.vectorlogo.zone/logos/jenkins/jenkins-ar21.svg" },
    { name: "CircleCI", logo: "https://www.vectorlogo.zone/logos/circleci/circleci-ar21.svg" },
    { name: "Travis CI", logo: "https://www.vectorlogo.zone/logos/travis-ci/travis-ci-ar21.svg" },
    { name: "GitLab", logo: "https://www.vectorlogo.zone/logos/gitlab/gitlab-ar21.svg" },
    { name: "Bitbucket", logo: "https://www.vectorlogo.zone/logos/bitbucket/bitbucket-ar21.svg" },
    { name: "Jira", logo: "https://www.vectorlogo.zone/logos/atlassian_jira/atlassian_jira-ar21.svg" },
    { name: "Confluence", logo: "https://www.vectorlogo.zone/logos/atlassian_confluence/atlassian_confluence-ar21.svg" },
    { name: "Slack", logo: "https://www.vectorlogo.zone/logos/slack/slack-ar21.svg" },
    { name: "Microsoft Teams", logo: "https://www.vectorlogo.zone/logos/microsoft_teams/microsoft_teams-ar21.svg" },
    { name: "Zoom", logo: "https://www.vectorlogo.zone/logos/zoom/zoom-ar21.svg" },
    { name: "Discord", logo: "https://www.vectorlogo.zone/logos/discordapp/discordapp-ar21.svg" },
    { name: "Twilio", logo: "https://www.vectorlogo.zone/logos/twilio/twilio-ar21.svg" },
    { name: "SendGrid", logo: "https://www.vectorlogo.zone/logos/sendgrid/sendgrid-ar21.svg" },
    { name: "Mailchimp", logo: "https://www.vectorlogo.zone/logos/mailchimp/mailchimp-ar21.svg" },
    { name: "Postman", logo: "https://www.vectorlogo.zone/logos/getpostman/getpostman-ar21.svg" },
    { name: "Insomnia", logo: "https://www.vectorlogo.zone/logos/insomnia/insomnia-ar21.svg" },
    { name: "Nginx", logo: "https://www.vectorlogo.zone/logos/nginx/nginx-ar21.svg" },
    { name: "Apache", logo: "https://www.vectorlogo.zone/logos/apache/apache-ar21.svg" },
    { name: "Linux", logo: "https://www.vectorlogo.zone/logos/linux/linux-ar21.svg" },
    { name: "Ubuntu", logo: "https://www.vectorlogo.zone/logos/ubuntu/ubuntu-ar21.svg" },
    { name: "Debian", logo: "https://www.vectorlogo.zone/logos/debian/debian-ar21.svg" },
    { name: "CentOS", logo: "https://www.vectorlogo.zone/logos/centos/centos-ar21.svg" },
    { name: "Fedora", logo: "https://www.vectorlogo.zone/logos/getfedora/getfedora-ar21.svg" },
    { name: "Vim", logo: "https://www.vectorlogo.zone/logos/vim/vim-ar21.svg" },
    { name: "VS Code", logo: "https://www.vectorlogo.zone/logos/visualstudio_code/visualstudio_code-ar21.svg" },
    { name: "Figma", logo: "https://www.vectorlogo.zone/logos/figma/figma-ar21.svg" },
    { name: "Sketch", logo: "https://www.vectorlogo.zone/logos/sketchapp/sketchapp-ar21.svg" },
    { name: "Adobe XD", logo: "https://www.vectorlogo.zone/logos/adobe/adobe-ar21.svg" },
    { name: "Framer", logo: "https://www.vectorlogo.zone/logos/framer/framer-ar21.svg" },
    { name: "Webflow", logo: "https://www.vectorlogo.zone/logos/webflow/webflow-ar21.svg" },
    { name: "WordPress", logo: "https://www.vectorlogo.zone/logos/wordpress/wordpress-ar21.svg" },
    { name: "Shopify", logo: "https://www.vectorlogo.zone/logos/shopify/shopify-ar21.svg" },
    { name: "Magento", logo: "https://www.vectorlogo.zone/logos/magento/magento-ar21.svg" }
  ];

  // Row 2: 25 logos (enterprise & security)
  const row2Logos = [
    { name: "Salesforce", logo: "https://www.vectorlogo.zone/logos/salesforce/salesforce-ar21.svg" },
    { name: "Oracle", logo: "https://www.vectorlogo.zone/logos/oracle/oracle-ar21.svg" },
    { name: "SAP", logo: "https://www.vectorlogo.zone/logos/sap/sap-ar21.svg" },
    { name: "IBM", logo: "https://www.vectorlogo.zone/logos/ibm/ibm-ar21.svg" },
    { name: "ServiceNow", logo: "https://upload.wikimedia.org/wikipedia/commons/5/57/ServiceNow_logo.svg" },
    { name: "Workday", logo: "https://www.vectorlogo.zone/logos/workday/workday-ar21.svg" },
    { name: "HashiCorp", logo: "https://www.vectorlogo.zone/logos/hashicorp/hashicorp-ar21.svg" },
    { name: "VMware", logo: "https://www.vectorlogo.zone/logos/vmware/vmware-ar21.svg" },
    { name: "Splunk", logo: "https://www.vectorlogo.zone/logos/splunk/splunk-ar21.svg" },
    { name: "Elastic", logo: "https://www.vectorlogo.zone/logos/elastic/elastic-ar21.svg" },
    { name: "New Relic", logo: "https://www.vectorlogo.zone/logos/newrelic/newrelic-ar21.svg" },
    { name: "Snyk", logo: "https://www.vectorlogo.zone/logos/snyk/snyk-ar21.svg" },
    { name: "Qualcomm", logo: "https://www.vectorlogo.zone/logos/qualcomm/qualcomm-ar21.svg" },
    { name: "Broadcom", logo: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Broadcom_Corporation_Logo.svg" },
    { name: "Intel", logo: "https://www.vectorlogo.zone/logos/intel/intel-ar21.svg" },
    { name: "AMD", logo: "https://www.vectorlogo.zone/logos/amd/amd-ar21.svg" },
    { name: "Snowflake", logo: "https://www.vectorlogo.zone/logos/snowflake/snowflake-ar21.svg" },
    { name: "Databricks", logo: "https://www.vectorlogo.zone/logos/databricks/databricks-ar21.svg" },
    { name: "Tableau", logo: "https://www.vectorlogo.zone/logos/tableau/tableau-ar21.svg" },
    { name: "Looker", logo: "https://www.vectorlogo.zone/logos/looker/looker-ar21.svg" },
    { name: "Segment", logo: "https://www.vectorlogo.zone/logos/segment/segment-ar21.svg" },
    { name: "Amplitude", logo: "https://www.vectorlogo.zone/logos/amplitude/amplitude-ar21.svg" },
    { name: "Mixpanel", logo: "https://www.vectorlogo.zone/logos/mixpanel/mixpanel-ar21.svg" },
    { name: "LaunchDarkly", logo: "https://www.vectorlogo.zone/logos/launchdarkly/launchdarkly-ar21.svg" },
    { name: "PagerDuty", logo: "https://www.vectorlogo.zone/logos/pagerduty/pagerduty-ar21.svg" }
  ];

  // Row 3: 25 logos (major tech & finance)
  const row3Logos = [
    { name: "Apple", logo: "https://www.vectorlogo.zone/logos/apple/apple-ar21.svg" },
    { name: "Microsoft", logo: "https://www.vectorlogo.zone/logos/microsoft/microsoft-ar21.svg" },
    { name: "Google", logo: "https://www.vectorlogo.zone/logos/google/google-ar21.svg" },
    { name: "Meta", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg" },
    { name: "Amazon", logo: "https://www.vectorlogo.zone/logos/amazon/amazon-ar21.svg" },
    { name: "Tesla", logo: "https://www.vectorlogo.zone/logos/tesla/tesla-ar21.svg" },
    { name: "SpaceX", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2e/SpaceX_logo_black.svg" },
    { name: "PayPal", logo: "https://www.vectorlogo.zone/logos/paypal/paypal-ar21.svg" },
    { name: "Visa", logo: "https://www.vectorlogo.zone/logos/visa/visa-ar21.svg" },
    { name: "Mastercard", logo: "https://www.vectorlogo.zone/logos/mastercard/mastercard-ar21.svg" },
    { name: "American Express", logo: "https://www.vectorlogo.zone/logos/americanexpress/americanexpress-ar21.svg" },
    { name: "Square", logo: "https://www.vectorlogo.zone/logos/squareup/squareup-ar21.svg" },
    { name: "Adyen", logo: "https://www.vectorlogo.zone/logos/adyen/adyen-ar21.svg" },
    { name: "Braintree", logo: "https://www.vectorlogo.zone/logos/braintreepayments/braintreepayments-ar21.svg" },
    { name: "Plaid", logo: "https://www.vectorlogo.zone/logos/plaid/plaid-ar21.svg" },
    { name: "Coinbase", logo: "https://www.vectorlogo.zone/logos/coinbase/coinbase-ar21.svg" },
    { name: "Binance", logo: "https://www.vectorlogo.zone/logos/binance/binance-ar21.svg" },
    { name: "Ethereum", logo: "https://www.vectorlogo.zone/logos/ethereum/ethereum-ar21.svg" },
    { name: "Bitcoin", logo: "https://www.vectorlogo.zone/logos/bitcoin/bitcoin-ar21.svg" },
    { name: "Dropbox", logo: "https://www.vectorlogo.zone/logos/dropbox/dropbox-ar21.svg" },
    { name: "Box", logo: "https://www.vectorlogo.zone/logos/box/box-ar21.svg" },
    { name: "Atlassian", logo: "https://www.vectorlogo.zone/logos/atlassian/atlassian-ar21.svg" },
    { name: "Notion", logo: "https://www.vectorlogo.zone/logos/notionhq/notionhq-ar21.svg" },
    { name: "Asana", logo: "https://www.vectorlogo.zone/logos/asana/asana-ar21.svg" },
    { name: "Monday.com", logo: "https://www.vectorlogo.zone/logos/monday/monday-ar21.svg" }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
          Integrated <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">Technology Stack</span>
        </h2>
        <p className="text-xl text-white/70 max-w-3xl mx-auto">
          Built on industry-leading platforms and frameworks
        </p>
      </div>

      <div className="space-y-1 relative overflow-hidden">
        {/* Row 1: 75 logos - scroll left fast */}
        <div className="marquee-container">
          <div className="marquee-content marquee-row-1">
            {[...row1Logos, ...row1Logos].map((company, idx) => (
              <div key={idx} className="logo-item">
                <img 
                  src={company.logo} 
                  alt={company.name}
                  className="logo-img"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: 25 logos - scroll right medium */}
        <div className="marquee-container">
          <div className="marquee-content marquee-row-2">
            {[...row2Logos, ...row2Logos, ...row2Logos, ...row2Logos].map((company, idx) => (
              <div key={idx} className="logo-item">
                <img 
                  src={company.logo} 
                  alt={company.name}
                  className="logo-img"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Row 3: 25 logos - scroll left slow */}
        <div className="marquee-container">
          <div className="marquee-content marquee-row-3">
            {[...row3Logos, ...row3Logos, ...row3Logos, ...row3Logos].map((company, idx) => (
              <div key={idx} className="logo-item">
                <img 
                  src={company.logo} 
                  alt={company.name}
                  className="logo-img"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .marquee-container {
          overflow: hidden;
          position: relative;
          width: 100%;
          padding: 0.75rem 0;
          mask-image: linear-gradient(
            to right,
            transparent,
            black 10%,
            black 90%,
            transparent
          );
          -webkit-mask-image: linear-gradient(
            to right,
            transparent,
            black 10%,
            black 90%,
            transparent
          );
        }

        .marquee-content {
          display: flex;
          gap: 2.5rem;
          will-change: transform;
        }

        /* Row 1: Fast scroll left (75 items) */
        .marquee-row-1 {
          animation: marquee-left 45s linear infinite;
        }

        /* Row 2: Medium scroll right (25 items) */
        .marquee-row-2 {
          animation: marquee-right 35s linear infinite;
        }

        /* Row 3: Slow scroll left (25 items) */
        .marquee-row-3 {
          animation: marquee-left 40s linear infinite;
        }

        .marquee-container:hover .marquee-content {
          animation-play-state: paused;
        }

        .logo-item {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 120px;
          height: 60px;
          padding: 0.5rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .logo-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          filter: brightness(0) invert(1) opacity(0.7);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .logo-item:hover {
          transform: scale(1.15) translateY(-2px);
          z-index: 10;
        }

        .logo-item:hover .logo-img {
          filter: brightness(1) invert(0) opacity(1);
          drop-shadow: 0 0 20px rgba(0, 228, 255, 0.6));
        }

        /* Combination lock effect: alternating directions at different speeds */
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

        /* Add slight vertical offset for combination lock effect */
        .marquee-container:nth-child(1) {
          transform: translateY(-2px);
        }

        .marquee-container:nth-child(2) {
          transform: translateY(2px);
        }

        .marquee-container:nth-child(3) {
          transform: translateY(-2px);
        }

        /* Add subtle scan line effect */
        @keyframes scan {
          0%, 100% {
            opacity: 0;
          }
          50% {
            opacity: 0.3;
          }
        }

        .marquee-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(0, 228, 255, 0.1),
            transparent
          );
          animation: scan 4s linear infinite;
        }
      `}</style>
    </div>
  );
}