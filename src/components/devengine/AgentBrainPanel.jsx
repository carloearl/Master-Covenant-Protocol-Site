import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { BrainCircuit, Send, Loader2, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

export default function AgentBrainPanel() {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [mode, setMode] = useState('build');
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [plan, setPlan] = useState([]);
  const scrollRef = useRef(null);

  // Safety guards - ensure arrays are always valid
  const safeMessages = Array.isArray(messages) ? messages : [];
  const safePlan = Array.isArray(plan) ? plan : [];

  useEffect(() => {
    initConversation();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [safeMessages]);

  useEffect(() => {
    // Extract plan from latest assistant message
    if (!Array.isArray(messages) || messages.length === 0) return;
    
    const lastAssistant = [...messages].reverse().find(m => m && m.role === 'assistant');
    if (lastAssistant && lastAssistant.content) {
      const steps = extractPlanSteps(lastAssistant.content);
      if (Array.isArray(steps) && steps.length > 0) {
        setPlan(steps);
      }
    }
  }, [messages]);

  const initConversation = async () => {
    try {
      const conv = await base44.agents.createConversation({
        agent_name: 'siteBuilder',
        metadata: {
          name: 'Agent Brain Session',
          description: 'GlyphLock Site Builder Agent Brain'
        }
      });
      setConversation(conv);
      const initialMessages = Array.isArray(conv.messages) ? conv.messages : [];
      setMessages(initialMessages);
      
      // Subscribe to updates
      const unsubscribe = base44.agents.subscribeToConversation(conv.id, (data) => {
        if (data && data.messages) {
          const newMessages = Array.isArray(data.messages) ? data.messages : [];
          setMessages(newMessages);
        }
      });
      
      return () => {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      };
    } catch (error) {
      console.error('Failed to init agent:', error);
      toast.error('Failed to initialize Agent Brain');
      setMessages([]);
    }
  };

  const extractPlanSteps = (content) => {
    const lines = content.split('\n');
    const steps = [];
    let stepNumber = 1;
    
    for (const line of lines) {
      // Match numbered lists: 1. or 1) or - or * 
      if (/^\s*(\d+[\.)]\s+|-\s+|\*\s+)/.test(line)) {
        const cleanLine = line.replace(/^\s*(\d+[\.)]\s+|-\s+|\*\s+)/, '').trim();
        if (cleanLine.length > 0) {
          steps.push({
            id: stepNumber++,
            label: cleanLine.slice(0, 80),
            status: 'pending'
          });
        }
      }
    }
    
    return steps;
  };

  const sendMessage = async () => {
    if (!input.trim() || sending || !conversation) return;

    const modePrefix = {
      explain: '[MODE: EXPLAIN] ',
      build: '[MODE: BUILD] ',
      refactor: '[MODE: REFACTOR] ',
      debug: '[MODE: DEBUG] '
    }[mode] || '[MODE: BUILD] ';

    const userMessage = {
      role: 'user',
      content: modePrefix + input.trim()
    };

    const prevMessages = Array.isArray(messages) ? messages : [];
    setMessages([...prevMessages, userMessage]);
    setInput('');
    setSending(true);

    try {
      await base44.agents.addMessage(conversation, userMessage);
      toast.success('Agent processing...');
    } catch (error) {
      console.error('Send error:', error);
      toast.error('Failed to send message');
      const prevMessages = Array.isArray(messages) ? messages : [];
      setMessages([...prevMessages, {
        role: 'assistant',
        content: 'Error: ' + error.message
      }]);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getModeConfig = () => {
    const configs = {
      explain: { color: 'bg-cyan-500', label: 'Explain', icon: '💡' },
      build: { color: 'bg-blue-500', label: 'Build', icon: '🔨' },
      refactor: { color: 'bg-indigo-500', label: 'Refactor', icon: '♻️' },
      debug: { color: 'bg-red-500', label: 'Debug', icon: '🐛' }
    };
    return configs[mode] || configs.build;
  };

  const modeConfig = getModeConfig();

  return (
    <div className="h-full flex gap-4">
      {/* Left: Mode Selector & Plan */}
      <div className="w-80 flex flex-col gap-4">
        {/* Mode Selector */}
        <Card className="bg-white/5 border-blue-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-blue-400" />
              Agent Mode
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {['explain', 'build', 'refactor', 'debug'].map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`w-full px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  mode === m
                    ? `${getModeConfig().color} text-white shadow-lg`
                    : 'bg-white/5 text-blue-300 hover:bg-white/10'
                }`}
              >
                <span className="mr-2">{getModeConfig().icon}</span>
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Plan Steps */}
        {safePlan.length > 0 && (
          <Card className="bg-white/5 border-indigo-500/20 flex-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm flex items-center gap-2">
                📋 Agent Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {safePlan.map((step, idx) => (
                    <div
                      key={step.id}
                      className="flex items-start gap-2 p-2 rounded-lg bg-white/5 border border-white/10"
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {step.status === 'done' && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                        {step.status === 'active' && <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />}
                        {step.status === 'pending' && <Clock className="w-4 h-4 text-slate-400" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-slate-200 leading-relaxed">
                          {step.label}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Right: Chat Interface */}
      <Card className="flex-1 bg-white/5 border-blue-500/20 flex flex-col">
        <CardHeader className="border-b border-blue-500/20">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <div className={`w-10 h-10 rounded-lg ${modeConfig.color}/30 flex items-center justify-center`}>
                <BrainCircuit className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-base">GlyphLock Agent Brain</div>
                <div className="text-xs text-blue-300 font-normal">
                  Mode: {modeConfig.label} {modeConfig.icon}
                </div>
              </div>
            </CardTitle>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Active
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0 flex-1 flex flex-col">
          {/* Messages */}
          <ScrollArea ref={scrollRef} className="flex-1 p-4 space-y-4">
            {safeMessages.length === 0 ? (
              <div className="text-center py-12">
                <BrainCircuit className="w-16 h-16 text-blue-400 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold text-white mb-2">Agent Brain Ready</h3>
                <p className="text-blue-300 mb-6">
                  Current Mode: <span className="font-bold">{modeConfig.label}</span>
                </p>
                <div className="grid grid-cols-2 gap-3 max-w-2xl mx-auto text-left">
                  <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                    <div className="text-sm text-white font-semibold mb-1">💡 Explain</div>
                    <p className="text-xs text-cyan-300">
                      Get insights, documentation, and architectural guidance
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <div className="text-sm text-white font-semibold mb-1">🔨 Build</div>
                    <p className="text-xs text-blue-300">
                      Create components, pages, and features from scratch
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                    <div className="text-sm text-white font-semibold mb-1">♻️ Refactor</div>
                    <p className="text-xs text-indigo-300">
                      Improve code quality, performance, and architecture
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                    <div className="text-sm text-white font-semibold mb-1">🐛 Debug</div>
                    <p className="text-xs text-red-300">
                      Find and fix bugs, errors, and unexpected behavior
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              safeMessages.map((msg, idx) => (
                <MessageBubble key={idx} message={msg} />
              ))
            )}
            {sending && (
              <div className="flex items-center gap-2 text-blue-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Agent processing...</span>
              </div>
            )}
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t border-blue-500/20 p-4 bg-white/5">
            <div className="flex gap-3">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`[${modeConfig.label} Mode] Describe what you want the agent to do...`}
                className="flex-1 bg-white/5 border-blue-500/20 text-white placeholder:text-blue-300/50"
                disabled={sending}
              />
              <Button
                onClick={sendMessage}
                disabled={!input.trim() || sending}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6"
              >
                {sending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
            <p className="text-xs text-blue-300 mt-2">
              Press Enter to send • Shift + Enter for new line
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MessageBubble({ message }) {
  if (!message) return null;
  
  const isUser = message.role === 'user';
  const hasToolCalls = message.tool_calls && Array.isArray(message.tool_calls) && message.tool_calls.length > 0;

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] rounded-2xl p-4 ${
        isUser 
          ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white' 
          : 'bg-white/10 backdrop-blur-md border border-white/10 text-white'
      }`}>
        {message.content && (
          <ReactMarkdown
            className="prose prose-invert prose-sm max-w-none"
            components={{
              code: ({ inline, children }) => inline ? (
                <code className="px-1.5 py-0.5 rounded bg-black/30 text-cyan-300 text-xs font-mono">
                  {children}
                </code>
              ) : (
                <pre className="bg-black/50 rounded-lg p-3 overflow-x-auto text-xs">
                  <code className="text-green-400 font-mono">{children}</code>
                </pre>
              ),
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>
            }}
          >
            {message.content}
          </ReactMarkdown>
        )}

        {hasToolCalls && (
          <div className="mt-3 space-y-2">
            {(message.tool_calls || []).map((tool, idx) => (
              <ToolCallCard key={idx} toolCall={tool} />
            ))}
          </div>
        )}

        <div className="flex items-center gap-1 mt-2 text-xs opacity-60">
          <Clock className="w-3 h-3" />
          {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}

function ToolCallCard({ toolCall }) {
  if (!toolCall) return null;
  
  const getStatusIcon = () => {
    switch (toolCall.status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Loader2 className="w-4 h-4 animate-spin text-blue-400" />;
    }
  };

  const getStatusColor = () => {
    switch (toolCall.status) {
      case 'completed':
        return 'border-green-500/30 bg-green-500/10';
      case 'failed':
        return 'border-red-500/30 bg-red-500/10';
      default:
        return 'border-blue-500/30 bg-blue-500/10';
    }
  };

  return (
    <div className={`rounded-lg p-3 border ${getStatusColor()} transition-colors`}>
      <div className="flex items-center gap-2 mb-2">
        {getStatusIcon()}
        <span className="text-xs font-mono text-blue-300 font-semibold">{toolCall.name}</span>
      </div>
      {toolCall.results && (
        <div className="text-xs text-green-400/90 font-mono mt-2 bg-black/30 rounded p-2 overflow-x-auto">
          <pre className="whitespace-pre-wrap break-words">
            {typeof toolCall.results === 'string' ? toolCall.results : JSON.stringify(toolCall.results, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}