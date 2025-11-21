import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, Key, RefreshCw, Plus, Eye, EyeOff, Shield, Terminal } from "lucide-react";
import GlyphLoader from "@/components/GlyphLoader";
import { toast } from "sonner";

export default function DeveloperKeys() {
  const [showSecret, setShowSecret] = useState({});
  const [copied, setCopied] = useState(null);
  const [newKeyName, setNewKeyName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const queryClient = useQueryClient();

  const { data: keys = [], isLoading } = useQuery({
    queryKey: ['api-keys'],
    queryFn: () => base44.entities.APIKey.list({ sort: { created_date: -1 } })
  });

  const createKeyMutation = useMutation({
    mutationFn: async (name) => {
      const response = await base44.functions.invoke("generateAPIKey", { name });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
      setIsCreating(false);
      setNewKeyName("");
      toast.success("API Key generated successfully");
    },
    onError: () => {
      toast.error("Failed to generate API Key");
    }
  });

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
    toast.success("Copied to clipboard");
  };

  const toggleSecret = (id) => {
    setShowSecret(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCreateKey = (e) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    createKeyMutation.mutate(newKeyName);
  };

  if (isLoading) return <GlyphLoader text="Loading Keys..." />;

  return (
    <div className="p-8 bg-black min-h-full text-white space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Developer Settings
          </h1>
          <p className="text-gray-400 mt-2">
            Manage your API keys and access credentials for the GlyphLock Platform.
          </p>
        </div>
        <Button 
          onClick={() => setIsCreating(!isCreating)}
          className="bg-blue-600 hover:bg-blue-700 text-white border border-blue-500/50 shadow-lg shadow-blue-500/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          Generate New Key
        </Button>
      </div>

      {isCreating && (
        <Card className="bg-gray-900/50 border-blue-500/30 backdrop-blur-sm animate-in fade-in slide-in-from-top-4">
          <CardHeader>
            <CardTitle className="text-white">Create New API Key</CardTitle>
            <CardDescription className="text-gray-400">Give your key a name to identify it later.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateKey} className="flex gap-4">
              <Input
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="e.g., Production App, Test Environment"
                className="bg-black/50 border-blue-500/30 text-white placeholder:text-gray-600"
              />
              <Button 
                type="submit" 
                disabled={createKeyMutation.isPending}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {createKeyMutation.isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Create"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {keys.length === 0 ? (
          <Card className="bg-gray-900/30 border-dashed border-2 border-gray-700 p-12 flex flex-col items-center justify-center text-center">
            <Key className="w-16 h-16 text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No API Keys Found</h3>
            <p className="text-gray-400 mb-6 max-w-md">
              Generate your first API key to start integrating with the GlyphLock SDK and API endpoints.
            </p>
            <Button 
              onClick={() => setIsCreating(true)}
              variant="outline"
              className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
            >
              Generate Key
            </Button>
          </Card>
        ) : (
          keys.map((key) => (
            <Card key={key.id} className="bg-gray-900/40 border-blue-500/20 backdrop-blur-sm hover:border-blue-500/40 transition-all">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <Key className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg">{key.name}</h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <span>Created: {new Date(key.created_date).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="uppercase">{key.environment}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={key.status === 'active' ? 'default' : 'destructive'} className={key.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' : ''}>
                    {key.status}
                  </Badge>
                </div>

                <div className="space-y-4">
                  {/* Public Key */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Public Key</Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input 
                          readOnly 
                          value={key.public_key} 
                          className="bg-black/50 border-gray-700 font-mono text-sm text-gray-300 pr-10"
                        />
                        <Shield className="w-4 h-4 text-blue-500/50 absolute right-3 top-3" />
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(key.public_key, `pk-${key.id}`)}
                        className="border-gray-700 hover:bg-gray-800"
                      >
                        {copied === `pk-${key.id}` ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
                      </Button>
                    </div>
                  </div>

                  {/* Secret Key */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Secret Key</Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input 
                          readOnly 
                          type={showSecret[key.id] ? "text" : "password"}
                          value={key.secret_key} 
                          className="bg-black/50 border-gray-700 font-mono text-sm text-gray-300 pr-10"
                        />
                        <button 
                          onClick={() => toggleSecret(key.id)}
                          className="absolute right-3 top-3 text-gray-500 hover:text-gray-300 transition-colors"
                        >
                          {showSecret[key.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(key.secret_key, `sk-${key.id}`)}
                        className="border-gray-700 hover:bg-gray-800"
                      >
                        {copied === `sk-${key.id}` ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Code Snippet */}
                <div className="mt-6 pt-6 border-t border-gray-800">
                  <Label className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3 block">Environment Variables</Label>
                  <div className="bg-black rounded-lg p-4 border border-gray-800 relative group">
                    <pre className="text-xs font-mono text-blue-300 overflow-x-auto">
                      {`GLYPHLOCK_PUBLIC_KEY=${key.public_key}
GLYPHLOCK_SECRET_KEY=${key.secret_key}`}
                    </pre>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(`GLYPHLOCK_PUBLIC_KEY=${key.public_key}\nGLYPHLOCK_SECRET_KEY=${key.secret_key}`, `env-${key.id}`)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-800"
                    >
                      {copied === `env-${key.id}` ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-gray-400" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}