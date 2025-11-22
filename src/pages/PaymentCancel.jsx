import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <Card className="glass-card border-cyan-500/30 w-full max-w-md p-6 text-center">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-white mb-4">
            <XCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
            Payment Cancelled
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-white/80 mb-6">
            Your payment was cancelled. You can try again or contact support if you need assistance.
          </p>
          <Button 
            onClick={() => navigate(createPageUrl('EnterpriseConsole'))} 
            className="bg-gradient-to-r from-[#8C4BFF] to-[#00E4FF] hover:opacity-90 text-white font-bold"
          >
            Back to Console
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}