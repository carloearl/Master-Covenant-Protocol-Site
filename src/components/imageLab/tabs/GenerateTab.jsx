import React, { useState, useRef, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Loader2, Wand2, Download, Maximize2, Upload, ChevronDown, Check } from 'lucide-react';
import { toast } from 'sonner';
import {
  GlyphImageCard,
  GlyphImageButton,
  GlyphImageInput,
  GlyphImageTypography,
  GlyphImageShadows,
  GlyphImagePanel,
} from '../design/GlyphImageDesignSystem';

// SVG Icons for Style Presets
const StyleIcons = {
  photorealistic: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
      <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
      <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  cyberpunk: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 22V12M2 7l10 5 10-5" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="12" r="2" fill="currentColor"/>
    </svg>
  ),
  watercolor: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <path d="M12 2c-5.5 6 -8 10-8 14a8 8 0 1016 0c0-4-2.5-8-8-14z" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 18c-2.2 0-4-1.8-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  oilPainting: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <path d="M18 10l-4-4-8 8v4h4l8-8z" stroke="currentColor" strokeWidth="2"/>
      <path d="M14 6l4 4" stroke="currentColor" strokeWidth="2"/>
      <path d="M3 21h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  anime: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <circle cx="12" cy="10" r="7" stroke="currentColor" strokeWidth="2"/>
      <circle cx="9" cy="9" r="1.5" fill="currentColor"/>
      <circle cx="15" cy="9" r="1.5" fill="currentColor"/>
      <path d="M9 13c1.5 1 4.5 1 6 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M8 3l2 3M16 3l-2 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  minimalist: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <rect x="4" y="4" width="16" height="16" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  surreal: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 3c-3 3-3 6 0 9s3 6 0 9" stroke="currentColor" strokeWidth="2"/>
      <ellipse cx="8" cy="10" rx="1" ry="2" fill="currentColor"/>
      <ellipse cx="16" cy="10" rx="1" ry="2" fill="currentColor"/>
    </svg>
  ),
  neon: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  vintage: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
      <circle cx="18" cy="8" r="1" fill="currentColor"/>
    </svg>
  ),
  pencilSketch: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <path d="M17 3l4 4-14 14H3v-4L17 3z" stroke="currentColor" strokeWidth="2"/>
      <path d="M15 5l4 4" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  popArt: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <rect x="3" y="3" width="8" height="8" fill="currentColor" opacity="0.5"/>
      <rect x="13" y="3" width="8" height="8" stroke="currentColor" strokeWidth="2"/>
      <rect x="3" y="13" width="8" height="8" stroke="currentColor" strokeWidth="2"/>
      <rect x="13" y="13" width="8" height="8" fill="currentColor" opacity="0.5"/>
    </svg>
  ),
  sciFi: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <path d="M12 2l3 6h6l-5 4 2 7-6-4-6 4 2-7-5-4h6l3-6z" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  gothic: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <path d="M12 2L8 8v8l4 6 4-6V8l-4-6z" stroke="currentColor" strokeWidth="2"/>
      <path d="M8 12h8" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="8" r="1" fill="currentColor"/>
    </svg>
  ),
  impressionist: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <circle cx="6" cy="8" r="2" fill="currentColor" opacity="0.7"/>
      <circle cx="12" cy="6" r="2" fill="currentColor" opacity="0.5"/>
      <circle cx="18" cy="9" r="2" fill="currentColor" opacity="0.6"/>
      <circle cx="8" cy="14" r="2" fill="currentColor" opacity="0.4"/>
      <circle cx="14" cy="13" r="2" fill="currentColor" opacity="0.8"/>
      <circle cx="10" cy="19" r="2" fill="currentColor" opacity="0.5"/>
      <circle cx="17" cy="17" r="2" fill="currentColor" opacity="0.6"/>
    </svg>
  ),
  lowPoly: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <path d="M12 2l10 7-4 13H6L2 9l10-7z" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 2v20M2 9h20M6 22l6-13 6 13" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
    </svg>
  ),
  steampunk: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="12" r="1" fill="currentColor"/>
    </svg>
  ),
  vaporwave: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <path d="M2 20L12 4l10 16H2z" stroke="currentColor" strokeWidth="2"/>
      <path d="M6 20l6-10 6 10" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
      <circle cx="12" cy="8" r="2" fill="currentColor"/>
    </svg>
  ),
  artDeco: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <path d="M12 2v20M7 2v20M17 2v20" stroke="currentColor" strokeWidth="2"/>
      <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1"/>
      <circle cx="12" cy="12" r="3" fill="currentColor"/>
    </svg>
  ),
};

