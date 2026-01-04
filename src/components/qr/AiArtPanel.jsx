import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Palette, Image as ImageIcon, Wand2, RefreshCw, X, Check } from "lucide-react";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";

export default function AiArtPanel({ qrPayload, onArtGenerated, customization, setCustomization }) {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("cyberpunk");
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [blendMode, setBlendMode] = useState("background"); // background, center, overlay
  const [opacity, setOpacity] = useState(100);

  const styles = [
    { id: "cyberpunk", label: "Cyberpunk / Neon" },
    { id: "nature", label: "Nature / Organic" },
    { id: "watercolor", label: "Watercolor" },
    { id: "abstract", label: "Abstract Geometric" },
    { id: "anime", label: "Anime / Manga" },
    { id: "3d-render", label: "3D Render" },
    { id: "minimalist", label: "Minimalist" },
    { id: "scifi", label: "Sci-Fi" },
    { id: "retro", label: "Retro / 80s" },
    { id: "oil-painting", label: "Oil Painting" }
  ];

  const handleGenerate = async () => {
    if (!prompt) {
      toast.error("Please enter a prompt");
      return;
    }

    setLoading(true);
    setGeneratedImage(null);

    try {
      const { data } = await base44.functions.invoke('generateAiQrArt', {
        prompt,
        style: styles.find(s => s.id === style)?.label || style
      });

      if (data.url) {
        setGeneratedImage(data.url);
        toast.success("Art generated successfully!");
      } else {
        toast.error("Failed to generate art");
      }
    } catch (error) {
      console.error("AI Gen Error:", error);
      toast.error("Error generating art");
    } finally {
      setLoading(false);
    }
  };

  const applyArt = () => {
    if (!generatedImage) return;

    // Apply the generated image to the QR customization
    const newCustomization = { ...customization };

    if (blendMode === 'background') {
      newCustomization.background = {
        ...newCustomization.background,
        type: 'image',
        imageUrl: generatedImage,
        transparency: opacity,
        color: '#ffffff' // Fallback
      };
    } else if (blendMode === 'center') {
      newCustomization.logo = {
        ...newCustomization.logo,
        url: generatedImage,
        shape: 'circle',
        size: 25,
        opacity: opacity
      };
    }

    setCustomization(newCustomization);
    onArtGenerated();
    toast.success("AI Art applied to QR Code!");
  };

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Palette className="w-5 h-5 text-purple-400" />
          AI Art Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Input Section */}
        <div className="space-y-4">
          <div>
            <Label className="text-white">Art Prompt</Label>
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A futuristic city with neon lights..."
              className="bg-slate-800 border-slate-700 text-white mt-1"
            />
          </div>

          <div>
            <Label className="text-white">Art Style</Label>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                {styles.map(s => (
                  <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Dreaming...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Generate AI Art
              </>
            )}
          </Button>
        </div>

        {/* Result Section */}
        {generatedImage && (
          <div className="space-y-4 pt-4 border-t border-slate-800 animate-in fade-in zoom-in duration-300">
            <div className="relative aspect-square w-full rounded-lg overflow-hidden border border-slate-700">
              <img src={generatedImage} alt="Generated Art" className="w-full h-full object-cover" />
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-white">Application Mode</Label>
                <Select value={blendMode} onValueChange={setBlendMode}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-white">
                    <SelectItem value="background">Background Image</SelectItem>
                    <SelectItem value="center">Center Logo / Art</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white">Opacity ({opacity}%)</Label>
                <Slider
                  value={[opacity]}
                  onValueChange={(val) => setOpacity(val[0])}
                  min={10}
                  max={100}
                  step={5}
                  className="mt-2"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={() => setGeneratedImage(null)} variant="outline" className="flex-1 border-slate-700 text-slate-300">
                  <X className="w-4 h-4 mr-2" /> Discard
                </Button>
                <Button onClick={applyArt} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                  <Check className="w-4 h-4 mr-2" /> Apply to QR
                </Button>
              </div>
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
}