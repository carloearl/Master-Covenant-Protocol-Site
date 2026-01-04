import React, { useState, useRef, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Loader2, Wand2, Download, Maximize2, Upload, ChevronDown, Check, Save, 
  Sparkles, Palette, Settings2, Zap, RefreshCw, Copy, Share2, Layers,
  ArrowUpRight, Image as ImageIcon, Brain, Scissors, Paintbrush, ScanLine
} from 'lucide-react';
import { toast } from 'sonner';
import {
  GlyphImageCard,
  GlyphImageButton,
  GlyphImageInput,
  GlyphImageTypography,
  GlyphImageShadows,
  GlyphImagePanel,
} from '../design/GlyphImageDesignSystem';

// Style Presets with enhanced metadata
const STYLE_PRESETS = [
  { id: 'photorealistic', label: 'Photorealistic', desc: 'True-to-life imagery', color: 'from-slate-600 to-slate-800', icon: '📷' },
  { id: 'cinematic', label: 'Cinematic', desc: 'Movie-quality shots', color: 'from-amber-700 to-red-900', icon: '🎬' },
  { id: 'cyberpunk', label: 'Cyberpunk', desc: 'Neon-lit futuristic', color: 'from-pink-600 to-purple-800', icon: '🌃' },
  { id: 'anime', label: 'Anime', desc: 'Japanese animation', color: 'from-rose-500 to-pink-700', icon: '🎨' },
  { id: 'watercolor', label: 'Watercolor', desc: 'Soft painted look', color: 'from-blue-400 to-cyan-600', icon: '💧' },
  { id: 'oilPainting', label: 'Oil Painting', desc: 'Classic fine art', color: 'from-amber-600 to-orange-800', icon: '🖼️' },
  { id: 'portrait', label: 'Portrait', desc: 'Professional portraits', color: 'from-neutral-600 to-neutral-800', icon: '👤' },
  { id: 'abstract', label: 'Abstract', desc: 'Expressive art', color: 'from-violet-600 to-fuchsia-700', icon: '🎭' },
  { id: 'minimalist', label: 'Minimalist', desc: 'Clean and simple', color: 'from-gray-400 to-gray-600', icon: '⬜' },
  { id: 'surreal', label: 'Surreal', desc: 'Dreamlike fantasy', color: 'from-violet-600 to-indigo-800', icon: '🌙' },
  { id: 'neon', label: 'Neon', desc: 'Glowing lights', color: 'from-cyan-500 to-blue-700', icon: '💡' },
  { id: 'vintage', label: 'Vintage', desc: 'Retro aesthetic', color: 'from-yellow-700 to-amber-900', icon: '📻' },
  { id: 'pencilSketch', label: 'Pencil Sketch', desc: 'Hand-drawn look', color: 'from-zinc-500 to-zinc-700', icon: '✏️' },
  { id: 'sciFi', label: 'Sci-Fi', desc: 'Space and tech', color: 'from-blue-600 to-purple-800', icon: '🚀' },
  { id: 'gothic', label: 'Gothic', desc: 'Dark and moody', color: 'from-gray-800 to-black', icon: '🦇' },
  { id: 'impressionist', label: 'Impressionist', desc: 'Monet-inspired', color: 'from-green-500 to-teal-700', icon: '🌸' },
  { id: 'lowPoly', label: 'Low Poly', desc: '3D geometric', color: 'from-emerald-500 to-cyan-700', icon: '💎' },
  { id: 'steampunk', label: 'Steampunk', desc: 'Victorian meets tech', color: 'from-amber-700 to-stone-800', icon: '⚙️' },
  { id: 'vaporwave', label: 'Vaporwave', desc: '80s retro future', color: 'from-fuchsia-500 to-cyan-500', icon: '🌴' },
  { id: 'artDeco', label: 'Art Deco', desc: '1920s elegance', color: 'from-yellow-500 to-amber-700', icon: '🏛️' },
];

const ASPECT_RATIOS = [
  { id: '1:1', label: 'Square (1:1)', desc: 'Instagram, Profile pics' },
  { id: '16:9', label: 'Landscape (16:9)', desc: 'YouTube, Presentations' },
  { id: '9:16', label: 'Portrait (9:16)', desc: 'Stories, TikTok' },
  { id: '4:3', label: 'Standard (4:3)', desc: 'Traditional photos' },
  { id: '3:2', label: 'Photo (3:2)', desc: 'DSLR cameras' },
  { id: '21:9', label: 'Ultrawide (21:9)', desc: 'Cinematic banners' },
];

