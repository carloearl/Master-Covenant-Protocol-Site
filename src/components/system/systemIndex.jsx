/**
 * GlyphLock System Module Index
 * Centralized export registry for Phase 5+ modules
 * 
 * Purpose:
 * - Provide clean imports for persistence hooks
 * - Export system status for admin dashboards
 * - Support future WYT (Watch Your Tone) integration
 */

// GlyphBot Persistence Exports (Phase 5)
export { useGlyphBotPersistence } from '@/components/glyphbot/useGlyphBotPersistence';
export { default as ChatHistoryPanel } from '@/components/glyphbot/ChatHistoryPanel';

// GlyphBot Audit Exports (Phase 6 - Universal Audit Engine)
export { useGlyphBotAudit } from '@/components/glyphbot/useGlyphBotAudit';
export { default as AuditPanel } from '@/components/glyphbot/AuditPanel';
export { default as AuditHistoryPanel } from '@/components/glyphbot/AuditHistoryPanel';
export { default as AuditReportView } from '@/components/glyphbot/AuditReportView';

// Phase 6 Audit Channels
export const AUDIT_CHANNELS = {
  BUSINESS: 'business',
  PEOPLE: 'person',
  AGENCY: 'agency'
};

// Phase 6 Audit Modes
export const AUDIT_MODES = {
  SURFACE: 'SURFACE',
  CONCISE: 'CONCISE',
  MEDIUM: 'MEDIUM',
  DEEP: 'DEEP',
  ENTERPRISE_A: 'ENTERPRISE_A',
  ENTERPRISE_B: 'ENTERPRISE_B'
};

// System Status Helper
export const WYT = () => ({
  glyphbot_version: 'phase_7c',
  audit_engine: 'active',
  voice_engine: 'phase_7c_production',
  tts_provider: 'openai_hybrid',
  tts_controls: true,
  persistence: 'active',
  status: 'stable',
  message: 'GlyphBot Universal Audit Engine + Production Voice Engine Online',
  features: {
    save: true,
    load: true,
    archive: true,
    unarchive: true,
    delete: true,
    auto_resume: true,
    full_history: true,
    user_scoped: true,
    retry_logic: true,
    security_audits: true,
    audit_history: true,
    audit_reports: true,
    voice_summaries: true,
    business_audits: true,
    people_audits: true,
    agency_audits: true,
    six_audit_modes: true,
    file_upload_analysis: true,
    foia_generation: true,
    enhanced_tts: true,
    emotion_presets: true,
    voice_selection: true,
    pitch_control: true,
    speed_control: true,
    per_message_tts_metadata: true
  },
  audit_channels: ['business', 'person', 'agency'],
  audit_modes: ['SURFACE', 'CONCISE', 'MEDIUM', 'DEEP', 'ENTERPRISE_A', 'ENTERPRISE_B'],
  emotion_presets: ['neutral', 'soft', 'firm', 'excited', 'calm'],
  entities: ['GlyphBotChat', 'GlyphBotAudit'],
  timestamp: new Date().toISOString()
});

// Module Status Registry
export const SYSTEM_STATUS = {
  glyphbot: {
    version: '7.1',
    status: 'active',
    persistence: true,
    audit_engine: 'active',
    voice_engine: 'phase_7c_production',
    tts_provider: 'openai_hybrid',
    entities: ['GlyphBotChat', 'GlyphBotAudit'],
    features: [
      'chat', 
      'persistence', 
      'security_audits', 
      'enterprise_reports',
      'business_channel',
      'people_channel',
      'agency_channel',
      'six_audit_modes',
      'voice_summaries',
      'archive_system',
      'enhanced_tts',
      'emotion_presets',
      'voice_selection',
      'pitch_speed_control',
      'per_message_replay'
    ]
  },
  qr_studio: {
    version: '4.0',
    status: 'active',
    persistence: true,
    entity: 'QrPreview'
  },
  image_lab: {
    version: '3.0',
    status: 'active',
    entity: 'InteractiveImage'
  },
  wyt: {
    version: '0.1.0',
    status: 'planned',
    description: 'Watch Your Tone - Future sentiment analysis module'
  }
};

// Health Check Function
export function checkSystemHealth() {
  return {
    timestamp: new Date().toISOString(),
    modules: SYSTEM_STATUS,
    wyt: WYT(),
    health: 'operational'
  };
}

export default {
  WYT,
  SYSTEM_STATUS,
  checkSystemHealth
};