import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { createPageUrl } from "@/utils";

const ENGINEERING_LOGOS = [
  { name: "Vercel", logo: "https://www.vectorlogo.zone/logos/vercel/vercel-ar21.svg" },
  { name: "Supabase", logo: "https://www.vectorlogo.zone/logos/supabase/supabase-ar21.svg" },
  { name: "Replit", logo: "https://logo.clearbit.com/replit.com" },
  { name: "Base44", logo: "https://avatars.githubusercontent.com/u/145019558?s=200&v=4" },
  { name: "Twilio", logo: "https://www.vectorlogo.zone/logos/twilio/twilio-ar21.svg" },
  { name: "SendGrid", logo: "https://www.vectorlogo.zone/logos/sendgrid/sendgrid-ar21.svg" },
  { name: "Hugging Face", logo: "https://www.vectorlogo.zone/logos/huggingface/huggingface-ar21.svg" },
  { name: "Render", logo: "https://logo.clearbit.com/render.com" },
  { name: "Railway", logo: "https://railway.app/brand/logo-light.svg" },
  { name: "Fly.io", logo: "https://fly.io/static/images/brand/logo.svg" },
  { name: "Netlify", logo: "https://www.vectorlogo.zone/logos/netlify/netlify-ar21.svg" },
  { name: "AWS", logo: "https://www.vectorlogo.zone/logos/amazon_aws/amazon_aws-ar21.svg" },
  { name: "Azure", logo: "https://www.vectorlogo.zone/logos/microsoft_azure/microsoft_azure-ar21.svg" },
  { name: "Google Cloud", logo: "https://www.vectorlogo.zone/logos/google_cloud/google_cloud-ar21.svg" },
  { name: "IBM Cloud", logo: "https://www.vectorlogo.zone/logos/ibm_cloud/ibm_cloud-ar21.svg" },
  { name: "Oracle", logo: "https://www.vectorlogo.zone/logos/oracle/oracle-ar21.svg" },
  { name: "Snowflake", logo: "https://logo.clearbit.com/snowflake.com" },
  { name: "Databricks", logo: "https://logo.clearbit.com/databricks.com" },
  { name: "NVIDIA", logo: "https://www.vectorlogo.zone/logos/nvidia/nvidia-ar21.svg" },
  { name: "Intel", logo: "https://www.vectorlogo.zone/logos/intel/intel-ar21.svg" },
  { name: "AMD", logo: "https://logo.clearbit.com/amd.com" },
  { name: "OpenAI", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg" },
  { name: "MongoDB", logo: "https://www.vectorlogo.zone/logos/mongodb/mongodb-ar21.svg" },
  { name: "Elastic", logo: "https://www.vectorlogo.zone/logos/elastic/elastic-ar21.svg" },
  { name: "HashiCorp", logo: "https://www.vectorlogo.zone/logos/hashicorp/hashicorp-ar21.svg" },
  { name: "Docker", logo: "https://www.vectorlogo.zone/logos/docker/docker-ar21.svg" },
  { name: "Kubernetes", logo: "https://www.vectorlogo.zone/logos/kubernetes/kubernetes-ar21.svg" },
  { name: "JetBrains", logo: "https://www.vectorlogo.zone/logos/jetbrains/jetbrains-ar21.svg" },
  { name: "Postman", logo: "https://www.vectorlogo.zone/logos/getpostman/getpostman-ar21.svg" },
  { name: "Sentry", logo: "https://www.vectorlogo.zone/logos/sentry/sentry-ar21.svg" },
  { name: "New Relic", logo: "https://www.vectorlogo.zone/logos/newrelic/newrelic-ar21.svg" },
  { name: "Datadog", logo: "https://www.vectorlogo.zone/logos/datadoghq/datadoghq-ar21.svg" },
  { name: "GitHub", logo: "https://www.vectorlogo.zone/logos/github/github-ar21.svg" },
  { name: "GitLab", logo: "https://www.vectorlogo.zone/logos/gitlab/gitlab-ar21.svg" },
  { name: "Atlassian", logo: "https://www.vectorlogo.zone/logos/atlassian/atlassian-ar21.svg" },
  { name: "Slack", logo: "https://www.vectorlogo.zone/logos/slack/slack-ar21.svg" },
  { name: "Figma", logo: "https://www.vectorlogo.zone/logos/figma/figma-ar21.svg" },
  { name: "Notion", logo: "https://www.vectorlogo.zone/logos/notion/notion-ar21.svg" },
  { name: "Airtable", logo: "https://logo.clearbit.com/airtable.com" },
  { name: "Linear", logo: "https://logo.clearbit.com/linear.app" },
  { name: "Retool", logo: "https://logo.clearbit.com/retool.com" },
  { name: "Webflow", logo: "https://www.vectorlogo.zone/logos/webflow/webflow-ar21.svg" },
  { name: "Framer", logo: "https://logo.clearbit.com/framer.com" },
  { name: "Zapier", logo: "https://www.vectorlogo.zone/logos/zapier/zapier-ar21.svg" },
  { name: "Shopify", logo: "https://www.vectorlogo.zone/logos/shopify/shopify-ar21.svg" },
  { name: "Wix", logo: "https://www.vectorlogo.zone/logos/wix/wix-ar21.svg" },
  { name: "Squarespace", logo: "https://logo.clearbit.com/squarespace.com" },
  { name: "Stripe", logo: "https://www.vectorlogo.zone/logos/stripe/stripe-ar21.svg" },
  { name: "DigitalOcean", logo: "https://www.vectorlogo.zone/logos/digitalocean/digitalocean-ar21.svg" },
  { name: "React", logo: "https://www.vectorlogo.zone/logos/reactjs/reactjs-ar21.svg" },
  { name: "Node.js", logo: "https://www.vectorlogo.zone/logos/nodejs/nodejs-ar21.svg" },
  { name: "Python", logo: "https://www.vectorlogo.zone/logos/python/python-ar21.svg" },
  { name: "Go", logo: "https://www.vectorlogo.zone/logos/golang/golang-ar21.svg" },
  { name: "Rust", logo: "https://www.vectorlogo.zone/logos/rust-lang/rust-lang-ar21.svg" }
];

const SECURITY_LOGOS = [
  { name: "CrowdStrike", logo: "https://logo.clearbit.com/crowdstrike.com" },
  { name: "Palo Alto", logo: "https://logo.clearbit.com/paloaltonetworks.com" },
  { name: "Okta", logo: "https://www.vectorlogo.zone/logos/okta/okta-ar21.svg" },
  { name: "Zscaler", logo: "https://logo.clearbit.com/zscaler.com" },
  { name: "Fortinet", logo: "https://logo.clearbit.com/fortinet.com" },
  { name: "CyberArk", logo: "https://logo.clearbit.com/cyberark.com" },
  { name: "Proofpoint", logo: "https://logo.clearbit.com/proofpoint.com" },
  { name: "Darktrace", logo: "https://logo.clearbit.com/darktrace.com" },
  { name: "Rapid7", logo: "https://logo.clearbit.com/rapid7.com" },
  { name: "Tenable", logo: "https://logo.clearbit.com/tenable.com" },
  { name: "Duo Security", logo: "https://logo.clearbit.com/duo.com" },
  { name: "Ping Identity", logo: "https://logo.clearbit.com/pingidentity.com" },
  { name: "Check Point", logo: "https://logo.clearbit.com/checkpoint.com" },
  { name: "Trend Micro", logo: "https://logo.clearbit.com/trendmicro.com" },
  { name: "Sophos", logo: "https://logo.clearbit.com/sophos.com" },
  { name: "McAfee", logo: "https://logo.clearbit.com/mcafee.com" },
  { name: "Splunk", logo: "https://www.vectorlogo.zone/logos/splunk/splunk-ar21.svg" },
  { name: "Imperva", logo: "https://logo.clearbit.com/imperva.com" },
  { name: "Veracode", logo: "https://logo.clearbit.com/veracode.com" },
  { name: "Auth0", logo: "https://www.vectorlogo.zone/logos/auth0/auth0-ar21.svg" },
  { name: "Yubico", logo: "https://logo.clearbit.com/yubico.com" },
  { name: "Snyk", logo: "https://www.vectorlogo.zone/logos/snyk/snyk-ar21.svg" },
  { name: "Wiz", logo: "https://logo.clearbit.com/wiz.io" },
  { name: "Plaid", logo: "https://logo.clearbit.com/plaid.com" },
  { name: "PayPal", logo: "https://www.vectorlogo.zone/logos/paypal/paypal-ar21.svg" },
  { name: "Square", logo: "https://www.vectorlogo.zone/logos/square/square-ar21.svg" },
  { name: "Visa", logo: "https://www.vectorlogo.zone/logos/visa/visa-ar21.svg" },
  { name: "Mastercard", logo: "https://www.vectorlogo.zone/logos/mastercard/mastercard-ar21.svg" },
  { name: "Amex", logo: "https://logo.clearbit.com/americanexpress.com" },
  { name: "Discover", logo: "https://logo.clearbit.com/discover.com" }
];

const REALWORLD_LOGOS = [
  { name: "JPMorgan", logo: "https://logo.clearbit.com/jpmorganchase.com" },
  { name: "Bank of America", logo: "https://logo.clearbit.com/bankofamerica.com" },
  { name: "Wells Fargo", logo: "https://logo.clearbit.com/wellsfargo.com" },
  { name: "Citigroup", logo: "https://logo.clearbit.com/citi.com" },
  { name: "Goldman Sachs", logo: "https://logo.clearbit.com/goldmansachs.com" },
  { name: "Morgan Stanley", logo: "https://logo.clearbit.com/morganstanley.com" },
  { name: "Capital One", logo: "https://logo.clearbit.com/capitalone.com" },
  { name: "Walmart", logo: "https://logo.clearbit.com/walmart.com" },
  { name: "Target", logo: "https://logo.clearbit.com/target.com" },
  { name: "Costco", logo: "https://logo.clearbit.com/costco.com" },
  { name: "Kroger", logo: "https://logo.clearbit.com/kroger.com" },
  { name: "Walgreens", logo: "https://logo.clearbit.com/walgreens.com" },
  { name: "CVS Health", logo: "https://logo.clearbit.com/cvs.com" },
  { name: "Home Depot", logo: "https://logo.clearbit.com/homedepot.com" },
  { name: "Best Buy", logo: "https://logo.clearbit.com/bestbuy.com" },
  { name: "FedEx", logo: "https://www.vectorlogo.zone/logos/fedex/fedex-ar21.svg" },
  { name: "UPS", logo: "https://www.vectorlogo.zone/logos/ups/ups-ar21.svg" },
  { name: "DHL", logo: "https://www.vectorlogo.zone/logos/dhl/dhl-ar21.svg" },
  { name: "American Airlines", logo: "https://logo.clearbit.com/aa.com" },
  { name: "Delta", logo: "https://logo.clearbit.com/delta.com" },
  { name: "United", logo: "https://logo.clearbit.com/united.com" },
  { name: "Marriott", logo: "https://logo.clearbit.com/marriott.com" },
  { name: "Hilton", logo: "https://logo.clearbit.com/hilton.com" },
  { name: "Hyatt", logo: "https://logo.clearbit.com/hyatt.com" },
  { name: "Airbnb", logo: "https://www.vectorlogo.zone/logos/airbnb/airbnb-ar21.svg" },
  { name: "Uber", logo: "https://www.vectorlogo.zone/logos/uber/uber-ar21.svg" },
  { name: "Lyft", logo: "https://logo.clearbit.com/lyft.com" },
  { name: "DoorDash", logo: "https://logo.clearbit.com/doordash.com" },
  { name: "Instacart", logo: "https://logo.clearbit.com/instacart.com" },
  { name: "Intuit", logo: "https://logo.clearbit.com/intuit.com" },
  { name: "Bloomberg", logo: "https://logo.clearbit.com/bloomberg.com" },
  { name: "Tesla", logo: "https://www.vectorlogo.zone/logos/tesla/tesla-ar21.svg" },
  { name: "Samsung", logo: "https://www.vectorlogo.zone/logos/samsung/samsung-ar21.svg" },
  { name: "Sony", logo: "https://www.vectorlogo.zone/logos/sony/sony-ar21.svg" },
  { name: "Netflix", logo: "https://www.vectorlogo.zone/logos/netflix/netflix-ar21.svg" },
  { name: "Spotify", logo: "https://www.vectorlogo.zone/logos/spotify/spotify-ar21.svg" },
  { name: "YouTube", logo: "https://www.vectorlogo.zone/logos/youtube/youtube-ar21.svg" },
  { name: "Twitch", logo: "https://www.vectorlogo.zone/logos/twitch/twitch-ar21.svg" },
  { name: "Pfizer", logo: "https://logo.clearbit.com/pfizer.com" },
  { name: "Moderna", logo: "https://logo.clearbit.com/modernatx.com" },
  { name: "Johnson & Johnson", logo: "https://logo.clearbit.com/jnj.com" }
];

const CompanyLogo = ({ name, logo }) => {
  const [imgError, setImgError] = React.useState(false);

  return (
    <div className="flex-shrink-0 px-6 py-4">
      <div className="flex items-center justify-center h-16 w-32 rounded-lg bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-700/50 hover:border-cyan-400/50 transition-all duration-300 backdrop-blur-sm group cursor-default hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]">
        {!imgError && logo ? (
          <img 
            src={logo} 
            alt={name}
            className="h-10 w-auto max-w-[100px] object-contain filter brightness-90 group-hover:brightness-110 transition-all"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <span className="text-xs font-bold text-slate-300 group-hover:text-cyan-300 transition-colors text-center px-3">
            {name}
          </span>
        )}
      </div>
    </div>
  );
};

const CarouselRow = ({ companies, title, tagline, speed = 50 }) => {
  const scrollDuration = speed;

  return (
    <div className="space-y-3 mb-8">
      {/* Row Header */}
      <div className="px-4 sm:px-6">
        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">
          {title}
        </h3>
        <p className="text-xs text-slate-400 mt-1">{tagline}</p>
      </div>

      {/* Carousel */}
      <div className="overflow-hidden rounded-xl border border-slate-700/50 bg-gradient-to-r from-slate-950/50 to-transparent">
        <div className="relative">
          {/* Fade gradient left */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
          
          {/* Fade gradient right */}
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

          {/* Animated track */}
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: "-50%" }}
            transition={{
              duration: scrollDuration,
              repeat: Infinity,
              ease: "linear",
            }}
            className="flex gap-3 py-3 px-3"
          >
            {/* Original set */}
            {companies.map((company, idx) => (
              <CompanyLogo key={`${company.name}-${idx}`} name={company.name} logo={company.logo} />
            ))}
            {/* Duplicated set for seamless loop */}
            {companies.map((company, idx) => (
              <CompanyLogo key={`dup-${company.name}-${idx}`} name={company.name} logo={company.logo} />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default function TrustedByMarquee() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/5 to-slate-950 py-24 px-4 sm:px-6 overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tl from-purple-500/10 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* CTA Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-400/30 mb-6">
            <Zap className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.8)]" />
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-300">
              Trusted By Industry Leaders
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
            Powering the
            <br />
            <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              Digital Economy
            </span>
          </h2>

          <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
            From AI pioneers to security titans, from fintech disruptors to enterprise giants—
            <span className="text-cyan-300 font-semibold"> 300+ companies rely on us to build, secure, and scale</span> their most critical systems.
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <div className="text-sm text-slate-400">
              ✓ <span className="font-semibold text-white">Enterprise Grade</span> • Trusted by Fortune 500
            </div>
            <div className="text-sm text-slate-400">
              ✓ <span className="font-semibold text-white">Security First</span> • ISO 27001 Certified
            </div>
            <div className="text-sm text-slate-400">
              ✓ <span className="font-semibold text-white">24/7 Support</span> • 99.99% Uptime
            </div>
          </motion.div>
        </motion.div>

        {/* Three Carousel Rows */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
          className="space-y-12"
        >
          <CarouselRow
            companies={ENGINEERING_LOGOS}
            title="Engineering Excellence"
            tagline="Companies that BUILD the digital world"
            speed={80}
          />

          <CarouselRow
            companies={SECURITY_LOGOS}
            title="Security & Governance"
            tagline="Companies that PROTECT, VERIFY, and GOVERN"
            speed={90}
          />

          <CarouselRow
            companies={REALWORLD_LOGOS}
            title="Real-World Systems"
            tagline="Companies that OPERATE in the physical, regulated, or consumer world"
            speed={100}
          />
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-24 text-center"
        >
          <div className="inline-block p-1 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30">
            <a
              href={createPageUrl("GlyphBot")}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold flex items-center gap-2 transition-all duration-300 group shadow-lg shadow-cyan-500/30"
            >
              Ready to Join Them?
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
          <p className="text-sm text-slate-400 mt-6">
            Start building with GlyphBot today. No credit card required.
          </p>
        </motion.div>
      </div>
    </section>
  );
}