
import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Brain, Send, Plus, Upload, Trash2, MessageSquare,
  Sparkles, Shield, Code, FileText, User
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import MessageBubble from "../components/glyphbot/MessageBubble";
import ConversationList from "../components/glyphbot/ConversationList";
import PersonaSelector from "../components/glyphbot/PersonaSelector";
import CodeExecutor from "../components/glyphbot/CodeExecutor";
import SecurityScanner from "../components/glyphbot/SecurityScanner";
import AuditGenerator from "../components/glyphbot/AuditGenerator";
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
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        loadConversations();
      } catch (error) {
        base44.auth.redirectToLogin('/glyphbot');
      }
    };
    initAuth();
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
      const convos = await base44.agents.listConversations({
        agent_name: "glyphbot"
      });
      setConversations(convos);
    } catch (error) {
      console.error("Error loading conversations:", error);
    }
  };

  const createNewConversation = async () => {
    try {
      const conversation = await base44.agents.createConversation({
        agent_name: "glyphbot",
        metadata: {
          name: `GlyphBot Chat - ${new Date().toLocaleString()}`,
          description: "AI Assistant Conversation"
        }
      });
      setCurrentConversation(conversation);
      setMessages([]);
      await loadConversations();
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  const selectConversation = async (conversationId) => {
    try {
      const conversation = await base44.agents.getConversation(conversationId);
      setCurrentConversation(conversation);
      setMessages(conversation.messages || []);
    } catch (error) {
      console.error("Error loading conversation:", error);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const uploadFiles = async () => {
    const fileUrls = [];
    for (const file of selectedFiles) {
      try {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        fileUrls.push(file_url);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
    return fileUrls;
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() && selectedFiles.length === 0) return;
    if (!currentConversation) {
      await createNewConversation();
      return;
    }

    setIsLoading(true);
    const messageContent = inputMessage.trim();

    let finalContent = messageContent;
    if (selectedPersona !== "default") {
      const personaContexts = {
        "ethical-hacker": "As an ethical hacker focused on offensive security and penetration testing, ",
        "senior-developer": "As a senior software engineer emphasizing clean code and best practices, ",
        "security-auditor": "As a security auditor focused on compliance and risk assessment, ",
        "smart-contract-auditor": "As a blockchain security expert specializing in smart contracts, "
      };
      finalContent = personaContexts[selectedPersona] + messageContent;
    }

    setInputMessage("");

    try {
      const fileUrls = selectedFiles.length > 0 ? await uploadFiles() : [];
      setSelectedFiles([]);

      await base44.agents.addMessage(currentConversation, {
        role: "user",
        content: finalContent || "Please analyze the attached files",
        file_urls: fileUrls.length > 0 ? fileUrls : undefined
      });
    } catch (error) {
      console.error("Error sending message:", error);
      setIsLoading(false);
    }
  };

  const deleteConversation = async (conversationId, e) => {
    e.stopPropagation();
    try {
      await base44.agents.deleteConversation(conversationId);
      if (currentConversation?.id === conversationId) {
        setCurrentConversation(null);
        setMessages([]);
      }
      await loadConversations();
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  };

  return (
    <FreeTrialGuard serviceName="GlyphBot">
      <div className="min-h-screen bg-black text-white relative">
      {/* Background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <img
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/8cd0364f8_Whisk_2bd57b9a449d359968944ab33f98257edr-Copy.jpg"
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Header */}
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
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-2 text-white">
                <User className="w-4 h-4" />
                <span className="text-sm">{user.email}</span>
              </div>
            )}
            <a
              href={base44.agents.getWhatsAppConnectURL('glyphbot')}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm" className="border-green-500/50 text-white hover:bg-green-500/20">
                💬 WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4 relative z-10">
        <Tabs defaultValue="chat" className="space-y-6">
          <TabsList className="bg-blue-900/30 backdrop-blur-md border border-blue-500/30">
            <TabsTrigger value="chat" className="text-white data-[state=active]:bg-blue-500/30">AI Chat</TabsTrigger>
            <TabsTrigger value="executor" className="text-white data-[state=active]:bg-blue-500/30">Code Executor</TabsTrigger>
            <TabsTrigger value="scanner" className="text-white data-[state=active]:bg-blue-500/30">Security Scanner</TabsTrigger>
            <TabsTrigger value="audit" className="text-white data-[state=active]:bg-blue-500/30">Audit Generator</TabsTrigger>
          </TabsList>

          <TabsContent value="chat">
            <div className="grid lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              <div className="lg:col-span-1 space-y-4">
                <Card className="bg-blue-900/20 backdrop-blur-md border-blue-500/30">
                  <CardHeader>
                    <CardTitle className="text-base text-white">AI Persona</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PersonaSelector
                      selectedPersona={selectedPersona}
                      onSelect={setSelectedPersona}
                    />
                  </CardContent>
                </Card>

                <Card className="bg-blue-900/20 backdrop-blur-md border-blue-500/30">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-white">Conversations</CardTitle>
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

                <Card className="bg-gradient-to-br from-blue-500/20 to-blue-700/20 backdrop-blur-md border-blue-500/30">
                  <CardHeader>
                    <CardTitle className="text-base text-white">Capabilities</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-white" />
                      <span className="text-white">Security Analysis</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Code className="w-4 h-4 text-white" />
                      <span className="text-white">Code Generation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-white" />
                      <span className="text-white">Smart Contracts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-white" />
                      <span className="text-white">File Analysis</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-3">
                <Card className="bg-blue-900/20 backdrop-blur-md border-blue-500/30 h-[calc(100vh-12rem)]">
                  <CardHeader className="border-b border-blue-500/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white">
                          {currentConversation ? (
                            currentConversation.metadata?.name || "Chat"
                          ) : (
                            "Start a New Conversation"
                          )}
                        </CardTitle>
                        {currentConversation && (
                          <p className="text-sm text-white/80 mt-1">
                            {messages.length} messages • {selectedPersona.replace('-', ' ')} mode
                          </p>
                        )}
                      </div>
                      <Badge variant="outline" className="border-blue-500/50 text-white bg-blue-500/20">
                        <Brain className="w-3 h-3 mr-1" />
                        Gemini
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="flex flex-col h-[calc(100%-5rem)]">
                    <div className="flex-1 overflow-y-auto space-y-4 py-4">
                      {!currentConversation ? (
                        <div className="h-full flex items-center justify-center">
                          <div className="text-center">
                            <Brain className="w-16 h-16 text-white mx-auto mb-4" />
                            <h3 className="text-xl font-bold mb-2 text-white">Welcome to GlyphBot Advanced</h3>
                            <p className="text-white/80 mb-6 max-w-md">
                              Your AI cybersecurity expert with code execution, security scanning, and automated auditing capabilities.
                            </p>
                            <Button
                              onClick={createNewConversation}
                              className="bg-blue-500/30 hover:bg-blue-500/50 text-white border border-blue-500/50"
                            >
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Start New Chat
                            </Button>
                          </div>
                        </div>
                      ) : messages.length === 0 ? (
                        <div className="h-full flex items-center justify-center">
                          <div className="text-center text-white">
                            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>Send a message to start the conversation</p>
                          </div>
                        </div>
                      ) : (
                        <>
                          {messages.map((message, index) => (
                            <MessageBubble key={index} message={message} />
                          ))}
                          <div ref={messagesEndRef} />
                        </>
                      )}
                    </div>

                    <div className="border-t border-blue-500/30 pt-4">
                      {selectedFiles.length > 0 && (
                        <div className="mb-3 flex flex-wrap gap-2">
                          {selectedFiles.map((file, index) => (
                            <div
                              key={index}
                              className="bg-blue-900/30 backdrop-blur-md border border-blue-500/30 rounded-lg px-3 py-2 flex items-center gap-2 text-sm"
                            >
                              <FileText className="w-4 h-4 text-white" />
                              <span className="max-w-[200px] truncate text-white">{file.name}</span>
                              <button
                                onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== index))}
                                className="text-white hover:text-red-400"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <form onSubmit={sendMessage} className="flex gap-2">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileSelect}
                          multiple
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => fileInputRef.current?.click()}
                          className="border-blue-500/50 hover:bg-blue-500/20 text-white"
                        >
                          <Upload className="w-4 h-4" />
                        </Button>
                        <Input
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          placeholder="Ask GlyphBot anything..."
                          disabled={isLoading}
                          className="bg-blue-900/30 backdrop-blur-md border-blue-500/30 flex-1 text-white placeholder:text-white/50"
                        />
                        <Button
                          type="submit"
                          disabled={isLoading || (!inputMessage.trim() && selectedFiles.length === 0)}
                          className="bg-blue-500/50 hover:bg-blue-500/70 text-white border border-blue-500/50"
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

          <TabsContent value="executor">
            <CodeExecutor />
          </TabsContent>

          <TabsContent value="scanner">
            <SecurityScanner />
          </TabsContent>

          <TabsContent value="audit">
            <AuditGenerator />
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </FreeTrialGuard>
  );
}
