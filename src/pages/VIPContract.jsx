import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Shield, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function VIPContract() {
  const [signature, setSignature] = useState("");
  const [guestName, setGuestName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const contractToken = urlParams.get('token');
    if (contractToken) {
      setToken(contractToken);
    } else {
      setError('Invalid contract link');
    }
  }, []);

  const contractText = `VIP SHOW CONTRACT

TERMS AND CONDITIONS:

1. This contract grants access to VIP services for the duration specified.
2. Payment must be settled before leaving the premises.
3. All venue rules and regulations must be followed.
4. Recording or photography is strictly prohibited.
5. The venue reserves the right to terminate service for policy violations.

By signing below, you acknowledge and agree to these terms.

This digital signature is legally binding and will be cryptographically verified.`;

  const handleSign = async (e) => {
    e.preventDefault();
    if (!signature.trim() || !guestName.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await base44.functions.invoke('vipContractSign', {
        token,
        signature,
        guest_name: guestName
      });

      if (response.data.success) {
        setSuccess(true);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Contract signing failed');
    } finally {
      setLoading(false);
    }
  };

  if (error && !token) {
    return (
      <div className="min-h-screen bg-glyphlock-dark text-glyphlock-primary flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-glyphlock-off-dark border-red-500/30">
          <CardContent className="p-12 text-center">
            <AlertTriangle className="w-20 h-20 text-red-400 mx-auto mb-6" />
            <h1 className="text-2xl font-bold mb-4 text-glyphlock-primary">Invalid Contract Link</h1>
            <p className="text-glyphlock-secondary">
              This contract link is invalid or has expired.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-glyphlock-dark text-glyphlock-primary flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-glyphlock-off-dark border-glyphlock-brand">
          <CardContent className="p-12 text-center">
            <CheckCircle2 className="w-20 h-20 text-green-400 mx-auto mb-6" />
            <h1 className="text-2xl font-bold mb-4 text-glyphlock-primary">Contract Signed!</h1>
            <p className="text-glyphlock-secondary mb-6">
              Welcome to VIP. Your signature has been verified and recorded.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-glyphlock-dark text-glyphlock-primary py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <Shield className="w-16 h-16 text-glyphlock-brand mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2 text-glyphlock-primary">VIP Contract</h1>
          <p className="text-glyphlock-secondary">Secure Digital Signature Required</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSign} className="space-y-6">
          <Card className="bg-glyphlock-off-dark border-gray-700">
            <CardHeader>
              <CardTitle className="text-glyphlock-primary">Contract Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={contractText}
                readOnly
                rows={14}
                className="bg-gray-800 border-gray-600 text-glyphlock-primary font-mono text-sm"
              />
            </CardContent>
          </Card>

          <Card className="bg-glyphlock-off-dark border-gray-700">
            <CardHeader>
              <CardTitle className="text-glyphlock-primary">Sign Contract</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-glyphlock-primary">Full Name</Label>
                <Input
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Enter your full name"
                  className="bg-gray-800 border-gray-600 text-glyphlock-primary"
                  required
                />
              </div>

              <div>
                <Label className="text-glyphlock-primary">Digital Signature (Type Name Again)</Label>
                <Input
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  placeholder="Type your full name to sign"
                  className="bg-gray-800 border-gray-600 text-glyphlock-primary"
                  required
                />
              </div>

              <div className="text-xs text-glyphlock-secondary">
                <p>By signing, you acknowledge that:</p>
                <ul className="list-disc ml-5 mt-2 space-y-1">
                  <li>Your signature will be cryptographically timestamped</li>
                  <li>Your IP address will be logged for verification</li>
                  <li>This signature is legally binding</li>
                </ul>
              </div>

              <Button
                type="submit"
                disabled={loading || !signature.trim() || !guestName.trim()}
                className="btn-primary-glyphlock w-full"
              >
                {loading ? 'Processing...' : 'Sign & Agree'}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}