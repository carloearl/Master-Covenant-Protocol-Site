import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import SEOHead from "@/components/SEOHead";

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedItems, setExpandedItems] = useState([]);

  const faqs = [
    {
      category: "General",
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
        }
      ]
    },
    {
      category: "Pricing & Billing",
      questions: [
        {
          q: "What pricing plans are available?",
          a: "We offer Professional ($200/month) and Enterprise ($2,000/month) plans. Professional includes all tools and up to 1,000 QR codes/month. Enterprise includes unlimited usage, priority support, and custom integrations."
        },
        {
          q: "Is there a free trial?",
          a: "Yes, all new users get access to limited free trials on our security tools to test the platform before subscribing."
        },
        {
          q: "Can I cancel my subscription anytime?",
          a: "Yes, you can cancel your subscription at any time from your Dashboard > Manage Subscription. You'll retain access until the end of your billing period."
        },
        {
          q: "What payment methods do you accept?",
          a: "We accept all major credit cards, debit cards, and digital wallets through Stripe's secure payment processing."
        }
      ]
    },
    {
      category: "Security Tools",
      questions: [
        {
          q: "What is the QR Generator?",
          a: "Our QR Generator creates secure, steganographic QR codes with embedded encryption and AI-powered threat detection to prevent quishing attacks."
        },
        {
          q: "How does Steganography work?",
          a: "Our steganography tool embeds encrypted data within images, making it invisible to the naked eye but recoverable with the correct decryption key."
        },
        {
          q: "What is Hotzone Mapper?",
          a: "Hotzone Mapper is a visual security mapping tool that lets you upload facility layouts and mark security threats with real-time monitoring and incident tracking."
        },
        {
          q: "Can I use multiple security tools together?",
          a: "Yes, all GlyphLock tools integrate seamlessly. Professional and Enterprise plans include access to the complete security suite."
        }
      ]
    },
    {
      category: "AI & GlyphBot",
      questions: [
        {
          q: "What is GlyphBot?",
          a: "GlyphBot is our AI-powered cybersecurity assistant that provides real-time threat analysis, code execution, security scanning, and automated audit generation."
        },
        {
          q: "How does GlyphBot protect my data?",
          a: "GlyphBot operates within secure, isolated environments with end-to-end encryption. Your data is never stored permanently and is protected by quantum-resistant algorithms."
        },
        {
          q: "Can I integrate GlyphBot with my systems?",
          a: "Enterprise customers can integrate GlyphBot via API or WhatsApp for custom workflows and automated security operations."
        }
      ]
    },
    {
      category: "NUPS POS System",
      questions: [
        {
          q: "What is NUPS?",
          a: "NUPS (Next-Gen Unified POS System) is our secure point-of-sale solution designed for hospitality venues, offering inventory management, customer tracking, loyalty programs, and advanced security."
        },
        {
          q: "Does NUPS work offline?",
          a: "NUPS requires internet connectivity for real-time transaction processing and security verification, but local caching is available for brief outages."
        },
        {
          q: "Can NUPS handle high-volume venues?",
          a: "Yes, NUPS is built for high-traffic environments with concurrent transaction processing, batch management, and Z-report generation."
        }
      ]
    },
    {
      category: "Technical",
      questions: [
        {
          q: "What encryption standards do you use?",
          a: "We use AES-256 encryption, SHA-256 hashing, and post-quantum cryptographic algorithms including lattice-based and hash-based signatures."
        },
        {
          q: "Is GlyphLock SOC 2 compliant?",
          a: "Yes, GlyphLock maintains SOC 2, GDPR, ISO 27001, PCI DSS, and HIPAA compliance standards."
        },
        {
          q: "Do you offer API access?",
          a: "Enterprise customers receive full API access with documentation, SDKs, and dedicated technical support."
        },
        {
          q: "What browsers are supported?",
          a: "GlyphLock supports all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated for optimal security."
        }
      ]
    },
    {
      category: "Support",
      questions: [
        {
          q: "How do I contact support?",
          a: "Professional users get standard support via email (glyphlock@gmail.com). Enterprise customers receive 24/7 priority support with dedicated account managers."
        },
        {
          q: "What is your response time?",
          a: "Standard support: 24-48 hours. Priority support (Enterprise): <4 hours for critical issues, <1 hour for emergencies."
        },
        {
          q: "Do you offer training?",
          a: "Yes, Enterprise customers receive comprehensive onboarding, training sessions, and ongoing educational resources."
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

  return (
    <>
      <SEOHead 
        title="FAQ - Frequently Asked Questions | GlyphLock Help Center"
        description="Find answers to common questions about GlyphLock's cybersecurity platform, pricing, security tools, AI features, NUPS POS system, and technical support."
        keywords="FAQ, help center, support, pricing questions, security tools, GlyphBot AI, NUPS POS, technical support, customer service"
        url="/faq"
      />
      
      <div className="min-h-screen bg-black text-white py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-violet-600 bg-clip-text text-transparent">
                Frequently Asked Questions
              </span>
            </h1>
            <p className="text-xl text-white/70">
              Find answers to common questions about GlyphLock
            </p>
          </div>

          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
              <Input
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 glass-card-dark border-blue-500/30 text-white"
              />
            </div>
          </div>

          {filteredFaqs.length === 0 ? (
            <Card className="glass-card-dark border-blue-500/30 text-center p-12">
              <p className="text-white/60">No questions found matching "{searchTerm}"</p>
            </Card>
          ) : (
            <div className="space-y-6">
              {filteredFaqs.map((category, catIndex) => (
                <Card key={catIndex} className="glass-card-dark border-blue-500/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-3">
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                        {category.category}
                      </Badge>
                      <span className="text-sm text-white/60">
                        {category.questions.length} {category.questions.length === 1 ? 'question' : 'questions'}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {category.questions.map((faq, qIndex) => {
                      const key = `${catIndex}-${qIndex}`;
                      const isExpanded = expandedItems.includes(key);
                      
                      return (
                        <div
                          key={qIndex}
                          className="glass-card-dark border-blue-500/20 rounded-lg overflow-hidden"
                        >
                          <button
                            onClick={() => toggleItem(catIndex, qIndex)}
                            className="w-full flex items-center justify-between p-4 text-left hover:bg-blue-500/10 transition-colors"
                          >
                            <span className="font-semibold text-white pr-4">{faq.q}</span>
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5 text-blue-400 flex-shrink-0" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-blue-400 flex-shrink-0" />
                            )}
                          </button>
                          {isExpanded && (
                            <div className="px-4 pb-4 text-white/70 text-sm leading-relaxed">
                              {faq.a}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <Card className="glass-card-dark border-blue-500/30 p-6 text-center mt-12">
            <h3 className="text-xl font-semibold text-white mb-3">Still have questions?</h3>
            <p className="text-white/70 mb-6">
              Can't find what you're looking for? Contact our support team
            </p>
            <a
              href="mailto:glyphlock@gmail.com"
              className="inline-block bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Contact Support
            </a>
          </Card>
        </div>
      </div>
    </>
  );
}