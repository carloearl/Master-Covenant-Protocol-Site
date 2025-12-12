import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, Loader2, Clock } from 'lucide-react';

export default function StatusBar({ status, busy, selectedFile }) {
  const getStatusIcon = () => {
    if (busy) return <Loader2 className="w-3 h-3 animate-spin text-blue-400" />;
    if (status.includes('Error') || status.includes('Failed')) return <AlertCircle className="w-3 h-3 text-red-400" />;
    if (status.includes('Success') || status.includes('complete')) return <CheckCircle2 className="w-3 h-3 text-green-400" />;
    return <Clock className="w-3 h-3 text-slate-400" />;
  };

  const getStatusColor = () => {
    if (busy) return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
    if (status.includes('Error') || status.includes('Failed')) return 'bg-red-500/20 text-red-400 border-red-500/50';
    if (status.includes('Success') || status.includes('complete')) return 'bg-green-500/20 text-green-400 border-green-500/50';
    return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
  };

  return (
    <div className="flex items-center justify-between p-2 bg-slate-900 border-t border-slate-800">
      <div className="flex items-center gap-2">
        <Badge className={getStatusColor()}>
          {getStatusIcon()}
          <span className="ml-1.5 text-xs">{status}</span>
        </Badge>
        {selectedFile && (
          <span className="text-xs text-slate-500">
            📄 {selectedFile}
          </span>
        )}
      </div>
      <div className="text-xs text-slate-500">
        Dev Engine v2.0
      </div>
    </div>
  );
}