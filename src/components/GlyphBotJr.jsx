import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, X, Send, Bot, Home, Shield, Zap, Mail, FileText, Info } from "lucide-react";

export default function GlyphBotJr({ darkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm GlyphBot Jr. 🤖 I can help you navigate the GlyphLock ecosystem. Ask me about our services, find pages, or get quick info!"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [flippedButton, setFlippedButton] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickLinks = [
    { 
      icon: Home, 
      label: "Home", 
      page: "Home",
      info: "Return to the main landing page. Explore GlyphLock's quantum security platform and see our 5 bound AI systems.",
      glow: "rgba(59, 130, 246, 0.6)"
    },
    { 
      icon: Shield, 
      label: "Security Tools", 
      page: "SecurityTools",
      info: "Access our suite of cybersecurity tools: QR Generator, Steganography, Blockchain verification, and Hotzone Mapper.",
      glow: "rgba(34, 197, 94, 0.6)"
    },
    { 
      icon: Zap, 
      label: "Master Covenant", 
      page: "MasterCovenant",
      info: "Legal AI binding system with $14M liability coverage. Five AI systems bound through cryptographic proof.",
      glow: "rgba(234, 179, 8, 0.6)"
    },
    { 
      icon: Mail, 
      label: "Contact", 
      page: "Contact",
      info: "Get in touch with our team. Email, phone, and office location in El Mirage, Arizona.",
      glow: "rgba(168, 85, 247, 0.6)"
    },
    { 
      icon: FileText, 
      label: "Pricing", 
      page: "Pricing",
      info: "View pricing for all GlyphLock services. Enterprise solutions, security tools, and consultation packages.",
      glow: "rgba(236, 72, 153, 0.6)"
    },
  ];

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const sitemapContext = `
You are GlyphBot Jr., a friendly navigation assistant for the GlyphLock Security platform.

GlyphLock Pages & Services:
- Home: Main landing page with overview
- Master Covenant: Legal AI binding system with 5 AI systems bound
- Security Tools: Collection of cybersecurity utilities (QR Generator, Steganography, Blockchain, Hotzone Mapper)
- QR Generator: Create secure QR codes with threat detection
- Steganography: Hide encrypted data in images
- Blockchain: Cryptographic hashing and verification tools
- Hotzone Mapper: Interactive security vulnerability mapping
- HSSS: Advanced surveillance system
- GlyphBot: Full AI assistant (you're the junior version!)
- N.U.P.S. POS: Enterprise point-of-sale system
- Pricing: Service pricing and plans
- Contact: Get in touch with the team
- Consultation: Book a paid security consultation
- About: Company story, team, and values
- Roadmap: Product development timeline
- Privacy Policy: Data privacy information
- Terms of Service: Legal terms
- Security Documentation: Security practices
- Dashboard: User account management (requires login)

Your job:
1. Help users find pages/services
2. Provide quick info about features
3. Give friendly, concise answers (2-3 sentences max)
4. Suggest relevant pages when appropriate
5. Be helpful and professional

User question: ${userMessage}

Respond naturally and helpfully. If suggesting a page, mention it by name.
`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: sitemapContext,
        response_json_schema: null
      });

      setMessages(prev => [...prev, { role: "assistant", content: response }]);
    } catch (error) {
      console.error("GlyphBot Jr. error:", error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Oops! I had trouble processing that. Try asking about our services or use the quick links above!" 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLink = (pageName) => {
    setMessages(prev => [...prev, { 
      role: "assistant", 
      content: `Taking you to ${pageName}! Click the link below or use the navigation menu.` 
    }]);
  };

  const handleButtonClick = (idx) => {
    if (flippedButton === idx) {
      setFlippedButton(null);
    } else {
      setFlippedButton(idx);
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        size="lg"
        className="fixed bottom-6 right-6 z-50 rounded-full w-16 h-16 shadow-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white animate-pulse hover:animate-none"
      >
        <Bot className="w-8 h-8" />
      </Button>
    );
  }

  return (
    <Card className={`fixed bottom-6 right-6 z-50 w-96 h-[600px] shadow-2xl ${
      darkMode 
        ? 'bg-gray-900/95 border-blue-500/30' 
        : 'bg-white/95 border-blue-500/40'
    } backdrop-blur-xl`}>
      <CardHeader className="flex flex-row items-center justify-between border-b border-blue-500/20 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/50">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle className={`text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              GlyphBot Jr.
            </CardTitle>
            <p className="text-xs text-gray-400">Navigation Assistant</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className={darkMode ? 'text-white hover:text-red-400' : 'text-gray-900 hover:text-red-600'}
        >
          <X className="w-5 h-5" />
        </Button>
      </CardHeader>

      <CardContent className="p-4 h-[calc(100%-140px)] flex flex-col">
        {/* Quick Links with Flip Effect */}
        <div className="flex flex-wrap gap-2 mb-3 pb-3 border-b border-blue-500/20">
          {quickLinks.map((link, idx) => (
            <div key={idx} className="relative group" style={{ perspective: '1000px' }}>
              <div
                className={`relative transition-transform duration-500 ${
                  flippedButton === idx ? '[transform:rotateY(180deg)]' : ''
                }`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Front of Button */}
                <div
                  className="absolute inset-0"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <button
                    onClick={() => handleButtonClick(idx)}
                    className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      darkMode 
                        ? 'bg-gray-800/80 border border-blue-500/30 text-white' 
                        : 'bg-white/80 border border-blue-500/50 text-gray-900'
                    } backdrop-blur-sm overflow-hidden group-hover:scale-105`}
                    style={{
                      boxShadow: `0 0 20px ${link.glow}, 0 0 40px ${link.glow}`,
                      animation: 'pulse-glow 2s ease-in-out infinite'
                    }}
                  >
                    {/* Glow effect */}
                    <div
                      className="absolute inset-0 opacity-50 group-hover:opacity-0 transition-opacity duration-300"
                      style={{
                        background: `radial-gradient(circle at center, ${link.glow} 0%, transparent 70%)`
                      }}
                    />
                    
                    <div className="relative flex items-center gap-2">
                      <link.icon className="w-4 h-4 flex-shrink-0" />
                      <span
                        className="transition-all duration-300 group-hover:blur-0"
                        style={{
                          filter: 'blur(3px)',
                          textShadow: `0 0 10px ${link.glow}`
                        }}
                      >
                        {link.label}
                      </span>
                      <span
                        className="absolute left-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ filter: 'blur(0px)' }}
                      >
                        {link.label}
                      </span>
                    </div>
                  </button>
                </div>

                {/* Back of Button - Info */}
                <div
                  className="absolute inset-0"
                  style={{ 
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)'
                  }}
                >
                  <div
                    className={`w-full h-full p-3 rounded-lg text-xs ${
                      darkMode 
                        ? 'bg-gray-800/95 border border-blue-500/40 text-white' 
                        : 'bg-white/95 border border-blue-500/60 text-gray-900'
                    } backdrop-blur-xl shadow-xl`}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <Info className="w-4 h-4 flex-shrink-0 text-blue-400 mt-0.5" />
                      <div className="font-semibold">{link.label}</div>
                    </div>
                    <p className={`text-xs leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {link.info}
                    </p>
                    <Link 
                      to={createPageUrl(link.page)}
                      onClick={() => {
                        handleQuickLink(link.label);
                        setFlippedButton(null);
                      }}
                    >
                      <Button
                        size="sm"
                        className="w-full mt-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-xs"
                      >
                        Go to {link.label}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-3">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 ${
                  msg.role === 'user'
                    ? darkMode
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-500 text-white'
                    : darkMode
                      ? 'bg-gray-800/80 text-white border border-blue-500/20'
                      : 'bg-gray-100 text-gray-900 border border-blue-500/30'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className={`rounded-lg px-3 py-2 ${
                darkMode 
                  ? 'bg-gray-800/80 border border-blue-500/20' 
                  : 'bg-gray-100 border border-blue-500/30'
              }`}>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything..."
            disabled={loading}
            className={`flex-1 ${
              darkMode 
                ? 'bg-gray-800/80 border-blue-500/30 text-white placeholder:text-gray-500' 
                : 'bg-white border-blue-500/50 text-gray-900 placeholder:text-gray-400'
            }`}
          />
          <Button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>

      <style>{`
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px var(--glow-color), 0 0 40px var(--glow-color);
          }
          50% {
            box-shadow: 0 0 30px var(--glow-color), 0 0 60px var(--glow-color);
          }
        }
      `}</style>
    </Card>
  );
}