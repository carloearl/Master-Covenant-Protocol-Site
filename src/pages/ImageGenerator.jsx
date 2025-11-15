import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image, Download, Sparkles, Loader2 } from "lucide-react";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import FreeTrialGuard from "@/components/FreeTrialGuard";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    setLoading(true);
    setError("");
    setGeneratedImage(null);

    try {
      const result = await base44.integrations.Core.GenerateImage({ prompt });
      setGeneratedImage(result.url);
    } catch (err) {
      setError(err.message || "Failed to generate image");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `glyphlock-ai-${Date.now()}.png`;
    link.click();
  };

  const examplePrompts = [
    "A futuristic cybersecurity command center with holographic displays",
    "Digital fortress with neon blue shields protecting data streams",
    "Abstract visualization of encrypted data flowing through secure networks",
    "Quantum encryption lock glowing in a dark cyber space"
  ];

  return (
    <FreeTrialGuard serviceName="ImageGenerator">
      <div className="min-h-screen bg-black text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Sparkles className="w-10 h-10 text-blue-400" />
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                  AI Image Generator
                </h1>
              </div>
              <p className="text-xl text-gray-400">
                Create stunning images from text descriptions using advanced AI
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="glass-card-dark border-blue-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Image className="w-5 h-5 text-blue-400" />
                    Image Prompt
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the image you want to generate... Be detailed!"
                    rows={6}
                    className="glass-input text-white resize-none"
                  />

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  <Button
                    onClick={handleGenerate}
                    disabled={loading || !prompt.trim()}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Generate Image
                      </>
                    )}
                  </Button>

                  <div className="pt-4 border-t border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-400 mb-3">Example Prompts:</h3>
                    <div className="space-y-2">
                      {examplePrompts.map((example, idx) => (
                        <button
                          key={idx}
                          onClick={() => setPrompt(example)}
                          className="w-full text-left text-sm text-gray-400 hover:text-blue-400 transition-colors p-2 rounded hover:bg-blue-500/10"
                        >
                          "{example}"
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card-dark border-purple-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Image className="w-5 h-5 text-purple-400" />
                    Generated Image
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading && (
                    <div className="flex items-center justify-center h-[400px]">
                      <LoadingSpinner message="Generating your image..." />
                    </div>
                  )}

                  {!loading && !generatedImage && (
                    <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed border-gray-700 rounded-lg">
                      <Image className="w-16 h-16 text-gray-600 mb-4" />
                      <p className="text-gray-500">Your generated image will appear here</p>
                    </div>
                  )}

                  {!loading && generatedImage && (
                    <div className="space-y-4">
                      <div className="relative group">
                        <img
                          src={generatedImage}
                          alt="Generated AI artwork"
                          className="w-full rounded-lg border border-purple-500/30"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <Button
                            onClick={handleDownload}
                            size="lg"
                            className="bg-gradient-to-r from-blue-600 to-purple-600"
                          >
                            <Download className="w-5 h-5 mr-2" />
                            Download Image
                          </Button>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={handleDownload}
                          variant="outline"
                          className="flex-1 border-purple-500/50 text-purple-400"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button
                          onClick={() => {
                            setGeneratedImage(null);
                            setPrompt("");
                          }}
                          variant="outline"
                          className="flex-1 border-blue-500/50 text-blue-400"
                        >
                          Generate New
                        </Button>
                      </div>

                      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                        <p className="text-xs text-gray-400">
                          <strong className="text-blue-400">Prompt used:</strong> {prompt}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="glass-card-dark border-blue-500/30 mt-8">
              <CardHeader>
                <CardTitle className="text-white">Tips for Better Results</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid md:grid-cols-2 gap-3 text-sm text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>Be specific and detailed in your descriptions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>Include style keywords (photorealistic, abstract, 3D, etc.)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>Mention lighting and atmosphere preferences</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>Generation takes 5-10 seconds on average</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </FreeTrialGuard>
  );
}