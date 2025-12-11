/**
 * MFA Verification Modal
 * Challenges user for TOTP or recovery code during login
 */

import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Key, AlertTriangle } from 'lucide-react';

export default function MFAVerifyModal({ isOpen, onSuccess }) {
  const [mode, setMode] = useState('totp'); // 'totp' | 'recovery'
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    if (!code) {
      setError('Please enter a code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const payload = mode === 'totp' 
        ? { totpCode: code }
        : { recoveryCode: code };

      await base44.functions.invoke('mfaVerifyLogin', payload);
      
      setCode('');
      onSuccess();
    } catch (err) {
      setError(err.message || 'Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && code) {
      handleVerify();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md bg-slate-900 border-purple-500/30" hideClose>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Shield className="w-5 h-5 text-cyan-400" />
            Verification Required
          </DialogTitle>
          <DialogDescription>
            {mode === 'totp' 
              ? 'Enter the 6-digit code from your authenticator app'
              : 'Enter one of your recovery codes'}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {mode === 'totp' ? 'Authenticator Code' : 'Recovery Code'}
            </label>
            <Input
              type="text"
              inputMode={mode === 'totp' ? 'numeric' : 'text'}
              maxLength={mode === 'totp' ? 6 : 10}
              placeholder={mode === 'totp' ? '000000' : 'XXXXXXXXXX'}
              value={code}
              onChange={(e) => setCode(
                mode === 'totp' 
                  ? e.target.value.replace(/\D/g, '')
                  : e.target.value.toUpperCase()
              )}
              onKeyPress={handleKeyPress}
              className={`text-center ${mode === 'totp' ? 'text-2xl tracking-widest' : 'text-lg tracking-wider font-mono'}`}
              autoFocus
            />
          </div>

          <Button
            onClick={handleVerify}
            disabled={isLoading || !code}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600"
          >
            {isLoading ? 'Verifying...' : 'Verify'}
          </Button>

          <button
            onClick={() => {
              setMode(mode === 'totp' ? 'recovery' : 'totp');
              setCode('');
              setError('');
            }}
            className="w-full text-sm text-cyan-400 hover:text-cyan-300 flex items-center justify-center gap-2"
          >
            <Key className="w-4 h-4" />
            {mode === 'totp' ? 'Use a recovery code instead' : 'Use authenticator app'}
          </button>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
            <p className="text-xs text-blue-300">
              {mode === 'totp' 
                ? 'This code changes every 30 seconds'
                : 'Each recovery code can only be used once'}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}