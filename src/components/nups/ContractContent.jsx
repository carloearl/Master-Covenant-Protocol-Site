/**
 * Contract Content - with blocking acknowledgment modal
 */

import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { FileText, Printer, Search, Fingerprint, PenTool, CheckCircle, Scale, Lock, Eye, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import ProtectedField, { useAccessControl } from '@/components/nups/ProtectedField';

const VENUE_NAME = 'THE ESTABLISHMENT';
const VENUE_LEGAL = 'GlyphLock Entertainment LLC';
const VENUE_ADDRESS = '123 Entertainment Blvd, Las Vegas, NV 89109';
const CONTRACT_VERSION = '3.0.0';

async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function NUPSContractContent() {
  const [selectedGuestId, setSelectedGuestId] = useState('');
  const [search, setSearch] = useState('');
  const [managerName, setManagerName] = useState('');
  const [managerSig, setManagerSig] = useState('');
  const [guestSig, setGuestSig] = useState('');
  const [guestInitials, setGuestInitials] = useState('');
  const [thumbprint, setThumbprint] = useState(false);
  const [contractHash, setContractHash] = useState('');
  const [signed, setSigned] = useState(false);
  const [showAcknowledgmentModal, setShowAcknowledgmentModal] = useState(false);
  const [modalTerms, setModalTerms] = useState({
    age: false,
    conduct: false,
    liability: false,
    arbitration: false
  });

  const { data: guests = [] } = useQuery({
    queryKey: ['vip-guests-contract'],
    queryFn: () => base44.entities.VIPGuest.list('-created_date', 200)
  });

  const filtered = guests.filter(g =>
    g.guest_name?.toLowerCase().includes(search.toLowerCase()) ||
    g.membership_number?.toLowerCase().includes(search.toLowerCase())
  );

  const guest = guests.find(g => g.id === selectedGuestId);
  const allModalTerms = Object.values(modalTerms).every(Boolean);
  const canProceed = (guestSig || thumbprint) && managerSig && guestInitials;

  const contractDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const contractTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' });
  const contractId = `${VENUE_LEGAL.replace(/\s/g, '').slice(0, 6).toUpperCase()}-${guest?.id?.slice(0, 8) || 'XXXXXX'}-${Date.now().toString(36).toUpperCase()}`;

  const handleSignClick = () => {
    if (!canProceed || !guest) {
      toast.error('Complete signature fields first');
      return;
    }
    setShowAcknowledgmentModal(true);
  };

  const handleConfirmSign = async () => {
    if (!allModalTerms) {
      toast.error('All acknowledgments required');
      return;
    }

    const contractContent = JSON.stringify({
      guestId: guest.id,
      guestName: guest.guest_name,
      contractId,
      version: CONTRACT_VERSION,
      signedAt: new Date().toISOString(),
      managerWitness: managerName,
      terms: modalTerms
    });

    const hash = await sha256(contractContent);
    setContractHash(hash);

    try {
      await base44.entities.VIPGuest.update(guest.id, {
        contract_signed: true,
        contract_signed_date: new Date().toISOString(),
        contract_version: CONTRACT_VERSION,
        contract_signature: guestSig || 'BIOMETRIC_THUMBPRINT',
        contract_signature_hash: hash,
        thumbprint_captured: thumbprint,
        manager_witness: managerName,
        manager_signature: managerSig
      });
      setSigned(true);
      setShowAcknowledgmentModal(false);
      toast.success('Contract signed and sealed');
    } catch (err) {
      toast.error('Failed to save contract');
    }
  };

  const handlePrint = () => {
    if (!guest || !signed) {
      toast.error('Contract must be signed before printing');
      return;
    }
    const printWindow = window.open('', '_blank');
    printWindow.document.write(generatePrintHTML());
    printWindow.document.close();
    printWindow.print();
  };

  const generatePrintHTML = () => `<!DOCTYPE html><html><head><title>VIP Membership Agreement - ${guest?.guest_name}</title><style>@page { margin: 0.6in; size: letter; } body { font-family: 'Times New Roman', serif; font-size: 10pt; line-height: 1.4; color: #000; max-width: 8in; margin: 0 auto; } .header { text-align: center; border-bottom: 3px double #000; padding-bottom: 12px; margin-bottom: 15px; } .title { font-size: 16pt; font-weight: bold; letter-spacing: 2px; } .subtitle { font-size: 9pt; color: #333; margin-top: 4px; } .section { margin: 12px 0; page-break-inside: avoid; } .section-title { font-weight: bold; font-size: 10pt; text-transform: uppercase; border-bottom: 1px solid #000; padding-bottom: 2px; margin-bottom: 8px; } .clause { margin: 6px 0; padding-left: 12px; text-align: justify; } .guest-info { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; background: #f8f8f8; padding: 12px; margin: 12px 0; border: 1px solid #ccc; } .info-label { font-weight: bold; font-size: 8pt; color: #444; } .signature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-top: 40px; } .signature-box { text-align: center; } .signature-line { border-top: 1px solid #000; padding-top: 4px; margin-top: 40px; font-size: 9pt; } .thumbprint-box { width: 1.25in; height: 1.75in; border: 2px solid #000; margin: 15px auto; display: flex; align-items: center; justify-content: center; font-size: 8pt; } .hash-box { background: #f0f0f0; padding: 8px; font-family: monospace; font-size: 7pt; word-break: break-all; margin-top: 20px; border: 1px solid #ccc; } .legal-notice { font-size: 8pt; color: #444; margin-top: 20px; padding-top: 10px; border-top: 1px solid #ccc; } .warning { border: 2px solid #000; padding: 8px; margin: 10px 0; background: #fff8dc; font-weight: bold; text-align: center; }</style></head><body><div class="header"><div class="title">${VENUE_NAME}</div><div class="subtitle">VIP MEMBERSHIP AND SERVICE AGREEMENT</div><div class="subtitle">${VENUE_LEGAL} • ${VENUE_ADDRESS}</div><div class="subtitle">Contract Version ${CONTRACT_VERSION} | ${contractDate}</div></div><div class="warning">⚠️ LEGALLY BINDING CONTRACT ⚠️</div><div class="guest-info"><div><div class="info-label">FULL LEGAL NAME</div>${guest?.guest_name || '—'}</div><div><div class="info-label">MEMBERSHIP ID</div>${guest?.membership_number || 'PENDING'}</div><div><div class="info-label">DATE OF BIRTH</div>${guest?.date_of_birth || '—'}</div><div><div class="info-label">VIP TIER</div>${guest?.vip_tier || 'Standard'}</div></div><div class="section"><div class="section-title">Article I - Age Verification</div><div class="clause">Member represents under penalty of perjury that Member is at least 21 years of age.</div></div><div class="section"><div class="section-title">Article II - Code of Conduct</div><div class="clause">Member agrees to conduct themselves respectfully at all times.</div></div><div class="section"><div class="section-title">Article III - Liability Release</div><div class="clause">MEMBER VOLUNTARILY ASSUMES ALL RISKS and RELEASES the Establishment from ALL LIABILITY.</div></div><div class="section"><div class="section-title">Article IV - Arbitration</div><div class="clause">ALL DISPUTES resolved by BINDING ARBITRATION in Clark County, Nevada.</div></div><div style="text-align: center;"><div class="thumbprint-box">${thumbprint ? '✓ BIOMETRIC CAPTURED' : 'RIGHT THUMBPRINT'}</div></div><div class="signature-grid"><div class="signature-box"><div style="font-style: italic; font-size: 14pt;">${guestSig || ''}</div><div class="signature-line"><strong>MEMBER SIGNATURE</strong><br>${guest?.guest_name || ''}<br>Initials: ${guestInitials || ''}</div></div><div class="signature-box"><div style="font-style: italic; font-size: 14pt;">${managerSig || ''}</div><div class="signature-line"><strong>AUTHORIZED WITNESS</strong><br>${managerName || 'Manager'}</div></div></div><div style="text-align: center; margin-top: 20px;"><strong>Execution:</strong> ${contractDate} at ${contractTime}</div>${contractHash ? `<div class="hash-box"><strong>DOCUMENT HASH (SHA-256):</strong><br>${contractHash}</div>` : ''}<div class="legal-notice"><strong>Contract ID:</strong> ${contractId}<br><strong>Version:</strong> ${CONTRACT_VERSION}<br>Governed by Nevada State Law<br><em>MEMBER COPY - RETAIN FOR YOUR RECORDS</em></div></body></html>`;

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="bg-slate-900/50 border-cyan-500/30">
          <CardHeader><CardTitle className="text-white flex items-center gap-2"><Search className="w-5 h-5 text-cyan-400" />Select Guest</CardTitle></CardHeader>
          <CardContent>
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or ID..." className="mb-4 bg-slate-800 border-slate-600" />
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {filtered.map(g => (
                <div key={g.id} onClick={() => setSelectedGuestId(g.id)} className={`p-3 rounded-lg border cursor-pointer ${selectedGuestId === g.id ? 'bg-cyan-500/20 border-cyan-500' : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'}`}>
                  <div className="flex items-center justify-between">
                    <div><p className="font-medium text-white">{g.guest_name}</p><p className="text-xs text-slate-400">{g.membership_number || 'No ID'}</p></div>
                    {g.contract_signed && <Badge className="bg-green-500/20 text-green-400">Signed</Badge>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-purple-500/30 lg:col-span-2">
          <CardHeader><CardTitle className="text-white flex items-center gap-2"><Scale className="w-5 h-5 text-purple-400" />{guest ? `Contract: ${guest.guest_name}` : 'Select a Guest'}</CardTitle></CardHeader>
          <CardContent>
            {guest ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-slate-800/50 rounded-lg text-sm">
                  <div><p className="text-slate-500 text-xs">Name</p><p className="text-white">{guest.guest_name}</p></div>
                  <div><p className="text-slate-500 text-xs">ID</p><p className="text-white">{guest.membership_number || '—'}</p></div>
                  <div><p className="text-slate-500 text-xs">Tier</p><p className="text-amber-400">{guest.vip_tier || 'Standard'}</p></div>
                  <div><p className="text-slate-500 text-xs">DOB</p><ProtectedField requireRole="manager" mask maskLength={10}><p className="text-white">{guest.date_of_birth || '—'}</p></ProtectedField></div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div><Label className="text-slate-400 text-xs">Guest Initials</Label><Input value={guestInitials} onChange={e => setGuestInitials(e.target.value.toUpperCase().slice(0, 4))} placeholder="JDS" maxLength={4} className="bg-slate-800 border-slate-600" /></div>
                  <div><Label className="text-slate-400 text-xs">Guest Signature (type name)</Label><Input value={guestSig} onChange={e => setGuestSig(e.target.value)} placeholder={guest.guest_name} className="bg-slate-800 border-slate-600 italic" /></div>
                  <div><Label className="text-slate-400 text-xs">Manager Witness</Label><Input value={managerName} onChange={e => setManagerName(e.target.value)} placeholder="Manager name" className="bg-slate-800 border-slate-600" /></div>
                  <div><Label className="text-slate-400 text-xs">Manager Signature</Label><Input value={managerSig} onChange={e => setManagerSig(e.target.value)} placeholder="Type to sign" className="bg-slate-800 border-slate-600 italic" /></div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg">
                  <div onClick={() => setThumbprint(!thumbprint)} className={`w-16 h-20 border-2 rounded-lg flex flex-col items-center justify-center cursor-pointer ${thumbprint ? 'border-green-500 bg-green-500/10' : 'border-dashed border-slate-600 hover:border-amber-500'}`}>
                    {thumbprint ? <CheckCircle className="w-6 h-6 text-green-400" /> : <Fingerprint className="w-6 h-6 text-slate-500" />}
                    <span className="text-xs text-slate-400 mt-1">{thumbprint ? 'Done' : 'Press'}</span>
                  </div>
                  <div><p className="text-white font-medium">Biometric Thumbprint</p><p className="text-xs text-slate-400">Alternative to signature</p></div>
                </div>

                {guest.contract_signed && (
                  <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <div><p className="text-green-400 font-medium">Contract on File (v{guest.contract_version})</p><p className="text-xs text-slate-400">Signed {new Date(guest.contract_signed_date).toLocaleDateString()}</p></div>
                  </div>
                )}

                {contractHash && (
                  <div className="p-3 bg-slate-800 rounded-lg">
                    <p className="text-xs text-slate-400 mb-1 flex items-center gap-1"><Lock className="w-3 h-3" /> Document Hash (SHA-256)</p>
                    <p className="font-mono text-xs text-cyan-400 break-all">{contractHash}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button onClick={handleSignClick} disabled={!canProceed || signed} className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 disabled:opacity-50">
                    <PenTool className="w-4 h-4 mr-2" />{signed ? 'Signed ✓' : 'Sign Contract'}
                  </Button>
                  <Button onClick={handlePrint} variant="outline" disabled={!signed} className="border-slate-600 disabled:opacity-50">
                    <Printer className="w-4 h-4 mr-2" />Print
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500"><FileText className="w-12 h-12 mx-auto mb-4 opacity-50" /><p>Select a guest to view/sign contract</p></div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Blocking Acknowledgment Modal */}
      <Dialog open={showAcknowledgmentModal} onOpenChange={setShowAcknowledgmentModal}>
        <DialogContent className="bg-slate-900 border-amber-500/50 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Final Acknowledgment & Consent
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              All acknowledgments must be checked before signing. This is a legally binding agreement.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {[
              { key: 'age', label: 'I confirm I am at least 21 years of age and have presented valid government-issued identification.' },
              { key: 'conduct', label: 'I agree to abide by the Code of Conduct and understand prohibited behaviors.' },
              { key: 'liability', label: 'I VOLUNTARILY ASSUME ALL RISKS and RELEASE the Establishment from ALL LIABILITY.' },
              { key: 'arbitration', label: 'I agree to BINDING ARBITRATION and WAIVE my right to class action.' }
            ].map(t => (
              <div key={t.key} className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg">
                <Checkbox
                  checked={modalTerms[t.key]}
                  onCheckedChange={c => setModalTerms({ ...modalTerms, [t.key]: c })}
                  className="mt-0.5 border-amber-500"
                />
                <span className="text-sm text-slate-300">{t.label}</span>
              </div>
            ))}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowAcknowledgmentModal(false)} className="border-slate-600">
              Cancel
            </Button>
            <Button onClick={handleConfirmSign} disabled={!allModalTerms} className="bg-gradient-to-r from-amber-600 to-red-600 disabled:opacity-50">
              <CheckCircle className="w-4 h-4 mr-2" />
              I Understand & Consent
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}