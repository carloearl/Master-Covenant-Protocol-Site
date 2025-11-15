import React, { useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Loader2, Shield, AlertTriangle, Info, Upload, Image as ImageIcon, Palette } from "lucide-react";
import SecurityStatus from "@/components/qr/SecurityStatus";
import SteganographicQR from "@/components/qr/SteganographicQR";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import QRTypeSelector from "@/components/crypto/QRTypeSelector";
import QRTypeForm from "@/components/crypto/QRTypeForm";
import { generateSHA256, performStaticURLChecks } from "@/utils/securityUtils";

export default function QRGeneratorTab() {
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
  
  const [errorCorrection, setErrorCorrection] = useState("M");
  const [selectedPalette, setSelectedPalette] = useState("classic");
  const [customColors, setCustomColors] = useState({ fg: "#000000", bg: "#FFFFFF" });
  const [logoFile, setLogoFile] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);
  const fileInputRef = useRef(null);

  const colorPalettes = [
    { id: "classic", name: "Classic", fg: "#000000", bg: "#FFFFFF" },
    { id: "royal", name: "Royal Blue", fg: "#1E40AF", bg: "#FFFFFF" },
    { id: "cyber", name: "Cyber", fg: "#0EA5E9", bg: "#0F172A" },
    { id: "emerald", name: "Emerald", fg: "#059669", bg: "#FFFFFF" },
    { id: "sunset", name: "Sunset", fg: "#DC2626", bg: "#FEF2F2" },
    { id: "grape", name: "Grape", fg: "#7C3AED", bg: "#FFFFFF" },
    { id: "custom", name: "Custom", fg: customColors.fg, bg: customColors.bg }
  ];

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
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('Logo file must be under 2MB');
      return;
    }
    setLogoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setLogoUrl(reader.result);
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

  const performNLPAnalysis = async (payload) => {
    setScanningStage("Running NLP analysis...");
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this URL/email for security threats: "${payload}"

Perform comprehensive security analysis:
1. DOMAIN TRUST (0-100): Check reputation, detect typosquatting, verify legitimate TLDs
2. NLP PHISHING (0-100): Detect urgency phrases, impersonation, credential harvesting
3. ENTITY LEGITIMACY (0-100): Verify brand identity, check SSL patterns
4. URL FEATURES (0-100): Check for javascript:, data URIs, obfuscation

Calculate: final_score = (domain_trust * 0.4) + (sentiment_score * 0.25) + (entity_legitimacy * 0.2) + (url_features * 0.15)

Identify threats: Quishing, QRLjacking, Phishing, Typosquatting, Social Engineering`,
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
      return result;
    } catch (error) {
      return {
        domain_trust: 50, sentiment_score: 50, entity_legitimacy: 50, url_features: 50,
        final_score: 50, risk_level: "medium", threat_types: ["Analysis Error"],
        phishing_indicators: ["Unable to complete full NLP analysis"],
        analysis_details: "NLP scan encountered an error", ml_version: "1.0.0"
      };
    }
  };

  const generateQR = async () => {
    const payload = buildQRPayload();
    if (!payload) {
      alert("Please fill in the required fields");
      return;
    }
    
    setIsScanning(true);
    setSecurityResult(null);
    setQrGenerated(false);

    try {
      const needsSecurity = qrTypes.find(t => t.id === qrType)?.needsSecurity;
      let combinedResult = null;

      if (needsSecurity) {
        setScanningStage("Performing static checks...");
        await new Promise(resolve => setTimeout(resolve, 500));
        const staticResult = performStaticURLChecks(payload);
        const nlpResult = await performNLPAnalysis(payload);
        
        setScanningStage("Calculating risk score...");
        const finalScore = Math.round(
          (nlpResult.domain_trust * 0.4) +
          (nlpResult.sentiment_score * 0.25) +
          (nlpResult.entity_legitimacy * 0.2) +
          (nlpResult.url_features * 0.15)
        );

        const allIndicators = [...staticResult.issues, ...(nlpResult.phishing_indicators || [])];

        combinedResult = {
          ...nlpResult,
          final_score: Math.min(finalScore, staticResult.score),
          phishing_indicators: allIndicators,
          risk_level: finalScore >= 80 ? "safe" : finalScore >= 65 ? "medium" : "high"
        };

        setSecurityResult(combinedResult);

        if (combinedResult.final_score < 65) {
          setScanningStage("Code blocked by security policy");
          const newCodeId = `qr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          const payloadHash = await generateSHA256(payload);

          await base44.entities.QRThreatLog.create({
            incident_id: `threat_${Date.now()}`,
            code_id: newCodeId,
            attack_type: combinedResult.threat_types?.[0] || "High Risk URL",
            payload: payload,
            threat_description: `Policy gate blocked: Score ${combinedResult.final_score}/100`,
            resolved: false,
            severity: combinedResult.risk_level === "critical" ? "critical" : "high"
          });

          await base44.entities.QRGenHistory.create({
            code_id: newCodeId,
            payload: payload,
            payload_sha256: payloadHash,
            size: size,
            creator_id: "guest",
            status: "blocked",
            type: qrType,
            image_format: "png"
          });
          
          setIsScanning(false);
          return;
        }
      }

      setScanningStage("Generating QR code...");
      
      let uploadedLogoUrl = null;
      if (logoFile) {
        uploadedLogoUrl = await uploadLogoToServer();
      }

      setQrGenerated(true);

      const newCodeId = `qr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setCodeId(newCodeId);
      const payloadHash = await generateSHA256(payload);

      const palette = colorPalettes.find(p => p.id === selectedPalette);

      await base44.entities.QRGenHistory.create({
        code_id: newCodeId,
        payload: payload,
        payload_sha256: payloadHash,
        size: size,
        creator_id: "guest",
        status: combinedResult ? (combinedResult.final_score >= 80 ? "safe" : "suspicious") : "safe",
        type: qrType,
        image_format: "png",
        error_correction: errorCorrection,
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
    } catch (error) {
      console.error("QR generation error:", error);
      setScanningStage("Error during generation");
    } finally {
      setIsScanning(false);
    }
  };

  const getQRUrl = () => {
    const payload = buildQRPayload();
    const palette = colorPalettes.find(p => p.id === selectedPalette);
    const fgColor = encodeURIComponent(palette.fg.replace('#', ''));
    const bgColor = encodeURIComponent(palette.bg.replace('#', ''));
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(payload)}&ecc=${errorCorrection}&color=${fgColor}&bgcolor=${bgColor}`;
  };

  const downloadQR = () => {
    const link = document.createElement('a');
    link.href = getQRUrl();
    link.download = `glyphlock-qr-${qrType}-${codeId}.png`;
    link.click();
  };

  const currentTypeConfig = qrTypes.find(t => t.id === qrType);

  return (
    <div className="space-y-8">
      {currentTypeConfig?.needsSecurity && (
        <Alert className="bg-blue-500/10 border-blue-500/30">
          <Info className="h-4 w-4 text-blue-400" />
          <AlertDescription className="text-white">
            <strong>Security Protocol Active:</strong> URLs and emails are scanned by AI. Payloads under 65/100 are blocked.
          </AlertDescription>
        </Alert>
      )}

      <QRTypeSelector qrType={qrType} setQrType={setQrType} qrTypes={qrTypes} />

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">{currentTypeConfig.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <QRTypeForm qrType={qrType} qrData={qrData} setQrData={setQrData} />

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
                disabled={isScanning}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {scanningStage || "Generating..."}
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Generate QR Code
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white text-sm">Error Correction</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={errorCorrection} onValueChange={setErrorCorrection}>
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

        <div className="lg:col-span-1">
          <Card className="bg-gray-900 border-gray-800 h-full">
            <CardHeader>
              <CardTitle className="text-white">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {qrGenerated ? (
                <div className="space-y-4">
                  <div className="bg-white p-8 rounded-lg flex items-center justify-center relative">
                    <img src={getQRUrl()} alt="QR Code" className="max-w-full" />
                    {logoUrl && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <img src={logoUrl} alt="Logo" className="w-16 h-16 rounded-lg bg-white p-1" />
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={downloadQR}
                    variant="outline"
                    className="w-full border-blue-500/50 hover:bg-blue-500/10 text-white"
                  >
                    ⬇️ Download QR Code
                  </Button>
                </div>
              ) : securityResult && securityResult.final_score < 65 ? (
                <div className="h-96 flex items-center justify-center border-2 border-dashed border-red-700 rounded-lg bg-red-500/5">
                  <div className="text-center p-6">
                    <div className="text-5xl mb-4">🚫</div>
                    <p className="text-red-400 font-semibold mb-2">Policy Gate Blocked</p>
                    <p className="text-sm text-white">Score: {securityResult.final_score}/100</p>
                  </div>
                </div>
              ) : (
                <div className="h-96 flex items-center justify-center border-2 border-dashed border-gray-700 rounded-lg">
                  <p className="text-gray-500">Fill the form and click Generate</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-sm">
                <Palette className="w-4 h-4" />
                Colors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {colorPalettes.filter(p => p.id !== "custom").map(palette => (
                  <button
                    key={palette.id}
                    onClick={() => setSelectedPalette(palette.id)}
                    className={`p-2 rounded-lg border transition-all ${
                      selectedPalette === palette.id ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-4 h-4 rounded border border-gray-600" style={{ backgroundColor: palette.fg }} />
                      <div className="w-4 h-4 rounded border border-gray-600" style={{ backgroundColor: palette.bg }} />
                    </div>
                    <div className="text-xs font-semibold text-white">{palette.name}</div>
                  </button>
                ))}
              </div>
              <div className="mt-3 p-2 bg-gray-800 rounded-lg border border-gray-700">
                <Label className="text-white text-xs mb-2 block">Custom</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="color"
                    value={customColors.fg}
                    onChange={(e) => {
                      setCustomColors({...customColors, fg: e.target.value});
                      setSelectedPalette("custom");
                    }}
                    className="h-8 bg-gray-700 border-gray-600"
                  />
                  <Input
                    type="color"
                    value={customColors.bg}
                    onChange={(e) => {
                      setCustomColors({...customColors, bg: e.target.value});
                      setSelectedPalette("custom");
                    }}
                    className="h-8 bg-gray-700 border-gray-600"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-sm">
                <ImageIcon className="w-4 h-4" />
                Logo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              
              {logoUrl ? (
                <div className="space-y-2">
                  <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 flex items-center gap-2">
                    <img src={logoUrl} alt="Logo" className="w-12 h-12 object-contain rounded" />
                    <p className="text-xs text-white font-medium">Logo uploaded</p>
                  </div>
                  <Button
                    onClick={() => {
                      setLogoFile(null);
                      setLogoUrl(null);
                    }}
                    variant="outline"
                    size="sm"
                    className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10 text-xs"
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  size="sm"
                  className="w-full border-blue-500/50 hover:bg-blue-500/10 text-white text-xs"
                >
                  <Upload className="w-3 h-3 mr-2" />
                  Upload Logo
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {securityResult && (
        <div className="mt-8">
          <SecurityStatus securityResult={securityResult} />
        </div>
      )}

      <div className="mt-8">
        <SteganographicQR 
          qrPayload={buildQRPayload()} 
          qrGenerated={qrGenerated && (!securityResult || securityResult.final_score >= 65)}
        />
      </div>
    </div>
  );
}