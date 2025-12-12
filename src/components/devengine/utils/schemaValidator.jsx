/**
 * Schema Validator - Single Source of Truth
 * Enforces BuilderActionLog schema across all platforms
 * NO GUESSING. NO DEFAULTS. EXPLICIT VALUES ONLY.
 */

export const BuilderActionLogSchema = {
  name: "BuilderActionLog",
  required: ["timestamp", "actor", "action", "filePath"],
  properties: {
    timestamp: { type: "string", format: "date-time" },
    actor: { type: "string", description: "User email" },
    action: { 
      type: "string", 
      enum: ["analyze", "propose", "modify", "delete", "rollback", "backup"],
      description: "Operation type"
    },
    filePath: { type: "string", description: "Target file path" },
    hashBefore: { type: "string", optional: true },
    hashAfter: { type: "string", optional: true },
    diffSummary: { type: "string", optional: true },
    approved: { type: "boolean", optional: true },
    approvedBy: { type: "string", optional: true },
    rollbackAvailable: { type: "boolean", optional: true },
    backupPath: { type: "string", optional: true },
    status: { 
      type: "string", 
      enum: ["pending", "approved", "rejected", "applied", "failed"],
      optional: true 
    },
    errorMessage: { type: "string", optional: true }
  }
};

/**
 * Validate data against schema
 * Returns { valid: boolean, errors: string[] }
 */
export function validateBuilderActionLog(data) {
  const errors = [];

  // Check required fields
  BuilderActionLogSchema.required.forEach(field => {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      errors.push(`REQUIRED FIELD MISSING: ${field}`);
    }
  });

  // Validate action enum
  if (data.action && !BuilderActionLogSchema.properties.action.enum.includes(data.action)) {
    errors.push(`INVALID ACTION: "${data.action}". Must be one of: ${BuilderActionLogSchema.properties.action.enum.join(', ')}`);
  }

  // Validate status enum (if provided)
  if (data.status && !BuilderActionLogSchema.properties.status.enum.includes(data.status)) {
    errors.push(`INVALID STATUS: "${data.status}". Must be one of: ${BuilderActionLogSchema.properties.status.enum.join(', ')}`);
  }

  // Validate timestamp format
  if (data.timestamp && isNaN(Date.parse(data.timestamp))) {
    errors.push(`INVALID TIMESTAMP: "${data.timestamp}". Must be ISO 8601 format.`);
  }

  return {
    valid: errors.length === 0,
    errors: errors
  };
}

/**
 * Get human-readable error message
 */
export function formatValidationError(errors) {
  if (!errors || errors.length === 0) return null;
  
  return `Schema Validation Failed:\n${errors.map(e => `• ${e}`).join('\n')}`;
}

/**
 * Assert valid or throw
 * Use in backend functions to enforce validation
 */
export function assertValidBuilderActionLog(data) {
  const validation = validateBuilderActionLog(data);
  if (!validation.valid) {
    throw new Error(formatValidationError(validation.errors));
  }
}