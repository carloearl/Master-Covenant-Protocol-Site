import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Loader2, Wand2, Layers, Shield, Sparkles, Zap, Lock, Eye, Download, Info, BarChart3, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  GlyphCard, 
  GlyphButton, 
  GlyphTypography, 
  GlyphShadows 
} from './design/GlyphQrDesignSystem';
import { PAYLOAD_TYPES } from './config/PayloadTypesCatalog';
import PayloadTypeSelector from './PayloadTypeSelector';
import QrSecurityBadge from './QrSecurityBadge';
import QrPreviewPanel from './QrPreviewPanel';
import QrCustomizationPanel from './QrCustomizationPanel';
import AnalyticsPanel from './AnalyticsPanel';
import QrBatchUploader from './QrBatchUploader';
import SecurityStatus from './SecurityStatus';
import SteganographicQR from './SteganographicQR';
import QRTypeForm from '@/components/crypto/QRTypeForm';
import { generateSHA256, performStaticURLChecks } from '@/components/utils/securityUtils';


export default function QrStudio({ initialTab = 'create' }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  // Sync activeTab with initialTab prop
  useEffect(() => {
    if (initialTab && initialTab !== activeTab) {
      const validTabs = ['create', 'customize', 'preview', 'stego', 'security', 'analytics', 'bulk'];
      if (validTabs.includes(initialTab)) {
        setActiveTab(initialTab);
      }
    }
  }, [initialTab]);

  // Update URL when tab changes
  useEffect(() => {
    const currentPath = window.location.pathname;
    if (currentPath === '/qr' || currentPath === '/Qr') {
      if (activeTab && activeTab !== 'create') {
        window.history.replaceState(null, '', `/qr?tab=${activeTab}`);
      } else {
        window.history.replaceState(null, '', '/qr');
      }
    }
  }, [activeTab]);



  // ========== PAYLOAD STATE ==========
  const [payloadType, setPayloadType] = useState('url');
  const [showPayloadSelector, setShowPayloadSelector] = useState(false);
  const [qrAssetDraft, setQrAssetDraft] = useState(null);

  // ========== CUSTOMIZATION STATE ==========
  const [customization, setCustomization] = useState({
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
      color3: '#8B5CF6',
      color4: null,
      color5: null
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
      shape: 'square',
      position: 'center',
      rotation: 0,
      dropShadow: false,
      autoContrast: true
    },
    background: {
      type: 'solid',
      color: '#FFFFFF',
      gradientColor1: '#FFFFFF',
      gradientColor2: '#E5E7EB',
      imageUrl: null,
      blur: 0,
      pattern: 'none',
      transparency: 100
    },
    qrShape: {
      type: 'standard',
      margin: 'medium',
      cornerRadius: 0
    }
  });

  // ========== QR GENERATION STATE ==========
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
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState('H');
  const [qrGenerated, setQrGenerated] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [securityResult, setSecurityResult] = useState(null);
  const [codeId, setCodeId] = useState(null);
  const [scanningStage, setScanningStage] = useState("");
  const [logoPreviewUrl, setLogoPreviewUrl] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  // QR Types with security flags
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

  // ========== RAW QR URL (unmodified, no customization) ==========
  const getRawQRUrl = () => {
    const payload = buildQRPayload();
    if (!payload) return null;
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(payload)}&ecc=${errorCorrectionLevel}&color=000000&bgcolor=FFFFFF`;
  };

  // ========== BUILD PAYLOAD ==========
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

  // ========== NLP ANALYSIS ==========
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

  // ========== GET QR URL ==========
  const getQRUrl = () => {
    const payload = buildQRPayload();
    const fgColor = customization.gradient?.enabled 
      ? customization.gradient.color1.replace('#', '')
      : (customization.foregroundColor || '#000000').replace('#', '');
    const bgColor = customization.background?.type === 'solid'
      ? (customization.background?.color || '#FFFFFF').replace('#', '')
      : 'FFFFFF';
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(payload)}&ecc=${errorCorrectionLevel}&color=${encodeURIComponent(fgColor)}&bgcolor=${encodeURIComponent(bgColor)}`;
  };

  // ========== GENERATE QR ==========
  const generateQR = async () => {
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
        setScanningStage("Performing security checks...");
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
          toast.error("QR blocked due to security concerns");
          return;
        }
      }

      setQrGenerated(true);
      const newCodeId = `qr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setCodeId(newCodeId);

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
        foreground_color: customization.foregroundColor,
        background_color: customization.backgroundColor,
        has_logo: !!logoPreviewUrl,
        logo_url: logoPreviewUrl
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

      // Set asset draft for other tabs
      setQrAssetDraft({
        id: newCodeId,
        title: qrType,
        safeQrImageUrl: getQRUrl(),
        artQrImageUrl: null,
        immutableHash: await generateSHA256(payload),
        riskScore: combinedResult?.final_score || 100,
        riskFlags: combinedResult?.phishing_indicators || [],
        errorCorrectionLevel,
        artStyle: null
      });

      toast.success("QR Code generated successfully!");
    } catch (error) {
      console.error("QR generation error:", error);
      toast.error("QR generation failed");
    } finally {
      setIsScanning(false);
      setScanningStage("");
    }
  };

  // Apply customization
  const applyCustomization = () => {
    if (qrGenerated) {
      setQrAssetDraft(prev => ({
        ...prev,
        customization: { ...customization },
        safeQrImageUrl: getQRUrl()
      }));
      toast.success('Customization applied!');
    } else {
      toast.info('Generate a QR code first, then customize');
    }
  };

  // Stego handler
  const handleEmbedded = (disguisedImageUrl, mode) => {
    setQrAssetDraft(prev => ({
      ...prev,
      disguisedImageUrl,
      stegoConfig: { enabled: true, mode }
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
      {/* Background */}
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
                GlyphLock QR Intelligence Platform
              </h1>
              <p className="text-sm sm:text-base text-gray-400 flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-400" />
                Advanced QR creation with embedded security, steganography, and real-time threat scoring.
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
          {/* Desktop Tabs */}
          <TabsList className="hidden lg:flex w-full mb-6 bg-black/40 backdrop-blur-md border-t-2 border-b-2 border-cyan-500/20 p-0 h-auto rounded-none">
            {[
              { value: 'create', icon: Wand2, label: '01_Create' },
              { value: 'customize', icon: Layers, label: '02_Customize' },
              { value: 'preview', icon: Eye, label: '03_Preview' },
              { value: 'stego', icon: Lock, label: '04_Stego' },
              { value: 'security', icon: Shield, label: '05_Security' },
              { value: 'analytics', icon: BarChart3, label: '06_Analytics' },
              { value: 'bulk', icon: Upload, label: '07_Bulk' },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex-1 min-h-[52px] relative group border-r border-cyan-500/10 last:border-r-0 data-[state=active]:bg-gradient-to-b data-[state=active]:from-cyan-500/20 data-[state=active]:to-transparent data-[state=active]:border-t-2 data-[state=active]:border-t-cyan-400 data-[state=active]:text-cyan-300 text-gray-500 hover:text-gray-300 transition-all font-mono text-xs uppercase tracking-widest rounded-none"
              >
                <tab.icon className="w-4 h-4 mr-2" />
                <span>{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Mobile Tabs */}
          <div className="lg:hidden mb-6 -mx-4 px-4">
            <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide bg-black/60 backdrop-blur-sm border border-cyan-500/20 p-1">
              {[
                { value: 'create', icon: Wand2, label: 'Create', num: '01' },
                { value: 'customize', icon: Layers, label: 'Customize', num: '02' },
                { value: 'preview', icon: Eye, label: 'Preview', num: '03' },
                { value: 'stego', icon: Lock, label: 'Stego', num: '04' },
                { value: 'security', icon: Shield, label: 'Security', num: '05' },
                { value: 'analytics', icon: BarChart3, label: 'Analytics', num: '06' },
                { value: 'bulk', icon: Upload, label: 'Bulk', num: '07' },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={`flex flex-col items-center justify-center px-3 py-2 whitespace-nowrap text-xs font-mono uppercase tracking-wider transition-all min-h-[48px] min-w-[72px] ${
                      activeTab === tab.value
                        ? 'bg-gradient-to-b from-cyan-500/30 to-transparent text-cyan-300 border-t-2 border-t-cyan-400 shadow-lg'
                        : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-1 mb-0.5">
                      <Icon className="w-3 h-3" />
                      <span className="text-[10px] opacity-60">{tab.num}</span>
                    </div>
                    <span className="text-[9px]">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ========== 01_CREATE TAB ========== */}
          <TabsContent value="create">
            <div className="space-y-6 relative z-10">
              {/* Security Alert */}
              {currentTypeConfig?.needsSecurity && (
                <Alert className="bg-blue-500/10 border-blue-500/30">
                  <Info className="h-4 w-4 text-blue-400" />
                  <AlertDescription className="text-white">
                    <strong>Security Active:</strong> URLs/emails are scanned by AI. Scores under 65/100 are blocked.
                  </AlertDescription>
                </Alert>
              )}

              {/* Payload Type Selector */}
              <Card className={GlyphCard.premium}>
                <CardHeader className="border-b border-purple-500/20 pb-4">
                  <CardTitle className="text-white flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-cyan-400" />
                      Payload Type ({PAYLOAD_TYPES.length}+ Available)
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPayloadSelector(!showPayloadSelector)}
                      className="text-cyan-400"
                    >
                      {showPayloadSelector ? 'Collapse' : 'Expand'}
                    </Button>
                  </CardTitle>
                </CardHeader>
                {showPayloadSelector ? (
                  <CardContent className="pt-4">
                    <PayloadTypeSelector
                      value={payloadType}
                      onChange={(newType) => {
                        setPayloadType(newType);
                        const typeMapping = {
                          'url': 'url', 'url_dynamic': 'url', 'url_timelock': 'url', 'url_geolock': 'url',
                          'vcard': 'vcard', 'mecard': 'vcard', 'digital_card': 'vcard',
                          'tap_call': 'phone', 'tap_text': 'sms', 'email_template': 'email',
                          'wifi_config': 'wifi', 'data_json': 'text', 'data_base64': 'text'
                        };
                        if (typeMapping[newType]) setQrType(typeMapping[newType]);
                      }}
                    />
                  </CardContent>
                ) : (
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                      {selectedPayloadType && (
                        <>
                          <div className="p-2 bg-cyan-500/20 rounded-lg">
                            <selectedPayloadType.icon className="w-6 h-6 text-cyan-400" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-white">{selectedPayloadType.label}</h4>
                            <p className="text-xs text-gray-400">{selectedPayloadType.description}</p>
                          </div>
                          {selectedPayloadType.premium && (
                            <span className="ml-auto px-2 py-1 text-xs bg-purple-500/20 text-purple-400 rounded border border-purple-500/50">Premium</span>
                          )}
                        </>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Form + GL Preview - Side by Side Layout */}
              <div className="w-full flex flex-col lg:flex-row gap-6">
                {/* Left: Payload Form Card */}
                <div className="w-full lg:w-[540px]">
                  <Card className={`${GlyphCard.premium} ${GlyphShadows.depth.lg}`}>
                    <CardHeader className="border-b border-purple-500/20">
                      <CardTitle className="text-white">{currentTypeConfig?.name || 'QR Configuration'}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                      <QRTypeForm qrType={qrType} qrData={qrData} setQrData={setQrData} />

                      {/* Size */}
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

                      {/* Error Correction */}
                      <div>
                        <Label className="text-white">Error Correction</Label>
                        <Select value={errorCorrectionLevel} onValueChange={setErrorCorrectionLevel}>
                          <SelectTrigger className="bg-gray-800 border-gray-700 text-white mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            <SelectItem value="L">Low (7%)</SelectItem>
                            <SelectItem value="M">Medium (15%)</SelectItem>
                            <SelectItem value="Q">Quartile (25%)</SelectItem>
                            <SelectItem value="H">High (30%)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Generate Button */}
                      <Button
                        onClick={generateQR}
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
                            Generate Secure QR
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Right: GL Preview Block */}
                <div className="w-full lg:w-[540px]">
                  <div className="relative w-full rounded-xl bg-[#0d0f1a]/70 p-4 overflow-hidden shadow-lg">
                    <img
                      src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/382879216_qrgl.png"
                      alt="GL Frame"
                      className="w-full h-auto object-contain select-none pointer-events-none"
                    />

                    {qrGenerated && getRawQRUrl() && (
                      <img
                        src={getRawQRUrl()}
                        alt="Generated QR"
                        className="absolute top-[50%] left-[63%] w-[32%] -translate-x-1/2 -translate-y-1/2 object-contain select-none pointer-events-none"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Security Results Row */}
              <div className="w-full flex flex-col lg:flex-row gap-6">
                <div className="w-full lg:w-[540px] space-y-6">
                  {/* Risk Badge */}
                  {securityResult && (
                    <Card className={GlyphCard.glass}>
                      <CardHeader>
                        <CardTitle className="text-white text-sm flex items-center gap-2">
                          <Shield className="w-4 h-4 text-cyan-400" />
                          Security Scan Result
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <QrSecurityBadge
                          riskScore={securityResult.final_score}
                          riskFlags={securityResult.phishing_indicators || []}
                        />
                      </CardContent>
                    </Card>
                  )}

                  {/* Generation Status */}
                  {qrGenerated && (
                    <Card className={GlyphCard.glass}>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                            <Shield className="w-8 h-8 text-green-400" />
                          </div>
                          <h4 className="text-white font-bold mb-2">QR Generated Successfully</h4>
                          <p className="text-sm text-gray-400 mb-4">
                            Go to Customize tab to style your QR, then Preview to download.
                          </p>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => setActiveTab('customize')}
                              variant="outline"
                              className="flex-1 border-cyan-500/50 text-white"
                            >
                              <Layers className="w-4 h-4 mr-2" />
                              Customize
                            </Button>
                            <Button
                              onClick={() => setActiveTab('preview')}
                              variant="outline"
                              className="flex-1 border-purple-500/50 text-white"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Preview
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Blocked Notice */}
                  {securityResult?.final_score < 65 && (
                    <Card className="bg-red-500/10 border-red-500/30">
                      <CardContent className="pt-6 text-center">
                        <div className="text-5xl mb-4">🚫</div>
                        <h4 className="text-red-400 font-bold">Generation Blocked</h4>
                        <p className="text-sm text-white">Security score: {securityResult.final_score}/100</p>
                        <p className="text-xs text-gray-400 mt-2">This URL/payload failed security checks.</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ========== 02_CUSTOMIZE TAB ========== */}
          <TabsContent value="customize">
            <div className="grid lg:grid-cols-2 gap-8 relative z-10">
              <div>
                <QrCustomizationPanel
                  customization={customization}
                  setCustomization={setCustomization}
                  errorCorrectionLevel={errorCorrectionLevel}
                  setErrorCorrectionLevel={setErrorCorrectionLevel}
                  onApply={applyCustomization}
                />
              </div>

              {/* Live Preview */}
              <div>
                <Card className={`${GlyphCard.premium} ${GlyphShadows.depth.lg} sticky top-24`}>
                  <CardHeader className="border-b border-purple-500/20">
                    <CardTitle className="text-white flex items-center gap-2">
                      <Eye className="w-5 h-5 text-cyan-400" />
                      Live Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {qrGenerated ? (
                      <div className="space-y-4">
                        <div 
                          className="p-8 rounded-lg flex items-center justify-center relative"
                          style={{
                            background: customization.background?.type === 'gradient'
                              ? `linear-gradient(135deg, ${customization.background?.gradientColor1}, ${customization.background?.gradientColor2})`
                              : customization.background?.type === 'image' && customization.background?.imageUrl
                                ? `url(${customization.background.imageUrl}) center/cover`
                                : customization.background?.color || '#FFFFFF'
                          }}
                        >
                          <img 
                            src={getQRUrl()} 
                            alt="QR Code" 
                            className="max-w-full"
                            style={{
                              filter: customization.gradient?.enabled 
                                ? `hue-rotate(${customization.gradient.angle}deg)` 
                                : 'none'
                            }}
                          />
                          {(logoPreviewUrl || customization.logo?.url) && (
                            <div 
                              className="absolute inset-0 flex items-center justify-center"
                              style={{ opacity: (customization.logo?.opacity || 100) / 100 }}
                            >
                              <img 
                                src={logoPreviewUrl || customization.logo?.url} 
                                alt="Logo" 
                                className={`bg-white p-1 ${
                                  customization.logo?.shape === 'circle' ? 'rounded-full' :
                                  customization.logo?.shape === 'rounded' ? 'rounded-xl' : 'rounded-lg'
                                } ${customization.logo?.border ? 'border-2 border-gray-300' : ''}`}
                                style={{ 
                                  width: `${customization.logo?.size || 20}%`,
                                  height: 'auto',
                                  transform: `rotate(${customization.logo?.rotation || 0}deg)`
                                }}
                              />
                            </div>
                          )}
                        </div>
                        
                        <div className="text-center text-xs text-gray-400 space-y-1">
                          <p>Dot: {customization.dotStyle} | Eye: {customization.eyeStyle}</p>
                          <p>ECC: {errorCorrectionLevel} | Size: {size}px</p>
                        </div>
                      </div>
                    ) : (
                      <div className="h-80 flex items-center justify-center border-2 border-dashed border-gray-700 rounded-lg">
                        <div className="text-center">
                          <Wand2 className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                          <p className="text-gray-500">Generate a QR code in Create tab first</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* ========== 03_PREVIEW TAB ========== */}
          <TabsContent value="preview">
            <QrPreviewPanel
              qrAssetDraft={qrAssetDraft}
              customization={customization}
              qrImageUrl={qrGenerated ? getQRUrl() : null}
              securityResult={securityResult}
              size={size}
              errorCorrectionLevel={errorCorrectionLevel}
              qrType={qrType}
              codeId={codeId}
              logoPreviewUrl={logoPreviewUrl}
              onRegenerate={generateQR}
            />
          </TabsContent>

          {/* ========== 04_STEGO TAB ========== */}
          <TabsContent value="stego">
            <div className="space-y-8 relative z-10">
              <Card className={GlyphCard.premium}>
                <CardHeader className="border-b border-purple-500/20">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Lock className="w-5 h-5 text-purple-400" />
                    Steganography Engine
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-gray-400 mb-6">
                    Hide QR data within images or extract hidden data. Uses LSB (Least Significant Bit) encoding.
                  </p>
                  <SteganographicQR 
                    qrPayload={buildQRPayload() || "https://glyphlock.io"} 
                    qrGenerated={true}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ========== 05_SECURITY TAB ========== */}
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

              {securityResult && <SecurityStatus securityResult={securityResult} />}

              <Card className={GlyphCard.glass}>
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

          {/* ========== 06_ANALYTICS TAB ========== */}
          <TabsContent value="analytics">
            {qrAssetDraft ? (
              <AnalyticsPanel qrAssetId={qrAssetDraft.id} />
            ) : (
              <Card className={`${GlyphCard.glass} p-12 text-center relative z-10`}>
                <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400 text-lg">Generate a QR code first to view analytics</p>
              </Card>
            )}
          </TabsContent>

          {/* ========== 07_BULK TAB ========== */}
          <TabsContent value="bulk">
            <QrBatchUploader />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}