const STYLE_PRESETS = [
  { id: 'photorealistic', label: 'Photorealistic', desc: 'True-to-life imagery', color: 'from-slate-600 to-slate-800' },
  { id: 'cyberpunk', label: 'Cyberpunk', desc: 'Neon-lit futuristic', color: 'from-pink-600 to-purple-800' },
  { id: 'watercolor', label: 'Watercolor', desc: 'Soft painted look', color: 'from-blue-400 to-cyan-600' },
  { id: 'oilPainting', label: 'Oil Painting', desc: 'Classic fine art', color: 'from-amber-600 to-orange-800' },
  { id: 'anime', label: 'Anime', desc: 'Japanese animation', color: 'from-rose-500 to-pink-700' },
  { id: 'minimalist', label: 'Minimalist', desc: 'Clean and simple', color: 'from-gray-400 to-gray-600' },
  { id: 'surreal', label: 'Surreal', desc: 'Dreamlike fantasy', color: 'from-violet-600 to-indigo-800' },
  { id: 'neon', label: 'Neon', desc: 'Glowing lights', color: 'from-cyan-500 to-blue-700' },
  { id: 'vintage', label: 'Vintage', desc: 'Retro aesthetic', color: 'from-yellow-700 to-amber-900' },
  { id: 'pencilSketch', label: 'Pencil Sketch', desc: 'Hand-drawn look', color: 'from-zinc-500 to-zinc-700' },
  { id: 'popArt', label: 'Pop Art', desc: 'Bold comic style', color: 'from-red-500 to-yellow-500' },
  { id: 'sciFi', label: 'Sci-Fi', desc: 'Space and tech', color: 'from-blue-600 to-purple-800' },
  { id: 'gothic', label: 'Gothic', desc: 'Dark and moody', color: 'from-gray-800 to-black' },
  { id: 'impressionist', label: 'Impressionist', desc: 'Monet-inspired', color: 'from-green-500 to-teal-700' },
  { id: 'lowPoly', label: 'Low Poly', desc: '3D geometric', color: 'from-emerald-500 to-cyan-700' },
  { id: 'steampunk', label: 'Steampunk', desc: 'Victorian meets tech', color: 'from-amber-700 to-stone-800' },
  { id: 'vaporwave', label: 'Vaporwave', desc: '80s retro future', color: 'from-fuchsia-500 to-cyan-500' },
  { id: 'artDeco', label: 'Art Deco', desc: '1920s elegance', color: 'from-yellow-500 to-amber-700' },
];

