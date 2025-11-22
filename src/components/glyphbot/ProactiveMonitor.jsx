import React, { useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";

/**
 * Background service that runs proactive security monitoring
 * Periodically scans knowledge sources and detects anomalies
 */
export default function ProactiveMonitor() {
  const intervalRef = useRef(null);
  const isScanning = useRef(false);

  useEffect(() => {
    // Check if monitoring is enabled
    const monitoringEnabled = localStorage.getItem("glyphbot_proactive_monitoring");
    if (monitoringEnabled === "false") return;

    // Initial scan after 10 seconds
    const initialTimer = setTimeout(() => {
      performProactiveScan();
    }, 10000);

    // Periodic scans every 30 minutes
    intervalRef.current = setInterval(() => {
      performProactiveScan();
    }, 30 * 60 * 1000);

    return () => {
      clearTimeout(initialTimer);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const performProactiveScan = async () => {
    if (isScanning.current) return;
    isScanning.current = true;

    try {
      const sources = JSON.parse(localStorage.getItem("glyphbot_knowledge_sources") || "[]");
      const urlSources = sources.filter(s => s.type === "url");

      if (urlSources.length === 0) {
        isScanning.current = false;
        return;
      }

      // Scan each URL source
      for (const source of urlSources) {
        await scanSourceForChanges(source);
        
        // Rate limit: wait 2 seconds between scans
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      // Analyze recent audit logs for anomalies
      await analyzeAuditLogs();

      console.log("[ProactiveMonitor] Scan completed", new Date().toISOString());
    } catch (error) {
      console.error("[ProactiveMonitor] Scan failed:", error);
    } finally {
      isScanning.current = false;
    }
  };

  const scanSourceForChanges = async (source) => {
    try {
      const prompt = `Quick security check for: ${source.value}

Check for:
1. New vulnerabilities reported
2. SSL certificate status
3. Suspicious content changes
4. Malware/phishing indicators

Return brief status: SAFE, WARNING, or ALERT with explanation.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        add_context_from_internet: true
      });

      // Update source scan timestamp
      const sources = JSON.parse(localStorage.getItem("glyphbot_knowledge_sources") || "[]");
      const updated = sources.map(s => 
        s.id === source.id 
          ? { ...s, lastAutoScan: new Date().toISOString(), autoScanResult: response }
          : s
      );
      localStorage.setItem("glyphbot_knowledge_sources", JSON.stringify(updated));

      // Log if warning or alert
      if (response.includes("WARNING") || response.includes("ALERT")) {
        const user = await base44.auth.me().catch(() => ({ email: "system" }));
        await base44.entities.SystemAuditLog.create({
          event_type: "GLYPHBOT_PROACTIVE_ALERT",
          description: `Proactive scan detected issue: ${source.value}`,
          actor_email: user.email || "system",
          resource_id: "glyphbot",
          metadata: { sourceId: source.id, scanResult: response },
          status: response.includes("ALERT") ? "failure" : "success"
        }).catch(console.error);
      }
    } catch (error) {
      console.error(`[ProactiveMonitor] Failed to scan ${source.value}:`, error);
    }
  };

  const analyzeAuditLogs = async () => {
    try {
      // Get logs from last hour
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const logs = await base44.entities.SystemAuditLog.filter(
        { 
          event_type: { $regex: "GLYPHBOT" },
          created_date: { $gte: oneHourAgo }
        },
        "-created_date",
        50
      );

      if (logs.length < 3) return; // Not enough data

      // Group by actor
      const actorActivity = logs.reduce((acc, log) => {
        const actor = log.actor_email || "unknown";
        if (!acc[actor]) acc[actor] = [];
        acc[actor].push(log);
        return acc;
      }, {});

      // Detect suspicious patterns
      for (const [actor, actorLogs] of Object.entries(actorActivity)) {
        // Check for rapid successive operations (> 20 in an hour)
        if (actorLogs.length > 20) {
          await base44.entities.SystemAuditLog.create({
            event_type: "GLYPHBOT_ANOMALY_DETECTED",
            description: `Unusual activity pattern: ${actorLogs.length} operations in 1 hour`,
            actor_email: "system",
            resource_id: "glyphbot",
            metadata: { 
              suspiciousActor: actor, 
              operationCount: actorLogs.length,
              pattern: "rapid_operations"
            },
            status: "success"
          }).catch(console.error);
        }

        // Check for multiple failures
        const failures = actorLogs.filter(l => l.status === "failure");
        if (failures.length >= 5) {
          await base44.entities.SystemAuditLog.create({
            event_type: "GLYPHBOT_ANOMALY_DETECTED",
            description: `Multiple failed operations: ${failures.length} failures`,
            actor_email: "system",
            resource_id: "glyphbot",
            metadata: { 
              actor, 
              failureCount: failures.length,
              pattern: "multiple_failures"
            },
            status: "success"
          }).catch(console.error);
        }
      }
    } catch (error) {
      console.error("[ProactiveMonitor] Anomaly detection failed:", error);
    }
  };

  // This component renders nothing, it's a background service
  return null;
}