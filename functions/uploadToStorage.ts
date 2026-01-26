import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file');
    const module = formData.get('module') || 'general';
    const referenceId = formData.get('reference_id');
    const tags = formData.get('tags') ? JSON.parse(formData.get('tags')) : [];
    const isPublic = formData.get('is_public') === 'true';

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    // Upload file to Base44 storage
    const uploadResult = await base44.integrations.Core.UploadFile({ file });
    
    if (!uploadResult?.file_url) {
      return Response.json({ error: 'Upload failed' }, { status: 500 });
    }

    // Save to FileStorage entity for centralized tracking
    const fileRecord = await base44.entities.FileStorage.create({
      file_name: file.name,
      file_url: uploadResult.file_url,
      file_type: module,
      file_size: file.size,
      mime_type: file.type,
      module: module,
      reference_id: referenceId,
      tags: tags,
      is_public: isPublic,
      metadata: {
        uploaded_by: user.email,
        uploaded_at: new Date().toISOString()
      }
    });

    return Response.json({
      success: true,
      file_url: uploadResult.file_url,
      file_id: fileRecord.id,
      file_record: fileRecord
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});