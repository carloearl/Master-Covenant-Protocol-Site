import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

/**
 * Validation Error Display Component
 * Shows schema validation failures to users
 */
export function ValidationErrorAlert({ errors }) {
  if (!errors || errors.length === 0) return null;

  return (
    <Alert variant="destructive" className="mb-4 bg-red-500/10 border-red-500/50">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        <div className="font-semibold mb-2">Schema Validation Failed</div>
        <ul className="list-disc pl-4 space-y-1">
          {errors.map((error, idx) => (
            <li key={idx} className="text-xs">{error}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}

/**
 * Inline field error display
 */
export function FieldError({ error }) {
  if (!error) return null;
  
  return (
    <div className="flex items-center gap-1 text-red-400 text-xs mt-1">
      <AlertTriangle className="w-3 h-3" />
      <span>{error}</span>
    </div>
  );
}