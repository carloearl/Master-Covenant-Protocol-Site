import React, { useState, useEffect, useMemo, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Loader2, Wand2, Layers, Shield, Sparkles, Zap, Lock, Eye, EyeOff, Upload, Download, Image as ImageIcon, Info } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
import SecurityStatus from './SecurityStatus';
import SteganographicQR from './SteganographicQR';
import QRTypeSelector from '@/components/crypto/QRTypeSelector';
import QRTypeForm from '@/components/crypto/QRTypeForm';
import ColorPaletteSelector from '@/components/crypto/ColorPaletteSelector';
import { generateSHA256, performStaticURLChecks } from '@/components/utils/securityUtils';

export default function QrStudio({ initialTab = 'create' }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  // Sync activeTab with initialTab prop (for subroute pages)
  React.useEffect(() => {
    if (initialTab && initialTab !== activeTab) {
      const validTabs = ['create', 'preview', 'customize', 'hotzones', 'stego', 'security', 'analytics', 'bulk'];
      if (validTabs.includes(initialTab)) {
        setActiveTab(initialTab);
      }
    }
  }, [initialTab]);

  // Update URL when tab changes
  React.useEffect(() => {
    const currentPath = window.location.pathname;
    if (currentPath === '/qr' || currentPath === '/Qr') {
      if (activeTab && activeTab !== 'create') {
        window.history.replaceState(null, '', `/qr?tab=${activeTab}`);
      } else {
        window.history.replaceState(null, '', '/qr');
      }
    }
  }, [activeTab]);

  // ========== NEW UI STATE (Navbar Studio) ==========
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

  // ========== OG ENGINE STATE (from QRGeneratorTab) ==========
  const [qrType, setQrType] = useState("url");
  const [qrData, setQrData] = useState({
    url: "", text: "", email: "", emailSubject: "", emailBody: "",
    phone: "", smsNumber: "", smsMessage: "",
    wifiSSID: "", wifiPassword: "", wifiEncryption: "WPA", wifiHidden: false,
    vcardFirstName: "", vcardLastName: "", vcardOrganization: "", vcardPhone: "", vcardEmail: "", vcardWebsite: "", vcardAddress: "",
    latitude: "", longitude: "",
    eventTitle: "", eventLocation: "", eventStartDate: "", eventStartTime: "", eventEndDate: "", eventEndTime: "", eventDescription: ""
  });
  const [size, setSize] = useState(512);
  const [qrGenerated, setQrGenerated] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [securityResult, setSecurityResult] = useState(null);
  const [codeId, setCodeId] = useState(null);
  const [scanningStage, setScanningStage] = useState("");
  const [selectedPalette, setSelectedPalette] = useState("classic");
  const [customColors, setCustomColors] = useState({ fg: "#000000", bg: "#FFFFFF" });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  // OG Engine Color Palettes
  const colorPalettes = [
    { id: "classic", name: "Classic", fg: "#000000", bg: "#FFFFFF" },
    { id: "royal", name: "Royal Blue", fg: "#1E40AF", bg: "#FFFFFF" },
    { id: "cyber", name: "Cyber", fg: "#0EA5E9", bg: "#0F172A" },
    { id: "emerald", name: "Emerald", fg: "#059669", bg: "#FFFFFF" },
    { id: "sunset", name: "Sunset", fg: "#DC2626", bg: "#FEF2F2" },
    { id: "grape", name: "Grape", fg: "#7C3AED", bg: "#FFFFFF" },
    { id: "custom", name: "Custom", fg: customColors.fg, bg: customColors.bg }
  ];

  // OG Engine QR Types (with security flags)
  const qrTypes = [
    { id: "url", name: "URL/Website", needsSecurity: true },
    { id: "text", name: "Plain Text", needsSecurity: false },
    { id: "email", name: "Email", needsSecurity: true },
    { id: "phone", name: "Phone Number", needsSecurity: false },
    { id: "sms", name: "SMS Message", needsSecurity: false },
    { id: "wifi", name: "WiFi Network", needsSecurity: false },
    { id: "vcard", name: "Contact Card", needsSecurity: false },
    { id: "location", name: "GPS Location", needsSecurity: false },
    { id: "event", name: "Calendar Event", needsSecurity: false }
  ];

  const selectedPayloadType = PAYLOAD_TYPES.find(t => t.id === payloadType);
  const currentTypeConfig = qrTypes.find(t => t.id === qrType);

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
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
      {/* Animated Background Grid */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-blue-500/5 animate-pulse"></div>
      </div>

      {/* Header */}
      <div className="border-b border-cyan-500/20 glyph-glass-dark sticky top-0 z-50 shadow-2xl glyph-glow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent flex items-center gap-3">
                <Zap className="w-10 h-10 text-cyan-400 glyph-pulse" />
                GlyphLock QR Studio
              </h1>
              <p className="text-sm sm:text-base text-gray-400 flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-400" />
                Military-grade QR generation with steganography, hot zones & anti-quishing
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="px-4 py-2 glyph-glass border border-cyan-500/50 rounded-lg glyph-glow">
                <p className="text-xs text-cyan-300 font-semibold">90+ Payload Types</p>
              </div>
              <div className="px-4 py-2 glyph-glass border border-purple-500/50 rounded-lg">
                <p className="text-xs text-purple-300 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Premium Features
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-7xl">

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {/* Desktop Tabs - Technical Flow */}
        <TabsList className="hidden lg:flex w-full mb-6 bg-black/40 backdrop-blur-md border-t-2 border-b-2 border-cyan-500/20 p-0 h-auto rounded-none">
          <TabsTrigger 
            value="create" 
            className="flex-1 min-h-[52px] relative group border-r border-cyan-500/10 data-[state=active]:bg-gradient-to-b data-[state=active]:from-cyan-500/20 data-[state=active]:to-transparent data-[state=active]:border-t-2 data-[state=active]:border-t-cyan-400 data-[state=active]:text-cyan-300 text-gray-500 hover:text-gray-300 transition-all font-mono text-xs uppercase tracking-widest rounded-none"
          >
            <Wand2 className="w-4 h-4 mr-2" />
            <span>01_Create</span>
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-data-[state=active]:opacity-100 glyph-glow"></div>
          </TabsTrigger>
          
          <TabsTrigger 
            value="preview" 
            className="flex-1 min-h-[52px] relative group border-r border-cyan-500/10 data-[state=active]:bg-gradient-to-b data-[state=active]:from-purple-500/20 data-[state=active]:to-transparent data-[state=active]:border-t-2 data-[state=active]:border-t-purple-400 data-[state=active]:text-purple-300 text-gray-500 hover:text-gray-300 transition-all font-mono text-xs uppercase tracking-widest rounded-none"
          >
            <span>02_Preview</span>
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-0 group-data-[state=active]:opacity-100"></div>
          </TabsTrigger>
          
          <TabsTrigger 
            value="customize" 
            className="flex-1 min-h-[52px] relative group border-r border-cyan-500/10 data-[state=active]:bg-gradient-to-b data-[state=active]:from-blue-500/20 data-[state=active]:to-transparent data-[state=active]:border-t-2 data-[state=active]:border-t-blue-400 data-[state=active]:text-blue-300 text-gray-500 hover:text-gray-300 transition-all font-mono text-xs uppercase tracking-widest rounded-none"
          >
            <span>03_Customize</span>
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-0 group-data-[state=active]:opacity-100"></div>
          </TabsTrigger>
          
          <TabsTrigger 
            value="hotzones" 
            className="flex-1 min-h-[52px] relative group border-r border-cyan-500/10 data-[state=active]:bg-gradient-to-b data-[state=active]:from-cyan-500/20 data-[state=active]:to-transparent data-[state=active]:border-t-2 data-[state=active]:border-t-cyan-400 data-[state=active]:text-cyan-300 text-gray-500 hover:text-gray-300 transition-all font-mono text-xs uppercase tracking-widest rounded-none"
          >
            <Layers className="w-3 h-3 mr-2" />
            <span>04_HotZones</span>
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-data-[state=active]:opacity-100 glyph-glow"></div>
          </TabsTrigger>
          
          <TabsTrigger 
            value="stego" 
            className="flex-1 min-h-[52px] relative group border-r border-cyan-500/10 data-[state=active]:bg-gradient-to-b data-[state=active]:from-purple-500/20 data-[state=active]:to-transparent data-[state=active]:border-t-2 data-[state=active]:border-t-purple-400 data-[state=active]:text-purple-300 text-gray-500 hover:text-gray-300 transition-all font-mono text-xs uppercase tracking-widest rounded-none"
          >
            <span>05_Stego</span>
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-0 group-data-[state=active]:opacity-100"></div>
          </TabsTrigger>
          
          <TabsTrigger 
            value="security" 
            className="flex-1 min-h-[52px] relative group border-r border-cyan-500/10 data-[state=active]:bg-gradient-to-b data-[state=active]:from-green-500/20 data-[state=active]:to-transparent data-[state=active]:border-t-2 data-[state=active]:border-t-green-400 data-[state=active]:text-green-300 text-gray-500 hover:text-gray-300 transition-all font-mono text-xs uppercase tracking-widest rounded-none"
          >
            <Shield className="w-3 h-3 mr-2" />
            <span>06_Security</span>
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-0 group-data-[state=active]:opacity-100"></div>
          </TabsTrigger>
          
          <TabsTrigger 
            value="analytics" 
            className="flex-1 min-h-[52px] relative group border-r border-cyan-500/10 data-[state=active]:bg-gradient-to-b data-[state=active]:from-blue-500/20 data-[state=active]:to-transparent data-[state=active]:border-t-2 data-[state=active]:border-t-blue-400 data-[state=active]:text-blue-300 text-gray-500 hover:text-gray-300 transition-all font-mono text-xs uppercase tracking-widest rounded-none"
          >
            <span>07_Analytics</span>
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-0 group-data-[state=active]:opacity-100"></div>
          </TabsTrigger>
          
          <TabsTrigger 
            value="bulk" 
            className="flex-1 min-h-[52px] relative group data-[state=active]:bg-gradient-to-b data-[state=active]:from-purple-500/20 data-[state=active]:to-transparent data-[state=active]:border-t-2 data-[state=active]:border-t-purple-400 data-[state=active]:text-purple-300 text-gray-500 hover:text-gray-300 transition-all font-mono text-xs uppercase tracking-widest rounded-none"
          >
            <span>08_Bulk</span>
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-0 group-data-[state=active]:opacity-100"></div>
          </TabsTrigger>
        </TabsList>

        {/* Mobile Tabs - Technical Segmented */}
        <div className="lg:hidden mb-6 -mx-4 px-4">
          <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide bg-black/60 backdrop-blur-sm border border-cyan-500/20 p-1">
            {[
              { value: 'create', icon: Wand2, label: 'Create', num: '01' },
              { value: 'preview', icon: null, label: 'Preview', num: '02' },
              { value: 'customize', icon: null, label: 'Customize', num: '03' },
              { value: 'hotzones', icon: Layers, label: 'HotZones', num: '04' },
              { value: 'stego', icon: null, label: 'Stego', num: '05' },
              { value: 'security', icon: Shield, label: 'Security', num: '06' },
              { value: 'analytics', icon: null, label: 'Analytics', num: '07' },
              { value: 'bulk', icon: null, label: 'Bulk', num: '08' },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`flex flex-col items-center justify-center px-3 py-2 whitespace-nowrap text-xs font-mono uppercase tracking-wider transition-all min-h-[48px] min-w-[72px] border-r border-cyan-500/10 last:border-r-0 ${
                    activeTab === tab.value
                      ? 'bg-gradient-to-b from-cyan-500/30 to-transparent text-cyan-300 border-t-2 border-t-cyan-400 shadow-lg'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-1 mb-0.5">
                    {Icon && <Icon className="w-3 h-3" />}
                    <span className="text-[10px] opacity-60">{tab.num}</span>
                  </div>
                  <span className="text-[9px]">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Create Tab */}
        <TabsContent value="create">
          {/* Desktop: 2-column layout */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-6 relative z-10">
            <Card className={`${GlyphCard.premium} ${GlyphShadows.depth.lg}`}>
              <CardHeader className="border-b border-purple-500/20">
                <CardTitle className={`${GlyphTypography.heading.lg} text-white flex items-center gap-2`}>
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  QR Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-gray-300 font-semibold">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="My QR Code"
                    className={GlyphInput.glow}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payloadType" className="text-gray-300 flex items-center gap-2">
                    Payload Type
                    {selectedPayloadType?.premium && (
                      <span className="text-xs text-purple-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Premium
                      </span>
                    )}
                  </Label>
                  <Button
                    type="button"
                    onClick={() => setShowPayloadSelector(!showPayloadSelector)}
                    className={`${GlyphButton.secondary} w-full justify-between`}
                  >
                    <span className="flex items-center gap-2">
                      {selectedPayloadType && <selectedPayloadType.icon className="w-4 h-4" />}
                      {selectedPayloadType?.label || 'Select Payload Type'}
                    </span>
                    <span className="text-xs text-gray-500">90+ types available</span>
                  </Button>
                  {showPayloadSelector && (
                    <div className={`${GlyphCard.glass} p-4 mt-2`}>
                      <PayloadTypeSelector
                        value={payloadType}
                        onChange={(newType) => {
                          setPayloadType(newType);
                          setShowPayloadSelector(false);
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payloadValue" className="text-gray-300">Payload</Label>
                  <Textarea
                    id="payloadValue"
                    value={payloadValue}
                    onChange={(e) => setPayloadValue(e.target.value)}
                    placeholder={selectedPayloadType?.placeholder || 'Enter your payload data here...'}
                    className={`${GlyphInput.glow} min-h-[80px]`}
                  />
                  {selectedPayloadType && (
                    <p className="text-xs text-gray-500">{selectedPayloadType.description}</p>
                  )}
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
                  className={`${GlyphButton.primary} w-full ${GlyphShadows.neonCyan}`}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating QR Asset...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5 mr-2" />
                      Generate QR Asset
                    </>
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
          <div className="lg:hidden space-y-6 relative z-10">
            <Card className={`${GlyphCard.premium} ${GlyphShadows.depth.md}`}>
              <CardHeader className="border-b border-purple-500/20">
                <CardTitle className={`${GlyphTypography.heading.md} text-white flex items-center gap-2`}>
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  QR Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="title-mobile" className="text-gray-300 text-base font-semibold">Title</Label>
                  <Input
                    id="title-mobile"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="My QR Code"
                    className={`${GlyphInput.glow} text-base`}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payloadType-mobile" className="text-gray-300 text-base font-semibold flex items-center gap-2">
                    Payload Type
                    {selectedPayloadType?.premium && (
                      <span className="text-xs text-purple-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Premium
                      </span>
                    )}
                  </Label>
                  <Button
                    type="button"
                    onClick={() => setShowPayloadSelector(!showPayloadSelector)}
                    className={`${GlyphButton.secondary} w-full justify-between text-base`}
                  >
                    <span className="flex items-center gap-2">
                      {selectedPayloadType && <selectedPayloadType.icon className="w-5 h-5" />}
                      {selectedPayloadType?.label || 'Select Payload Type'}
                    </span>
                    <span className="text-xs text-gray-500">90+</span>
                  </Button>
                  {showPayloadSelector && (
                    <div className={`${GlyphCard.glass} p-4 mt-2`}>
                      <PayloadTypeSelector
                        value={payloadType}
                        onChange={(newType) => {
                          setPayloadType(newType);
                          setShowPayloadSelector(false);
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payloadValue-mobile" className="text-gray-300 text-base font-semibold">Payload</Label>
                  <Textarea
                    id="payloadValue-mobile"
                    value={payloadValue}
                    onChange={(e) => setPayloadValue(e.target.value)}
                    placeholder={selectedPayloadType?.placeholder || 'Enter your payload data here...'}
                    className={`${GlyphInput.glow} min-h-[100px] text-base`}
                  />
                  {selectedPayloadType && (
                    <p className="text-xs text-gray-500">{selectedPayloadType.description}</p>
                  )}
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
                  className={`${GlyphButton.primary} w-full min-h-[52px] text-base ${GlyphShadows.neonCyan}`}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                      Generating QR Asset...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-6 h-6 mr-2" />
                      Generate QR Asset
                    </>
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
            <Card className={`${GlyphCard.glass} p-12 text-center relative z-10`}>
              <Wand2 className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400 text-lg">Generate a QR code first to see preview</p>
            </Card>
          )}
        </TabsContent>

        {/* Customize Tab */}
        <TabsContent value="customize">
          <Card className={`${GlyphCard.premium} ${GlyphShadows.depth.lg} relative z-10`}>
            <CardHeader className="border-b border-purple-500/20">
              <CardTitle className={`${GlyphTypography.heading.lg} text-white flex items-center gap-2`}>
                <Layers className="w-5 h-5 text-cyan-400" />
                Customize Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
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
            <Card className={`${GlyphCard.glass} p-12 text-center relative z-10`}>
              <Layers className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400 text-lg">Generate a QR code first to add hot zones</p>
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
            <Card className={`${GlyphCard.glass} p-12 text-center relative z-10`}>
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400 text-lg">Generate a QR code first to create stego art</p>
            </Card>
          )}
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card className={`${GlyphCard.premium} ${GlyphShadows.depth.lg} relative z-10`}>
            <CardHeader className="border-b border-purple-500/20">
              <CardTitle className={`${GlyphTypography.heading.lg} text-white flex items-center gap-2`}>
                <Shield className="w-5 h-5 text-cyan-400" />
                Security & Integrity
              </CardTitle>
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
            <Card className={`${GlyphCard.glass} p-12 text-center relative z-10`}>
              <Shield className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400 text-lg">Generate a QR code first to view analytics</p>
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