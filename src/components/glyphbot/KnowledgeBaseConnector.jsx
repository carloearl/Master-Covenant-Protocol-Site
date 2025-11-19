import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { base44 } from "@/api/base44Client";
import { BookOpen, Plus, Trash2, ExternalLink, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function KnowledgeBaseConnector({ onKnowledgeAdded }) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [knowledgeBases, setKnowledgeBases] = useState(() => {
    try {
      const saved = localStorage.getItem('glyphbot-knowledge-bases');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const addKnowledgeBase = async () => {
    if (!url.trim()) {
      toast.error('Please enter a valid URL');
      return;
    }

    try {
      setIsLoading(true);
      
      // Fetch and analyze the documentation
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this documentation URL and extract key information: ${url}. 
        Provide a brief summary of what this documentation covers.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            summary: { type: "string" },
            topics: { type: "array", items: { type: "string" } },
            status: { type: "string", enum: ["accessible", "error"] }
          }
        }
      });

      if (result.status === 'error') {
        throw new Error('Could not access the documentation');
      }

      const newKB = {
        id: Date.now(),
        url: url.trim(),
        title: result.title || 'Documentation',
        summary: result.summary || 'External documentation',
        topics: result.topics || [],
        addedAt: new Date().toISOString()
      };

      const updated = [...knowledgeBases, newKB];
      setKnowledgeBases(updated);
      localStorage.setItem('glyphbot-knowledge-bases', JSON.stringify(updated));
      
      setUrl('');
      toast.success(`Knowledge base "${newKB.title}" connected`);
      onKnowledgeAdded?.(newKB);
      
    } catch (error) {
      console.error('Error adding knowledge base:', error);
      toast.error('Failed to connect to knowledge base');
    } finally {
      setIsLoading(false);
    }
  };

  const removeKnowledgeBase = (id) => {
    const kb = knowledgeBases.find(k => k.id === id);
    const updated = knowledgeBases.filter(k => k.id !== id);
    setKnowledgeBases(updated);
    localStorage.setItem('glyphbot-knowledge-bases', JSON.stringify(updated));
    if (kb) {
      toast.success(`"${kb.title}" removed`);
    }
  };

  return (
    <Card className="bg-blue-900/20 backdrop-blur-md border-blue-500/30">
      <CardHeader>
        <CardTitle className="text-base text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          Knowledge Bases
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Documentation URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addKnowledgeBase()}
            disabled={isLoading}
            className="bg-blue-900/30 border-blue-500/30 text-white placeholder:text-white/50 text-sm"
          />
          <Button
            size="sm"
            onClick={addKnowledgeBase}
            disabled={isLoading || !url.trim()}
            className="bg-blue-500/30 hover:bg-blue-500/50 text-white border border-blue-500/50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </Button>
        </div>

        {knowledgeBases.length > 0 ? (
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {knowledgeBases.map((kb) => (
              <div
                key={kb.id}
                className="bg-blue-500/10 rounded-lg p-3 hover:bg-blue-500/20 transition-colors group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="w-3 h-3 text-green-400 flex-shrink-0" />
                      <h4 className="text-white text-sm font-medium truncate">
                        {kb.title}
                      </h4>
                    </div>
                    <p className="text-white/60 text-xs line-clamp-2 mb-2">
                      {kb.summary}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {kb.topics?.slice(0, 3).map((topic, idx) => (
                        <Badge 
                          key={idx} 
                          variant="outline" 
                          className="border-blue-500/50 text-white/80 text-[10px] py-0"
                        >
                          {topic}
                        </Badge>
                      ))}
                    </div>
                    <a
                      href={kb.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1 group-hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span className="truncate">{kb.url}</span>
                    </a>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeKnowledgeBase(kb.id)}
                    className="h-7 w-7 text-red-400 hover:text-red-300 hover:bg-red-500/20 flex-shrink-0"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-white/60 text-sm">
            <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No knowledge bases connected</p>
            <p className="text-xs mt-1">Add documentation URLs to enrich conversations</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}