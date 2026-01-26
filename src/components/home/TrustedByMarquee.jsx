import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { createPageUrl } from "@/utils";

const ENGINEERING_COMPANIES = [
  "Vercel", "Supabase", "Replit", "Base44", "Lovable", "Twilio", "SendGrid",
  "Perplexity AI", "Qwen", "Hugging Face", "Pinecone", "Weaviate", "Milvus",
  "LangChain", "LlamaIndex", "Render", "Railway", "Fly.io", "Netlify",
  "PlanetScale", "Amazon Web Services", "Microsoft Azure", "Google Cloud",
  "IBM Cloud", "Oracle Cloud", "Snowflake", "Databricks", "NVIDIA", "Intel",
  "AMD", "OpenAI", "Anthropic", "Mistral AI", "Cohere", "Scale AI",
  "DigitalOcean", "Fastly", "Akamai", "MongoDB", "Elastic", "HashiCorp",
  "Docker", "Kubernetes", "JetBrains", "Postman", "Sentry", "New Relic",
  "Datadog", "GitHub", "GitLab", "Atlassian", "Slack", "Figma", "Notion",
  "Airtable", "Linear", "Retool", "Webflow", "Framer", "Bubble", "Make.com",
  "Zapier", "IFTTT", "Shopify", "Wix", "Squarespace", "Stripe"
];

const SECURITY_COMPANIES = [
  "CrowdStrike", "Palo Alto Networks", "Okta", "Zscaler", "SentinelOne",
  "Fortinet", "CyberArk", "Proofpoint", "Darktrace", "Rapid7", "Tenable",
  "Duo Security", "Ping Identity", "Thales Group", "Check Point", "Trend Micro",
  "Sophos", "McAfee", "RSA Security", "Splunk", "Sumo Logic", "Imperva",
  "Veracode", "OneSpan", "Auth0", "Yubico", "Snyk", "Aqua Security", "Wiz",
  "Lacework", "Illumio", "Armis", "Cybereason", "Onfido", "Jumio", "Trulioo",
  "Prove", "TeleSign", "Kount", "Riskified", "Forter", "Plaid", "PayPal",
  "Square", "Visa", "Mastercard", "American Express", "Discover", "Stripe Radar"
];

const REALWORLD_COMPANIES = [
  "JPMorgan Chase", "Bank of America", "Wells Fargo", "Citigroup", "Goldman Sachs",
  "Morgan Stanley", "Capital One", "Walmart", "Target", "Costco", "Kroger",
  "Walgreens", "CVS Health", "Home Depot", "Lowe's", "Best Buy", "FedEx",
  "UPS", "DHL", "American Airlines", "Delta Air Lines", "United Airlines",
  "Marriott", "Hilton", "Hyatt", "Airbnb", "Uber", "Lyft", "DoorDash",
  "Instacart", "Intuit", "QuickBooks", "Xero", "Sage", "Bloomberg", "Tesla",
  "Samsung", "LG", "Sony", "Panasonic", "Netflix", "Spotify", "TikTok",
  "YouTube", "Twitch", "GE Healthcare", "Medtronic", "Pfizer", "Moderna",
  "Johnson & Johnson", "Merck", "Novartis", "Roche", "AstraZeneca"
];

const CompanyLogo = ({ name }) => (
  <div className="flex-shrink-0 px-6 py-4">
    <div className="flex items-center justify-center h-16 rounded-lg bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-700/50 hover:border-cyan-400/50 transition-all duration-300 backdrop-blur-sm group cursor-default hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]">
      <span className="text-xs font-bold text-slate-300 group-hover:text-cyan-300 transition-colors text-center px-3">
        {name}
      </span>
    </div>
  </div>
);

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
              <CompanyLogo key={`${company}-${idx}`} name={company} />
            ))}
            {/* Duplicated set for seamless loop */}
            {companies.map((company, idx) => (
              <CompanyLogo key={`dup-${company}-${idx}`} name={company} />
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
            companies={ENGINEERING_COMPANIES}
            title="Engineering Excellence"
            tagline="Companies that BUILD the digital world"
            speed={80}
          />

          <CarouselRow
            companies={SECURITY_COMPANIES}
            title="Security & Governance"
            tagline="Companies that PROTECT, VERIFY, and GOVERN"
            speed={90}
          />

          <CarouselRow
            companies={REALWORLD_COMPANIES}
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