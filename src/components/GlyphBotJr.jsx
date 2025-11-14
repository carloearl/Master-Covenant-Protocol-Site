import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { MessageCircle, X, Send, Home, Shield, Lock, Zap, BookOpen, HelpCircle, Bot, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function GlyphBotJr({ darkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "👋 Hi! I'm GlyphBot Jr., your AI navigation assistant powered by multiple LLMs. Ask me anything about GlyphLock!"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("gpt-4");

  const models = [
    { value: "gpt-4", label: "GPT-4", icon: "🤖" },
    { value: "claude", label: "Claude", icon: "🧠" },
    { value: "gemini", label: "Gemini", icon: "✨" }
  ];

  const quickLinks = [
    { icon: Home, label: "Home", page: "Home" },
    { icon: Shield, label: "Security Tools", page: "SecurityTools" },
    { icon: Lock, label: "QR Generator", page: "QRGenerator" },
    { icon: Zap, label: "GlyphBot AI", page: "GlyphBot" },
    { icon: BookOpen, label: "Documentation", page: "SecurityDocs" },
    { icon: HelpCircle, label: "Contact", page: "Contact" }
  ];

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are GlyphBot Jr., a friendly AI navigation assistant for GlyphLock Security Platform.

Available pages: Home, N.U.P.S. POS, Security Tools, QR Generator, Steganography, Blockchain, HSSS Surveillance, GlyphBot AI, Hotzone Mapper, Pricing, Security Docs, Contact, Consultation, About, Roadmap.

User question: ${userMessage}

Provide a helpful, concise response (2-3 sentences max). Be friendly and guide them to relevant pages. DO NOT repeat previous responses. Give fresh, unique answers each time.`,
        add_context_from_internet: false
      });

      setMessages(prev => [...prev, { role: "assistant", content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "I apologize, I'm having trouble connecting right now. Please try the quick links below!" 
      }]);
    }

    setLoading(false);
  };

  return (
    <>
      {/* Chat Button - Fixed Bottom Right */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 border-2 border-blue-500/50"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div 
          className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[550px] rounded-2xl shadow-2xl overflow-hidden"
          style={{
            background: darkMode 
              ? 'rgba(17, 24, 39, 0.95)' 
              : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: darkMode ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid rgba(59, 130, 246, 0.4)'
          }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6 text-white" />
              <div>
                <span className="font-bold text-white block">GlyphBot Jr.</span>
                <span className="text-xs text-white/80">Multi-LLM Assistant</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Model Selector */}
          <div className={`p-3 border-b ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-300 bg-gray-100/50'}`}>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className={`h-8 text-xs ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}>
                  {models.map(model => (
                    <SelectItem key={model.value} value={model.value} className="text-xs">
                      {model.icon} {model.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Powered by {models.find(m => m.value === selectedModel)?.label}</span>
            </div>
          </div>

          {/* Messages */}
          <div className="p-4 h-[300px] overflow-y-auto space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : darkMode 
                        ? 'bg-gray-700 text-white'
                        : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-300'} p-3`}>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2 font-semibold`}>Quick Access:</p>
            <div className="grid grid-cols-3 gap-2">
              {quickLinks.map((link, idx) => (
                <Link 
                  key={idx} 
                  to={createPageUrl(link.page)}
                  onClick={() => setIsOpen(false)}
                >
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={`w-full text-xs ${
                      darkMode 
                        ? 'border-gray-600 hover:bg-blue-500/20 hover:border-blue-500' 
                        : 'border-gray-300 hover:bg-blue-500/10 hover:border-blue-500'
                    }`}
                  >
                    <link.icon className="w-3 h-3 mr-1" />
                    {link.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-300'} p-3`}>
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything..."
                className={`flex-1 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
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