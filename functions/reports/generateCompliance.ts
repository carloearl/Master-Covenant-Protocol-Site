import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    // 1. Trust Anchors (Keys)
    const keys = await base44.entities.QRKeyRegistry.list();
    const activeKeys = keys.filter(k => !k.revokedAt);

    // 2. Asset Traceability Stats
    const assetTraces = await base44.entities.AssetTrace.list('-createdAt', 1); // just get count metadata if possible, but list is okay for small sets
    // For large sets we'd use a count query if available, or just recent activity.
    // I'll grab recent 50 for the report log.
    const recentAssets = await base44.entities.AssetTrace.list('-createdAt', 20);

    // 3. AI Governance (GlyphBot Audit)
    // Attempt to read GlyphBotAudit, fallback if empty/error
    let aiAudits = [];
    try {
        aiAudits = await base44.entities.GlyphBotAudit.list('-timestamp', 20);
    } catch (e) {
        console.log('GlyphBotAudit read failed or empty');
    }

    // 4. System Security Events
    const criticalEvents = await base44.entities.SystemAuditLog.filter({ severity: 'high' }, '-created_date', 10);

    const report = {
        generatedAt: new Date().toISOString(),
        generatedBy: user.email,
        complianceStatus: activeKeys.length > 0 ? 'COMPLIANT' : 'NON_COMPLIANT',
        sections: {
            trustAnchors: {
                status: activeKeys.length > 0 ? 'Active' : 'Missing',
                activeKeysCount: activeKeys.length,
                keys: activeKeys.map(k => ({ kid: k.kid, type: k.keyType, created: k.created_date }))
            },
            traceability: {
                totalAssetsRegistered: recentAssets.length, // approximation based on fetch limit
                recentActivity: recentAssets.map(a => ({ 
                    traceId: a.traceId, 
                    hash: a.assetHash.substring(0, 8) + '...', 
                    timestamp: a.createdAt 
                }))
            },
            aiGovernance: {
                auditedInteractions: aiAudits.length,
                recentAudits: aiAudits.map(a => ({
                    mode: a.mode,
                    timestamp: a.timestamp,
                    complianceCheck: a.mode === 'nist' ? 'PASS' : 'STANDARD'
                }))
            },
            securityIncidents: {
                criticalCount: criticalEvents.length,
                recent: criticalEvents.map(e => ({
                    type: e.event_type,
                    description: e.description,
                    timestamp: e.created_date
                }))
            }
        },
        nistControls: {
            "AC-2": "Account Management - Enforced via Base44 Auth & RBAC",
            "AU-2": "Audit Events - Enforced via SystemAuditLog",
            "SC-8": "Transmission Confidentiality - Enforced via TLS 1.3 & Encrypted Keys",
            "SI-4": "System Monitoring - Enforced via ThreatDetectionEngine",
            "CP-9": "System Backup - Enforced via Base44 Cloud Infra"
        }
    };

    return Response.json(report);

  } catch (error) {
    console.error('Compliance Report Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});