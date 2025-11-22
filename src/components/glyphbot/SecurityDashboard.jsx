import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Shield, Activity, AlertTriangle, CheckCircle, TrendingUp, Clock, FileText, ExternalLink, RefreshCw } from "lucide-react";

export default function SecurityDashboard() {
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [dashboard, setDashboard] = useState({
    overallStatus: "healthy",
    knowledgeBaseSources: [],
    recentAnomalies: [],
    recentAudits: [],
    securityScore: 95,
    lastScanTime: null,
    stats: {
      totalScans: 0,
      vulnerabilitiesFound: 0,
      anomaliesDetected: 0,
      auditsCompleted: 0
    }
  });

  useEffect(() => {
    loadDashboard();
    const interval = setInterval(loadDashboard, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const loadDashboard = async () => {
    try {
      // Load knowledge sources
      const sources = JSON.parse(localStorage.getItem("glyphbot_knowledge_sources") || "[]");
      
      // Load recent audit logs
      const logs = await base44.entities.SystemAuditLog.filter(
        { event_type: { $regex: "GLYPHBOT" } },
        "-created_date",
        20
      );

      // Detect anomalies using AI
      const anomalies = await detectAnomalies(logs);

      // Calculate security score
      const score = calculateSecurityScore(sources, anomalies, logs);

      setDashboard({
        overallStatus: score >= 80 ? "healthy" : score >= 60 ? "warning" : "critical",
        knowledgeBaseSources: sources,
        recentAnomalies: anomalies,
        recentAudits: logs.filter(l => l.event_type === "GLYPHBOT_AUDIT_GENERATED"),
        securityScore: score,
        lastScanTime: new Date().toISOString(),
        stats: {
          totalScans: logs.filter(l => l.event_type === "GLYPHBOT_SECURITY_SCAN").length,
          vulnerabilitiesFound: logs.filter(l => l.metadata?.riskLevel === "high").length,
          anomaliesDetected: anomalies.length,
          auditsCompleted: logs.filter(l => l.event_type === "GLYPHBOT_AUDIT_GENERATED").length
        }
      });
    } catch (error) {
      console.error("Failed to load dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const detectAnomalies = async (logs) => {
    if (logs.length < 5) return [];

    try {
      const logSummary = logs.map(l => ({
        type: l.event_type,
        time: l.created_date,
        actor: l.actor_email,
        status: l.status
      }));

      const prompt = `Analyze these audit logs for security anomalies and suspicious patterns:

${JSON.stringify(logSummary, null, 2)}

Identify:
1. Unusual access patterns
2. Failed operations clusters
3. Suspicious timing (off-hours activity)
4. Rapid successive operations
5. Privilege escalation attempts

Return JSON array of anomalies:
[{"type": "string", "severity": "low|medium|high", "description": "string", "timestamp": "ISO date"}]`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        add_context_from_internet: false,
        response_json_schema: {
          type: "object",
          properties: {
            anomalies: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: { type: "string" },
                  severity: { type: "string" },
                  description: { type: "string" },
                  timestamp: { type: "string" }
                }
              }
            }
          }
        }
      });

      return response.anomalies || [];
    } catch (error) {
      console.error("Anomaly detection failed:", error);
      return [];
    }
  };

  const calculateSecurityScore = (sources, anomalies, logs) => {
    let score = 100;

    // Deduct for anomalies
    score -= anomalies.filter(a => a.severity === "high").length * 15;
    score -= anomalies.filter(a => a.severity === "medium").length * 8;
    score -= anomalies.filter(a => a.severity === "low").length * 3;

    // Deduct for failed operations
    const failedOps = logs.filter(l => l.status === "failure").length;
    score -= failedOps * 2;

    // Deduct for stale knowledge sources (not scanned recently)
    const staleSourcePenalty = sources.filter(s => {
      if (!s.lastScanned) return true;
      const daysSince = (Date.now() - new Date(s.lastScanned).getTime()) / (1000 * 60 * 60 * 24);
      return daysSince > 7;
    }).length * 5;
    score -= staleSourcePenalty;

    return Math.max(0, Math.min(100, score));
  };

  const scanAllSources = async () => {
    setScanning(true);

    try {
      const sources = dashboard.knowledgeBaseSources.filter(s => s.type === "url");
      
      for (const source of sources) {
        await scanKnowledgeSource(source);
      }

      await loadDashboard();
      
      const user = await base44.auth.me().catch(() => ({ email: "unknown" }));
      await base44.entities.SystemAuditLog.create({
        event_type: "GLYPHBOT_KB_SCAN_ALL",
        description: "Full knowledge base security scan completed",
        actor_email: user.email,
        resource_id: "glyphbot",
        metadata: { sourcesScanned: sources.length },
        status: "success"
      });
    } catch (error) {
      console.error("Scan failed:", error);
    } finally {
      setScanning(false);
    }
  };

  const scanKnowledgeSource = async (source) => {
    try {
      const prompt = `Perform a comprehensive security scan on this URL: ${source.value}

Analyze:
1. SSL/TLS configuration changes
2. New vulnerabilities discovered
3. Content changes (potential compromise)
4. Certificate validity
5. Security header changes
6. New external links/dependencies
7. Malware/phishing indicators

Return detailed findings with risk assessment.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        add_context_from_internet: true
      });

      // Update source with scan results
      const sources = JSON.parse(localStorage.getItem("glyphbot_knowledge_sources") || "[]");
      const updated = sources.map(s => 
        s.id === source.id 
          ? { ...s, lastScanned: new Date().toISOString(), scanResult: response }
          : s
      );
      localStorage.setItem("glyphbot_knowledge_sources", JSON.stringify(updated));

      return response;
    } catch (error) {
      console.error(`Scan failed for ${source.value}:`, error);
      return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "healthy": return "text-green-400 bg-green-500/10 border-green-500";
      case "warning": return "text-yellow-400 bg-yellow-500/10 border-yellow-500";
      case "critical": return "text-red-400 bg-red-500/10 border-red-500";
      default: return "text-gray-400 bg-gray-500/10 border-gray-500";
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high": return "bg-red-500 text-white";
      case "medium": return "bg-yellow-500 text-black";
      case "low": return "bg-blue-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 mx-auto mb-3 text-cyan-400 animate-pulse" />
          <p className="text-gray-400">Loading security dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Security Operations Center</h2>
          <p className="text-gray-400">Real-time security monitoring and threat intelligence</p>
        </div>
        
        <button
          onClick={scanAllSources}
          disabled={scanning}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${scanning ? "animate-spin" : ""}`} />
          {scanning ? "Scanning..." : "Scan All"}
        </button>
      </div>

      {/* Overall Status */}
      <div className={`p-6 rounded-xl border ${getStatusColor(dashboard.overallStatus)}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8" />
            <div>
              <h3 className="text-xl font-bold capitalize">{dashboard.overallStatus} Status</h3>
              <p className="text-sm opacity-75">Security Score: {dashboard.securityScore}/100</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-3xl font-bold">{dashboard.securityScore}</div>
            <div className="text-xs opacity-75">Security Rating</div>
          </div>
        </div>

        {dashboard.lastScanTime && (
          <div className="flex items-center gap-2 text-xs opacity-75">
            <Clock className="w-3 h-3" />
            Last updated: {new Date(dashboard.lastScanTime).toLocaleString()}
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-5 h-5 text-blue-400" />
            <h4 className="text-sm font-medium text-gray-400">Total Scans</h4>
          </div>
          <div className="text-2xl font-bold text-white">{dashboard.stats.totalScans}</div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <h4 className="text-sm font-medium text-gray-400">Vulnerabilities</h4>
          </div>
          <div className="text-2xl font-bold text-white">{dashboard.stats.vulnerabilitiesFound}</div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-yellow-400" />
            <h4 className="text-sm font-medium text-gray-400">Anomalies</h4>
          </div>
          <div className="text-2xl font-bold text-white">{dashboard.stats.anomaliesDetected}</div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-5 h-5 text-green-400" />
            <h4 className="text-sm font-medium text-gray-400">Audits</h4>
          </div>
          <div className="text-2xl font-bold text-white">{dashboard.stats.auditsCompleted}</div>
        </div>
      </div>

      {/* Anomalies */}
      {dashboard.recentAnomalies.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-bold text-white">Detected Anomalies</h3>
          </div>

          <div className="space-y-3">
            {dashboard.recentAnomalies.map((anomaly, idx) => (
              <div key={idx} className="bg-gray-800 rounded-lg p-4 border-l-4 border-yellow-500">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${getSeverityColor(anomaly.severity)}`}>
                        {anomaly.severity}
                      </span>
                      <span className="text-sm text-gray-400">{anomaly.type}</span>
                    </div>
                    <p className="text-sm text-gray-300">{anomaly.description}</p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {new Date(anomaly.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Knowledge Base Sources Status */}
      {dashboard.knowledgeBaseSources.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <ExternalLink className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white">Knowledge Base Security</h3>
          </div>

          <div className="space-y-3">
            {dashboard.knowledgeBaseSources.map((source) => {
              const daysSinceScan = source.lastScanned 
                ? Math.floor((Date.now() - new Date(source.lastScanned).getTime()) / (1000 * 60 * 60 * 24))
                : null;
              
              const needsScan = !source.lastScanned || daysSinceScan > 7;

              return (
                <div key={source.id} className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-1 bg-cyan-600/20 text-cyan-400 rounded uppercase font-semibold">
                        {source.type}
                      </span>
                      {needsScan && (
                        <span className="text-xs px-2 py-1 bg-yellow-600/20 text-yellow-400 rounded">
                          Needs Scan
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-white truncate">{source.value}</p>
                    {source.lastScanned && (
                      <p className="text-xs text-gray-500 mt-1">
                        Last scanned: {daysSinceScan} day{daysSinceScan !== 1 ? "s" : ""} ago
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => scanKnowledgeSource(source)}
                    className="ml-3 px-3 py-1.5 text-xs rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 transition-colors"
                  >
                    Scan Now
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Audits */}
      {dashboard.recentAudits.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-bold text-white">Recent Audits</h3>
          </div>

          <div className="space-y-2">
            {dashboard.recentAudits.slice(0, 5).map((audit) => (
              <div key={audit.id} className="bg-gray-800 rounded-lg p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm text-white font-medium">{audit.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {audit.actor_email} • {new Date(audit.created_date).toLocaleString()}
                  </p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {dashboard.knowledgeBaseSources.length === 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <h3 className="text-lg font-semibold text-white mb-2">No Knowledge Sources Connected</h3>
          <p className="text-gray-400 mb-4">Connect knowledge sources in the Chat tab to enable security monitoring.</p>
        </div>
      )}
    </div>
  );
}