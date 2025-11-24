import React, { useState, useEffect, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2, Wand2, Layers, Shield, Sparkles, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { 
  GlyphCard, 
  GlyphButton, 
  GlyphPanel, 
  GlyphInput, 
  GlyphTypography, 
  GlyphShadows,
  GlyphGradients 
} from './design/GlyphQrDesignSystem';
import { PAYLOAD_TYPES } from './config/PayloadTypesCatalog';
import PayloadTypeSelector from './PayloadTypeSelector';
import QrSecurityBadge from './QrSecurityBadge';
import QrPreviewCanvas from './QrPreviewCanvas';
import QrHotZoneEditor from './QrHotZoneEditor';
import QrStegoArtBuilder from './QrStegoArtBuilder';
import AnalyticsPanel from './AnalyticsPanel';
import QrBatchUploader from './QrBatchUploader';

export default function QrStudio() {
  const [activeTab, setActiveTab] = useState('create');
  const [payloadType, setPayloadType] = useState('url');
  const [payloadValue, setPayloadValue] = useState('');
  const [title, setTitle] = useState('');
  const [mode, setMode] = useState('static');
  const [dynamicRedirectUrl, setDynamicRedirectUrl] = useState('');
  const [artStyle, setArtStyle] = useState('');
  const [colorTheme, setColorTheme] = useState('#000000');
  const [logoUrl, setLogoUrl] = useState('');
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState('H');
  const [hotZones, setHotZones] = useState([]);
  const [riskScore, setRiskScore] = useState(0);
  const [riskFlags, setRiskFlags] = useState([]);
  const [qrAssetDraft, setQrAssetDraft] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPayloadSelector, setShowPayloadSelector] = useState(false);

  const selectedPayloadType = PAYLOAD_TYPES.find(t => t.id === payloadType);

  // Risk evaluation with debounce
  useEffect(() => {
    if (!payloadValue) {
      setRiskScore(0);
      setRiskFlags([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const result = await base44.functions.invoke('evaluateQrRisk', {
          payloadType,
          payloadValue
        });
        setRiskScore(result.data.riskScore || 0);
        setRiskFlags(result.data.riskFlags || []);
      } catch (error) {
        console.error('Risk evaluation failed:', error);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [payloadType, payloadValue]);

  const handleGenerate = async () => {
    if (!title || !payloadValue) {
      toast.error('Title and payload are required');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await base44.functions.invoke('generateQrAsset', {
        title,
        mode,
        payloadType,
        payloadValue,
        dynamicRedirectUrl: mode === 'dynamic' ? dynamicRedirectUrl : null,
        artStyle: artStyle || null,
        logoUrl: logoUrl || null,
        colorTheme,
        errorCorrectionLevel,
        hotZones,
        stegoConfig: { enabled: false }
      });

      setQrAssetDraft({
        id: result.data.qrAssetId,
        title,
        safeQrImageUrl: result.data.safeQrImageUrl,
        artQrImageUrl: result.data.artQrImageUrl,
        immutableHash: result.data.immutableHash,
        riskScore: result.data.riskScore,
        riskFlags: result.data.riskFlags,
        errorCorrectionLevel,
        artStyle,
        hotZones
      });

      toast.success('QR code generated successfully!');
      setActiveTab('preview');
    } catch (error) {
      toast.error(error.message || 'Generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEmbedded = (disguisedImageUrl, mode) => {
    setQrAssetDraft(prev => ({
      ...prev,
      disguisedImageUrl,
      stegoConfig: { enabled: true, mode }
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <div className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              GlyphLock QR Studio
            </h1>
            <p className="text-sm sm:text-base text-gray-400">
              Next-generation QR codes with stego art, hot zones, and anti-quishing protection
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-7xl">

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {/* Desktop Tabs - Horizontal */}
        <TabsList className="hidden lg:flex w-full mb-6 bg-gray-900/50 border border-gray-800 p-1">
          <TabsTrigger value="create" className="flex-1 min-h-[44px] data-[state=active]:bg-cyan-600 data-[state=active]:text-white">
            <Wand2 className="w-4 h-4 mr-2" />
            Create
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex-1 min-h-[44px] data-[state=active]:bg-cyan-600 data-[state=active]:text-white">
            Preview
          </TabsTrigger>
          <TabsTrigger value="customize" className="flex-1 min-h-[44px] data-[state=active]:bg-cyan-600 data-[state=active]:text-white">
            Customize
          </TabsTrigger>
          <TabsTrigger value="hotzones" className="flex-1 min-h-[44px] data-[state=active]:bg-cyan-600 data-[state=active]:text-white">
            <Layers className="w-4 h-4 mr-2" />
            Hot Zones
          </TabsTrigger>
          <TabsTrigger value="stego" className="flex-1 min-h-[44px] data-[state=active]:bg-cyan-600 data-[state=active]:text-white">
            Stego
          </TabsTrigger>
          <TabsTrigger value="security" className="flex-1 min-h-[44px] data-[state=active]:bg-cyan-600 data-[state=active]:text-white">
            <Shield className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex-1 min-h-[44px] data-[state=active]:bg-cyan-600 data-[state=active]:text-white">
            Analytics
          </TabsTrigger>
          <TabsTrigger value="bulk" className="flex-1 min-h-[44px] data-[state=active]:bg-cyan-600 data-[state=active]:text-white">
            Bulk
          </TabsTrigger>
        </TabsList>

        {/* Mobile Tabs - Scrollable Pills */}
        <div className="lg:hidden mb-6 -mx-4 px-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { value: 'create', icon: Wand2, label: 'Create' },
              { value: 'preview', icon: null, label: 'Preview' },
              { value: 'customize', icon: null, label: 'Customize' },
              { value: 'hotzones', icon: Layers, label: 'Hot Zones' },
              { value: 'stego', icon: null, label: 'Stego' },
              { value: 'security', icon: Shield, label: 'Security' },
              { value: 'analytics', icon: null, label: 'Analytics' },
              { value: 'bulk', icon: null, label: 'Bulk' },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap text-sm font-medium transition-all min-h-[44px] ${
                    activeTab === tab.value
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/50'
                      : 'bg-gray-900/50 text-gray-400 border border-gray-800'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Create Tab */}
        <TabsContent value="create">
          {/* Desktop: 2-column layout */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-6">
            <Card className="bg-gray-900/50 border-gray-800 shadow-xl">
              <CardHeader className="border-b border-gray-800">
                <CardTitle className="text-white">QR Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-gray-300">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="My QR Code"
                    className="min-h-[44px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payloadType" className="text-gray-300">Payload Type</Label>
                  <Select value={payloadType} onValueChange={setPayloadType}>
                    <SelectTrigger id="payloadType" className="min-h-[44px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="url">URL</SelectItem>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="vcard">vCard</SelectItem>
                      <SelectItem value="wifi">WiFi</SelectItem>
                      <SelectItem value="app">App Link</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payloadValue" className="text-gray-300">Payload</Label>
                  <Textarea
                    id="payloadValue"
                    value={payloadValue}
                    onChange={(e) => setPayloadValue(e.target.value)}
                    placeholder={payloadType === 'url' ? 'https://example.com' : 'Your content here'}
                    className="min-h-[80px]"
                  />
                </div>

                <div className="flex items-center justify-between py-2 border-t border-gray-700">
                  <Label htmlFor="mode" className="text-gray-300">Dynamic Mode</Label>
                  <Switch
                    id="mode"
                    checked={mode === 'dynamic'}
                    onCheckedChange={(checked) => setMode(checked ? 'dynamic' : 'static')}
                    className="min-h-[44px] min-w-[44px]"
                  />
                </div>

                {mode === 'dynamic' && (
                  <div className="space-y-2">
                    <Label htmlFor="dynamicUrl" className="text-gray-300">Dynamic Redirect URL</Label>
                    <Input
                      id="dynamicUrl"
                      value={dynamicRedirectUrl}
                      onChange={(e) => setDynamicRedirectUrl(e.target.value)}
                      placeholder="https://redirect.example.com"
                      className="min-h-[44px]"
                    />
                  </div>
                )}

                <div className="pt-4">
                  <QrSecurityBadge riskScore={riskScore} riskFlags={riskFlags} />
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !title || !payloadValue}
                  className="w-full bg-cyan-600 hover:bg-cyan-700 min-h-[44px]"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate QR Asset'
                  )}
                </Button>
              </CardContent>
            </Card>

            {qrAssetDraft && (
              <QrPreviewCanvas
                safeQrImageUrl={qrAssetDraft.safeQrImageUrl}
                artQrImageUrl={qrAssetDraft.artQrImageUrl}
                disguisedImageUrl={qrAssetDraft.disguisedImageUrl}
                errorCorrectionLevel={qrAssetDraft.errorCorrectionLevel}
                artStyle={qrAssetDraft.artStyle}
              />
            )}
          </div>

          {/* Mobile: Stacked layout */}
          <div className="lg:hidden space-y-6">
            <Card className="bg-gray-900/50 border-gray-800 shadow-xl">
              <CardHeader className="border-b border-gray-800">
                <CardTitle className="text-white">QR Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="title-mobile" className="text-gray-300 text-base">Title</Label>
                  <Input
                    id="title-mobile"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="My QR Code"
                    className="min-h-[48px] text-base bg-gray-800 border-gray-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payloadType-mobile" className="text-gray-300 text-base">Payload Type</Label>
                  <Select value={payloadType} onValueChange={setPayloadType}>
                    <SelectTrigger id="payloadType-mobile" className="min-h-[48px] text-base bg-gray-800 border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="url">URL</SelectItem>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="vcard">vCard</SelectItem>
                      <SelectItem value="wifi">WiFi</SelectItem>
                      <SelectItem value="app">App Link</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payloadValue-mobile" className="text-gray-300 text-base">Payload</Label>
                  <Textarea
                    id="payloadValue-mobile"
                    value={payloadValue}
                    onChange={(e) => setPayloadValue(e.target.value)}
                    placeholder={payloadType === 'url' ? 'https://example.com' : 'Your content here'}
                    className="min-h-[100px] text-base bg-gray-800 border-gray-700"
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-t border-gray-800">
                  <Label htmlFor="mode-mobile" className="text-gray-300 text-base">Dynamic Mode</Label>
                  <Switch
                    id="mode-mobile"
                    checked={mode === 'dynamic'}
                    onCheckedChange={(checked) => setMode(checked ? 'dynamic' : 'static')}
                    className="min-h-[48px] min-w-[48px]"
                  />
                </div>

                {mode === 'dynamic' && (
                  <div className="space-y-2">
                    <Label htmlFor="dynamicUrl-mobile" className="text-gray-300 text-base">Dynamic Redirect URL</Label>
                    <Input
                      id="dynamicUrl-mobile"
                      value={dynamicRedirectUrl}
                      onChange={(e) => setDynamicRedirectUrl(e.target.value)}
                      placeholder="https://redirect.example.com"
                      className="min-h-[48px] text-base bg-gray-800 border-gray-700"
                    />
                  </div>
                )}

                <div className="pt-4">
                  <QrSecurityBadge riskScore={riskScore} riskFlags={riskFlags} />
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !title || !payloadValue}
                  className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 min-h-[52px] text-base font-semibold shadow-lg shadow-cyan-500/30"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate QR Asset'
                  )}
                </Button>
              </CardContent>
            </Card>

            {qrAssetDraft && (
              <QrPreviewCanvas
                safeQrImageUrl={qrAssetDraft.safeQrImageUrl}
                artQrImageUrl={qrAssetDraft.artQrImageUrl}
                disguisedImageUrl={qrAssetDraft.disguisedImageUrl}
                errorCorrectionLevel={qrAssetDraft.errorCorrectionLevel}
                artStyle={qrAssetDraft.artStyle}
              />
            )}
          </div>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview">
          {qrAssetDraft ? (
            <QrPreviewCanvas
              safeQrImageUrl={qrAssetDraft.safeQrImageUrl}
              artQrImageUrl={qrAssetDraft.artQrImageUrl}
              disguisedImageUrl={qrAssetDraft.disguisedImageUrl}
              errorCorrectionLevel={qrAssetDraft.errorCorrectionLevel}
              artStyle={qrAssetDraft.artStyle}
              title="QR Preview"
            />
          ) : (
            <Card className="bg-gray-900/50 border-gray-700 p-12 text-center">
              <p className="text-gray-400">Generate a QR code first to see preview</p>
            </Card>
          )}
        </TabsContent>

        {/* Customize Tab */}
        <TabsContent value="customize">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Customize Appearance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="artStyle" className="text-gray-300">Art Style (Optional)</Label>
                <Input
                  id="artStyle"
                  value={artStyle}
                  onChange={(e) => setArtStyle(e.target.value)}
                  placeholder="e.g., cyberpunk, watercolor, neon"
                  className="min-h-[44px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="colorTheme" className="text-gray-300">Color Theme</Label>
                <Input
                  id="colorTheme"
                  type="color"
                  value={colorTheme}
                  onChange={(e) => setColorTheme(e.target.value)}
                  className="min-h-[44px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logoUrl" className="text-gray-300">Logo URL (Optional)</Label>
                <Input
                  id="logoUrl"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://example.com/logo.png"
                  className="min-h-[44px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ecc" className="text-gray-300">Error Correction Level</Label>
                <Select value={errorCorrectionLevel} onValueChange={setErrorCorrectionLevel}>
                  <SelectTrigger id="ecc" className="min-h-[44px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L">L - Low (7%)</SelectItem>
                    <SelectItem value="M">M - Medium (15%)</SelectItem>
                    <SelectItem value="Q">Q - Quartile (25%)</SelectItem>
                    <SelectItem value="H">H - High (30%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hot Zones Tab */}
        <TabsContent value="hotzones">
          {qrAssetDraft && qrAssetDraft.safeQrImageUrl ? (
            <QrHotZoneEditor
              qrImageUrl={qrAssetDraft.safeQrImageUrl}
              hotZones={hotZones}
              onHotZonesChange={setHotZones}
            />
          ) : (
            <Card className="bg-gray-900/50 border-gray-700 p-12 text-center">
              <p className="text-gray-400">Generate a QR code first to add hot zones</p>
            </Card>
          )}
        </TabsContent>

        {/* Stego Art Tab */}
        <TabsContent value="stego">
          {qrAssetDraft ? (
            <QrStegoArtBuilder
              qrAssetDraft={qrAssetDraft}
              onEmbedded={handleEmbedded}
            />
          ) : (
            <Card className="bg-gray-900/50 border-gray-700 p-12 text-center">
              <p className="text-gray-400">Generate a QR code first to create stego art</p>
            </Card>
          )}
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Security & Integrity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {qrAssetDraft ? (
                <>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Immutable Hash</Label>
                    <Input
                      value={qrAssetDraft.immutableHash || ''}
                      readOnly
                      className="font-mono text-xs min-h-[44px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Risk Assessment</Label>
                    <QrSecurityBadge
                      riskScore={qrAssetDraft.riskScore || 0}
                      riskFlags={qrAssetDraft.riskFlags || []}
                    />
                  </div>
                </>
              ) : (
                <p className="text-gray-400 text-center py-8">Generate a QR code to view security details</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          {qrAssetDraft ? (
            <AnalyticsPanel qrAssetId={qrAssetDraft.id} />
          ) : (
            <Card className="bg-gray-900/50 border-gray-700 p-12 text-center">
              <p className="text-gray-400">Generate a QR code first to view analytics</p>
            </Card>
          )}
        </TabsContent>

        {/* Bulk Tab */}
        <TabsContent value="bulk">
          <QrBatchUploader />
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}