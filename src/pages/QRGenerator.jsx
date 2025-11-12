import React, { useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Loader2, Shield, AlertTriangle, Info, Upload, Image as ImageIcon, Palette, HelpCircle, Link as LinkIcon, Type, Mail, Phone, Wifi, User, MapPin, Calendar } from "lucide-react";
import SecurityStatus from "../components/qr/SecurityStatus";
import SteganographicQR from "../components/qr/SteganographicQR";
import FreeTrialGuard from "../components/FreeTrialGuard";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function QRGenerator() {
  const [qrType, setQrType] = useState("url");
  const [qrData, setQrData] = useState({
    // URL
    url: "",
    // Text
    text: "",
    // Email
    email: "",
    emailSubject: "",
    emailBody: "",
    // Phone
    phone: "",
    // SMS
    smsNumber: "",
    smsMessage: "",
    // WiFi
    wifiSSID: "",
    wifiPassword: "",
    wifiEncryption: "WPA",
    wifiHidden: false,
    // vCard
    vcardFirstName: "",
    vcardLastName: "",
    vcardOrganization: "",
    vcardPhone: "",
    vcardEmail: "",
    vcardWebsite: "",
    vcardAddress: "",
    // Location
    latitude: "",
    longitude: "",
    // Event
    eventTitle: "",
    eventLocation: "",
    eventStartDate: "",
    eventStartTime: "",
    eventEndDate: "",
    eventEndTime: "",
    eventDescription: ""
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
    { level: "L", name: "Low (7%)", description: "Fastest scanning, minimal redundancy", icon: "🟢" },
    { level: "M", name: "Medium (15%)", description: "Balanced performance", icon: "🟡" },
    { level: "Q", name: "Quartile (25%)", description: "Higher redundancy for print", icon: "🟠" },
    { level: "H", name: "High (30%)", description: "Maximum protection for logos", icon: "🔴" }
  ];

  const qrTypes = [
    { id: "url", name: "URL/Website", icon: LinkIcon, needsSecurity: true },
    { id: "text", name: "Plain Text", icon: Type, needsSecurity: false },
    { id: "email", name: "Email", icon: Mail, needsSecurity: true },
    { id: "phone", name: "Phone Number", icon: Phone, needsSecurity: false },
    { id: "sms", name: "SMS Message", icon: Phone, needsSecurity: false },
    { id: "wifi", name: "WiFi Network", icon: Wifi, needsSecurity: false },
    { id: "vcard", name: "Contact Card", icon: User, needsSecurity: false },
    { id: "location", name: "GPS Location", icon: MapPin, needsSecurity: false },
    { id: "event", name: "Calendar Event", icon: Calendar, needsSecurity: false }
  ];

  const buildQRPayload = () => {
    switch (qrType) {
      case "url":
        return qrData.url;
      case "text":
        return qrData.text;
      case "email":
        return `mailto:${qrData.email}?subject=${encodeURIComponent(qrData.emailSubject)}&body=${encodeURIComponent(qrData.emailBody)}`;
      case "phone":
        return `tel:${qrData.phone}`;
      case "sms":
        return `SMSTO:${qrData.smsNumber}:${qrData.smsMessage}`;
      case "wifi":
        return `WIFI:T:${qrData.wifiEncryption};S:${qrData.wifiSSID};P:${qrData.wifiPassword};H:${qrData.wifiHidden};`;
      case "vcard":
        return `BEGIN:VCARD\nVERSION:3.0\nN:${qrData.vcardLastName};${qrData.vcardFirstName}\nFN:${qrData.vcardFirstName} ${qrData.vcardLastName}\nORG:${qrData.vcardOrganization}\nTEL:${qrData.vcardPhone}\nEMAIL:${qrData.vcardEmail}\nURL:${qrData.vcardWebsite}\nADR:${qrData.vcardAddress}\nEND:VCARD`;
      case "location":
        return `geo:${qrData.latitude},${qrData.longitude}`;
      case "event":
        const startDateTime = `${qrData.eventStartDate}T${qrData.eventStartTime}:00`;
        const endDateTime = `${qrData.eventEndDate}T${qrData.eventEndTime}:00`;
        return `BEGIN:VEVENT\nSUMMARY:${qrData.eventTitle}\nLOCATION:${qrData.eventLocation}\nDTSTART:${startDateTime.replace(/[-:]/g, '')}\nDTEND:${endDateTime.replace(/[-:]/g, '')}\nDESCRIPTION:${qrData.eventDescription}\nEND:VEVENT`;
      default:
        return "";
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
            risk_level: { type: "string", enum: ["safe", "low", "medium", "high", "critical"] },
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
        const staticResult = performStaticChecks(payload);
        
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

  const generateSHA256 = async (text) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
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

  const renderTypeForm = () => {
    switch (qrType) {
      case "url":
        return (
          <div>
            <Label htmlFor="url" className="text-white">Website URL *</Label>
            <Input
              id="url"
              value={qrData.url}
              onChange={(e) => setQrData({...qrData, url: e.target.value})}
              placeholder="https://example.com"
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
        );
      
      case "text":
        return (
          <div>
            <Label htmlFor="text" className="text-white">Text Content *</Label>
            <Textarea
              id="text"
              value={qrData.text}
              onChange={(e) => setQrData({...qrData, text: e.target.value})}
              placeholder="Enter any text..."
              rows={5}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
        );
      
      case "email":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-white">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={qrData.email}
                onChange={(e) => setQrData({...qrData, email: e.target.value})}
                placeholder="contact@example.com"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <Label htmlFor="emailSubject" className="text-white">Subject</Label>
              <Input
                id="emailSubject"
                value={qrData.emailSubject}
                onChange={(e) => setQrData({...qrData, emailSubject: e.target.value})}
                placeholder="Email subject"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <Label htmlFor="emailBody" className="text-white">Message</Label>
              <Textarea
                id="emailBody"
                value={qrData.emailBody}
                onChange={(e) => setQrData({...qrData, emailBody: e.target.value})}
                placeholder="Email message"
                rows={3}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
        );
      
      case "phone":
        return (
          <div>
            <Label htmlFor="phone" className="text-white">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={qrData.phone}
              onChange={(e) => setQrData({...qrData, phone: e.target.value})}
              placeholder="+1234567890"
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
        );
      
      case "sms":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="smsNumber" className="text-white">Phone Number *</Label>
              <Input
                id="smsNumber"
                type="tel"
                value={qrData.smsNumber}
                onChange={(e) => setQrData({...qrData, smsNumber: e.target.value})}
                placeholder="+1234567890"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <Label htmlFor="smsMessage" className="text-white">Message</Label>
              <Textarea
                id="smsMessage"
                value={qrData.smsMessage}
                onChange={(e) => setQrData({...qrData, smsMessage: e.target.value})}
                placeholder="SMS message"
                rows={3}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
        );
      
      case "wifi":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="wifiSSID" className="text-white">Network Name (SSID) *</Label>
              <Input
                id="wifiSSID"
                value={qrData.wifiSSID}
                onChange={(e) => setQrData({...qrData, wifiSSID: e.target.value})}
                placeholder="MyWiFiNetwork"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <Label htmlFor="wifiPassword" className="text-white">Password *</Label>
              <Input
                id="wifiPassword"
                type="password"
                value={qrData.wifiPassword}
                onChange={(e) => setQrData({...qrData, wifiPassword: e.target.value})}
                placeholder="Password"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <Label className="text-white">Encryption</Label>
              <Select value={qrData.wifiEncryption} onValueChange={(value) => setQrData({...qrData, wifiEncryption: value})}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="WPA">WPA/WPA2</SelectItem>
                  <SelectItem value="WEP">WEP</SelectItem>
                  <SelectItem value="nopass">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      
      case "vcard":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white">First Name *</Label>
                <Input
                  value={qrData.vcardFirstName}
                  onChange={(e) => setQrData({...qrData, vcardFirstName: e.target.value})}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-white">Last Name *</Label>
                <Input
                  value={qrData.vcardLastName}
                  onChange={(e) => setQrData({...qrData, vcardLastName: e.target.value})}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
            <div>
              <Label className="text-white">Organization</Label>
              <Input
                value={qrData.vcardOrganization}
                onChange={(e) => setQrData({...qrData, vcardOrganization: e.target.value})}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <Label className="text-white">Phone</Label>
              <Input
                type="tel"
                value={qrData.vcardPhone}
                onChange={(e) => setQrData({...qrData, vcardPhone: e.target.value})}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <Label className="text-white">Email</Label>
              <Input
                type="email"
                value={qrData.vcardEmail}
                onChange={(e) => setQrData({...qrData, vcardEmail: e.target.value})}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <Label className="text-white">Website</Label>
              <Input
                value={qrData.vcardWebsite}
                onChange={(e) => setQrData({...qrData, vcardWebsite: e.target.value})}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
        );
      
      case "location":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-white">Latitude *</Label>
              <Input
                type="number"
                step="any"
                value={qrData.latitude}
                onChange={(e) => setQrData({...qrData, latitude: e.target.value})}
                placeholder="37.7749"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <Label className="text-white">Longitude *</Label>
              <Input
                type="number"
                step="any"
                value={qrData.longitude}
                onChange={(e) => setQrData({...qrData, longitude: e.target.value})}
                placeholder="-122.4194"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
        );
      
      case "event":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-white">Event Title *</Label>
              <Input
                value={qrData.eventTitle}
                onChange={(e) => setQrData({...qrData, eventTitle: e.target.value})}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <Label className="text-white">Location</Label>
              <Input
                value={qrData.eventLocation}
                onChange={(e) => setQrData({...qrData, eventLocation: e.target.value})}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white">Start Date *</Label>
                <Input
                  type="date"
                  value={qrData.eventStartDate}
                  onChange={(e) => setQrData({...qrData, eventStartDate: e.target.value})}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-white">Start Time *</Label>
                <Input
                  type="time"
                  value={qrData.eventStartTime}
                  onChange={(e) => setQrData({...qrData, eventStartTime: e.target.value})}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white">End Date *</Label>
                <Input
                  type="date"
                  value={qrData.eventEndDate}
                  onChange={(e) => setQrData({...qrData, eventEndDate: e.target.value})}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-white">End Time *</Label>
                <Input
                  type="time"
                  value={qrData.eventEndTime}
                  onChange={(e) => setQrData({...qrData, eventEndTime: e.target.value})}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
            <div>
              <Label className="text-white">Description</Label>
              <Textarea
                value={qrData.eventDescription}
                onChange={(e) => setQrData({...qrData, eventDescription: e.target.value})}
                rows={3}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const currentTypeConfig = qrTypes.find(t => t.id === qrType);

  return (
    <FreeTrialGuard serviceName="QRGenerator">
      <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
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
              9 QR code types with AI security scanning and full customization
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-blue-400">
              <Shield className="w-4 h-4" />
              <span>URL/Text/Email/Phone/SMS/WiFi/vCard/Location/Events</span>
            </div>
          </div>

          {currentTypeConfig?.needsSecurity && (
            <Alert className="mb-8 bg-blue-500/10 border-blue-500/30">
              <Info className="h-4 w-4 text-blue-400" />
              <AlertDescription className="text-white">
                <strong>Security Protocol Active:</strong> URLs and emails are scanned by AI. Payloads under 65/100 are blocked.
              </AlertDescription>
            </Alert>
          )}

          {/* QR Type Selector */}
          <Card className="bg-gray-900 border-gray-800 mb-8">
            <CardHeader>
              <CardTitle className="text-white">Select QR Code Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {qrTypes.map(type => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setQrType(type.id)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        qrType === type.id
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <Icon className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                      <div className="text-xs font-semibold text-white">{type.name}</div>
                      {type.needsSecurity && (
                        <Shield className="w-3 h-3 mx-auto mt-1 text-green-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Content Input */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    {React.createElement(currentTypeConfig.icon, { className: "w-5 h-5" })}
                    {currentTypeConfig.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {renderTypeForm()}

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

                  {isScanning && currentTypeConfig?.needsSecurity && (
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                      <div className="text-sm text-blue-400 mb-2 font-semibold">AI Security Scan Active</div>
                      <div className="text-xs text-white space-y-1">
                        <div>✓ Static checks</div>
                        <div>✓ NLP analysis</div>
                        <div>✓ Threat detection</div>
                        <div>✓ Policy gate</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Error Correction */}
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
                      {errorCorrectionLevels.map(level => (
                        <SelectItem key={level.level} value={level.level} className="text-white">
                          {level.icon} {level.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  {qrGenerated ? (
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
                        {securityResult && (
                          <div className="absolute top-2 right-2">
                            <Badge className={`${getScoreColor(securityResult.final_score)} bg-white/90 backdrop-blur`}>
                              {securityResult.final_score}/100
                            </Badge>
                          </div>
                        )}
                      </div>
                      {securityResult && securityResult.final_score < 80 && (
                        <Alert className="bg-yellow-500/10 border-yellow-500/30">
                          <AlertTriangle className="h-4 w-4 text-yellow-400" />
                          <AlertDescription className="text-white">
                            <strong>Caution:</strong> Review security details before use.
                          </AlertDescription>
                        </Alert>
                      )}
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
                      <div className="text-center">
                        {React.createElement(currentTypeConfig.icon, { className: "w-16 h-16 mx-auto mb-4 opacity-50 text-blue-400" })}
                        <p className="text-gray-500">Fill the form and click Generate</p>
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
                  <CardTitle className="text-white flex items-center gap-2 text-sm">
                    <Palette className="w-4 h-4" />
                    Colors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {colorPalettes.filter(p => p.id !== "custom").slice(0, 6).map(palette => (
                      <button
                        key={palette.id}
                        onClick={() => setSelectedPalette(palette.id)}
                        className={`p-2 rounded-lg border transition-all ${
                          selectedPalette === palette.id
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div 
                            className="w-4 h-4 rounded border border-gray-600"
                            style={{ backgroundColor: palette.fg }}
                          />
                          <div 
                            className="w-4 h-4 rounded border border-gray-600"
                            style={{ backgroundColor: palette.bg }}
                          />
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

              {/* Logo Upload */}
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
                        <div className="flex-1">
                          <p className="text-xs text-white font-medium">Logo uploaded</p>
                        </div>
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

          {/* Security Status */}
          {securityResult && (
            <div className="mt-8">
              <SecurityStatus securityResult={securityResult} />
            </div>
          )}

          {/* Steganographic QR - NEW */}
          <div className="mt-8">
            <SteganographicQR 
              qrPayload={buildQRPayload()} 
              qrGenerated={qrGenerated && (!securityResult || securityResult.final_score >= 65)}
            />
          </div>
        </div>
      </div>
    </div>
    </FreeTrialGuard>
  );
}