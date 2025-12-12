import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

/**
 * Dev Engine - Get File Tree
 * Returns the project structure for the file explorer
 * ADMIN ONLY
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    // Admin check
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Define allowed directories (whitelist)
    const allowedDirs = [
      'pages',
      'components',
      'functions',
      'entities',
      'utils',
      'lib'
    ];

    // Build virtual file tree structure
    const fileTree = {
      name: 'glyphlock.io',
      type: 'directory',
      path: '/',
      children: allowedDirs.map(dir => ({
        name: dir,
        type: 'directory',
        path: `/${dir}`,
        children: [] // Populate on expand
      }))
    };

    // SCHEMA VALIDATION - Log access
    const logEntry = {
      timestamp: new Date().toISOString(),
      actor: user.email,
      action: 'analyze',
      filePath: '/',
      diffSummary: 'Accessed file tree',
      status: 'applied'
    };

    // Validate required fields
    if (!logEntry.timestamp || !logEntry.actor || !logEntry.action || !logEntry.filePath) {
      throw new Error('SCHEMA VIOLATION: Missing required fields in tree access log');
    }

    await base44.asServiceRole.entities.BuilderActionLog.create(logEntry);

    return Response.json({
      success: true,
      tree: fileTree,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('File tree error:', error);
    return Response.json({
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
});