export default function GenerateTab({ user, userPrefs, onImageGenerated }) {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(userPrefs?.imageLabSettings?.defaultStyle || 'photorealistic');
  const [batchCount, setBatchCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [referenceImage, setReferenceImage] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [controls, setControls] = useState({
    aspectRatio: '1:1',
    modelStrength: 75,
    sharpness: 50,
    creativity: 70,
    guidanceScale: 7.5,
    seed: Math.floor(Math.random() * 1000000),
    seedLocked: false,
    qualityMode: userPrefs?.imageLabSettings?.defaultQuality || 'Standard',
    negativePrompt: '',
  });

  // Load User Preferences on mount/change
  useEffect(() => {
    if (userPrefs?.imageLabSettings) {
      if (userPrefs.imageLabSettings.defaultStyle) setSelectedStyle(userPrefs.imageLabSettings.defaultStyle);
      if (userPrefs.imageLabSettings.defaultQuality) setControls(prev => ({ ...prev, qualityMode: userPrefs.imageLabSettings.defaultQuality }));
    }
  }, [userPrefs]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'g') {
        e.preventDefault();
        if (prompt.trim() && !loading) {
          handleGenerate();
        } else if (!prompt.trim()) {
          toast.error('Please enter a prompt first');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prompt, loading]); // Dependencies needed for closure

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

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setLoading(true);
    setImages([]);

    try {
      const styleLabel = selectedStyleData?.label || selectedStyle;
      const enhancedPrompt = `${prompt}${selectedStyle !== 'photorealistic' ? `, ${styleLabel} style` : ''}, ${controls.qualityMode.toLowerCase()} quality, highly detailed`;

      const promises = Array.from({ length: batchCount }, async () => {
        const result = await base44.integrations.Core.GenerateImage({
          prompt: enhancedPrompt,
        });

        const savedImage = await base44.entities.InteractiveImage.create({
          name: `Generated: ${prompt.substring(0, 50)}`,
          fileUrl: result.url,
          prompt,
          style: selectedStyle,
          generationSettings: controls,
          source: 'generated',
          status: 'draft',
          ownerEmail: user?.email || 'guest',
        });

        return { url: result.url, id: savedImage.id, ...savedImage };
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
      window.open(url, '_blank');
    }
  };

  const handleReferenceUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image must be less than 10MB');
      return;
    }

    try {
      toast.loading('Uploading image...');
      const result = await base44.integrations.Core.UploadFile({ file });
      setReferenceImage(result.file_url);
      toast.dismiss();
      toast.success('Reference image uploaded');
    } catch (error) {
      toast.dismiss();
      toast.error('Upload failed');
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

            {/* Style Dropdown */}
            <div className="space-y-2">
              <Label className="text-gray-300 font-semibold">Style Preset</Label>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r ${selectedStyleData?.color || 'from-slate-700 to-slate-800'} border-2 border-white/20 hover:border-cyan-400/50 transition-all duration-300 group`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-white">
                      {StyleIcons[selectedStyle] || StyleIcons.photorealistic}
                    </div>
                    <div className="text-left">
                      <div className="text-white font-semibold">{selectedStyleData?.label}</div>
                      <div className="text-white/60 text-xs">{selectedStyleData?.desc}</div>
                    </div>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-white transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                <div className={`absolute z-50 w-full mt-2 bg-slate-900/98 backdrop-blur-xl border-2 border-purple-500/30 rounded-xl shadow-2xl overflow-hidden transition-all duration-300 origin-top ${
                  dropdownOpen 
                    ? 'opacity-100 scale-100 translate-y-0' 
                    : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                }`}>
                  <div className="max-h-[400px] overflow-y-auto p-2 space-y-1">
                    {STYLE_PRESETS.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => {
                          setSelectedStyle(style.id);
                          setDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group ${
                          selectedStyle === style.id
                            ? `bg-gradient-to-r ${style.color} border border-cyan-400/50`
                            : 'hover:bg-slate-800/80 border border-transparent'
                        }`}
                      >
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${style.color} text-white`}>
                          {StyleIcons[style.id] || StyleIcons.photorealistic}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="text-white font-medium">{style.label}</div>
                          <div className="text-gray-400 text-xs">{style.desc}</div>
                        </div>
                        {selectedStyle === style.id && (
                          <Check className="w-5 h-5 text-cyan-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
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
                  <SelectContent className="bg-slate-900 border-slate-700">
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
              <Button
                type="button"
                onClick={() => document.getElementById('reference-upload')?.click()}
                className={GlyphImageButton.secondary}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Reference
              </Button>
              {referenceImage && (
                <div className="flex-1">
                  <img 
                    src={referenceImage} 
                    alt="Reference" 
                    className="h-20 rounded-lg border border-cyan-500/30 object-cover"
                  />
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