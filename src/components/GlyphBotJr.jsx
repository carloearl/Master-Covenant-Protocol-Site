import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { MessageCircle, X, Send, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function GlyphBotJr() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi, I'm GlyphBot Jr. How can I help you navigate GlyphLock Security today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const quickLinks = [
    { label: "Home", page: "Home" },
    { label: "N.U.P.S. POS", page: "NUPSLogin" },
    { label: "Security Tools", page: "SecurityTools" },
    { label: "Visual Cryptography", page: "VisualCryptography" },
    { label: "Security Operations", page: "SecurityOperationsCenter" },
    { label: "GlyphBot AI", page: "GlyphBot" },
    { label: "Governance Hub", page: "GovernanceHub" },
    { label: "Pricing", page: "Pricing" }
  ];

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const { QR_KNOWLEDGE_BASE } = await import('./qr/QrKnowledgeBase');
      const { default: faqData } = await import('@/components/content/faqMasterData');
      
      const faqContext = faqData.map(item => 
        `Q: ${item.q}\nA: ${item.a.join(' ')}`
      ).join('\n\n');
      
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are GlyphBot Jr., a professional AI navigation assistant for GlyphLock Security Platform.

Available pages: Home, QR Studio, Image Lab, N.U.P.S. POS, Security Tools, Visual Cryptography, Security Operations Center, Blockchain, GlyphBot AI, Governance Hub, Pricing, Contact, Consultation, FAQ.

QR Studio Knowledge Base:
${QR_KNOWLEDGE_BASE}

GlyphLock FAQ Knowledge Base (use this to answer common questions):
${faqContext}

User question: ${userMessage}

Provide a helpful, professional response (2-3 sentences max). No emojis. Guide them to relevant pages. If they ask common questions, use the FAQ knowledge base first. Keep responses unique and varied.`,
        add_context_from_internet: false
      });

      setMessages(prev => [...prev, { role: "assistant", content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "I apologize for the connection issue. Please use the menu to navigate or try again." 
      }]);
    }

    setLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 border-2 border-blue-500/50"
        aria-label="Open chat assistant"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[500px] rounded-2xl shadow-2xl overflow-hidden glass-royal">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/61e45d108_glyphbot-size-lg.png"
                alt="GlyphBot"
                className="w-8 h-8 rounded-full bg-white/10 p-1"
              />
              <div>
                <span className="font-bold text-white block">GlyphBot Jr.</span>
                <span className="text-xs text-white/80">Navigation Assistant</span>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/10"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-2">
                  <p className="text-xs font-semibold text-white">Quick Navigation</p>
                </div>
                <DropdownMenuSeparator />
                {quickLinks.map((link, idx) => (
                  <DropdownMenuItem key={idx} asChild>
                    <Link 
                      to={createPageUrl(link.page)}
                      onClick={() => setIsOpen(false)}
                      className="cursor-pointer text-white"
                    >
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="p-4 h-[340px] overflow-y-auto space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'glass-card text-white'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="glass-card p-3 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-blue-500/30 p-3">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything..."
                className="flex-1 text-white"
                disabled={loading}
              />
              <Button 
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}