import React from 'react';
import { Users, TrendingUp, Crown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function SharedSeatGate({ 
  currentSeats, 
  maxSeats, 
  planName, 
  onUpgrade,
  children 
}) {
  const seatsExceeded = currentSeats >= maxSeats;
  const seatsWarning = currentSeats >= maxSeats * 0.8;

  if (!seatsExceeded) {
    return <>{children}</>;
  }

  return (
    <Card className="glass-card border-yellow-500/30">
      <CardHeader>
        <CardTitle className="text-yellow-400 flex items-center gap-2">
          <Users className="h-5 w-5" />
          Seat Limit Reached
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-white/80">
          <p className="mb-2">
            You've reached your seat limit of <span className="font-bold text-white">{maxSeats}</span> on the{' '}
            <span className="font-semibold text-yellow-400">{planName}</span> plan.
          </p>
          <p className="text-sm text-white/60">
            Current seats: {currentSeats} / {maxSeats}
          </p>
        </div>

        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
            <Crown className="h-4 w-4 text-purple-400" />
            Upgrade to add more team members
          </h4>
          <p className="text-white/70 text-sm mb-4">
            Enterprise plan includes unlimited seats, priority support, and advanced features.
          </p>
          <Button
            onClick={onUpgrade}
            className="w-full bg-gradient-to-r from-[#8C4BFF] to-[#00E4FF] hover:opacity-90"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            View Upgrade Options
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function SeatWarningBanner({ currentSeats, maxSeats }) {
  const percentage = (currentSeats / maxSeats) * 100;
  
  if (percentage < 80) return null;

  return (
    <div className="mb-4 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
      <div className="flex items-center gap-3">
        <Users className="h-5 w-5 text-yellow-400" />
        <div className="flex-1">
          <p className="text-white font-medium">
            Approaching seat limit
          </p>
          <p className="text-white/70 text-sm">
            {currentSeats} / {maxSeats} seats used ({percentage.toFixed(0)}%)
          </p>
        </div>
      </div>
    </div>
  );
}