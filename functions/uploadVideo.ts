import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Validate user is authenticated
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the file from form data
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate it's an MP4
    if (!file.type.includes('video/mp4') && !file.name.endsWith('.mp4')) {
      return Response.json({ error: 'Only MP4 files are allowed' }, { status: 400 });
    }

    // Upload file using Base44 integration
    const result = await base44.integrations.Core.UploadFile({ file });

    return Response.json({
      success: true,
      file_url: result.file_url,
      message: 'Video uploaded successfully'
    });

  } catch (error) {
    console.error('[uploadVideo] Error:', error);
    return Response.json({ 
      error: error.message || 'Upload failed' 
    }, { status: 500 });
  }
});