import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FieldError } from './validationErrors';

/**
 * Mobile Field Renderer
 * Explicit field rendering with touch-friendly spacing
 * NO HIDDEN FIELDS. NO ICON-ONLY LABELS. NO GUESSING.
 */

const TOUCH_TARGET_SIZE = "min-h-[48px]"; // 48px minimum for mobile touch targets

export function MobileTextField({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  required = false,
  error = null,
  disabled = false
}) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-white mb-2">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`${TOUCH_TARGET_SIZE} bg-white/5 border-blue-500/20 text-white text-base`}
      />
      {error && <FieldError error={error} />}
    </div>
  );
}

export function MobileTextArea({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  error = null,
  disabled = false,
  rows = 4
}) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-white mb-2">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className="bg-white/5 border-blue-500/20 text-white text-base min-h-[120px]"
      />
      {error && <FieldError error={error} />}
    </div>
  );
}

export function MobileSelectField({
  label,
  value,
  onChange,
  options,
  required = false,
  error = null,
  disabled = false,
  placeholder = "Select..."
}) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-white mb-2">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className={`${TOUCH_TARGET_SIZE} bg-white/5 border-blue-500/20 text-white text-base`}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <FieldError error={error} />}
    </div>
  );
}

/**
 * Required fields for BuilderActionLog - ALWAYS VISIBLE
 */
export const REQUIRED_FIELDS = [
  {
    name: 'timestamp',
    label: 'Timestamp',
    type: 'text',
    required: true,
    description: 'When the action occurred (ISO 8601 format)'
  },
  {
    name: 'actor',
    label: 'Actor',
    type: 'text',
    required: true,
    description: 'Email of user performing action'
  },
  {
    name: 'action',
    label: 'Action Type',
    type: 'select',
    required: true,
    options: [
      { value: 'analyze', label: 'Analyze' },
      { value: 'propose', label: 'Propose' },
      { value: 'modify', label: 'Modify' },
      { value: 'delete', label: 'Delete' },
      { value: 'rollback', label: 'Rollback' },
      { value: 'backup', label: 'Backup' }
    ],
    description: 'Type of operation'
  },
  {
    name: 'filePath',
    label: 'File Path',
    type: 'text',
    required: true,
    description: 'Path of affected file'
  }
];

/**
 * Optional fields - ALWAYS RENDERED, just marked optional
 */
export const OPTIONAL_FIELDS = [
  {
    name: 'hashBefore',
    label: 'Hash Before',
    type: 'text',
    description: 'SHA-256 hash before change'
  },
  {
    name: 'hashAfter',
    label: 'Hash After',
    type: 'text',
    description: 'SHA-256 hash after change'
  },
  {
    name: 'diffSummary',
    label: 'Change Summary',
    type: 'textarea',
    description: 'Human-readable change description'
  },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'pending', label: 'Pending' },
      { value: 'approved', label: 'Approved' },
      { value: 'rejected', label: 'Rejected' },
      { value: 'applied', label: 'Applied' },
      { value: 'failed', label: 'Failed' }
    ],
    description: 'Current status'
  },
  {
    name: 'errorMessage',
    label: 'Error Message',
    type: 'textarea',
    description: 'Error details if failed'
  }
];