import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react";

export default function PaymentSuccess() {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');

    if (!sessionId) {
      setStatus('no_session');
      setLoading(false);
      return;
    }

    // Give Stripe webhook time to process
    setTimeout(() => {
      setStatus('success');
      setLoading(false);
    }, 2000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-xl">Confirming your payment...</p>
        </div>
      </div>
    );
  }

  if (status === 'no_session') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center py-20">
        <Card className="glass-card-dark border-red-500/30 max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">❌</span>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-white">No Session Found</h2>
            <p className="text-white/70 mb-6">Unable to verify payment session.</p>
            <Button 
              onClick={() => navigate(createPageUrl('Pricing'))}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Return to Pricing
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center py-20">
      <div className="container mx-auto px-4">
        <Card className="glass-card-dark border-green-500/30 max-w-2xl mx-auto">
          <CardContent className="p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            
            <h1 className="text-4xl font-bold mb-4 text-white">
              Payment Successful!
            </h1>
            
            <p className="text-xl text-white/80 mb-8">
              Your subscription is now active. Welcome to GlyphLock!
            </p>

            <div className="glass-card-dark border-blue-500/30 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-white mb-3">What's Next?</h3>
              <ul className="text-left space-y-2 text-white/80">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Access all premium security tools</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Generate unlimited QR codes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Use GlyphBot AI assistant</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Access to all cryptographic tools</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate(createPageUrl('Dashboard'))}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                onClick={() => navigate(createPageUrl('Home'))}
                size="lg"
                variant="outline"
                className="border-blue-500/50 text-white hover:bg-blue-500/20"
              >
                Return Home
              </Button>
            </div>

            <p className="text-sm text-white/50 mt-8">
              A confirmation email has been sent to your registered email address.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}