import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Loader2, Wand2, Download, Maximize2, RefreshCw, Upload } from 'lucide-react';
import { toast } from 'sonner';
import {
  GlyphImageCard,
  GlyphImageButton,
  GlyphImageInput,
  GlyphImageTypography,
  GlyphImageShadows,
  GlyphImagePanel,
} from '../design/GlyphImageDesignSystem';

const STYLE_PRESETS = [
  { id: 'photorealistic', label: 'Photorealistic', icon: '📷' },
  { id: 'cyberpunk', label: 'Cyberpunk', icon: '🌆' },
  { id: 'watercolor', label: 'Watercolor', icon: '🎨' },
  { id: 'oil-painting', label: 'Oil Painting', icon: '🖼️' },
  { id: 'anime', label: 'Anime', icon: '⚡' },
  { id: 'minimalist', label: 'Minimalist', icon: '◻️' },
  { id: 'surreal', label: 'Surreal', icon: '🌀' },
  { id: 'neon', label: 'Neon', icon: '💠' },
];

export default function GenerateTab({ user, onImageGenerated }) {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('photorealistic');
  const [batchCount, setBatchCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [referenceImage, setReferenceImage] = useState(null);

  const [controls, setControls] = useState({
    aspectRatio: '1:1',
    modelStrength: 75,
    sharpness: 50,
    creativity: 70,
    guidanceScale: 7.5,
    seed: Math.floor(Math.random() * 1000000),
    seedLocked: false,
    qualityMode: 'Standard',
    negativePrompt: '',
  });

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setLoading(true);
    setImages([]);

    try {
      const enhancedPrompt = `${prompt}${selectedStyle !== 'photorealistic' ? `, ${selectedStyle} style` : ''}, ${controls.qualityMode.toLowerCase()} quality, highly detailed`;

      const promises = Array.from({ length: batchCount }, async () => {
        try {
          const result = await base44.integrations.Core.GenerateImage({
            prompt: enhancedPrompt,
          });

          // Save to database
          const savedImage = await base44.entities.InteractiveImage.create({
            name: `Generated: ${prompt.substring(0, 50)}`,
            fileUrl: result.url,
            prompt,
            style: selectedStyle,
            generationSettings: controls,
            source: 'generated',
            status: 'draft',
            ownerEmail: user.email,
          });

          return { url: result.url, id: savedImage.id, ...savedImage };
        } catch (error) {
          console.error('Generation failed:', error);
          throw error;
        }
      });

      const results = await Promise.all(promises);
      setImages(results);

      if (results.length > 0 && onImageGenerated) {
        onImageGenerated(results[0]);
      }

      toast.success(`Generated ${results.length} image${results.length > 1 ? 's' : ''}!`);
    } catch (error) {
      console.error('Error generating images:', error);
      toast.error(`Failed to generate images: ${error.message}`);
    } finally {
      setLoading(false);
      if (!controls.seedLocked) {
        setControls((prev) => ({ ...prev, seed: Math.floor(Math.random() * 1000000) }));
      }
    }
  };

  const handleDownload = async (url, index = 0) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `glyphlock-image-${Date.now()}-${index + 1}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      a.remove();
      toast.success('Downloaded image');
    } catch (error) {
      console.error('Download failed:', error);
      window.open(url, '_blank');
    }
  };

  const handleReferenceUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await base44.integrations.Core.UploadFile({ file });
      setReferenceImage(result.file_url);
      toast.success('Reference image uploaded');
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload reference image');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Controls */}
      <div className="lg:col-span-2 space-y-6">
        {/* Prompt Panel */}
        <Card className={`${GlyphImageCard.premium} ${GlyphImageShadows.depth.lg}`}>
          <CardHeader className="border-b border-purple-500/20">
            <CardTitle className={`${GlyphImageTypography.heading.lg} text-white flex items-center gap-2`}>
              <Wand2 className="w-5 h-5 text-cyan-400" />
              Prompt & Style
            </CardTitle>
          </CardHeader>
          <CardContent className={GlyphImagePanel.primary}>
            <div className="space-y-2">
              <Label htmlFor="prompt" className="text-gray-300 font-semibold">
                Describe what you want to create
              </Label>
              <Textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A futuristic cityscape with neon lights and flying vehicles..."
                className={`${GlyphImageInput.glow} min-h-[120px]`}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300 font-semibold">Style Preset</Label>
              <div className="flex flex-wrap gap-2">
                {STYLE_PRESETS.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all min-h-[44px] flex items-center gap-2 ${
                      selectedStyle === style.id
                        ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-purple-500/30'
                        : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:bg-gray-800'
                    }`}
                  >
                    <span>{style.icon}</span>
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Batch Count</Label>
                <Input
                  type="number"
                  min="1"
                  max="4"
                  value={batchCount}
                  onChange={(e) => setBatchCount(parseInt(e.target.value) || 1)}
                  className={GlyphImageInput.base}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Quality Mode</Label>
                <Select value={controls.qualityMode} onValueChange={(val) => setControls({ ...controls, qualityMode: val })}>
                  <SelectTrigger className={GlyphImageInput.base}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Standard">Standard</SelectItem>
                    <SelectItem value="HD">HD</SelectItem>
                    <SelectItem value="Ultra">Ultra</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className={`${GlyphImageButton.primary} w-full ${GlyphImageShadows.neonPurple}`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating {batchCount > 1 ? `${batchCount} images` : 'image'}...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5 mr-2" />
                  Generate {batchCount > 1 ? `${batchCount} Images` : 'Image'}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Reference Upload */}
        <Card className={`${GlyphImageCard.glass}`}>
          <CardHeader>
            <CardTitle className={`${GlyphImageTypography.heading.md} text-white`}>
              Reference Image (Optional)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleReferenceUpload}
                className="hidden"
                id="reference-upload"
              />
              <label htmlFor="reference-upload">
                <Button
                  type="button"
                  onClick={() => document.getElementById('reference-upload').click()}
                  className={GlyphImageButton.secondary}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Reference
                </Button>
              </label>
              {referenceImage && (
                <div className="flex-1">
                  <img src={referenceImage} alt="Reference" className="h-20 rounded-lg border border-cyan-500/30" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Preview */}
      <div>
        <Card className={`${GlyphImageCard.premium} ${GlyphImageShadows.depth.lg}`}>
          <CardHeader className="border-b border-purple-500/20">
            <CardTitle className={`${GlyphImageTypography.heading.md} text-white`}>Generated Images</CardTitle>
          </CardHeader>
          <CardContent className={GlyphImagePanel.primary}>
            {loading && (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-12 h-12 animate-spin text-cyan-400 mb-4" />
                <p className="text-gray-400">Crafting your vision...</p>
              </div>
            )}

            {!loading && images.length === 0 && (
              <div className="text-center py-12">
                <Wand2 className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400">Your generated images will appear here</p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4">
              {images.map((img, idx) => (
                <div key={idx} className="group relative">
                  <img
                    src={img.url}
                    alt={`Generated ${idx + 1}`}
                    className="w-full rounded-lg border border-purple-500/30 cursor-pointer hover:border-cyan-500 transition-all"
                    onClick={() => setFullscreenImage(img.url)}
                  />
                  <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      onClick={() => handleDownload(img.url, idx)}
                      className={GlyphImageButton.ghost}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setFullscreenImage(img.url)}
                      className={GlyphImageButton.ghost}
                    >
                      <Maximize2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fullscreen Lightbox */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={() => setFullscreenImage(null)}
        >
          <img
            src={fullscreenImage}
            alt="Fullscreen"
            className="max-w-full max-h-full rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <Button
            onClick={() => setFullscreenImage(null)}
            className="absolute top-4 right-4 bg-gray-900/80 hover:bg-gray-800"
          >
            Close
          </Button>
        </div>
      )}
    </div>
  );
}