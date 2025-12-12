import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Loader2, 
  Send, 
  Code, 
  Hammer, 
  Zap,
  Terminal,
  FileCode,
  Database,
  Layout as LayoutIcon,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
  Paperclip,
  X,
  Image as ImageIcon,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';
import SEOHead from '@/components/SEOHead';
import ReactMarkdown from 'react-markdown';

export default function SiteBuilder() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [mode, setMode] = useState('chat'); // 'plan', 'chat', 'code'
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const loadUser = async () => {
    try {
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) {
        toast.error('Please sign in to use Site Builder');
        window.location.href = '/';
        return;
      }
      const userData = await base44.auth.me();
      
      // Check if user is authorized
      const authorizedUsers = ['carloearl@glyphlock.com', 'carloearl@gmail.com'];
      const isAuthorized = userData.role === 'admin' || authorizedUsers.includes(userData.email);
      
      if (!isAuthorized) {
        toast.error('Site Builder access denied. Contact admin for access.');
        window.location.href = '/';
        return;
      }
      
      setUser(userData);
      await initConversation();
    } catch (error) {
      console.error('Auth error:', error);
      toast.error('Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const initConversation = async () => {
    try {
      // Create or load conversation
      const conv = await base44.agents.createConversation({
        agent_name: 'siteBuilder',
        metadata: {
          name: 'Site Builder Session',
          description: 'Building GlyphLock site'
        }
      });
      setConversation(conv);
      setMessages(Array.isArray(conv.messages) ? conv.messages : []);
    } catch (error) {
      console.error('Failed to init conversation:', error);
      toast.error('Failed to initialize agent');
      setMessages([]);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || sending || !conversation) return;

    const modePrefix = mode === 'plan' ? '[PLAN MODE] ' : mode === 'code' ? '[CODE MODE] ' : '';
    const userMessage = {
      role: 'user',
      content: modePrefix + input
    };

    setMessages(prev => Array.isArray(prev) ? [...prev, userMessage] : [userMessage]);
    setInput('');
    setSending(true);

    try {
      const response = await base44.agents.addMessage(conversation, userMessage);
      
      // Subscribe to streaming updates with safety checks
      const unsubscribe = base44.agents.subscribeToConversation(conversation.id, (data) => {
        if (data && Array.isArray(data.messages)) {
          setMessages(data.messages);
        }
      });

      // Cleanup after response complete
      setTimeout(() => unsubscribe(), 100);
      
      toast.success('Agent responding...');
    } catch (error) {
      console.error('Send error:', error);
      toast.error('Failed to send message');
      setMessages(prev => {
        const safePrev = Array.isArray(prev) ? prev : [];
        return [...safePrev, {
          role: 'assistant',
          content: 'Error: ' + error.message
        }];
      });
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

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    const uploaded = [];

    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        // Determine file type
        let fileType = 'document';
        if (file.type.startsWith('image/')) fileType = 'image';
        if (file.name.match(/\.(js|jsx|ts|tsx|json|css)$/)) fileType = 'code';
        
        formData.append('type', fileType);

        const response = await base44.functions.invoke('siteBuilderUpload', formData);
        uploaded.push(response.data.file);
        toast.success(`Uploaded ${file.name}`);
      } catch (error) {
        console.error('Upload failed:', error);
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    setUploadedFiles(prev => [...prev, ...uploaded]);
    setUploading(false);
    e.target.value = null;
  };

  const removeFile = (fileUrl) => {
    setUploadedFiles(prev => prev.filter(f => f.url !== fileUrl));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-indigo-950/20 to-black">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-white">Initializing Site Builder Agent...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title="Site Builder Agent | GlyphLock Development Console"
        description="Autonomous AI agent that can build and modify your entire GlyphLock site"
      />

      <div className="min-h-screen bg-gradient-to-br from-black via-indigo-950/20 to-black">
        {/* Header */}
        <div className="border-b border-blue-500/20 bg-white/5 backdrop-blur-xl sticky top-0 z-50">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                  <Hammer className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-white">Site Builder Agent</h1>
                  <p className="text-sm text-blue-300">Autonomous Full-Stack Development Assistant</p>
                </div>
                </div>
                <div className="flex items-center gap-3">
                {/* Mode Selector */}
                <div className="flex gap-2 bg-white/5 rounded-lg p-1">
                  <button
                    onClick={() => setMode('chat')}
                    className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${
                      mode === 'chat'
                        ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    💬 CHAT
                  </button>
                  <button
                    onClick={() => setMode('plan')}
                    className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${
                      mode === 'plan'
                        ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    📋 PLAN
                  </button>
                  <button
                    onClick={() => setMode('code')}
                    className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${
                      mode === 'code'
                        ? 'bg-violet-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    ⚡ CODE
                  </button>
                </div>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Active
                </Badge>
                </div>
            </div>
          </div>
        </div>

        {/* Mode Info Banner */}
        <div className="container mx-auto px-4 pt-6">
          <div className="mb-6 p-4 rounded-xl border-2 transition-all" style={{
            background: mode === 'chat' ? 'rgba(59,130,246,0.1)' : mode === 'plan' ? 'rgba(99,102,241,0.1)' : 'rgba(139,92,246,0.1)',
            borderColor: mode === 'chat' ? 'rgba(59,130,246,0.3)' : mode === 'plan' ? 'rgba(99,102,241,0.3)' : 'rgba(139,92,246,0.3)'
          }}>
            {mode === 'chat' && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <span className="text-2xl">💬</span>
                </div>
                <div>
                  <h3 className="text-white font-bold">Chat Mode Active</h3>
                  <p className="text-sm text-blue-300">Discuss, explain, and get guidance without executing code changes</p>
                </div>
              </div>
            )}
            {mode === 'plan' && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                  <span className="text-2xl">📋</span>
                </div>
                <div>
                  <h3 className="text-white font-bold">Plan Mode Active</h3>
                  <p className="text-sm text-indigo-300">Strategic thinking, architecture analysis, and implementation roadmaps</p>
                </div>
              </div>
            )}
            {mode === 'code' && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                  <span className="text-2xl">⚡</span>
                </div>
                <div>
                  <h3 className="text-white font-bold">Code Mode Active</h3>
                  <p className="text-sm text-violet-300">Execute changes, create files, and modify codebase (⚠️ admin only)</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Agent Capabilities Panel */}
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-white/5 border-blue-500/20">
              <CardContent className="p-4 flex items-center gap-3">
                <FileCode className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-xs text-blue-300 font-bold">Components</p>
                  <p className="text-sm text-white">Create & Modify</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-indigo-500/20">
              <CardContent className="p-4 flex items-center gap-3">
                <LayoutIcon className="w-5 h-5 text-indigo-400" />
                <div>
                  <p className="text-xs text-indigo-300 font-bold">Pages</p>
                  <p className="text-sm text-white">Full Page Builder</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-violet-500/20">
              <CardContent className="p-4 flex items-center gap-3">
                <Database className="w-5 h-5 text-violet-400" />
                <div>
                  <p className="text-xs text-violet-300 font-bold">Entities</p>
                  <p className="text-sm text-white">Schema Design</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-fuchsia-500/20">
              <CardContent className="p-4 flex items-center gap-3">
                <Terminal className="w-5 h-5 text-fuchsia-400" />
                <div>
                  <p className="text-xs text-fuchsia-300 font-bold">Functions</p>
                  <p className="text-sm text-white">Backend APIs</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Chat Interface */}
          <Card className="bg-white/5 border-blue-500/20 shadow-[0_0_40px_rgba(59,130,246,0.2)]">
            <CardHeader className="border-b border-blue-500/20">
              <CardTitle className="text-white flex items-center gap-2">
                <Code className="w-5 h-5 text-blue-400" />
                Development Console
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {/* Messages Area */}
              <ScrollArea 
                ref={scrollRef}
                className="h-[500px] p-6 space-y-4"
              >
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <Sparkles className="w-16 h-16 text-blue-400 mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-bold text-white mb-2">Ready to Build</h3>
                    <p className="text-blue-300 mb-6">Tell me what you want to create or modify</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                      <button
                        onClick={() => setInput('Create a new dashboard page with analytics cards')}
                        className="p-4 rounded-xl bg-white/5 border border-blue-500/20 hover:border-blue-500/40 transition-all text-left"
                      >
                        <Code className="w-5 h-5 text-blue-400 mb-2" />
                        <p className="text-sm text-white font-semibold">Create Dashboard</p>
                        <p className="text-xs text-blue-300">New analytics page</p>
                      </button>
                      <button
                        onClick={() => setInput('Add a new entity for tracking user sessions')}
                        className="p-4 rounded-xl bg-white/5 border border-indigo-500/20 hover:border-indigo-500/40 transition-all text-left"
                      >
                        <Database className="w-5 h-5 text-indigo-400 mb-2" />
                        <p className="text-sm text-white font-semibold">Create Entity</p>
                        <p className="text-xs text-indigo-300">New database schema</p>
                      </button>
                      <button
                        onClick={() => setInput('Fix the mobile navigation menu - buttons not working')}
                        className="p-4 rounded-xl bg-white/5 border border-violet-500/20 hover:border-violet-500/40 transition-all text-left"
                      >
                        <Zap className="w-5 h-5 text-violet-400 mb-2" />
                        <p className="text-sm text-white font-semibold">Fix Bugs</p>
                        <p className="text-xs text-violet-300">Debug and repair</p>
                      </button>
                      <button
                        onClick={() => setInput('Refactor the authentication flow for better security')}
                        className="p-4 rounded-xl bg-white/5 border border-fuchsia-500/20 hover:border-fuchsia-500/40 transition-all text-left"
                      >
                        <RefreshCw className="w-5 h-5 text-fuchsia-400 mb-2" />
                        <p className="text-sm text-white font-semibold">Refactor Code</p>
                        <p className="text-xs text-fuchsia-300">Improve architecture</p>
                      </button>
                    </div>
                  </div>
                ) : (
                  Array.isArray(messages) && messages.length > 0 ? (
                    messages.map((msg, idx) => (
                      <MessageBubble key={idx} message={msg} />
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Sparkles className="w-16 h-16 text-blue-400 mx-auto mb-4 opacity-50" />
                      <h3 className="text-xl font-bold text-white mb-2">Ready to Build</h3>
                      <p className="text-blue-300 mb-6">Tell me what you want to create or modify</p>
                    </div>
                  )
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
                {/* Uploaded Files Preview */}
                {uploadedFiles.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {uploadedFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 border border-blue-500/20">
                        {file.type.startsWith('image/') ? (
                          <ImageIcon className="w-4 h-4 text-blue-400" />
                        ) : (
                          <FileText className="w-4 h-4 text-indigo-400" />
                        )}
                        <span className="text-xs text-white truncate max-w-[150px]">{file.name}</span>
                        <button
                          onClick={() => removeFile(file.url)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,.pdf,.txt,.js,.jsx,.json,.css"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading || sending}
                    variant="outline"
                    className="bg-white/5 border-blue-500/20 hover:bg-white/10"
                  >
                    {uploading ? (
                      <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                    ) : (
                      <Paperclip className="w-5 h-5 text-blue-400" />
                    )}
                  </Button>
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={
                      mode === 'chat' ? 'Ask a question or discuss the codebase...' :
                      mode === 'plan' ? 'Describe what you want to plan or architect...' :
                      'Describe the code changes to execute...'
                    }
                    className="flex-1 bg-white/5 border-blue-500/20 text-white placeholder:text-blue-300/50 min-h-[60px] max-h-[200px]"
                    disabled={sending}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!input.trim() || sending}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8"
                  >
                    {sending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-blue-300 mt-2">
                  Press Enter to send • Shift + Enter for new line • Attach images & code files
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  const isToolCall = message.tool_calls && message.tool_calls.length > 0;

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] rounded-2xl p-4 ${
        isUser 
          ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white' 
          : 'bg-white/10 backdrop-blur-md border border-white/10 text-white'
      }`}>
        {/* Message Content */}
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

        {/* Tool Calls */}
        {isToolCall && (
          <div className="mt-3 space-y-2">
            {message.tool_calls.map((tool, idx) => (
              <ToolCallCard key={idx} toolCall={tool} />
            ))}
          </div>
        )}

        {/* Timestamp */}
        <div className="flex items-center gap-1 mt-2 text-xs opacity-60">
          <Clock className="w-3 h-3" />
          {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}

function ToolCallCard({ toolCall }) {
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

  return (
    <div className="bg-black/30 rounded-lg p-3 border border-blue-500/20">
      <div className="flex items-center gap-2 mb-2">
        {getStatusIcon()}
        <span className="text-xs font-mono text-blue-300">{toolCall.name}</span>
      </div>
      {toolCall.results && (
        <div className="text-xs text-green-400 font-mono mt-2">
          {typeof toolCall.results === 'string' ? toolCall.results : JSON.stringify(toolCall.results, null, 2)}
        </div>
      )}
    </div>
  );
}