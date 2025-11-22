import React from 'react';
import { ShieldAlert, Lock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import RoleRules from './SharedRoleRules';

const ROLE_HIERARCHY = {
  'viewer': 0,
  'member': 1,
  'admin': 2,
  'owner': 3
};

export default function RoleGate({ userRole, requiredRole = 'admin', children }) {
  const userLevel = ROLE_HIERARCHY[userRole?.toLowerCase()] || 0;
  const requiredLevel = ROLE_HIERARCHY[requiredRole?.toLowerCase()] || 0;

  // Use shared role rules for admin permission checks
  if (requiredRole === 'admin' && !RoleRules.canPerformAdminAction(userRole)) {
    return (
      <Card className="glass-card border-red-500/30 p-8 flex flex-col items-center justify-center text-center space-y-4">
        <Lock className="h-16 w-16 text-red-400" />
        <h3 className="text-2xl font-bold text-white">Admin Access Required</h3>
        <p className="text-white/70 max-w-md">
          This section requires administrator privileges. Contact your organization owner for access.
        </p>
      </Card>
    );
  }

  if (userLevel >= requiredLevel) {
    return <>{children}</>;
  }

  return (
    <Card className="glass-card border-red-500/30 p-8 flex flex-col items-center justify-center text-center space-y-4">
      <Lock className="h-16 w-16 text-red-400" />
      <h3 className="text-2xl font-bold text-white">Insufficient Permissions</h3>
      <p className="text-white/70 max-w-md">
        This section requires <span className="font-semibold text-red-400">{requiredRole}</span> role or higher. 
        Contact your organization owner to request access.
      </p>
    </Card>
  );
}