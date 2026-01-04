/**
 * MFA Setup Modal
 * Guides users through enabling authenticator app MFA
 */

import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, Download, Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import MFAHelpAssistant from './MFAHelpAssistant';

export default function MFASetupModal({ isOpen, onClose, onSuccess }) {
  const [step, setStep] = useState('qr'); // 'qr' | 'verify' | 'codes'
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [manualKey, setManualKey] = useState('');
  const [setupToken, setSetupToken] = useState(''); // Encrypted time-bound token
  const [expiresIn, setExpiresIn] = useState(0);
  const [verificationCode, setVerificationCode] = useState('');
  const [recoveryCodes, setRecoveryCodes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(0);

  React.useEffect(() => {
    if (isOpen && step === 'qr') {
      initializeSetup();
    }
  }, [isOpen]);

  const initializeSetup = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await base44.functions.invoke('mfaSetup', {});
      
      setQrCodeDataUrl(response.data.qrCodeDataUrl);
      setManualKey(response.data.manualKey);
      setTempSecret(response.data.tempSecret);
    } catch (err) {
      setError(err.message || 'Failed to initialize MFA setup');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (verificationCode.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await base44.functions.invoke('mfaVerifySetup', {
        code: verificationCode,
        tempSecret
      });

      setRecoveryCodes(response.data.recoveryCodes);
      setStep('codes');
    } catch (err) {
      setError(err.message || 'Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const copyRecoveryCodes = () => {
    const text = recoveryCodes.join('\n');
    navigator.clipboard.writeText(text);
    toast.success('Recovery codes copied to clipboard');
  };

  const downloadRecoveryCodes = () => {
    const text = `GlyphLock MFA Recovery Codes\n\nGenerated: ${new Date().toLocaleString()}\n\n${recoveryCodes.join('\n')}\n\nStore these codes securely. Each can only be used once.`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'glyphlock-recovery-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Recovery codes downloaded');
  };

  const handleComplete = () => {
    onSuccess();
    onClose();
    setStep('qr');
    setVerificationCode('');
    setRecoveryCodes([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-slate-900 border-purple-500/30">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Shield className="w-5 h-5 text-cyan-400" />
            Enable Authenticator App
          </DialogTitle>
          <DialogDescription>
            {step === 'qr' && 'Secure your account with 2-step verification'}
            {step === 'verify' && 'Verify your authenticator app'}
            {step === 'codes' && 'Backup your emergency recovery codes'}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {step === 'qr' && (
          <div className="space-y-4">
            <MFAHelpAssistant step="qr" />
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400" />
              </div>
            ) : (
              <>
                <div className="flex justify-center p-4 bg-white rounded-lg">
                  {qrCodeDataUrl && (
                    <img src={qrCodeDataUrl} alt="MFA QR Code" className="w-64 h-64" />
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-slate-400">Manual entry key:</p>
                  <div className="flex gap-2">
                    <Input
                      value={manualKey}
                      readOnly
                      className="font-mono text-xs"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(manualKey);
                        toast.success('Key copied');
                      }}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 space-y-2">
                  <p className="text-sm font-medium text-blue-200">
                    1. Download an authenticator app
                  </p>
                  <p className="text-xs text-blue-300">
                    We recommend <strong>Google Authenticator</strong> or <strong>Authy</strong>.
                    Available on iOS and Android app stores.
                  </p>
                  <p className="text-sm font-medium text-blue-200 pt-2">
                    2. Scan the QR code
                  </p>
                  <p className="text-xs text-blue-300">
                    Open the app and tap the "+" or "Add Account" button, then choose "Scan QR Code".
                  </p>
                </div>

                <Button
                  onClick={() => setStep('verify')}
                  className="w-full bg-gradient-to-r from-cyan-600 to-blue-600"
                  disabled={!qrCodeDataUrl}
                >
                  Continue
                </Button>
              </>
            )}
          </div>
        )}

        {step === 'verify' && (
          <div className="space-y-4">
            <MFAHelpAssistant step="verify" />
            <div className="space-y-2">
              <label className="text-sm font-medium">Verification Code</label>
              <Input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                className="text-center text-2xl tracking-widest"
                autoFocus
              />
              <p className="text-xs text-slate-400">
                Enter the 6-digit code from your authenticator app
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setStep('qr')}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleVerify}
                disabled={isLoading || verificationCode.length !== 6}
                className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600"
              >
                {isLoading ? 'Verifying...' : 'Verify & Enable'}
              </Button>
            </div>
          </div>
        )}

        {step === 'codes' && (
          <div className="space-y-4">
            <MFAHelpAssistant step="codes" />
            <Alert className="bg-amber-500/10 border-amber-500/30">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <AlertDescription className="text-amber-200">
                Save these recovery codes in a secure location. Each code can only be used once.
              </AlertDescription>
            </Alert>

            <div className="bg-slate-800 rounded-lg p-4 max-h-64 overflow-y-auto">
              <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                {recoveryCodes.map((code, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-slate-900 rounded">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    <span>{code}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={copyRecoveryCodes}
                className="flex-1"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button
                variant="outline"
                onClick={downloadRecoveryCodes}
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>

            <Button
              onClick={handleComplete}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              I've Saved My Codes
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}