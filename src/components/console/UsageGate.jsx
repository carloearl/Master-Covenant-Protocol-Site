import React from 'react';
import { AlertTriangle, TrendingUp, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function UsageGate({ 
  currentUsage, 
  limit, 
  resourceName,
  onUpgrade,
  children 
}) {
  const limitReached = currentUsage >= limit;
  const percentage = (currentUsage / limit) * 100;

  if (!limitReached) {
    return <>{children}</>;
  }

  return (
    <Card className="glass-card border-red-500/30">
      <CardHeader>
        <CardTitle className="text-red-400 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Usage Limit Reached
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-white/80">
          <p className="mb-2">
            You've reached your monthly limit for{' '}
            <span className="font-bold text-white">{resourceName}</span>.
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Current usage</span>
              <span className="font-bold text-white">{currentUsage.toLocaleString()} / {limit.toLocaleString()}</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-500 to-red-600"
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
            <Zap className="h-4 w-4 text-purple-400" />
            Upgrade for higher limits
          </h4>
          <p className="text-white/70 text-sm mb-4">
            Get unlimited {resourceName.toLowerCase()} and unlock all premium features.
          </p>
          <Button
            onClick={onUpgrade}
            className="w-full bg-gradient-to-r from-[#8C4BFF] to-[#00E4FF] hover:opacity-90"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            View Plans
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function UsageWarningBanner({ currentUsage, limit, resourceName }) {
  const percentage = (currentUsage / limit) * 100;
  
  if (percentage < 80) return null;

  const statusColor = percentage >= 95 ? 'red' : percentage >= 90 ? 'orange' : 'yellow';

  return (
    <div className={`mb-4 p-4 rounded-lg bg-${statusColor}-500/10 border border-${statusColor}-500/30`}>
      <div className="flex items-center gap-3">
        <AlertTriangle className={`h-5 w-5 text-${statusColor}-400`} />
        <div className="flex-1">
          <p className="text-white font-medium">
            {percentage >= 95 ? 'Critical' : 'Approaching'} usage limit for {resourceName}
          </p>
          <p className="text-white/70 text-sm">
            {currentUsage.toLocaleString()} / {limit.toLocaleString()} used ({percentage.toFixed(0)}%)
          </p>
        </div>
      </div>
    </div>
  );
}