import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

/**
 * Dev Engine - Get File Content
 * Returns the content of a specific file for viewing in Monaco
 * ADMIN ONLY
 */

// Sanitize and validate file paths
function sanitizePath(filePath) {
  // Remove leading/trailing slashes and whitespace
  const clean = filePath.trim().replace(/^\/+|\/+$/g, '');
  
  // Block dangerous paths
  const forbidden = [
    'node_modules',
    '.env',
    '.git',
    'backups',
    'secrets',
    'config',
    'deployment'
  ];
  
  if (forbidden.some(f => clean.includes(f))) {
    throw new Error('Access denied: forbidden directory');
  }
  
  // Prevent path traversal
  if (clean.includes('..') || clean.includes('~')) {
    throw new Error('Access denied: invalid path');
  }
  
  // Ensure it's in an allowed directory
  const allowedDirs = ['pages', 'components', 'functions', 'entities', 'utils', 'lib'];
  const firstDir = clean.split('/')[0];
  
  if (!allowedDirs.includes(firstDir)) {
    throw new Error('Access denied: directory not whitelisted');
  }
  
  return clean;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    // Admin check
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { filePath } = await req.json();
    
    if (!filePath) {
      return Response.json({ error: 'filePath required' }, { status: 400 });
    }

    // Sanitize path
    const safePath = sanitizePath(filePath);

    // In a real implementation, this would read from the actual file system
    // For now, we'll simulate reading from a knowledge base
    // In production, use Deno.readTextFile or similar with proper permissions
    
    const mockContent = `// File: ${safePath}
// This is a placeholder. In production, this would read the actual file.

// TODO: Implement actual file reading with Deno.readTextFile
// or via Base44's file storage API

export default function Placeholder() {
  return <div>File content for {safePath}</div>;
}
`;

    // SCHEMA VALIDATION - Log access
    const logEntry = {
      timestamp: new Date().toISOString(),
      actor: user.email,
      action: 'analyze',
      filePath: safePath,
      diffSummary: `Viewed file: ${safePath}`,
      status: 'applied'
    };

    // Validate required fields
    if (!logEntry.timestamp || !logEntry.actor || !logEntry.action || !logEntry.filePath) {
      throw new Error('SCHEMA VIOLATION: Missing required fields in file view log');
    }

    await base44.asServiceRole.entities.BuilderActionLog.create(logEntry);

    return Response.json({
      success: true,
      filePath: safePath,
      content: mockContent,
      language: safePath.endsWith('.json') ? 'json' : 
                safePath.endsWith('.css') ? 'css' : 'javascript',
      readOnly: true,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('File content error:', error);
    return Response.json({
      error: error.message
    }, { status: error.message.includes('Access denied') ? 403 : 500 });
  }
});