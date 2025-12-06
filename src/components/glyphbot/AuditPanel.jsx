import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Shield, Globe, AlertTriangle, FileCheck } from 'lucide-react';

/**
 * Phase 6: Audit Entry Panel
 * Allows user to initiate website/system security audits
 */
export default function AuditPanel({ onStartAudit, isProcessing }) {
  const [targetUrl, setTargetUrl] = useState('');
  const [auditType, setAuditType] = useState('QUICK');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!targetUrl.trim()) {
      alert('Please enter a target URL');
      return;
    }

    // Basic URL validation
    try {
      new URL(targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`);
    } catch {
      alert('Please enter a valid URL (e.g., example.com or https://example.com)');
      return;
    }

    const normalizedUrl = targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`;
    
    onStartAudit({
      targetUrl: normalizedUrl,
      auditType,
      notes: notes.trim()
    });

    // Reset form
    setTargetUrl('');
    setNotes('');
  };

  const auditTypeIcons = {
    QUICK: <Shield className="w-4 h-4" />,
    DEEP: <AlertTriangle className="w-4 h-4" />,
    COMPLIANCE: <FileCheck className="w-4 h-4" />
  };

  const auditTypeDescriptions = {
    QUICK: 'Surface-level scan (headers, TLS, basic config)',
    DEEP: 'Comprehensive analysis (auth, sessions, vulnerabilities)',
    COMPLIANCE: 'Privacy & compliance check (GDPR, HIPAA, PCI)'
  };

  return (
    <div className="bg-slate-900/60 border-2 border-purple-500/30 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4 text-cyan-300">
        <Globe className="w-5 h-5" />
        <h3 className="text-sm font-bold uppercase tracking-wider">Security Audit</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Target URL *</label>
          <Input
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            placeholder="example.com or https://example.com"
            disabled={isProcessing}
            className="bg-slate-800 border-slate-700 text-white text-sm min-h-[44px]"
          />
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-1 block">Audit Type</label>
          <Select value={auditType} onValueChange={setAuditType} disabled={isProcessing}>
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white text-sm min-h-[44px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="QUICK" className="text-white">
                <div className="flex items-center gap-2">
                  {auditTypeIcons.QUICK}
                  <span>Quick Scan</span>
                </div>
              </SelectItem>
              <SelectItem value="DEEP" className="text-white">
                <div className="flex items-center gap-2">
                  {auditTypeIcons.DEEP}
                  <span>Deep Scan</span>
                </div>
              </SelectItem>
              <SelectItem value="COMPLIANCE" className="text-white">
                <div className="flex items-center gap-2">
                  {auditTypeIcons.COMPLIANCE}
                  <span>Compliance Check</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-[10px] text-slate-500 mt-1">{auditTypeDescriptions[auditType]}</p>
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-1 block">Notes / Focus Areas (optional)</label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g., Check login page, admin portal, payment flow..."
            disabled={isProcessing}
            className="bg-slate-800 border-slate-700 text-white text-sm min-h-[60px] resize-none"
            rows={2}
          />
        </div>

        <Button
          type="submit"
          disabled={isProcessing || !targetUrl.trim()}
          className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-semibold min-h-[44px] shadow-[0_0_20px_rgba(6,182,212,0.3)]"
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Running Audit...
            </>
          ) : (
            <>
              <Shield className="w-4 h-4 mr-2" />
              Run Security Audit
            </>
          )}
        </Button>
      </form>
    </div>
  );
}