import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Shield, Globe, User, Building2, Upload, FileText } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Phase 6: Universal Audit Entry Panel
 * Three channels: Business, People, Agency
 * Six audit modes: Surface, Concise, Medium, Deep, Enterprise A, Enterprise B
 */
export default function AuditPanel({ onStartAudit, isProcessing }) {
  const [targetType, setTargetType] = useState('business');
  const [targetIdentifier, setTargetIdentifier] = useState('');
  const [auditMode, setAuditMode] = useState('SURFACE');
  const [notes, setNotes] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['application/zip', 'application/pdf', 'application/x-zip-compressed'];
    if (!validTypes.includes(file.type)) {
      toast.error('Only ZIP and PDF files are supported');
      return;
    }

    setUploadedFile(file);
    toast.success(`File uploaded: ${file.name}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!targetIdentifier.trim()) {
      toast.error(`Please enter a ${targetType === 'business' ? 'URL' : 'name'}`);
      return;
    }

    // Validate URL for business audits
    if (targetType === 'business') {
      try {
        new URL(targetIdentifier.startsWith('http') ? targetIdentifier : `https://${targetIdentifier}`);
      } catch {
        toast.error('Please enter a valid URL (e.g., example.com or https://example.com)');
        return;
      }
    }

    const normalizedIdentifier = targetType === 'business' && !targetIdentifier.startsWith('http')
      ? `https://${targetIdentifier}`
      : targetIdentifier;
    
    onStartAudit({
      targetType,
      targetIdentifier: normalizedIdentifier,
      auditMode,
      notes: notes.trim(),
      rawInput: uploadedFile ? uploadedFile.name : normalizedIdentifier
    });

    // Reset form
    setTargetIdentifier('');
    setNotes('');
    setUploadedFile(null);
  };

  const auditModes = [
    { value: 'SURFACE', label: 'Surface (Light)', desc: 'Quick overview, top-level findings' },
    { value: 'CONCISE', label: 'Concise Technical', desc: 'Technical summary, core issues only' },
    { value: 'MEDIUM', label: 'Medium Report', desc: 'Balanced depth and breadth' },
    { value: 'DEEP', label: 'Deep Report', desc: 'Comprehensive analysis, all vectors' },
    { value: 'ENTERPRISE_A', label: 'Enterprise Grade A', desc: 'Executive + technical + legal' },
    { value: 'ENTERPRISE_B', label: 'Enterprise Grade B', desc: 'Full forensic + compliance' }
  ];

  return (
    <div className="bg-slate-900/60 border-2 border-purple-500/30 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4 text-cyan-300">
        <Shield className="w-5 h-5" />
        <h3 className="text-sm font-bold uppercase tracking-wider">Universal Audit Engine</h3>
      </div>

      <Tabs value={targetType} onValueChange={setTargetType} className="mb-4">
        <TabsList className="grid grid-cols-3 bg-slate-800/50 border border-slate-700 p-0.5">
          <TabsTrigger value="business" className="text-xs data-[state=active]:bg-cyan-500/30 data-[state=active]:text-cyan-300">
            <Globe className="w-3 h-3 mr-1" />
            Business
          </TabsTrigger>
          <TabsTrigger value="person" className="text-xs data-[state=active]:bg-purple-500/30 data-[state=active]:text-purple-300">
            <User className="w-3 h-3 mr-1" />
            People
          </TabsTrigger>
          <TabsTrigger value="agency" className="text-xs data-[state=active]:bg-amber-500/30 data-[state=active]:text-amber-300">
            <Building2 className="w-3 h-3 mr-1" />
            Agency
          </TabsTrigger>
        </TabsList>

        <TabsContent value="business" className="mt-4 space-y-3">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Website URL *</label>
            <Input
              value={targetIdentifier}
              onChange={(e) => setTargetIdentifier(e.target.value)}
              placeholder="example.com or https://example.com"
              disabled={isProcessing}
              className="bg-slate-800 border-slate-700 text-white text-sm min-h-[44px]"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Business audit includes: security, compliance (BBB/FTC/FCC/CFPB), reputation, legal risk
            </p>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1 block">Upload Site Files (Optional)</label>
            <div className="relative">
              <input
                type="file"
                accept=".zip,.pdf"
                onChange={handleFileUpload}
                disabled={isProcessing}
                className="hidden"
                id="file-upload-business"
              />
              <label
                htmlFor="file-upload-business"
                className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 border-2 border-dashed border-slate-600 hover:border-cyan-500/50 rounded-lg cursor-pointer transition-all text-xs text-slate-400 hover:text-cyan-300 min-h-[44px]"
              >
                <Upload className="w-4 h-4" />
                {uploadedFile ? uploadedFile.name : 'Upload ZIP/PDF for static analysis'}
              </label>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="person" className="mt-4 space-y-3">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Person Name *</label>
            <Input
              value={targetIdentifier}
              onChange={(e) => setTargetIdentifier(e.target.value)}
              placeholder="Full name or identifier"
              disabled={isProcessing}
              className="bg-slate-800 border-slate-700 text-white text-sm min-h-[44px]"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              LLM-based analysis only: public records, reputation risk, pattern recognition
            </p>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
            <p className="text-[10px] text-amber-300 leading-relaxed">
              ⚠️ This uses publicly available information only. No private database access. Results are analytical, not definitive.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="agency" className="mt-4 space-y-3">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Agency Name *</label>
            <Input
              value={targetIdentifier}
              onChange={(e) => setTargetIdentifier(e.target.value)}
              placeholder="Government agency or department"
              disabled={isProcessing}
              className="bg-slate-800 border-slate-700 text-white text-sm min-h-[44px]"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Analysis: misconduct patterns, public lawsuits, accountability metrics, FOIA templates
            </p>
          </div>
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
            <p className="text-[10px] text-cyan-300 leading-relaxed">
              ℹ️ Civic accountability audit using public records and legal databases (LLM analysis).
            </p>
          </div>
        </TabsContent>
      </Tabs>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Audit Mode</label>
          <Select value={auditMode} onValueChange={setAuditMode} disabled={isProcessing}>
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white text-sm min-h-[44px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              {auditModes.map(mode => (
                <SelectItem key={mode.value} value={mode.value} className="text-white">
                  {mode.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-[10px] text-slate-500 mt-1">
            {auditModes.find(m => m.value === auditMode)?.desc}
          </p>
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-1 block">Notes / Focus Areas (optional)</label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={
              targetType === 'business' 
                ? 'e.g., Check login page, admin portal, payment flow...'
                : targetType === 'person'
                  ? 'e.g., Focus on legal history, public record discrepancies...'
                  : 'e.g., Focus on misconduct patterns, recent lawsuits...'
            }
            disabled={isProcessing}
            className="bg-slate-800 border-slate-700 text-white text-sm min-h-[60px] resize-none"
            rows={2}
          />
        </div>

        <Button
          type="submit"
          disabled={isProcessing || !targetIdentifier.trim()}
          className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-semibold min-h-[44px] shadow-[0_0_20px_rgba(6,182,212,0.3)]"
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Running {targetType.toUpperCase()} Audit...
            </>
          ) : (
            <>
              <Shield className="w-4 h-4 mr-2" />
              Run {auditMode} Audit
            </>
          )}
        </Button>
      </form>

      {/* Audit Channel Descriptions */}
      <div className="mt-4 pt-4 border-t border-slate-700/50 space-y-2">
        <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Channel Capabilities</div>
        
        {targetType === 'business' && (
          <div className="text-[10px] text-slate-400 space-y-1">
            <div>✓ Website security (headers, TLS, auth)</div>
            <div>✓ Compliance (BBB, FTC, FCC, CFPB)</div>
            <div>✓ Reputation & scam report checks</div>
            <div>✓ Legal risk indicators</div>
          </div>
        )}

        {targetType === 'person' && (
          <div className="text-[10px] text-slate-400 space-y-1">
            <div>✓ Public court record summaries</div>
            <div>✓ Criminal record structural analysis</div>
            <div>✓ Reputation risk scoring</div>
            <div>✓ Pattern recognition (violence, fraud)</div>
            <div>⚠️ LLM-based only, no private DB access</div>
          </div>
        )}

        {targetType === 'agency' && (
          <div className="text-[10px] text-slate-400 space-y-1">
            <div>✓ Misconduct pattern analysis</div>
            <div>✓ Abuse-of-authority indicators</div>
            <div>✓ Public lawsuit tracking</div>
            <div>✓ FOIA auto-draft generation</div>
            <div>✓ Civic accountability scoring</div>
          </div>
        )}
      </div>
    </div>
  );
}