// AI Tools Section Component
function AIToolsSection({ isMobile, loading, setLoading, images, setImages }) {
  const [toolImage, setToolImage] = useState(null);
  const [activeTool, setActiveTool] = useState(null);
  const [upscaleLevel, setUpscaleLevel] = useState(2);
  const [inpaintPrompt, setInpaintPrompt] = useState('');
  const [styleTarget, setStyleTarget] = useState('van_gogh');
  const [styleIntensity, setStyleIntensity] = useState(80);
  const [processedImage, setProcessedImage] = useState(null);

  const handleToolUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      toast.loading('Uploading...');
      const result = await base44.integrations.Core.UploadFile({ file });
      setToolImage(result.file_url);
      setProcessedImage(null);
      toast.dismiss();
      toast.success('Image uploaded!');
    } catch (err) {
      toast.dismiss();
      toast.error('Upload failed');
    }
  };

  const handleUpscale = async () => {
    if (!toolImage) return toast.error('Upload an image first');
    setLoading(true);
    setActiveTool('upscale');
    try {
      const response = await base44.functions.invoke('imageLabOps', {
        operation: 'upscale',
        imageUrl: toolImage,
        scale: upscaleLevel
      });
      if (response.data.success) {
        setProcessedImage(response.data.upscaledUrl);
        setImages(prev => [...prev, { url: response.data.upscaledUrl, isUpscaled: true, scale: upscaleLevel }]);
        toast.success(`Upscaled to ${upscaleLevel}x!`);
      }
    } catch (err) {
      toast.error('Upscale failed: ' + err.message);
    } finally {
      setLoading(false);
      setActiveTool(null);
    }
  };

  const handleInpaint = async () => {
    if (!toolImage) return toast.error('Upload an image first');
    if (!inpaintPrompt.trim()) return toast.error('Enter edit instructions');
    setLoading(true);
    setActiveTool('inpaint');
    try {
      const response = await base44.functions.invoke('imageLabOps', {
        operation: 'inpaint',
        imageUrl: toolImage,
        editPrompt: inpaintPrompt
      });
      if (response.data.success) {
        setProcessedImage(response.data.editedUrl);
        setImages(prev => [...prev, { url: response.data.editedUrl, inpainted: true, prompt: inpaintPrompt }]);
        toast.success('Edit applied!');
      }
    } catch (err) {
      toast.error('Inpaint failed: ' + err.message);
    } finally {
      setLoading(false);
      setActiveTool(null);
    }
  };

  const handleStyleTransfer = async () => {
    if (!toolImage) return toast.error('Upload an image first');
    setLoading(true);
    setActiveTool('style');
    try {
      const response = await base44.functions.invoke('imageLabOps', {
        operation: 'styleTransfer',
        imageUrl: toolImage,
        targetStyle: styleTarget,
        intensity: styleIntensity
      });
      if (response.data.success) {
        setProcessedImage(response.data.styledUrl);
        setImages(prev => [...prev, { url: response.data.styledUrl, style: styleTarget }]);
        toast.success(`${styleTarget} style applied!`);
      }
    } catch (err) {
      toast.error('Style transfer failed: ' + err.message);
    } finally {
      setLoading(false);
      setActiveTool(null);
    }
  };

  const handleRemoveBackground = async () => {
    if (!toolImage) return toast.error('Upload an image first');
    setLoading(true);
    setActiveTool('bgremove');
    try {
      const response = await base44.functions.invoke('imageLabOps', {
        operation: 'removeBackground',
        imageUrl: toolImage
      });
      if (response.data.success) {
        setProcessedImage(response.data.processedUrl);
        setImages(prev => [...prev, { url: response.data.processedUrl, bgRemoved: true }]);
        toast.success('Background removed!');
      }
    } catch (err) {
      toast.error('Background removal failed: ' + err.message);
    } finally {
      setLoading(false);
      setActiveTool(null);
    }
  };

  const STYLE_OPTIONS = [
    { id: 'van_gogh', label: 'Van Gogh', icon: '🌻' },
    { id: 'monet', label: 'Monet', icon: '💐' },
    { id: 'picasso', label: 'Picasso', icon: '🎨' },
    { id: 'anime', label: 'Anime', icon: '🌸' },
    { id: 'comic', label: 'Comic', icon: '💥' },
    { id: 'pixel', label: 'Pixel Art', icon: '👾' },
    { id: 'watercolor', label: 'Watercolor', icon: '💧' },
    { id: 'oil', label: 'Oil Paint', icon: '🖼️' },
    { id: 'sketch', label: 'Sketch', icon: '✏️' },
    { id: 'cyberpunk', label: 'Cyberpunk', icon: '🌃' },
    { id: 'neon', label: 'Neon', icon: '💡' },
    { id: 'vintage', label: 'Vintage', icon: '📻' },
  ];

  return (
    <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-1 lg:grid-cols-2 gap-6'}`}>
      {/* Upload Section */}
      <Card className={`${GlyphImageCard.premium} ${GlyphImageShadows.depth.lg}`}>
        <CardHeader className="border-b border-green-500/20">
          <CardTitle className="text-white flex items-center gap-2">
            <Upload className="w-5 h-5 text-green-400" />
            Source Image
          </CardTitle>
        </CardHeader>
        <CardContent className={GlyphImagePanel.primary}>
          <input type="file" accept="image/*" onChange={handleToolUpload} className="hidden" id="tool-upload" />
          
          {!toolImage ? (
            <div 
              onClick={() => document.getElementById('tool-upload')?.click()}
              className="border-2 border-dashed border-green-500/30 rounded-xl p-12 text-center cursor-pointer hover:border-green-500/60 transition-all"
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-500" />
              <p className="text-gray-400">Click or drag to upload image</p>
              <p className="text-xs text-gray-600 mt-2">PNG, JPG up to 10MB</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <img src={toolImage} alt="Source" className="w-full rounded-lg border border-green-500/30" />
                <button 
                  onClick={() => { setToolImage(null); setProcessedImage(null); }}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500/80 rounded-full text-white flex items-center justify-center hover:bg-red-500"
                >×</button>
              </div>
              <Button 
                onClick={() => document.getElementById('tool-upload')?.click()}
                className={`${GlyphImageButton.secondary} w-full`}
              >
                <RefreshCw className="w-4 h-4 mr-2" /> Replace Image
              </Button>
            </div>
          )}

          {/* Result Preview */}
          {processedImage && (
            <div className="mt-6 space-y-3">
              <Label className="text-green-400 font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Processed Result
              </Label>
              <div className="relative">
                <img src={processedImage} alt="Processed" className="w-full rounded-lg border border-cyan-500/50" />
                <div className="absolute bottom-2 right-2 flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => {
                      const a = document.createElement('a');
                      a.href = processedImage;
                      a.download = `glyphlock-processed-${Date.now()}.png`;
                      a.click();
                    }}
                    className="bg-white/10 backdrop-blur-sm"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tools Panel */}
      <div className="space-y-4">
        {/* AI Upscale */}
        <Card className={`${GlyphImageCard.glass} border-cyan-500/30`}>
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <ArrowUpRight className="w-5 h-5 text-cyan-400" />
                  AI Upscale
                </h3>
                <p className="text-gray-400 text-sm">Enhance resolution with AI reconstruction</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-gray-400 text-xs">Scale Factor</Label>
                  <span className="text-cyan-400 text-sm font-bold">{upscaleLevel}x</span>
                </div>
                <Slider
                  value={[upscaleLevel]}
                  onValueChange={([v]) => setUpscaleLevel(v)}
                  min={2}
                  max={4}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>2x</span>
                  <span>3x</span>
                  <span>4x</span>
                </div>
              </div>
              <Button
                onClick={handleUpscale}
                disabled={loading || !toolImage}
                className={`${GlyphImageButton.primary} w-full`}
              >
                {loading && activeTool === 'upscale' ? (
                  <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Upscaling...</>
                ) : (
                  <><ArrowUpRight className="w-4 h-4 mr-2" /> Upscale Image</>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* AI Inpaint */}
        <Card className={`${GlyphImageCard.glass} border-purple-500/30`}>
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-purple-400" />
                  AI Inpaint / Edit
                </h3>
                <p className="text-gray-400 text-sm">Modify or replace parts of your image</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-gray-400 text-xs mb-2 block">Edit Instructions</Label>
                <Textarea
                  value={inpaintPrompt}
                  onChange={(e) => setInpaintPrompt(e.target.value)}
                  placeholder="Remove the person in the background, add a sunset, change the sky to starry night..."
                  className={`${GlyphImageInput.base} min-h-[80px]`}
                />
              </div>
              <Button
                onClick={handleInpaint}
                disabled={loading || !toolImage || !inpaintPrompt.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white"
              >
                {loading && activeTool === 'inpaint' ? (
                  <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Processing...</>
                ) : (
                  <><Wand2 className="w-4 h-4 mr-2" /> Apply Edit</>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* AI Style Transfer */}
        <Card className={`${GlyphImageCard.glass} border-amber-500/30`}>
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Paintbrush className="w-5 h-5 text-amber-400" />
                  AI Style Transfer
                </h3>
                <p className="text-gray-400 text-sm">Apply artistic styles to your image</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-gray-400 text-xs mb-2 block">Select Style</Label>
                <div className={`grid ${isMobile ? 'grid-cols-4' : 'grid-cols-6'} gap-2`}>
                  {STYLE_OPTIONS.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setStyleTarget(style.id)}
                      className={`p-2 rounded-lg text-center transition-all ${
                        styleTarget === style.id
                          ? 'bg-amber-500/30 border-2 border-amber-400'
                          : 'bg-slate-800 hover:bg-slate-700 border border-transparent'
                      }`}
                    >
                      <span className="text-xl block">{style.icon}</span>
                      <span className="text-[10px] text-white">{style.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-gray-400 text-xs">Style Intensity</Label>
                  <span className="text-amber-400 text-sm font-bold">{styleIntensity}%</span>
                </div>
                <Slider
                  value={[styleIntensity]}
                  onValueChange={([v]) => setStyleIntensity(v)}
                  min={20}
                  max={100}
                  step={10}
                  className="w-full"
                />
              </div>
              <Button
                onClick={handleStyleTransfer}
                disabled={loading || !toolImage}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white"
              >
                {loading && activeTool === 'style' ? (
                  <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Applying Style...</>
                ) : (
                  <><Paintbrush className="w-4 h-4 mr-2" /> Apply Style</>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Background Removal */}
        <Card className={`${GlyphImageCard.glass} border-green-500/30`}>
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Scissors className="w-5 h-5 text-green-400" />
                  Remove Background
                </h3>
                <p className="text-gray-400 text-sm">Isolate subject with AI precision</p>
              </div>
            </div>
            <Button
              onClick={handleRemoveBackground}
              disabled={loading || !toolImage}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white"
            >
              {loading && activeTool === 'bgremove' ? (
                <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Removing...</>
              ) : (
                <><Scissors className="w-4 h-4 mr-2" /> Remove Background</>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function GenerateTab({ user, userPrefs, onImageGenerated }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(userPrefs?.imageLabSettings?.defaultStyle || 'photorealistic');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [quality, setQuality] = useState(userPrefs?.imageLabSettings?.defaultQuality || 'HD');
  const [creativity, setCreativity] = useState(70);
  const [batchCount, setBatchCount] = useState(1);
  const [seed, setSeed] = useState(Math.floor(Math.random() * 1000000));
  const [seedLocked, setSeedLocked] = useState(false);
  const [autoEnhance, setAutoEnhance] = useState(true);
  const [loading, setLoading] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [images, setImages] = useState([]);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [referenceImage, setReferenceImage] = useState(null);
  const [styleStrength, setStyleStrength] = useState(75);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('generate');
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [promptSuggestions, setPromptSuggestions] = useState([]);
  const dropdownRef = useRef(null);

  // Load User Preferences
  useEffect(() => {
    if (userPrefs?.imageLabSettings) {
      if (userPrefs.imageLabSettings.defaultStyle) setSelectedStyle(userPrefs.imageLabSettings.defaultStyle);
      if (userPrefs.imageLabSettings.defaultQuality) setQuality(userPrefs.imageLabSettings.defaultQuality);
    }
  }, [userPrefs]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'g') {
        e.preventDefault();
        if (prompt.trim() && !loading) handleGenerate();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'e') {
        e.preventDefault();
        if (prompt.trim() && !enhancing) handleEnhancePrompt();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prompt, loading, enhancing]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedStyleData = STYLE_PRESETS.find(s => s.id === selectedStyle);

  // Enhanced prompt generation via backend
  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) {
      toast.error('Enter a prompt first');
      return;
    }

    setEnhancing(true);
    try {
      const response = await base44.functions.invoke('imageLabOps', {
        operation: 'enhancePrompt',
        prompt,
        style: selectedStyle
      });

      if (response.data.success) {
        setEnhancedPrompt(response.data.enhanced);
        setPromptSuggestions(response.data.suggestions || []);
        toast.success('Prompt enhanced!');
      }
    } catch (error) {
      console.error('Enhance error:', error);
      toast.error('Failed to enhance prompt');
    } finally {
      setEnhancing(false);
    }
  };

  // Main generation via backend
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setLoading(true);
    setImages([]);

    try {
      if (batchCount > 1) {
        // Batch generation
        const response = await base44.functions.invoke('imageLabOps', {
          operation: 'batchGenerate',
          prompt,
          style: selectedStyle,
          quality,
          count: batchCount
        });

        if (response.data.success) {
          setImages(response.data.results.map(r => ({ url: r.url, id: r.id, prompt: r.prompt })));
          if (response.data.results.length > 0 && onImageGenerated) {
            onImageGenerated(response.data.results[0]);
          }
          toast.success(`Generated ${response.data.generated} image${response.data.generated > 1 ? 's' : ''}!`);
        }
      } else {
        // Single advanced generation
        const response = await base44.functions.invoke('imageLabOps', {
          operation: 'generateAdvanced',
          prompt,
          negativePrompt,
          style: selectedStyle,
          aspectRatio,
          quality,
          creativity,
          seed: seedLocked ? seed : undefined,
          referenceImageUrl: referenceImage,
          styleStrength,
          enhancePrompt: autoEnhance
        });

        if (response.data.success) {
          const img = response.data.image;
          setImages([{ url: img.url, id: img.id, prompt: img.prompt, enhancedPrompt: img.enhancedPrompt }]);
          if (onImageGenerated) onImageGenerated(img);
          toast.success('Image generated!');
        }
      }
    } catch (error) {
      console.error('Generation error:', error);
      toast.error(`Failed: ${error.message}`);
    } finally {
      setLoading(false);
      if (!seedLocked) setSeed(Math.floor(Math.random() * 1000000));
    }
  };

  // Style transfer
  const handleStyleTransfer = async () => {
    if (!referenceImage) {
      toast.error('Upload a reference image first');
      return;
    }

    setLoading(true);
    try {
      const response = await base44.functions.invoke('imageLabOps', {
        operation: 'styleTransfer',
        imageUrl: referenceImage,
        targetStyle: selectedStyle
      });

      if (response.data.success) {
        setImages([{ url: response.data.styledUrl, style: selectedStyle }]);
        toast.success(`Applied ${selectedStyle} style!`);
      }
    } catch (error) {
      toast.error('Style transfer failed');
    } finally {
      setLoading(false);
    }
  };

  // Upscale image
  const handleUpscale = async (imageUrl) => {
    setLoading(true);
    try {
      const response = await base44.functions.invoke('imageLabOps', {
        operation: 'upscale',
        imageUrl,
        scale: 2
      });

      if (response.data.success) {
        setImages(prev => [...prev, { url: response.data.upscaledUrl, isUpscaled: true }]);
        toast.success('Image upscaled!');
      }
    } catch (error) {
      toast.error('Upscale failed');
    } finally {
      setLoading(false);
    }
  };

  // Remove background
  const handleRemoveBackground = async (imageUrl) => {
    setLoading(true);
    try {
      const response = await base44.functions.invoke('imageLabOps', {
        operation: 'removeBackground',
        imageUrl
      });

      if (response.data.success) {
        setImages(prev => [...prev, { url: response.data.processedUrl, bgRemoved: true }]);
        toast.success('Background removed!');
      }
    } catch (error) {
      toast.error('Background removal failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (url, index = 0) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `glyphlock-${selectedStyle}-${Date.now()}-${index + 1}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      a.remove();
      toast.success('Downloaded!');
    } catch (error) {
      window.open(url, '_blank');
    }
  };

  const handleReferenceUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image');
      return;
    }

    try {
      toast.loading('Uploading...');
      const result = await base44.integrations.Core.UploadFile({ file });
      setReferenceImage(result.file_url);
      toast.dismiss();
      toast.success('Reference uploaded');
    } catch (error) {
      toast.dismiss();
      toast.error('Upload failed');
    }
  };

  const saveDefaults = async () => {
    try {
      if (userPrefs?.id) {
        await base44.entities.UserPreferences.update(userPrefs.id, {
          imageLabSettings: { ...userPrefs.imageLabSettings, defaultStyle: selectedStyle, defaultQuality: quality }
        });
      } else {
        await base44.entities.UserPreferences.create({
          imageLabSettings: { defaultStyle: selectedStyle, defaultQuality: quality }
        });
      }
      toast.success('Defaults saved!');
    } catch (error) {
      toast.error('Failed to save');
    }
  };

  return (
    <div className={isMobile ? 'space-y-4' : 'space-y-6'}>
      {/* Sub-tabs for different modes */}
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
        <TabsList className={`bg-black/60 border border-purple-500/30 p-1 ${isMobile ? 'grid grid-cols-3 w-full' : ''}`}>
          <TabsTrigger value="generate" className={`data-[state=active]:bg-purple-600 data-[state=active]:text-white ${isMobile ? 'min-h-[48px] text-xs' : ''}`}>
            <Wand2 className={isMobile ? 'w-4 h-4' : 'w-4 h-4 mr-2'} />
            {!isMobile && 'Generate'}
          </TabsTrigger>
          <TabsTrigger value="transform" className={`data-[state=active]:bg-cyan-600 data-[state=active]:text-white ${isMobile ? 'min-h-[48px] text-xs' : ''}`}>
            <Paintbrush className={isMobile ? 'w-4 h-4' : 'w-4 h-4 mr-2'} />
            {!isMobile && 'Transform'}
          </TabsTrigger>
          <TabsTrigger value="tools" className={`data-[state=active]:bg-green-600 data-[state=active]:text-white ${isMobile ? 'min-h-[48px] text-xs' : ''}`}>
            <Scissors className={isMobile ? 'w-4 h-4' : 'w-4 h-4 mr-2'} />
            {!isMobile && 'Tools'}
          </TabsTrigger>
        </TabsList>

        {/* GENERATE TAB */}
        <TabsContent value="generate">
          <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'lg:grid-cols-3 gap-6'}`}>
            {/* Left Column - Controls */}
            <div className={`${isMobile ? 'space-y-4' : 'lg:col-span-2 space-y-6'}`}>
              {/* Prompt Panel */}
              <Card className={`${GlyphImageCard.premium} ${GlyphImageShadows.depth.lg}`}>
                <CardHeader className="border-b border-purple-500/20 flex flex-row items-center justify-between">
                  <CardTitle className={`${GlyphImageTypography.heading.lg} text-white flex items-center gap-2`}>
                    <Brain className="w-5 h-5 text-purple-400" />
                    AI Prompt Studio
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={saveDefaults} className="text-xs text-purple-300 hover:text-white gap-1">
                    <Save className="w-3 h-3" /> Save Defaults
                  </Button>
                </CardHeader>
                <CardContent className={GlyphImagePanel.primary}>
                  {/* Main Prompt */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-gray-300 font-semibold">Describe your vision</Label>
                      <Button
                        size="sm"
                        onClick={handleEnhancePrompt}
                        disabled={enhancing || !prompt.trim()}
                        className="text-xs bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
                      >
                        {enhancing ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Sparkles className="w-3 h-3 mr-1" />}
                        Enhance (⌘E)
                      </Button>
                    </div>
                    <Textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="A futuristic cityscape with neon lights, flying vehicles, rain reflections on the streets..."
                      className={`${GlyphImageInput.glow} min-h-[120px]`}
                    />
                    
                    {/* Enhanced prompt display */}
                    {enhancedPrompt && (
                      <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-purple-400 font-semibold">AI Enhanced:</span>
                          <Button size="sm" variant="ghost" onClick={() => setPrompt(enhancedPrompt)} className="text-xs text-purple-300">
                            <Copy className="w-3 h-3 mr-1" /> Use This
                          </Button>
                        </div>
                        <p className="text-sm text-gray-300">{enhancedPrompt}</p>
                      </div>
                    )}

                    {/* Prompt suggestions */}
                    {promptSuggestions.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-xs text-gray-500">Variations:</span>
                        <div className="flex flex-wrap gap-2">
                          {promptSuggestions.slice(0, 3).map((sug, i) => (
                            <button
                              key={i}
                              onClick={() => setPrompt(sug)}
                              className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-full border border-slate-700 transition-all"
                            >
                              {sug.substring(0, 50)}...
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Negative Prompt (collapsible) */}
                  <details className="group">
                    <summary className="cursor-pointer text-sm text-gray-400 hover:text-gray-300 flex items-center gap-2">
                      <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform" />
                      Negative Prompt (what to avoid)
                    </summary>
                    <Textarea
                      value={negativePrompt}
                      onChange={(e) => setNegativePrompt(e.target.value)}
                      placeholder="blurry, low quality, distorted, ugly, deformed..."
                      className={`${GlyphImageInput.base} mt-2 min-h-[60px]`}
                    />
                  </details>

                  {/* Style Dropdown */}
                  <div className="space-y-2">
                    <Label className="text-gray-300 font-semibold">Style Preset</Label>
                    <div className="relative" ref={dropdownRef}>
                      <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className={`w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r ${selectedStyleData?.color || 'from-slate-700 to-slate-800'} border-2 border-white/20 hover:border-cyan-400/50 transition-all duration-300`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{selectedStyleData?.icon}</span>
                          <div className="text-left">
                            <div className="text-white font-semibold">{selectedStyleData?.label}</div>
                            <div className="text-white/60 text-xs">{selectedStyleData?.desc}</div>
                          </div>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-white transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      <div className={`absolute z-50 w-full mt-2 bg-slate-900/98 backdrop-blur-xl border-2 border-purple-500/30 rounded-xl shadow-2xl overflow-hidden transition-all duration-300 origin-top ${
                        dropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                      }`}>
                        <div className="max-h-[400px] overflow-y-auto p-2 grid grid-cols-2 gap-1">
                          {STYLE_PRESETS.map((style) => (
                            <button
                              key={style.id}
                              onClick={() => { setSelectedStyle(style.id); setDropdownOpen(false); }}
                              className={`flex items-center gap-2 p-3 rounded-lg transition-all ${
                                selectedStyle === style.id
                                  ? `bg-gradient-to-r ${style.color} border border-cyan-400/50`
                                  : 'hover:bg-slate-800/80 border border-transparent'
                              }`}
                            >
                              <span className="text-xl">{style.icon}</span>
                              <div className="flex-1 text-left">
                                <div className="text-white text-sm font-medium">{style.label}</div>
                              </div>
                              {selectedStyle === style.id && <Check className="w-4 h-4 text-cyan-400" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Settings Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-400 text-xs">Aspect Ratio</Label>
                      <Select value={aspectRatio} onValueChange={setAspectRatio}>
                        <SelectTrigger className={GlyphImageInput.base}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-700">
                          {ASPECT_RATIOS.map(ar => (
                            <SelectItem key={ar.id} value={ar.id}>{ar.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-400 text-xs">Quality</Label>
                      <Select value={quality} onValueChange={setQuality}>
                        <SelectTrigger className={GlyphImageInput.base}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-700">
                          <SelectItem value="Draft">Draft</SelectItem>
                          <SelectItem value="Standard">Standard</SelectItem>
                          <SelectItem value="HD">HD</SelectItem>
                          <SelectItem value="Ultra">Ultra</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-400 text-xs">Batch ({batchCount})</Label>
                      <Input
                        type="number"
                        min="1"
                        max="8"
                        value={batchCount}
                        onChange={(e) => setBatchCount(Math.min(8, Math.max(1, parseInt(e.target.value) || 1)))}
                        className={GlyphImageInput.base}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-400 text-xs flex items-center gap-2">
                        Seed
                        <button onClick={() => setSeedLocked(!seedLocked)} className={seedLocked ? 'text-cyan-400' : 'text-gray-600'}>
                          {seedLocked ? '🔒' : '🎲'}
                        </button>
                      </Label>
                      <Input
                        type="number"
                        value={seed}
                        onChange={(e) => setSeed(parseInt(e.target.value) || 0)}
                        disabled={!seedLocked}
                        className={GlyphImageInput.base}
                      />
                    </div>
                  </div>

                  {/* Sliders */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-gray-400 text-xs">Creativity</Label>
                        <span className="text-xs text-cyan-400">{creativity}%</span>
                      </div>
                      <Slider
                        value={[creativity]}
                        onValueChange={([v]) => setCreativity(v)}
                        min={0}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-gray-400 text-xs">Style Strength</Label>
                        <span className="text-xs text-purple-400">{styleStrength}%</span>
                      </div>
                      <Slider
                        value={[styleStrength]}
                        onValueChange={([v]) => setStyleStrength(v)}
                        min={0}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Auto-enhance toggle */}
                  <div className="flex items-center justify-between p-3 bg-purple-500/10 rounded-lg border border-purple-500/30">
                    <div>
                      <Label className="text-white font-medium">AI Auto-Enhance</Label>
                      <p className="text-xs text-gray-400">Automatically improve your prompt for better results</p>
                    </div>
                    <Switch checked={autoEnhance} onCheckedChange={setAutoEnhance} />
                  </div>

                  {/* Reference Image */}
                  <div className="space-y-2">
                    <Label className="text-gray-300 text-sm">Reference Image (Optional)</Label>
                    <div className="flex items-center gap-4">
                      <input type="file" accept="image/*" onChange={handleReferenceUpload} className="hidden" id="ref-upload" />
                      <Button type="button" onClick={() => document.getElementById('ref-upload')?.click()} className={GlyphImageButton.secondary}>
                        <Upload className="w-4 h-4 mr-2" /> Upload
                      </Button>
                      {referenceImage && (
                        <div className="relative">
                          <img src={referenceImage} alt="Reference" className="h-16 rounded-lg border border-cyan-500/30 object-cover" />
                          <button onClick={() => setReferenceImage(null)} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">×</button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Generate Button */}
                  <Button
                    onClick={handleGenerate}
                    disabled={loading || !prompt.trim()}
                    className={`${GlyphImageButton.primary} w-full h-14 text-lg ${GlyphImageShadows.neonPurple}`}
                  >
                    {loading ? (
                      <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Generating {batchCount > 1 ? `${batchCount} images` : ''}...</>
                    ) : (
                      <><Zap className="w-5 h-5 mr-2" /> Generate {batchCount > 1 ? `${batchCount} Images` : 'Image'} (⌘G)</>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Preview */}
            <div className={isMobile ? '' : 'lg:col-span-1'}>
              <Card className={`${GlyphImageCard.premium} ${GlyphImageShadows.depth.lg} ${isMobile ? '' : 'sticky top-24'}`}>
                <CardHeader className="border-b border-purple-500/20">
                  <CardTitle className={`${GlyphImageTypography.heading.md} text-white flex items-center gap-2`}>
                    <ImageIcon className="w-5 h-5 text-cyan-400" />
                    Generated Images
                  </CardTitle>
                </CardHeader>
                <CardContent className={GlyphImagePanel.primary}>
                  {loading && (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="relative">
                        <Loader2 className="w-16 h-16 animate-spin text-cyan-400" />
                        <Sparkles className="w-6 h-6 text-purple-400 absolute top-0 right-0 animate-pulse" />
                      </div>
                      <p className="text-gray-400 mt-4">Crafting your vision...</p>
                      <p className="text-xs text-gray-600 mt-1">This may take 10-30 seconds</p>
                    </div>
                  )}

                  {!loading && images.length === 0 && (
                    <div className="text-center py-12">
                      <Wand2 className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                      <p className="text-gray-400">Your creations will appear here</p>
                      <p className="text-xs text-gray-600 mt-1">Enter a prompt and click Generate</p>
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
                        
                        {/* Action overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                          <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => handleDownload(img.url, idx)} className="bg-white/10 backdrop-blur-sm hover:bg-white/20">
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button size="sm" onClick={() => setFullscreenImage(img.url)} className="bg-white/10 backdrop-blur-sm hover:bg-white/20">
                                <Maximize2 className="w-4 h-4" />
                              </Button>
                              <Button size="sm" onClick={() => handleUpscale(img.url)} className="bg-cyan-500/20 backdrop-blur-sm hover:bg-cyan-500/30" title="Upscale">
                                <ArrowUpRight className="w-4 h-4" />
                              </Button>
                              <Button size="sm" onClick={() => handleRemoveBackground(img.url)} className="bg-green-500/20 backdrop-blur-sm hover:bg-green-500/30" title="Remove BG">
                                <Scissors className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Badges */}
                        <div className="absolute top-2 right-2 flex gap-1">
                          {img.isUpscaled && <span className="text-[10px] px-2 py-0.5 bg-cyan-500/80 text-white rounded-full">2x</span>}
                          {img.bgRemoved && <span className="text-[10px] px-2 py-0.5 bg-green-500/80 text-white rounded-full">No BG</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* TRANSFORM TAB */}
        <TabsContent value="transform">
          <Card className={`${GlyphImageCard.premium} ${GlyphImageShadows.depth.lg}`}>
            <CardHeader className="border-b border-cyan-500/20">
              <CardTitle className="text-white flex items-center gap-2">
                <Paintbrush className="w-5 h-5 text-cyan-400" />
                Style Transfer
              </CardTitle>
            </CardHeader>
            <CardContent className={GlyphImagePanel.primary}>
              <p className="text-gray-400 mb-4">Upload an image and apply any style preset to transform it.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <input type="file" accept="image/*" onChange={handleReferenceUpload} className="hidden" id="transform-upload" />
                  <Button onClick={() => document.getElementById('transform-upload')?.click()} className={`${GlyphImageButton.secondary} w-full`}>
                    <Upload className="w-4 h-4 mr-2" /> Upload Image
                  </Button>
                  
                  {referenceImage && (
                    <img src={referenceImage} alt="Source" className="w-full rounded-lg border border-cyan-500/30" />
                  )}
                </div>

                <div className="space-y-4">
                  <Label className="text-gray-300">Select Target Style</Label>
                  <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto">
                    {STYLE_PRESETS.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setSelectedStyle(style.id)}
                        className={`p-3 rounded-lg transition-all text-center ${
                          selectedStyle === style.id
                            ? `bg-gradient-to-r ${style.color} border border-cyan-400`
                            : 'bg-slate-800 hover:bg-slate-700 border border-transparent'
                        }`}
                      >
                        <span className="text-2xl block">{style.icon}</span>
                        <span className="text-xs text-white">{style.label}</span>
                      </button>
                    ))}
                  </div>

                  <Button
                    onClick={handleStyleTransfer}
                    disabled={loading || !referenceImage}
                    className={`${GlyphImageButton.primary} w-full`}
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Paintbrush className="w-4 h-4 mr-2" />}
                    Apply Style
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TOOLS TAB */}
        <TabsContent value="tools">
          <AIToolsSection 
            isMobile={isMobile}
            loading={loading}
            setLoading={setLoading}
            images={images}
            setImages={setImages}
          />
        </TabsContent>
      </Tabs>

      {/* Fullscreen Lightbox */}
      {fullscreenImage && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4" onClick={() => setFullscreenImage(null)}>
          <img src={fullscreenImage} alt="Fullscreen" className="max-w-full max-h-full rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()} />
          <div className="absolute top-4 right-4 flex gap-2">
            <Button onClick={() => handleDownload(fullscreenImage)} className="bg-gray-900/80 hover:bg-gray-800">
              <Download className="w-4 h-4 mr-2" /> Download
            </Button>
            <Button onClick={() => setFullscreenImage(null)} className="bg-gray-900/80 hover:bg-gray-800">Close</Button>
          </div>
        </div>
      )}
    </div>
  );
}