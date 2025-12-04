import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Palette, Square, Circle, Diamond, Grid3X3, Eye, 
  Upload, Image as ImageIcon, Sparkles, RotateCcw
} from 'lucide-react';

// Dot style options
const DOT_STYLES = [
  { id: 'square', name: 'Square', icon: Square },
  { id: 'rounded', name: 'Rounded', icon: Square },
  { id: 'circle', name: 'Circle', icon: Circle },
  { id: 'diamond', name: 'Diamond', icon: Diamond },
  { id: 'pixel', name: 'Pixel', icon: Grid3X3 }
];

// Eye (finder pattern) styles
const EYE_STYLES = [
  { id: 'square', name: 'Square' },
  { id: 'circular', name: 'Circular' },
  { id: 'rounded', name: 'Rounded' },
  { id: 'diamond', name: 'Diamond' }
];

// Logo shape options
const LOGO_SHAPES = [
  { id: 'circle', name: 'Circle' },
  { id: 'square', name: 'Square' },
  { id: 'rounded', name: 'Rounded' }
];

// Preset color palettes
const COLOR_PRESETS = [
  { id: 'classic', name: 'Classic', fg: '#000000', bg: '#FFFFFF' },
  { id: 'royal', name: 'Royal Blue', fg: '#1E40AF', bg: '#FFFFFF' },
  { id: 'cyber', name: 'Cyber', fg: '#0EA5E9', bg: '#0F172A' },
  { id: 'emerald', name: 'Emerald', fg: '#059669', bg: '#FFFFFF' },
  { id: 'sunset', name: 'Sunset', fg: '#DC2626', bg: '#FEF2F2' },
  { id: 'grape', name: 'Grape', fg: '#7C3AED', bg: '#FFFFFF' },
  { id: 'gold', name: 'Gold', fg: '#B45309', bg: '#FFFBEB' },
  { id: 'ocean', name: 'Ocean', fg: '#0369A1', bg: '#E0F2FE' }
];

