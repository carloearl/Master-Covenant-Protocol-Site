import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Loader2, Shield } from "lucide-react";
import SecurityStatus from "../components/qr/SecurityStatus";

export default function QRGenerator() {
  const [url, setUrl] = useState("");
  const [size, setSize] = useState(256);
  const [qrGenerated, setQrGenerated] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [securityResult, setSecurityResult] = useState(null);
  const [codeId, setCodeId] = useState(null);

  const performSecurityScan = async (payload) => {
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an advanced AI security agent specialized in detecting QR code threats including Quishing, QRLjacking, and malicious URL injection attacks.

Analyze the following QR code payload for security threats:
URL/Data: "${payload}"

Perform comprehensive security analysis:

1. DOMAIN TRUST ANALYSIS (0-100):
   - Check for suspicious TLDs
   - Detect URL shorteners that may hide malicious redirects
   - Identify typosquatting patterns
   - Analyze domain age indicators
   - Check for excessive URL length or unusual characters

2. NLP SENTIMENT & PHISHING ANALYSIS (0-100):
   - Extract entities and detect social engineering tactics
   - Identify urgency-inducing phrases (e.g., "urgent", "verify now", "account suspended")
   - Detect impersonation attempts of legitimate brands
   - Analyze suspicious keywords related to credential harvesting
   - Check for homograph attacks (unicode lookalikes)

3. ENTITY LEGITIMACY (0-100):
   - Verify if the domain matches claimed brand identity
   - Check for legitimate organization patterns
   - Detect credential phishing indicators
   - Analyze path structure for suspicious patterns

4. THREAT CLASSIFICATION:
   - Quishing: QR-based phishing attacks
   - QRLjacking: Session hijacking via QR
   - Malicious URL: Direct malware/exploit links
   - Phishing: Credential theft attempts
   - Other: Unknown suspicious patterns

Calculate final security score using:
final_score = (domain_trust * 0.4) + (sentiment_score * 0.3) + (entity_legitimacy * 0.3)

Provide detailed JSON response with all findings.`,
        response_json_schema: {
          type: "object",
          properties: {
            domain_trust: { type: "number" },
            sentiment_score: { type: "number" },
            entity_legitimacy: { type: "number" },
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
      console.error("Security scan failed:", error);
      return {
        domain_trust: 50,
        sentiment_score: 50,
        entity_legitimacy: 50,
        final_score: 50,
        risk_level: "medium",
        threat_types: ["Scan Error"],
        phishing_indicators: ["Unable to complete full analysis"],
        analysis_details: "Security scan encountered an error",
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
      // Step 1: Perform AI Security Scan
      const scanResult = await performSecurityScan(url);
      setSecurityResult(scanResult);

      // Step 2: Generate unique code ID
      const newCodeId = `qr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setCodeId(newCodeId);

      // Step 3: Determine if QR should be allowed
      if (scanResult.final_score >= 65) {
        // Safe or suspicious but allowed
        setQrGenerated(true);

        // Store in QRGenHistory
        await base44.entities.QRGenHistory.create({
          code_id: newCodeId,
          payload: url,
          size: size,
          creator_id: "guest",
          status: scanResult.final_score >= 80 ? "safe" : "suspicious"
        });

        // Store AI scores
        await base44.entities.QRAIScore.create({
          code_id: newCodeId,
          final_score: scanResult.final_score,
          domain_trust: scanResult.domain_trust,
          sentiment_score: scanResult.sentiment_score,
          entity_legitimacy: scanResult.entity_legitimacy,
          risk_level: scanResult.risk_level,
          ml_version: scanResult.ml_version || "1.0.0",
          phishing_indicators: scanResult.phishing_indicators || [],
          threat_types: scanResult.threat_types || []
        });
      } else {
        // Blocked - high risk
        setQrGenerated(false);

        // Log as threat
        await base44.entities.QRThreatLog.create({
          incident_id: `threat_${Date.now()}`,
          code_id: newCodeId,
          attack_type: scanResult.threat_types?.[0] || "Other",
          payload: url,
          threat_description: scanResult.analysis_details || "High-risk QR code blocked by AI scanner",
          resolved: false,
          severity: scanResult.risk_level === "critical" ? "critical" : "high"
        });

        // Still store in history as blocked
        await base44.entities.QRGenHistory.create({
          code_id: newCodeId,
          payload: url,
          size: size,
          creator_id: "guest",
          status: "blocked"
        });
      }
    } catch (error) {
      console.error("QR generation error:", error);
    } finally {
      setIsScanning(false);
    }
  };

  const downloadQR = () => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}`;
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `secure-qr-${codeId}.png`;
    link.click();
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
              QR Code <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Generator</span>
            </h1>
            <p className="text-xl text-white mb-2">
              Create secure, AI-verified QR codes with anti-phishing protection
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-blue-400">
              <Shield className="w-4 h-4" />
              <span>Protected against Quishing, QRLjacking & malicious URLs</span>
            </div>
          </div>

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
                      Scanning for threats...
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
                    <div className="text-sm text-blue-400 mb-2 font-semibold">AI Security Scan in Progress...</div>
                    <div className="text-xs text-white space-y-1">
                      <div>✓ Analyzing domain trust</div>
                      <div>✓ Running NLP sentiment analysis</div>
                      <div>✓ Detecting phishing patterns</div>
                      <div>✓ Checking for Quishing indicators</div>
                      <div>✓ Validating entity legitimacy</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Preview</CardTitle>
              </CardHeader>
              <CardContent>
                {qrGenerated && url && securityResult && securityResult.final_score >= 65 ? (
                  <div className="space-y-4">
                    <div className="bg-white p-8 rounded-lg flex items-center justify-center">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}`}
                        alt="QR Code"
                        className="max-w-full"
                      />
                    </div>
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
                      <p className="text-red-400 font-semibold mb-2">QR Code Blocked</p>
                      <p className="text-sm text-white">This URL was flagged as high-risk and cannot be encoded.</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-700 rounded-lg">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 opacity-50">
                        <svg viewBox="0 0 100 100" className="text-gray-600">
                          <rect x="0" y="0" width="20" height="20" fill="currentColor"/>
                          <rect x="30" y="0" width="10" height="10" fill="currentColor"/>
                          <rect x="50" y="0" width="10" height="10" fill="currentColor"/>
                          <rect x="0" y="30" width="10" height="10" fill="currentColor"/>
                          <rect x="20" y="30" width="20" height="20" fill="currentColor"/>
                        </svg>
                      </div>
                      <p className="text-gray-500">Your secure QR code will appear here</p>
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
                <h3 className="font-bold mb-2 text-white">AI-Powered Security</h3>
                <p className="text-sm text-white">Advanced NLP engine scans every QR for threats</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-800 text-center">
              <CardContent className="pt-6">
                <div className="text-4xl mb-3">🎯</div>
                <h3 className="font-bold mb-2 text-white">Real-time Detection</h3>
                <p className="text-sm text-white">Blocks Quishing, QRLjacking & phishing instantly</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-800 text-center">
              <CardContent className="pt-6">
                <div className="text-4xl mb-3">📊</div>
                <h3 className="font-bold mb-2 text-white">Detailed Scoring</h3>
                <p className="text-sm text-white">Comprehensive security analysis with audit trail</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}