import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';

export default function SecurityMonitor() {
  const [threats, setThreats] = useState([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    checkSecurity();
    const interval = setInterval(checkSecurity, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const checkSecurity = async () => {
    try {
      setIsMonitoring(true);
      const response = await base44.functions.invoke('botSecurityCheck');
      
      if (response.data?.threats?.length > 0) {
        setThreats(prev => [...response.data.threats, ...prev].slice(0, 10));
      }
    } catch (error) {
      console.error('Security monitoring error:', error);
    } finally {
      setIsMonitoring(false);
    }
  };

  // Silent monitoring - no UI for regular users
  return null;
}