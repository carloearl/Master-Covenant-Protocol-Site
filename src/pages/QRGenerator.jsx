import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Loader2, Shield, AlertTriangle, Info } from "lucide-react";
import SecurityStatus from "../components/qr/SecurityStatus";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function QRGenerator() {
  const [url, setUrl] = useState("");
  const [size, setSize] = useState(256);
  const [qrGenerated, setQrGenerated] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [securityResult, setSecurityResult] = useState(null);
  const [codeId, setCodeId] = useState(null);
  const [scanningStage, setScanningStage] = useState("");

  // Step 1: Normalize & Static Checks
  const performStaticChecks = (payload) => {
    let score = 100;
    const issues = [];

    // URL validation
    try {
      const urlObj = new URL(payload);
      
      // HTTPS only
      if (urlObj.protocol !== 'https:') {
        score -= 30;
        issues.push("Non-HTTPS protocol detected");
      }

      // Check for suspicious TLDs
      const suspiciousTlds = ['.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top'];
      if (suspiciousTlds.some(tld => urlObj.hostname.endsWith(tld))) {
        score -= 20;
        issues.push("Suspicious TLD");
      }

      // Check for IP addresses
      if (/^\d+\.\d+\.\d+\.\d+$/.test(urlObj.hostname)) {
        score -= 25;
        issues.push("Naked IP address");
      }

      // URL shorteners
      const shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly'];
      if (shorteners.some(s => urlObj.hostname.includes(s))) {
        score -= 15;
        issues.push("URL shortener detected");
      }

      // Excessive length
      if (payload.length > 500) {
        score -= 10;
        issues.push("Excessive URL length");
      }

      // Multiple redirects indicators
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

  // Step 2: NLP & Phishing Detection
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

  // Step 3: Aggregate scores and make policy decision
  const generateQR = async () => {
    if (!url) return;
    
    setIsScanning(true);
    setSecurityResult(null);
    setQrGenerated(false);

    try {
      // Stage 1: Static checks
      setScanningStage("Performing static checks...");
      await new Promise(resolve => setTimeout(resolve, 500));
      const staticResult = performStaticChecks(url);
      
      // Stage 2: NLP Analysis
      const nlpResult = await performNLPAnalysis(url);
      
      // Stage 3: Aggregate final score
      setScanningStage("Calculating risk score...");
      const finalScore = Math.round(
        (nlpResult.domain_trust * 0.4) +
        (nlpResult.sentiment_score * 0.25) +
        (nlpResult.entity_legitimacy * 0.2) +
        (nlpResult.url_features * 0.15)
      );

      // Combine static issues with NLP indicators
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

      // Generate unique code ID
      const newCodeId = `qr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setCodeId(newCodeId);
      const payloadHash = await generateSHA256(url);

      // Stage 4: Policy Gate Decision
      if (combinedResult.final_score >= 65) {
        // APPROVED or WARNING
        setScanningStage("Generating secure QR code...");
        setQrGenerated(true);

        await base44.entities.QRGenHistory.create({
          code_id: newCodeId,
          payload: url,
          payload_sha256: payloadHash,
          size: size,
          creator_id: "guest",
          status: combinedResult.final_score >= 80 ? "safe" : "suspicious",
          type: "url",
          image_format: "png"
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
        // BLOCKED - Policy gate < 65
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

  const downloadQR = () => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}`;
    const link = document.createElement('a');
    link.href = qrUrl;
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
        <div className="max-w-4xl mx-auto">
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

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Generate Secure QR Code</CardTitle>
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
                    min={128}
                    max={512}
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
                      Generate & Verify QR Code
                    </>
                  )}
                </Button>

                {isScanning && (
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <div className="text-sm text-blue-400 mb-2 font-semibold">AI Security Pipeline Active</div>
                    <div className="text-xs text-white space-y-1">
                      <div>✓ Stage 1: Static checks & normalization</div>
                      <div>✓ Stage 2: NLP sentiment analysis</div>
                      <div>✓ Stage 3: Entity & domain verification</div>
                      <div>✓ Stage 4: Rank aggregation & scoring</div>
                      <div>✓ Stage 5: Policy gate decision</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
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
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}`}
                        alt="QR Code"
                        className="max-w-full"
                      />
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
                  <div className="h-64 flex items-center justify-center border-2 border-dashed border-red-700 rounded-lg bg-red-500/5">
                    <div className="text-center p-6">
                      <div className="text-5xl mb-4">🚫</div>
                      <p className="text-red-400 font-semibold mb-2">Policy Gate Blocked</p>
                      <p className="text-sm text-white mb-2">Score: {securityResult.final_score}/100 (minimum: 65)</p>
                      <p className="text-xs text-gray-400">This URL was flagged as high-risk and cannot be encoded.</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-700 rounded-lg">
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

          {/* Security Status Display */}
          {securityResult && (
            <div className="mt-8">
              <SecurityStatus securityResult={securityResult} />
            </div>
          )}

          <div className="mt-12 grid md:grid-cols-3 gap-6">
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
                <p className="text-sm text-white">Quishing, QRLjacking & phishing instantly blocked</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-800 text-center">
              <CardContent className="pt-6">
                <div className="text-4xl mb-3">📊</div>
                <h3 className="font-bold mb-2 text-white">Complete Audit Trail</h3>
                <p className="text-sm text-white">Every scan logged with SHA-256 hash</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}