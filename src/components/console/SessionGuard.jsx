import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Clock, LogOut, Shield } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const WARNING_TIME = 5 * 60 * 1000; // 5 minutes before timeout

export default function SessionGuard({ children }) {
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(SESSION_TIMEOUT);

  useEffect(() => {
    const handleActivity = () => {
      setLastActivity(Date.now());
      setShowWarning(false);
    };

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, handleActivity));

    const interval = setInterval(() => {
      const elapsed = Date.now() - lastActivity;
      const remaining = SESSION_TIMEOUT - elapsed;

      setTimeLeft(remaining);

      if (remaining <= 0) {
        handleTimeout();
      } else if (remaining <= WARNING_TIME && !showWarning) {
        setShowWarning(true);
      }
    }, 1000);

    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
      clearInterval(interval);
    };
  }, [lastActivity, showWarning]);

  const handleTimeout = async () => {
    await base44.auth.logout();
    window.location.href = '/';
  };

  const handleExtendSession = () => {
    setLastActivity(Date.now());
    setShowWarning(false);
    toast.success('Session extended');
  };

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {showWarning && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <Card className="glass-card border-yellow-500/30 shadow-lg">
            <CardHeader>
              <CardTitle className="text-yellow-400 flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                Session Timeout Warning
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-white/80 text-sm">
                Your session will expire in <span className="font-bold text-yellow-400">{formatTime(timeLeft)}</span>
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={handleExtendSession}
                  size="sm"
                  className="flex-1 bg-gradient-to-r from-[#8C4BFF] to-[#00E4FF] hover:opacity-90"
                >
                  Extend Session
                </Button>
                <Button
                  onClick={handleTimeout}
                  size="sm"
                  variant="outline"
                  className="border-red-500/30 text-red-400"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      {children}
    </>
  );
}

export function ReauthModal({ isOpen, onClose, onConfirm, action }) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // In production, this would verify password
      // For now, just simulate delay
      await new Promise(resolve => setTimeout(resolve, 500));
      onConfirm();
      onClose();
      toast.success('Action authorized');
    } catch (error) {
      toast.error('Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="glass-card border-red-500/30 max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-red-400 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Re-authentication Required
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="text-white/80 text-sm">
                  <p className="font-semibold text-white mb-1">Sensitive Action</p>
                  <p>You are about to: <span className="font-bold text-red-400">{action}</span></p>
                  <p className="mt-2">Please confirm your password to continue.</p>
                </div>
              </div>
            </div>
            
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="glass-card border-white/10 text-white"
              required
            />

            <div className="flex gap-3">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="flex-1 border-white/10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !password}
                className="flex-1 bg-gradient-to-r from-[#8C4BFF] to-[#00E4FF] hover:opacity-90"
              >
                {loading ? 'Verifying...' : 'Confirm'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}