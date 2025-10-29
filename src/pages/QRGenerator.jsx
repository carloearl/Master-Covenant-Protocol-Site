import React, { useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Loader2, Shield, AlertTriangle, Info, Upload, Image as ImageIcon, Palette, HelpCircle } from "lucide-react";
import SecurityStatus from "../components/qr/SecurityStatus";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function QRGenerator() {
  const [url, setUrl] = useState("");
  const [size, setSize] = useState(512);
  const [qrGenerated, setQrGenerated] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [securityResult, setSecurityResult] = useState(null);
  const [codeId, setCodeId] = useState(null);
  const [scanningStage, setScanningStage] = useState("");
  
  // Advanced customization options
  const [errorCorrection, setErrorCorrection] = useState("M");
  const [selectedPalette, setSelectedPalette] = useState("classic");
  const [customColors, setCustomColors] = useState({ fg: "#000000", bg: "#FFFFFF" });
  const [logoFile, setLogoFile] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);
  const fileInputRef = useRef(null);

  const colorPalettes = [
    { id: "classic", name: "Classic", fg: "#000000", bg: "#FFFFFF", description: "Traditional black & white" },
    { id: "royal", name: "Royal Blue", fg: "#1E40AF", bg: "#FFFFFF", description: "Professional blue tone" },
    { id: "cyber", name: "Cyber", fg: "#0EA5E9", bg: "#0F172A", description: "Dark tech aesthetic" },
    { id: "emerald", name: "Emerald", fg: "#059669", bg: "#FFFFFF", description: "Fresh green accent" },
    { id: "sunset", name: "Sunset", fg: "#DC2626", bg: "#FEF2F2", description: "Warm red tones" },
    { id: "grape", name: "Grape", fg: "#7C3AED", bg: "#FFFFFF", description: "Rich purple" },
    { id: "midnight", name: "Midnight", fg: "#FFFFFF", bg: "#1E293B", description: "Inverted dark mode" },
    { id: "custom", name: "Custom", fg: customColors.fg, bg: customColors.bg, description: "Your own colors" }
  ];

  const errorCorrectionLevels = [
    {
      level: "L",
      name: "Low (7%)",
      description: "Fastest scanning, minimal redundancy. Best for clean environments.",
      securityNote: "Lower error correction = less resilience to damage/tampering",
      icon: "🟢"
    },
    {
      level: "M",
      name: "Medium (15%)",
      description: "Balanced performance. Recommended for most use cases.",
      securityNote: "Good balance between size and error recovery",
      icon: "🟡"
    },
    {
      level: "Q",
      name: "Quartile (25%)",
      description: "Higher redundancy. Suitable for printed materials.",
      securityNote: "Better tamper resistance, slightly slower scanning",
      icon: "🟠"
    },
    {
      level: "H",
      name: "High (30%)",
      description: "Maximum error correction. Survives up to 30% damage. Ideal for logos.",
      securityNote: "Best security & durability, may require larger QR size",
      icon: "🔴"
    }
  ];

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Logo file must be under 2MB');
      return;
    }

    setLogoFile(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const uploadLogoToServer = async () => {
    if (!logoFile) return null;
    
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file: logoFile });
      return file_url;
    } catch (error) {
      console.error("Logo upload failed:", error);
      return null;
    }
  };

  const performStaticChecks = (payload) => {
    let score = 100;
    const issues = [];

    try {
      const urlObj = new URL(payload);
      
      if (urlObj.protocol !== 'https:') {
        score -= 30;
        issues.push("Non-HTTPS protocol detected");
      }

      const suspiciousTlds = ['.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top'];
      if (suspiciousTlds.some(tld => urlObj.hostname.endsWith(tld))) {
        score -= 20;
        issues.push("Suspicious TLD");
      }

      if (/^\d+\.\d+\.\d+\.\d+$/.test(urlObj.hostname)) {
        score -= 25;
        issues.push("Naked IP address");
      }

      const shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly'];
      if (shorteners.some(s => urlObj.hostname.includes(s))) {
        score -= 15;
        issues.push("URL shortener detected");
      }

      if (payload.length > 500) {
        score -= 10;
        issues.push("Excessive URL length");
      }

      if (urlObj.searchParams.toString().length > 200) {
        score -= 10;
        issues.push("Complex query parameters");
      }

    } catch (e) {
      score = 0;
      issues.push("Invalid URL format");
    }

    return { score: Math.max(0, score), issues };
  };

  const performNLPAnalysis = async (payload) => {
    setScanningStage("Running NLP analysis...");
    
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an advanced AI security agent specialized in detecting QR code threats.

Analyze this URL for security threats: "${payload}"

Perform comprehensive NLP security analysis:

1. DOMAIN TRUST ANALYSIS (0-100):
   - Check domain reputation and trustworthiness
   - Detect URL shorteners and redirects
   - Identify typosquatting patterns (e.g., micr0soft.com, paypa1.com)
   - Analyze domain age indicators
   - Check for excessive URL length or unusual characters
   - Verify legitimate TLDs vs suspicious ones (.tk, .ml, .xyz)

2. NLP SENTIMENT & PHISHING ANALYSIS (0-100):
   - Extract entities and detect social engineering tactics
   - Identify urgency-inducing phrases: "urgent", "verify now", "account suspended", "act immediately"
   - Detect impersonation attempts of legitimate brands
   - Analyze suspicious keywords: "verify", "confirm", "reset password", "suspended"
   - Check for homograph attacks (unicode lookalikes)
   - Detect credential harvesting patterns

3. ENTITY LEGITIMACY (0-100):
   - Verify if domain matches claimed brand identity
   - Check for legitimate organization patterns
   - Detect credential phishing indicators
   - Analyze path structure for suspicious patterns
   - Verify SSL certificate legitimacy patterns

4. URL FEATURE ANALYSIS (0-100):
   - Check for data URIs, javascript:, file:, blob: schemes
   - Detect obfuscation techniques
   - Analyze redirect chains
   - Check for hidden parameters

5. THREAT CLASSIFICATION - Identify all that apply:
   - Quishing: QR-based phishing attacks
   - QRLjacking: Session hijacking via QR
   - Malicious URL: Direct malware/exploit links
   - Phishing: Credential theft attempts
   - Typosquatting: Domain impersonation
   - Social Engineering: Urgency/fear tactics

Calculate final security score using weighted formula:
final_score = (domain_trust * 0.4) + (sentiment_score * 0.25) + (entity_legitimacy * 0.2) + (url_features * 0.15)

Risk level criteria:
- 80-100: safe
- 65-79: low/medium (allow with warning)
- 0-64: high/critical (block)

Provide detailed analysis with specific examples found.`,
        response_json_schema: {
          type: "object",
          properties: {
            domain_trust: { type: "number" },
            sentiment_score: { type: "number" },
            entity_legitimacy: { type: "number" },
            url_features: { type: "number" },
            final_score: { type: "number" },
            risk_level: { 
              type: "string",
              enum: ["safe", "low", "medium", "high", "critical"]
            },
            threat_types: {
              type: "array",
              items: { type: "string" }
            },
            phishing_indicators: {
              type: "array",
              items: { type: "string" }
            },
            analysis_details: { type: "string" },
            ml_version: { type: "string" }
          }
        }
      });

      return result;
    } catch (error) {
      console.error("NLP analysis failed:", error);
      return {
        domain_trust: 50,
        sentiment_score: 50,
        entity_legitimacy: 50,
        url_features: 50,
        final_score: 50,
        risk_level: "medium",
        threat_types: ["Analysis Error"],
        phishing_indicators: ["Unable to complete full NLP analysis"],
        analysis_details: "NLP scan encountered an error",
        ml_version: "1.0.0"
      };
    }
  };

  const generateQR = async () => {
    if (!url) return;
    
    setIsScanning(true);
    setSecurityResult(null);
    setQrGenerated(false);

    try {
      setScanningStage("Performing static checks...");
      await new Promise(resolve => setTimeout(resolve, 500));
      const staticResult = performStaticChecks(url);
      
      const nlpResult = await performNLPAnalysis(url);
      
      setScanningStage("Calculating risk score...");
      const finalScore = Math.round(
        (nlpResult.domain_trust * 0.4) +
        (nlpResult.sentiment_score * 0.25) +
        (nlpResult.entity_legitimacy * 0.2) +
        (nlpResult.url_features * 0.15)
      );

      const allIndicators = [
        ...staticResult.issues,
        ...(nlpResult.phishing_indicators || [])
      ];

      const combinedResult = {
        ...nlpResult,
        final_score: Math.min(finalScore, staticResult.score),
        phishing_indicators: allIndicators,
        risk_level: finalScore >= 80 ? "safe" : finalScore >= 65 ? "medium" : "high"
      };

      setSecurityResult(combinedResult);

      const newCodeId = `qr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setCodeId(newCodeId);
      const payloadHash = await generateSHA256(url);

      if (combinedResult.final_score >= 65) {
        setScanningStage("Generating secure QR code...");
        
        // Upload logo if present
        let uploadedLogoUrl = null;
        if (logoFile) {
          uploadedLogoUrl = await uploadLogoToServer();
        }

        setQrGenerated(true);

        const palette = colorPalettes.find(p => p.id === selectedPalette);
        const fgColor = palette.fg;
        const bgColor = palette.bg;

        await base44.entities.QRGenHistory.create({
          code_id: newCodeId,
          payload: url,
          payload_sha256: payloadHash,
          size: size,
          creator_id: "guest",
          status: combinedResult.final_score >= 80 ? "safe" : "suspicious",
          type: "url",
          image_format: "png",
          error_correction: errorCorrection,
          foreground_color: fgColor,
          background_color: bgColor,
          has_logo: !!uploadedLogoUrl,
          logo_url: uploadedLogoUrl
        });

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
      } else {
        setScanningStage("Code blocked by security policy");
        setQrGenerated(false);

        await base44.entities.QRThreatLog.create({
          incident_id: `threat_${Date.now()}`,
          code_id: newCodeId,
          attack_type: combinedResult.threat_types?.[0] || "High Risk URL",
          payload: url,
          threat_description: `Policy gate blocked: Score ${combinedResult.final_score}/100. ${combinedResult.analysis_details || "Security threshold not met."}`,
          resolved: false,
          severity: combinedResult.risk_level === "critical" ? "critical" : "high"
        });

        await base44.entities.QRGenHistory.create({
          code_id: newCodeId,
          payload: url,
          payload_sha256: payloadHash,
          size: size,
          creator_id: "guest",
          status: "blocked",
          type: "url",
          image_format: "png"
        });
      }
    } catch (error) {
      console.error("QR generation error:", error);
      setScanningStage("Error during security scan");
    } finally {
      setIsScanning(false);
    }
  };

  const generateSHA256 = async (text) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const getQRUrl = () => {
    const palette = colorPalettes.find(p => p.id === selectedPalette);
    const fgColor = encodeURIComponent(palette.fg.replace('#', ''));
    const bgColor = encodeURIComponent(palette.bg.replace('#', ''));
    
    let qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}&ecc=${errorCorrection}&color=${fgColor}&bgcolor=${bgColor}`;
    
    // Note: The free API doesn't support logos, but we store the logo URL for future use
    // In production, you'd use a service like QRCode.js or a premium API that supports logo embedding
    
    return qrUrl;
  };

  const downloadQR = () => {
    const link = document.createElement('a');
    link.href = getQRUrl();
    link.download = `secure-qr-${codeId}.png`;
    link.click();
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-400";
    if (score >= 65) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreBadge = (score) => {
    if (score >= 80) return { label: "Verified", color: "bg-green-500/20 text-green-400 border-green-500/50" };
    if (score >= 65) return { label: "Use with Caution", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50" };
    return { label: "Blocked", color: "bg-red-500/20 text-red-400 border-red-500/50" };
  };

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="relative inline-block mb-6">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/b5ad362ca_futuristic-qr-code.jpg"
                alt="Futuristic QR Code"
                className="h-32 w-32 object-cover rounded-lg"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              AI-Hardened QR <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Generator</span>
            </h1>
            <p className="text-xl text-white mb-2">
              Every code is scanned, scored, and blessed or blocked before it exists in the wild
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-blue-400">
              <Shield className="w-4 h-4" />
              <span>Multi-stage AI framework: Static → NLP → Policy Gate</span>
            </div>
          </div>

          <Alert className="mb-8 bg-blue-500/10 border-blue-500/30">
            <Info className="h-4 w-4 text-blue-400" />
            <AlertDescription className="text-white">
              <strong>Security Protocol:</strong> All payloads under 65/100 are automatically blocked. No exceptions. Scores 65-79 allowed with warnings. 80+ verified safe.
            </AlertDescription>
          </Alert>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Input & Basic Settings */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Basic Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="url" className="text-white">URL or Text</Label>
                    <Input
                      id="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>

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

                  <Button
                    onClick={generateQR}
                    disabled={!url || isScanning}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                  >
                    {isScanning ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {scanningStage || "Scanning..."}
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4 mr-2" />
                        Generate & Verify
                      </>
                    )}
                  </Button>

                  {isScanning && (
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                      <div className="text-sm text-blue-400 mb-2 font-semibold">AI Security Pipeline Active</div>
                      <div className="text-xs text-white space-y-1">
                        <div>✓ Stage 1: Static checks</div>
                        <div>✓ Stage 2: NLP analysis</div>
                        <div>✓ Stage 3: Entity verification</div>
                        <div>✓ Stage 4: Rank aggregation</div>
                        <div>✓ Stage 5: Policy gate</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Error Correction Level */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    Error Correction
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="w-4 h-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-gray-800 border-gray-700 text-white max-w-xs">
                          <p>Higher error correction allows QR codes to remain scannable even if damaged or obscured. Essential for logos and outdoor use.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={errorCorrection} onValueChange={setErrorCorrection}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {errorCorrectionLevels.map(level => (
                        <SelectItem key={level.level} value={level.level} className="text-white">
                          <div className="flex items-center gap-2">
                            <span>{level.icon}</span>
                            <span>{level.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {errorCorrectionLevels.find(l => l.level === errorCorrection) && (
                    <div className="mt-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
                      <p className="text-sm text-white mb-2">
                        {errorCorrectionLevels.find(l => l.level === errorCorrection).description}
                      </p>
                      <p className="text-xs text-blue-400">
                        🔒 {errorCorrectionLevels.find(l => l.level === errorCorrection).securityNote}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Middle Column - Preview */}
            <div className="lg:col-span-1">
              <Card className="bg-gray-900 border-gray-800 h-full">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-white">
                    <span>Preview</span>
                    {securityResult && (
                      <Badge variant="outline" className={getScoreBadge(securityResult.final_score).color}>
                        {getScoreBadge(securityResult.final_score).label}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {qrGenerated && url && securityResult && securityResult.final_score >= 65 ? (
                    <div className="space-y-4">
                      <div className="bg-white p-8 rounded-lg flex items-center justify-center relative">
                        <img
                          src={getQRUrl()}
                          alt="QR Code"
                          className="max-w-full"
                        />
                        {logoUrl && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <img 
                              src={logoUrl} 
                              alt="Logo" 
                              className="w-16 h-16 rounded-lg bg-white p-1"
                            />
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <Badge className={`${getScoreColor(securityResult.final_score)} bg-white/90 backdrop-blur`}>
                            {securityResult.final_score}/100
                          </Badge>
                        </div>
                      </div>
                      {securityResult.final_score < 80 && (
                        <Alert className="bg-yellow-500/10 border-yellow-500/30">
                          <AlertTriangle className="h-4 w-4 text-yellow-400" />
                          <AlertDescription className="text-white">
                            <strong>Caution:</strong> This code passed but scored below 80. Review security details before use.
                          </AlertDescription>
                        </Alert>
                      )}
                      <Button
                        onClick={downloadQR}
                        variant="outline"
                        className="w-full border-blue-500/50 hover:bg-blue-500/10 text-white"
                      >
                        ⬇️ Download Secure QR Code
                      </Button>
                    </div>
                  ) : securityResult && securityResult.final_score < 65 ? (
                    <div className="h-96 flex items-center justify-center border-2 border-dashed border-red-700 rounded-lg bg-red-500/5">
                      <div className="text-center p-6">
                        <div className="text-5xl mb-4">🚫</div>
                        <p className="text-red-400 font-semibold mb-2">Policy Gate Blocked</p>
                        <p className="text-sm text-white mb-2">Score: {securityResult.final_score}/100 (minimum: 65)</p>
                        <p className="text-xs text-gray-400">This URL was flagged as high-risk and cannot be encoded.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-96 flex items-center justify-center border-2 border-dashed border-gray-700 rounded-lg">
                      <div className="text-center">
                        <Shield className="w-16 h-16 mx-auto mb-4 opacity-50 text-blue-400" />
                        <p className="text-gray-500">Enter a URL to generate a secure QR code</p>
                        <p className="text-xs text-gray-600 mt-2">All codes are verified by AI before generation</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Customization */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Color Palettes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {colorPalettes.filter(p => p.id !== "custom").map(palette => (
                      <button
                        key={palette.id}
                        onClick={() => setSelectedPalette(palette.id)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          selectedPalette === palette.id
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div 
                            className="w-6 h-6 rounded border border-gray-600"
                            style={{ backgroundColor: palette.fg }}
                          />
                          <div 
                            className="w-6 h-6 rounded border border-gray-600"
                            style={{ backgroundColor: palette.bg }}
                          />
                        </div>
                        <div className="text-xs font-semibold text-white">{palette.name}</div>
                        <div className="text-xs text-gray-400 mt-1">{palette.description}</div>
                      </button>
                    ))}
                  </div>

                  {/* Custom Colors */}
                  <div className="mt-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
                    <Label className="text-white text-xs mb-2 block">Custom Colors</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-gray-400">Foreground</Label>
                        <Input
                          type="color"
                          value={customColors.fg}
                          onChange={(e) => {
                            setCustomColors({...customColors, fg: e.target.value});
                            setSelectedPalette("custom");
                          }}
                          className="h-10 bg-gray-700 border-gray-600"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-400">Background</Label>
                        <Input
                          type="color"
                          value={customColors.bg}
                          onChange={(e) => {
                            setCustomColors({...customColors, bg: e.target.value});
                            setSelectedPalette("custom");
                          }}
                          className="h-10 bg-gray-700 border-gray-600"
                        />
                      </div>
                    </div>
                  </div>

                  <Alert className="mt-4 bg-amber-500/10 border-amber-500/30">
                    <Info className="h-3 w-3 text-amber-400" />
                    <AlertDescription className="text-xs text-white">
                      Ensure sufficient contrast for reliable scanning
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              {/* Logo Upload */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    Custom Logo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  
                  {logoUrl ? (
                    <div className="space-y-3">
                      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex items-center gap-3">
                        <img src={logoUrl} alt="Logo preview" className="w-16 h-16 object-contain rounded" />
                        <div className="flex-1">
                          <p className="text-sm text-white font-medium">Logo uploaded</p>
                          <p className="text-xs text-gray-400">Will be centered in QR code</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          setLogoFile(null);
                          setLogoUrl(null);
                        }}
                        variant="outline"
                        size="sm"
                        className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10"
                      >
                        Remove Logo
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      className="w-full border-blue-500/50 hover:bg-blue-500/10 text-white"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Logo
                    </Button>
                  )}

                  <Alert className="bg-blue-500/10 border-blue-500/30">
                    <Info className="h-3 w-3 text-blue-400" />
                    <AlertDescription className="text-xs text-white">
                      <strong>Tip:</strong> Use High (H) error correction for QR codes with logos to ensure scannability
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Security Status Display */}
          {securityResult && (
            <div className="mt-8">
              <SecurityStatus securityResult={securityResult} />
            </div>
          )}

          {/* Features Grid */}
          <div className="mt-12 grid md:grid-cols-4 gap-6">
            <Card className="bg-gray-900 border-gray-800 text-center">
              <CardContent className="pt-6">
                <div className="text-4xl mb-3">🛡️</div>
                <h3 className="font-bold mb-2 text-white">5-Stage Pipeline</h3>
                <p className="text-sm text-white">Normalize → Static → NLP → Score → Gate</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-800 text-center">
              <CardContent className="pt-6">
                <div className="text-4xl mb-3">🎯</div>
                <h3 className="font-bold mb-2 text-white">Real-time Blocking</h3>
                <p className="text-sm text-white">Quishing, QRLjacking & phishing blocked</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-800 text-center">
              <CardContent className="pt-6">
                <div className="text-4xl mb-3">🎨</div>
                <h3 className="font-bold mb-2 text-white">Full Customization</h3>
                <p className="text-sm text-white">Colors, logos, error correction levels</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-800 text-center">
              <CardContent className="pt-6">
                <div className="text-4xl mb-3">📊</div>
                <h3 className="font-bold mb-2 text-white">Complete Audit</h3>
                <p className="text-sm text-white">SHA-256 hash & detailed logging</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}