import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState('pending');
  const [message, setMessage] = useState('Verifying your payment...');

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const sessionId = query.get('session_id');

    if (sessionId) {
      base44.functions.invoke('stripePoll', { sessionId })
        .then(response => {
          if (response.data.status === 'active' || response.data.status === 'complete' || response.data.status === 'trialing') {
            setStatus('success');
            setMessage('Your payment was successful and your subscription/purchase is active!');
          } else {
            setStatus('failed');
            setMessage('Payment verification failed or is still pending. Please check your billing dashboard.');
          }
        })
        .catch(error => {
          console.error("Error polling Stripe session:", error);
          setStatus('failed');
          setMessage('An error occurred while verifying your payment. Please contact support.');
        });
    } else {
      setStatus('failed');
      setMessage('No payment session ID found. This page should only be accessed after a Stripe checkout.');
    }
  }, [location.search]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <Card className="glass-card border-cyan-500/30 w-full max-w-md p-6 text-center">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-white mb-4">
            {status === 'pending' && <Loader2 className="h-10 w-10 animate-spin text-cyan-400 mx-auto mb-4" />}
            {status === 'success' && <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-4" />}
            {status === 'failed' && <XCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />}
            {status === 'success' ? 'Payment Successful!' : 'Payment Status'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-white/80 mb-6">{message}</p>
          <Button 
            onClick={() => navigate(createPageUrl('EnterpriseConsole'))} 
            className="bg-gradient-to-r from-[#8C4BFF] to-[#00E4FF] hover:opacity-90 text-white font-bold"
          >
            Go to Console
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}