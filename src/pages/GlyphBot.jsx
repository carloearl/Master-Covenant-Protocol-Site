import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Brain, Send, Plus, Upload, Trash2, MessageSquare,
  Sparkles, Shield, Code, FileText, User, Mic, Square
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import MessageBubble from "../components/glyphbot/MessageBubble";
import ConversationList from "../components/glyphbot/ConversationList";
import PersonaSelector from "../components/glyphbot/PersonaSelector";
import CodeExecutor from "../components/glyphbot/CodeExecutor";
import SecurityScanner from "../components/glyphbot/SecurityScanner";
import AuditGenerator from "../components/glyphbot/AuditGenerator";
import LanguageSelector from "../components/glyphbot/LanguageSelector";
import KnowledgeBaseConnector from "../components/glyphbot/KnowledgeBaseConnector";
import FileAnalysisView from "../components/glyphbot/FileAnalysisView";
import FreeTrialGuard from "@/components/FreeTrialGuard";

export default function GlyphBot() {
  const [user, setUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedPersona, setSelectedPersona] = useState("default");
  const [autoRead, setAutoRead] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [knowledgeBases, setKnowledgeBases] = useState([]);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        loadConversations();
      } catch {
        base44.auth.redirectToLogin('/glyphbot');
      }
    };
    init();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!currentConversation?.id) return;
    const unsubscribe = base44.agents.subscribeToConversation(
      currentConversation.id,
      (data) => {
        setMessages(data.messages || []);
        setIsLoading(false);
      }
    );
    return () => unsubscribe();
  }, [currentConversation?.id]);

  const loadConversations = async () => {
    try {
      const convos = await base44.agents.listConversations({ agent_name: "glyphbot" });
      const deleted = JSON.parse(localStorage.getItem('glyphbot-deleted-conversations') || '[]');
      setConversations(convos.filter(c => !deleted.includes(c.id)));
    } catch (e) {
      console.error("Error loading conversations:", e);
    }
  };

  const createNewConversation = async () => {
    const convo = await base44.agents.createConversation({
      agent_name: "glyphbot",
      metadata: { name: `GlyphBot Chat - ${new Date().toLocaleString()}` }
    });
    setCurrentConversation(convo);
    setMessages([]);
    loadConversations();
  };

  const selectConversation = async (id) => {
    const convo = await base44.agents.getConversation(id);
    setCurrentConversation(convo);
    setMessages(convo.messages || []);
  };

  const handleFiles = (e) => {
    if (e.target.files) setSelectedFiles(Array.from(e.target.files));
  };

  const uploadFiles = async () => {
    const urls = [];
    for (const file of selectedFiles) {
      try {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        urls.push(file_url);
      } catch (e) {
        console.error("File upload error:", e);
      }
    }
    return urls;
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() && !selectedFiles.length) return;
    if (!currentConversation) return await createNewConversation();

    let content = inputMessage.trim();
    setInputMessage("");
    setIsLoading(true);

    if (selectedPersona !== "default") {
      const personaMap = {
        "ethical-hacker": "As an ethical hacker: ",
        "senior-developer": "As a senior developer: ",
        "security-auditor": "As a security auditor: ",
        "smart-contract-auditor": "As a smart contract auditor: "
      };
      content = personaMap[selectedPersona] + content;
    }

    if (selectedLanguage !== 'en') {
      const langNames = { 
        es: 'Spanish', fr: 'French', de: 'German', it: 'Italian', 
        pt: 'Portuguese', ru: 'Russian', zh: 'Chinese', ja: 'Japanese',
        ko: 'Korean', ar: 'Arabic', hi: 'Hindi', tr: 'Turkish',
        pl: 'Polish', nl: 'Dutch', sv: 'Swedish'
      };
      content = `[${langNames[selectedLanguage]}] ${content}`;
    }

    if (knowledgeBases.length > 0) {
      content += `\n[KB: ${knowledgeBases.map(k => k.url).join(', ')}]`;
    }

    const urls = selectedFiles.length ? await uploadFiles() : [];
    if (urls.length > 1) content = `[Analyzing ${urls.length} files]\n${content}`;
    setSelectedFiles([]);

    await base44.agents.addMessage(currentConversation, {
      role: "user",
      content: content || `Analyze attached files`,
      file_urls: urls.length ? urls : undefined
    });
  };

  const deleteConversation = (id, e) => {
    e?.stopPropagation();
    if (!window.confirm("Delete this conversation?")) return;
    const deleted = JSON.parse(localStorage.getItem('glyphbot-deleted-conversations') || '[]');
    deleted.push(id);
    localStorage.setItem('glyphbot-deleted-conversations', JSON.stringify(deleted));
    setConversations(prev => prev.filter(c => c.id !== id));
    if (currentConversation?.id === id) {
      setCurrentConversation(null);
      setMessages([]);
    }
  };

  const startRecording = () => {
    try {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) return alert("Speech recognition not supported");
      const rec = new SR();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "en-US";

      rec.onstart = () => setIsRecording(true);
      rec.onresult = (e) => {
        setInputMessage(e.results[0][0].transcript);
        setIsRecording(false);
      };
      rec.onerror = () => setIsRecording(false);
      rec.onend = () => setIsRecording(false);

      rec.start();
      mediaRecorderRef.current = rec;
    } catch (e) {
      console.error("Voice error:", e);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <FreeTrialGuard serviceName="GlyphBot">
      <div className="min-h-screen bg-black text-white relative">

        <div className="fixed inset-0 opacity-20 pointer-events-none">
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/8cd0364f8_Whisk_2bd57b9a449d359968944ab33f98257edr-Copy.jpg"
            alt="bg"
            className="w-full h-full object-cover"
          />
        </div>

        <header className="relative z-10 bg-blue-900/20 backdrop-blur-md border-b border-blue-500/30 p-4">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/50">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">GlyphBot Advanced</h1>
                <p className="text-sm text-white/80">AI Security Expert powered by Gemini</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSelector selectedLanguage={selectedLanguage} onSelect={setSelectedLanguage} />
              {user && (
                <div className="hidden md:flex items-center gap-2 text-white">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{user.email}</span>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="container mx-auto p-4 relative z-10">
          <Tabs defaultValue="chat" className="space-y-6">

            <TabsList className="bg-blue-900/30 backdrop-blur-md border border-blue-500/30">
              <TabsTrigger value="chat" className="text-white data-[state=active]:bg-blue-500/30">AI Chat</TabsTrigger>
              <TabsTrigger value="files" className="text-white data-[state=active]:bg-blue-500/30">File Analysis</TabsTrigger>
              <TabsTrigger value="executor" className="text-white data-[state=active]:bg-blue-500/30">Code Executor</TabsTrigger>
              <TabsTrigger value="scanner" className="text-white data-[state=active]:bg-blue-500/30">Security Scanner</TabsTrigger>
              <TabsTrigger value="audit" className="text-white data-[state=active]:bg-blue-500/30">Audit Generator</TabsTrigger>
            </TabsList>

            <TabsContent value="chat">
              <div className="grid lg:grid-cols-4 gap-6 max-w-7xl mx-auto">

                <div className="lg:col-span-1 space-y-4">
                  <Card className="bg-blue-900/20 border-blue-500/30 backdrop-blur-md">
                    <CardHeader><CardTitle className="text-white">AI Persona</CardTitle></CardHeader>
                    <CardContent>
                      <PersonaSelector selectedPersona={selectedPersona} onSelect={setSelectedPersona} />
                    </CardContent>
                  </Card>

                  <Card className="bg-blue-900/20 border-blue-500/30 backdrop-blur-md">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white">Conversations</CardTitle>
                        <Button
                          size="sm"
                          onClick={createNewConversation}
                          className="bg-blue-500/30 hover:bg-blue-500/50 h-8 text-white border border-blue-500/50"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ConversationList
                        conversations={conversations}
                        currentConversation={currentConversation}
                        onSelect={selectConversation}
                        onDelete={deleteConversation}
                      />
                    </CardContent>
                  </Card>

                  <KnowledgeBaseConnector onKnowledgeAdded={() => {
                    const saved = localStorage.getItem('glyphbot-knowledge-bases');
                    setKnowledgeBases(saved ? JSON.parse(saved) : []);
                  }} />

                  <Card className="bg-blue-900/20 border-blue-500/30 backdrop-blur-md">
                    <CardHeader><CardTitle className="text-white">Capabilities</CardTitle></CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="flex items-center gap-2"><Shield className="w-4 h-4" /><span>Security Analysis</span></div>
                      <div className="flex items-center gap-2"><Code className="w-4 h-4" /><span>Code Generation</span></div>
                      <div className="flex items-center gap-2"><FileText className="w-4 h-4" /><span>Smart Contracts</span></div>
                      <div className="flex items-center gap-2"><Sparkles className="w-4 h-4" /><span>File Analysis</span></div>
                    </CardContent>
                  </Card>
                </div>

                <div className="lg:col-span-3">
                  <Card className="bg-blue-900/20 backdrop-blur-md border-blue-500/30 h-[calc(100vh-12rem)]">
                    <CardHeader className="border-b border-blue-500/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-white">
                            {currentConversation?.metadata?.name || "Start a New Conversation"}
                          </CardTitle>
                          {currentConversation && (
                            <p className="text-sm text-white/80 mt-1">
                              {messages.length} messages • {selectedPersona.replace('-', ' ')} mode • {selectedLanguage.toUpperCase()}
                              {knowledgeBases.length > 0 && ` • ${knowledgeBases.length} KB`}
                            </p>
                          )}
                        </div>
                        <Badge variant="outline" className="border-blue-500/50 text-white bg-blue-500/20">
                          <Brain className="w-3 h-3 mr-1" /> Gemini
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="flex flex-col h-[calc(100%-5rem)]">
                      <div className="flex-1 overflow-y-auto space-y-4 py-4">
                        {!currentConversation ? (
                          <div className="h-full flex items-center justify-center text-center">
                            <Brain className="w-16 h-16 text-white mx-auto mb-4" />
                            <h3 className="text-xl font-bold mb-2 text-white">Welcome to GlyphBot Advanced</h3>
                            <p className="text-white/80 mb-6 max-w-md">Your AI cybersecurity expert.</p>
                            <Button onClick={createNewConversation} className="bg-blue-500/30 border-blue-500/50 text-white">
                              <MessageSquare className="w-4 h-4 mr-2" /> Start New Chat
                            </Button>
                          </div>
                        ) : messages.length === 0 ? (
                          <div className="h-full flex items-center justify-center text-white/70">Send a message to begin</div>
                        ) : (
                          <>
                            {messages.map((m, i) => <MessageBubble key={i} message={m} autoRead={autoRead} />)}
                            <div ref={messagesEndRef} />
                          </>
                        )}
                      </div>

                      <div className="border-t border-blue-500/30 pt-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <Switch id="auto-read" checked={autoRead} onCheckedChange={setAutoRead} />
                          <Label htmlFor="auto-read" className="text-white text-sm">Auto-read responses</Label>
                        </div>

                        {selectedFiles.length > 0 && (
                          <div className="glass-dark rounded-lg p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-blue-400">{selectedFiles.length} file(s)</span>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-400 h-6"
                                onClick={() => setSelectedFiles([])}
                              >
                                Clear All
                              </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {selectedFiles.map((file, idx) => (
                                <div key={idx} className="glass-dark border-blue-500/30 rounded px-2 py-1 flex items-center gap-2 text-xs">
                                  <FileText className="w-3 h-3 text-blue-400" />
                                  <span className="max-w-[150px] truncate">{file.name}</span>
                                  <button
                                    onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== idx))}
                                    className="text-red-400 hover:text-red-300"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <form onSubmit={sendMessage} className="flex gap-2">
                          <input type="file" ref={fileInputRef} onChange={handleFiles} multiple className="hidden" />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => fileInputRef.current?.click()}
                            className="border-blue-500/50 text-white"
                          >
                            <Upload className="w-4 h-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={isRecording ? stopRecording : startRecording}
                            className={`border-blue-500/50 text-white ${isRecording ? 'bg-red-500/30' : ''}`}
                          >
                            {isRecording ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                          </Button>
                          <Input
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Ask GlyphBot anything..."
                            disabled={isLoading}
                            className="bg-blue-900/30 text-white border-blue-500/30 flex-1"
                          />
                          <Button
                            type="submit"
                            className="bg-blue-500/50 text-white border-blue-500/50"
                            disabled={isLoading || (!inputMessage.trim() && !selectedFiles.length)}
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        </form>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="files"><FileAnalysisView /></TabsContent>
            <TabsContent value="executor"><CodeExecutor /></TabsContent>
            <TabsContent value="scanner"><SecurityScanner /></TabsContent>
            <TabsContent value="audit"><AuditGenerator /></TabsContent>

          </Tabs>
        </div>
      </div>
    </FreeTrialGuard>
  );
}