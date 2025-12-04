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

  // Risk evaluation with debounce (for advanced mode)
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

  // ========== OG ENGINE FUNCTIONS ==========
  const buildQRPayload = () => {
    switch (qrType) {
      case "url": return qrData.url;
      case "text": return qrData.text;
      case "email": return `mailto:${qrData.email}?subject=${encodeURIComponent(qrData.emailSubject)}&body=${encodeURIComponent(qrData.emailBody)}`;
      case "phone": return `tel:${qrData.phone}`;
      case "sms": return `SMSTO:${qrData.smsNumber}:${qrData.smsMessage}`;
      case "wifi": return `WIFI:T:${qrData.wifiEncryption};S:${qrData.wifiSSID};P:${qrData.wifiPassword};H:${qrData.wifiHidden};`;
      case "vcard": return `BEGIN:VCARD\nVERSION:3.0\nN:${qrData.vcardLastName};${qrData.vcardFirstName}\nFN:${qrData.vcardFirstName} ${qrData.vcardLastName}\nORG:${qrData.vcardOrganization}\nTEL:${qrData.vcardPhone}\nEMAIL:${qrData.vcardEmail}\nURL:${qrData.vcardWebsite}\nADR:${qrData.vcardAddress}\nEND:VCARD`;
      case "location": return `geo:${qrData.latitude},${qrData.longitude}`;
      case "event":
        const startDateTime = `${qrData.eventStartDate}T${qrData.eventStartTime}:00`;
        const endDateTime = `${qrData.eventEndDate}T${qrData.eventEndTime}:00`;
        return `BEGIN:VEVENT\nSUMMARY:${qrData.eventTitle}\nLOCATION:${qrData.eventLocation}\nDTSTART:${startDateTime.replace(/[-:]/g, '')}\nDTEND:${endDateTime.replace(/[-:]/g, '')}\nDESCRIPTION:${qrData.eventDescription}\nEND:VEVENT`;
      default: return "";
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/') || file.size > 2 * 1024 * 1024) {
      toast.error('Please upload a valid image under 2MB');
      return;
    }
    setLogoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setLogoPreviewUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const uploadLogoToServer = async () => {
    if (!logoFile) return null;
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file: logoFile });
      return file_url;
    } catch (error) {
      return null;
    }
  };

  const performNLPAnalysis = async (payload) => {
    setScanningStage("Running NLP analysis...");
    try {
      return await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze for security threats: "${payload}". Return domain_trust, sentiment_score, entity_legitimacy, url_features (each 0-100), final_score, risk_level, threat_types, phishing_indicators, analysis_details, ml_version`,
        response_json_schema: {
          type: "object",
          properties: {
            domain_trust: { type: "number" },
            sentiment_score: { type: "number" },
            entity_legitimacy: { type: "number" },
            url_features: { type: "number" },
            final_score: { type: "number" },
            risk_level: { type: "string" },
            threat_types: { type: "array", items: { type: "string" } },
            phishing_indicators: { type: "array", items: { type: "string" } },
            analysis_details: { type: "string" },
            ml_version: { type: "string" }
          }
        }
      });
    } catch {
      return {
        domain_trust: 50, sentiment_score: 50, entity_legitimacy: 50, url_features: 50,
        final_score: 50, risk_level: "medium", threat_types: ["Analysis Error"],
        phishing_indicators: ["Analysis incomplete"], ml_version: "1.0.0"
      };
    }
  };

  // OG Engine Generate QR (with full security + stego support)
  const generateOGQR = async () => {
    const payload = buildQRPayload();
    if (!payload) {
      toast.error("Please fill in required fields");
      return;
    }
    
    setIsScanning(true);
    setSecurityResult(null);
    setQrGenerated(false);

    try {
      const needsSecurity = currentTypeConfig?.needsSecurity;
      let combinedResult = null;

      if (needsSecurity) {
        setScanningStage("Performing checks...");
        await new Promise(resolve => setTimeout(resolve, 500));
        const staticResult = performStaticURLChecks(payload);
        const nlpResult = await performNLPAnalysis(payload);
        
        const finalScore = Math.round(
          (nlpResult.domain_trust * 0.4) +
          (nlpResult.sentiment_score * 0.25) +
          (nlpResult.entity_legitimacy * 0.2) +
          (nlpResult.url_features * 0.15)
        );

        combinedResult = {
          ...nlpResult,
          final_score: Math.min(finalScore, staticResult.score),
          phishing_indicators: [...staticResult.issues, ...(nlpResult.phishing_indicators || [])],
          risk_level: finalScore >= 80 ? "safe" : finalScore >= 65 ? "medium" : "high"
        };

        setSecurityResult(combinedResult);

        if (combinedResult.final_score < 65) {
          const newCodeId = `qr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          await base44.entities.QRThreatLog.create({
            incident_id: `threat_${Date.now()}`,
            code_id: newCodeId,
            attack_type: combinedResult.threat_types?.[0] || "High Risk",
            payload,
            threat_description: `Blocked: Score ${combinedResult.final_score}/100`,
            severity: "high"
          });
          setIsScanning(false);
          return;
        }
      }

      let uploadedLogoUrl = logoFile ? await uploadLogoToServer() : null;
      setQrGenerated(true);

      const newCodeId = `qr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setCodeId(newCodeId);
      const palette = colorPalettes.find(p => p.id === selectedPalette);

      await base44.entities.QRGenHistory.create({
        code_id: newCodeId,
        payload,
        payload_sha256: await generateSHA256(payload),
        size,
        creator_id: "guest",
        status: combinedResult ? (combinedResult.final_score >= 80 ? "safe" : "suspicious") : "safe",
        type: qrType,
        image_format: "png",
        error_correction: errorCorrectionLevel,
        foreground_color: palette.fg,
        background_color: palette.bg,
        has_logo: !!uploadedLogoUrl,
        logo_url: uploadedLogoUrl
      });

      if (combinedResult) {
        await base44.entities.QRAIScore.create({
          code_id: newCodeId,
          final_score: combinedResult.final_score,
          domain_trust: combinedResult.domain_trust,
          sentiment_score: combinedResult.sentiment_score,
          entity_legitimacy: combinedResult.entity_legitimacy,
          risk_level: combinedResult.risk_level,
          ml_version: combinedResult.ml_version || "1.0.0",
          phishing_indicators: combinedResult.phishing_indicators || [],
          threat_types: combinedResult.threat_types || []
        });
      }

      // Sync to qrAssetDraft for other tabs
      setQrAssetDraft({
        id: newCodeId,
        title: qrType,
        safeQrImageUrl: getQRUrl(),
        artQrImageUrl: null,
        immutableHash: await generateSHA256(payload),
        riskScore: combinedResult?.final_score || 100,
        riskFlags: combinedResult?.phishing_indicators || [],
        errorCorrectionLevel,
        artStyle: null,
        hotZones: []
      });

      toast.success("QR Code generated successfully!");
    } catch (error) {
      console.error("QR generation error:", error);
      toast.error("QR generation failed");
    } finally {
      setIsScanning(false);
    }
  };

  const getQRUrl = () => {
    const payload = buildQRPayload();
    const palette = colorPalettes.find(p => p.id === selectedPalette);
    const fgColor = encodeURIComponent(palette.fg.replace('#', ''));
    const bgColor = encodeURIComponent(palette.bg.replace('#', ''));
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(payload)}&ecc=${errorCorrectionLevel}&color=${fgColor}&bgcolor=${bgColor}`;
  };

  const downloadQR = () => {
    const link = document.createElement('a');
    link.href = getQRUrl();
    link.download = `glyphlock-qr-${qrType}-${codeId || Date.now()}.png`;
    link.click();
  };

  // ========== ADVANCED MODE GENERATE (for 90+ payload types) ==========
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

        {/* Create Tab - OG ENGINE INTEGRATED */}
        <TabsContent value="create">
          <div className="space-y-8 relative z-10">
            {/* Security Alert for URL/Email types */}
            {currentTypeConfig?.needsSecurity && (
              <Alert className="bg-blue-500/10 border-blue-500/30">
                <Info className="h-4 w-4 text-blue-400" />
                <AlertDescription className="text-white">
                  <strong>Security Active:</strong> URLs/emails scanned by AI. Scores under 65/100 are blocked.
                </AlertDescription>
              </Alert>
            )}

            {/* QR Type Selector - OG Engine */}
            <QRTypeSelector qrType={qrType} setQrType={setQrType} qrTypes={qrTypes} />

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Form */}
              <div className="lg:col-span-1 space-y-6">
                <Card className={`${GlyphCard.premium} ${GlyphShadows.depth.lg}`}>
                  <CardHeader className="border-b border-purple-500/20">
                    <CardTitle className="text-white">{currentTypeConfig?.name || 'QR Configuration'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    {/* OG Engine Type Form */}
                    <QRTypeForm qrType={qrType} qrData={qrData} setQrData={setQrData} />

                    {/* Size Slider */}
                    <div>
                      <Label className="text-white">Size: {size}px</Label>
                      <Slider
                        value={[size]}
                        onValueChange={(value) => setSize(value[0])}
                        min={256}
                        max={1024}
                        step={64}
                        className="mt-2"
                      />
                    </div>

                    {/* Generate Button - OG Engine */}
                    <Button
                      onClick={generateOGQR}
                      disabled={isScanning}
                      className={`${GlyphButton.primary} w-full ${GlyphShadows.neonCyan}`}
                    >
                      {isScanning ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {scanningStage || 'Processing...'}
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4 mr-2" />
                          Generate QR
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* Error Correction */}
                <Card className={`${GlyphCard.glass}`}>
                  <CardHeader>
                    <CardTitle className="text-white text-sm">Error Correction</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select value={errorCorrectionLevel} onValueChange={setErrorCorrectionLevel}>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="L">Low (7%)</SelectItem>
                        <SelectItem value="M">Medium (15%)</SelectItem>
                        <SelectItem value="Q">Quartile (25%)</SelectItem>
                        <SelectItem value="H">High (30%)</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>
              </div>

              {/* Center Column - Preview */}
              <div className="lg:col-span-1">
                <Card className={`${GlyphCard.premium} h-full`}>
                  <CardHeader className="border-b border-purple-500/20">
                    <CardTitle className="text-white">Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {qrGenerated ? (
                      <div className="space-y-4">
                        <div className="bg-white p-8 rounded-lg flex items-center justify-center relative">
                          <img src={getQRUrl()} alt="QR Code" className="max-w-full" />
                          {logoPreviewUrl && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <img src={logoPreviewUrl} alt="Logo" className="w-16 h-16 rounded-lg bg-white p-1" />
                            </div>
                          )}
                        </div>
                        <Button
                          onClick={downloadQR}
                          variant="outline"
                          className="w-full border-cyan-500/50 hover:bg-cyan-500/10 text-white"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download QR
                        </Button>
                      </div>
                    ) : securityResult?.final_score < 65 ? (
                      <div className="h-96 flex items-center justify-center border-2 border-dashed border-red-700 rounded-lg bg-red-500/5">
                        <div className="text-center p-6">
                          <div className="text-5xl mb-4">🚫</div>
                          <p className="text-red-400 font-semibold">Blocked</p>
                          <p className="text-sm text-white">Score: {securityResult.final_score}/100</p>
                        </div>
                      </div>
                    ) : (
                      <div className="h-96 flex items-center justify-center border-2 border-dashed border-gray-700 rounded-lg">
                        <p className="text-gray-500">Generate to preview</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Colors & Logo */}
              <div className="lg:col-span-1 space-y-6">
                <ColorPaletteSelector
                  selectedPalette={selectedPalette}
                  setSelectedPalette={setSelectedPalette}
                  customColors={customColors}
                  setCustomColors={setCustomColors}
                />

                <Card className={`${GlyphCard.glass}`}>
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2 text-sm">
                      <ImageIcon className="w-4 h-4" />
                      Logo (Optional)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    
                    {logoPreviewUrl ? (
                      <div className="space-y-2">
                        <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 flex items-center gap-2">
                          <img src={logoPreviewUrl} alt="Logo" className="w-12 h-12 object-contain rounded" />
                          <p className="text-xs text-white font-medium">Uploaded</p>
                        </div>
                        <Button
                          onClick={() => {
                            setLogoFile(null);
                            setLogoPreviewUrl(null);
                          }}
                          variant="outline"
                          size="sm"
                          className="w-full border-red-500/50 text-red-400 text-xs"
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        size="sm"
                        className="w-full border-cyan-500/50 text-white text-xs"
                      >
                        <Upload className="w-3 h-3 mr-2" />
                        Upload
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Security Status - OG Engine */}
            {securityResult && <SecurityStatus securityResult={securityResult} />}

            {/* Steganographic QR - OG Engine LSB Encode/Decode */}
            <SteganographicQR 
              qrPayload={buildQRPayload()} 
              qrGenerated={qrGenerated && (!securityResult || securityResult.final_score >= 65)}
            />
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

        {/* Stego Art Tab - DUAL ENGINE: QrStegoArtBuilder + SteganographicQR */}
        <TabsContent value="stego">
          <div className="space-y-8 relative z-10">
            {/* Advanced Stego Builder (for QrAsset mode) */}
            {qrAssetDraft ? (
              <QrStegoArtBuilder
                qrAssetDraft={qrAssetDraft}
                onEmbedded={handleEmbedded}
              />
            ) : (
              <Card className={`${GlyphCard.glass} p-8 text-center`}>
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-cyan-500" />
                <p className="text-gray-400">Generate a QR from Create tab first to use Advanced Stego Builder</p>
              </Card>
            )}

            {/* OG LSB Steganography Engine - Always Available */}
            <div className="border-t border-gray-700 pt-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Lock className="w-5 h-5 text-purple-400" />
                LSB Steganography Engine (Hide/Extract)
              </h3>
              <SteganographicQR 
                qrPayload={buildQRPayload() || "https://glyphlock.io"} 
                qrGenerated={true}
              />
            </div>
          </div>
        </TabsContent>

        {/* Security Tab - FULL OG ENGINE SECURITY STATUS */}
        <TabsContent value="security">
          <div className="space-y-6 relative z-10">
            <Card className={`${GlyphCard.premium} ${GlyphShadows.depth.lg}`}>
              <CardHeader className="border-b border-purple-500/20">
                <CardTitle className={`${GlyphTypography.heading.lg} text-white flex items-center gap-2`}>
                  <Shield className="w-5 h-5 text-cyan-400" />
                  Security & Integrity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {qrAssetDraft ? (
                  <>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Immutable Hash (SHA-256)</Label>
                      <Input
                        value={qrAssetDraft.immutableHash || ''}
                        readOnly
                        className="font-mono text-xs min-h-[44px] bg-gray-800 border-gray-700"
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

            {/* OG Security Status Panel */}
            {securityResult && (
              <SecurityStatus securityResult={securityResult} />
            )}

            {/* Security Info */}
            <Card className={`${GlyphCard.glass}`}>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                    <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <h4 className="font-bold text-white text-sm">AI Scanning</h4>
                    <p className="text-xs text-gray-400">NLP threat detection</p>
                  </div>
                  <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                    <Lock className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <h4 className="font-bold text-white text-sm">Hash Verification</h4>
                    <p className="text-xs text-gray-400">SHA-256 tamper detection</p>
                  </div>
                  <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                    <Eye className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <h4 className="font-bold text-white text-sm">Score Threshold</h4>
                    <p className="text-xs text-gray-400">65/100 minimum</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
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