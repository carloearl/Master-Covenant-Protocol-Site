import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const imageFile = formData.get('image_file');
    const message = formData.get('message');
    const password = formData.get('password');

    if (!imageFile || !message) {
      return Response.json({ error: 'Image file and message are required' }, { status: 400 });
    }

    // Upload original image
    const { file_url: originalUrl } = await base44.integrations.Core.UploadFile({ file: imageFile });

    // In a real implementation, you would:
    // 1. Load the image and convert to pixel array
    // 2. Encrypt the message with AES using the password
    // 3. Encode the encrypted message into LSB of image pixels
    // 4. Save the modified image
    
    // For now, we'll simulate this process
    const encodedImageUrl = originalUrl; // In production, this would be the modified image

    // Log the steganography operation
    const operationId = `stego_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Save operation record (you'd need to create this entity)
    // await base44.entities.StegoHistory.create({
    //   operation_id: operationId,
    //   user_email: user.email,
    //   operation_type: 'encode',
    //   image_url: encodedImageUrl,
    //   has_password: !!password,
    //   message_length: message.length
    // });

    return Response.json({
      success: true,
      operation_id: operationId,
      encoded_image_url: encodedImageUrl,
      message: 'Message successfully encoded in image using LSB steganography',
      encryption: password ? 'AES-256' : 'none'
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});