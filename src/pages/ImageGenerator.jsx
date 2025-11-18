import React, { useState } from "react";
import PaywallGuard from "@/components/PaywallGuard";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Download } from "lucide-react";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    try {
      const result = await base44.integrations.Core.GenerateImage({ prompt });
      setImageUrl(result.url);
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Failed to generate image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PaywallGuard serviceName="AI Image Generator" requirePlan="professional">
      <div className="min-h-screen bg-black text-white py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              AI <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">Image Generator</span>
            </h1>
            <p className="text-xl text-white/70">Create stunning images with AI</p>
          </div>

          <Card className="glass-card-dark border-purple-500/30 mb-8">
            <CardHeader>
              <CardTitle className="text-white">Describe Your Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the image you want to generate..."
                rows={4}
                className="glass-card-dark border-purple-500/30 text-white"
              />
              <Button 
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-700"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {loading ? "Generating..." : "Generate Image"}
              </Button>
            </CardContent>
          </Card>

          {imageUrl && (
            <Card className="glass-card-dark border-blue-500/30">
              <CardContent className="p-6">
                <img src={imageUrl} alt="Generated" className="w-full rounded-lg mb-4" />
                <Button 
                  variant="outline"
                  className="w-full border-blue-500/50 text-white"
                  onClick={() => window.open(imageUrl, '_blank')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Image
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PaywallGuard>
  );
}