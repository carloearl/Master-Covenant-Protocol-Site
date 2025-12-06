import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Send, Sparkles, Trash2, Download, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';

export default function ChatStudio() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      content: '👋 Welcome to Chat Studio! I\'m your AI assistant powered by advanced language models. Ask me anything!'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const messagesEndRef = useRef(null);
  const speechSynthRef = useRef(null);

  useEffect(() => {
    if (!isLoading && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }
  }, [messages, isLoading]);

  const speak = (text) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en'));
    if (englishVoice) utterance.voice = englishVoice;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const conversationContext = messages.map(m => ({
        role: m.role,
        content: m.content
      })).concat([{ role: 'user', content: userMessage.content }]);

      const prompt = conversationContext.map(m => `${m.role}: ${m.content}`).join('\n\n');

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: prompt + '\n\nassistant:',
        add_context_from_internet: false
      });

      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      if (voiceEnabled) {
        speak(response);
      }

    } catch (error) {
      toast.error('Failed to get response');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([{
      id: '1',
      role: 'assistant',
      content: '👋 Chat cleared! Ready for a fresh conversation.'
    }]);
  };

  const handleExport = () => {
    const transcript = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n');
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Chat exported');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/20 to-slate-950 text-white">
      <div className="max-w-5xl mx-auto h-screen flex flex-col px-4 py-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/50">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Chat Studio
              </h1>
              <p className="text-sm text-slate-400">AI-Powered Assistant</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              variant="outline"
              size="sm"
              className={`border-slate-700 ${voiceEnabled ? 'bg-purple-500/20 text-purple-300' : 'text-slate-400'}`}
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
            <Button
              onClick={handleExport}
              variant="outline"
              size="sm"
              className="border-slate-700 text-slate-400 hover:text-white"
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleClear}
              variant="outline"
              size="sm"
              className="border-slate-700 text-slate-400 hover:text-red-400"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto mb-6 space-y-4 pr-2 overscroll-contain scroll-smooth" style={{ overscrollBehaviorY: 'contain' }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-5 py-4 ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 text-slate-100 shadow-lg'
                }`}
              >
                <ReactMarkdown
                  className="prose prose-invert prose-sm max-w-none"
                  components={{
                    p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc ml-4 mb-2 space-y-1">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal ml-4 mb-2 space-y-1">{children}</ol>,
                    code: ({ inline, children }) =>
                      inline ? (
                        <code className="bg-slate-900 px-2 py-0.5 rounded text-blue-300 text-sm">{children}</code>
                      ) : (
                        <pre className="bg-slate-900 p-3 rounded-lg overflow-x-auto my-2">
                          <code className="text-sm text-blue-300">{children}</code>
                        </pre>
                      ),
                    a: ({ children, href }) => (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                        {children}
                      </a>
                    ),
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl px-5 py-4 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="ml-2 text-slate-400 text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-slate-900/80 backdrop-blur-sm border-2 border-slate-700/50 rounded-2xl p-4 shadow-xl">
          <div className="flex items-end gap-3">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSend();
                }
              }}
              placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
              className="flex-1 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 resize-none focus:ring-2 focus:ring-blue-500/50 min-h-[60px] max-h-[200px]"
              rows={2}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-6 py-6 shadow-lg shadow-blue-600/30"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>Press Enter to send • Shift+Enter for new line</span>
            {voiceEnabled && <span className="text-purple-400">🔊 Voice enabled</span>}
          </div>
        </div>
      </div>
    </div>
  );
}