import { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';

/**
 * Phase 6: Audit persistence hook
 * Manages GlyphBotAudit entities for security audit sessions
 */
export function useGlyphBotAudit(currentUser) {
  const [audits, setAudits] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load user's audits
  const loadAudits = useCallback(async () => {
    if (!currentUser?.email) return;

    setIsLoading(true);
    try {
      const results = await base44.entities.GlyphBotAudit.filter(
        { userId: currentUser.email },
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
        targetUrl: auditData.targetUrl,
        auditType: auditData.auditType || 'QUICK',
        notes: auditData.notes || '',
        status: 'PENDING',
        findings: '{}',
        summary: '',
        severityScore: 0,
        overallGrade: ''
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

  return {
    audits,
    isLoading,
    createAudit,
    updateAudit,
    getAudit,
    deleteAudit,
    loadAudits
  };
}

export default useGlyphBotAudit;