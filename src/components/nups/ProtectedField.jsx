/**
 * PROTECTED FIELD COMPONENT
 * Hides or masks sensitive fields based on user role
 */

import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Lock, EyeOff } from 'lucide-react';

// Role hierarchy: STAFF=1, MANAGER=2, ADMIN=3
const ROLE_LEVELS = {
  'user': 1,
  'staff': 1,
  'manager': 2,
  'admin': 3
};

function getRoleLevel(role) {
  return ROLE_LEVELS[role?.toLowerCase()] || 0;
}

export default function ProtectedField({ 
  children, 
  requireRole = 'admin',
  mask = false,
  maskChar = '•',
  maskLength = 8,
  fallback = null,
  showLockIcon = true
}) {
  const { data: user } = useQuery({
    queryKey: ['current-user-role'],
    queryFn: async () => {
      try {
        return await base44.auth.me();
      } catch {
        return null;
      }
    },
    staleTime: 60000
  });

  const userLevel = getRoleLevel(user?.role);
  const requiredLevel = getRoleLevel(requireRole);
  const hasAccess = userLevel >= requiredLevel;

  if (hasAccess) {
    return <>{children}</>;
  }

  if (mask) {
    return (
      <span className="inline-flex items-center gap-1 text-slate-500 font-mono">
        {maskChar.repeat(maskLength)}
        {showLockIcon && <Lock className="w-3 h-3 text-slate-600" />}
      </span>
    );
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <span className="inline-flex items-center gap-1 text-slate-500 text-sm italic">
      <EyeOff className="w-3 h-3" />
      <span>Restricted</span>
    </span>
  );
}

// Hook for checking permissions
export function useAccessControl() {
  const { data: user } = useQuery({
    queryKey: ['current-user-role'],
    queryFn: async () => {
      try {
        return await base44.auth.me();
      } catch {
        return null;
      }
    },
    staleTime: 60000
  });

  const userLevel = getRoleLevel(user?.role);

  return {
    user,
    userRole: user?.role || 'guest',
    isAdmin: user?.role === 'admin',
    isManager: userLevel >= 2,
    isStaff: userLevel >= 1,
    canAccess: (role) => userLevel >= getRoleLevel(role),
    canExport: () => userLevel >= 2,
    canViewSensitive: () => userLevel >= 3
  };
}

// Wrapper for entire sections
export function ProtectedSection({ children, requireRole = 'admin', fallbackMessage = 'Access restricted' }) {
  const { canAccess } = useAccessControl();

  if (!canAccess(requireRole)) {
    return (
      <div className="p-6 bg-slate-800/30 border border-slate-700 rounded-lg text-center">
        <Lock className="w-8 h-8 text-slate-500 mx-auto mb-2" />
        <p className="text-slate-400">{fallbackMessage}</p>
        <p className="text-xs text-slate-500 mt-1">Requires {requireRole} access</p>
      </div>
    );
  }

  return <>{children}</>;
}