import React, { useMemo } from "react";

export default function TechnologyMarqueeEEE() {
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
    { name: "Claude", logo: "https://upload.wikimedia.org/wikipedia/commons/7/78/Anthropic_logo.svg" },
    { name: "Gemini", logo: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg" },
    { name: "Cisco", logo: "https://www.vectorlogo.zone/logos/cisco/cisco-ar21.svg" },
    { name: "Okta", logo: "https://www.vectorlogo.zone/logos/okta/okta-ar21.svg" },
    { name: "Datadog", logo: "https://www.vectorlogo.zone/logos/datadoghq/datadoghq-ar21.svg" },
    { name: "Grafana", logo: "https://www.vectorlogo.zone/logos/grafana/grafana-ar21.svg" },
    { name: "Sentry", logo: "https://www.vectorlogo.zone/logos/sentry/sentry-ar21.svg" },
    { name: "Netlify", logo: "https://www.vectorlogo.zone/logos/netlify/netlify-ar21.svg" },
    { name: "Firebase", logo: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Firebase_Logo.png" },
    { name: "Heroku", logo: "https://upload.wikimedia.org/wikipedia/commons/e/ec/Heroku_logo.svg" },
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
    { name: "Mailchimp", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Mailchimp_Logo.svg" },
    { name: "Postman", logo: "https://www.vectorlogo.zone/logos/getpostman/getpostman-ar21.svg" },
    { name: "Insomnia", logo: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Insomnia_Logo.svg" },
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
    { name: "Framer", logo: "https://upload.wikimedia.org/wikipedia/commons/5/59/Framer_Logo.svg" },
    { name: "Webflow", logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Webflow_Logo.svg" },
    { name: "WordPress", logo: "https://www.vectorlogo.zone/logos/wordpress/wordpress-ar21.svg" },
    { name: "Shopify", logo: "https://www.vectorlogo.zone/logos/shopify/shopify-ar21.svg" },
    { name: "Magento", logo: "https://www.vectorlogo.zone/logos/magento/magento-ar21.svg" },
    { name: "Replit", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Repl.it_logo.svg" },
    { name: "Greylock", logo: "https://upload.wikimedia.org/wikipedia/commons/4/40/Greylock_Partners_logo.svg" },
    { name: "Y Combinator", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Y_Combinator_logo.svg" },
    { name: "Sequoia", logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Sequoia_Capital_logo.svg" },
    { name: "Andreessen Horowitz", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Andreessen_Horowitz_logo.svg" },
    { name: "Accel", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Accel_logo.svg" },
    { name: "CyberArk", logo: "https://upload.wikimedia.org/wikipedia/commons/9/9f/CyberArk_Logo.svg" },
    { name: "Rapid7", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Rapid7_logo.svg" },
    { name: "Tenable", logo: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Tenable_logo.svg" },
    { name: "SentinelOne", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e3/SentinelOne_Logo.svg" },
    { name: "McAfee", logo: "https://upload.wikimedia.org/wikipedia/commons/0/00/McAfee_logo.svg" },
    { name: "Norton", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/NortonLifeLock_logo_initials.png" },
    { name: "Sophos", logo: "https://upload.wikimedia.org/wikipedia/commons/8/89/Sophos_logo.svg" },
    { name: "Duo Security", logo: "https://upload.wikimedia.org/wikipedia/commons/5/57/Duo_Security_logo.svg" },
    { name: "1Password", logo: "https://upload.wikimedia.org/wikipedia/commons/6/68/1Password_logo.svg" },
    { name: "Bitwarden", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Bitwarden_logo.svg" },
    { name: "Netflix", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
    { name: "Uber", logo: "https://upload.wikimedia.org/wikipedia/commons/5/58/Uber_logo_2018.svg" },
    { name: "Airbnb", logo: "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg" },
    { name: "Twitter", logo: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_of_Twitter.svg" },
    { name: "LinkedIn", logo: "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" },
    { name: "Reddit", logo: "https://upload.wikimedia.org/wikipedia/commons/5/58/Reddit_logo_new.svg" },
    { name: "TikTok", logo: "https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg" },
    { name: "Snapchat", logo: "https://upload.wikimedia.org/wikipedia/en/c/c4/Snapchat_logo.svg" },
    { name: "US Bank", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2d/US_Bank_logo_2020.svg" },
    { name: "Elavon", logo: "https://logo.clearbit.com/elavon.com" },
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
    { name: "HashiCorp", logo: "https://www.vectorlogo.zone/logos/hashicorp/hashicorp-ar21.svg" },
    { name: "VMware", logo: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Vmware.svg" },
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
    { name: "PagerDuty", logo: "https://www.vectorlogo.zone/logos/pagerduty/pagerduty-ar21.svg" },
    { name: "Perplexity", logo: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/perplexity-ai-icon.png" },
    { name: "Anthropic", logo: "https://upload.wikimedia.org/wikipedia/commons/7/78/Anthropic_logo.svg" },
    { name: "Cohere", logo: "https://www.vectorlogo.zone/logos/cohere/cohere-ar21.svg" },
    { name: "Varonis", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Varonis_logo.svg" },
    { name: "Ping Identity", logo: "https://upload.wikimedia.org/wikipedia/commons/7/73/Ping_Identity_logo.svg" },
    { name: "JumpCloud", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7f/JumpCloud_logo.svg" },
    { name: "Clover", logo: "https://logo.clearbit.com/clover.com" },
    { name: "Toast POS", logo: "https://logo.clearbit.com/toasttab.com" }
  ];

  const row3Logos = [
    { name: "Apple", logo: "https://www.vectorlogo.zone/logos/apple/apple-ar21.svg" },
    { name: "Microsoft", logo: "https://www.vectorlogo.zone/logos/microsoft/microsoft-ar21.svg" },
    { name: "Google", logo: "https://www.vectorlogo.zone/logos/google/google-ar21.svg" },
    { name: "Meta", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg" },
    { name: "Amazon", logo: "https://www.vectorlogo.zone/logos/amazon/amazon-ar21.svg" },
    { name: "Tesla", logo: "https://www.vectorlogo.zone/logos/tesla/tesla-ar21.svg" },
    { name: "SpaceX", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2e/SpaceX_logo_black.svg" },
    { name: "PayPal", logo: "https://www.vectorlogo.zone/logos/paypal/paypal-ar21.svg" },
    { name: "Visa", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" },
    { name: "Mastercard", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" },
    { name: "American Express", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" },
    { name: "Adyen", logo: "https://www.vectorlogo.zone/logos/adyen/adyen-ar21.svg" },
    { name: "Braintree", logo: "https://www.vectorlogo.zone/logos/braintreepayments/braintreepayments-ar21.svg" },
    { name: "Plaid", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Plaid_logo.svg" },
    { name: "Coinbase", logo: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Coinbase.svg" },
    { name: "Binance", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Binance_Logo.svg" },
    { name: "Ethereum", logo: "https://upload.wikimedia.org/wikipedia/commons/0/05/Ethereum_logo_2014.svg" },
    { name: "Bitcoin", logo: "https://upload.wikimedia.org/wikipedia/commons/4/46/Bitcoin.svg" },
    { name: "Dropbox", logo: "https://www.vectorlogo.zone/logos/dropbox/dropbox-ar21.svg" },
    { name: "Box", logo: "https://www.vectorlogo.zone/logos/box/box-ar21.svg" },
    { name: "Atlassian", logo: "https://www.vectorlogo.zone/logos/atlassian/atlassian-ar21.svg" },
    { name: "Notion", logo: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png" },
    { name: "Asana", logo: "https://www.vectorlogo.zone/logos/asana/asana-ar21.svg" },
    { name: "Monday.com", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f4/Monday_logo.svg" },
    { name: "Lyft", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Lyft_logo.svg" },
    { name: "DoorDash", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fd/DoorDash_Logo.svg" },
    { name: "Instacart", logo: "https://upload.wikimedia.org/wikipedia/commons/9/9f/Instacart_logo_and_wordmark.svg" },
    { name: "Robinhood", logo: "https://upload.wikimedia.org/wikipedia/commons/9/90/Robinhood_Markets_logo.svg" },
    { name: "Wells Fargo", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b3/Wells_Fargo_Bank.svg" },
    { name: "Chase", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e1/JPMorgan_Chase_Logo_2008.svg" },
    { name: "Bank of America", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f4/Bank_of_America_logo.svg" },
    { name: "Citibank", logo: "https://upload.wikimedia.org/wikipedia/commons/1/1b/Citi.svg" }
  ];

  // Categories for glow + pulse
  const categories = useMemo(() => {
    const AI = new Set(["OpenAI", "Claude", "Gemini", "Anthropic", "Hugging Face", "Perplexity", "Cohere", "NVIDIA"]);
    const FIN = new Set([
      "Stripe", "Square", "PayPal", "Visa", "Mastercard", "American Express", "Adyen", "Braintree", "Plaid", "Coinbase",
      "Binance", "Ethereum", "Bitcoin", "Robinhood", "Wells Fargo", "Chase", "Bank of America", "Citibank", "US Bank",
      "Elavon", "Clover", "Toast POS"
    ]);
    const SEC = new Set([
      "CrowdStrike", "Palo Alto", "Palo Alto Networks", "Fortinet", "Check Point", "Zscaler", "Okta", "Cisco",
      "CyberArk", "Rapid7", "Tenable", "SentinelOne", "McAfee", "Norton", "Sophos", "Duo Security", "Bitwarden", "1Password"
    ]);

    const pick = (name) => {
      if (AI.has(name)) return "ai";
      if (FIN.has(name)) return "fin";
      if (SEC.has(name)) return "sec";
      return "core";
    };

    return { pick };
  }, []);

  const repeat = (arr, times) => Array.from({ length: times }, () => arr).flat();

  const Logo = ({ company }) => {
    const cls = `logo-item glow-${categories.pick(company.name)}`;
    return (
      <div className={cls} title={company.name}>
        <img
          src={company.logo}
          alt={company.name}
          className="logo-img"
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // Show a text badge instead of disappearing (keeps "all companies" visible)
            const img = e.currentTarget;
            img.style.display = "none";
            const parent = img.parentElement;
            if (parent && !parent.querySelector(".logo-fallback")) {
              const span = document.createElement("span");
              span.className = "logo-fallback";
              span.textContent = company.name;
              parent.appendChild(span);
            }
          }}
        />
      </div>
    );
  };

  return (
    <section className="eee-wrap">
      {/* HEADER LINE */}
      <div className="eee-header">
        <h2 className="eee-title">Enterprise Engineering Excellence</h2>
        <p className="eee-desc">
          Engineered under the Triple-E Standard — enterprise best practices amplified and aligned with the same
          high-integrity benchmarks global platforms refuse to compromise on.
        </p>
        <div className="eee-pills">
          <span className="eee-pill e1">Enterprise</span>
          <span className="eee-dot">•</span>
          <span className="eee-pill e2">Engineering</span>
          <span className="eee-dot">•</span>
          <span className="eee-pill e3">Ecosystem</span>
        </div>
        <div className="eee-underline" />
      </div>

      {/* FULL WIDTH MARQUEE */}
      <div className="eee-fullbleed">
        {/* Row 1: Left */}
        <div className="marquee-container">
          <div className="marquee-track left" style={{ ["--speed"]: "140s" }}>
            {repeat(row1Logos, 4).map((c, i) => (
              <Logo company={c} key={`r1-${c.name}-${i}`} />
            ))}
          </div>
        </div>

        {/* Row 2: Right */}
        <div className="marquee-container">
          <div className="marquee-track right" style={{ ["--speed"]: "110s" }}>
            {repeat(row2Logos, 6).map((c, i) => (
              <Logo company={c} key={`r2-${c.name}-${i}`} />
            ))}
          </div>
        </div>

        {/* Row 3: Left */}
        <div className="marquee-container">
          <div className="marquee-track left" style={{ ["--speed"]: "120s" }}>
            {repeat(row3Logos, 6).map((c, i) => (
              <Logo company={c} key={`r3-${c.name}-${i}`} />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        /* ===== SECTION SCALE (NO CONTAINMENT) ===== */
        .eee-wrap{
          position:relative;
          width:100%;
          overflow:hidden;
          background:#000;
          padding: 7.5rem 0 6.5rem;
        }

        .eee-header{
          position:relative;
          z-index:2;
          text-align:center;
          padding: 0 1.5rem;
          margin-bottom: 3.75rem;
        }

        .eee-title{
          color:#fff;
          font-weight:900;
          letter-spacing:-0.02em;
          line-height:1.05;
          font-size: clamp(2.2rem, 3.6vw, 3.4rem);
          margin:0 0 1rem;
        }

        .eee-desc{
          color: rgba(255,255,255,0.78);
          font-size: clamp(1.05rem, 1.3vw, 1.25rem);
          max-width: 68rem;
          margin: 0 auto 1.75rem;
        }

        .eee-pills{
          display:flex;
          align-items:center;
          justify-content:center;
          gap: 1.1rem;
          flex-wrap:wrap;
          margin-bottom: 1.2rem;
        }

        .eee-pill{
          padding: 0.75rem 1.75rem;
          border-radius: 999px;
          font-size: 1.1rem;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(10px);
        }
        .eee-dot{ color: rgba(255,255,255,0.45); font-size: 1.8rem; transform: translateY(-2px); }

        .e1{ color:#60a5fa; box-shadow: 0 0 26px rgba(96,165,250,.65), inset 0 0 18px rgba(96,165,250,.25); }
        .e2{ color:#a78bfa; box-shadow: 0 0 26px rgba(167,139,250,.65), inset 0 0 18px rgba(167,139,250,.25); }
        .e3{ color:#34d399; box-shadow: 0 0 26px rgba(52,211,153,.65), inset 0 0 18px rgba(52,211,153,.25); }

        .eee-underline{
          width: 420px;
          max-width: 80vw;
          height: 3px;
          margin: 0 auto;
          background: linear-gradient(90deg, transparent, #60a5fa, #a78bfa, #34d399, transparent);
          box-shadow: 0 0 30px rgba(124,58,237,.85);
        }

        .eee-fullbleed{
          position:relative;
          width:100vw;
          left:50%;
          transform:translateX(-50%);
        }

        /* ===== MARQUEE LAYOUT ===== */
        .marquee-container{
          overflow:hidden;
          position:relative;
          padding: 0.9rem 0;
          mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
        }

        .marquee-track{
          display:flex;
          gap: 3.2rem;
          width: max-content;
          will-change: transform;
          animation: marquee-left var(--speed) linear infinite;
          padding: 1.2rem 0;
        }

        .marquee-track.right{
          animation-name: marquee-right;
        }

        @keyframes marquee-left{
          from{ transform: translateX(0); }
          to{ transform: translateX(-50%); }
        }
        @keyframes marquee-right{
          from{ transform: translateX(-50%); }
          to{ transform: translateX(0); }
        }

        /* pause on hover */
        .marquee-container:hover .marquee-track{
          animation-play-state: paused;
        }

        /* ===== LOGO TILE (BIGGER + SHARPER) ===== */
        .logo-item{
          width: 220px;
          height: 110px;
          display:flex;
          align-items:center;
          justify-content:center;
          position:relative;
          border-radius: 18px;
          transform: translateZ(0);
          transition: transform .35s cubic-bezier(.16,1,.3,1);
        }

        .logo-img{
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          image-rendering: auto;
          filter: brightness(0) invert(1) opacity(0.92);
          transition: filter .35s ease, transform .35s ease;
        }

        .logo-fallback{
          font-size: 0.95rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          color: rgba(255,255,255,0.9);
          padding: 0.55rem 0.85rem;
          border-radius: 999px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          text-transform: uppercase;
          text-align:center;
          max-width: 200px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .logo-item:hover{
          transform: translateY(-2px) scale(1.10);
          z-index: 10;
        }

        /* ===== CATEGORY GLOW RULES ===== */
        .glow-core:hover .logo-img{
          filter: brightness(1) invert(0) opacity(1)
            drop-shadow(0 0 22px rgba(99,102,241,0.9))
            drop-shadow(0 0 48px rgba(99,102,241,0.55));
        }

        /* AI: violet pulse */
        .glow-ai::after{
          content:"";
          position:absolute;
          inset:-6px;
          border-radius: 22px;
          opacity:0;
          pointer-events:none;
          box-shadow:
            0 0 18px rgba(167,139,250,0.75),
            0 0 44px rgba(167,139,250,0.45);
          transition: opacity .35s ease;
        }
        .glow-ai:hover::after{ opacity:1; animation: aiPulse 1.1s ease-in-out infinite; }
        .glow-ai:hover .logo-img{
          filter: brightness(1) invert(0) opacity(1)
            drop-shadow(0 0 20px rgba(167,139,250,0.95))
            drop-shadow(0 0 50px rgba(167,139,250,0.55));
        }
        @keyframes aiPulse{
          0%,100%{ transform: scale(1); opacity:.75; }
          50%{ transform: scale(1.03); opacity:1; }
        }

        /* Finance: gold glow */
        .glow-fin::after{
          content:"";
          position:absolute;
          inset:-6px;
          border-radius: 22px;
          opacity:0;
          pointer-events:none;
          box-shadow:
            0 0 18px rgba(245,158,11,0.8),
            0 0 44px rgba(245,158,11,0.45);
          transition: opacity .35s ease;
        }
        .glow-fin:hover::after{ opacity:1; }
        .glow-fin:hover .logo-img{
          filter: brightness(1) invert(0) opacity(1)
            drop-shadow(0 0 20px rgba(245,158,11,0.95))
            drop-shadow(0 0 52px rgba(245,158,11,0.55));
        }

        /* Security: red pulse */
        .glow-sec::after{
          content:"";
          position:absolute;
          inset:-6px;
          border-radius: 22px;
          opacity:0;
          pointer-events:none;
          box-shadow:
            0 0 18px rgba(239,68,68,0.75),
            0 0 44px rgba(239,68,68,0.45);
          transition: opacity .35s ease;
        }
        .glow-sec:hover::after{ opacity:1; animation: secPulse 0.95s ease-in-out infinite; }
        .glow-sec:hover .logo-img{
          filter: brightness(1) invert(0) opacity(1)
            drop-shadow(0 0 18px rgba(239,68,68,0.95))
            drop-shadow(0 0 48px rgba(239,68,68,0.55));
        }
        @keyframes secPulse{
          0%,100%{ transform: scale(1); opacity:.7; }
          50%{ transform: scale(1.02); opacity:1; }
        }
      `}</style>
    </section>
  );
}
import React, { useMemo } from "react";

export default function TechnologyMarqueeEEE() {

  /* =========================
     LOGO DATA (ALL COMPANIES)
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
    { name: "Stripe", logo: "https://logo.clearbit.com/stripe.com" },
    { name: "Square", logo: "https://logo.clearbit.com/squareup.com" },
    { name: "Cloudflare", logo: "https://www.vectorlogo.zone/logos/cloudflare/cloudflare-ar21.svg" },
    { name: "GitHub", logo: "https://www.vectorlogo.zone/logos/github/github-ar21.svg" },
    { name: "Base44", logo: "https://avatars.githubusercontent.com/u/145019558?s=200&v=4" }
  ];

  const row2Logos = [
    { name: "Salesforce", logo: "https://www.vectorlogo.zone/logos/salesforce/salesforce-ar21.svg" },
    { name: "Oracle", logo: "https://www.vectorlogo.zone/logos/oracle/oracle-ar21.svg" },
    { name: "SAP", logo: "https://www.vectorlogo.zone/logos/sap/sap-ar21.svg" },
    { name: "IBM", logo: "https://www.vectorlogo.zone/logos/ibm/ibm-ar21.svg" },
    { name: "ServiceNow", logo: "https://upload.wikimedia.org/wikipedia/commons/5/57/ServiceNow_logo.svg" },
    { name: "Snowflake", logo: "https://www.vectorlogo.zone/logos/snowflake/snowflake-ar21.svg" },
    { name: "Databricks", logo: "https://www.vectorlogo.zone/logos/databricks/databricks-ar21.svg" },
    { name: "Perplexity", logo: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/perplexity-ai-icon.png" },
    { name: "Anthropic", logo: "https://upload.wikimedia.org/wikipedia/commons/7/78/Anthropic_logo.svg" }
  ];

  const row3Logos = [
    { name: "Apple", logo: "https://www.vectorlogo.zone/logos/apple/apple-ar21.svg" },
    { name: "Microsoft", logo: "https://www.vectorlogo.zone/logos/microsoft/microsoft-ar21.svg" },
    { name: "Google", logo: "https://www.vectorlogo.zone/logos/google/google-ar21.svg" },
    { name: "Amazon", logo: "https://www.vectorlogo.zone/logos/amazon/amazon-ar21.svg" },
    { name: "Meta", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg" },
    { name: "Visa", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" },
    { name: "Mastercard", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" }
  ];

  /* =========================
     CATEGORY GLOW LOGIC
     ========================= */

  const categories = useMemo(() => {
    const AI = new Set(["OpenAI", "Anthropic", "Perplexity", "NVIDIA"]);
    const FIN = new Set(["Stripe", "Square", "Visa", "Mastercard"]);
    const pick = (name) => (AI.has(name) ? "ai" : FIN.has(name) ? "fin" : "core");
    return { pick };
  }, []);

  const repeat = (arr, n) => Array.from({ length: n }, () => arr).flat();

  /* =========================
     RENDER
     ========================= */

  return (
    <section className="eee-wrap">

      {/* === GLYPH HEADER === */}
      <div className="eee-glyph-wrap">
        <div className="eee-glyph">
          <span className="eee-g">E</span>
          <span className="eee-g">E</span>
          <span className="eee-g">E</span>
        </div>
        <h2 className="eee-title">Enterprise Engineering Excellence</h2>
        <p className="eee-sub">Triple-E Standard · Enterprise · Engineering · Ecosystem</p>
      </div>

      {/* === MARQUEE === */}
      <div className="eee-fullbleed">
        {[row1Logos, row2Logos, row3Logos].map((row, r) => (
          <div className="marquee-container" key={r}>
            <div className={`marquee-track ${r % 2 ? "right" : "left"}`}>
              {repeat(row, 5).map((c, i) => (
                <div key={`${c.name}-${i}`} className={`logo-item glow-${categories.pick(c.name)}`}>
                  <img src={c.logo} alt={c.name} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}

