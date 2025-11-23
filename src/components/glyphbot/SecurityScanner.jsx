import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { securityLLM } from "@/components/utils/llmClient";
import { Shield, Search, Loader2, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

export default function SecurityScanner() {
  const [scanType, setScanType] = useState("url");
  const [target, setTarget] = useState("");
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState(null);

  const runScan = async () => {
    if (!target.trim()) return;

    setScanning(true);
    setResults(null);

    try {
      let prompt = "";
      
      if (scanType === "url") {
        prompt = `Perform a comprehensive security scan on this URL: ${target}

Analyze for:
1. SSL/TLS configuration
2. Known vulnerabilities
3. Security headers
4. Potential phishing indicators
5. Malware/suspicious content
6. OWASP Top 10 risks
7. Privacy concerns

Provide a detailed security report with risk levels.`;
      } else if (scanType === "ip") {
        prompt = `Perform a security analysis on this IP address: ${target}

Check for:
1. Reputation score
2. Known malicious activity
3. Blacklist status
4. Open ports (common)
5. Geographic location
6. Associated domains
7. Threat intelligence data

Provide a comprehensive security assessment.`;
      } else {
        prompt = `Analyze this text for security threats: ${target}

Check for:
1. Prompt injection attempts
2. XSS payloads
3. SQL injection patterns
4. Command injection
5. Path traversal attempts
6. Sensitive data exposure
7. Social engineering indicators

Provide a detailed threat analysis.`;
      }

      const response = await securityLLM(prompt, {
        useInternet: scanType === "url" || scanType === "ip"
      });

      setResults({
        scanType,
        target,
        analysis: response,
        timestamp: new Date().toISOString()
      });

      // Log scan
      await base44.entities.SystemAuditLog.create({
        event_type: "GLYPHBOT_SECURITY_SCAN",
        description: `Security scan completed (${scanType})`,
        actor_email: (await base44.auth.me().catch(() => ({})))?.email || "unknown",
        resource_id: "glyphbot",
        metadata: { scanType, target },
        status: "success"
      }).catch(console.error);

    } catch (error) {
      console.error("Security scan error:", error);
      setResults({
        error: "Failed to complete security scan. Please try again.",
        timestamp: new Date().toISOString()
      });
    } finally {
      setScanning(false);
    }
  };

  const getRiskBadge = (analysis) => {
    const lower = analysis.toLowerCase();
    if (lower.includes("critical") || lower.includes("high risk")) {
      return <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-semibold">HIGH RISK</span>;
    } else if (lower.includes("medium")) {
      return <span className="px-3 py-1 bg-yellow-500 text-black rounded-full text-xs font-semibold">MEDIUM RISK</span>;
    } else if (lower.includes("low")) {
      return <span className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-semibold">LOW RISK</span>;
    }
    return <span className="px-3 py-1 bg-gray-500 text-white rounded-full text-xs font-semibold">ANALYZED</span>;
  };

  return (
    <div className="h-full flex flex-col p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Security Scanner</h2>
        <p className="text-gray-400">Scan URLs, IPs, and text for security threats</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        <div className="bg-blue-500/10 border border-blue-500 rounded-lg p-4 flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-400">
            <p className="font-semibold mb-1">Advanced Security Analysis</p>
            <p>Comprehensive threat detection powered by real-time intelligence and AI analysis.</p>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-300">
            Scan Type
          </label>
          <div className="grid grid-cols-3 gap-2">
            {["url", "ip", "text"].map(type => (
              <button
                key={type}
                onClick={() => setScanType(type)}
                className={`px-4 py-2 rounded-lg border font-medium transition-all ${
                  scanType === type
                    ? "border-cyan-400 bg-cyan-400/10 text-cyan-400"
                    : "border-gray-700 bg-gray-900 text-gray-400 hover:border-gray-600"
                }`}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-300">
            {scanType === "url" && "URL to Scan"}
            {scanType === "ip" && "IP Address"}
            {scanType === "text" && "Text to Analyze"}
          </label>
          {scanType === "text" ? (
            <textarea
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="Paste text to analyze for security threats..."
              rows={6}
              className="w-full p-4 bg-gray-900 border border-gray-700 rounded-lg text-white resize-none focus:outline-none focus:border-cyan-400"
            />
          ) : (
            <input
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder={scanType === "url" ? "https://example.com" : "192.168.1.1"}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
            />
          )}
        </div>

        <button
          onClick={runScan}
          disabled={scanning || !target.trim()}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold disabled:opacity-50 hover:from-purple-500 hover:to-pink-500 transition-all"
        >
          {scanning ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              Run Security Scan
            </>
          )}
        </button>

        {results && (
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white">Scan Results</h3>
              </div>
              {results.analysis && getRiskBadge(results.analysis)}
            </div>

            {results.error ? (
              <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg">
                <p className="text-red-500">{results.error}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Target</p>
                  <p className="text-white font-mono break-all">{results.target}</p>
                </div>

                <div className="p-4 bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Scan Type</p>
                  <p className="text-white uppercase">{results.scanType}</p>
                </div>

                <div className="p-4 bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-400 mb-3">Analysis</p>
                  <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                    {results.analysis}
                  </pre>
                </div>

                <div className="p-3 bg-gray-800 rounded-lg">
                  <p className="text-xs text-gray-500">
                    Scanned at: {new Date(results.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}