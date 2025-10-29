import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Brain, Send, Plus, Upload, Trash2, MessageSquare, 
  Sparkles, Shield, Code, FileText, User
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import MessageBubble from "../components/glyphbot/MessageBubble";
import ConversationList from "../components/glyphbot/ConversationList";

export default function GlyphBot() {
  const [user, setUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
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
    setInputMessage("");

    try {
      const fileUrls = selectedFiles.length > 0 ? await uploadFiles() : [];
      setSelectedFiles([]);

      await base44.agents.addMessage(currentConversation, {
        role: "user",
        content: messageContent || "Please analyze the attached files",
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
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-cyan-500/20 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                GlyphBot
              </h1>
              <p className="text-sm text-gray-400">AI Assistant powered by Gemini</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-sm">{user?.email}</span>
            </div>
            <a
              href={base44.agents.getWhatsAppConnectURL('glyphbot')}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm" className="border-green-500/50 text-green-400">
                💬 WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4">
        <div className="grid lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {/* Sidebar - Conversations */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-900 border-gray-800 sticky top-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Conversations</CardTitle>
                  <Button
                    size="sm"
                    onClick={createNewConversation}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 h-8"
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

            {/* Features Card */}
            <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border-cyan-500/30 mt-6">
              <CardHeader>
                <CardTitle className="text-base">Capabilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-cyan-400" />
                  <span>Security Analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-cyan-400" />
                  <span>Code Generation</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>Smart Contracts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>File Analysis</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <Card className="bg-gray-900 border-gray-800 h-[calc(100vh-12rem)]">
              <CardHeader className="border-b border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>
                      {currentConversation ? (
                        currentConversation.metadata?.name || "Chat"
                      ) : (
                        "Start a New Conversation"
                      )}
                    </CardTitle>
                    {currentConversation && (
                      <p className="text-sm text-gray-400 mt-1">
                        {messages.length} messages
                      </p>
                    )}
                  </div>
                  <Badge variant="outline" className="border-cyan-500/50 text-cyan-400">
                    <Brain className="w-3 h-3 mr-1" />
                    Gemini
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="flex flex-col h-[calc(100%-5rem)]">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 py-4">
                  {!currentConversation ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <Brain className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">Welcome to GlyphBot</h3>
                        <p className="text-gray-400 mb-6 max-w-md">
                          Your AI cybersecurity expert powered by Google Gemini. Start a conversation to get help with code, security analysis, and more.
                        </p>
                        <Button
                          onClick={createNewConversation}
                          className="bg-gradient-to-r from-cyan-500 to-blue-600"
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Start New Chat
                        </Button>
                      </div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center text-gray-500">
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

                {/* Input Area */}
                <div className="border-t border-gray-800 pt-4">
                  {selectedFiles.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                      {selectedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="bg-gray-800 border border-cyan-500/30 rounded-lg px-3 py-2 flex items-center gap-2 text-sm"
                        >
                          <FileText className="w-4 h-4 text-cyan-400" />
                          <span className="max-w-[200px] truncate">{file.name}</span>
                          <button
                            onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== index))}
                            className="text-gray-400 hover:text-red-400"
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
                      className="border-gray-700 hover:bg-gray-800"
                    >
                      <Upload className="w-4 h-4" />
                    </Button>
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Ask GlyphBot anything..."
                      disabled={isLoading}
                      className="bg-gray-800 border-gray-700 flex-1"
                    />
                    <Button
                      type="submit"
                      disabled={isLoading || (!inputMessage.trim() && selectedFiles.length === 0)}
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}