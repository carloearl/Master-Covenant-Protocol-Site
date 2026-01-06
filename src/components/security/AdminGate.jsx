/**
 * ADMIN GATE - Role-Based Access Control
 * Restricts page access to admin users only
 * Non-admin users are redirected to Home
 */

import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Shield, Loader2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminGate({ children, pageName = 'this page' }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (!isAuth) {
          navigate(createPageUrl('Home'));
          return;
        }
        const userData = await base44.auth.me();
        setUser(userData);
        
        // Non-admin redirect
        if (userData?.role !== 'admin') {
          navigate(createPageUrl('Home'));
        }
      } catch (err) {
        console.error('AdminGate auth check failed:', err);
        navigate(createPageUrl('Home'));
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
            <Lock className="w-10 h-10 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400 mb-6">
            {pageName} requires administrator privileges.
          </p>
          <Button 
            onClick={() => navigate(createPageUrl('Home'))}
            className="bg-cyan-600 hover:bg-cyan-700"
          >
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// SEO helper to prevent indexing of admin pages
export function AdminPageMeta() {
  useEffect(() => {
    // Add noindex meta tag
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'robots';
      document.head.appendChild(meta);
    }
    meta.content = 'noindex, nofollow';

    return () => {
      // Restore on unmount
      if (meta) meta.content = 'index, follow';
    };
  }, []);

  return null;
}