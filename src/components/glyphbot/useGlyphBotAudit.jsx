import { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';

/**
 * Phase 6: Audit persistence hook
 * Manages GlyphBotAudit entities for security audit sessions
 */
export function useGlyphBotAudit(currentUser) {
  const [audits, setAudits] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load user's audits (non-archived only)
  const loadAudits = useCallback(async () => {
    if (!currentUser?.email) return;

    setIsLoading(true);
    try {
      const results = await base44.entities.GlyphBotAudit.filter(
        { userId: currentUser.email, isArchived: false },
        '-created_date',
        100
      );

      const normalized = (results || []).map(a => ({
        ...a,
        id: a.id || a._id || a.entity_id
      }));

      setAudits(normalized);
    } catch (e) {
      console.error('[GlyphBot Phase6] Failed to load audits:', e);
      setAudits([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser?.email]);

  useEffect(() => {
    if (currentUser?.email) loadAudits();
  }, [currentUser?.email, loadAudits]);

  // Create new audit
  const createAudit = useCallback(async (auditData) => {
    if (!currentUser?.email) return null;

    try {
      const data = {
        userId: currentUser.email,
        targetType: auditData.targetType || 'business',
        targetIdentifier: auditData.targetIdentifier,
        auditMode: auditData.auditMode || 'SURFACE',
        rawInput: auditData.rawInput || auditData.targetIdentifier,
        notes: auditData.notes || '',
        status: 'PENDING',
        findings: '{}',
        summary: '',
        riskScore: 0,
        overallGrade: '',
        isArchived: false
      };

      const audit = await base44.entities.GlyphBotAudit.create(data);
      const auditId = audit.id || audit._id || audit.entity_id;
      
      await loadAudits();
      console.log('[GlyphBot Phase6] Audit created:', auditId);
      return { ...audit, id: auditId };
    } catch (e) {
      console.error('[GlyphBot Phase6] Failed to create audit:', e);
      return null;
    }
  }, [currentUser?.email, loadAudits]);

  // Update audit
  const updateAudit = useCallback(async (auditId, updates) => {
    if (!auditId) return false;

    try {
      await base44.entities.GlyphBotAudit.update(auditId, updates);
      await loadAudits();
      console.log('[GlyphBot Phase6] Audit updated:', auditId);
      return true;
    } catch (e) {
      console.error('[GlyphBot Phase6] Failed to update audit:', e);
      return false;
    }
  }, [loadAudits]);

  // Get single audit
  const getAudit = useCallback(async (auditId) => {
    if (!auditId || !currentUser?.email) return null;

    try {
      const results = await base44.entities.GlyphBotAudit.filter(
        { userId: currentUser.email },
        '-created_date',
        100
      );

      const audit = results.find(a => {
        const aid = a.id || a._id || a.entity_id;
        return aid === auditId;
      });

      if (!audit) return null;

      return {
        ...audit,
        id: audit.id || audit._id || audit.entity_id
      };
    } catch (e) {
      console.error('[GlyphBot Phase6] Failed to get audit:', e);
      return null;
    }
  }, [currentUser?.email]);

  // Delete audit
  const deleteAudit = useCallback(async (auditId) => {
    if (!auditId) return false;

    try {
      await base44.entities.GlyphBotAudit.delete(auditId);
      await loadAudits();
      console.log('[GlyphBot Phase6] Audit deleted:', auditId);
      return true;
    } catch (e) {
      console.error('[GlyphBot Phase6] Failed to delete audit:', e);
      return false;
    }
  }, [loadAudits]);

  // Archive audit
  const archiveAudit = useCallback(async (auditId) => {
    if (!auditId) return false;

    try {
      await base44.entities.GlyphBotAudit.update(auditId, { isArchived: true });
      await loadAudits();
      console.log('[GlyphBot Phase6] Audit archived:', auditId);
      return true;
    } catch (e) {
      console.error('[GlyphBot Phase6] Failed to archive audit:', e);
      return false;
    }
  }, [loadAudits]);

  // Unarchive audit
  const unarchiveAudit = useCallback(async (auditId) => {
    if (!auditId) return false;

    try {
      await base44.entities.GlyphBotAudit.update(auditId, { isArchived: false });
      await loadAudits();
      console.log('[GlyphBot Phase6] Audit unarchived:', auditId);
      return true;
    } catch (e) {
      console.error('[GlyphBot Phase6] Failed to unarchive audit:', e);
      return false;
    }
  }, [loadAudits]);

  // Run audit (full LLM-based execution)
  const runAudit = useCallback(async (auditId, auditConfig, glyphbotClient, currentMessages) => {
    if (!auditId) return null;

    try {
      // Update status to IN_PROGRESS
      await updateAudit(auditId, { status: 'IN_PROGRESS' });

      // Get audit record
      const audit = await getAudit(auditId);
      if (!audit) return null;

      // Build comprehensive audit prompt based on channel
      let auditPrompt = '';
      
      if (audit.targetType === 'business') {
        auditPrompt = `Conduct a comprehensive ${audit.auditMode} BUSINESS security audit for: ${audit.targetIdentifier}

${audit.notes ? `Focus areas: ${audit.notes}` : ''}

Analyze:
- Website security (headers, TLS, auth, session management)
- Compliance (BBB, FTC, FCC, CFPB standards)
- Business reputation and public reviews
- Legal risk indicators
- Scam report cross-referencing
- Privacy policy and data handling

Provide findings in structured JSON format.`;
      } else if (audit.targetType === 'person') {
        auditPrompt = `Conduct a ${audit.auditMode} PEOPLE audit for: ${audit.targetIdentifier}

${audit.notes ? `Focus areas: ${audit.notes}` : ''}

Analyze (using publicly available information only):
- Public court record summaries
- Criminal record structural patterns
- Reputation risk scoring
- Public social signals
- Pattern recognition (violence, fraud, predatory behavior)

IMPORTANT: This is LLM-based analysis only. No private database queries.

Provide findings in structured JSON format.`;
      } else if (audit.targetType === 'agency') {
        auditPrompt = `Conduct a ${audit.auditMode} GOVERNMENT AGENCY audit for: ${audit.targetIdentifier}

${audit.notes ? `Focus areas: ${audit.notes}` : ''}

Analyze:
- Agency misconduct patterns
- Abuse-of-authority indicators
- Public lawsuits and settlements
- Historical grievances
- Civic accountability metrics
- FOIA request template generation

Provide findings in structured JSON format.`;
      }

      auditPrompt += `

Return ONLY valid JSON in this exact format:
{
  "target": "${audit.targetIdentifier}",
  "targetType": "${audit.targetType}",
  "auditMode": "${audit.auditMode}",
  "overallGrade": "A-F letter grade",
  "riskScore": 0-100,
  "summary": "Brief executive summary",
  "technicalFindings": [
    {
      "id": "F1",
      "title": "Finding title",
      "severity": "CRITICAL|HIGH|MEDIUM|LOW",
      "area": "Category",
      "description": "Detailed description",
      "businessImpact": "Real-world impact",
      "recommendation": "How to fix",
      "sampleFix": "Code/config example if applicable"
    }
  ],
  "businessRisks": [
    {
      "id": "R1",
      "title": "Risk title",
      "likelihood": "HIGH|MEDIUM|LOW",
      "impact": "HIGH|MEDIUM|LOW",
      "notes": "Additional context"
    }
  ],
  "fixPlan": [
    {
      "order": 1,
      "title": "Action item",
      "effort": "HIGH|MEDIUM|LOW",
      "owner": "Team/role responsible"
    }
  ]
}`;

      return auditPrompt;
    } catch (e) {
      console.error('[GlyphBot Phase6] Failed to run audit:', e);
      return null;
    }
  }, [updateAudit, getAudit]);

  // Load archived audits
  const loadArchivedAudits = useCallback(async () => {
    if (!currentUser?.email) return [];

    try {
      const results = await base44.entities.GlyphBotAudit.filter(
        { userId: currentUser.email, isArchived: true },
        '-created_date',
        100
      );

      const normalized = (results || []).map(a => ({
        ...a,
        id: a.id || a._id || a.entity_id
      }));

      return normalized;
    } catch (e) {
      console.error('[GlyphBot Phase6] Failed to load archived audits:', e);
      return [];
    }
  }, [currentUser?.email]);

  return {
    audits,
    isLoading,
    createAudit,
    updateAudit,
    getAudit,
    deleteAudit,
    archiveAudit,
    unarchiveAudit,
    runAudit,
    loadAudits,
    loadArchivedAudits
  };
}

export default useGlyphBotAudit;