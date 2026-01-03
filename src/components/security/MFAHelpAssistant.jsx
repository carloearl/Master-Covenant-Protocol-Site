import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Bot, Send, Loader2, HelpCircle } from "lucide-react";

export default function MFAHelpAssistant({ step }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I can help you set up MFA. Having trouble scanning the QR code or verifying?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const context = `The user is currently in the "${step}" step of MFA setup. 
      Step 'qr': Scanning QR code. 
      Step 'verify': Entering TOTP code. 
      Step 'codes': Saving recovery codes.
      
      Common issues: 
      - QR not scanning: Suggest manual key entry, checking camera permissions, or screen brightness.
      - Code invalid: Suggest checking time sync on device, ensuring correct app (Google Auth/Authy), or that code didn't expire.
      - Recovery codes: Explain they are valid one-time passwords for emergency access if phone is lost.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a helpful security assistant guiding a user through MFA setup. 
        Context: ${context}
        User Question: ${userMessage}
        
        Provide a concise, friendly, and helpful answer. Focus on troubleshooting or explaining the current step.`,
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting right now. Please try checking your internet connection." }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => setIsOpen(true)}
        className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30 gap-2 text-xs"
      >
        <HelpCircle className="w-4 h-4" />
        Need Help?
      </Button>
    );
  }

  return (
    <Card className="mt-4 bg-slate-950/50 border-slate-800 p-3">
      <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-medium text-slate-200">Security Assistant</span>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsOpen(false)}>
          <span className="sr-only">Close</span>
          ×
        </Button>
      </div>

      <ScrollArea className="h-48 mb-3 pr-2">
        <div className="space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-lg px-3 py-2 text-xs ${
                m.role === 'user' 
                  ? 'bg-cyan-600 text-white' 
                  : 'bg-slate-800 text-slate-300'
              }`}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-800 rounded-lg px-3 py-2">
                <Loader2 className="w-3 h-3 animate-spin text-slate-400" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask for help..."
          className="h-8 text-xs bg-slate-900 border-slate-700"
        />
        <Button size="sm" onClick={handleSend} disabled={loading} className="h-8 w-8 p-0">
          <Send className="w-3 h-3" />
        </Button>
      </div>
    </Card>
  );
}