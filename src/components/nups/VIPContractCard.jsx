import React, { useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, Fingerprint, PenTool, CheckCircle, Printer,
  User, Calendar, Shield, AlertTriangle
} from "lucide-react";
import { toast } from "sonner";

export default function VIPContractCard({ guest, printMode = false }) {
  const [managerName, setManagerName] = useState('');
  const [managerSignature, setManagerSignature] = useState('');
  const [thumbprintCaptured, setThumbprintCaptured] = useState(false);
  const [guestSignature, setGuestSignature] = useState('');
  const [isSigning, setIsSigning] = useState(false);
  const contractRef = useRef(null);
  const canvasRef = useRef(null);

  const contractDate = new Date().toLocaleDateString();
  const contractTime = new Date().toLocaleTimeString();

  const handleThumbprintCapture = () => {
    // Simulate thumbprint capture
    setThumbprintCaptured(true);
    toast.success('Thumbprint captured successfully');
  };

  const handleSignContract = async () => {
    if (!managerName || !managerSignature) {
      toast.error('Manager signature required');
      return;
    }
    if (!thumbprintCaptured) {
      toast.error('Guest thumbprint required');
      return;
    }

    setIsSigning(true);
    try {
      await base44.entities.VIPGuest.update(guest.id, {
        contract_signed: true,
        contract_signed_date: new Date().toISOString(),
        contract_signature: guestSignature || 'THUMBPRINT',
        manager_witness: managerName,
        manager_signature: managerSignature
      });
      toast.success('Contract signed and recorded');
    } catch (err) {
      toast.error('Failed to save contract');
    } finally {
      setIsSigning(false);
    }
  };

  const handlePrint = () => {
    const printContent = contractRef.current;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>VIP Service Agreement - ${guest?.guest_name}</title>
        <style>
          body { 
            font-family: 'Times New Roman', serif; 
            padding: 40px; 
            max-width: 800px; 
            margin: 0 auto;
            line-height: 1.6;
          }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 20px; }
          .title { font-size: 24px; font-weight: bold; }
          .subtitle { font-size: 14px; color: #666; }
          .section { margin: 20px 0; }
          .section-title { font-weight: bold; font-size: 14px; margin-bottom: 10px; border-bottom: 1px solid #ccc; }
          .clause { margin: 10px 0; padding-left: 20px; }
          .signature-box { 
            display: inline-block; 
            width: 45%; 
            border-top: 1px solid #000; 
            margin-top: 50px; 
            padding-top: 10px;
            text-align: center;
          }
          .thumbprint-box {
            width: 80px;
            height: 100px;
            border: 2px solid #000;
            display: inline-block;
            margin: 20px;
            text-align: center;
            padding-top: 35px;
          }
          .footer { margin-top: 40px; font-size: 12px; color: #666; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">VIP SERVICE AGREEMENT</div>
          <div class="subtitle">Entertainment Venue Guest Contract</div>
        </div>
        
        <div class="section">
          <strong>Guest Name:</strong> ${guest?.guest_name || '_______________'}<br>
          <strong>Member ID:</strong> ${guest?.membership_number || 'N/A'}<br>
          <strong>Date:</strong> ${contractDate}<br>
          <strong>Time:</strong> ${contractTime}
        </div>

        <div class="section">
          <div class="section-title">TERMS AND CONDITIONS</div>
          <div class="clause">1. I acknowledge that I am of legal age (21+) to enter this establishment and consume alcoholic beverages.</div>
          <div class="clause">2. I agree to conduct myself in a respectful manner toward all staff and other guests.</div>
          <div class="clause">3. I understand that all VIP services are subject to posted rates and will be charged accordingly.</div>
          <div class="clause">4. I agree to settle all charges before leaving the establishment.</div>
          <div class="clause">5. I understand that photography and recording may be prohibited in certain areas.</div>
          <div class="clause">6. I acknowledge receipt of the house rules and agree to comply with all policies.</div>
          <div class="clause">7. I release the establishment from liability for personal items brought onto the premises.</div>
        </div>

        <div class="section">
          <div class="section-title">ACKNOWLEDGMENT</div>
          <p>By signing below, I confirm that I have read, understood, and agree to all terms and conditions stated above.</p>
        </div>

        <div style="text-align: center; margin-top: 40px;">
          <div class="thumbprint-box">
            ${thumbprintCaptured ? '✓ CAPTURED' : 'THUMBPRINT'}
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; margin-top: 30px;">
          <div class="signature-box">
            <div>${guestSignature || guest?.guest_name || '_______________'}</div>
            Guest Signature
          </div>
          <div class="signature-box">
            <div>${managerSignature || '_______________'}</div>
            Manager Witness (${managerName || 'Name'})
          </div>
        </div>

        <div class="footer">
          <p>Contract ID: VIP-${guest?.id?.slice(0, 8) || 'XXXXXX'}-${Date.now()}</p>
          <p>This document is a legal agreement. Please retain a copy for your records.</p>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <Card className="bg-slate-900/50 border-purple-500/30">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-purple-400" />
          VIP Service Agreement
        </CardTitle>
        <Button onClick={handlePrint} variant="outline" size="sm" className="border-purple-500/50 text-purple-400">
          <Printer className="w-4 h-4 mr-2" />
          Print
        </Button>
      </CardHeader>
      <CardContent>
        <div ref={contractRef} className="space-y-6">
          {/* Contract Header */}
          <div className="text-center pb-4 border-b border-slate-700">
            <h2 className="text-xl font-bold text-white">VIP SERVICE AGREEMENT</h2>
            <p className="text-sm text-slate-400">Entertainment Venue Guest Contract</p>
          </div>

          {/* Guest Info */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-800/50 rounded-lg">
            <div>
              <Label className="text-slate-400 text-xs">Guest Name</Label>
              <p className="text-white font-medium">{guest?.guest_name}</p>
            </div>
            <div>
              <Label className="text-slate-400 text-xs">Member ID</Label>
              <p className="text-white font-medium">{guest?.membership_number || 'N/A'}</p>
            </div>
            <div>
              <Label className="text-slate-400 text-xs">Date</Label>
              <p className="text-white font-medium">{contractDate}</p>
            </div>
            <div>
              <Label className="text-slate-400 text-xs">Time</Label>
              <p className="text-white font-medium">{contractTime}</p>
            </div>
          </div>

          {/* Terms */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-purple-400 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              TERMS AND CONDITIONS
            </h3>
            <div className="space-y-2 text-sm text-slate-300">
              <p className="flex gap-2"><span className="text-purple-400">1.</span> I acknowledge that I am of legal age (21+) to enter this establishment.</p>
              <p className="flex gap-2"><span className="text-purple-400">2.</span> I agree to conduct myself respectfully toward all staff and guests.</p>
              <p className="flex gap-2"><span className="text-purple-400">3.</span> I understand VIP services are subject to posted rates.</p>
              <p className="flex gap-2"><span className="text-purple-400">4.</span> I agree to settle all charges before leaving.</p>
              <p className="flex gap-2"><span className="text-purple-400">5.</span> I understand photography may be prohibited in certain areas.</p>
              <p className="flex gap-2"><span className="text-purple-400">6.</span> I acknowledge receipt of house rules and agree to comply.</p>
              <p className="flex gap-2"><span className="text-purple-400">7.</span> I release the establishment from liability for personal items.</p>
            </div>
          </div>

          <Separator className="bg-slate-700" />

          {/* Signature Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
              <PenTool className="w-4 h-4" />
              SIGNATURES
            </h3>

            {/* Thumbprint Capture */}
            <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg">
              <div 
                className={`w-20 h-24 border-2 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all ${
                  thumbprintCaptured 
                    ? 'border-green-500 bg-green-500/10' 
                    : 'border-dashed border-slate-600 hover:border-amber-500'
                }`}
                onClick={handleThumbprintCapture}
              >
                {thumbprintCaptured ? (
                  <>
                    <CheckCircle className="w-8 h-8 text-green-400" />
                    <span className="text-xs text-green-400 mt-1">Captured</span>
                  </>
                ) : (
                  <>
                    <Fingerprint className="w-8 h-8 text-slate-500" />
                    <span className="text-xs text-slate-500 mt-1">Tap Here</span>
                  </>
                )}
              </div>
              <div>
                <Label className="text-white font-medium">Guest Thumbprint</Label>
                <p className="text-xs text-slate-400">Press thumb firmly on the capture area</p>
              </div>
            </div>

            {/* Guest Signature */}
            <div>
              <Label className="text-slate-400 text-xs">Guest Signature (Type Name)</Label>
              <Input
                value={guestSignature}
                onChange={(e) => setGuestSignature(e.target.value)}
                placeholder={guest?.guest_name}
                className="bg-slate-800 border-slate-600 font-cursive"
              />
            </div>

            {/* Manager Witness */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-400 text-xs">Manager Name</Label>
                <Input
                  value={managerName}
                  onChange={(e) => setManagerName(e.target.value)}
                  placeholder="Manager name"
                  className="bg-slate-800 border-slate-600"
                />
              </div>
              <div>
                <Label className="text-slate-400 text-xs">Manager Signature</Label>
                <Input
                  value={managerSignature}
                  onChange={(e) => setManagerSignature(e.target.value)}
                  placeholder="Type to sign"
                  className="bg-slate-800 border-slate-600 font-cursive"
                />
              </div>
            </div>

            {/* Contract Status */}
            {guest?.contract_signed && (
              <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-green-400 font-medium">Contract Previously Signed</p>
                  <p className="text-xs text-slate-400">
                    Signed on {new Date(guest.contract_signed_date).toLocaleDateString()} by {guest.manager_witness}
                  </p>
                </div>
              </div>
            )}

            {/* Sign Button */}
            {!printMode && (
              <Button 
                onClick={handleSignContract}
                disabled={isSigning || (!thumbprintCaptured && !guestSignature)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
              >
                {isSigning ? (
                  <>Saving...</>
                ) : (
                  <>
                    <PenTool className="w-4 h-4 mr-2" />
                    Sign & Record Contract
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Contract ID */}
          <div className="text-center text-xs text-slate-500 pt-4 border-t border-slate-700">
            <p>Contract ID: VIP-{guest?.id?.slice(0, 8) || 'XXXXXX'}-{Date.now()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}