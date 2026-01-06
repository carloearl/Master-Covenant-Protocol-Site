/**
 * Entertainer Contract Modal - Full Agreement
 * Must scroll, acknowledge, sign before clock-in
 */

import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// ScrollArea removed - using native overflow for better mobile support
import { Printer, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

const CONTRACT_TEXT = `INDEPENDENT ENTERTAINER LICENSE AGREEMENT

PREAMBLE
THIS INDEPENDENT ENTERTAINER LICENSE AGREEMENT ("Agreement") is entered into as of the date of digital execution, by and between DREAM PALACE CABARET, an Arizona business entity with principal place of business at 815 N Scottsdale Rd, Scottsdale, Arizona, Maricopa County ("Club" or "Licensor"), AND the undersigned individual ("Entertainer" or "Licensee").

RECITALS
WHEREAS, Club operates a lawful adult entertainment venue providing licensed premises, security services, and operational infrastructure for independent entertainment professionals;

WHEREAS, Entertainer operates an independent business providing adult entertainment services directly to patrons and desires a revocable, non-exclusive license to access designated areas of the Premises;

WHEREAS, the Parties intend to establish a purely commercial licensing relationship and expressly disclaim any employer-employee, partnership, joint venture, or agency relationship;

NOW, THEREFORE, the Parties agree as follows:

ARTICLE I — DEFINITIONS
1.1 "Business Hours" means all times during which Club is open to patrons for business.
1.2 "Entertainer" means the independent contractor granted licensed access under this Agreement.
1.3 "License Fee" means consideration paid by Entertainer for licensed use of Club facilities.
1.4 "Premises" means Dream Palace Cabaret located at 815 N Scottsdale Rd, Scottsdale, AZ.
1.5 "VIP Rooms" means private or premium performance areas within the Premises.
1.6 "Gross VIP Receipts" means all amounts paid by patrons for VIP access before any deductions.

ARTICLE II — INDEPENDENT CONTRACTOR RELATIONSHIP
2.1 Entertainer is an independent contractor. No employment relationship exists or is created by this Agreement.
2.2 Club does not control Entertainer's performance style, schedule, attire, pricing, or methods.
2.3 Entertainer is solely responsible for all federal, state, and local taxes, business licenses, liability insurance, and regulatory compliance.
2.4 Entertainer may perform at other venues and is not exclusive to Club.

ARTICLE III — LICENSE GRANT
3.1 Club grants Entertainer a revocable, non-exclusive, conditional license to access designated entertainment areas of the Premises during Business Hours.
3.2 This license may be revoked at any time, with or without cause, at Club's sole discretion.
3.3 License does not convey property rights, employment status, or guaranteed access.

ARTICLE IV — TERM & TERMINATION
4.1 This Agreement is effective for one (1) year from execution and auto-renews annually unless terminated.
4.2 Either party may terminate with or without cause.
4.3 Club may terminate immediately for: (a) licensing violations; (b) nonpayment of fees; (c) illegal conduct; (d) Club's discretion.
4.4 No damages, severance, or compensation is owed by Club upon termination.

ARTICLE V — ARRIVAL / SHIFT LICENSE FEES
5.1 Entertainer agrees to pay arrival-based license fees per shift as posted or communicated.
5.2 License fees are non-refundable regardless of earnings or early departure.
5.3 Tips and performance compensation from patrons remain Entertainer's property after payment of applicable license fees.

ARTICLE VI — VIP ROOM LICENSE FEE
6.1 VIP Room access constitutes a separate facility license subject to additional fees.
6.2 Entertainer agrees to pay a VIP Room License Fee equal to FIFTY PERCENT (50%) of Gross VIP Receipts.
6.3 This fee is NOT wages, tips, commissions, or revenue sharing. It is consideration for use of premium Club facilities, security, and operational infrastructure.
6.4 Entertainer retains the remaining FIFTY PERCENT (50%) of Gross VIP Receipts as independent contractor compensation.
6.5 VIP participation is voluntary. Entertainer may decline VIP sessions without penalty.
6.6 This fee structure is industry standard and reflects fair market value for premium facility access.

ARTICLE VII — ASSUMPTION OF RISK & LIABILITY LIMITATION
7.1 Entertainer acknowledges adult entertainment involves inherent risks including but not limited to: physical injury, emotional distress, patron disputes, and financial uncertainty.
7.2 Entertainer voluntarily assumes all such risks.
7.3 Club's total liability under this Agreement is limited to license fees paid by Entertainer in the thirty (30) days preceding any claim.

ARTICLE VIII — INDEMNIFICATION
8.1 Entertainer agrees to indemnify, defend, and hold harmless Club, its owners, officers, employees, and agents from and against all claims, damages, losses, and expenses arising from:
(a) Entertainer's conduct on or off Premises;
(b) Entertainer's failure to maintain required licenses or permits;
(c) Entertainer's tax obligations or misclassification claims;
(d) Disputes between Entertainer and patrons;
(e) Any breach of this Agreement.

ARTICLE IX — DISPUTE RESOLUTION
9.1 This Agreement is governed by the laws of the State of Arizona.
9.2 All disputes shall be resolved by binding arbitration in Maricopa County, Arizona.
9.3 ENTERTAINER WAIVES THE RIGHT TO JURY TRIAL AND CLASS ACTION PARTICIPATION.
9.4 Arbitration shall be conducted under AAA Commercial Arbitration Rules.
9.5 Prevailing party is entitled to reasonable attorneys' fees.

ARTICLE X — DIGITAL EXECUTION
10.1 This Agreement may be executed electronically via NUPS / GlyphLock digital signature system.
10.2 Electronic signature, execution timestamp, session ID, and agreement hash constitute conclusive proof of execution.
10.3 Entertainer acknowledges digital execution is legally binding under Arizona and federal electronic signature laws.

ARTICLE XI — MISCELLANEOUS
11.1 This Agreement constitutes the entire agreement between the Parties.
11.2 Amendments must be in writing and signed by both Parties.
11.3 If any provision is unenforceable, remaining provisions remain in effect.
11.4 Waiver of any breach does not waive future breaches.
11.5 This Agreement may not be assigned by Entertainer without Club consent.`;

export default function EntertainerContractModal({ open, onOpenChange, entertainer, onSigned }) {
  const [scrolledToEnd, setScrolledToEnd] = useState(false);
  const [acknowledgments, setAcknowledgments] = useState({
    independent: false,
    fees: false,
    vip: false,
    arbitration: false
  });
  const [signature, setSignature] = useState('');
  const [signing, setSigning] = useState(false);
  const scrollRef = useRef(null);

  const allAcknowledged = Object.values(acknowledgments).every(Boolean);
  const canSign = scrolledToEnd && allAcknowledged && signature.trim().length > 2;

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 20) {
      setScrolledToEnd(true);
    }
  };

  const handleSign = async () => {
    if (!canSign) return;
    setSigning(true);

    const sessionId = crypto.randomUUID();
    const timestamp = new Date().toISOString();
    const hashContent = JSON.stringify({
      entertainerId: entertainer?.id,
      entertainerName: entertainer?.stage_name || entertainer?.legal_name,
      contractVersion: '1.0.0',
      signature,
      timestamp,
      sessionId,
      acknowledgments
    });

    const agreementHash = await sha256(hashContent);

    const record = {
      entertainerId: entertainer?.id,
      entertainerName: entertainer?.stage_name,
      legalName: entertainer?.legal_name,
      signature,
      timestamp,
      sessionId,
      agreementHash,
      contractType: 'ENTERTAINER_LICENSE',
      version: '1.0.0'
    };

    // Store in IndexedDB
    try {
      const db = await openContractDB();
      const tx = db.transaction('entertainerContracts', 'readwrite');
      tx.objectStore('entertainerContracts').put({ id: entertainer?.id, ...record });
      await new Promise((resolve, reject) => {
        tx.oncomplete = resolve;
        tx.onerror = reject;
      });
    } catch (err) {
      console.error('Failed to store contract:', err);
    }

    toast.success('Agreement signed and recorded');
    setSigning(false);
    onSigned?.(record);
    onOpenChange(false);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`<!DOCTYPE html><html><head><title>Entertainer License Agreement</title><style>@page{margin:0.75in}body{font-family:Georgia,serif;font-size:11pt;line-height:1.6;max-width:8in;margin:0 auto;padding:20px}h1{text-align:center;font-size:14pt;border-bottom:2px solid #000;padding-bottom:10px}pre{white-space:pre-wrap;font-family:Georgia,serif;font-size:11pt}.sig-block{margin-top:40px;border-top:1px solid #000;padding-top:20px}.sig-line{margin-top:30px;border-top:1px solid #000;width:300px;padding-top:5px}</style></head><body><h1>DREAM PALACE CABARET</h1><pre>${CONTRACT_TEXT}</pre><div class="sig-block"><p><strong>ENTERTAINER:</strong></p><div class="sig-line">Signature / Date / Time</div><p style="margin-top:20px"><strong>CLUB AUTHORIZED REPRESENTATIVE:</strong></p><div class="sig-line">Signature / Date / Time</div></div></body></html>`);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-purple-500/50 max-w-3xl max-h-[85vh] flex flex-col" style={{ overflow: 'visible' }}>
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Independent Entertainer License Agreement
          </DialogTitle>
        </DialogHeader>

        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 min-h-[200px] border border-slate-700 rounded-lg p-4 bg-slate-950"
          style={{ 
            overflowY: 'scroll',
            overscrollBehavior: 'contain',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(168,85,247,0.5) transparent',
            maxHeight: 'calc(40vh - 20px)',
            touchAction: 'pan-y',
            position: 'relative'
          }}
        >
          <pre className="text-slate-300 text-xs whitespace-pre-wrap font-mono leading-relaxed select-text">{CONTRACT_TEXT}</pre>
          <div className="h-12" />
        </div>

        {!scrolledToEnd && (
          <p className="text-amber-400 text-xs text-center">⬇️ Scroll to bottom to enable acknowledgments</p>
        )}

        <div className={`space-y-2 py-2 ${!scrolledToEnd ? 'opacity-50 pointer-events-none' : ''}`}>
          {[
            { key: 'independent', label: 'I acknowledge I am an INDEPENDENT CONTRACTOR, not an employee.' },
            { key: 'fees', label: 'I acknowledge all license fees are NON-REFUNDABLE.' },
            { key: 'vip', label: 'I acknowledge the 50% VIP Room License Fee structure.' },
            { key: 'arbitration', label: 'I accept BINDING ARBITRATION and WAIVE jury trial rights.' }
          ].map(({ key, label }) => (
            <div key={key} className="flex items-start gap-2 p-2 bg-slate-800/50 rounded">
              <Checkbox checked={acknowledgments[key]} onCheckedChange={(c) => setAcknowledgments(prev => ({ ...prev, [key]: c }))} disabled={!scrolledToEnd} />
              <span className="text-xs text-slate-300">{label}</span>
            </div>
          ))}
        </div>

        <div className={`space-y-2 ${!allAcknowledged ? 'opacity-50 pointer-events-none' : ''}`}>
          <Label className="text-slate-400 text-xs">Type Full Legal Name to Sign</Label>
          <Input value={signature} onChange={(e) => setSignature(e.target.value)} placeholder={entertainer?.legal_name || 'Full Legal Name'} disabled={!allAcknowledged} className="bg-slate-800 border-slate-600" />
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" onClick={handlePrint} className="border-slate-600">
            <Printer className="w-4 h-4 mr-1" />Print
          </Button>
          <Button onClick={handleSign} disabled={!canSign || signing} className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 disabled:opacity-50">
            <CheckCircle className="w-4 h-4 mr-1" />{signing ? 'Signing...' : 'I Agree & Sign'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

async function openContractDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('NUPS_Contracts', 2);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('entertainerContracts')) db.createObjectStore('entertainerContracts', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('vipContracts')) db.createObjectStore('vipContracts', { keyPath: 'id' });
    };
  });
}