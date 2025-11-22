import React from 'react';
import { ShieldAlert, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function EntitlementGate({ hasEntitlement, featureName, children, upgradeAction }) {
  if (hasEntitlement) {
    return <>{children}</>;
  }

  return (
    <Card className="glass-card border-purple-500/30 p-8 flex flex-col items-center justify-center text-center space-y-4">
      <ShieldAlert className="h-16 w-16 text-purple-400" />
      <h3 className="text-2xl font-bold text-white">Premium Feature Locked</h3>
      <p className="text-white/70 max-w-md">
        The <span className="font-semibold text-purple-400">{featureName}</span> feature requires an active subscription. Upgrade your plan to unlock this and other enterprise capabilities.
      </p>
      {upgradeAction && (
        <Button 
          onClick={upgradeAction} 
          className="bg-gradient-to-r from-[#8C4BFF] to-[#00E4FF] hover:opacity-90 text-white font-bold mt-4"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Upgrade Now
        </Button>
      )}
    </Card>
  );
}