import React from "react";
import { HelpCircle } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import FaqSectionGlyphPanel from "@/components/faq/FaqSectionGlyphPanel";

export default function FAQ() {
  return (
    <>
      <SEOHead 
        title="FAQ - Frequently Asked Questions | GlyphLock Help Center"
        description="Find answers to common questions about GlyphLock's cybersecurity platform, pricing, security tools, AI features, NUPS POS system, and technical support."
        keywords="FAQ, help center, support, pricing questions, security tools, GlyphBot AI, NUPS POS, technical support, customer service"
        url="/faq"
      />
      
      <div className="min-h-screen bg-black text-white py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#001F54]/20 to-transparent pointer-events-none"></div>
        
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#00E4FF]/10 rounded-2xl mb-6 border border-[#00E4FF]/20">
              <HelpCircle className="w-8 h-8 text-[#00E4FF]" />
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-6 font-space tracking-tight">
              FREQUENTLY ASKED <span className="text-transparent bg-gradient-to-r from-[#00E4FF] to-[#8C4BFF] bg-clip-text">QUESTIONS</span>
            </h1>
            <p className="text-xl text-gray-400">
              Everything you need to know about the GlyphLock ecosystem.
            </p>
          </div>

          <FaqSectionGlyphPanel />

          <div className="glass-card rounded-2xl border border-[#8C4BFF]/30 p-8 text-center mt-16 bg-[#8C4BFF]/5">
            <h3 className="text-2xl font-bold text-white mb-4 font-space">Still Need Help?</h3>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
              Our security specialists are available 24/7 for enterprise clients, and within 24 hours for all users.
            </p>
            <a
              href="mailto:glyphlock@gmail.com"
              className="inline-flex items-center justify-center bg-gradient-to-r from-[#00E4FF] to-[#8C4BFF] hover:scale-105 text-black font-bold uppercase tracking-wide px-8 py-4 rounded-xl shadow-lg transition-all"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

/* OLD IMPLEMENTATION - PRESERVED FOR SAFETY - DO NOT DELETE
export default function FAQOld() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedItems, setExpandedItems] = useState([]);

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          q: "I'm new to cybersecurity - what is GlyphLock in simple terms?",
          a: "GlyphLock is like a super-secure digital vault for your business. We protect your data, transactions, and customers using advanced technology that even future computers can't break. Think of it as hiring an entire security team in one platform."
        },
        {
          q: "Do I need technical knowledge to use GlyphLock?",
          a: "No! GlyphLock is designed for everyone. Our interface is user-friendly with step-by-step guides. If you can use a smartphone, you can use GlyphLock. We also offer training videos and 24/7 support to help you."
        },
        {
          q: "How do I get started?",
          a: "Simple! 1) Sign up for a free account. 2) Try our tools with free trials. 3) Choose a plan that fits your needs. 4) Start protecting your business. The whole process takes less than 10 minutes."
        },
        {
          q: "What do I get for free?",
          a: "Every new user gets free trials of all our security tools - QR Generator, Steganography, Hotzone Mapper, and limited access to GlyphBot AI. No credit card required to start exploring."
        },
        {
          q: "Why do I need cybersecurity?",
          a: "In 2024, cyber attacks cost businesses $8 trillion globally. Even small businesses are targets - 43% of cyber attacks target small businesses. GlyphLock protects your customer data, prevents fraud, and keeps your business running safely."
        }
      ]
    },
    {
      category: "For Businesses",
      questions: [
        {
          q: "What is GlyphLock?",
          a: "GlyphLock is a next-generation cybersecurity platform offering quantum-resistant encryption, AI-powered threat detection, visual cryptography, blockchain security, and enterprise POS systems."
        },
        {
          q: "Who can use GlyphLock?",
          a: "GlyphLock serves businesses of all sizes, from small businesses needing secure payment systems to enterprises requiring advanced security operations centers and AI-powered protection."
        },
        {
          q: "Is GlyphLock quantum-resistant?",
          a: "Yes, GlyphLock uses quantum-resistant encryption algorithms to protect your data against current and future quantum computing threats."
        },
        {
          q: "How quickly can we deploy GlyphLock?",
          a: "Professional plans deploy in under 24 hours. Enterprise deployments typically take 3-5 business days including custom integration, training, and full system setup with your dedicated account manager."
        },
        {
          q: "Can GlyphLock integrate with our existing systems?",
          a: "Yes! Enterprise customers get full API access with custom integration support. We connect with most CRMs, ERPs, payment gateways, and security tools. Our team handles the technical integration for you."
        },
        {
          q: "What industries do you serve?",
          a: "We serve hospitality, entertainment, healthcare, finance, retail, e-commerce, technology, manufacturing, government, and defense sectors. Each gets industry-specific security features and compliance support."
        }
      ]
    },
    {
      category: "Pricing & Billing",
      questions: [
        {
          q: "How much does GlyphLock cost?",
          a: "Professional: $200/month - perfect for small to medium businesses. Enterprise: $2,000/month - built for large organizations. Both plans include all security tools. You can try everything free first before committing."
        },
        {
          q: "What's included in the Professional plan?",
          a: "All security tools (QR Generator, Steganography, Blockchain, Hotzone Mapper), GlyphBot AI assistant, up to 1,000 QR codes per month, standard email support, and full dashboard access. Perfect for most businesses."
        },
        {
          q: "What extra features does Enterprise include?",
          a: "Everything in Professional PLUS: Unlimited QR generation, NUPS POS System, 24/7 priority support with <4 hour response time, custom integrations, dedicated account manager, API access, and Security Operations Center."
        },
        {
          q: "Is there a free trial?",
          a: "Yes! All new users get free trials on every security tool. Test QR generators, steganography, and AI features with no credit card required. Upgrade when you're ready."
        },
        {
          q: "Can I cancel anytime?",
          a: "Absolutely. Cancel from your Dashboard > Manage Subscription anytime. You'll keep access until your billing period ends. No cancellation fees, no questions asked."
        },
        {
          q: "What payment methods do you accept?",
          a: "All major credit cards (Visa, Mastercard, Amex, Discover), debit cards, and digital wallets (Apple Pay, Google Pay) through Stripe's secure payment processing."
        },
        {
          q: "Do you offer discounts for nonprofits or education?",
          a: "Yes! Educational institutions and registered nonprofits receive 30% off Professional and Enterprise plans. Contact glyphlock@gmail.com with verification documents."
        },
        {
          q: "Can I get a refund?",
          a: "We offer 14-day money-back guarantee. If you're not satisfied within the first 14 days, we'll refund your subscription - no questions asked."
        },
        {
          q: "What if I need more QR codes on Professional?",
          a: "Professional includes 1,000 QR codes/month. Need more? Upgrade to Enterprise for unlimited codes, or purchase additional QR code packs at $20 per 500 codes."
        },
        {
          q: "Do you have annual billing?",
          a: "Yes! Pay annually and save 15%. Professional: $2,040/year (save $360). Enterprise: $20,400/year (save $3,600). Switch to annual billing anytime from your dashboard."
        }
      ]
    },
    {
      category: "Security Tools - Explained Simply",
      questions: [
        {
          q: "What is a QR code and why do I need a secure one?",
          a: "QR codes are those square barcodes you scan with your phone. Regular QR codes can be hacked - criminals replace them to steal data. Our QR codes have built-in protection that can't be copied or replaced. Perfect for payments, menus, tickets, and marketing."
        },
        {
          q: "What is the QR Generator?",
          a: "Our QR Generator creates ultra-secure QR codes that can't be copied, hacked, or replaced. It includes AI detection to block scams, invisible watermarks for tracking, and military-grade encryption. Use it for payments, authentication, access control, or marketing."
        },
        {
          q: "What is Steganography in simple terms?",
          a: "Steganography is like invisible ink for the digital age. We hide secret messages inside normal-looking images. The image looks ordinary, but contains encrypted data only you can unlock. Perfect for confidential documents, contracts, or secure communications."
        },
        {
          q: "How does Steganography work?",
          a: "Upload any image and the secret message you want to hide. We embed your encrypted data invisibly inside the image using advanced algorithms. Share the image publicly - only people with your decryption key can extract the hidden message."
        },
        {
          q: "What is Hotzone Mapper?",
          a: "Think Google Maps, but for security threats in your building. Upload your floor plan, mark security cameras, entry points, and threats. Track incidents in real-time. Perfect for hotels, clubs, offices, warehouses, or any facility."
        },
        {
          q: "What is Blockchain Security?",
          a: "Blockchain creates an unchangeable record of every transaction - like a digital receipt book that can't be altered. We use it to track payments, verify authenticity, and create permanent proof of ownership. Your data is verified and tamper-proof."
        },
        {
          q: "Can I use multiple security tools together?",
          a: "Yes! All tools work together. Example: Generate a secure QR code with steganography, verify it on blockchain, and track scans with Hotzone Mapper. Professional and Enterprise plans include full access to everything."
        },
        {
          q: "Are these tools hard to use?",
          a: "No! Each tool has a simple interface: 1) Upload or input your data. 2) Customize settings (or use defaults). 3) Generate and download. Most tasks take under 2 minutes. We include video tutorials for every feature."
        }
      ]
    },
    {
      category: "AI & GlyphBot",
      questions: [
        {
          q: "What is AI? Why is it in cybersecurity?",
          a: "AI (Artificial Intelligence) is like having a super-smart assistant that never sleeps. It learns patterns, detects threats, and responds faster than humans. In cybersecurity, AI spots attacks in milliseconds - protecting you 24/7 automatically."
        },
        {
          q: "What is GlyphBot?",
          a: "GlyphBot is your personal cybersecurity AI assistant. Ask it questions, scan files for threats, analyze security issues, generate reports, or execute code safely. It's like having a cybersecurity expert on call 24/7."
        },
        {
          q: "What can GlyphBot do for me?",
          a: "GlyphBot can: Scan files for malware, analyze security vulnerabilities, answer cybersecurity questions, generate security reports, test code safely, monitor threats in real-time, and provide security recommendations. All through simple conversations."
        },
        {
          q: "Is GlyphBot safe? Can AI access my private data?",
          a: "GlyphBot is completely safe. It operates in isolated, encrypted environments. Your data is never stored permanently, never shared, and never used to train other models. Quantum-resistant encryption protects every interaction."
        },
        {
          q: "How does GlyphBot protect my data?",
          a: "Three layers: 1) End-to-end encryption on all communications. 2) Isolated execution environments (your data can't leak). 3) Zero permanent storage (conversations auto-delete). Plus quantum-resistant algorithms for future-proof security."
        },
        {
          q: "Can I integrate GlyphBot with my business?",
          a: "Yes! Enterprise customers get API access to integrate GlyphBot into your apps, websites, or workflows. Also available via WhatsApp for mobile access. Perfect for automated security operations."
        },
        {
          q: "Do I need coding skills to use GlyphBot?",
          a: "No! Just talk to GlyphBot like a person. Type questions in plain English: 'Scan this file for viruses' or 'Is my password strong?' GlyphBot understands natural language and responds clearly."
        },
        {
          q: "Can GlyphBot replace my IT security team?",
          a: "GlyphBot enhances your team, not replaces them. It handles routine tasks (scanning, monitoring, reporting) 24/7, freeing your team for strategic work. Think of it as your security team's AI assistant."
        }
      ]
    },
    {
      category: "NUPS POS System",
      questions: [
        {
          q: "What is a POS system?",
          a: "POS (Point of Sale) is the system where customers pay - like a cash register, but digital. It tracks sales, inventory, customers, and employees. Every store, restaurant, bar, or hotel needs one."
        },
        {
          q: "What is NUPS?",
          a: "NUPS (Next-Gen Unified POS System) is our ultra-secure payment system built for hospitality - clubs, bars, restaurants, hotels. It includes: cash register, inventory tracking, customer loyalty, employee management, fraud prevention, and real-time reporting."
        },
        {
          q: "Why is NUPS better than other POS systems?",
          a: "NUPS has military-grade security that prevents employee theft, customer fraud, and hacking. Plus: AI-powered analytics, automatic inventory, customer insights, marketing tools, and blockchain verification. All in one affordable platform."
        },
        {
          q: "What venues is NUPS designed for?",
          a: "Nightclubs, bars, restaurants, hotels, lounges, casinos, entertainment venues, and any hospitality business. Especially venues with VIP services, bottle service, entertainer management, or high-volume transactions."
        },
        {
          q: "Does NUPS work offline?",
          a: "NUPS needs internet for real-time security and payment processing. However, it includes local caching - if internet drops briefly, transactions queue and process when reconnected. You won't lose sales."
        },
        {
          q: "Can NUPS handle busy nights with hundreds of transactions?",
          a: "Absolutely. NUPS processes multiple transactions simultaneously without lag. Built for Black Friday-level traffic. Includes batch management for cash reconciliation and Z-reports for end-of-night accounting."
        },
        {
          q: "What payment methods does NUPS accept?",
          a: "Cash, all major credit/debit cards, Apple Pay, Google Pay, digital wallets, gift cards, and GlyphLock vouchers. Customers can split payments across multiple methods."
        },
        {
          q: "Does NUPS track inventory automatically?",
          a: "Yes! Every sale automatically updates inventory in real-time. Low stock alerts, expiration tracking, supplier management, and automated reordering. Never run out of best-sellers again."
        },
        {
          q: "Can NUPS prevent employee theft?",
          a: "Yes. NUPS includes: transaction logging (every action tracked), cash drawer monitoring (discrepancies flagged), voiding controls (manager approval required), time tracking (who was working when), and video evidence integration."
        },
        {
          q: "Does NUPS include customer loyalty programs?",
          a: "Yes! Built-in loyalty points, rewards tiers (Bronze/Silver/Gold/Platinum), birthday rewards, VIP tracking, and automated marketing campaigns. Increase repeat customers by 40%."
        },
        {
          q: "How much does NUPS cost?",
          a: "NUPS is included free with Enterprise plans ($2,000/month). Standalone NUPS: $500/month per location. Includes unlimited transactions, all features, hardware support, and 24/7 assistance."
        }
      ]
    },
    {
      category: "Security & Compliance",
      questions: [
        {
          q: "Is my data safe with GlyphLock?",
          a: "Yes. We use military-grade encryption, quantum-resistant algorithms, zero-knowledge architecture (we can't see your data), and undergo regular third-party security audits. Your data is safer with us than in your own servers."
        },
        {
          q: "What is quantum-resistant encryption?",
          a: "Current encryption can be broken by future quantum computers. Quantum-resistant encryption uses math problems that even quantum computers can't solve. Your data stays protected for decades, not just years."
        },
        {
          q: "What encryption standards do you use?",
          a: "AES-256 encryption (military standard), SHA-256 hashing, post-quantum cryptography (lattice-based and hash-based signatures), and zero-knowledge proofs. The same security used by banks and governments."
        },
        {
          q: "Are you compliant with regulations?",
          a: "Yes. GlyphLock maintains: SOC 2 (security standards), GDPR (EU privacy), ISO 27001 (information security), PCI DSS (payment security), and HIPAA (healthcare). We handle compliance so you don't have to."
        },
        {
          q: "What is SOC 2 and why does it matter?",
          a: "SOC 2 is a third-party audit that proves we have proper security controls. It means we've been independently verified to protect your data. Most enterprises require it from vendors."
        },
        {
          q: "Do you store my passwords?",
          a: "Never. We use zero-knowledge authentication - we don't have access to your passwords or encryption keys. Even we can't read your protected data."
        },
        {
          q: "Where is my data stored?",
          a: "US-based encrypted cloud servers with automatic backups, redundancy, and disaster recovery. Enterprise customers can request specific geographic data storage for compliance."
        },
        {
          q: "Can government agencies access my data?",
          a: "We follow legal requirements, but use warrant canaries and transparency reports. Your data is encrypted - even with a warrant, encrypted data is unreadable without your keys (which we don't have)."
        },
        {
          q: "What happens if GlyphLock gets hacked?",
          a: "Your data remains safe. We use: 1) Multi-layer encryption 2) Zero-knowledge architecture 3) Isolated systems 4) 24/7 monitoring. Even in a breach, hackers would only see encrypted data they can't read."
        },
        {
          q: "Do you have insurance for data breaches?",
          a: "Yes. GlyphLock carries $10M cyber liability insurance covering data breaches, system failures, and security incidents. Enterprise customers can add additional coverage."
        }
      ]
    },
    {
      category: "Technical & Integration",
      questions: [
        {
          q: "Do you offer API access?",
          a: "Yes! Enterprise customers get full REST API access with comprehensive documentation, SDKs for popular languages (Python, JavaScript, Ruby, Java), webhook support, and dedicated technical support."
        },
        {
          q: "What browsers and devices work with GlyphLock?",
          a: "All modern browsers: Chrome, Firefox, Safari, Edge, and Brave. Works on: Windows, Mac, Linux, iOS, Android, and tablets. Responsive design means it works perfectly on any screen size."
        },
        {
          q: "Can GlyphLock integrate with my existing software?",
          a: "Yes. We integrate with: Salesforce, HubSpot, Shopify, QuickBooks, Xero, Slack, Microsoft Teams, WordPress, and custom systems via API. Enterprise customers get custom integration support."
        },
        {
          q: "Do I need to install software?",
          a: "No! GlyphLock is 100% cloud-based. Access from any device with a web browser - no downloads, no installations. Updates happen automatically."
        },
        {
          q: "What if I have custom requirements?",
          a: "Enterprise customers get custom development, white-label options, dedicated servers, custom integrations, and tailored features. Our engineering team works directly with you."
        },
        {
          q: "Can I export my data?",
          a: "Yes. Export everything anytime in CSV, JSON, or XML formats. You own your data - we never lock you in. Bulk export tools included for large datasets."
        },
        {
          q: "Is there a mobile app?",
          a: "Currently web-based (works on mobile browsers). Native iOS and Android apps launching Q2 2025. Enterprise customers get early access and custom mobile features."
        }
      ]
    },
    {
      category: "Support & Training",
      questions: [
        {
          q: "How do I get help if I'm stuck?",
          a: "Multiple ways: 1) Live chat with GlyphBot Jr (bottom right corner) 2) Email glyphlock@gmail.com 3) Video tutorials in your dashboard 4) Help docs 5) Phone support for Enterprise. We respond quickly."
        },
        {
          q: "How do I contact support?",
          a: "Professional users: Email glyphlock@gmail.com (24-48 hour response). Enterprise users: 24/7 phone support, dedicated account manager, priority email, and Slack/Teams channels. Plus emergency hotline for critical issues."
        },
        {
          q: "What is your response time?",
          a: "Professional plan: 24-48 hours via email. Enterprise plan: <4 hours for urgent issues, <1 hour for critical emergencies (system down, security breach, payment issues). Average actual response: 2 hours."
        },
        {
          q: "Do you offer training?",
          a: "Yes! Professional users get: Video tutorials, help documentation, and email support. Enterprise users get: Live onboarding calls, customized training sessions, quarterly check-ins, educational webinars, and certification programs."
        },
        {
          q: "What if I need help outside business hours?",
          a: "Enterprise customers get true 24/7/365 support - call anytime, including weekends and holidays. Professional users can email anytime; we respond within 48 hours (usually much faster)."
        },
        {
          q: "Can you help us implement GlyphLock?",
          a: "Absolutely. Enterprise includes: Dedicated implementation specialist, custom integration setup, employee training, testing support, and go-live assistance. We handle the technical work for you."
        },
        {
          q: "Do you offer consulting services?",
          a: "Yes. Book a consultation ($299, credited to your first project) for: Security assessments, system architecture, compliance guidance, integration planning, and custom solutions. Perfect for complex implementations."
        },
        {
          q: "What languages do you support?",
          a: "Currently English only. Spanish, French, German, and Mandarin support coming 2025. Enterprise customers can request priority language support and custom translations."
        }
      ]
    },
    {
      category: "Common Issues & Troubleshooting",
      questions: [
        {
          q: "I forgot my password - how do I reset it?",
          a: "Click 'Forgot Password' on the login page. Enter your email. We'll send a secure reset link instantly. Create a new password and you're back in. The whole process takes 2 minutes."
        },
        {
          q: "Why can't I log in?",
          a: "Common fixes: 1) Check your email/password for typos 2) Clear browser cache 3) Try a different browser 4) Reset your password 5) Check if Caps Lock is on. Still stuck? Email glyphlock@gmail.com with your username."
        },
        {
          q: "My QR code isn't scanning - what's wrong?",
          a: "Common issues: 1) Print quality too low (use 300+ DPI) 2) QR code too small (minimum 1 inch) 3) Poor lighting when scanning 4) Damaged/dirty QR code. Try regenerating at higher resolution or larger size."
        },
        {
          q: "Why is my payment failing?",
          a: "Common causes: 1) Insufficient funds 2) Expired card 3) Incorrect billing address 4) Bank blocking the charge 5) International card without approval. Contact your bank or try a different card. We accept all major cards and PayPal."
        },
        {
          q: "How do I delete my account?",
          a: "Dashboard > Settings > Account > Delete Account. Warning: This permanently deletes all data (cannot be recovered). Cancel your subscription first to avoid charges. Export any data you need before deleting."
        },
        {
          q: "Can I recover deleted data?",
          a: "We keep backups for 30 days. Contact support within 30 days of deletion for possible recovery. After 30 days, data is permanently erased per our privacy policy. Always export important data before deleting."
        },
        {
          q: "Why is the website slow?",
          a: "Usually due to: 1) Your internet connection 2) Browser cache (clear it) 3) Too many browser tabs 4) Outdated browser (update it). GlyphLock runs on high-speed servers worldwide - slowness is rare."
        }
      ]
    }
  ];

  const toggleItem = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setExpandedItems(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(faq =>
      faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return OLD FAQ CONTENT
    <>
      <SEOHead 
        title="FAQ - Frequently Asked Questions | GlyphLock Help Center"
        description="Find answers to common questions about GlyphLock's cybersecurity platform, pricing, security tools, AI features, NUPS POS system, and technical support."
        keywords="FAQ, help center, support, pricing questions, security tools, GlyphBot AI, NUPS POS, technical support, customer service"
        url="/faq"
      />
      
      <div className="min-h-screen bg-black text-white py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#001F54]/20 to-transparent pointer-events-none"></div>
        
        <div className="container mx-auto px-6 max-w-5xl relative z-10 OLD">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#00E4FF]/10 rounded-2xl mb-6 border border-[#00E4FF]/20">
              <HelpCircle className="w-8 h-8 text-[#00E4FF]" />
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-6 font-space tracking-tight">
              FREQUENTLY ASKED <span className="text-transparent bg-gradient-to-r from-[#00E4FF] to-[#8C4BFF] bg-clip-text">QUESTIONS</span>
            </h1>
            <p className="text-xl text-gray-400">
              Everything you need to know about the GlyphLock ecosystem.
            </p>
          </div>

          <div className="mb-12 max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#00E4FF]" />
              <Input
                placeholder="Search for answers (e.g. 'pricing', 'security', 'API')..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 glass-card rounded-xl border-[#00E4FF]/20 text-white h-14 text-lg focus:border-[#00E4FF] bg-black/50"
              />
            </div>
          </div>

          {filteredFaqs.length === 0 ? (
            <div className="glass-card rounded-xl border border-white/10 text-center p-12">
              <p className="text-gray-400">No questions found matching "{searchTerm}"</p>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredFaqs.map((category, catIndex) => (
                <div key={catIndex} className="glass-card rounded-2xl border border-white/10 overflow-hidden">
                  <div className="p-6 border-b border-white/10 bg-white/5">
                    <div className="flex items-center gap-4">
                      <Badge className="bg-[#00E4FF]/10 text-[#00E4FF] border-[#00E4FF]/30">
                        {category.category}
                      </Badge>
                      <span className="text-sm text-gray-400">
                        {category.questions.length} {category.questions.length === 1 ? 'question' : 'questions'}
                      </span>
                    </div>
                  </div>
                  <div className="divide-y divide-white/5">
                    {category.questions.map((faq, qIndex) => {
                      const key = `${catIndex}-${qIndex}`;
                      const isExpanded = expandedItems.includes(key);
                      
                      return (
                        <div key={qIndex} className="group">
                          <button
                            onClick={() => toggleItem(catIndex, qIndex)}
                            className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
                          >
                            <span className="font-bold text-white text-lg pr-8 group-hover:text-[#00E4FF] transition-colors">{faq.q}</span>
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5 text-[#00E4FF] flex-shrink-0" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-500 group-hover:text-[#00E4FF] flex-shrink-0 transition-colors" />
                            )}
                          </button>
                          {isExpanded && (
                            <div className="px-6 pb-6 text-gray-300 leading-relaxed text-base animate-in fade-in slide-in-from-top-2">
                              {faq.a}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="glass-card rounded-2xl border border-[#8C4BFF]/30 p-8 text-center mt-16 bg-[#8C4BFF]/5">
            <h3 className="text-2xl font-bold text-white mb-4 font-space">Still Need Help?</h3>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
              Our security specialists are available 24/7 for enterprise clients, and within 24 hours for all users.
            </p>
            <a
              href="mailto:glyphlock@gmail.com"
              className="inline-flex items-center justify-center bg-gradient-to-r from-[#00E4FF] to-[#8C4BFF] hover:scale-105 text-black font-bold uppercase tracking-wide px-8 py-4 rounded-xl shadow-lg transition-all"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </>
  );
}