export default function QrCustomizationPanel({ 
  customization, 
  setCustomization,
  errorCorrectionLevel,
  setErrorCorrectionLevel,
  onApply
}) {
  const [activeSection, setActiveSection] = useState('dots');

  const updateCustomization = (key, value) => {
    setCustomization(prev => ({ ...prev, [key]: value }));
  };

  const updateGradient = (key, value) => {
    setCustomization(prev => ({
      ...prev,
      gradient: { ...prev.gradient, [key]: value }
    }));
  };

  const updateEyeColors = (eye, part, color) => {
    setCustomization(prev => ({
      ...prev,
      eyeColors: {
        ...prev.eyeColors,
        [eye]: { ...prev.eyeColors[eye], [part]: color }
      }
    }));
  };

  const updateLogo = (key, value) => {
    setCustomization(prev => ({
      ...prev,
      logo: { ...prev.logo, [key]: value }
    }));
  };

  const updateBackground = (key, value) => {
    setCustomization(prev => ({
      ...prev,
      background: { ...prev.background, [key]: value }
    }));
  };

  const resetToDefaults = () => {
    setCustomization({
      dotStyle: 'square',
      eyeStyle: 'square',
      foregroundColor: '#000000',
      backgroundColor: '#FFFFFF',
      gradient: {
        enabled: false,
        type: 'linear',
        angle: 0,
        color1: '#000000',
        color2: '#3B82F6',
        color3: null
      },
      eyeColors: {
        topLeft: { inner: '#000000', outer: '#000000' },
        topRight: { inner: '#000000', outer: '#000000' },
        bottomLeft: { inner: '#000000', outer: '#000000' }
      },
      logo: {
        url: null,
        file: null,
        opacity: 100,
        size: 20,
        border: false,
        shape: 'square'
      },
      background: {
        type: 'solid',
        color: '#FFFFFF',
        gradientColor1: '#FFFFFF',
        gradientColor2: '#E5E7EB',
        imageUrl: null
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Section Tabs */}
      <Tabs value={activeSection} onValueChange={setActiveSection}>
        <TabsList className="w-full bg-gray-900/50 border border-cyan-500/20 p-1">
          <TabsTrigger value="dots" className="flex-1 text-xs">Dots</TabsTrigger>
          <TabsTrigger value="eyes" className="flex-1 text-xs">Eyes</TabsTrigger>
          <TabsTrigger value="colors" className="flex-1 text-xs">Colors</TabsTrigger>
          <TabsTrigger value="gradient" className="flex-1 text-xs">Gradient</TabsTrigger>
          <TabsTrigger value="background" className="flex-1 text-xs">Background</TabsTrigger>
          <TabsTrigger value="logo" className="flex-1 text-xs">Logo</TabsTrigger>
        </TabsList>

        {/* DOT STYLES */}
        <TabsContent value="dots" className="mt-4">
          <Card className="bg-gray-900/80 border-cyan-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <Grid3X3 className="w-4 h-4 text-cyan-400" />
                Dot Style
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {DOT_STYLES.map(style => {
                  const Icon = style.icon;
                  return (
                    <button
                      key={style.id}
                      onClick={() => updateCustomization('dotStyle', style.id)}
                      className={`flex flex-col items-center p-3 rounded-lg border transition-all ${
                        customization.dotStyle === style.id 
                          ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300' 
                          : 'border-gray-700 hover:border-gray-600 text-gray-400'
                      }`}
                    >
                      <Icon className="w-6 h-6 mb-1" />
                      <span className="text-[10px] font-medium">{style.name}</span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* EYE STYLES */}
        <TabsContent value="eyes" className="mt-4 space-y-4">
          <Card className="bg-gray-900/80 border-purple-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <Eye className="w-4 h-4 text-purple-400" />
                Finder Pattern Style
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-2 mb-6">
                {EYE_STYLES.map(style => (
                  <button
                    key={style.id}
                    onClick={() => updateCustomization('eyeStyle', style.id)}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      customization.eyeStyle === style.id 
                        ? 'border-purple-500 bg-purple-500/20 text-purple-300' 
                        : 'border-gray-700 hover:border-gray-600 text-gray-400'
                    }`}
                  >
                    <span className="text-xs font-medium">{style.name}</span>
                  </button>
                ))}
              </div>

              {/* Individual Eye Colors */}
              <div className="space-y-4">
                <Label className="text-white text-xs">Eye Colors (Inner / Outer)</Label>
                <div className="grid grid-cols-3 gap-4">
                  {['topLeft', 'topRight', 'bottomLeft'].map((eye, idx) => (
                    <div key={eye} className="space-y-2">
                      <Label className="text-gray-400 text-[10px] uppercase">
                        {eye === 'topLeft' ? 'Top Left' : eye === 'topRight' ? 'Top Right' : 'Bottom Left'}
                      </Label>
                      <div className="flex gap-1">
                        <Input
                          type="color"
                          value={customization.eyeColors?.[eye]?.inner || '#000000'}
                          onChange={(e) => updateEyeColors(eye, 'inner', e.target.value)}
                          className="w-1/2 h-8 p-1 bg-gray-800 border-gray-700"
                          title="Inner color"
                        />
                        <Input
                          type="color"
                          value={customization.eyeColors?.[eye]?.outer || '#000000'}
                          onChange={(e) => updateEyeColors(eye, 'outer', e.target.value)}
                          className="w-1/2 h-8 p-1 bg-gray-800 border-gray-700"
                          title="Outer color"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* COLORS */}
        <TabsContent value="colors" className="mt-4">
          <Card className="bg-gray-900/80 border-blue-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <Palette className="w-4 h-4 text-blue-400" />
                Color Presets
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-4 gap-2">
                {COLOR_PRESETS.map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      updateCustomization('foregroundColor', preset.fg);
                      updateCustomization('backgroundColor', preset.bg);
                    }}
                    className={`p-2 rounded-lg border transition-all ${
                      customization.foregroundColor === preset.fg && customization.backgroundColor === preset.bg
                        ? 'border-blue-500 bg-blue-500/20' 
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <div className="w-4 h-4 rounded border border-gray-600" style={{ backgroundColor: preset.fg }} />
                      <div className="w-4 h-4 rounded border border-gray-600" style={{ backgroundColor: preset.bg }} />
                    </div>
                    <span className="text-[10px] text-white font-medium">{preset.name}</span>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                <div>
                  <Label className="text-white text-xs mb-2 block">Foreground</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={customization.foregroundColor || '#000000'}
                      onChange={(e) => updateCustomization('foregroundColor', e.target.value)}
                      className="w-12 h-10 p-1 bg-gray-800 border-gray-700"
                    />
                    <Input
                      type="text"
                      value={customization.foregroundColor || '#000000'}
                      onChange={(e) => updateCustomization('foregroundColor', e.target.value)}
                      className="flex-1 h-10 bg-gray-800 border-gray-700 text-white font-mono text-xs"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-white text-xs mb-2 block">Background</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={customization.backgroundColor || '#FFFFFF'}
                      onChange={(e) => updateCustomization('backgroundColor', e.target.value)}
                      className="w-12 h-10 p-1 bg-gray-800 border-gray-700"
                    />
                    <Input
                      type="text"
                      value={customization.backgroundColor || '#FFFFFF'}
                      onChange={(e) => updateCustomization('backgroundColor', e.target.value)}
                      className="flex-1 h-10 bg-gray-800 border-gray-700 text-white font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* GRADIENT */}
        <TabsContent value="gradient" className="mt-4">
          <Card className="bg-gray-900/80 border-green-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-green-400" />
                  Gradient
                </span>
                <Switch
                  checked={customization.gradient?.enabled || false}
                  onCheckedChange={(checked) => updateGradient('enabled', checked)}
                />
              </CardTitle>
            </CardHeader>
            {customization.gradient?.enabled && (
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-white text-xs mb-2 block">Type</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => updateGradient('type', 'linear')}
                      className={`p-2 rounded-lg border text-xs ${
                        customization.gradient?.type === 'linear' 
                          ? 'border-green-500 bg-green-500/20 text-green-300' 
                          : 'border-gray-700 text-gray-400'
                      }`}
                    >
                      Linear
                    </button>
                    <button
                      onClick={() => updateGradient('type', 'radial')}
                      className={`p-2 rounded-lg border text-xs ${
                        customization.gradient?.type === 'radial' 
                          ? 'border-green-500 bg-green-500/20 text-green-300' 
                          : 'border-gray-700 text-gray-400'
                      }`}
                    >
                      Radial
                    </button>
                  </div>
                </div>

                {customization.gradient?.type === 'linear' && (
                  <div>
                    <Label className="text-white text-xs mb-2 block">
                      Angle: {customization.gradient?.angle || 0}°
                    </Label>
                    <Slider
                      value={[customization.gradient?.angle || 0]}
                      onValueChange={([val]) => updateGradient('angle', val)}
                      min={0}
                      max={360}
                      step={15}
                      className="mt-2"
                    />
                  </div>
                )}

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label className="text-white text-[10px] mb-1 block">Color 1</Label>
                    <Input
                      type="color"
                      value={customization.gradient?.color1 || '#000000'}
                      onChange={(e) => updateGradient('color1', e.target.value)}
                      className="w-full h-10 p-1 bg-gray-800 border-gray-700"
                    />
                  </div>
                  <div>
                    <Label className="text-white text-[10px] mb-1 block">Color 2</Label>
                    <Input
                      type="color"
                      value={customization.gradient?.color2 || '#3B82F6'}
                      onChange={(e) => updateGradient('color2', e.target.value)}
                      className="w-full h-10 p-1 bg-gray-800 border-gray-700"
                    />
                  </div>
                  <div>
                    <Label className="text-white text-[10px] mb-1 block">Color 3</Label>
                    <Input
                      type="color"
                      value={customization.gradient?.color3 || '#8B5CF6'}
                      onChange={(e) => updateGradient('color3', e.target.value)}
                      className="w-full h-10 p-1 bg-gray-800 border-gray-700"
                    />
                  </div>
                </div>

                {/* Gradient Preview */}
                <div 
                  className="h-8 rounded-lg border border-gray-700"
                  style={{
                    background: customization.gradient?.type === 'radial'
                      ? `radial-gradient(circle, ${customization.gradient?.color1}, ${customization.gradient?.color2}${customization.gradient?.color3 ? `, ${customization.gradient.color3}` : ''})`
                      : `linear-gradient(${customization.gradient?.angle || 0}deg, ${customization.gradient?.color1}, ${customization.gradient?.color2}${customization.gradient?.color3 ? `, ${customization.gradient.color3}` : ''})`
                  }}
                />
              </CardContent>
            )}
          </Card>
        </TabsContent>

        {/* BACKGROUND */}
        <TabsContent value="background" className="mt-4">
          <Card className="bg-gray-900/80 border-yellow-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-yellow-400" />
                Background
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-white text-xs mb-2 block">Type</Label>
                <div className="grid grid-cols-3 gap-2">
                  {['solid', 'gradient', 'image'].map(type => (
                    <button
                      key={type}
                      onClick={() => updateBackground('type', type)}
                      className={`p-2 rounded-lg border text-xs capitalize ${
                        customization.background?.type === type 
                          ? 'border-yellow-500 bg-yellow-500/20 text-yellow-300' 
                          : 'border-gray-700 text-gray-400'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {customization.background?.type === 'solid' && (
                <div>
                  <Label className="text-white text-xs mb-2 block">Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={customization.background?.color || '#FFFFFF'}
                      onChange={(e) => updateBackground('color', e.target.value)}
                      className="w-12 h-10 p-1 bg-gray-800 border-gray-700"
                    />
                    <Input
                      type="text"
                      value={customization.background?.color || '#FFFFFF'}
                      onChange={(e) => updateBackground('color', e.target.value)}
                      className="flex-1 h-10 bg-gray-800 border-gray-700 text-white font-mono text-xs"
                    />
                  </div>
                </div>
              )}

              {customization.background?.type === 'gradient' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-white text-[10px] mb-1 block">Color 1</Label>
                    <Input
                      type="color"
                      value={customization.background?.gradientColor1 || '#FFFFFF'}
                      onChange={(e) => updateBackground('gradientColor1', e.target.value)}
                      className="w-full h-10 p-1 bg-gray-800 border-gray-700"
                    />
                  </div>
                  <div>
                    <Label className="text-white text-[10px] mb-1 block">Color 2</Label>
                    <Input
                      type="color"
                      value={customization.background?.gradientColor2 || '#E5E7EB'}
                      onChange={(e) => updateBackground('gradientColor2', e.target.value)}
                      className="w-full h-10 p-1 bg-gray-800 border-gray-700"
                    />
                  </div>
                </div>
              )}

              {customization.background?.type === 'image' && (
                <div>
                  <Label className="text-white text-xs mb-2 block">Image URL</Label>
                  <Input
                    type="text"
                    value={customization.background?.imageUrl || ''}
                    onChange={(e) => updateBackground('imageUrl', e.target.value)}
                    placeholder="https://example.com/bg.png"
                    className="h-10 bg-gray-800 border-gray-700 text-white text-xs"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* LOGO */}
        <TabsContent value="logo" className="mt-4">
          <Card className="bg-gray-900/80 border-pink-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <Upload className="w-4 h-4 text-pink-400" />
                Logo Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-white text-xs mb-2 block">Logo URL</Label>
                <Input
                  type="text"
                  value={customization.logo?.url || ''}
                  onChange={(e) => updateLogo('url', e.target.value)}
                  placeholder="https://example.com/logo.png"
                  className="h-10 bg-gray-800 border-gray-700 text-white text-xs"
                />
              </div>

              <div>
                <Label className="text-white text-xs mb-2 block">
                  Opacity: {customization.logo?.opacity || 100}%
                </Label>
                <Slider
                  value={[customization.logo?.opacity || 100]}
                  onValueChange={([val]) => updateLogo('opacity', val)}
                  min={10}
                  max={100}
                  step={5}
                />
              </div>

              <div>
                <Label className="text-white text-xs mb-2 block">
                  Size: {customization.logo?.size || 20}%
                </Label>
                <Slider
                  value={[customization.logo?.size || 20]}
                  onValueChange={([val]) => updateLogo('size', val)}
                  min={10}
                  max={40}
                  step={2}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-white text-xs">Border</Label>
                <Switch
                  checked={customization.logo?.border || false}
                  onCheckedChange={(checked) => updateLogo('border', checked)}
                />
              </div>

              <div>
                <Label className="text-white text-xs mb-2 block">Shape</Label>
                <div className="grid grid-cols-3 gap-2">
                  {LOGO_SHAPES.map(shape => (
                    <button
                      key={shape.id}
                      onClick={() => updateLogo('shape', shape.id)}
                      className={`p-2 rounded-lg border text-xs ${
                        customization.logo?.shape === shape.id 
                          ? 'border-pink-500 bg-pink-500/20 text-pink-300' 
                          : 'border-gray-700 text-gray-400'
                      }`}
                    >
                      {shape.name}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Error Correction */}
      <Card className="bg-gray-900/80 border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-sm">Error Correction</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={errorCorrectionLevel} onValueChange={setErrorCorrectionLevel}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="L">L - Low (7%)</SelectItem>
              <SelectItem value="M">M - Medium (15%)</SelectItem>
              <SelectItem value="Q">Q - Quartile (25%)</SelectItem>
              <SelectItem value="H">H - High (30%)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-[10px] text-gray-500 mt-2">
            Higher = more data recovery, larger QR code
          </p>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={resetToDefaults}
          variant="outline"
          className="flex-1 border-gray-700 text-gray-400 hover:bg-gray-800"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
        <Button
          onClick={onApply}
          className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Apply Customization
        </Button>
      </div>
    </div>
  );
}