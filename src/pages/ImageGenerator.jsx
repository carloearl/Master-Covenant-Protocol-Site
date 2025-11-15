import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image, Download, Sparkles, Loader2, Palette, Wand2 } from "lucide-react";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import FreeTrialGuard from "@/components/FreeTrialGuard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("cinematic");

  const stylePresets = {
    cinematic: {
      name: "Cinematic",
      suffix: ", cinematic lighting, dramatic atmosphere, hyper-realistic, 8k ultra HD, professional photography"
    },
    artistic: {
      name: "Artistic/Whisk Style",
      suffix: ", whisk art style, dynamic composition, epic scene, dramatic lighting with electric effects, shattered glass effects, motion blur, high-contrast, vivid colors, professional sports photography meets digital art"
    },
    robot: {
      name: "Robot Character",
      suffix: ", futuristic humanoid robot, metallic surfaces, glowing blue accents, cybernetic details, dramatic pose, cinematic lighting, photorealistic rendering"
    },
    action: {
      name: "Action Sports",
      suffix: ", explosive action scene, dynamic motion, particle effects, energy trails, dramatic lighting, arena atmosphere, professional sports photography"
    },
    cyber: {
      name: "Cyberpunk",
      suffix: ", cyberpunk aesthetic, neon lights, dark atmosphere, futuristic technology, holographic elements, blue and purple color palette"
    }
  };

  const examplePrompts = {
    artistic: [
      "Robot basketball player dunking with lightning effects and shattered glass, arena background",
      "Cyborg warrior in combat stance with energy shields and glowing weapons, epic battlefield",
      "Futuristic athlete breaking through holographic barriers with particle effects",
      "AI android performing acrobatic move with motion trails and electric sparks"
    ],
    security: [
      "Digital fortress with quantum encryption shields protecting data streams",
      "Cybersecurity command center with holographic threat displays",
      "Abstract visualization of blockchain network with glowing nodes",
      "AI-powered firewall with particle effects blocking cyber attacks"
    ]
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    setLoading(true);
    setError("");
    setGeneratedImage(null);

    try {
      const enhancedPrompt = prompt + stylePresets[selectedStyle].suffix;
      const result = await base44.integrations.Core.GenerateImage({ prompt: enhancedPrompt });
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

  return (
    <FreeTrialGuard serviceName="ImageGenerator">
      <div className="min-h-screen bg-black text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Sparkles className="w-10 h-10 text-blue-400" />
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                  AI Image Generator
                </h1>
              </div>
              <p className="text-xl text-gray-400">
                Create stunning images with artistic effects like the Dream Team cards
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <Card className="glass-card-dark border-blue-500/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Palette className="w-5 h-5 text-blue-400" />
                      Style Preset
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                      <SelectTrigger className="glass-input text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-card-dark border-gray-700">
                        {Object.entries(stylePresets).map(([key, style]) => (
                          <SelectItem key={key} value={key}>
                            {style.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-2">
                      {stylePresets[selectedStyle].suffix}
                    </p>
                  </CardContent>
                </Card>

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
                      placeholder="Describe your image... (style preset will be added automatically)"
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
                          <Wand2 className="w-5 h-5 mr-2" />
                          Generate Image
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="glass-card-dark border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-white text-sm">Example Prompts</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-xs font-semibold text-purple-400 mb-2">Artistic/Character</h4>
                      <div className="space-y-1">
                        {examplePrompts.artistic.map((example, idx) => (
                          <button
                            key={idx}
                            onClick={() => setPrompt(example)}
                            className="w-full text-left text-xs text-gray-400 hover:text-blue-400 transition-colors p-2 rounded hover:bg-blue-500/10"
                          >
                            {example}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-blue-400 mb-2">Security/Tech</h4>
                      <div className="space-y-1">
                        {examplePrompts.security.map((example, idx) => (
                          <button
                            key={idx}
                            onClick={() => setPrompt(example)}
                            className="w-full text-left text-xs text-gray-400 hover:text-blue-400 transition-colors p-2 rounded hover:bg-blue-500/10"
                          >
                            {example}
                          </button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="glass-card-dark border-purple-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Image className="w-5 h-5 text-purple-400" />
                    Generated Image
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading && (
                    <div className="flex items-center justify-center h-[600px]">
                      <LoadingSpinner message="Creating your masterpiece..." />
                    </div>
                  )}

                  {!loading && !generatedImage && (
                    <div className="flex flex-col items-center justify-center h-[600px] border-2 border-dashed border-gray-700 rounded-lg">
                      <Image className="w-16 h-16 text-gray-600 mb-4" />
                      <p className="text-gray-500">Your generated image will appear here</p>
                      <p className="text-xs text-gray-600 mt-2">Select a style and describe your vision</p>
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
                          <strong className="text-blue-400">Style:</strong> {stylePresets[selectedStyle].name}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          <strong className="text-blue-400">Prompt:</strong> {prompt}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="glass-card-dark border-blue-500/30 mt-8">
              <CardHeader>
                <CardTitle className="text-white">Pro Tips for Whisk-Style Images</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid md:grid-cols-2 gap-3 text-sm text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>Use "Artistic/Whisk Style" preset for Dream Team card effects</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>Include action words: "dunking", "shattering", "exploding"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>Mention effects: "lightning", "particle effects", "motion blur"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>Specify environment: "arena", "stadium", "battlefield"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>Add character details: "robot", "cyborg", "futuristic uniform"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>Generation takes 5-10 seconds, be detailed in descriptions</span>
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